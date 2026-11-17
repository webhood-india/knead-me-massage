const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const INVOICE_DIR = path.join(__dirname, '..', 'invoices');
if (!fs.existsSync(INVOICE_DIR)) fs.mkdirSync(INVOICE_DIR, { recursive: true });

/**
 * Generates a PDF invoice for a booking and saves it to disk.
 * Returns { filePath, fileName }.
 */
const generateInvoicePDF = async (booking, customer) => {
  const fileName = `invoice-${booking.bookingRef}.pdf`;
  const filePath = path.join(INVOICE_DIR, fileName);

  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // Header
  doc.fontSize(20).fillColor('#1a1a1a').text('KNEAD ME', { continued: true }).fontSize(10).text('  MASSAGE & WELLNESS CLINIC');
  doc.moveDown(0.5);
  doc.fontSize(9).fillColor('#555').text(process.env.CLINIC_ADDRESS || '');
  doc.text(process.env.CLINIC_PHONE || '');
  doc.moveDown(1.5);

  doc.fontSize(16).fillColor('#1a1a1a').text('INVOICE', { align: 'right' });
  doc.fontSize(10).fillColor('#555').text(`Invoice #: ${booking.invoice?.number || booking.bookingRef}`, { align: 'right' });
  doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, { align: 'right' });
  doc.moveDown(1);

  doc.fontSize(11).fillColor('#1a1a1a').text('Billed to:');
  doc.fontSize(10).fillColor('#333').text(customer.name);
  doc.text(customer.email);
  if (customer.phone) doc.text(customer.phone);
  doc.moveDown(1.5);

  // Table header
  const tableTop = doc.y;
  doc.fontSize(10).fillColor('#fff');
  doc.rect(50, tableTop, 495, 22).fill('#1a1a1a');
  doc.fillColor('#fff').text('Treatment', 60, tableTop + 6);
  doc.text('Duration', 300, tableTop + 6);
  doc.text('Date', 380, tableTop + 6);
  doc.text('Amount', 470, tableTop + 6);

  const rowTop = tableTop + 30;
  doc.fillColor('#333').fontSize(10);
  doc.text(booking.serviceName, 60, rowTop);
  doc.text(`${booking.duration} min`, 300, rowTop);
  doc.text(booking.date, 380, rowTop);
  doc.text(`£${booking.price.toFixed(2)}`, 470, rowTop);

  doc.moveTo(50, rowTop + 25).lineTo(545, rowTop + 25).strokeColor('#ddd').stroke();

  doc.fontSize(11).fillColor('#1a1a1a').text('Total Paid', 380, rowTop + 40);
  doc.fontSize(11).fillColor('#1a1a1a').text(`£${booking.price.toFixed(2)}`, 470, rowTop + 40);

  if (booking.isGift) {
    doc.fontSize(9).fillColor('#6E7F52').text(`Gifted by ${booking.purchasedByName || 'a friend'}`, 380, rowTop + 58);
  }

  doc.moveDown(4);
  doc.fontSize(9).fillColor('#777').text('Thank you for choosing Knead Me Massage & Wellness Clinic.', 50, rowTop + 100);
  doc.text('This invoice confirms payment received for the treatment listed above.', 50, rowTop + 114);

  doc.end();

  await new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });

  return { filePath, fileName };
};

module.exports = { generateInvoicePDF };
