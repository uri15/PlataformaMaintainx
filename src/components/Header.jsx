import React from 'react';
import { Icon } from './Icon.jsx';
import { SafeImage } from './SafeImage.jsx';
import { ParkLogo } from './ParkLogo.jsx';
import { ROLES_CONFIG } from '../constants/roles.js';

export const Header = ({
  searchTerm,
  setSearchTerm,
  onNewWorkOrder,
  lowStockCount,
  currentUser,
  onLogout,
  data,
  onNavigateTab,
  onSelectWO,
  onOpenProfile,
  socketStatus = 'connected',
  onlineUsers = []
}) => {
  const userRole = currentUser?.role || 'admin';
  const roleConfig = ROLES_CONFIG[userRole] || ROLES_CONFIG['admin'];
  const canViewOnlineUsers = userRole === 'admin' || userRole === 'developer';
  
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showOnlinePopover, setShowOnlinePopover] = React.useState(false);

  // Clave de almacenamiento particionada por usuario para que no se mezclen lecturas entre admin y técnico
  const userNotifKey = React.useMemo(() => {
    return 'PARK_READ_NOTIF_' + (currentUser?.id || currentUser?.email || 'guest').replace(/[^a-zA-Z0-9_]/g, '_');
  }, [currentUser]);

  // Estado persistente de notificaciones leídas del usuario actual
  const [readNotifIds, setReadNotifIds] = React.useState(() => {
    try {
      const saved = localStorage.getItem(userNotifKey);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Recargar notificaciones leídas cada vez que cambia el usuario autenticado
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(userNotifKey);
      setReadNotifIds(saved ? JSON.parse(saved) : []);
    } catch (e) {
      setReadNotifIds([]);
    }
  }, [userNotifKey]);

  const workOrders = data?.workOrders || [];
  const assets = data?.assets || [];
  const inventory = data?.inventory || [];

  const urgentWOs = workOrders.filter(w => (w.priority === 'Urgente' || w.status === 'Abierta') && w.status !== 'Completada');
  const lowStockItems = inventory.filter(i => (i.currentStock || 0) <= (i.minStock || 0));

  // Lista dinámica de notificaciones personalizadas según el perfil activo
  const notificationsList = React.useMemo(() => {
    const list = [];
    const currentName = (currentUser?.full_name || currentUser?.fullName || currentUser?.name || '').toLowerCase().trim();
    const currentEmail = (currentUser?.email || '').toLowerCase().trim();
    const currentRole = currentUser?.role || 'admin';
    const isAdminOrSuper = currentRole === 'admin' || currentRole === 'developer' || currentRole === 'supervisor';
    const isTechnician = currentRole === 'tecnico' || currentEmail.includes('tecnico');

    // 1. Detección de órdenes asignadas / delegadas
    workOrders.forEach((wo) => {
      if (wo.status === 'Completada') return; // No generar alertas de acción para órdenes archivadas

      const techName = (wo.assignedTech || '').toLowerCase().trim();
      const techEmail = (wo.assignedTechEmail || '').toLowerCase().trim();

      // Chequeo de asignación para el usuario actual
      const isEmailMatch = currentEmail && (
        (techEmail && techEmail === currentEmail) ||
        (techName && techName.includes(currentEmail))
      );

      const isNameMatch = currentName && techName && (
        techName.includes(currentName) ||
        currentName.includes(techName) ||
        techName.replace(/^(ing\.|téc\.|tec\.|lic\.|arq\.|op\.)\s+/i, '').includes(currentName.replace(/^(ing\.|téc\.|tec\.|lic\.|arq\.|op\.)\s+/i, ''))
      );

      // Si el usuario es técnico y la orden fue asignada a él (o asignada a "Téc. Juan Pérez" / "Técnico")
      const isAssignedToMe = isEmailMatch || isNameMatch || (isTechnician && (
        techName.includes('juan') || techName.includes('pérez') || techName.includes('perez') || techName.includes('técnico') || techName.includes('tecnico') || !techName
      ));

      if (isAssignedToMe) {
        // Notificación directa para el técnico asignado
        list.push({
          id: `notif-delegated-to-me-${wo.id}`,
          title: `📌 Nueva orden asignada a ti: ${wo.code}`,
          category: 'Asignada a ti',
          categoryBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200 font-extrabold',
          iconName: 'workOrders',
          iconColor: 'bg-emerald-100 text-emerald-800',
          desc: `Tienes una orden pendiente: "${wo.title}" en ${wo.development || 'Park Industrial'} (${wo.assetName || 'Activo'}). Prioridad: ${wo.priority}.`,
          targetTab: 'workOrders',
          workOrder: wo
        });
      } else if (isAdminOrSuper) {
        // Notificación de supervisión para el administrador
        list.push({
          id: `notif-admin-supervision-${wo.id}`,
          title: `Orden Delegada: ${wo.code} → ${wo.assignedTech || 'Personal técnico'}`,
          category: 'Supervisión',
          categoryBadge: 'bg-blue-100 text-blue-800 border-blue-200',
          iconName: 'workOrders',
          iconColor: 'bg-blue-100 text-[#0A3963]',
          desc: `"${wo.title}" asignada a ${wo.assignedTech || 'Personal técnico'}. Estado: ${wo.status}. Prioridad: ${wo.priority}.`,
          targetTab: 'workOrders',
          workOrder: wo
        });
      }
    });

    // 2. Alerta de órdenes urgentes pendientes
    if (urgentWOs.length > 0) {
      list.push({
        id: 'notif-urgent-wos',
        title: '🚨 Órdenes Urgentes Pendientes',
        category: 'Urgente',
        categoryBadge: 'bg-red-100 text-red-800 border-red-200',
        iconName: 'alert',
        iconColor: 'bg-red-100 text-red-700',
        desc: `${urgentWOs.length} orden(es) de mantenimiento urgente requieren atención inmediata en el parque.`,
        targetTab: 'workOrders'
      });
    }

    // 3. Alerta de repuestos con bajo stock (visible para todos los que gestionan inventario)
    if (lowStockItems.length > 0) {
      list.push({
        id: 'notif-low-stock',
        title: '⚠️ Alerta de Repuestos Críticos',
        category: 'Inventario',
        categoryBadge: 'bg-amber-100 text-amber-800 border-amber-200',
        iconName: 'alert',
        iconColor: 'bg-amber-100 text-amber-700',
        desc: `${lowStockItems.length} repuesto(s) se encuentran por debajo del stock mínimo (ej. ${lowStockItems[0]?.name}).`,
        targetTab: 'inventory'
      });
    }

    // 4. Notificación de bienvenida / sistema al día si no hay pendientes
    if (list.length === 0) {
      list.push({
        id: 'notif-system-welcome',
        title: 'Sistema Operativo al Día',
        category: 'Plataforma PARK',
        categoryBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        iconName: 'check',
        iconColor: 'bg-emerald-100 text-emerald-700',
        desc: 'No tienes nuevas órdenes delegadas ni alertas pendientes en este momento.',
        targetTab: 'dashboard'
      });
    }

    return list;
  }, [workOrders, lowStockItems.length, urgentWOs.length, currentUser]);

  const handleMarkAsRead = (id) => {
    setReadNotifIds(prev => {
      if (prev.includes(id)) return prev;
      const updated = [...prev, id];
      try {
        localStorage.setItem(userNotifKey, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleMarkAllAsRead = () => {
    const allIds = notificationsList.map(n => n.id);
    setReadNotifIds(allIds);
    try {
      localStorage.setItem(userNotifKey, JSON.stringify(allIds));
    } catch (e) {}
  };

  // Conteo de notificaciones no leídas
  const unreadCount = notificationsList.filter(n => !readNotifIds.includes(n.id)).length;

  // Live Query Results calculation
  const searchResults = React.useMemo(() => {
    const q = (searchTerm || '').trim().toLowerCase();
    if (!q) return null;

    const matchedWO = workOrders.filter(w => 
      w.code.toLowerCase().includes(q) || 
      w.title.toLowerCase().includes(q) || 
      (w.assetName || '').toLowerCase().includes(q) ||
      (w.assignedTech || '').toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedAssets = assets.filter(a => 
      a.code.toLowerCase().includes(q) || 
      a.name.toLowerCase().includes(q) || 
      a.category.toLowerCase().includes(q) ||
      a.location.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedParts = inventory.filter(i => 
      i.sku.toLowerCase().includes(q) || 
      i.name.toLowerCase().includes(q) || 
      i.category.toLowerCase().includes(q)
    ).slice(0, 4);

    return {
      workOrders: matchedWO,
      assets: matchedAssets,
      inventory: matchedParts,
      totalMatches: matchedWO.length + matchedAssets.length + matchedParts.length
    };
  }, [searchTerm, workOrders, assets, inventory]);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs px-4 lg:px-8 py-3.5">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ParkLogo />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-2xl tracking-wider text-[#0A3963]">PLATAFORMA PARK</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-[#8CC63F] border border-[#8CC63F]/40 font-bold uppercase tracking-wider">
                CMMS
              </span>
            </div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
              INFRAESTRUCTURA & MANTENIMIENTO | PLATAFORMAPARK
            </p>
          </div>
        </div>

        {/* Live Search Bar with Dropdown Query Results */}
        <div className="relative flex-1 max-w-md w-full">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Icon name="search" className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por código, activo, repuesto o técnico..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#8CC63F] focus:bg-white transition-all shadow-2xs"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-700"
              >
                <Icon name="close" className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Live Search Results Popover Dropdown */}
          {searchResults && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto divide-y divide-slate-100">
              {searchResults.totalMatches === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500 font-medium">
                  No se encontraron resultados para "<span className="font-bold text-slate-700">{searchTerm}</span>".
                </div>
              ) : (
                <>
                  {searchResults.workOrders.length > 0 && (
                    <div className="p-2 space-y-1">
                      <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Órdenes de Trabajo</p>
                      {searchResults.workOrders.map(wo => (
                        <div
                          key={wo.id}
                          onClick={() => {
                            onNavigateTab('workOrders');
                            onSelectWO(wo);
                            setSearchTerm('');
                          }}
                          className="px-2.5 py-2 rounded-lg hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Icon name="workOrders" className="w-4 h-4 text-[#0A3963] shrink-0" />
                            <div>
                              <p className="text-xs font-bold text-slate-900">{wo.title}</p>
                              <p className="text-[10px] text-slate-500">{wo.code} • {wo.assetName}</p>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-slate-100 text-slate-700 border border-slate-200">
                            {wo.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResults.assets.length > 0 && (
                    <div className="p-2 space-y-1">
                      <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Activos & Equipos</p>
                      {searchResults.assets.map(ast => (
                        <div
                          key={ast.id}
                          onClick={() => {
                            onNavigateTab('assets');
                            setSearchTerm('');
                          }}
                          className="px-2.5 py-2 rounded-lg hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Icon name="assets" className="w-4 h-4 text-amber-600 shrink-0" />
                            <div>
                              <p className="text-xs font-bold text-slate-900">{ast.name}</p>
                              <p className="text-[10px] text-slate-500">{ast.code} • {ast.location}</p>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-blue-50 text-blue-700 border border-blue-200">
                            {ast.category}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResults.inventory.length > 0 && (
                    <div className="p-2 space-y-1">
                      <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Repuestos & Stock</p>
                      {searchResults.inventory.map(part => (
                        <div
                          key={part.id}
                          onClick={() => {
                            onNavigateTab('inventory');
                            setSearchTerm('');
                          }}
                          className="px-2.5 py-2 rounded-lg hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Icon name="inventory" className="w-4 h-4 text-slate-600 shrink-0" />
                            <div>
                              <p className="text-xs font-bold text-slate-900">{part.name}</p>
                              <p className="text-[10px] text-slate-500">{part.sku} • Stock: {part.currentStock} {part.unit}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                            part.currentStock <= part.minStock ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {part.currentStock <= part.minStock ? 'Reordenar' : 'Óptimo'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Notification Bell Icon Button & Popover */}
        <div className="flex items-center gap-2 sm:gap-3 relative">
          {/* Socket.io Real-Time Status Badge */}
          <div className="relative">
            {canViewOnlineUsers ? (
              <button
                type="button"
                onClick={() => setShowOnlinePopover(!showOnlinePopover)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs ${
                  socketStatus === 'connected'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100 cursor-pointer'
                    : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100 cursor-pointer'
                }`}
                title={socketStatus === 'connected' ? 'Sincronización en vivo activa (Clic para ver usuarios conectados)' : 'Modo local (Reconectando con servidor...)'}
              >
                <span className="relative flex h-2 w-2">
                  {socketStatus === 'connected' && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  )}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${socketStatus === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                </span>
                <span className="hidden sm:inline">
                  {socketStatus === 'connected' ? 'En vivo' : 'Local'}
                </span>
                {onlineUsers.length > 0 && socketStatus === 'connected' && (
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-200/80 text-emerald-900 text-[10px] font-extrabold" title="Usuarios en línea">
                    {onlineUsers.length}
                  </span>
                )}
              </button>
            ) : (
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold shadow-2xs select-none ${
                  socketStatus === 'connected'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}
                title={socketStatus === 'connected' ? 'Sistema sincronizado en tiempo real' : 'Modo local (Reconectando con servidor...)'}
              >
                <span className="relative flex h-2 w-2">
                  {socketStatus === 'connected' && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  )}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${socketStatus === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                </span>
                <span className="hidden sm:inline">
                  {socketStatus === 'connected' ? 'En vivo' : 'Local'}
                </span>
              </div>
            )}

            {canViewOnlineUsers && showOnlinePopover && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-3 space-y-2 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-extrabold text-[#0A3963] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Usuarios en Línea ({onlineUsers.length})
                  </span>
                  <button onClick={() => setShowOnlinePopover(false)} className="text-slate-400 hover:text-slate-700 text-xs font-bold">
                    &times;
                  </button>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1.5 text-xs">
                  {onlineUsers.length === 0 ? (
                    <p className="text-slate-400 text-[11px] py-2 text-center">Solo tú estás conectado</p>
                  ) : (
                    onlineUsers.map((u, i) => (
                      <div key={i} className="flex items-center justify-between py-1 px-1.5 rounded-lg hover:bg-slate-50">
                        <div className="flex items-center gap-2 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                          <span className="font-bold text-slate-800 truncate">{u.name || u.email}</span>
                        </div>
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                          {u.role || 'usuario'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
                <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-1.5 text-center">
                  Socket.io WebSocket Activo
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all border border-slate-200 flex items-center justify-center group"
              title="Notificaciones y Novedades del Sistema"
            >
              <Icon name="bell" className="w-5 h-5 text-slate-700 group-hover:text-[#0A3963] transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-red-500 text-white animate-pulse shadow-xs min-w-[18px] text-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Popover Menu */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3.5 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="bell" className="w-4 h-4 text-[#0A3963]" />
                    <span className="text-xs font-extrabold text-[#0A3963]">Novedades & Notificaciones</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-red-100 text-red-700 text-[10px] font-extrabold">
                        {unreadCount} nueva{unreadCount === 1 ? '' : 's'}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      onClick={handleMarkAllAsRead}
                      className="text-[10px] font-bold text-slate-500 hover:text-[#0A3963] hover:underline"
                    >
                      Marcar todas leídas
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
                  {notificationsList.map((notif) => {
                    const isRead = readNotifIds.includes(notif.id);

                    return (
                      <div 
                        key={notif.id}
                        onClick={() => {
                          handleMarkAsRead(notif.id);
                          if (notif.targetTab) onNavigateTab(notif.targetTab);
                          if (notif.workOrder && onSelectWO) onSelectWO(notif.workOrder);
                          setShowNotifications(false);
                        }}
                        className={`p-3.5 cursor-pointer transition-all flex items-start gap-3 group ${
                          isRead
                            ? 'bg-white opacity-45 hover:opacity-85 border-l-4 border-l-transparent'
                            : 'bg-slate-100/95 hover:bg-slate-200/90 border-l-4 border-l-[#0A3963] shadow-2xs'
                        }`}
                      >
                        <div className={`p-2 rounded-xl shrink-0 group-hover:scale-105 transition-transform ${notif.iconColor || 'bg-slate-100 text-slate-700'}`}>
                          <Icon name={notif.iconName} className="w-4 h-4" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className={`text-xs transition-colors truncate ${
                              isRead 
                                ? 'font-medium text-slate-500 group-hover:text-slate-700' 
                                : 'font-extrabold text-slate-900 group-hover:text-[#0A3963]'
                            }`}>
                              {notif.title}
                            </p>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 border ${notif.categoryBadge || 'bg-slate-100 text-slate-700'}`}>
                              {notif.category}
                            </span>
                          </div>

                          <p className={`text-[11px] mt-1 leading-snug ${
                            isRead ? 'text-slate-400 font-normal' : 'text-slate-700 font-semibold'
                          }`}>
                            {notif.desc}
                          </p>
                        </div>

                        {/* Indicador de Punto Azul para no leídas */}
                        {!isRead && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1 shadow-xs" title="No leída"></span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="p-2 bg-slate-50 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
                  <span>PLATAFORMA PARK CMMS</span>
                  <span>&bull;</span>
                  <span>{unreadCount === 0 ? 'Al día ✓' : `${unreadCount} pendiente${unreadCount === 1 ? '' : 's'}`}</span>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Quick Card */}
          <div 
            onClick={onOpenProfile}
            className="flex items-center gap-2.5 pl-2 py-1 pr-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer transition-all group"
            title="Ver y editar Mi Perfil"
          >
            <SafeImage
              src={currentUser?.avatarUrl}
              alt="Avatar"
              className="w-5 h-5 rounded-full object-cover shrink-0"
              fallbackContent={
                <div className="w-5 h-5 rounded-full bg-[#0A3963] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                  {(currentUser?.full_name || 'U').substring(0, 1)}
                </div>
              }
            />
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-slate-800 group-hover:text-[#0A3963] transition-colors leading-tight">
                {currentUser?.full_name || 'Usuario'}
              </p>
            </div>
          </div>

          {/* Botón Salir / Cerrar Sesión en Banner Superior */}
          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs hover:scale-105"
            title="Cerrar Sesión"
          >
            <Icon name="logout" className="w-4 h-4" />
            <span>Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
};;
