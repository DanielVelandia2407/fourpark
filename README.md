# FourPark

Sistema de reservas de parqueaderos con gestión de roles, pagos y reportes.

## Descripción

FourPark es una plataforma para la gestión de parqueaderos en Colombia, desarrollada como proyecto universitario. Permite a los usuarios buscar, reservar y pagar por espacios de estacionamiento. Los administradores gestionan sus parqueaderos y ven estadísticas. El SuperAdministrador gestiona todo el sistema. El flujo principal es: buscar parqueaderos, hacer reservas, check-in y check-out. Está desarrollado como fullstack con Angular para el frontend y Node.js + Express para el backend.

## Stack tecnológico

### Backend

| Tecnología | Versión |
|------------|---------|
| express | 4.19.2 |
| pg | 8.11.5 |
| jsonwebtoken | 9.0.2 |
| bcryptjs | 2.4.3 |
| nodemailer | 6.9.13 |
| multer | 1.4.5-lts.1 |
| joi | 17.13.1 |
| helmet | 7.1.0 |
| morgan | 1.10.0 |
| express-rate-limit | 7.3.1 |
| cors | 2.8.5 |
| dotenv | 16.4.5 |
| pdfkit | 0.15.0 |
| exceljs | 4.4.0 |

### Frontend

| Tecnología | Versión |
|------------|---------|
| @angular/core | 17.3.0 |
| @angular/router | 17.3.0 |
| rxjs | 7.8.0 |
| tailwindcss | 3.4.3 |
| flowbite | 2.3.0 |
| chart.js | 4.4.3 |
| apexcharts | 3.49.1 |
| sweetalert2 | 11.11.0 |
| @angular/google-maps | 17.3.8 |
| jwt-decode | 4.0.0 |
| @fortawesome/fontawesome-free | 6.5.2 |

## Requisitos

- Node.js 18 o superior
- PostgreSQL 14 o superior
- Cuenta SMTP de Gmail con App Password

## Instalación

1. Clonar el repositorio
2. Instalar dependencias del frontend (raíz del proyecto):
   ```bash
   npm install
   ```
3. Instalar dependencias del backend:
   ```bash
   cd backend && npm install
   ```
4. Copiar el archivo de variables de entorno y completarlo:
   ```bash
   cp backend/.env.example backend/.env
   ```
5. Crear la base de datos PostgreSQL con el nombre `fourpark`
6. Inicializar el esquema y los datos:
   ```bash
   cd backend
   npm run db:schema
   npm run db:seed
   npm run db:init-admin
   ```

Para correr el backend:
```bash
cd backend
npm run dev
```

Para correr el frontend:
```bash
npm start
```

## Variables de entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| PORT | Puerto del servidor | 3000 |
| NODE_ENV | Entorno de ejecución | development |
| DB_HOST | Dirección del servidor PostgreSQL | localhost |
| DB_PORT | Puerto del servidor PostgreSQL | 5432 |
| DB_NAME | Nombre de la base de datos | fourpark |
| DB_USER | Usuario de la base de datos | postgres |
| DB_PASSWORD | Contraseña del usuario | tu_contraseña_aqui |
| DB_SSL | Usar conexión SSL | false |
| JWT_SECRET | Clave secreta para JWT | cambia_esto_por_una_clave_secreta_larga_y_aleatoria |
| JWT_EXPIRES_IN | Tiempo de expiración del token | 24h |
| SMTP_HOST | Servidor SMTP | smtp.gmail.com |
| SMTP_PORT | Puerto SMTP | 587 |
| SMTP_USER | Correo de la cuenta SMTP | tu_correo@gmail.com |
| SMTP_PASS | Contraseña de la cuenta SMTP | tu_app_password |
| EMAIL_FROM | Remitente de los correos | "FourPark <tu_correo@gmail.com>" |
| FRONTEND_URL | URL del frontend para CORS | http://localhost:5173 |

## Estructura del proyecto

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

## Roles del sistema

| Rol | Permisos |
|-----|--------|
| SuperAdministrador | Todo el sistema |
| Administrador | Sus propios parqueaderos y reservas asociadas |
| Usuario | Sus reservas y perfil |

## Modelo de datos

- **users**: Usuarios del sistema con datos personales y rol
- **user_controllers**: Control de cuentas (bloqueos, intentos fallidos)
- **cards**: Tarjetas de pago asociadas a usuarios
- **tokens**: Tokens temporales para recuperación de contraseña y verificación de correo
- **parkings**: Parqueaderos con ubicación, capacidad y horario
- **parking_controllers**: Configuración de capacidad y tarifas por tipo de vehículo
- **reservations**: Reservas de parqueaderos con fechas y estado
- **invoices**: Facturas con montos calculados por reserva
- **records**: Registros de auditoría de acciones del sistema

## Endpoints principales

| Método | Ruta | Autenticación |
|--------|------|-------------|
| POST | /api/login | No |
| POST | /api/register | No |
| POST | /api/request-token | No |
| GET  | /api/parkings | No |
| GET  | /api/user | JWT |
| POST | /api/reservations | JWT |
| PUT  | /api/check-in/:id | JWT + Admin |
| PUT  | /api/check-out/:id | JWT + Admin |
| POST | /api/statistics-admin | JWT + Admin |
| POST | /api/statistics-pdf | JWT + SuperAdmin |

## Flujo de estados de reserva

```
Pendiente → (check-in)  → En curso
          → (cancelar)  → Cancelada
En curso  → (check-out) → Finalizada
```

El checkout calcula automáticamente el tiempo extra consumido y aplica un reembolso del 50% por el tiempo reservado no utilizado.

## Scripts disponibles

### Backend

| Comando | Descripción |
|---------|-------------|
| start | Iniciar servidor en producción |
| dev | Iniciar servidor con nodemon para desarrollo |
| db:schema | Crear tablas en la base de datos |
| db:seed | Insertar datos iniciales |
| db:init-admin | Crear usuario SuperAdmin |

### Frontend

| Comando | Descripción |
|---------|-------------|
| start | Levantar servidor de desarrollo |
| build | Compilar para producción |
| watch | Compilar en modo watch |
| test | Ejecutar tests unitarios |

## Autores

Daniel Felipe Velandia Jerez
```