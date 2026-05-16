# FourPark

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-blue)](https://nodejs.org/)
[![Angular Version](https://img.shields.io/badge/angular-%3E%3D17.3.0-blue)](https://angular.io/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Project Status](https://img.shields.io/badge/status-development-blue)](https://github.com/DanielVelandia2407/fourpark)

Sistema fullstack de reservas de parqueaderos en Colombia. Los usuarios buscan parqueaderos, hacen reservas y pagan con tarjeta. Los administradores gestionan sus parqueaderos y visualizan estadísticas. Desarrollado como proyecto universitario en la Universidad Distrital Francisco José de Caldas.

---

## Tabla de Contenidos

- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Instalación y Configuración](#instalación-y-configuración)
- [Variables de Entorno](#variables-de-entorno)
- [Levantar el Proyecto](#levantar-el-proyecto)
- [Roles del Sistema](#roles-del-sistema)
- [Flujo de Reservas](#flujo-de-reservas)
- [API Endpoints](#api-endpoints)
- [Scripts Disponibles](#scripts-disponibles)
- [Autores](#autores)

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Angular 17.3, TailwindCSS 3.4, RxJS 7.8 |
| Backend | Node.js 18+, Express 4.19 |
| Base de datos | PostgreSQL 14+ |
| Auth | JWT (jsonwebtoken 9.0) + bcryptjs |
| Email | Nodemailer 6.9 (Gmail SMTP) |
| Reportes | PDFKit, ExcelJS |

---

## Estructura del Proyecto

```
fourpark/
├── src/                        ← Frontend Angular
│   └── app/
│       ├── auth/               ← Interceptor JWT
│       ├── components/         ← Componentes standalone
│       └── environments/       ← environment.ts (URL del API)
└── backend/
    └── src/
        ├── controllers/        ← Lógica de negocio por dominio
        ├── routes/             ← Definición de endpoints
        ├── middlewares/        ← Auth JWT, upload (Multer)
        ├── services/           ← Email, geocoding, PDF, Excel
        ├── config/database.js  ← Pool de conexión PostgreSQL
        └── database/
            ├── schema.sql      ← Creación de tablas
            ├── seed.sql        ← Datos iniciales
            └── init-admin.js   ← Crea usuario SuperAdmin
```

---

## Requisitos Previos

- Node.js 18 o superior
- PostgreSQL 14 o superior
- Cuenta de Gmail con [App Password](https://myaccount.google.com/apppasswords) habilitado
- Git

---

## Instalación y Configuración

**1. Clonar el repositorio**

```bash
git clone https://github.com/DanielVelandia2407/fourpark.git
cd fourpark
```

**2. Instalar dependencias**

```bash
# Frontend
npm install

# Backend
cd backend && npm install
```

**3. Configurar variables de entorno**

```bash
cp backend/.env.example backend/.env
# Editar backend/.env con tus valores (ver sección Variables de Entorno)
```

**4. Crear la base de datos**

```bash
# Desde PostgreSQL, crear la base de datos:
createdb fourpark

# O desde psql:
# CREATE DATABASE fourpark;
```

**5. Inicializar el esquema y datos**

```bash
cd backend
npm run db:schema      # Crea las tablas
npm run db:seed        # Inserta datos de ejemplo
npm run db:init-admin  # Crea el usuario SuperAdmin
```

Credenciales del SuperAdmin por defecto:
- **Usuario:** `superadmin`
- **Contraseña:** `Admin123!`

> Cambiar la contraseña inmediatamente en producción.

---

## Variables de Entorno

Archivo: `backend/.env`

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3000` |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `DB_HOST` | Host PostgreSQL | `localhost` |
| `DB_PORT` | Puerto PostgreSQL | `5432` |
| `DB_NAME` | Nombre de la base de datos | `fourpark` |
| `DB_USER` | Usuario PostgreSQL | `postgres` |
| `DB_PASSWORD` | Contraseña PostgreSQL | `tu_contraseña` |
| `DB_SSL` | Conexión SSL | `false` |
| `JWT_SECRET` | Clave secreta para firmar tokens | (cadena larga aleatoria) |
| `JWT_EXPIRES_IN` | Duración del token | `24h` |
| `SMTP_HOST` | Servidor SMTP | `smtp.gmail.com` |
| `SMTP_PORT` | Puerto SMTP | `587` |
| `SMTP_USER` | Correo Gmail | `tu_correo@gmail.com` |
| `SMTP_PASS` | App Password de Gmail | `xxxx xxxx xxxx xxxx` |
| `EMAIL_FROM` | Remitente visible | `FourPark <tu_correo@gmail.com>` |
| `FRONTEND_URL` | Origen permitido por CORS | `http://localhost:5173` |

---

## Levantar el Proyecto

**Backend** (desde `/backend`):

```bash
npm run dev   # Desarrollo con Nodemon — http://localhost:3000
npm start     # Producción
```

**Frontend** (desde la raíz):

```bash
npm start     # http://localhost:5173
```

### Desarrollo local vs. producción

El frontend apunta por defecto al backend desplegado en Render. Para desarrollar localmente, cambiar la URL en `src/environments/environment.ts`:

```ts
// Producción (por defecto)
apiUrl: 'https://fourparkscolombia.onrender.com/api'

// Desarrollo local
apiUrl: 'http://localhost:3000/api'
```

---

## Roles del Sistema

| Rol | Acceso |
|-----|--------|
| `SuperAdministrador` | Todo el sistema: usuarios, parqueaderos, estadísticas globales |
| `Administrador` | Sus propios parqueaderos y las reservas asociadas |
| `Usuario` | Sus reservas y su perfil |

---

## Flujo de Reservas

```
Pendiente ──► (check-in)   ──► En curso
          └─► (cancelar)   ──► Cancelada

En curso  ──► (check-out)  ──► Finalizada
```

El checkout calcula automáticamente el tiempo extra y aplica un reembolso del 50% por tiempo no utilizado.

---

## API Endpoints

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/login` | Iniciar sesión | No |
| POST | `/api/register` | Registrar usuario | No |
| POST | `/api/request-token` | Solicitar token de recuperación/verificación | No |
| GET | `/api/parkings` | Listar parqueaderos disponibles | No |
| GET | `/api/user` | Datos del usuario autenticado | JWT |
| POST | `/api/reservations` | Crear reserva | JWT |
| PUT | `/api/check-in/:id` | Registrar check-in | JWT + Admin |
| PUT | `/api/check-out/:id` | Registrar check-out y generar factura | JWT + Admin |
| POST | `/api/statistics-admin` | Estadísticas del administrador | JWT + Admin |
| POST | `/api/statistics-pdf` | Reporte PDF global | JWT + SuperAdmin |

---

## Scripts Disponibles

### Backend (`/backend`)

```bash
npm run dev            # Servidor con recarga automática (Nodemon)
npm start              # Servidor de producción
npm run db:schema      # Crear tablas
npm run db:seed        # Insertar datos de ejemplo
npm run db:init-admin  # Crear usuario SuperAdmin
```

### Frontend (raíz)

```bash
npm start        # Servidor de desarrollo
npm run build    # Build de producción
npm test         # Tests unitarios con Karma
```

---

## Autores

**Daniel Felipe Velandia Jerez**
- GitHub: [@DanielVelandia2407](https://github.com/DanielVelandia2407)

---

## Licencia

MIT — ver [LICENSE](LICENSE) para más detalles.
