-- =============================================
-- VidaAdult - Supabase Schema
-- Copiar y pegar en Supabase SQL Editor
-- =============================================

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS modules (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_modules (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  module_id INTEGER REFERENCES modules(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, module_id)
);

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  module_id INTEGER REFERENCES modules(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reminders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  module_id INTEGER REFERENCES modules(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  reminder_date TIMESTAMP NOT NULL,
  recurrence VARCHAR(20) DEFAULT 'none',
  recurrence_interval INTEGER,
  priority VARCHAR(20) DEFAULT 'medium',
  is_completed BOOLEAN DEFAULT false,
  notification_enabled BOOLEAN DEFAULT true,
  notification_days_before INTEGER DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notification_log (
  id SERIAL PRIMARY KEY,
  reminder_id INTEGER REFERENCES reminders(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  notification_type VARCHAR(20) NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'sent'
);

-- =============================================
-- SEED DATA: Módulos
-- =============================================

INSERT INTO modules (name, slug, description, icon, is_premium) VALUES
('Hogar', 'hogar', 'Mantenimiento del hogar', 'home', false),
('Vehículo', 'vehiculo', 'Mantenimiento del vehículo', 'car', false),
('Salud', 'salud', 'Chequeos médicos y salud', 'heart', true),
('Finanzas', 'finanzas', 'Pagos y trámites financieros', 'dollar', true),
('Familia', 'familia', 'Fechas familiares importantes', 'users', true),
('Mascotas', 'mascotas', 'Cuidado de mascotas', 'paw', true),
('General', 'general', 'Recordatorios personalizados', 'bell', false)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- SEED DATA: Categorías
-- =============================================

INSERT INTO categories (module_id, name, icon) VALUES
-- Hogar
((SELECT id FROM modules WHERE slug='hogar'), 'Refrigeradora', 'snowflake'),
((SELECT id FROM modules WHERE slug='hogar'), 'Calentador', 'flame'),
((SELECT id FROM modules WHERE slug='hogar'), 'Focos', 'lightbulb'),
((SELECT id FROM modules WHERE slug='hogar'), 'Baterías', 'battery'),
((SELECT id FROM modules WHERE slug='hogar'), 'Impuestos', 'file'),
((SELECT id FROM modules WHERE slug='hogar'), 'Mantenimiento General', 'tool'),
-- Vehículo
((SELECT id FROM modules WHERE slug='vehiculo'), 'Cambio de Aceite', 'droplet'),
((SELECT id FROM modules WHERE slug='vehiculo'), 'SOAT', 'shield'),
((SELECT id FROM modules WHERE slug='vehiculo'), 'Tecnomecánica', 'settings'),
((SELECT id FROM modules WHERE slug='vehiculo'), 'Frenos', 'circle'),
((SELECT id FROM modules WHERE slug='vehiculo'), 'Llantas', 'circle-dot'),
((SELECT id FROM modules WHERE slug='vehiculo'), 'Pico y Placa', 'calendar'),
-- Salud
((SELECT id FROM modules WHERE slug='salud'), 'Chequeo Médico', 'stethoscope'),
((SELECT id FROM modules WHERE slug='salud'), 'Odontología', 'smile'),
((SELECT id FROM modules WHERE slug='salud'), 'Examen de Vista', 'eye'),
((SELECT id FROM modules WHERE slug='salud'), 'Donación de Sangre', 'droplet'),
-- Finanzas
((SELECT id FROM modules WHERE slug='finanzas'), 'Tarjetas de Crédito', 'credit-card'),
((SELECT id FROM modules WHERE slug='finanzas'), 'Declaración de Renta', 'file-text'),
-- Familia
((SELECT id FROM modules WHERE slug='familia'), 'Cumpleaños', 'cake'),
((SELECT id FROM modules WHERE slug='familia'), 'Matrículas', 'book'),
((SELECT id FROM modules WHERE slug='familia'), 'Aniversarios', 'heart'),
-- Mascotas
((SELECT id FROM modules WHERE slug='mascotas'), 'Vacunas', 'syringe'),
((SELECT id FROM modules WHERE slug='mascotas'), 'Desparasitación', 'shield'),
((SELECT id FROM modules WHERE slug='mascotas'), 'Chequeo Veterinario', 'stethoscope'),
((SELECT id FROM modules WHERE slug='mascotas'), 'Compra de Alimento', 'shopping-cart')
ON CONFLICT DO NOTHING;
