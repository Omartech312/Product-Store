import Image from "next/image";
import { ProductManagement, Header } from "./components"
import { pool } from "./lib/db";


export default async function Home() {
  const result = await pool.query(`
  SELECT id, name, price_cents AS "priceCents", description, image
  FROM products
  ORDER BY id `);
  console.log(result.rows);

  //console.log("Connected to:", result.rows[0].database_name);

  return <ProductManagement products={result.rows}/>;
}