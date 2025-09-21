import PDFDocument from "pdfkit";
import fs from "fs";

export function generateReportPDF(statusObj, outPath) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40 });
      const stream = fs.createWriteStream(outPath);
      doc.pipe(stream);

      doc.fontSize(18).text("Bulk Insertion Report", { align: "center" });
      doc.moveDown();

      doc.fontSize(12).text(`User ID: ${String(statusObj.userId)}`);
      doc.text(`Request ID: ${String(statusObj.requestId)}`);
      doc.text(`Processed At: ${String(statusObj.timestamp)}`);
      doc.moveDown();

      doc.text(`Successes: ${String(statusObj.successCount)}`);
      doc.text(`Failures: ${String(statusObj.failureCount)}`);
      doc.moveDown();

      if (Array.isArray(statusObj.failures) && statusObj.failures.length > 0) {
        doc.fontSize(14).text("Failures:", { underline: true });
        statusObj.failures.forEach((f, i) => {
          doc.fontSize(11).text(`${i + 1}. Book: ${JSON.stringify(f.book)} - Error: ${String(f.error)}`);
        });
      }

      doc.end();
      stream.on("finish", () => resolve(outPath));
      stream.on("error", reject);
    } catch (err) {
      reject(err);
    }
  });
}
