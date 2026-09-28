export const ROLES_CONFIG = {
  developer: {
    name: "Desarrollador / QA",
    badgeColor: "bg-slate-900 text-emerald-400 border-slate-700",
    defaultModule: "dashboard",
    modules: ["dashboard", "workOrders", "assets", "preventive", "inventory", "reports", "audit", "users", "settings"]
  },
  admin: {
    name: "Administrador del Sistema",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
    defaultModule: "dashboard",
    modules: ["dashboard", "workOrders", "assets", "preventive", "inventory", "reports", "audit", "users", "settings"]
  },
  supervisor: {
    name: "Supervisor de Mantenimiento",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
    defaultModule: "dashboard",
    modules: ["dashboard", "workOrders", "assets", "preventive", "inventory", "reports", "audit"]
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
    modules: ["dashboard", "workOrders", "assets", "reports", "audit"]
  }
};

export const DEMO_ACCOUNTS = [
  { email: 'admin@park.com', role: 'admin', label: 'Administrador', desc: 'Acceso Total: Gestión y Operaciones' },
  { email: 'dev@park.com', role: 'developer', label: 'Desarrollador', desc: 'Dev Mode: Acceso Total + Simulación y QA' },
  { email: 'tecnico@park.com', role: 'tecnico', label: 'Técnico', desc: 'Órdenes e Inventario' },
  { email: 'supervisor@park.com', role: 'supervisor', label: 'Supervisor', desc: 'Supervisión y programación' },
  { email: 'solicitante@park.com', role: 'solicitante', label: 'Solicitante', desc: 'Solicitudes de Mantenimiento' },
  { email: 'auditor@park.com', role: 'auditor', label: 'Auditor', desc: 'Lectura y Reportes PDF' }
];
