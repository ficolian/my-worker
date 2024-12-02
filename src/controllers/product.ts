import { ProductSchema, deleteProductById, getProductById, getProducts, createProduct, paginateArray, updateProductById } from '../db/product';


interface productRequest {
    id: string | null;
    productName: string;
    quantity: number;
    category: string;
}

export const getAllProducts = async (request: Request): Promise<Response> => {
    try {
        const products = await getProducts();
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
        return new Response(
            JSON.stringify({ message: 'Internal Server Error', status: 400 }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }
};

export const deleteProduct = async (request: Request): Promise<Response> => {
    try {
        const { id, productName, quantity, category }: productRequest = await request.json();

        if (!id){
            return new Response(JSON.stringify({ message: 'id is required', status: 400 }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const product = await getProductById(id);
        if (product == null) {
            return new Response(JSON.stringify({ message: 'Product data not found', status: 400 }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const deletedProduct = await deleteProductById(id);

        return new Response(JSON.stringify({ message: 'Product successfully deleted', status: 200 }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response('Bad Request: Missing required fields', { status: 400 });
    }
}
export const updateProduct = async (req: Request): Promise<Response> => {
    try {        
        const { id, productName, quantity, category }: productRequest = await req.json();
       
        if (!id) {
            return new Response(JSON.stringify({ message: 'The id is required', status: 400 }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (!quantity) {
            return new Response(JSON.stringify({ message: 'The productName is required', status: 400 }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const product = await getProductById(id);

        if (product == null) {
            return new Response(JSON.stringify({ message: 'Product data not found', status: 400 }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const updatedValues = {
            productName: productName ? productName : product.productName,
            quantity: quantity ? quantity : product.quantity,  // Corrected from product.productName to product.quantity
            category: category ? category : product.category,
            modifiedAt: new Date()
        };
        
        await updateProductById(id, updatedValues)
            .then(() => {
                console.log('Product updated successfully');
            })
            .catch((error) => {
                console.error('Error updating product:', error);
                return new Response('Internal Server Error: Error updating product', { status: 500 });
            });

        return new Response(JSON.stringify({ message: 'Product successfully updated', status: 200 }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response('Bad Request: Missing required fields', { status: 400 });
    }
}
export const getProductsById = async (request: Request, id: string): Promise<Response> => {
    try {
        const product = await getProductById(id);
        
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
export const createProducts = async (req: Request): Promise<Response> => {
    try {
        const {id, productName, quantity, category } : productRequest = await req.json();
        
        if (!productName) {
            return new Response(JSON.stringify({ message: 'The productName is required', status: 400 }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (!quantity) {
            return new Response(JSON.stringify({ message: 'The quantity is required', status: 400 }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const product = new ProductSchema(null, productName, quantity, category, true, new Date());
        await createProduct(product);
        
        return new Response(JSON.stringify({ message: 'Product successfully saved', status: 200 }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: 'Product failed to save', status: 500 }), { status: 500 });
    }
};
