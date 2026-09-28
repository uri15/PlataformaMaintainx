import React from 'react';
import { Icon } from '../components/Icon.jsx';
import { generateParkPdfReport } from '../utils/pdfGenerator.js';
import { QuickDelegateModal } from '../components/QuickDelegateModal.jsx';

export const WorkOrders = ({ workOrders = [], currentUser, onSelectWO, onNewWO, onExportSinglePdf, onStatusChange, searchTerm, onDelegateWO, technicians = [], users = [] }) => {
  const [delegatingWO, setDelegatingWO] = React.useState(null);
  const [viewMode, setViewMode] = React.useState('list'); // 'list' | 'kanban'
  const [orderSection, setOrderSection] = React.useState('active'); // 'active' | 'completed' | 'all'
  const [filterPriority, setFilterPriority] = React.useState('ALL');
  const [filterStatus, setFilterStatus] = React.useState('ALL');
  const [filterCategory, setFilterCategory] = React.useState('ALL');

  const userRole = currentUser?.role || 'tecnico';
  const isTechnician = userRole === 'tecnico' || (currentUser?.email && currentUser.email.toLowerCase().includes('tecnico'));
  const isAdminOrDev = userRole === 'admin' || userRole === 'developer';
  const canCreateWO = !isTechnician && userRole !== 'auditor';

  // Counts for tabs
  const activeCount = workOrders.filter(w => w.status !== 'Completada').length;
  const completedCount = workOrders.filter(w => w.status === 'Completada').length;
  const totalCount = workOrders.length;

  const filtered = workOrders.filter((wo) => {
    const q = (searchTerm || '').trim().toLowerCase();
    const matchesSearch = !q || 
      (wo.title || '').toLowerCase().includes(q) ||
      (wo.code || '').toLowerCase().includes(q) ||
      (wo.assetName || '').toLowerCase().includes(q) ||
      (wo.development || '').toLowerCase().includes(q) ||
      (wo.assignedTech || '').toLowerCase().includes(q);

    const matchesPriority = filterPriority === 'ALL' || wo.priority === filterPriority;
    const matchesStatus = filterStatus === 'ALL' || wo.status === filterStatus;
    const matchesCategory = filterCategory === 'ALL' || wo.category === filterCategory;

    // Section filtering: Activas vs Completadas vs Todas
    let matchesSection = true;
    if (orderSection === 'active') {
      matchesSection = wo.status !== 'Completada';
    } else if (orderSection === 'completed') {
      matchesSection = wo.status === 'Completada';
    }

    return matchesSearch && matchesPriority && matchesStatus && matchesCategory && matchesSection;
  });

  const statuses = ['Abierta', 'En Proceso', 'En Espera', 'Completada'];

  return (
    <div className="space-y-6">
      {/* Header Card with Navigation Tabs */}
      <div className="p-6 rounded-2xl park-card space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0A3963] font-heading">
              Órdenes de Trabajo (Work Orders)
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Gestión operativa, seguimiento de mantenimiento y archivo histórico | Plataforma PARK
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center p-1 rounded-lg bg-slate-100 border border-slate-200">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  viewMode === 'list' ? 'bg-[#0A3963] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ≡ Lista
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  viewMode === 'kanban' ? 'bg-[#0A3963] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ⊞ Kanban
              </button>
            </div>

            {canCreateWO && (
              <button
                onClick={onNewWO}
                className="px-4 py-2 rounded-xl btn-park-green text-white text-xs font-extrabold shadow hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
              >
                <Icon name="plus" className="w-4 h-4 mr-1" /> Crear Orden
              </button>
            )}
          </div>
        </div>

        {/* Section Tabs: ACTIVAS vs COMPLETADAS vs TODAS */}
        <div className="flex items-center gap-2 border-b border-slate-200 pt-2 flex-wrap">
          <button
            onClick={() => { setOrderSection('active'); setFilterStatus('ALL'); }}
            className={`pb-3 px-4 text-xs font-extrabold border-b-2 transition-all flex items-center gap-2 ${
              orderSection === 'active'
                ? 'border-[#0A3963] text-[#0A3963]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>📋 Órdenes Activas / En Proceso</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              orderSection === 'active' ? 'bg-[#0A3963] text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {activeCount}
            </span>
          </button>

          <button
            onClick={() => { setOrderSection('completed'); setFilterStatus('ALL'); }}
            className={`pb-3 px-4 text-xs font-extrabold border-b-2 transition-all flex items-center gap-2 ${
              orderSection === 'completed'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>✅ Órdenes Completadas / Archivo</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              orderSection === 'completed' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {completedCount}
            </span>
          </button>

          <button
            onClick={() => { setOrderSection('all'); setFilterStatus('ALL'); }}
            className={`pb-3 px-4 text-xs font-extrabold border-b-2 transition-all flex items-center gap-2 ${
              orderSection === 'all'
                ? 'border-slate-800 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>📂 Todas las Órdenes</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              orderSection === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {totalCount}
            </span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Prioridad
            </label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:border-[#8CC63F] outline-none font-medium"
            >
              <option value="ALL">Todas las Prioridades</option>
              <option value="Urgente">🚨 Urgente</option>
              <option value="Alta">🟧 Alta</option>
              <option value="Media">🟨 Media</option>
              <option value="Baja">🟦 Baja</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Estado Específico
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:border-[#8CC63F] outline-none font-medium"
            >
              <option value="ALL">Todos en esta vista</option>
              {orderSection !== 'completed' && <option value="Abierta">🔵 Abierta</option>}
              {orderSection !== 'completed' && <option value="En Proceso">🟣 En Proceso</option>}
              {orderSection !== 'completed' && <option value="En Espera">🟡 En Espera</option>}
              {orderSection !== 'active' && <option value="Completada">🟢 Completada</option>}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Categoría
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:border-[#8CC63F] outline-none font-medium"
            >
              <option value="ALL">Todas las Categorías</option>
              <option value="Preventivo">Preventivo</option>
              <option value="Correctivo">Correctivo</option>
              <option value="Inspección">Inspección</option>
              <option value="Seguridad">Seguridad</option>
              <option value="Eléctrico">Eléctrico</option>
              <option value="Climatización / HVAC">Climatización / HVAC</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE VIEW */}
      {viewMode === 'list' && (
        <div className="p-6 rounded-2xl park-card overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-extrabold text-[#0A3963] uppercase tracking-wider bg-slate-50">
                <th className="py-3 px-3">Folio</th>
                <th className="py-3 px-3">Título de la Orden</th>
                <th className="py-3 px-3">Desarrollo / Activo</th>
                <th className="py-3 px-3">Prioridad</th>
                <th className="py-3 px-3">Estado</th>
                <th className="py-3 px-3">Técnico</th>
                <th className="py-3 px-3 text-right">Costo Total</th>
                <th className="py-3 px-3 text-center whitespace-nowrap">Acciones & Reporte</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    <div className="space-y-2 max-w-sm mx-auto">
                      <span className="text-4xl block">
                        {orderSection === 'completed' ? '✅' : '📋'}
                      </span>
                      <p className="text-sm font-bold text-slate-700">
                        {orderSection === 'completed' 
                          ? 'No hay órdenes completadas en el historial'
                          : 'No hay órdenes de trabajo activas'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {orderSection === 'completed'
                          ? 'Cuando completes una orden de trabajo, aparecerá archivada aquí para consulta histórica y reportes PDF.'
                          : canCreateWO
                            ? 'Comienza creando una nueva orden de trabajo con el botón superior.'
                            : 'Las órdenes de trabajo asignadas a tu perfil aparecerán listadas aquí.'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
              {filtered.map((wo) => {
                let pClass = "badge-low";
                if (wo.priority === 'Urgente') pClass = "badge-urgent";
                else if (wo.priority === 'Alta') pClass = "badge-high";
                else if (wo.priority === 'Media') pClass = "badge-medium";

                let sClass = "badge-open";
                const isDone = wo.status === 'Completada';
                if (isDone) sClass = "badge-completed";
                else if (wo.status === 'En Proceso') sClass = "badge-in-progress";

                return (
                  <tr 
                    key={wo.id}
                    className={`hover:bg-slate-50/80 transition-colors group cursor-pointer ${
                      isDone ? 'bg-slate-50/30' : ''
                    }`}
                  >
                    <td className="py-3.5 px-3 font-bold text-[#0A3963] font-mono" onClick={() => onSelectWO(wo)}>
                      {wo.code}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-slate-900 group-hover:text-[#0A3963]" onClick={() => onSelectWO(wo)}>
                      <p className="flex items-center gap-1.5">
                        {isDone && <span className="text-emerald-600 font-bold">✓</span>}
                        <span>{wo.title}</span>
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium">{wo.category}</p>
                    </td>
                    <td className="py-3.5 px-3 text-slate-700" onClick={() => onSelectWO(wo)}>
                      <p className="font-semibold text-slate-900">{wo.development || 'Park Industrial'}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{wo.assetName}</p>
                    </td>
                    <td className="py-3.5 px-3" onClick={() => onSelectWO(wo)}>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${pClass}`}>
                        {wo.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <select
                        value={wo.status}
                        onChange={(e) => onStatusChange(wo.id, e.target.value)}
                        className={`px-2 py-1 rounded text-[10px] font-extrabold outline-none cursor-pointer ${sClass}`}
                      >
                        {statuses.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <span onClick={() => onSelectWO(wo)} className="cursor-pointer hover:text-[#0A3963] transition-colors truncate max-w-[140px]">
                          {wo.assignedTech || 'Sin asignar'}
                        </span>
                        {isAdminOrDev && onDelegateWO && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDelegatingWO(wo);
                            }}
                            className="px-1.5 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-[#0A3963] text-[10px] font-bold border border-blue-200 transition-colors shadow-2xs hover:scale-105 shrink-0"
                            title="Delegar o cambiar responsable de la orden"
                          >
                            <span>✎ Delegar</span>
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-right font-extrabold text-[#0A3963]" onClick={() => onSelectWO(wo)}>
                      ${(wo.grandTotal || 0).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        {/* Botón para marcar completada si está activa */}
                        {!isDone ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onStatusChange(wo.id, 'Completada');
                            }}
                            title="Marcar esta orden como Completada y archivarla"
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-extrabold text-[11px] border border-emerald-300 transition-all flex items-center gap-1 shadow-xs"
                          >
                            <Icon name="check" className="w-3.5 h-3.5" />
                            <span>Completar</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onStatusChange(wo.id, 'En Proceso');
                            }}
                            title="Reabrir esta orden de trabajo"
                            className="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-[10px] transition-all"
                          >
                            ↺ Reabrir
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onExportSinglePdf(wo);
                          }}
                          title="Generar y Descargar Reporte PDF de la Orden"
                          className="px-2.5 py-1.5 rounded-lg btn-park-blue text-[11px] font-extrabold transition-transform hover:scale-105 shadow-xs flex items-center gap-1"
                        >
                          <Icon name="pdf" className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* KANBAN VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {statuses.map((status) => {
            const listInStatus = filtered.filter(w => w.status === status);

            return (
              <div key={status} className="p-4 rounded-2xl park-card space-y-3 flex flex-col min-h-[500px] bg-slate-50/50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                    {status}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[10px] font-extrabold">
                    {listInStatus.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                  {listInStatus.map((wo) => {
                    let pClass = "badge-low";
                    if (wo.priority === 'Urgente') pClass = "badge-urgent";
                    else if (wo.priority === 'Alta') pClass = "badge-high";

                    const isDone = wo.status === 'Completada';

                    return (
                      <div
                        key={wo.id}
                        onClick={() => onSelectWO(wo)}
                        className="p-4 rounded-xl bg-white border border-slate-200/80 hover:border-[#8CC63F] cursor-pointer transition-all space-y-2.5 group shadow-xs hover:shadow-md"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#0A3963] font-mono">{wo.code}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${pClass}`}>
                            {wo.priority}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0A3963] transition-colors">
                          {wo.title}
                        </h4>

                        <p className="text-[10px] text-slate-500 font-medium">
                          📍 {wo.development || 'Park Industrial'}
                        </p>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                          <div className="flex items-center gap-1.5 truncate max-w-[55%]">
                            <span className="text-slate-700 font-semibold truncate">👤 {wo.assignedTech ? (wo.assignedTech.split(' ')[1] || wo.assignedTech) : 'Sin asignar'}</span>
                            {isAdminOrDev && onDelegateWO && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDelegatingWO(wo);
                                }}
                                className="px-1 py-0.2 rounded bg-blue-50 hover:bg-blue-100 text-[#0A3963] text-[9px] font-bold border border-blue-200 shrink-0"
                                title="Delegar orden"
                              >
                                ✎
                              </button>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {!isDone && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onStatusChange(wo.id, 'Completada');
                                }}
                                title="Completar Orden"
                                className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white font-bold text-[9px] border border-emerald-300"
                              >
                                ✓ Listo
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onExportSinglePdf(wo);
                              }}
                              className="px-2 py-0.5 rounded bg-blue-50 text-[#0A3963] hover:bg-blue-100 font-extrabold border border-blue-200 flex items-center gap-1"
                            >
                              <Icon name="pdf" className="w-3.5 h-3.5" /> PDF
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <QuickDelegateModal
        isOpen={Boolean(delegatingWO)}
        onClose={() => setDelegatingWO(null)}
        workOrder={delegatingWO}
        onSave={onDelegateWO}
        technicians={technicians}
        users={users}
      />
    </div>
  );
};

// SignaturePad;
