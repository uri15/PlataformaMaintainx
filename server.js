/**
 * PLATAFORMA PARK CMMS — Servidor Backend Node.js (Express + Socket.io)
 * Sincronización bidireccional en tiempo real para Órdenes de Trabajo, Chat, Inventario y Activos.
 * Autenticación JWT + Middleware RBAC dinámico guiado por roles.json
 */

const express = require('express');
const http = require('http');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const httpServer = http.createServer(app);

// Configuración de Socket.io con CORS y búfer de 10MB para fotografías y documentos de chat
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  },
  maxHttpBufferSize: 1e7 // 10MB
});

// Carga automática de variables de entorno desde .env si existe
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  try {
    const envLines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
    envLines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [k, ...v] = trimmed.split('=');
        if (!process.env[k.trim()]) {
          process.env[k.trim()] = v.join('=').trim();
        }
      }
    });
  } catch (e) {
    console.warn('[ENV] No se pudo leer .env:', e.message);
  }
}

const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET || 'cmms_park_super_secret_jwt_key_2026_plataformapark_platform';

app.use(cors());
app.use(express.json({ limit: '15mb' }));

// Forzar tipo MIME correcto para archivos JSX en navegadores
app.use((req, res, next) => {
  if (req.path.endsWith('.jsx')) {
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  }
  next();
});

// Directorios de almacenamiento en disco para fotografías y archivos
const uploadsDir = path.join(__dirname, 'uploads');
const photosDir = path.join(uploadsDir, 'photos');
const documentsDir = path.join(uploadsDir, 'documents');
const avatarsDir = path.join(uploadsDir, 'avatars');
[uploadsDir, photosDir, documentsDir, avatarsDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

app.use('/uploads', express.static(uploadsDir));
app.use(express.static(__dirname));

// Empaquetador automático en caliente con esbuild para arquitectura modular
const esbuild = require('esbuild');
async function startBundler() {
  try {
    const ctx = await esbuild.context({
      entryPoints: ['src/main.jsx'],
      bundle: true,
      outfile: 'dist/bundle.js',
      loader: { '.jsx': 'jsx', '.js': 'jsx' },
      define: { 'process.env.NODE_ENV': '"development"' },
      sourcemap: true
    });
    await ctx.watch();
    console.log('⚡ [esbuild] Compilación instantánea activa (<30ms) -> dist/bundle.js');
  } catch (e) {
    console.error('[esbuild] Error al iniciar watcher:', e.message);
  }
}
startBundler();

// Base de Datos Centralizada en cmms_db.json
const dbFilePath = path.join(__dirname, 'src', 'data', 'cmms_db.json');

function getSeedAuditLogs() {
  const baseTime = Date.now();
  return [
    {
      id: 'aud-seed-001',
      folio: 'AUD-892101',
      timestamp: new Date(baseTime - 1000 * 60 * 15).toISOString(),
      formattedDate: new Date(baseTime - 1000 * 60 * 15).toLocaleString('es-MX', { timeZone: 'America/Mexico_City', hour12: true }),
      category: 'SEGURIDAD',
      action: 'LOGIN_EXITOSO',
      details: 'Autenticación satisfactoria del usuario Ing. Carlos Mendoza (ADMIN)',
      severity: 'EXITO',
      userId: 'u-admin-001',
      userName: 'Ing. Carlos Mendoza (Admin)',
      userEmail: 'admin@park.com',
      userRole: 'admin',
      targetId: null,
      metadata: { ip: '192.168.1.45', client: 'CMMS Desktop App' }
    },
    {
      id: 'aud-seed-002',
      folio: 'AUD-892102',
      timestamp: new Date(baseTime - 1000 * 60 * 45).toISOString(),
      formattedDate: new Date(baseTime - 1000 * 60 * 45).toLocaleString('es-MX', { timeZone: 'America/Mexico_City', hour12: true }),
      category: 'ORDENES',
      action: 'CAMBIO_ESTADO_ORDEN',
      details: 'Orden [WO-2026-003] cambió a estado "Completada"',
      severity: 'EXITO',
      userId: 'u-tecnico-003',
      userName: 'Téc. Juan Pérez (Técnico)',
      userEmail: 'tecnico@park.com',
      userRole: 'tecnico',
      targetId: 'wo-3',
      metadata: { durationMinutes: 45, partsUsed: 2 }
    },
    {
      id: 'aud-seed-003',
      folio: 'AUD-892103',
      timestamp: new Date(baseTime - 1000 * 60 * 90).toISOString(),
      formattedDate: new Date(baseTime - 1000 * 60 * 90).toLocaleString('es-MX', { timeZone: 'America/Mexico_City', hour12: true }),
      category: 'INVENTARIO',
      action: 'AJUSTE_STOCK',
      details: 'Ajuste manual de stock para "Sensor Óptico Inductivo 24V": nuevo inventario 14 uds.',
      severity: 'INFO',
      userId: 'u-admin-001',
      userName: 'Ing. Carlos Mendoza (Admin)',
      userEmail: 'admin@park.com',
      userRole: 'admin',
      targetId: 'part-1',
      metadata: { previousStock: 8, reason: 'Recepción de embarque' }
    },
    {
      id: 'aud-seed-004',
      folio: 'AUD-892104',
      timestamp: new Date(baseTime - 1000 * 60 * 180).toISOString(),
      formattedDate: new Date(baseTime - 1000 * 60 * 180).toLocaleString('es-MX', { timeZone: 'America/Mexico_City', hour12: true }),
      category: 'SEGURIDAD',
      action: 'PASSWORD_RESTABLECIDO',
      details: 'Contraseña reasignada a Téc. Juan Pérez (tecnico@park.com) por Ing. Carlos Mendoza',
      severity: 'CRITICO',
      userId: 'u-admin-001',
      userName: 'Ing. Carlos Mendoza (Admin)',
      userEmail: 'admin@park.com',
      userRole: 'admin',
      targetId: 'sol-7012',
      metadata: { requestFolio: 'SOL-7012', method: 'Aprobación Manual CMMS' }
    },
    {
      id: 'aud-seed-005',
      folio: 'AUD-892105',
      timestamp: new Date(baseTime - 1000 * 60 * 240).toISOString(),
      formattedDate: new Date(baseTime - 1000 * 60 * 240).toLocaleString('es-MX', { timeZone: 'America/Mexico_City', hour12: true }),
      category: 'ORDENES',
      action: 'ORDEN_CREADA',
      details: 'Nueva orden: [WO-2026-004] "Inspección urgente rodillos transportador B" - Prioridad: Alta',
      severity: 'ADVERTENCIA',
      userId: 'u-supervisor-002',
      userName: 'Arq. Sofía Ramírez (Supervisor)',
      userEmail: 'supervisor@park.com',
      userRole: 'supervisor',
      targetId: 'wo-4',
      metadata: { assignedTo: 'Téc. Juan Pérez' }
    },
    {
      id: 'aud-seed-006',
      folio: 'AUD-892106',
      timestamp: new Date(baseTime - 1000 * 60 * 360).toISOString(),
      formattedDate: new Date(baseTime - 1000 * 60 * 360).toLocaleString('es-MX', { timeZone: 'America/Mexico_City', hour12: true }),
      category: 'ACTIVOS',
      action: 'ACTIVO_ACTUALIZADO',
      details: 'Equipo [EQ-MOT-01] "Motor Eléctrico Siemens 15HP" guardado en Planta Central Nave 2',
      severity: 'INFO',
      userId: 'u-admin-001',
      userName: 'Ing. Carlos Mendoza (Admin)',
      userEmail: 'admin@park.com',
      userRole: 'admin',
      targetId: 'ast-1',
      metadata: { status: 'Operativo', hours: 2450 }
    },
    {
      id: 'aud-seed-007',
      folio: 'AUD-892107',
      timestamp: new Date(baseTime - 1000 * 60 * 480).toISOString(),
      formattedDate: new Date(baseTime - 1000 * 60 * 480).toLocaleString('es-MX', { timeZone: 'America/Mexico_City', hour12: true }),
      category: 'USUARIOS',
      action: 'USUARIO_CREADO',
      details: 'Alta de usuario en sistema: Ing. Carlos Mendoza (admin@park.com) - Rol: admin',
      severity: 'INFO',
      userId: 'usr-dev-000',
      userName: 'Ing. Desarrollador & QA (Dev)',
      userEmail: 'dev@park.com',
      userRole: 'developer',
      targetId: 'u-admin-001',
      metadata: { department: 'Dirección de Operaciones' }
    },
    {
      id: 'aud-seed-008',
      folio: 'AUD-892108',
      timestamp: new Date(baseTime - 1000 * 60 * 600).toISOString(),
      formattedDate: new Date(baseTime - 1000 * 60 * 600).toLocaleString('es-MX', { timeZone: 'America/Mexico_City', hour12: true }),
      category: 'SEGURIDAD',
      action: 'LOGIN_FALLIDO',
      details: 'Intento de acceso denegado para el correo: operario_test@park.com',
      severity: 'ADVERTENCIA',
      userId: 'anon',
      userName: 'Desconocido',
      userEmail: 'operario_test@park.com',
      userRole: 'invitado',
      targetId: null,
      metadata: { reason: 'Contraseña errónea' }
    }
  ];
}

function getDbData() {
  try {
    if (!fs.existsSync(dbFilePath)) {
      const exampleDbPath = path.join(__dirname, 'src', 'data', 'cmms_db.example.json');
      if (fs.existsSync(exampleDbPath)) {
        fs.copyFileSync(exampleDbPath, dbFilePath);
        console.log('[DB] Se inicializó cmms_db.json a partir de cmms_db.example.json');
      }
    }
    if (fs.existsSync(dbFilePath)) {
      const raw = fs.readFileSync(dbFilePath, 'utf8');
      const data = JSON.parse(raw);
      if (!Array.isArray(data.passwordResetRequests)) data.passwordResetRequests = [];
      if (!Array.isArray(data.auditLogs)) data.auditLogs = [];
      return data;
    }
  } catch (err) {
    console.error('[DB] Error al leer cmms_db.json:', err.message);
  }
  return {
    company: {},
    assets: [],
    workOrders: [],
    inventory: [],
    preventiveSchedules: [],
    technicians: [],
    users: [],
    passwordResetRequests: [],
    auditLogs: getSeedAuditLogs()
  };
}

function saveDbData(data) {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('[DB] Error al guardar cmms_db.json:', err.message);
  }
}

// REGISTRADOR CENTRAL DE EVENTOS DE AUDITORÍA (AUDIT TRAIL)
function logAuditEvent({ category, action, details, user, targetId, severity = 'INFO', metadata = {} }) {
  try {
    const db = getDbData();
    if (!Array.isArray(db.auditLogs)) db.auditLogs = [];

    const now = new Date();
    const entry = {
      id: `aud-${Date.now().toString(36)}-${Math.floor(Math.random() * 10000)}`,
      folio: `AUD-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: now.toISOString(),
      formattedDate: now.toLocaleString('es-MX', { timeZone: 'America/Mexico_City', hour12: true }),
      category: category || 'GENERAL',
      action: action || 'OPERACION',
      details: details || '',
      severity: severity || 'INFO',
      userId: user?.id || user?.sub || 'system',
      userName: user?.full_name || user?.fullName || user?.name || (typeof user === 'string' ? user : 'Sistema Central'),
      userEmail: user?.email || 'admin@park.com',
      userRole: user?.role || 'admin',
      targetId: targetId || null,
      metadata: metadata || {}
    };

    db.auditLogs.unshift(entry);
    if (db.auditLogs.length > 2000) {
      db.auditLogs = db.auditLogs.slice(0, 2000);
    }
    saveDbData(db);

    io.emit('audit:new_log', { log: entry });
    return entry;
  } catch (err) {
    console.error('[Audit] Error al registrar evento:', err.message);
  }
}

// Migración automática de fotografías en Base64 de cmms_db.json a archivos físicos en /uploads/photos/
function migrateExistingBase64Photos() {
  try {
    const db = getDbData();
    let migratedCount = 0;
    if (Array.isArray(db.workOrders)) {
      db.workOrders.forEach(wo => {
        if (Array.isArray(wo.photos)) {
          wo.photos.forEach(photo => {
            if (photo.url && photo.url.startsWith('data:image/')) {
              const match = photo.url.match(/^data:([A-Za-z-+\/0-9.]+);base64,(.+)$/);
              if (match) {
                const buffer = Buffer.from(match[2], 'base64');
                const photoId = photo.id || `migrated-${Date.now()}`;
                const filename = `${photoId}.jpg`;
                const filePath = path.join(photosDir, filename);
                fs.writeFileSync(filePath, buffer);
                photo.url = `/uploads/photos/${filename}`;
                migratedCount++;
              }
            }
          });
        }
        if (Array.isArray(wo.comments)) {
          wo.comments.forEach(comment => {
            if (comment.image && comment.image.startsWith('data:image/')) {
              const match = comment.image.match(/^data:([A-Za-z-+\/0-9.]+);base64,(.+)$/);
              if (match) {
                const buffer = Buffer.from(match[2], 'base64');
                const filename = `comment-img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.jpg`;
                fs.writeFileSync(path.join(photosDir, filename), buffer);
                comment.image = `/uploads/photos/${filename}`;
                migratedCount++;
              }
            }
            if (comment.attachment && comment.attachment.url && comment.attachment.url.startsWith('data:')) {
              const match = comment.attachment.url.match(/^data:([A-Za-z-+\/0-9.]+);base64,(.+)$/);
              if (match) {
                const buffer = Buffer.from(match[2], 'base64');
                const isImg = comment.attachment.type === 'image' || (match[1] && match[1].includes('image'));
                const subfolder = isImg ? photosDir : documentsDir;
                const folderName = isImg ? 'photos' : 'documents';
                const ext = isImg ? '.jpg' : (path.extname(comment.attachment.name || '') || '.bin');
                const filename = `attach-${Date.now()}-${Math.random().toString(36).substring(2, 7)}${ext}`;
                fs.writeFileSync(path.join(subfolder, filename), buffer);
                comment.attachment.url = `/uploads/${folderName}/${filename}`;
                migratedCount++;
              }
            }
          });
        }
      });
      if (migratedCount > 0) {
        saveDbData(db);
        console.log(`✔ [Migración DB] Se migraron ${migratedCount} imágenes/archivos Base64 a /uploads/. cmms_db.json optimizado.`);
      }
    }
  } catch (err) {
    console.error('Error durante la migración de fotos en cmms_db.json:', err.message);
  }
}
migrateExistingBase64Photos();

// Cargar definición de roles
const rolesFilePath = path.join(__dirname, 'src', 'data', 'roles.json');
let rolesConfig = {};
try {
  const rolesData = fs.readFileSync(rolesFilePath, 'utf8');
  rolesConfig = JSON.parse(rolesData);
} catch (e) {
  console.error("Error al cargar roles.json:", e.message);
}

// Usuarios Demo
const DEMO_USERS = {
  'dev@park.com': { id: 'u-dev-000', email: 'dev@park.com', password: 'Password123!', full_name: 'Ing. Desarrollador & QA (Dev)', role: 'developer' },
  'admin@park.com': { id: 'u-admin-001', email: 'admin@park.com', password: 'Password123!', full_name: 'Ing. Carlos Mendoza (Admin)', role: 'admin' },
  'supervisor@park.com': { id: 'u-supervisor-002', email: 'supervisor@park.com', password: 'Password123!', full_name: 'Arq. Sofía Ramírez (Supervisor)', role: 'supervisor' },
  'tecnico@park.com': { id: 'u-tecnico-003', email: 'tecnico@park.com', password: 'Password123!', full_name: 'Téc. Juan Pérez (Técnico)', role: 'tecnico' },
  'solicitante@park.com': { id: 'u-solicitante-004', email: 'solicitante@park.com', password: 'Password123!', full_name: 'Op. Maria López (Solicitante)', role: 'solicitante' },
  'auditor@park.com': { id: 'u-auditor-005', email: 'auditor@park.com', password: 'Password123!', full_name: 'Lic. Roberto Gómez (Auditor)', role: 'auditor' }
};

// Conversor de comodines a RegExp
function matchRoutePattern(pattern, requestPath) {
  const cleanPath = requestPath.endsWith('/') && requestPath.length > 1 ? requestPath.slice(0, -1) : requestPath;
  const cleanPattern = pattern.endsWith('/') && pattern.length > 1 ? pattern.slice(0, -1) : pattern;
  const escaped = cleanPattern.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  const regexStr = '^' + escaped.replace(/\\\*/g, '.*') + '$';
  return new RegExp(regexStr).test(cleanPath);
}

// MIDDLEWARE DE AUTENTICACIÓN JWT & AUTORIZACIÓN RBAC
app.use((req, res, next) => {
  if (req.path.startsWith('/api/v1/auth/') || req.path.startsWith('/api/v1/upload') || req.path.startsWith('/api/v1/users') || req.path.startsWith('/api/v1/admin/') || req.path.startsWith('/api/v1/audit') || !req.path.startsWith('/api/')) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ detail: 'Token de autenticación faltante o formato inválido.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    const userRole = decoded.role || 'tecnico';
    const rolesMap = rolesConfig.roles || rolesConfig;
    const rolePermissions = rolesMap[userRole];

    if (!rolePermissions) {
      return res.status(403).json({ detail: `El rol '${userRole}' no tiene permisos configurados en roles.json.` });
    }

    // Ruta de sincronización central permitida para cualquier usuario autenticado
    if (req.path === '/api/v1/sync/state') {
      return next();
    }

    const allowedPatterns = rolePermissions.allowedRoutes || rolePermissions.routeProtection?.apiRoutes || ['/api/v1/*'];
    const isAllowed = allowedPatterns.some(pattern => matchRoutePattern(pattern, req.path));
    if (!isAllowed) {
      return res.status(403).json({ 
        detail: `Acceso denegado. El rol '${rolePermissions.name}' no tiene permisos para acceder a ${req.method} ${req.path}.` 
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({ detail: 'Token expirado o firma inválida.' });
  }
});

// Endpoint de login con soporte para DEMO_USERS y usuarios de cmms_db.json
app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  const cleanEmail = email ? email.toLowerCase().trim() : '';

  // 1. Buscar en DEMO_USERS
  let user = DEMO_USERS[cleanEmail];

  // 2. Si no es usuario demo, buscar en los usuarios de cmms_db.json
  if (!user) {
    const db = getDbData();
    const foundUser = (db.users || []).find(u => u.email && u.email.toLowerCase().trim() === cleanEmail);
    if (foundUser) {
      if (foundUser.status === 'Inactivo') {
        return res.status(403).json({ detail: 'Cuenta suspendida o inactiva. Contacta al Administrador del sistema.' });
      }
      if (foundUser.password === password || password === 'Password123!') {
        user = {
          id: foundUser.id,
          email: foundUser.email,
          password: foundUser.password || 'Password123!',
          full_name: foundUser.fullName || foundUser.full_name || foundUser.name || 'Usuario',
          role: foundUser.role || 'tecnico',
          avatarUrl: foundUser.avatarUrl || ''
        };
      }
    }
  }

  if (!user || user.password !== password) {
    logAuditEvent({
      category: 'SEGURIDAD',
      action: 'LOGIN_FALLIDO',
      details: `Intento de acceso denegado para el correo: ${cleanEmail || 'no especificado'}`,
      user: { name: cleanEmail || 'Desconocido', email: cleanEmail, role: 'invitado' },
      severity: 'ADVERTENCIA'
    });
    return res.status(401).json({ detail: 'Credenciales inválidas. Verifica tu correo y contraseña.' });
  }

  logAuditEvent({
    category: 'SEGURIDAD',
    action: 'LOGIN_EXITOSO',
    details: `Autenticación satisfactoria del usuario ${user.full_name} (${(user.role || 'tecnico').toUpperCase()})`,
    user,
    severity: 'EXITO'
  });

  const payload = { 
    sub: user.id, 
    email: user.email, 
    role: user.role, 
    name: user.full_name,
    avatarUrl: user.avatarUrl || ''
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

  return res.json({
    access_token: token,
    token_type: 'bearer',
    user: { 
      id: user.id, 
      email: user.email, 
      full_name: user.full_name, 
      fullName: user.full_name,
      role: user.role,
      avatarUrl: user.avatarUrl || ''
    }
  });
});

// Endpoint para solicitar restablecimiento de contraseña al Administrador (sin correos)
app.post('/api/v1/auth/forgot-password', (req, res) => {
  const { email, reason } = req.body;
  const cleanEmail = email ? email.toLowerCase().trim() : '';

  if (!cleanEmail) {
    return res.status(400).json({ detail: 'Por favor ingresa tu correo electrónico registrado.' });
  }

  // Buscar en DEMO_USERS o en cmms_db.json
  const db = getDbData();
  const demoUser = DEMO_USERS[cleanEmail];
  const dbUser = (db.users || []).find(u => u.email && u.email.toLowerCase().trim() === cleanEmail);
  const targetUser = demoUser || dbUser;

  if (!targetUser) {
    return res.status(404).json({ detail: 'No existe ninguna cuenta registrada con este correo electrónico.' });
  }

  if (targetUser.status === 'Inactivo') {
    return res.status(403).json({ detail: 'Esta cuenta se encuentra inactiva. Contacta directamente al Administrador.' });
  }

  if (!Array.isArray(db.passwordResetRequests)) {
    db.passwordResetRequests = [];
  }

  // Verificar si ya tiene una solicitud pendiente
  const existingPending = db.passwordResetRequests.find(r => r.email === cleanEmail && r.status === 'Pendiente');
  if (existingPending) {
    return res.json({
      status: 'ok',
      message: 'Ya existe una solicitud pendiente de revisión por el Administrador para esta cuenta.',
      request: existingPending,
      alreadyPending: true
    });
  }

  const newTicket = {
    id: `sol-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
    folio: `SOL-${Math.floor(1000 + Math.random() * 9000)}`,
    userId: targetUser.id,
    email: cleanEmail,
    fullName: targetUser.full_name || targetUser.fullName || targetUser.name || 'Colaborador',
    role: targetUser.role || 'tecnico',
    department: targetUser.department || 'General',
    reason: (reason && reason.trim()) ? reason.trim() : 'Olvidé mi contraseña de acceso',
    status: 'Pendiente',
    createdAt: new Date().toISOString(),
    requestedAt: new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City', hour12: true }),
    resolvedAt: null,
    resolvedBy: null,
    newPasswordGiven: null
  };

  db.passwordResetRequests.unshift(newTicket);
  saveDbData(db);

  // Registrar evento en Bitácora de Auditoría
  logAuditEvent({
    category: 'SEGURIDAD',
    action: 'SOLICITUD_PASSWORD_CREADA',
    details: `Petición de restablecimiento de contraseña generada [${newTicket.folio}] para ${newTicket.fullName} (${cleanEmail})`,
    user: targetUser,
    targetId: newTicket.id,
    severity: 'ADVERTENCIA',
    metadata: { folio: newTicket.folio, reason: newTicket.reason }
  });

  // Notificar por Socket.io a administradores en tiempo real
  io.emit('password_reset_request:new', { request: newTicket });

  console.log('\n==================================================');
  console.log('🔔 [SOLICITUD DE RESTABLECIMIENTO DE CONTRASEÑA]');
  console.log(`👉 Folio: ${newTicket.folio}`);
  console.log(`👤 Usuario: ${newTicket.fullName} (${cleanEmail})`);
  console.log(`🏢 Rol: ${newTicket.role} | Área: ${newTicket.department}`);
  console.log(`📝 Motivo: ${newTicket.reason}`);
  console.log('📌 Estado: Pendiente de aprobación por el Administrador');
  console.log('==================================================\n');

  return res.json({
    status: 'ok',
    message: 'Solicitud enviada exitosamente al Administrador.',
    request: newTicket
  });
});

// Listar solicitudes de restablecimiento de contraseña (para administradores)
app.get('/api/v1/admin/password-reset-requests', (req, res) => {
  const db = getDbData();
  return res.json({
    status: 'ok',
    requests: db.passwordResetRequests || []
  });
});

// Resolver o rechazar solicitud de restablecimiento (por parte del Administrador)
app.post('/api/v1/admin/resolve-password-reset', (req, res) => {
  const { requestId, action, newPassword, adminName } = req.body;
  if (!requestId) {
    return res.status(400).json({ error: 'El ID de la solicitud es requerido.' });
  }

  const db = getDbData();
  if (!Array.isArray(db.passwordResetRequests)) db.passwordResetRequests = [];

  const reqIndex = db.passwordResetRequests.findIndex(r => r.id === requestId);
  if (reqIndex < 0) {
    return res.status(404).json({ error: 'Solicitud no encontrada.' });
  }

  const ticket = db.passwordResetRequests[reqIndex];

  if (action === 'reject') {
    ticket.status = 'Rechazado';
    ticket.resolvedAt = new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City', hour12: true });
    ticket.resolvedBy = adminName || 'Administrador';
    saveDbData(db);

    logAuditEvent({
      category: 'SEGURIDAD',
      action: 'SOLICITUD_PASSWORD_RECHAZADA',
      details: `Solicitud de restablecimiento ${ticket.folio} rechazada por ${adminName || 'Administrador'}`,
      user: { name: adminName || 'Administrador', role: 'admin' },
      targetId: ticket.id,
      severity: 'ADVERTENCIA',
      metadata: { folio: ticket.folio, userEmail: ticket.email }
    });

    io.emit('password_reset_request:resolved', { request: ticket });
    return res.json({ status: 'ok', message: 'Solicitud marcada como rechazada.', ticket });
  }

  // Acción: approve / reset
  const passToSet = (newPassword && newPassword.trim()) ? newPassword.trim() : 'Password123!';
  if (passToSet.length < 6) {
    return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres.' });
  }

  // Actualizar contraseña en cmms_db.json
  const targetUser = (db.users || []).find(u => u.email && u.email.toLowerCase().trim() === ticket.email.toLowerCase().trim());
  if (targetUser) {
    targetUser.password = passToSet;
  }

  // Si es usuario demo, actualizar en DEMO_USERS
  if (DEMO_USERS[ticket.email]) {
    DEMO_USERS[ticket.email].password = passToSet;
  }

  ticket.status = 'Resuelto';
  ticket.resolvedAt = new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City', hour12: true });
  ticket.resolvedBy = adminName || 'Administrador';
  ticket.newPasswordGiven = passToSet;
  saveDbData(db);

  logAuditEvent({
    category: 'SEGURIDAD',
    action: 'PASSWORD_RESTABLECIDO',
    details: `Contraseña reasignada para ${ticket.fullName} (${ticket.email}) por ${adminName || 'Administrador'}`,
    user: { name: adminName || 'Administrador', role: 'admin' },
    targetId: ticket.id,
    severity: 'CRITICO',
    metadata: { folio: ticket.folio, userEmail: ticket.email }
  });

  io.emit('password_reset_request:resolved', { request: ticket, userUpdated: targetUser });

  console.log(`✔ [Admin] Contraseña restablecida para ${ticket.email} por ${adminName || 'Admin'} a: ${passToSet}`);

  return res.json({
    status: 'ok',
    message: `Contraseña restablecida exitosamente para ${ticket.fullName}.`,
    ticket,
    newPassword: passToSet
  });
});

// Eliminar solicitud de la lista
app.delete('/api/v1/admin/password-reset-requests/:id', (req, res) => {
  const { id } = req.params;
  const db = getDbData();
  if (Array.isArray(db.passwordResetRequests)) {
    db.passwordResetRequests = db.passwordResetRequests.filter(r => r.id !== id);
    saveDbData(db);
  }
  return res.json({ status: 'ok', message: 'Solicitud eliminada.' });
});

// Endpoint para crear o actualizar usuario
app.post('/api/v1/users', (req, res) => {
  try {
    const { fullName, email, role, department, phone, password, status } = req.body;
    const cleanEmail = email ? email.toLowerCase().trim() : '';

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return res.status(400).json({ error: 'Ingresa un correo electrónico válido.' });
    }
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ error: 'El nombre completo es obligatorio.' });
    }

    const db = getDbData();
    if (!Array.isArray(db.users)) db.users = [];

    const existingIndex = db.users.findIndex(u => 
      (u.id && u.id === req.body.id) || 
      (u.email && u.email.toLowerCase().trim() === cleanEmail)
    );

    if (existingIndex >= 0) {
      // Actualizar usuario existente
      const existingUser = db.users[existingIndex];
      db.users[existingIndex] = {
        ...existingUser,
        fullName: fullName.trim(),
        role: role || existingUser.role || 'tecnico',
        department: department || existingUser.department || 'General',
        phone: phone || existingUser.phone || '',
        password: password || existingUser.password || 'Password123!',
        status: status || existingUser.status || 'Activo',
        updatedAt: new Date().toISOString()
      };
      saveDbData(db);

      logAuditEvent({
        category: 'USUARIOS',
        action: 'USUARIO_ACTUALIZADO',
        details: `Modificación de datos para: ${fullName.trim()} (${cleanEmail}) - Rol: ${role || existingUser.role}`,
        user: req.user || { name: 'Administrador', role: 'admin' },
        targetId: db.users[existingIndex].id,
        severity: 'INFO'
      });

      io.emit('user:saved', { user: db.users[existingIndex], isNew: false });
      return res.json({
        status: 'ok',
        user: db.users[existingIndex],
        updated: true,
        message: 'Usuario actualizado exitosamente.'
      });
    }

    // Creación de NUEVO usuario
    const newUser = {
      id: req.body.id || `usr-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
      fullName: fullName.trim(),
      email: cleanEmail,
      role: role || 'tecnico',
      department: department || 'Mantenimiento General',
      phone: phone || '+52 (33) 3800-0000',
      password: password || 'Password123!',
      status: status || 'Activo',
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Nunca'
    };

    db.users.unshift(newUser);
    saveDbData(db);

    logAuditEvent({
      category: 'USUARIOS',
      action: 'USUARIO_CREADO',
      details: `Alta de nuevo colaborador: ${newUser.fullName} (${newUser.email}) - Rol: ${newUser.role}`,
      user: req.user || { name: 'Administrador', role: 'admin' },
      targetId: newUser.id,
      severity: 'INFO'
    });

    io.emit('user:saved', { user: newUser, isNew: true });

    return res.status(201).json({
      status: 'ok',
      user: newUser,
      isNew: true,
      message: 'Usuario registrado exitosamente.'
    });
  } catch (err) {
    console.error('Error al crear usuario:', err);
    return res.status(500).json({ error: 'Error interno del servidor al crear usuario.' });
  }
});

// Endpoint para listar todos los usuarios
app.get('/api/v1/users', (req, res) => {
  const db = getDbData();
  return res.json({
    status: 'ok',
    users: db.users || []
  });
});

// ==============================================================
// RUTAS DE LA BITÁCORA DE AUDITORÍA Y TRAZABILIDAD (AUDIT TRAIL)
// ==============================================================
app.get('/api/v1/audit/logs', (req, res) => {
  const db = getDbData();
  const { category, severity, search, limit = 500 } = req.query;
  let logs = db.auditLogs || [];

  if (category && category !== 'ALL') {
    logs = logs.filter(l => l.category === category);
  }
  if (severity && severity !== 'ALL') {
    logs = logs.filter(l => l.severity === severity);
  }
  if (search && search.trim()) {
    const term = search.toLowerCase().trim();
    logs = logs.filter(l => 
      (l.folio && l.folio.toLowerCase().includes(term)) ||
      (l.action && l.action.toLowerCase().includes(term)) ||
      (l.details && l.details.toLowerCase().includes(term)) ||
      (l.userName && l.userName.toLowerCase().includes(term)) ||
      (l.userEmail && l.userEmail.toLowerCase().includes(term))
    );
  }

  return res.json({
    status: 'ok',
    total: logs.length,
    logs: logs.slice(0, parseInt(limit, 10))
  });
});

app.post('/api/v1/audit/log', (req, res) => {
  const { category, action, details, user, targetId, severity, metadata } = req.body;
  if (!action || !details) {
    return res.status(400).json({ error: 'Acción y detalles son requeridos.' });
  }
  const logged = logAuditEvent({
    category,
    action,
    details,
    user: user || req.user,
    targetId,
    severity,
    metadata
  });
  return res.status(201).json({ status: 'ok', log: logged });
});

// Endpoint de subida de archivos (fotografías, documentos y avatares) a disco
app.post('/api/v1/upload', (req, res) => {
  try {
    const { data, name, folder = 'photos', type = 'image' } = req.body;
    if (!data) {
      return res.status(400).json({ error: 'No se recibieron datos de archivo (data es requerido).' });
    }

    const allowedFolders = ['photos', 'documents', 'avatars'];
    const targetFolder = allowedFolders.includes(folder) ? folder : 'photos';
    const targetDir = path.join(uploadsDir, targetFolder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    let buffer;
    let ext = '.jpg';

    const dataUrlMatch = typeof data === 'string' ? data.match(/^data:([A-Za-z-+\/0-9.]+);base64,(.+)$/) : null;
    if (dataUrlMatch) {
      const mime = dataUrlMatch[1].toLowerCase();
      buffer = Buffer.from(dataUrlMatch[2], 'base64');
      if (mime.includes('png')) ext = '.png';
      else if (mime.includes('webp')) ext = '.webp';
      else if (mime.includes('gif')) ext = '.gif';
      else if (mime.includes('jpeg') || mime.includes('jpg')) ext = '.jpg';
      else if (mime.includes('pdf')) ext = '.pdf';
      else if (mime.includes('sheet') || mime.includes('excel') || mime.includes('csv')) ext = '.xlsx';
      else if (mime.includes('word') || mime.includes('document')) ext = '.docx';
      else if (name && path.extname(name)) ext = path.extname(name);
    } else {
      buffer = Buffer.from(data, 'base64');
      if (name && path.extname(name)) ext = path.extname(name);
    }

    const cleanOrigName = (name || 'archivo')
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .toLowerCase();
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const filename = `${uniqueId}${ext}`;
    const filePath = path.join(targetDir, filename);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${targetFolder}/${filename}`;
    console.log(`✔ [Upload] Archivo guardado en disco: ${publicUrl} (${(buffer.length / 1024).toFixed(1)} KB)`);

    return res.json({
      status: 'ok',
      url: publicUrl,
      filename,
      name: name || cleanOrigName,
      size: buffer.length,
      folder: targetFolder,
      type
    });
  } catch (err) {
    console.error('Error al procesar subida de archivo:', err);
    return res.status(500).json({ error: 'Error interno al guardar archivo en disco.' });
  }
});

// Rutas de API REST conectadas al almacenamiento central
app.get('/api/v1/sync/state', (req, res) => {
  res.json({ status: 'ok', data: getDbData() });
});

app.get('/api/v1/work-orders', (req, res) => {
  const db = getDbData();
  res.json({ status: 'ok', data: db.workOrders || [] });
});

app.post('/api/v1/work-orders', (req, res) => {
  const newWo = req.body;
  const db = getDbData();
  const list = db.workOrders || [];
  const idx = list.findIndex(w => w.id === newWo.id);
  if (idx >= 0) {
    list[idx] = newWo;
  } else {
    list.unshift(newWo);
  }
  db.workOrders = list;

  if (Array.isArray(newWo.usedParts) && Array.isArray(db.inventory)) {
    newWo.usedParts.forEach(p => {
      const part = db.inventory.find(i => i.id === p.partId);
      if (part) {
        part.currentStock = Math.max(0, (part.currentStock || 0) - p.qty);
      }
    });
  }

  saveDbData(db);
  io.emit('wo:saved', { workOrder: newWo, sender: { name: req.user?.name || 'Sistema REST' }, timestamp: new Date().toISOString() });
  res.json({ status: 'created', data: newWo });
});

app.get('/api/v1/assets', (req, res) => {
  const db = getDbData();
  res.json({ status: 'ok', data: db.assets || [] });
});

app.get('/api/v1/inventory', (req, res) => {
  const db = getDbData();
  res.json({ status: 'ok', data: db.inventory || [] });
});

app.get('/api/v1/reports/consolidated', (req, res) => {
  res.json({ status: 'ok', reportUrl: '/downloads/report.pdf' });
});

app.get('/api/v1/admin/users', (req, res) => {
  const db = getDbData();
  res.json({ status: 'ok', users: db.users || Object.values(DEMO_USERS) });
});

app.get('/api/v1/admin/settings', (req, res) => {
  const db = getDbData();
  res.json({ status: 'ok', settings: db.company || { company: 'PLATAFORMAPARK' } });
});

// GESTIÓN DE TIEMPO REAL CON SOCKET.IO
const connectedUsers = new Map(); // socket.id -> userInfo

function broadcastPresence() {
  const users = Array.from(connectedUsers.values());
  io.emit('presence:update', {
    users,
    count: users.length,
    timestamp: new Date().toISOString()
  });
}

io.on('connection', (socket) => {
  console.log(`🔌 [Socket.io] Nuevo cliente conectado: ${socket.id}`);

  // Handshake de autenticación del socket
  socket.on('auth:handshake', (payload = {}) => {
    let userInfo = {
      socketId: socket.id,
      id: payload.user?.id || `anon-${socket.id.slice(0, 5)}`,
      name: payload.user?.full_name || payload.user?.fullName || payload.user?.name || 'Usuario',
      email: payload.user?.email || 'anon@park.com',
      role: payload.user?.role || 'tecnico',
      connectedAt: new Date().toISOString()
    };

    if (payload.token) {
      try {
        const decoded = jwt.verify(payload.token, JWT_SECRET);
        userInfo.id = decoded.sub || userInfo.id;
        userInfo.email = decoded.email || userInfo.email;
        userInfo.role = decoded.role || userInfo.role;
        userInfo.name = decoded.name || userInfo.name;
      } catch (e) {
        // Token inválido o expirado; permitimos continuar con datos de usuario pasados
      }
    }

    connectedUsers.set(socket.id, userInfo);
    socket.join('cmms:global');

    socket.emit('auth:success', {
      socketId: socket.id,
      user: userInfo
    });

    // Enviar estado actual de la base de datos al cliente recién conectado
    const db = getDbData();
    socket.emit('sync:full_state', db);

    broadcastPresence();
    console.log(`✅ [Socket.io] Usuario autenticado en vivo: ${userInfo.name} (${userInfo.role}) [${socket.id}]`);
  });

  // Solicitud manual de sincronización completa
  socket.on('sync:request_state', () => {
    const db = getDbData();
    socket.emit('sync:full_state', db);
  });

  // Sincronización de Órdenes de Trabajo (Crear o Actualizar)
  socket.on('wo:save', ({ workOrder, sender }) => {
    if (!workOrder || !workOrder.id) return;

    const db = getDbData();
    const list = db.workOrders || [];
    const index = list.findIndex(w => w.id === workOrder.id);

    if (index >= 0) {
      list[index] = workOrder;
    } else {
      list.unshift(workOrder);
    }
    db.workOrders = list;

    // Si se usaron repuestos, descontar del inventario del servidor
    if (Array.isArray(workOrder.usedParts) && workOrder.usedParts.length > 0 && Array.isArray(db.inventory)) {
      workOrder.usedParts.forEach(p => {
        const part = db.inventory.find(i => i.id === p.partId);
        if (part) {
          part.currentStock = Math.max(0, (part.currentStock || 0) - p.qty);
        }
      });
    }

    saveDbData(db);

    logAuditEvent({
      category: 'ORDENES',
      action: index >= 0 ? 'ORDEN_ACTUALIZADA' : 'ORDEN_CREADA',
      details: `${index >= 0 ? 'Actualización' : 'Nueva orden'}: [${workOrder.code || workOrder.id}] "${workOrder.title}" - Prioridad: ${workOrder.priority || 'Normal'}`,
      user: sender || connectedUsers.get(socket.id),
      targetId: workOrder.id,
      severity: workOrder.priority === 'Alta' ? 'ADVERTENCIA' : 'INFO'
    });

    // Retransmitir a TODOS los demás clientes
    socket.broadcast.emit('wo:saved', {
      workOrder,
      sender: sender || connectedUsers.get(socket.id) || { name: 'Colega' },
      timestamp: new Date().toISOString()
    });

    // Notificar al emisor que quedó sincronizado
    socket.emit('wo:saved_ack', { id: workOrder.id, status: 'synced' });
  });

  // Cambio de estado de Orden (Abierta, En Proceso, En Espera, Completada)
  socket.on('wo:status_change', ({ woId, newStatus, sender }) => {
    if (!woId || !newStatus) return;

    const db = getDbData();
    const list = db.workOrders || [];
    const wo = list.find(w => w.id === woId);

    if (wo) {
      wo.status = newStatus;
      wo.updatedAt = new Date().toISOString();
      wo.lastUpdatedBy = sender?.name || 'Usuario';
      if (newStatus === 'Completada' && !wo.completedDate) {
        wo.completedDate = new Date().toISOString();
      }
      saveDbData(db);

      logAuditEvent({
        category: 'ORDENES',
        action: 'CAMBIO_ESTADO_ORDEN',
        details: `Orden [${wo.code || wo.id}] "${wo.title}" cambió a estado "${newStatus}"`,
        user: sender || connectedUsers.get(socket.id),
        targetId: wo.id,
        severity: newStatus === 'Completada' ? 'EXITO' : 'INFO'
      });

      socket.broadcast.emit('wo:status_changed', {
        woId,
        newStatus,
        sender: sender || connectedUsers.get(socket.id) || { name: 'Colega' },
        timestamp: new Date().toISOString()
      });
    }
  });

  // Gestión de Salas de Chat por Orden de Trabajo
  socket.on('chat:join_room', ({ orderId }) => {
    if (!orderId) return;
    socket.join(`wo:${orderId}`);
  });

  socket.on('chat:leave_room', ({ orderId }) => {
    if (!orderId) return;
    socket.leave(`wo:${orderId}`);
  });

  // Envío de Mensaje de Chat en una Orden
  socket.on('chat:send', ({ orderId, comment, sender }) => {
    if (!orderId || !comment) return;

    const db = getDbData();
    const list = db.workOrders || [];
    const wo = list.find(w => w.id === orderId);

    if (wo) {
      if (!Array.isArray(wo.comments)) wo.comments = [];
      wo.comments.push(comment);
      wo.updatedAt = new Date().toISOString();
      wo.lastUpdatedBy = sender?.name || comment.userName || 'Usuario';
      saveDbData(db);
    }

    // Transmitir a todos los participantes dentro de la sala de la orden
    io.to(`wo:${orderId}`).emit('chat:message', {
      orderId,
      comment,
      sender: sender || connectedUsers.get(socket.id) || { name: comment.userName || 'Usuario' }
    });

    // Notificación global para usuarios que no tienen la orden abierta
    socket.broadcast.emit('chat:notification', {
      orderId,
      orderCode: wo?.code || orderId,
      orderTitle: wo?.title || 'Orden de Trabajo',
      comment,
      sender: sender || connectedUsers.get(socket.id) || { name: comment.userName || 'Usuario' }
    });
  });

  // Indicador de "Escribiendo..." en el chat
  socket.on('chat:typing', ({ orderId, user, isTyping }) => {
    if (!orderId) return;
    socket.to(`wo:${orderId}`).emit('chat:typing_status', {
      orderId,
      user: user || connectedUsers.get(socket.id) || { name: 'Alguien' },
      isTyping
    });
  });

  // Actualización de Inventario (Stock / Repuesto)
  socket.on('inventory:update_stock', ({ partId, newStock, sender }) => {
    const db = getDbData();
    const list = db.inventory || [];
    const item = list.find(i => i.id === partId);
    if (item) {
      item.currentStock = newStock;
      saveDbData(db);

      logAuditEvent({
        category: 'INVENTARIO',
        action: 'AJUSTE_STOCK',
        details: `Stock de "${item.name}" ajustado a ${newStock} uds.`,
        user: sender || connectedUsers.get(socket.id),
        targetId: item.id,
        severity: newStock <= (item.minStock || 5) ? 'ADVERTENCIA' : 'INFO'
      });

      socket.broadcast.emit('inventory:updated', {
        partId,
        newStock,
        partName: item.name,
        sender: sender || connectedUsers.get(socket.id) || { name: 'Almacén' },
        timestamp: new Date().toISOString()
      });
    }
  });

  socket.on('inventory:save', ({ part, sender }) => {
    if (!part || !part.id) return;
    const db = getDbData();
    const list = db.inventory || [];
    const idx = list.findIndex(i => i.id === part.id);
    if (idx >= 0) list[idx] = part;
    else list.unshift(part);
    db.inventory = list;
    saveDbData(db);

    logAuditEvent({
      category: 'INVENTARIO',
      action: idx >= 0 ? 'REPUESTO_ACTUALIZADO' : 'REPUESTO_CREADO',
      details: `${idx >= 0 ? 'Actualización' : 'Alta'} de repuesto: [${part.code || part.id}] "${part.name}" (Stock: ${part.currentStock})`,
      user: sender || connectedUsers.get(socket.id),
      targetId: part.id,
      severity: 'INFO'
    });

    socket.broadcast.emit('inventory:saved', {
      part,
      sender: sender || connectedUsers.get(socket.id) || { name: 'Almacén' },
      timestamp: new Date().toISOString()
    });
  });

  // Sincronización de Activos
  socket.on('asset:save', ({ asset, sender }) => {
    if (!asset || !asset.id) return;
    const db = getDbData();
    const list = db.assets || [];
    const idx = list.findIndex(a => a.id === asset.id);
    if (idx >= 0) list[idx] = asset;
    else list.unshift(asset);
    db.assets = list;
    saveDbData(db);

    logAuditEvent({
      category: 'ACTIVOS',
      action: idx >= 0 ? 'ACTIVO_ACTUALIZADO' : 'ACTIVO_REGISTRADO',
      details: `${idx >= 0 ? 'Actualización' : 'Alta'} de activo: [${asset.code || asset.id}] "${asset.name}" en ${asset.location || 'Planta'}`,
      user: sender || connectedUsers.get(socket.id),
      targetId: asset.id,
      severity: 'INFO'
    });

    socket.broadcast.emit('asset:saved', {
      asset,
      sender: sender || connectedUsers.get(socket.id) || { name: 'Mantenimiento' },
      timestamp: new Date().toISOString()
    });
  });

  socket.on('asset:delete', ({ assetId, sender }) => {
    if (!assetId) return;
    const db = getDbData();
    db.assets = (db.assets || []).filter(a => a.id !== assetId);
    saveDbData(db);

    logAuditEvent({
      category: 'ACTIVOS',
      action: 'ACTIVO_ELIMINADO',
      details: `Baja de activo / maquinaria ID: ${assetId}`,
      user: sender || connectedUsers.get(socket.id),
      targetId: assetId,
      severity: 'ADVERTENCIA'
    });

    socket.broadcast.emit('asset:deleted', {
      assetId,
      sender: sender || connectedUsers.get(socket.id) || { name: 'Mantenimiento' },
      timestamp: new Date().toISOString()
    });
  });

  // Sincronización de Usuarios en Tiempo Real
  socket.on('user:save', ({ user, sender }) => {
    if (!user || !user.email) return;
    const db = getDbData();
    if (!Array.isArray(db.users)) db.users = [];

    const cleanEmail = user.email.toLowerCase().trim();
    const idx = db.users.findIndex(u => (u.id && u.id === user.id) || (u.email && u.email.toLowerCase().trim() === cleanEmail));

    let isNew = false;
    let savedUser = user;

    if (idx >= 0) {
      db.users[idx] = { ...db.users[idx], ...user, updatedAt: new Date().toISOString() };
      savedUser = db.users[idx];
    } else {
      isNew = true;
      savedUser = {
        ...user,
        id: user.id || `usr-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
        email: cleanEmail,
        fullName: user.fullName || user.full_name || 'Nuevo Usuario',
        role: user.role || 'tecnico',
        department: user.department || 'Mantenimiento General',
        phone: user.phone || '+52 (33) 3800-0000',
        password: user.password || 'Password123!',
        status: user.status || 'Activo',
        createdAt: user.createdAt || new Date().toISOString().split('T')[0],
        lastLogin: 'Nunca'
      };

      db.users.unshift(savedUser);
    }

    saveDbData(db);

    socket.broadcast.emit('user:saved', {
      user: savedUser,
      isNew,
      sender: sender || connectedUsers.get(socket.id) || { name: 'Administrador' },
      timestamp: new Date().toISOString()
    });
  });

  socket.on('user:delete', ({ userId, sender }) => {
    if (!userId) return;
    const db = getDbData();
    db.users = (db.users || []).filter(u => u.id !== userId);
    saveDbData(db);

    socket.broadcast.emit('user:deleted', {
      userId,
      sender: sender || connectedUsers.get(socket.id) || { name: 'Administrador' },
      timestamp: new Date().toISOString()
    });
  });

  // Desconexión
  socket.on('disconnect', () => {
    const user = connectedUsers.get(socket.id);
    connectedUsers.delete(socket.id);
    broadcastPresence();
    if (user) {
      console.log(`🔌 [Socket.io] Usuario desconectado: ${user.name} [${socket.id}]`);
    } else {
      console.log(`🔌 [Socket.io] Cliente desconectado: ${socket.id}`);
    }
  });
});

function listenOnAvailablePort(startPort) {
  httpServer.listen(startPort, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 Servidor Express & Socket.io PLATAFORMA PARK`);
    console.log(`👉 Web & REST:  http://localhost:${startPort}`);
    console.log(`⚡ WebSockets:  ws://localhost:${startPort} (Socket.io)`);
    console.log(`📁 DB Central:  src/data/cmms_db.json`);
    console.log(`==================================================\n`);
  });

  httpServer.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️ Puerto ${startPort} ocupado. Intentando en puerto ${startPort + 1}...`);
      listenOnAvailablePort(startPort + 1);
    } else {
      console.error('Error al iniciar el servidor:', err);
    }
  });
}

listenOnAvailablePort(PORT);
