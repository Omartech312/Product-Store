import Image from "next/image";
import {Card} from "./components"
import {products} from "./products"
import styles from "./styles.module.css"


export default function Home() {
  const displayProducts = products.map((prod, index) =>(
    <Card id={prod.id} key={index} name={prod.name} priceCents={prod.priceCents} description={prod.description} image={prod.image} ></Card>
  ));
  return (
    <>
    <h2>Products:</h2>
    <div className={styles.productDiv}>
      {displayProducts}
    </div>
    </>
  );
}
