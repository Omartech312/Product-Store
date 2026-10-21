export type Product = {
    id: number;
    name: string;
    priceCents: number;
    description: string;
    image: string;
}

export const initialProducts: Product[] = [
{id: 1, name: "Yogurt", priceCents: 399, description: "Tasty for kids", image: "/images/yogurt.jpg",},
{id: 2, name: "Maruchan", priceCents: 499, description: "Instant noodle soup", image: "/images/Maruchan.avif",}
];