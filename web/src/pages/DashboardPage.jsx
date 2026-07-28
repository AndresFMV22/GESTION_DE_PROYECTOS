import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Sidebar from '../components/Sidebar';
import ReminderCard from '../components/ReminderCard';
import CreateReminderModal from '../components/CreateReminderModal';
import Icons, { MODULE_ICONS_SVG } from '../components/Icons';
import { MODULE_COLORS } from '../data/templates';

const PARTICLE_COLORS = ['#6366f1', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#f97316'];

function DashboardParticles() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    function resize() {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
    }
    resize();
    window.addEventListener('resize', resize);

    const count = 80;
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      size: Math.random() * 3 + 1,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      alpha: Math.random() * 0.5 + 0.3,
      pulse: Math.random() * Math.PI * 2,
    }));

    function onMouse(e) {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    window.addEventListener('mousemove', onMouse);

    function animate() {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      particlesRef.current.forEach(p => {
        p.pulse += 0.02;
        const pulseAlpha = p.alpha + Math.sin(p.pulse) * 0.15;

        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150 && dist > 0) {
          const force = (150 - dist) / 150;
          p.vx -= (dx / dist) * force * 0.8;
          p.vy -= (dy / dist) * force * 0.8;
        }

        p.vx *= 0.96;
        p.vy *= 0.96;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -5 || p.x > w + 5 || p.y < -5 || p.y > h + 5) {
          p.x = Math.random() * w;
          p.y = Math.random() * h;
          p.vx = (Math.random() - 0.5) * 0.5;
          p.vy = (Math.random() - 0.5) * 0.5;
        }

        ctx.globalAlpha = Math.max(0, pulseAlpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        ctx.globalAlpha = Math.max(0, pulseAlpha * 0.12);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 260,
        right: 0,
        bottom: 0,
        width: 'calc(100% - 260px)',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}

function DashboardOrbs() {
  const orbs = useMemo(() => [
    { size: 600, x: '5%', y: '10%', color: 'rgba(99,102,241,0.25)' },
    { size: 500, x: '65%', y: '50%', color: 'rgba(236,72,153,0.20)' },
    { size: 450, x: '30%', y: '70%', color: 'rgba(6,182,212,0.18)' },
    { size: 400, x: '80%', y: '5%', color: 'rgba(16,185,129,0.15)' },
    { size: 350, x: '15%', y: '55%', color: 'rgba(139,92,246,0.18)' },
  ], []);
  return (
    <div className="dashboard-orbs">
      {orbs.map((o, i) => (
        <div key={i} className="dashboard-orb" style={{
          width: o.size, height: o.size, left: o.x, top: o.y,
          background: `radial-gradient(circle, ${o.color}, transparent 70%)`,
        }} />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [upcoming, setUpcoming] = useState([]);
  const [modules, setModules] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [moduleCategories, setModuleCategories] = useState([]);
  const [showModulePicker, setShowModulePicker] = useState(false);
  const [cancelModuleId, setCancelModuleId] = useState(null);
  const [cancelModuleName, setCancelModuleName] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const modulesData = await api.modules.getAll();

      const freeInactive = modulesData.filter(m => !m.is_premium && !m.user_has_module);
      for (const m of freeInactive) {
        await api.modules.toggle(m.id);
      }

      const [upcomingData, refreshedModules] = await Promise.all([
        api.reminders.getUpcoming(),
        api.modules.getAll(),
      ]);
      setUpcoming(upcomingData);
      setModules(refreshedModules);
    } catch (e) {
      console.error(e);
    }
  }

  async function openCreate(mod) {
    const cats = await api.modules.getCategories(mod.id);
    setSelectedModule(mod);
    setModuleCategories(cats);
    setShowCreate(true);
  }

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  async function handleCancelPremium() {
    setCancelLoading(true);
    try {
      await api.modules.deactivatePremium(cancelModuleId);
      setCancelModuleId(null);
      setCancelModuleName('');
      loadData();
    } catch (e) {
      console.error('Cancel error:', e);
    } finally {
      setCancelLoading(false);
    }
  }

  const activeModules = modules.filter(m => m.user_has_module);

  const groupedReminders = {};
  upcoming.forEach(r => {
    const slug = r.module_slug || 'general';
    if (!groupedReminders[slug]) groupedReminders[slug] = [];
    groupedReminders[slug].push(r);
  });

  return (
    <div className="app-layout">
      <Sidebar user={user} onLogout={handleLogout} modules={activeModules} />
      <main className="main-content">
        <DashboardParticles />
        <DashboardOrbs />
        <div className="dashboard-content">
          <div className="page-header">
            <div>
              <h1 className="dashboard-greeting">Hola, {user?.name?.split(' ')[0]}</h1>
              <p className="dashboard-subtitle">Tus proximos recordatorios</p>
            </div>
            {activeModules.length > 0 && (
              <button className="btn btn-primary" onClick={() => {
                if (activeModules.length === 1) { openCreate(activeModules[0]); }
                else { setShowModulePicker(true); }
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Nuevo Recordatorio
                </span>
              </button>
            )}
          </div>

          <div className="stats-row">
            <div className="stat-card stat-active">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}>
                {Icons.target('#fff', 20)}
              </div>
              <div className="stat-label">Módulos activos</div>
              <div className="stat-value">{activeModules.length}</div>
              <div className="stat-glow" />
            </div>
            <div className="stat-card stat-reminders">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ec4899, #f97316)' }}>
                {Icons.bell('#fff', 20)}
              </div>
              <div className="stat-label">Recordatorios próximos</div>
              <div className="stat-value">{upcoming.length}</div>
              <div className="stat-glow" />
            </div>
            <div className="stat-card stat-available">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>
                {Icons.zap('#fff', 20)}
              </div>
              <div className="stat-label">Módulos disponibles</div>
              <div className="stat-value">{modules.length}</div>
              <div className="stat-glow" />
            </div>
          </div>

          <div className="page-header">
            <h2 className="section-title">Módulos</h2>
          </div>
          <div className="modules-grid">
            {modules.map(mod => {
              const isPremiumActive = mod.is_premium && mod.user_has_module;
              return (
                <Link
                  key={mod.id}
                  to={mod.user_has_module ? `/module/${mod.id}` : mod.is_premium ? `/payment/${mod.id}` : `/module/${mod.id}`}
                  className="module-tile"
                  style={{ opacity: mod.user_has_module ? 1 : (mod.is_premium ? 0.75 : 0.6) }}
                  onClick={(e) => {
                    if (isPremiumActive && e.target.closest('.cancel-premium-btn')) {
                      e.preventDefault();
                    }
                  }}
                >
                  {isPremiumActive && (
                    <button
                      className="cancel-premium-btn"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCancelModuleId(mod.id); setCancelModuleName(mod.name); }}
                      style={{
                        position: 'absolute', top: 10, right: 10, width: 28, height: 28,
                        borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.15)',
                        color: '#ef4444', fontSize: 16, cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', zIndex: 5, transition: 'all 0.2s',
                      }}
                      title="Cancelar suscripción"
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.3)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; }}
                    >
                      ×
                    </button>
                  )}
                  <div className="module-tile-icon" style={{ background: MODULE_COLORS[mod.slug]?.bg || 'linear-gradient(135deg, #6366f1, #818cf8)' }}>
                    {MODULE_ICONS_SVG[mod.slug]?.('#fff', 28)}
                  </div>
                  <div className="module-tile-name">{mod.name}</div>
                  <div className="module-tile-status" style={{ color: mod.user_has_module ? '#22c55e' : mod.is_premium ? '#f59e0b' : '#9ca3af' }}>
                    {mod.user_has_module ? 'Activo' : mod.is_premium ? 'Premium · $9.99' : 'Inactivo'}
                  </div>
                  {mod.user_has_module && <div className="module-tile-shine" />}
                </Link>
              );
            })}
          </div>

          <div className="page-header" style={{ marginTop: 28 }}>
            <h2 className="section-title">Proximos recordatorios</h2>
          </div>
          {upcoming.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">{Icons.calendar('#6366f1', 48)}</div>
              <p>No hay recordatorios proximos</p>
              <p style={{ fontSize: 14, opacity: 0.6 }}>Activa un modulo y crea tu primer recordatorio!</p>
            </div>
          ) : (
            Object.entries(groupedReminders).map(([slug, reminders]) => {
              const colors = MODULE_COLORS[slug] || MODULE_COLORS.general;
              const modData = modules.find(m => m.slug === slug);
              const displayName = modData?.name || slug.charAt(0).toUpperCase() + slug.slice(1);
              return (
                <div key={slug} className="reminder-group">
                  <div className="reminder-group-header" style={{ borderLeftColor: colors.solid }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {MODULE_ICONS_SVG[slug]?.('#fff', 16)}
                    </div>
                    <span style={{ fontWeight: 600, color: '#fff', fontSize: 14 }}>
                      {displayName}
                    </span>
                    <span style={{ fontSize: 12, color: '#6b7280', marginLeft: 'auto' }}>
                      {reminders.length} recordatorio{reminders.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="reminder-grid">
                    {reminders.map(r => (
                      <ReminderCard key={r.id} reminder={r} onUpdate={loadData} moduleColor={colors} />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
        {showModulePicker && (
          <div className="modal-overlay" onClick={() => setShowModulePicker(false)}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
              <h2 style={{ margin: '0 0 20px', fontSize: 20, color: '#fff' }}>Selecciona un módulo</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {activeModules.map(mod => {
                  const colors = MODULE_COLORS[mod.slug] || MODULE_COLORS.general;
                  return (
                    <div
                      key={mod.id}
                      onClick={() => { setShowModulePicker(false); openCreate(mod); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 14, cursor: 'pointer', transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = colors.solid + '40'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
                    >
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {MODULE_ICONS_SVG[mod.slug]?.('#fff', 22)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{mod.name}</div>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  );
                })}
              </div>
              <button className="btn btn-outline" onClick={() => setShowModulePicker(false)} style={{ marginTop: 16, width: '100%' }}>
                Cancelar
              </button>
            </div>
          </div>
        )}
        {showCreate && selectedModule && (
          <CreateReminderModal
            moduleId={selectedModule.id}
            moduleName={selectedModule.name}
            moduleSlug={selectedModule.slug}
            categories={moduleCategories}
            onClose={() => { setShowCreate(false); setSelectedModule(null); }}
            onCreated={() => { setShowCreate(false); setSelectedModule(null); loadData(); }}
          />
        )}

        {cancelModuleId && (
          <div className="modal-overlay" onClick={() => setCancelModuleId(null)}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400, textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              </div>
              <h3 style={{ color: '#fff', fontSize: 18, marginBottom: 8 }}>¿Cancelar suscripción?</h3>
              <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 8, lineHeight: 1.5 }}>
                Se desactivará <strong style={{ color: '#fff' }}>{cancelModuleName}</strong> y se eliminarán sus recordatorios.
              </p>
              <p style={{ color: '#6b7280', fontSize: 12, marginBottom: 24 }}>
                Podrás reactivarlo por $9.99.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setCancelModuleId(null)}
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