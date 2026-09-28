import React from 'react';
import { Icon } from '../components/Icon.jsx';

export const PreventiveMaintenance = ({ schedules = [], onGenerateWOFromPM }) => (
  <div className="space-y-6">
    <div className="p-6 rounded-2xl park-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0A3963] font-heading">
          Mantenimiento Preventivo (PM)
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Programación de rutinas periódicas y generación automatizada | PlataformaPark
        </p>
      </div>
    </div>

    {schedules.length === 0 ? (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
        <span className="text-4xl block">📅</span>
        <h3 className="text-sm font-bold text-slate-700">No hay planes preventivos programados</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Aquí aparecerán las rutinas periódicas (semanales, mensuales, trimestrales) asignadas a tus equipos.
        </p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schedules.map((pm) => (
          <div key={pm.id} className="p-6 rounded-2xl park-card space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#0A3963]">{pm.id}</span>
                <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                  {pm.frequency}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 font-heading">
                {pm.title}
              </h3>

              <p className="text-xs text-slate-600 font-medium">
                ⚙️ Activo: <span className="font-bold text-slate-900">{pm.assetName}</span>
              </p>
              <p className="text-xs text-slate-500 font-medium">
                👤 Técnico Asignado: <span className="text-slate-800 font-bold">{pm.assignedTech}</span>
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[10px] font-medium">Próxima Fecha: <b className="text-[#0A3963] font-bold">{pm.nextDueDate}</b></span>
              <button
                onClick={() => onGenerateWOFromPM(pm)}
                className="px-3.5 py-2 rounded btn-park-green text-xs font-extrabold shadow hover:scale-105 transition-transform"
              >
                <Icon name="zap" className="w-4 h-4 mr-1.5" /> Generar Orden de Trabajo
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// Inventory;
