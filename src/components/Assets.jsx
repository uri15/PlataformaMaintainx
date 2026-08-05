import React, { useState } from 'react';

export const Assets = ({ assets, workOrders, onNewWO }) => {
  const [selectedAsset, setSelectedAsset] = useState(null);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-5 rounded-2xl glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-heading">
            Gestión de Activos & Infraestructura
          </h1>
          <p className="text-xs text-slate-300">
            Inventario técnico de equipos en desarrollos de Grupo Favier
          </p>
        </div>
        <button
          onClick={onNewWO}
          className="px-4 py-2 rounded-lg gold-gradient-bg text-[#0B192C] font-bold text-xs shadow hover:scale-[1.02] transition-transform shrink-0"
        >
          ➕ Generar Orden para Activo
        </button>
      </div>

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map((asset) => {
          let statusBadge = "badge-completed";
          if (asset.status === 'Fuera de Servicio') statusBadge = "badge-urgent";
          else if (asset.status === 'En Mantenimiento') statusBadge = "badge-medium";

          const historyWO = workOrders.filter(w => w.assetId === asset.id);

          return (
            <div
              key={asset.id}
              onClick={() => setSelectedAsset(asset)}
              className="p-5 rounded-2xl glass-card glass-card-hover cursor-pointer space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#D4AF37]">{asset.code}</span>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold ${statusBadge}`}>
                    {asset.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-amber-300 font-heading">
                  {asset.name}
                </h3>

                <p className="text-xs text-slate-300">
                  📍 {asset.location}
                </p>
                <p className="text-[11px] text-slate-400">
                  🏷️ Marca: <span className="text-slate-200">{asset.brand}</span> ({asset.model})
                </p>
              </div>

              {/* Specs & Metrics summary */}
              <div className="pt-3 border-t border-slate-700/60 grid grid-cols-2 gap-2 text-[10px]">
                <div className="p-2 rounded bg-[#0B192C]/60">
                  <p className="text-slate-400">Criticidad</p>
                  <p className="font-bold text-amber-300">{asset.criticality}</p>
                </div>
                <div className="p-2 rounded bg-[#0B192C]/60">
                  <p className="text-slate-400">Historial WOs</p>
                  <p className="font-bold text-white">{historyWO.length} Registros</p>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs pt-1">
                <span className="text-slate-400 text-[10px]">MTTR: {asset.mttrHours}h | MTBF: {asset.mtbfDays}d</span>
                <span className="text-amber-400 font-bold hover:underline">Ver Expediente →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Asset Detail Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-[#0B192C] border border-[#D4AF37]/30 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-[#D4AF37]">{selectedAsset.code}</span>
                <h2 className="text-xl font-bold text-white font-heading">{selectedAsset.name}</h2>
              </div>
              <button
                onClick={() => setSelectedAsset(null)}
                className="text-slate-400 hover:text-white text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <p className="text-slate-400">Desarrollo / Parque</p>
                <p className="font-bold text-white">{selectedAsset.development}</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-400">Ubicación Físico-Específica</p>
                <p className="font-bold text-white">{selectedAsset.location}</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-400">Número de Serie</p>
                <p className="font-mono text-amber-300">{selectedAsset.serialNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-400">Costo Acumulado Reparaciones</p>
                <p className="font-bold text-emerald-400">${selectedAsset.totalMaintenanceCost.toFixed(2)} USD</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#1E3E62]/30 border border-slate-800 text-xs space-y-1">
              <p className="font-bold text-amber-300">Especificaciones Técnicas:</p>
              <p className="text-slate-300">{selectedAsset.specs}</p>
            </div>

            {/* QR Code Tag Simulator */}
            <div className="p-4 rounded-xl bg-[#0F172A] border border-[#D4AF37]/30 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold text-white">Etiqueta Digital QR / Barcode</p>
                <p className="text-[10px] text-slate-400">Escanear para apertura rápida en MaintainX Mobile</p>
              </div>
              <div className="w-16 h-16 bg-white p-1 rounded flex items-center justify-center text-[8px] font-mono text-black font-extrabold text-center leading-tight">
                [QR {selectedAsset.code}]
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedAsset(null)}
                className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
              >
                Cerrar Expediente
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
