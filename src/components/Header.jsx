import React from 'react';

export const Header = ({ 
  searchTerm, 
  setSearchTerm, 
  onNewWorkOrder, 
  onOpenPdfExport, 
  onResetData, 
  lowStockCount 
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0B192C] border-b border-[#D4AF37]/20 shadow-lg px-4 lg:px-8 py-3 transition-all">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg gold-gradient-bg flex items-center justify-center font-bold text-[#0B192C] text-xl shadow-md tracking-tighter">
            P
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-2xl tracking-wider text-white">PARK</span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 font-semibold uppercase tracking-wider">
                CMMS
              </span>
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">
              PLATAFORMA INFRAESTRUCTURA | GRUPO FAVIER
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1 max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            🔍
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar órdenes de trabajo, activos, repuestos..."
            className="w-full pl-9 pr-4 py-2 bg-[#1E3E62]/40 border border-[#D4AF37]/20 rounded-lg text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          
          {/* Low Stock Warning Alert Badge */}
          {lowStockCount > 0 && (
            <div 
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium animate-pulse"
              title="Repuestos por debajo del nivel mínimo"
            >
              ⚠️ <span>{lowStockCount} Stock Crítico</span>
            </div>
          )}

          {/* Export PDF Button */}
          <button
            onClick={onOpenPdfExport}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#1E3E62] hover:bg-[#2A4E78] text-amber-300 border border-[#D4AF37]/30 text-xs font-semibold shadow transition-all hover:scale-[1.02]"
          >
            📄 <span>Exportar Reporte PDF</span>
          </button>

          {/* New Work Order Button */}
          <button
            onClick={onNewWorkOrder}
            className="flex items-center gap-2 px-4 py-2 rounded-lg gold-gradient-bg text-[#0B192C] font-bold text-xs shadow-md hover:opacity-95 transition-all hover:scale-[1.02]"
          >
            ➕ <span>Nueva Orden</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={onResetData}
            title="Recargar datos de prueba de Grupo Favier"
            className="px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-all"
          >
            🔄 Demo Data
          </button>

        </div>

      </div>
    </header>
  );
};
