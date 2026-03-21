/**
 * Rate limiter - uses Redis when REDIS_URL is set, otherwise in-memory
 * Works across multiple instances when Redis is used
 */

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5; // 5 requests per minute per IP

const memoryStore = new Map<string, { count: number; resetAt: number }>();

async function redisRateLimit(identifier: string): Promise<{ success: boolean; retryAfter?: number }> {
  try {
    const { Redis } = await import("ioredis");
    const redis = new Redis(process.env.REDIS_URL!);
    const key = `ratelimit:${identifier}`;
    const multi = redis.multi();
    multi.incr(key);
    multi.pttl(key);
    const results = await multi.exec();
    await redis.quit();

    const count = results?.[0]?.[1] as number ?? 1;
    const ttl = results?.[1]?.[1] as number ?? -1;

    if (ttl === -1) {
      await (async () => {
        const r = new Redis(process.env.REDIS_URL!);
        await r.pexpire(key, WINDOW_MS);
        await r.quit();
      })();
    }

    if (count > MAX_REQUESTS) {
      const retryAfter = ttl > 0 ? Math.ceil(ttl / 1000) : 60;
      return { success: false, retryAfter };
    }
    return { success: true };
  } catch {
    return memoryRateLimit(identifier);
  }
}

function memoryRateLimit(identifier: string): { success: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = memoryStore.get(identifier);

  if (!record) {
    memoryStore.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return { success: true };
  }

  if (now > record.resetAt) {
    memoryStore.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return { success: true };
  }

  record.count++;
  if (record.count > MAX_REQUESTS) {
    return { success: false, retryAfter: Math.ceil((record.resetAt - now) / 1000) };
  }

  return { success: true };
}

export async function rateLimit(identifier: string): Promise<{ success: boolean; retryAfter?: number }> {
  if (process.env.REDIS_URL) {
    return redisRateLimit(identifier);
  }
  return Promise.resolve(memoryRateLimit(identifier));
}
