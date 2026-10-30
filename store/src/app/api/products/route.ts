import type { Product } from '../../products';
import { pool } from '../../lib/db';
import { error } from 'console';

// Create New Product Section 
export async function POST(request: Request){
    // transforms the JSON into an equivalent to a product object (except for id)
    const details = await request.json();

    // awaits for createProduct (the function right below)
    const savedProduct = await createProduct(details);

    // returns the new product and status 201 (Success). Oh and savedProduct does have an id
    return Response.json(savedProduct, { status: 201}); 
}

async function createProduct(details: Omit<Product, "id">): Promise<Product>{
    // Sending a query to database pool acts as a connection point between my database's port and this code.
    // Here im inserting into products table
    const result = await pool.query<Product>(`
    INSERT INTO products (name, price_cents, description, image)
    values($1, $2, $3, $4)
    RETURNING
    id, name, price_cents AS "priceCents", description, image`,
    [
        // notice that id is not here. Its because the table product automatically assigns an id which acts as a primary key
        details.name,
        details.priceCents,
        details.description,
        details.image
    ]
    );

    // here I return the first row of my query
    return result.rows[0];
}

// Remove Product Section
// Type with only id and name
type RemovedProduct = Pick<Product, "id" | "name">;

export async function DELETE(request: Request){
    // transforms the JSON from the request into an object with an id
    const id = await request.json();

    //checks if the id is not a safe integer or if its equal to or below 0
    if(!Number.isSafeInteger(id) || id <= 0) {
        // if thats the case then it returns an error status
        return Response.json({error: "Invalid product ID"}, {status: 400});
    }

    // calls the function removeProduct (which actually runs the db query)
    const removed = await removeProduct(id);

    // if remove is undefined then the product was not found and status 404 is returned (not found)
    if(!removed){
        return Response.json({error: "Product Not Found"}, {status: 404});
    }

    //otherwise it was found and sucessfully removed (status 200)
    return Response.json(removed, {status: 200});
}

async function removeProduct(id: number): Promise<RemovedProduct | undefined>{
    // query delets the products from table product with the given id and return the id and name
    const result = await pool.query<RemovedProduct>(`
    DELETE FROM products
    WHERE id = $1
    RETURNING
    id, name`,
    [id]);
    
    //reutrns the result of the first row
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