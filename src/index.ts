import authentication from './router/authentication';
import products from './router/products';

interface Env {
  REDIS_CONFIG: KVNamespace;
  // ... other binding types
}

export default {
  async fetch(request: Request,  event: ExecutionContext, env: Env): Promise<Response> {
    // Correct usage with async/await
    console.log(process.env.REDIS_CONFIG)

    // let value = await env.REDIS_CONFIG.get("URL");

    const url = new URL(request.url);
    const path = url.pathname;

    if (request.url.includes('/login')) {
      const response = await authentication(request);
      return response;
    }

    if (request.url.includes('/register')) {
      const response = await authentication(request);
      return response;
    }

    if (request.url.includes('/products')) {
      const response = await products(request);
      return response;
    }

    return new Response('Not Found', { status: 404 });
  }
};
