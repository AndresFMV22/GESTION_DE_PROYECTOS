import React, { useState, Component } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import AuthModal from './components/AuthModal';
import DashboardPage from './pages/DashboardPage';
import ModulePage from './pages/ModulePage';
import PaymentPage from './pages/PaymentPage';

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null, info: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { this.setState({ info }); }
  render() {
    if (this.state.error) {
      return (
        <div style={{ background: '#0a0a1a', color: '#e2e8f0', minHeight: '100vh', padding: 40, fontFamily: 'monospace', whiteSpace: 'pre-wrap', overflow: 'auto' }}>
          <h2 style={{ color: '#ef4444', marginBottom: 16 }}>Error de React</h2>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: 20, borderRadius: 8, marginBottom: 16 }}>
            <strong style={{ color: '#ef4444' }}>{this.state.error.message}</strong>
            {this.state.info && <pre style={{ marginTop: 12, fontSize: 13, color: '#94a3b8' }}>{this.state.info.componentStack}</pre>}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function LandingWithAuth() {
  const [authModal, setAuthModal] = useState(null);
  return (
    <>
      <LandingPage onOpenAuth={(mode) => setAuthModal(mode)} authOpen={!!authModal} />
      {authModal && <AuthModal initialMode={authModal} onClose={() => setAuthModal(null)} />}
    </>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ background: '#0a0a1a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(99,102,241,0.2)', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
  return user ? children : <Navigate to="/" />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ background: '#0a0a1a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(99,102,241,0.2)', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
  return user ? <Navigate to="/dashboard" /> : children;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PublicRoute><LandingWithAuth /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><LandingWithAuth /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><LandingWithAuth /></PublicRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/module/:moduleId" element={<ProtectedRoute><ModulePage /></ProtectedRoute>} />
            <Route path="/payment/:moduleId" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
