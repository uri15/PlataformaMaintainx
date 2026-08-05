import React, { useState } from 'react';
import { generateParkPdfReport } from '../utils/pdfGenerator.js';

export const ExportPdfModal = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  const { workOrders = [] } = data;

  const [exportType, setExportType] = useState('SINGLE_WO'); // 'SINGLE_WO' or 'CONSOLIDATED'
  const [selectedWoId, setSelectedWoId] = useState(workOrders[0]?.id || '');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  
  // Toggles
  const [includeChecklist, setIncludeChecklist] = useState(true);
  const [includeParts, setIncludeParts] = useState(true);
  const [includeSignature, setIncludeSignature] = useState(true);

  const handleExport = () => {
    if (exportType === 'SINGLE_WO') {
      const targetWO = workOrders.find(w => w.id === selectedWoId) || workOrders[0];
      generateParkPdfReport({
        type: 'SINGLE_WO',
        workOrder: targetWO,
        data,
        exportOptions: {
          includeChecklist,
          includeParts,
          includeSignature
        }
      });
    } else {
      const filtered = workOrders.filter(w => {
        const matchesStatus = selectedStatus === 'ALL' || w.status === selectedStatus;
        const matchesPriority = selectedPriority === 'ALL' || w.priority === selectedPriority;
        return matchesStatus && matchesPriority;
      });

      generateParkPdfReport({
        type: 'CONSOLIDATED',
        data: { ...data, filteredWorkOrders: filtered },
        exportOptions: {
          filterDesc: `Estado: ${selectedStatus} | Prioridad: ${selectedPriority}`,
          includeChecklist,
          includeParts
        }
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#0B192C] border border-[#D4AF37]/30 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">📄</span>
            <h2 className="text-lg font-bold text-white font-heading">
              Exportar Reporte PDF — MaintainX Center
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold">✕</button>
        </div>

        {/* Scope Selector Buttons */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#1E3E62]/40 border border-slate-700">
          <button
            onClick={() => setExportType('SINGLE_WO')}
            className={`py-2 rounded-lg text-xs font-bold transition-all ${
              exportType === 'SINGLE_WO' ? 'gold-gradient-bg text-[#0B192C]' : 'text-slate-300 hover:text-white'
            }`}
          >
            Ficha de Orden Individual
          </button>
          <button
            onClick={() => setExportType('CONSOLIDATED')}
            className={`py-2 rounded-lg text-xs font-bold transition-all ${
              exportType === 'CONSOLIDATED' ? 'gold-gradient-bg text-[#0B192C]' : 'text-slate-300 hover:text-white'
            }`}
          >
            Reporte Consolidado
          </button>
        </div>

        {/* Dynamic Controls based on scope */}
        {exportType === 'SINGLE_WO' ? (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">Seleccionar Orden de Trabajo</label>
            <select
              value={selectedWoId}
              onChange={(e) => setSelectedWoId(e.target.value)}
              className="w-full bg-[#1E3E62]/40 border border-slate-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
            >
              {workOrders.map(wo => (
                <option key={wo.id} value={wo.id}>
                  {wo.code} — {wo.title} ({wo.status})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Filtrar por Estado</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-[#1E3E62]/40 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none"
              >
                <option value="ALL">Todos los Estados</option>
                <option value="Abierta">Abierta</option>
                <option value="En Proceso">En Proceso</option>
                <option value="Completada">Completada</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Filtrar por Prioridad</label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full bg-[#1E3E62]/40 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none"
              >
                <option value="ALL">Todas las Prioridades</option>
                <option value="Urgente">Urgente</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
              </select>
            </div>
          </div>
        )}

        {/* Section Toggles */}
        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800 space-y-2 text-xs">
          <p className="font-bold text-amber-300 uppercase tracking-wider mb-1">Bloques a incluir en el PDF:</p>
          
          <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={includeChecklist}
              onChange={(e) => setIncludeChecklist(e.target.checked)}
              className="accent-[#D4AF37]"
            />
            Procedimiento y Checklist de Tareas
          </label>

          <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={includeParts}
              onChange={(e) => setIncludeParts(e.target.checked)}
              className="accent-[#D4AF37]"
            />
            Desglose de Repuestos y Costos Totales
          </label>

          {exportType === 'SINGLE_WO' && (
            <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSignature}
                onChange={(e) => setIncludeSignature(e.target.checked)}
                className="accent-[#D4AF37]"
              />
              Firma Digital de Conformidad del Técnico
            </label>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-slate-800 text-xs font-bold text-slate-300">
            Cancelar
          </button>
          <button
            onClick={handleExport}
            className="px-6 py-2 rounded gold-gradient-bg text-[#0B192C] text-xs font-extrabold shadow hover:scale-105 transition-transform"
          >
            ⚡ Generar & Descargar PDF
          </button>
        </div>

      </div>
    </div>
  );
};
