const supabase = require('../config/database');

async function getModules(req, res) {
  try {
    const { data: modules } = await supabase
      .from('modules')
      .select('*')
      .order('is_premium', { ascending: true });

    const { data: userModules } = await supabase
      .from('user_modules')
      .select('module_id, is_active')
      .eq('user_id', req.user.id);

    const userModuleMap = {};
    if (userModules) {
      userModules.forEach(um => { userModuleMap[um.module_id] = um.is_active; });
    }

    const result = modules.map(m => ({
      ...m,
      user_has_module: userModuleMap[m.id] || false,
    }));

    res.json(result);
  } catch (error) {
    console.error('Get modules error:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

async function toggleModule(req, res) {
  try {
    const moduleId = parseInt(req.params.moduleId);

    const { data: mod } = await supabase
      .from('modules')
      .select('*')
      .eq('id', moduleId)
      .single();

    if (!mod) {
      return res.status(404).json({ error: 'Módulo no encontrado.' });
    }

    const { data: existing } = await supabase
      .from('user_modules')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('module_id', moduleId)
      .single();

    if (existing) {
      const newStatus = !existing.is_active;
      await supabase
        .from('user_modules')
        .update({ is_active: newStatus })
        .eq('user_id', req.user.id)
        .eq('module_id', moduleId);
      res.json({ active: newStatus });
    } else {
      await supabase
        .from('user_modules')
        .insert({ user_id: req.user.id, module_id: moduleId, is_active: true });
      res.json({ active: true });
    }
  } catch (error) {
    console.error('Toggle module error:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

async function activatePremium(req, res) {
  try {
    const moduleId = parseInt(req.params.moduleId);
    const { cardNumber, cardName, expiry, cvv } = req.body;

    if (!cardNumber || !cardName || !expiry || !cvv) {
      return res.status(400).json({ error: 'Todos los campos de pago son requeridos.' });
    }

    if (cardNumber.replace(/\s/g, '').length !== 16) {
      return res.status(400).json({ error: 'Número de tarjeta inválido.' });
    }

    const { data: mod } = await supabase
      .from('modules')
      .select('*')
      .eq('id', moduleId)
      .eq('is_premium', true)
      .single();

    if (!mod) {
      return res.status(404).json({ error: 'Módulo premium no encontrado.' });
    }

    const { data: existing } = await supabase
      .from('user_modules')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('module_id', moduleId)
      .single();

    if (existing) {
      await supabase
        .from('user_modules')
        .update({ is_active: true })
        .eq('user_id', req.user.id)
        .eq('module_id', moduleId);
    } else {
      await supabase
        .from('user_modules')
        .insert({ user_id: req.user.id, module_id: moduleId, is_active: true });
    }

    res.json({ success: true, message: `${mod.name} activado correctamente.` });
  } catch (error) {
    console.error('Activate premium error:', error);
    res.status(500).json({ error: 'Error al procesar el pago.' });
  }
}

async function getCategories(req, res) {
  try {
    const moduleId = parseInt(req.params.moduleId);
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('module_id', moduleId)
      .order('name');
    res.json(data || []);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

async function deactivatePremium(req, res) {
  try {
    const moduleId = parseInt(req.params.moduleId);

    const { data: mod } = await supabase
      .from('modules')
      .select('*')
      .eq('id', moduleId)
      .single();

    if (!mod) {
      return res.status(404).json({ error: 'Módulo no encontrado.' });
    }

    const { data: existing } = await supabase
      .from('user_modules')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('module_id', moduleId)
      .single();

    if (!existing) {
      return res.status(404).json({ error: 'No tienes este módulo activo.' });
    }

    await supabase
      .from('user_modules')
      .update({ is_active: false })
      .eq('user_id', req.user.id)
      .eq('module_id', moduleId);

    await supabase
      .from('reminders')
      .delete()
      .eq('user_id', req.user.id)
      .eq('module_id', moduleId);

    res.json({ success: true, message: `${mod.name} desactivado correctamente.` });
  } catch (error) {
    console.error('Deactivate premium error:', error);
    res.status(500).json({ error: 'Error al desactivar el módulo.' });
  }
}

module.exports = { getModules, toggleModule, getCategories, activatePremium, deactivatePremium };
