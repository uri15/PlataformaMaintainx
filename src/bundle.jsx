// PLATAFORMA PARK CMMS — GRUPO FAVIER
// Flujo Simplificado: Botón Único en Header y Generación de PDF Integrada en la Orden de Trabajo

// ==========================================
// 1. DATOS INICIALES DE PRUEBA (initialData)
// ==========================================
const initialData = {
  company: {
    name: "GRUPO FAVIER",
    platform: "PLATAFORMA PARK CMMS",
    subtitle: "Sistema de Mantenimiento de Infraestructura & Parques Industriales",
    logoText: "PARK",
    groupText: "GRUPO FAVIER",
    contactEmail: "mantenimiento@grupofavier.com",
    phone: "+52 (33) 3800-PARK",
    address: "Av. Paseo Royal #500, Corporativo Grupo Favier"
  },
  assets: [
    {
      id: "AST-101",
      code: "PARK-EQ-501",
      name: "Subestación Eléctrica Principal 500kVA",
      category: "Eléctrico",
      location: "Park Industrial Guadalajara - Edificio A",
      development: "Park Industrial Guadalajara",
      brand: "Schneider Electric",
      model: "Trihal 500kVA 23kV/480V",
      serialNumber: "SE-2023-8891-GF",
      status: "Operativo",
      criticality: "Alta",
      installationDate: "2022-03-15",
      mttrHours: 2.5,
      mtbfDays: 120,
      totalMaintenanceCost: 1450.00,
      specs: "Transformador seco encapsulado 500 kVA, Gabinete NEMA 3R, Interruptor principal de 800A."
    },
    {
      id: "AST-102",
      code: "PARK-EQ-102",
      name: "Sistema Chiller Central HVAC 120 TR",
      category: "Climatización / HVAC",
      location: "Park Plaza Ejecutiva - Azotea",
      development: "Park Plaza Ejecutiva",
      brand: "Carrier",
      model: "AquaSnap 30RB120",
      serialNumber: "CAR-30RB-99412",
      status: "En Mantenimiento",
      criticality: "Alta",
      installationDate: "2021-08-10",
      mttrHours: 4.0,
      mtbfDays: 65,
      totalMaintenanceCost: 3280.00,
      specs: "Enfriador de agua por aire con refrigerante R-410A, 2 circuitos independientes, compresores Scroll."
    },
    {
      id: "AST-103",
      code: "PARK-EQ-204",
      name: "Elevador Panorámico de Pasajeros #02",
      category: "Electromecánico",
      location: "Park Royal Residencial - Torre 1",
      development: "Park Royal Residencial",
      brand: "Otis",
      model: "Gen2 Comfort 1000kg",
      serialNumber: "OTIS-G2-77319",
      status: "Fuera de Servicio",
      criticality: "Alta",
      installationDate: "2023-01-20",
      mttrHours: 6.0,
      mtbfDays: 45,
      totalMaintenanceCost: 4120.00,
      specs: "Capacidad 13 pasajeros (1000 kg), 15 paradas, velocidad 1.75 m/s, cintas planas de acero recubiertas de poliuretano."
    },
    {
      id: "AST-104",
      code: "PARK-EQ-305",
      name: "Planta de Luz de Emergencia 250 kW",
      category: "Generación Power",
      location: "Park Logistics Hub - Nave 3",
      development: "Park Logistics Hub",
      brand: "Caterpillar",
      model: "DE250E0 250kW Diésel",
      serialNumber: "CAT-C9-44120-GF",
      status: "Operativo",
      criticality: "Alta",
      installationDate: "2022-11-05",
      mttrHours: 1.8,
      mtbfDays: 180,
      totalMaintenanceCost: 890.00,
      specs: "Motor Cat C9 ACERT, Tanque de combustible base 500L, Caseta acustizada 75 dBA @ 7m."
    },
    {
      id: "AST-105",
      code: "PARK-EQ-408",
      name: "Sistema Contra Incendio Bombeo Central",
      category: "Hidrosanitario & Seguridad",
      location: "Park Industrial Guadalajara - Cuarto de Bombas",
      development: "Park Industrial Guadalajara",
      brand: "Grundfos",
      model: "Hydro MPC-E 3 CR64-2",
      serialNumber: "GRU-PCI-88301",
      status: "Operativo",
      criticality: "Alta",
      installationDate: "2020-05-18",
      mttrHours: 3.0,
      mtbfDays: 90,
      totalMaintenanceCost: 2150.00,
      specs: "Bomba principal diésel 75 HP + Bomba eléctrica 75 HP + Bomba Jockey 5 HP. Caudal 1000 GPM @ 125 PSI."
    },
    {
      id: "AST-106",
      code: "PARK-EQ-612",
      name: "Portón Automatizado Heavy Duty Acceso Sur",
      category: "Control de Acceso",
      location: "Park Logistics Hub - Caseta 1",
      development: "Park Logistics Hub",
      brand: "FAAC",
      model: "844 ER 3PH 1800kg",
      serialNumber: "FAAC-844-00291",
      status: "Operativo",
      criticality: "Media",
      installationDate: "2023-04-12",
      mttrHours: 1.2,
      mtbfDays: 75,
      totalMaintenanceCost: 430.00,
      specs: "Motorreductor en baño de aceite, embrague bidisco de seguridad, frecuencia de uso industrial 100%."
    }
  ],
  workOrders: [
    {
      id: "WO-8041",
      code: "WO-8041",
      title: "Inspección Trimestral Termográfica y Ajuste de Subestación 500kVA",
      description: "Realizar inspección termográfica de conexiones de alta y baja tensión, apretar par de apriete en bornes, limpiar aisladores y verificar puesta a tierra.",
      priority: "Media",
      status: "Completada",
      category: "Preventivo",
      assetId: "AST-101",
      assetName: "Subestación Eléctrica Principal 500kVA",
      development: "Park Industrial Guadalajara",
      location: "Edificio A - Cuarto Eléctrico Principal",
      assignedTech: "Ing. Carlos Mendoza",
      assignedTechRole: "Técnico Senior Eléctrico",
      createdDate: "2026-07-15T09:00:00",
      dueDate: "2026-07-20T18:00:00",
      completedDate: "2026-07-19T14:30:00",
      estimatedHours: 3.5,
      actualHours: 3.0,
      checklist: [
        { id: 1, text: "Verificar ausencias de tensión y colocar bloqueo LOTO de seguridad.", completed: true, timestamp: "2026-07-19 09:15" },
        { id: 2, text: "Escanear termográficamente clemas y transformador en carga.", completed: true, timestamp: "2026-07-19 10:00" },
        { id: 3, text: "Limpiar polvo acumulado en aletas con aire seco a presión.", completed: true, timestamp: "2026-07-19 11:20" },
        { id: 4, text: "Torquear tornillería a 45 Nm según especificación de fabricante.", completed: true, timestamp: "2026-07-19 12:45" },
        { id: 5, text: "Prueba de continuidad de tierra y reapertura de interruptor.", completed: true, timestamp: "2026-07-19 14:10" }
      ],
      usedParts: [
        { partId: "PRT-004", name: "Fusible de Alta Tensión 100A 15kV", qty: 1, unitCost: 120.00, totalCost: 120.00 },
        { partId: "PRT-008", name: "Limpiador Dieléctrico de Contactos 500ml", qty: 2, unitCost: 18.50, totalCost: 37.00 }
      ],
      totalPartsCost: 157.00,
      totalLaborCost: 180.00,
      grandTotal: 337.00,
      technicianNotes: "Mantenimiento realizado satisfactoriamente. Se detectó ligera sobretemperatura en fase B antes del torqueo, resuelto al ajustar tornillo suelto. Parámetros normales.",
      signatureData: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='60'><path d='M 10 40 Q 30 10 60 40 T 120 30 T 180 50' stroke='%238CC63F' stroke-width='3' fill='none'/><text x='10' y='55' fill='%230A3963' font-size='10'>Firma: C. Mendoza</text></svg>"
    },
    {
      id: "WO-8042",
      code: "WO-8042",
      title: "Reemplazo de Filtros y Lubricación General de Chiller Carrier",
      description: "Sustitución de filtros de aire de condensadores, verificación de presión de gas R-410A, lubricación de rodamientos de ventilador axial y purga de aceite.",
      priority: "Alta",
      status: "En Proceso",
      category: "Preventivo",
      assetId: "AST-102",
      assetName: "Sistema Chiller Central HVAC 120 TR",
      development: "Park Plaza Ejecutiva",
      location: "Azotea - Área de Enfriadores",
      assignedTech: "Téc. Roberto Gómez",
      assignedTechRole: "Especialista HVAC",
      createdDate: "2026-07-25T10:30:00",
      dueDate: "2026-07-30T17:00:00",
      completedDate: null,
      estimatedHours: 5.0,
      actualHours: 2.5,
      checklist: [
        { id: 1, text: "Apagar unidad Chiller desde BMS de la plaza.", completed: true, timestamp: "2026-07-28 08:30" },
        { id: 2, text: "Retirar filtros MERV 13 saturados y colocar repuestos nuevos.", completed: true, timestamp: "2026-07-28 10:15" },
        { id: 3, text: "Medir presiones de succión y descarga en circuitos 1 y 2.", completed: true, timestamp: "2026-07-28 11:45" },
        { id: 4, text: "Lubricar chumaceras de ventiladores axiales con grasa de litio.", completed: false, timestamp: null },
        { id: 5, text: "Revisar alineación de poleas y tensión de correas.", completed: false, timestamp: null }
      ],
      usedParts: [
        { partId: "PRT-001", name: "Filtro de Aire HVAC 24x24x2 MERV 13", qty: 4, unitCost: 45.00, totalCost: 180.00 },
        { partId: "PRT-002", name: "Aceite Sintético para Compresor Garrafa 20L", qty: 1, unitCost: 185.00, totalCost: 185.00 }
      ],
      totalPartsCost: 365.00,
      totalLaborCost: 250.00,
      grandTotal: 615.00,
      technicianNotes: "Filtros colocados. Avance del 60%. Mañana se concluye lubricación de chumaceras.",
      signatureData: null
    },
    {
      id: "WO-8043",
      code: "WO-8043",
      title: "Reparación Urgente: Elevador Otis #02 Fuera de Servicio",
      description: "El elevador se bloqueó en el piso 8 debido a falla en cortina infrarroja de fotocelda de seguridad de puertas. Residentes sin acceso panorámico.",
      priority: "Urgente",
      status: "Abierta",
      category: "Correctivo",
      assetId: "AST-103",
      assetName: "Elevador Panorámico de Pasajeros #02",
      development: "Park Royal Residencial",
      location: "Torre 1 - Piso 8",
      assignedTech: "Ing. Alejandro Silva",
      assignedTechRole: "Especialista Elevación Otis",
      createdDate: "2026-07-29T08:15:00",
      dueDate: "2026-07-29T14:00:00",
      completedDate: null,
      estimatedHours: 2.0,
      actualHours: 0.0,
      checklist: [
        { id: 1, text: "Intervenir fosa y cabina con señalética de Fuera de Servicio.", completed: false, timestamp: null },
        { id: 2, text: "Diagnosticar código de falla en cuadro de control OTIS Gen2.", completed: false, timestamp: null },
        { id: 3, text: "Reemplazar sensor fotoeléctrico de la puerta de cabina.", completed: false, timestamp: null },
        { id: 4, text: "Realizar 10 viajes de prueba de apertura/cierre de puertas.", completed: false, timestamp: null }
      ],
      usedParts: [
        { partId: "PRT-005", name: "Sensor Fotoeléctrico de Presencia Omron", qty: 1, unitCost: 85.00, totalCost: 85.00 }
      ],
      totalPartsCost: 85.00,
      totalLaborCost: 160.00,
      grandTotal: 245.00,
      technicianNotes: "Atención inmediata requerida. Refacción en ruta con el técnico.",
      signatureData: null
    },
    {
      id: "WO-8044",
      code: "WO-8044",
      title: "Prueba Operativa en Vacío y Con Carga - Planta Caterpillar 250kW",
      description: "Arranque mensual de prueba de la planta de emergencia diésel, verificación de transferencia automática (ATS), nivel de electrolito y presión de aceite.",
      priority: "Media",
      status: "Abierta",
      category: "Preventivo",
      assetId: "AST-104",
      assetName: "Planta de Luz de Emergencia 250 kW",
      development: "Park Logistics Hub",
      location: "Nave 3 - Caseta de Generador",
      assignedTech: "Téc. Fernando Ruiz",
      assignedTechRole: "Técnico Electromecánico",
      createdDate: "2026-07-27T11:00:00",
      dueDate: "2026-07-31T12:00:00",
      completedDate: null,
      estimatedHours: 2.0,
      actualHours: 0.0,
      checklist: [
        { id: 1, text: "Inspeccionar nivel de combustible diésel y refrigerante.", completed: false, timestamp: null },
        { id: 2, text: "Verificar voltaje de batería de arranque (mínimo 24.5V CD).", completed: false, timestamp: null },
        { id: 3, text: "Arrancar en modo Manual durante 15 minutos sin carga.", completed: false, timestamp: null },
        { id: 4, text: "Simular corte de suministro en ATS y verificar conmutación a los 8 segundos.", completed: false, timestamp: null }
      ],
      usedParts: [],
      totalPartsCost: 0.00,
      totalLaborCost: 100.00,
      grandTotal: 100.00,
      technicianNotes: "Programado para viernes a mediodía.",
      signatureData: null
    },
    {
      id: "WO-8045",
      code: "WO-8045",
      title: "Calibración de Presostatos y Prueba de Válvulas PCI Grundfos",
      description: "Ajuste de puntos de arranque de bomba Jockey y bomba principal contra incendios. Pruebas de estanqueidad de tuberías.",
      priority: "Baja",
      status: "En Espera",
      category: "Inspección",
      assetId: "AST-105",
      assetName: "Sistema Contra Incendio Bombeo Central",
      development: "Park Industrial Guadalajara",
      location: "Cuarto de Bombas",
      assignedTech: "Ing. Carlos Mendoza",
      assignedTechRole: "Técnico Senior Eléctrico",
      createdDate: "2026-07-26T14:00:00",
      dueDate: "2026-08-02T17:00:00",
      completedDate: null,
      estimatedHours: 4.0,
      actualHours: 0.0,
      checklist: [
        { id: 1, text: "Drenar manómetro de prueba y verificar manómetros patrones.", completed: false, timestamp: null },
        { id: 2, text: "Ajustar presostato Jockey a 130 PSI disparo / 145 PSI paro.", completed: false, timestamp: null },
        { id: 3, text: "Probar disparo de bomba diésel principal por caída de presión.", completed: false, timestamp: null }
      ],
      usedParts: [],
      totalPartsCost: 0.00,
      totalLaborCost: 200.00,
      grandTotal: 200.00,
      technicianNotes: "En espera de llegada de manómetro digital de calibración externa.",
      signatureData: null
    }
  ],
  inventory: [
    {
      id: "PRT-001",
      sku: "FIL-HVAC-2424",
      name: "Filtro de Aire HVAC 24x24x2 MERV 13",
      category: "Climatización",
      currentStock: 4,
      minStock: 8,
      unitCost: 45.00,
      unit: "Pieza",
      supplier: "Filtros Industriales de México S.A.",
      location: "Almacén Central - RACK A-2"
    },
    {
      id: "PRT-002",
      sku: "OIL-SYN-68L",
      name: "Aceite Sintético para Compresor Garrafa 20L",
      category: "Lubricantes",
      currentStock: 6,
      minStock: 3,
      unitCost: 185.00,
      unit: "Garrafa",
      supplier: "Mobil Industrial Lubricants",
      location: "Almacén Químicos - Estante B"
    },
    {
      id: "PRT-003",
      sku: "ROD-SKF-6208",
      name: "Rodamiento Industrial SKF 6208 2RS",
      category: "Mecánica",
      currentStock: 12,
      minStock: 5,
      unitCost: 32.00,
      unit: "Pieza",
      supplier: "Rodamientos y Bandas del Pacífico",
      location: "Almacén Central - RACK C-1"
    },
    {
      id: "PRT-004",
      sku: "FUS-HV-100A",
      name: "Fusible de Alta Tensión 100A 15kV",
      category: "Eléctrico",
      currentStock: 2,
      minStock: 4,
      unitCost: 120.00,
      unit: "Pieza",
      supplier: "Eléctrica Industrial Favier",
      location: "Almacén Eléctrico - Gabinete 3"
    },
    {
      id: "PRT-005",
      sku: "SEN-OMR-E3Z",
      name: "Sensor Fotoeléctrico de Presencia Omron",
      category: "Automatización",
      currentStock: 1,
      minStock: 3,
      unitCost: 85.00,
      unit: "Pieza",
      supplier: "Omron Automation Mexico",
      location: "Almacén Electrónico - Cajón D"
    },
    {
      id: "PRT-006",
      sku: "BAN-GAT-B85",
      name: "Banda de Transmisión Industrial Gates V-Belt B-85",
      category: "Mecánica",
      currentStock: 15,
      minStock: 6,
      unitCost: 28.00,
      unit: "Pieza",
      supplier: "Gates de México",
      location: "Almacén Central - RACK C-3"
    },
    {
      id: "PRT-007",
      sku: "BAT-CTP-100",
      name: "Batería CTP 12V 100Ah para Planta Diésel",
      category: "Generación",
      currentStock: 3,
      minStock: 2,
      unitCost: 210.00,
      unit: "Pieza",
      supplier: "Acumuladores Industriales",
      location: "Almacén Planta Baja"
    },
    {
      id: "PRT-008",
      sku: "QUIM-DIE-500",
      name: "Limpiador Dieléctrico de Contactos 500ml",
      category: "Químicos",
      currentStock: 18,
      minStock: 5,
      unitCost: 18.50,
      unit: "Lata Spray",
      supplier: "CRC Industries",
      location: "Almacén Químicos"
    }
  ],
  preventiveSchedules: [
    {
      id: "PM-101",
      title: "Mantenimiento Preventivo Trimestral de Subestación 500kVA",
      assetId: "AST-101",
      assetName: "Subestación Eléctrica Principal 500kVA",
      frequency: "Trimestral",
      nextDueDate: "2026-10-15",
      assignedTech: "Ing. Carlos Mendoza",
      estimatedHours: 4.0,
      active: true
    },
    {
      id: "PM-102",
      title: "Revisión Mensual de Chiller Carrier 120 TR",
      assetId: "AST-102",
      assetName: "Sistema Chiller Central HVAC 120 TR",
      frequency: "Mensual",
      nextDueDate: "2026-08-25",
      assignedTech: "Téc. Roberto Gómez",
      estimatedHours: 5.0,
      active: true
    },
    {
      id: "PM-103",
      title: "Mantenimiento Semanal de Elevador Otis #02",
      assetId: "AST-103",
      assetName: "Elevador Panorámico de Pasajeros #02",
      frequency: "Semanal",
      nextDueDate: "2026-08-03",
      assignedTech: "Ing. Alejandro Silva",
      estimatedHours: 2.0,
      active: true
    },
    {
      id: "PM-104",
      title: "Arranque de Prueba Mensual Planta Diésel Caterpillar",
      assetId: "AST-104",
      assetName: "Planta de Luz de Emergencia 250 kW",
      frequency: "Mensual",
      nextDueDate: "2026-08-27",
      assignedTech: "Téc. Fernando Ruiz",
      estimatedHours: 2.0,
      active: true
    }
  ],
  technicians: [
    { id: "TCH-01", name: "Ing. Carlos Mendoza", role: "Técnico Senior Eléctrico", email: "carlos.mendoza@grupofavier.com", phone: "+52 33 1122 3344", activeOrders: 2 },
    { id: "TCH-02", name: "Téc. Roberto Gómez", role: "Especialista HVAC", email: "roberto.gomez@grupofavier.com", phone: "+52 33 2233 4455", activeOrders: 1 },
    { id: "TCH-03", name: "Ing. Alejandro Silva", role: "Especialista Elevación Otis", email: "alejandro.silva@grupofavier.com", phone: "+52 33 3344 5566", activeOrders: 1 },
    { id: "TCH-04", name: "Téc. Fernando Ruiz", role: "Técnico Electromecánico", email: "fernando.ruiz@grupofavier.com", phone: "+52 33 4455 6677", activeOrders: 1 }
  ]
};

// ==========================================
// 2. PERSISTENCIA DE DATOS (storage)
// ==========================================
const STORAGE_KEY = 'PARK_CMMS_FAVIER_DATA_V1';

const getStoredData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      return initialData;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading localStorage", e);
    return initialData;
  }
};

const saveStoredData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving to localStorage", e);
  }
};

const resetStoredData = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  } catch (e) {
    console.error("Error resetting localStorage", e);
    return initialData;
  }
};

// ==========================================
// 3. LOGO SVG OFICIAL (Plataforma PARK)
// ==========================================
const ParkLogo = () => (
  <svg width="38" height="38" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 shadow-xs rounded">
    <rect width="40" height="40" rx="3" fill="#0A3963"/>
    <rect x="10" y="10" width="17" height="17" fill="white"/>
    <rect x="24" y="24" width="13" height="13" fill="#8CC63F"/>
  </svg>
);

// ==========================================
// 4. GENERADOR DE REPORTES PDF (pdfGenerator)
// ==========================================
const generateParkPdfReport = ({ type = 'SINGLE_WO', workOrder = null, data = {}, exportOptions = {} }) => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const addHeader = (titleText, subtitleText = "") => {
    doc.setFillColor(10, 57, 99);
    doc.rect(0, 0, 210, 32, 'F');

    doc.setFillColor(140, 198, 63);
    doc.rect(0, 32, 210, 2.5, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("PLATAFORMA PARK", 14, 18);

    doc.setTextColor(140, 198, 63);
    doc.setFontSize(9.5);
    doc.setFont("helvetica", "bold");
    doc.text("G R U P O   F A V I E R", 14, 25);

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(titleText.toUpperCase(), 196, 16, { align: "right" });

    doc.setTextColor(140, 198, 63);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(subtitleText || "REPORTE OFICIAL DE OPERACIONES E INFRAESTRUCTURA", 196, 23, { align: "right" });
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
    doc.text("PLATAFORMA PARK © GRUPO FAVIER | Documento Confidencial de Control de Calidad e Infraestructura", 14, pageHeight - 6);
    doc.text(`Página ${pageNo} de ${totalPages}`, 196, pageHeight - 6, { align: "right" });
  };

  if (type === 'SINGLE_WO' && workOrder) {
    addHeader("ORDEN DE TRABAJO", `FOLIO: ${workOrder.code}`);

    let startY = 42;

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, startY, 182, 38, 2, 2, 'FD');

    doc.setTextColor(10, 57, 99);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(workOrder.title, 18, startY + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Desarrollo / Parque: `, 18, startY + 16);
    doc.setTextColor(10, 57, 99);
    doc.setFont("helvetica", "bold");
    doc.text(`${workOrder.development} (${workOrder.location})`, 50, startY + 16);

    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.text(`Activo Asociado: `, 18, startY + 23);
    doc.setTextColor(10, 57, 99);
    doc.setFont("helvetica", "bold");
    doc.text(`${workOrder.assetName}`, 45, startY + 23);

    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.text(`Técnico Asignado: `, 18, startY + 30);
    doc.setTextColor(10, 57, 99);
    doc.setFont("helvetica", "bold");
    doc.text(`${workOrder.assignedTech} - ${workOrder.assignedTechRole}`, 45, startY + 30);

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("Prioridad:", 135, startY + 16);
    doc.text("Estado:", 135, startY + 23);
    doc.text("Fecha Emisión:", 135, startY + 30);

    let pColor = [59, 130, 246];
    if (workOrder.priority === 'Urgente') pColor = [239, 68, 68];
    else if (workOrder.priority === 'Alta') pColor = [249, 115, 22];
    else if (workOrder.priority === 'Media') pColor = [245, 158, 11];

    doc.setFillColor(...pColor);
    doc.roundedRect(155, startY + 12, 35, 6, 1, 1, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text(workOrder.priority.toUpperCase(), 172.5, startY + 16.5, { align: "center" });

    let sColor = [59, 130, 246];
    if (workOrder.status === 'Completada') sColor = [22, 101, 52];
    else if (workOrder.status === 'En Proceso') sColor = [147, 51, 234];

    doc.setFillColor(...sColor);
    doc.roundedRect(155, startY + 19, 35, 6, 1, 1, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text(workOrder.status.toUpperCase(), 172.5, startY + 23.5, { align: "center" });

    doc.setTextColor(10, 57, 99);
    doc.setFont("helvetica", "bold");
    doc.text(new Date(workOrder.createdDate).toLocaleDateString("es-MX"), 160, startY + 30);

    startY += 45;

    doc.setTextColor(10, 57, 99);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("1. DESCRIPCIÓN DEL REQUERIMIENTO", 14, startY);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    const splitDesc = doc.splitTextToSize(workOrder.description, 182);
    doc.text(splitDesc, 14, startY + 6);

    startY += 8 + (splitDesc.length * 5);

    if (exportOptions.includeChecklist !== false && workOrder.checklist && workOrder.checklist.length > 0) {
      doc.setTextColor(10, 57, 99);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("2. PROCEDIMIENTO & CHECKLIST DE SEGURIDAD Y VERIFICACIÓN", 14, startY);

      const checklistRows = workOrder.checklist.map(item => [
        item.id,
        item.text,
        item.completed ? "COMPLETADO [ ✓ ]" : "PENDIENTE [   ]",
        item.timestamp || "---"
      ]);

      doc.autoTable({
        startY: startY + 3,
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

    if (exportOptions.includeParts !== false) {
      doc.setTextColor(10, 57, 99);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("3. REPUESTOS, MATERIALES Y DESGLOSE DE COSTOS", 14, startY);

      const partsRows = (workOrder.usedParts && workOrder.usedParts.length > 0)
        ? workOrder.usedParts.map(p => [
            p.partId || "SKU",
            p.name,
            p.qty,
            `$${p.unitCost.toFixed(2)} USD`,
            `$${p.totalCost.toFixed(2)} USD`
          ])
        : [["---", "Sin repuestos registrados para esta orden", "0", "$0.00", "$0.00"]];

      doc.autoTable({
        startY: startY + 3,
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

    if (startY > 230) {
      doc.addPage();
      addHeader("ORDEN DE TRABAJO", `FOLIO: ${workOrder.code}`);
      startY = 42;
    }

    doc.setTextColor(10, 57, 99);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("4. OBSERVACIONES TÉCNICAS Y CONFORMIDAD OPERATIVA", 14, startY);

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, startY + 4, 182, 18, 2, 2, 'FD');

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    doc.text(workOrder.technicianNotes || "Sin observaciones adicionales registradas por el técnico.", 18, startY + 12);

    startY += 28;

    if (exportOptions.includeSignature !== false) {
      doc.setDrawColor(140, 198, 63);
      doc.setLineWidth(0.5);
      doc.line(14, startY + 18, 85, startY + 18);
      doc.line(110, startY + 18, 182, startY + 18);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(10, 57, 99);
      doc.text(workOrder.assignedTech, 49.5, startY + 23, { align: "center" });
      doc.text("Ing. Supervisor de Mantenimiento", 146, startY + 23, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("Firma del Técnico Operativo", 49.5, startY + 27, { align: "center" });
      doc.text("Validación y Conformidad Grupo Favier", 146, startY + 27, { align: "center" });
    }

    addFooter(1, 1);
    doc.save(`PARK_GrupoFavier_${workOrder.code}.pdf`);
  } 
  else {
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
    doc.text(`$${totalCost.toFixed(2)} USD`, 168, startY + 12, { align: "center" });

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
    doc.setFontSize(10);
    doc.text(`Filtro Aplicado: ${filterDesc}`, 14, startY);

    startY += 5;

    const reportRows = workOrders.map(wo => [
      wo.code,
      wo.title,
      wo.development,
      wo.priority,
      wo.status,
      wo.assignedTech.split(" ")[1] || wo.assignedTech,
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

    doc.save(`PARK_GrupoFavier_Reporte_Consolidado.pdf`);
  }
};

// ==========================================
// 5. COMPONENTES REACT (HEADER CON BOTÓN ÚNICO)
// ==========================================

// Header — CON UN SOLO BOTÓN PRINCIPAL
const Header = ({ searchTerm, setSearchTerm, onNewWorkOrder, lowStockCount }) => (
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
            INFRAESTRUCTURA & MANTENIMIENTO | GRUPO FAVIER
          </p>
        </div>
      </div>

      <div className="relative flex-1 max-w-md w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          🔍
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar órdenes de trabajo, activos, repuestos..."
          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#8CC63F] focus:bg-white transition-all"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-700">
            ✕
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        {lowStockCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold animate-pulse">
            ⚠️ <span>{lowStockCount} Stock Crítico</span>
          </div>
        )}

        {/* UN SOLO BOTÓN PRINCIPAL EN EL HEADER */}
        <button
          onClick={onNewWorkOrder}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg btn-park-green text-sm shadow-md hover:scale-[1.02] transition-transform"
        >
          ➕ <span>Nuevo Reporte / Orden</span>
        </button>
      </div>
    </div>
  </header>
);

// Sidebar
const Sidebar = ({ activeTab, setActiveTab, openCount, lowStockCount }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Operativo', icon: '📊' },
    { id: 'workOrders', label: 'Órdenes de Trabajo', icon: '📋', badge: openCount > 0 ? openCount : null },
    { id: 'assets', label: 'Activos & Equipos', icon: '⚙️' },
    { id: 'preventive', label: 'Mantenimiento Preventivo', icon: '📅' },
    { id: 'inventory', label: 'Repuestos e Inventario', icon: '📦', badge: lowStockCount > 0 ? lowStockCount : null, badgeColor: 'bg-amber-500 text-white' },
    { id: 'reports', label: 'Centro de Reportes PDF', icon: '📄' }
  ];

  return (
    <aside className="w-full lg:w-64 bg-white border-r border-slate-200 flex flex-col p-4 gap-6 shrink-0 min-h-[calc(100vh-65px)]">
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#0A3963] flex items-center justify-center text-[#8CC63F] font-bold text-sm shadow-xs">
          GF
        </div>
        <div className="overflow-hidden">
          <p className="text-xs font-bold text-slate-900 truncate">Ing. Supervisor Park</p>
          <p className="text-[10px] text-slate-500 font-medium truncate">mantenimiento@grupofavier.com</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1.5 flex-1">
        <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
          Módulos Principales
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
              <div className="flex items-center gap-3">
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${item.badgeColor || 'bg-[#8CC63F] text-white'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[10px] text-slate-500 text-center">
        <p className="font-bold text-slate-800">PLATAFORMA PARK v2.5</p>
        <p className="text-[#8CC63F] font-bold mt-0.5">Grupo Favier © 2026</p>
      </div>
    </aside>
  );
};

// Dashboard
const Dashboard = ({ data, onSelectWO, onNewWO }) => {
  const { workOrders = [], assets = [], inventory = [] } = data;

  const totalWO = workOrders.length;
  const openWO = workOrders.filter(w => w.status === 'Abierta').length;
  const inProgressWO = workOrders.filter(w => w.status === 'En Proceso').length;
  const completedWO = workOrders.filter(w => w.status === 'Completada').length;
  const urgentWO = workOrders.filter(w => w.priority === 'Urgente').length;

  const totalCost = workOrders.reduce((sum, w) => sum + (w.grandTotal || 0), 0);
  const outOfServiceAssets = assets.filter(a => a.status === 'Fuera de Servicio').length;
  const lowStockCount = inventory.filter(i => i.currentStock <= i.minStock).length;

  const urgentList = workOrders.filter(w => w.priority === 'Urgente' || w.status === 'Abierta').slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl park-card">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0A3963] font-heading">
            Resumen Operativo de Mantenimiento
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Plataforma PARK — Control e Indicadores en Tiempo Real | Grupo Favier
          </p>
        </div>
        <button
          onClick={onNewWO}
          className="px-5 py-2.5 rounded-lg btn-park-green text-white font-extrabold text-xs shadow hover:scale-[1.02] transition-transform"
        >
          ⚡ Crear Nuevo Reporte / Orden
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl park-card park-card-hover flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Órdenes Totales</p>
            <h3 className="text-3xl font-extrabold text-[#0A3963] mt-1 font-heading">{totalWO}</h3>
            <p className="text-xs text-emerald-600 font-semibold mt-1">
              ✓ {completedWO} completadas ({Math.round((completedWO/totalWO)*100 || 0)}%)
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-2xl">
            📋
          </div>
        </div>

        <div className="p-5 rounded-xl park-card park-card-hover flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Activas / En Proceso</p>
            <h3 className="text-3xl font-extrabold text-amber-600 mt-1 font-heading">{openWO + inProgressWO}</h3>
            <p className="text-xs text-amber-700 font-semibold mt-1">
              {openWO} abiertas | {inProgressWO} en ejecución
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-2xl">
            ⚙️
          </div>
        </div>

        <div className="p-5 rounded-xl park-card park-card-hover flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Atención Crítica</p>
            <h3 className="text-3xl font-extrabold text-red-600 mt-1 font-heading">{urgentWO}</h3>
            <p className="text-xs text-red-600 font-semibold mt-1">
              🚨 {outOfServiceAssets} Equipos Fuera de Servicio
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-2xl">
            🚨
          </div>
        </div>

        <div className="p-5 rounded-xl park-card park-card-hover flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inversión Acumulada</p>
            <h3 className="text-2xl font-extrabold text-[#0A3963] mt-1 font-heading">
              ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Materiales + Mano de obra
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-2xl">
            💵
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
              MaintainX Feed
            </span>
          </div>

          <div className="space-y-3">
            {urgentList.map((wo) => {
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
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#0A3963] transition-colors">
                      {wo.title}
                    </h4>
                    <p className="text-xs text-slate-500">
                      📍 {wo.development} • <span className="text-slate-700 font-semibold">{wo.assetName}</span>
                    </p>
                  </div>

                  <div className="flex items-center sm:flex-col sm:items-end justify-between gap-1 shrink-0">
                    <span className="text-xs font-bold text-slate-700">👤 {wo.assignedTech}</span>
                    <span className="text-xs font-extrabold text-[#0A3963]">
                      ${(wo.grandTotal || 0).toFixed(2)} USD
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl park-card space-y-4">
            <h2 className="text-lg font-extrabold text-[#0A3963] font-heading">Estado de Equipos</h2>
            <div className="space-y-3">
              {assets.slice(0, 4).map((ast) => {
                let statusColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
                if (ast.status === 'Fuera de Servicio') statusColor = "text-red-700 bg-red-50 border-red-200";
                else if (ast.status === 'En Mantenimiento') statusColor = "text-amber-700 bg-amber-50 border-amber-200";

                return (
                  <div key={ast.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{ast.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{ast.code} • {ast.development}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${statusColor}`}>
                      {ast.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-6 rounded-2xl park-card space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-[#0A3963] font-heading">Alertas de Almacén</h2>
              <span className="text-xs text-amber-700 font-bold">{lowStockCount} Bajo Stock</span>
            </div>
            {lowStockCount > 0 ? (
              <div className="space-y-2">
                {inventory.filter(i => i.currentStock <= i.minStock).map((item) => (
                  <div key={item.id} className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-amber-900">{item.name}</p>
                      <p className="text-[10px] text-amber-700 font-medium">SKU: {item.sku}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-red-600">{item.currentStock} / {item.minStock} {item.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-emerald-600 font-bold">✓ Todos los repuestos están en niveles óptimos.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// WorkOrders
const WorkOrders = ({ workOrders, onSelectWO, onNewWO, onExportSinglePdf, onStatusChange, searchTerm }) => {
  const [viewMode, setViewMode] = React.useState('list');
  const [filterPriority, setFilterPriority] = React.useState('ALL');
  const [filterStatus, setFilterStatus] = React.useState('ALL');
  const [filterCategory, setFilterCategory] = React.useState('ALL');

  const filtered = workOrders.filter((wo) => {
    const matchesSearch = searchTerm === '' || 
      wo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.assignedTech.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority = filterPriority === 'ALL' || wo.priority === filterPriority;
    const matchesStatus = filterStatus === 'ALL' || wo.status === filterStatus;
    const matchesCategory = filterCategory === 'ALL' || wo.category === filterCategory;

    return matchesSearch && matchesPriority && matchesStatus && matchesCategory;
  });

  const statuses = ['Abierta', 'En Proceso', 'En Espera', 'Completada'];

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl park-card space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0A3963] font-heading">
              Órdenes de Trabajo (Work Orders)
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Gestión operativa completa estilo MaintainX | Plataforma PARK Grupo Favier
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

            <button
              onClick={onNewWO}
              className="px-4 py-2 rounded-lg btn-park-green text-xs shadow hover:scale-[1.02] transition-transform"
            >
              ➕ Crear Orden
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-200">
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
              Estado
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:border-[#8CC63F] outline-none font-medium"
            >
              <option value="ALL">Todos los Estados</option>
              <option value="Abierta">🔵 Abierta</option>
              <option value="En Proceso">🟣 En Proceso</option>
              <option value="En Espera">🟡 En Espera</option>
              <option value="Completada">🟢 Completada</option>
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
              <option value="Eléctrico">Eléctrico</option>
              <option value="Climatización / HVAC">Climatización / HVAC</option>
            </select>
          </div>
        </div>
      </div>

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
                <th className="py-3 px-3 text-right">Costo</th>
                <th className="py-3 px-3 text-center">Generar Reporte</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {filtered.map((wo) => {
                let pClass = "badge-low";
                if (wo.priority === 'Urgente') pClass = "badge-urgent";
                else if (wo.priority === 'Alta') pClass = "badge-high";
                else if (wo.priority === 'Media') pClass = "badge-medium";

                let sClass = "badge-open";
                if (wo.status === 'Completada') sClass = "badge-completed";
                else if (wo.status === 'En Proceso') sClass = "badge-in-progress";

                return (
                  <tr 
                    key={wo.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  >
                    <td className="py-3.5 px-3 font-bold text-[#0A3963] font-mono" onClick={() => onSelectWO(wo)}>
                      {wo.code}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-slate-900 group-hover:text-[#0A3963]" onClick={() => onSelectWO(wo)}>
                      {wo.title}
                      <p className="text-[10px] text-slate-500 font-medium">{wo.category}</p>
                    </td>
                    <td className="py-3.5 px-3 text-slate-700" onClick={() => onSelectWO(wo)}>
                      <p className="font-semibold text-slate-900">{wo.development}</p>
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onExportSinglePdf(wo);
                        }}
                        title="Generar y Descargar Reporte PDF de la Orden"
                        className="px-3 py-1.5 rounded btn-park-blue text-[11px] font-extrabold transition-transform hover:scale-105 shadow-xs flex items-center gap-1 mx-auto"
                      >
                        📄 <span>Generar PDF</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

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
                          📍 {wo.development}
                        </p>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                          <span className="text-slate-700 font-semibold">👤 {wo.assignedTech.split(' ')[1] || wo.assignedTech}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onExportSinglePdf(wo);
                            }}
                            className="px-2 py-0.5 rounded bg-blue-50 text-[#0A3963] hover:bg-blue-100 font-extrabold border border-blue-200 flex items-center gap-1"
                          >
                            📄 Generar PDF
                          </button>
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
          🧹 Limpiar Firma
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

// WorkOrderModal (CON BOTÓN DIRECTO DE GENERACIÓN DE PDF DENTRO DE LA ORDEN)
const WorkOrderModal = ({ isOpen, onClose, onSave, workOrder, assets, inventory, technicians, onExportPdf }) => {
  if (!isOpen) return null;

  const isEdit = Boolean(workOrder && workOrder.id);

  const [formData, setFormData] = React.useState({
    id: workOrder?.id || `WO-${Math.floor(1000 + Math.random() * 9000)}`,
    code: workOrder?.code || `WO-${Math.floor(1000 + Math.random() * 9000)}`,
    title: workOrder?.title || '',
    description: workOrder?.description || '',
    priority: workOrder?.priority || 'Media',
    status: workOrder?.status || 'Abierta',
    category: workOrder?.category || 'Preventivo',
    assetId: workOrder?.assetId || (assets[0]?.id || ''),
    assignedTech: workOrder?.assignedTech || (technicians[0]?.name || ''),
    assignedTechRole: workOrder?.assignedTechRole || 'Técnico Operativo',
    dueDate: workOrder?.dueDate ? workOrder.dueDate.substring(0, 10) : new Date().toISOString().substring(0, 10),
    estimatedHours: workOrder?.estimatedHours || 2.0,
    actualHours: workOrder?.actualHours || 0.0,
    checklist: workOrder?.checklist || [
      { id: 1, text: 'Revisión y bloqueo de seguridad LOTO', completed: false, timestamp: null },
      { id: 2, text: 'Ejecución de mantenimiento técnico de rutina', completed: false, timestamp: null },
      { id: 3, text: 'Pruebas de funcionamiento e inspección final', completed: false, timestamp: null }
    ],
    usedParts: workOrder?.usedParts || [],
    technicianNotes: workOrder?.technicianNotes || '',
    signatureData: workOrder?.signatureData || null
  });

  const [newChecklistItem, setNewChecklistItem] = React.useState('');
  const [selectedPartId, setSelectedPartId] = React.useState(inventory[0]?.id || '');
  const [partQty, setPartQty] = React.useState(1);

  const selectedAsset = assets.find(a => a.id === formData.assetId) || assets[0];

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

  const totalPartsCost = formData.usedParts.reduce((sum, p) => sum + p.totalCost, 0);
  const totalLaborCost = (formData.actualHours || formData.estimatedHours || 2) * 50;
  const grandTotal = totalPartsCost + totalLaborCost;

  const handleSubmitAndGeneratePdf = (shouldGeneratePdf = false) => {
    const finalData = {
      ...formData,
      assetName: selectedAsset?.name || 'Activo General',
      development: selectedAsset?.development || 'Park Industrial',
      location: selectedAsset?.location || 'Área Principal',
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 bg-[#0A3963] text-white">
          <div className="flex items-center gap-3">
            <ParkLogo />
            <div>
              <h2 className="text-lg font-bold text-white font-heading">
                {isEdit ? `Orden de Trabajo: ${formData.code}` : 'Nuevo Reporte / Orden de Trabajo'}
              </h2>
              <p className="text-xs text-[#8CC63F] font-bold">PLATAFORMA PARK — GRUPO FAVIER</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSubmitAndGeneratePdf(true)}
              className="px-3.5 py-1.5 rounded btn-park-green text-xs font-extrabold shadow-sm hover:scale-105 transition-transform flex items-center gap-1.5"
            >
              📄 <span>Generar Reporte PDF</span>
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white text-xl p-1 font-bold">
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmitAndGeneratePdf(false); }} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
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
              <label className="text-xs font-bold text-slate-700 block mb-1">Activo / Equipo *</label>
              <select
                value={formData.assetId}
                onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#8CC63F] focus:bg-white outline-none font-medium"
              >
                {assets.map(ast => (
                  <option key={ast.id} value={ast.id}>
                    {ast.name} ({ast.development})
                  </option>
                ))}
              </select>
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
              <label className="text-xs font-bold text-slate-700 block mb-1">Estado</label>
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
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Técnico Asignado</label>
              <select
                value={formData.assignedTech}
                onChange={(e) => setFormData({ ...formData, assignedTech: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#8CC63F] focus:bg-white outline-none font-medium"
              >
                {technicians.map(t => (
                  <option key={t.id} value={t.name}>{t.name} ({t.role})</option>
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

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-[#0A3963] uppercase tracking-wider">
              1. Procedimiento & Checklist de Verificación paso a paso
            </h3>

            <div className="space-y-2">
              {formData.checklist.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2.5 rounded bg-white border border-slate-200 text-xs">
                  <label className="flex items-center gap-2.5 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={item.completed}
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

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-[#0A3963] uppercase tracking-wider">
              2. Asignación de Repuestos & Cálculo de Costo Total
            </h3>

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

            <div className="p-3 rounded bg-white border border-[#8CC63F]/50 flex justify-between items-center text-xs">
              <span className="text-slate-600 font-medium">Materiales: <b>${totalPartsCost.toFixed(2)}</b> | Mano de Obra: <b>${totalLaborCost.toFixed(2)}</b></span>
              <span className="text-sm font-extrabold text-[#0A3963]">TOTAL: ${grandTotal.toFixed(2)} USD</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <SignaturePad
              initialSignature={formData.signatureData}
              onSaveSignature={(sig) => setFormData(prev => ({ ...prev, signatureData: sig }))}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200 flex-wrap gap-3">
            <button
              type="button"
              onClick={() => handleSubmitAndGeneratePdf(true)}
              className="px-5 py-2 rounded-lg btn-park-blue text-xs font-extrabold shadow-sm flex items-center gap-2"
            >
              📄 <span>Guardar y Generar PDF Oficial</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg btn-park-green text-xs shadow hover:scale-105 transition-transform"
              >
                💾 Guardar Orden
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

// Assets
const Assets = ({ assets, workOrders, onNewWO }) => {
  const [selectedAsset, setSelectedAsset] = React.useState(null);

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl park-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0A3963] font-heading">
            Gestión de Activos & Infraestructura
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Inventario técnico de equipos en desarrollos de Grupo Favier
          </p>
        </div>
        <button
          onClick={onNewWO}
          className="px-4 py-2 rounded-lg btn-park-green text-xs shadow hover:scale-[1.02] transition-transform shrink-0"
        >
          ➕ Generar Orden para Activo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map((asset) => {
          let statusBadge = "badge-completed";
          if (asset.status === 'Fuera de Servicio') statusBadge = "badge-urgent";
          else if (asset.status === 'En Mantenimiento') statusBadge = "badge-medium";

          const historyWO = workOrders.filter(w => w.assetId === asset.id);

          return (
            <div
              key={asset.id}
              onClick={() => setSelectedAsset(asset)}
              className="p-5 rounded-2xl park-card park-card-hover cursor-pointer space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#0A3963]">{asset.code}</span>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold ${statusBadge}`}>
                    {asset.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0A3963] font-heading">
                  {asset.name}
                </h3>

                <p className="text-xs text-slate-600 font-medium">
                  📍 {asset.location}
                </p>
                <p className="text-[11px] text-slate-500">
                  🏷️ Marca: <span className="text-slate-800 font-semibold">{asset.brand}</span> ({asset.model})
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
                <span className="text-slate-500 text-[10px] font-medium">MTTR: {asset.mttrHours}h | MTBF: {asset.mtbfDays}d</span>
                <span className="text-[#8CC63F] font-bold hover:underline">Ver Expediente →</span>
              </div>
            </div>
          );
        })}
      </div>

      {selectedAsset && (
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
                <p className="font-bold text-slate-900">{selectedAsset.development}</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-500 font-medium">Ubicación Físico-Específica</p>
                <p className="font-bold text-slate-900">{selectedAsset.location}</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-500 font-medium">Número de Serie</p>
                <p className="font-mono text-[#0A3963] font-bold">{selectedAsset.serialNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-500 font-medium">Costo Acumulado Reparaciones</p>
                <p className="font-extrabold text-emerald-700">${selectedAsset.totalMaintenanceCost.toFixed(2)} USD</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-[#0A3963]">Especificaciones Técnicas:</p>
              <p className="text-slate-700 font-medium">{selectedAsset.specs}</p>
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

            <div className="flex justify-end pt-2">
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
const PreventiveMaintenance = ({ schedules, onGenerateWOFromPM }) => (
  <div className="space-y-6">
    <div className="p-6 rounded-2xl park-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0A3963] font-heading">
          Mantenimiento Preventivo (PM)
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Programación de rutinas periódicas y generación automatizada | Grupo Favier
        </p>
      </div>
    </div>

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
              ⚡ Generar Orden de Trabajo
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Inventory
const Inventory = ({ inventory, onUpdateStock }) => {
  const [editingItem, setEditingItem] = React.useState(null);
  const [stockDelta, setStockDelta] = React.useState(0);

  const handleSaveStock = () => {
    if (!editingItem) return;
    const newStock = Math.max(0, editingItem.currentStock + Number(stockDelta));
    onUpdateStock(editingItem.id, newStock);
    setEditingItem(null);
    setStockDelta(0);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl park-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0A3963] font-heading">
            Repuestos & Control de Almacén
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Inventario de refacciones e insumos de mantenimiento | Plataforma PARK
          </p>
        </div>
      </div>

      <div className="p-6 rounded-2xl park-card overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-extrabold text-[#0A3963] uppercase tracking-wider bg-slate-50">
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
          <tbody className="divide-y divide-slate-200 text-xs">
            {inventory.map((item) => {
              const isLow = item.currentStock <= item.minStock;

              return (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-3 font-mono font-bold text-[#0A3963]">{item.sku}</td>
                  <td className="py-3.5 px-3 font-bold text-slate-900">
                    {item.name}
                    <p className="text-[10px] text-slate-500 font-normal">{item.location}</p>
                  </td>
                  <td className="py-3.5 px-3 text-slate-700 font-medium">{item.category}</td>
                  <td className="py-3.5 px-3 text-center font-extrabold text-base text-slate-900">
                    {item.currentStock} {item.unit}
                  </td>
                  <td className="py-3.5 px-3 text-center text-slate-500 font-medium">
                    {item.minStock} {item.unit}
                  </td>
                  <td className="py-3.5 px-3 text-right font-extrabold text-[#0A3963]">
                    ${item.unitCost.toFixed(2)} USD
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    {isLow ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-50 text-red-600 border border-red-200 animate-pulse">
                        ⚠️ Reordenar
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
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
                      className="px-2.5 py-1 rounded btn-park-blue text-[10px] font-bold shadow-xs"
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

      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-extrabold text-slate-900 text-base">Ajuste de Stock: {editingItem.name}</h3>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Stock Actual: <b className="text-[#0A3963] font-bold">{editingItem.currentStock} {editingItem.unit}</b>
            </p>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Entrada (+) / Salida (-) de repuestos</label>
              <input
                type="number"
                value={stockDelta}
                onChange={(e) => setStockDelta(e.target.value)}
                placeholder="Ej. 5 o -2"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-bold outline-none focus:border-[#8CC63F]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setEditingItem(null)} className="px-4 py-2 rounded bg-slate-100 text-xs font-bold text-slate-700">
                Cancelar
              </button>
              <button onClick={handleSaveStock} className="px-4 py-2 rounded btn-park-green text-xs shadow-xs">
                💾 Guardar Ajuste
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
            ⚡ Descargar PDF Consolidado
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
  const [data, setData] = React.useState(getStoredData());
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const [selectedWO, setSelectedWO] = React.useState(null);
  const [isWOModalOpen, setIsWOModalOpen] = React.useState(false);
  const [isPdfExportModalOpen, setIsPdfExportModalOpen] = React.useState(false);

  React.useEffect(() => {
    saveStoredData(data);
  }, [data]);

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
      />

      <div className="flex-1 flex flex-col lg:flex-row">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openCount={openCount}
          lowStockCount={lowStockCount}
        />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {activeTab === 'dashboard' && (
            <Dashboard
              data={data}
              onSelectWO={openEditWOModal}
              onNewWO={openNewWOModal}
            />
          )}

          {activeTab === 'workOrders' && (
            <WorkOrders
              workOrders={data.workOrders}
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
              onNewWO={openNewWOModal}
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
                Generación de informes consolidados de mantenimiento con membrete corporativo de Grupo Favier, tablas de procedimiento y desgloses.
              </p>
              <button
                onClick={() => setIsPdfExportModalOpen(true)}
                className="px-6 py-3 rounded-xl btn-park-green text-white font-extrabold text-sm shadow-md hover:scale-105 transition-transform"
              >
                ⚡ Generar Reporte Consolidado PDF
              </button>
            </div>
          )}
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
      />

      <ExportPdfModal
        isOpen={isPdfExportModalOpen}
        onClose={() => setIsPdfExportModalOpen(false)}
        data={data}
      />
    </div>
  );
}

// Render root cleanly
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
