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
