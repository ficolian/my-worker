import { Redis } from '@upstash/redis/cloudflare';

export async function createRedisClient(env: Record<string, string>): Promise<Redis> {
  const redisUrl = env.UPSTASH_REDIS_REST_URL;  // Access Redis URL from environment variables
  const redisToken = env.UPSTASH_REDIS_REST_TOKEN;  // Access Redis token from environment variables

  return new Redis({
    url: redisUrl,
    token: redisToken,
  });
}