import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

function AuthParticles({ mode }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    function resize() {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    }
    resize();

    const count = mode === 'login' ? 40 : 50;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      alpha: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * Math.PI * 2,
    }));

    const color = mode === 'login' ? [99, 102, 241] : [236, 72, 153];

    function onMouse(e) {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    function onLeave() { mouseRef.current = { x: -999, y: -999 }; }
    window.addEventListener('mousemove', onMouse);
    canvas.addEventListener('mouseleave', onLeave);

    function animate() {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      particles.forEach(p => {
        p.pulse += 0.03;
        const pulseA = p.alpha + Math.sin(p.pulse) * 0.15;

        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120 && dist > 0) {
          const force = (120 - dist) / 120;
          p.vx -= (dx / dist) * force * 0.8;
          p.vy -= (dy / dist) * force * 0.8;
        }

        p.vx *= 0.96;
        p.vy *= 0.96;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${Math.max(0, pulseA)})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${Math.max(0, pulseA * 0.12)})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouse);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, [mode]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'auto',
        zIndex: 0,
        borderRadius: '28px',
      }}
    />
  );
}

export default function AuthModal({ initialMode = 'login', onClose, onSwitch }) {
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        if (!name.trim()) { setError('El nombre es requerido'); setLoading(false); return; }
        await register(name, email, password, phone);
      }
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
  }

  return (
    <div className={`auth-modal-overlay auth-overlay-${mode}`} onClick={onClose}>
      <div className={`auth-modal auth-modal-${mode}`} onClick={e => e.stopPropagation()}>
        <AuthParticles mode={mode} />
        <button className="auth-modal-close" onClick={onClose}>✕</button>

        <div className="auth-modal-inner">
          {mode === 'login' ? (
            <div className="auth-badge premium-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Zona exclusiva
            </div>
          ) : (
            <div className="auth-badge welcome-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              Tu nueva vida comienza aquí
            </div>
          )}

          <h2 className={mode === 'login' ? 'auth-title-premium' : 'auth-title-welcome'}>
            {mode === 'login' ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}
          </h2>
          <p className="auth-subtitle">
            {mode === 'login'
              ? 'Retoma el control de tu vida. Todo sigue donde lo dejaste.'
              : 'Da el primer paso hacia una vida sin olvidos. Es gratis.'
            }
          </p>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="form-group">
                <label>Nombre completo</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="¿Cómo te llamamos?" />
              </div>
            )}
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            {mode === 'register' && (
              <div className="form-group">
                <label>Teléfono (opcional)</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+57 300 123 4567" />
              </div>
            )}
            <button className={`auth-btn auth-btn-${mode}`} type="submit" disabled={loading}>
              {loading ? (
                <span className="auth-btn-loading">
                  <span className="auth-spinner" />
                  Procesando...
                </span>
              ) : mode === 'login' ? (
                <span className="auth-btn-content">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                  Entrar
                </span>
              ) : (
                <span className="auth-btn-content">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                  Comenzar gratis
                </span>
              )}
            </button>
          </form>

          {mode === 'register' && (
            <div className="auth-perks">
              <div className="auth-perk">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Módulos gratis de por vida
              </div>
              <div className="auth-perk">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Sin tarjeta de crédito
              </div>
              <div className="auth-perk">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Cancela cuando quieras
              </div>
            </div>
          )}

          <div className="auth-switch">
            {mode === 'login' ? (
              <>¿No tienes cuenta? <button onClick={switchMode}>Regístrate gratis</button></>
            ) : (
              <>¿Ya tienes cuenta? <button onClick={switchMode}>Inicia sesión</button></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}