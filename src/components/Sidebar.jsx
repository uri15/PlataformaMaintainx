import React from 'react';
import { Icon } from './Icon.jsx';
import { SafeImage } from './SafeImage.jsx';
import { ROLES_CONFIG } from '../constants/roles.js';

export const Sidebar = ({ activeTab, setActiveTab, openCount, lowStockCount, currentUser, onLogout, onOpenProfile }) => {
  const userRole = currentUser?.role || 'admin';
  const roleConfig = ROLES_CONFIG[userRole] || ROLES_CONFIG['admin'];
  const allowedModules = roleConfig.modules || [];

  const roleNamesSpanish = {
    developer: 'DESARROLLADOR / QA',
    admin: 'ADMINISTRADOR',
    supervisor: 'SUPERVISOR DE MANTENIMIENTO',
    tecnico: 'TÉCNICO DE CAMPO',
    solicitante: 'SOLICITANTE',
    auditor: 'AUDITOR DE INFRAESTRUCTURA'
  };

  const allMenuItems = [
    { id: 'dashboard', label: 'Dashboard Operativo', icon: 'dashboard' },
    { id: 'workOrders', label: 'Órdenes de Trabajo', icon: 'workOrders', badge: openCount > 0 ? openCount : null },
    { id: 'assets', label: 'Activos & Equipos', icon: 'assets' },
    { id: 'preventive', label: 'Mantenimiento Preventivo', icon: 'preventive' },
    { id: 'inventory', label: 'Repuestos e Inventario', icon: 'inventory', badge: lowStockCount > 0 ? lowStockCount : null, badgeColor: 'bg-red-500 text-white shadow-xs' },
    { id: 'reports', label: 'Centro de Reportes PDF', icon: 'reports' },
    { id: 'audit', label: 'Bitácora & Auditoría', icon: 'shield' },
    { id: 'users', label: 'Gestión de Usuarios', icon: 'users' },
    { id: 'settings', label: 'Configuración', icon: 'settings' }
  ];

  const menuItems = allMenuItems.filter(item => allowedModules.includes(item.id));

  return (
    <aside className="w-full lg:w-64 bg-white border-r border-slate-200 flex flex-col p-4 gap-6 shrink-0 min-h-[calc(100vh-65px)]">
      {/* Tarjeta de Usuario Clickable para abrir Perfil */}
      <div 
        onClick={onOpenProfile}
        className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/90 border border-slate-200 flex items-center gap-3 cursor-pointer transition-all group shadow-2xs"
        title="Haz clic para ver y editar tu perfil de usuario"
      >
        <div className="relative shrink-0">
          <SafeImage 
            src={currentUser?.avatarUrl} 
            alt="Avatar" 
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs group-hover:scale-105 transition-transform"
            fallbackContent={
              <div className="w-10 h-10 rounded-full bg-[#0A3963] flex items-center justify-center text-[#8CC63F] font-extrabold text-sm shadow-xs uppercase group-hover:scale-105 transition-transform">
                {(currentUser?.full_name || 'UP').split(' ').filter(Boolean).map(n=>n[0]).slice(0,2).join('')}
              </div>
            }
          />
          <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0"></span>
        </div>

        <div className="overflow-hidden flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <p className="text-xs font-bold text-slate-900 group-hover:text-[#0A3963] truncate">{currentUser?.full_name || 'Usuario Park'}</p>
            <Icon name="edit" className="w-3 h-3 text-slate-400 group-hover:text-[#0A3963] shrink-0" />
          </div>
          <p className="text-[10px] text-slate-500 font-medium truncate">{currentUser?.email || 'user@park.com'}</p>
          
        </div>
      </div>

      <nav className="flex flex-col gap-1.5 flex-1">
        <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
          Módulos Autorizados ({roleNamesSpanish[userRole] || 'GENERAL'})
        </p>
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all group ${
                isActive
                  ? 'bg-[#0A3963] text-white border-l-4 border-[#8CC63F] shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon 
                  name={item.icon} 
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-[#8CC63F]' : 'text-slate-500 group-hover:text-slate-800'
                  }`} 
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 whitespace-nowrap min-w-[22px] text-center inline-flex items-center justify-center ${item.badgeColor || 'bg-red-500 text-white'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-all group shrink-0"
      >
        <Icon name="logout" className="w-4 h-4 text-red-700 shrink-0" /> <span>Cerrar Sesión</span>
      </button>

      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[10px] text-slate-500 text-center shrink-0">
        <p className="font-bold text-slate-800">PLATAFORMA PARK v2.5</p>
        <p className="text-[#8CC63F] font-bold mt-0.5">PlataformaPark &copy; 2026</p>
      </div>
    </aside>
  );
};


// Componente para Módulo de Gestión de Usuarios (Admin)

// ==========================================
// COMPONENTE MODAL DE PERFIL DE USUARIO (Mi Perfil)
// ==========================================;
