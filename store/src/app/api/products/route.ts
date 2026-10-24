import { Product } from '../../products';
import { pool } from '../../lib/db';

async function createProduct(details: Product){
    console.log(details);
    await pool.query(`
    INSERT INTO products(id, name, price_cents AS "priceCents", description, image)
    values(${details.id}, ${details.name}, ${details.priceCents}, ${details.description}, ${details.image});`)
}
