import { createRedisClient } from "../middlewares/redisUtils";
import { toJSON, fromJSON } from "../middlewares/jsonUtils";

// Define the Product schema class
export class ProductSchema {
    constructor(
        public productId: number,
        public productName: string,
        public quantity: number,
        public category: string | null = 'Electronics',
        public inStock: boolean = true,
        public createdAt: Date | null = new Date(),
        public createdBy: string | null = null,
        public modifiedAt: Date | null = null,
        public modifiedBy: string | null = null
    ) {}

    static fromObject(obj: any): ProductSchema {
        return new ProductSchema(
            obj.productId,
            obj.productName,
            obj.quantity,
            obj.category || 'Electronics',
            obj.inStock || true,
            obj.createdAt || new Date(),
            obj.createdBy,
            obj.modifiedAt,
            obj.modifiedBy
        );
    }

    toObject(): any {
        return {
            productId: this.productId,
            productName: this.productName,
            quantity: this.quantity,
            category: this.category,
            inStock: this.inStock,
            createdAt: this.createdAt,
            createdBy: this.createdBy,
            modifiedBy: this.modifiedBy,
            modifiedAt: this.modifiedAt
        };
    }
}

export const setProduct = async (id: string, product: ProductSchema, env:Record<string,string>): Promise<void> => {
    const redis = await createRedisClient(env);
    const key = `product:${id}`;
    await redis.set(key, toJSON(product.toObject()));  // Store product as JSON string
};

export const getProducts = async (env:Record<string,string>): Promise<ProductSchema[]> => {
    const redis = await createRedisClient(env);
    let productIds = await redis.smembers('product');
    const products: ProductSchema[] = [];
    productIds = productIds.sort()
    for (const productId of productIds) {
      const productData = await redis.get(`product:${productId}`); // Get product by its ID
      
      if (productData) {
        products.push((ProductSchema.fromObject(productData)));
      }
    }
    // const sortedProducts = products.sort((a, b) => a.productId - b.productId);
    return products; // Return the list of products
};

export const createProduct = async (product: ProductSchema, env:Record<string,string>): Promise<void> => {
    const redis = await createRedisClient(env);
    const productId = await redis.incr('productIdCounter');
    const key = `product:${productId}`;
    product.productId = productId;
    await redis.sadd('product', product.productId); 
    await redis.set(key, JSON.stringify(product.toObject())); // Store product as JSON
};

export const getProductById = async (id: string, env:Record<string,string>): Promise<ProductSchema | null> => {
    try 
    {
        const redis = await createRedisClient(env);
        const key = `product:${id}`;    
        const data = await redis.get(key);
        return ProductSchema.fromObject(data);
    }
    catch{
        return null;
    }
}

export const getProductByName = async (productName: string, env:Record<string,string>): Promise<ProductSchema | null> => {
    const redis = await createRedisClient(env);
    const keys = await redis.keys(`product:*`);
    for (const key of keys) {
        const productData = await redis.get(key);

        if (!productData || typeof productData !== 'string') {
            continue;
        }
        if (productData) {
            const parsedProduct = ProductSchema.fromObject(fromJSON(productData));
            if (parsedProduct.productName === productName) {
                return parsedProduct;
            }
        }
    }
    return null;
};

export const deleteProductById = async (id: string, env:Record<string,string>): Promise<void> => {
    const redis = await createRedisClient(env);
    const key = `product:${id}`;
    await redis.del(key);
};

export const updateProductById = async (id: string, updatedValues: Record<string, any>, env:Record<string,string>): Promise<void> => {
    const redis = await createRedisClient(env);
    const product = await getProductById(id, env);
    if (product) {
        const updatedProduct = { ...product.toObject(), ...updatedValues }; 
        await setProduct(id, ProductSchema.fromObject(updatedProduct), env);
    }
};

export const paginateArray = <T>(array: T[], page: number, pageSize: number): T[] => {
    const startIndex = (page - 1) * pageSize;

    return array.slice(startIndex, startIndex + pageSize);
};