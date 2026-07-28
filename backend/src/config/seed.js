const supabase = require('./database');

async function seed() {
  try {
    const modules = [
      { name: 'Hogar', slug: 'hogar', description: 'Mantenimiento del hogar', icon: 'home', is_premium: false },
      { name: 'Vehículo', slug: 'vehiculo', description: 'Mantenimiento del vehículo', icon: 'car', is_premium: false },
      { name: 'Salud', slug: 'salud', description: 'Chequeos médicos y salud', icon: 'heart', is_premium: true },
      { name: 'Finanzas', slug: 'finanzas', description: 'Pagos y trámites financieros', icon: 'dollar', is_premium: true },
      { name: 'Familia', slug: 'familia', description: 'Fechas familiares importantes', icon: 'users', is_premium: false },
      { name: 'Mascotas', slug: 'mascotas', description: 'Cuidado de mascotas', icon: 'paw', is_premium: true },
      { name: 'General', slug: 'general', description: 'Recordatorios personalizados', icon: 'bell', is_premium: true },
    ];

    const { error: modError } = await supabase.from('modules').upsert(modules, { onConflict: 'slug' });
    if (modError) throw modError;
    console.log('Modules inserted');

    const { data: insertedModules } = await supabase.from('modules').select('id, slug');
    const slugToId = {};
    insertedModules.forEach(m => { slugToId[m.slug] = m.id; });

    const categories = [
      { module_slug: 'hogar', name: 'Refrigeradora', icon: 'snowflake' },
      { module_slug: 'hogar', name: 'Calentador', icon: 'flame' },
      { module_slug: 'hogar', name: 'Focos', icon: 'lightbulb' },
      { module_slug: 'hogar', name: 'Baterías', icon: 'battery' },
      { module_slug: 'hogar', name: 'Impuestos', icon: 'file' },
      { module_slug: 'hogar', name: 'Mantenimiento General', icon: 'tool' },
      { module_slug: 'vehiculo', name: 'Cambio de Aceite', icon: 'droplet' },
      { module_slug: 'vehiculo', name: 'SOAT', icon: 'shield' },
      { module_slug: 'vehiculo', name: 'Tecnomecánica', icon: 'settings' },
      { module_slug: 'vehiculo', name: 'Frenos', icon: 'circle' },
      { module_slug: 'vehiculo', name: 'Llantas', icon: 'circle-dot' },
      { module_slug: 'vehiculo', name: 'Pico y Placa', icon: 'calendar' },
      { module_slug: 'vehiculo', name: 'Mantenimiento General', icon: 'tool' },
      { module_slug: 'salud', name: 'Chequeo Médico', icon: 'stethoscope' },
      { module_slug: 'salud', name: 'Odontología', icon: 'smile' },
      { module_slug: 'salud', name: 'Examen de Vista', icon: 'eye' },
      { module_slug: 'salud', name: 'Donación de Sangre', icon: 'droplet' },
      { module_slug: 'finanzas', name: 'Tarjetas de Crédito', icon: 'credit-card' },
      { module_slug: 'finanzas', name: 'Declaración de Renta', icon: 'file-text' },
      { module_slug: 'familia', name: 'Cumpleaños', icon: 'cake' },
      { module_slug: 'familia', name: 'Matrículas', icon: 'book' },
      { module_slug: 'familia', name: 'Aniversarios', icon: 'heart' },
      { module_slug: 'familia', name: 'Reuniones', icon: 'users' },
      { module_slug: 'familia', name: 'Fechas Especiales', icon: 'gift' },
      { module_slug: 'mascotas', name: 'Vacunas', icon: 'syringe' },
      { module_slug: 'mascotas', name: 'Desparasitación', icon: 'shield' },
      { module_slug: 'mascotas', name: 'Chequeo Veterinario', icon: 'stethoscope' },
      { module_slug: 'mascotas', name: 'Compra de Alimento', icon: 'shopping-cart' },
    ];

    const catsToInsert = categories
      .filter(c => slugToId[c.module_slug])
      .map(c => ({ module_id: slugToId[c.module_slug], name: c.name, icon: c.icon }));

    const { data: existingCats } = await supabase.from('categories').select('module_id, name');
    const existingSet = new Set((existingCats || []).map(c => `${c.module_id}-${c.name}`));
    const newCats = catsToInsert.filter(c => !existingSet.has(`${c.module_id}-${c.name}`));

    if (newCats.length > 0) {
      const { error: catError } = await supabase.from('categories').insert(newCats);
      if (catError) throw catError;
    }
    console.log('Categories inserted');

    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
