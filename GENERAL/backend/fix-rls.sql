ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE modules DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_modules DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE reminders DISABLE ROW LEVEL SECURITY;
ALTER TABLE notification_log DISABLE ROW LEVEL SECURITY;

-- Insertar módulos
INSERT INTO modules (name, slug, description, icon, is_premium) VALUES
('Hogar', 'hogar', 'Mantenimiento del hogar', 'home', false),
('Vehículo', 'vehiculo', 'Mantenimiento del vehículo', 'car', false),
('Salud', 'salud', 'Chequeos médicos y salud', 'heart', true),
('Finanzas', 'finanzas', 'Pagos y trámites financieros', 'dollar', true),
('Familia', 'familia', 'Fechas familiares importantes', 'users', true),
('Mascotas', 'mascotas', 'Cuidado de mascotas', 'paw', true),
('General', 'general', 'Recordatorios personalizados', 'bell', false)
ON CONFLICT (slug) DO NOTHING;

-- Insertar categorías
INSERT INTO categories (module_id, name, icon) VALUES
((SELECT id FROM modules WHERE slug='hogar'), 'Refrigeradora', 'snowflake'),
((SELECT id FROM modules WHERE slug='hogar'), 'Calentador', 'flame'),
((SELECT id FROM modules WHERE slug='hogar'), 'Focos', 'lightbulb'),
((SELECT id FROM modules WHERE slug='hogar'), 'Baterías', 'battery'),
((SELECT id FROM modules WHERE slug='hogar'), 'Impuestos', 'file'),
((SELECT id FROM modules WHERE slug='hogar'), 'Mantenimiento General', 'tool'),
((SELECT id FROM modules WHERE slug='vehiculo'), 'Cambio de Aceite', 'droplet'),
((SELECT id FROM modules WHERE slug='vehiculo'), 'SOAT', 'shield'),
((SELECT id FROM modules WHERE slug='vehiculo'), 'Tecnomecánica', 'settings'),
((SELECT id FROM modules WHERE slug='vehiculo'), 'Frenos', 'circle'),
((SELECT id FROM modules WHERE slug='vehiculo'), 'Llantas', 'circle-dot'),
((SELECT id FROM modules WHERE slug='vehiculo'), 'Pico y Placa', 'calendar'),
((SELECT id FROM modules WHERE slug='salud'), 'Chequeo Médico', 'stethoscope'),
((SELECT id FROM modules WHERE slug='salud'), 'Odontología', 'smile'),
((SELECT id FROM modules WHERE slug='salud'), 'Examen de Vista', 'eye'),
((SELECT id FROM modules WHERE slug='salud'), 'Donación de Sangre', 'droplet'),
((SELECT id FROM modules WHERE slug='finanzas'), 'Tarjetas de Crédito', 'credit-card'),
((SELECT id FROM modules WHERE slug='finanzas'), 'Declaración de Renta', 'file-text'),
((SELECT id FROM modules WHERE slug='familia'), 'Cumpleaños', 'cake'),
((SELECT id FROM modules WHERE slug='familia'), 'Matrículas', 'book'),
((SELECT id FROM modules WHERE slug='familia'), 'Aniversarios', 'heart'),
((SELECT id FROM modules WHERE slug='mascotas'), 'Vacunas', 'syringe'),
((SELECT id FROM modules WHERE slug='mascotas'), 'Desparasitación', 'shield'),
((SELECT id FROM modules WHERE slug='mascotas'), 'Chequeo Veterinario', 'stethoscope'),
((SELECT id FROM modules WHERE slug='mascotas'), 'Compra de Alimento', 'shopping-cart')
ON CONFLICT DO NOTHING;
