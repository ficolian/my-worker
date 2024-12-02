import authentication from './router/authentication';
import products from './router/products';


export default {
  async fetch(request: Request): Promise<Response> {
    
    if (request.url.includes('/login')) {
      const response = await authentication(request);
      return response;
    }

    if (request.url.includes('/register')) {
      const response = await authentication(request);
      return response;
    }
    
    if (request.url.includes('/logout')) {
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
