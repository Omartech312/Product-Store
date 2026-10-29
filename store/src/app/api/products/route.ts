import type { Product } from '../../products';
import { pool } from '../../lib/db';
import { error } from 'console';

export async function POST(request: Request){
    const details = await request.json();

    const savedProduct = await createProduct(details);
    //console.log(details);
    return Response.json(savedProduct, { status: 201}); 
}

async function createProduct(details: Omit<Product, "id">): Promise<Product>{
    //console.log(details);
    const result = await pool.query<Product>(`
    INSERT INTO products (name, price_cents, description, image)
    values($1, $2, $3, $4)
    RETURNING
    id, name, price_cents AS "priceCents", description, image`,
    [
        details.name,
        details.priceCents,
        details.description,
        details.image
    ]
    );

    return result.rows[0];
}

type RemovedProduct = Pick<Product, "id" | "name">;

export async function DELETE(request: Request){
    const id = await request.json();

    if (!Number.isSafeInteger(id) || id <= 0) {
        return Response.json({error: "Invalid product ID"}, {status: 400});
    }

    const removed = await removeProduct(id);

    if(!removed){
        return Response.json({error: "Product Not Found"}, {status: 404});
    }
    return Response.json(removed, {status: 200});
}

async function removeProduct(id: number): Promise<RemovedProduct | undefined>{
    const result = await pool.query<RemovedProduct>(`
    DELETE FROM products
    WHERE id = $1
    RETURNING
    id, name`,
    [id]);
    
    return result.rows[0];
}

export async function PATCH(request: Request){
    const product = await request.json();

    if(!product || !Number.isSafeInteger(product.id) ||
        !product.name.trim() ||
        !product.description.trim() || product.priceCents < 0){
            return Response.json({ error: "Invalid product values"}, { status: 400});
    }

    try{
        const result = await pool.query<Product>(`
            Update products SET name = $1, price_cents = $2, description = $3 WHERE id = $4
            RETURNING
            id,
            name,
            price_cents AS "priceCents",
            description,
            image`,
        [   
            product.name.trim(),
            product.priceCents,
            product.description.trim(),
            product.id
        ]);

        if(!result.rows[0]){
            return Response.json({error: "Prod not found"}, {status: 404});
        }
        return Response.json(result.rows[0]);
    }
    catch(error){
        console.log(error);

        return Response.json({error: "Failed to update product"}, {status:500});
    }
}