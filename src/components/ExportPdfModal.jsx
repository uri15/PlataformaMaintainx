import React from 'react';
import { Icon } from './Icon.jsx';
import { generateParkPdfReport } from '../utils/pdfGenerator.js';

export const ExportPdfModal = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  const { workOrders = [] } = data;
  const [selectedStatus, setSelectedStatus] = React.useState('ALL');
  const [selectedPriority, setSelectedPriority] = React.useState('ALL');

  const handleExportConsolidated = () => {
    const filtered = workOrders.filter(w => {
      const matchesStatus = selectedStatus === 'ALL' || w.status === selectedStatus;
      const matchesPriority = selectedPriority === 'ALL' || w.priority === selectedPriority;
      return matchesStatus && matchesPriority;
    });

    generateParkPdfReport({
      type: 'CONSOLIDATED',
      data: { ...data, filteredWorkOrders: filtered },
      exportOptions: {
        filterDesc: `Estado: ${selectedStatus} | Prioridad: ${selectedPriority}`
      }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xl">📄</span>
            <h2 className="text-lg font-extrabold text-[#0A3963] font-heading">
              Reporte Consolidado de Mantenimiento
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Filtrar por Estado</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 font-medium outline-none"
            >
              <option value="ALL">Todos los Estados</option>
              <option value="Abierta">Abierta</option>
              <option value="En Proceso">En Proceso</option>
              <option value="Completada">Completada</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Filtrar por Prioridad</label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 font-medium outline-none"
            >
              <option value="ALL">Todas las Prioridades</option>
              <option value="Urgente">Urgente</option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-slate-100 text-xs font-bold text-slate-700">
            Cancelar
          </button>
          <button
            onClick={handleExportConsolidated}
            className="px-6 py-2 rounded btn-park-green text-xs shadow hover:scale-105 transition-transform"
          >
            <Icon name="pdf" className="w-4 h-4 mr-1.5" /> Descargar PDF Consolidado
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. APLICACIÓN PRINCIPAL (App)
// ==========================================;
