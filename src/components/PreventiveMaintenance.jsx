import React from 'react';

export const PreventiveMaintenance = ({ schedules, onGenerateWOFromPM }) => {
  return (
    <div className="space-y-6">
      
      <div className="p-5 rounded-2xl glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-heading">
            Mantenimiento Preventivo (PM)
          </h1>
          <p className="text-xs text-slate-300">
            Programación de rutinas periódicas y generación automatizada | Grupo Favier
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schedules.map((pm) => (
          <div key={pm.id} className="p-5 rounded-2xl glass-card space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#D4AF37]">{pm.id}</span>
                <span className="px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-bold">
                  {pm.frequency}
                </span>
              </div>

              <h3 className="text-base font-bold text-white font-heading">
                {pm.title}
              </h3>

              <p className="text-xs text-slate-300">
                ⚙️ Activo: <span className="font-semibold text-white">{pm.assetName}</span>
              </p>
              <p className="text-xs text-slate-400">
                👤 Técnico Asignado: <span className="text-slate-200">{pm.assignedTech}</span>
              </p>
            </div>

            <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[10px]">Próxima Fecha: <b className="text-amber-300">{pm.nextDueDate}</b></span>
              <button
                onClick={() => onGenerateWOFromPM(pm)}
                className="px-3 py-1.5 rounded gold-gradient-bg text-[#0B192C] font-extrabold text-xs shadow hover:scale-105 transition-transform"
              >
                ⚡ Generar Orden de Trabajo
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
