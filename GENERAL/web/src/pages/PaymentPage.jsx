import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Icons from '../components/Icons';
import { MODULE_COLORS } from '../data/templates';

function PaymentOrbs() {
  return (
    <div className="payment-bg">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="orb orb-4" />
      <div className="orb orb-5" />
      <div className="grid-bg" />
    </div>
  );
}

export default function PaymentPage() {
  const { moduleId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => { loadModule(); }, [moduleId]);

  async function loadModule() {
    try {
      const modules = await api.modules.getAll();
      const mod = modules.find(m => m.id === parseInt(moduleId));
      if (mod) setModule(mod);
    } catch (e) {
      console.error(e);
    }
  }

  function formatCardNumber(val) {
    const v = val.replace(/\D/g, '').substring(0, 16);
    return v.replace(/(.{4})/g, '$1 ').trim();
  }

  function formatExpiry(val) {
    const v = val.replace(/\D/g, '').substring(0, 4);
    if (v.length >= 3) return v.substring(0, 2) + '/' + v.substring(2);
    return v;
  }

  async function handlePayment(e) {
    e.preventDefault();
    setError('');

    if (!cardName.trim()) { setError('Nombre del titular requerido'); return; }
    if (cardNumber.replace(/\s/g, '').length !== 16) { setError('Número de tarjeta inválido (16 dígitos)'); return; }
    if (expiry.length !== 5) { setError('Fecha de vencimiento inválida (MM/AA)'); return; }
    if (cvv.length < 3) { setError('CVV inválido'); return; }

    setLoading(true);
    try {
      await api.modules.activatePremium(moduleId, {
        cardNumber: cardNumber.replace(/\s/g, ''),
        cardName: cardName.trim(),
        expiry,
        cvv,
      });
      setSuccess(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    const colors = MODULE_COLORS[module?.slug] || MODULE_COLORS.general;
    return (
      <div className="payment-page">
        <PaymentOrbs />
        <div className="payment-success">
          <div className="payment-success-icon" style={{ background: colors.bg }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h1>¡Pago exitoso!</h1>
          <p style={{ color: '#6b7280', fontSize: 16, marginBottom: 8 }}>
            <strong style={{ color: '#fff' }}>{module?.name}</strong> ha sido activado correctamente.
          </p>
          <p style={{ color: '#4b5563', fontSize: 13, marginBottom: 32 }}>
            Ya puedes empezar a crear recordatorios en este módulo.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')} style={{ background: colors.bg, padding: '14px 40px', fontSize: 16 }}>
            Ir al Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="payment-page">
        <PaymentOrbs />
        <div style={{ color: '#6b7280', position: 'relative', zIndex: 1 }}>Cargando...</div>
      </div>
    );
  }

  const colors = MODULE_COLORS[module.slug] || MODULE_COLORS.general;

  return (
    <div className="payment-page">
      <PaymentOrbs />
      <div className="payment-container">
        <button className="payment-back" onClick={() => navigate('/dashboard')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Volver
        </button>

        <div className="payment-card-preview" style={{ background: colors.bg }}>
          <div className="payment-card-chip">
            <svg width="36" height="28" viewBox="0 0 36 28" fill="none"><rect x="0" y="0" width="36" height="28" rx="4" fill="rgba(255,255,255,0.2)"/><rect x="4" y="8" width="28" height="12" rx="2" fill="rgba(255,255,255,0.15)"/></svg>
          </div>
          <div className="payment-card-number">{cardNumber || '•••• •••• •••• ••••'}</div>
          <div className="payment-card-bottom">
            <div>
              <div className="payment-card-label">Titular</div>
              <div className="payment-card-value">{cardName || 'TU NOMBRE'}</div>
            </div>
            <div>
              <div className="payment-card-label">Vence</div>
              <div className="payment-card-value">{expiry || 'MM/AA'}</div>
            </div>
          </div>
        </div>

        <div className="payment-module-badge" style={{ background: colors.solid + '15', borderColor: colors.solid + '30' }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {Icons[module.icon]?.('#fff', 18)}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>Módulo {module.name}</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Acceso premium de por vida</div>
          </div>
          <div style={{ marginLeft: 'auto', fontWeight: 800, color: colors.solid, fontSize: 18 }}>$9.99</div>
        </div>

        <form onSubmit={handlePayment} className="payment-form">
          <div className="form-group">
            <label>Número de tarjeta</label>
            <input
              type="text"
              value={cardNumber}
              onChange={e => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
            />
          </div>
          <div className="form-group">
            <label>Nombre del titular</label>
            <input
              type="text"
              value={cardName}
              onChange={e => setCardName(e.target.value.toUpperCase())}
              placeholder="ANDRES MARTINEZ"
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Vencimiento</label>
              <input
                type="text"
                value={expiry}
                onChange={e => setExpiry(formatExpiry(e.target.value))}
                placeholder="MM/AA"
                maxLength={5}
              />
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input
                type="text"
                value={cvv}
                onChange={e => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                placeholder="123"
                maxLength={4}
              />
            </div>
          </div>

          {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', background: colors.bg, padding: 15, fontSize: 16 }}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span className="auth-spinner" />
                Procesando pago...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                Pagar $9.99
              </span>
            )}
          </button>

          <p style={{ textAlign: 'center', fontSize: 11, color: '#4b5563', marginTop: 12 }}>
            Pago simulado. No se realiza ningún cargo real.
          </p>
        </form>
      </div>
    </div>
  );
}
