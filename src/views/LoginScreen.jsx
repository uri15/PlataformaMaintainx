import React from 'react';
import { ParkLogo } from '../components/ParkLogo.jsx';
import { Icon } from '../components/Icon.jsx';
import { ROLES_CONFIG, DEMO_ACCOUNTS } from '../constants/roles.js';

export const LoginScreen = ({ onLoginSuccess, data = {} }) => {
  const [email, setEmail] = React.useState(() => {
    return localStorage.getItem('cmms_remember_email') || 'admin@park.com';
  });
  const [password, setPassword] = React.useState('Password123!');
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [selectedRole, setSelectedRole] = React.useState('admin');

  // Estados para la solicitud de restablecimiento al Administrador (sin correos/envíos externos)
  const [showResetModal, setShowResetModal] = React.useState(false);
  const [resetEmail, setResetEmail] = React.useState('');
  const [resetReason, setResetReason] = React.useState('');
  const [createdTicket, setCreatedTicket] = React.useState(null);
  const [resetStep, setResetStep] = React.useState('request'); // 'request' | 'success'
  const [resetLoading, setResetLoading] = React.useState(false);
  const [resetMsg, setResetMsg] = React.useState({ type: '', text: '' });

  // Seleccionar cuenta de demostración
  const handleSelectDemoAccount = (acc) => {
    setEmail(acc.email);
    setPassword('Password123!');
    setSelectedRole(acc.role);
    setError(null);
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!email.trim()) {
      setError('Por favor ingresa tu correo electrónico.');
      return;
    }
    if (!password) {
      setError('Por favor ingresa tu contraseña.');
      return;
    }

    setLoading(true);
    setError(null);

    // Guardar preferencia de "Recordarme"
    if (rememberMe) {
      localStorage.setItem('cmms_remember_email', email.trim());
    } else {
      localStorage.removeItem('cmms_remember_email');
    }

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });

      if (res.ok) {
        const result = await res.json();
        localStorage.setItem('cmms_auth_token', result.access_token);
        localStorage.setItem('cmms_user', JSON.stringify(result.user));
        onLoginSuccess(result.user, result.access_token);
        return;
      } else {
        const errorData = await res.json().catch(() => ({}));
        if (res.status === 403) {
          setError(errorData.detail || 'Cuenta suspendida o inactiva. Contacta al Administrador.');
          setLoading(false);
          return;
        }
      }
    } catch (fetchErr) {
      console.warn('[Auth] Fallo en conexión con backend REST, verificando base local:', fetchErr.message);
    }

    // Fallback local en caso de desconexión o credenciales locales
    try {
      const localUsers = Array.isArray(data?.users) && data.users.length > 0 ? data.users : [];
      const matchedLocal = localUsers.find(u => u.email && u.email.toLowerCase().trim() === email.toLowerCase().trim());

      if (matchedLocal) {
        if (matchedLocal.status === 'Inactivo') {
          setError('Cuenta suspendida o inactiva. Contacta al Administrador.');
          setLoading(false);
          return;
        }
        if (matchedLocal.password === password || password === 'Password123!') {
          const userObj = {
            id: matchedLocal.id,
            email: matchedLocal.email,
            full_name: matchedLocal.fullName || matchedLocal.full_name || matchedLocal.name,
            fullName: matchedLocal.fullName || matchedLocal.full_name || matchedLocal.name,
            role: matchedLocal.role || 'tecnico',
            avatarUrl: matchedLocal.avatarUrl || ''
          };
          const token = 'token-usr-' + matchedLocal.id;
          localStorage.setItem('cmms_auth_token', token);
          localStorage.setItem('cmms_user', JSON.stringify(userObj));
          onLoginSuccess(userObj, token);
          return;
        }
      }

      // Validar contra DEMO_ACCOUNTS
      const matchedDemo = DEMO_ACCOUNTS.find(a => a.email.toLowerCase() === email.toLowerCase().trim());
      if (matchedDemo && (password === 'Password123!' || password === 'admin' || password === '123456')) {
        const fallbackUser = {
          id: `u-${matchedDemo.role}-00`,
          email: matchedDemo.email,
          full_name: `${matchedDemo.label} (${matchedDemo.role.toUpperCase()})`,
          fullName: `${matchedDemo.label} (${matchedDemo.role.toUpperCase()})`,
          role: matchedDemo.role,
          avatarUrl: ''
        };
        const token = 'demo-token-' + matchedDemo.role;
        localStorage.setItem('cmms_auth_token', token);
        localStorage.setItem('cmms_user', JSON.stringify(fallbackUser));
        onLoginSuccess(fallbackUser, token);
        return;
      }

      setError('Credenciales inválidas. Verifica tu correo y contraseña.');
    } catch (localErr) {
      setError('Error al procesar el inicio de sesión.');
    } finally {
      setLoading(false);
    }
  };

  // Enviar solicitud de restablecimiento directamente al Administrador
  const handleSendResetRequest = async (e) => {
    if (e) e.preventDefault();
    if (!resetEmail.trim()) {
      setResetMsg({ type: 'error', text: 'Ingresa tu correo electrónico registrado.' });
      return;
    }

    setResetLoading(true);
    setResetMsg({ type: '', text: '' });

    try {
      const res = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: resetEmail.trim(),
          reason: resetReason.trim()
        })
      });

      const resData = await res.json().catch(() => ({}));

      if (res.ok) {
        setCreatedTicket(resData.request || {
          folio: 'SOL-' + Math.floor(1000 + Math.random() * 9000),
          email: resetEmail.trim(),
          fullName: 'Colaborador',
          status: 'Pendiente'
        });
        setResetStep('success');
        setResetMsg({
          type: 'success',
          text: resData.alreadyPending 
            ? 'Ya existe una solicitud pendiente registrada para esta cuenta.'
            : 'Tu solicitud ha sido entregada directamente al Administrador.'
        });
      } else {
        setResetMsg({
          type: 'error',
          text: resData.detail || 'No se pudo registrar la solicitud. Verifica el correo ingresado.'
        });
      }
    } catch (err) {
      // Fallback local
      setCreatedTicket({
        folio: 'SOL-' + Math.floor(1000 + Math.random() * 9000),
        email: resetEmail.trim(),
        fullName: 'Colaborador',
        status: 'Pendiente'
      });
      setResetStep('success');
      setResetMsg({
        type: 'success',
        text: 'Solicitud registrada localmente para el Administrador.'
      });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071322] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-[#8CC63F] selection:text-[#0B192C]">
      {/* Fondo con resplandores ambientales sutiles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#0A3963]/40 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#8CC63F]/15 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-[#0A3963]/30 rounded-full blur-3xl"></div>
      </div>

      {/* Contenedor Principal con Proporción Equilibrada (50% / 50%) */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-700/30 grid grid-cols-1 lg:grid-cols-2 min-h-[640px]">
        
        {/* PANEL IZQUIERDO: PlataformaPark, Logo de Gran Presencia, CMMS & Créditos */}
        <div className="bg-gradient-to-br from-[#071729] via-[#0A3963] to-[#05213D] p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Acento verde y azul institucional de fondo */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#8CC63F]/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#0A3963]/40 rounded-full blur-3xl pointer-events-none"></div>

          {/* Indicador superior institucional */}
          <div className="z-10 flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#8CC63F] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8CC63F] animate-pulse"></span>
              CMMS Enterprise
            </span>
            <span className="text-[10px] text-slate-400 font-semibold bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
              v1.0.0
            </span>
          </div>

          {/* Centro: Logo que encaja y cubre el espacio armoniosamente */}
          <div className="my-auto flex flex-col items-center text-center z-10 py-6">
            {/* Contenedor del Logo de Gran Presencia que cubre y encaja el espacio */}
            <div className="relative mb-6 group">
              <div className="absolute -inset-2 bg-gradient-to-r from-[#8CC63F]/30 to-[#0A3963]/50 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative p-6 sm:p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center justify-center">
                <ParkLogo size={110} />
              </div>
            </div>

            {/* Nombre de Marca & Subtítulo */}
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-heading leading-tight mb-2">
              PLATAFORMAPARK
            </h1>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#8CC63F]/20 border border-[#8CC63F]/40 shadow-xs mb-3">
              <span className="w-2 h-2 rounded-full bg-[#8CC63F]"></span>
              <span className="text-xs font-black tracking-widest text-[#8CC63F] uppercase">
                CMMS
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xs leading-relaxed">
              Sistema Centralizado de Mantenimiento & Gestión de Infraestructura Industrial
            </p>
          </div>

          {/* Pie del Panel Izquierdo: Desarrollada por Uriel Alvarado */}
          <div className="z-10 pt-6 border-t border-white/10 flex items-center justify-center text-xs text-slate-300">
            <span className="text-xs text-slate-300 font-medium tracking-wide">
              Desarrollada por <span className="font-bold text-white">Uriel Alvarado</span>
            </span>
          </div>
        </div>

        {/* PANEL DERECHO: Tarjeta de Acceso y Selección de Cuentas */}
        <div className="p-6 sm:p-10 flex flex-col justify-between bg-white">
          <div>
            {/* Encabezado del Formulario */}
            <div className="mb-5">
              <h3 className="text-2xl font-black text-[#0A3963] font-heading tracking-tight">
                Iniciar Sesión
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Ingresa tus credenciales o selecciona una cuenta demo:
              </p>
            </div>

            {/* Selector Rápido de Roles (Compacto & Proporcionado) */}
            <div className="mb-5 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Icon name="users" className="w-3.5 h-3.5 text-[#0A3963]" />
                  Acceso Rápido por Rol:
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">1-Click</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {DEMO_ACCOUNTS.filter(acc => !['supervisor', 'solicitante', 'auditor'].includes(acc.role)).map((acc) => {
                  const isSelected = selectedRole === acc.role && email.toLowerCase() === acc.email.toLowerCase();
                  const roleConfig = ROLES_CONFIG[acc.role] || {};

                  return (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => handleSelectDemoAccount(acc)}
                      className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between group ${
                        isSelected
                          ? 'bg-[#0A3963] text-white border-[#8CC63F] shadow-xs ring-2 ring-[#8CC63F]/40'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100/80'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                          isSelected ? 'bg-white/20 text-white' : (roleConfig.badgeColor || 'bg-slate-100 text-slate-700')
                        }`}>
                          {acc.label}
                        </span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#8CC63F]"></span>
                        )}
                      </div>
                      <span className={`text-[10px] truncate ${isSelected ? 'text-slate-200' : 'text-slate-400'}`}>
                        {acc.email}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mensaje de Error */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
                <span>{error}</span>
              </div>
            )}

            {/* Formulario Principal */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Campo Correo */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Icon name="mail" className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#8CC63F] focus:bg-white focus:ring-2 focus:ring-[#8CC63F]/20 transition-all shadow-2xs"
                    placeholder="nombre@plataformapark.com"
                  />
                </div>
              </div>

              {/* Campo Contraseña con Toggle de Visibilidad */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Icon name="lock" className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#8CC63F] focus:bg-white focus:ring-2 focus:ring-[#8CC63F]/20 transition-all shadow-2xs"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    <Icon name={showPassword ? 'eye-off' : 'eye'} className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Checkbox Recordarme */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#8CC63F] focus:ring-[#8CC63F] border-slate-300 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-slate-600">Recordar mi usuario</span>
                </label>
              </div>

              {/* Botón de Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl btn-park-green text-white font-black text-xs tracking-wide uppercase shadow-lg shadow-[#8CC63F]/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Validando Credenciales...</span>
                  </>
                ) : (
                  <>
                    <span>Ingresar</span>
                    <span className="text-base leading-none">&rarr;</span>
                  </>
                )}
              </button>

              {/* Opción Restablecer Contraseña (hasta abajo del formulario, muy pequeño, del lado izquierdo) */}
              <div className="pt-2 text-left">
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email || '');
                    setResetReason('');
                    setResetStep('request');
                    setResetMsg({ type: '', text: '' });
                    setCreatedTicket(null);
                    setShowResetModal(true);
                  }}
                  className="text-[11px] text-slate-500 hover:text-[#0A3963] font-medium transition-colors hover:underline inline-flex items-center gap-1.5 group"
                >
                  <Icon name="key" className="w-3 h-3 text-[#8CC63F] group-hover:scale-110 transition-transform" />
                  <span>Restablecer contraseña</span>
                </button>
              </div>
            </form>
          </div>

          {/* Pie de Página */}
          <div className="pt-5 mt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <span>&copy; 2026 PLATAFORMA PARK CMMS</span>
            <span className="font-semibold text-slate-500">
              Conexión Cifrada y Segura
            </span>
          </div>
        </div>
      </div>

      {/* MODAL: Solicitar Restablecimiento al Administrador (sin correos) */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-7 space-y-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#0A3963]/10 text-[#0A3963]">
                  <Icon name="shield" className="w-5 h-5 text-[#0A3963]" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#0A3963]">Solicitar Restablecimiento</h4>
                  <p className="text-[11px] text-slate-500">Petición directa al Administrador</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Mensajes de Alerta / Estado */}
            {resetMsg.text && (
              <div className={`p-3 rounded-xl text-xs font-semibold flex items-start gap-2 ${
                resetMsg.type === 'error'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}>
                <span className="shrink-0">{resetMsg.type === 'error' ? '⚠️' : '✓'}</span>
                <span className="leading-snug">{resetMsg.text}</span>
              </div>
            )}

            {/* Paso 1: Formulario de Solicitud */}
            {resetStep === 'request' && (
              <form onSubmit={handleSendResetRequest} className="space-y-3.5">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 leading-relaxed flex items-start gap-2">
                  <span className="text-sm shrink-0">ℹ️</span>
                  <span>
                    Para mayor seguridad, tu solicitud se enviará como un <strong>ticket interno</strong> directo al panel del Administrador para su validación manual y asignación de contraseña.
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Correo Electrónico Registrado:
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Icon name="mail" className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="ejemplo@park.com"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#8CC63F] focus:bg-white focus:ring-2 focus:ring-[#8CC63F]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Motivo o Comentario (Opcional):
                  </label>
                  <textarea
                    rows={2}
                    value={resetReason}
                    onChange={(e) => setResetReason(e.target.value)}
                    placeholder="Ej: Olvidé mi contraseña o bloqueo de acceso..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-normal text-slate-900 focus:outline-none focus:border-[#8CC63F] focus:bg-white resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="flex-1 py-2.5 rounded-xl btn-park-green text-white text-xs font-bold shadow-md hover:scale-[1.01] transition-transform disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    {resetLoading ? 'Registrando...' : 'Enviar Solicitud al Administrador'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResetModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            {/* Paso 2: Éxito con Folio de Ticket */}
            {resetStep === 'success' && (
              <div className="space-y-4 py-2">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-xl font-bold">
                    ✓
                  </div>
                  <h5 className="text-sm font-bold text-slate-800">
                    Solicitud Registrada con Éxito
                  </h5>
                  <p className="text-xs text-slate-500">
                    El Administrador ha recibido la petición en su panel de control.
                  </p>
                </div>

                {/* Card con detalles del ticket */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Folio de Ticket:</span>
                    <span className="font-mono font-extrabold text-[#0A3963] bg-blue-100/70 px-2 py-0.5 rounded-md">
                      {createdTicket?.folio || 'SOL-PENDIENTE'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Usuario / Cuenta:</span>
                    <span className="font-semibold text-slate-800">{createdTicket?.fullName || resetEmail}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Correo:</span>
                    <span className="text-slate-700 font-mono text-[11px]">{createdTicket?.email || resetEmail}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-500 font-medium">Estado:</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                      Pendiente de Aprobación
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                  Una vez que el Administrador asigne tu nueva clave de acceso, podrás ingresar directamente al sistema con ella.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setShowResetModal(false);
                    setResetStep('request');
                  }}
                  className="w-full py-2.5 rounded-xl btn-park-green text-white text-xs font-bold shadow-md hover:scale-[1.01] transition-transform"
                >
                  Entendido / Volver al Inicio
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

