import React from 'react';
import { api } from '../services/api';
import { MODULE_COLORS } from '../data/templates';

const PRIORITY_STYLES = {
  high: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', label: 'Alta' },
  medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', label: 'Media' },
  low: { color: '#22c55e', bg: 'rgba(34,197,94,0.12)', label: 'Baja' },
};

export default function ReminderCard({ reminder: r, onUpdate, moduleColor }) {
  const colors = moduleColor || MODULE_COLORS[r.module_slug] || MODULE_COLORS.general;
  const priority = PRIORITY_STYLES[r.priority] || PRIORITY_STYLES.medium;

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function formatTime(dateStr) {
    const d = new Date(dateStr);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }

  function getDaysUntil(dateStr) {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'Vencido';
    if (diff === 0) return 'Hoy';
    if (diff === 1) return 'Manana';
    if (diff <= 7) return `En ${diff} dias`;
    return null;
  }

  const urgency = getDaysUntil(r.reminder_date);

  async function toggleComplete() {
    await api.reminders.update(r.id, { isCompleted: !r.is_completed });
    onUpdate();
  }

  async function handleDelete() {
    if (window.confirm('Eliminar este recordatorio?')) {
      await api.reminders.delete(r.id);
      onUpdate();
    }
  }

  const urgencyColor = urgency === 'Vencido' ? '#ef4444' : urgency === 'Hoy' || urgency === 'Manana' ? '#f59e0b' : '#22c55e';
  const urgencyBg = urgency === 'Vencido' ? 'rgba(239,68,68,0.12)' : urgency === 'Hoy' || urgency === 'Manana' ? 'rgba(245,158,11,0.12)' : 'rgba(34,197,94,0.12)';

  return (
    <div className="reminder-grid-card" style={r.is_completed ? { opacity: 0.45 } : {}}>
      <div className="reminder-grid-top" style={{ background: colors.bg }}>
        <div className="reminder-grid-icon">
          {r.is_completed ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          ) : (
            <span className="reminder-grid-title-text">{r.title?.charAt(0)?.toUpperCase() || '?'}</span>
          )}
        </div>
        <div className="reminder-grid-top-right">
          {urgency && (
            <span className="reminder-urgency-badge" style={{ color: urgencyColor, background: urgencyBg }}>
              {urgency}
            </span>
          )}
          <span className="reminder-priority-badge" style={{ color: priority.color, background: priority.bg }}>
            {priority.label}
          </span>
        </div>
      </div>

      <div className="reminder-grid-body">
        <h3 className="reminder-grid-title" style={r.is_completed ? { textDecoration: 'line-through', opacity: 0.6 } : {}}>
          {r.title}
        </h3>

        {r.description && (
          <p className="reminder-grid-desc">{r.description}</p>
        )}

        <div className="reminder-grid-info">
          <div className="reminder-grid-info-row">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.solid} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span>{formatDate(r.reminder_date)}</span>
          </div>
          <div className="reminder-grid-info-row">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.solid} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>{formatTime(r.reminder_date)}</span>
          </div>
          {r.recurrence && r.recurrence !== 'none' && (
            <div className="reminder-grid-info-row">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.solid} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
              <span>{r.recurrence === 'daily' ? 'Diario' : r.recurrence === 'weekly' ? 'Semanal' : r.recurrence === 'monthly' ? 'Mensual' : r.recurrence === 'quarterly' ? 'Trimestral' : 'Anual'}</span>
            </div>
          )}
          {r.category_name && (
            <div className="reminder-grid-info-row">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.solid} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
              <span>{r.category_name}</span>
            </div>
          )}
        </div>
      </div>

      <div className="reminder-grid-actions">
        <button className="reminder-grid-check" onClick={toggleComplete} title={r.is_completed ? 'Marcar pendiente' : 'Marcar completado'}>
          <div className={`reminder-checkbox-large ${r.is_completed ? 'checked' : ''}`}>
            {r.is_completed && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            )}
          </div>
          <span style={{ fontSize: 13, color: '#94a3b8' }}>{r.is_completed ? 'Completado' : 'Completar'}</span>
        </button>
        <button className="reminder-grid-delete" onClick={handleDelete} title="Eliminar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          <span style={{ fontSize: 13 }}>Eliminar</span>
        </button>
      </div>
    </div>
  );
}
