import { Product } from '../../products';
import { pool } from '../../lib/db';

export async function POST(request: Request){
    const details = await request.json();

    const savedProduct = await createProduct(details);
    //console.log(details);
    return Response.json(savedProduct, { status: 201}); 
}

async function createProduct(details: Omit<Product, "id">): Promise<Product>{
    //console.log(details);
    const result = await pool.query<Product>(`
    INSERT INTO products (name, price_cents AS "priceCents", description, image)
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
