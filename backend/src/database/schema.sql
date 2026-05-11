-- =============================================================
--   FourPark — Esquema de base de datos PostgreSQL
-- =============================================================

-- Tipos de parqueadero
CREATE TABLE IF NOT EXISTS types_parking (
  id_type_parking SERIAL PRIMARY KEY,
  name            VARCHAR(100) NOT NULL UNIQUE
);

-- Roles de usuario
CREATE TABLE IF NOT EXISTS roles (
  id_role SERIAL PRIMARY KEY,
  name    VARCHAR(50) NOT NULL UNIQUE
);

-- Ciudades
CREATE TABLE IF NOT EXISTS cities (
  id_city SERIAL PRIMARY KEY,
  name    VARCHAR(100) NOT NULL
);

-- Horarios
CREATE TABLE IF NOT EXISTS schedules (
  id_schedule   SERIAL PRIMARY KEY,
  name          VARCHAR(150) NOT NULL,
  initial_day   INTEGER,         -- 0=Domingo … 6=Sábado
  final_day     INTEGER,
  opening_time  INTEGER,         -- hora (0-23)
  closing_time  INTEGER
);

-- Usuarios
CREATE TABLE IF NOT EXISTS users (
  id_user             SERIAL PRIMARY KEY,
  first_name          VARCHAR(100) NOT NULL,
  last_name           VARCHAR(100) NOT NULL,
  user_name           VARCHAR(50)  NOT NULL UNIQUE,
  mail                VARCHAR(150) NOT NULL UNIQUE,
  password            VARCHAR(255) NOT NULL,
  identification_card VARCHAR(50)  UNIQUE,
  is_active           BOOLEAN      NOT NULL DEFAULT TRUE,
  mail_verified       BOOLEAN      NOT NULL DEFAULT FALSE,
  id_role_fk          INTEGER      REFERENCES roles(id_role),
  created_at          TIMESTAMP    DEFAULT NOW()
);

-- Control de cuenta (bloqueos, intentos fallidos)
CREATE TABLE IF NOT EXISTS user_controllers (
  id_user_controller SERIAL  PRIMARY KEY,
  is_account_blocked BOOLEAN NOT NULL DEFAULT FALSE,
  failed_attempts    INTEGER NOT NULL DEFAULT 0,
  id_user_fk         INTEGER UNIQUE REFERENCES users(id_user) ON DELETE CASCADE
);

-- Tokens temporales (recuperación de contraseña y verificación de correo)
CREATE TABLE IF NOT EXISTS tokens (
  id_token        SERIAL      PRIMARY KEY,
  token           VARCHAR(500) NOT NULL UNIQUE,
  type            VARCHAR(50)  NOT NULL, -- 'Recovery' | 'Welcome'
  expiration_date TIMESTAMP    NOT NULL,
  is_used         BOOLEAN      NOT NULL DEFAULT FALSE,
  id_user_fk      INTEGER      REFERENCES users(id_user) ON DELETE CASCADE,
  created_at      TIMESTAMP    DEFAULT NOW()
);

-- Tipos de vehículo
CREATE TABLE IF NOT EXISTS vehicles (
  id_vehicle SERIAL PRIMARY KEY,
  name       VARCHAR(50) NOT NULL UNIQUE
);

-- Parqueaderos
CREATE TABLE IF NOT EXISTS parkings (
  id_parking          SERIAL         PRIMARY KEY,
  name                VARCHAR(150)   NOT NULL,
  description         TEXT,
  address             VARCHAR(255)   NOT NULL,
  longitude           DECIMAL(11, 8) NOT NULL,
  latitude            DECIMAL(11, 8) NOT NULL,
  image_path          VARCHAR(500),
  has_loyalty_service BOOLEAN        DEFAULT FALSE,
  is_active           BOOLEAN        DEFAULT TRUE,
  id_city_fk          INTEGER        REFERENCES cities(id_city),
  id_type_parking_fk  INTEGER        REFERENCES types_parking(id_type_parking),
  id_schedule_fk      INTEGER        REFERENCES schedules(id_schedule),
  id_user_fk          INTEGER        REFERENCES users(id_user),
  created_at          TIMESTAMP      DEFAULT NOW()
);

-- Controladores de parqueadero (capacidad y tarifa por tipo de vehículo)
CREATE TABLE IF NOT EXISTS parking_controllers (
  id_parking_controller SERIAL         PRIMARY KEY,
  capacity              INTEGER        NOT NULL DEFAULT 0,
  fee                   DECIMAL(12, 2) NOT NULL DEFAULT 0,
  id_vehicle_fk         INTEGER        REFERENCES vehicles(id_vehicle),
  id_parking_fk         INTEGER        REFERENCES parkings(id_parking) ON DELETE CASCADE,
  UNIQUE (id_vehicle_fk, id_parking_fk)
);

-- Tarjetas de pago
CREATE TABLE IF NOT EXISTS cards (
  id_card         SERIAL      PRIMARY KEY,
  number          VARCHAR(20) NOT NULL,
  cvc             VARCHAR(10) NOT NULL,
  expiration_date VARCHAR(10) NOT NULL,
  id_user_fk      INTEGER     UNIQUE REFERENCES users(id_user) ON DELETE CASCADE
);

-- Métodos de pago
CREATE TABLE IF NOT EXISTS payment_methods (
  id_payment_method SERIAL     PRIMARY KEY,
  name              VARCHAR(50) NOT NULL UNIQUE
);

-- Reservas
CREATE TABLE IF NOT EXISTS reservations (
  id_reservation           SERIAL      PRIMARY KEY,
  reservation_date         TIMESTAMP   DEFAULT NOW(),
  entry_reservation_date   TIMESTAMP   NOT NULL,
  departure_reservation_date TIMESTAMP NOT NULL,
  check_in                 TIMESTAMP,
  check_out                TIMESTAMP,
  vehicle_code             VARCHAR(20) NOT NULL,
  state                    VARCHAR(50) NOT NULL DEFAULT 'Pendiente',
  id_vehicle_fk            INTEGER     REFERENCES vehicles(id_vehicle),
  id_user_fk               INTEGER     REFERENCES users(id_user),
  id_parking_fk            INTEGER     REFERENCES parkings(id_parking)
);

-- Facturas
CREATE TABLE IF NOT EXISTS invoices (
  id_invoice            SERIAL         PRIMARY KEY,
  reserve_amount        DECIMAL(12, 2) DEFAULT 0,
  service_amount        DECIMAL(12, 2) DEFAULT 0,
  extra_time_amount     DECIMAL(12, 2) DEFAULT 0,
  refund_amount         DECIMAL(12, 2) DEFAULT 0,
  total_amount          DECIMAL(12, 2) DEFAULT 0,
  time                  DECIMAL(10, 2) DEFAULT 0,  -- horas reales
  payment_token         VARCHAR(500),
  id_payment_method_fk  INTEGER        REFERENCES payment_methods(id_payment_method),
  id_reservation_fk     INTEGER        UNIQUE REFERENCES reservations(id_reservation) ON DELETE CASCADE
);

-- Registros de auditoría
CREATE TABLE IF NOT EXISTS records (
  id_record  SERIAL      PRIMARY KEY,
  action     VARCHAR(255) NOT NULL,
  date       DATE         DEFAULT CURRENT_DATE,
  time       TIME         DEFAULT CURRENT_TIME,
  ip_user    VARCHAR(100),
  id_user_fk INTEGER      REFERENCES users(id_user),
  created_at TIMESTAMP    DEFAULT NOW()
);

-- Índices útiles
CREATE INDEX IF NOT EXISTS idx_reservations_user     ON reservations(id_user_fk);
CREATE INDEX IF NOT EXISTS idx_reservations_parking  ON reservations(id_parking_fk);
CREATE INDEX IF NOT EXISTS idx_reservations_state    ON reservations(state);
CREATE INDEX IF NOT EXISTS idx_records_user          ON records(id_user_fk);
CREATE INDEX IF NOT EXISTS idx_tokens_token          ON tokens(token);
