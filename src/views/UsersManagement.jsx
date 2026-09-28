import React from 'react';
import { Icon } from '../components/Icon.jsx';
import { ROLES_CONFIG } from '../constants/roles.js';

export const UsersManagement = ({ users = [], onSaveUser, onDeleteUser, onToggleUserStatus, currentUser }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState('ALL');
  const [statusFilter, setStatusFilter] = React.useState('ALL');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState(null);

  // Form state
  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    role: 'tecnico',
    department: '',
    phone: '',
    password: '',
    status: 'Activo'
  });
  const [formError, setFormError] = React.useState('');

  // Estados para Solicitudes de Contraseña recibidas del Login
  const [resetRequests, setResetRequests] = React.useState([]);
  const [isRequestsModalOpen, setIsRequestsModalOpen] = React.useState(false);
  const [requestTab, setRequestTab] = React.useState('ALL'); // 'ALL' | 'Pendiente' | 'Resuelto' | 'Rechazado'
  const [actionPasswords, setActionPasswords] = React.useState({});
  const [resolvingId, setResolvingId] = React.useState(null);
  const [requestFeedback, setRequestFeedback] = React.useState({ type: '', text: '' });

  const loadResetRequests = React.useCallback(async () => {
    try {
      const res = await fetch('/api/v1/admin/password-reset-requests');
      if (res.ok) {
        const d = await res.json();
        setResetRequests(Array.isArray(d.requests) ? d.requests : []);
      }
    } catch (e) {
      console.warn('Error al cargar solicitudes de restablecimiento:', e);
    }
  }, []);

  React.useEffect(() => {
    loadResetRequests();
    const interval = setInterval(loadResetRequests, 8000);
    return () => clearInterval(interval);
  }, [loadResetRequests]);

  const handleTicketPasswordChange = (ticketId, value) => {
    setActionPasswords(prev => ({ ...prev, [ticketId]: value }));
  };

  const handleGenerateTicketPassword = (ticketId) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let pass = 'Park';
    for (let i = 0; i < 4; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    pass += '!';
    setActionPasswords(prev => ({ ...prev, [ticketId]: pass }));
  };

  const handleResolveTicket = async (ticket, action) => {
    const pass = actionPasswords[ticket.id] || 'Password123!';
    setResolvingId(ticket.id);
    setRequestFeedback({ type: '', text: '' });

    try {
      const res = await fetch('/api/v1/admin/resolve-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: ticket.id,
          action,
          newPassword: pass,
          adminName: currentUser?.fullName || currentUser?.name || 'Administrador'
        })
      });

      const resData = await res.json().catch(() => ({}));
      if (res.ok) {
        setRequestFeedback({
          type: 'success',
          text: action === 'approve'
            ? `¡Contraseña asignada con éxito para ${ticket.fullName}! Nueva clave: ${pass}`
            : `Solicitud ${ticket.folio} marcada como rechazada.`
        });
        loadResetRequests();
      } else {
        setRequestFeedback({
          type: 'error',
          text: resData.error || 'Ocurrió un error al procesar la solicitud.'
        });
      }
    } catch (err) {
      setRequestFeedback({
        type: 'error',
        text: 'Error de conexión con el servidor.'
      });
    } finally {
      setResolvingId(null);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    try {
      const res = await fetch(`/api/v1/admin/password-reset-requests/${ticketId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setResetRequests(prev => prev.filter(r => r.id !== ticketId));
      }
    } catch (e) {
      console.warn('Error al eliminar ticket:', e);
    }
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      fullName: '',
      email: '',
      role: 'tecnico',
      department: 'Mantenimiento General',
      phone: '',
      password: 'Password123!',
      status: 'Activo'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      role: user.role || 'tecnico',
      department: user.department || '',
      phone: user.phone || '',
      password: user.password || 'Password123!',
      status: user.status || 'Activo'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let pass = '';
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password: pass }));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setFormError('');

    if (!formData.fullName.trim()) {
      setFormError('El nombre completo es obligatorio.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setFormError('Ingresa un correo electrónico válido.');
      return;
    }

    // Validar duplicidad de correo si es nuevo o si cambió
    const emailExists = users.some(u => 
      u.email.toLowerCase() === formData.email.trim().toLowerCase() && 
      (!editingUser || u.id !== editingUser.id)
    );
    if (emailExists) {
      setFormError('Ya existe un usuario registrado con este correo electrónico.');
      return;
    }

    const userToSave = {
      id: editingUser ? editingUser.id : ('usr-' + Date.now().toString(36) + '-' + Math.floor(Math.random() * 1000)),
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      role: formData.role,
      department: formData.department.trim() || 'General',
      phone: formData.phone.trim() || '+52 (33) 3800-0000',
      password: formData.password || 'Password123!',
      status: formData.status,
      createdAt: editingUser ? editingUser.createdAt : new Date().toISOString().split('T')[0]
    };

    onSaveUser(userToSave);
    setIsModalOpen(false);
  };

  // Filtrado de usuarios
  const filteredUsers = users.filter(u => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (u.fullName || '').toLowerCase().includes(term) ||
      (u.email || '').toLowerCase().includes(term) ||
      (u.department || '').toLowerCase().includes(term);
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalUsers = users.length;
  const activeCount = users.filter(u => u.status === 'Activo').length;
  const inactiveCount = users.filter(u => u.status === 'Inactivo').length;
  const pendingRequestsCount = resetRequests.filter(r => r.status === 'Pendiente').length;

  return (
    <div className="space-y-6">
      {/* Header & KPI Summary */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#0A3963]/10 text-[#0A3963]">
              <Icon name="users" className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-[#0A3963] font-heading">
              Gestión de Usuarios y Accesos RBAC
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Administra los perfiles de colaboradores, asignación de roles y control de credenciales.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              loadResetRequests();
              setIsRequestsModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-extrabold text-xs shadow-xs transition-colors flex items-center gap-2 relative"
          >
            <Icon name="key" className="w-4 h-4 text-amber-600" />
            <span>Solicitudes de Contraseña</span>
            {pendingRequestsCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white animate-pulse">
                {pendingRequestsCount}
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 font-bold">
                ({resetRequests.length})
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl btn-park-green text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform flex items-center gap-2"
          >
            <Icon name="plus" className="w-4 h-4" /> Agregar Nuevo Usuario
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold uppercase text-slate-400">Total Colaboradores</p>
          <p className="text-2xl font-extrabold text-[#0A3963] mt-1">{totalUsers}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold uppercase text-emerald-600">Cuentas Activas</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{activeCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold uppercase text-slate-400">Suspendidas / Inactivas</p>
          <p className="text-2xl font-extrabold text-slate-600 mt-1">{inactiveCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold uppercase text-purple-600">Roles Configurados</p>
          <p className="text-2xl font-extrabold text-purple-700 mt-1">{Object.keys(ROLES_CONFIG).length}</p>
        </div>
        <div 
          onClick={() => {
            loadResetRequests();
            setIsRequestsModalOpen(true);
          }}
          className="bg-white p-4 rounded-xl border border-amber-200/80 hover:border-amber-400 shadow-xs cursor-pointer transition-all hover:shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase text-amber-600">Peticiones Contraseña</p>
            {pendingRequestsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            )}
          </div>
          <p className="text-2xl font-extrabold text-amber-600 mt-1 flex items-baseline gap-1.5">
            {pendingRequestsCount}
            <span className="text-xs font-semibold text-slate-400">pendientes</span>
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Icon name="search" className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, correo, área..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#8CC63F] focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 outline-none"
          >
            <option value="ALL">Todos los Roles</option>
            {Object.keys(ROLES_CONFIG).map(r => (
              <option key={r} value={r}>{ROLES_CONFIG[r].name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 outline-none"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="Activo">Activos</option>
            <option value="Inactivo">Inactivos</option>
          </select>
        </div>
      </div>

      {/* Users Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((u) => {
          const conf = ROLES_CONFIG[u.role] || ROLES_CONFIG['tecnico'];
          const initials = (u.fullName || 'U')
            .split(' ')
            .filter(Boolean)
            .map(n => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
          const isActive = u.status === 'Activo';

          return (
            <div 
              key={u.id || u.email} 
              className={`p-5 rounded-2xl border transition-all bg-white shadow-xs space-y-3 relative overflow-hidden ${
                !isActive ? 'opacity-70 bg-slate-50 border-slate-200' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              {/* Top Row: Avatar + Info */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full bg-[#0A3963] text-white flex items-center justify-center font-extrabold text-sm border-2 border-white shadow-xs">
                      {initials}
                    </div>
                    <span 
                      className={`w-3 h-3 rounded-full absolute bottom-0 right-0 border-2 border-white ${
                        isActive ? 'bg-emerald-500' : 'bg-slate-400'
                      }`} 
                      title={isActive ? 'Activo' : 'Inactivo'}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-tight">{u.fullName}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Icon name="mail" className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[170px]">{u.email}</span>
                    </p>
                  </div>
                </div>

                <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md border shrink-0 ${conf.badgeColor}`}>
                  {conf.name}
                </span>
              </div>

              {/* Middle Row: Meta */}
              <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 text-xs text-slate-600 border border-slate-100">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-semibold">Departamento:</span>
                  <span className="font-bold text-slate-700">{u.department || 'General'}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-semibold">Teléfono:</span>
                  <span className="font-medium text-slate-700">{u.phone || 'No registrado'}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-semibold">Estado de Cuenta:</span>
                  <span className={`font-bold ${isActive ? 'text-emerald-700' : 'text-slate-500'}`}>
                    {isActive ? '● Activa' : '○ Suspendida'}
                  </span>
                </div>
              </div>

              {/* Modules Authorized Badge List */}
              <div className="space-y-1">
                <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Módulos habilitados:</p>
                <div className="flex flex-wrap gap-1">
                  {conf.modules.map(m => (
                    <span key={m} className="px-1.5 py-0.5 rounded bg-slate-100 text-[9px] font-bold text-slate-600">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onToggleUserStatus(u.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive 
                      ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200' 
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                  title={isActive ? 'Suspender acceso temporalmente' : 'Reactivar acceso al sistema'}
                >
                  <Icon name={isActive ? 'alert' : 'check'} className="w-3.5 h-3.5" />
                  {isActive ? 'Suspender' : 'Activar'}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(u)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
                    title="Editar datos del usuario"
                  >
                    <Icon name="edit" className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`¿Seguro que deseas eliminar al usuario ${u.fullName}? Esta acción no se puede deshacer.`)) {
                        onDeleteUser(u.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-all"
                    title="Eliminar usuario"
                  >
                    <Icon name="trash" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredUsers.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <span className="text-4xl">🔍</span>
          <h3 className="text-base font-bold text-slate-700">No se encontraron usuarios</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No hay colaboradores que coincidan con los filtros o término de búsqueda ingresado.
          </p>
        </div>
      )}

      {/* Modal para Crear / Editar Usuario */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden space-y-4">
            
            {/* Header del Modal */}
            <div className="bg-[#0A3963] p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold font-heading">
                  {editingUser ? 'Editar Perfil de Usuario' : 'Registrar Nuevo Usuario'}
                </h3>
                <p className="text-[11px] text-slate-300">
                  {editingUser ? 'Actualiza los permisos y datos del colaborador.' : 'Crea una cuenta con rol y credenciales de acceso.'}
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold text-sm transition-all"
              >
                ✕
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {formError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                  <Icon name="alert" className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Ing. Carlos Mendoza"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-[#8CC63F] focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    placeholder="usuario@park.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-[#8CC63F] focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Rol en el Sistema *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-[#8CC63F] focus:bg-white transition-all"
                  >
                    {Object.keys(ROLES_CONFIG).map(r => (
                      <option key={r} value={r}>{ROLES_CONFIG[r].name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Departamento / Área</label>
                  <input
                    type="text"
                    placeholder="ej. Mantenimiento Eléctrico"
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-[#8CC63F] focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Teléfono de Contacto</label>
                  <input
                    type="text"
                    placeholder="+52 (33) 1234-5678"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-[#8CC63F] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 block">Contraseña de Acceso</label>
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="text-[10px] text-blue-600 font-extrabold hover:underline"
                    >
                      Generar Segura
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-medium text-slate-900 focus:outline-none focus:border-[#8CC63F] focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Estado Inicial</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-[#8CC63F] focus:bg-white transition-all"
                  >
                    <option value="Activo">Activo (Permite acceso)</option>
                    <option value="Inactivo">Inactivo (Acceso suspendido)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                <p className="font-bold text-[#0A3963] mb-1">Permisos automáticos para el rol seleccionado:</p>
                <div className="flex flex-wrap gap-1">
                  {(ROLES_CONFIG[formData.role] || ROLES_CONFIG['tecnico']).modules.map(m => (
                    <span key={m} className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-semibold text-slate-700">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl btn-park-green text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform flex items-center gap-1.5"
                >
                  <Icon name="check" className="w-4 h-4" />
                  {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Solicitudes de Restablecimiento de Contraseña para el Administrador */}
      {isRequestsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden">
            {/* Header del Modal */}
            <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/70 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-200">
                  <Icon name="key" className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#0A3963]">
                    Solicitudes de Restablecimiento de Contraseña
                  </h3>
                  <p className="text-xs text-slate-500">
                    Peticiones internas recibidas directamente desde la pantalla de acceso (cero correos/envíos externos).
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsRequestsModalOpen(false);
                  setRequestFeedback({ type: '', text: '' });
                }}
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center text-sm font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Mensajes de Feedback */}
            {requestFeedback.text && (
              <div className={`mx-6 mt-4 p-3 rounded-xl text-xs font-semibold flex items-center justify-between shrink-0 ${
                requestFeedback.type === 'error'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}>
                <div className="flex items-center gap-2">
                  <span>{requestFeedback.type === 'error' ? '⚠️' : '✓'}</span>
                  <span>{requestFeedback.text}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setRequestFeedback({ type: '', text: '' })}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold ml-2"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Tabs de Filtro */}
            <div className="px-6 pt-4 pb-2 border-b border-slate-100 flex items-center gap-2 shrink-0 overflow-x-auto">
              {[
                { id: 'ALL', label: 'Todas', count: resetRequests.length },
                { id: 'Pendiente', label: 'Pendientes', count: resetRequests.filter(r => r.status === 'Pendiente').length, highlight: true },
                { id: 'Resuelto', label: 'Resueltas', count: resetRequests.filter(r => r.status === 'Resuelto').length },
                { id: 'Rechazado', label: 'Rechazadas', count: resetRequests.filter(r => r.status === 'Rechazado').length }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setRequestTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    requestTab === tab.id
                      ? 'bg-[#0A3963] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    requestTab === tab.id 
                      ? 'bg-white/20 text-white' 
                      : (tab.highlight && tab.count > 0 ? 'bg-amber-500 text-white font-black' : 'bg-slate-200 text-slate-600')
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Listado de Solicitudes */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {resetRequests.filter(r => requestTab === 'ALL' || r.status === requestTab).length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-xl">
                    ✓
                  </div>
                  <p className="text-sm font-bold text-slate-600">
                    No hay solicitudes en esta sección
                  </p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Cuando un colaborador olvide su contraseña y envíe una solicitud desde la pantalla de acceso, aparecerá aquí inmediatamente.
                  </p>
                </div>
              ) : (
                resetRequests
                  .filter(r => requestTab === 'ALL' || r.status === requestTab)
                  .map(ticket => {
                    const isPending = ticket.status === 'Pendiente';
                    const isResolved = ticket.status === 'Resuelto';
                    const currentInputPass = actionPasswords[ticket.id] !== undefined ? actionPasswords[ticket.id] : 'Password123!';

                    return (
                      <div
                        key={ticket.id}
                        className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                          isPending 
                            ? 'bg-amber-50/40 border-amber-200 shadow-xs' 
                            : isResolved 
                            ? 'bg-white border-slate-200' 
                            : 'bg-slate-50 border-slate-200 opacity-80'
                        }`}
                      >
                        {/* Cabecera del Ticket */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200/80">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-lg bg-[#0A3963] text-white font-mono text-xs font-black tracking-wide">
                              {ticket.folio || 'SOL-S/F'}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {ticket.requestedAt || 'Reciente'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold ${
                              isPending
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : isResolved
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-red-100 text-red-800 border border-red-300'
                            }`}>
                              {isPending && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>}
                              {ticket.status}
                            </span>

                            {!isPending && (
                              <button
                                type="button"
                                title="Eliminar registro"
                                onClick={() => handleDeleteTicket(ticket.id)}
                                className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Icon name="trash" className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Datos del Colaborador */}
                        <div className="py-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <p className="text-[10px] font-bold uppercase text-slate-400">Colaborador Solicitante</p>
                            <p className="font-extrabold text-[#0A3963] text-sm mt-0.5">{ticket.fullName}</p>
                            <p className="text-slate-500 font-mono text-[11px]">{ticket.email}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase text-slate-400">Rol & Área</p>
                            <p className="font-semibold text-slate-700 mt-0.5">
                              <span className="capitalize">{ticket.role}</span> &bull; {ticket.department || 'General'}
                            </p>
                            <p className="text-slate-600 mt-1 italic text-[11px] bg-white/70 p-1.5 rounded-lg border border-slate-200/60">
                              "{ticket.reason || 'Sin comentario adicional'}"
                            </p>
                          </div>
                        </div>

                        {/* Panel de Resolución si está PENDIENTE */}
                        {isPending && (
                          <div className="mt-2 pt-3 border-t border-amber-200/80 bg-white p-3.5 rounded-xl border border-amber-200/60 space-y-3">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                              <label className="text-xs font-bold text-slate-700">
                                Asignar Nueva Contraseña de Acceso:
                              </label>
                              <button
                                type="button"
                                onClick={() => handleGenerateTicketPassword(ticket.id)}
                                className="text-[11px] font-bold text-[#0A3963] hover:text-[#8CC63F] transition-colors flex items-center gap-1"
                              >
                                Generar Clave Automática
                              </button>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                              <div className="relative flex-1">
                                <input
                                  type="text"
                                  value={currentInputPass}
                                  onChange={(e) => handleTicketPasswordChange(ticket.id, e.target.value)}
                                  placeholder="Ej: Password123!"
                                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#8CC63F] focus:bg-white"
                                />
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  disabled={resolvingId === ticket.id}
                                  onClick={() => handleResolveTicket(ticket, 'approve')}
                                  className="px-4 py-2 rounded-lg btn-park-green text-white text-xs font-bold shadow-xs hover:scale-105 transition-transform disabled:opacity-50 flex items-center gap-1.5"
                                >
                                  <Icon name="check" className="w-3.5 h-3.5" />
                                  {resolvingId === ticket.id ? 'Guardando...' : 'Aprobar y Asignar'}
                                </button>
                                <button
                                  type="button"
                                  disabled={resolvingId === ticket.id}
                                  onClick={() => handleResolveTicket(ticket, 'reject')}
                                  className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 text-xs font-semibold transition-colors"
                                >
                                  Rechazar
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Detalles de Resolución si está RESUELTO o RECHAZADO */}
                        {isResolved && (
                          <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                            <span>
                              Atendida el <strong className="text-slate-700">{ticket.resolvedAt}</strong> por <strong className="text-slate-700">{ticket.resolvedBy || 'Administrador'}</strong>
                            </span>
                            {ticket.newPasswordGiven && (
                              <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-emerald-900">
                                <span className="font-semibold text-[11px]">Clave asignada:</span>
                                <code className="font-mono font-bold">{ticket.newPasswordGiven}</code>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(ticket.newPasswordGiven);
                                    setRequestFeedback({ type: 'success', text: `Clave copiada al portapapeles: ${ticket.newPasswordGiven}` });
                                  }}
                                  className="text-[10px] text-emerald-700 font-extrabold hover:underline ml-1"
                                >
                                  Copiar
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {ticket.status === 'Rechazado' && (
                          <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-400">
                            Rechazada el <strong className="text-slate-600">{ticket.resolvedAt}</strong> por <strong className="text-slate-600">{ticket.resolvedBy || 'Administrador'}</strong>.
                          </div>
                        )}
                      </div>
                    );
                  })
              )}
            </div>

            {/* Footer del Modal */}
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsRequestsModalOpen(false);
                  setRequestFeedback({ type: '', text: '' });
                }}
                className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs font-bold text-slate-700 transition-colors"
              >
                Cerrar Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente para Configuración de Sistema (Admin);
