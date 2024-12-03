import * as AppConst from './appconst';
export const corsHeaders = {
    "Access-Control-Allow-Origin": "*",  // Allows all origins, replace with specific origin if needed
    "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",  // Allowed HTTP methods
    "Access-Control-Allow-Headers": "Content-Type",  // Allowed headers
    'Content-Type': "application/json",
};
export function Success(message: string, data: any): Response {
    message = message;

    return new Response(JSON.stringify({ 
        message: message, 
        status: AppConst.REQUEST_SUCCESS,
        data: data
     }), 
     {
        status: AppConst.HTTP_SUCCESS,
        headers: corsHeaders,
     });
}

export function Fail(message: string): Response {
    message = message;

    return new Response(JSON.stringify({ message: message, status: AppConst.REQUEST_FAIL }), {
        status: AppConst.HTTP_SUCCESS,
        headers: corsHeaders,
    });
}


export function InsertSuccess(message: string): Response {
    message = `${message} successfully save`;

    return new Response(JSON.stringify({ message: message, status: AppConst.HTTP_SUCCESS }), {
        status: AppConst.HTTP_SUCCESS,
        headers: corsHeaders,
    });
}

export function InsertFail(message: string): Response {
    message = `${message} fail to save`;

    return new Response(JSON.stringify({ message: message, status: AppConst.REQUEST_FAIL }), {
        status: AppConst.HTTP_SUCCESS,
        headers: corsHeaders,
    });
}

export function DeleteSuccess(message: string): Response {
    message = `${message} successfully delete`;

    return new Response(JSON.stringify({ message: message, status: AppConst.REQUEST_SUCCESS }), {
        status: AppConst.HTTP_SUCCESS,
        headers: corsHeaders,
    });
}

export function DeleteFail(message: string): Response {
    message = `${message} fail to delete`;

    return new Response(JSON.stringify({ message: message, status: AppConst.REQUEST_FAIL }), {
        status: AppConst.HTTP_SUCCESS,
        headers: corsHeaders,
    });
}

export function UpdateSuccess(message: string): Response {
    message = `${message} successfully update`;

    return new Response(JSON.stringify({ message: message, status: AppConst.REQUEST_SUCCESS }), {
        status: AppConst.HTTP_SUCCESS,
        headers: corsHeaders,
    });
}

export function UpdateFail(message: string): Response {
    message = `${message} fail to update`;

    return new Response(JSON.stringify({ message: message, status: AppConst.REQUEST_FAIL }), {
        status: AppConst.HTTP_SUCCESS,
        headers: corsHeaders,
    });
}

export function Found(message: string, data: any): Response {
    message = `Data ${message} found`;

    return new Response(JSON.stringify({ message: message, 
                        data: data,
                        status: AppConst.REQUEST_SUCCESS }), {
        status: AppConst.HTTP_SUCCESS,
        headers: corsHeaders,
    });
}

export function Notfound(message: string): Response {
    message = `Data ${message} not found`;

    return new Response(JSON.stringify({ message: message, status: AppConst.REQUEST_FAIL }), {
        status: AppConst.HTTP_SUCCESS,
        headers: corsHeaders,
    });
}


export function BadRequest(message: string): Response {
    message = message;

    return new Response(JSON.stringify({ message: message, status: AppConst.REQUEST_FAIL }), {
        status: AppConst.HTTP_BAD_REQUEST,
        headers: corsHeaders,
    });
}