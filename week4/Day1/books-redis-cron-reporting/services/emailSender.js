import nodemailer from "nodemailer";
import logger from "../utils/logger.js";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendReportEmail(to, subject, text, attachmentPath) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
      attachments: [{ path: attachmentPath }],
    });
    logger.info(`Email sent to ${to}`);
  } catch (err) {
    logger.error("Email send error", err);
    throw err;
  }
}
