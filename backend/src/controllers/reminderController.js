const supabase = require('../config/database');

async function getReminders(req, res) {
  try {
    const { moduleId, completed, upcoming } = req.query;

    let query = supabase
      .from('reminders')
      .select('*')
      .eq('user_id', req.user.id);

    if (moduleId) {
      query = query.eq('module_id', parseInt(moduleId));
    }

    if (completed !== undefined) {
      query = query.eq('is_completed', completed === 'true');
    }

    if (upcoming === 'true') {
      const now = new Date().toISOString();
      query = query.gte('reminder_date', now);
    }

    query = query.order('reminder_date', { ascending: true });

    const { data, error } = await query;
    if (error) throw error;

    const { data: modules } = await supabase.from('modules').select('id, name, slug');
    const { data: categories } = await supabase.from('categories').select('id, name, module_id');

    const modMap = {};
    (modules || []).forEach(m => { modMap[m.id] = m; });
    const catMap = {};
    (categories || []).forEach(c => { catMap[c.id] = c; });

    const result = (data || []).map(r => ({
      ...r,
      module_name: modMap[r.module_id]?.name || null,
      module_slug: modMap[r.module_id]?.slug || null,
      category_name: catMap[r.category_id]?.name || null,
    }));

    res.json(result);
  } catch (error) {
    console.error('Get reminders error:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

async function createReminder(req, res) {
  try {
    const {
      moduleId, categoryId, title, description, reminderDate,
      recurrence, recurrenceInterval, priority, notificationEnabled,
      notificationDaysBefore, notes
    } = req.body;

    if (!moduleId || !title || !reminderDate) {
      return res.status(400).json({ error: 'Módulo, título y fecha son requeridos.' });
    }

    const { data: modCheck } = await supabase
      .from('user_modules')
      .select('user_id')
      .eq('user_id', req.user.id)
      .eq('module_id', moduleId)
      .eq('is_active', true)
      .single();

    if (!modCheck) {
      return res.status(403).json({ error: 'No tienes activo este módulo.' });
    }

    const { data: reminder, error } = await supabase
      .from('reminders')
      .insert({
        user_id: req.user.id,
        module_id: moduleId,
        category_id: categoryId || null,
        title,
        description: description || null,
        reminder_date: reminderDate,
        recurrence: recurrence || 'none',
        recurrence_interval: recurrenceInterval || null,
        priority: priority || 'medium',
        notification_enabled: notificationEnabled !== false,
        notification_days_before: notificationDaysBefore || 1,
        notes: notes || null,
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(reminder);
  } catch (error) {
    console.error('Create reminder error:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

async function updateReminder(req, res) {
  try {
    const id = parseInt(req.params.id);
    const {
      title, description, reminderDate, recurrence, recurrenceInterval,
      priority, notificationEnabled, notificationDaysBefore, notes, isCompleted
    } = req.body;

    const { data: existing } = await supabase
      .from('reminders')
      .select('id')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (!existing) {
      return res.status(404).json({ error: 'Recordatorio no encontrado.' });
    }

    const updateData = { updated_at: new Date().toISOString() };
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (reminderDate !== undefined) updateData.reminder_date = reminderDate;
    if (recurrence !== undefined) updateData.recurrence = recurrence;
    if (recurrenceInterval !== undefined) updateData.recurrence_interval = recurrenceInterval;
    if (priority !== undefined) updateData.priority = priority;
    if (notificationEnabled !== undefined) updateData.notification_enabled = notificationEnabled;
    if (notificationDaysBefore !== undefined) updateData.notification_days_before = notificationDaysBefore;
    if (notes !== undefined) updateData.notes = notes;
    if (isCompleted !== undefined) updateData.is_completed = isCompleted;

    const { data: reminder, error } = await supabase
      .from('reminders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(reminder);
  } catch (error) {
    console.error('Update reminder error:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

async function deleteReminder(req, res) {
  try {
    const id = parseInt(req.params.id);

    const { data: existing } = await supabase
      .from('reminders')
      .select('id')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (!existing) {
      return res.status(404).json({ error: 'Recordatorio no encontrado.' });
    }

    await supabase.from('reminders').delete().eq('id', id);
    res.json({ message: 'Recordatorio eliminado.' });
  } catch (error) {
    console.error('Delete reminder error:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

async function getUpcomingSummary(req, res) {
  try {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('is_completed', false)
      .gte('reminder_date', now)
      .order('reminder_date', { ascending: true })
      .limit(20);

    if (error) throw error;

    const { data: modules } = await supabase.from('modules').select('id, name, slug');
    const { data: categories } = await supabase.from('categories').select('id, name, module_id');

    const modMap = {};
    (modules || []).forEach(m => { modMap[m.id] = m; });
    const catMap = {};
    (categories || []).forEach(c => { catMap[c.id] = c; });

    const result = (data || []).map(r => ({
      ...r,
      module_name: modMap[r.module_id]?.name || null,
      module_slug: modMap[r.module_id]?.slug || null,
      category_name: catMap[r.category_id]?.name || null,
    }));

    res.json(result);
  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

module.exports = { getReminders, createReminder, updateReminder, deleteReminder, getUpcomingSummary };
