/**
 * Configuración de Firebase.
 * Pega aquí los valores de tu proyecto: Consola de Firebase → ⚙ Configuración del proyecto →
 * "Tus apps" → app web → "firebaseConfig". Estos valores NO son secretos (la seguridad la dan
 * las reglas de firestore.rules), así que es normal que queden en el repositorio.
 *
 * Mientras digan 'TU_...', la app funciona sin Firebase (todo se guarda solo en el navegador).
 */
export const firebaseConfig = {
  apiKey: "AIzaSyC9jgTBggepfYqTrpjMh-lAsFIt6zDnu1o",
  authDomain: "juego-de-leer.firebaseapp.com",
  projectId: "juego-de-leer",
  storageBucket: "juego-de-leer.firebasestorage.app",
  messagingSenderId: "979605379275",
  appId: "1:979605379275:web:5ca4c26c77358115d7a34e"
};

export const firebaseConfigurado = !firebaseConfig.apiKey.startsWith('TU_');
