import Image from "next/image";
import {Card} from "./components"
import {products} from "./products"


export default function Home() {
  const displayProducts = products.map((prod, index) =>(
    <Card id={prod.id} key={index} name={prod.name} priceCents={prod.priceCents} description={prod.description} image={prod.image} ></Card>
  ));
  return (
    <>
      {displayProducts}
    </>
  );
}
