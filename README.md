# ¡El juego de leer! — Angular (TCU)

Los 19 juegos de `ActividadesTCU` + 2 nuevos (**¿Qué personaje eres?** y **El libro misterioso**), reconstruidos en Angular 21
con la misma organización del proyecto del salón (`core/ layout/ pages/ shared/`, guards, services, signals).
**Sin base de datos:** todo el contenido está en el código (`core/data/`).

## Cómo correrlo
```bash
cd app
npm install
npm start        # http://localhost:4200
npm run build    # producción → dist/app/browser
```

## Acceso
| Rol | Cómo entra | Qué ve |
|---|---|---|
| Estudiante | No escribe nada | Solo los juegos habilitados |
| Admin (quemado) | `/login` → usuario **admin**, clave **admin123** | Todo + panel `/admin` |

Credenciales en `src/app/core/data/usuarios.data.ts`. Al estar en el código del navegador no son seguras: sirven para
separar roles en un proyecto escolar, no para proteger información.

## Panel docente (`/admin`)
- **Juegos:** activar/desactivar cada juego, por isla (categoría), todos a la vez o restablecer. Un juego apagado no aparece a estudiantes y su ruta los devuelve al inicio.
- **Ajustes:** mensaje del día (se ve en el inicio), público (niñas/niños, adultos mayores, todo público) y borrar progreso del equipo.
- **Uso:** partidas y estrellas por juego en este equipo.
Los cambios se guardan en `localStorage` del navegador (cada computadora tiene los suyos).

## Estructura
```
src/app/
  core/   models · data (banco literario, juegos, usuarios, créditos, derechos, insignias) · services · guards
  layout/ main-layout · header (perfil + medidor + insignias) · footer (créditos TCU)
  pages/  home · juegos/juego-player + games/*.game.ts (carga perezosa) · auth · admin
  shared/ audio-btn (voz) · game-shell · quiz-juego · tablero-memoria · mascota · estrellas · avisos
```
- **Agregar contenido:** edite `core/data/banco-literario.data.ts`.
- **Agregar un juego:** componente en `pages/juegos/games/` (extienda `JuegoBase`), una línea en `games.registry.ts` y una entrada en `juegos.data.ts`.
- **Créditos:** `core/data/creditos.data.ts` (universidad y escuelas aliadas).

## Diseño
Paleta sol / cielo / menta / coral, tipografías Grandstander + Lexend (incluidas con npm, funcionan sin internet),
mascota Lola la perezosa lectora, botones de lectura en voz alta (Web Speech API), medidor de lectura, insignias,
letra grande y sonidos activables.

## Firebase (usuarios, juegos activados y progreso)

Sin configurar, la app funciona igual guardando todo en el navegador (docente de respaldo: `admin` / `admin123`, ver `core/data/usuarios.data.ts`). Para guardar en la nube:

1. **Crear el proyecto**: <https://console.firebase.google.com> → *Agregar proyecto*.
2. **App web**: en el proyecto, icono `</>` → registrar app → copiar el objeto `firebaseConfig` y pegarlo en `app/src/app/core/firebase/firebase.config.ts`.
3. **Authentication** → *Comenzar* → pestaña *Sign-in method* → activar **Correo electrónico/contraseña** y **Anónimo**.
4. **Firestore Database** → *Crear base de datos* (modo producción) → pestaña *Reglas* → pegar el contenido de `app/firestore.rules` → *Publicar*.
5. **Crear docentes**:
   - Authentication → *Users* → *Add user* (correo + clave). Copiar el **UID** del usuario.
   - Firestore → *Iniciar colección* `docentes` → ID de documento = ese **UID** → campo `nombre` (string) con el nombre a mostrar.
   - Solo quien tenga ese documento entra al panel docente.
6. **Vercel / hosting**: Authentication → *Settings* → *Authorized domains* → agregar el dominio de Vercel (`xxx.vercel.app`).

Datos que se guardan: `ajustes/general` (juegos activados, mensaje del día y público; se actualiza en vivo para todos), `lectores/{código}` (perfil, estrellas e insignias de cada niño) y `docentes/{uid}`.

**Roles:**
- **Administrador:** hace todo lo del docente y además administra a los docentes (aprobar solicitudes, hacer administrador a alguien, quitar docentes) y es el único que borra códigos de lectores.
- **Docente:** entra al panel, activa o desactiva juegos, cambia el mensaje del día y el público, y ve la lista de lectores.
- **Estudiante:** no inicia sesión; usa su código de lector.

**Cómo se agrega a un docente:** la persona entra a `/login` → *Crear cuenta de docente* (nombre, correo y clave). Queda como solicitud pendiente. Un administrador la ve en **Panel → 👥 Docentes** y pulsa *Aprobar* (o *Rechazar*). Si intenta entrar antes de ser aprobada, la app le avisa que su solicitud está pendiente.

**El primer administrador se crea a mano** (una sola vez): en Authentication crea su usuario y copia el UID; en Firestore crea `docentes/{UID}` con el campo `nombre` (string). Un documento de `docentes` **sin campo `rol` cuenta como administrador**. Para crear otro administrador a mano, agrega además el campo `rol` = `admin` (o usa el botón *Hacer administrador* del panel). Rol `docente` = docente normal.

**Código de lector:** cada niño inventa su propio código (de 4 a 14 letras o números, por ejemplo `SOFI2015`) en el panel de su perfil (botón con su avatar, arriba a la derecha). Nunca se repite: si ya existe, la app le pide probar otro (el botón 🎲 le sugiere uno). Con ese código recupera su avance en cualquier dispositivo escribiéndolo en *¿Ya tienes un código?*. El medidor y las insignias solo aparecen cuando el niño ya inició (tiene código). *Cerrar sesión* deja el aparato listo para el siguiente niño en computadoras compartidas.

Los docentes ven todos los códigos en **Panel docente → 🧒 Lectores** (apodo, estrellas, juegos, última vez; con buscador); solo el administrador puede borrar un código para liberarlo. Cada código lleva una llave secreta que solo guarda el aparato del niño; así nadie puede modificar el avance de otro sin conocer el código. Si cambias `firestore.rules`, vuelve a publicarlas en la consola.
