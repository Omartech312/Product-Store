import type { Product } from '../../products';
import { pool } from '../../lib/db';
import { error } from 'console';
//import { error } from 'console';

// Create New Product Section 
export async function POST(request: Request){
    const formData = await request.formData();

    //extracting data from the form
    const name = formData.get("name");
    const price = formData.get("priceCents");
    const description = formData.get("description");
    const image = formData.get("image");

    if(typeof name !== "string" || !name.trim() ||
    typeof description !== "string" || !description.trim() ||
    typeof price !== "string" || !price.trim() ||
    !(image instanceof File) || image.size === 0){
        return Response.json({error: "Invalid inputs"}, {status: 400});
    }

    // Checking for invalid numbers after as directly using Number(price) on a NULL might be registered as 0 
    const priceCents = Number(price);

    if(!Number.isSafeInteger(priceCents) || priceCents < 0){
        return Response.json({error: "invalid price"}, {status: 400});
    }

    const imageData = Buffer.from(await image.arrayBuffer());

    // awaits for createProduct (the function right below)
    const savedProduct = await createProduct({name: name.trim(), priceCents: priceCents, description: description.trim(), imageData, imageMimeType: image.type});

    // returns the new product and status 201 (Success). Oh and savedProduct does have an id
    return Response.json(savedProduct, { status: 201}); 
}

type NewProductData = {
    name: string;
    priceCents: number;
    description: string;
    imageData: Buffer;
    imageMimeType: string;
};

async function createProduct(details: NewProductData): Promise<Product>{
    // Sending a query to database pool acts as a connection point between my database's port and this code.
    // Here im inserting into products table
    const result = await pool.query<Product>(`
    INSERT INTO products (name, price_cents, description, image_data, image_mime_type)
    values($1, $2, $3, $4, $5)
    RETURNING
    id, name, price_cents AS "priceCents", description, '/api/products/' || id || '/image' AS image`,
    [
        // notice that id is not here. Its because the table product automatically assigns an id which acts as a primary key
        details.name,
        details.priceCents,
        details.description,
        details.imageData,
        details.imageMimeType
    ]);

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

export async function PUT(request: Request){
    const formData = await request.formData();

    //extracting data from the form
    const idValue = formData.get("id");
    const name = formData.get("name");
    const priceValue = formData.get("priceCents");
    const description = formData.get("description");
    const image = formData.get("image");

    if(!idValue || typeof idValue !== "string" ||
        !name || name !== "string" || !name.trim() ||
        !description || typeof description !== "string" || !description.trim() ||
        !priceValue || typeof priceValue !== "string" || !priceValue.trim()){
        return Response.json({ error: "Invalid Inputs"}, {status: 400});
    }

    const id = Number(idValue);
    const price = Number(priceValue);
    
    if(!Number.isSafeInteger(id) || id <= 0 ||
    !Number.isSafeInteger(price) || price <= 0){
        return Response.json({error: "Invalid Id or Price"}, {status:400});
    }

    try{
        const result = await updateProduct({id, name, price, description, image});

        if(!result){
            return Response.json({error: "Product not found"}, {status: 404});
        }
        return Response.json(result);
    }
    catch(error){
        console.error(error);
        return Response.json({error: "Failed to update product"}, {status: 500});
    }
}

async function updateProduct(information: Product): Promise<Product | undefined>{
    const result = await pool.query<Product>(`
            Update products SET name = $1, price_cents = $2, description = $3, image = $4 WHERE id = $5
            RETURNING
            id,
            name,
            price_cents AS "priceCents",
            description,
            image`,
        [   
            information.name.trim(),
            information.priceCents,
            information.description.trim(),
            information.image,
            information.id
        ]);

    return result.rows[0];
}