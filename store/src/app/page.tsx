import Image from "next/image";
import {Card} from "./components"

class products{
  name: string;
  price: number;
  description: string;
  image: string;

  constructor(name: string, price:number, description: string, image: string){
    this.name = name;
    this.price = price;
    this.description = description;
    this.image = image;
  }
}

let prodArray: products[] = [];
prodArray.push(new products("Yogurt", 3.99, "Tasty for Kids", "/images/yogurt.jpg"));
prodArray.push(new products("Maruchan", 4.99, "Tasty", "/images/Maruchan.avif"))

export default function Home() {
  const displayProducts = prodArray.map((prod, index) =>(
    <Card key={index} name={prod.name} price={prod.price} description={prod.description} image={prod.image} ></Card>
  ));
  return (
    <>
      {displayProducts}
    </>
  );
}
