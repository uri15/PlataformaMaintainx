import React from 'react';

export const Sidebar = ({ activeTab, setActiveTab, openCount, lowStockCount }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Operativo', icon: '📊' },
    { id: 'workOrders', label: 'Órdenes de Trabajo', icon: '📋', badge: openCount > 0 ? openCount : null },
    { id: 'assets', label: 'Activos & Equipos', icon: '⚙️' },
    { id: 'preventive', label: 'Mantenimiento Preventivo', icon: '📅' },
    { id: 'inventory', label: 'Repuestos e Inventario', icon: '📦', badge: lowStockCount > 0 ? lowStockCount : null, badgeColor: 'bg-amber-500' },
    { id: 'reports', label: 'Centro de Reportes PDF', icon: '📄' }
  ];

  return (
    <aside className="w-full lg:w-64 bg-[#0B192C]/90 border-r border-[#D4AF37]/20 flex flex-col p-4 gap-6 shrink-0 min-h-[calc(100vh-65px)]">
      
      {/* User / Org Info Card */}
      <div className="p-3.5 rounded-xl bg-[#1E3E62]/30 border border-[#D4AF37]/15 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-amber-400 font-bold text-sm">
          GF
        </div>
        <div className="overflow-hidden">
          <p className="text-xs font-bold text-white truncate">Ing. Supervisor Park</p>
          <p className="text-[10px] text-amber-300/80 truncate">mantenimiento@grupofavier.com</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-1.5 flex-1">
        <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
          Módulos Principales
        </p>
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-[#1E3E62] to-[#2A4E78] text-white border-l-4 border-[#D4AF37] shadow-md'
                  : 'text-slate-300 hover:bg-[#1E3E62]/40 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-base group-hover:scale-110 transition-transform">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-[#0B192C] ${item.badgeColor || 'bg-[#D4AF37]'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info Box */}
      <div className="p-3 rounded-lg bg-[#0F172A] border border-slate-800 text-[10px] text-slate-400 text-center">
        <p className="font-bold text-slate-300">PLATAFORMA PARK v2.5</p>
        <p className="text-amber-400/70 mt-0.5">Grupo Favier © 2026</p>
      </div>

    </aside>
  );
};
