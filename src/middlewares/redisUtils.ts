import { Redis } from '@upstash/redis/cloudflare';

export const redis = new Redis({
  url: 'https://thankful-mako-22301.upstash.io',
  token: 'AVcdAAIjcDE2NGE4ODg1OGQ5MzI0NDg1YmQwYTU3OGRjNDZhOTVhMnAxMA',
});


console.log(process.env.UPSTASH_REDIS_REST_URL)