import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// PLATAFORMA PARK CMMS — PLATAFORMAPARK
// Flujo Simplificado: Botón Único en Header y Generación de PDF Integrada en la Orden de Trabajo

// ==========================================
// 1. DATOS INICIALES DE PRUEBA (initialData)
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
  assets: [{
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
  }, {
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
  }, {
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
  }, {
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
  }, {
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
  }, {
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
  }],
  workOrders: [{
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
    checklist: [{
      id: 1,
      text: "Verificar ausencias de tensión y colocar bloqueo LOTO de seguridad.",
      completed: true,
      timestamp: "2026-07-19 09:15"
    }, {
      id: 2,
      text: "Escanear termográficamente clemas y transformador en carga.",
      completed: true,
      timestamp: "2026-07-19 10:00"
    }, {
      id: 3,
      text: "Limpiar polvo acumulado en aletas con aire seco a presión.",
      completed: true,
      timestamp: "2026-07-19 11:20"
    }, {
      id: 4,
      text: "Torquear tornillería a 45 Nm según especificación de fabricante.",
      completed: true,
      timestamp: "2026-07-19 12:45"
    }, {
      id: 5,
      text: "Prueba de continuidad de tierra y reapertura de interruptor.",
      completed: true,
      timestamp: "2026-07-19 14:10"
    }],
    usedParts: [{
      partId: "PRT-004",
      name: "Fusible de Alta Tensión 100A 15kV",
      qty: 1,
      unitCost: 120.00,
      totalCost: 120.00
    }, {
      partId: "PRT-008",
      name: "Limpiador Dieléctrico de Contactos 500ml",
      qty: 2,
      unitCost: 18.50,
      totalCost: 37.00
    }],
    totalPartsCost: 157.00,
    totalLaborCost: 180.00,
    grandTotal: 337.00,
    technicianNotes: "Mantenimiento realizado satisfactoriamente. Se detectó ligera sobretemperatura en fase B antes del torqueo, resuelto al ajustar tornillo suelto. Parámetros normales.",
    signatureData: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='60'><path d='M 10 40 Q 30 10 60 40 T 120 30 T 180 50' stroke='%23D4AF37' stroke-width='3' fill='none'/><text x='10' y='55' fill='%2394A3B8' font-size='10'>Firma: C. Mendoza</text></svg>"
  }, {
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
    checklist: [{
      id: 1,
      text: "Apagar unidad Chiller desde BMS de la plaza.",
      completed: true,
      timestamp: "2026-07-28 08:30"
    }, {
      id: 2,
      text: "Retirar filtros MERV 13 saturados y colocar repuestos nuevos.",
      completed: true,
      timestamp: "2026-07-28 10:15"
    }, {
      id: 3,
      text: "Medir presiones de succión y descarga en circuitos 1 y 2.",
      completed: true,
      timestamp: "2026-07-28 11:45"
    }, {
      id: 4,
      text: "Lubricar chumaceras de ventiladores axiales con grasa de litio.",
      completed: false,
      timestamp: null
    }, {
      id: 5,
      text: "Revisar alineación de poleas y tensión de correas.",
      completed: false,
      timestamp: null
    }],
    usedParts: [{
      partId: "PRT-001",
      name: "Filtro de Aire HVAC 24x24x2 MERV 13",
      qty: 4,
      unitCost: 45.00,
      totalCost: 180.00
    }, {
      partId: "PRT-002",
      name: "Aceite Sintético para Compresor Garrafa 20L",
      qty: 1,
      unitCost: 185.00,
      totalCost: 185.00
    }],
    totalPartsCost: 365.00,
    totalLaborCost: 250.00,
    grandTotal: 615.00,
    technicianNotes: "Filtros colocados. Avance del 60%. Mañana se concluye lubricación de chumaceras.",
    signatureData: null
  }, {
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
    checklist: [{
      id: 1,
      text: "Intervenir fosa y cabina con señalética de Fuera de Servicio.",
      completed: false,
      timestamp: null
    }, {
      id: 2,
      text: "Diagnosticar código de falla en cuadro de control OTIS Gen2.",
      completed: false,
      timestamp: null
    }, {
      id: 3,
      text: "Reemplazar sensor fotoeléctrico de la puerta de cabina.",
      completed: false,
      timestamp: null
    }, {
      id: 4,
      text: "Realizar 10 viajes de prueba de apertura/cierre de puertas.",
      completed: false,
      timestamp: null
    }],
    usedParts: [{
      partId: "PRT-005",
      name: "Sensor Fotoeléctrico de Presencia Omron",
      qty: 1,
      unitCost: 85.00,
      totalCost: 85.00
    }],
    totalPartsCost: 85.00,
    totalLaborCost: 160.00,
    grandTotal: 245.00,
    technicianNotes: "Atención inmediata requerida. Refacción en ruta con el técnico.",
    signatureData: null
  }, {
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
    checklist: [{
      id: 1,
      text: "Inspeccionar nivel de combustible diésel y refrigerante.",
      completed: false,
      timestamp: null
    }, {
      id: 2,
      text: "Verificar voltaje de batería de arranque (mínimo 24.5V CD).",
      completed: false,
      timestamp: null
    }, {
      id: 3,
      text: "Arrancar en modo Manual durante 15 minutos sin carga.",
      completed: false,
      timestamp: null
    }, {
      id: 4,
      text: "Simular corte de suministro en ATS y verificar conmutación a los 8 segundos.",
      completed: false,
      timestamp: null
    }],
    usedParts: [],
    totalPartsCost: 0.00,
    totalLaborCost: 100.00,
    grandTotal: 100.00,
    technicianNotes: "Programado para viernes a mediodía.",
    signatureData: null
  }, {
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
    checklist: [{
      id: 1,
      text: "Drenar manómetro de prueba y verificar manómetros patrones.",
      completed: false,
      timestamp: null
    }, {
      id: 2,
      text: "Ajustar presostato Jockey a 130 PSI disparo / 145 PSI paro.",
      completed: false,
      timestamp: null
    }, {
      id: 3,
      text: "Probar disparo de bomba diésel principal por caída de presión.",
      completed: false,
      timestamp: null
    }],
    usedParts: [],
    totalPartsCost: 0.00,
    totalLaborCost: 200.00,
    grandTotal: 200.00,
    technicianNotes: "En espera de llegada de manómetro digital de calibración externa.",
    signatureData: null
  }],
  inventory: [{
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
  }, {
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
  }, {
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
  }, {
    id: "PRT-004",
    sku: "FUS-HV-100A",
    name: "Fusible de Alta Tensión 100A 15kV",
    category: "Eléctrico",
    currentStock: 2,
    minStock: 4,
    unitCost: 120.00,
    unit: "Pieza",
    supplier: "Eléctrica Industrial PlataformaPark",
    location: "Almacén Eléctrico - Gabinete 3"
  }, {
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
  }, {
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
  }, {
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
  }, {
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
  }],
  preventiveSchedules: [{
    id: "PM-101",
    title: "Mantenimiento Preventivo Trimestral de Subestación 500kVA",
    assetId: "AST-101",
    assetName: "Subestación Eléctrica Principal 500kVA",
    frequency: "Trimestral",
    nextDueDate: "2026-10-15",
    assignedTech: "Ing. Carlos Mendoza",
    estimatedHours: 4.0,
    active: true
  }, {
    id: "PM-102",
    title: "Revisión Mensual de Chiller Carrier 120 TR",
    assetId: "AST-102",
    assetName: "Sistema Chiller Central HVAC 120 TR",
    frequency: "Mensual",
    nextDueDate: "2026-08-25",
    assignedTech: "Téc. Roberto Gómez",
    estimatedHours: 5.0,
    active: true
  }, {
    id: "PM-103",
    title: "Mantenimiento Semanal de Elevador Otis #02",
    assetId: "AST-103",
    assetName: "Elevador Panorámico de Pasajeros #02",
    frequency: "Semanal",
    nextDueDate: "2026-08-03",
    assignedTech: "Ing. Alejandro Silva",
    estimatedHours: 2.0,
    active: true
  }, {
    id: "PM-104",
    title: "Arranque de Prueba Mensual Planta Diésel Caterpillar",
    assetId: "AST-104",
    assetName: "Planta de Luz de Emergencia 250 kW",
    frequency: "Mensual",
    nextDueDate: "2026-08-27",
    assignedTech: "Téc. Fernando Ruiz",
    estimatedHours: 2.0,
    active: true
  }],
  technicians: [{
    id: "TCH-01",
    name: "Ing. Carlos Mendoza",
    role: "Técnico Senior Eléctrico",
    email: "carlos.mendoza@plataformapark.com",
    phone: "+52 33 1122 3344",
    activeOrders: 2
  }, {
    id: "TCH-02",
    name: "Téc. Roberto Gómez",
    role: "Especialista HVAC",
    email: "roberto.gomez@plataformapark.com",
    phone: "+52 33 2233 4455",
    activeOrders: 1
  }, {
    id: "TCH-03",
    name: "Ing. Alejandro Silva",
    role: "Especialista Elevación Otis",
    email: "alejandro.silva@plataformapark.com",
    phone: "+52 33 3344 5566",
    activeOrders: 1
  }, {
    id: "TCH-04",
    name: "Téc. Fernando Ruiz",
    role: "Técnico Electromecánico",
    email: "fernando.ruiz@plataformapark.com",
    phone: "+52 33 4455 6677",
    activeOrders: 1
  }]
};
const STORAGE_KEY = 'PARK_CMMS_PLATAFORMAPARK_DATA_V1';
const getStoredData = () => {
  try {
    localStorage.removeItem('PARK_CMMS_FAVIER_DATA_V1');
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      let cleanJson = saved.replace(/GRUPO FAVIER/g, 'PLATAFORMAPARK').replace(/Grupo Favier/g, 'PlataformaPark').replace(/grupofavier\.com/g, 'plataformapark.com').replace(/Favier/g, 'PlataformaPark');
      const parsed = JSON.parse(cleanJson);
      return {
        ...initialData,
        ...parsed,
        workOrders: parsed.workOrders || initialData.workOrders || [],
        assets: parsed.assets || initialData.assets || [],
        inventory: parsed.inventory || initialData.inventory || [],
        preventiveSchedules: parsed.preventiveSchedules || initialData.preventiveSchedules || [],
        technicians: parsed.technicians || initialData.technicians || []
      };
    }
  } catch (e) {
    console.error("Error reading localStorage", e);
  }
  return initialData;
};
const saveStoredData = data => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving localStorage", e);
  }
};

// ==========================================
// 4. GENERADOR DE REPORTES PDF (pdfGenerator)
// ==========================================
const generateParkPdfReport = ({
  type = 'SINGLE_WO',
  workOrder = null,
  data = {},
  exportOptions = {}
}) => {
  const {
    jsPDF
  } = window.jspdf;
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
    if (formattedTitle.length > 25) {
      doc.setFontSize(9);
      doc.text(formattedTitle, 196, 14, {
        align: "right"
      });
    } else if (formattedTitle.length > 18) {
      doc.setFontSize(10.5);
      doc.text(formattedTitle, 196, 15, {
        align: "right"
      });
    } else {
      doc.setFontSize(13);
      doc.text(formattedTitle, 196, 16, {
        align: "right"
      });
    }
    doc.setTextColor(140, 198, 63);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.text(subtitleText || "REPORTE OFICIAL DE OPERACIONES E INFRAESTRUCTURA", 196, 23, {
      align: "right"
    });
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
    doc.text(`Página ${pageNo} de ${totalPages}`, 196, pageHeight - 6, {
      align: "right"
    });
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
    const safeTitle = workOrder.title.length > 50 ? workOrder.title.substring(0, 48) + '...' : workOrder.title;
    doc.text(safeTitle, 18, startY + 8);
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
    if (workOrder.priority === 'Urgente') pColor = [239, 68, 68];else if (workOrder.priority === 'Alta') pColor = [249, 115, 22];else if (workOrder.priority === 'Media') pColor = [245, 158, 11];
    doc.setFillColor(...pColor);
    doc.roundedRect(155, startY + 12, 35, 6, 1, 1, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text(workOrder.priority.toUpperCase(), 172.5, startY + 16.5, {
      align: "center"
    });
    let sColor = [59, 130, 246];
    if (workOrder.status === 'Completada') sColor = [22, 101, 52];else if (workOrder.status === 'En Proceso') sColor = [147, 51, 234];
    doc.setFillColor(...sColor);
    doc.roundedRect(155, startY + 19, 35, 6, 1, 1, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text(workOrder.status.toUpperCase(), 172.5, startY + 23.5, {
      align: "center"
    });
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
    startY += 8 + splitDesc.length * 5;
    if (exportOptions.includeChecklist !== false && workOrder.checklist && workOrder.checklist.length > 0) {
      doc.setTextColor(10, 57, 99);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("2. PROCEDIMIENTO & CHECKLIST DE SEGURIDAD Y VERIFICACIÓN", 14, startY);
      const checklistRows = workOrder.checklist.map(item => [item.id, item.text, item.completed ? "COMPLETADO [ ✓ ]" : "PENDIENTE [   ]", item.timestamp || "---"]);
      doc.autoTable({
        startY: startY + 3,
        head: [['#', 'Paso / Tarea de Verificación', 'Estado', 'Timestamp']],
        body: checklistRows,
        theme: 'striped',
        headStyles: {
          fillColor: [10, 57, 99],
          textColor: [140, 198, 63],
          fontStyle: 'bold'
        },
        columnStyles: {
          0: {
            cellWidth: 10,
            halign: 'center'
          },
          1: {
            cellWidth: 105
          },
          2: {
            cellWidth: 35,
            halign: 'center',
            fontStyle: 'bold'
          },
          3: {
            cellWidth: 32,
            halign: 'center'
          }
        },
        styles: {
          fontSize: 8.5,
          cellPadding: 2.5
        }
      });
      startY = doc.lastAutoTable.finalY + 8;
    }
    if (exportOptions.includeParts !== false) {
      doc.setTextColor(10, 57, 99);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("3. REPUESTOS, MATERIALES Y DESGLOSE DE COSTOS", 14, startY);
      const partsRows = workOrder.usedParts && workOrder.usedParts.length > 0 ? workOrder.usedParts.map(p => [p.partId || "SKU", p.name, p.qty, `$${p.unitCost.toFixed(2)} USD`, `$${p.totalCost.toFixed(2)} USD`]) : [["---", "Sin repuestos registrados para esta orden", "0", "$0.00", "$0.00"]];
      doc.autoTable({
        startY: startY + 3,
        head: [['SKU / ID', 'Descripción del Repuesto', 'Cant.', 'Costo Unit.', 'Subtotal']],
        body: partsRows,
        theme: 'grid',
        headStyles: {
          fillColor: [10, 57, 99],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        columnStyles: {
          0: {
            cellWidth: 25
          },
          1: {
            cellWidth: 95
          },
          2: {
            cellWidth: 15,
            halign: 'center'
          },
          3: {
            cellWidth: 23,
            halign: 'right'
          },
          4: {
            cellWidth: 24,
            halign: 'right',
            fontStyle: 'bold'
          }
        },
        styles: {
          fontSize: 8.5,
          cellPadding: 2.5
        }
      });
      startY = doc.lastAutoTable.finalY + 4;
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(140, 198, 63);
      doc.rect(114, startY, 82, 22, 'FD');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "normal");
      doc.text("Total Materiales:", 118, startY + 6);
      doc.text(`$${(workOrder.totalPartsCost || 0).toFixed(2)} USD`, 190, startY + 6, {
        align: "right"
      });
      doc.text("Mano de Obra Estimada/Real:", 118, startY + 11);
      doc.text(`$${(workOrder.totalLaborCost || 0).toFixed(2)} USD`, 190, startY + 11, {
        align: "right"
      });
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(10, 57, 99);
      doc.text("COSTO TOTAL ORDEN:", 118, startY + 18);
      doc.setTextColor(140, 198, 63);
      doc.text(`$${(workOrder.grandTotal || 0).toFixed(2)} USD`, 190, startY + 18, {
        align: "right"
      });
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
      doc.text(workOrder.assignedTech, 49.5, startY + 23, {
        align: "center"
      });
      doc.text("Ing. Supervisor de Mantenimiento", 146, startY + 23, {
        align: "center"
      });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("Firma del Técnico Operativo", 49.5, startY + 27, {
        align: "center"
      });
      doc.text("Validación y Conformidad PlataformaPark", 146, startY + 27, {
        align: "center"
      });
    }
    addFooter(1, 1);
    doc.save(`PARK_PlataformaPark_${workOrder.code}.pdf`);
  } else {
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
    doc.text(`${totalWO}`, 35, startY + 12, {
      align: "center"
    });
    doc.text(`${completedWO}`, 80, startY + 12, {
      align: "center"
    });
    doc.text(`${urgentWO}`, 125, startY + 12, {
      align: "center"
    });
    doc.text(`$${totalCost.toFixed(2)} USD`, 168, startY + 12, {
      align: "center"
    });
    doc.setTextColor(248, 250, 252);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("TOTAL ÓRDENES", 35, startY + 20, {
      align: "center"
    });
    doc.text("COMPLETADAS", 80, startY + 20, {
      align: "center"
    });
    doc.text("URGENTES", 125, startY + 20, {
      align: "center"
    });
    doc.text("GASTO ACUMULADO", 168, startY + 20, {
      align: "center"
    });
    startY += 35;
    doc.setTextColor(10, 57, 99);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(`Filtro Aplicado: ${filterDesc}`, 14, startY);
    startY += 5;
    const reportRows = workOrders.map(wo => [wo.code, wo.title, wo.development, wo.priority, wo.status, wo.assignedTech.split(" ")[1] || wo.assignedTech, `$${(wo.grandTotal || 0).toFixed(2)} USD`]);
    doc.autoTable({
      startY: startY + 2,
      head: [['Folio', 'Título de la Orden', 'Desarrollo / Parque', 'Prioridad', 'Estado', 'Técnico', 'Costo']],
      body: reportRows,
      theme: 'grid',
      headStyles: {
        fillColor: [10, 57, 99],
        textColor: [140, 198, 63],
        fontStyle: 'bold'
      },
      columnStyles: {
        0: {
          cellWidth: 20,
          fontStyle: 'bold'
        },
        1: {
          cellWidth: 55
        },
        2: {
          cellWidth: 38
        },
        3: {
          cellWidth: 20,
          halign: 'center'
        },
        4: {
          cellWidth: 22,
          halign: 'center'
        },
        5: {
          cellWidth: 15
        },
        6: {
          cellWidth: 20,
          halign: 'right',
          fontStyle: 'bold'
        }
      },
      styles: {
        fontSize: 8,
        cellPadding: 2
      }
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
const DEMO_ACCOUNTS = [{
  email: 'admin@park.com',
  role: 'admin',
  label: 'Administrador',
  desc: 'Acceso Total: Todos los módulos'
}, {
  email: 'supervisor@park.com',
  role: 'supervisor',
  label: 'Supervisor',
  desc: 'Supervisión y programación'
}, {
  email: 'tecnico@park.com',
  role: 'tecnico',
  label: 'Técnico',
  desc: 'Órdenes e Inventario'
}, {
  email: 'solicitante@park.com',
  role: 'solicitante',
  label: 'Solicitante',
  desc: 'Solicitudes de Mantenimiento'
}, {
  email: 'auditor@park.com',
  role: 'auditor',
  label: 'Auditor',
  desc: 'Lectura y Reportes PDF'
}];
const LoginScreen = ({
  onLoginSuccess
}) => {
  const [email, setEmail] = React.useState('admin@park.com');
  const [password, setPassword] = React.useState('Password123!');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const handleLogin = async e => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('cmms_auth_token', data.access_token);
        localStorage.setItem('cmms_user', JSON.stringify(data.user));
        onLoginSuccess(data.user, data.access_token);
      } else {
        const errData = await res.json().catch(() => ({}));
        const matched = DEMO_ACCOUNTS.find(a => a.email.toLowerCase() === email.toLowerCase());
        if (matched && password === 'Password123!') {
          const fallbackUser = {
            id: `u-${matched.role}`,
            email: matched.email,
            full_name: matched.label + ' (Demo)',
            role: matched.role
          };
          const fallbackToken = 'demo-token-' + matched.role;
          localStorage.setItem('cmms_auth_token', fallbackToken);
          localStorage.setItem('cmms_user', JSON.stringify(fallbackUser));
          onLoginSuccess(fallbackUser, fallbackToken);
        } else {
          setError(errData.detail || 'Credenciales inválidas. Verifica tu correo y contraseña.');
        }
      }
    } catch (err) {
      const matched = DEMO_ACCOUNTS.find(a => a.email.toLowerCase() === email.toLowerCase());
      if (matched && password === 'Password123!') {
        const fallbackUser = {
          id: `u-${matched.role}`,
          email: matched.email,
          full_name: matched.label + ' (Demo)',
          role: matched.role
        };
        const fallbackToken = 'demo-token-' + matched.role;
        localStorage.setItem('cmms_auth_token', fallbackToken);
        localStorage.setItem('cmms_user', JSON.stringify(fallbackUser));
        onLoginSuccess(fallbackUser, fallbackToken);
      } else {
        setError('Error al conectar con el servidor de autenticación.');
      }
    } finally {
      setLoading(false);
    }
  };
  return /*#__PURE__*/_jsx("div", {
    className: "min-h-screen bg-[#0B192C] flex items-center justify-center p-4 selection:bg-[#8CC63F] selection:text-[#0B192C]",
    children: /*#__PURE__*/_jsxs("div", {
      className: "w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "bg-[#0A3963] p-8 text-center relative overflow-hidden",
        children: [/*#__PURE__*/_jsx("div", {
          className: "absolute -top-12 -right-12 w-32 h-32 bg-[#8CC63F]/20 rounded-full blur-xl pointer-events-none"
        }), /*#__PURE__*/_jsx("div", {
          className: "flex items-center justify-center mb-3",
          children: /*#__PURE__*/_jsx("div", {
            className: "p-1 rounded-xl bg-white/10 border border-white/20 shadow-md",
            children: /*#__PURE__*/_jsx(ParkLogo, {
              size: 52
            })
          })
        }), /*#__PURE__*/_jsxs("h1", {
          className: "text-2xl font-extrabold text-white tracking-wide font-heading",
          children: ["PLATAFORMA PARK ", /*#__PURE__*/_jsx("span", {
            className: "text-[#8CC63F]",
            children: "CMMS"
          })]
        }), /*#__PURE__*/_jsx("p", {
          className: "text-xs text-slate-300 font-semibold uppercase tracking-widest mt-1",
          children: "Control de Acceso basado en Roles (RBAC)"
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "p-5 bg-slate-50 border-b border-slate-200",
        children: [/*#__PURE__*/_jsx("p", {
          className: "text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2 text-center",
          children: "Selecciona una cuenta Demo para probar RBAC:"
        }), /*#__PURE__*/_jsx("div", {
          className: "grid grid-cols-2 gap-2",
          children: DEMO_ACCOUNTS.map(acc => {
            const isSelected = email.toLowerCase() === acc.email.toLowerCase();
            return /*#__PURE__*/_jsxs("button", {
              type: "button",
              onClick: () => {
                setEmail(acc.email);
                setPassword('Password123!');
              },
              className: `p-2.5 rounded-xl text-left border transition-all ${isSelected ? 'bg-[#0A3963] text-white border-[#8CC63F] shadow-sm ring-2 ring-[#8CC63F]/50' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'}`,
              children: [/*#__PURE__*/_jsx("p", {
                className: "text-xs font-bold truncate",
                children: acc.label
              }), /*#__PURE__*/_jsx("p", {
                className: `text-[10px] truncate ${isSelected ? 'text-slate-200' : 'text-slate-400'}`,
                children: acc.email
              })]
            }, acc.email);
          })
        })]
      }), /*#__PURE__*/_jsxs("form", {
        onSubmit: handleLogin,
        className: "p-6 space-y-4",
        children: [error && /*#__PURE__*/_jsx("div", {
          className: "p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium",
          children: error
        }), /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("label", {
            className: "text-xs font-bold text-slate-700 block mb-1",
            children: "Correo Electrónico"
          }), /*#__PURE__*/_jsx("input", {
            type: "email",
            value: email,
            onChange: e => setEmail(e.target.value),
            required: true,
            className: "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-[#8CC63F] focus:bg-white transition-all",
            placeholder: "usuario@park.com"
          })]
        }), /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("label", {
            className: "text-xs font-bold text-slate-700 block mb-1",
            children: "Contraseña"
          }), /*#__PURE__*/_jsx("input", {
            type: "password",
            value: password,
            onChange: e => setPassword(e.target.value),
            required: true,
            className: "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-[#8CC63F] focus:bg-white transition-all",
            placeholder: "••••••••"
          })]
        }), /*#__PURE__*/_jsx("button", {
          type: "submit",
          disabled: loading,
          className: "w-full py-3 rounded-xl btn-park-green text-white font-extrabold text-sm shadow-md hover:scale-[1.01] transition-transform disabled:opacity-50 flex items-center justify-center",
          children: loading ? /*#__PURE__*/_jsx("span", {
            children: "Autenticando..."
          }) : /*#__PURE__*/_jsx("span", {
            children: "Iniciar Sesión"
          })
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "p-4 bg-slate-100 text-center border-t border-slate-200 text-[10px] text-slate-500",
        children: "PlataformaPark CMMS © 2026 • Autenticación JWT y RBAC Activo"
      })]
    })
  });
};

// ==========================================
// COMPONENTE DE ICONOS SVG VECTORIALES MONOCROMÁTICOS (REEMPLAZO ESTÉTICO DE EMOJIS)
// ==========================================
const Icon = ({
  name,
  className = "w-4 h-4 inline-block shrink-0"
}) => {
  switch (name) {
    case 'bell':
    case 'notification':
      return /*#__PURE__*/_jsx("svg", {
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/_jsx("path", {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          d: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9"
        })
      });
    case 'dashboard':
      return /*#__PURE__*/_jsxs("svg", {
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [/*#__PURE__*/_jsx("rect", {
          x: "3",
          y: "3",
          width: "7",
          height: "9",
          rx: "1"
        }), /*#__PURE__*/_jsx("rect", {
          x: "14",
          y: "3",
          width: "7",
          height: "5",
          rx: "1"
        }), /*#__PURE__*/_jsx("rect", {
          x: "14",
          y: "12",
          width: "7",
          height: "9",
          rx: "1"
        }), /*#__PURE__*/_jsx("rect", {
          x: "3",
          y: "16",
          width: "7",
          height: "5",
          rx: "1"
        })]
      });
    case 'workOrders':
    case 'clipboard':
      return /*#__PURE__*/_jsx("svg", {
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/_jsx("path", {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        })
      });
    case 'assets':
    case 'gear':
      return /*#__PURE__*/_jsxs("svg", {
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [/*#__PURE__*/_jsx("path", {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        }), /*#__PURE__*/_jsx("path", {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        })]
      });
    case 'preventive':
    case 'calendar':
      return /*#__PURE__*/_jsxs("svg", {
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [/*#__PURE__*/_jsx("rect", {
          x: "3",
          y: "4",
          width: "18",
          height: "18",
          rx: "2",
          ry: "2"
        }), /*#__PURE__*/_jsx("line", {
          x1: "16",
          y1: "2",
          x2: "16",
          y2: "6"
        }), /*#__PURE__*/_jsx("line", {
          x1: "8",
          y1: "2",
          x2: "8",
          y2: "6"
        }), /*#__PURE__*/_jsx("line", {
          x1: "3",
          y1: "10",
          x2: "21",
          y2: "10"
        })]
      });
    case 'inventory':
    case 'box':
      return /*#__PURE__*/_jsx("svg", {
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/_jsx("path", {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          d: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        })
      });
    case 'reports':
    case 'pdf':
    case 'file':
      return /*#__PURE__*/_jsx("svg", {
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/_jsx("path", {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          d: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        })
      });
    case 'users':
    case 'people':
      return /*#__PURE__*/_jsx("svg", {
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/_jsx("path", {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        })
      });
    case 'settings':
    case 'sliders':
      return /*#__PURE__*/_jsx("svg", {
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/_jsx("path", {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          d: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
        })
      });
    case 'plus':
    case 'add':
      return /*#__PURE__*/_jsx("svg", {
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: "2.5",
        children: /*#__PURE__*/_jsx("path", {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          d: "M12 4.5v15m7.5-7.5h-15"
        })
      });
    case 'search':
      return /*#__PURE__*/_jsx("svg", {
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: "2.5",
        children: /*#__PURE__*/_jsx("path", {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          d: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        })
      });
    case 'alert':
    case 'warning':
      return /*#__PURE__*/_jsx("svg", {
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/_jsx("path", {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        })
      });
    case 'logout':
      return /*#__PURE__*/_jsx("svg", {
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/_jsx("path", {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        })
      });
    case 'zap':
    case 'lightning':
      return /*#__PURE__*/_jsx("svg", {
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/_jsx("path", {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          d: "M13 10V3L4 14h7v7l9-11h-7z"
        })
      });
    case 'trash':
    case 'delete':
      return /*#__PURE__*/_jsx("svg", {
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/_jsx("path", {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        })
      });
    case 'edit':
    case 'pencil':
      return /*#__PURE__*/_jsx("svg", {
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/_jsx("path", {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        })
      });
    case 'save':
      return /*#__PURE__*/_jsx("svg", {
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/_jsx("path", {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          d: "M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
        })
      });
    case 'clean':
    case 'eraser':
      return /*#__PURE__*/_jsx("svg", {
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/_jsx("path", {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        })
      });
    case 'user':
      return /*#__PURE__*/_jsx("svg", {
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/_jsx("path", {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        })
      });
    case 'location':
    case 'pin':
      return /*#__PURE__*/_jsxs("svg", {
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [/*#__PURE__*/_jsx("path", {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        }), /*#__PURE__*/_jsx("path", {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        })]
      });
    case 'tag':
      return /*#__PURE__*/_jsx("svg", {
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/_jsx("path", {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          d: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
        })
      });
    case 'check':
      return /*#__PURE__*/_jsx("svg", {
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: "2.5",
        children: /*#__PURE__*/_jsx("path", {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          d: "M5 13l4 4L19 7"
        })
      });
    case 'close':
    case 'cross':
      return /*#__PURE__*/_jsx("svg", {
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: "2.5",
        children: /*#__PURE__*/_jsx("path", {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          d: "M6 18L18 6M6 6l12 12"
        })
      });
    case 'dollar':
      return /*#__PURE__*/_jsx("svg", {
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/_jsx("path", {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          d: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        })
      });
    default:
      return /*#__PURE__*/_jsx("span", {
        className: `emoji-icon ${className}`,
        children: name
      });
  }
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
  onSelectWO
}) => {
  const userRole = currentUser?.role || 'admin';
  const roleConfig = ROLES_CONFIG[userRole] || ROLES_CONFIG['admin'];
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [readNotifications, setReadNotifications] = React.useState(false);
  const workOrders = data?.workOrders || [];
  const assets = data?.assets || [];
  const inventory = data?.inventory || [];
  const urgentWOs = workOrders.filter(w => w.priority === 'Urgente' || w.status === 'Abierta');
  const lowStockItems = inventory.filter(i => i.currentStock <= i.minStock);
  const totalNotificationCount = readNotifications ? 0 : lowStockItems.length + urgentWOs.length + 2;

  // Live Query Results calculation
  const searchResults = React.useMemo(() => {
    const q = (searchTerm || '').trim().toLowerCase();
    if (!q) return null;
    const matchedWO = workOrders.filter(w => w.code.toLowerCase().includes(q) || w.title.toLowerCase().includes(q) || (w.assetName || '').toLowerCase().includes(q) || (w.assignedTech || '').toLowerCase().includes(q)).slice(0, 4);
    const matchedAssets = assets.filter(a => a.code.toLowerCase().includes(q) || a.name.toLowerCase().includes(q) || a.category.toLowerCase().includes(q) || a.location.toLowerCase().includes(q)).slice(0, 4);
    const matchedParts = inventory.filter(i => i.sku.toLowerCase().includes(q) || i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)).slice(0, 4);
    return {
      workOrders: matchedWO,
      assets: matchedAssets,
      inventory: matchedParts,
      totalMatches: matchedWO.length + matchedAssets.length + matchedParts.length
    };
  }, [searchTerm, workOrders, assets, inventory]);
  return /*#__PURE__*/_jsx("header", {
    className: "sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs px-4 lg:px-8 py-3.5",
    children: /*#__PURE__*/_jsxs("div", {
      className: "flex flex-col md:flex-row items-center justify-between gap-4",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-3",
        children: [/*#__PURE__*/_jsx(ParkLogo, {}), /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2",
            children: [/*#__PURE__*/_jsx("span", {
              className: "font-heading font-extrabold text-2xl tracking-wider text-[#0A3963]",
              children: "PLATAFORMA PARK"
            }), /*#__PURE__*/_jsx("span", {
              className: "text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-[#8CC63F] border border-[#8CC63F]/40 font-bold uppercase tracking-wider",
              children: "CMMS"
            })]
          }), /*#__PURE__*/_jsx("p", {
            className: "text-[10px] text-slate-500 uppercase tracking-widest font-semibold",
            children: "INFRAESTRUCTURA & MANTENIMIENTO | PLATAFORMAPARK"
          })]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "relative flex-1 max-w-md w-full",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "relative",
          children: [/*#__PURE__*/_jsx("div", {
            className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400",
            children: /*#__PURE__*/_jsx(Icon, {
              name: "search",
              className: "w-4 h-4"
            })
          }), /*#__PURE__*/_jsx("input", {
            type: "text",
            value: searchTerm,
            onChange: e => setSearchTerm(e.target.value),
            placeholder: "Buscar por código, activo, repuesto o técnico...",
            className: "w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#8CC63F] focus:bg-white transition-all shadow-2xs"
          }), searchTerm && /*#__PURE__*/_jsx("button", {
            onClick: () => setSearchTerm(''),
            className: "absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-700",
            children: /*#__PURE__*/_jsx(Icon, {
              name: "close",
              className: "w-3.5 h-3.5"
            })
          })]
        }), searchResults && /*#__PURE__*/_jsx("div", {
          className: "absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto divide-y divide-slate-100",
          children: searchResults.totalMatches === 0 ? /*#__PURE__*/_jsxs("div", {
            className: "p-4 text-center text-xs text-slate-500 font-medium",
            children: ["No se encontraron resultados para \"", /*#__PURE__*/_jsx("span", {
              className: "font-bold text-slate-700",
              children: searchTerm
            }), "\"."]
          }) : /*#__PURE__*/_jsxs(_Fragment, {
            children: [searchResults.workOrders.length > 0 && /*#__PURE__*/_jsxs("div", {
              className: "p-2 space-y-1",
              children: [/*#__PURE__*/_jsx("p", {
                className: "px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider",
                children: "Órdenes de Trabajo"
              }), searchResults.workOrders.map(wo => /*#__PURE__*/_jsxs("div", {
                onClick: () => {
                  onNavigateTab('workOrders');
                  onSelectWO(wo);
                  setSearchTerm('');
                },
                className: "px-2.5 py-2 rounded-lg hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors",
                children: [/*#__PURE__*/_jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [/*#__PURE__*/_jsx(Icon, {
                    name: "workOrders",
                    className: "w-4 h-4 text-[#0A3963] shrink-0"
                  }), /*#__PURE__*/_jsxs("div", {
                    children: [/*#__PURE__*/_jsx("p", {
                      className: "text-xs font-bold text-slate-900",
                      children: wo.title
                    }), /*#__PURE__*/_jsxs("p", {
                      className: "text-[10px] text-slate-500",
                      children: [wo.code, " • ", wo.assetName]
                    })]
                  })]
                }), /*#__PURE__*/_jsx("span", {
                  className: "px-2 py-0.5 text-[9px] font-bold rounded bg-slate-100 text-slate-700 border border-slate-200",
                  children: wo.status
                })]
              }, wo.id))]
            }), searchResults.assets.length > 0 && /*#__PURE__*/_jsxs("div", {
              className: "p-2 space-y-1",
              children: [/*#__PURE__*/_jsx("p", {
                className: "px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider",
                children: "Activos & Equipos"
              }), searchResults.assets.map(ast => /*#__PURE__*/_jsxs("div", {
                onClick: () => {
                  onNavigateTab('assets');
                  setSearchTerm('');
                },
                className: "px-2.5 py-2 rounded-lg hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors",
                children: [/*#__PURE__*/_jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [/*#__PURE__*/_jsx(Icon, {
                    name: "assets",
                    className: "w-4 h-4 text-amber-600 shrink-0"
                  }), /*#__PURE__*/_jsxs("div", {
                    children: [/*#__PURE__*/_jsx("p", {
                      className: "text-xs font-bold text-slate-900",
                      children: ast.name
                    }), /*#__PURE__*/_jsxs("p", {
                      className: "text-[10px] text-slate-500",
                      children: [ast.code, " • ", ast.location]
                    })]
                  })]
                }), /*#__PURE__*/_jsx("span", {
                  className: "px-2 py-0.5 text-[9px] font-bold rounded bg-blue-50 text-blue-700 border border-blue-200",
                  children: ast.category
                })]
              }, ast.id))]
            }), searchResults.inventory.length > 0 && /*#__PURE__*/_jsxs("div", {
              className: "p-2 space-y-1",
              children: [/*#__PURE__*/_jsx("p", {
                className: "px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider",
                children: "Repuestos & Stock"
              }), searchResults.inventory.map(part => /*#__PURE__*/_jsxs("div", {
                onClick: () => {
                  onNavigateTab('inventory');
                  setSearchTerm('');
                },
                className: "px-2.5 py-2 rounded-lg hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors",
                children: [/*#__PURE__*/_jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [/*#__PURE__*/_jsx(Icon, {
                    name: "inventory",
                    className: "w-4 h-4 text-slate-600 shrink-0"
                  }), /*#__PURE__*/_jsxs("div", {
                    children: [/*#__PURE__*/_jsx("p", {
                      className: "text-xs font-bold text-slate-900",
                      children: part.name
                    }), /*#__PURE__*/_jsxs("p", {
                      className: "text-[10px] text-slate-500",
                      children: [part.sku, " • Stock: ", part.currentStock, " ", part.unit]
                    })]
                  })]
                }), /*#__PURE__*/_jsx("span", {
                  className: `px-2 py-0.5 text-[9px] font-bold rounded ${part.currentStock <= part.minStock ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`,
                  children: part.currentStock <= part.minStock ? 'Reordenar' : 'Óptimo'
                })]
              }, part.id))]
            })]
          })
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-3 relative",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "relative",
          children: [/*#__PURE__*/_jsxs("button", {
            onClick: () => setShowNotifications(!showNotifications),
            className: "relative p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all border border-slate-200 flex items-center justify-center group",
            title: "Notificaciones y Novedades del Sistema",
            children: [/*#__PURE__*/_jsx(Icon, {
              name: "bell",
              className: "w-5 h-5 text-slate-700 group-hover:text-[#0A3963] transition-colors"
            }), totalNotificationCount > 0 && /*#__PURE__*/_jsx("span", {
              className: "absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-red-500 text-white animate-pulse shadow-xs min-w-[18px] text-center",
              children: totalNotificationCount
            })]
          }), showNotifications && /*#__PURE__*/_jsxs("div", {
            className: "absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-150",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "p-3.5 bg-slate-50 flex items-center justify-between",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-2",
                children: [/*#__PURE__*/_jsx(Icon, {
                  name: "bell",
                  className: "w-4 h-4 text-[#0A3963]"
                }), /*#__PURE__*/_jsx("span", {
                  className: "text-xs font-extrabold text-[#0A3963]",
                  children: "Novedades & Notificaciones"
                })]
              }), /*#__PURE__*/_jsx("button", {
                onClick: () => setReadNotifications(true),
                className: "text-[10px] font-bold text-slate-500 hover:text-slate-800 hover:underline",
                children: "Marcar leídas"
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs",
              children: [lowStockItems.length > 0 && /*#__PURE__*/_jsxs("div", {
                onClick: () => {
                  onNavigateTab('inventory');
                  setShowNotifications(false);
                },
                className: "p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-3 group",
                children: [/*#__PURE__*/_jsx("div", {
                  className: "p-2 rounded-xl bg-amber-50 text-amber-600 shrink-0 group-hover:scale-105 transition-transform",
                  children: /*#__PURE__*/_jsx(Icon, {
                    name: "alert",
                    className: "w-4 h-4"
                  })
                }), /*#__PURE__*/_jsxs("div", {
                  className: "flex-1 min-w-0",
                  children: [/*#__PURE__*/_jsxs("div", {
                    className: "flex items-center justify-between gap-1",
                    children: [/*#__PURE__*/_jsx("p", {
                      className: "font-bold text-slate-900 group-hover:text-[#0A3963] transition-colors",
                      children: "Alerta de Repuestos Críticos"
                    }), /*#__PURE__*/_jsx("span", {
                      className: "text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 shrink-0",
                      children: "Inventario"
                    })]
                  }), /*#__PURE__*/_jsxs("p", {
                    className: "text-[11px] text-slate-600 mt-1 leading-snug",
                    children: [lowStockItems.length, " repuesto(s) se encuentran por debajo del stock mínimo (ej. ", lowStockItems[0]?.name, ")."]
                  })]
                })]
              }), urgentWOs.length > 0 && /*#__PURE__*/_jsxs("div", {
                onClick: () => {
                  onNavigateTab('workOrders');
                  setShowNotifications(false);
                },
                className: "p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-3 group",
                children: [/*#__PURE__*/_jsx("div", {
                  className: "p-2 rounded-xl bg-red-50 text-red-600 shrink-0 group-hover:scale-105 transition-transform",
                  children: /*#__PURE__*/_jsx(Icon, {
                    name: "workOrders",
                    className: "w-4 h-4"
                  })
                }), /*#__PURE__*/_jsxs("div", {
                  className: "flex-1 min-w-0",
                  children: [/*#__PURE__*/_jsxs("div", {
                    className: "flex items-center justify-between gap-1",
                    children: [/*#__PURE__*/_jsx("p", {
                      className: "font-bold text-slate-900 group-hover:text-[#0A3963] transition-colors",
                      children: "Órdenes Urgentes Pendientes"
                    }), /*#__PURE__*/_jsx("span", {
                      className: "text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-800 shrink-0",
                      children: "Órdenes"
                    })]
                  }), /*#__PURE__*/_jsxs("p", {
                    className: "text-[11px] text-slate-600 mt-1 leading-snug",
                    children: [urgentWOs.length, " orden(es) de mantenimiento urgente requieren atención del equipo técnico."]
                  })]
                })]
              }), /*#__PURE__*/_jsxs("div", {
                onClick: () => {
                  onNavigateTab('users');
                  setShowNotifications(false);
                },
                className: "p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-3 group",
                children: [/*#__PURE__*/_jsx("div", {
                  className: "p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0 group-hover:scale-105 transition-transform",
                  children: /*#__PURE__*/_jsx(Icon, {
                    name: "zap",
                    className: "w-4 h-4"
                  })
                }), /*#__PURE__*/_jsxs("div", {
                  className: "flex-1 min-w-0",
                  children: [/*#__PURE__*/_jsxs("div", {
                    className: "flex items-center justify-between gap-1",
                    children: [/*#__PURE__*/_jsx("p", {
                      className: "font-bold text-slate-900 group-hover:text-[#0A3963] transition-colors",
                      children: "Novedad CMMS v2.5 — Control RBAC"
                    }), /*#__PURE__*/_jsx("span", {
                      className: "text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 shrink-0",
                      children: "Seguridad"
                    })]
                  }), /*#__PURE__*/_jsxs("p", {
                    className: "text-[11px] text-slate-600 mt-1 leading-snug",
                    children: ["El sistema ahora aplica restricciones dinámicas de módulos y endpoints mediante ", /*#__PURE__*/_jsx("code", {
                      className: "bg-slate-100 px-1 py-0.5 rounded text-[10px]",
                      children: "roles.json"
                    }), "."]
                  })]
                })]
              }), /*#__PURE__*/_jsxs("div", {
                onClick: () => {
                  onNavigateTab('reports');
                  setShowNotifications(false);
                },
                className: "p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-3 group",
                children: [/*#__PURE__*/_jsx("div", {
                  className: "p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0 group-hover:scale-105 transition-transform",
                  children: /*#__PURE__*/_jsx(Icon, {
                    name: "check",
                    className: "w-4 h-4"
                  })
                }), /*#__PURE__*/_jsxs("div", {
                  className: "flex-1 min-w-0",
                  children: [/*#__PURE__*/_jsxs("div", {
                    className: "flex items-center justify-between gap-1",
                    children: [/*#__PURE__*/_jsx("p", {
                      className: "font-bold text-slate-900 group-hover:text-[#0A3963] transition-colors",
                      children: "Firma Digital & PDF Integrado"
                    }), /*#__PURE__*/_jsx("span", {
                      className: "text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0",
                      children: "Reportes"
                    })]
                  }), /*#__PURE__*/_jsx("p", {
                    className: "text-[11px] text-slate-600 mt-1 leading-snug",
                    children: "Firma de recepción de técnicos y generación automática de reportes oficiales habilitada."
                  })]
                })]
              })]
            }), /*#__PURE__*/_jsx("div", {
              className: "p-2 bg-slate-50 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest",
              children: "Plataforma PARK • PlataformaPark"
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs",
          children: [/*#__PURE__*/_jsx("span", {
            className: "font-bold text-slate-800 truncate max-w-[140px]",
            children: currentUser?.full_name || 'Usuario'
          }), /*#__PURE__*/_jsx("span", {
            className: `px-2 py-0.5 text-[9px] font-extrabold rounded ${roleConfig.badgeColor}`,
            children: roleConfig.name
          })]
        }), /*#__PURE__*/_jsxs("button", {
          onClick: onNewWorkOrder,
          className: "flex items-center gap-2 px-4 py-2 rounded-lg btn-park-green text-xs font-bold text-white shadow-md hover:scale-[1.02] transition-transform",
          children: [/*#__PURE__*/_jsx(Icon, {
            name: "plus",
            className: "w-4 h-4 text-white"
          }), " ", /*#__PURE__*/_jsx("span", {
            children: "Nueva Orden"
          })]
        }), /*#__PURE__*/_jsxs("button", {
          onClick: onLogout,
          title: "Cerrar Sesión (RBAC)",
          className: "flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-all",
          children: [/*#__PURE__*/_jsx(Icon, {
            name: "logout",
            className: "w-4 h-4 text-red-700"
          }), " ", /*#__PURE__*/_jsx("span", {
            className: "hidden md:inline",
            children: "Salir"
          })]
        })]
      })]
    })
  });
};

// Sidebar — FILTRADO DINÁMICO SEGÚN PERMISOS RBAC EN ROLES.JSON
const Sidebar = ({
  activeTab,
  setActiveTab,
  openCount,
  lowStockCount,
  currentUser,
  onLogout
}) => {
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
  const allMenuItems = [{
    id: 'dashboard',
    label: 'Dashboard Operativo',
    icon: 'dashboard'
  }, {
    id: 'workOrders',
    label: 'Órdenes de Trabajo',
    icon: 'workOrders',
    badge: openCount > 0 ? openCount : null
  }, {
    id: 'assets',
    label: 'Activos & Equipos',
    icon: 'assets'
  }, {
    id: 'preventive',
    label: 'Mantenimiento Preventivo',
    icon: 'preventive'
  }, {
    id: 'inventory',
    label: 'Repuestos e Inventario',
    icon: 'inventory',
    badge: lowStockCount > 0 ? lowStockCount : null,
    badgeColor: 'bg-red-500 text-white shadow-xs'
  }, {
    id: 'reports',
    label: 'Centro de Reportes PDF',
    icon: 'reports'
  }, {
    id: 'users',
    label: 'Gestión de Usuarios',
    icon: 'users'
  }, {
    id: 'settings',
    label: 'Configuración',
    icon: 'settings'
  }];
  const menuItems = allMenuItems.filter(item => allowedModules.includes(item.id));
  return /*#__PURE__*/_jsxs("aside", {
    className: "w-full lg:w-64 bg-white border-r border-slate-200 flex flex-col p-4 gap-6 shrink-0 min-h-[calc(100vh-65px)]",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3",
      children: [/*#__PURE__*/_jsx("div", {
        className: "w-9 h-9 rounded-full bg-[#0A3963] flex items-center justify-center text-[#8CC63F] font-bold text-sm shadow-xs uppercase shrink-0",
        children: currentUser?.full_name ? currentUser.full_name.substring(0, 2) : 'GF'
      }), /*#__PURE__*/_jsxs("div", {
        className: "overflow-hidden flex-1",
        children: [/*#__PURE__*/_jsx("p", {
          className: "text-xs font-bold text-slate-900 truncate",
          children: currentUser?.full_name || 'Usuario Park'
        }), /*#__PURE__*/_jsx("p", {
          className: "text-[10px] text-slate-500 font-medium truncate",
          children: currentUser?.email || 'user@park.com'
        }), /*#__PURE__*/_jsx("span", {
          className: `inline-block mt-1 px-2 py-0.5 text-[9px] font-extrabold rounded border ${roleConfig.badgeColor}`,
          children: roleConfig.name
        })]
      })]
    }), /*#__PURE__*/_jsxs("nav", {
      className: "flex flex-col gap-1.5 flex-1",
      children: [/*#__PURE__*/_jsxs("p", {
        className: "px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1",
        children: ["Módulos Autorizados (", roleNamesSpanish[userRole] || 'GENERAL', ")"]
      }), menuItems.map(item => {
        const isActive = activeTab === item.id;
        return /*#__PURE__*/_jsxs("button", {
          onClick: () => setActiveTab(item.id),
          className: `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all group ${isActive ? 'bg-[#0A3963] text-white border-l-4 border-[#8CC63F] shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`,
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-3 min-w-0",
            children: [/*#__PURE__*/_jsx(Icon, {
              name: item.icon,
              className: `w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-[#8CC63F]' : 'text-slate-500 group-hover:text-slate-800'}`
            }), /*#__PURE__*/_jsx("span", {
              className: "truncate",
              children: item.label
            })]
          }), item.badge && /*#__PURE__*/_jsx("span", {
            className: `px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 whitespace-nowrap min-w-[22px] text-center inline-flex items-center justify-center ${item.badgeColor || 'bg-red-500 text-white'}`,
            children: item.badge
          })]
        }, item.id);
      })]
    }), /*#__PURE__*/_jsxs("button", {
      onClick: onLogout,
      className: "w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-all group shrink-0",
      children: [/*#__PURE__*/_jsx(Icon, {
        name: "logout",
        className: "w-4 h-4 text-red-700 shrink-0"
      }), " ", /*#__PURE__*/_jsx("span", {
        children: "Cerrar Sesión"
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "p-3 rounded-lg bg-slate-50 border border-slate-200 text-[10px] text-slate-500 text-center shrink-0",
      children: [/*#__PURE__*/_jsx("p", {
        className: "font-bold text-slate-800",
        children: "PLATAFORMA PARK v2.5"
      }), /*#__PURE__*/_jsx("p", {
        className: "text-[#8CC63F] font-bold mt-0.5",
        children: "PlataformaPark © 2026"
      })]
    })]
  });
};

// Componente para Módulo de Gestión de Usuarios (Admin)
const UsersManagement = () => /*#__PURE__*/_jsxs("div", {
  className: "space-y-6",
  children: [/*#__PURE__*/_jsx("div", {
    className: "flex items-center justify-between",
    children: /*#__PURE__*/_jsxs("div", {
      children: [/*#__PURE__*/_jsx("h2", {
        className: "text-xl font-extrabold text-[#0A3963] font-heading",
        children: "👥 Gestión de Usuarios y Permisos RBAC"
      }), /*#__PURE__*/_jsx("p", {
        className: "text-xs text-slate-500",
        children: "Matriz de roles autorizados definida en roles.json"
      })]
    })
  }), /*#__PURE__*/_jsx("div", {
    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
    children: DEMO_ACCOUNTS.map(u => {
      const conf = ROLES_CONFIG[u.role];
      return /*#__PURE__*/_jsxs("div", {
        className: "p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between",
          children: [/*#__PURE__*/_jsx("span", {
            className: `px-2 py-0.5 text-xs font-bold rounded border ${conf.badgeColor}`,
            children: conf.name
          }), /*#__PURE__*/_jsx("span", {
            className: "text-xs text-slate-400",
            children: "Activo"
          })]
        }), /*#__PURE__*/_jsx("h3", {
          className: "font-bold text-sm text-slate-900",
          children: u.label
        }), /*#__PURE__*/_jsx("p", {
          className: "text-xs text-slate-500",
          children: u.email
        }), /*#__PURE__*/_jsxs("div", {
          className: "pt-2 border-t border-slate-100",
          children: [/*#__PURE__*/_jsx("p", {
            className: "text-[10px] font-bold text-slate-400 uppercase",
            children: "Módulos autorizados:"
          }), /*#__PURE__*/_jsx("div", {
            className: "flex flex-wrap gap-1 mt-1",
            children: conf.modules.map(m => /*#__PURE__*/_jsx("span", {
              className: "px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-semibold text-slate-600",
              children: m
            }, m))
          })]
        })]
      }, u.email);
    })
  })]
});

// Componente para Configuración de Sistema (Admin)
const SettingsView = () => /*#__PURE__*/_jsxs("div", {
  className: "max-w-2xl mx-auto p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4",
  children: [/*#__PURE__*/_jsx("h2", {
    className: "text-xl font-bold text-[#0A3963]",
    children: "🛠️ Configuración Global del Sistema"
  }), /*#__PURE__*/_jsxs("div", {
    className: "space-y-3 text-xs text-slate-700",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "p-3 bg-slate-50 rounded-lg flex items-center justify-between",
      children: [/*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx("p", {
          className: "font-bold",
          children: "Control de Acceso Basado en Roles (RBAC)"
        }), /*#__PURE__*/_jsx("p", {
          className: "text-slate-500 text-[11px]",
          children: "Validación dinámica basada en roles.json"
        })]
      }), /*#__PURE__*/_jsx("span", {
        className: "px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]",
        children: "ACTIVO"
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "p-3 bg-slate-50 rounded-lg flex items-center justify-between",
      children: [/*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx("p", {
          className: "font-bold",
          children: "Autenticación JWT"
        }), /*#__PURE__*/_jsx("p", {
          className: "text-slate-500 text-[11px]",
          children: "Tokens Bearer con expiración de 24 horas"
        })]
      }), /*#__PURE__*/_jsx("span", {
        className: "px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]",
        children: "VERIFICADO"
      })]
    })]
  })]
});

// Dashboard
const Dashboard = ({
  data,
  onSelectWO,
  onNewWO
}) => {
  const {
    workOrders = [],
    assets = [],
    inventory = []
  } = data;
  const totalWO = workOrders.length;
  const openWO = workOrders.filter(w => w.status === 'Abierta').length;
  const inProgressWO = workOrders.filter(w => w.status === 'En Proceso').length;
  const completedWO = workOrders.filter(w => w.status === 'Completada').length;
  const urgentWO = workOrders.filter(w => w.priority === 'Urgente').length;
  const totalCost = workOrders.reduce((sum, w) => sum + (w.grandTotal || 0), 0);
  const outOfServiceAssets = assets.filter(a => a.status === 'Fuera de Servicio').length;
  const lowStockCount = inventory.filter(i => i.currentStock <= i.minStock).length;
  const urgentList = workOrders.filter(w => w.priority === 'Urgente' || w.status === 'Abierta').slice(0, 5);
  return /*#__PURE__*/_jsxs("div", {
    className: "space-y-6",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl park-card",
      children: [/*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx("h1", {
          className: "text-2xl font-extrabold text-[#0A3963] font-heading",
          children: "Resumen Operativo de Mantenimiento"
        }), /*#__PURE__*/_jsx("p", {
          className: "text-xs text-slate-500 mt-1 font-medium",
          children: "Plataforma PARK — Control e Indicadores en Tiempo Real | PlataformaPark"
        })]
      }), /*#__PURE__*/_jsxs("button", {
        onClick: onNewWO,
        className: "px-5 py-2.5 rounded-lg btn-park-green text-white font-extrabold text-xs shadow hover:scale-[1.02] transition-transform",
        children: [/*#__PURE__*/_jsx(Icon, {
          name: "zap",
          className: "w-4 h-4 mr-1.5"
        }), " Crear Nuevo Reporte / Orden"]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "p-5 rounded-xl park-card park-card-hover flex items-center justify-between",
        children: [/*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("p", {
            className: "text-xs font-bold text-slate-400 uppercase tracking-wider",
            children: "Órdenes Totales"
          }), /*#__PURE__*/_jsx("h3", {
            className: "text-3xl font-extrabold text-[#0A3963] mt-1 font-heading",
            children: totalWO
          }), /*#__PURE__*/_jsxs("p", {
            className: "text-xs text-emerald-600 font-semibold mt-1 inline-flex items-center gap-1",
            children: [/*#__PURE__*/_jsx(Icon, {
              name: "check",
              className: "w-3.5 h-3.5 text-emerald-600 shrink-0"
            }), " ", completedWO, " completadas (", Math.round(completedWO / totalWO * 100 || 0), "%)"]
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0A3963] shrink-0",
          children: /*#__PURE__*/_jsx(Icon, {
            name: "workOrders",
            className: "w-6 h-6"
          })
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "p-5 rounded-xl park-card park-card-hover flex items-center justify-between",
        children: [/*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("p", {
            className: "text-xs font-bold text-slate-400 uppercase tracking-wider",
            children: "Activas / En Proceso"
          }), /*#__PURE__*/_jsx("h3", {
            className: "text-3xl font-extrabold text-amber-600 mt-1 font-heading",
            children: openWO + inProgressWO
          }), /*#__PURE__*/_jsxs("p", {
            className: "text-xs text-amber-700 font-semibold mt-1",
            children: [openWO, " abiertas | ", inProgressWO, " en ejecución"]
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0",
          children: /*#__PURE__*/_jsx(Icon, {
            name: "assets",
            className: "w-6 h-6"
          })
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "p-5 rounded-xl park-card park-card-hover flex items-center justify-between",
        children: [/*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("p", {
            className: "text-xs font-bold text-slate-400 uppercase tracking-wider",
            children: "Atención Crítica"
          }), /*#__PURE__*/_jsx("h3", {
            className: "text-3xl font-extrabold text-red-600 mt-1 font-heading",
            children: urgentWO
          }), /*#__PURE__*/_jsxs("p", {
            className: "text-xs text-red-600 font-semibold mt-1 inline-flex items-center gap-1",
            children: [/*#__PURE__*/_jsx(Icon, {
              name: "alert",
              className: "w-3.5 h-3.5 text-red-600 shrink-0"
            }), " ", outOfServiceAssets, " Equipos Fuera de Servicio"]
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0",
          children: /*#__PURE__*/_jsx(Icon, {
            name: "alert",
            className: "w-6 h-6"
          })
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "p-5 rounded-xl park-card park-card-hover flex items-center justify-between",
        children: [/*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("p", {
            className: "text-xs font-bold text-slate-400 uppercase tracking-wider",
            children: "Inversión Acumulada"
          }), /*#__PURE__*/_jsxs("h3", {
            className: "text-2xl font-extrabold text-[#0A3963] mt-1 font-heading",
            children: ["$", totalCost.toLocaleString('en-US', {
              minimumFractionDigits: 2
            }), " USD"]
          }), /*#__PURE__*/_jsx("p", {
            className: "text-xs text-slate-500 font-medium mt-1",
            children: "Materiales + Mano de obra"
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0",
          children: /*#__PURE__*/_jsx(Icon, {
            name: "dollar",
            className: "w-6 h-6"
          })
        })]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "lg:col-span-2 p-6 rounded-2xl park-card space-y-4",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between",
          children: [/*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("h2", {
              className: "text-lg font-extrabold text-[#0A3963] font-heading",
              children: "Órdenes Prioritarias & Pendientes"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-xs text-slate-500 font-medium",
              children: "Atención requerida por técnicos en parque"
            })]
          }), /*#__PURE__*/_jsx("span", {
            className: "px-2.5 py-1 rounded bg-emerald-50 text-[#8CC63F] border border-[#8CC63F]/40 text-xs font-bold",
            children: "MaintainX Feed"
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "space-y-3",
          children: urgentList.map(wo => {
            let pClass = "badge-low";
            if (wo.priority === 'Urgente') pClass = "badge-urgent";else if (wo.priority === 'Alta') pClass = "badge-high";else if (wo.priority === 'Media') pClass = "badge-medium";
            return /*#__PURE__*/_jsxs("div", {
              onClick: () => onSelectWO(wo),
              className: "p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:border-[#8CC63F] cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "space-y-1",
                children: [/*#__PURE__*/_jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [/*#__PURE__*/_jsx("span", {
                    className: "text-xs font-bold text-[#0A3963] font-mono",
                    children: wo.code
                  }), /*#__PURE__*/_jsx("span", {
                    className: `px-2 py-0.5 rounded text-[10px] font-extrabold ${pClass}`,
                    children: wo.priority
                  }), /*#__PURE__*/_jsx("span", {
                    className: "text-[10px] text-slate-600 px-2 py-0.5 rounded bg-white border border-slate-200 font-semibold",
                    children: wo.category
                  })]
                }), /*#__PURE__*/_jsx("h4", {
                  className: "text-sm font-bold text-slate-900 group-hover:text-[#0A3963] transition-colors",
                  children: wo.title
                }), /*#__PURE__*/_jsxs("p", {
                  className: "text-xs text-slate-500 inline-flex items-center gap-1",
                  children: [/*#__PURE__*/_jsx(Icon, {
                    name: "location",
                    className: "w-3.5 h-3.5 text-slate-400 shrink-0"
                  }), " ", wo.development, " • ", /*#__PURE__*/_jsx("span", {
                    className: "text-slate-700 font-semibold",
                    children: wo.assetName
                  })]
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex items-center sm:flex-col sm:items-end justify-between gap-1 shrink-0",
                children: [/*#__PURE__*/_jsxs("span", {
                  className: "text-xs font-bold text-slate-700 inline-flex items-center gap-1",
                  children: [/*#__PURE__*/_jsx(Icon, {
                    name: "user",
                    className: "w-3.5 h-3.5 text-slate-500 shrink-0"
                  }), " ", wo.assignedTech]
                }), /*#__PURE__*/_jsxs("span", {
                  className: "text-xs font-extrabold text-[#0A3963]",
                  children: ["$", (wo.grandTotal || 0).toFixed(2), " USD"]
                })]
              })]
            }, wo.id);
          })
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "space-y-6",
        children: /*#__PURE__*/_jsxs("div", {
          className: "p-6 rounded-2xl park-card space-y-4",
          children: [/*#__PURE__*/_jsx("h2", {
            className: "text-lg font-extrabold text-[#0A3963] font-heading",
            children: "Estado de Equipos"
          }), /*#__PURE__*/_jsx("div", {
            className: "space-y-3",
            children: assets.slice(0, 4).map(ast => {
              let statusColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
              if (ast.status === 'Fuera de Servicio') statusColor = "text-red-700 bg-red-50 border-red-200";else if (ast.status === 'En Mantenimiento') statusColor = "text-amber-700 bg-amber-50 border-amber-200";
              return /*#__PURE__*/_jsxs("div", {
                className: "p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2",
                children: [/*#__PURE__*/_jsxs("div", {
                  className: "min-w-0",
                  children: [/*#__PURE__*/_jsx("p", {
                    className: "text-xs font-bold text-slate-900 truncate",
                    children: ast.name
                  }), /*#__PURE__*/_jsxs("p", {
                    className: "text-[10px] text-slate-500 truncate",
                    children: [ast.code, " • ", ast.location]
                  })]
                }), /*#__PURE__*/_jsx("span", {
                  className: `px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${statusColor}`,
                  children: ast.status
                })]
              }, ast.id);
            })
          })]
        })
      })]
    })]
  });
};

// WorkOrders
const WorkOrders = ({
  workOrders,
  onSelectWO,
  onNewWO,
  onExportSinglePdf,
  onStatusChange,
  searchTerm
}) => {
  const [viewMode, setViewMode] = React.useState('list');
  const [filterPriority, setFilterPriority] = React.useState('ALL');
  const [filterStatus, setFilterStatus] = React.useState('ALL');
  const [filterCategory, setFilterCategory] = React.useState('ALL');
  const filtered = workOrders.filter(wo => {
    const matchesSearch = searchTerm === '' || wo.title.toLowerCase().includes(searchTerm.toLowerCase()) || wo.code.toLowerCase().includes(searchTerm.toLowerCase()) || wo.assetName.toLowerCase().includes(searchTerm.toLowerCase()) || wo.assignedTech.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'ALL' || wo.priority === filterPriority;
    const matchesStatus = filterStatus === 'ALL' || wo.status === filterStatus;
    const matchesCategory = filterCategory === 'ALL' || wo.category === filterCategory;
    return matchesSearch && matchesPriority && matchesStatus && matchesCategory;
  });
  const statuses = ['Abierta', 'En Proceso', 'En Espera', 'Completada'];
  return /*#__PURE__*/_jsxs("div", {
    className: "space-y-6",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "p-6 rounded-2xl park-card space-y-4",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
        children: [/*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("h1", {
            className: "text-2xl font-extrabold text-[#0A3963] font-heading",
            children: "Órdenes de Trabajo (Work Orders)"
          }), /*#__PURE__*/_jsx("p", {
            className: "text-xs text-slate-500 font-medium",
            children: "Gestión operativa completa estilo MaintainX | Plataforma PARK PlataformaPark"
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-3",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center p-1 rounded-lg bg-slate-100 border border-slate-200",
            children: [/*#__PURE__*/_jsx("button", {
              onClick: () => setViewMode('list'),
              className: `px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-[#0A3963] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`,
              children: "≡ Lista"
            }), /*#__PURE__*/_jsx("button", {
              onClick: () => setViewMode('kanban'),
              className: `px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'kanban' ? 'bg-[#0A3963] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`,
              children: "⊞ Kanban"
            })]
          }), /*#__PURE__*/_jsxs("button", {
            onClick: onNewWO,
            className: "px-4 py-2 rounded-lg btn-park-green text-xs shadow hover:scale-[1.02] transition-transform",
            children: [/*#__PURE__*/_jsx(Icon, {
              name: "plus",
              className: "w-4 h-4 mr-1.5"
            }), " Crear Orden"]
          })]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-200",
        children: [/*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("label", {
            className: "text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1",
            children: "Prioridad"
          }), /*#__PURE__*/_jsxs("select", {
            value: filterPriority,
            onChange: e => setFilterPriority(e.target.value),
            className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:border-[#8CC63F] outline-none font-medium",
            children: [/*#__PURE__*/_jsx("option", {
              value: "ALL",
              children: "Todas las Prioridades"
            }), /*#__PURE__*/_jsx("option", {
              value: "Urgente",
              children: "🚨 Urgente"
            }), /*#__PURE__*/_jsx("option", {
              value: "Alta",
              children: "🟧 Alta"
            }), /*#__PURE__*/_jsx("option", {
              value: "Media",
              children: "🟨 Media"
            }), /*#__PURE__*/_jsx("option", {
              value: "Baja",
              children: "🟦 Baja"
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("label", {
            className: "text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1",
            children: "Estado"
          }), /*#__PURE__*/_jsxs("select", {
            value: filterStatus,
            onChange: e => setFilterStatus(e.target.value),
            className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:border-[#8CC63F] outline-none font-medium",
            children: [/*#__PURE__*/_jsx("option", {
              value: "ALL",
              children: "Todos los Estados"
            }), /*#__PURE__*/_jsx("option", {
              value: "Abierta",
              children: "🔵 Abierta"
            }), /*#__PURE__*/_jsx("option", {
              value: "En Proceso",
              children: "🟣 En Proceso"
            }), /*#__PURE__*/_jsx("option", {
              value: "En Espera",
              children: "🟡 En Espera"
            }), /*#__PURE__*/_jsx("option", {
              value: "Completada",
              children: "🟢 Completada"
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("label", {
            className: "text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1",
            children: "Categoría"
          }), /*#__PURE__*/_jsxs("select", {
            value: filterCategory,
            onChange: e => setFilterCategory(e.target.value),
            className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:border-[#8CC63F] outline-none font-medium",
            children: [/*#__PURE__*/_jsx("option", {
              value: "ALL",
              children: "Todas las Categorías"
            }), /*#__PURE__*/_jsx("option", {
              value: "Preventivo",
              children: "Preventivo"
            }), /*#__PURE__*/_jsx("option", {
              value: "Correctivo",
              children: "Correctivo"
            }), /*#__PURE__*/_jsx("option", {
              value: "Inspección",
              children: "Inspección"
            }), /*#__PURE__*/_jsx("option", {
              value: "Eléctrico",
              children: "Eléctrico"
            }), /*#__PURE__*/_jsx("option", {
              value: "Climatización / HVAC",
              children: "Climatización / HVAC"
            })]
          })]
        })]
      })]
    }), viewMode === 'list' && /*#__PURE__*/_jsx("div", {
      className: "p-6 rounded-2xl park-card overflow-x-auto",
      children: /*#__PURE__*/_jsxs("table", {
        className: "w-full text-left border-collapse",
        children: [/*#__PURE__*/_jsx("thead", {
          children: /*#__PURE__*/_jsxs("tr", {
            className: "border-b border-slate-200 text-[11px] font-extrabold text-[#0A3963] uppercase tracking-wider bg-slate-50",
            children: [/*#__PURE__*/_jsx("th", {
              className: "py-3 px-3",
              children: "Folio"
            }), /*#__PURE__*/_jsx("th", {
              className: "py-3 px-3",
              children: "Título de la Orden"
            }), /*#__PURE__*/_jsx("th", {
              className: "py-3 px-3",
              children: "Desarrollo / Activo"
            }), /*#__PURE__*/_jsx("th", {
              className: "py-3 px-3",
              children: "Prioridad"
            }), /*#__PURE__*/_jsx("th", {
              className: "py-3 px-3",
              children: "Estado"
            }), /*#__PURE__*/_jsx("th", {
              className: "py-3 px-3",
              children: "Técnico"
            }), /*#__PURE__*/_jsx("th", {
              className: "py-3 px-3 text-right",
              children: "Costo"
            }), /*#__PURE__*/_jsx("th", {
              className: "py-3 px-3 text-center",
              children: "Generar Reporte"
            })]
          })
        }), /*#__PURE__*/_jsx("tbody", {
          className: "divide-y divide-slate-200 text-xs",
          children: filtered.map(wo => {
            let pClass = "badge-low";
            if (wo.priority === 'Urgente') pClass = "badge-urgent";else if (wo.priority === 'Alta') pClass = "badge-high";else if (wo.priority === 'Media') pClass = "badge-medium";
            let sClass = "badge-open";
            if (wo.status === 'Completada') sClass = "badge-completed";else if (wo.status === 'En Proceso') sClass = "badge-in-progress";
            return /*#__PURE__*/_jsxs("tr", {
              className: "hover:bg-slate-50/80 transition-colors group cursor-pointer",
              children: [/*#__PURE__*/_jsx("td", {
                className: "py-3.5 px-3 font-bold text-[#0A3963] font-mono",
                onClick: () => onSelectWO(wo),
                children: wo.code
              }), /*#__PURE__*/_jsxs("td", {
                className: "py-3.5 px-3 font-bold text-slate-900 group-hover:text-[#0A3963]",
                onClick: () => onSelectWO(wo),
                children: [wo.title, /*#__PURE__*/_jsx("p", {
                  className: "text-[10px] text-slate-500 font-medium",
                  children: wo.category
                })]
              }), /*#__PURE__*/_jsxs("td", {
                className: "py-3.5 px-3 text-slate-700",
                onClick: () => onSelectWO(wo),
                children: [/*#__PURE__*/_jsx("p", {
                  className: "font-semibold text-slate-900",
                  children: wo.development
                }), /*#__PURE__*/_jsx("p", {
                  className: "text-[10px] text-slate-500 font-medium",
                  children: wo.assetName
                })]
              }), /*#__PURE__*/_jsx("td", {
                className: "py-3.5 px-3",
                onClick: () => onSelectWO(wo),
                children: /*#__PURE__*/_jsx("span", {
                  className: `px-2 py-0.5 rounded text-[10px] font-extrabold ${pClass}`,
                  children: wo.priority
                })
              }), /*#__PURE__*/_jsx("td", {
                className: "py-3.5 px-3",
                children: /*#__PURE__*/_jsx("select", {
                  value: wo.status,
                  onChange: e => onStatusChange(wo.id, e.target.value),
                  className: `px-2 py-1 rounded text-[10px] font-extrabold outline-none cursor-pointer ${sClass}`,
                  children: statuses.map(st => /*#__PURE__*/_jsx("option", {
                    value: st,
                    children: st
                  }, st))
                })
              }), /*#__PURE__*/_jsx("td", {
                className: "py-3.5 px-3 font-bold text-slate-800",
                onClick: () => onSelectWO(wo),
                children: wo.assignedTech
              }), /*#__PURE__*/_jsxs("td", {
                className: "py-3.5 px-3 text-right font-extrabold text-[#0A3963]",
                onClick: () => onSelectWO(wo),
                children: ["$", (wo.grandTotal || 0).toFixed(2)]
              }), /*#__PURE__*/_jsx("td", {
                className: "py-3.5 px-3 text-center",
                children: /*#__PURE__*/_jsxs("button", {
                  onClick: e => {
                    e.stopPropagation();
                    onExportSinglePdf(wo);
                  },
                  title: "Generar y Descargar Reporte PDF de la Orden",
                  className: "px-3 py-1.5 rounded btn-park-blue text-[11px] font-extrabold transition-transform hover:scale-105 shadow-xs flex items-center gap-1 mx-auto",
                  children: [/*#__PURE__*/_jsx(Icon, {
                    name: "pdf",
                    className: "w-4 h-4 mr-1.5"
                  }), " ", /*#__PURE__*/_jsx("span", {
                    children: "Generar PDF"
                  })]
                })
              })]
            }, wo.id);
          })
        })]
      })
    }), viewMode === 'kanban' && /*#__PURE__*/_jsx("div", {
      className: "grid grid-cols-1 md:grid-cols-4 gap-4",
      children: statuses.map(status => {
        const listInStatus = filtered.filter(w => w.status === status);
        return /*#__PURE__*/_jsxs("div", {
          className: "p-4 rounded-2xl park-card space-y-3 flex flex-col min-h-[500px] bg-slate-50/50",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center justify-between pb-2 border-b border-slate-200",
            children: [/*#__PURE__*/_jsx("h3", {
              className: "font-extrabold text-slate-900 text-xs uppercase tracking-wider",
              children: status
            }), /*#__PURE__*/_jsx("span", {
              className: "px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[10px] font-extrabold",
              children: listInStatus.length
            })]
          }), /*#__PURE__*/_jsx("div", {
            className: "space-y-3 flex-1 overflow-y-auto pr-1",
            children: listInStatus.map(wo => {
              let pClass = "badge-low";
              if (wo.priority === 'Urgente') pClass = "badge-urgent";else if (wo.priority === 'Alta') pClass = "badge-high";
              return /*#__PURE__*/_jsxs("div", {
                onClick: () => onSelectWO(wo),
                className: "p-4 rounded-xl bg-white border border-slate-200/80 hover:border-[#8CC63F] cursor-pointer transition-all space-y-2.5 group shadow-xs hover:shadow-md",
                children: [/*#__PURE__*/_jsxs("div", {
                  className: "flex items-center justify-between",
                  children: [/*#__PURE__*/_jsx("span", {
                    className: "text-[10px] font-bold text-[#0A3963] font-mono",
                    children: wo.code
                  }), /*#__PURE__*/_jsx("span", {
                    className: `px-2 py-0.5 rounded text-[9px] font-extrabold ${pClass}`,
                    children: wo.priority
                  })]
                }), /*#__PURE__*/_jsx("h4", {
                  className: "text-xs font-bold text-slate-900 group-hover:text-[#0A3963] transition-colors",
                  children: wo.title
                }), /*#__PURE__*/_jsxs("p", {
                  className: "text-[10px] text-slate-500 font-medium",
                  children: ["📍 ", wo.development]
                }), /*#__PURE__*/_jsxs("div", {
                  className: "pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]",
                  children: [/*#__PURE__*/_jsxs("span", {
                    className: "text-slate-700 font-semibold",
                    children: ["👤 ", wo.assignedTech.split(' ')[1] || wo.assignedTech]
                  }), /*#__PURE__*/_jsxs("button", {
                    onClick: e => {
                      e.stopPropagation();
                      onExportSinglePdf(wo);
                    },
                    className: "px-2 py-0.5 rounded bg-blue-50 text-[#0A3963] hover:bg-blue-100 font-extrabold border border-blue-200 flex items-center gap-1",
                    children: [/*#__PURE__*/_jsx(Icon, {
                      name: "pdf",
                      className: "w-4 h-4 mr-1.5"
                    }), " Generar PDF"]
                  })]
                })]
              }, wo.id);
            })
          })]
        }, status);
      })
    })]
  });
};

// SignaturePad
const SignaturePad = ({
  onSaveSignature
}) => {
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
  const startDrawing = e => {
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
  const draw = e => {
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
  return /*#__PURE__*/_jsxs("div", {
    className: "space-y-2",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "flex items-center justify-between text-xs",
      children: [/*#__PURE__*/_jsx("label", {
        className: "font-bold text-slate-800",
        children: "Firma Digital del Técnico / Supervisor"
      }), /*#__PURE__*/_jsxs("button", {
        type: "button",
        onClick: clearCanvas,
        className: "text-[#0A3963] hover:underline text-[11px] font-bold",
        children: [/*#__PURE__*/_jsx(Icon, {
          name: "clean",
          className: "w-4 h-4 mr-1.5"
        }), " Limpiar Firma"]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "relative border-2 dashed border-slate-300 rounded-lg overflow-hidden bg-white",
      children: [/*#__PURE__*/_jsx("canvas", {
        ref: canvasRef,
        width: 380,
        height: 100,
        className: "w-full h-24 cursor-crosshair touch-none",
        onMouseDown: startDrawing,
        onMouseUp: stopDrawing,
        onMouseMove: draw,
        onTouchStart: startDrawing,
        onTouchEnd: stopDrawing,
        onTouchMove: draw
      }), /*#__PURE__*/_jsx("div", {
        className: "absolute bottom-2 right-3 pointer-events-none text-[9px] text-slate-400 uppercase tracking-widest font-mono font-bold",
        children: "Plataforma PARK — Firma Digital"
      })]
    })]
  });
};

// WorkOrderModal (CON BOTÓN DIRECTO DE GENERACIÓN DE PDF DENTRO DE LA ORDEN)
const WorkOrderModal = ({
  isOpen,
  onClose,
  onSave,
  workOrder,
  assets,
  inventory,
  technicians,
  onExportPdf
}) => {
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
    assetId: workOrder?.assetId || assets[0]?.id || '',
    assignedTech: workOrder?.assignedTech || technicians[0]?.name || '',
    assignedTechRole: workOrder?.assignedTechRole || 'Técnico Operativo',
    dueDate: workOrder?.dueDate ? workOrder.dueDate.substring(0, 10) : new Date().toISOString().substring(0, 10),
    estimatedHours: workOrder?.estimatedHours || 2.0,
    actualHours: workOrder?.actualHours || 0.0,
    checklist: workOrder?.checklist || [{
      id: 1,
      text: 'Revisión y bloqueo de seguridad LOTO',
      completed: false,
      timestamp: null
    }, {
      id: 2,
      text: 'Ejecución de mantenimiento técnico de rutina',
      completed: false,
      timestamp: null
    }, {
      id: 3,
      text: 'Pruebas de funcionamiento e inspección final',
      completed: false,
      timestamp: null
    }],
    usedParts: workOrder?.usedParts || [],
    technicianNotes: workOrder?.technicianNotes || '',
    signatureData: workOrder?.signatureData || null
  });
  const [newChecklistItem, setNewChecklistItem] = React.useState('');
  const [selectedPartId, setSelectedPartId] = React.useState(inventory[0]?.id || '');
  const [partQty, setPartQty] = React.useState(1);
  const selectedAsset = assets.find(a => a.id === formData.assetId) || assets[0];
  const handleChecklistToggle = id => {
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
      checklist: [...prev.checklist, {
        id: Date.now(),
        text: newChecklistItem.trim(),
        completed: false,
        timestamp: null
      }]
    }));
    setNewChecklistItem('');
  };
  const handleRemoveChecklistItem = id => {
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
      setFormData(prev => ({
        ...prev,
        usedParts: updatedParts
      }));
    } else {
      const newPart = {
        partId: invItem.id,
        name: invItem.name,
        qty: Number(partQty),
        unitCost: invItem.unitCost,
        totalCost: Number(partQty) * invItem.unitCost
      };
      setFormData(prev => ({
        ...prev,
        usedParts: [...prev.usedParts, newPart]
      }));
    }
  };
  const handleRemovePart = partId => {
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
  return /*#__PURE__*/_jsx("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto",
    children: /*#__PURE__*/_jsxs("div", {
      className: "relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-8",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center justify-between p-5 bg-[#0A3963] text-white",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-3",
          children: [/*#__PURE__*/_jsx(ParkLogo, {}), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("h2", {
              className: "text-lg font-bold text-white font-heading",
              children: isEdit ? `Orden de Trabajo: ${formData.code}` : 'Nuevo Reporte / Orden de Trabajo'
            }), /*#__PURE__*/_jsx("p", {
              className: "text-xs text-[#8CC63F] font-bold",
              children: "PLATAFORMA PARK — PLATAFORMAPARK"
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-3",
          children: [/*#__PURE__*/_jsxs("button", {
            type: "button",
            onClick: () => handleSubmitAndGeneratePdf(true),
            className: "px-3.5 py-1.5 rounded btn-park-green text-xs font-extrabold shadow-sm hover:scale-105 transition-transform flex items-center gap-1.5",
            children: [/*#__PURE__*/_jsx(Icon, {
              name: "pdf",
              className: "w-4 h-4 mr-1.5"
            }), " ", /*#__PURE__*/_jsx("span", {
              children: "Generar Reporte PDF"
            })]
          }), /*#__PURE__*/_jsx("button", {
            onClick: onClose,
            className: "text-slate-400 hover:text-white text-xl p-1 font-bold",
            children: "✕"
          })]
        })]
      }), /*#__PURE__*/_jsxs("form", {
        onSubmit: e => {
          e.preventDefault();
          handleSubmitAndGeneratePdf(false);
        },
        className: "p-6 space-y-6 max-h-[80vh] overflow-y-auto",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "grid grid-cols-1 md:grid-cols-2 gap-4",
          children: [/*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("label", {
              className: "text-xs font-bold text-slate-700 block mb-1",
              children: "Título de la Orden *"
            }), /*#__PURE__*/_jsx("input", {
              type: "text",
              required: true,
              value: formData.title,
              onChange: e => setFormData({
                ...formData,
                title: e.target.value
              }),
              placeholder: "Ej. Inspección y Cambio de Filtros HVAC",
              className: "w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#8CC63F] focus:bg-white outline-none font-medium"
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("label", {
              className: "text-xs font-bold text-slate-700 block mb-1",
              children: "Activo / Equipo *"
            }), /*#__PURE__*/_jsx("select", {
              value: formData.assetId,
              onChange: e => setFormData({
                ...formData,
                assetId: e.target.value
              }),
              className: "w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#8CC63F] focus:bg-white outline-none font-medium",
              children: assets.map(ast => /*#__PURE__*/_jsxs("option", {
                value: ast.id,
                children: [ast.name, " (", ast.development, ")"]
              }, ast.id))
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("label", {
              className: "text-xs font-bold text-slate-700 block mb-1",
              children: "Prioridad"
            }), /*#__PURE__*/_jsxs("select", {
              value: formData.priority,
              onChange: e => setFormData({
                ...formData,
                priority: e.target.value
              }),
              className: "w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#8CC63F] focus:bg-white outline-none font-bold",
              children: [/*#__PURE__*/_jsx("option", {
                value: "Urgente",
                children: "🚨 Urgente"
              }), /*#__PURE__*/_jsx("option", {
                value: "Alta",
                children: "🟧 Alta"
              }), /*#__PURE__*/_jsx("option", {
                value: "Media",
                children: "🟨 Media"
              }), /*#__PURE__*/_jsx("option", {
                value: "Baja",
                children: "🟦 Baja"
              })]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("label", {
              className: "text-xs font-bold text-slate-700 block mb-1",
              children: "Estado"
            }), /*#__PURE__*/_jsxs("select", {
              value: formData.status,
              onChange: e => setFormData({
                ...formData,
                status: e.target.value
              }),
              className: "w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#8CC63F] focus:bg-white outline-none font-bold",
              children: [/*#__PURE__*/_jsx("option", {
                value: "Abierta",
                children: "🔵 Abierta"
              }), /*#__PURE__*/_jsx("option", {
                value: "En Proceso",
                children: "🟣 En Proceso"
              }), /*#__PURE__*/_jsx("option", {
                value: "En Espera",
                children: "🟡 En Espera"
              }), /*#__PURE__*/_jsx("option", {
                value: "Completada",
                children: "🟢 Completada"
              })]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("label", {
              className: "text-xs font-bold text-slate-700 block mb-1",
              children: "Categoría"
            }), /*#__PURE__*/_jsxs("select", {
              value: formData.category,
              onChange: e => setFormData({
                ...formData,
                category: e.target.value
              }),
              className: "w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#8CC63F] focus:bg-white outline-none font-medium",
              children: [/*#__PURE__*/_jsx("option", {
                value: "Preventivo",
                children: "Preventivo"
              }), /*#__PURE__*/_jsx("option", {
                value: "Correctivo",
                children: "Correctivo"
              }), /*#__PURE__*/_jsx("option", {
                value: "Inspección",
                children: "Inspección"
              }), /*#__PURE__*/_jsx("option", {
                value: "Seguridad",
                children: "Seguridad"
              }), /*#__PURE__*/_jsx("option", {
                value: "Eléctrico",
                children: "Eléctrico"
              })]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("label", {
              className: "text-xs font-bold text-slate-700 block mb-1",
              children: "Técnico Asignado"
            }), /*#__PURE__*/_jsx("select", {
              value: formData.assignedTech,
              onChange: e => setFormData({
                ...formData,
                assignedTech: e.target.value
              }),
              className: "w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#8CC63F] focus:bg-white outline-none font-medium",
              children: technicians.map(t => /*#__PURE__*/_jsxs("option", {
                value: t.name,
                children: [t.name, " (", t.role, ")"]
              }, t.id))
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("label", {
            className: "text-xs font-bold text-slate-700 block mb-1",
            children: "Descripción Detallada del Requerimiento"
          }), /*#__PURE__*/_jsx("textarea", {
            rows: 3,
            value: formData.description,
            onChange: e => setFormData({
              ...formData,
              description: e.target.value
            }),
            placeholder: "Escriba las instrucciones de trabajo para el técnico...",
            className: "w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-900 focus:border-[#8CC63F] focus:bg-white outline-none font-medium"
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3",
          children: [/*#__PURE__*/_jsx("h3", {
            className: "text-xs font-bold text-[#0A3963] uppercase tracking-wider",
            children: "1. Procedimiento & Checklist de Verificación paso a paso"
          }), /*#__PURE__*/_jsx("div", {
            className: "space-y-2",
            children: formData.checklist.map(item => /*#__PURE__*/_jsxs("div", {
              className: "flex items-center justify-between p-2.5 rounded bg-white border border-slate-200 text-xs",
              children: [/*#__PURE__*/_jsxs("label", {
                className: "flex items-center gap-2.5 cursor-pointer flex-1",
                children: [/*#__PURE__*/_jsx("input", {
                  type: "checkbox",
                  checked: item.completed,
                  onChange: () => handleChecklistToggle(item.id),
                  className: "w-4 h-4 accent-[#8CC63F] rounded cursor-pointer"
                }), /*#__PURE__*/_jsx("span", {
                  className: item.completed ? 'line-through text-slate-400 font-medium' : 'text-slate-900 font-semibold',
                  children: item.text
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-2",
                children: [item.completed && /*#__PURE__*/_jsx("span", {
                  className: "text-[10px] text-emerald-600 font-mono font-bold",
                  children: item.timestamp
                }), /*#__PURE__*/_jsx("button", {
                  type: "button",
                  onClick: () => handleRemoveChecklistItem(item.id),
                  className: "text-slate-400 hover:text-red-600 text-xs font-bold",
                  children: "🗑️"
                })]
              })]
            }, item.id))
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex gap-2",
            children: [/*#__PURE__*/_jsx("input", {
              type: "text",
              value: newChecklistItem,
              onChange: e => setNewChecklistItem(e.target.value),
              placeholder: "Agregar nuevo paso al procedimiento...",
              className: "flex-1 bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-[#8CC63F] font-medium"
            }), /*#__PURE__*/_jsx("button", {
              type: "button",
              onClick: handleAddChecklistItem,
              className: "px-3 py-1.5 rounded bg-[#0A3963] text-white text-xs font-bold shadow-xs hover:bg-[#082D4F]",
              children: "+ Agregar Paso"
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3",
          children: [/*#__PURE__*/_jsx("h3", {
            className: "text-xs font-bold text-[#0A3963] uppercase tracking-wider",
            children: "2. Asignación de Repuestos & Cálculo de Costo Total"
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex flex-col sm:flex-row gap-2",
            children: [/*#__PURE__*/_jsx("select", {
              value: selectedPartId,
              onChange: e => setSelectedPartId(e.target.value),
              className: "flex-1 bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 outline-none font-medium",
              children: inventory.map(p => /*#__PURE__*/_jsxs("option", {
                value: p.id,
                children: [p.name, " (Stock: ", p.currentStock, ") - $", p.unitCost, " USD"]
              }, p.id))
            }), /*#__PURE__*/_jsx("input", {
              type: "number",
              min: "1",
              value: partQty,
              onChange: e => setPartQty(e.target.value),
              className: "w-20 bg-white border border-slate-300 rounded px-2 py-1.5 text-xs text-slate-900 text-center outline-none font-bold"
            }), /*#__PURE__*/_jsx("button", {
              type: "button",
              onClick: handleAddPart,
              className: "px-4 py-1.5 rounded btn-park-green text-xs shadow-xs",
              children: "+ Añadir Repuesto"
            })]
          }), formData.usedParts.length > 0 && /*#__PURE__*/_jsx("div", {
            className: "space-y-1.5",
            children: formData.usedParts.map(p => /*#__PURE__*/_jsxs("div", {
              className: "flex items-center justify-between p-2 rounded bg-white text-xs border border-slate-200",
              children: [/*#__PURE__*/_jsxs("span", {
                className: "text-slate-800 font-bold",
                children: [p.name, " (x", p.qty, ")"]
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-3",
                children: [/*#__PURE__*/_jsxs("span", {
                  className: "text-[#0A3963] font-extrabold",
                  children: ["$", p.totalCost.toFixed(2), " USD"]
                }), /*#__PURE__*/_jsx("button", {
                  type: "button",
                  onClick: () => handleRemovePart(p.partId),
                  className: "text-red-500 hover:text-red-700 font-bold",
                  children: "✕"
                })]
              })]
            }, p.partId))
          }), /*#__PURE__*/_jsxs("div", {
            className: "p-3 rounded bg-white border border-[#8CC63F]/50 flex justify-between items-center text-xs",
            children: [/*#__PURE__*/_jsxs("span", {
              className: "text-slate-600 font-medium",
              children: ["Materiales: ", /*#__PURE__*/_jsxs("b", {
                children: ["$", totalPartsCost.toFixed(2)]
              }), " | Mano de Obra: ", /*#__PURE__*/_jsxs("b", {
                children: ["$", totalLaborCost.toFixed(2)]
              })]
            }), /*#__PURE__*/_jsxs("span", {
              className: "text-sm font-extrabold text-[#0A3963]",
              children: ["TOTAL: $", grandTotal.toFixed(2), " USD"]
            })]
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "p-4 rounded-xl bg-slate-50 border border-slate-200",
          children: /*#__PURE__*/_jsx(SignaturePad, {
            initialSignature: formData.signatureData,
            onSaveSignature: sig => setFormData(prev => ({
              ...prev,
              signatureData: sig
            }))
          })
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between pt-4 border-t border-slate-200 flex-wrap gap-3",
          children: [/*#__PURE__*/_jsxs("button", {
            type: "button",
            onClick: () => handleSubmitAndGeneratePdf(true),
            className: "px-5 py-2 rounded-lg btn-park-blue text-xs font-extrabold shadow-sm flex items-center gap-2",
            children: [/*#__PURE__*/_jsx(Icon, {
              name: "pdf",
              className: "w-4 h-4 mr-1.5"
            }), " ", /*#__PURE__*/_jsx("span", {
              children: "Guardar y Generar PDF Oficial"
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2",
            children: [/*#__PURE__*/_jsx("button", {
              type: "button",
              onClick: onClose,
              className: "px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold",
              children: "Cancelar"
            }), /*#__PURE__*/_jsxs("button", {
              type: "submit",
              className: "px-6 py-2 rounded-lg btn-park-green text-xs shadow hover:scale-105 transition-transform",
              children: [/*#__PURE__*/_jsx(Icon, {
                name: "save",
                className: "w-4 h-4 mr-1.5"
              }), " Guardar Orden"]
            })]
          })]
        })]
      })]
    })
  });
};

// Assets
const Assets = ({
  assets,
  workOrders,
  onNewWO
}) => {
  const [selectedAsset, setSelectedAsset] = React.useState(null);
  return /*#__PURE__*/_jsxs("div", {
    className: "space-y-6",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "p-6 rounded-2xl park-card flex flex-col sm:flex-row sm:items-center justify-between gap-4",
      children: [/*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx("h1", {
          className: "text-2xl font-extrabold text-[#0A3963] font-heading",
          children: "Gestión de Activos & Infraestructura"
        }), /*#__PURE__*/_jsx("p", {
          className: "text-xs text-slate-500 font-medium",
          children: "Inventario técnico de equipos en desarrollos de PlataformaPark"
        })]
      }), /*#__PURE__*/_jsxs("button", {
        onClick: onNewWO,
        className: "px-4 py-2 rounded-lg btn-park-green text-xs shadow hover:scale-[1.02] transition-transform shrink-0",
        children: [/*#__PURE__*/_jsx(Icon, {
          name: "plus",
          className: "w-4 h-4 mr-1.5"
        }), " Generar Orden para Activo"]
      })]
    }), /*#__PURE__*/_jsx("div", {
      className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
      children: assets.map(asset => {
        let statusBadge = "badge-completed";
        if (asset.status === 'Fuera de Servicio') statusBadge = "badge-urgent";else if (asset.status === 'En Mantenimiento') statusBadge = "badge-medium";
        const historyWO = workOrders.filter(w => w.assetId === asset.id);
        return /*#__PURE__*/_jsxs("div", {
          onClick: () => setSelectedAsset(asset),
          className: "p-5 rounded-2xl park-card park-card-hover cursor-pointer space-y-4 flex flex-col justify-between",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "space-y-2",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center justify-between",
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-xs font-mono font-bold text-[#0A3963]",
                children: asset.code
              }), /*#__PURE__*/_jsx("span", {
                className: `px-2.5 py-0.5 rounded text-[10px] font-extrabold ${statusBadge}`,
                children: asset.status
              })]
            }), /*#__PURE__*/_jsx("h3", {
              className: "text-base font-bold text-slate-900 group-hover:text-[#0A3963] font-heading",
              children: asset.name
            }), /*#__PURE__*/_jsxs("p", {
              className: "text-xs text-slate-600 font-medium",
              children: ["📍 ", asset.location]
            }), /*#__PURE__*/_jsxs("p", {
              className: "text-[11px] text-slate-500",
              children: ["🏷️ Marca: ", /*#__PURE__*/_jsx("span", {
                className: "text-slate-800 font-semibold",
                children: asset.brand
              }), " (", asset.model, ")"]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "pt-3 border-t border-slate-200 grid grid-cols-2 gap-2 text-[10px]",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "p-2 rounded bg-slate-50 border border-slate-200",
              children: [/*#__PURE__*/_jsx("p", {
                className: "text-slate-500 font-medium",
                children: "Criticidad"
              }), /*#__PURE__*/_jsx("p", {
                className: "font-extrabold text-[#0A3963]",
                children: asset.criticality
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "p-2 rounded bg-slate-50 border border-slate-200",
              children: [/*#__PURE__*/_jsx("p", {
                className: "text-slate-500 font-medium",
                children: "Historial WOs"
              }), /*#__PURE__*/_jsxs("p", {
                className: "font-extrabold text-slate-900",
                children: [historyWO.length, " Registros"]
              })]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex justify-between items-center text-xs pt-1",
            children: [/*#__PURE__*/_jsxs("span", {
              className: "text-slate-500 text-[10px] font-medium",
              children: ["MTTR: ", asset.mttrHours, "h | MTBF: ", asset.mtbfDays, "d"]
            }), /*#__PURE__*/_jsx("span", {
              className: "text-[#8CC63F] font-bold hover:underline",
              children: "Ver Expediente →"
            })]
          })]
        }, asset.id);
      })
    }), selectedAsset && /*#__PURE__*/_jsx("div", {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs",
      children: /*#__PURE__*/_jsxs("div", {
        className: "relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between pb-3 border-b border-slate-200",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2",
            children: [/*#__PURE__*/_jsx(ParkLogo, {}), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-xs font-mono font-bold text-[#0A3963]",
                children: selectedAsset.code
              }), /*#__PURE__*/_jsx("h2", {
                className: "text-xl font-extrabold text-slate-900 font-heading",
                children: selectedAsset.name
              })]
            })]
          }), /*#__PURE__*/_jsx("button", {
            onClick: () => setSelectedAsset(null),
            className: "text-slate-400 hover:text-slate-700 text-xl font-bold",
            children: "✕"
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "grid grid-cols-2 gap-4 text-xs",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "space-y-1",
            children: [/*#__PURE__*/_jsx("p", {
              className: "text-slate-500 font-medium",
              children: "Desarrollo / Parque"
            }), /*#__PURE__*/_jsx("p", {
              className: "font-bold text-slate-900",
              children: selectedAsset.development
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "space-y-1",
            children: [/*#__PURE__*/_jsx("p", {
              className: "text-slate-500 font-medium",
              children: "Ubicación Físico-Específica"
            }), /*#__PURE__*/_jsx("p", {
              className: "font-bold text-slate-900",
              children: selectedAsset.location
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "space-y-1",
            children: [/*#__PURE__*/_jsx("p", {
              className: "text-slate-500 font-medium",
              children: "Número de Serie"
            }), /*#__PURE__*/_jsx("p", {
              className: "font-mono text-[#0A3963] font-bold",
              children: selectedAsset.serialNumber
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "space-y-1",
            children: [/*#__PURE__*/_jsx("p", {
              className: "text-slate-500 font-medium",
              children: "Costo Acumulado Reparaciones"
            }), /*#__PURE__*/_jsxs("p", {
              className: "font-extrabold text-emerald-700",
              children: ["$", selectedAsset.totalMaintenanceCost.toFixed(2), " USD"]
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1",
          children: [/*#__PURE__*/_jsx("p", {
            className: "font-bold text-[#0A3963]",
            children: "Especificaciones Técnicas:"
          }), /*#__PURE__*/_jsx("p", {
            className: "text-slate-700 font-medium",
            children: selectedAsset.specs
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "p-4 rounded-xl bg-[#0A3963] border border-slate-800 flex items-center justify-between text-white",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "space-y-1",
            children: [/*#__PURE__*/_jsx("p", {
              className: "text-xs font-bold text-white",
              children: "Etiqueta Digital QR / Barcode"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-[10px] text-slate-300 font-medium",
              children: "Escanear para apertura rápida en MaintainX Mobile"
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "w-16 h-16 bg-white p-1 rounded flex items-center justify-center text-[8px] font-mono text-black font-extrabold text-center leading-tight",
            children: ["[QR ", selectedAsset.code, "]"]
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "flex justify-end pt-2",
          children: /*#__PURE__*/_jsx("button", {
            onClick: () => setSelectedAsset(null),
            className: "px-4 py-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold",
            children: "Cerrar Expediente"
          })
        })]
      })
    })]
  });
};

// PreventiveMaintenance
const PreventiveMaintenance = ({
  schedules,
  onGenerateWOFromPM
}) => /*#__PURE__*/_jsxs("div", {
  className: "space-y-6",
  children: [/*#__PURE__*/_jsx("div", {
    className: "p-6 rounded-2xl park-card flex flex-col sm:flex-row sm:items-center justify-between gap-4",
    children: /*#__PURE__*/_jsxs("div", {
      children: [/*#__PURE__*/_jsx("h1", {
        className: "text-2xl font-extrabold text-[#0A3963] font-heading",
        children: "Mantenimiento Preventivo (PM)"
      }), /*#__PURE__*/_jsx("p", {
        className: "text-xs text-slate-500 font-medium",
        children: "Programación de rutinas periódicas y generación automatizada | PlataformaPark"
      })]
    })
  }), /*#__PURE__*/_jsx("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-6",
    children: schedules.map(pm => /*#__PURE__*/_jsxs("div", {
      className: "p-6 rounded-2xl park-card space-y-4 flex flex-col justify-between",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "space-y-2",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between",
          children: [/*#__PURE__*/_jsx("span", {
            className: "text-xs font-mono font-bold text-[#0A3963]",
            children: pm.id
          }), /*#__PURE__*/_jsx("span", {
            className: "px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold",
            children: pm.frequency
          })]
        }), /*#__PURE__*/_jsx("h3", {
          className: "text-base font-bold text-slate-900 font-heading",
          children: pm.title
        }), /*#__PURE__*/_jsxs("p", {
          className: "text-xs text-slate-600 font-medium",
          children: ["⚙️ Activo: ", /*#__PURE__*/_jsx("span", {
            className: "font-bold text-slate-900",
            children: pm.assetName
          })]
        }), /*#__PURE__*/_jsxs("p", {
          className: "text-xs text-slate-500 font-medium",
          children: ["👤 Técnico Asignado: ", /*#__PURE__*/_jsx("span", {
            className: "text-slate-800 font-bold",
            children: pm.assignedTech
          })]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "pt-3 border-t border-slate-200 flex items-center justify-between text-xs",
        children: [/*#__PURE__*/_jsxs("span", {
          className: "text-slate-500 text-[10px] font-medium",
          children: ["Próxima Fecha: ", /*#__PURE__*/_jsx("b", {
            className: "text-[#0A3963] font-bold",
            children: pm.nextDueDate
          })]
        }), /*#__PURE__*/_jsxs("button", {
          onClick: () => onGenerateWOFromPM(pm),
          className: "px-3.5 py-2 rounded btn-park-green text-xs font-extrabold shadow hover:scale-105 transition-transform",
          children: [/*#__PURE__*/_jsx(Icon, {
            name: "zap",
            className: "w-4 h-4 mr-1.5"
          }), " Generar Orden de Trabajo"]
        })]
      })]
    }, pm.id))
  })]
});

// Inventory
const Inventory = ({
  inventory,
  onUpdateStock
}) => {
  const [editingItem, setEditingItem] = React.useState(null);
  const [stockDelta, setStockDelta] = React.useState(0);
  const handleSaveStock = () => {
    if (!editingItem) return;
    const newStock = Math.max(0, editingItem.currentStock + Number(stockDelta));
    onUpdateStock(editingItem.id, newStock);
    setEditingItem(null);
    setStockDelta(0);
  };
  return /*#__PURE__*/_jsxs("div", {
    className: "space-y-6",
    children: [/*#__PURE__*/_jsx("div", {
      className: "p-6 rounded-2xl park-card flex flex-col sm:flex-row sm:items-center justify-between gap-4",
      children: /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx("h1", {
          className: "text-2xl font-extrabold text-[#0A3963] font-heading",
          children: "Repuestos & Control de Almacén"
        }), /*#__PURE__*/_jsx("p", {
          className: "text-xs text-slate-500 font-medium",
          children: "Inventario de refacciones e insumos de mantenimiento | Plataforma PARK"
        })]
      })
    }), /*#__PURE__*/_jsx("div", {
      className: "p-6 rounded-2xl park-card overflow-x-auto",
      children: /*#__PURE__*/_jsxs("table", {
        className: "w-full text-left border-collapse",
        children: [/*#__PURE__*/_jsx("thead", {
          children: /*#__PURE__*/_jsxs("tr", {
            className: "border-b border-slate-200 text-[11px] font-extrabold text-[#0A3963] uppercase tracking-wider bg-slate-50",
            children: [/*#__PURE__*/_jsx("th", {
              className: "py-3 px-3",
              children: "SKU"
            }), /*#__PURE__*/_jsx("th", {
              className: "py-3 px-3",
              children: "Nombre del Repuesto"
            }), /*#__PURE__*/_jsx("th", {
              className: "py-3 px-3",
              children: "Categoría"
            }), /*#__PURE__*/_jsx("th", {
              className: "py-3 px-3 text-center",
              children: "Stock Actual"
            }), /*#__PURE__*/_jsx("th", {
              className: "py-3 px-3 text-center",
              children: "Stock Mínimo"
            }), /*#__PURE__*/_jsx("th", {
              className: "py-3 px-3 text-right",
              children: "Costo Unit."
            }), /*#__PURE__*/_jsx("th", {
              className: "py-3 px-3 text-center whitespace-nowrap min-w-[130px]",
              children: "Estado"
            }), /*#__PURE__*/_jsx("th", {
              className: "py-3 px-3 text-center whitespace-nowrap",
              children: "Acciones"
            })]
          })
        }), /*#__PURE__*/_jsx("tbody", {
          className: "divide-y divide-slate-200 text-xs",
          children: inventory.map(item => {
            const isLow = item.currentStock <= item.minStock;
            return /*#__PURE__*/_jsxs("tr", {
              className: "hover:bg-slate-50/80 transition-colors",
              children: [/*#__PURE__*/_jsx("td", {
                className: "py-3.5 px-3 font-mono font-bold text-[#0A3963]",
                children: item.sku
              }), /*#__PURE__*/_jsxs("td", {
                className: "py-3.5 px-3 font-bold text-slate-900",
                children: [item.name, /*#__PURE__*/_jsx("p", {
                  className: "text-[10px] text-slate-500 font-normal",
                  children: item.location
                })]
              }), /*#__PURE__*/_jsx("td", {
                className: "py-3.5 px-3 text-slate-700 font-medium",
                children: item.category
              }), /*#__PURE__*/_jsxs("td", {
                className: "py-3.5 px-3 text-center font-extrabold text-base text-slate-900",
                children: [item.currentStock, " ", item.unit]
              }), /*#__PURE__*/_jsxs("td", {
                className: "py-3.5 px-3 text-center text-slate-500 font-medium",
                children: [item.minStock, " ", item.unit]
              }), /*#__PURE__*/_jsxs("td", {
                className: "py-3.5 px-3 text-right font-extrabold text-[#0A3963]",
                children: ["$", item.unitCost.toFixed(2), " USD"]
              }), /*#__PURE__*/_jsx("td", {
                className: "py-3.5 px-3 text-center whitespace-nowrap",
                children: isLow ? /*#__PURE__*/_jsxs("span", {
                  className: "inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-red-50 text-red-600 border border-red-200 animate-pulse whitespace-nowrap",
                  children: [/*#__PURE__*/_jsx(Icon, {
                    name: "alert",
                    className: "w-3.5 h-3.5 text-red-600 shrink-0"
                  }), " Reordenar Stock"]
                }) : /*#__PURE__*/_jsxs("span", {
                  className: "inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap",
                  children: [/*#__PURE__*/_jsx(Icon, {
                    name: "check",
                    className: "w-3.5 h-3.5 text-emerald-600 shrink-0"
                  }), " Óptimo"]
                })
              }), /*#__PURE__*/_jsx("td", {
                className: "py-3.5 px-3 text-center",
                children: /*#__PURE__*/_jsxs("button", {
                  onClick: () => {
                    setEditingItem(item);
                    setStockDelta(0);
                  },
                  className: "px-2.5 py-1 rounded btn-park-blue text-[10px] font-bold shadow-xs",
                  children: [/*#__PURE__*/_jsx(Icon, {
                    name: "edit",
                    className: "w-4 h-4 mr-1"
                  }), " Ajustar Stock"]
                })
              })]
            }, item.id);
          })
        })]
      })
    }), editingItem && /*#__PURE__*/_jsx("div", {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs",
      children: /*#__PURE__*/_jsxs("div", {
        className: "relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 space-y-4",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between pb-2 border-b border-slate-200",
          children: [/*#__PURE__*/_jsxs("h3", {
            className: "font-extrabold text-slate-900 text-base",
            children: ["Ajuste de Stock: ", editingItem.name]
          }), /*#__PURE__*/_jsx("button", {
            onClick: () => setEditingItem(null),
            className: "text-slate-400 hover:text-slate-700 font-bold",
            children: "✕"
          })]
        }), /*#__PURE__*/_jsxs("p", {
          className: "text-xs text-slate-600 font-medium",
          children: ["Stock Actual: ", /*#__PURE__*/_jsxs("b", {
            className: "text-[#0A3963] font-bold",
            children: [editingItem.currentStock, " ", editingItem.unit]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("label", {
            className: "text-xs font-bold text-slate-700 block mb-1",
            children: "Entrada (+) / Salida (-) de repuestos"
          }), /*#__PURE__*/_jsx("input", {
            type: "number",
            value: stockDelta,
            onChange: e => setStockDelta(e.target.value),
            placeholder: "Ej. 5 o -2",
            className: "w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-bold outline-none focus:border-[#8CC63F]"
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex justify-end gap-2 pt-2",
          children: [/*#__PURE__*/_jsx("button", {
            onClick: () => setEditingItem(null),
            className: "px-4 py-2 rounded bg-slate-100 text-xs font-bold text-slate-700",
            children: "Cancelar"
          }), /*#__PURE__*/_jsxs("button", {
            onClick: handleSaveStock,
            className: "px-4 py-2 rounded btn-park-green text-xs shadow-xs",
            children: [/*#__PURE__*/_jsx(Icon, {
              name: "save",
              className: "w-4 h-4 mr-1.5"
            }), " Guardar Ajuste"]
          })]
        })]
      })
    })]
  });
};

// Consolidated PDF Generator Modal (en Centro de Reportes)
const ExportPdfModal = ({
  isOpen,
  onClose,
  data
}) => {
  if (!isOpen) return null;
  const {
    workOrders = []
  } = data;
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
      data: {
        ...data,
        filteredWorkOrders: filtered
      },
      exportOptions: {
        filterDesc: `Estado: ${selectedStatus} | Prioridad: ${selectedPriority}`
      }
    });
    onClose();
  };
  return /*#__PURE__*/_jsx("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs",
    children: /*#__PURE__*/_jsxs("div", {
      className: "relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center justify-between pb-3 border-b border-slate-200",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2",
          children: [/*#__PURE__*/_jsx("span", {
            className: "text-xl",
            children: "📄"
          }), /*#__PURE__*/_jsx("h2", {
            className: "text-lg font-extrabold text-[#0A3963] font-heading",
            children: "Reporte Consolidado de Mantenimiento"
          })]
        }), /*#__PURE__*/_jsx("button", {
          onClick: onClose,
          className: "text-slate-400 hover:text-slate-700 font-bold",
          children: "✕"
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "grid grid-cols-2 gap-3",
        children: [/*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("label", {
            className: "text-xs font-bold text-slate-700 block mb-1",
            children: "Filtrar por Estado"
          }), /*#__PURE__*/_jsxs("select", {
            value: selectedStatus,
            onChange: e => setSelectedStatus(e.target.value),
            className: "w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 font-medium outline-none",
            children: [/*#__PURE__*/_jsx("option", {
              value: "ALL",
              children: "Todos los Estados"
            }), /*#__PURE__*/_jsx("option", {
              value: "Abierta",
              children: "Abierta"
            }), /*#__PURE__*/_jsx("option", {
              value: "En Proceso",
              children: "En Proceso"
            }), /*#__PURE__*/_jsx("option", {
              value: "Completada",
              children: "Completada"
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("label", {
            className: "text-xs font-bold text-slate-700 block mb-1",
            children: "Filtrar por Prioridad"
          }), /*#__PURE__*/_jsxs("select", {
            value: selectedPriority,
            onChange: e => setSelectedPriority(e.target.value),
            className: "w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 font-medium outline-none",
            children: [/*#__PURE__*/_jsx("option", {
              value: "ALL",
              children: "Todas las Prioridades"
            }), /*#__PURE__*/_jsx("option", {
              value: "Urgente",
              children: "Urgente"
            }), /*#__PURE__*/_jsx("option", {
              value: "Alta",
              children: "Alta"
            }), /*#__PURE__*/_jsx("option", {
              value: "Media",
              children: "Media"
            })]
          })]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex justify-end gap-3 pt-2",
        children: [/*#__PURE__*/_jsx("button", {
          onClick: onClose,
          className: "px-4 py-2 rounded bg-slate-100 text-xs font-bold text-slate-700",
          children: "Cancelar"
        }), /*#__PURE__*/_jsxs("button", {
          onClick: handleExportConsolidated,
          className: "px-6 py-2 rounded btn-park-green text-xs shadow hover:scale-105 transition-transform",
          children: [/*#__PURE__*/_jsx(Icon, {
            name: "pdf",
            className: "w-4 h-4 mr-1.5"
          }), " Descargar PDF Consolidado"]
        })]
      })]
    })
  });
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
  const [isWOModalOpen, setIsWOModalOpen] = React.useState(false);
  const [isPdfExportModalOpen, setIsPdfExportModalOpen] = React.useState(false);
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
  const handleLoginSuccess = user => {
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
    return /*#__PURE__*/_jsx(LoginScreen, {
      onLoginSuccess: handleLoginSuccess
    });
  }
  const handleSaveWO = newOrUpdatedWO => {
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
              return {
                ...item,
                currentStock: Math.max(0, item.currentStock - p.qty)
              };
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
      workOrders: prev.workOrders.map(w => w.id === woId ? {
        ...w,
        status: newStatus
      } : w)
    }));
  };
  const handleUpdateStock = (partId, newStock) => {
    setData(prev => ({
      ...prev,
      inventory: prev.inventory.map(item => item.id === partId ? {
        ...item,
        currentStock: newStock
      } : item)
    }));
  };
  const handleGenerateWOFromPM = pm => {
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
      checklist: [{
        id: 1,
        text: 'Bloqueo y etiquetado LOTO de seguridad.',
        completed: false,
        timestamp: null
      }, {
        id: 2,
        text: `Ejecutar tareas de rutina ${pm.frequency}.`,
        completed: false,
        timestamp: null
      }, {
        id: 3,
        text: 'Verificar parámetros de operación normales.',
        completed: false,
        timestamp: null
      }],
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
  const handleExportSinglePdf = wo => {
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
  const openEditWOModal = wo => {
    setSelectedWO(wo);
    setIsWOModalOpen(true);
  };
  const openCount = data.workOrders.filter(w => w.status === 'Abierta' || w.status === 'En Proceso').length;
  const lowStockCount = data.inventory.filter(i => i.currentStock <= i.minStock).length;
  return /*#__PURE__*/_jsxs("div", {
    className: "min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans",
    children: [/*#__PURE__*/_jsx(Header, {
      searchTerm: searchTerm,
      setSearchTerm: setSearchTerm,
      onNewWorkOrder: openNewWOModal,
      lowStockCount: lowStockCount,
      currentUser: currentUser,
      onLogout: handleLogout,
      data: data,
      onNavigateTab: tab => setActiveTab(tab),
      onSelectWO: openEditWOModal
    }), /*#__PURE__*/_jsxs("div", {
      className: "flex-1 flex flex-col lg:flex-row",
      children: [/*#__PURE__*/_jsx(Sidebar, {
        activeTab: activeTab,
        setActiveTab: setActiveTab,
        openCount: openCount,
        lowStockCount: lowStockCount,
        currentUser: currentUser,
        onLogout: handleLogout
      }), /*#__PURE__*/_jsxs("main", {
        className: "flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto space-y-6",
        children: [activeTab === 'dashboard' && /*#__PURE__*/_jsx(Dashboard, {
          data: data,
          onSelectWO: openEditWOModal,
          onNewWO: openNewWOModal
        }), activeTab === 'workOrders' && /*#__PURE__*/_jsx(WorkOrders, {
          workOrders: data.workOrders,
          onSelectWO: openEditWOModal,
          onNewWO: openNewWOModal,
          onExportSinglePdf: handleExportSinglePdf,
          onStatusChange: handleStatusChange,
          searchTerm: searchTerm
        }), activeTab === 'assets' && /*#__PURE__*/_jsx(Assets, {
          assets: data.assets,
          workOrders: data.workOrders,
          onNewWO: openNewWOModal
        }), activeTab === 'preventive' && /*#__PURE__*/_jsx(PreventiveMaintenance, {
          schedules: data.preventiveSchedules,
          onGenerateWOFromPM: handleGenerateWOFromPM
        }), activeTab === 'inventory' && /*#__PURE__*/_jsx(Inventory, {
          inventory: data.inventory,
          onUpdateStock: handleUpdateStock
        }), activeTab === 'reports' && /*#__PURE__*/_jsxs("div", {
          className: "p-8 rounded-2xl park-card space-y-6 text-center max-w-2xl mx-auto my-8",
          children: [/*#__PURE__*/_jsx("div", {
            className: "w-16 h-16 rounded-full btn-park-green mx-auto flex items-center justify-center text-2xl font-bold text-white shadow-md",
            children: "📄"
          }), /*#__PURE__*/_jsx("h2", {
            className: "text-2xl font-bold text-[#0A3963] font-heading",
            children: "Centro de Reportes PDF MaintainX — Plataforma PARK"
          }), /*#__PURE__*/_jsx("p", {
            className: "text-xs text-slate-600 font-medium",
            children: "Generación de informes consolidados de mantenimiento con membrete corporativo de PlataformaPark, tablas de procedimiento y desgloses."
          }), /*#__PURE__*/_jsxs("button", {
            onClick: () => setIsPdfExportModalOpen(true),
            className: "px-6 py-3 rounded-xl btn-park-green text-white font-extrabold text-sm shadow-md hover:scale-105 transition-transform",
            children: [/*#__PURE__*/_jsx(Icon, {
              name: "pdf",
              className: "w-4 h-4 mr-1.5"
            }), " Generar Reporte Consolidado PDF"]
          })]
        }), activeTab === 'users' && /*#__PURE__*/_jsx(UsersManagement, {}), activeTab === 'settings' && /*#__PURE__*/_jsx(SettingsView, {})]
      })]
    }), /*#__PURE__*/_jsx(WorkOrderModal, {
      isOpen: isWOModalOpen,
      onClose: () => setIsWOModalOpen(false),
      onSave: handleSaveWO,
      workOrder: selectedWO,
      assets: data.assets,
      inventory: data.inventory,
      technicians: data.technicians,
      onExportPdf: handleExportSinglePdf
    }), /*#__PURE__*/_jsx(ExportPdfModal, {
      isOpen: isPdfExportModalOpen,
      onClose: () => setIsPdfExportModalOpen(false),
      data: data
    })]
  });
}

// Render root cleanly
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(/*#__PURE__*/_jsx(App, {}));
}