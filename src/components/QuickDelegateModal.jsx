import React from 'react';
import { Icon } from './Icon.jsx';

export const QuickDelegateModal = ({
  isOpen,
  onClose,
  workOrder,
  onSave,
  technicians = [],
  users = []
}) => {
  if (!isOpen || !workOrder) return null;

  // Lista combinada de personal registrado
  const availableAssignees = React.useMemo(() => {
    const list = [];
    if (Array.isArray(technicians)) {
      technicians.forEach(t => list.push({
        id: t.id,
        name: t.name,
        role: t.role || 'Técnico',
        email: t.email || ''
      }));
    }
    if (Array.isArray(users)) {
      users.forEach(u => {
        if (!list.some(item => (u.email && item.email === u.email) || item.name === u.fullName)) {
          list.push({
            id: u.id,
            name: u.fullName || u.name,
            role: u.role || 'Colaborador',
            email: u.email || ''
          });
        }
      });
    }
    if (list.length === 0) {
      list.push({ id: 'u-tec-default', name: 'Téc. Juan Pérez', role: 'tecnico', email: 'tecnico@park.com' });
    }
    return list;
  }, [technicians, users]);

  const [assignedName, setAssignedName] = React.useState(workOrder.assignedTech || 'Téc. Juan Pérez');
  const [assignedRole, setAssignedRole] = React.useState(workOrder.assignedTechRole || 'Técnico');
  const [assignedEmail, setAssignedEmail] = React.useState(workOrder.assignedTechEmail || '');
  
  const [isPickerOpen, setIsPickerOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    if (workOrder) {
      setAssignedName(workOrder.assignedTech || 'Téc. Juan Pérez');
      setAssignedRole(workOrder.assignedTechRole || 'Técnico');
      setAssignedEmail(workOrder.assignedTechEmail || '');
      setIsPickerOpen(false);
      setSearchQuery('');
    }
  }, [workOrder]);

  const filteredAssignees = availableAssignees.filter(a =>
    (a.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.role || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectRegistered = (person) => {
    setAssignedName(person.name);
    setAssignedRole(person.role);
    setAssignedEmail(person.email);
    setIsPickerOpen(false);
    setSearchQuery('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!assignedName.trim()) return;
    onSave(workOrder.id, assignedName.trim(), assignedRole, assignedEmail);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0A3963] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              👤
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#0A3963]">
                Delegar Orden: {workOrder.code}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium truncate max-w-xs">
                {workOrder.title}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg text-sm font-bold transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Persona Asignada / Responsable de la Orden *
            </label>
            <p className="text-[11px] text-slate-500">
              Puedes escribir directamente el nombre de cualquier persona (incluso si no está registrada) o elegir un colaborador registrado.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={assignedName}
                  onChange={(e) => setAssignedName(e.target.value)}
                  placeholder="Escribe el nombre del técnico o responsable..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-[#8CC63F] focus:bg-white outline-none font-bold shadow-2xs transition-all"
                  autoFocus
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Icon name="user" className="w-4 h-4" />
                </div>
              </div>

              {/* Botón para elegir usuario registrado */}
              <button
                type="button"
                onClick={() => setIsPickerOpen(!isPickerOpen)}
                className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs shrink-0 ${
                  isPickerOpen
                    ? 'bg-[#0A3963] text-white border-[#0A3963]'
                    : 'bg-blue-50 hover:bg-blue-100 text-[#0A3963] border-blue-200'
                }`}
                title="Buscar y seleccionar de la lista de personal registrado"
              >
                <Icon name="search" className="w-3.5 h-3.5" />
                <span>Elegir Registrado</span>
              </button>
            </div>
          </div>

          {/* Menú Desplegable / Buscador de Personal Registrado */}
          {isPickerOpen && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 shadow-md animate-in fade-in duration-100">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-[#0A3963] uppercase tracking-wider">
                  Personal Registrado ({availableAssignees.length})
                </span>
                <span className="text-[10px] text-slate-400">Selecciona para asignar</span>
              </div>

              {/* Buscador en vivo */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre o rol..."
                  className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-[#8CC63F]"
                />
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                  <Icon name="search" className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Lista con scroll */}
              <div className="max-h-48 overflow-y-auto space-y-1 divide-y divide-slate-100 pr-1">
                {filteredAssignees.length === 0 ? (
                  <p className="text-center py-3 text-xs text-slate-400">
                    No se encontraron colaboradores con "<span className="font-semibold">{searchQuery}</span>".
                  </p>
                ) : (
                  filteredAssignees.map((person) => (
                    <div
                      key={person.id || person.name}
                      onClick={() => handleSelectRegistered(person)}
                      className="pt-1.5 pb-1 px-2 rounded-lg hover:bg-white cursor-pointer transition-colors flex items-center justify-between gap-2 group"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <div className="w-6 h-6 rounded-full bg-[#0A3963] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                          {(person.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold text-slate-800 group-hover:text-[#0A3963] truncate">
                            {person.name}
                          </p>
                          {person.email && (
                            <p className="text-[10px] text-slate-400 truncate">{person.email}</p>
                          )}
                        </div>
                      </div>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-blue-50 text-[#0A3963] border border-blue-200 uppercase shrink-0">
                        {person.role}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!assignedName.trim()}
              className="px-5 py-2 rounded-xl btn-park-green text-white text-xs font-extrabold shadow-md hover:scale-105 transition-transform disabled:opacity-40 disabled:hover:scale-100"
            >
              Guardar Delegación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
