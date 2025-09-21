import express from "express";
import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import { connectRedis, getStatusFromRedis } from "./services/redisService.js";
import { enqueueBulkRequest, startBulkProcessorCron } from "./cron/bulkCron.js";
import { startReportCron } from "./cron/reportCron.js";
import { generateReportPDF } from "./services/pdfGenerator.js";
import logger from "./utils/logger.js";

const app = express();
app.use(bodyParser.json());

app.post("/bulk-submit", async (req, res) => {
  try {
    const { userId, email, books } = req.body;
    if (!userId || !email || !Array.isArray(books)) {
      return res.status(400).json({ error: "userId, email and books[] required" });
    }
    const requestId = await enqueueBulkRequest(userId, email, books);
    return res.json({ message: "Enqueued", requestId });
  } catch (err) {
    logger.error("Bulk submit error", err);
    return res.status(500).json({ error: "Internal error" });
  }
});


app.get("/bulk-report/:requestId", async (req, res) => {
  try {
    const { requestId } = req.params;
    const statusObj = await getStatusFromRedis(requestId);
    if (!statusObj) return res.status(404).json({ error: "Report not found" });

    const outPath = `./tmp/report-${requestId}.pdf`;
    await generateReportPDF(statusObj, outPath);
    return res.download(outPath);
  } catch (err) {
    logger.error("Report download error", err);
    return res.status(500).json({ error: "Internal error" });
  }
});

const PORT = process.env.PORT || 3000;

async function start() {
  await connectRedis();
  app.listen(PORT, () => logger.info(`Server listening on ${PORT}`));
  startBulkProcessorCron();
  startReportCron();
}

start().catch((err) => logger.error("Failed to start", err));
