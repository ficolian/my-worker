import * as AppConst from './appconst';

export function Success(message: string, data: any): Response {
    message = message;

    return new Response(JSON.stringify({ 
        message: message, 
        status: AppConst.HTTP_SUCCESS,
        data: data
     }), 
     {
        status: AppConst.HTTP_SUCCESS,
        headers: { 'Content-Type': 'application/json' },
     });
}

export function Fail(message: string): Response {
    message = message;

    return new Response(JSON.stringify({ message: message, status: AppConst.HTTP_FAIL }), {
        status: AppConst.HTTP_FAIL,
        headers: { 'Content-Type': 'application/json' },
    });
}


export function InsertSuccess(message: string): Response {
    message = `${message} successfully save`;

    return new Response(JSON.stringify({ message: message, status: AppConst.HTTP_SUCCESS }), {
        status: AppConst.HTTP_SUCCESS,
        headers: { 'Content-Type': 'application/json' },
    });
}

export function InsertFail(message: string): Response {
    message = `${message} fail to save`;

    return new Response(JSON.stringify({ message: message, status: AppConst.HTTP_FAIL }), {
        status: AppConst.HTTP_FAIL,
        headers: { 'Content-Type': 'application/json' },
    });
}


export function DeleteSuccess(message: string): Response {
    message = `${message} successfully delete`;

    return new Response(JSON.stringify({ message: message, status: AppConst.HTTP_SUCCESS }), {
        status: AppConst.HTTP_SUCCESS,
        headers: { 'Content-Type': 'application/json' },
    });
}

export function DeleteFail(message: string): Response {
    message = `${message} fail to delete`;

    return new Response(JSON.stringify({ message: message, status: AppConst.HTTP_FAIL }), {
        status: AppConst.HTTP_FAIL,
        headers: { 'Content-Type': 'application/json' },
    });
}

export function UpdateSuccess(message: string): Response {
    message = `${message} successfully update`;

    return new Response(JSON.stringify({ message: message, status: AppConst.HTTP_SUCCESS }), {
        status: AppConst.HTTP_SUCCESS,
        headers: { 'Content-Type': 'application/json' },
    });
}

export function UpdateFail(message: string): Response {
    message = `${message} fail to update`;

    return new Response(JSON.stringify({ message: message, status: AppConst.HTTP_FAIL }), {
        status: AppConst.HTTP_FAIL,
        headers: { 'Content-Type': 'application/json' },
    });
}

export function Found(message: string, data: any): Response {
    message = `Data ${message} found`;

    return new Response(JSON.stringify({ message: message, 
                        data: data,
                        status: AppConst.HTTP_SUCCESS }), {
        status: AppConst.HTTP_SUCCESS,
        headers: { 'Content-Type': 'application/json' },
    });
}

export function Notfound(message: string): Response {
    message = `Data ${message} not found`;

    return new Response(JSON.stringify({ message: message, status: AppConst.HTTP_FAIL }), {
        status: AppConst.HTTP_FAIL,
        headers: { 'Content-Type': 'application/json' },
    });
}


export function BadRequest(message: string): Response {
    message = message;

    return new Response(JSON.stringify({ message: message, status: AppConst.HTTP_BAD_REQUEST }), {
        status: AppConst.HTTP_BAD_REQUEST,
        headers: { 'Content-Type': 'application/json' },
    });
}