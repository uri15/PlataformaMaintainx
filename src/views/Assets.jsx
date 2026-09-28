import React from 'react';
import { Icon } from '../components/Icon.jsx';
import { SafeImage } from '../components/SafeImage.jsx';

export const Assets = ({ assets = [], workOrders = [], onSaveAsset, onDeleteAsset }) => {
  const [selectedAsset, setSelectedAsset] = React.useState(null);
  const [isAssetModalOpen, setIsAssetModalOpen] = React.useState(false);
  const [editingAsset, setEditingAsset] = React.useState(null); // null = new, object = edit
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('ALL');
  const [filterCriticality, setFilterCriticality] = React.useState('ALL');
  const [assetToDelete, setAssetToDelete] = React.useState(null);

  const initialFormState = {
    id: '',
    code: '',
    name: '',
    category: 'Eléctrico',
    development: 'Park Industrial',
    location: '',
    brand: '',
    model: '',
    serialNumber: '',
    criticality: 'Media',
    status: 'Operativo',
    specs: '',
    mttrHours: 2.5,
    mtbfDays: 90,
    totalMaintenanceCost: 0
  };

  const [formData, setFormData] = React.useState(initialFormState);
  const [formErrors, setFormErrors] = React.useState({});

  const categoriesList = [
    'Eléctrico',
    'Climatización / HVAC',
    'Hidráulico',
    'Mecánico',
    'Infraestructura / Edificio',
    'Elevación / Transporte',
    'Seguridad & Incendio',
    'Automatización & Control',
    'General'
  ];

  const developmentsList = [
    'Park Industrial',
    'Torre Corporativa Park',
    'Complejo Logístico Norte',
    'Parque Tecnológico Sur',
    'Planta de Producción'
  ];

  const handleOpenNewModal = () => {
    const randomCode = Math.floor(100 + Math.random() * 900);
    setEditingAsset(null);
    setFormData({
      ...initialFormState,
      id: `AST-${Date.now().toString().slice(-4)}`,
      code: `EQ-${randomCode}`,
      development: 'Park Industrial'
    });
    setFormErrors({});
    setIsAssetModalOpen(true);
  };

  const handleOpenEditModal = (asset, e) => {
    if (e) e.stopPropagation();
    setEditingAsset(asset);
    setFormData({
      id: asset.id || `AST-${Date.now().toString().slice(-4)}`,
      code: asset.code || '',
      name: asset.name || '',
      category: asset.category || 'Eléctrico',
      development: asset.development || 'Park Industrial',
      location: asset.location || '',
      brand: asset.brand || '',
      model: asset.model || '',
      serialNumber: asset.serialNumber || '',
      criticality: asset.criticality || 'Media',
      status: asset.status || 'Operativo',
      specs: asset.specs || '',
      mttrHours: asset.mttrHours ?? 2.5,
      mtbfDays: asset.mtbfDays ?? 90,
      totalMaintenanceCost: asset.totalMaintenanceCost ?? 0
    });
    setFormErrors({});
    setIsAssetModalOpen(true);
  };

  const handleSubmitAsset = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.name.trim()) errors.name = 'El nombre del activo / equipo es obligatorio';
    if (!formData.code.trim()) errors.code = 'El código o tag técnico es obligatorio';
    if (!formData.location.trim()) errors.location = 'La ubicación física es obligatoria';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const assetToSave = {
      ...formData,
      id: formData.id || `AST-${Math.floor(1000 + Math.random() * 9000)}`,
      mttrHours: Number(formData.mttrHours) || 0,
      mtbfDays: Number(formData.mtbfDays) || 0,
      totalMaintenanceCost: Number(formData.totalMaintenanceCost) || 0
    };

    if (onSaveAsset) {
      onSaveAsset(assetToSave);
    }
    setIsAssetModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (assetToDelete && onDeleteAsset) {
      onDeleteAsset(assetToDelete.id);
      if (selectedAsset && selectedAsset.id === assetToDelete.id) {
        setSelectedAsset(null);
      }
    }
    setAssetToDelete(null);
  };

  // KPIs
  const totalAssetsCount = assets.length;
  const operationalCount = assets.filter(a => a.status === 'Operativo').length;
  const maintenanceOrDownCount = assets.filter(a => a.status === 'En Mantenimiento' || a.status === 'Fuera de Servicio').length;
  const totalAccumulatedCost = assets.reduce((sum, a) => sum + (a.totalMaintenanceCost || 0), 0);

  // Filtered Assets
  const filteredAssets = assets.filter((asset) => {
    const q = (searchTerm || '').trim().toLowerCase();
    const matchesSearch = !q ||
      (asset.name || '').toLowerCase().includes(q) ||
      (asset.code || '').toLowerCase().includes(q) ||
      (asset.brand || '').toLowerCase().includes(q) ||
      (asset.model || '').toLowerCase().includes(q) ||
      (asset.location || '').toLowerCase().includes(q) ||
      (asset.development || '').toLowerCase().includes(q) ||
      (asset.serialNumber || '').toLowerCase().includes(q);

    const matchesStatus = filterStatus === 'ALL' || asset.status === filterStatus;
    const matchesCriticality = filterCriticality === 'ALL' || asset.criticality === filterCriticality;

    return matchesSearch && matchesStatus && matchesCriticality;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl park-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0A3963] font-heading">
            Gestión de Activos & Infraestructura
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Inventario técnico, catálogo de maquinaria y expedientes de equipos | Plataforma PARK
          </p>
        </div>
        <button
          onClick={handleOpenNewModal}
          className="px-5 py-2.5 rounded-xl btn-park-green text-white font-extrabold text-xs shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
        >
          <Icon name="plus" className="w-4 h-4 mr-1" />
          <span>Registrar Nuevo Activo / Equipo</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl park-card flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Equipos</p>
            <h3 className="text-2xl font-extrabold text-[#0A3963] mt-1 font-heading">{totalAssetsCount}</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Activos en catálogo</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0A3963] shrink-0">
            <Icon name="assets" className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-xl park-card flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">100% Operativos</p>
            <h3 className="text-2xl font-extrabold text-emerald-600 mt-1 font-heading">{operationalCount}</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">En óptimo funcionamiento</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Icon name="check" className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-xl park-card flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Atención Requerida</p>
            <h3 className={`text-2xl font-extrabold mt-1 font-heading ${maintenanceOrDownCount > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
              {maintenanceOrDownCount}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Mantenimiento o Paro</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Icon name="alert" className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-xl park-card flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Costo Acumulado</p>
            <h3 className="text-2xl font-extrabold text-[#0A3963] mt-1 font-heading">${totalAccumulatedCost.toFixed(2)}</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Gasto en reparaciones USD</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#0A3963] shrink-0">
            <Icon name="dollar" className="w-6 h-6 text-[#8CC63F]" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl park-card flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Buscar por activo, código, marca, modelo, ubicación..."
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

        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap sm:flex-nowrap">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="Operativo">🟢 Operativo</option>
            <option value="En Mantenimiento">🟡 En Mantenimiento</option>
            <option value="Fuera de Servicio">🔴 Fuera de Servicio</option>
          </select>

          <select
            value={filterCriticality}
            onChange={(e) => setFilterCriticality(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none"
          >
            <option value="ALL">Toda Criticidad</option>
            <option value="Alta">🚨 Criticidad Alta</option>
            <option value="Media">🟨 Criticidad Media</option>
            <option value="Baja">🟦 Criticidad Baja</option>
          </select>
        </div>
      </div>

      {/* Grid of Assets */}
      {filteredAssets.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <span className="text-4xl block">🏭</span>
          <h3 className="text-sm font-bold text-slate-700">No se encontraron activos ni equipos</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {assets.length === 0
              ? 'El catálogo de activos está vacío. Comienza a registrar tu infraestructura técnica para asociar órdenes de trabajo.'
              : 'No hay equipos que coincidan con los filtros de búsqueda aplicados.'}
          </p>
          <button
            onClick={handleOpenNewModal}
            className="mt-2 px-4 py-2 rounded-xl btn-park-green text-white text-xs font-extrabold shadow-sm hover:scale-105 transition-transform"
          >
            + Registrar Nuevo Activo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((asset) => {
            let statusBadge = "badge-completed";
            if (asset.status === 'Fuera de Servicio') statusBadge = "badge-urgent";
            else if (asset.status === 'En Mantenimiento') statusBadge = "badge-medium";

            const historyWO = workOrders.filter(w => w.assetId === asset.id || w.assetName === asset.name);

            return (
              <div
                key={asset.id}
                onClick={() => setSelectedAsset(asset)}
                className="p-5 rounded-2xl park-card park-card-hover cursor-pointer space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#0A3963] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{asset.code}</span>

                    <div className="flex items-center gap-1.5">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold ${statusBadge}`}>
                        {asset.status}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleOpenEditModal(asset, e)}
                        className="p-1 rounded-md text-slate-400 hover:text-[#0A3963] hover:bg-slate-100 transition-colors"
                        title="Editar Activo"
                      >
                        <Icon name="edit" className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAssetToDelete(asset);
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Eliminar Activo"
                      >
                        <Icon name="trash" className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0A3963] font-heading">
                    {asset.name}
                  </h3>

                  <p className="text-xs text-slate-600 font-medium">
                    📍 {asset.location} {asset.development ? `• (${asset.development})` : ''}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    🏷️ Marca: <span className="text-slate-800 font-semibold">{asset.brand || 'N/A'}</span> {asset.model ? `(${asset.model})` : ''}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-2 text-[10px]">
                  <div className="p-2 rounded bg-slate-50 border border-slate-200">
                    <p className="text-slate-500 font-medium">Criticidad</p>
                    <p className="font-extrabold text-[#0A3963]">{asset.criticality}</p>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200">
                    <p className="text-slate-500 font-medium">Historial WOs</p>
                    <p className="font-extrabold text-slate-900">{historyWO.length} Registros</p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-slate-500 text-[10px] font-medium">MTTR: {asset.mttrHours || 2.5}h | MTBF: {asset.mtbfDays || 90}d</span>
                  <span className="text-[#8CC63F] font-bold group-hover:underline">Ver Expediente &rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL REGISTRAR / EDITAR ACTIVO */}
      {isAssetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
            <div className="p-5 bg-[#0A3963] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <ParkLogo />
                <div>
                  <h2 className="text-lg font-bold text-white font-heading">
                    {editingAsset ? `Editar Activo: ${formData.code}` : 'Registrar Nuevo Activo / Equipo'}
                  </h2>
                  <p className="text-xs text-[#8CC63F] font-bold">PLATAFORMA PARK CMMS • Módulo de Infraestructura</p>
                </div>
              </div>
              <button
                onClick={() => setIsAssetModalOpen(false)}
                className="text-slate-400 hover:text-white text-xl p-1 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitAsset} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Nombre del Activo / Equipo *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej. Transformador Principal Subestación 1"
                    className={`w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white outline-none font-medium ${formErrors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 focus:border-[#8CC63F]'
                      }`}
                  />
                  {formErrors.name && <p className="text-[10px] text-red-500 mt-1">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Código / Tag Técnico *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="Ej. EQ-001, TR-01"
                    className={`w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white outline-none font-mono font-bold ${formErrors.code ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 focus:border-[#8CC63F]'
                      }`}
                  />
                  {formErrors.code && <p className="text-[10px] text-red-500 mt-1">{formErrors.code}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Categoría Técnica</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#8CC63F] focus:bg-white outline-none font-medium"
                  >
                    {categoriesList.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Desarrollo / Parque</label>
                  <select
                    value={formData.development}
                    onChange={(e) => setFormData({ ...formData, development: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#8CC63F] focus:bg-white outline-none font-medium"
                  >
                    {developmentsList.map(dev => (
                      <option key={dev} value={dev}>{dev}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Ubicación Física *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ej. Edificio A - Azotea Técnica, Caseta 2"
                    className={`w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white outline-none font-medium ${formErrors.location ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 focus:border-[#8CC63F]'
                      }`}
                  />
                  {formErrors.location && <p className="text-[10px] text-red-500 mt-1">{formErrors.location}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Estado Operativo</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#8CC63F] focus:bg-white outline-none font-bold"
                  >
                    <option value="Operativo">🟢 Operativo</option>
                    <option value="En Mantenimiento">🟡 En Mantenimiento</option>
                    <option value="Fuera de Servicio">🔴 Fuera de Servicio</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Criticidad</label>
                  <select
                    value={formData.criticality}
                    onChange={(e) => setFormData({ ...formData, criticality: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#8CC63F] focus:bg-white outline-none font-bold"
                  >
                    <option value="Alta">🚨 Alta</option>
                    <option value="Media">🟨 Media</option>
                    <option value="Baja">🟦 Baja</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Marca del Fabricante</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Ej. Schneider Electric, Trane, Siemens"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#8CC63F] focus:bg-white outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Modelo</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="Ej. Trihal 1000kVA, RTAF-500"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#8CC63F] focus:bg-white outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Número de Serie</label>
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    placeholder="Ej. SN-98472-X"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#8CC63F] focus:bg-white outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">MTTR Estimado (Horas)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.mttrHours}
                    onChange={(e) => setFormData({ ...formData, mttrHours: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#8CC63F] focus:bg-white outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">MTBF Estimado (Días)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.mtbfDays}
                    onChange={(e) => setFormData({ ...formData, mtbfDays: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#8CC63F] focus:bg-white outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Especificaciones Técnicas / Notas de Mantenimiento</label>
                <textarea
                  rows={3}
                  value={formData.specs}
                  onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                  placeholder="Ej. Capacidad: 1000 kVA, Tensión Primaria: 23 kV, Tensión Secundaria: 440/254 V, Tipo de Refrigeración: Seco..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-900 focus:border-[#8CC63F] focus:bg-white outline-none font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAssetModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg btn-park-green text-white text-xs font-extrabold shadow hover:scale-105 transition-transform flex items-center gap-1.5"
                >
                  <Icon name="save" className="w-4 h-4 mr-1" />
                  <span>{editingAsset ? 'Guardar Cambios' : 'Registrar Activo'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {assetToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-xl">
              <Icon name="trash" className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">¿Eliminar este activo?</h3>
              <p className="text-xs text-slate-500">
                Estás a punto de eliminar <b className="text-slate-800">{assetToDelete.name} ({assetToDelete.code})</b>. Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setAssetToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold shadow-sm"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETALLE DE ACTIVO (EXPEDIENTE) */}
      {selectedAsset && !isAssetModalOpen && !assetToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ParkLogo />
                <div>
                  <span className="text-xs font-mono font-bold text-[#0A3963]">{selectedAsset.code}</span>
                  <h2 className="text-xl font-extrabold text-slate-900 font-heading">{selectedAsset.name}</h2>
                </div>
              </div>
              <button onClick={() => setSelectedAsset(null)} className="text-slate-400 hover:text-slate-700 text-xl font-bold">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <p className="text-slate-500 font-medium">Desarrollo / Parque</p>
                <p className="font-bold text-slate-900">{selectedAsset.development || 'Park Industrial'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-500 font-medium">Ubicación Físico-Específica</p>
                <p className="font-bold text-slate-900">{selectedAsset.location}</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-500 font-medium">Marca & Modelo</p>
                <p className="font-bold text-slate-900">{selectedAsset.brand || 'N/A'} {selectedAsset.model ? `(${selectedAsset.model})` : ''}</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-500 font-medium">Número de Serie</p>
                <p className="font-mono text-[#0A3963] font-bold">{selectedAsset.serialNumber || 'No registrado'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-500 font-medium">Estado & Criticidad</p>
                <p className="font-bold text-slate-900">{selectedAsset.status} &bull; {selectedAsset.criticality}</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-500 font-medium">Costo Acumulado Reparaciones</p>
                <p className="font-extrabold text-emerald-700">${(selectedAsset.totalMaintenanceCost || 0).toFixed(2)} USD</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-[#0A3963]">Especificaciones Técnicas:</p>
              <p className="text-slate-700 font-medium whitespace-pre-wrap">{selectedAsset.specs || 'Sin especificaciones técnicas adicionales registradas.'}</p>
            </div>

            <div className="p-4 rounded-xl bg-[#0A3963] border border-slate-800 flex items-center justify-between text-white">
              <div className="space-y-1">
                <p className="text-xs font-bold text-white">Etiqueta Digital QR / Barcode</p>
                <p className="text-[10px] text-slate-300 font-medium">Escanear para apertura rápida en MaintainX Mobile</p>
              </div>
              <div className="w-16 h-16 bg-white p-1 rounded flex items-center justify-center text-[8px] font-mono text-black font-extrabold text-center leading-tight">
                [QR {selectedAsset.code}]
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={(e) => handleOpenEditModal(selectedAsset, e)}
                className="px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0A3963] text-xs font-bold flex items-center gap-1.5"
              >
                <Icon name="edit" className="w-3.5 h-3.5" /> <span>Editar Datos del Activo</span>
              </button>
              <button onClick={() => setSelectedAsset(null)} className="px-4 py-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold">
                Cerrar Expediente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// PreventiveMaintenance;
