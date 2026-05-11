-- =============================================================
--   FourPark — Datos iniciales
--   NOTA: el superadmin se crea con: npm run db:init-admin
-- =============================================================

-- Roles
INSERT INTO roles (name) VALUES
  ('SuperAdministrador'),
  ('Administrador'),
  ('Usuario')
ON CONFLICT (name) DO NOTHING;

-- Tipos de vehículo
INSERT INTO vehicles (name) VALUES
  ('Carro'),
  ('Moto'),
  ('Bicicleta')
ON CONFLICT (name) DO NOTHING;

-- Tipos de parqueadero
INSERT INTO types_parking (name) VALUES
  ('Público'),
  ('Privado'),
  ('Mixto')
ON CONFLICT (name) DO NOTHING;

-- Métodos de pago
INSERT INTO payment_methods (name) VALUES
  ('Tarjeta')
ON CONFLICT (name) DO NOTHING;

-- Ciudades de Colombia
INSERT INTO cities (name) VALUES
  ('Bogotá'),
  ('Medellín'),
  ('Cali'),
  ('Barranquilla'),
  ('Cartagena'),
  ('Bucaramanga'),
  ('Pereira'),
  ('Manizales'),
  ('Ibagué'),
  ('Santa Marta')
ON CONFLICT DO NOTHING;

-- Horarios
INSERT INTO schedules (name, initial_day, final_day, opening_time, closing_time) VALUES
  ('Lunes a Viernes 8am–6pm',      1, 5, 8,  18),
  ('Lunes a Sábado 6am–10pm',      1, 6, 6,  22),
  ('Todos los días 24 horas',      0, 6, 0,  24),
  ('Lunes a Domingo 7am–9pm',      0, 6, 7,  21),
  ('Lunes a Viernes 7am–8pm',      1, 5, 7,  20),
  ('Sábados y Domingos 8am–4pm',   0, 0, 8,  16)
ON CONFLICT DO NOTHING;
