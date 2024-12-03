import { getAllProducts, getProductsById, deleteProduct, updateProduct, createProducts } from '../controllers/product';
import { verifyToken } from '../middlewares/jwtUtils';

const corsHeaders = {
  'Access-Control-Allow-Headers': '*', // What headers are allowed. * is wildcard. Instead of using '*', you can specify a list of specific headers that are allowed, such as: Access-Control-Allow-Headers: X-Requested-With, Content-Type, Accept, Authorization.
  'Access-Control-Allow-Methods': 'POST, OPTIONS, PUT, DELETE', // Allowed methods. Others could be GET, PUT, DELETE etc.
  'Access-Control-Allow-Origin': '*', // This is URLs that are allowed to access the server. * is the wildcard character meaning any URL can.
}

export default async (request: Request, env:Record<string,string>): Promise<Response> => {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response("OK", {
        headers: corsHeaders
      });
    }

    const tokenVerified = await verifyToken(request, env);
    if (!tokenVerified) {
      return new Response('Unauthorized', { status: 401 });
    }

    if (url.pathname.match(/^\/products\/\d+$/) && request.method === 'GET') 
    {        
        const id = url.pathname.split('/')[2];  // Extract product ID from the URL path
        return await getProductsById(request, id, env); 
    }

    else if (url.pathname == '/products') {
      if (request.method === 'GET') {
        return await getAllProducts(request, env);
      } 
      else if (request.method === 'POST') {
        return await createProducts(request, env);
      }
      else if (request.method === 'DELETE') {
        return await deleteProduct(request , env);
      } 
      else if (request.method === 'PUT') {
        return await updateProduct(request , env);
      } 
      else {
        return new Response('Method Not Allowed', { status: 405 });
      }
    }
    
    else {
        return new Response('Not Found', { status: 404 });
    }
      
};