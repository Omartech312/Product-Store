import {pool} from "../../../../lib/db";

type ProductImage = {
    image_data: Buffer | null;
    image_mime_type: string | null;
}

export async function GET(request: Request, {params}: {params: Promise<{id:string}>}){
    const {id} = await params;
    const productId = Number(id);

    if(!Number.isSafeInteger(productId) || productId <= 0){
        return Response.json({error: "Invalid id"}, {status: 400});
    }

    try{
        const result = await pool.query<ProductImage>(
            `SELECT image_data. image_mime_type
            FROM public.products
            WHERE id = $1`,
            [productId]);

        const image = result.rows[0];

        if(!image?.image_data || !image?.image_mime_type){
            return Response.json({error: "Image not found"}, {status: 404});
        }

    }
}