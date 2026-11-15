import { Component } from '@angular/core';

/** Lola, la perezosa lectora: la mascota del proyecto (leer a tu ritmo también es leer). */
@Component({
  selector: 'app-mascota',
  template: `
    <svg viewBox="0 0 220 240" role="img" aria-label="Lola, una perezosa con lentes que lee un libro abierto">
      <path d="M6 218 Q110 192 214 218" stroke="#8a5a33" stroke-width="13" stroke-linecap="round" fill="none"/>
      <ellipse cx="26" cy="206" rx="15" ry="7" fill="#7fe0b5" transform="rotate(-25 26 206)"/>
      <ellipse cx="196" cy="206" rx="15" ry="7" fill="#7fe0b5" transform="rotate(25 196 206)"/>
      <ellipse cx="110" cy="160" rx="62" ry="58" fill="#b98a5b"/>
      <ellipse cx="110" cy="172" rx="42" ry="38" fill="#e9d2ab"/>
      <ellipse cx="74" cy="208" rx="20" ry="11" fill="#a47547"/>
      <ellipse cx="146" cy="208" rx="20" ry="11" fill="#a47547"/>
      <ellipse cx="110" cy="84" rx="56" ry="46" fill="#c99c69"/>
      <path d="M62 84 Q110 50 158 84 Q158 122 110 127 Q62 122 62 84Z" fill="#f3e3c3"/>
      <ellipse cx="88" cy="88" rx="14" ry="10" fill="#6e4a2c" transform="rotate(-20 88 88)"/>
      <ellipse cx="132" cy="88" rx="14" ry="10" fill="#6e4a2c" transform="rotate(20 132 88)"/>
      <g class="ojos">
        <circle cx="88" cy="88" r="5.5" fill="#fff"/><circle cx="132" cy="88" r="5.5" fill="#fff"/>
        <circle cx="89" cy="90" r="3" fill="#23324a"/><circle cx="133" cy="90" r="3" fill="#23324a"/>
      </g>
      <circle cx="88" cy="88" r="17" fill="rgba(255,255,255,.25)" stroke="#23324a" stroke-width="3"/>
      <circle cx="132" cy="88" r="17" fill="rgba(255,255,255,.25)" stroke="#23324a" stroke-width="3"/>
      <path d="M105 88 H115" stroke="#23324a" stroke-width="3"/>
      <ellipse cx="110" cy="106" rx="6" ry="4.5" fill="#4a2f1a"/>
      <path d="M97 115 Q110 126 123 115" stroke="#4a2f1a" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="71" cy="109" r="6" fill="#ff8a7a" opacity=".55"/><circle cx="149" cy="109" r="6" fill="#ff8a7a" opacity=".55"/>
      <path d="M46 142 Q78 132 110 146 Q142 132 174 142 V200 Q142 190 110 203 Q78 190 46 200Z" fill="#ff8a7a" stroke="#23324a" stroke-width="3" stroke-linejoin="round"/>
      <path d="M52 143 Q80 135 108 148 V198 Q80 188 52 196Z" fill="#fff"/>
      <path d="M112 148 Q140 135 168 143 V196 Q140 188 112 198Z" fill="#fffaf0"/>
      <path d="M110 146 V203" stroke="#23324a" stroke-width="3"/>
      <g stroke="#9db6c8" stroke-width="3" stroke-linecap="round">
        <path d="M62 156 Q80 152 98 160"/><path d="M62 168 Q80 164 98 172"/><path d="M62 180 Q80 176 98 184"/>
        <path d="M122 160 Q140 152 158 156"/><path d="M122 172 Q140 164 158 168"/><path d="M122 184 Q140 176 158 180"/>
      </g>
      <ellipse cx="46" cy="172" rx="14" ry="22" fill="#b98a5b"/>
      <ellipse cx="174" cy="172" rx="14" ry="22" fill="#b98a5b"/>
      <path d="M40 188 l-2 10 M47 190 l0 10 M54 188 l3 9 M166 188 l-3 9 M173 190 l0 10 M180 188 l2 10" stroke="#e9d2ab" stroke-width="3" stroke-linecap="round"/>
    </svg>
  `,
  styles: `
    :host { display: block; }
    svg { width: 100%; height: auto; display: block; }
    .ojos { transform-origin: 110px 89px; animation: parpadeo 5s infinite; }
    @keyframes parpadeo { 0%, 92%, 100% { transform: scaleY(1); } 95% { transform: scaleY(.1); } }
  `,
})
export class Mascota {}
