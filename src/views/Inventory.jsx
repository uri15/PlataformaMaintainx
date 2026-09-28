import React from 'react';
import { Icon } from '../components/Icon.jsx';

export const Inventory = ({ inventory = [], onUpdateStock, onSavePart, onDeletePart }) => {
  const [isPartModalOpen, setIsPartModalOpen] = React.useState(false);
  const [editingPart, setEditingPart] = React.useState(null); // null = new, object = edit
  const [editingStockItem, setEditingStockItem] = React.useState(null);
  const [stockDelta, setStockDelta] = React.useState(0);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('ALL');
  const [filterStockStatus, setFilterStockStatus] = React.useState('ALL'); // 'ALL' | 'LOW' | 'OPTIMAL'
  const [partToDelete, setPartToDelete] = React.useState(null);

  // Form State for PartModal
  const initialFormState = {
    id: '',
    sku: '',
    name: '',
    category: 'Mecánica',
    currentStock: 10,
    minStock: 5,
    unitCost: 0,
    unit: 'Pieza',
    supplier: '',
    location: '',
    description: ''
  };
  const [formData, setFormData] = React.useState(initialFormState);
  const [formErrors, setFormErrors] = React.useState({});

  const categoriesList = [
    'Mecánica',
    'Eléctrico',
    'Climatización',
    'Lubricantes',
    'Hidráulica',
    'Neumática',
    'Seguridad / EPP',
    'Ferretería & Tornillería',
    'Herramientas',
    'General'
  ];

  const unitsList = [
    'Pieza',
    'Garrafa',
    'Litro',
    'Metro',
    'Caja',
    'Kg',
    'Juego',
    'Rollo',
    'Par',
    'Kit'
  ];

  // Open modal for NEW part
  const handleOpenNewPartModal = () => {
    const randomCode = Math.floor(100 + Math.random() * 900);
    setEditingPart(null);
    setFormData({
      ...initialFormState,
      id: `PRT-${Date.now().toString().slice(-4)}`,
      sku: `SKU-${randomCode}`,
      category: 'Mecánica',
      unit: 'Pieza',
      location: 'Almacén Central'
    });
    setFormErrors({});
    setIsPartModalOpen(true);
  };

  // Open modal for EDITING part
  const handleOpenEditPartModal = (part) => {
    setEditingPart(part);
    setFormData({
      id: part.id || `PRT-${Date.now().toString().slice(-4)}`,
      sku: part.sku || '',
      name: part.name || '',
      category: part.category || 'Mecánica',
      currentStock: part.currentStock ?? 0,
      minStock: part.minStock ?? 0,
      unitCost: part.unitCost ?? 0,
      unit: part.unit || 'Pieza',
      supplier: part.supplier || '',
      location: part.location || '',
      description: part.description || ''
    });
    setFormErrors({});
    setIsPartModalOpen(true);
  };

  // Save part form submission
  const handleSubmitPart = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.name.trim()) errors.name = 'El nombre del repuesto es obligatorio';
    if (!formData.sku.trim()) errors.sku = 'El código SKU es obligatorio';
    if (formData.currentStock < 0) errors.currentStock = 'El stock no puede ser negativo';
    if (formData.minStock < 0) errors.minStock = 'El stock mínimo no puede ser negativo';
    if (formData.unitCost < 0) errors.unitCost = 'El costo unitario no puede ser negativo';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const partToSave = {
      ...formData,
      id: formData.id || `PRT-${Math.floor(1000 + Math.random() * 9000)}`,
      currentStock: Number(formData.currentStock) || 0,
      minStock: Number(formData.minStock) || 0,
      unitCost: Number(formData.unitCost) || 0
    };

    if (onSavePart) {
      onSavePart(partToSave);
    }
    setIsPartModalOpen(false);
  };

  // Quick Stock adjustment save
  const handleSaveStock = () => {
    if (!editingStockItem) return;
    const newStock = Math.max(0, editingStockItem.currentStock + Number(stockDelta));
    if (onUpdateStock) {
      onUpdateStock(editingStockItem.id, newStock);
    }
    setEditingStockItem(null);
    setStockDelta(0);
  };

  // Confirm delete part
  const handleConfirmDelete = () => {
    if (partToDelete && onDeletePart) {
      onDeletePart(partToDelete.id);
    }
    setPartToDelete(null);
  };

  // KPI calculations
  const totalItemsCount = inventory.length;
  const lowStockItems = inventory.filter(i => (i.currentStock || 0) <= (i.minStock || 0));
  const lowStockCount = lowStockItems.length;
  const totalValuation = inventory.reduce((sum, i) => sum + ((i.currentStock || 0) * (i.unitCost || 0)), 0);
  const totalCategories = new Set(inventory.map(i => i.category).filter(Boolean)).size;

  // Filtered items
  const filteredInventory = inventory.filter((item) => {
    const q = (searchTerm || '').trim().toLowerCase();
    const matchesSearch = !q || 
      (item.name || '').toLowerCase().includes(q) ||
      (item.sku || '').toLowerCase().includes(q) ||
      (item.category || '').toLowerCase().includes(q) ||
      (item.supplier || '').toLowerCase().includes(q) ||
      (item.location || '').toLowerCase().includes(q);

    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const isLow = (item.currentStock || 0) <= (item.minStock || 0);
    const matchesStock = filterStockStatus === 'ALL' || 
      (filterStockStatus === 'LOW' && isLow) || 
      (filterStockStatus === 'OPTIMAL' && !isLow);

    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl park-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0A3963] font-heading">
            Repuestos & Control de Almacén
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Gestión integral de refacciones, stock de seguridad y catálogo de piezas | Plataforma PARK
          </p>
        </div>
        <button
          onClick={handleOpenNewPartModal}
          className="px-5 py-2.5 rounded-xl btn-park-green text-white font-extrabold text-xs shadow-md hover:scale-[1.02] active:scale-95 transition-all"
        >
          + Registrar Nuevo Repuesto
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl park-card flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Repuestos</p>
            <h3 className="text-3xl font-extrabold text-[#0A3963] mt-1 font-heading">{totalItemsCount}</h3>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              {totalCategories} categorías en almacén
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0A3963] shrink-0">
            <Icon name="inventory" className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-xl park-card flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stock Bajo / Reorden</p>
            <h3 className="text-3xl font-extrabold text-red-600 mt-1 font-heading">{lowStockCount}</h3>
            <p className="text-xs text-red-600 font-semibold mt-1 inline-flex items-center gap-1">
              <Icon name="alert" className="w-3.5 h-3.5 text-red-600 shrink-0" />
              {lowStockCount > 0 ? 'Requiere reabastecimiento' : 'Stock en niveles óptimos'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
            <Icon name="alert" className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-xl park-card flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Valoración Total</p>
            <h3 className="text-2xl font-extrabold text-emerald-700 mt-1 font-heading">
              ${totalValuation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Capital en inventario activo
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Icon name="dollar" className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-xl park-card flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estado Almacén</p>
            <h3 className="text-2xl font-extrabold text-[#0A3963] mt-1 font-heading">
              {lowStockCount === 0 ? '100% Óptimo' : `${Math.round(((totalItemsCount - lowStockCount) / (totalItemsCount || 1)) * 100)}% Disponible`}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Índice de cobertura de repuestos
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#0A3963] shrink-0">
            <Icon name="check" className="w-6 h-6 text-[#8CC63F]" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl park-card flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Buscar por repuesto, SKU, categoría, ubicación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0A3963]/20 focus:border-[#0A3963]"
          />
          <div className="absolute left-3 top-2.5 text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 font-bold text-xs"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0A3963]"
          >
            <option value="ALL">Todas las Categorías</option>
            {categoriesList.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Stock Status Filter */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setFilterStockStatus('ALL')}
              className={`px-3 py-1 rounded-lg transition-all ${filterStockStatus === 'ALL' ? 'bg-white text-[#0A3963] shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Todos ({totalItemsCount})
            </button>
            <button
              onClick={() => setFilterStockStatus('LOW')}
              className={`px-3 py-1 rounded-lg transition-all ${filterStockStatus === 'LOW' ? 'bg-red-500 text-white shadow-xs' : 'text-slate-600 hover:text-red-600'}`}
            >
              Stock Bajo ({lowStockCount})
            </button>
            <button
              onClick={() => setFilterStockStatus('OPTIMAL')}
              className={`px-3 py-1 rounded-lg transition-all ${filterStockStatus === 'OPTIMAL' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-emerald-700'}`}
            >
              Óptimos
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="p-6 rounded-2xl park-card overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-extrabold text-[#0A3963] uppercase tracking-wider bg-slate-50">
              <th className="py-3.5 px-3">SKU / Código</th>
              <th className="py-3.5 px-3">Nombre del Repuesto & Ubicación</th>
              <th className="py-3.5 px-3">Categoría</th>
              <th className="py-3.5 px-3 text-center">Stock Actual</th>
              <th className="py-3.5 px-3 text-center">Stock Mínimo</th>
              <th className="py-3.5 px-3 text-right">Costo Unit.</th>
              <th className="py-3.5 px-3 text-right">Valor en Stock</th>
              <th className="py-3.5 px-3 text-center whitespace-nowrap min-w-[130px]">Estado</th>
              <th className="py-3.5 px-3 text-center whitespace-nowrap">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs">
            {filteredInventory.length === 0 ? (
              <tr>
                <td colSpan="9" className="py-12 text-center text-slate-400">
                  <div className="max-w-xs mx-auto space-y-2">
                    <p className="text-sm font-bold text-slate-600">No se encontraron repuestos</p>
                    <p className="text-xs">No hay elementos que coincidan con los filtros seleccionados o el catálogo está vacío.</p>
                    <button
                      onClick={handleOpenNewPartModal}
                      className="mt-2 px-4 py-1.5 rounded-lg btn-park-green text-white text-xs font-bold"
                    >
                      Registrar Nuevo Repuesto
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredInventory.map((item) => {
                const currentStock = item.currentStock || 0;
                const minStock = item.minStock || 0;
                const isLow = currentStock <= minStock;
                const unitCost = item.unitCost || 0;
                const totalItemValue = currentStock * unitCost;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/90 transition-colors group">
                    <td className="py-3.5 px-3 font-mono font-bold text-[#0A3963]">
                      <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{item.sku}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-slate-900 group-hover:text-[#0A3963] transition-colors">{item.name}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                        {item.location && <span>📍 {item.location}</span>}
                        {item.supplier && <span>🏢 {item.supplier}</span>}
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                        {item.category || 'General'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`font-extrabold text-sm ${isLow ? 'text-red-600' : 'text-slate-900'}`}>
                        {currentStock}
                      </span>{' '}
                      <span className="text-[10px] text-slate-500 font-semibold">{item.unit || 'Pza'}</span>
                    </td>
                    <td className="py-3.5 px-3 text-center text-slate-500 font-semibold">
                      {minStock} <span className="text-[10px]">{item.unit || 'Pza'}</span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-extrabold text-[#0A3963]">
                      ${unitCost.toFixed(2)} USD
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold text-slate-800">
                      ${totalItemValue.toFixed(2)} USD
                    </td>
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      {isLow ? (
                        <span className="inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-red-50 text-red-600 border border-red-200 animate-pulse whitespace-nowrap">
                          <Icon name="alert" className="w-3 h-3 text-red-600 shrink-0" /> Reordenar Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                          <Icon name="check" className="w-3 h-3 text-emerald-600 shrink-0" /> Óptimo
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingStockItem(item);
                            setStockDelta(0);
                          }}
                          className="px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0A3963] text-[10px] font-bold border border-blue-200 transition-colors"
                          title="Ajustar cantidad en stock rápido"
                        >
                          Stock
                        </button>
                        <button
                          onClick={() => handleOpenEditPartModal(item)}
                          className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-[#0A3963] transition-colors"
                          title="Editar información completa del repuesto"
                        >
                          <Icon name="edit" className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setPartToDelete(item)}
                          className="p-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-800 transition-colors"
                          title="Eliminar repuesto"
                        >
                          <Icon name="trash" className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL: Crear o Editar Repuesto Completo */}
      {isPartModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-[#0A3963] to-[#0A3963]/90 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#8CC63F]">
                  <Icon name="inventory" className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg font-heading">
                    {editingPart ? 'Editar Repuesto de Inventario' : 'Registrar Nuevo Repuesto'}
                  </h3>
                  <p className="text-xs text-white/80 font-medium">
                    {editingPart ? `Modificando datos de ${editingPart.sku}` : 'Ingresa la información técnica, física y de costos del insumo'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsPartModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitPart} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nombre del Repuesto */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre del Repuesto / Insumo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Filtro de Aire HVAC 24x24x2 MERV 13"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A3963]/20 focus:border-[#0A3963]"
                  />
                  {formErrors.name && <p className="text-[10px] text-red-500 mt-1 font-bold">{formErrors.name}</p>}
                </div>

                {/* SKU / Código */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Código SKU / Referencia <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. FIL-HVAC-2424"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-[#0A3963] focus:outline-none focus:ring-2 focus:ring-[#0A3963]/20 focus:border-[#0A3963]"
                  />
                  {formErrors.sku && <p className="text-[10px] text-red-500 mt-1 font-bold">{formErrors.sku}</p>}
                </div>

                {/* Categoría */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Categoría <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A3963]/20 focus:border-[#0A3963]"
                  >
                    {categoriesList.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Stock Inicial / Actual */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Stock Actual / Inicial <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.currentStock}
                    onChange={(e) => setFormData({ ...formData, currentStock: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A3963]/20 focus:border-[#0A3963]"
                  />
                  {formErrors.currentStock && <p className="text-[10px] text-red-500 mt-1 font-bold">{formErrors.currentStock}</p>}
                </div>

                {/* Stock Mínimo */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Stock Mínimo (Punto de Reorden) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A3963]/20 focus:border-[#0A3963]"
                  />
                  {formErrors.minStock && <p className="text-[10px] text-red-500 mt-1 font-bold">{formErrors.minStock}</p>}
                </div>

                {/* Unidad de Medida */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Unidad de Medida
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A3963]/20 focus:border-[#0A3963]"
                  >
                    {unitsList.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>

                {/* Costo Unitario en USD */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Costo Unitario ($ USD) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      placeholder="0.00"
                      value={formData.unitCost}
                      onChange={(e) => setFormData({ ...formData, unitCost: Number(e.target.value) })}
                      className="w-full pl-7 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0A3963] focus:outline-none focus:ring-2 focus:ring-[#0A3963]/20 focus:border-[#0A3963]"
                    />
                  </div>
                  {formErrors.unitCost && <p className="text-[10px] text-red-500 mt-1 font-bold">{formErrors.unitCost}</p>}
                </div>

                {/* Ubicación en Almacén */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ubicación en Almacén / Estante
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Almacén Central - RACK A-2"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A3963]/20 focus:border-[#0A3963]"
                  />
                </div>

                {/* Proveedor / Distribuidor */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Proveedor / Fabricante
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Filtros Industriales de México S.A."
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A3963]/20 focus:border-[#0A3963]"
                  />
                </div>

                {/* Notas / Descripción adicional */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Notas Técnicas & Compatibilidad (Opcional)
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Especificaciones adicionales, números de parte cruzados o equipos compatibles..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A3963]/20 focus:border-[#0A3963]"
                  />
                </div>
              </div>

              {/* Botones de acción del Modal */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPartModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl btn-park-green text-white text-xs font-extrabold shadow-md hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {editingPart ? 'Guardar Cambios' : 'Registrar Repuesto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Ajuste Rápido de Stock */}
      {editingStockItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base font-heading">
                Ajuste de Stock
              </h3>
              <button onClick={() => setEditingStockItem(null)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-xs font-bold text-slate-900">{editingStockItem.name}</p>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">SKU: {editingStockItem.sku} • Ubicación: {editingStockItem.location || 'N/A'}</p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200 text-xs">
                <span className="text-slate-600 font-medium">Stock Actual:</span>
                <span className="font-extrabold text-[#0A3963] text-sm">{editingStockItem.currentStock} {editingStockItem.unit}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Cantidad a Ingresar (+) o Descontar (-)
              </label>
              <input
                type="number"
                value={stockDelta}
                onChange={(e) => setStockDelta(e.target.value)}
                placeholder="Ej. +10 o -5"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3963]/20 focus:border-[#0A3963]"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Nuevo stock proyectado: <b className="text-slate-900 font-bold">{Math.max(0, editingStockItem.currentStock + Number(stockDelta))} {editingStockItem.unit}</b>
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setEditingStockItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveStock}
                className="px-5 py-2 rounded-xl btn-park-green text-white text-xs font-extrabold shadow-sm hover:scale-[1.02] transition-transform"
              >
                Actualizar Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Confirmar Eliminación */}
      {partToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-4 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Icon name="trash" className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base font-heading">
              ¿Eliminar repuesto?
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              ¿Estás seguro de que deseas eliminar <b className="text-slate-800 font-bold">{partToDelete.name}</b> ({partToDelete.sku}) del catálogo de inventario?
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setPartToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold shadow-sm transition-colors"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

  
// Consolidated PDF Generator Modal (en Centro de Reportes);
