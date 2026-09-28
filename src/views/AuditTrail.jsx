import React from 'react';
import { Icon } from '../components/Icon.jsx';

export const AuditTrail = ({ currentUser }) => {
  const [logs, setLogs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('ALL');
  const [severityFilter, setSeverityFilter] = React.useState('ALL');
  const [dateFilter, setDateFilter] = React.useState('ALL');
  const [selectedLog, setSelectedLog] = React.useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);
  const [copiedSuccess, setCopiedSuccess] = React.useState(false);

  // Cargar registros desde la API
  const fetchAuditLogs = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/audit/logs?limit=500');
      if (res.ok) {
        const json = await res.json();
        setLogs(Array.isArray(json.logs) ? json.logs : []);
      }
    } catch (err) {
      console.warn('Error al cargar bitácora de auditoría:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  // Suscripción a eventos en tiempo real vía CustomEvent o polling
  React.useEffect(() => {
    const handleNewLog = (e) => {
      if (e?.detail?.log) {
        setLogs(prev => [e.detail.log, ...prev]);
      }
    };
    window.addEventListener('cmms:audit:new', handleNewLog);
    return () => window.removeEventListener('cmms:audit:new', handleNewLog);
  }, []);

  // Filtrado reactivo
  const filteredLogs = React.useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    return logs.filter(log => {
      // 1. Búsqueda por texto
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        const matchesTerm = 
          (log.folio || '').toLowerCase().includes(term) ||
          (log.details || '').toLowerCase().includes(term) ||
          (log.action || '').toLowerCase().includes(term) ||
          (log.userName || '').toLowerCase().includes(term) ||
          (log.userEmail || '').toLowerCase().includes(term) ||
          (log.category || '').toLowerCase().includes(term);
        if (!matchesTerm) return false;
      }

      // 2. Filtro de Categoría
      if (categoryFilter !== 'ALL' && log.category !== categoryFilter) {
        return false;
      }

      // 3. Filtro de Severidad
      if (severityFilter !== 'ALL' && log.severity !== severityFilter) {
        return false;
      }

      // 4. Filtro de Fecha
      if (dateFilter === 'TODAY') {
        const logDateStr = (log.timestamp || '').split('T')[0];
        if (logDateStr !== todayStr) return false;
      } else if (dateFilter === 'WEEK') {
        const logTime = new Date(log.timestamp || 0).getTime();
        if (logTime < sevenDaysAgo.getTime()) return false;
      }

      return true;
    });
  }, [logs, searchTerm, categoryFilter, severityFilter, dateFilter]);

  // Contadores para KPIs
  const stats = React.useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const total = logs.length;
    const critical = logs.filter(l => l.severity === 'CRITICO' || l.severity === 'ADVERTENCIA').length;
    const todayCount = logs.filter(l => (l.timestamp || '').split('T')[0] === todayStr).length;
    const uniqueUsers = new Set(logs.map(l => l.userEmail || l.userName).filter(Boolean)).size;

    return { total, critical, todayCount, uniqueUsers };
  }, [logs]);

  // Exportar a CSV para Excel
  const handleExportCSV = () => {
    if (filteredLogs.length === 0) return;

    const headers = ['Folio', 'Fecha y Hora', 'Categoría', 'Acción', 'Severidad', 'Usuario', 'Correo', 'Rol', 'Detalle Operacional', 'Target ID'];
    const rows = filteredLogs.map(l => [
      `"${l.folio || ''}"`,
      `"${l.formattedDate || l.timestamp || ''}"`,
      `"${l.category || ''}"`,
      `"${l.action || ''}"`,
      `"${l.severity || ''}"`,
      `"${(l.userName || '').replace(/"/g, '""')}"`,
      `"${l.userEmail || ''}"`,
      `"${l.userRole || ''}"`,
      `"${(l.details || '').replace(/"/g, '""')}"`,
      `"${l.targetId || ''}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Bitacora_Auditoria_PlataformaPark_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'SEGURIDAD':
        return { label: 'Seguridad & Acceso', bg: 'bg-amber-100 text-amber-800 border-amber-200', icon: 'shield' };
      case 'ORDENES':
        return { label: 'Órdenes de Trabajo', bg: 'bg-blue-100 text-blue-800 border-blue-200', icon: 'workOrders' };
      case 'INVENTARIO':
        return { label: 'Inventario & Stock', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: 'inventory' };
      case 'ACTIVOS':
        return { label: 'Activos & Maquinaria', bg: 'bg-cyan-100 text-cyan-800 border-cyan-200', icon: 'assets' };
      case 'USUARIOS':
        return { label: 'Usuarios & Accesos', bg: 'bg-purple-100 text-purple-800 border-purple-200', icon: 'users' };
      default:
        return { label: category || 'General', bg: 'bg-slate-100 text-slate-700 border-slate-200', icon: 'history' };
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'CRITICO':
        return 'bg-red-100 text-red-800 border-red-300 font-black';
      case 'ADVERTENCIA':
        return 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
      case 'EXITO':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 font-medium';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header y Acciones */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-[#0A3963]/10 text-[#0A3963] border border-[#0A3963]/15">
              <Icon name="shield" className="w-5 h-5 text-[#0A3963]" />
            </span>
            <div>
              <h2 className="text-xl font-extrabold text-[#0A3963] font-heading">
                Bitácora de Auditoría y Trazabilidad (Audit Trail)
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Registro Criptográfico Inmutable &bull; ISO 55000
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {filteredLogs.length} eventos listados
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={fetchAuditLogs}
            disabled={loading}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
            title="Recargar registros"
          >
            <Icon name="history" className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            disabled={filteredLogs.length === 0}
            className="px-4 py-2.5 rounded-xl btn-park-green text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-50"
          >
            <Icon name="reports" className="w-4 h-4" />
            <span>Exportar CSV para Excel</span>
          </button>
        </div>
      </div>

      {/* KPI Cards de Auditoría */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold uppercase text-slate-400">Total Eventos Registrados</p>
          <p className="text-2xl font-extrabold text-[#0A3963] mt-1">{stats.total}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Operaciones históricas</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold uppercase text-amber-600">Eventos Críticos / Alertas</p>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">{stats.critical}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Atención requerida</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold uppercase text-emerald-600">Actividad Registrada Hoy</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{stats.todayCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Jornada actual</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold uppercase text-purple-600">Usuarios con Actividad</p>
          <p className="text-2xl font-extrabold text-purple-700 mt-1">{stats.uniqueUsers}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Técnicos y administradores</p>
        </div>
      </div>

      {/* Toolbar de Filtros y Búsqueda */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Búsqueda */}
          <div className="relative w-full md:w-96">
            <Icon name="search" className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por Folio, Usuario, Detalle o Acción..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#8CC63F] focus:bg-white transition-all"
            />
          </div>

          {/* Filtros Dropdown */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#8CC63F]"
            >
              <option value="ALL">Todas las Severidades</option>
              <option value="INFO">Informativas (INFO)</option>
              <option value="EXITO">Exitosas (EXITO)</option>
              <option value="ADVERTENCIA">Advertencias (WARN)</option>
              <option value="CRITICO">Críticas (CRITICO)</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#8CC63F]"
            >
              <option value="ALL">Todo el Historial</option>
              <option value="TODAY">Solo Eventos de Hoy</option>
              <option value="WEEK">Últimos 7 días</option>
            </select>
          </div>
        </div>

        {/* Categorías en Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100">
          {[
            { id: 'ALL', label: 'Todas las Categorías', count: logs.length },
            { id: 'SEGURIDAD', label: 'Seguridad & Acceso', count: logs.filter(l => l.category === 'SEGURIDAD').length },
            { id: 'ORDENES', label: 'Órdenes de Trabajo', count: logs.filter(l => l.category === 'ORDENES').length },
            { id: 'INVENTARIO', label: 'Inventario & Stock', count: logs.filter(l => l.category === 'INVENTARIO').length },
            { id: 'ACTIVOS', label: 'Activos & Maquinaria', count: logs.filter(l => l.category === 'ACTIVOS').length },
            { id: 'USUARIOS', label: 'Gestión de Usuarios', count: logs.filter(l => l.category === 'USUARIOS').length }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCategoryFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                categoryFilter === tab.id
                  ? 'bg-[#0A3963] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                categoryFilter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de Registros de Auditoría */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Folio & Fecha/Hora</th>
                <th className="py-3 px-4">Usuario Responsable</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4">Acción & Severidad</th>
                <th className="py-3 px-4">Detalle Operacional</th>
                <th className="py-3 px-4 text-center">Trazabilidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-xl mb-2">
                      <Icon name="shield" className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-slate-600 text-sm">No se encontraron registros de auditoría</p>
                    <p className="text-xs text-slate-400 mt-1">Ajusta los filtros de búsqueda o realiza operaciones en el sistema.</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => {
                  const catBadge = getCategoryBadge(log.category);
                  const sevClass = getSeverityBadge(log.severity);

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Folio y Fecha */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200">
                          {log.folio || 'AUD-S/F'}
                        </span>
                        <p className="text-[11px] text-slate-500 mt-1">
                          {log.formattedDate || log.timestamp}
                        </p>
                      </td>

                      {/* Usuario */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#0A3963] text-[#8CC63F] font-black text-[11px] flex items-center justify-center shrink-0 uppercase">
                            {(log.userName || 'US').slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-800 text-xs leading-snug">
                              {log.userName || 'Sistema'}
                            </p>
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-tight">
                              {log.userRole || 'Admin'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Categoría */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${catBadge.bg}`}>
                          <Icon name={catBadge.icon} className="w-3 h-3" />
                          <span>{catBadge.label}</span>
                        </span>
                      </td>

                      {/* Acción y Severidad */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span className="font-mono text-xs font-bold text-slate-800 block">
                            {log.action}
                          </span>
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] border ${sevClass}`}>
                            {log.severity}
                          </span>
                        </div>
                      </td>

                      {/* Detalle */}
                      <td className="py-3.5 px-4 max-w-md">
                        <p className="text-slate-700 text-xs font-medium leading-relaxed">
                          {log.details}
                        </p>
                        {log.targetId && (
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                            Ref ID: {log.targetId}
                          </span>
                        )}
                      </td>

                      {/* Botón Inspeccionar */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedLog(log);
                            setIsDetailModalOpen(true);
                            setCopiedSuccess(false);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-[#0A3963] hover:text-white text-slate-700 text-xs font-bold transition-colors inline-flex items-center gap-1 shadow-2xs"
                          title="Inspeccionar detalle técnico"
                        >
                          <Icon name="search" className="w-3 h-3" />
                          <span>Detalle</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Inspección de Trazabilidad Técnica */}
      {isDetailModalOpen && selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-7 space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-[#0A3963]/10 text-[#0A3963]">
                  <Icon name="shield" className="w-5 h-5 text-[#0A3963]" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#0A3963]">
                    Inspección Técnica de Auditoría
                  </h4>
                  <p className="text-xs text-slate-500 font-mono">
                    Folio: {selectedLog.folio} &bull; ID: {selectedLog.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Ficha Resumen */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Fecha y Hora Precisa</p>
                <p className="font-semibold text-slate-800 mt-0.5">{selectedLog.formattedDate || selectedLog.timestamp}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{selectedLog.timestamp}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Usuario y Credenciales</p>
                <p className="font-semibold text-slate-800 mt-0.5">{selectedLog.userName} ({selectedLog.userRole})</p>
                <p className="text-[11px] text-slate-500 font-mono">{selectedLog.userEmail}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Categoría & Acción</p>
                <p className="font-semibold text-slate-800 mt-0.5">{selectedLog.category} &bull; {selectedLog.action}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Nivel de Severidad</p>
                <p className="font-extrabold text-slate-800 mt-0.5">{selectedLog.severity}</p>
              </div>
            </div>

            {/* Detalle Descriptivo */}
            <div>
              <p className="text-xs font-bold text-slate-700 mb-1">Descripción del Evento:</p>
              <p className="p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium leading-relaxed">
                {selectedLog.details}
              </p>
            </div>

            {/* Metadatos en formato JSON formateado */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-bold text-slate-700">Payload Técnico JSON (Trazabilidad):</p>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(selectedLog, null, 2));
                    setCopiedSuccess(true);
                    setTimeout(() => setCopiedSuccess(false), 2000);
                  }}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                >
                  {copiedSuccess ? '✓ Copiado al Portapapeles' : 'Copiar JSON'}
                </button>
              </div>
              <pre className="p-3.5 bg-slate-900 text-emerald-400 rounded-xl text-[11px] font-mono overflow-x-auto max-h-52 border border-slate-800">
                {JSON.stringify(selectedLog, null, 2)}
              </pre>
            </div>

            {/* Footer */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
