import React from 'react';

export const Dashboard = ({ data, onSelectWO, onNewWO, onOpenPdfExport }) => {
  const { workOrders = [], assets = [], inventory = [] } = data;

  const totalWO = workOrders.length;
  const openWO = workOrders.filter(w => w.status === 'Abierta').length;
  const inProgressWO = workOrders.filter(w => w.status === 'En Proceso').length;
  const completedWO = workOrders.filter(w => w.status === 'Completada').length;
  const urgentWO = workOrders.filter(w => w.priority === 'Urgente').length;

  const totalCost = workOrders.reduce((sum, w) => sum + (w.grandTotal || 0), 0);
  const outOfServiceAssets = assets.filter(a => a.status === 'Fuera de Servicio').length;
  const lowStockCount = inventory.filter(i => i.currentStock <= i.minStock).length;

  const urgentList = workOrders.filter(w => w.priority === 'Urgente' || w.status === 'Abierta').slice(0, 5);

  return (
    <div className="space-y-6">
      
      {/* Top Banner Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl glass-card">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-heading">
            Resumen Operativo de Mantenimiento
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Plataforma PARK — Control e Indicadores en Tiempo Real | Grupo Favier
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onNewWO}
            className="px-4 py-2 rounded-lg gold-gradient-bg text-[#0B192C] font-bold text-xs shadow hover:scale-[1.02] transition-transform"
          >
            ⚡ Nueva Orden de Trabajo
          </button>
          <button
            onClick={onOpenPdfExport}
            className="px-4 py-2 rounded-lg bg-[#1E3E62] hover:bg-[#2A4E78] text-amber-300 border border-[#D4AF37]/30 text-xs font-semibold shadow transition-all"
          >
            📄 Reporte Ejecutivo PDF
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Work Orders */}
        <div className="p-4 rounded-xl glass-card glass-card-hover flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Órdenes Totales</p>
            <h3 className="text-2xl font-extrabold text-white mt-1 font-heading">{totalWO}</h3>
            <p className="text-[11px] text-emerald-400 font-medium mt-1">
              ✓ {completedWO} completadas ({Math.round((completedWO/totalWO)*100 || 0)}%)
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-2xl">
            📋
          </div>
        </div>

        {/* Card 2: In Progress & Open */}
        <div className="p-4 rounded-xl glass-card glass-card-hover flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Activas / En Proceso</p>
            <h3 className="text-2xl font-extrabold text-amber-400 mt-1 font-heading">{openWO + inProgressWO}</h3>
            <p className="text-[11px] text-amber-300 font-medium mt-1">
              {openWO} abiertas | {inProgressWO} en ejecución
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl">
            ⚙️
          </div>
        </div>

        {/* Card 3: Urgent / Downtime */}
        <div className="p-4 rounded-xl glass-card glass-card-hover flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Atención Crítica</p>
            <h3 className="text-2xl font-extrabold text-red-400 mt-1 font-heading">{urgentWO}</h3>
            <p className="text-[11px] text-red-300 font-medium mt-1">
              🚨 {outOfServiceAssets} Equipos Fuera de Servicio
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-2xl">
            🚨
          </div>
        </div>

        {/* Card 4: Total Maintenance Cost */}
        <div className="p-4 rounded-xl glass-card glass-card-hover flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Inversión Acumulada</p>
            <h3 className="text-2xl font-extrabold text-amber-300 mt-1 font-heading">
              ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
            </h3>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              Materiales + Mano de obra
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-2xl">
            💵
          </div>
        </div>

      </div>

      {/* Main Content Grid: Urgent WOs & Asset Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Urgent & Active Work Orders List (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl glass-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white font-heading">
                Órdenes Prioritarias & Pendientes
              </h2>
              <p className="text-xs text-slate-400">Atención requerida por técnicos en parque</p>
            </div>
            <span className="px-2.5 py-1 rounded bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-semibold">
              MaintainX Feed
            </span>
          </div>

          <div className="space-y-3">
            {urgentList.map((wo) => {
              let pClass = "badge-low";
              if (wo.priority === 'Urgente') pClass = "badge-urgent";
              else if (wo.priority === 'Alta') pClass = "badge-high";
              else if (wo.priority === 'Media') pClass = "badge-medium";

              return (
                <div
                  key={wo.id}
                  onClick={() => onSelectWO(wo)}
                  className="p-3.5 rounded-xl bg-[#0B192C]/60 border border-slate-700/60 hover:border-[#D4AF37]/50 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#D4AF37]">{wo.code}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${pClass}`}>
                        {wo.priority}
                      </span>
                      <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                        {wo.category}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {wo.title}
                    </h4>
                    <p className="text-xs text-slate-400">
                      📍 {wo.development} • <span className="text-slate-300">{wo.assetName}</span>
                    </p>
                  </div>

                  <div className="flex items-center sm:flex-col sm:items-end justify-between gap-1 shrink-0">
                    <span className="text-xs font-semibold text-slate-300">👤 {wo.assignedTech}</span>
                    <span className="text-[11px] text-amber-400 font-bold">
                      ${(wo.grandTotal || 0).toFixed(2)} USD
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Assets Quick Health & Stock Alerts */}
        <div className="space-y-6">
          
          {/* Asset Health Overview */}
          <div className="p-5 rounded-2xl glass-card space-y-4">
            <h2 className="text-lg font-bold text-white font-heading">Estado de Equipos</h2>
            <div className="space-y-3">
              {assets.slice(0, 4).map((ast) => {
                let statusColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
                if (ast.status === 'Fuera de Servicio') statusColor = "text-red-400 bg-red-500/10 border-red-500/30";
                else if (ast.status === 'En Mantenimiento') statusColor = "text-amber-400 bg-amber-500/10 border-amber-500/30";

                return (
                  <div key={ast.id} className="p-3 rounded-lg bg-[#0B192C]/40 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">{ast.name}</p>
                      <p className="text-[10px] text-slate-400">{ast.code} • {ast.development}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusColor}`}>
                      {ast.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stock Alerts Box */}
          <div className="p-5 rounded-2xl glass-card space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white font-heading">Alertas de Almacén</h2>
              <span className="text-xs text-amber-400 font-bold">{lowStockCount} Bajo Stock</span>
            </div>
            {lowStockCount > 0 ? (
              <div className="space-y-2">
                {inventory.filter(i => i.currentStock <= i.minStock).map((item) => (
                  <div key={item.id} className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-amber-200">{item.name}</p>
                      <p className="text-[10px] text-amber-300/70">SKU: {item.sku}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-red-400">{item.currentStock} / {item.minStock} {item.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-emerald-400 font-medium">✓ Todos los repuestos están en niveles óptimos.</p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
