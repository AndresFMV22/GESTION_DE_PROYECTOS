import React, { useState } from 'react';
import { api } from '../services/api';
import { REMINDER_TEMPLATES, MODULE_COLORS } from '../data/templates';

const RECURRENCES = [
  { value: 'none', label: 'Una vez' },
  { value: 'daily', label: 'Diario' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensual' },
  { value: 'quarterly', label: 'Trimestral' },
  { value: 'yearly', label: 'Anual' },
];

const PRIORITIES = [
  { value: 'low', label: 'Baja', color: '#22c55e' },
  { value: 'medium', label: 'Media', color: '#f59e0b' },
  { value: 'high', label: 'Alta', color: '#ef4444' },
];

function getDefaultDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

export default function CreateReminderModal({ moduleId, moduleName, moduleSlug, categories, onClose, onCreated }) {
  const templates = REMINDER_TEMPLATES[moduleSlug] || [];
  const colors = MODULE_COLORS[moduleSlug] || MODULE_COLORS.general;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [date, setDate] = useState(getDefaultDate());
  const [time, setTime] = useState('09:00');
  const [recurrence, setRecurrence] = useState('none');
  const [priority, setPriority] = useState('medium');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTemplates, setShowTemplates] = useState(templates.length > 0);

  function applyTemplate(tpl) {
    setTitle(tpl.title);
    setDescription(tpl.description);
    if (tpl.category && categories.length > 0) {
      const cat = categories.find(c => c.name === tpl.category);
      if (cat) setSelectedCategory(cat.id);
    }
    if (tpl.daysInterval) {
      const d = new Date();
      d.setDate(d.getDate() + tpl.daysInterval);
      setDate(d.toISOString().split('T')[0]);
      if (tpl.daysInterval <= 30) setRecurrence('monthly');
      else if (tpl.daysInterval <= 100) setRecurrence('quarterly');
      else if (tpl.daysInterval <= 400) setRecurrence('yearly');
    }
    setShowTemplates(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) { setError('El título es requerido'); return; }
    if (!date.trim()) { setError('La fecha es requerida'); return; }
    if (date < getTodayDate()) { setError('No puedes seleccionar una fecha en el pasado'); return; }

    setLoading(true);
    setError('');
    try {
      const reminderDate = new Date(`${date}T${time}:00`);
      await api.reminders.create({
        moduleId: parseInt(moduleId),
        categoryId: selectedCategory,
        title: title.trim(),
        description: description.trim() || null,
        reminderDate: reminderDate.toISOString(),
        recurrence,
        priority,
        notes: notes.trim() || null,
      });
      onCreated();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (showTemplates) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 20 }}>Plantillas - {moduleName}</h2>
              <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>Selecciona una o crea uno personalizado</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 360, overflowY: 'auto', paddingRight: 4 }}>
            {templates.map((tpl, i) => (
              <div
                key={i}
                onClick={() => applyTemplate(tpl)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = colors.solid + '40'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors.solid, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 2 }}>{tpl.title}</div>
                  <div style={{ fontSize: 12, color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tpl.description}</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <button className="btn btn-outline" onClick={() => setShowTemplates(false)} style={{ flex: 1 }}>
              Crear personalizado
            </button>
            <button className="btn btn-primary" onClick={onClose} style={{ flex: 1 }}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 18 }}>Nuevo Recordatorio</h2>
            <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>{moduleName}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Título *</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej: Cambio de aceite" />
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="Detalles..." style={{ resize: 'vertical' }} />
          </div>
          {categories.length > 0 && (
            <div className="form-group">
              <label>Categoría</label>
              <div className="chip-group">
                {categories.map(cat => (
                  <span
                    key={cat.id}
                    className={`chip ${selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Fecha *</label>
              <input type="date" value={date} min={getTodayDate()} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Hora</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label>Frecuencia</label>
            <div className="chip-group">
              {RECURRENCES.map(r => (
                <span
                  key={r.value}
                  className={`chip ${recurrence === r.value ? 'active' : ''}`}
                  onClick={() => setRecurrence(r.value)}
                >
                  {r.label}
                </span>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Prioridad</label>
            <div className="chip-group">
              {PRIORITIES.map(p => (
                <span
                  key={p.value}
                  className="chip"
                  style={priority === p.value ? { background: p.color, borderColor: p.color, color: '#fff' } : { borderColor: p.color }}
                  onClick={() => setPriority(p.value)}
                >
                  {p.label}
                </span>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Notas</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Información extra..." style={{ resize: 'vertical' }} />
          </div>
          {error && <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 12 }}>{error}</p>}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            {templates.length > 0 && (
              <button type="button" className="btn btn-outline" onClick={() => setShowTemplates(true)} style={{ marginRight: 'auto' }}>
                Usar plantilla
              </button>
            )}
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" style={{ width: 'auto' }} disabled={loading}>
              {loading ? 'Creando...' : 'Crear Recordatorio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}