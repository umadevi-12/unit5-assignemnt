import cron from "node-cron";
import { redis } from "../services/redisService.js";
import logger from "../utils/logger.js";
import { v4 as uuidv4 } from "uuid";


export async function enqueueBulkRequest(userId, email, books) {
  const requestId = `req-${Date.now()}`;
  const statusObj = {
    userId,
    requestId,
    timestamp: new Date().toISOString(),
    successCount: 0,
    failureCount: 0,
    failures: [],
    email,
    books,
  };
  await redis.set(`bulk:status:${userId}:${requestId}`, JSON.stringify(statusObj));
  return requestId;
}


export function startBulkProcessorCron() {
  cron.schedule("*/1 * * * *", async () => {
    logger.info("[bulkCron] run " + new Date().toISOString());
    let cursor = 0;
    do {
      const reply = await redis.scan(cursor, { MATCH: "bulk:status:*", COUNT: 50 });
      cursor = Number(reply.cursor);
      for (const key of reply.keys) {
        const raw = await redis.get(key);
        if (!raw) continue;
        const status = JSON.parse(raw);
        status.successCount = status.books.length;
        await redis.set(key, JSON.stringify(status));
      }
    } while (cursor !== 0);
  });
}
