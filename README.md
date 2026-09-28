# PLATAFORMA PARK CMMS

[![React 19](https://img.shields.io/badge/React-19.3.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8.3-010101?logo=socketdotio&logoColor=white)](https://socket.io/)
[![esbuild](https://img.shields.io/badge/esbuild-Bundler-FFCF00?logo=esbuild&logoColor=black)](https://esbuild.github.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![jsPDF](https://img.shields.io/badge/jsPDF-Reports-E71D32)](https://github.com/parallax/jsPDF)

Sistema Computarizado de Gestión de Mantenimiento (**CMMS**) integral, modular y en tiempo real, diseñado para la administración operativa de infraestructura, parques industriales y naves de manufactura.

El proyecto adopta los estándares de experiencia de usuario y arquitectura de plataformas de clase mundial como **MaintainX**, complementado con sincronización bidireccional por WebSockets, bitácora de auditoría inmutable, emisión de reportes técnicos oficiales en PDF y control de acceso basado en roles (**RBAC**).

---

## Características Principales

### 1. Panel de Control y Métricas Operativas (Dashboard)
* **Indicadores Clave de Mantenimiento:** Cálculo automático en tiempo real de métricas críticas como **MTTR** (*Mean Time to Repair*), **MTBF** (*Mean Time Between Failures*), tasa de cumplimiento preventivo y tiempo de inactividad acumulado.
* **Alertas Operativas:** Notificaciones visuales de órdenes vencidas, equipos críticos fuera de servicio e inventario bajo stock mínimo de seguridad.
* **Estado de Conexión:** Indicador dinámico de presencia y latencia del socket en el encabezado.

### 2. Módulo de Órdenes de Trabajo y Modo Borrador (Work Orders)
* **Captura Flexible:** Soporte para intervenciones con o sin costo, equipos registrados o manuales, y asignación de técnicos.
* **Aislamiento Seguro de Borradores (*Draft State*):** Modificar datos o eliminar evidencias fotográficas se mantiene en memoria local; los cambios solo impactan la base de datos central al presionar explícitamente **"Guardar Orden"**.
* **Evidencias Fotográficas Comprimidas:** Subida de imágenes con compresión en cliente (*Canvas API*), clasificación por etapas (*Antes*, *Durante*, *Después*, *Evidencia*), prevención global de arrastre fuera del contenedor y visor en alta definición (*Lightbox*).
* **Bitácora y Chat en Tiempo Real:** Chat colaborativo por orden para notas técnicas y adjuntos multimedia con soporte de sockets y aviso de "escribiendo...".

### 3. Reportes Oficiales en PDF (Engine jsPDF)
* **Membrete Corporativo:** Diseño formal adaptado a la identidad de Plataforma PARK con folio institucional y dirección física fijada.
* **Desglose de Costos y Procedimientos:** Tablas dinámicas de mano de obra, repuestos utilizados y checklist de tareas con sello de tiempo.
* **Cuadrícula Fotográfica:** Distribución compacta de evidencias fotográficas en 3 columnas con cálculo dinámico de saltos de página y firmas de conformidad operativa.

### 4. Bitácora de Auditoría y Trazabilidad (Audit Trail)
* **Registro de Eventos Críticos:** Monitoreo exhaustivo de aperturas, cierres de órdenes, modificaciones de stock, intentos de login y cambios de contraseña.
* **Filtros Avanzados y Severidad:** Clasificación por niveles (*Éxito*, *Info*, *Advertencia*, *Crítico*) y exportación inmediata a formato **CSV** y **JSON**.

### 5. Control de Activos, Repuestos y Mantenimiento Preventivo
* **Catálogo de Activos:** Mapeo de equipos por nave industrial, estado operativo (*Operativo*, *En Falla*, *Mantenimiento*) y criticidad.
* **Gestión de Inventario:** Control de existencias, costos unitarios, movimientos de almacén y deducción automática al completar órdenes.
* **Planes Preventivos Calendarizados:** Generación automática de órdenes de trabajo recurrentes según frecuencia programada.

---

## Stack Tecnológico

| Capa | Tecnologías |
| :--- | :--- |
| **Frontend** | React 19, Vanilla CSS, Tailwind CSS, Lucide Vector Icons |
| **Backend & API** | Node.js, Express 4.x, REST API, JSON Storage |
| **Tiempo Real** | Socket.io (WebSockets bidireccionales con salas por orden) |
| **Compilación & Bundling** | esbuild (compilación modular en <200ms con soporte de Source Maps) |
| **Generación Documental** | jsPDF, jsPDF-AutoTable |
| **Seguridad & Acceso** | JSON Web Tokens (JWT), Middleware RBAC dinámico |

---

## Instalación y Puesta en Marcha

### Prerrequisitos
* **Node.js** (versión 18.0.0 o superior recomendada)
* **npm** (incluido con Node.js) o yarn

### Pasos de Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/uri15/PlataformaMaintainx.git
   cd PlataformaMaintainx
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Copia el archivo de ejemplo para generar tu archivo `.env` local:
   ```bash
   cp .env.example .env
   ```
   *(En Windows PowerShell: `Copy-Item .env.example .env`)*

4. **Compilar el bundle de producción:**
   ```bash
   npm run build
   ```

5. **Iniciar el servidor en modo desarrollo:**
   ```bash
   npm run dev
   ```

6. **Abrir la plataforma:**
   Visita en tu navegador web: [`http://localhost:8000`](http://localhost:8000)

> **Nota de Base de Datos:** El servidor incluye auto-inicialización. Si el archivo local `cmms_db.json` no existe, se generará automáticamente a partir de la plantilla limpia `src/data/cmms_db.example.json`.

### Despliegue con Docker (Opcional)

Si prefieres ejecutar el sistema contenedorizado con Docker y Docker Compose:

1. **Construir y levantar el contenedor:**
   ```bash
   docker compose up -d --build
   ```

2. **Detener el contenedor:**
   ```bash
   docker compose down
   ```

*(Los volúmenes `cmms_uploads` y `cmms_data` conservan las imágenes y la base de datos de forma persistente fuera del contenedor)*.

---

## Cuentas de Acceso Demo

Para probar la plataforma con diferentes privilegios y perfiles del sistema RBAC, puedes ingresar con cualquiera de las siguientes credenciales:

| Rol | Correo Electrónico | Contraseña | Permisos Principales |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@park.com` | `Password123!` | Acceso total, Auditoría, Gestión de Usuarios, Configuración |
| **Desarrollador / QA** | `dev@park.com` | `Password123!` | Depuración, Módulos Operativos, Monitoreo de Sockets |
| **Técnico Operativo** | `tecnico@park.com` | `Password123!` | Ejecución de Órdenes, Checklists, Evidencias, Chat Interno |

---

## Estructura del Repositorio

```text
PlataformaMaintainx/
├── backend/                  # Rutas complementarias y middleware RBAC
├── dist/                     # Bundle transpilado generado por esbuild
│   ├── bundle.js
│   └── bundle.js.map
├── src/
│   ├── components/           # Componentes UI reutilizables (Modales, Badges, Header, Logo)
│   ├── constants/            # Definiciones de roles RBAC y configuración global
│   ├── data/                 # Esquema y plantilla semilla de datos (cmms_db.example.json)
│   ├── styles/               # Estilos globales y utilidades personalizadas
│   ├── utils/                # Generador PDF, sockets, compresión de fotos y almacenamiento
│   ├── views/                # Vistas principales (Dashboard, WorkOrders, Assets, Audit, Users)
│   └── main.jsx              # Punto de entrada modular de React
├── uploads/                  # Directorio para archivos multimedia (excluido de git)
├── .env.example              # Plantilla de variables de entorno públicas
├── .gitignore                # Exclusiones de seguridad para Git
├── build.js                  # Script de compilación ultrarrápida con esbuild
├── index.html                # Estructura HTML base con soporte de caché dinámico
├── package.json              # Manifiesto de dependencias y scripts de ejecución
├── README.md                 # Documentación técnica del proyecto
└── server.js                 # Servidor central Express + Socket.io + Base de Datos JSON
```

---

## Autor

**Mario Uriel Beltrán Alvarado**  
*Ingeniería en Ciencias de la Computación*  
Repositorio: [github.com/uri15/PlataformaMaintainx](https://github.com/uri15/PlataformaMaintainx)
