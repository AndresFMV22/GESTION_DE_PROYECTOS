import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Icons, { MODULE_ICONS_SVG } from './Icons';

export default function Sidebar({ user, modules = [], activeModule }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/FONDO2BG-removebg-preview.png" alt="Alivia" className="sidebar-logo-img" />
        <p>{user?.name}</p>
      </div>
      <nav className="sidebar-nav">
        <Link to="/dashboard" className={!activeModule ? 'active' : ''}>
          <span className="icon">{Icons.dashboard()}</span> Dashboard
        </Link>
        {modules.map(mod => (
          <Link
            key={mod.id}
            to={`/module/${mod.id}`}
            className={activeModule === mod.id ? 'active' : ''}
          >
            <span className="icon">{MODULE_ICONS_SVG[mod.slug]?.()}</span> {mod.name}
          </Link>
        ))}
        <a onClick={handleLogout} style={{ cursor: 'pointer', marginTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16 }}>
          <span className="icon">{Icons.logout()}</span> Cerrar sesión
        </a>
      </nav>
    </aside>
  );
}