import { register, login, logout } from '../controllers/authentication';

export default async (request: Request): Promise<Response> => {
    const url = new URL(request.url);

    if (url.pathname === '/auth/register' && request.method === 'POST') {
        return await register(request);
    }
    if (url.pathname === '/auth/login' && request.method === 'POST') {
        return await login(request);
    }
    if (url.pathname === '/auth/logout' && request.method === 'POST') {
        return await logout(request);
    }

    return new Response('Not Found', { status: 404 });
};
