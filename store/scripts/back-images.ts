import pg from "pg";
import {readFile} from "node:fs/promises";

// creating a new pool connection to DB
const pool = new pg.Pool();

async function main(){
    try{
        const image = await readFile(new URL("../public/images/yogurt.jpg", import.meta.url));

        const result = await pool.query(`UPDATE public.products
            SET image_data = $1, image_mime_type = $2
            WHERE id = $3 AND image_data is NULL
            RETURNING id, name,
            octet_length(image_data) AS image_bytes`,
            [image, "image/jpeg", 1]);

        console.table(result.rows);
    }
    finally{
        await pool.end();
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})