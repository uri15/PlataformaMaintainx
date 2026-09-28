import React from 'react';
import { Icon } from '../components/Icon.jsx';
import { QuickDelegateModal } from '../components/QuickDelegateModal.jsx';

export const Dashboard = ({ data, currentUser, onSelectWO, onNewWO, onNavigateTab, onStatusChange, onDelegateWO, technicians = [], users = [] }) => {
  const { workOrders = [], assets = [], inventory = [] } = data;
  const [delegatingWO, setDelegatingWO] = React.useState(null);
  const isAdminOrDev = currentUser?.role === 'admin' || currentUser?.role === 'developer';

  const totalWO = workOrders.length;
  const openWO = workOrders.filter(w => w.status === 'Abierta').length;
  const inProgressWO = workOrders.filter(w => w.status === 'En Proceso').length;
  const onHoldWO = workOrders.filter(w => w.status === 'En Espera').length;
  const completedWO = workOrders.filter(w => w.status === 'Completada').length;
  const urgentWO = workOrders.filter(w => w.priority === 'Urgente' && w.status !== 'Completada').length;

  const totalCost = workOrders.reduce((sum, w) => sum + (w.grandTotal || 0), 0);
  const outOfServiceAssets = assets.filter(a => a.status === 'Fuera de Servicio').length;
  const lowStockCount = inventory.filter(i => (i.currentStock || 0) <= (i.minStock || 0)).length;

  // Órdenes activas prioritarias (excluye completadas)
  const activeWOs = workOrders.filter(w => w.status !== 'Completada');
  const urgentList = [...activeWOs].sort((a, b) => {
    const pOrder = { 'Urgente': 0, 'Alta': 1, 'Media': 2, 'Baja': 3 };
    return (pOrder[a.priority] ?? 4) - (pOrder[b.priority] ?? 4);
  }).slice(0, 5);

  const canCreate = currentUser?.role !== 'tecnico' && currentUser?.role !== 'auditor';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl park-card">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0A3963] font-heading">
            Resumen Operativo de Mantenimiento
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Plataforma PARK — Control e Indicadores en Tiempo Real | Plataforma PARK
          </p>
        </div>
        {canCreate && (
          <button
            onClick={onNewWO}
            className="px-5 py-2.5 rounded-lg btn-park-green text-white font-extrabold text-xs shadow hover:scale-[1.02] transition-transform flex items-center gap-1.5 shrink-0"
          >
            <Icon name="zap" className="w-4 h-4 mr-1" />
            <span>Crear Nuevo Reporte / Orden</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tarjeta 1: Órdenes Totales -> Navega a Órdenes de Trabajo */}
        <div 
          onClick={() => onNavigateTab && onNavigateTab('workOrders')}
          className="p-5 rounded-xl park-card park-card-hover flex items-center justify-between cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md hover:border-[#0A3963]/30 group"
          title="Ver todas las órdenes de trabajo"
        >
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-[#0A3963] transition-colors">Órdenes Totales</p>
            <h3 className="text-3xl font-extrabold text-[#0A3963] mt-1 font-heading">{totalWO}</h3>
            <p className="text-xs text-emerald-600 font-semibold mt-1 inline-flex items-center gap-1">
              <Icon name="check" className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {completedWO} completadas ({Math.round((completedWO/(totalWO || 1))*100)}%)
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0A3963] group-hover:bg-[#0A3963] group-hover:text-white transition-all shrink-0">
            <Icon name="workOrders" className="w-6 h-6" />
          </div>
        </div>

        {/* Tarjeta 2: Activas / En Proceso -> Navega a Órdenes de Trabajo */}
        <div 
          onClick={() => onNavigateTab && onNavigateTab('workOrders')}
          className="p-5 rounded-xl park-card park-card-hover flex items-center justify-between cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md hover:border-amber-400/40 group"
          title="Ver órdenes de trabajo activas y en proceso"
        >
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-amber-600 transition-colors">Activas / En Proceso</p>
            <h3 className="text-3xl font-extrabold text-amber-600 mt-1 font-heading">{openWO + inProgressWO + onHoldWO}</h3>
            <p className="text-xs text-amber-700 font-semibold mt-1">
              {openWO} abiertas | {inProgressWO} en ejecución
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-all shrink-0">
            <Icon name="assets" className="w-6 h-6" />
          </div>
        </div>

        {/* Tarjeta 3: Atención Crítica -> Navega a Activos & Equipos */}
        <div 
          onClick={() => onNavigateTab && onNavigateTab('assets')}
          className="p-5 rounded-xl park-card park-card-hover flex items-center justify-between cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md hover:border-red-400/40 group"
          title="Ver activos y equipos con atención crítica / fuera de servicio"
        >
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-red-600 transition-colors">Atención Crítica</p>
            <h3 className="text-3xl font-extrabold text-red-600 mt-1 font-heading">{urgentWO}</h3>
            <p className="text-xs text-red-600 font-semibold mt-1 inline-flex items-center gap-1">
              <Icon name="alert" className="w-3.5 h-3.5 text-red-600 shrink-0" /> {outOfServiceAssets} Equipos Fuera de Servicio
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 group-hover:bg-red-500 group-hover:text-white transition-all shrink-0">
            <Icon name="alert" className="w-6 h-6" />
          </div>
        </div>

        {/* Tarjeta 4: Inversión Acumulada -> Navega al Centro de Reportes */}
        <div 
          onClick={() => onNavigateTab && onNavigateTab('reports')}
          className="p-5 rounded-xl park-card park-card-hover flex items-center justify-between cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md hover:border-emerald-400/40 group"
          title="Ver Centro de Reportes PDF e Inversión"
        >
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-emerald-700 transition-colors">Inversión Acumulada</p>
            <h3 className="text-2xl font-extrabold text-[#0A3963] mt-1 font-heading">
              ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Materiales + Mano de obra
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all shrink-0">
            <Icon name="dollar" className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl park-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-[#0A3963] font-heading">
                Órdenes Prioritarias & Pendientes
              </h2>
              <p className="text-xs text-slate-500 font-medium">Atención requerida por técnicos en parque</p>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-50 text-[#8CC63F] border border-[#8CC63F]/40 text-xs font-bold">
              Feed Operativo ({activeWOs.length} activas)
            </span>
          </div>

          <div className="space-y-3">
            {urgentList.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-400 space-y-1">
                <span className="text-3xl block">🎉</span>
                <p className="text-sm font-bold text-slate-700">Todas las órdenes de trabajo están al día</p>
                <p className="text-xs text-slate-500">No hay órdenes pendientes o en proceso en este momento.</p>
              </div>
            ) : (
              urgentList.map((wo) => {
                let pClass = "badge-low";
                if (wo.priority === 'Urgente') pClass = "badge-urgent";
                else if (wo.priority === 'Alta') pClass = "badge-high";
                else if (wo.priority === 'Media') pClass = "badge-medium";

                return (
                  <div
                    key={wo.id}
                    onClick={() => onSelectWO(wo)}
                    className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:border-[#8CC63F] cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#0A3963] font-mono">{wo.code}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${pClass}`}>
                          {wo.priority}
                        </span>
                        <span className="text-[10px] text-slate-600 px-2 py-0.5 rounded bg-white border border-slate-200 font-semibold">
                          {wo.category}
                        </span>
                        <span className="text-[10px] text-blue-700 px-2 py-0.5 rounded bg-blue-50 border border-blue-200 font-bold">
                          {wo.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#0A3963] transition-colors">
                        {wo.title}
                      </h4>
                      <p className="text-xs text-slate-500 inline-flex items-center gap-1">
                        <Icon name="location" className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {wo.development || 'Park Industrial'} • <span className="text-slate-700 font-semibold">{wo.assetName || 'Sin Activo Asignado'}</span>
                      </p>
                    </div>

                    <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-700 inline-flex items-center gap-1">
                          <Icon name="user" className="w-3.5 h-3.5 text-slate-500 shrink-0" /> {wo.assignedTech}
                        </span>
                        {isAdminOrDev && onDelegateWO && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDelegatingWO(wo);
                            }}
                            className="px-2 py-0.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0A3963] font-bold text-[10px] border border-blue-200 transition-all flex items-center gap-1 shadow-2xs hover:scale-105"
                            title="Delegar orden a técnico registrado o externo"
                          >
                            <span>✎ Delegar</span>
                          </button>
                        )}
                        <span className="text-xs font-extrabold text-[#0A3963]">
                          ${(wo.grandTotal || 0).toFixed(2)} USD
                        </span>
                      </div>

                      {onStatusChange && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onStatusChange(wo.id, 'Completada');
                          }}
                          title="Marcar esta orden como Completada desde el Dashboard"
                          className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-extrabold text-[10px] border border-emerald-300 transition-all flex items-center gap-1 shadow-xs"
                        >
                          <Icon name="check" className="w-3.5 h-3.5" />
                          <span>Completar</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div 
            onClick={() => onNavigateTab && onNavigateTab('assets')}
            className="p-6 rounded-2xl park-card space-y-4 cursor-pointer hover:border-[#0A3963]/30 transition-all group"
            title="Ver todos los Activos y Equipos"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-[#0A3963] font-heading group-hover:text-[#8CC63F] transition-colors">Estado de Equipos</h2>
              <span className="text-xs text-slate-400 group-hover:text-[#0A3963] font-bold">Ver todos →</span>
            </div>
            <div className="space-y-3">
              {assets.length === 0 ? (
                <p className="text-xs text-slate-400 italic p-3 text-center">No hay activos registrados.</p>
              ) : (
                assets.slice(0, 4).map((ast) => {
                  let statusColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
                  if (ast.status === 'Fuera de Servicio') statusColor = "text-red-700 bg-red-50 border-red-200";
                  else if (ast.status === 'En Mantenimiento') statusColor = "text-amber-700 bg-amber-50 border-amber-200";

                  return (
                    <div key={ast.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{ast.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{ast.code} • {ast.location}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${statusColor}`}>
                        {ast.status}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      <QuickDelegateModal
        isOpen={Boolean(delegatingWO)}
        onClose={() => setDelegatingWO(null)}
        workOrder={delegatingWO}
        onSave={onDelegateWO}
        technicians={technicians.length > 0 ? technicians : (data?.technicians || [])}
        users={users.length > 0 ? users : (data?.users || [])}
      />
    </div>
  );
};

// WorkOrders;
