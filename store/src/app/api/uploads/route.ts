export async function POST(request: Request){
    const formData = await request.formData();
    const image = formData.get("image");

    if(!(image instanceof File) || image.size === 0){
        return Response.json(
            {error: "You need an image"},
            {status: 400}
        );
    }

    return Response.json( {name: image.name, size: image.size, type: image.type});
}