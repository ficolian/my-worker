import { fail } from 'assert';
import { BadRequest, DeleteFail, InsertFail, InsertSuccess, Fail, DeleteSuccess, Notfound, UpdateFail, UpdateSuccess } from '../common/appfunc';
import { ProductSchema, deleteProductById, getProductById, getProducts, createProduct, paginateArray, updateProductById } from '../db/product';


interface productRequest {
    id: string | null;
    productName: string;
    quantity: number;
    category: string;
}

export const getAllProducts = async (request: Request, env:Record<string,string>): Promise<Response> => {
    try {
        const products = await getProducts(env);
        const total = products.length;

        const url = new URL(request.url);
        const page = url.searchParams.get('page');
        const pageSize = url.searchParams.get('pageSize');

        const pageValue = page ? Number(page) : 1;
        const pageSizeValue = pageSize ? Number(pageSize) : 10;

        if (total === 0) {
            return new Response(
                JSON.stringify({ message: 'Product data not found', status: 200 }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const paginatedData = paginateArray(products, pageValue, pageSizeValue);

        return new Response(
            JSON.stringify({
                message: 'Product data found',
                status: 200,
                total: total,
                page: pageValue,
                pageSize: pageSizeValue,
                data: paginatedData
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.log(error);
        return fail('Internal Server Error')
    }
};

export const deleteProduct = async (request: Request, env:Record<string,string>): Promise<Response> => {
    try {
        const { id, productName, quantity, category }: productRequest = await request.json();

        if (!id){
            return BadRequest('id is required')
        }

        const product = await getProductById(id, env);
        if (product == null) {
            return DeleteFail("Product")
        }

        await deleteProductById(id, env);

        return DeleteSuccess("Product")
    } catch (error) {
        return BadRequest("Bad Request");
    }
}
export const updateProduct = async (req: Request, env:Record<string,string>): Promise<Response> => {
    try {        
        const { id, productName, quantity, category }: productRequest = await req.json();
       
        if (!id) {
            return BadRequest('The id is required')
        }

        if (!quantity) {
            return BadRequest('The productName is required')
        }

        const product = await getProductById(id, env);

        if (product == null) {
            return Notfound("Product")
        }

        const updatedValues = {
            productName: productName ? productName : product.productName,
            quantity: quantity ? quantity : product.quantity,  // Corrected from product.productName to product.quantity
            category: category ? category : product.category,
            modifiedAt: new Date()
        };
        
        await updateProductById(id, updatedValues, env)
            .then(() => {
                console.log('Product updated successfully');
            })
            .catch((error) => {
                return UpdateFail('Product')
            });

        return UpdateSuccess('Product')
    } catch (error) {
        return new Response('Bad Request: Missing required fields', { status: 400 });
    }
}
export const getProductsById = async (request: Request, id: string, env:Record<string,string>): Promise<Response> => {
    try {
        const product = await getProductById(id, env);
        
        if (!product) {
            return new Response(JSON.stringify({ message: 'Product data not found', status: 404 }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({ message: 'Product data found', status: 200, data: product }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.log(error);
        return new Response('Bad Request', { status: 400 });
    }
};
export const createProducts = async (req: Request, env:Record<string,string>): Promise<Response> => {
    try {
        const {id, productName, quantity, category } : productRequest = await req.json();
        
        if (!productName) {
            return BadRequest('The productName is required')
        }

        if (!quantity) {
            return BadRequest('The quantity is required')
        }

        const product = new ProductSchema(null, productName, quantity, category, true, new Date());
        await createProduct(product, env);
    
        return InsertSuccess('Product')
    } catch (error) {
        console.error(error);
        return InsertFail('Product')
    }
};
