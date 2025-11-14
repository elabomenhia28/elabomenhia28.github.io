import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

// Generate PDF
export const generatePDF = async (minutesData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = 20;

  // Helper function to add text with auto line break
  const addText = (text, fontSize = 12, isBold = false, align = 'left') => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');

    const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);

    lines.forEach(line => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }

      if (align === 'center') {
        const textWidth = doc.getTextWidth(line);
        doc.text(line, (pageWidth - textWidth) / 2, yPosition);
      } else {
        doc.text(line, margin, yPosition);
      }

      yPosition += fontSize * 0.5;
    });

    yPosition += 5;
  };

  // Title
  addText('NOTULEN RAPAT', 18, true, 'center');
  yPosition += 5;

  // Meeting Info
  addText(`Judul: ${minutesData.title || 'Rapat'}`, 12, true);
  addText(`Tanggal: ${minutesData.date || format(new Date(), 'dd MMMM yyyy', { locale: id })}`, 11);
  addText(`Waktu: ${minutesData.time || format(new Date(), 'HH:mm', { locale: id })} WIB`, 11);

  if (minutesData.participants && minutesData.participants.length > 0) {
    addText(`Peserta: ${minutesData.participants.join(', ')}`, 11);
  }

  yPosition += 10;

  // Summary
  if (minutesData.summary) {
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    addText('RINGKASAN', 14, true);
    addText(minutesData.summary, 11);
    yPosition += 5;
  }

  // Main Discussion
  if (minutesData.mainPoints && minutesData.mainPoints.length > 0) {
    addText('PEMBAHASAN UTAMA', 14, true);
    minutesData.mainPoints.forEach((point, index) => {
      addText(`${index + 1}. ${point}`, 11);
    });
    yPosition += 5;
  }

  // Decisions
  if (minutesData.decisions && minutesData.decisions.length > 0) {
    addText('KEPUTUSAN RAPAT', 14, true);
    minutesData.decisions.forEach((decision, index) => {
      addText(`${index + 1}. ${decision}`, 11);
    });
    yPosition += 5;
  }

  // Action Items
  if (minutesData.actionItems && minutesData.actionItems.length > 0) {
    addText('ACTION ITEMS', 14, true);
    minutesData.actionItems.forEach((item, index) => {
      const actionText = `${index + 1}. ${item.task || item}`;
      const picText = item.pic ? `   PIC: ${item.pic}` : '';
      const deadlineText = item.deadline ? `   Deadline: ${item.deadline}` : '';

      addText(actionText, 11);
      if (picText) addText(picText, 10);
      if (deadlineText) addText(deadlineText, 10);
    });
    yPosition += 5;
  }

  // Key Points
  if (minutesData.keyPoints && minutesData.keyPoints.length > 0) {
    addText('POIN-POIN PENTING', 14, true);
    minutesData.keyPoints.forEach((point, index) => {
      addText(`${index + 1}. ${point}`, 11);
    });
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(
    `Dibuat dengan Notulen AI - ${format(new Date(), 'dd/MM/yyyy HH:mm')}`,
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );

  return doc;
};

// Export to DOCX
export const generateDOCX = async (minutesData) => {
  const children = [];

  // Title
  children.push(
    new Paragraph({
      text: 'NOTULEN RAPAT',
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 }
    })
  );

  // Meeting Info
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: 'Judul: ', bold: true }),
        new TextRun(minutesData.title || 'Rapat')
      ],
      spacing: { after: 100 }
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'Tanggal: ', bold: true }),
        new TextRun(minutesData.date || format(new Date(), 'dd MMMM yyyy', { locale: id }))
      ],
      spacing: { after: 100 }
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'Waktu: ', bold: true }),
        new TextRun(`${minutesData.time || format(new Date(), 'HH:mm', { locale: id })} WIB`)
      ],
      spacing: { after: 100 }
    })
  );

  if (minutesData.participants && minutesData.participants.length > 0) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Peserta: ', bold: true }),
          new TextRun(minutesData.participants.join(', '))
        ],
        spacing: { after: 200 }
      })
    );
  }

  // Summary
  if (minutesData.summary) {
    children.push(
      new Paragraph({
        text: 'RINGKASAN',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      }),
      new Paragraph({
        text: minutesData.summary,
        spacing: { after: 200 }
      })
    );
  }

  // Main Points
  if (minutesData.mainPoints && minutesData.mainPoints.length > 0) {
    children.push(
      new Paragraph({
        text: 'PEMBAHASAN UTAMA',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      })
    );
    minutesData.mainPoints.forEach((point, index) => {
      children.push(
        new Paragraph({
          text: `${index + 1}. ${point}`,
          spacing: { after: 100 }
        })
      );
    });
  }

  // Decisions
  if (minutesData.decisions && minutesData.decisions.length > 0) {
    children.push(
      new Paragraph({
        text: 'KEPUTUSAN RAPAT',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      })
    );
    minutesData.decisions.forEach((decision, index) => {
      children.push(
        new Paragraph({
          text: `${index + 1}. ${decision}`,
          spacing: { after: 100 }
        })
      );
    });
  }

  // Action Items
  if (minutesData.actionItems && minutesData.actionItems.length > 0) {
    children.push(
      new Paragraph({
        text: 'ACTION ITEMS',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      })
    );
    minutesData.actionItems.forEach((item, index) => {
      const lines = [
        new TextRun({ text: `${index + 1}. ${item.task || item}`, break: 1 })
      ];
      if (item.pic) {
        lines.push(new TextRun({ text: `   PIC: ${item.pic}`, break: 1 }));
      }
      if (item.deadline) {
        lines.push(new TextRun({ text: `   Deadline: ${item.deadline}`, break: 1 }));
      }
      children.push(
        new Paragraph({
          children: lines,
          spacing: { after: 100 }
        })
      );
    });
  }

  // Key Points
  if (minutesData.keyPoints && minutesData.keyPoints.length > 0) {
    children.push(
      new Paragraph({
        text: 'POIN-POIN PENTING',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      })
    );
    minutesData.keyPoints.forEach((point, index) => {
      children.push(
        new Paragraph({
          text: `${index + 1}. ${point}`,
          spacing: { after: 100 }
        })
      );
    });
  }

  const doc = new Document({
    sections: [{
      children: children
    }]
  });

  return await Packer.toBlob(doc);
};

// Export to TXT
export const generateTXT = (minutesData) => {
  let text = '';

  text += '═══════════════════════════════════════════\n';
  text += '              NOTULEN RAPAT\n';
  text += '═══════════════════════════════════════════\n\n';

  text += `Judul: ${minutesData.title || 'Rapat'}\n`;
  text += `Tanggal: ${minutesData.date || format(new Date(), 'dd MMMM yyyy', { locale: id })}\n`;
  text += `Waktu: ${minutesData.time || format(new Date(), 'HH:mm', { locale: id })} WIB\n`;

  if (minutesData.participants && minutesData.participants.length > 0) {
    text += `Peserta: ${minutesData.participants.join(', ')}\n`;
  }

  text += '\n';

  if (minutesData.summary) {
    text += '───────────────────────────────────────────\n';
    text += 'RINGKASAN\n';
    text += '───────────────────────────────────────────\n';
    text += `${minutesData.summary}\n\n`;
  }

  if (minutesData.mainPoints && minutesData.mainPoints.length > 0) {
    text += '───────────────────────────────────────────\n';
    text += 'PEMBAHASAN UTAMA\n';
    text += '───────────────────────────────────────────\n';
    minutesData.mainPoints.forEach((point, index) => {
      text += `${index + 1}. ${point}\n`;
    });
    text += '\n';
  }

  if (minutesData.decisions && minutesData.decisions.length > 0) {
    text += '───────────────────────────────────────────\n';
    text += 'KEPUTUSAN RAPAT\n';
    text += '───────────────────────────────────────────\n';
    minutesData.decisions.forEach((decision, index) => {
      text += `${index + 1}. ${decision}\n`;
    });
    text += '\n';
  }

  if (minutesData.actionItems && minutesData.actionItems.length > 0) {
    text += '───────────────────────────────────────────\n';
    text += 'ACTION ITEMS\n';
    text += '───────────────────────────────────────────\n';
    minutesData.actionItems.forEach((item, index) => {
      text += `${index + 1}. ${item.task || item}\n`;
      if (item.pic) text += `   PIC: ${item.pic}\n`;
      if (item.deadline) text += `   Deadline: ${item.deadline}\n`;
      text += '\n';
    });
  }

  if (minutesData.keyPoints && minutesData.keyPoints.length > 0) {
    text += '───────────────────────────────────────────\n';
    text += 'POIN-POIN PENTING\n';
    text += '───────────────────────────────────────────\n';
    minutesData.keyPoints.forEach((point, index) => {
      text += `${index + 1}. ${point}\n`;
    });
    text += '\n';
  }

  text += '═══════════════════════════════════════════\n';
  text += `Dibuat dengan Notulen AI - ${format(new Date(), 'dd/MM/yyyy HH:mm')}\n`;
  text += '═══════════════════════════════════════════\n';

  return text;
};

// Download file helper
export const downloadFile = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
