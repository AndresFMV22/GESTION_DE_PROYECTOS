import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Sidebar from '../components/Sidebar';
import ReminderCard from '../components/ReminderCard';
import CreateReminderModal from '../components/CreateReminderModal';
import { MODULE_ICONS_SVG } from '../components/Icons';
import { MODULE_COLORS } from '../data/templates';

export default function ModulePage() {
  const { moduleId } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [moduleName, setModuleName] = useState('');
  const [moduleSlug, setModuleSlug] = useState('');
  const [moduleIsPremium, setModuleIsPremium] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => { loadData(); }, [moduleId]);

  async function loadData() {
    const id = parseInt(moduleId);

    api.reminders.getAll({ moduleId: id })
      .then(setReminders)
      .catch(e => console.error('Reminders fetch error:', e));

    try {
      const [modulesData, categoriesData] = await Promise.all([
        api.modules.getAll(),
        api.modules.getCategories(id),
      ]);

      setCategories(categoriesData);

      const mod = modulesData.find(m => m.id === id);
      if (mod) {
        setModuleName(mod.name);
        setModuleSlug(mod.slug);
        setModuleIsPremium(mod.is_premium);
        if (!mod.user_has_module && !mod.is_premium) {
          try {
            await api.modules.toggle(id);
            const reloaded = await api.modules.getAll();
            setModules(reloaded.filter(m => m.user_has_module));
          } catch (toggleErr) {
            console.error('Toggle error:', toggleErr);
            setModules(modulesData.filter(m => m.user_has_module));
          }
        } else {
          setModules(modulesData.filter(m => m.user_has_module));
        }
      }
    } catch (e) {
      console.error('ModulePage loadData error:', e);
    }
  }

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  async function handleCancelPremium() {
    setCancelLoading(true);
    try {
      await api.modules.deactivatePremium(parseInt(moduleId));
      setShowCancelConfirm(false);
      loadData();
    } catch (e) {
      console.error('Cancel error:', e);
    } finally {
      setCancelLoading(false);
    }
  }

  const colors = MODULE_COLORS[moduleSlug] || MODULE_COLORS.general;

  return (
    <div className="app-layout">
      <Sidebar user={user} onLogout={handleLogout} modules={modules} activeModule={parseInt(moduleId)} />
      <main className="main-content">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 20px ${colors.solid}30` }}>
              {MODULE_ICONS_SVG[moduleSlug]?.('#fff', 26)}
            </div>
            <div>
              <h1 style={{ fontSize: 24 }}>{moduleName}</h1>
              <p style={{ color: '#6b7280', marginTop: 2, fontSize: 13 }}>{reminders.length} recordatorio{reminders.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {moduleIsPremium && (
              <button
                onClick={() => setShowCancelConfirm(true)}
                style={{
                  padding: '10px 18px', borderRadius: 12, border: '1px solid rgba(239,68,68,0.3)',
                  background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; }}
              >
                Cancelar suscripción
              </button>
            )}
            <button className="btn btn-primary" onClick={() => setShowCreate(true)} style={{ background: colors.bg }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Nuevo Recordatorio
              </span>
            </button>
          </div>
        </div>

        {categories.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>Categorias:</p>
            <div className="chip-group">
              {categories.map(cat => (
                <span key={cat.id} className="chip" style={{ borderColor: colors.solid + '40' }}>{cat.name}</span>
              ))}
            </div>
          </div>
        )}

        {reminders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">{MODULE_ICONS_SVG[moduleSlug]?.(colors.solid, 48)}</div>
            <p>Sin recordatorios en {moduleName}</p>
            <p style={{ fontSize: 14, opacity: 0.6, marginBottom: 16 }}>Crea tu primer recordatorio o usa una plantilla</p>
            <button className="btn btn-primary" onClick={() => setShowCreate(true)} style={{ background: colors.bg }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Crear Recordatorio
              </span>
            </button>
          </div>
        ) : (
          <div className="reminder-grid">
            {reminders.map(r => (
              <ReminderCard key={r.id} reminder={r} onUpdate={loadData} moduleColor={colors} />
            ))}
          </div>
        )}

        {showCreate && (
          <CreateReminderModal
            moduleId={moduleId}
            moduleName={moduleName}
            moduleSlug={moduleSlug}
            categories={categories}
            onClose={() => setShowCreate(false)}
            onCreated={() => { setShowCreate(false); loadData(); }}
          />
        )}

        {showCancelConfirm && (
          <div className="modal-overlay" onClick={() => setShowCancelConfirm(false)}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400, textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              </div>
              <h3 style={{ color: '#fff', fontSize: 18, marginBottom: 8 }}>¿Cancelar suscripción?</h3>
              <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 8, lineHeight: 1.5 }}>
                Se desactivará el módulo <strong style={{ color: '#fff' }}>{moduleName}</strong> y se eliminarán todos sus recordatorios.
              </p>
              <p style={{ color: '#6b7280', fontSize: 12, marginBottom: 24 }}>
                Podrás reactivarlo en cualquier momento por $9.99.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  style={{
                    flex: 1, padding: '12px 0', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.03)', color: '#e2e8f0', fontSize: 14, fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                  }}
                >
                  Mantener
                </button>
                <button
                  onClick={handleCancelPremium}
                  disabled={cancelLoading}
                  style={{
                    flex: 1, padding: '12px 0', borderRadius: 12, border: 'none',
                    background: '#ef4444', color: '#fff', fontSize: 14, fontWeight: 600,
                    cursor: cancelLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                    opacity: cancelLoading ? 0.7 : 1, transition: 'all 0.2s',
                  }}
                >
                  {cancelLoading ? 'Cancelando...' : 'Sí, cancelar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
