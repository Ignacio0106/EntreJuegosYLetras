import { Component, computed, inject, signal } from '@angular/core';
import { collection, deleteDoc, doc, getDocs, updateDoc, writeBatch } from 'firebase/firestore';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Nivel } from '../../../core/models/banco.model';
import { AuthService } from '../../../core/services/auth.service';
import { AvisosService } from '../../../core/services/avisos.service';
import { ConfigService } from '../../../core/services/config.service';
import { FirebaseService } from '../../../core/services/firebase.service';
import { JuegosService } from '../../../core/services/juegos.service';
import { ProgresoService } from '../../../core/services/progreso.service';

type Pestana = 'juegos' | 'lectores' | 'docentes' | 'ajustes' | 'uso';

interface Docente {
  uid: string;
  nombre: string;
  correo: string;
  rol: 'admin' | 'docente';
}

interface Solicitud {
  uid: string;
  nombre: string;
  correo: string;
  creado: number;
}

interface Lector {
  codigo: string;
  nombre: string;
  avatar: string;
  estrellas: number;
  juegos: number;
  insignias: number;
  actualizado: number;
}

@Component({
  selector: 'app-admin-panel',
  imports: [FormsModule, RouterLink],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel {
  protected readonly juegos = inject(JuegosService);
  protected readonly config = inject(ConfigService);
  protected readonly progreso = inject(ProgresoService);
  protected readonly auth = inject(AuthService);
  private readonly avisos = inject(AvisosService);
  private readonly fb = inject(FirebaseService);

  protected readonly pestana = signal<Pestana>('juegos');
  protected readonly busqueda = signal('');
  protected readonly niveles: { id: Nivel; titulo: string; ayuda: string }[] = [
    { id: 'N', titulo: 'Niñas y niños', ayuda: 'Escuela y colegio (recomendado)' },
    { id: 'M', titulo: 'Personas adultas mayores', ayuda: 'Hogares y casas de la cultura' },
    { id: 'T', titulo: 'Todo público', ayuda: 'Mezcla de todo el contenido' },
  ];

  protected readonly grupos = computed(() => {
    const q = this.busqueda().trim().toLowerCase();
    return this.juegos.categorias
      .map((cat) => ({
        cat,
        juegos: this.juegos.todos().filter(
          (j) => j.categoria === cat.id && (!q || (j.titulo + ' ' + j.habilidad).toLowerCase().includes(q))
        ),
      }))
      .filter((g) => g.juegos.length);
  });

  protected readonly usos = computed(() =>
    this.juegos
      .todos()
      .map((j) => ({ ...j, partidas: this.progreso.partidasDe(j.slug), estrellas: this.progreso.estrellasDe(j.slug) }))
      .sort((a, b) => b.partidas - a.partidas)
  );
  protected readonly totalPartidas = computed(() => this.usos().reduce((n, u) => n + u.partidas, 0));

  // ---- Lectores (niños con código). Solo con Firebase.
  protected readonly usaNube = this.fb.activo;
  protected readonly lectores = signal<Lector[]>([]);
  protected readonly cargandoLectores = signal(false);
  protected readonly errorLectores = signal('');
  protected readonly buscarLector = signal('');
  protected readonly lectoresFiltrados = computed(() => {
    const q = this.buscarLector().trim().toLowerCase();
    return this.lectores().filter((l) => !q || (l.codigo + ' ' + l.nombre).toLowerCase().includes(q));
  });

  protected abrirPestana(p: Pestana): void {
    this.pestana.set(p);
    if (p === 'lectores' && !this.lectores().length) void this.cargarLectores();
    if (p === 'docentes') void this.cargarDocentes();
  }

  protected async cargarLectores(): Promise<void> {
    if (!this.fb.db) return;
    this.cargandoLectores.set(true);
    this.errorLectores.set('');
    try {
      const snap = await getDocs(collection(this.fb.db, 'lectores'));
      const lista = snap.docs.map((d) => {
        const x = d.data();
        const juegos = Object.values((x['juegos'] ?? {}) as Record<string, { estrellas: number; partidas: number }>);
        return {
          codigo: d.id,
          nombre: x['perfil']?.nombre ?? 'Lector',
          avatar: x['perfil']?.avatar ?? '🦥',
          estrellas: juegos.reduce((n, j) => n + j.estrellas, 0),
          juegos: juegos.filter((j) => j.partidas > 0).length,
          insignias: (x['insignias'] ?? []).length,
          actualizado: (x['actualizado'] as number | undefined) ?? 0,
        } satisfies Lector;
      });
      this.lectores.set(lista.sort((a, b) => b.actualizado - a.actualizado));
    } catch (err) {
      console.error(err);
      this.errorLectores.set('No se pudo cargar la lista. Revisa que hayas publicado las reglas nuevas de Firestore.');
    } finally {
      this.cargandoLectores.set(false);
    }
  }

  // ---- Docentes y solicitudes (solo administrador).
  protected readonly docentes = signal<Docente[]>([]);
  protected readonly solicitudes = signal<Solicitud[]>([]);
  protected readonly cargandoDocentes = signal(false);
  protected readonly errorDocentes = signal('');

  protected async cargarDocentes(): Promise<void> {
    if (!this.fb.db || !this.auth.esAdmin()) return;
    this.cargandoDocentes.set(true);
    this.errorDocentes.set('');
    try {
      const [d, s] = await Promise.all([
        getDocs(collection(this.fb.db, 'docentes')),
        getDocs(collection(this.fb.db, 'solicitudes')),
      ]);
      this.docentes.set(
        d.docs
          .map((x) => ({
            uid: x.id,
            nombre: (x.data()['nombre'] as string | undefined) ?? '(sin nombre)',
            correo: (x.data()['correo'] as string | undefined) ?? '',
            // Sin campo "rol" = administrador (el primero, creado a mano en la consola).
            rol: x.data()['rol'] === 'docente' ? ('docente' as const) : ('admin' as const),
          }))
          .sort((a, b) => (a.rol === b.rol ? a.nombre.localeCompare(b.nombre) : a.rol === 'admin' ? -1 : 1))
      );
      this.solicitudes.set(
        s.docs
          .map((x) => ({
            uid: x.id,
            nombre: (x.data()['nombre'] as string | undefined) ?? '(sin nombre)',
            correo: (x.data()['correo'] as string | undefined) ?? '',
            creado: (x.data()['creado'] as number | undefined) ?? 0,
          }))
          .sort((a, b) => a.creado - b.creado)
      );
    } catch (err) {
      console.error(err);
      this.errorDocentes.set('No se pudo cargar la lista. Revisa que hayas publicado las reglas nuevas de Firestore.');
    } finally {
      this.cargandoDocentes.set(false);
    }
  }

  /** Aprobar = crear el docente con ese mismo uid y borrar la solicitud, en un solo paso. */
  protected async aprobar(s: Solicitud): Promise<void> {
    if (!this.fb.db) return;
    try {
      const lote = writeBatch(this.fb.db);
      lote.set(doc(this.fb.db, 'docentes', s.uid), { nombre: s.nombre, correo: s.correo, rol: 'docente' });
      lote.delete(doc(this.fb.db, 'solicitudes', s.uid));
      await lote.commit();
      this.avisos.toast(`${s.nombre} ya es docente`);
      await this.cargarDocentes();
    } catch {
      this.avisos.toast('No se pudo aprobar');
    }
  }

  protected async rechazar(s: Solicitud): Promise<void> {
    if (!this.fb.db) return;
    if (!confirm(`¿Rechazar la solicitud de ${s.nombre} (${s.correo})?`)) return;
    try {
      await deleteDoc(doc(this.fb.db, 'solicitudes', s.uid));
      this.solicitudes.update((l) => l.filter((x) => x.uid !== s.uid));
      this.avisos.toast('Solicitud rechazada');
    } catch {
      this.avisos.toast('No se pudo rechazar');
    }
  }

  protected async cambiarRol(d: Docente, rol: 'admin' | 'docente'): Promise<void> {
    if (!this.fb.db) return;
    const texto = rol === 'admin'
      ? `¿Dar permisos de administrador a ${d.nombre}? Podrá aprobar y quitar docentes y borrar lectores.`
      : `¿Dejar a ${d.nombre} solo como docente?`;
    if (!confirm(texto)) return;
    try {
      await updateDoc(doc(this.fb.db, 'docentes', d.uid), { rol });
      this.docentes.update((l) => l.map((x) => (x.uid === d.uid ? { ...x, rol } : x)));
      this.avisos.toast('Permisos actualizados');
    } catch {
      this.avisos.toast('No se pudo cambiar');
    }
  }

  protected async quitarDocente(d: Docente): Promise<void> {
    if (!this.fb.db) return;
    if (!confirm(`¿Quitar a ${d.nombre} (${d.correo})? Pierde el acceso al panel al instante. Su cuenta de correo sigue existiendo.`)) return;
    try {
      await deleteDoc(doc(this.fb.db, 'docentes', d.uid));
      this.docentes.update((l) => l.filter((x) => x.uid !== d.uid));
      this.avisos.toast('Docente quitado');
    } catch {
      this.avisos.toast('No se pudo quitar');
    }
  }

  protected fecha(ms: number): string {
    return ms ? new Date(ms).toLocaleString('es-CR', { dateStyle: 'short', timeStyle: 'short' }) : '—';
  }

  protected async borrarLector(l: Lector): Promise<void> {
    if (!this.fb.db) return;
    if (!confirm(`¿Borrar el código ${l.codigo} (${l.nombre})? Se pierde su avance y el código queda libre. No se puede deshacer.`)) return;
    try {
      await deleteDoc(doc(this.fb.db, 'lectores', l.codigo));
      this.lectores.update((ls) => ls.filter((x) => x.codigo !== l.codigo));
      this.avisos.toast('Código borrado');
    } catch {
      this.avisos.toast('No se pudo borrar');
    }
  }

  protected cambiarCategoria(slugs: string[], valor: boolean): void {
    this.juegos.establecerVarios(slugs, valor);
  }

  protected todos(valor: boolean): void {
    this.juegos.establecerVarios(this.juegos.todos().map((j) => j.slug), valor);
    this.avisos.toast(valor ? 'Todos los juegos están activos' : 'Todos los juegos están desactivados');
  }

  protected restablecerJuegos(): void {
    this.juegos.restablecer();
    this.avisos.toast('Juegos restablecidos');
  }

  protected borrarProgreso(): void {
    if (confirm('¿Borrar las estrellas e insignias de este equipo? No se puede deshacer.')) {
      this.progreso.reiniciar();
      this.avisos.toast('Progreso borrado');
    }
  }
}
