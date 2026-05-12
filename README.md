# FourPark 🚗

[![Build Status](https://img.shields.io/badge/build-pending-yellow)](https://github.com/danielvelandia/fourpark)
[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com/danielvelandia/fourpark/blob/main/LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-blue)](https://nodejs.org/)
[![Angular Version](https://img.shields.io/badge/angular-%3E%3D17.3.0-blue)](https://angular.io/)
[![Project Status](https://img.shields.io/badge/status-development-blue)](https://github.com/danielvelandia/fourpark)

## Descripción

Sistema de reservas de parqueaderos en Colombia desarrollado como proyecto universitario fullstack. Permite a los usuarios buscar, reservar y pagar por espacios de estacionamiento, mientras los administradores gestionan sus parqueaderos y visualizan estadísticas. Implementado con tecnologías modernas para una experiencia de usuario eficiente y robusta.

## Tabla de Contenidos

- [Sobre el Proyecto](#sobre-el-proyecto)
- [Características Principales](#características-principales)
- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Roles del Sistema](#roles-del-sistema)
- [API Endpoints](#api-endpoints)
- [Scripts Disponibles](#scripts-disponibles)
- [Testing](#testing)
- [Roadmap](#roadmap)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)
- [Autores](#autores)
- [Agradecimientos](#agradecimientos)

## Sobre el Proyecto

FourPark es una plataforma de gestión de parqueaderos desarrollada como proyecto académico de la Universidad Distrital Francisco José de Caldas. El sistema resuelve el problema de la falta de organización en la reserva de espacios de estacionamiento en ciudades colombianas, ofreciendo una solución digital que mejora la experiencia del usuario y optimiza la gestión de parqueaderos.

### Objetivos

- Facilitar la reserva y gestión de espacios de estacionamiento
- Implementar un sistema de pagos seguro y eficiente
- Proporcionar herramientas de análisis y estadísticas para administradores
- Crear una experiencia de usuario intuitiva y accesible

## Características Principales

- 🎯 **Sistema de Reservas Inteligentes** - Permite a los usuarios buscar y reservar parqueaderos disponibles
- 💳 **Pago Seguro por Tarjeta** - Integración con métodos de pago digitales
- 📊 **Dashboard Administrativo** - Estadísticas y reportes detallados para administradores
- 📍 **Geolocalización** - Sistema de ubicación precisa de parqueaderos
- 🔐 **Gestión de Usuarios y Roles** - Control de acceso basado en permisos
- 📈 **Reportes y Estadísticas** - Generación de informes en PDF y Excel

## Stack Tecnológico

### Backend

| Tecnología | Versión |
|------------|---------|
| Node.js    | 18+     |
| Express    | 4.19.2  |
| PostgreSQL | 14+     |
| JWT        | 9.0.2   |
| Bcrypt     | 2.4.3   |
| Nodemailer | 6.9.13  |

### Frontend

| Tecnología | Versión |
|------------|---------|
| Angular    | 17.3.0  |
| RxJS       | 7.8.0   |
| TailwindCSS| 3.4.3   |
| SweetAlert2| 11.11.0 |

### Base de Datos

| Tecnología | Versión |
|------------|---------|
| PostgreSQL | 14+     |

### Herramientas de Desarrollo

| Tecnología | Versión |
|------------|---------|
| Nodemon    | 3.0.1   |
| TypeScript | 5.4.2   |
| ESLint     | 8.56.0  |
| Jest       | 29.7.0  |

## Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Base de Datos │
│   (Angular)     │    │   (Node.js)     │    │   (PostgreSQL)  │
│                 │    │                 │    │                 │
│  ┌───────────┐  │    │  ┌───────────┐  │    │  ┌───────────┐  │
│  │   UI      │  │    │  │   API     │  │    │  │   Tablas  │  │
│  │  Component│  │    │  │  Routes   │  │    │  │  Datos    │  │
│  │  Services │  │    │  │  Middlewares│  │    │  │  Indices  │  │
│  └───────────┘  │    │  └───────────┘  │    │  └───────────┘  │
│                 │    │                 │    │                 │
│  ┌───────────┐  │    │  ┌───────────┐  │    │  ┌───────────┐  │
│  │  HTTP     │  │    │  │   DB      │  │    │  │   Queries │  │
│  │  Requests │  │    │  │  Pool     │  │    │  │  Triggers │  │
│  └───────────┘  │    │  └───────────┘  │    │  └───────────┘  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Estructura del Proyecto

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

## Requisitos Previos

- Node.js versión 18 o superior
- PostgreSQL versión 14 o superior
- Cuenta SMTP de Gmail con App Password
- Git

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/danielvelandia/fourpark.git
   cd fourpark
   ```

2. Instalar dependencias del frontend:
   ```bash
   npm install
   ```

3. Instalar dependencias del backend:
   ```bash
   cd backend && npm install
   ```

4. Copiar y configurar el archivo de variables de entorno:
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

## Configuración

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

## Uso

### Levantar el Backend

```bash
cd backend
npm run dev
```

### Levantar el Frontend

```bash
npm start
```

## Roles del Sistema

| Rol | Permisos |
|-----|--------|
| **SuperAdministrador** | Todo el sistema |
| **Administrador** | Sus propios parqueaderos y reservas asociadas |
| **Usuario** | Sus reservas y perfil |

## API Endpoints

| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|-----|
| POST | `/api/login` | Iniciar sesión | No |
| POST | `/api/register` | Registrar nuevo usuario | No |
| POST | `/api/request-token` | Solicitar token para recuperación/verificación | No |
| GET | `/api/parkings` | Listar parqueaderos disponibles | No |
| GET | `/api/user` | Obtener información del usuario autenticado | JWT |
| POST | `/api/reservations` | Crear nueva reserva | JWT |
| PUT | `/api/check-in/:id` | Registrar check-in de reserva | JWT + Admin |
| PUT | `/api/check-out/:id` | Registrar check-out de reserva | JWT + Admin |
| POST | `/api/statistics-admin` | Generar estadísticas para administradores | JWT + Admin |
| POST | `/api/statistics-pdf` | Generar reporte PDF de estadísticas | JWT + SuperAdmin |

## Scripts Disponibles

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

## Testing

<!-- TODO: completar -->

## Roadmap

- [ ] Implementar sistema de recompensas y fidelización
- [ ] Agregar integración con mapas interactivos
- [ ] Desarrollar aplicación móvil híbrida
- [ ] Implementar sistema de comentarios y calificaciones
- [ ] Agregar funcionalidad de búsqueda avanzada por filtros

## Contribuciones

Este proyecto es desarrollado como parte del trabajo académico de la Universidad Distrital. Aunque es un proyecto universitario, se aceptan contribuciones y feedback para mejorar la calidad del código y funcionalidades. Si deseas contribuir, por favor abre un issue o pull request.

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más información.

## Autores

Daniel Felipe Velandia Jerez

- GitHub: [@danielvelandia](https://github.com/danielvelandia)
- LinkedIn: [LinkedIn Profile](https://linkedin.com/in/daniel-velandia)

## Agradecimientos

Agradecemos a la Universidad Distrital Francisco José de Caldas por proporcionar el marco académico para el desarrollo de este proyecto. También agradecemos a los profesores y tutores que han guiado el desarrollo del sistema.
```