import { entries } from 'lodash';
import authentication from './router/authentication';
import products from './router/products';

// type EnvType = {
//   API_VERSION: string;
// };

export default {
  async fetch(request: Request): Promise<Response> {
    
    // console.log(env.API_VERSION)
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
