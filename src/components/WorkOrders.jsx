import React, { useState } from 'react';

export const WorkOrders = ({ 
  workOrders, 
  onSelectWO, 
  onNewWO, 
  onExportSinglePdf, 
  onStatusChange,
  searchTerm 
}) => {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'kanban'
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');

  // Filter logic
  const filtered = workOrders.filter((wo) => {
    const matchesSearch = searchTerm === '' || 
      wo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.assignedTech.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority = filterPriority === 'ALL' || wo.priority === filterPriority;
    const matchesStatus = filterStatus === 'ALL' || wo.status === filterStatus;
    const matchesCategory = filterCategory === 'ALL' || wo.category === filterCategory;

    return matchesSearch && matchesPriority && matchesStatus && matchesCategory;
  });

  const statuses = ['Abierta', 'En Proceso', 'En Espera', 'Completada'];

  return (
    <div className="space-y-6">
      
      {/* Header & Filter Controls Bar */}
      <div className="p-5 rounded-2xl glass-card space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white font-heading">
              Órdenes de Trabajo (Work Orders)
            </h1>
            <p className="text-xs text-slate-300">
              Gestión operativa completa estilo MaintainX | Plataforma PARK Grupo Favier
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Switcher Buttons */}
            <div className="flex items-center p-1 rounded-lg bg-[#0B192C] border border-slate-700">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  viewMode === 'list' ? 'gold-gradient-bg text-[#0B192C]' : 'text-slate-400 hover:text-white'
                }`}
              >
                ≡ Lista
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  viewMode === 'kanban' ? 'gold-gradient-bg text-[#0B192C]' : 'text-slate-400 hover:text-white'
                }`}
              >
                ⊞ Kanban
              </button>
            </div>

            <button
              onClick={onNewWO}
              className="px-4 py-2 rounded-lg gold-gradient-bg text-[#0B192C] font-bold text-xs shadow hover:scale-[1.02] transition-transform"
            >
              ➕ Crear Orden
            </button>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-700/60">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Prioridad
            </label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full bg-[#0B192C] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-[#D4AF37] outline-none"
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
              Estado
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-[#0B192C] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-[#D4AF37] outline-none"
            >
              <option value="ALL">Todos los Estados</option>
              <option value="Abierta">🔵 Abierta</option>
              <option value="En Proceso">🟣 En Proceso</option>
              <option value="En Espera">🟡 En Espera</option>
              <option value="Completada">🟢 Completada</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Categoría
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full bg-[#0B192C] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-[#D4AF37] outline-none"
            >
              <option value="ALL">Todas las Categorías</option>
              <option value="Preventivo">Preventivo</option>
              <option value="Correctivo">Correctivo</option>
              <option value="Inspección">Inspección</option>
              <option value="Eléctrico">Eléctrico</option>
              <option value="Climatización / HVAC">Climatización / HVAC</option>
            </select>
          </div>
        </div>
      </div>

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="p-5 rounded-2xl glass-card overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                <th className="py-3 px-3">Folio</th>
                <th className="py-3 px-3">Título de la Orden</th>
                <th className="py-3 px-3">Desarrollo / Activo</th>
                <th className="py-3 px-3">Prioridad</th>
                <th className="py-3 px-3">Estado</th>
                <th className="py-3 px-3">Técnico</th>
                <th className="py-3 px-3 text-right">Costo</th>
                <th className="py-3 px-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {filtered.map((wo) => {
                let pClass = "badge-low";
                if (wo.priority === 'Urgente') pClass = "badge-urgent";
                else if (wo.priority === 'Alta') pClass = "badge-high";
                else if (wo.priority === 'Media') pClass = "badge-medium";

                let sClass = "badge-open";
                if (wo.status === 'Completada') sClass = "badge-completed";
                else if (wo.status === 'En Proceso') sClass = "badge-in-progress";

                return (
                  <tr 
                    key={wo.id}
                    className="hover:bg-[#1E3E62]/40 transition-colors group cursor-pointer"
                  >
                    <td className="py-3.5 px-3 font-bold text-[#D4AF37]" onClick={() => onSelectWO(wo)}>
                      {wo.code}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-white group-hover:text-amber-300" onClick={() => onSelectWO(wo)}>
                      {wo.title}
                      <p className="text-[10px] text-slate-400 font-normal">{wo.category}</p>
                    </td>
                    <td className="py-3.5 px-3 text-slate-300" onClick={() => onSelectWO(wo)}>
                      <p className="font-semibold">{wo.development}</p>
                      <p className="text-[10px] text-slate-400">{wo.assetName}</p>
                    </td>
                    <td className="py-3.5 px-3" onClick={() => onSelectWO(wo)}>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${pClass}`}>
                        {wo.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <select
                        value={wo.status}
                        onChange={(e) => onStatusChange(wo.id, e.target.value)}
                        className={`px-2 py-1 rounded text-[10px] font-bold bg-[#0B192C] border border-slate-700 outline-none ${sClass}`}
                      >
                        {statuses.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-200" onClick={() => onSelectWO(wo)}>
                      {wo.assignedTech}
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold text-amber-300" onClick={() => onSelectWO(wo)}>
                      ${(wo.grandTotal || 0).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onExportSinglePdf(wo);
                        }}
                        title="Exportar Ficha PDF Oficial"
                        className="px-2.5 py-1 rounded bg-[#1E3E62] hover:bg-[#2A4E78] text-amber-300 border border-[#D4AF37]/30 text-[10px] font-bold transition-transform hover:scale-105"
                      >
                        📄 PDF
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {statuses.map((status) => {
            const listInStatus = filtered.filter(w => w.status === status);

            return (
              <div key={status} className="p-4 rounded-2xl glass-card space-y-3 flex flex-col min-h-[500px]">
                <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                  <h3 className="font-bold text-white text-xs uppercase tracking-wider">
                    {status}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-extrabold">
                    {listInStatus.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                  {listInStatus.map((wo) => {
                    let pClass = "badge-low";
                    if (wo.priority === 'Urgente') pClass = "badge-urgent";
                    else if (wo.priority === 'Alta') pClass = "badge-high";

                    return (
                      <div
                        key={wo.id}
                        onClick={() => onSelectWO(wo)}
                        className="p-3.5 rounded-xl bg-[#0B192C]/80 border border-slate-700/80 hover:border-[#D4AF37]/60 cursor-pointer transition-all space-y-2 group shadow-md"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#D4AF37]">{wo.code}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${pClass}`}>
                            {wo.priority}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                          {wo.title}
                        </h4>

                        <p className="text-[10px] text-slate-400">
                          📍 {wo.development}
                        </p>

                        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                          <span className="text-slate-300">👤 {wo.assignedTech.split(' ')[1] || wo.assignedTech}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onExportSinglePdf(wo);
                            }}
                            className="text-amber-400 hover:underline font-bold"
                          >
                            📄 PDF
                          </button>
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

    </div>
  );
};
