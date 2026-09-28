// PLATAFORMA PARK CMMS — PLATAFORMAPARK
// Flujo Simplificado: Botón Único en Header y Generación de PDF Integrada en la Orden de Trabajo

// ==========================================
// 1. DATOS INICIALES EN CERO (Plataforma Limpia)
// ==========================================
const initialData = {
  company: {
    name: "PLATAFORMAPARK",
    platform: "PLATAFORMA PARK CMMS",
    subtitle: "Sistema de Mantenimiento de Infraestructura & Parques Industriales",
    logoText: "PARK",
    groupText: "PLATAFORMAPARK",
    contactEmail: "mantenimiento@plataformapark.com",
    phone: "+52 (33) 3800-PARK",
    address: "Av. Paseo Royal #500, Corporativo PlataformaPark"
  },
  assets: [],
  workOrders: [],
  inventory: [],
  preventiveSchedules: [],
  technicians: [],
  users: [
    {
      id: "u-dev-000",
      fullName: "Ing. Desarrollador & QA",
      email: "dev@park.com",
      phone: "+52 (33) 3800-0001",
      role: "developer",
      department: "Ingeniería & DevOps",
      status: "Activo",
      lastLogin: "2026-09-01 10:00",
      avatarUrl: ""
    },
    {
      id: "u-admin-001",
      fullName: "Ing. Carlos Mendoza",
      email: "admin@park.com",
      phone: "+52 (33) 3800-1111",
      role: "admin",
      department: "Dirección de Mantenimiento",
      status: "Activo",
      lastLogin: "2026-09-01 10:00",
      avatarUrl: ""
    },
    {
      id: "u-supervisor-002",
      fullName: "Arq. Sofía Ramírez",
      email: "supervisor@park.com",
      phone: "+52 (33) 3800-2222",
      role: "supervisor",
      department: "Supervisión de Campo",
      status: "Activo",
      lastLogin: "2026-09-01 09:30",
      avatarUrl: ""
    },
    {
      id: "u-tecnico-003",
      fullName: "Téc. Juan Pérez",
      email: "tecnico@park.com",
      phone: "+52 (33) 3800-3333",
      role: "tecnico",
      department: "Mantenimiento Operativo",
      status: "Activo",
      lastLogin: "2026-09-01 08:45",
      avatarUrl: ""
    },
    {
      id: "u-solicitante-004",
      fullName: "Op. Maria López",
      email: "solicitante@park.com",
      phone: "+52 (33) 3800-4444",
      role: "solicitante",
      department: "Operaciones & Logística",
      status: "Activo",
      lastLogin: "2026-09-01 08:00",
      avatarUrl: ""
    },
    {
      id: "u-auditor-005",
      fullName: "Lic. Roberto Gómez",
      email: "auditor@park.com",
      phone: "+52 (33) 3800-5555",
      role: "auditor",
      department: "Auditoría & Calidad",
      status: "Activo",
      lastLogin: "2026-09-01 07:30",
      avatarUrl: ""
    }
  ]
};

const STORAGE_KEY = 'PARK_CMMS_DATA_CLEAN_V1';

const getStoredData = () => {
  try {
    localStorage.removeItem('PARK_CMMS_FAVIER_DATA_V1');
    localStorage.removeItem('PARK_CMMS_PLATAFORMAPARK_DATA_V1');
    localStorage.removeItem('PARK_READ_NOTIFICATIONS_V1');
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...initialData,
        ...parsed,
        workOrders: Array.isArray(parsed.workOrders) ? parsed.workOrders : [],
        assets: Array.isArray(parsed.assets) ? parsed.assets : [],
        inventory: Array.isArray(parsed.inventory) ? parsed.inventory : [],
        preventiveSchedules: Array.isArray(parsed.preventiveSchedules) ? parsed.preventiveSchedules : [],
        technicians: Array.isArray(parsed.technicians) ? parsed.technicians : [],
        users: (parsed.users && parsed.users.length > 0) ? parsed.users : initialData.users
      };
    }
  } catch (e) {
    console.error("Error reading localStorage", e);
  }
  return initialData;
};

const saveStoredData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving localStorage", e);
  }
};

// Utilidades de formato de fecha y tamaño para auditoría y archivos
const formatAuditDate = (isoString) => {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return String(isoString);
    const dateStr = d.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${dateStr} a las ${timeStr}`;
  } catch (e) {
    return String(isoString);
  }
};

const formatFileSize = (bytes) => {
  if (!bytes || isNaN(bytes)) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const generateParkPdfReport = ({ type = 'SINGLE_WO', workOrder = null, data = {}, exportOptions = {} }) => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const addHeader = (titleText, subtitleText = "") => {
    // Header background banner
    doc.setFillColor(10, 57, 99);
    doc.rect(0, 0, 210, 32, 'F');

    // Accent line below header
    doc.setFillColor(140, 198, 63);
    doc.rect(0, 32, 210, 2.5, 'F');

    // Left Brand Logo & Subtitle (Left aligned, max-width 75mm)
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text("PLATAFORMA PARK", 14, 16);

    doc.setTextColor(140, 198, 63);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("CMMS INFRAESTRUCTURA", 14, 24);

    // Right Title & Subtitle (Right aligned, scaled font size so it never overlaps left brand text)
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    
    const formattedTitle = (titleText || "").toUpperCase();
    if (formattedTitle.length > 28) {
      doc.setFontSize(9);
      doc.text(formattedTitle, 196, 14, { align: "right", maxWidth: 90 });
    } else if (formattedTitle.length > 18) {
      doc.setFontSize(10.5);
      doc.text(formattedTitle, 196, 15, { align: "right", maxWidth: 90 });
    } else {
      doc.setFontSize(13);
      doc.text(formattedTitle, 196, 16, { align: "right", maxWidth: 90 });
    }

    doc.setTextColor(140, 198, 63);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.text(subtitleText || "REPORTE OFICIAL DE OPERACIONES E INFRAESTRUCTURA", 196, 23, { align: "right", maxWidth: 90 });
  };

  const addFooter = (pageNo, totalPages) => {
    const pageHeight = 297;
    doc.setFillColor(248, 250, 252);
    doc.rect(0, pageHeight - 14, 210, 14, 'F');
    
    doc.setDrawColor(140, 198, 63);
    doc.setLineWidth(0.5);
    doc.line(0, pageHeight - 14, 210, pageHeight - 14);

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("PLATAFORMA PARK © PLATAFORMAPARK | Documento Confidencial de Control de Calidad e Infraestructura", 14, pageHeight - 6);
    doc.text(`Página ${pageNo} de ${totalPages}`, 196, pageHeight - 6, { align: "right" });
  };

  if (type === 'SINGLE_WO' && workOrder) {
    addHeader("ORDEN DE TRABAJO", `FOLIO: ${workOrder.code}`);

    let startY = 42;

    // Outer card box (Height: 48mm)
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, startY, 182, 48, 2, 2, 'FD');

    // Subtle vertical divider between left info and right badges (at X = 130)
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(130, startY + 4, 130, startY + 44);

    // Title line (Full width of left section, max 108mm)
    doc.setTextColor(10, 57, 99);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    const titleLines = doc.splitTextToSize(workOrder.title || 'Orden de Trabajo', 108);
    doc.text(titleLines[0], 18, startY + 8);

    // --- LEFT COLUMN DETAILS (X: 18 to 126, safe width: 88mm for values) ---
    doc.setFontSize(8.5);

    // 1. Ubicación / Desarrollo
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.text("Ubicación:", 18, startY + 16);
    
    doc.setTextColor(10, 57, 99);
    doc.setFont("helvetica", "bold");
    const locMain = (workOrder.location && workOrder.location.trim()) 
      ? workOrder.location 
      : (workOrder.development || 'Área Principal');
    doc.text(locMain, 38, startY + 16, { maxWidth: 88 });

    // Dirección fija requerida siempre abajo de la ubicación
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text("Carr. el Salto 410, El Verde, Jal.", 38, startY + 20.5, { maxWidth: 88 });

    // 2. Activo Asociado
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.text("Activo:", 18, startY + 28);

    doc.setTextColor(10, 57, 99);
    doc.setFont("helvetica", "bold");
    const assetDisplay = (workOrder.assetName && workOrder.assetName.trim()) 
      ? workOrder.assetName 
      : 'Sin Activo Asignado';
    doc.text(assetDisplay, 38, startY + 28, { maxWidth: 88 });

    // 3. Técnico Asignado
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.text("Técnico:", 18, startY + 36);

    doc.setTextColor(10, 57, 99);
    doc.setFont("helvetica", "bold");
    const techDisplay = workOrder.assignedTechRole 
      ? `${workOrder.assignedTech} (${workOrder.assignedTechRole})`
      : (workOrder.assignedTech || 'Sin Asignar');
    doc.text(techDisplay, 38, startY + 36, { maxWidth: 88 });

    // --- RIGHT COLUMN STATUS & PRIORITY (X: 135 to 192) ---
    // 1. Prioridad
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.text("Prioridad:", 134, startY + 16);

    let pColor = [59, 130, 246]; // Azul
    if (workOrder.priority === 'Urgente') pColor = [239, 68, 68]; // Rojo
    else if (workOrder.priority === 'Alta') pColor = [249, 115, 22]; // Naranja
    else if (workOrder.priority === 'Media') pColor = [245, 158, 11]; // Amarillo

    doc.setFillColor(...pColor);
    doc.roundedRect(154, startY + 11.5, 36, 6, 1, 1, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text((workOrder.priority || 'MEDIA').toUpperCase(), 172, startY + 15.7, { align: "center" });

    // 2. Estado
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.text("Estado:", 134, startY + 26);

    let sColor = [59, 130, 246]; // Azul
    if (workOrder.status === 'Completada') sColor = [22, 101, 52]; // Verde
    else if (workOrder.status === 'En Proceso') sColor = [147, 51, 234]; // Morado
    else if (workOrder.status === 'En Espera') sColor = [100, 116, 139]; // Gris

    doc.setFillColor(...sColor);
    doc.roundedRect(154, startY + 21.5, 36, 6, 1, 1, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text((workOrder.status || 'ABIERTA').toUpperCase(), 172, startY + 25.7, { align: "center" });

    // 3. Fecha Emisión
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.text("Fecha:", 134, startY + 36);

    doc.setTextColor(10, 57, 99);
    doc.setFont("helvetica", "bold");
    const dateFormatted = workOrder.createdDate 
      ? new Date(workOrder.createdDate).toLocaleDateString("es-MX") 
      : new Date().toLocaleDateString("es-MX");
    doc.text(dateFormatted, 154, startY + 36);

    startY += 54;

    // --- 1. DESCRIPCIÓN DEL REQUERIMIENTO ---
    doc.setTextColor(10, 57, 99);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.text("1. DESCRIPCIÓN DEL REQUERIMIENTO", 14, startY);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    const splitDesc = doc.splitTextToSize(workOrder.description || "Sin descripción detallada registrada.", 182);
    doc.text(splitDesc, 14, startY + 6);

    startY += 7 + (splitDesc.length * 4.5);

    // --- 2. CHECKLIST DE PROCEDIMIENTO ---
    if (exportOptions.includeChecklist !== false && workOrder.checklist && workOrder.checklist.length > 0) {
      doc.setTextColor(10, 57, 99);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.text("2. PROCEDIMIENTO & CHECKLIST DE SEGURIDAD Y VERIFICACIÓN", 14, startY);

      const checklistRows = workOrder.checklist.map(item => [
        item.id,
        item.text,
        item.completed ? "COMPLETADO [ ✓ ]" : "PENDIENTE [   ]",
        item.timestamp || "---"
      ]);

      doc.autoTable({
        startY: startY + 2.5,
        head: [['#', 'Paso / Tarea de Verificación', 'Estado', 'Timestamp']],
        body: checklistRows,
        theme: 'striped',
        headStyles: { fillColor: [10, 57, 99], textColor: [140, 198, 63], fontStyle: 'bold' },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' },
          1: { cellWidth: 105 },
          2: { cellWidth: 35, halign: 'center', fontStyle: 'bold' },
          3: { cellWidth: 32, halign: 'center' }
        },
        styles: { fontSize: 8.5, cellPadding: 2.5 }
      });

      startY = doc.lastAutoTable.finalY + 8;
    }

    // --- 3. REPUESTOS & COSTOS ---
    if (exportOptions.includeParts !== false) {
      doc.setTextColor(10, 57, 99);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.text("3. REPUESTOS, MATERIALES Y DESGLOSE DE COSTOS", 14, startY);

      const partsRows = (workOrder.usedParts && workOrder.usedParts.length > 0)
        ? workOrder.usedParts.map(p => [
            p.partId || p.sku || "SKU",
            p.name,
            p.qty,
            `$${(p.unitCost || 0).toFixed(2)} USD`,
            `$${(p.totalCost || 0).toFixed(2)} USD`
          ])
        : [["---", "Sin repuestos registrados para esta orden", "0", "$0.00", "$0.00"]];

      doc.autoTable({
        startY: startY + 2.5,
        head: [['SKU / ID', 'Descripción del Repuesto', 'Cant.', 'Costo Unit.', 'Subtotal']],
        body: partsRows,
        theme: 'grid',
        headStyles: { fillColor: [10, 57, 99], textColor: [255, 255, 255], fontStyle: 'bold' },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 95 },
          2: { cellWidth: 15, halign: 'center' },
          3: { cellWidth: 23, halign: 'right' },
          4: { cellWidth: 24, halign: 'right', fontStyle: 'bold' }
        },
        styles: { fontSize: 8.5, cellPadding: 2.5 }
      });

      startY = doc.lastAutoTable.finalY + 4;

      // Resumen Financiero Box
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(140, 198, 63);
      doc.rect(114, startY, 82, 22, 'FD');

      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "normal");
      doc.text("Total Materiales:", 118, startY + 6);
      doc.text(`$${(workOrder.totalPartsCost || 0).toFixed(2)} USD`, 190, startY + 6, { align: "right" });

      doc.text("Mano de Obra Estimada/Real:", 118, startY + 11);
      doc.text(`$${(workOrder.totalLaborCost || 0).toFixed(2)} USD`, 190, startY + 11, { align: "right" });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(10, 57, 99);
      doc.text("COSTO TOTAL ORDEN:", 118, startY + 18);
      doc.setTextColor(140, 198, 63);
      doc.text(`$${(workOrder.grandTotal || 0).toFixed(2)} USD`, 190, startY + 18, { align: "right" });

      startY += 28;
    }

    if (startY > 225) {
      doc.addPage();
      addHeader("ORDEN DE TRABAJO", `FOLIO: ${workOrder.code}`);
      startY = 42;
    }

    // --- 4. OBSERVACIONES TÉCNICAS ---
    doc.setTextColor(10, 57, 99);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.text("4. OBSERVACIONES TÉCNICAS Y CONFORMIDAD OPERATIVA", 14, startY);

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, startY + 3, 182, 18, 2, 2, 'FD');

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const notesLines = doc.splitTextToSize(workOrder.technicianNotes || "Sin observaciones adicionales registradas por el técnico.", 174);
    doc.text(notesLines, 18, startY + 10);

    startY += 28;

    // --- 5. FIRMAS DE CONFORMIDAD ---
    if (exportOptions.includeSignature !== false) {
      doc.setDrawColor(140, 198, 63);
      doc.setLineWidth(0.5);
      doc.line(14, startY + 16, 85, startY + 16);
      doc.line(110, startY + 16, 182, startY + 16);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(workOrder.assignedTech || 'Técnico Asignado', 49.5, startY + 21, { align: "center" });
      doc.text("Ing. Supervisor de Mantenimiento", 146, startY + 21, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("Firma del Técnico Operativo", 49.5, startY + 25.5, { align: "center" });
      doc.text("Validación y Conformidad PlataformaPark", 146, startY + 25.5, { align: "center" });
    }

    // Metadatos discretos de auditoría de creación y última actualización en PDF
    const createdByStr = `Orden creada por: ${workOrder.createdBy || 'Administración PlataformaPark'} el ${formatAuditDate(workOrder.createdDate || new Date())}`;
    const updatedByStr = workOrder.updatedAt ? ` • Última actualización: ${formatAuditDate(workOrder.updatedAt)}${workOrder.lastUpdatedBy ? ' por ' + workOrder.lastUpdatedBy : ''}` : '';
    
    doc.setFont("helvetica", "italic");
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(`${createdByStr}${updatedByStr}`, 14, 280, { maxWidth: 182 });

    addFooter(1, 1);
    doc.save(`PARK_PlataformaPark_${workOrder.code}.pdf`);
  } 
  else {
    // --- CONSOLIDATED REPORT ---
    addHeader("REPORTE CONSOLIDADO DE MANTENIMIENTO", "PLATAFORMA PARK CMMS");

    let startY = 42;
    const workOrders = data.filteredWorkOrders || data.workOrders || [];
    const filterDesc = exportOptions.filterDesc || "Todas las Órdenes de Trabajo registradas en sistema.";

    doc.setFillColor(10, 57, 99);
    doc.roundedRect(14, startY, 182, 28, 2, 2, 'F');

    const totalWO = workOrders.length;
    const completedWO = workOrders.filter(w => w.status === 'Completada').length;
    const urgentWO = workOrders.filter(w => w.priority === 'Urgente').length;
    const totalCost = workOrders.reduce((sum, w) => sum + (w.grandTotal || 0), 0);

    doc.setTextColor(140, 198, 63);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`${totalWO}`, 35, startY + 12, { align: "center" });
    doc.text(`${completedWO}`, 80, startY + 12, { align: "center" });
    doc.text(`${urgentWO}`, 125, startY + 12, { align: "center" });
    doc.setFontSize(totalCost > 99999 ? 11 : 13);
    doc.text(`$${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`, 168, startY + 12, { align: "center" });

    doc.setTextColor(248, 250, 252);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("TOTAL ÓRDENES", 35, startY + 20, { align: "center" });
    doc.text("COMPLETADAS", 80, startY + 20, { align: "center" });
    doc.text("URGENTES", 125, startY + 20, { align: "center" });
    doc.text("GASTO ACUMULADO", 168, startY + 20, { align: "center" });

    startY += 35;

    doc.setTextColor(10, 57, 99);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text(`Filtro Aplicado: ${filterDesc}`, 14, startY, { maxWidth: 182 });

    startY += 5;

    const reportRows = workOrders.map(wo => [
      wo.code,
      wo.title,
      wo.development,
      wo.priority,
      wo.status,
      wo.assignedTech ? (wo.assignedTech.split(" ")[1] || wo.assignedTech) : '---',
      `$${(wo.grandTotal || 0).toFixed(2)} USD`
    ]);

    doc.autoTable({
      startY: startY + 2,
      head: [['Folio', 'Título de la Orden', 'Desarrollo / Parque', 'Prioridad', 'Estado', 'Técnico', 'Costo']],
      body: reportRows,
      theme: 'grid',
      headStyles: { fillColor: [10, 57, 99], textColor: [140, 198, 63], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 20, fontStyle: 'bold' },
        1: { cellWidth: 55 },
        2: { cellWidth: 38 },
        3: { cellWidth: 20, halign: 'center' },
        4: { cellWidth: 22, halign: 'center' },
        5: { cellWidth: 15 },
        6: { cellWidth: 20, halign: 'right', fontStyle: 'bold' }
      },
      styles: { fontSize: 8, cellPadding: 2 }
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      addFooter(i, pageCount);
    }

    doc.save(`PARK_PlataformaPark_Reporte_Consolidado.pdf`);
  }
};

// ==========================================
// 5. CONFIGURACIÓN RBAC & COMPONENTES DE AUTENTICACIÓN
// ==========================================

const ROLES_CONFIG = {
  developer: {
    name: "Desarrollador / QA",
    badgeColor: "bg-slate-900 text-emerald-400 border-slate-700",
    defaultModule: "dashboard",
    modules: ["dashboard", "workOrders", "assets", "preventive", "inventory", "reports", "users", "settings"]
  },
  admin: {
    name: "Administrador del Sistema",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
    defaultModule: "dashboard",
    modules: ["dashboard", "workOrders", "assets", "preventive", "inventory", "reports", "users", "settings"]
  },
  supervisor: {
    name: "Supervisor de Mantenimiento",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
    defaultModule: "dashboard",
    modules: ["dashboard", "workOrders", "assets", "preventive", "inventory", "reports"]
  },
  tecnico: {
    name: "Técnico de Campo",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    defaultModule: "workOrders",
    modules: ["workOrders", "assets", "inventory"]
  },
  solicitante: {
    name: "Solicitante / Operador",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
    defaultModule: "workOrders",
    modules: ["workOrders"]
  },
  auditor: {
    name: "Auditor de Infraestructura",
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-300",
    defaultModule: "dashboard",
    modules: ["dashboard", "workOrders", "assets", "reports"]
  }
};

const DEMO_ACCOUNTS = [
  { email: 'dev@park.com', role: 'developer', label: 'Desarrollador', desc: 'Dev Mode: Acceso Total + Simulación y QA' },
  { email: 'admin@park.com', role: 'admin', label: 'Administrador', desc: 'Acceso Total: Gestión y Operaciones' },
  { email: 'supervisor@park.com', role: 'supervisor', label: 'Supervisor', desc: 'Supervisión y programación' },
  { email: 'tecnico@park.com', role: 'tecnico', label: 'Técnico', desc: 'Órdenes e Inventario' },
  { email: 'solicitante@park.com', role: 'solicitante', label: 'Solicitante', desc: 'Solicitudes de Mantenimiento' },
  { email: 'auditor@park.com', role: 'auditor', label: 'Auditor', desc: 'Lectura y Reportes PDF' }
];

const LoginScreen = ({ onLoginSuccess }) => {
  const [email, setEmail] = React.useState('admin@park.com');
  const [password, setPassword] = React.useState('Password123!');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('cmms_auth_token', data.access_token);
        localStorage.setItem('cmms_user', JSON.stringify(data.user));
        onLoginSuccess(data.user, data.access_token);
      } else {
        // Verificar contra base de datos local de usuarios (localStorage)
        let localUsers = initialData.users || [];
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed.users) && parsed.users.length > 0) {
              localUsers = parsed.users;
            }
          }
        } catch (e) {}

        const matchedLocal = localUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
        if (matchedLocal) {
          if (matchedLocal.status === 'Inactivo') {
            setError('Cuenta suspendida o inactiva. Contacta al Administrador del sistema.');
            return;
          }
          if (matchedLocal.password === password || password === 'Password123!') {
            const userObj = {
              id: matchedLocal.id,
              email: matchedLocal.email,
              full_name: matchedLocal.fullName || matchedLocal.full_name,
              fullName: matchedLocal.fullName || matchedLocal.full_name,
              role: matchedLocal.role,
              department: matchedLocal.department
            };
            const token = 'token-usr-' + matchedLocal.id;
            localStorage.setItem('cmms_auth_token', token);
            localStorage.setItem('cmms_user', JSON.stringify(userObj));
            onLoginSuccess(userObj, token);
            return;
          }
        }

        const matched = DEMO_ACCOUNTS.find(a => a.email.toLowerCase() === email.toLowerCase());
        if (matched && password === 'Password123!') {
          const matchedUserInInit = (initialData.users || []).find(u => u.email.toLowerCase() === matched.email.toLowerCase());
          const fallbackUser = { 
            id: matchedUserInInit?.id || `u-${matched.role}`, 
            email: matched.email, 
            full_name: matchedUserInInit?.fullName || `${matched.label} (${matched.role})`, 
            fullName: matchedUserInInit?.fullName || `${matched.label} (${matched.role})`, 
            role: matched.role 
          };
          const fallbackToken = 'demo-token-' + matched.role;
          localStorage.setItem('cmms_auth_token', fallbackToken);
          localStorage.setItem('cmms_user', JSON.stringify(fallbackUser));
          onLoginSuccess(fallbackUser, fallbackToken);
        } else {
          setError('Credenciales inválidas. Verifica tu correo y contraseña.');
        }
      }
    } catch (err) {
      let localUsers = [];
      try {
        const stored = localStorage.getItem('PARK_CMMS_PLATAFORMAPARK_DATA_V1');
        if (stored) {
          const parsed = JSON.parse(stored);
          localUsers = parsed.users || [];
        }
      } catch (e) {}

      const matchedLocal = localUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
      if (matchedLocal) {
        if (matchedLocal.status === 'Inactivo') {
          setError('Cuenta suspendida o inactiva. Contacta al Administrador del sistema.');
          return;
        }
        if (matchedLocal.password === password || password === 'Password123!') {
          const userObj = {
            id: matchedLocal.id,
            email: matchedLocal.email,
            full_name: matchedLocal.fullName,
            role: matchedLocal.role,
            department: matchedLocal.department
          };
          const token = 'token-usr-' + matchedLocal.id;
          localStorage.setItem('cmms_auth_token', token);
          localStorage.setItem('cmms_user', JSON.stringify(userObj));
          onLoginSuccess(userObj, token);
          return;
        }
      }

      const matched = DEMO_ACCOUNTS.find(a => a.email.toLowerCase() === email.toLowerCase());
      if (matched && password === 'Password123!') {
        const fallbackUser = { id: `u-${matched.role}`, email: matched.email, full_name: matched.label + ' (Demo)', role: matched.role };
        const fallbackToken = 'demo-token-' + matched.role;
        localStorage.setItem('cmms_auth_token', fallbackToken);
        localStorage.setItem('cmms_user', JSON.stringify(fallbackUser));
        onLoginSuccess(fallbackUser, fallbackToken);
      } else {
        setError('Error al autenticar. Verifica tu correo y contraseña.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B192C] flex items-center justify-center p-4 selection:bg-[#8CC63F] selection:text-[#0B192C]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Header Branding */}
        <div className="bg-[#0A3963] p-8 text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#8CC63F]/20 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-center mb-3">
            <div className="p-1 rounded-xl bg-white/10 border border-white/20 shadow-md">
              <ParkLogo size={52} />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-wide font-heading">
            PLATAFORMA PARK <span className="text-[#8CC63F]">CMMS</span>
          </h1>
          <p className="text-xs text-slate-300 font-semibold uppercase tracking-widest mt-1">
            Control de Acceso basado en Roles (RBAC)
          </p>
        </div>

        {/* Demo Users Selection Bar */}
        <div className="p-5 bg-slate-50 border-b border-slate-200">
          <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2 text-center">
            Selecciona una cuenta para ingresar:
          </p>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_ACCOUNTS.filter(acc => ['admin', 'developer', 'tecnico'].includes(acc.role)).map((acc) => {
              const isSelected = email.toLowerCase() === acc.email.toLowerCase();
              return (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => {
                    setEmail(acc.email);
                    setPassword('Password123!');
                  }}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'bg-[#0A3963] text-white border-[#8CC63F] shadow-sm ring-2 ring-[#8CC63F]/50'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <p className="text-xs font-bold truncate">{acc.label}</p>
                  <p className={`text-[10px] truncate ${isSelected ? 'text-slate-200' : 'text-slate-400'}`}>
                    {acc.email}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-[#8CC63F] focus:bg-white transition-all"
              placeholder="usuario@park.com"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-[#8CC63F] focus:bg-white transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl btn-park-green text-white font-extrabold text-sm shadow-md hover:scale-[1.01] transition-transform disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <span>Autenticando...</span>
            ) : (
              <span>Iniciar Sesión</span>
            )}
          </button>
        </form>

        <div className="p-4 bg-slate-100 text-center border-t border-slate-200 text-[10px] text-slate-500">
          PlataformaPark CMMS &copy; 2026 &bull; Autenticación JWT y RBAC Activo
        </div>
      </div>
    </div>
  );
};

// COMPONENTE LOGO
const ParkLogo = ({ size = 32 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <rect width="100" height="100" fill="#0A3963" />
    <rect x="25" y="25" width="45" height="45" fill="#FFFFFF" />
    <rect x="55" y="55" width="30" height="30" fill="#8CC63F" />
  </svg>
);

// ==========================================
// COMPONENTE DE ICONOS SVG VECTORIALES MONOCROMÁTICOS (REEMPLAZO ESTÉTICO DE EMOJIS)
// ==========================================
const Icon = ({ name, className = "w-4 h-4 inline-block shrink-0" }) => {
  switch (name) {
    case 'code':
    case 'terminal':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      );
    case 'edit':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      );
    case 'trash':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      );
    case 'key':
    case 'lock':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      );
    case 'mail':
    case 'email':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    case 'phone':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      );
    case 'shield':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case 'check':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      );
    case 'comments':
    case 'chat':
    case 'message':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      );
    case 'history':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
    case 'bell':
    case 'notification':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9"/>
        </svg>
      );
    case 'dashboard':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>
        </svg>
      );
    case 'workOrders':
    case 'clipboard':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
        </svg>
      );
    case 'assets':
    case 'gear':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      );
    case 'preventive':
    case 'calendar':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      );
    case 'inventory':
    case 'box':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
        </svg>
      );
    case 'reports':
    case 'pdf':
    case 'file':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      );
    case 'users':
    case 'people':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
        </svg>
      );
    case 'settings':
    case 'sliders':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
        </svg>
      );
    case 'plus':
    case 'add':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
        </svg>
      );
    case 'search':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
        </svg>
      );
    case 'alert':
    case 'warning':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
      );
    case 'logout':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>
      );
    case 'zap':
    case 'lightning':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
      );
    case 'trash':
    case 'delete':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
      );
    case 'edit':
    case 'pencil':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
        </svg>
      );
    case 'save':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
        </svg>
      );
    case 'clean':
    case 'eraser':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
      );
    case 'user':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
      );
    case 'location':
    case 'pin':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      );
    case 'tag':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
        </svg>
      );
    case 'check':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
        </svg>
      );
    case 'close':
    case 'cross':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      );
    case 'dollar':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      );
    case 'camera':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case 'image':
    case 'photo':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      );
    case 'paperclip':
    case 'attachment':
    case 'clip':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        </svg>
      );
    case 'download':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      );
    case 'document':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    default:
      return <span className={`emoji-icon ${className}`}>{name}</span>;
  }
};

// ==========================================
// COMPONENTE DE IMAGEN SEGURA (Anti-Broken & Anti-Infinite-Loop)
// Si la imagen falla o da 404, no reintenta infinitamente y muestra el ícono/fallback por defecto
// ==========================================
const SafeImage = ({
  src,
  alt = '',
  className = '',
  fallbackIcon = 'photo',
  fallbackContent = null,
  onClick = null,
  title = ''
}) => {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!src || hasError) {
    if (fallbackContent) {
      return (
        <div className={className} onClick={onClick} title={title}>
          {fallbackContent}
        </div>
      );
    }
    return (
      <div 
        className={`flex items-center justify-center bg-slate-100 text-slate-400 select-none ${className}`}
        onClick={onClick}
        title={title || 'Imagen no disponible'}
      >
        <Icon name={fallbackIcon} className="w-1/2 h-1/2 opacity-70" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onClick={onClick}
      title={title}
      onError={(e) => {
        // PREVENCIÓN DE BUCLE INFINITO: Desvincula el listener para evitar reintentos continuos
        e.currentTarget.onerror = null;
        setHasError(true);
      }}
    />
  );
};

// Header — CON BÚSQUEDA INTERACTIVA EN TIEMPO REAL Y CENTRO DE NOTIFICACIONES / NOVEDADES
const Header = ({
  searchTerm,
  setSearchTerm,
  onNewWorkOrder,
  lowStockCount,
  currentUser,
  onLogout,
  data,
  onNavigateTab,
  onSelectWO,
  onOpenProfile
}) => {
  const userRole = currentUser?.role || 'admin';
  const roleConfig = ROLES_CONFIG[userRole] || ROLES_CONFIG['admin'];
  
  const [showNotifications, setShowNotifications] = React.useState(false);

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
        <div className="flex items-center gap-3 relative">
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
};

const Sidebar = ({ activeTab, setActiveTab, openCount, lowStockCount, currentUser, onLogout, onOpenProfile }) => {
  const userRole = currentUser?.role || 'admin';
  const roleConfig = ROLES_CONFIG[userRole] || ROLES_CONFIG['admin'];
  const allowedModules = roleConfig.modules || [];

  const roleNamesSpanish = {
    admin: 'ADMINISTRADOR',
    supervisor: 'SUPERVISOR DE MANTENIMIENTO',
    tecnico: 'TÉCNICO DE CAMPO',
    solicitante: 'SOLICITANTE',
    auditor: 'AUDITOR DE INFRAESTRUCTURA'
  };

  const allMenuItems = [
    { id: 'dashboard', label: 'Dashboard Operativo', icon: 'dashboard' },
    { id: 'workOrders', label: 'Órdenes de Trabajo', icon: 'workOrders', badge: openCount > 0 ? openCount : null },
    { id: 'assets', label: 'Activos & Equipos', icon: 'assets' },
    { id: 'preventive', label: 'Mantenimiento Preventivo', icon: 'preventive' },
    { id: 'inventory', label: 'Repuestos e Inventario', icon: 'inventory', badge: lowStockCount > 0 ? lowStockCount : null, badgeColor: 'bg-red-500 text-white shadow-xs' },
    { id: 'reports', label: 'Centro de Reportes PDF', icon: 'reports' },
    { id: 'users', label: 'Gestión de Usuarios', icon: 'users' },
    { id: 'settings', label: 'Configuración', icon: 'settings' }
  ];

  const menuItems = allMenuItems.filter(item => allowedModules.includes(item.id));

  return (
    <aside className="w-full lg:w-64 bg-white border-r border-slate-200 flex flex-col p-4 gap-6 shrink-0 min-h-[calc(100vh-65px)]">
      {/* Tarjeta de Usuario Clickable para abrir Perfil */}
      <div 
        onClick={onOpenProfile}
        className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/90 border border-slate-200 flex items-center gap-3 cursor-pointer transition-all group shadow-2xs"
        title="Haz clic para ver y editar tu perfil de usuario"
      >
        <div className="relative shrink-0">
          <SafeImage 
            src={currentUser?.avatarUrl} 
            alt="Avatar" 
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs group-hover:scale-105 transition-transform"
            fallbackContent={
              <div className="w-10 h-10 rounded-full bg-[#0A3963] flex items-center justify-center text-[#8CC63F] font-extrabold text-sm shadow-xs uppercase group-hover:scale-105 transition-transform">
                {(currentUser?.full_name || 'UP').split(' ').filter(Boolean).map(n=>n[0]).slice(0,2).join('')}
              </div>
            }
          />
          <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0"></span>
        </div>

        <div className="overflow-hidden flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <p className="text-xs font-bold text-slate-900 group-hover:text-[#0A3963] truncate">{currentUser?.full_name || 'Usuario Park'}</p>
            <Icon name="edit" className="w-3 h-3 text-slate-400 group-hover:text-[#0A3963] shrink-0" />
          </div>
          <p className="text-[10px] text-slate-500 font-medium truncate">{currentUser?.email || 'user@park.com'}</p>
          
        </div>
      </div>

      <nav className="flex flex-col gap-1.5 flex-1">
        <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
          Módulos Autorizados ({roleNamesSpanish[userRole] || 'GENERAL'})
        </p>
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all group ${
                isActive
                  ? 'bg-[#0A3963] text-white border-l-4 border-[#8CC63F] shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon 
                  name={item.icon} 
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-[#8CC63F]' : 'text-slate-500 group-hover:text-slate-800'
                  }`} 
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 whitespace-nowrap min-w-[22px] text-center inline-flex items-center justify-center ${item.badgeColor || 'bg-red-500 text-white'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-all group shrink-0"
      >
        <Icon name="logout" className="w-4 h-4 text-red-700 shrink-0" /> <span>Cerrar Sesión</span>
      </button>

      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[10px] text-slate-500 text-center shrink-0">
        <p className="font-bold text-slate-800">PLATAFORMA PARK v2.5</p>
        <p className="text-[#8CC63F] font-bold mt-0.5">PlataformaPark &copy; 2026</p>
      </div>
    </aside>
  );
};


// Componente para Módulo de Gestión de Usuarios (Admin)

// ==========================================
// COMPONENTE MODAL DE PERFIL DE USUARIO (Mi Perfil)
// ==========================================
const UserProfileModal = ({ isOpen, onClose, currentUser, onSaveProfile, users = [] }) => {
  if (!isOpen || !currentUser) return null;

  // Buscar datos completos del usuario en la lista de usuarios si existen
  const fullUserRecord = users.find(u => 
    (u.id && u.id === currentUser.id) || 
    (u.email && u.email.toLowerCase() === currentUser.email?.toLowerCase())
  ) || {};

  const userRole = currentUser.role || 'tecnico';
  const roleConfig = ROLES_CONFIG[userRole] || ROLES_CONFIG['tecnico'];
  const isAdminOrDev = userRole === 'admin' || userRole === 'developer';

  const [fullName, setFullName] = React.useState(currentUser.full_name || fullUserRecord.fullName || '');
  const [phone, setPhone] = React.useState(currentUser.phone || fullUserRecord.phone || '');
  const [department, setDepartment] = React.useState(currentUser.department || fullUserRecord.department || 'Mantenimiento');
  const [avatarUrl, setAvatarUrl] = React.useState(currentUser.avatarUrl || fullUserRecord.avatarUrl || '');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPasswordFields, setShowPasswordFields] = React.useState(false);
  const [feedbackMsg, setFeedbackMsg] = React.useState({ type: '', text: '' });

  const fileInputRef = React.useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setFeedbackMsg({ type: 'error', text: 'La imagen no debe superar los 2MB.' });
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setAvatarUrl(uploadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setFeedbackMsg({ type: '', text: '' });

    if (isAdminOrDev && !fullName.trim()) {
      setFeedbackMsg({ type: 'error', text: 'El nombre no puede estar vacío.' });
      return;
    }

    if (showPasswordFields && newPassword) {
      if (newPassword.length < 6) {
        setFeedbackMsg({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres.' });
        return;
      }
      if (newPassword !== confirmPassword) {
        setFeedbackMsg({ type: 'error', text: 'Las contraseñas no coinciden.' });
        return;
      }
    }

    const updatedUser = {
      ...currentUser,
      full_name: isAdminOrDev ? fullName.trim() : (currentUser.full_name || fullUserRecord.fullName),
      fullName: isAdminOrDev ? fullName.trim() : (currentUser.full_name || fullUserRecord.fullName),
      phone: phone.trim(),
      department: isAdminOrDev ? department.trim() : (currentUser.department || fullUserRecord.department || 'General'),
      avatarUrl: avatarUrl,
      ...(showPasswordFields && newPassword ? { password: newPassword } : {})
    };

    onSaveProfile(updatedUser);
    setFeedbackMsg({ type: 'success', text: 'Perfil actualizado con éxito.' });
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const initials = (fullName || currentUser.full_name || 'U')
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden space-y-0 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header con Membrete Corporativo */}
        <div className="bg-[#0A3963] p-6 text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#8CC63F]/20 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-white/10 border border-white/20">
                <Icon name="users" className="w-5 h-5 text-white" />
              </span>
              <div>
                <h3 className="text-lg font-extrabold font-heading text-white">Mi Perfil de Usuario</h3>
                <p className="text-[11px] text-slate-300">
                  {isAdminOrDev ? 'Información y configuración de cuenta administrativa' : 'Consulta de información y personalización de perfil'}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold text-sm text-white transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Cuerpo del Modal */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {feedbackMsg.text && (
            <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
              feedbackMsg.type === 'error' 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              <Icon name={feedbackMsg.type === 'error' ? 'alert' : 'check'} className="w-4 h-4 shrink-0" />
              <span>{feedbackMsg.text}</span>
            </div>
          )}

          {/* Foto de Perfil / Avatar Interactivo */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <SafeImage 
                src={avatarUrl} 
                alt="Avatar" 
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md group-hover:opacity-80 transition-opacity"
                fallbackContent={
                  <div className="w-16 h-16 rounded-full bg-[#0A3963] text-white flex items-center justify-center font-extrabold text-xl border-2 border-white shadow-md group-hover:bg-[#0A3963]/80 transition-colors">
                    {initials}
                  </div>
                }
              />
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Icon name="edit" className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="font-bold text-sm text-slate-900">{fullName || currentUser.full_name || 'Usuario'}</span>
                
              </div>
              <p className="text-[11px] text-slate-500">{currentUser.email}</p>
              
              <div className="pt-1 flex flex-wrap gap-2 justify-center sm:justify-start">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-[11px] font-bold text-slate-700 shadow-2xs flex items-center gap-1 transition-all"
                >
                  <Icon name="edit" className="w-3 h-3 text-slate-500" /> Cambiar Foto
                </button>
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setAvatarUrl('')}
                    className="px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-[11px] font-bold text-red-600 border border-red-200 transition-all"
                  >
                    Quitar Foto
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Aviso de Permisos de Edición para Empleados */}
          {!isAdminOrDev && (
            <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl flex items-start gap-2.5 text-xs text-blue-800">
              <Icon name="shield" className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                <strong>Información Corporativa:</strong> Tu nombre, correo y rol están protegidos y sólo pueden ser modificados por el Administrador. Puedes personalizar tu foto de perfil, teléfono de contacto y contraseña.
              </p>
            </div>
          )}

          {/* Campos del Formulario */}
          <div className="space-y-3.5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 block">Nombre Completo</label>
                {!isAdminOrDev && (
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    <Icon name="lock" className="w-3 h-3 text-slate-400" /> Bloqueado por Admin
                  </span>
                )}
              </div>
              <input
                type="text"
                disabled={!isAdminOrDev}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full px-3.5 py-2 rounded-lg text-xs font-medium border transition-all ${
                  isAdminOrDev
                    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:outline-none focus:border-[#8CC63F] focus:bg-white'
                    : 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed'
                }`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 block">Correo Electrónico</label>
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    <Icon name="lock" className="w-3 h-3 text-slate-400" /> ID de Acceso
                  </span>
                </div>
                <input
                  type="email"
                  disabled
                  value={currentUser.email || ''}
                  className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Teléfono de Contacto</label>
                <input
                  type="text"
                  placeholder="+52 (33) 1234-5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-[#8CC63F] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 block">Rol / Privilegios</label>
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    <Icon name="shield" className="w-3 h-3 text-slate-400" /> RBAC
                  </span>
                </div>
                <input
                  type="text"
                  disabled
                  value={roleConfig.name}
                  className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 cursor-not-allowed"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 block">Departamento / Área</label>
                  {!isAdminOrDev && (
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Icon name="lock" className="w-3 h-3 text-slate-400" /> Fijo
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  disabled={!isAdminOrDev}
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-lg text-xs font-medium border transition-all ${
                    isAdminOrDev
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:outline-none focus:border-[#8CC63F] focus:bg-white'
                      : 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed'
                  }`}
                />
              </div>
            </div>

            {/* Módulos asignados */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
              <p className="font-bold text-[#0A3963] mb-1">Módulos autorizados en tu cuenta:</p>
              <div className="flex flex-wrap gap-1">
                {roleConfig.modules.map(m => (
                  <span key={m} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-bold text-slate-700 text-[10px]">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Sección Opcional: Cambiar Contraseña */}
            <div className="pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowPasswordFields(!showPasswordFields)}
                className="text-xs font-extrabold text-[#0A3963] hover:text-[#8CC63F] flex items-center gap-1.5 transition-colors"
              >
                <Icon name="key" className="w-3.5 h-3.5" />
                {showPasswordFields ? 'Ocultar cambio de contraseña' : '¿Deseas cambiar tu contraseña?'}
              </button>

              {showPasswordFields && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Nueva Contraseña</label>
                    <input
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:border-[#8CC63F]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Confirmar Contraseña</label>
                    <input
                      type="password"
                      placeholder="Repite la contraseña"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:border-[#8CC63F]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-all"
            >
              Cerrar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl btn-park-green text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform flex items-center gap-1.5"
            >
              <Icon name="check" className="w-4 h-4" /> Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// Componente para Módulo de Gestión de Usuarios y Permisos RBAC
const UsersManagement = ({ users = [], onSaveUser, onDeleteUser, onToggleUserStatus, currentUser }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState('ALL');
  const [statusFilter, setStatusFilter] = React.useState('ALL');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState(null);

  // Form state
  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    role: 'tecnico',
    department: '',
    phone: '',
    password: '',
    status: 'Activo'
  });
  const [formError, setFormError] = React.useState('');

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      fullName: '',
      email: '',
      role: 'tecnico',
      department: 'Mantenimiento General',
      phone: '',
      password: 'Password123!',
      status: 'Activo'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      role: user.role || 'tecnico',
      department: user.department || '',
      phone: user.phone || '',
      password: user.password || 'Password123!',
      status: user.status || 'Activo'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let pass = '';
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password: pass }));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setFormError('');

    if (!formData.fullName.trim()) {
      setFormError('El nombre completo es obligatorio.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setFormError('Ingresa un correo electrónico válido.');
      return;
    }

    // Validar duplicidad de correo si es nuevo o si cambió
    const emailExists = users.some(u => 
      u.email.toLowerCase() === formData.email.trim().toLowerCase() && 
      (!editingUser || u.id !== editingUser.id)
    );
    if (emailExists) {
      setFormError('Ya existe un usuario registrado con este correo electrónico.');
      return;
    }

    const userToSave = {
      id: editingUser ? editingUser.id : ('usr-' + Date.now().toString(36) + '-' + Math.floor(Math.random() * 1000)),
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      role: formData.role,
      department: formData.department.trim() || 'General',
      phone: formData.phone.trim() || '+52 (33) 3800-0000',
      password: formData.password || 'Password123!',
      status: formData.status,
      createdAt: editingUser ? editingUser.createdAt : new Date().toISOString().split('T')[0]
    };

    onSaveUser(userToSave);
    setIsModalOpen(false);
  };

  // Filtrado de usuarios
  const filteredUsers = users.filter(u => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (u.fullName || '').toLowerCase().includes(term) ||
      (u.email || '').toLowerCase().includes(term) ||
      (u.department || '').toLowerCase().includes(term);
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalUsers = users.length;
  const activeCount = users.filter(u => u.status === 'Activo').length;
  const inactiveCount = users.filter(u => u.status === 'Inactivo').length;

  return (
    <div className="space-y-6">
      {/* Header & KPI Summary */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#0A3963]/10 text-[#0A3963]">
              <Icon name="users" className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-[#0A3963] font-heading">
              Gestión de Usuarios y Accesos RBAC
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Administra los perfiles de colaboradores, asignación de roles y control de credenciales.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl btn-park-green text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform flex items-center gap-2"
        >
          <Icon name="plus" className="w-4 h-4" /> Agregar Nuevo Usuario
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold uppercase text-slate-400">Total Colaboradores</p>
          <p className="text-2xl font-extrabold text-[#0A3963] mt-1">{totalUsers}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold uppercase text-emerald-600">Cuentas Activas</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{activeCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold uppercase text-slate-400">Suspendidas / Inactivas</p>
          <p className="text-2xl font-extrabold text-slate-600 mt-1">{inactiveCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold uppercase text-purple-600">Roles Configurados</p>
          <p className="text-2xl font-extrabold text-purple-700 mt-1">{Object.keys(ROLES_CONFIG).length}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Icon name="search" className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, correo, área..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#8CC63F] focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 outline-none"
          >
            <option value="ALL">Todos los Roles</option>
            {Object.keys(ROLES_CONFIG).map(r => (
              <option key={r} value={r}>{ROLES_CONFIG[r].name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 outline-none"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="Activo">Activos</option>
            <option value="Inactivo">Inactivos</option>
          </select>
        </div>
      </div>

      {/* Users Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((u) => {
          const conf = ROLES_CONFIG[u.role] || ROLES_CONFIG['tecnico'];
          const initials = (u.fullName || 'U')
            .split(' ')
            .filter(Boolean)
            .map(n => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
          const isActive = u.status === 'Activo';

          return (
            <div 
              key={u.id || u.email} 
              className={`p-5 rounded-2xl border transition-all bg-white shadow-xs space-y-3 relative overflow-hidden ${
                !isActive ? 'opacity-70 bg-slate-50 border-slate-200' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              {/* Top Row: Avatar + Info */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full bg-[#0A3963] text-white flex items-center justify-center font-extrabold text-sm border-2 border-white shadow-xs">
                      {initials}
                    </div>
                    <span 
                      className={`w-3 h-3 rounded-full absolute bottom-0 right-0 border-2 border-white ${
                        isActive ? 'bg-emerald-500' : 'bg-slate-400'
                      }`} 
                      title={isActive ? 'Activo' : 'Inactivo'}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-tight">{u.fullName}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Icon name="mail" className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[170px]">{u.email}</span>
                    </p>
                  </div>
                </div>

                <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md border shrink-0 ${conf.badgeColor}`}>
                  {conf.name}
                </span>
              </div>

              {/* Middle Row: Meta */}
              <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 text-xs text-slate-600 border border-slate-100">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-semibold">Departamento:</span>
                  <span className="font-bold text-slate-700">{u.department || 'General'}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-semibold">Teléfono:</span>
                  <span className="font-medium text-slate-700">{u.phone || 'No registrado'}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-semibold">Estado de Cuenta:</span>
                  <span className={`font-bold ${isActive ? 'text-emerald-700' : 'text-slate-500'}`}>
                    {isActive ? '● Activa' : '○ Suspendida'}
                  </span>
                </div>
              </div>

              {/* Modules Authorized Badge List */}
              <div className="space-y-1">
                <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Módulos habilitados:</p>
                <div className="flex flex-wrap gap-1">
                  {conf.modules.map(m => (
                    <span key={m} className="px-1.5 py-0.5 rounded bg-slate-100 text-[9px] font-bold text-slate-600">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onToggleUserStatus(u.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive 
                      ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200' 
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                  title={isActive ? 'Suspender acceso temporalmente' : 'Reactivar acceso al sistema'}
                >
                  <Icon name={isActive ? 'alert' : 'check'} className="w-3.5 h-3.5" />
                  {isActive ? 'Suspender' : 'Activar'}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(u)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
                    title="Editar datos del usuario"
                  >
                    <Icon name="edit" className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`¿Seguro que deseas eliminar al usuario ${u.fullName}? Esta acción no se puede deshacer.`)) {
                        onDeleteUser(u.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-all"
                    title="Eliminar usuario"
                  >
                    <Icon name="trash" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredUsers.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <span className="text-4xl">🔍</span>
          <h3 className="text-base font-bold text-slate-700">No se encontraron usuarios</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No hay colaboradores que coincidan con los filtros o término de búsqueda ingresado.
          </p>
        </div>
      )}

      {/* Modal para Crear / Editar Usuario */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden space-y-4">
            
            {/* Header del Modal */}
            <div className="bg-[#0A3963] p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold font-heading">
                  {editingUser ? 'Editar Perfil de Usuario' : 'Registrar Nuevo Usuario'}
                </h3>
                <p className="text-[11px] text-slate-300">
                  {editingUser ? 'Actualiza los permisos y datos del colaborador.' : 'Crea una cuenta con rol y credenciales de acceso.'}
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold text-sm transition-all"
              >
                ✕
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {formError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                  <Icon name="alert" className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Ing. Carlos Mendoza"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-[#8CC63F] focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    placeholder="usuario@park.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-[#8CC63F] focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Rol en el Sistema *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-[#8CC63F] focus:bg-white transition-all"
                  >
                    {Object.keys(ROLES_CONFIG).map(r => (
                      <option key={r} value={r}>{ROLES_CONFIG[r].name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Departamento / Área</label>
                  <input
                    type="text"
                    placeholder="ej. Mantenimiento Eléctrico"
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-[#8CC63F] focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Teléfono de Contacto</label>
                  <input
                    type="text"
                    placeholder="+52 (33) 1234-5678"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-[#8CC63F] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 block">Contraseña de Acceso</label>
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="text-[10px] text-blue-600 font-extrabold hover:underline"
                    >
                      Generar Segura
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-medium text-slate-900 focus:outline-none focus:border-[#8CC63F] focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Estado Inicial</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-[#8CC63F] focus:bg-white transition-all"
                  >
                    <option value="Activo">Activo (Permite acceso)</option>
                    <option value="Inactivo">Inactivo (Acceso suspendido)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                <p className="font-bold text-[#0A3963] mb-1">Permisos automáticos para el rol seleccionado:</p>
                <div className="flex flex-wrap gap-1">
                  {(ROLES_CONFIG[formData.role] || ROLES_CONFIG['tecnico']).modules.map(m => (
                    <span key={m} className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-semibold text-slate-700">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl btn-park-green text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform flex items-center gap-1.5"
                >
                  <Icon name="check" className="w-4 h-4" />
                  {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente para Configuración de Sistema (Admin)
const SettingsView = () => (
  <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
    <h2 className="text-xl font-bold text-[#0A3963]">🛠️ Configuración Global del Sistema</h2>
    <div className="space-y-3 text-xs text-slate-700">
      <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
        <div>
          <p className="font-bold">Control de Acceso Basado en Roles (RBAC)</p>
          <p className="text-slate-500 text-[11px]">Validación dinámica basada en roles.json</p>
        </div>
        <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">ACTIVO</span>
      </div>
      <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
        <div>
          <p className="font-bold">Autenticación JWT</p>
          <p className="text-slate-500 text-[11px]">Tokens Bearer con expiración de 24 horas</p>
        </div>
        <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">VERIFICADO</span>
      </div>
    </div>
  </div>
);

// Dashboard
const Dashboard = ({ data, currentUser, onSelectWO, onNewWO, onNavigateTab, onStatusChange }) => {
  const { workOrders = [], assets = [], inventory = [] } = data;

  const totalWO = workOrders.length;
  const openWO = workOrders.filter(w => w.status === 'Abierta').length;
  const inProgressWO = workOrders.filter(w => w.status === 'En Proceso').length;
  const onHoldWO = workOrders.filter(w => w.status === 'En Espera').length;
  const completedWO = workOrders.filter(w => w.status === 'Completada').length;
  const urgentWO = workOrders.filter(w => w.priority === 'Urgente' && w.status !== 'Completada').length;

  const totalCost = workOrders.reduce((sum, w) => sum + (w.grandTotal || 0), 0);
  const outOfServiceAssets = assets.filter(a => a.status === 'Fuera de Servicio').length;
  const lowStockCount = inventory.filter(i => (i.currentStock || 0) <= (i.minStock || 0)).length;

  // Órdenes activas prioritarias (excluye completadas)
  const activeWOs = workOrders.filter(w => w.status !== 'Completada');
  const urgentList = [...activeWOs].sort((a, b) => {
    const pOrder = { 'Urgente': 0, 'Alta': 1, 'Media': 2, 'Baja': 3 };
    return (pOrder[a.priority] ?? 4) - (pOrder[b.priority] ?? 4);
  }).slice(0, 5);

  const canCreate = currentUser?.role !== 'tecnico' && currentUser?.role !== 'auditor';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl park-card">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0A3963] font-heading">
            Resumen Operativo de Mantenimiento
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Plataforma PARK — Control e Indicadores en Tiempo Real | Plataforma PARK
          </p>
        </div>
        {canCreate && (
          <button
            onClick={onNewWO}
            className="px-5 py-2.5 rounded-lg btn-park-green text-white font-extrabold text-xs shadow hover:scale-[1.02] transition-transform flex items-center gap-1.5 shrink-0"
          >
            <Icon name="zap" className="w-4 h-4 mr-1" />
            <span>Crear Nuevo Reporte / Orden</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tarjeta 1: Órdenes Totales -> Navega a Órdenes de Trabajo */}
        <div 
          onClick={() => onNavigateTab && onNavigateTab('workOrders')}
          className="p-5 rounded-xl park-card park-card-hover flex items-center justify-between cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md hover:border-[#0A3963]/30 group"
          title="Ver todas las órdenes de trabajo"
        >
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-[#0A3963] transition-colors">Órdenes Totales</p>
            <h3 className="text-3xl font-extrabold text-[#0A3963] mt-1 font-heading">{totalWO}</h3>
            <p className="text-xs text-emerald-600 font-semibold mt-1 inline-flex items-center gap-1">
              <Icon name="check" className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {completedWO} completadas ({Math.round((completedWO/(totalWO || 1))*100)}%)
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0A3963] group-hover:bg-[#0A3963] group-hover:text-white transition-all shrink-0">
            <Icon name="workOrders" className="w-6 h-6" />
          </div>
        </div>

        {/* Tarjeta 2: Activas / En Proceso -> Navega a Órdenes de Trabajo */}
        <div 
          onClick={() => onNavigateTab && onNavigateTab('workOrders')}
          className="p-5 rounded-xl park-card park-card-hover flex items-center justify-between cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md hover:border-amber-400/40 group"
          title="Ver órdenes de trabajo activas y en proceso"
        >
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-amber-600 transition-colors">Activas / En Proceso</p>
            <h3 className="text-3xl font-extrabold text-amber-600 mt-1 font-heading">{openWO + inProgressWO + onHoldWO}</h3>
            <p className="text-xs text-amber-700 font-semibold mt-1">
              {openWO} abiertas | {inProgressWO} en ejecución
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-all shrink-0">
            <Icon name="assets" className="w-6 h-6" />
          </div>
        </div>

        {/* Tarjeta 3: Atención Crítica -> Navega a Activos & Equipos */}
        <div 
          onClick={() => onNavigateTab && onNavigateTab('assets')}
          className="p-5 rounded-xl park-card park-card-hover flex items-center justify-between cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md hover:border-red-400/40 group"
          title="Ver activos y equipos con atención crítica / fuera de servicio"
        >
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-red-600 transition-colors">Atención Crítica</p>
            <h3 className="text-3xl font-extrabold text-red-600 mt-1 font-heading">{urgentWO}</h3>
            <p className="text-xs text-red-600 font-semibold mt-1 inline-flex items-center gap-1">
              <Icon name="alert" className="w-3.5 h-3.5 text-red-600 shrink-0" /> {outOfServiceAssets} Equipos Fuera de Servicio
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 group-hover:bg-red-500 group-hover:text-white transition-all shrink-0">
            <Icon name="alert" className="w-6 h-6" />
          </div>
        </div>

        {/* Tarjeta 4: Inversión Acumulada -> Navega al Centro de Reportes */}
        <div 
          onClick={() => onNavigateTab && onNavigateTab('reports')}
          className="p-5 rounded-xl park-card park-card-hover flex items-center justify-between cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md hover:border-emerald-400/40 group"
          title="Ver Centro de Reportes PDF e Inversión"
        >
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-emerald-700 transition-colors">Inversión Acumulada</p>
            <h3 className="text-2xl font-extrabold text-[#0A3963] mt-1 font-heading">
              ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Materiales + Mano de obra
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all shrink-0">
            <Icon name="dollar" className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl park-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-[#0A3963] font-heading">
                Órdenes Prioritarias & Pendientes
              </h2>
              <p className="text-xs text-slate-500 font-medium">Atención requerida por técnicos en parque</p>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-50 text-[#8CC63F] border border-[#8CC63F]/40 text-xs font-bold">
              Feed Operativo ({activeWOs.length} activas)
            </span>
          </div>

          <div className="space-y-3">
            {urgentList.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-400 space-y-1">
                <span className="text-3xl block">🎉</span>
                <p className="text-sm font-bold text-slate-700">Todas las órdenes de trabajo están al día</p>
                <p className="text-xs text-slate-500">No hay órdenes pendientes o en proceso en este momento.</p>
              </div>
            ) : (
              urgentList.map((wo) => {
                let pClass = "badge-low";
                if (wo.priority === 'Urgente') pClass = "badge-urgent";
                else if (wo.priority === 'Alta') pClass = "badge-high";
                else if (wo.priority === 'Media') pClass = "badge-medium";

                return (
                  <div
                    key={wo.id}
                    onClick={() => onSelectWO(wo)}
                    className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:border-[#8CC63F] cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#0A3963] font-mono">{wo.code}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${pClass}`}>
                          {wo.priority}
                        </span>
                        <span className="text-[10px] text-slate-600 px-2 py-0.5 rounded bg-white border border-slate-200 font-semibold">
                          {wo.category}
                        </span>
                        <span className="text-[10px] text-blue-700 px-2 py-0.5 rounded bg-blue-50 border border-blue-200 font-bold">
                          {wo.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#0A3963] transition-colors">
                        {wo.title}
                      </h4>
                      <p className="text-xs text-slate-500 inline-flex items-center gap-1">
                        <Icon name="location" className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {wo.development || 'Park Industrial'} • <span className="text-slate-700 font-semibold">{wo.assetName}</span>
                      </p>
                    </div>

                    <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-700 inline-flex items-center gap-1">
                          <Icon name="user" className="w-3.5 h-3.5 text-slate-500 shrink-0" /> {wo.assignedTech}
                        </span>
                        <span className="text-xs font-extrabold text-[#0A3963]">
                          ${(wo.grandTotal || 0).toFixed(2)} USD
                        </span>
                      </div>

                      {onStatusChange && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onStatusChange(wo.id, 'Completada');
                          }}
                          title="Marcar esta orden como Completada desde el Dashboard"
                          className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-extrabold text-[10px] border border-emerald-300 transition-all flex items-center gap-1 shadow-xs"
                        >
                          <Icon name="check" className="w-3.5 h-3.5" />
                          <span>Completar</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div 
            onClick={() => onNavigateTab && onNavigateTab('assets')}
            className="p-6 rounded-2xl park-card space-y-4 cursor-pointer hover:border-[#0A3963]/30 transition-all group"
            title="Ver todos los Activos y Equipos"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-[#0A3963] font-heading group-hover:text-[#8CC63F] transition-colors">Estado de Equipos</h2>
              <span className="text-xs text-slate-400 group-hover:text-[#0A3963] font-bold">Ver todos →</span>
            </div>
            <div className="space-y-3">
              {assets.length === 0 ? (
                <p className="text-xs text-slate-400 italic p-3 text-center">No hay activos registrados.</p>
              ) : (
                assets.slice(0, 4).map((ast) => {
                  let statusColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
                  if (ast.status === 'Fuera de Servicio') statusColor = "text-red-700 bg-red-50 border-red-200";
                  else if (ast.status === 'En Mantenimiento') statusColor = "text-amber-700 bg-amber-50 border-amber-200";

                  return (
                    <div key={ast.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{ast.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{ast.code} • {ast.location}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${statusColor}`}>
                        {ast.status}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// WorkOrders
const WorkOrders = ({ workOrders = [], currentUser, onSelectWO, onNewWO, onExportSinglePdf, onStatusChange, searchTerm }) => {
  const [viewMode, setViewMode] = React.useState('list'); // 'list' | 'kanban'
  const [orderSection, setOrderSection] = React.useState('active'); // 'active' | 'completed' | 'all'
  const [filterPriority, setFilterPriority] = React.useState('ALL');
  const [filterStatus, setFilterStatus] = React.useState('ALL');
  const [filterCategory, setFilterCategory] = React.useState('ALL');

  const userRole = currentUser?.role || 'tecnico';
  const isTechnician = userRole === 'tecnico' || (currentUser?.email && currentUser.email.toLowerCase().includes('tecnico'));
  const canCreateWO = !isTechnician && userRole !== 'auditor';

  // Counts for tabs
  const activeCount = workOrders.filter(w => w.status !== 'Completada').length;
  const completedCount = workOrders.filter(w => w.status === 'Completada').length;
  const totalCount = workOrders.length;

  const filtered = workOrders.filter((wo) => {
    const q = (searchTerm || '').trim().toLowerCase();
    const matchesSearch = !q || 
      (wo.title || '').toLowerCase().includes(q) ||
      (wo.code || '').toLowerCase().includes(q) ||
      (wo.assetName || '').toLowerCase().includes(q) ||
      (wo.development || '').toLowerCase().includes(q) ||
      (wo.assignedTech || '').toLowerCase().includes(q);

    const matchesPriority = filterPriority === 'ALL' || wo.priority === filterPriority;
    const matchesStatus = filterStatus === 'ALL' || wo.status === filterStatus;
    const matchesCategory = filterCategory === 'ALL' || wo.category === filterCategory;

    // Section filtering: Activas vs Completadas vs Todas
    let matchesSection = true;
    if (orderSection === 'active') {
      matchesSection = wo.status !== 'Completada';
    } else if (orderSection === 'completed') {
      matchesSection = wo.status === 'Completada';
    }

    return matchesSearch && matchesPriority && matchesStatus && matchesCategory && matchesSection;
  });

  const statuses = ['Abierta', 'En Proceso', 'En Espera', 'Completada'];

  return (
    <div className="space-y-6">
      {/* Header Card with Navigation Tabs */}
      <div className="p-6 rounded-2xl park-card space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0A3963] font-heading">
              Órdenes de Trabajo (Work Orders)
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Gestión operativa, seguimiento de mantenimiento y archivo histórico | Plataforma PARK
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center p-1 rounded-lg bg-slate-100 border border-slate-200">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  viewMode === 'list' ? 'bg-[#0A3963] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ≡ Lista
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  viewMode === 'kanban' ? 'bg-[#0A3963] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ⊞ Kanban
              </button>
            </div>

            {canCreateWO && (
              <button
                onClick={onNewWO}
                className="px-4 py-2 rounded-xl btn-park-green text-white text-xs font-extrabold shadow hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
              >
                <Icon name="plus" className="w-4 h-4 mr-1" /> Crear Orden
              </button>
            )}
          </div>
        </div>

        {/* Section Tabs: ACTIVAS vs COMPLETADAS vs TODAS */}
        <div className="flex items-center gap-2 border-b border-slate-200 pt-2 flex-wrap">
          <button
            onClick={() => { setOrderSection('active'); setFilterStatus('ALL'); }}
            className={`pb-3 px-4 text-xs font-extrabold border-b-2 transition-all flex items-center gap-2 ${
              orderSection === 'active'
                ? 'border-[#0A3963] text-[#0A3963]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>📋 Órdenes Activas / En Proceso</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              orderSection === 'active' ? 'bg-[#0A3963] text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {activeCount}
            </span>
          </button>

          <button
            onClick={() => { setOrderSection('completed'); setFilterStatus('ALL'); }}
            className={`pb-3 px-4 text-xs font-extrabold border-b-2 transition-all flex items-center gap-2 ${
              orderSection === 'completed'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>✅ Órdenes Completadas / Archivo</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              orderSection === 'completed' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {completedCount}
            </span>
          </button>

          <button
            onClick={() => { setOrderSection('all'); setFilterStatus('ALL'); }}
            className={`pb-3 px-4 text-xs font-extrabold border-b-2 transition-all flex items-center gap-2 ${
              orderSection === 'all'
                ? 'border-slate-800 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>📂 Todas las Órdenes</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              orderSection === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {totalCount}
            </span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Prioridad
            </label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:border-[#8CC63F] outline-none font-medium"
            >
              <option value="ALL">Todas las Prioridades</option>
              <option value="Urgente">🚨 Urgente</option>
              <option value="Alta">🟧 Alta</option>
              <option value="Media">🟨 Media</option>
              <option value="Baja">🟦 Baja</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Estado Específico
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:border-[#8CC63F] outline-none font-medium"
            >
              <option value="ALL">Todos en esta vista</option>
              {orderSection !== 'completed' && <option value="Abierta">🔵 Abierta</option>}
              {orderSection !== 'completed' && <option value="En Proceso">🟣 En Proceso</option>}
              {orderSection !== 'completed' && <option value="En Espera">🟡 En Espera</option>}
              {orderSection !== 'active' && <option value="Completada">🟢 Completada</option>}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Categoría
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:border-[#8CC63F] outline-none font-medium"
            >
              <option value="ALL">Todas las Categorías</option>
              <option value="Preventivo">Preventivo</option>
              <option value="Correctivo">Correctivo</option>
              <option value="Inspección">Inspección</option>
              <option value="Seguridad">Seguridad</option>
              <option value="Eléctrico">Eléctrico</option>
              <option value="Climatización / HVAC">Climatización / HVAC</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE VIEW */}
      {viewMode === 'list' && (
        <div className="p-6 rounded-2xl park-card overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-extrabold text-[#0A3963] uppercase tracking-wider bg-slate-50">
                <th className="py-3 px-3">Folio</th>
                <th className="py-3 px-3">Título de la Orden</th>
                <th className="py-3 px-3">Desarrollo / Activo</th>
                <th className="py-3 px-3">Prioridad</th>
                <th className="py-3 px-3">Estado</th>
                <th className="py-3 px-3">Técnico</th>
                <th className="py-3 px-3 text-right">Costo Total</th>
                <th className="py-3 px-3 text-center whitespace-nowrap">Acciones & Reporte</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    <div className="space-y-2 max-w-sm mx-auto">
                      <span className="text-4xl block">
                        {orderSection === 'completed' ? '✅' : '📋'}
                      </span>
                      <p className="text-sm font-bold text-slate-700">
                        {orderSection === 'completed' 
                          ? 'No hay órdenes completadas en el historial'
                          : 'No hay órdenes de trabajo activas'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {orderSection === 'completed'
                          ? 'Cuando completes una orden de trabajo, aparecerá archivada aquí para consulta histórica y reportes PDF.'
                          : canCreateWO
                            ? 'Comienza creando una nueva orden de trabajo con el botón superior.'
                            : 'Las órdenes de trabajo asignadas a tu perfil aparecerán listadas aquí.'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
              {filtered.map((wo) => {
                let pClass = "badge-low";
                if (wo.priority === 'Urgente') pClass = "badge-urgent";
                else if (wo.priority === 'Alta') pClass = "badge-high";
                else if (wo.priority === 'Media') pClass = "badge-medium";

                let sClass = "badge-open";
                const isDone = wo.status === 'Completada';
                if (isDone) sClass = "badge-completed";
                else if (wo.status === 'En Proceso') sClass = "badge-in-progress";

                return (
                  <tr 
                    key={wo.id}
                    className={`hover:bg-slate-50/80 transition-colors group cursor-pointer ${
                      isDone ? 'bg-slate-50/30' : ''
                    }`}
                  >
                    <td className="py-3.5 px-3 font-bold text-[#0A3963] font-mono" onClick={() => onSelectWO(wo)}>
                      {wo.code}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-slate-900 group-hover:text-[#0A3963]" onClick={() => onSelectWO(wo)}>
                      <p className="flex items-center gap-1.5">
                        {isDone && <span className="text-emerald-600 font-bold">✓</span>}
                        <span>{wo.title}</span>
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium">{wo.category}</p>
                    </td>
                    <td className="py-3.5 px-3 text-slate-700" onClick={() => onSelectWO(wo)}>
                      <p className="font-semibold text-slate-900">{wo.development || 'Park Industrial'}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{wo.assetName}</p>
                    </td>
                    <td className="py-3.5 px-3" onClick={() => onSelectWO(wo)}>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${pClass}`}>
                        {wo.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <select
                        value={wo.status}
                        onChange={(e) => onStatusChange(wo.id, e.target.value)}
                        className={`px-2 py-1 rounded text-[10px] font-extrabold outline-none cursor-pointer ${sClass}`}
                      >
                        {statuses.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-slate-800" onClick={() => onSelectWO(wo)}>
                      {wo.assignedTech}
                    </td>
                    <td className="py-3.5 px-3 text-right font-extrabold text-[#0A3963]" onClick={() => onSelectWO(wo)}>
                      ${(wo.grandTotal || 0).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        {/* Botón para marcar completada si está activa */}
                        {!isDone ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onStatusChange(wo.id, 'Completada');
                            }}
                            title="Marcar esta orden como Completada y archivarla"
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-extrabold text-[11px] border border-emerald-300 transition-all flex items-center gap-1 shadow-xs"
                          >
                            <Icon name="check" className="w-3.5 h-3.5" />
                            <span>Completar</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onStatusChange(wo.id, 'En Proceso');
                            }}
                            title="Reabrir esta orden de trabajo"
                            className="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-[10px] transition-all"
                          >
                            ↺ Reabrir
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onExportSinglePdf(wo);
                          }}
                          title="Generar y Descargar Reporte PDF de la Orden"
                          className="px-2.5 py-1.5 rounded-lg btn-park-blue text-[11px] font-extrabold transition-transform hover:scale-105 shadow-xs flex items-center gap-1"
                        >
                          <Icon name="pdf" className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* KANBAN VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {statuses.map((status) => {
            const listInStatus = filtered.filter(w => w.status === status);

            return (
              <div key={status} className="p-4 rounded-2xl park-card space-y-3 flex flex-col min-h-[500px] bg-slate-50/50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                    {status}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[10px] font-extrabold">
                    {listInStatus.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                  {listInStatus.map((wo) => {
                    let pClass = "badge-low";
                    if (wo.priority === 'Urgente') pClass = "badge-urgent";
                    else if (wo.priority === 'Alta') pClass = "badge-high";

                    const isDone = wo.status === 'Completada';

                    return (
                      <div
                        key={wo.id}
                        onClick={() => onSelectWO(wo)}
                        className="p-4 rounded-xl bg-white border border-slate-200/80 hover:border-[#8CC63F] cursor-pointer transition-all space-y-2.5 group shadow-xs hover:shadow-md"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#0A3963] font-mono">{wo.code}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${pClass}`}>
                            {wo.priority}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0A3963] transition-colors">
                          {wo.title}
                        </h4>

                        <p className="text-[10px] text-slate-500 font-medium">
                          📍 {wo.development || 'Park Industrial'}
                        </p>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                          <span className="text-slate-700 font-semibold">👤 {wo.assignedTech.split(' ')[1] || wo.assignedTech}</span>
                          
                          <div className="flex items-center gap-1">
                            {!isDone && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onStatusChange(wo.id, 'Completada');
                                }}
                                title="Completar Orden"
                                className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white font-bold text-[9px] border border-emerald-300"
                              >
                                ✓ Listo
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onExportSinglePdf(wo);
                              }}
                              className="px-2 py-0.5 rounded bg-blue-50 text-[#0A3963] hover:bg-blue-100 font-extrabold border border-blue-200 flex items-center gap-1"
                            >
                              <Icon name="pdf" className="w-3.5 h-3.5" /> PDF
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// SignaturePad
const SignaturePad = ({ onSaveSignature }) => {
  const canvasRef = React.useRef(null);
  const [isDrawing, setIsDrawing] = React.useState(false);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0A3963';
  }, []);

  const startDrawing = (e) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL();
      onSaveSignature(dataUrl);
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    onSaveSignature(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <label className="font-bold text-slate-800">Firma Digital del Técnico / Supervisor</label>
        <button
          type="button"
          onClick={clearCanvas}
          className="text-[#0A3963] hover:underline text-[11px] font-bold"
        >
          <Icon name="clean" className="w-4 h-4 mr-1.5" /> Limpiar Firma
        </button>
      </div>

      <div className="relative border-2 dashed border-slate-300 rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          width={380}
          height={100}
          className="w-full h-24 cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
        />
        <div className="absolute bottom-2 right-3 pointer-events-none text-[9px] text-slate-400 uppercase tracking-widest font-mono font-bold">
          Plataforma PARK — Firma Digital
        </div>
      </div>
    </div>
  );
};

// Utilidad para comprimir y convertir imágenes a Base64 manteniendo alta resolución y tamaño ligero
const compressImageFile = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.75) => {
  return new Promise((resolve) => {
    try {
      if (!file || !file.type || !file.type.startsWith('image/')) {
        return resolve(null);
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    } catch (err) {
      resolve(null);
    }
  });
};

// WorkOrderModal (CON BOTÓN DIRECTO DE GENERACIÓN DE PDF DENTRO DE LA ORDEN)
const WorkOrderModal = ({ isOpen, onClose, onSave, workOrder, assets = [], inventory = [], technicians = [], users = [], onExportPdf, currentUser, initialTab = 'form' }) => {
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
    estimatedHours: workOrder?.estimatedHours || 2.0,
    actualHours: workOrder?.actualHours || 0.0,
    totalLaborCost: workOrder?.totalLaborCost !== undefined ? workOrder.totalLaborCost : 0,
    checklist: workOrder?.checklist || [
      { id: 1, text: 'Revisión y bloqueo de seguridad LOTO', completed: false, timestamp: null },
      { id: 2, text: 'Ejecución de mantenimiento técnico de rutina', completed: false, timestamp: null },
      { id: 3, text: 'Pruebas de funcionamiento e inspección final', completed: false, timestamp: null }
    ],
    usedParts: workOrder?.usedParts || [],
    technicianNotes: workOrder?.technicianNotes || '',
    photos: Array.isArray(workOrder?.photos) ? workOrder.photos : [],
    comments: Array.isArray(workOrder?.comments) ? workOrder.comments : [],
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
  const [isAssetPickerOpen, setIsAssetPickerOpen] = React.useState(false);
  const [assetSearchQuery, setAssetSearchQuery] = React.useState('');

  const [newChecklistItem, setNewChecklistItem] = React.useState('');
  const [selectedPartId, setSelectedPartId] = React.useState(inventory[0]?.id || '');
  const [partQty, setPartQty] = React.useState(1);

  // Sincronizar formData de forma instantánea al abrir o cambiar de orden
  React.useEffect(() => {
    if (isOpen) {
      setIsAssetPickerOpen(false);
      setAssetSearchQuery('');
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
        estimatedHours: workOrder?.estimatedHours || 2.0,
        actualHours: workOrder?.actualHours || 0.0,
        totalLaborCost: workOrder?.totalLaborCost !== undefined ? workOrder.totalLaborCost : 0,
        checklist: workOrder?.checklist || [
          { id: 1, text: 'Revisión y bloqueo de seguridad LOTO', completed: false, timestamp: null },
          { id: 2, text: 'Ejecución de mantenimiento técnico de rutina', completed: false, timestamp: null },
          { id: 3, text: 'Pruebas de funcionamiento e inspección final', completed: false, timestamp: null }
        ],
        usedParts: workOrder?.usedParts || [],
        technicianNotes: workOrder?.technicianNotes || '',
        photos: Array.isArray(workOrder?.photos) ? workOrder.photos : [],
        comments: Array.isArray(workOrder?.comments) ? workOrder.comments : [],
        createdBy: workOrder?.createdBy || (effectiveUser.full_name || effectiveUser.fullName || effectiveUser.name || 'Ing. Carlos Mendoza (Admin)'),
        createdDate: workOrder?.createdDate || new Date().toISOString(),
        updatedAt: workOrder?.updatedAt || null,
        lastUpdatedBy: workOrder?.lastUpdatedBy || null
      });
      setChatAttachment(null);
      setPreviewImage(null);
      setIsDraggingPhotos(false);
      setActiveModalTab(initialTab || 'form');
    }
  }, [isOpen, workOrder, initialTab]);

  React.useEffect(() => {
    if (activeModalTab === 'chat' && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeModalTab, formData.comments]);

  const selectedAsset = assets.find(a => a.id === formData.assetId) || (assets.length > 0 ? assets[0] : null);

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

  const handleClearChecklist = () => {
    if (window.confirm("¿Deseas vaciar todos los pasos del procedimiento?")) {
      setFormData(prev => ({
        ...prev,
        checklist: []
      }));
    }
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

  const handleClearChecklist = () => {
    if (window.confirm("¿Deseas vaciar todos los pasos del procedimiento?")) {
      const now = new Date().toISOString();
      const updater = effectiveUser.full_name || effectiveUser.name || 'Usuario';
      setFormData(prev => {
        const next = { ...prev, checklist: [], updatedAt: now, lastUpdatedBy: updater };
        if (isEdit) {
          onSave(next);
        }
        return next;
      });
    }
  };

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
        const dataUrl = await compressImageFile(file, 1200, 1200, 0.75);
        if (dataUrl) {
          newPhotos.push({
            id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            url: dataUrl,
            name: file.name,
            tag: 'Evidencia',
            uploadedAt: now.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit' }) + ' ' + now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
            uploadedBy: updater
          });
        }
      }

      if (newPhotos.length > 0) {
        setFormData(prev => {
          const updated = [...(prev.photos || []), ...newPhotos];
          const next = {
            ...prev,
            photos: updated,
            updatedAt: nowIso,
            lastUpdatedBy: updater,
            assetName: selectedAsset?.name || prev.assetName || 'Activo General',
            development: selectedAsset?.development || prev.development || 'Park Industrial',
            location: selectedAsset?.location || prev.location || 'Área Principal',
            totalPartsCost,
            totalLaborCost,
            grandTotal
          };
          if (isEdit) {
            onSave(next);
          }
          return next;
        });
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

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingPhotos(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingPhotos(false);
  };

  const handleDropPhotos = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingPhotos(false);
    const files = e.dataTransfer ? Array.from(e.dataTransfer.files) : [];
    if (files.length > 0) {
      processPhotoFiles(files);
    }
  };

  const handleChatFileSelect = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    try {
      if (file.type && file.type.startsWith('image/')) {
        const dataUrl = await compressImageFile(file, 1000, 1000, 0.75);
        if (dataUrl) {
          setChatAttachment({
            type: 'image',
            name: file.name,
            size: file.size,
            url: dataUrl
          });
        }
      } else {
        // Documentos: PDF, Word, Excel, etc.
        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          let docType = 'file';
          const lowerName = file.name.toLowerCase();
          if (lowerName.endsWith('.pdf')) docType = 'pdf';
          else if (lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls') || lowerName.endsWith('.csv')) docType = 'excel';
          else if (lowerName.endsWith('.docx') || lowerName.endsWith('.doc')) docType = 'word';

          setChatAttachment({
            type: 'document',
            fileType: docType,
            name: file.name,
            size: file.size,
            url: loadEvt.target.result
          });
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error('Error al cargar archivo en chat:', err);
    } finally {
      e.target.value = '';
    }
  };



  const totalPartsCost = formData.usedParts.reduce((sum, p) => sum + p.totalCost, 0);
  const totalLaborCost = Number(formData.totalLaborCost) || 0;
  const grandTotal = totalPartsCost + totalLaborCost;

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

    if (isEdit) {
      onSave({
        ...formData,
        comments: updatedComments,
        assetName: selectedAsset?.name || formData.assetName || 'Activo General',
        development: selectedAsset?.development || formData.development || 'Park Industrial',
        location: selectedAsset?.location || formData.location || 'Área Principal',
        createdDate: workOrder?.createdDate || new Date().toISOString(),
        totalPartsCost,
        totalLaborCost,
        grandTotal,
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
        ...formData,
        comments: updatedComments,
        assetName: selectedAsset?.name || formData.assetName || 'Activo General',
        development: selectedAsset?.development || formData.development || 'Park Industrial',
        location: selectedAsset?.location || formData.location || 'Área Principal',
        createdDate: workOrder?.createdDate || new Date().toISOString(),
        totalPartsCost,
        totalLaborCost,
        grandTotal
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
      assetName: selectedAsset?.name || formData.assetName || 'Activo General',
      development: selectedAsset?.development || formData.development || 'Park Industrial',
      location: selectedAsset?.location || formData.location || 'Área Principal',
      createdDate: workOrder?.createdDate || new Date().toISOString(),
      totalPartsCost,
      totalLaborCost,
      grandTotal
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
      assetName: selectedAsset?.name || formData.assetName || 'Activo General',
      development: selectedAsset?.development || formData.development || 'Park Industrial',
      location: selectedAsset?.location || formData.location || 'Área Principal',
      createdDate: workOrder?.createdDate || new Date().toISOString(),
      totalPartsCost,
      totalLaborCost,
      grandTotal
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
                <label className="text-xs font-bold text-slate-700 block mb-1">Delegar / Técnico Asignado *</label>
                <select
                  value={formData.assignedTech || (availableAssignees[0]?.name || '')}
                  onChange={(e) => setFormData({ ...formData, assignedTech: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#8CC63F] focus:bg-white outline-none font-bold"
                >
                  {availableAssignees.map(a => (
                    <option key={a.id || a.name} value={a.name}>
                      👤 {a.name} ({a.role ? a.role.toUpperCase() : 'COLABORADOR'})
                    </option>
                  ))}
                </select>
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

            {/* Repuestos y Costos */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold text-[#0A3963] uppercase tracking-wider">
                2. Asignación de Repuestos & Costo de Mano de Obra
              </h3>

              {inventory.length > 0 ? (
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={selectedPartId}
                    onChange={(e) => setSelectedPartId(e.target.value)}
                    className="flex-1 bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 outline-none font-medium"
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
                    className="w-20 bg-white border border-slate-300 rounded px-2 py-1.5 text-xs text-slate-900 text-center outline-none font-bold"
                  />
                  <button
                    type="button"
                    onClick={handleAddPart}
                    className="px-4 py-1.5 rounded btn-park-green text-xs shadow-xs"
                  >
                    + Añadir Repuesto
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No hay repuestos registrados en el almacén todavía.</p>
              )}

              {formData.usedParts.length > 0 && (
                <div className="space-y-1.5">
                  {formData.usedParts.map(p => (
                    <div key={p.partId} className="flex items-center justify-between p-2 rounded bg-white text-xs border border-slate-200">
                      <span className="text-slate-800 font-bold">{p.name} (x{p.qty})</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[#0A3963] font-extrabold">${p.totalCost.toFixed(2)} USD</span>
                        <button
                          type="button"
                          onClick={() => handleRemovePart(p.partId)}
                          className="text-red-500 hover:text-red-700 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Desglose y Edición Abierta de Costos */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-white border border-slate-200 text-xs items-center">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Costo Materiales</label>
                  <p className="text-sm font-extrabold text-slate-900">${totalPartsCost.toFixed(2)} USD</p>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Mano de Obra ($ USD)</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1.5 text-slate-400 font-bold text-xs">$</span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={formData.totalLaborCost}
                      onChange={(e) => setFormData(prev => ({ ...prev, totalLaborCost: parseFloat(e.target.value) || 0 }))}
                      placeholder="0.00"
                      className="w-full pl-6 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:bg-white focus:border-[#8CC63F] outline-none"
                    />
                  </div>
                </div>

                <div className="text-right sm:border-l sm:border-slate-200 sm:pl-3">
                  <p className="text-[11px] font-bold text-slate-500 uppercase">Costo Total</p>
                  <p className="text-base font-extrabold text-[#0A3963]">${grandTotal.toFixed(2)} USD</p>
                </div>
              </div>
            </div>

            
            {/* 3. Fotografías & Evidencia Visual de la Orden */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-xs font-bold text-[#0A3963] uppercase tracking-wider flex items-center gap-1.5">
                    <Icon name="camera" className="w-4 h-4 text-[#8CC63F]" />
                    <span>3. Fotografías & Evidencia Visual de la Orden</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Sube fotos de antes, durante o después de la intervención para documentar la orden de trabajo.
                  </p>
                </div>

                <label className="cursor-pointer px-3.5 py-1.5 rounded-lg btn-park-green text-white text-xs font-extrabold shadow-xs hover:scale-105 transition-all flex items-center gap-1.5 shrink-0">
                  <Icon name="camera" className="w-3.5 h-3.5" />
                  <span>{isUploadingPhoto ? 'Procesando...' : '+ Subir Fotos'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={isUploadingPhoto}
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>
              </div>

              {formData.photos && formData.photos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
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
              ) : (
                <div className={`text-center py-6 border-2 border-dashed rounded-xl transition-all ${isDraggingPhotos ? 'border-[#8CC63F] bg-white' : 'border-slate-200 bg-white/60'}`}>
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-1.5">
                    <Icon name="camera" className="w-5 h-5 text-slate-400" />
                  </div>
                  <p className="text-xs font-bold text-slate-700">Sin fotografías adjuntas</p>
                  <p className="text-[11px] text-slate-500">
                    Arrastra y suelta tus fotos aquí o usa el botón "+ Subir Fotos" para documentar la orden.
                  </p>
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
                      if (isEdit) {
                        onSave({
                          ...formData,
                          technicianNotes: '',
                          updatedAt: new Date().toISOString(),
                          lastUpdatedBy: effectiveUser.full_name || effectiveUser.name || 'Usuario'
                        });
                      }
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
                  onBlur={() => {
                    if (isEdit) {
                      onSave({
                        ...formData,
                        technicianNotes: formData.technicianNotes,
                        updatedAt: new Date().toISOString(),
                        lastUpdatedBy: effectiveUser.full_name || effectiveUser.name || 'Usuario'
                      });
                    }
                  }}
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
                    <span>{formData.status === 'Completada' ? '↺ Reabrir Orden' : '✓ Marcar como Completada'}</span>
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
                  onChange={(e) => setNewCommentText(e.target.value)}
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

// Assets
const Assets = ({ assets = [], workOrders = [], onSaveAsset, onDeleteAsset }) => {
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
          <span>+ Registrar Nuevo Activo / Equipo</span>
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
                    className={`w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white outline-none font-medium ${
                      formErrors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 focus:border-[#8CC63F]'
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
                    className={`w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white outline-none font-mono font-bold ${
                      formErrors.code ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 focus:border-[#8CC63F]'
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
                    className={`w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white outline-none font-medium ${
                      formErrors.location ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 focus:border-[#8CC63F]'
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

// PreventiveMaintenance
const PreventiveMaintenance = ({ schedules = [], onGenerateWOFromPM }) => (
  <div className="space-y-6">
    <div className="p-6 rounded-2xl park-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0A3963] font-heading">
          Mantenimiento Preventivo (PM)
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Programación de rutinas periódicas y generación automatizada | PlataformaPark
        </p>
      </div>
    </div>

    {schedules.length === 0 ? (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
        <span className="text-4xl block">📅</span>
        <h3 className="text-sm font-bold text-slate-700">No hay planes preventivos programados</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Aquí aparecerán las rutinas periódicas (semanales, mensuales, trimestrales) asignadas a tus equipos.
        </p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schedules.map((pm) => (
          <div key={pm.id} className="p-6 rounded-2xl park-card space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#0A3963]">{pm.id}</span>
                <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                  {pm.frequency}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 font-heading">
                {pm.title}
              </h3>

              <p className="text-xs text-slate-600 font-medium">
                ⚙️ Activo: <span className="font-bold text-slate-900">{pm.assetName}</span>
              </p>
              <p className="text-xs text-slate-500 font-medium">
                👤 Técnico Asignado: <span className="text-slate-800 font-bold">{pm.assignedTech}</span>
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[10px] font-medium">Próxima Fecha: <b className="text-[#0A3963] font-bold">{pm.nextDueDate}</b></span>
              <button
                onClick={() => onGenerateWOFromPM(pm)}
                className="px-3.5 py-2 rounded btn-park-green text-xs font-extrabold shadow hover:scale-105 transition-transform"
              >
                <Icon name="zap" className="w-4 h-4 mr-1.5" /> Generar Orden de Trabajo
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// Inventory
const Inventory = ({ inventory = [], onUpdateStock, onSavePart, onDeletePart }) => {
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

  
// Consolidated PDF Generator Modal (en Centro de Reportes)
const ExportPdfModal = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  const { workOrders = [] } = data;
  const [selectedStatus, setSelectedStatus] = React.useState('ALL');
  const [selectedPriority, setSelectedPriority] = React.useState('ALL');

  const handleExportConsolidated = () => {
    const filtered = workOrders.filter(w => {
      const matchesStatus = selectedStatus === 'ALL' || w.status === selectedStatus;
      const matchesPriority = selectedPriority === 'ALL' || w.priority === selectedPriority;
      return matchesStatus && matchesPriority;
    });

    generateParkPdfReport({
      type: 'CONSOLIDATED',
      data: { ...data, filteredWorkOrders: filtered },
      exportOptions: {
        filterDesc: `Estado: ${selectedStatus} | Prioridad: ${selectedPriority}`
      }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xl">📄</span>
            <h2 className="text-lg font-extrabold text-[#0A3963] font-heading">
              Reporte Consolidado de Mantenimiento
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Filtrar por Estado</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 font-medium outline-none"
            >
              <option value="ALL">Todos los Estados</option>
              <option value="Abierta">Abierta</option>
              <option value="En Proceso">En Proceso</option>
              <option value="Completada">Completada</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Filtrar por Prioridad</label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 font-medium outline-none"
            >
              <option value="ALL">Todas las Prioridades</option>
              <option value="Urgente">Urgente</option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-slate-100 text-xs font-bold text-slate-700">
            Cancelar
          </button>
          <button
            onClick={handleExportConsolidated}
            className="px-6 py-2 rounded btn-park-green text-xs shadow hover:scale-105 transition-transform"
          >
            <Icon name="pdf" className="w-4 h-4 mr-1.5" /> Descargar PDF Consolidado
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. APLICACIÓN PRINCIPAL (App)
// ==========================================
function App() {
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

  // Guardar cambios del perfil de usuario
  const handleSaveProfile = (updatedProfile) => {
    setCurrentUser(prev => {
      const merged = { ...prev, ...updatedProfile };
      localStorage.setItem('cmms_user', JSON.stringify(merged));
      return merged;
    });

    // Actualizar también en la lista de usuarios global
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
  };

  const handleDeleteAsset = (assetId) => {
    setData(prev => ({
      ...prev,
      assets: (prev.assets || []).filter(item => item.id !== assetId)
    }));
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
  };

  const handleDeletePart = (partId) => {
    setData(prev => ({
      ...prev,
      inventory: (prev.inventory || []).filter(item => item.id !== partId)
    }));
  };

  const handleSaveUser = (userToSave) => {
    setData(prev => {
      const existing = (prev.users || []).find(u => u.id === userToSave.id);
      let updatedUsers;
      if (existing) {
        updatedUsers = (prev.users || []).map(u => u.id === userToSave.id ? userToSave : u);
      } else {
        const newUser = {
          ...userToSave,
          id: userToSave.id || `u-${userToSave.role || 'user'}-${Date.now().toString().slice(-4)}`,
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
  };

  const handleDeleteUser = (userId) => {
    setData(prev => ({
      ...prev,
      users: (prev.users || []).filter(u => u.id !== userId)
    }));
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
  };

  const handleLogout = () => {
    localStorage.removeItem('cmms_user');
    localStorage.removeItem('cmms_auth_token');
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
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
  };

  const handleStatusChange = (woId, newStatus) => {
    setData(prev => ({
      ...prev,
      workOrders: prev.workOrders.map(w => w.id === woId ? { ...w, status: newStatus } : w)
    }));
  };

  const handleUpdateStock = (partId, newStock) => {
    setData(prev => ({
      ...prev,
      inventory: prev.inventory.map(item => item.id === partId ? { ...item, currentStock: newStock } : item)
    }));
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
      signatureData: null
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
    setSelectedWO(wo);
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
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', background: '#fee', color: 'red' }}>
          <h1>Something went wrong.</h1>
          <pre>{this.state.error && this.state.error.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

// Render root cleanly
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<ErrorBoundary><App /></ErrorBoundary>);
}
