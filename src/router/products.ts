import { getAllProducts, getProductsById, deleteProduct, updateProduct, createProducts } from '../controllers/product';
import { verifyToken } from '../middlewares/jwtUtils';

export default async (request: Request): Promise<Response> => {
    const url = new URL(request.url);

    // Example of token verification
    const tokenVerified = await verifyToken(request);
    if (!tokenVerified) {
      return new Response('Unauthorized', { status: 401 });
    }

    if (url.pathname.match(/^\/products\/\d+$/)) 
    {        
        const id = url.pathname.split('/')[2];  // Extract product ID from the URL path
        if (request.method === 'GET') {
          return await getProductsById(request, id);
        } 
    }

    else if (url.pathname == '/products') {
        if (request.method === 'GET') {
            return await getAllProducts(request);
          } 
          else if (request.method === 'POST') {
            return await createProducts(request);
          }
          else if (request.method === 'DELETE') {
            return await deleteProduct(request);
          } 
          else if (request.method === 'PUT') {
            return await updateProduct(request);
          } 
          else {
            return new Response('Method Not Allowed', { status: 405 });
          }
    }
    
    else {
        return new Response('Not Found', { status: 404 });
    }
    
    return new Response('Method Not Allowed', { status: 405 });
  
};