import { register, login, logout } from '../controllers/authentication';


const corsHeaders = {
    'Access-Control-Allow-Headers': '*', // What headers are allowed. * is wildcard. Instead of using '*', you can specify a list of specific headers that are allowed, such as: Access-Control-Allow-Headers: X-Requested-With, Content-Type, Accept, Authorization.
    'Access-Control-Allow-Methods': 'POST, OPTIONS', // Allowed methods. Others could be GET, PUT, DELETE etc.
    'Access-Control-Allow-Origin': '*', // This is URLs that are allowed to access the server. * is the wildcard character meaning any URL can.
  }

export default async (request: Request, env:Record<string,string>): Promise<Response> => {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
        
        return new Response("OK", {
          headers: corsHeaders
        });
    }

    if (url.pathname === '/auth/register' && (request.method === 'OPTIONS' || request.method === 'POST')) {
        return await register(request, env);
    }
    if (url.pathname === '/auth/login' && request.method === 'POST') {
        return await login(request, env);
    }
    if (url.pathname === '/auth/logout' && request.method === 'OPTIONS') {
        return await logout(request, env);
    }

    return new Response('Not Found', { status: 404 });
};
