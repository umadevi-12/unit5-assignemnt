import cron from "node-cron";
import { redis, getStatusFromRedis } from "../services/redisService.js";
import { generateReportPDF } from "../services/pdfGenerator.js";
import { sendReportEmail } from "../services/emailSender.js";
import logger from "../utils/logger.js";
import fs from "fs";
import path from "path";
import os from "os";

async function scanKeys(pattern, callback) {
  let cursor = 0;
  do {
    const reply = await redis.scan(cursor, { MATCH: pattern, COUNT: 50 });
    cursor = Number(reply.cursor);
    for (const key of reply.keys) {
      await callback(key);
    }
  } while (cursor !== 0);
}

export function startReportCron() {
  cron.schedule("*/5 * * * *", async () => {
    logger.info("[reportCron] tick " + new Date().toISOString());

    try {
      await scanKeys("bulk:status:*", async (key) => {
        const raw = await redis.get(key);
        if (!raw) return;

        let status;
        try { status = JSON.parse(raw); } 
        catch (err) { logger.error(`[reportCron] Failed to parse JSON for ${key}`, err); return; }

        const outDir = path.join(os.tmpdir(), "bulk_reports");
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

        const outPath = path.join(outDir, `report-${status.requestId}.pdf`);

        try { await generateReportPDF(status, outPath); }
        catch (err) { logger.error(`[reportCron] PDF generation failed for ${key}`, err); return; }

        try {
          await sendReportEmail(status.email, `Bulk Report - ${status.requestId}`, `Report for ${status.userId} / ${status.requestId}`, outPath);
          logger.info(`[reportCron] Email sent for ${key}`);

          await redis.del(key);           
          fs.unlink(outPath, () => {});   
        } catch (err) {
          logger.error(`[reportCron] Email failed for ${key}`, err);
        }
      });
    } catch (err) { logger.error("[reportCron] global error", err); }
  });
}
