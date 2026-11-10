import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { EyeIcon, EyeOffIcon, AlertTriangleIcon, ShieldIcon, UserIcon } from '../components/Icons';

const EMAIL_REGEX = /^[\w\.-]+@([\w-]+\.)+[\w-]{2,4}$/;

export function LoginView() {
  const { login } = useAuth();

  // Credenciales precargadas del Administrador Principal para facilitar la revisión del docente
  const [email, setEmail] = useState('admin@elanwatches.com');
  const [password, setPassword] = useState('AdminPass2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'El correo electrónico es un campo obligatorio.';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      errs.email = 'Ingrese un correo electrónico con formato válido.';
    }

    if (!password) {
      errs.password = 'La contraseña es un campo obligatorio.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);

    if (!validate()) return;

    try {
      setLoading(true);
      await login(email.trim(), password);
    } catch (err) {
      setAuthError({
        message: err.message || 'Error al iniciar sesión.',
        isInactive: err.status === 403 || err.data?.error === 'ACCOUNT_INACTIVE'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPreset = (presetEmail, presetPass) => {
    setEmail(presetEmail);
    setPassword(presetPass);
    setErrors({});
    setAuthError(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1rem',
      background: 'radial-gradient(ellipse at 50% 20%, #171511 0%, #08080a 75%)'
    }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        
        {/* Cabecera de Marca de Lujo y Datos Académicos */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="brand-emblem" style={{ width: '60px', height: '60px', margin: '0 auto 1rem auto' }}>
            <span style={{ fontSize: '1.85rem' }}>É</span>
          </div>
          <h1 className="brand-name" style={{ fontSize: '1.75rem', letterSpacing: '0.28em', marginBottom: '0.35rem' }}>
            ÉLAN WATCHES
          </h1>
          <span className="brand-subtitle" style={{ fontSize: '0.74rem', letterSpacing: '0.3em', display: 'block', marginBottom: '0.75rem' }}>
            SUBSISTEMA DE SEGURIDAD Y CONTROL DE ACCESO
          </span>

          {/* Ficha Académica del Grupo 22 */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.3rem 0.85rem',
            background: 'rgba(197, 160, 89, 0.08)',
            border: '1px solid rgba(197, 160, 89, 0.25)',
            borderRadius: '50px',
            fontSize: '0.72rem',
            color: 'var(--text-secondary)'
          }}>
            <span style={{ color: 'var(--gold-light)', fontWeight: 600 }}>SIS 324</span>
            <span>•</span>
            <span>Grupo 22</span>
            <span>•</span>
            <span>Docente: Ing. Ramiro Alberto Duran Quiroga</span>
          </div>
        </div>

        {/* Tarjeta del Formulario de Login */}
        <div className="card card-luxury" style={{ padding: '2.25rem' }}>
          <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
              Iniciar Sesión
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Acceda a la plataforma administrativa y operativa de Élan Watches
            </p>
          </div>

          {/* Banner de Errores de Autenticación */}
          {authError && (
            <div className={`alert ${authError.isInactive ? 'alert-warning' : 'alert-danger'}`}>
              <AlertTriangleIcon size={18} />
              <div>
                <strong style={{ display: 'block', marginBottom: '0.15rem' }}>
                  {authError.isInactive ? 'Cuenta Desactivada' : 'Error de Autenticación'}
                </strong>
                <span>{authError.message}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Campo Correo Electrónico */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Correo Electrónico</label>
              <input
                id="login-email"
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="ejemplo@elanwatches.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: null }));
                }}
                disabled={loading}
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            {/* Campo Contraseña con visualizador */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Contraseña</label>
              <div className="input-with-action">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors(prev => ({ ...prev, password: null }));
                  }}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="input-action-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                  title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            {/* Botón de Envío */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.75rem', padding: '0.85rem' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  <span>Verificando Credenciales...</span>
                </>
              ) : (
                <span>Ingresar al Sistema</span>
              )}
            </button>
          </form>

          {/* Garantías de Seguridad */}
          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            color: 'var(--text-muted)',
            fontSize: '0.72rem'
          }}>
            <ShieldIcon size={14} color="var(--gold-primary)" />
            <span>Sesiones HttpOnly con tokens CSRF y hash criptográfico Werkzeug</span>
          </div>
        </div>

        {/* Panel de Revisión para el Docente con accesos rápidos a cuentas existentes */}
        <div style={{
          marginTop: '1.5rem',
          padding: '1.15rem 1.25rem',
          background: 'rgba(21, 21, 27, 0.85)',
          border: '1px solid var(--gold-border)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 4px 18px rgba(0, 0, 0, 0.4)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
            <strong style={{ color: 'var(--gold-light)', fontSize: '0.82rem', letterSpacing: '0.05em' }}>
              ⚡ Acceso Rápido para Revisión Docente:
            </strong>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>1-clic para cargar</span>
          </div>

          <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '0.85rem', lineHeight: 1.4 }}>
            Las credenciales del <strong>Administrador Principal</strong> vienen pre-cargadas por defecto en el formulario para facilitar su evaluación inmediata.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {/* Opción 1: Admin Principal */}
            <button
              type="button"
              className="btn btn-secondary"
              style={{
                width: '100%',
                justifyContent: 'space-between',
                padding: '0.55rem 0.85rem',
                fontSize: '0.75rem',
                border: email === 'admin@elanwatches.com' ? '1px solid var(--gold-primary)' : '1px solid var(--border-muted)',
                background: email === 'admin@elanwatches.com' ? 'var(--gold-subtle)' : 'var(--bg-surface)'
              }}
              onClick={() => loadPreset('admin@elanwatches.com', 'AdminPass2026!')}
            >
              <span>👑 <strong>Administrador Principal</strong> (`admin@elanwatches.com`)</span>
              <span className="badge badge-admin" style={{ fontSize: '0.65rem' }}>ADMIN</span>
            </button>

            {/* Opción 2: Cliente */}
            <button
              type="button"
              className="btn btn-secondary"
              style={{
                width: '100%',
                justifyContent: 'space-between',
                padding: '0.55rem 0.85rem',
                fontSize: '0.75rem',
                border: email === 'juanperes@gmail.com' ? '1px solid var(--gold-primary)' : '1px solid var(--border-muted)',
                background: email === 'juanperes@gmail.com' ? 'var(--gold-subtle)' : 'var(--bg-surface)'
              }}
              onClick={() => loadPreset('juanperes@gmail.com', '12345678')}
            >
              <span>👤 <strong>Juan Perez</strong> (`juanperes@gmail.com`)</span>
              <span className="badge badge-cliente" style={{ fontSize: '0.65rem' }}>CLIENTE</span>
            </button>

            {/* Opción 3: Cuenta Inactiva */}
            <button
              type="button"
              className="btn btn-secondary"
              style={{
                width: '100%',
                justifyContent: 'space-between',
                padding: '0.55rem 0.85rem',
                fontSize: '0.75rem',
                border: email === 'gerard@elanwatches.com' ? '1px solid var(--color-danger)' : '1px solid var(--border-muted)',
                background: email === 'gerard@elanwatches.com' ? 'var(--color-danger-bg)' : 'var(--bg-surface)'
              }}
              onClick={() => loadPreset('gerard@elanwatches.com', 'AlmacenPass2026!')}
            >
              <span>🚫 <strong>Gerard Perregaux</strong> (Prueba de Bloqueo 403)</span>
              <span className="badge badge-inactive" style={{ fontSize: '0.65rem' }}>INACTIVO</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
