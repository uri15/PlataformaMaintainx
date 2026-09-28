import React from 'react';
import { Icon } from './Icon.jsx';
import { SafeImage } from './SafeImage.jsx';
import { ParkLogo } from './ParkLogo.jsx';
import { SignaturePad } from './SignaturePad.jsx';
import { compressImageFile } from '../utils/imageCompressor.js';
import { uploadFileToServer } from '../utils/fileUpload.js';
import { formatAuditDate, formatFileSize } from '../utils/dateUtils.js';
import { joinOrderRoom, leaveOrderRoom, emitTyping, onSocket, emitSocket } from '../utils/socket.js';

export const WorkOrderModal = ({ isOpen, onClose, onSave, workOrder, assets = [], inventory = [], technicians = [], users = [], onExportPdf, currentUser, initialTab = 'form' }) => {
  if (!isOpen) return null;

  const isEdit = Boolean(workOrder && workOrder.id);
  const [activeModalTab, setActiveModalTab] = React.useState(initialTab || 'form');

  // Lista combinada de técnicos y usuarios colaboradores disponibles para delegación
  const availableAssignees = React.useMemo(() => {
    const list = [];
    if (Array.isArray(technicians) && technicians.length > 0) {
      technicians.forEach(t => list.push({ id: t.id, name: t.name, role: t.role || 'Técnico', email: t.email || '' }));
    }
    if (Array.isArray(users) && users.length > 0) {
      users.forEach(u => {
        if (!list.some(item => (u.email && item.email === u.email) || item.name === u.fullName)) {
          list.push({ id: u.id, name: u.fullName, role: u.role, email: u.email });
        }
      });
    }
    if (list.length === 0) {
      list.push({ id: 'u-tec-default', name: 'Téc. Juan Pérez', role: 'tecnico', email: 'tecnico@park.com' });
    }
    return list;
  }, [technicians, users]);

  // Obtener usuario autenticado real con fallback seguro a localStorage
  const effectiveUser = React.useMemo(() => {
    if (currentUser && (currentUser.full_name || currentUser.email)) return currentUser;
    try {
      const saved = localStorage.getItem('cmms_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      id: 'u-admin-001',
      email: 'admin@park.com',
      full_name: 'Ing. Carlos Mendoza (Admin)',
      role: 'admin'
    };
  }, [currentUser]);


  const [formData, setFormData] = React.useState({
    id: workOrder?.id || `WO-${Math.floor(1000 + Math.random() * 9000)}`,
    code: workOrder?.code || `WO-${Math.floor(1000 + Math.random() * 9000)}`,
    title: workOrder?.title || '',
    description: workOrder?.description || '',
    priority: workOrder?.priority || 'Media',
    status: workOrder?.status || 'Abierta',
    category: workOrder?.category || 'Preventivo',
    assetId: workOrder?.assetId !== undefined ? workOrder.assetId : '',
    assetName: workOrder?.assetName !== undefined ? workOrder.assetName : '',
    development: workOrder?.development || 'Park Industrial',
    location: workOrder?.location || '',
    assignedTech: workOrder?.assignedTech || (availableAssignees[0]?.name || 'Téc. Juan Pérez'),
    assignedTechRole: workOrder?.assignedTechRole || (availableAssignees[0]?.role || 'Técnico Operativo'),
    assignedTechEmail: workOrder?.assignedTechEmail || (availableAssignees[0]?.email || 'tecnico@park.com'),
    dueDate: workOrder?.dueDate ? workOrder.dueDate.substring(0, 10) : new Date().toISOString().substring(0, 10),
    estimatedHours: workOrder?.estimatedHours !== undefined ? workOrder.estimatedHours : 2.0,
    actualHours: workOrder?.actualHours !== undefined ? workOrder.actualHours : 0.0,
    manualMaterialsCost: workOrder?.manualMaterialsCost !== undefined 
      ? workOrder.manualMaterialsCost 
      : (workOrder?.totalPartsCost !== undefined ? workOrder.totalPartsCost : 0),
    totalLaborCost: workOrder?.totalLaborCost !== undefined ? workOrder.totalLaborCost : 0,
    noCostEntries: workOrder?.noCostEntries !== undefined ? workOrder.noCostEntries : false,
    checklist: (Array.isArray(workOrder?.checklist) && workOrder.checklist.length > 0)
      ? JSON.parse(JSON.stringify(workOrder.checklist))
      : [
          { id: 1, text: 'Revisión y bloqueo de seguridad LOTO', completed: false, timestamp: null },
          { id: 2, text: 'Ejecución de mantenimiento técnico de rutina', completed: false, timestamp: null },
          { id: 3, text: 'Pruebas de funcionamiento e inspección final', completed: false, timestamp: null }
        ],
    usedParts: Array.isArray(workOrder?.usedParts) ? JSON.parse(JSON.stringify(workOrder.usedParts)) : [],
    technicianNotes: workOrder?.technicianNotes || '',
    photos: Array.isArray(workOrder?.photos) ? JSON.parse(JSON.stringify(workOrder.photos)) : [],
    comments: Array.isArray(workOrder?.comments) ? JSON.parse(JSON.stringify(workOrder.comments)) : [],
    createdBy: workOrder?.createdBy || (effectiveUser.full_name || effectiveUser.fullName || effectiveUser.name || 'Ing. Carlos Mendoza (Admin)'),
    createdDate: workOrder?.createdDate || new Date().toISOString(),
    updatedAt: workOrder?.updatedAt || null,
    lastUpdatedBy: workOrder?.lastUpdatedBy || null
  });

  const [newCommentText, setNewCommentText] = React.useState('');
  const chatBottomRef = React.useRef(null);
  const [chatAttachment, setChatAttachment] = React.useState(null);
  const [previewImage, setPreviewImage] = React.useState(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = React.useState(false);
  const [isDraggingPhotos, setIsDraggingPhotos] = React.useState(false);
  const [typingUser, setTypingUser] = React.useState(null);
  const typingTimeoutRef = React.useRef(null);
  const [isAssigneePickerOpen, setIsAssigneePickerOpen] = React.useState(false);
  const [assigneeSearchQuery, setAssigneeSearchQuery] = React.useState('');
  const [isAssetPickerOpen, setIsAssetPickerOpen] = React.useState(false);
  const [assetSearchQuery, setAssetSearchQuery] = React.useState('');

  const [newChecklistItem, setNewChecklistItem] = React.useState('');
  const [selectedPartId, setSelectedPartId] = React.useState(inventory[0]?.id || '');
  const [partQty, setPartQty] = React.useState(1);
  const [partInputMode, setPartInputMode] = React.useState('manual');
  const [manualPartName, setManualPartName] = React.useState('');
  const [manualPartQty, setManualPartQty] = React.useState(1);
  const [manualPartUnitCost, setManualPartUnitCost] = React.useState('');

  // Sincronizar formData de forma instantánea al abrir o cambiar de orden
  React.useEffect(() => {
    if (isOpen) {
      setIsAssetPickerOpen(false);
      setAssetSearchQuery('');
      setIsAssigneePickerOpen(false);
      setAssigneeSearchQuery('');
      setFormData({
        id: workOrder?.id || `WO-${Math.floor(1000 + Math.random() * 9000)}`,
        code: workOrder?.code || `WO-${Math.floor(1000 + Math.random() * 9000)}`,
        title: workOrder?.title || '',
        description: workOrder?.description || '',
        priority: workOrder?.priority || 'Media',
        status: workOrder?.status || 'Abierta',
        category: workOrder?.category || 'Preventivo',
        assetId: workOrder?.assetId !== undefined ? workOrder.assetId : '',
        assetName: workOrder?.assetName !== undefined ? workOrder.assetName : '',
        development: workOrder?.development || 'Park Industrial',
        location: workOrder?.location || '',
        assignedTech: workOrder?.assignedTech || (availableAssignees[0]?.name || 'Téc. Juan Pérez'),
        assignedTechRole: workOrder?.assignedTechRole || (availableAssignees[0]?.role || 'Técnico Operativo'),
        assignedTechEmail: workOrder?.assignedTechEmail || (availableAssignees[0]?.email || 'tecnico@park.com'),
        dueDate: workOrder?.dueDate ? workOrder.dueDate.substring(0, 10) : new Date().toISOString().substring(0, 10),
        estimatedHours: workOrder?.estimatedHours !== undefined ? workOrder.estimatedHours : 2.0,
        actualHours: workOrder?.actualHours !== undefined ? workOrder.actualHours : 0.0,
        manualMaterialsCost: workOrder?.manualMaterialsCost !== undefined 
          ? workOrder.manualMaterialsCost 
          : (workOrder?.totalPartsCost !== undefined ? workOrder.totalPartsCost : 0),
        totalLaborCost: workOrder?.totalLaborCost !== undefined ? workOrder.totalLaborCost : 0,
        noCostEntries: workOrder?.noCostEntries !== undefined ? workOrder.noCostEntries : false,
        checklist: (Array.isArray(workOrder?.checklist) && workOrder.checklist.length > 0)
          ? JSON.parse(JSON.stringify(workOrder.checklist))
          : [
              { id: 1, text: 'Revisión y bloqueo de seguridad LOTO', completed: false, timestamp: null },
              { id: 2, text: 'Ejecución de mantenimiento técnico de rutina', completed: false, timestamp: null },
              { id: 3, text: 'Pruebas de funcionamiento e inspección final', completed: false, timestamp: null }
            ],
        usedParts: Array.isArray(workOrder?.usedParts) ? JSON.parse(JSON.stringify(workOrder.usedParts)) : [],
        technicianNotes: workOrder?.technicianNotes || '',
        photos: Array.isArray(workOrder?.photos) ? JSON.parse(JSON.stringify(workOrder.photos)) : [],
        comments: Array.isArray(workOrder?.comments) ? JSON.parse(JSON.stringify(workOrder.comments)) : [],
        createdBy: workOrder?.createdBy || (effectiveUser.full_name || effectiveUser.fullName || effectiveUser.name || 'Ing. Carlos Mendoza (Admin)'),
        createdDate: workOrder?.createdDate || new Date().toISOString(),
        updatedAt: workOrder?.updatedAt || null,
        lastUpdatedBy: workOrder?.lastUpdatedBy || null
      });
      setChatAttachment(null);
      setPreviewImage(null);
      setIsDraggingPhotos(false);
      setManualPartName('');
      setManualPartQty(1);
      setManualPartUnitCost('');
      setPartInputMode('manual');
      setActiveModalTab(initialTab || 'form');
    }
  }, [isOpen, workOrder, initialTab]);

  React.useEffect(() => {
    if (activeModalTab === 'chat' && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeModalTab, formData.comments, typingUser]);

  // Sincronización en tiempo real vía Socket.io para la orden activa
  React.useEffect(() => {
    if (!isOpen || !formData.id) return;

    joinOrderRoom(formData.id);

    // Escuchar mensajes entrantes de otros usuarios para esta orden
    const unsubMsg = onSocket('chat:message', (payload) => {
      if (payload && payload.orderId === formData.id && payload.comment) {
        setFormData(prev => {
          const exists = (prev.comments || []).some(c => c.id === payload.comment.id);
          if (exists) return prev;
          return {
            ...prev,
            comments: [...(prev.comments || []), payload.comment]
          };
        });
      }
    });

    // Escuchar si otro participante está escribiendo
    const unsubTyping = onSocket('chat:typing_status', (payload) => {
      if (payload && payload.orderId === formData.id) {
        if (payload.isTyping && payload.user) {
          setTypingUser(payload.user);
        } else {
          setTypingUser(null);
        }
      }
    });

    return () => {
      leaveOrderRoom(formData.id);
      unsubMsg();
      unsubTyping();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [isOpen, formData.id]);

  // Prevenir que el navegador abra la imagen en una pestaña nueva si se arrastra y suelta en cualquier parte
  React.useEffect(() => {
    if (!isOpen) return;

    const preventWindowDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener('dragover', preventWindowDrop, false);
    window.addEventListener('drop', preventWindowDrop, false);

    return () => {
      window.removeEventListener('dragover', preventWindowDrop, false);
      window.removeEventListener('drop', preventWindowDrop, false);
    };
  }, [isOpen]);

  const selectedAsset = formData.assetId ? assets.find(a => a.id === formData.assetId) : null;

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
    if (!selectedPartId) return;
    const invItem = inventory.find(i => i.id === selectedPartId);
    if (!invItem) return;

    const qty = Math.max(1, Number(partQty) || 1);
    const existingIdx = formData.usedParts.findIndex(p => p.partId === selectedPartId);
    let updatedParts = [...formData.usedParts];
    if (existingIdx >= 0) {
      const nextQty = updatedParts[existingIdx].qty + qty;
      updatedParts[existingIdx] = {
        ...updatedParts[existingIdx],
        qty: nextQty,
        totalCost: nextQty * updatedParts[existingIdx].unitCost
      };
    } else {
      updatedParts.push({
        partId: invItem.id,
        name: invItem.name,
        qty: qty,
        unitCost: invItem.unitCost,
        totalCost: qty * invItem.unitCost,
        isManual: false
      });
    }

    const newPartsSum = updatedParts.reduce((sum, p) => sum + (p.totalCost || 0), 0);
    setFormData(prev => ({
      ...prev,
      usedParts: updatedParts,
      manualMaterialsCost: newPartsSum,
      noCostEntries: false
    }));
  };

  const handleAddManualPart = () => {
    if (!manualPartName.trim()) return;
    const qty = Math.max(1, Number(manualPartQty) || 1);
    const unitCost = Math.max(0, parseFloat(manualPartUnitCost) || 0);
    const totalCost = qty * unitCost;

    const newPart = {
      partId: `MANUAL-${Date.now()}`,
      name: manualPartName.trim(),
      qty: qty,
      unitCost: unitCost,
      totalCost: totalCost,
      isManual: true
    };

    const updatedParts = [...formData.usedParts, newPart];
    const newPartsSum = updatedParts.reduce((sum, p) => sum + (p.totalCost || 0), 0);
    setFormData(prev => ({
      ...prev,
      usedParts: updatedParts,
      manualMaterialsCost: newPartsSum,
      noCostEntries: false
    }));

    setManualPartName('');
    setManualPartQty(1);
    setManualPartUnitCost('');
  };

  const handleRemovePart = (partId) => {
    const updatedParts = formData.usedParts.filter(p => p.partId !== partId);
    const newPartsSum = updatedParts.reduce((sum, p) => sum + (p.totalCost || 0), 0);
    setFormData(prev => ({
      ...prev,
      usedParts: updatedParts,
      manualMaterialsCost: newPartsSum
    }));
  };

  const handleClearTimesAndCosts = () => {
    setFormData(prev => ({
      ...prev,
      usedParts: [],
      manualMaterialsCost: 0,
      totalLaborCost: 0,
      actualHours: 0,
      noCostEntries: true
    }));
  };

  const handleClearChecklist = () => {
    if (window.confirm("¿Deseas vaciar todos los pasos del procedimiento?")) {
      setFormData(prev => ({
        ...prev,
        checklist: []
      }));
    }
  };


  const totalPartsCost = Number(formData.manualMaterialsCost !== undefined 
    ? formData.manualMaterialsCost 
    : formData.usedParts.reduce((sum, p) => sum + (p.totalCost || 0), 0)) || 0;
  const totalLaborCost = Number(formData.totalLaborCost) || 0;
  const grandTotal = totalPartsCost + totalLaborCost;
  const actualHours = Number(formData.actualHours) || 0;
  const isZeroCostEntries = (grandTotal === 0 && actualHours === 0 && (!formData.usedParts || formData.usedParts.length === 0)) || Boolean(formData.noCostEntries && grandTotal === 0);

  const processPhotoFiles = async (files) => {
    if (!files || files.length === 0) return;
    setIsUploadingPhoto(true);
    const now = new Date();
    const nowIso = now.toISOString();
    const updater = effectiveUser.full_name || effectiveUser.fullName || effectiveUser.name || effectiveUser.email || 'Técnico';

    try {
      const newPhotos = [];
      for (const file of files) {
        if (!file.type || !file.type.startsWith('image/')) continue;
        const uploadResult = await uploadFileToServer(file, { folder: 'photos', maxWidth: 1200, maxHeight: 1200, quality: 0.75 });
        if (uploadResult && uploadResult.url) {
          newPhotos.push({
            id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            url: uploadResult.url,
            name: uploadResult.name || file.name,
            size: uploadResult.size || file.size,
            tag: 'Evidencia',
            uploadedAt: now.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit' }) + ' ' + now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
            uploadedBy: updater
          });
        }
      }

      if (newPhotos.length > 0) {
        setFormData(prev => ({
          ...prev,
          photos: [...(prev.photos || []), ...newPhotos]
        }));
      }
    } catch (err) {
      console.error('Error al procesar fotos:', err);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    await processPhotoFiles(files);
    e.target.value = '';
  };

  const handleRemovePhoto = (photoIdOrIdx) => {
    setFormData(prev => ({
      ...prev,
      photos: (prev.photos || []).filter((p, idx) => p.id !== photoIdOrIdx && idx !== photoIdOrIdx)
    }));
  };

  const handleUpdatePhotoTag = (photoIdOrIdx, newTag) => {
    setFormData(prev => ({
      ...prev,
      photos: (prev.photos || []).map((p, idx) => {
        if (p.id === photoIdOrIdx || idx === photoIdOrIdx) {
          return { ...p, tag: newTag };
        }
        return p;
      })
    }));
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingPhotos(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }
    setIsDraggingPhotos(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget && e.relatedTarget && e.currentTarget.contains(e.relatedTarget)) {
      return;
    }
    setIsDraggingPhotos(false);
  };

  const handleDropPhotos = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingPhotos(false);
    const files = e.dataTransfer ? Array.from(e.dataTransfer.files || []) : [];
    if (files.length > 0) {
      processPhotoFiles(files);
    }
  };

  const handleChatFileSelect = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    try {
      const isImg = file.type && file.type.startsWith('image/');
      let docType = 'file';
      const lowerName = (file.name || '').toLowerCase();
      if (lowerName.endsWith('.pdf')) docType = 'pdf';
      else if (lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls') || lowerName.endsWith('.csv')) docType = 'excel';
      else if (lowerName.endsWith('.docx') || lowerName.endsWith('.doc')) docType = 'word';

      const folder = isImg ? 'photos' : 'documents';
      const uploadResult = await uploadFileToServer(file, { folder, type: isImg ? 'image' : 'document' });

      if (uploadResult && uploadResult.url) {
        setChatAttachment({
          type: isImg ? 'image' : 'document',
          fileType: isImg ? 'image' : docType,
          name: uploadResult.name || file.name,
          size: uploadResult.size || file.size,
          url: uploadResult.url
        });
      }
    } catch (err) {
      console.error('Error al cargar archivo en chat:', err);
    } finally {
      e.target.value = '';
    }
  };

  const handleSendComment = () => {
    if (!newCommentText.trim() && !chatAttachment) return;

    const now = new Date();
    const formattedDate = now.toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric" });
    const formattedTime = now.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });

    const senderName = effectiveUser.full_name || effectiveUser.fullName || effectiveUser.name || effectiveUser.email || 'Usuario';
    const senderRole = (effectiveUser.role || 'admin').toUpperCase();
    const senderId = effectiveUser.id || effectiveUser.email || 'u-current';

    let badgeStyle = "bg-blue-100 text-blue-800 border-blue-200";
    let avatarBg = "bg-[#0A3963]";
    if (effectiveUser.role === 'admin' || effectiveUser.role === 'developer') {
      badgeStyle = "bg-purple-100 text-purple-800 border-purple-200";
      avatarBg = "bg-purple-700";
    } else if (effectiveUser.role === 'supervisor') {
      badgeStyle = "bg-emerald-100 text-emerald-800 border-emerald-200";
      avatarBg = "bg-emerald-700";
    } else if (effectiveUser.role === 'solicitante') {
      badgeStyle = "bg-amber-100 text-amber-800 border-amber-200";
      avatarBg = "bg-amber-600";
    }

    const newComment = {
      id: `c-${Date.now()}`,
      userId: senderId,
      userName: senderName,
      userRole: senderRole,
      roleBadge: badgeStyle,
      avatarColor: avatarBg,
      timestamp: `${formattedDate} ${formattedTime}`,
      text: newCommentText.trim(),
      image: chatAttachment && chatAttachment.type === 'image' ? chatAttachment.url : null,
      attachment: chatAttachment || null,
      type: 'comment'
    };

    const updatedComments = [...(formData.comments || []), newComment];
    setFormData(prev => ({ ...prev, comments: updatedComments }));
    setNewCommentText('');
    setChatAttachment(null);
    emitTyping(formData.id, effectiveUser, false);

    // Emitir mensaje por Socket.io a los demás usuarios
    emitSocket('chat:send', {
      orderId: formData.id,
      comment: newComment,
      sender: {
        id: effectiveUser.id,
        name: senderName,
        role: senderRole,
        email: effectiveUser.email
      }
    });

    if (isEdit) {
      onSave({
        ...workOrder,
        comments: updatedComments,
        updatedAt: now.toISOString(),
        lastUpdatedBy: senderName
      });
    }
  };

  const handleDeleteComment = (commentId) => {
    const updatedComments = (formData.comments || []).filter(c => c.id !== commentId);
    setFormData(prev => ({ ...prev, comments: updatedComments }));
    if (isEdit) {
      onSave({
        ...workOrder,
        comments: updatedComments,
        updatedAt: new Date().toISOString(),
        lastUpdatedBy: effectiveUser.full_name || effectiveUser.name || 'Usuario'
      });
    }
  };

  const handleSubmitAndGeneratePdf = (shouldGeneratePdf = false) => {
    const selectedAssignee = availableAssignees.find(a => a.name === formData.assignedTech) || availableAssignees[0];
    const nowIso = new Date().toISOString();
    const updater = effectiveUser.full_name || effectiveUser.fullName || effectiveUser.name || 'Usuario';
    const finalData = {
      ...formData,
      photos: formData.photos || [],
      updatedAt: nowIso,
      lastUpdatedBy: updater,
      assignedTech: formData.assignedTech || selectedAssignee?.name || 'Téc. Juan Pérez',
      assignedTechRole: selectedAssignee?.role || formData.assignedTechRole || 'tecnico',
      assignedTechEmail: selectedAssignee?.email || formData.assignedTechEmail || 'tecnico@park.com',
      assetId: formData.assetId || '',
      assetName: formData.assetId ? (selectedAsset?.name || formData.assetName || '') : (formData.assetName || ''),
      development: selectedAsset?.development || formData.development || 'Park Industrial',
      location: formData.location || selectedAsset?.location || 'Área Principal',
      createdDate: workOrder?.createdDate || new Date().toISOString(),
      manualMaterialsCost: totalPartsCost,
      totalPartsCost,
      totalLaborCost,
      actualHours,
      grandTotal,
      noCostEntries: isZeroCostEntries
    };
    onSave(finalData);

    if (shouldGeneratePdf) {
      onExportPdf(finalData);
    }
    onClose();
  };

  const handleToggleComplete = (e) => {
    if (e) e.preventDefault();
    const nextStatus = formData.status === 'Completada' ? 'En Proceso' : 'Completada';
    const nowIso = new Date().toISOString();
    const updater = effectiveUser.full_name || effectiveUser.fullName || effectiveUser.name || 'Usuario';
    const finalData = {
      ...formData,
      photos: formData.photos || [],
      status: nextStatus,
      updatedAt: nowIso,
      lastUpdatedBy: updater,
      assetId: formData.assetId || '',
      assetName: formData.assetId ? (selectedAsset?.name || formData.assetName || '') : (formData.assetName || ''),
      development: selectedAsset?.development || formData.development || 'Park Industrial',
      location: formData.location || selectedAsset?.location || 'Área Principal',
      createdDate: workOrder?.createdDate || new Date().toISOString(),
      manualMaterialsCost: totalPartsCost,
      totalPartsCost,
      totalLaborCost,
      actualHours,
      grandTotal,
      noCostEntries: isZeroCostEntries
    };
    setFormData(finalData);
    onSave(finalData);
    onClose();
  };

  const commentsCount = (formData.comments || []).length;
  const currentUserName = effectiveUser.full_name || effectiveUser.fullName || effectiveUser.name || effectiveUser.email || 'Usuario';
  const currentUserRoleDisplay = (effectiveUser.role || 'tecnico').toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 bg-[#0A3963] text-white shrink-0">
          <div className="flex items-center gap-3">
            <ParkLogo />
            <div>
              <h2 className="text-lg font-bold text-white font-heading">
                {isEdit ? `Orden de Trabajo: ${formData.code}` : 'Nuevo Reporte / Orden de Trabajo'}
              </h2>
              <p className="text-xs text-[#8CC63F] font-bold">PLATAFORMA PARK CMMS &bull; Módulo Operativo</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isEdit && (
              <button
                type="button"
                onClick={() => handleSubmitAndGeneratePdf(true)}
                className="px-3.5 py-1.5 rounded btn-park-green text-xs font-extrabold shadow-sm hover:scale-105 transition-transform flex items-center gap-1.5"
              >
                <Icon name="pdf" className="w-4 h-4 mr-1" /> <span>Generar PDF</span>
              </button>
            )}
            <button onClick={onClose} className="text-slate-400 hover:text-white text-xl p-1 font-bold">
              ✕
            </button>
          </div>
        </div>

        {/* Modal Sub-navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 bg-slate-100 border-b border-slate-200 shrink-0">
          <button
            type="button"
            onClick={() => setActiveModalTab('form')}
            className={`px-4 py-2.5 text-xs font-extrabold border-b-2 transition-all flex items-center gap-2 ${
              activeModalTab === 'form'
                ? 'border-[#0A3963] text-[#0A3963] bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 rounded-t-lg'
            }`}
          >
            <Icon name="workOrders" className="w-4 h-4" />
            <span>Procedimiento & Datos de la Orden</span>
            {formData.photos && formData.photos.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#0A3963]/10 text-[#0A3963]">
                {formData.photos.length} fotos
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveModalTab('chat')}
            className={`px-4 py-2.5 text-xs font-extrabold border-b-2 transition-all flex items-center gap-2 ${
              activeModalTab === 'chat'
                ? 'border-[#8CC63F] text-[#0A3963] bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 rounded-t-lg'
            }`}
          >
            <Icon name="comments" className="w-4 h-4 text-[#8CC63F]" />
            <span>Bitácora & Chat de la Orden</span>
            {commentsCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#8CC63F] text-[#0B192C]">
                {commentsCount}
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-200 text-slate-600">
                0
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: FORMULARIO PRINCIPAL */}
        {activeModalTab === 'form' && (
          <form onSubmit={(e) => { e.preventDefault(); handleSubmitAndGeneratePdf(false); }} className="p-6 space-y-6 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Título de la Orden *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej. Inspección y Cambio de Filtros HVAC"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#8CC63F] focus:bg-white outline-none font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Ubicación / Área Específica
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ej. Nave 3, Almacén Central, Oficinas..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-900 focus:border-[#8CC63F] focus:bg-white outline-none font-medium shadow-2xs"
                  />
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                    <Icon name="location" className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Activo / Equipo <span className="text-slate-400 font-normal">(Opcional)</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={formData.assetName || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData({ 
                          ...formData, 
                          assetName: val, 
                          assetId: val ? (formData.assetId || 'AST-MANUAL') : '' 
                        });
                      }}
                      placeholder="Opcional: escribe el activo o elige uno registrado..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-900 focus:border-[#8CC63F] focus:bg-white outline-none font-bold shadow-2xs"
                    />
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                      <Icon name="assets" className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAssetPickerOpen(!isAssetPickerOpen)}
                    className={`px-3 py-2 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs shrink-0 ${
                      isAssetPickerOpen
                        ? 'bg-[#0A3963] text-white border-[#0A3963]'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-[#0A3963] border-emerald-200'
                    }`}
                    title="Buscar y seleccionar entre equipos o activos registrados"
                  >
                    <Icon name="search" className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Elegir Registrado</span>
                  </button>
                </div>

                {/* Popover buscador de activos registrados */}
                {isAssetPickerOpen && (
                  <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 shadow-md animate-in fade-in duration-100">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-[#0A3963] uppercase tracking-wider">
                        Activos Registrados ({assets.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsAssetPickerOpen(false)}
                        className="text-slate-400 hover:text-slate-700 text-xs font-bold"
                      >
                        &times;
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        value={assetSearchQuery}
                        onChange={(e) => setAssetSearchQuery(e.target.value)}
                        placeholder="Buscar activo por nombre, código o área..."
                        className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-[#8CC63F]"
                        autoFocus
                      />
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                        <Icon name="search" className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <div className="max-h-40 overflow-y-auto space-y-1 divide-y divide-slate-100">
                      <div
                        onClick={() => {
                          setFormData({
                            ...formData,
                            assetId: '',
                            assetName: ''
                          });
                          setIsAssetPickerOpen(false);
                          setAssetSearchQuery('');
                        }}
                        className="pt-1.5 pb-1 px-2 rounded-lg hover:bg-white cursor-pointer transition-colors flex items-center justify-between gap-2 text-slate-500 italic text-xs"
                      >
                        <span>-- Dejar sin Activo Asignado --</span>
                        <span className="text-[9px] font-semibold text-slate-400">Limpiar</span>
                      </div>
                      {assets
                        .filter(a =>
                          (a.name || '').toLowerCase().includes(assetSearchQuery.toLowerCase()) ||
                          (a.code || '').toLowerCase().includes(assetSearchQuery.toLowerCase()) ||
                          (a.location || '').toLowerCase().includes(assetSearchQuery.toLowerCase()) ||
                          (a.development || '').toLowerCase().includes(assetSearchQuery.toLowerCase())
                        )
                        .map(ast => (
                          <div
                            key={ast.id}
                            onClick={() => {
                              setFormData({
                                ...formData,
                                assetId: ast.id,
                                assetName: ast.name,
                                development: ast.development || formData.development,
                                location: formData.location && formData.location !== 'Área Principal' ? formData.location : (ast.location || formData.location || 'Área Principal')
                              });
                              setIsAssetPickerOpen(false);
                              setAssetSearchQuery('');
                            }}
                            className="pt-1.5 pb-1 px-2 rounded-lg hover:bg-white cursor-pointer transition-colors flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className="w-2 h-2 rounded-full bg-[#8CC63F] shrink-0"></span>
                              <span className="text-xs font-bold text-slate-800 truncate">{ast.name}</span>
                              {ast.code && (
                                <span className="text-[10px] text-slate-400 font-mono">({ast.code})</span>
                              )}
                            </div>
                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase shrink-0">
                              {ast.development || 'Park Industrial'}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Prioridad</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#8CC63F] focus:bg-white outline-none font-bold"
                >
                  <option value="Urgente">🚨 Urgente</option>
                  <option value="Alta">🟧 Alta</option>
                  <option value="Media">🟨 Media</option>
                  <option value="Baja">🟦 Baja</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Estado de la Orden</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#8CC63F] focus:bg-white outline-none font-bold"
                >
                  <option value="Abierta">🔵 Abierta</option>
                  <option value="En Proceso">🟣 En Proceso</option>
                  <option value="En Espera">🟡 En Espera</option>
                  <option value="Completada">🟢 Completada</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Categoría</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#8CC63F] focus:bg-white outline-none font-medium"
                >
                  <option value="Preventivo">Preventivo</option>
                  <option value="Correctivo">Correctivo</option>
                  <option value="Inspección">Inspección</option>
                  <option value="Seguridad">Seguridad</option>
                  <option value="Eléctrico">Eléctrico</option>
                  <option value="Climatización / HVAC">Climatización / HVAC</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Delegar / Técnico Asignado *
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={formData.assignedTech || ''}
                      onChange={(e) => setFormData({ ...formData, assignedTech: e.target.value })}
                      placeholder="Nombre del técnico o responsable (registrado o externo)..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-900 focus:border-[#8CC63F] focus:bg-white outline-none font-bold shadow-2xs"
                    />
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                      <Icon name="user" className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAssigneePickerOpen(!isAssigneePickerOpen)}
                    className={`px-3 py-2 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs shrink-0 ${
                      isAssigneePickerOpen
                        ? 'bg-[#0A3963] text-white border-[#0A3963]'
                        : 'bg-blue-50 hover:bg-blue-100 text-[#0A3963] border-blue-200'
                    }`}
                    title="Buscar y seleccionar entre personal registrado"
                  >
                    <Icon name="search" className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Elegir Registrado</span>
                  </button>
                </div>

                {/* Popover buscador de personal registrado */}
                {isAssigneePickerOpen && (
                  <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 shadow-md animate-in fade-in duration-100">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-[#0A3963] uppercase tracking-wider">
                        Personal Registrado ({availableAssignees.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsAssigneePickerOpen(false)}
                        className="text-slate-400 hover:text-slate-700 text-xs font-bold"
                      >
                        &times;
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        value={assigneeSearchQuery}
                        onChange={(e) => setAssigneeSearchQuery(e.target.value)}
                        placeholder="Buscar por nombre o rol..."
                        className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-[#8CC63F]"
                        autoFocus
                      />
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                        <Icon name="search" className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <div className="max-h-40 overflow-y-auto space-y-1 divide-y divide-slate-100">
                      {availableAssignees
                        .filter(a =>
                          (a.name || '').toLowerCase().includes(assigneeSearchQuery.toLowerCase()) ||
                          (a.role || '').toLowerCase().includes(assigneeSearchQuery.toLowerCase()) ||
                          (a.email || '').toLowerCase().includes(assigneeSearchQuery.toLowerCase())
                        )
                        .map(person => (
                          <div
                            key={person.id || person.name}
                            onClick={() => {
                              setFormData({
                                ...formData,
                                assignedTech: person.name,
                                assignedTechRole: person.role,
                                assignedTechEmail: person.email
                              });
                              setIsAssigneePickerOpen(false);
                              setAssigneeSearchQuery('');
                            }}
                            className="pt-1.5 pb-1 px-2 rounded-lg hover:bg-white cursor-pointer transition-colors flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className="w-2 h-2 rounded-full bg-[#0A3963] shrink-0"></span>
                              <span className="text-xs font-bold text-slate-800 truncate">{person.name}</span>
                            </div>
                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-blue-50 text-[#0A3963] border border-blue-200 uppercase shrink-0">
                              {person.role}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Descripción Detallada del Requerimiento</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Escriba las instrucciones de trabajo para el técnico..."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-900 focus:border-[#8CC63F] focus:bg-white outline-none font-medium"
              />
            </div>

            {/* Checklist */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#0A3963] uppercase tracking-wider">
                  1. Procedimiento & Checklist de Verificación paso a paso
                </h3>
                {formData.checklist && formData.checklist.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearChecklist}
                    className="text-[11px] text-slate-400 hover:text-red-500 font-normal transition-colors flex items-center gap-1 hover:underline"
                    title="Limpiar todos los pasos del procedimiento"
                  >
                    <Icon name="clean" className="w-3 h-3 text-slate-400" />
                    <span>Limpiar pasos</span>
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {(formData.checklist || []).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2.5 rounded bg-white border border-slate-200 text-xs">
                    <label className="flex items-center gap-2.5 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={Boolean(item.completed)}
                        onChange={() => handleChecklistToggle(item.id)}
                        className="w-4 h-4 accent-[#8CC63F] rounded cursor-pointer"
                      />
                      <span className={item.completed ? 'line-through text-slate-400 font-medium' : 'text-slate-900 font-semibold'}>
                        {item.text}
                      </span>
                    </label>
                    <div className="flex items-center gap-2">
                      {item.completed && (
                        <span className="text-[10px] text-emerald-600 font-mono font-bold">{item.timestamp}</span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveChecklistItem(item.id)}
                        className="text-slate-400 hover:text-red-600 text-xs font-bold"
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddChecklistItem();
                    }
                  }}
                  placeholder="Agregar nuevo paso al procedimiento..."
                  className="flex-1 bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-[#8CC63F] font-medium"
                />
                <button
                  type="button"
                  onClick={handleAddChecklistItem}
                  className="px-3 py-1.5 rounded bg-[#0A3963] text-white text-xs font-bold shadow-xs hover:bg-[#082D4F]"
                >
                  + Agregar Paso
                </button>
              </div>
            </div>

            {/* Repuestos, Tiempos y Costos */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-xs font-bold text-[#0A3963] uppercase tracking-wider flex items-center gap-1.5">
                    <span>2. Repuestos, Seguimiento de Tiempos & Desglose de Costos</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Asigna repuestos de almacén o manuales y gestiona tiempos y costos libremente (opcional).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClearTimesAndCosts}
                  className="text-xs font-semibold text-slate-500 hover:text-red-600 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 transition-all shadow-2xs"
                  title="Vaciar repuestos y dejar tiempos y costos en blanco"
                >
                  <Icon name="clean" className="w-3.5 h-3.5 text-[#8CC63F]" />
                  <span>Dejar tiempos y costos en blanco</span>
                </button>
              </div>

              {/* Selector de Modo: Almacén Registrado vs Manual */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setPartInputMode('inventory')}
                      className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                        partInputMode === 'inventory'
                          ? 'bg-[#0A3963] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 bg-white'
                      }`}
                    >
                      <Icon name="inventory" className="w-3.5 h-3.5 text-[#8CC63F]" />
                      <span>Elegir Registrado (Almacén)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPartInputMode('manual')}
                      className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                        partInputMode === 'manual'
                          ? 'bg-[#0A3963] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 bg-white'
                      }`}
                    >
                      <Icon name="pencil" className="w-3.5 h-3.5 text-[#8CC63F]" />
                      <span>Agregar Manual</span>
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium italic">
                    (Opcional)
                  </span>
                </div>

                {partInputMode === 'inventory' ? (
                  inventory.length > 0 ? (
                    <div className="flex flex-col sm:flex-row gap-2 items-center">
                      <select
                        value={selectedPartId}
                        onChange={(e) => setSelectedPartId(e.target.value)}
                        className="flex-1 w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 outline-none font-medium focus:border-[#8CC63F] focus:bg-white"
                      >
                        <option value="">-- Seleccionar repuesto del inventario --</option>
                        {inventory.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} (Stock: {p.currentStock}) - ${p.unitCost} USD
                          </option>
                        ))}
                      </select>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <input
                          type="number"
                          min="1"
                          value={partQty}
                          onChange={(e) => setPartQty(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-20 bg-slate-50 border border-slate-300 rounded-lg px-2 py-2 text-xs text-slate-900 text-center outline-none font-bold focus:bg-white focus:border-[#8CC63F]"
                          placeholder="Cant."
                          title="Cantidad"
                        />
                        <button
                          type="button"
                          onClick={handleAddPart}
                          className="px-3.5 py-2 rounded-lg btn-park-green text-xs font-bold shadow-xs whitespace-nowrap"
                        >
                          + Añadir Repuesto
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic py-1">No hay repuestos registrados en el inventario.</p>
                  )
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2 items-center">
                    <input
                      type="text"
                      value={manualPartName}
                      onChange={(e) => setManualPartName(e.target.value)}
                      placeholder="Nombre o descripción del repuesto manual / externo..."
                      className="flex-1 w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 outline-none font-medium focus:border-[#8CC63F] focus:bg-white"
                    />
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <input
                        type="number"
                        min="1"
                        value={manualPartQty}
                        onChange={(e) => setManualPartQty(Math.max(1, parseInt(e.target.value) || 1))}
                        placeholder="Cant."
                        className="w-16 bg-slate-50 border border-slate-300 rounded-lg px-2 py-2 text-xs text-slate-900 text-center outline-none font-bold focus:bg-white focus:border-[#8CC63F]"
                        title="Cantidad"
                      />
                      <div className="relative w-28">
                        <span className="absolute left-2.5 top-2 text-slate-400 font-bold text-xs">$</span>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={manualPartUnitCost}
                          onChange={(e) => setManualPartUnitCost(e.target.value)}
                          placeholder="P. Unit."
                          className="w-full pl-6 pr-2 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-[#8CC63F]"
                          title="Costo Unitario ($ USD)"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddManualPart}
                        className="px-3.5 py-2 rounded-lg btn-park-green text-xs font-bold shadow-xs whitespace-nowrap"
                      >
                        + Añadir
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Lista de Repuestos Asignados (si los hay) */}
              {formData.usedParts.length > 0 ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase px-1">
                    <span>Repuestos Asignados ({formData.usedParts.length})</span>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, usedParts: [], manualMaterialsCost: 0 }))}
                      className="text-red-500 hover:text-red-700 text-[10px] font-bold lowercase hover:underline"
                    >
                      vaciar repuestos
                    </button>
                  </div>
                  {formData.usedParts.map((p, idx) => (
                    <div key={p.partId || idx} className="flex items-center justify-between p-2.5 rounded-lg bg-white text-xs border border-slate-200 shadow-2xs">
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold ${p.isManual ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-[#0A3963]'}`}>
                          {p.isManual ? 'Manual' : 'Almacén'}
                        </span>
                        <span className="text-slate-800 font-bold">{p.name} (x{p.qty} a ${(p.unitCost || 0).toFixed(2)})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[#0A3963] font-extrabold">${(p.totalCost || 0).toFixed(2)} USD</span>
                        <button
                          type="button"
                          onClick={() => handleRemovePart(p.partId)}
                          className="text-slate-400 hover:text-red-600 font-bold p-1"
                          title="Eliminar este repuesto"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 italic px-1">
                  Sin repuestos asignados en esta orden.
                </p>
              )}

              {/* Desglose y Edición Abierta de Costos y Tiempos */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-white border border-slate-200 text-xs items-center">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Costo Materiales ($ USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-slate-400 font-bold text-xs">$</span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={formData.manualMaterialsCost !== undefined ? formData.manualMaterialsCost : totalPartsCost}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value) || 0);
                        setFormData(prev => ({ ...prev, manualMaterialsCost: val, noCostEntries: false }));
                      }}
                      placeholder="0.00"
                      className="w-full pl-6 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:bg-white focus:border-[#8CC63F] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Mano de Obra ($ USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-slate-400 font-bold text-xs">$</span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={formData.totalLaborCost !== undefined ? formData.totalLaborCost : 0}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value) || 0);
                        setFormData(prev => ({ ...prev, totalLaborCost: val, noCostEntries: false }));
                      }}
                      placeholder="0.00"
                      className="w-full pl-6 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:bg-white focus:border-[#8CC63F] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Tiempo Invertido (Horas)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.actualHours !== undefined ? formData.actualHours : 0}
                    onChange={(e) => {
                      const val = e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value) || 0);
                      setFormData(prev => ({ ...prev, actualHours: val, noCostEntries: false }));
                    }}
                    placeholder="0.0"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:bg-white focus:border-[#8CC63F] outline-none"
                  />
                </div>

                <div className="text-right sm:border-l sm:border-slate-200 sm:pl-3">
                  <p className="text-[11px] font-bold text-slate-500 uppercase">Costo Total</p>
                  <p className={`text-base font-extrabold ${grandTotal === 0 ? 'text-slate-400' : 'text-[#0A3963]'}`}>
                    ${grandTotal.toFixed(2)} USD
                  </p>
                  {grandTotal === 0 && (
                    <span className="text-[9px] text-amber-600 font-bold block">
                      En PDF: "No se registraron entradas en tiempos ni costos"
                    </span>
                  )}
                </div>
              </div>
            </div>

            
            {/* 3. Fotografías & Evidencia Visual de la Orden */}
            <div 
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDropPhotos}
              className={`p-4 rounded-xl border-2 transition-all space-y-3 relative ${
                isDraggingPhotos
                  ? 'border-[#8CC63F] bg-[#8CC63F]/10 ring-4 ring-[#8CC63F]/20'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-xs font-bold text-[#0A3963] uppercase tracking-wider flex items-center gap-1.5">
                    <Icon name="camera" className="w-4 h-4 text-[#8CC63F]" />
                    <span>3. Fotografías & Evidencia Visual de la Orden</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Sube o arrastra fotos de antes, durante o después de la intervención para documentar la orden de trabajo.
                  </p>
                </div>

                <label className="cursor-pointer px-3.5 py-1.5 rounded-lg btn-park-green text-white text-xs font-extrabold shadow-xs hover:scale-105 transition-all flex items-center gap-1.5 shrink-0">
                  <Icon name="camera" className="w-3.5 h-3.5" />
                  <span>{isUploadingPhoto ? 'Procesando...' : '+ Subir Fotos'}</span>
                  <input
                    id="wo-photo-file-input"
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={isUploadingPhoto}
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>
              </div>

              {/* Zona de Arrastre Visual interactiva */}
              <div 
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDropPhotos}
                onClick={() => document.getElementById('wo-photo-file-input')?.click()}
                className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer ${
                  isDraggingPhotos 
                    ? 'border-[#8CC63F] bg-white ring-2 ring-[#8CC63F]/30 scale-[1.01]' 
                    : 'border-slate-300 hover:border-[#8CC63F] bg-white hover:bg-slate-50/80 shadow-2xs'
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-1.5 pointer-events-none">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                    isDraggingPhotos ? 'bg-[#8CC63F] text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <Icon name="camera" className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-slate-700">
                    {isDraggingPhotos ? '¡Suelta las fotos aquí para adjuntarlas!' : 'Arrastra y suelta fotos aquí o haz clic para seleccionarlas'}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {isUploadingPhoto ? '⏳ Procesando imágenes...' : 'Formatos JPG, PNG, WEBP • Optimización y compresión automática'}
                  </p>
                </div>
              </div>

              {formData.photos && formData.photos.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase px-1">
                    <span>Fotos Adjuntas ({formData.photos.length})</span>
                    <span className="text-[10px] text-slate-400 font-normal lowercase">haz clic en una foto para ampliar</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {formData.photos.map((photo, idx) => (
                      <div key={photo.id || idx} className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col">
                        <div
                          className="h-28 w-full bg-slate-100 overflow-hidden cursor-pointer relative"
                          onClick={() => setPreviewImage(photo.url)}
                          title="Haz clic para ver imagen en tamaño completo"
                        >
                          <SafeImage
                            src={photo.url}
                            alt={photo.name || `Foto ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            fallbackIcon="photo"
                          />
                          <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-slate-900/75 text-white backdrop-blur-xs">
                            {photo.tag || 'Evidencia'}
                          </span>
                        </div>

                        <div className="p-2 space-y-1.5 bg-white flex-1 flex flex-col justify-between">
                          <div className="flex items-center justify-between gap-1">
                            <select
                              value={photo.tag || 'Evidencia'}
                              onChange={(e) => handleUpdatePhotoTag(photo.id || idx, e.target.value)}
                              className="text-[10px] font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 outline-none focus:border-[#8CC63F]"
                            >
                              <option value="Antes">🔴 Antes</option>
                              <option value="Durante">🟡 Durante</option>
                              <option value="Después">🟢 Después</option>
                              <option value="Falla">⚠️ Falla</option>
                              <option value="Evidencia">📸 Evidencia</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(photo.id || idx)}
                              className="text-slate-400 hover:text-red-600 text-xs p-1"
                              title="Eliminar foto"
                            >
                              🗑️
                            </button>
                          </div>

                          <p className="text-[9px] text-slate-400 font-mono truncate">
                            {photo.uploadedAt || 'Hoy'} {photo.uploadedBy ? `• ${photo.uploadedBy}` : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 4. Observaciones Técnicas y Conformidad Operativa */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-xs font-bold text-[#0A3963] uppercase tracking-wider flex items-center gap-1.5">
                    <Icon name="file" className="w-4 h-4 text-[#8CC63F]" />
                    <span>4. Observaciones Técnicas y Conformidad Operativa</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Dictamen técnico, recomendaciones finales, notas de cierre o condiciones de entrega para el reporte oficial.
                  </p>
                </div>
                {formData.technicianNotes && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, technicianNotes: '' }));
                    }}
                    className="text-[11px] text-slate-400 hover:text-red-500 transition-colors font-medium flex items-center gap-1"
                    title="Vaciar observaciones técnicas"
                  >
                    <span>Limpiar observaciones</span>
                  </button>
                )}
              </div>

              <div>
                <textarea
                  rows={3}
                  value={formData.technicianNotes || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, technicianNotes: e.target.value }))}
                  placeholder="Ej: Se realizaron pruebas operativas a plena carga durante 30 minutos sin detectar fugas ni anomalías térmicas. Equipo liberado y conforme para operación continua..."
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-[#8CC63F] focus:ring-1 focus:ring-[#8CC63F]/50 transition-all font-medium leading-relaxed resize-y placeholder:text-slate-400 shadow-2xs"
                />
                <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400 px-1">
                  <span>📄 Esta nota se imprime directamente en la sección oficial del PDF generado.</span>
                  <span>{(formData.technicianNotes || '').length} caracteres</span>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => handleSubmitAndGeneratePdf(true)}
                  className="px-5 py-2 rounded-lg btn-park-blue text-xs font-extrabold shadow-sm flex items-center gap-2"
                >
                  <Icon name="pdf" className="w-4 h-4 mr-1" /> <span>Guardar y Generar PDF Oficial</span>
                </button>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleToggleComplete}
                    className={`px-4 py-2 rounded-lg text-xs font-extrabold shadow flex items-center gap-1.5 transition-transform hover:scale-105 ${
                      formData.status === 'Completada'
                        ? 'bg-amber-500 hover:bg-amber-600 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <Icon name={formData.status === 'Completada' ? 'alert' : 'check'} className="w-4 h-4 mr-1" />
                    <span>{formData.status === 'Completada' ? '↺ Reabrir Orden' : 'Marcar como Completada'}</span>
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg btn-park-green text-white text-xs font-extrabold shadow hover:scale-105 transition-transform flex items-center gap-1.5"
                  >
                    <Icon name="save" className="w-4 h-4 mr-1" />
                    <span>Guardar Orden</span>
                  </button>
                </div>
              </div>

              {/* Metadatos Discretos de Auditoría de Creación y Última Actualización */}
              <div className="w-full pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                  <span>👤 Creada por:</span>
                  <b className="text-slate-600">{formData.createdBy || workOrder?.createdBy || effectiveUser.full_name || 'Admin'}</b>
                  <span>el {formatAuditDate(formData.createdDate)}</span>
                </div>
                {formData.updatedAt && (
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span>🕒 Última actualización:</span>
                    <span className="text-slate-500 font-semibold">{formatAuditDate(formData.updatedAt)}</span>
                    {formData.lastUpdatedBy && <span>por {formData.lastUpdatedBy}</span>}
                  </div>
                )}
              </div>
            </div>
          </form>
        )}

        {/* TAB 2: BITÁCORA Y CHAT DE LA ORDEN (ESTILO MAINTAINX) */}
        {activeModalTab === 'chat' && (
          <div className="flex flex-col flex-1 overflow-hidden bg-slate-50">
            
            {/* Chat Sub-Header Info */}
            <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <h3 className="text-xs font-extrabold text-[#0A3963] uppercase tracking-wider font-heading">
                    Bitácora & Chat de la Orden #{formData.code}
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Comunicación interna entre solicitantes, técnicos y supervisores en tiempo real.
                </p>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#0A3963]/10 text-[#0A3963] border border-[#0A3963]/20">
                {commentsCount} Mensaje{commentsCount === 1 ? '' : 's'}
              </span>
            </div>

            {/* Chat Message List Container */}
            <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[440px]">
              {commentsCount === 0 ? (
                <div className="text-center py-12 space-y-3 bg-white rounded-2xl border border-slate-200 p-8">
                  <div className="w-12 h-12 rounded-full bg-[#0A3963]/10 text-[#0A3963] flex items-center justify-center mx-auto text-xl">
                    <Icon name="comments" className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">No hay comentarios en la bitácora todavía</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Sé el primero en dejar una actualización de progreso, advertencia técnica o confirmación sobre esta orden de trabajo.
                  </p>
                </div>
              ) : (
                formData.comments.map((comment) => {
                  const isMe = Boolean(
                    (effectiveUser.id && comment.userId && String(effectiveUser.id) === String(comment.userId)) ||
                    (effectiveUser.email && comment.userId && effectiveUser.email.toLowerCase() === comment.userId.toLowerCase()) ||
                    (effectiveUser.full_name && comment.userName && effectiveUser.full_name.toLowerCase() === comment.userName.toLowerCase()) ||
                    (effectiveUser.fullName && comment.userName && effectiveUser.fullName.toLowerCase() === comment.userName.toLowerCase()) ||
                    (effectiveUser.email && comment.userName && effectiveUser.email.toLowerCase() === comment.userName.toLowerCase())
                  );

                  return (
                    <div 
                      key={comment.id} 
                      className={`w-full flex items-start gap-3 transition-all ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      {/* Left Avatar for Others */}
                      {!isMe && (
                        <div className={`w-8 h-8 rounded-xl ${comment.avatarColor || 'bg-slate-700'} text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-sm`}>
                          {(comment.userName || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}

                      {/* Message Box */}
                      <div className={`max-w-[78%] rounded-2xl p-4 shadow-sm border ${
                        isMe 
                          ? 'bg-[#0A3963] text-white border-[#0A3963] rounded-tr-xs' 
                          : 'bg-white text-slate-800 border-slate-200 rounded-tl-xs'
                      }`}>
                        <div className="flex items-center justify-between gap-3 mb-1.5 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-extrabold ${isMe ? 'text-[#8CC63F]' : 'text-[#0A3963]'}`}>
                              {isMe ? `Tú (${comment.userName})` : comment.userName}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                              isMe 
                                ? 'bg-[#8CC63F]/20 text-[#8CC63F] border-[#8CC63F]/30'
                                : (comment.roleBadge || 'bg-slate-100 text-slate-700')
                            }`}>
                              {comment.userRole}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-mono ${isMe ? 'text-slate-300' : 'text-slate-400'}`}>
                              {comment.timestamp}
                            </span>
                            {(isMe || effectiveUser?.role === 'admin' || effectiveUser?.role === 'developer') && (
                              <button
                                type="button"
                                onClick={() => handleDeleteComment(comment.id)}
                                className={`text-[10px] opacity-60 hover:opacity-100 transition-opacity font-bold ${isMe ? 'text-red-300 hover:text-red-100' : 'text-slate-400 hover:text-red-600'}`}
                                title="Eliminar este comentario"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Adjunto Imagen */}
                        {(comment.image || (comment.attachment && comment.attachment.type === 'image')) && (
                          <div 
                            className="mb-2 rounded-xl overflow-hidden border border-black/10 cursor-pointer shadow-xs hover:opacity-95 transition-opacity max-w-sm"
                            onClick={() => setPreviewImage(comment.image || comment.attachment.url)}
                            title="Haz clic para ampliar la imagen"
                          >
                            <SafeImage src={comment.image || comment.attachment.url} alt="Evidencia en chat" className="w-full max-h-64 object-cover" fallbackIcon="photo" />
                          </div>
                        )}

                        {/* Adjunto Documento (PDF, Word, Excel, etc.) */}
                        {comment.attachment && comment.attachment.type === 'document' && (
                          <div className={`mb-2.5 p-3 rounded-xl border flex items-center justify-between gap-3 text-xs max-w-sm ${isMe ? 'bg-white/15 border-white/25 text-white' : 'bg-slate-100 border-slate-200 text-slate-800'}`}>
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-sm font-extrabold ${isMe ? 'bg-white/20' : 'bg-white shadow-xs border border-slate-200'}`}>
                                {comment.attachment.fileType === 'pdf' && '📄'}
                                {comment.attachment.fileType === 'excel' && '📊'}
                                {comment.attachment.fileType === 'word' && '📝'}
                                {comment.attachment.fileType === 'file' && '📎'}
                              </div>
                              <div className="min-w-0">
                                <p className={`font-bold truncate ${isMe ? 'text-white' : 'text-slate-800'}`}>{comment.attachment.name}</p>
                                <p className={`text-[10px] font-mono ${isMe ? 'text-slate-300' : 'text-slate-500'}`}>{formatFileSize(comment.attachment.size)}</p>
                              </div>
                            </div>
                            <a
                              href={comment.attachment.url}
                              download={comment.attachment.name}
                              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] shadow-xs shrink-0 transition-all flex items-center gap-1 ${isMe ? 'bg-white text-[#0A3963] hover:bg-slate-100' : 'btn-park-green text-white hover:scale-105'}`}
                              title="Descargar archivo adjunto"
                            >
                              <Icon name="download" className="w-3.5 h-3.5" />
                              <span>Bajar</span>
                            </a>
                          </div>
                        )}

                        {comment.text && (
                          <p className={`text-xs whitespace-pre-wrap leading-relaxed font-medium ${isMe ? 'text-slate-100' : 'text-slate-700'}`}>
                            {comment.text}
                          </p>
                        )}
                      </div>

                      {/* Right Avatar for Me */}
                      {isMe && (
                        <div className="w-8 h-8 rounded-xl bg-[#8CC63F] text-[#0B192C] font-extrabold text-xs flex items-center justify-center shrink-0 shadow-sm">
                          {(currentUserName || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input Bar */}
            <div className="p-4 bg-white border-t border-slate-200 shrink-0 space-y-2">
              {/* Indicador en vivo de "Escribiendo..." */}
              {typingUser && (
                <div className="px-4 py-1.5 bg-blue-50/90 border-t border-blue-200 flex items-center gap-2 text-xs text-[#0A3963] font-semibold animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                  <span>💬 <strong>{typingUser.name || 'Un técnico'}</strong> está escribiendo...</span>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>
                  Escribiendo como: <b className="text-[#0A3963]">{currentUserName}</b> ({currentUserRoleDisplay})
                </span>
                <span className="text-[10px] text-slate-400">Presiona <b>Enter</b> para enviar</span>
              </div>

              {chatAttachment && (
                <div className="flex items-center gap-3 p-2.5 bg-slate-100 rounded-xl border border-slate-200">
                  {chatAttachment.type === 'image' ? (
                    <SafeImage src={chatAttachment.url} alt="Foto a enviar" className="w-12 h-12 rounded-lg object-cover border border-slate-300 shrink-0 shadow-xs" fallbackIcon="photo" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-[#0A3963]/10 border border-[#0A3963]/20 flex items-center justify-center shrink-0 text-xl font-bold text-[#0A3963]">
                      {chatAttachment.fileType === 'pdf' && '📄'}
                      {chatAttachment.fileType === 'excel' && '📊'}
                      {chatAttachment.fileType === 'word' && '📝'}
                      {chatAttachment.fileType === 'file' && '📎'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{chatAttachment.name || 'Archivo adjunto'}</p>
                    <p className="text-[10px] text-emerald-600 font-semibold">
                      {chatAttachment.type === 'image' ? 'Fotografía' : 'Documento'} ({formatFileSize(chatAttachment.size)}) listo para enviar
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setChatAttachment(null)}
                    className="text-slate-400 hover:text-red-500 font-bold p-1 text-xs"
                    title="Quitar archivo adjunto"
                  >
                    ✕ Cancelar
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <label 
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-[#0A3963] cursor-pointer transition-colors shrink-0 flex items-center justify-center border border-slate-200"
                  title="Adjuntar archivo (PDF, Word, Excel, fotos)"
                >
                  <Icon name="paperclip" className="w-5 h-5 text-slate-600" />
                  <input
                    type="file"
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
                    className="hidden"
                    onChange={handleChatFileSelect}
                  />
                </label>

                <textarea
                  rows={2}
                  value={newCommentText}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewCommentText(val);
                    if (formData.id) {
                      emitTyping(formData.id, {
                        id: effectiveUser.id,
                        name: effectiveUser.full_name || effectiveUser.fullName || effectiveUser.name || 'Usuario',
                        role: effectiveUser.role || 'tecnico'
                      }, true);
                      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                      typingTimeoutRef.current = setTimeout(() => {
                        emitTyping(formData.id, {
                          id: effectiveUser.id,
                          name: effectiveUser.full_name || effectiveUser.fullName || effectiveUser.name || 'Usuario',
                          role: effectiveUser.role || 'tecnico'
                        }, false);
                      }, 1500);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendComment();
                    }
                  }}
                  placeholder="Escribe una nota técnica, avance o reporte de la orden..."
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#8CC63F] focus:bg-white resize-none font-medium transition-all"
                />

                <button
                  type="button"
                  onClick={handleSendComment}
                  disabled={!newCommentText.trim() && !chatAttachment}
                  className="px-5 py-2 rounded-xl btn-park-green text-white text-xs font-extrabold shadow-md hover:scale-[1.02] transition-transform disabled:opacity-40 disabled:hover:scale-100 flex items-center justify-center gap-1.5 shrink-0 h-10"
                >
                  <Icon name="comments" className="w-4 h-4 mr-1" />
                  <span>Enviar</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Visor de Imagen en Alta Definición (Lightbox) */}
        {previewImage && (
          <div 
            className="fixed inset-0 z-60 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setPreviewImage(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
              <button 
                type="button" 
                onClick={() => setPreviewImage(null)}
                className="absolute -top-10 right-0 text-white bg-slate-800/80 hover:bg-red-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm transition-colors shadow-lg"
                title="Cerrar visor"
              >
                ✕
              </button>
              <img 
                src={previewImage} 
                alt="Evidencia fotográfica ampliada" 
                className="max-h-[85vh] max-w-full object-contain rounded-xl shadow-2xl border border-white/20"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Assets;
