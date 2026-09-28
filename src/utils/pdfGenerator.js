import { formatAuditDate } from './dateUtils.js';

export const generateParkPdfReport = ({ type = 'SINGLE_WO', workOrder = null, data = {}, exportOptions = {} }) => {
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

    let sectionIndex = 1;

    // --- 1. DESCRIPCIÓN DEL REQUERIMIENTO ---
    doc.setTextColor(10, 57, 99);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.text(`${sectionIndex++}. DESCRIPCIÓN DEL REQUERIMIENTO`, 14, startY);
    
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
      doc.text(`${sectionIndex++}. PROCEDIMIENTO & CHECKLIST DE SEGURIDAD Y VERIFICACIÓN`, 14, startY);

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

    // --- 3. SEGUIMIENTO DE TIEMPOS, REPUESTOS & COSTOS ---
    if (exportOptions.includeParts !== false) {
      doc.setTextColor(10, 57, 99);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.text(`${sectionIndex++}. SEGUIMIENTO DE TIEMPOS, REPUESTOS Y DESGLOSE DE COSTOS`, 14, startY);

      const totalPartsCost = Number(workOrder.totalPartsCost !== undefined ? workOrder.totalPartsCost : (workOrder.manualMaterialsCost || 0));
      const totalLaborCost = Number(workOrder.totalLaborCost || 0);
      const grandTotal = Number(workOrder.grandTotal !== undefined ? workOrder.grandTotal : (totalPartsCost + totalLaborCost));
      const actualHours = Number(workOrder.actualHours || 0);
      const hasParts = Array.isArray(workOrder.usedParts) && workOrder.usedParts.length > 0;
      
      // Si el costo total es 0 (o noCostEntries es true y total es 0)
      const isZeroCost = (grandTotal === 0 && actualHours === 0 && !hasParts) || (workOrder.noCostEntries && grandTotal === 0);

      if (isZeroCost) {
        // Cuadro informativo discreto y profesional
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(203, 213, 225);
        doc.roundedRect(14, startY + 3, 182, 13, 2, 2, 'FD');

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text("No se registraron entradas en tiempos ni costos", 18, startY + 11);

        startY += 22;
      } else {
        const partsRows = hasParts
          ? workOrder.usedParts.map(p => [
              p.partId || p.sku || "REP",
              p.name + (p.isManual ? " [Manual]" : ""),
              p.qty,
              `$${(p.unitCost || 0).toFixed(2)} USD`,
              `$${(p.totalCost || 0).toFixed(2)} USD`
            ])
          : [["MAT-DIR", "Materiales e insumos directos asignados", "1", `$${totalPartsCost.toFixed(2)} USD`, `$${totalPartsCost.toFixed(2)} USD`]];

        doc.autoTable({
          startY: startY + 2.5,
          head: [['SKU / ID', 'Descripción del Repuesto / Material', 'Cant.', 'Costo Unit.', 'Subtotal']],
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
        const boxHeight = actualHours > 0 ? 27 : 22;
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(140, 198, 63);
        doc.rect(114, startY, 82, boxHeight, 'FD');

        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        doc.setFont("helvetica", "normal");
        doc.text("Total Materiales:", 118, startY + 6);
        doc.text(`$${totalPartsCost.toFixed(2)} USD`, 190, startY + 6, { align: "right" });

        doc.text("Mano de Obra:", 118, startY + 11);
        doc.text(`$${totalLaborCost.toFixed(2)} USD`, 190, startY + 11, { align: "right" });

        if (actualHours > 0) {
          doc.text("Tiempo Invertido:", 118, startY + 16);
          doc.text(`${actualHours} hrs`, 190, startY + 16, { align: "right" });
        }

        const totalY = actualHours > 0 ? startY + 22 : startY + 18;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(10, 57, 99);
        doc.text("COSTO TOTAL ORDEN:", 118, totalY);
        doc.setTextColor(140, 198, 63);
        doc.text(`$${grandTotal.toFixed(2)} USD`, 190, totalY, { align: "right" });

        startY += boxHeight + 6;
      }
    }

    // --- 4. EVIDENCIA FOTOGRÁFICA Y REGISTRO VISUAL ---
    const photos = Array.isArray(workOrder.photos) ? workOrder.photos.filter(p => p && p.url) : [];
    if (photos.length > 0) {
      if (startY > 220) {
        doc.addPage();
        addHeader("ORDEN DE TRABAJO", `FOLIO: ${workOrder.code}`);
        startY = 42;
      }

      doc.setTextColor(10, 57, 99);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.text(`${sectionIndex++}. EVIDENCIA FOTOGRÁFICA Y REGISTRO VISUAL (${photos.length} ${photos.length === 1 ? 'registro' : 'registros'})`, 14, startY);

      startY += 3;

      const tagColors = {
        'Antes': [220, 38, 38],
        'Durante': [217, 119, 6],
        'Después': [16, 185, 129],
        'Falla': [225, 29, 72],
        'Evidencia': [37, 99, 235]
      };
      const defaultTagColor = [10, 57, 99];

      if (photos.length === 1) {
        // 1 Foto: Centrada, clara y visible
        const p = photos[0];
        const cardW = 90;
        const cardH = 54;
        const cardX = 14 + (182 - cardW) / 2;
        const cardY = startY;

        if (startY + cardH > 260) {
          doc.addPage();
          addHeader("ORDEN DE TRABAJO", `FOLIO: ${workOrder.code}`);
          startY = 42;
        }

        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(cardX, cardY, cardW, cardH, 2, 2, 'FD');

        const imgX = cardX + 2;
        const imgY = cardY + 2;
        const imgW = cardW - 4;
        const imgH = cardH - 12;

        try {
          let format = 'JPEG';
          if (typeof p.url === 'string') {
            if (p.url.startsWith('data:image/png')) format = 'PNG';
            else if (p.url.startsWith('data:image/webp')) format = 'WEBP';
          }
          doc.addImage(p.url, format, imgX, imgY, imgW, imgH);
        } catch (err) {
          doc.setFillColor(241, 245, 249);
          doc.rect(imgX, imgY, imgW, imgH, 'F');
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(148, 163, 184);
          doc.text("[Evidencia registrada]", imgX + (imgW / 2), imgY + (imgH / 2), { align: "center" });
        }

        doc.setDrawColor(226, 232, 240);
        doc.rect(imgX, imgY, imgW, imgH, 'S');

        // Badge de etiqueta
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        const tagStr = (p.tag || 'Evidencia').toUpperCase();
        const badgeW = doc.getTextWidth(tagStr) + 5;
        const badgeH = 4.5;
        const badgeX = cardX + 3;
        const badgeY = cardY + cardH - 7.5;

        doc.setFillColor(...(tagColors[p.tag] || defaultTagColor));
        doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 1, 1, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text(tagStr, badgeX + (badgeW / 2), badgeY + 3.2, { align: "center" });

        // Meta info
        doc.setFont("helvetica", "normal");
        doc.setFontSize(6.5);
        doc.setTextColor(100, 116, 139);
        const metaText = `${p.uploadedAt || ''}${p.uploadedBy ? ' • ' + p.uploadedBy : ''}`;
        doc.text(metaText, badgeX + badgeW + 3, badgeY + 3.2, { maxWidth: cardW - badgeW - 10 });

        startY += cardH + 6;
      } else if (photos.length === 2) {
        // 2 Fotos: 2 Columnas de 88mm
        const cardW = 88;
        const cardH = 48;
        const gap = 6;

        if (startY + cardH > 260) {
          doc.addPage();
          addHeader("ORDEN DE TRABAJO", `FOLIO: ${workOrder.code}`);
          startY = 42;
        }

        photos.forEach((p, i) => {
          const cardX = 14 + i * (cardW + gap);
          const cardY = startY;

          doc.setFillColor(248, 250, 252);
          doc.setDrawColor(226, 232, 240);
          doc.roundedRect(cardX, cardY, cardW, cardH, 2, 2, 'FD');

          const imgX = cardX + 2;
          const imgY = cardY + 2;
          const imgW = cardW - 4;
          const imgH = cardH - 11;

          try {
            let format = 'JPEG';
            if (typeof p.url === 'string') {
              if (p.url.startsWith('data:image/png')) format = 'PNG';
              else if (p.url.startsWith('data:image/webp')) format = 'WEBP';
            }
            doc.addImage(p.url, format, imgX, imgY, imgW, imgH);
          } catch (err) {
            doc.setFillColor(241, 245, 249);
            doc.rect(imgX, imgY, imgW, imgH, 'F');
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(148, 163, 184);
            doc.text("[Evidencia registrada]", imgX + (imgW / 2), imgY + (imgH / 2), { align: "center" });
          }

          doc.setDrawColor(226, 232, 240);
          doc.rect(imgX, imgY, imgW, imgH, 'S');

          // Tag badge
          doc.setFont("helvetica", "bold");
          doc.setFontSize(6.5);
          const tagStr = (p.tag || 'Evidencia').toUpperCase();
          const badgeW = doc.getTextWidth(tagStr) + 4.5;
          const badgeH = 4.2;
          const badgeX = cardX + 2.5;
          const badgeY = cardY + cardH - 7;

          doc.setFillColor(...(tagColors[p.tag] || defaultTagColor));
          doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 1, 1, 'F');
          doc.setTextColor(255, 255, 255);
          doc.text(tagStr, badgeX + (badgeW / 2), badgeY + 3, { align: "center" });

          // Meta info
          doc.setFont("helvetica", "normal");
          doc.setFontSize(6);
          doc.setTextColor(100, 116, 139);
          const metaText = `${p.uploadedAt || ''}${p.uploadedBy ? ' • ' + p.uploadedBy : ''}`;
          doc.text(metaText, badgeX + badgeW + 2.5, badgeY + 3, { maxWidth: cardW - badgeW - 8 });
        });

        startY += cardH + 6;
      } else {
        // 3 o más Fotos: Grid responsivo de 3 columnas (57mm de ancho por tarjeta)
        const cols = 3;
        const cardW = 57;
        const cardH = 44;
        const gap = 5.5;

        for (let i = 0; i < photos.length; i += cols) {
          if (startY + cardH > 260) {
            doc.addPage();
            addHeader("ORDEN DE TRABAJO", `FOLIO: ${workOrder.code}`);
            startY = 42;
          }

          const rowPhotos = photos.slice(i, i + cols);
          rowPhotos.forEach((p, colIdx) => {
            const cardX = 14 + colIdx * (cardW + gap);
            const cardY = startY;

            doc.setFillColor(248, 250, 252);
            doc.setDrawColor(226, 232, 240);
            doc.roundedRect(cardX, cardY, cardW, cardH, 2, 2, 'FD');

            const imgX = cardX + 1.5;
            const imgY = cardY + 1.5;
            const imgW = cardW - 3; // 54mm
            const imgH = cardH - 11; // 33mm

            try {
              let format = 'JPEG';
              if (typeof p.url === 'string') {
                if (p.url.startsWith('data:image/png')) format = 'PNG';
                else if (p.url.startsWith('data:image/webp')) format = 'WEBP';
              }
              doc.addImage(p.url, format, imgX, imgY, imgW, imgH);
            } catch (err) {
              doc.setFillColor(241, 245, 249);
              doc.rect(imgX, imgY, imgW, imgH, 'F');
              doc.setFont("helvetica", "normal");
              doc.setFontSize(7);
              doc.setTextColor(148, 163, 184);
              doc.text("[Evidencia]", imgX + (imgW / 2), imgY + (imgH / 2), { align: "center" });
            }

            doc.setDrawColor(226, 232, 240);
            doc.rect(imgX, imgY, imgW, imgH, 'S');

            // Tag badge
            doc.setFont("helvetica", "bold");
            doc.setFontSize(6);
            const tagStr = (p.tag || 'Evidencia').toUpperCase();
            const badgeW = doc.getTextWidth(tagStr) + 4;
            const badgeH = 4;
            const badgeX = cardX + 2;
            const badgeY = cardY + cardH - 6.5;

            doc.setFillColor(...(tagColors[p.tag] || defaultTagColor));
            doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 1, 1, 'F');
            doc.setTextColor(255, 255, 255);
            doc.text(tagStr, badgeX + (badgeW / 2), badgeY + 2.8, { align: "center" });

            // Meta info
            doc.setFont("helvetica", "normal");
            doc.setFontSize(5.5);
            doc.setTextColor(100, 116, 139);
            const metaText = p.uploadedAt || (p.name ? p.name.substring(0, 14) : '');
            doc.text(metaText, badgeX + badgeW + 2, badgeY + 2.8, { maxWidth: cardW - badgeW - 5 });
          });

          startY += cardH + 4;
        }

        startY += 2;
      }
    }

    if (startY > 230) {
      doc.addPage();
      addHeader("ORDEN DE TRABAJO", `FOLIO: ${workOrder.code}`);
      startY = 42;
    }

    // --- OBSERVACIONES TÉCNICAS ---
    doc.setTextColor(10, 57, 99);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.text(`${sectionIndex++}. OBSERVACIONES TÉCNICAS Y CONFORMIDAD OPERATIVA`, 14, startY);

    const hasCustomNotes = Boolean(workOrder.technicianNotes && workOrder.technicianNotes.trim());
    const notesText = hasCustomNotes 
      ? workOrder.technicianNotes.trim() 
      : "Sin observaciones adicionales registradas por el técnico.";
    const notesLines = doc.splitTextToSize(notesText, 174);
    const notesBoxH = Math.max(16, 7 + (notesLines.length * 4.2));

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, startY + 3, 182, notesBoxH, 2, 2, 'FD');

    doc.setFont("helvetica", hasCustomNotes ? "normal" : "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(hasCustomNotes ? 30 : 100, hasCustomNotes ? 41 : 116, hasCustomNotes ? 59 : 139);
    doc.text(notesLines, 18, startY + 9);

    startY += notesBoxH + 8;

    // --- FIRMAS DE CONFORMIDAD ---
    if (exportOptions.includeSignature !== false) {
      if (startY > 235) {
        doc.addPage();
        addHeader("ORDEN DE TRABAJO", `FOLIO: ${workOrder.code}`);
        startY = 42;
      }

      doc.setTextColor(10, 57, 99);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.text(`${sectionIndex++}. FIRMAS DE CONFORMIDAD`, 14, startY);

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

      startY += 30;
    }

    const totalPages = doc.internal.getNumberOfPages();
    doc.setPage(totalPages);

    // Metadatos discretos de auditoría de creación y última actualización en PDF
    const createdByStr = `Orden creada por: ${workOrder.createdBy || 'Administración PlataformaPark'} el ${formatAuditDate(workOrder.createdDate || new Date())}`;
    const updatedByStr = workOrder.updatedAt ? ` • Última actualización: ${formatAuditDate(workOrder.updatedAt)}${workOrder.lastUpdatedBy ? ' por ' + workOrder.lastUpdatedBy : ''}` : '';
    
    doc.setFont("helvetica", "italic");
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(`${createdByStr}${updatedByStr}`, 14, 280, { maxWidth: 182 });

    // Pie de página en todas las páginas con numeración dinámica (Página X de Y)
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      addFooter(p, totalPages);
    }

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
// ==========================================;
