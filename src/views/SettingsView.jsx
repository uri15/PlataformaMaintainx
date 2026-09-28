import React from 'react';
import { Icon } from '../components/Icon.jsx';

export const SettingsView = () => (
  <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
    <h2 className="text-xl font-bold text-[#0A3963]">🛠️ Configuración Global del Sistema</h2>
    <div className="space-y-3 text-xs text-slate-700">
      <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
        <div>
          <p className="font-bold">Control de Acceso Basado en Roles (RBAC)</p>
          <p className="text-slate-500 text-[11px]">Validación dinámica basada en roles.json</p>
        </div>
        <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">ACTIVO</span>
      </div>
      <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
        <div>
          <p className="font-bold">Autenticación JWT</p>
          <p className="text-slate-500 text-[11px]">Tokens Bearer con expiración de 24 horas</p>
        </div>
        <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">VERIFICADO</span>
      </div>
    </div>
  </div>
);

// Dashboard;
