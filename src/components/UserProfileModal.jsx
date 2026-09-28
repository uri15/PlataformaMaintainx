import React from 'react';
import { Icon } from './Icon.jsx';
import { SafeImage } from './SafeImage.jsx';
import { ROLES_CONFIG } from '../constants/roles.js';
import { compressImageFile } from '../utils/imageCompressor.js';
import { uploadFileToServer } from '../utils/fileUpload.js';

export const UserProfileModal = ({ isOpen, onClose, currentUser, onSaveProfile, users = [] }) => {
  if (!isOpen || !currentUser) return null;

  // Buscar datos completos del usuario en la lista de usuarios si existen
  const fullUserRecord = users.find(u => 
    (u.id && u.id === currentUser.id) || 
    (u.email && u.email.toLowerCase() === currentUser.email?.toLowerCase())
  ) || {};

  const userRole = currentUser.role || 'tecnico';
  const roleConfig = ROLES_CONFIG[userRole] || ROLES_CONFIG['tecnico'];
  const isAdminOrDev = userRole === 'admin' || userRole === 'developer';

  const [fullName, setFullName] = React.useState(currentUser.full_name || fullUserRecord.fullName || '');
  const [phone, setPhone] = React.useState(currentUser.phone || fullUserRecord.phone || '');
  const [department, setDepartment] = React.useState(currentUser.department || fullUserRecord.department || 'Mantenimiento');
  const [avatarUrl, setAvatarUrl] = React.useState(currentUser.avatarUrl || fullUserRecord.avatarUrl || '');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPasswordFields, setShowPasswordFields] = React.useState(false);
  const [feedbackMsg, setFeedbackMsg] = React.useState({ type: '', text: '' });

  const fileInputRef = React.useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setFeedbackMsg({ type: 'error', text: 'La imagen no debe superar los 2MB.' });
        return;
      }
      try {
        const result = await uploadFileToServer(file, { folder: 'avatars', maxWidth: 400, maxHeight: 400, quality: 0.85 });
        if (result && result.url) {
          setAvatarUrl(result.url);
        }
      } catch (err) {
        console.error('Error al subir avatar:', err);
      }
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setFeedbackMsg({ type: '', text: '' });

    if (isAdminOrDev && !fullName.trim()) {
      setFeedbackMsg({ type: 'error', text: 'El nombre no puede estar vacío.' });
      return;
    }

    if (showPasswordFields && newPassword) {
      if (newPassword.length < 6) {
        setFeedbackMsg({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres.' });
        return;
      }
      if (newPassword !== confirmPassword) {
        setFeedbackMsg({ type: 'error', text: 'Las contraseñas no coinciden.' });
        return;
      }
    }

    const updatedUser = {
      ...currentUser,
      full_name: isAdminOrDev ? fullName.trim() : (currentUser.full_name || fullUserRecord.fullName),
      fullName: isAdminOrDev ? fullName.trim() : (currentUser.full_name || fullUserRecord.fullName),
      phone: phone.trim(),
      department: isAdminOrDev ? department.trim() : (currentUser.department || fullUserRecord.department || 'General'),
      avatarUrl: avatarUrl,
      ...(showPasswordFields && newPassword ? { password: newPassword } : {})
    };

    onSaveProfile(updatedUser);
    setFeedbackMsg({ type: 'success', text: 'Perfil actualizado con éxito.' });
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const initials = (fullName || currentUser.full_name || 'U')
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden space-y-0 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header con Membrete Corporativo */}
        <div className="bg-[#0A3963] p-6 text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#8CC63F]/20 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-white/10 border border-white/20">
                <Icon name="users" className="w-5 h-5 text-white" />
              </span>
              <div>
                <h3 className="text-lg font-extrabold font-heading text-white">Mi Perfil de Usuario</h3>
                <p className="text-[11px] text-slate-300">
                  {isAdminOrDev ? 'Información y configuración de cuenta administrativa' : 'Consulta de información y personalización de perfil'}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold text-sm text-white transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Cuerpo del Modal */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {feedbackMsg.text && (
            <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
              feedbackMsg.type === 'error' 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              <Icon name={feedbackMsg.type === 'error' ? 'alert' : 'check'} className="w-4 h-4 shrink-0" />
              <span>{feedbackMsg.text}</span>
            </div>
          )}

          {/* Foto de Perfil / Avatar Interactivo */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <SafeImage 
                src={avatarUrl} 
                alt="Avatar" 
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md group-hover:opacity-80 transition-opacity"
                fallbackContent={
                  <div className="w-16 h-16 rounded-full bg-[#0A3963] text-white flex items-center justify-center font-extrabold text-xl border-2 border-white shadow-md group-hover:bg-[#0A3963]/80 transition-colors">
                    {initials}
                  </div>
                }
              />
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Icon name="edit" className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="font-bold text-sm text-slate-900">{fullName || currentUser.full_name || 'Usuario'}</span>
                
              </div>
              <p className="text-[11px] text-slate-500">{currentUser.email}</p>
              
              <div className="pt-1 flex flex-wrap gap-2 justify-center sm:justify-start">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-[11px] font-bold text-slate-700 shadow-2xs flex items-center gap-1 transition-all"
                >
                  <Icon name="edit" className="w-3 h-3 text-slate-500" /> Cambiar Foto
                </button>
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setAvatarUrl('')}
                    className="px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-[11px] font-bold text-red-600 border border-red-200 transition-all"
                  >
                    Quitar Foto
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Aviso de Permisos de Edición para Empleados */}
          {!isAdminOrDev && (
            <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl flex items-start gap-2.5 text-xs text-blue-800">
              <Icon name="shield" className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                <strong>Información Corporativa:</strong> Tu nombre, correo y rol están protegidos y sólo pueden ser modificados por el Administrador. Puedes personalizar tu foto de perfil, teléfono de contacto y contraseña.
              </p>
            </div>
          )}

          {/* Campos del Formulario */}
          <div className="space-y-3.5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 block">Nombre Completo</label>
                {!isAdminOrDev && (
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    <Icon name="lock" className="w-3 h-3 text-slate-400" /> Bloqueado por Admin
                  </span>
                )}
              </div>
              <input
                type="text"
                disabled={!isAdminOrDev}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full px-3.5 py-2 rounded-lg text-xs font-medium border transition-all ${
                  isAdminOrDev
                    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:outline-none focus:border-[#8CC63F] focus:bg-white'
                    : 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed'
                }`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 block">Correo Electrónico</label>
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    <Icon name="lock" className="w-3 h-3 text-slate-400" /> ID de Acceso
                  </span>
                </div>
                <input
                  type="email"
                  disabled
                  value={currentUser.email || ''}
                  className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Teléfono de Contacto</label>
                <input
                  type="text"
                  placeholder="+52 (33) 1234-5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-[#8CC63F] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 block">Rol / Privilegios</label>
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    <Icon name="shield" className="w-3 h-3 text-slate-400" /> RBAC
                  </span>
                </div>
                <input
                  type="text"
                  disabled
                  value={roleConfig.name}
                  className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 cursor-not-allowed"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 block">Departamento / Área</label>
                  {!isAdminOrDev && (
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Icon name="lock" className="w-3 h-3 text-slate-400" /> Fijo
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  disabled={!isAdminOrDev}
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-lg text-xs font-medium border transition-all ${
                    isAdminOrDev
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:outline-none focus:border-[#8CC63F] focus:bg-white'
                      : 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed'
                  }`}
                />
              </div>
            </div>

            {/* Módulos asignados */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
              <p className="font-bold text-[#0A3963] mb-1">Módulos autorizados en tu cuenta:</p>
              <div className="flex flex-wrap gap-1">
                {roleConfig.modules.map(m => (
                  <span key={m} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-bold text-slate-700 text-[10px]">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Sección Opcional: Cambiar Contraseña */}
            <div className="pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowPasswordFields(!showPasswordFields)}
                className="text-xs font-extrabold text-[#0A3963] hover:text-[#8CC63F] flex items-center gap-1.5 transition-colors"
              >
                <Icon name="key" className="w-3.5 h-3.5" />
                {showPasswordFields ? 'Ocultar cambio de contraseña' : '¿Deseas cambiar tu contraseña?'}
              </button>

              {showPasswordFields && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Nueva Contraseña</label>
                    <input
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:border-[#8CC63F]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Confirmar Contraseña</label>
                    <input
                      type="password"
                      placeholder="Repite la contraseña"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:border-[#8CC63F]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-all"
            >
              Cerrar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl btn-park-green text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform flex items-center gap-1.5"
            >
              <Icon name="check" className="w-4 h-4" /> Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// Componente para Módulo de Gestión de Usuarios y Permisos RBAC;
