import React, { useState, useEffect, useRef, useMemo } from 'react';
import Prism from '../components/Prism';
import MagicBento from '../components/MagicBento';

/* ===== SVG ICONS ===== */
const Icons = {
  home: (c='currentColor') => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  car: (c='currentColor') => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-6H6l-3 8h3m7-6l2 6m-2 0a2 2 0 1 0 4 0m-4 0h4"/><circle cx="7.5" cy="16.5" r="1.5"/><circle cx="16.5" cy="16.5" r="1.5"/></svg>,
  heart: (c='currentColor') => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  dollar: (c='currentColor') => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  users: (c='currentColor') => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  paw: (c='currentColor') => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="4" cy="8" r="2"/><path d="M12 22c-4 0-7-2-7-5 0-2 1.5-3 3-3 .8 0 1.5.3 2 .8C9 14.3 10 14 11 14s2 .3 3 .8c.5-.5 1.2-.8 2-.8 1.5 0 3 1 3 3 0 3-3 5-7 5z"/></svg>,
  bell: (c='currentColor') => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  bellRing: (c='currentColor') => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/><path d="M2 8c0-2.2.7-4.3 2-6"/><path d="M22 8c0-2.2-.7-4.3-2-6"/></svg>,
  smartphone: (c='currentColor') => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
  target: (c='currentColor') => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  refresh: (c='currentColor') => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  zap: (c='currentColor') => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  gift: (c='currentColor') => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>,
  shield: (c='currentColor') => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  calendar: (c='currentColor') => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  stethoscope: (c='currentColor') => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>,
  creditCard: (c='currentColor') => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  trendingUp: (c='currentColor') => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  check: (c='currentColor') => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  syringe: (c='currentColor') => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2l4 4"/><path d="M17.4 7.6l-4-4"/><path d="M15 10l-6 6"/><path d="M9 15l-4 4"/><path d="M2 22l4-4"/><path d="M18 10l4-4"/><path d="M14 14l4 4"/></svg>,
  eye: (c='currentColor') => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
};

const MODULE_ICONS_SVG = {
  hogar: Icons.home,
  vehiculo: Icons.car,
  salud: Icons.heart,
  finanzas: Icons.dollar,
  familia: Icons.users,
  mascotas: Icons.paw,
  general: Icons.bell,
};

/* ===== PARTICLES COMPONENT ===== */
function Particles() {
  const particles = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 5,
    }))
  , []);

  return (
    <div className="particles-container">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ===== ANIMATED CHART: Savings ===== */
function SavingsChart() {
  const [visible, setVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const points = [
    { month: 'Ene', value: 120 }, { month: 'Feb', value: 280 }, { month: 'Mar', value: 350 },
    { month: 'Abr', value: 520 }, { month: 'May', value: 680 }, { month: 'Jun', value: 890 },
    { month: 'Jul', value: 1100 }, { month: 'Ago', value: 1350 }, { month: 'Sep', value: 1600 },
    { month: 'Oct', value: 1900 }, { month: 'Nov', value: 2200 }, { month: 'Dic', value: 2650 },
  ];

  const maxVal = 2800;
  const w = 500, h = 200, pad = 30;
  const pathD = points.map((p, i) => {
    const x = pad + (i / (points.length - 1)) * (w - pad * 2);
    const y = h - pad - (p.value / maxVal) * (h - pad * 2);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const areaD = pathD + ` L ${pad + (11 / 11) * (w - pad * 2)} ${h - pad} L ${pad} ${h - pad} Z`;

  return (
    <div ref={ref} className="chart-container">
      <div className="chart-header">
        <div className="chart-icon green">{Icons.trendingUp('#fff')}</div>
        <div>
          <h4>Ahorro acumulado</h4>
          <p className="chart-subtitle">Evitando reparaciones costosas</p>
        </div>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className={`chart-svg ${visible ? 'animate' : ''}`}>
        <defs>
          <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
          </linearGradient>
        </defs>
        {[0, 700, 1400, 2100, 2800].map(v => {
          const y = h - pad - (v / maxVal) * (h - pad * 2);
          return <g key={v}><line x1={pad} y1={y} x2={w-pad} y2={y} stroke="rgba(255,255,255,0.05)" /><text x={pad-4} y={y+4} fill="rgba(255,255,255,0.3)" fontSize="9" textAnchor="end">${v/1000}k</text></g>;
        })}
        <path d={areaD} fill="url(#greenGrad)" className="chart-area" />
        <path d={pathD} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" className="chart-line" />
        {points.map((p, i) => {
          const x = pad + (i / (points.length - 1)) * (w - pad * 2);
          const y = h - pad - (p.value / maxVal) * (h - pad * 2);
          return <circle key={i} cx={x} cy={y} r="4" fill="#10b981" stroke="#0a0a1a" strokeWidth="2" className="chart-dot" style={{ animationDelay: `${0.3 + i * 0.08}s` }} />;
        })}
        {points.map((p, i) => {
          const x = pad + (i / (points.length - 1)) * (w - pad * 2);
          return <text key={i} x={x} y={h - 8} fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="middle">{p.month}</text>;
        })}
      </svg>
    </div>
  );
}

/* ===== ANIMATED CHART: Days Without ===== */
function DaysWithoutChart() {
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);
  const ref = useRef();

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const target = 47;
    const dur = 1500;
    const startTime = performance.now();
    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / dur, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [visible]);

  const ring = 140;
  const stroke = 10;
  const radius = (ring - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = count / 47;

  const milestones = [
    { day: 10, label: 'Primer hito', color: '#f59e0b' },
    { day: 25, label: 'Racha fuerte', color: '#8b5cf6' },
    { day: 47, label: 'Récord total', color: '#10b981' },
  ];

  return (
    <div ref={ref} className="chart-container days-chart">
      <div className="chart-header">
        <div className="chart-icon teal">{Icons.shield('#fff')}</div>
        <div>
          <h4>Días sin olvidos</h4>
          <p className="chart-subtitle">Racha actual del usuario</p>
        </div>
      </div>
      <div className="days-ring-wrap">
        <svg width={ring} height={ring} viewBox={`0 0 ${ring} ${ring}`} className={`days-ring ${visible ? 'animate' : ''}`}>
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          <circle cx={ring/2} cy={ring/2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
          <circle
            cx={ring/2} cy={ring/2} r={radius} fill="none"
            stroke="url(#ringGrad)" strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={visible ? circumference * (1 - progress) : circumference}
            transform={`rotate(-90 ${ring/2} ${ring/2})`}
            style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
          <circle cx={ring/2} cy={ring/2} r={radius - 18} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        </svg>
        <div className="days-counter">
          <span className="days-number">{count}</span>
          <span className="days-label">días</span>
        </div>
      </div>
      <div className="days-milestones">
        {milestones.map((m, i) => (
          <div key={i} className={`milestone ${count >= m.day ? 'reached' : ''}`}>
            <div className="milestone-dot" style={{ background: count >= m.day ? m.color : 'rgba(255,255,255,0.1)' }} />
            <div>
              <div className="milestone-day">{m.day} días</div>
              <div className="milestone-label">{m.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== ANIMATED CHART: Reminders ===== */
function RemindersChart() {
  const [visible, setVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const sinApp = [2, 5, 4, 8, 6, 10, 9, 12, 11, 15, 13, 18];
  const conApp = [18, 17, 16, 14, 12, 10, 7, 4, 2, 1, 0, 0];
  const maxVal = 20;
  const w = 500, h = 200, pad = 30;
  const barW = ((w - pad * 2) / months.length) * 0.35;

  return (
    <div ref={ref} className="chart-container">
      <div className="chart-header">
        <div className="chart-icon purple">{Icons.bellRing('#fff')}</div>
        <div>
          <h4>Olvidos reducidos</h4>
          <p className="chart-subtitle">Olvidos por mes con Alivia</p>
        </div>
      </div>
      <div className="chart-legend">
        <span className="legend-item"><span className="legend-dot red" />Sin Alivia</span>
        <span className="legend-item"><span className="legend-dot green" />Con Alivia</span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className={`chart-svg ${visible ? 'animate' : ''}`}>
        {[0, 5, 10, 15, 20].map(v => {
          const y = h - pad - (v / maxVal) * (h - pad * 2);
          return <g key={v}><line x1={pad} y1={y} x2={w-pad} y2={y} stroke="rgba(255,255,255,0.05)" /><text x={pad-4} y={y+4} fill="rgba(255,255,255,0.3)" fontSize="9" textAnchor="end">{v}</text></g>;
        })}
        {months.map((m, i) => {
          const groupX = pad + (i / months.length) * (w - pad * 2) + ((w - pad * 2) / months.length) * 0.5;
          const hSin = (sinApp[i] / maxVal) * (h - pad * 2);
          const hCon = (conApp[i] / maxVal) * (h - pad * 2);
          return (
            <g key={i}>
              <rect x={groupX - barW - 1} y={h - pad - hSin} width={barW} height={hSin} rx="3" fill="#ef4444" opacity="0.8" className="chart-bar" style={{ animationDelay: `${i * 0.06}s` }} />
              <rect x={groupX + 1} y={h - pad - hCon} width={barW} height={hCon} rx="3" fill="#10b981" opacity="0.8" className="chart-bar" style={{ animationDelay: `${i * 0.06 + 0.03}s` }} />
              <text x={groupX} y={h - 8} fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="middle">{m}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ===== DATA ===== */
const MODULES = [
  { slug: 'hogar', name: 'Hogar', desc: 'Refri, calentador, focos, baterías e impuestos.', items: ['Refrigeradora', 'Calentador', 'Focos', 'Impuestos'] },
  { slug: 'vehiculo', name: 'Vehículo', desc: 'Aceite, SOAT, tecnomecánica y más.', items: ['Cambio de Aceite', 'SOAT', 'Tecnomecánica', 'Frenos'] },
  { slug: 'salud', name: 'Salud', desc: 'Chequeos médicos, dental y vista.', items: ['Médico', 'Odontología', 'Examen Vista'] },
  { slug: 'finanzas', name: 'Finanzas', desc: 'Tarjetas, renta y trámites.', items: ['Tarjetas', 'Declaración Renta'] },
  { slug: 'familia', name: 'Familia', desc: 'Cumpleaños, matrículas y fechas especiales.', items: ['Cumpleaños', 'Matrículas', 'Aniversarios'] },
  { slug: 'mascotas', name: 'Mascotas', desc: 'Vacunas, chequeos y alimento.', items: ['Vacunas', 'Desparasitación', 'Chequeo'] },
  { slug: 'general', name: 'General', desc: 'Crea cualquier recordatorio personalizado.', items: ['Personalizado', 'Flexible'] },
];

const FEATURES = [
  { iconFn: Icons.bellRing, title: 'Notificaciones inteligentes', desc: 'Recibe alertas antes de que se venzan tus compromisos. Nunca más olvidas una fecha importante.', color: 'linear-gradient(135deg, #6366f1, #818cf8)' },
  { iconFn: Icons.smartphone, title: 'Multiplataforma', desc: 'Desde tu celular, tablet o computadora. Todo sincronizado en la nube en tiempo real.', color: 'linear-gradient(135deg, #06b6d4, #22d3ee)' },
  { iconFn: Icons.target, title: 'Módulos especializados', desc: 'Cada área de tu vida tiene su propio módulo con categorías predefinidas y listas para usar.', color: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' },
  { iconFn: Icons.refresh, title: 'Recurrencias automáticas', desc: 'Configura recordatorios diarios, semanales, mensuales o anuales. Se repiten solos.', color: 'linear-gradient(135deg, #ec4899, #f472b6)' },
  { iconFn: Icons.zap, title: 'Prioridades claras', desc: 'Marca lo urgente en rojo, lo importante en amarillo. Vista clara de lo que necesitas.', color: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
  { iconFn: Icons.gift, title: 'Free & Premium', desc: 'Módulos básicos gratis para siempre. Desbloquea más con Premium cuando lo necesites.', color: 'linear-gradient(135deg, #10b981, #34d399)' },
];

const TESTIMONIALS = [
  { name: 'Laura G.', role: 'Madre de familia', text: 'Con Alivia nunca olvido las vacunas de mis hijos ni los cumpleaños de la familia. ¡Cambió mi vida!', avatar: 'L' },
  { name: 'Carlos M.', role: 'Emprendedor', text: 'Dejé de pagar multas por SOAT vencido. La app me avisa con tiempo de sobra. Imprescindible.', avatar: 'C' },
  { name: 'María P.', role: 'Profesional', text: 'Organizar todos los mantenimientos de mi casa y carro en un solo lugar es exactamente lo que necesitaba.', avatar: 'M' },
  { name: 'Andrés R.', role: 'Ingeniero', text: 'El módulo de finanzas me ayudó a detectar suscripciones que pagaba sin usar. Ahorro $80.000 al mes. ¡Y $80.000 más cada semana ya que no se me olvidan mis pagos! ¡Gracias Alivia!', avatar: 'A' },
  { name: 'Diana L.', role: 'Doctora', text: 'Mis pacientes me preguntan cómo recuerdo todo. La respuesta es Alivia. No hay excusa para olvidar una cita.', avatar: 'D' },
  { name: 'Felipe O.', role: 'Diseñador', text: 'Tenía 3 mascotas y siempre olvidaba la fecha de vacunas. Ahora Alivia me avisa una semana antes. Perfecto.', avatar: 'F' },
  { name: 'Valentina S.', role: 'Contadora', text: 'Los recordatorios de impuestos y pólizas me salvaron de una multa. La mejor app que he descargado.', avatar: 'V' },
];

/* ===== MAIN COMPONENT ===== */
export default function LandingPage({ onOpenAuth, authOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const fadeRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); }); },
      { threshold: 0.1 }
    );
    fadeRefs.current.forEach(el => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const addFadeRef = (el) => { if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el); };

  const LogoIcon = () => (
    <img src="/LOGO2.png" alt="Alivia" className="nav-logo-img" />
  );

  return (
    <>
      <div className="landing-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="grid-bg" />
        <Particles />
      </div>

      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <a className="nav-logo" href="#">
          <img src="/FONDO2BG-removebg-preview.png" alt="Alivia" className="nav-logo-img" />
        </a>
        <div className="nav-actions">
          <button className="nav-btn nav-btn-ghost" onClick={() => onOpenAuth('login')}>Iniciar Sesión</button>
          <button className="nav-btn nav-btn-primary" onClick={() => onOpenAuth('register')}>Empezar Gratis</button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-prism-bg">
          <Prism
            animationType="rotate"
            timeScale={0.5}
            height={3.5}
            baseWidth={5.5}
            scale={3.6}
            hueShift={0}
            colorFrequency={1}
            noise={0}
            glow={1}
          />
        </div>
        <div className="hero-split">
          <div className="hero-left">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              La paz de saber que no olvidarás nada
            </div>

            <h1>
              Nunca olvides<br />
              <span className="gradient-text dynamic-gradient">lo importante</span>
            </h1>

            <p className="hero-subtitle">
              Mantenimiento del hogar, carro, salud, finanzas, familia y mascotas.
              Todo en una sola app con recordatorios inteligentes que se adaptan a tu vida.
            </p>

            <div className="hero-cta">
              <button className="btn-hero btn-hero-primary" onClick={() => onOpenAuth('register')}>
                <span>Comenzar Ahora — Es Gratis</span>
              </button>
              <button className="btn-hero btn-hero-outline" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
                Conocer Más
              </button>
            </div>
          </div>

          <div className="hero-right hero-bento">
            <MagicBento
              textAutoHide={true}
              enableStars={true}
              enableSpotlight={!authOpen}
              enableBorderGlow={true}
              enableTilt={false}
              enableMagnetism={false}
              clickEffect={true}
              spotlightRadius={400}
              particleCount={12}
              glowColor="99, 102, 241"
              disableAnimations={false}
            />
          </div>
        </div>
      </section>

      <section className="stats-bar">
        <div className="stat-item"><div className="stat-number">7+</div><div className="stat-label">Módulos especializados</div></div>
        <div className="stat-item"><div className="stat-number">25+</div><div className="stat-label">Categorías predefinidas</div></div>
        <div className="stat-item"><div className="stat-number">24/7</div><div className="stat-label">Notificaciones activas</div></div>
        <div className="stat-item"><div className="stat-number">100%</div><div className="stat-label">Gratuito para empezar</div></div>
      </section>

      {/* CHARTS SECTION */}
      <section className="charts-section">
        <div className="section-header fade-in" ref={addFadeRef}>
          <span className="section-tag">Resultados que se ven</span>
          <h2>Alivia funciona.<br /><span className="gradient-text dynamic-gradient">Los números lo comprueban</span></h2>
        </div>
        <div className="charts-grid">
          <div className="fade-in" ref={addFadeRef}><SavingsChart /></div>
          <div className="fade-in" ref={addFadeRef} style={{ transitionDelay: '0.15s' }}><RemindersChart /></div>
          <div className="fade-in" ref={addFadeRef} style={{ transitionDelay: '0.3s' }}><DaysWithoutChart /></div>
        </div>
      </section>

      <section className="features" id="features">
        <div className="section-header fade-in" ref={addFadeRef}>
          <span className="section-tag">Funcionalidades</span>
          <h2>Todo lo que necesitas,<br /><span className="gradient-text dynamic-gradient">a un clic de distancia</span></h2>
          <p>Diseñado para adultos reales que tienen cosas importantes que no pueden darse el lujo de olvidar.</p>
        </div>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card fade-in" ref={addFadeRef} style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="feature-icon" style={{ background: f.color }}>{f.iconFn('#fff')}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="modules-showcase" id="modules">
        <div className="section-header fade-in" ref={addFadeRef}>
          <span className="section-tag">Módulos</span>
          <h2>Una app.<br /><span className="gradient-text dynamic-gradient">Siete módulos.</span></h2>
          <p>Cada área de tu vida adulta tiene su espacio con categorías listas para usar.</p>
        </div>
        <div className="modules-scroll">
          <div className="modules-track">
            {[...MODULES, ...MODULES].map((m, i) => (
              <div key={i} className="module-card-lg">
                <div className="mod-icon-svg" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(6,182,212,0.15))' }}>
                  {MODULE_ICONS_SVG[m.slug] ? MODULE_ICONS_SVG[m.slug]('#818cf8') : Icons.bell('#818cf8')}
                </div>
                <h3>{m.name}</h3>
                <p>{m.desc}</p>
                <div className="mod-items">
                  {m.items.map((item, j) => <span key={j} className="mod-item">{item}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="section-header fade-in" ref={addFadeRef}>
          <span className="section-tag">Testimonios</span>
          <h2>Lo que dicen<br /><span className="gradient-text dynamic-gradient">nuestros usuarios</span></h2>
        </div>
        <div className="testimonials-scroll">
          <div className="testimonials-track">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-stars">{'★'.repeat(5)}</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.avatar}</div>
                  <div><div className="testimonial-name">{t.name}</div><div className="testimonial-role">{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-box fade-in" ref={addFadeRef}>
          <h2>¿Listo para olvidar<br /><span className="gradient-text dynamic-gradient">menos cosas?</span></h2>
          <p>Crea tu cuenta gratis en 30 segundos. Sin tarjeta de crédito. Sin compromiso.</p>
          <button className="btn-hero btn-hero-primary" onClick={() => onOpenAuth('register')}>
            <span>Crear Mi Cuenta Gratis</span>
          </button>
        </div>
      </section>

      <footer className="footer">
        <p>Alivia — La paz de no preocuparte por olvidar nada. © 2026</p>
      </footer>
    </>
  );
}
