# FourPark — Contexto del proyecto

Sistema de reservas de parqueaderos en Colombia. Usuarios buscan parqueaderos, hacen reservas y pagan con tarjeta. Los administradores gestionan parqueaderos y ven estadísticas. El SuperAdministrador gestiona todo el sistema.

## Estructura del repositorio

```
fourpark/
├── src/                        ← Frontend Angular
├── backend/                    ← Backend Node.js + Express + PostgreSQL
│   └── src/
│       ├── controllers/        ← Lógica de negocio por dominio
│       ├── routes/             ← Definición de endpoints
│       ├── middlewares/        ← JWT auth, upload (multer)
│       ├── services/           ← Email, geocoding, PDF, Excel
│       ├── config/database.js  ← Pool PostgreSQL (pg)
│       └── database/           ← schema.sql, seed.sql, init-admin.js
└── CLAUDE.md
```

## Comandos del frontend (Angular)

```bash
npm start           # Levanta en http://localhost:5173
npm run build       # Build de producción
npm test            # Tests unitarios con Karma
```

## Comandos del backend (desde /backend)

```bash
npm run dev         # Nodemon en http://localhost:3000
npm start           # Producción

# Base de datos (requiere .env configurado)
npm run db:schema   # Crear tablas
npm run db:seed     # Insertar datos iniciales
npm run db:init-admin  # Crear usuario SuperAdmin (superadmin / Admin123!)
```

## Variables de entorno del backend

Copiar `backend/.env.example` → `backend/.env` y completar:

- `DB_HOST / DB_PORT / DB_NAME / DB_USER / DB_PASSWORD` — PostgreSQL
- `JWT_SECRET` — clave secreta larga y aleatoria
- `SMTP_USER / SMTP_PASS` — cuenta Gmail con App Password
- `FRONTEND_URL` — origen permitido por CORS (ej. `http://localhost:5173`)

## API base URL

- Frontend apunta a: `https://fourparkscolombia.onrender.com/api`
- Backend local corre en: `http://localhost:3000/api`
- Para desarrollo local, cambiar en `src/environments/environment.ts`

## Roles de usuario

| Rol | Acceso |
|---|---|
| `SuperAdministrador` | Todo el sistema |
| `Administrador` | Sus propios parqueaderos y reservas asociadas |
| `Usuario` | Sus reservas y perfil |

## Modelo de datos (tablas principales)

`users` → `user_controllers` (bloqueos), `cards` (pago), `tokens` (reset/verify)
`parkings` → `parking_controllers` (capacidad y tarifa por vehículo)
`reservations` → `invoices` (factura con montos calculados en checkout)
`records` — log de auditoría (login, acciones admin)

## Endpoints principales

| Método | Ruta | Auth |
|---|---|---|
| POST | `/api/login` | No |
| POST | `/api/register` | No |
| POST | `/api/request-token` | No |
| GET  | `/api/parkings` | No |
| GET  | `/api/user` | JWT |
| POST | `/api/reservations` | JWT |
| PUT  | `/api/check-in/:id` | JWT + Admin |
| PUT  | `/api/check-out/:id` | JWT + Admin |
| POST | `/api/statistics-admin` | JWT + Admin |
| POST | `/api/statistics-pdf` | JWT + SuperAdmin |

## Convenciones de código

- **Backend:** CommonJS (`require`), async/await, validaciones con Joi en cada controller
- **Frontend:** Angular standalone components, `HttpClient` con interceptor JWT en `src/app/auth/interceptor.ts`
- **Imágenes:** subidas a `backend/uploads/parkings/`, servidas en `/uploads/`
- **Contraseñas:** hasheadas con bcryptjs salt rounds 12
- **Errores:** siempre `{ error: "mensaje en español" }` con HTTP status apropiado

## Flujo de estado de reservas

```
Pendiente → (check-in)  → En curso
          → (cancelar)  → Cancelada
En curso  → (check-out) → Finalizada
```

El checkout calcula automáticamente tiempo extra y reembolso del 50% por tiempo no utilizado.
