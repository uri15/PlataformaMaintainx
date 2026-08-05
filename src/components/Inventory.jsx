import React, { useState } from 'react';

export const Inventory = ({ inventory, onUpdateStock }) => {
  const [editingItem, setEditingItem] = useState(null);
  const [stockDelta, setStockDelta] = useState(0);

  const handleSaveStock = () => {
    if (!editingItem) return;
    const newStock = Math.max(0, editingItem.currentStock + Number(stockDelta));
    onUpdateStock(editingItem.id, newStock);
    setEditingItem(null);
    setStockDelta(0);
  };

  return (
    <div className="space-y-6">
      
      <div className="p-5 rounded-2xl glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-heading">
            Repuestos & Control de Almacén
          </h1>
          <p className="text-xs text-slate-300">
            Inventario de refacciones e insumos de mantenimiento | Plataforma PARK
          </p>
        </div>
      </div>

      <div className="p-5 rounded-2xl glass-card overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-700 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              <th className="py-3 px-3">SKU</th>
              <th className="py-3 px-3">Nombre del Repuesto</th>
              <th className="py-3 px-3">Categoría</th>
              <th className="py-3 px-3 text-center">Stock Actual</th>
              <th className="py-3 px-3 text-center">Stock Mínimo</th>
              <th className="py-3 px-3 text-right">Costo Unit.</th>
              <th className="py-3 px-3 text-center">Estado</th>
              <th className="py-3 px-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-xs">
            {inventory.map((item) => {
              const isLow = item.currentStock <= item.minStock;

              return (
                <tr key={item.id} className="hover:bg-[#1E3E62]/40 transition-colors">
                  <td className="py-3.5 px-3 font-mono font-bold text-[#D4AF37]">{item.sku}</td>
                  <td className="py-3.5 px-3 font-bold text-white">
                    {item.name}
                    <p className="text-[10px] text-slate-400 font-normal">{item.location}</p>
                  </td>
                  <td className="py-3.5 px-3 text-slate-300">{item.category}</td>
                  <td className="py-3.5 px-3 text-center font-bold text-lg text-white">
                    {item.currentStock} {item.unit}
                  </td>
                  <td className="py-3.5 px-3 text-center text-slate-400 font-medium">
                    {item.minStock} {item.unit}
                  </td>
                  <td className="py-3.5 px-3 text-right font-bold text-amber-300">
                    ${item.unitCost.toFixed(2)} USD
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    {isLow ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
                        ⚠️ Reordenar
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        ✓ Óptimo
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setStockDelta(0);
                      }}
                      className="px-2.5 py-1 rounded bg-[#1E3E62] hover:bg-[#2A4E78] text-amber-300 text-[10px] font-bold"
                    >
                      ✏️ Ajustar Stock
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Stock Adjustment Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#0B192C] border border-[#D4AF37]/30 rounded-2xl shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Ajuste de Stock: {editingItem.name}</h3>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-300">
              Stock Actual: <b className="text-amber-300">{editingItem.currentStock} {editingItem.unit}</b>
            </p>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Entrada (+) / Salida (-) de repuestos</label>
              <input
                type="number"
                value={stockDelta}
                onChange={(e) => setStockDelta(e.target.value)}
                placeholder="Ej. 5 o -2"
                className="w-full bg-[#1E3E62]/40 border border-slate-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setEditingItem(null)} className="px-4 py-2 rounded bg-slate-800 text-xs font-bold text-slate-300">
                Cancelar
              </button>
              <button onClick={handleSaveStock} className="px-4 py-2 rounded gold-gradient-bg text-[#0B192C] text-xs font-extrabold">
                💾 Guardar Ajuste
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
