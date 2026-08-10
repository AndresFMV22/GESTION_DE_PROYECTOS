# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es este repo

Repo de la materia **Gestión de Proyectos (UPB, semestre 6)**. Contiene dos tipos de material muy distintos:

- **Entregables del curso** — `ENTREGA1/`, `ENTREGA2/` (guías en PDF), `PRESENTACIONES/` (.pptx de clase) y documentos HTML sueltos en `GENERAL/` (`arbol.html` = árbol de problemas/objetivos/alternativas, `analisis-teorico-riesgos.html` = marco teórico + matriz de riesgos). Estos HTML son autocontenidos, sin build: se abren directo en el navegador.
- **El proyecto: `GENERAL/`** — "Alivia", una app freemium de recordatorios (backend + web + móvil). Todo el código vive ahí.

Todo está en español: textos de UI, mensajes de error de la API, mensajes de commit y documentación. Mantenerlo así.

### Advertencia sobre la estructura de carpetas

En el historial de git la app está en la raíz del repo (`backend/`, `web/`, `mobile/`); en el working tree está bajo `GENERAL/`. Hay un rename grande sin commitear. Además, `GENERAL/vida-adulto-app/` es una **copia vieja con su propio `.git`** — no editarla; las fuentes vivas son `GENERAL/backend|web|mobile`.

## Comandos

Se corren desde `GENERAL/`:

```bash
npm run install:all      # instala backend + mobile + web
npm run dev              # backend (3000) + web (5173) en paralelo
npm run dev:backend      # nodemon src/server.js
npm run dev:web          # vite
npm run dev:mobile       # expo start
npm run db:seed          # crea los 7 módulos y sus categorías
npm run db:migrate
node backend/test-db.js  # verifica la conexión a Supabase
curl http://localhost:3000/api/health
```

No hay tests, ni linter, ni CI. No inventar comandos para eso: los cambios se verifican corriendo la app.

### Base de datos

Postgres en Supabase, no hay BD local. Ejecutar `backend/supabase-schema.sql` y luego `backend/fix-rls.sql` (deshabilita RLS) en el SQL Editor de Supabase, y después `npm run db:seed`.

`backend/.env` está en el gitignore. Ojo: `.env.example` está desactualizado — `src/config/database.js` lee **`SUPABASE_SERVICE_KEY`**, no el `SUPABASE_ANON_KEY` que aparece ahí. Variables necesarias: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `JWT_SECRET`, `PORT`.

## Arquitectura

**Backend** (`GENERAL/backend`, CommonJS, Express) — routes → controllers → cliente JS de Supabase. Sin ORM ni capa de repositorios: los controllers llaman `supabase.from(...)` directamente y cada uno envuelve su cuerpo en try/catch devolviendo un `{ error }` en español. `src/config/database.js` exporta un único cliente compartido.

La autenticación es solo JWT: `middleware/auth.js` valida el header `Authorization: Bearer` y setea `req.user`. Todas las rutas menos `/api/auth/register|login` y `/api/health` pasan por ahí. RLS está apagado, así que **el aislamiento por usuario depende únicamente del `.eq('user_id', req.user.id)` en los controllers** — toda consulta nueva sobre datos de usuario debe incluirlo.

**Modelo freemium**: vive en la tabla puente `user_modules`, donde `is_active` es la única bandera de "el usuario tiene este módulo". `activatePremium` valida solo la forma de los campos de la tarjeta y no cobra nada — es una pasarela simulada para el trabajo del curso. `deactivatePremium` **borra los recordatorios del usuario para ese módulo**.

**Notificaciones** (`services/notificationService.js`) — un cron (`node-cron`) diario a las 08:00 que busca recordatorios vencidos y les hace `console.log`, insertando una fila en `notification_log` para no repetirlos. En realidad no se envía ningún correo, pese a que `nodemailer` esté como dependencia. El README llama a esa tabla `reminder_logs`; el schema y el código la llaman `notification_log`.

**Web** (`GENERAL/web`, React 18 + Vite, CSS plano) — `services/api.js` es un wrapper delgado sobre `fetch` con `API_URL = 'http://localhost:3000/api'` hardcodeado y el JWT en `localStorage`; `AuthContext.jsx` es el único estado global. `src/index.css` es una sola hoja global de ~2400 líneas: sin CSS modules, sin Tailwind. `data/templates.js` tiene `MODULE_COLORS` y `REMINDER_TEMPLATES` (los recordatorios prellenados por módulo con su `daysInterval`); de ahí salen tanto los colores como las plantillas, así que un módulo nuevo también se agrega en ese archivo.

Varios componentes de la landing son piezas visuales pesadas (`Prism.jsx` con WebGL vía `ogl`, `MagicBento.jsx` con partículas en canvas, `CardSwap.jsx` con GSAP). Son decorativos: nada más depende de ellos.

**Móvil** (`GENERAL/mobile`, Expo + React Native) — replica la estructura de la web (screens/context/services) usando `AsyncStorage` en lugar de `localStorage`. Va por detrás de la web y comparte el mismo `localhost:3000` hardcodeado, que desde un dispositivo real no alcanza el backend.
