import { Redis } from '@upstash/redis/cloudflare';
import { KVNamespace } from '@cloudflare/workers-types'
import { values } from 'lodash';

interface Env {
  REDIS_CONFIG: KVNamespace;
}
export const redisurl = async (env: Env) : Promise<any> =>  {
    try {
      // Set a value in the KV store
      await env.REDIS_CONFIG.put("url", "fif");

      // Get the value from the KV store
      const value = await env.REDIS_CONFIG.get("url");

      // Check if the value is null or undefined
      if (value === null) {
        return new Response("Key not found!", { status: 404 });
      }

      console.log(value)
      return value;
    } catch (error) {
      return null;
    }
  }

export const redis = new Redis({
  url: 'https://thankful-mako-22301.upstash.io',
  token: 'AVcdAAIjcDE2NGE4ODg1OGQ5MzI0NDg1YmQwYTU3OGRjNDZhOTVhMnAxMA',
});