# Alivia - La paz de saber que no olvidarás nada

Aplicación web y móvil para el manejo inteligente de recordatorios de la vida adulta: hogar, vehículo, salud, finanzas, familia y mascotas.

**Proyecto universitario** — Gestión de Proyectos, UPB.

---

## Estructura del proyecto

```
vida-adulto-app/
├── backend/                    # Servidor Node.js + Express
│   ├── src/
│   │   ├── server.js           # Entry point del servidor (puerto 3000)
│   │   ├── config/
│   │   │   ├── database.js     # Conexión a Supabase vía HTTP
│   │   │   ├── seed.js         # Datos iniciales (7 módulos + categorías)
│   │   │   └── migrate.js      # Migraciones de base de datos
│   │   ├── controllers/
│   │   │   ├── authController.js      # Registro, login, JWT, perfil
│   │   │   ├── moduleController.js    # CRUD módulos, activar/desactivar premium
│   │   │   └── reminderController.js  # CRUD recordatorios
│   │   ├── middleware/
│   │   │   └── auth.js         # Middleware de autenticación JWT
│   │   ├── routes/
│   │   │   ├── auth.js         # Rutas: /api/auth/*
│   │   │   ├── modules.js      # Rutas: /api/modules/*
│   │   │   └── reminders.js    # Rutas: /api/reminders/*
│   │   └── services/
│   │       └── notificationService.js  # Cron de notificaciones
│   ├── supabase-schema.sql     # Schema de la base de datos
│   ├── fix-rls.sql             # Deshabilitar RLS
│   ├── test-db.js              # Script de prueba de conexión
│   ├── .env                    # Variables de entorno
│   └── package.json
│
├── web/                        # Frontend React (Vite)
│   ├── src/
│   │   ├── main.jsx            # Entry point de React
│   │   ├── App.jsx             # Rutas y ErrorBoundary
│   │   ├── index.css           # Estilos globales (~2400 líneas)
│   │   ├── components/
│   │   │   ├── AuthModal.jsx       # Modales de login/registro con partículas
│   │   │   ├── MagicBento.jsx      # Grid bento animado con partículas y glow
│   │   │   ├── MagicBento.css      # Estilos del bento grid
│   │   │   ├── Prism.jsx           # Shader WebGL de prisma (ogl)
│   │   │   ├── CardSwap.jsx        # Carousel de cards animado (gsap)
│   │   │   ├── CreateReminderModal.jsx  # Modal de crear recordatorio
│   │   │   ├── ReminderCard.jsx    # Tarjeta de recordatorio
│   │   │   ├── Sidebar.jsx         # Barra lateral de navegación
│   │   │   └── Icons.jsx           # Iconos SVG (20+ iconos)
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx     # Página principal (hero, charts, testimonials)
│   │   │   ├── DashboardPage.jsx   # Panel principal con módulos y recordatorios
│   │   │   ├── ModulePage.jsx      # Página de módulo individual
│   │   │   ├── PaymentPage.jsx     # Pasarela de pagos con orbs animados
│   │   │   ├── LoginPage.jsx       # Página de login
│   │   │   └── RegisterPage.jsx    # Página de registro
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Contexto de autenticación
│   │   ├── services/
│   │   │   └── api.js              # Servicio API (fetch con JWT)
│   │   └── data/
│   │       └── templates.js        # Colores y plantillas por módulo
│   ├── public/                     # Imágenes estáticas (logos)
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── mobile/                     # App React Native (Expo)
│   ├── src/
│   │   ├── screens/
│   │   │   ├── LoginScreen.js
│   │   │   ├── RegisterScreen.js
│   │   │   ├── HomeScreen.js
│   │   │   ├── ModuleDetailScreen.js
│   │   │   └── CreateReminderScreen.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   └── services/
│   │       └── api.js
│   ├── App.js
│   └── package.json
│
├── package.json                # Package root
├── LOGOTRANS.png               # Logo principal
├── LOGO1.png, LOGO2.png        # Variantes del logo
├── LOGOPESTAÑA.png             # Logo para favicon
└── FONDO2BG-removebg-preview.png  # Logo del sidebar
```

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| **Frontend Web** | React 18 + Vite, React Router, CSS puro |
| **Frontend Móvil** | React Native (Expo) |
| **Backend** | Node.js + Express |
| **Base de datos** | Supabase PostgreSQL |
| **Autenticación** | JWT (JSON Web Tokens) |
| **Animaciones** | GSAP, Canvas API, WebGL (ogl) |
| **Gráficos** | SVG animados con CSS |

---

## Modelo freemium

| Módulo | Precio |
|--------|--------|
| Hogar, Vehículo, Familia | **Gratis** |
| Salud, Finanzas, Mascotas, General | **Premium — $9.99** |

---

## Cómo correr el proyecto

### Requisitos previos

- **Node.js** v18 o superior
- **npm** v9 o superior
- Cuenta en [Supabase](https://supabase.com) (ya configurada con el proyecto `nqywjpaomprykthcbsqn`)

### 1. Clonar el repositorio

```bash
git clone https://github.com/AndresFMV22/GESTION_DE_PROYECTOS.git
cd GESTION_DE_PROYECTOS/vida-adulto-app
```

### 2. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 3. Configurar variables de entorno del backend

El archivo `backend/.env` ya viene configurado. Contiene:

```env
SUPABASE_URL=https://nqywjpaomprykthcbsqn.supabase.co
SUPABASE_ANON_KEY=sb_publishable_7GC7TYNWEj1of0fzJ4yCFA_ohcWvAdH
SUPABASE_DB_PASSWORD=Gestiondeproyectos1
JWT_SECRET=alivia_jwt_secret_2026
PORT=3000
```

### 4. Crear las tablas en Supabase

1. Ir a [Supabase Dashboard](https://supabase.com/dashboard)
2. Seleccionar el proyecto `nqywjpaomprykthcbsqn`
3. Ir a **SQL Editor**
4. Pegar el contenido de `backend/supabase-schema.sql` y ejecutar
5. Pegar el contenido de `backend/fix-rls.sql` y ejecutar (deshabilita RLS)

### 5. Sembrar datos iniciales

```bash
node src/config/seed.js
```

Esto crea los 7 módulos y sus categorías.

### 6. Iniciar el backend

```bash
node src/server.js
```

El servidor corre en `http://localhost:3000`. Verificar con:

```bash
curl http://localhost:3000/api/health
```

### 7. Instalar dependencias del frontend web

En otra terminal:

```bash
cd web
npm install
```

### 8. Iniciar el frontend web

```bash
npx vite
```

El frontend corre en `http://localhost:5173`.

### 9. (Opcional) Iniciar la app móvil

```bash
cd mobile
npm install
npx expo start
```

---

## Base de datos

### Tablas

| Tabla | Descripción |
|-------|------------|
| `users` | Usuarios registrados |
| `modules` | 7 módulos (hogar, vehículo, salud, finanzas, familia, mascotas, general) |
| `user_modules` | Relación usuario-módulo (activos e inactivos) |
| `categories` | Categorías por módulo |
| `reminders` | Recordatorios de los usuarios |
| `reminder_logs` | Historial de notificaciones enviadas |

### API Endpoints

| Método | Ruta | Descripción |
|--------|------|------------|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/profile` | Obtener perfil |
| GET | `/api/modules` | Listar módulos |
| POST | `/api/modules/:id/toggle` | Activar/desactivar módulo |
| POST | `/api/modules/:id/activate-premium` | Activar módulo premium |
| POST | `/api/modules/:id/deactivate-premium` | Desactivar módulo premium |
| GET | `/api/modules/:id/categories` | Categorías de un módulo |
| GET | `/api/reminders` | Listar recordatorios |
| GET | `/api/reminders/upcoming` | Próximos recordatorios |
| POST | `/api/reminders` | Crear recordatorio |
| PUT | `/api/reminders/:id` | Actualizar recordatorio |
| DELETE | `/api/reminders/:id` | Eliminar recordatorio |

---

## Funcionalidades

- Landing page animada con Prism WebGL, MagicBento grid, charts SVG, testimonios
- Login y registro con modales de partículas
- Dashboard con módulos, recordatorios agrupados, stats
- Crear recordatorios con plantillas por módulo
- Pasarela de pagos con preview de tarjeta y orbs animados
- Activar/desactivar módulos premium
- Sidebar con navegación por módulos
- Notificaciones programadas (cron)
- Responsive design

---

## Universidad

**UPB** — Gestión de Proyectos — 2026
