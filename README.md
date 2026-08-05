# PLATAFORMA PARK CMMS

Un sistema de gestión de mantenimiento computarizado (CMMS) moderno y eficiente, diseñado para optimizar las operaciones de mantenimiento, gestión de activos y control de inventario en parques industriales. 

Este prototipo está desarrollado con un fuerte enfoque en la Experiencia de Usuario (UX/UI) y la visualización clara de datos operativos, emulando los estándares de plataformas líderes en la industria como MaintainX.

## Tecnologías Utilizadas

* **Framework Core:** React 18
* **Estilos y Diseño UI:** Tailwind CSS
* **Transpilación:** Babel Standalone
* **Generación de Reportes:** jsPDF & jsPDF-AutoTable
* **Estructura y Versiones:** HTML5, Git / GitHub

## Componentes y Características Principales

* **Panel de Control (Dashboard):** Visualización intuitiva de métricas críticas de rendimiento, incluyendo **MTTR** (Tiempo Medio Para Reparar), **MTBF** (Tiempo Medio Entre Fallas) y otros indicadores clave de mantenimiento.
* **Módulo de Órdenes de Trabajo:** Gestión integral para programar, asignar y hacer seguimiento a tareas de mantenimiento tanto **preventivo** como **correctivo**.
* **Gestión de Inventario:** Control detallado del stock de partes e insumos necesarios para las operaciones diarias y reparaciones.
* **Registro de Activos:** Mapeo y administración de la infraestructura, equipos y locaciones dentro de los parques industriales.
* **Exportación de Reportes:** Funcionalidad integrada para compilar los datos operativos y exportarlos en documentos PDF profesionales.

## Instalación y Despliegue Local

Al estar configurado con Babel Standalone para ejecución rápida, el proyecto puede ser lanzado con un servidor local básico.

1. Clona el repositorio en tu máquina local:
   ```bash
   git clone https://github.com/uri15/PlataformaMaintainx.git
   ```
2. Navega al directorio del proyecto:
   ```bash
   cd PlataformaMaintainx
   ```
3. Inicia un servidor local. Si tienes Python instalado, puedes usar:
   ```bash
   python -m http.server 8000
   ```
4. Abre tu navegador web y visita `http://localhost:8000`

## Autor

**Mario Uriel Beltrán Alvarado**
*Ingeniería en Ciencias de la Computación*
