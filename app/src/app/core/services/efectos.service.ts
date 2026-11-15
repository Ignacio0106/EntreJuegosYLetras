import { Injectable, signal } from '@angular/core';

type Onda = OscillatorType;

/** Sonidos (WebAudio, sin archivos) y confeti. */
@Injectable({ providedIn: 'root' })
export class EfectosService {
  readonly sonidoActivo = signal(localStorage.getItem('jdl-sonido') !== '0');
  private audio: AudioContext | null = null;

  alternarSonido(): void {
    const v = !this.sonidoActivo();
    this.sonidoActivo.set(v);
    localStorage.setItem('jdl-sonido', v ? '1' : '0');
  }

  private ctx(): AudioContext | null {
    if (!this.sonidoActivo()) return null;
    if (!this.audio) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      this.audio = new AC();
    }
    if (this.audio.state === 'suspended') void this.audio.resume();
    return this.audio;
  }

  private tono(freq: number, dur: number, tipo: Onda = 'sine', delay = 0, vol = 0.2): void {
    const c = this.ctx();
    if (!c) return;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = tipo;
    o.frequency.value = freq;
    const t0 = c.currentTime + delay;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g);
    g.connect(c.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.05);
  }

  correcto(): void { this.tono(523, 0.18, 'triangle'); this.tono(784, 0.28, 'triangle', 0.14); }
  error(): void { this.tono(220, 0.28, 'sawtooth', 0, 0.1); this.tono(180, 0.3, 'sawtooth', 0.18, 0.1); }
  click(): void { this.tono(660, 0.09, 'sine', 0, 0.1); }
  giro(): void { this.tono(440, 0.07, 'square', 0, 0.06); }
  tic(): void { this.tono(880, 0.06, 'sine', 0, 0.09); }
  aplausos(): void {
    const c = this.ctx();
    if (!c) return;
    [0, 0.12, 0.24, 0.36].forEach((d) => {
      const buf = c.createBuffer(1, Math.floor(c.sampleRate * 0.06), c.sampleRate);
      const datos = buf.getChannelData(0);
      for (let i = 0; i < datos.length; i++) {
        datos[i] = (Math.random() * 2 - 1) * Math.exp(-i / (c.sampleRate * 0.02));
      }
      const src = c.createBufferSource();
      const g = c.createGain();
      src.buffer = buf;
      g.gain.value = 0.22;
      src.connect(g);
      g.connect(c.destination);
      src.start(c.currentTime + d);
    });
    this.tono(659, 0.4, 'triangle', 0.45, 0.1);
    this.tono(880, 0.5, 'triangle', 0.55, 0.1);
  }

  confeti(cantidad = 60): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cont = document.createElement('div');
    cont.setAttribute('aria-hidden', 'true');
    cont.style.cssText = 'position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:300';
    const colores = ['#FF8A7A', '#7FE0B5', '#5BC0F8', '#FFC93C', '#B79CFF'];
    for (let i = 0; i < cantidad; i++) {
      const p = document.createElement('span');
      const w = 7 + Math.random() * 8;
      p.style.cssText =
        `position:absolute;top:-20px;left:${Math.random() * 100}vw;width:${w}px;height:${w * 1.4}px;` +
        `background:${colores[i % colores.length]};border-radius:${i % 3 === 0 ? '50%' : '3px'}`;
      p.animate(
        [
          { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
          { transform: `translate(${(Math.random() - 0.5) * 160}px, 105vh) rotate(${Math.random() * 720}deg)`, opacity: 0.9 },
        ],
        { duration: 2400 + Math.random() * 2200, easing: 'cubic-bezier(.3,.6,.5,1)', fill: 'forwards' }
      );
      cont.appendChild(p);
    }
    document.body.appendChild(cont);
    setTimeout(() => cont.remove(), 5200);
  }
}
