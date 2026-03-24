import { Redis } from '@upstash/redis/cloudflare';

// export const redis = new Redis({
//   url: 'https://thankful-mako-22301.upstash.io',
//   token: 'AVcdAAIjcDE2NGE4ODg1OGQ5MzI0NDg1YmQwYTU3OGRjNDZhOTVhMnAxMA',
// });


// export async function createRedisClient(env: Record<string, string>): Promise<Redis> {
//   const redisUrl = 'https://thankful-mako-22301.upstash.io';  // Access Redis URL from environment variables
//   const redisToken = 'AVcdAAIjcDE2NGE4ODg1OGQ5MzI0NDg1YmQwYTU3OGRjNDZhOTVhMnAxMA';  // Access Redis token from environment variables
  
//   return new Redis({
//     url: redisUrl,
//     token: redisToken,
//   });
// }

export async function createRedisClient(env: Record<string, string>): Promise<Redis> {
  const redisUrl = "https://inspired-unicorn-83299.upstash.io";  // Access Redis URL from environment variables
  const redisToken = 'gQAAAAAAAUVjAAIncDI1NzhhYWYyMDc0YjY0OGRlOGFjMGM4NmNjYjYzOWQ5YXAyODMyOTk';  // Access Redis token from environment variables
  return new Redis({
    url: redisUrl,
    token: redisToken,
  });
}

