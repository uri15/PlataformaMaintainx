import React from 'react';
import { ROLES_CONFIG } from './constants/roles.js';
import { getStoredData, saveStoredData } from './utils/storage.js';
import { generateParkPdfReport } from './utils/pdfGenerator.js';
import { Header } from './components/Header.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { WorkOrderModal } from './components/WorkOrderModal.jsx';
import { UserProfileModal } from './components/UserProfileModal.jsx';
import { ExportPdfModal } from './components/ExportPdfModal.jsx';
import { ToastContainer } from './components/ToastContainer.jsx';
import { Icon } from './components/Icon.jsx';
import { LoginScreen } from './views/LoginScreen.jsx';
import { Dashboard } from './views/Dashboard.jsx';
import { WorkOrders } from './views/WorkOrders.jsx';
import { Assets } from './views/Assets.jsx';
import { PreventiveMaintenance } from './views/PreventiveMaintenance.jsx';
import { Inventory } from './views/Inventory.jsx';
import { UsersManagement } from './views/UsersManagement.jsx';
import { SettingsView } from './views/SettingsView.jsx';
import { AuditTrail } from './views/AuditTrail.jsx';
import { 
  initSocket, 
  disconnectSocket, 
  onSocket, 
  emitSocket, 
  onConnectionChange, 
  onPresenceUpdate 
} from './utils/socket.js';

export function App() {
  const [currentUser, setCurrentUser] = React.useState(() => {
    try {
      const saved = localStorage.getItem('cmms_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [activeTab, setActiveTab] = React.useState(() => {
    if (currentUser?.role && ROLES_CONFIG[currentUser.role]) {
      return ROLES_CONFIG[currentUser.role].defaultModule || 'dashboard';
    }
    return 'dashboard';
  });

  const [data, setData] = React.useState(getStoredData());
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const [selectedWO, setSelectedWO] = React.useState(null);
  const [woModalInitialTab, setWoModalInitialTab] = React.useState('form');
  const [isWOModalOpen, setIsWOModalOpen] = React.useState(false);
  const [isPdfExportModalOpen, setIsPdfExportModalOpen] = React.useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);

  // Estados de Sincronización en Tiempo Real
  const [socketStatus, setSocketStatus] = React.useState('connected');
  const [onlineUsers, setOnlineUsers] = React.useState([]);
  const [toasts, setToasts] = React.useState([]);

  // Notificaciones flotantes Toasts
  const addToast = React.useCallback((toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast = {
      id,
      time: 'Ahora',
      ...toast
    };
    setToasts(prev => [newToast, ...prev].slice(0, 4));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = React.useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleToastClick = (toast) => {
    if (toast.workOrder) {
      setSelectedWO(JSON.parse(JSON.stringify(toast.workOrder)));
      setActiveTab('workOrders');
      setIsWOModalOpen(true);
    } else if (toast.orderId) {
      const found = data.workOrders.find(w => w.id === toast.orderId);
      if (found) {
        setSelectedWO(JSON.parse(JSON.stringify(found)));
        setActiveTab('workOrders');
        setIsWOModalOpen(true);
      }
    }
  };

  // Inicialización y eventos de Socket.io
  React.useEffect(() => {
    if (!currentUser) return;

    const token = localStorage.getItem('cmms_auth_token');
    initSocket(currentUser, token);

    const unsubConn = onConnectionChange((status) => {
      setSocketStatus(status);
    });

    const unsubPres = onPresenceUpdate((presenceData) => {
      if (presenceData && Array.isArray(presenceData.users)) {
        setOnlineUsers(presenceData.users);
      }
    });

    // 1. Estado inicial del servidor central
    const unsubFullState = onSocket('sync:full_state', (serverData) => {
      if (serverData && typeof serverData === 'object') {
        setData(prev => ({
          ...prev,
          company: serverData.company || prev.company,
          workOrders: (Array.isArray(serverData.workOrders) && serverData.workOrders.length > 0) ? serverData.workOrders : prev.workOrders,
          assets: (Array.isArray(serverData.assets) && serverData.assets.length > 0) ? serverData.assets : prev.assets,
          inventory: (Array.isArray(serverData.inventory) && serverData.inventory.length > 0) ? serverData.inventory : prev.inventory,
          preventiveSchedules: (Array.isArray(serverData.preventiveSchedules) && serverData.preventiveSchedules.length > 0) ? serverData.preventiveSchedules : prev.preventiveSchedules,
          technicians: (Array.isArray(serverData.technicians) && serverData.technicians.length > 0) ? serverData.technicians : prev.technicians,
          users: (Array.isArray(serverData.users) && serverData.users.length > 0) ? serverData.users : prev.users
        }));
      }
    });

    // 2. Orden guardada / actualizada en tiempo real
    const unsubWoSaved = onSocket('wo:saved', (payload) => {
      const { workOrder, sender } = payload;
      if (!workOrder) return;

      setData(prev => {
        const exists = prev.workOrders.some(w => w.id === workOrder.id);
        let updatedList = [];
        if (exists) {
          updatedList = prev.workOrders.map(w => w.id === workOrder.id ? workOrder : w);
        } else {
          updatedList = [workOrder, ...prev.workOrders];
        }

        let updatedInventory = [...prev.inventory];
        if (Array.isArray(workOrder.usedParts) && workOrder.usedParts.length > 0) {
          workOrder.usedParts.forEach(p => {
            updatedInventory = updatedInventory.map(item => {
              if (item.id === p.partId) {
                return { ...item, currentStock: Math.max(0, item.currentStock - p.qty) };
              }
              return item;
            });
          });
        }

        return {
          ...prev,
          workOrders: updatedList,
          inventory: updatedInventory
        };
      });

      // Si el modal está abierto con esta orden, sincronizarla
      setSelectedWO(prev => prev && prev.id === workOrder.id ? workOrder : prev);

      addToast({
        type: 'workOrder',
        title: `Orden ${workOrder.code || ''} Sincronizada`,
        message: `${sender?.name || 'Un colega'} actualizó "${workOrder.title}".`,
        actionLabel: 'Ver Orden',
        workOrder
      });
    });

    // 3. Cambio de estado de orden en tiempo real
    const unsubWoStatus = onSocket('wo:status_changed', (payload) => {
      const { woId, newStatus, sender } = payload;
      setData(prev => ({
        ...prev,
        workOrders: prev.workOrders.map(w => w.id === woId ? { ...w, status: newStatus } : w)
      }));

      setSelectedWO(prev => prev && prev.id === woId ? { ...prev, status: newStatus } : prev);

      addToast({
        type: 'workOrder',
        title: 'Estado Actualizado en Vivo',
        message: `${sender?.name || 'Un colega'} cambió orden ${woId} a "${newStatus}".`
      });
    });

    // 4. Notificación de chat en tiempo real
    const unsubChatNotif = onSocket('chat:notification', (payload) => {
      const { orderCode, orderTitle, comment, sender, orderId } = payload;
      if (sender?.id === currentUser?.id || comment?.userId === currentUser?.id) return;

      addToast({
        type: 'chat',
        title: `💬 Mensaje en ${orderCode}`,
        message: `${comment.userName || 'Un colega'}: "${(comment.text || 'Evidencia fotográfica').slice(0, 45)}${(comment.text?.length || 0) > 45 ? '...' : ''}"`,
        actionLabel: 'Abrir Chat',
        orderId
      });
    });

    // 5. Inventario actualizado en tiempo real
    const unsubInvUpdate = onSocket('inventory:updated', (payload) => {
      const { partId, newStock, partName, sender } = payload;
      setData(prev => ({
        ...prev,
        inventory: prev.inventory.map(item => item.id === partId ? { ...item, currentStock: newStock } : item)
      }));

      addToast({
        type: 'inventory',
        title: 'Inventario Sincronizado',
        message: `${sender?.name || 'Almacén'} ajustó stock de "${partName || 'Repuesto'}" a ${newStock} uds.`
      });
    });

    const unsubInvSaved = onSocket('inventory:saved', (payload) => {
      const { part } = payload;
      if (!part) return;
      setData(prev => {
        const exists = prev.inventory.some(i => i.id === part.id);
        return {
          ...prev,
          inventory: exists ? prev.inventory.map(i => i.id === part.id ? part : i) : [part, ...prev.inventory]
        };
      });
    });

    // 6. Activos sincronizados en tiempo real
    const unsubAssetSaved = onSocket('asset:saved', (payload) => {
      const { asset } = payload;
      if (!asset) return;
      setData(prev => {
        const exists = prev.assets.some(a => a.id === asset.id);
        return {
          ...prev,
          assets: exists ? prev.assets.map(a => a.id === asset.id ? asset : a) : [asset, ...prev.assets]
        };
      });
    });

    const unsubAssetDeleted = onSocket('asset:deleted', (payload) => {
      const { assetId } = payload;
      if (!assetId) return;
      setData(prev => ({
        ...prev,
        assets: prev.assets.filter(a => a.id !== assetId)
      }));
    });

    // 7. Sincronización de Usuarios en tiempo real
    const unsubUserSaved = onSocket('user:saved', ({ user, isNew, sender }) => {
      if (!user) return;
      setData(prev => {
        const cleanEmail = (user.email || '').toLowerCase().trim();
        const exists = (prev.users || []).some(u => u.id === user.id || (u.email && u.email.toLowerCase().trim() === cleanEmail));
        let updated;
        if (exists) {
          updated = (prev.users || []).map(u => (u.id === user.id || (u.email && u.email.toLowerCase().trim() === cleanEmail)) ? user : u);
        } else {
          updated = [user, ...(prev.users || [])];
        }
        return { ...prev, users: updated };
      });

      if (isNew && sender?.id !== currentUser?.id) {
        addToast({
          type: 'info',
          title: 'Nuevo Usuario Registrado',
          desc: `${user.fullName || user.email} ha sido añadido a la plataforma.`
        });
      }
    });

    const unsubUserDeleted = onSocket('user:deleted', ({ userId }) => {
      if (!userId) return;
      setData(prev => ({
        ...prev,
        users: (prev.users || []).filter(u => u.id !== userId)
      }));
    });

    // 8. Solicitudes de restablecimiento de contraseña al Administrador (sin correos)
    const unsubResetReqNew = onSocket('password_reset_request:new', (payload) => {
      const { request } = payload || {};
      if (!request) return;
      if (currentUser?.role === 'admin' || currentUser?.role === 'developer') {
        addToast({
          type: 'warning',
          title: `🔑 Solicitud de Contraseña: ${request.folio}`,
          message: `${request.fullName} (${request.email}) solicitó restablecimiento de acceso.`,
          actionLabel: 'Ver Usuarios',
          onAction: () => setCurrentTab('users')
        });
      }
    });

    const unsubResetReqResolved = onSocket('password_reset_request:resolved', (payload) => {
      const { userUpdated } = payload || {};
      if (userUpdated) {
        setData(prev => ({
          ...prev,
          users: (prev.users || []).map(u => u.id === userUpdated.id ? { ...u, ...userUpdated } : u)
        }));
      }
    });

    // 9. Bitácora de Auditoría en tiempo real
    const unsubAuditLog = onSocket('audit:new_log', (payload) => {
      if (payload?.log) {
        window.dispatchEvent(new CustomEvent('cmms:audit:new', { detail: { log: payload.log } }));
      }
    });

    return () => {
      unsubConn();
      unsubPres();
      unsubFullState();
      unsubWoSaved();
      unsubWoStatus();
      unsubChatNotif();
      unsubInvUpdate();
      unsubInvSaved();
      unsubAssetSaved();
      unsubAssetDeleted();
      unsubUserSaved();
      unsubUserDeleted();
      unsubResetReqNew();
      unsubResetReqResolved();
      unsubAuditLog();
      disconnectSocket();
    };
  }, [currentUser, addToast]);

  // Guardar cambios del perfil de usuario
  const handleSaveProfile = (updatedProfile) => {
    setCurrentUser(prev => {
      const merged = { ...prev, ...updatedProfile };
      localStorage.setItem('cmms_user', JSON.stringify(merged));
      return merged;
    });

    setData(prev => {
      const usersList = prev.users || [];
      const updatedUsers = usersList.map(u => {
        if ((u.id && u.id === updatedProfile.id) || (u.email && u.email.toLowerCase() === updatedProfile.email?.toLowerCase())) {
          return { ...u, ...updatedProfile };
        }
        return u;
      });
      return {
        ...prev,
        users: updatedUsers
      };
    });
  };

  const handleSaveAsset = (newOrUpdatedAsset) => {
    setData(prev => {
      const exists = (prev.assets || []).some(item => item.id === newOrUpdatedAsset.id);
      let updatedAssets = [];
      if (exists) {
        updatedAssets = (prev.assets || []).map(item => item.id === newOrUpdatedAsset.id ? newOrUpdatedAsset : item);
      } else {
        updatedAssets = [newOrUpdatedAsset, ...(prev.assets || [])];
      }
      return {
        ...prev,
        assets: updatedAssets
      };
    });

    // Emitir a otros clientes por Socket.io
    emitSocket('asset:save', {
      asset: newOrUpdatedAsset,
      sender: {
        id: currentUser?.id,
        name: currentUser?.full_name || currentUser?.fullName || currentUser?.name || 'Usuario',
        role: currentUser?.role
      }
    });
  };

  const handleDeleteAsset = (assetId) => {
    setData(prev => ({
      ...prev,
      assets: (prev.assets || []).filter(item => item.id !== assetId)
    }));

    emitSocket('asset:delete', {
      assetId,
      sender: {
        id: currentUser?.id,
        name: currentUser?.full_name || currentUser?.fullName || currentUser?.name || 'Usuario',
        role: currentUser?.role
      }
    });
  };

  const handleSavePart = (newOrUpdatedPart) => {
    setData(prev => {
      const exists = (prev.inventory || []).some(item => item.id === newOrUpdatedPart.id);
      let updatedInventory = [];
      if (exists) {
        updatedInventory = prev.inventory.map(item => item.id === newOrUpdatedPart.id ? newOrUpdatedPart : item);
      } else {
        updatedInventory = [newOrUpdatedPart, ...(prev.inventory || [])];
      }
      return {
        ...prev,
        inventory: updatedInventory
      };
    });

    emitSocket('inventory:save', {
      part: newOrUpdatedPart,
      sender: {
        id: currentUser?.id,
        name: currentUser?.full_name || currentUser?.fullName || currentUser?.name || 'Usuario',
        role: currentUser?.role
      }
    });
  };

  const handleDeletePart = (partId) => {
    setData(prev => ({
      ...prev,
      inventory: (prev.inventory || []).filter(item => item.id !== partId)
    }));
  };

  const handleSaveUser = async (userToSave) => {
    const isNew = !(data.users || []).some(u => u.id === userToSave.id || (u.email && u.email.toLowerCase().trim() === userToSave.email.toLowerCase().trim()));

    // Actualización optimista del estado local
    setData(prev => {
      const existing = (prev.users || []).find(u => u.id === userToSave.id || (u.email && u.email.toLowerCase().trim() === userToSave.email.toLowerCase().trim()));
      let updatedUsers;
      if (existing) {
        updatedUsers = (prev.users || []).map(u => (u.id === userToSave.id || u.email.toLowerCase().trim() === userToSave.email.toLowerCase().trim()) ? { ...u, ...userToSave } : u);
      } else {
        const newUser = {
          ...userToSave,
          id: userToSave.id || `usr-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
          status: userToSave.status || 'Activo',
          lastLogin: 'Nunca'
        };
        updatedUsers = [newUser, ...(prev.users || [])];
      }
      return {
        ...prev,
        users: updatedUsers
      };
    });

    // Enviar al servidor REST para registrar
    try {
      const res = await fetch('/api/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userToSave)
      });
      const resData = await res.json().catch(() => ({}));

      if (res.ok && isNew) {
        addToast({
          type: 'success',
          title: 'Usuario Creado',
          desc: `El usuario ${userToSave.fullName || userToSave.email} fue registrado con éxito.`,
          iconName: 'user'
        });
      } else if (res.ok) {
        addToast({
          type: 'info',
          title: 'Usuario Actualizado',
          desc: `Los datos de ${userToSave.fullName || userToSave.email} fueron actualizados correctamente.`,
          iconName: 'user'
        });
      }
    } catch (err) {
      console.warn('[Users] Guardado local:', err.message);
      if (isNew) {
        addToast({
          type: 'success',
          title: 'Usuario Creado',
          desc: `El usuario ${userToSave.fullName || userToSave.email} fue guardado correctamente.`,
          iconName: 'user'
        });
      }
    }

    // Emitir evento por Socket.io a los demás usuarios conectados
    emitSocket('user:save', {
      user: userToSave,
      sender: {
        id: currentUser?.id,
        name: currentUser?.full_name || currentUser?.fullName || currentUser?.name || 'Administrador',
        role: currentUser?.role
      }
    });
  };

  const handleDeleteUser = (userId) => {
    setData(prev => ({
      ...prev,
      users: (prev.users || []).filter(u => u.id !== userId)
    }));

    emitSocket('user:delete', {
      userId,
      sender: {
        id: currentUser?.id,
        name: currentUser?.full_name || currentUser?.fullName || currentUser?.name || 'Administrador',
        role: currentUser?.role
      }
    });
  };

  const handleToggleUserStatus = (userId) => {
    setData(prev => ({
      ...prev,
      users: (prev.users || []).map(u => {
        if (u.id === userId) {
          return {
            ...u,
            status: u.status === 'Activo' ? 'Inactivo' : 'Activo'
          };
        }
        return u;
      })
    }));
  };

  // Persistencia local para soporte offline transparente
  React.useEffect(() => {
    saveStoredData(data);
  }, [data]);

  // Validar permisos de tab activo según RBAC de forma segura en useEffect
  React.useEffect(() => {
    if (currentUser) {
      const userRoleConfig = ROLES_CONFIG[currentUser.role] || ROLES_CONFIG['admin'];
      if (userRoleConfig.modules && !userRoleConfig.modules.includes(activeTab)) {
        setActiveTab(userRoleConfig.defaultModule || 'workOrders');
      }
    }
  }, [currentUser, activeTab]);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    const roleConfig = ROLES_CONFIG[user.role] || ROLES_CONFIG['admin'];
    setActiveTab(roleConfig.defaultModule || 'dashboard');
    addToast({
      type: 'success',
      title: `¡Bienvenido, ${user.full_name || user.fullName || user.email}!`,
      desc: `Sesión iniciada como ${roleConfig.name || user.role}.`,
      iconName: 'user'
    });
  };

  const handleLogout = () => {
    disconnectSocket();
    localStorage.removeItem('cmms_user');
    localStorage.removeItem('cmms_auth_token');
    setCurrentUser(null);
    addToast({
      type: 'info',
      title: 'Sesión finalizada',
      desc: 'Has cerrado sesión exitosamente.',
      iconName: 'logout'
    });
  };

  if (!currentUser) {
    return (
      <>
        <LoginScreen onLoginSuccess={handleLoginSuccess} data={data} />
        <ToastContainer
          toasts={toasts}
          onDismiss={dismissToast}
          onToastClick={handleToastClick}
        />
      </>
    );
  }

  const handleSaveWO = (newOrUpdatedWO) => {
    setData(prev => {
      const exists = prev.workOrders.some(w => w.id === newOrUpdatedWO.id);
      let updatedList = [];
      if (exists) {
        updatedList = prev.workOrders.map(w => w.id === newOrUpdatedWO.id ? newOrUpdatedWO : w);
      } else {
        updatedList = [newOrUpdatedWO, ...prev.workOrders];
      }

      let updatedInventory = [...prev.inventory];
      if (newOrUpdatedWO.usedParts && newOrUpdatedWO.usedParts.length > 0) {
        newOrUpdatedWO.usedParts.forEach(p => {
          updatedInventory = updatedInventory.map(item => {
            if (item.id === p.partId) {
              return { ...item, currentStock: Math.max(0, item.currentStock - p.qty) };
            }
            return item;
          });
        });
      }

      return {
        ...prev,
        workOrders: updatedList,
        inventory: updatedInventory
      };
    });

    // Emitir orden a todos los clientes por Socket.io
    emitSocket('wo:save', {
      workOrder: newOrUpdatedWO,
      sender: {
        id: currentUser.id,
        name: currentUser.full_name || currentUser.fullName || currentUser.name || 'Usuario',
        role: currentUser.role
      }
    });
  };

  const handleDelegateWO = (woId, newTechName, newTechRole, newTechEmail) => {
    const target = data.workOrders.find(w => w.id === woId);
    if (!target) return;
    const updated = {
      ...target,
      assignedTech: newTechName,
      assignedTechRole: newTechRole || target.assignedTechRole || 'tecnico',
      assignedTechEmail: newTechEmail || target.assignedTechEmail || '',
      updatedAt: new Date().toISOString(),
      lastUpdatedBy: currentUser?.full_name || currentUser?.fullName || currentUser?.name || 'Administrador'
    };
    handleSaveWO(updated);
    addToast({
      type: 'workOrder',
      title: `Orden Delegada (${updated.code})`,
      message: `Asignada exitosamente a ${newTechName}.`
    });
  };

  const handleStatusChange = (woId, newStatus) => {
    setData(prev => ({
      ...prev,
      workOrders: prev.workOrders.map(w => w.id === woId ? { ...w, status: newStatus } : w)
    }));

    emitSocket('wo:status_change', {
      woId,
      newStatus,
      sender: {
        id: currentUser.id,
        name: currentUser.full_name || currentUser.fullName || currentUser.name || 'Usuario',
        role: currentUser.role
      }
    });
  };

  const handleUpdateStock = (partId, newStock) => {
    setData(prev => ({
      ...prev,
      inventory: prev.inventory.map(item => item.id === partId ? { ...item, currentStock: newStock } : item)
    }));

    emitSocket('inventory:update_stock', {
      partId,
      newStock,
      sender: {
        id: currentUser.id,
        name: currentUser.full_name || currentUser.fullName || currentUser.name || 'Usuario',
        role: currentUser.role
      }
    });
  };

  const handleGenerateWOFromPM = (pm) => {
    const newWoFromPm = {
      id: `WO-PM-${Math.floor(1000 + Math.random() * 9000)}`,
      code: `WO-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `Rutina Preventiva: ${pm.title}`,
      description: `Generada automáticamente desde plan preventivo ${pm.frequency}. Revisar especificaciones de equipo ${pm.assetName}.`,
      priority: 'Media',
      status: 'Abierta',
      category: 'Preventivo',
      assetId: pm.assetId,
      assetName: pm.assetName,
      development: 'Park Industrial',
      location: 'Cuarto de Máquinas',
      assignedTech: pm.assignedTech,
      assignedTechRole: 'Especialista en Mantenimiento',
      createdDate: new Date().toISOString(),
      dueDate: pm.nextDueDate,
      estimatedHours: pm.estimatedHours || 3.0,
      actualHours: 0.0,
      checklist: [
        { id: 1, text: 'Bloqueo y etiquetado LOTO de seguridad.', completed: false, timestamp: null },
        { id: 2, text: `Ejecutar tareas de rutina ${pm.frequency}.`, completed: false, timestamp: null },
        { id: 3, text: 'Verificar parámetros de operación normales.', completed: false, timestamp: null }
      ],
      usedParts: [],
      totalPartsCost: 0,
      totalLaborCost: (pm.estimatedHours || 3) * 50,
      grandTotal: (pm.estimatedHours || 3) * 50,
      technicianNotes: 'Orden generada automáticamente.',
      signatureData: null,
      comments: []
    };

    handleSaveWO(newWoFromPm);
    setActiveTab('workOrders');
    setSelectedWO(newWoFromPm);
    setIsWOModalOpen(true);
  };

  const handleExportSinglePdf = (wo) => {
    generateParkPdfReport({
      type: 'SINGLE_WO',
      workOrder: wo,
      data
    });
  };

  const openNewWOModal = () => {
    if (currentUser?.role === 'tecnico' || currentUser?.role === 'auditor') return;
    setSelectedWO(null);
    setIsWOModalOpen(true);
  };

  const openEditWOModal = (wo) => {
    setSelectedWO(wo ? JSON.parse(JSON.stringify(wo)) : null);
    setIsWOModalOpen(true);
  };

  const openCount = data.workOrders.filter(w => w.status === 'Abierta' || w.status === 'En Proceso').length;
  const lowStockCount = data.inventory.filter(i => i.currentStock <= i.minStock).length;



  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onNewWorkOrder={openNewWOModal}
        lowStockCount={lowStockCount}
        currentUser={currentUser}
        onLogout={handleLogout}
        data={data}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onSelectWO={openEditWOModal}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        socketStatus={socketStatus}
        onlineUsers={onlineUsers}
      />

      <div className="flex-1 flex flex-col lg:flex-row">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openCount={openCount}
          lowStockCount={lowStockCount}
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenProfile={() => setIsProfileModalOpen(true)}
        />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {activeTab === 'dashboard' && (
            <Dashboard
              data={data}
              currentUser={currentUser}
              onSelectWO={openEditWOModal}
              onNewWO={openNewWOModal}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onStatusChange={handleStatusChange}
              onDelegateWO={handleDelegateWO}
              technicians={data.technicians}
              users={data.users}
            />
          )}

          {activeTab === 'workOrders' && (
            <WorkOrders
              workOrders={data.workOrders}
              currentUser={currentUser}
              onSelectWO={openEditWOModal}
              onNewWO={openNewWOModal}
              onExportSinglePdf={handleExportSinglePdf}
              onStatusChange={handleStatusChange}
              searchTerm={searchTerm}
              onDelegateWO={handleDelegateWO}
              technicians={data.technicians}
              users={data.users}
            />
          )}

          {activeTab === 'assets' && (
            <Assets
              assets={data.assets}
              workOrders={data.workOrders}
              onSaveAsset={handleSaveAsset}
              onDeleteAsset={handleDeleteAsset}
            />
          )}

          {activeTab === 'preventive' && (
            <PreventiveMaintenance
              schedules={data.preventiveSchedules}
              onGenerateWOFromPM={handleGenerateWOFromPM}
            />
          )}

          {activeTab === 'inventory' && (
            <Inventory
              inventory={data.inventory}
              onUpdateStock={handleUpdateStock}
              onSavePart={handleSavePart}
              onDeletePart={handleDeletePart}
            />
          )}

          {activeTab === 'reports' && (
            <div className="p-8 rounded-2xl park-card space-y-6 text-center max-w-2xl mx-auto my-8">
              <div className="w-16 h-16 rounded-full btn-park-green mx-auto flex items-center justify-center text-2xl font-bold text-white shadow-md">
                📄
              </div>
              <h2 className="text-2xl font-bold text-[#0A3963] font-heading">
                Centro de Reportes PDF MaintainX — Plataforma PARK
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Generación de informes consolidados de mantenimiento con membrete corporativo de PlataformaPark, tablas de procedimiento y desgloses.
              </p>
              <button
                onClick={() => setIsPdfExportModalOpen(true)}
                className="px-6 py-3 rounded-xl btn-park-green text-white font-extrabold text-sm shadow-md hover:scale-105 transition-transform"
              >
                <Icon name="pdf" className="w-4 h-4 mr-1.5" /> Generar Reporte Consolidado PDF
              </button>
            </div>
          )}

          {activeTab === 'audit' && (
            <AuditTrail
              currentUser={currentUser}
            />
          )}

          {activeTab === 'users' && (
            <UsersManagement
              users={data.users || []}
              onSaveUser={handleSaveUser}
              onDeleteUser={handleDeleteUser}
              onToggleUserStatus={handleToggleUserStatus}
              currentUser={currentUser}
            />
          )}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      <WorkOrderModal
        isOpen={isWOModalOpen}
        onClose={() => setIsWOModalOpen(false)}
        onSave={handleSaveWO}
        workOrder={selectedWO}
        assets={data.assets}
        inventory={data.inventory}
        technicians={data.technicians}
        onExportPdf={handleExportSinglePdf}
        currentUser={currentUser}
        initialTab={woModalInitialTab}
      />

      <ExportPdfModal
        isOpen={isPdfExportModalOpen}
        onClose={() => setIsPdfExportModalOpen(false)}
        data={data}
      />
    
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onSaveProfile={handleSaveProfile}
        users={data.users || []}
      />

      {/* Contenedor flotante de notificaciones Toasts en tiempo real */}
      <ToastContainer
        toasts={toasts}
        onDismiss={dismissToast}
        onToastClick={handleToastClick}
      />
    </div>
  );
};
