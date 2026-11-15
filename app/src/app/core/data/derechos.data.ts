export interface Derecho {
  id: string;
  icono: string;
  titulo: string;
  texto: string;
}

export const DERECHOS_INTRO =
  'Tienes derecho a imaginar, a preguntar y a elegir las historias que te gustan.';

export const DERECHOS: Derecho[] = [
  { id: 'elegir', icono: '📚', titulo: 'Elegir mis libros',
    texto: 'Yo escojo la historia que quiero leer, sea de miedo, de risa o de animales.' },
  { id: 'ritmo', icono: '🦥', titulo: 'Leer a mi ritmo',
    texto: 'Puedo leer despacio, repetir y volver a empezar. Nadie me apura.' },
  { id: 'imaginar', icono: '🌈', titulo: 'Imaginar',
    texto: 'Mientras leo puedo inventar caras, voces y mundos nuevos.' },
  { id: 'preguntar', icono: '🙋', titulo: 'Preguntar',
    texto: 'Si no entiendo una palabra, pregunto. Preguntar también es leer.' },
];
