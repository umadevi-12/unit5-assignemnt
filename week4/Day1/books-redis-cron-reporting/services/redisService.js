import { createClient } from "redis";
import logger from "../utils/logger.js";

export const redis = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
});

redis.on("error", (err) => logger.error("Redis Client Error", err));
redis.on("connect", () => logger.info("Redis connected"));

export async function connectRedis() {
  if (!redis.isOpen) await redis.connect();
}


export async function saveStatus(statusObj) {
  await redis.set(`bulk:status:${statusObj.userId}:${statusObj.requestId}`, JSON.stringify(statusObj));
}


export async function getStatusFromRedis(requestId) {
  let cursor = 0;
  do {
    const reply = await redis.scan(cursor, { MATCH: "bulk:status:*", COUNT: 50 });
    cursor = Number(reply.cursor);
    for (const key of reply.keys) {
      const raw = await redis.get(key);
      if (!raw) continue;
      try {
        const status = JSON.parse(raw);
        if (status.requestId === requestId) return status;
      } catch (err) {
        logger.error(`Failed to parse Redis value for key ${key}`, err);
      }
    }
  } while (cursor !== 0);
  return null;
}

export default { redis, connectRedis, saveStatus, getStatusFromRedis };
