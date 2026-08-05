import React, { useState, useEffect } from 'react';
import { SignaturePad } from './SignaturePad.jsx';

export const WorkOrderModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  workOrder, 
  assets, 
  inventory, 
  technicians,
  onExportPdf 
}) => {
  if (!isOpen) return null;

  const isEdit = Boolean(workOrder && workOrder.id);

  const [formData, setFormData] = useState({
    id: workOrder?.id || `WO-${Math.floor(1000 + Math.random() * 9000)}`,
    code: workOrder?.code || `WO-${Math.floor(1000 + Math.random() * 9000)}`,
    title: workOrder?.title || '',
    description: workOrder?.description || '',
    priority: workOrder?.priority || 'Media',
    status: workOrder?.status || 'Abierta',
    category: workOrder?.category || 'Preventivo',
    assetId: workOrder?.assetId || (assets[0]?.id || ''),
    assignedTech: workOrder?.assignedTech || (technicians[0]?.name || ''),
    assignedTechRole: workOrder?.assignedTechRole || 'Técnico Operativo',
    dueDate: workOrder?.dueDate ? workOrder.dueDate.substring(0, 10) : new Date().toISOString().substring(0, 10),
    estimatedHours: workOrder?.estimatedHours || 2.0,
    actualHours: workOrder?.actualHours || 0.0,
    checklist: workOrder?.checklist || [
      { id: 1, text: 'Revisión y bloqueo de seguridad LOTO', completed: false, timestamp: null },
      { id: 2, text: 'Ejecución de mantenimiento técnico de rutina', completed: false, timestamp: null },
      { id: 3, text: 'Pruebas de funcionamiento e inspección final', completed: false, timestamp: null }
    ],
    usedParts: workOrder?.usedParts || [],
    technicianNotes: workOrder?.technicianNotes || '',
    signatureData: workOrder?.signatureData || null
  });

  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [selectedPartId, setSelectedPartId] = useState(inventory[0]?.id || '');
  const [partQty, setPartQty] = useState(1);

  // Sync development & location when asset is selected
  const selectedAsset = assets.find(a => a.id === formData.assetId) || assets[0];

  const handleChecklistToggle = (id) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.map(item => {
        if (item.id === id) {
          const nextCompleted = !item.completed;
          return {
            ...item,
            completed: nextCompleted,
            timestamp: nextCompleted ? new Date().toISOString().replace('T', ' ').substring(0, 16) : null
          };
        }
        return item;
      })
    }));
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    setFormData(prev => ({
      ...prev,
      checklist: [
        ...prev.checklist,
        { id: Date.now(), text: newChecklistItem.trim(), completed: false, timestamp: null }
      ]
    }));
    setNewChecklistItem('');
  };

  const handleRemoveChecklistItem = (id) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.filter(item => item.id !== id)
    }));
  };

  const handleAddPart = () => {
    const invItem = inventory.find(i => i.id === selectedPartId);
    if (!invItem) return;

    const existingIdx = formData.usedParts.findIndex(p => p.partId === selectedPartId);
    if (existingIdx >= 0) {
      const updatedParts = [...formData.usedParts];
      updatedParts[existingIdx].qty += Number(partQty);
      updatedParts[existingIdx].totalCost = updatedParts[existingIdx].qty * updatedParts[existingIdx].unitCost;
      setFormData(prev => ({ ...prev, usedParts: updatedParts }));
    } else {
      const newPart = {
        partId: invItem.id,
        name: invItem.name,
        qty: Number(partQty),
        unitCost: invItem.unitCost,
        totalCost: Number(partQty) * invItem.unitCost
      };
      setFormData(prev => ({ ...prev, usedParts: [...prev.usedParts, newPart] }));
    }
  };

  const handleRemovePart = (partId) => {
    setFormData(prev => ({
      ...prev,
      usedParts: prev.usedParts.filter(p => p.partId !== partId)
    }));
  };

  // Calculations
  const totalPartsCost = formData.usedParts.reduce((sum, p) => sum + p.totalCost, 0);
  const totalLaborCost = (formData.actualHours || formData.estimatedHours || 2) * 50; // $50/hr labor rate
  const grandTotal = totalPartsCost + totalLaborCost;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      assetName: selectedAsset?.name || 'Activo General',
      development: selectedAsset?.development || 'Park Industrial',
      location: selectedAsset?.location || 'Área Principal',
      createdDate: workOrder?.createdDate || new Date().toISOString(),
      totalPartsCost,
      totalLaborCost,
      grandTotal
    };
    onSave(finalData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0B192C] border border-[#D4AF37]/30 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 bg-[#1E3E62]/60 border-b border-[#D4AF37]/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg gold-gradient-bg flex items-center justify-center font-bold text-[#0B192C] text-sm">
              WO
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-heading">
                {isEdit ? `Editar Orden: ${formData.code}` : 'Nueva Orden de Trabajo MaintainX'}
              </h2>
              <p className="text-xs text-amber-300">Plataforma PARK — Grupo Favier</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isEdit && (
              <button
                type="button"
                onClick={() => onExportPdf(formData)}
                className="px-3 py-1.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all"
              >
                📄 Descargar PDF
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-xl p-1 font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Main Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Título de la Orden *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ej. Inspección y Cambio de Filtros HVAC"
                className="w-full bg-[#1E3E62]/40 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-[#D4AF37] outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Activo / Equipo *</label>
              <select
                value={formData.assetId}
                onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
                className="w-full bg-[#1E3E62]/40 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-[#D4AF37] outline-none"
              >
                {assets.map(ast => (
                  <option key={ast.id} value={ast.id}>
                    {ast.name} ({ast.development})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Prioridad</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-[#1E3E62]/40 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-[#D4AF37] outline-none font-bold"
              >
                <option value="Urgente">🚨 Urgente</option>
                <option value="Alta">🟧 Alta</option>
                <option value="Media">🟨 Media</option>
                <option value="Baja">🟦 Baja</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Estado</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-[#1E3E62]/40 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-[#D4AF37] outline-none font-bold"
              >
                <option value="Abierta">🔵 Abierta</option>
                <option value="En Proceso">🟣 En Proceso</option>
                <option value="En Espera">🟡 En Espera</option>
                <option value="Completada">🟢 Completada</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Categoría</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#1E3E62]/40 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-[#D4AF37] outline-none"
              >
                <option value="Preventivo">Preventivo</option>
                <option value="Correctivo">Correctivo</option>
                <option value="Inspección">Inspección</option>
                <option value="Seguridad">Seguridad</option>
                <option value="Eléctrico">Eléctrico</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Técnico Asignado</label>
              <select
                value={formData.assignedTech}
                onChange={(e) => setFormData({ ...formData, assignedTech: e.target.value })}
                className="w-full bg-[#1E3E62]/40 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-[#D4AF37] outline-none"
              >
                {technicians.map(t => (
                  <option key={t.id} value={t.name}>{t.name} ({t.role})</option>
                ))}
              </select>
            </div>

          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Descripción Detallada del Requerimiento</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Escriba las instrucciones de trabajo para el técnico..."
              className="w-full bg-[#1E3E62]/40 border border-slate-700 rounded-lg p-3 text-xs text-white focus:border-[#D4AF37] outline-none"
            />
          </div>

          {/* CHECKLIST SECTION */}
          <div className="p-4 rounded-xl bg-[#1E3E62]/20 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              1. Procedimiento & Checklist de Verificación paso a paso
            </h3>

            <div className="space-y-2">
              {formData.checklist.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 rounded bg-[#0B192C] border border-slate-800 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleChecklistToggle(item.id)}
                      className="w-4 h-4 accent-[#D4AF37] rounded"
                    />
                    <span className={item.completed ? 'line-through text-slate-400' : 'text-slate-200 font-medium'}>
                      {item.text}
                    </span>
                  </label>
                  <div className="flex items-center gap-2">
                    {item.completed && (
                      <span className="text-[10px] text-emerald-400 font-mono">{item.timestamp}</span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveChecklistItem(item.id)}
                      className="text-slate-500 hover:text-red-400 text-xs"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                placeholder="Agregar nuevo paso al procedimiento..."
                className="flex-1 bg-[#0B192C] border border-slate-700 rounded px-3 py-1.5 text-xs text-white outline-none focus:border-[#D4AF37]"
              />
              <button
                type="button"
                onClick={handleAddChecklistItem}
                className="px-3 py-1.5 rounded bg-[#1E3E62] hover:bg-[#2A4E78] text-amber-300 text-xs font-bold"
              >
                + Agregar Paso
              </button>
            </div>
          </div>

          {/* SPARE PARTS & COSTS SECTION */}
          <div className="p-4 rounded-xl bg-[#1E3E62]/20 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              2. Asignación de Repuestos & Cálculo de Costo Total
            </h3>

            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={selectedPartId}
                onChange={(e) => setSelectedPartId(e.target.value)}
                className="flex-1 bg-[#0B192C] border border-slate-700 rounded px-3 py-1.5 text-xs text-white outline-none"
              >
                {inventory.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Stock: {p.currentStock}) - ${p.unitCost} USD
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                value={partQty}
                onChange={(e) => setPartQty(e.target.value)}
                className="w-20 bg-[#0B192C] border border-slate-700 rounded px-2 py-1.5 text-xs text-white text-center outline-none"
              />
              <button
                type="button"
                onClick={handleAddPart}
                className="px-4 py-1.5 rounded gold-gradient-bg text-[#0B192C] text-xs font-bold"
              >
                + Añadir Repuesto
              </button>
            </div>

            {formData.usedParts.length > 0 && (
              <div className="space-y-1.5">
                {formData.usedParts.map(p => (
                  <div key={p.partId} className="flex items-center justify-between p-2 rounded bg-[#0B192C] text-xs border border-slate-800">
                    <span className="text-slate-200 font-semibold">{p.name} (x{p.qty})</span>
                    <div className="flex items-center gap-3">
                      <span className="text-amber-300 font-bold">${p.totalCost.toFixed(2)} USD</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePart(p.partId)}
                        className="text-red-400 hover:text-red-300"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="p-3 rounded bg-[#0B192C] border border-[#D4AF37]/30 flex justify-between items-center text-xs">
              <span className="text-slate-300">Materiales: <b>${totalPartsCost.toFixed(2)}</b> | Mano de Obra: <b>${totalLaborCost.toFixed(2)}</b></span>
              <span className="text-sm font-extrabold text-amber-300">TOTAL: ${grandTotal.toFixed(2)} USD</span>
            </div>
          </div>

          {/* SIGNATURE PAD */}
          <div className="p-4 rounded-xl bg-[#1E3E62]/20 border border-slate-800">
            <SignaturePad
              initialSignature={formData.signatureData}
              onSaveSignature={(sig) => setFormData(prev => ({ ...prev, signatureData: sig }))}
            />
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg gold-gradient-bg text-[#0B192C] font-extrabold text-xs shadow hover:scale-105 transition-transform"
            >
              💾 Guardar Orden de Trabajo
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
