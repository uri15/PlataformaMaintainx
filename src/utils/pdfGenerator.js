// Motor de Generación de Reportes PDF - Plataforma PARK (Grupo Favier)
// Requiere window.jspdf e window.jspdf.autotable (o jsPDF UMD)

export const generateParkPdfReport = ({ type = 'SINGLE_WO', workOrder = null, data = {}, exportOptions = {} }) => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const company = data.company || {
    name: "GRUPO FAVIER",
    platform: "PLATAFORMA PARK CMMS",
    subtitle: "Sistema de Mantenimiento de Infraestructura & Parques Industriales",
    logoText: "PARK",
    groupText: "GRUPO FAVIER"
  };

  const primaryColor = [11, 25, 44]; // #0B192C Dark Navy
  const goldColor = [212, 175, 55];  // #D4AF37 Gold
  const slateColor = [30, 62, 98];   // #1E3E62 Slate
  const textDark = [15, 23, 42];     // #0F172A Text Dark
  const textMuted = [100, 116, 139]; // #64748B Text Muted

  const addHeader = (titleText, subtitleText = "") => {
    // Header background banner
    doc.setFillColor(11, 25, 44);
    doc.rect(0, 0, 210, 32, 'F');

    // Gold accent line below header
    doc.setFillColor(212, 175, 55);
    doc.rect(0, 32, 210, 2.5, 'F');

    // Logo Text "PARK"
    doc.setTextColor(212, 175, 55);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("PARK", 14, 18);

    // Group Text "GRUPO FAVIER"
    doc.setTextColor(248, 250, 252);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("G R U P O   F A V I E R", 14, 25);

    // Document Title Right Aligned
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(titleText.toUpperCase(), 196, 16, { align: "right" });

    doc.setTextColor(212, 175, 55);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(subtitleText || "REPORTE OFICIAL DE OPERACIONES E INFRAESTRUCTURA", 196, 23, { align: "right" });
  };

  const addFooter = (pageNo, totalPages) => {
    const pageHeight = 297;
    doc.setFillColor(241, 245, 249);
    doc.rect(0, pageHeight - 14, 210, 14, 'F');
    
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.5);
    doc.line(0, pageHeight - 14, 210, pageHeight - 14);

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("PLATAFORMA PARK © GRUPO FAVIER | Documento Confidencial de Control de Calidad e Infraestructura", 14, pageHeight - 6);
    doc.text(`Página ${pageNo} de ${totalPages}`, 196, pageHeight - 6, { align: "right" });
  };

  if (type === 'SINGLE_WO' && workOrder) {
    // Single Work Order Detailed Sheet
    addHeader("ORDEN DE TRABAJO", `FOLIO: ${workOrder.code}`);

    let startY = 42;

    // Work Order Meta Info Card Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, startY, 182, 38, 2, 2, 'FD');

    // Left Column Meta
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(workOrder.title, 18, startY + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Desarrollo / Parque: `, 18, startY + 16);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text(`${workOrder.development} (${workOrder.location})`, 50, startY + 16);

    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.text(`Activo Asociado: `, 18, startY + 23);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text(`${workOrder.assetName}`, 45, startY + 23);

    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.text(`Técnico Asignado: `, 18, startY + 30);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text(`${workOrder.assignedTech} - ${workOrder.assignedTechRole}`, 45, startY + 30);

    // Right Column Badges
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("Prioridad:", 135, startY + 16);
    doc.text("Estado:", 135, startY + 23);
    doc.text("Fecha Emisión:", 135, startY + 30);

    // Priority badge background
    let pColor = [59, 130, 246];
    if (workOrder.priority === 'Urgente') pColor = [239, 68, 68];
    else if (workOrder.priority === 'Alta') pColor = [249, 115, 22];
    else if (workOrder.priority === 'Media') pColor = [245, 158, 11];

    doc.setFillColor(...pColor);
    doc.roundedRect(155, startY + 12, 35, 6, 1, 1, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text(workOrder.priority.toUpperCase(), 172.5, startY + 16.5, { align: "center" });

    // Status badge
    let sColor = [59, 130, 246];
    if (workOrder.status === 'Completada') sColor = [16, 185, 129];
    else if (workOrder.status === 'En Proceso') sColor = [168, 85, 247];

    doc.setFillColor(...sColor);
    doc.roundedRect(155, startY + 19, 35, 6, 1, 1, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text(workOrder.status.toUpperCase(), 172.5, startY + 23.5, { align: "center" });

    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text(new Date(workOrder.createdDate).toLocaleDateString("es-MX"), 160, startY + 30);

    startY += 45;

    // Description Section
    doc.setTextColor(11, 25, 44);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("1. DESCRIPCIÓN DEL REQUERIMIENTO", 14, startY);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    const splitDesc = doc.splitTextToSize(workOrder.description, 182);
    doc.text(splitDesc, 14, startY + 6);

    startY += 8 + (splitDesc.length * 5);

    // Section 2: Procedure Checklist
    if (exportOptions.includeChecklist !== false && workOrder.checklist && workOrder.checklist.length > 0) {
      doc.setTextColor(11, 25, 44);
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
        headStyles: { fillColor: [11, 25, 44], textColor: [212, 175, 55], fontStyle: 'bold' },
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

    // Section 3: Spare Parts & Costs
    if (exportOptions.includeParts !== false) {
      doc.setTextColor(11, 25, 44);
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
        headStyles: { fillColor: [30, 62, 98], textColor: [255, 255, 255], fontStyle: 'bold' },
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

      // Cost Breakdown Summary Box
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(212, 175, 55);
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
      doc.setTextColor(11, 25, 44);
      doc.text("COSTO TOTAL ORDEN:", 118, startY + 18);
      doc.setTextColor(212, 175, 55);
      doc.text(`$${(workOrder.grandTotal || 0).toFixed(2)} USD`, 190, startY + 18, { align: "right" });

      startY += 28;
    }

    // Section 4: Notes and Signatures
    if (startY > 230) {
      doc.addPage();
      addHeader("ORDEN DE TRABAJO", `FOLIO: ${workOrder.code}`);
      startY = 42;
    }

    doc.setTextColor(11, 25, 44);
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

    // Signature Area
    if (exportOptions.includeSignature !== false) {
      doc.setDrawColor(212, 175, 55);
      doc.setLineWidth(0.5);
      doc.line(14, startY + 18, 85, startY + 18);
      doc.line(110, startY + 18, 182, startY + 18);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(11, 25, 44);
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
    // Consolidated / Filtered MaintainX Report
    addHeader("REPORTE CONSOLIDADO DE MANTENIMIENTO", "PLATAFORMA PARK CMMS");

    let startY = 42;
    const workOrders = data.filteredWorkOrders || data.workOrders || [];
    const filterDesc = exportOptions.filterDesc || "Todas las Órdenes de Trabajo registradas en sistema.";

    // Executive KPI Summary Banner
    doc.setFillColor(11, 25, 44);
    doc.roundedRect(14, startY, 182, 28, 2, 2, 'F');

    const totalWO = workOrders.length;
    const completedWO = workOrders.filter(w => w.status === 'Completada').length;
    const urgentWO = workOrders.filter(w => w.priority === 'Urgente').length;
    const totalCost = workOrders.reduce((sum, w) => sum + (w.grandTotal || 0), 0);

    doc.setTextColor(212, 175, 55);
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

    doc.setTextColor(11, 25, 44);
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
      headStyles: { fillColor: [11, 25, 44], textColor: [212, 175, 55], fontStyle: 'bold' },
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
