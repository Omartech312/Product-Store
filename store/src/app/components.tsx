"use client";
import styles from "./styles.module.css"
import {Product, initialProducts} from "./products"
import { useState, useRef } from 'react';


export function Card(prop: Product){
    const [counter, setCounter] = useState(0);
    //console.log("CSS Module:", styles);
    //console.log("cardBack:", styles.cardBack);

    function decrement(){
        if(counter > 0){
            setCounter(preCounter => preCounter - 1);
            console.log(`Decrement: ${counter}`);
        }
    }

    function increment(){
        setCounter(prevCounter => prevCounter + 1);
        console.log(`Increment: ${counter}`)
    }
    
    function modify(newVal: HTMLInputElement){
        if(Number(newVal.value) >= 0){
            setCounter(Number(newVal.value));
            console.log(`Change: ${counter}`);
        }
    }

    return(
        <div className={styles.cardBack}>
            <img className={styles.cardImage} src={prop.image}></img>
            <p className={styles.prodHeader}>{prop.name}</p>
            <div>
                <p>{prop.description}</p>
            </div>
            <p>${prop.priceCents / 100}</p>
            <div>
                <button onClick={decrement} className="">-</button>
                <input value={counter} onChange={(event) => modify(event.currentTarget)} className={`${styles.cardInput}`} placeholder="0"></input>
                <button onClick={increment}>+</button>
            </div>
            <button >Add to Card</button>
        </div>
    );
}

export function NewProductsArea(){
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const nextid = useRef(2);

    return(
        <div className={styles.newProdInputs}>
            <input type="text" placeholder="name"></input><br></br>
            <input type="number" placeholder="price"></input><br></br>
            <input type="description" placeholder="description"></input><br></br>
            <input type="file" accept="image/*"></input><br></br>
        </div>
    )
}

export function ProductManagement(){
    const [products, setProducts] = useState<Product[]>(initialProducts);
    console.log(products);    
    const displayProducts = products.map((prod) =>(
    <Card id={prod.id} key={prod.id} name={prod.name} priceCents={prod.priceCents} description={prod.description} image={prod.image} ></Card>
    ));

    return(
        <>
        <h2 className={styles.prodSecHead}>Add New Products:</h2>
        <NewProductsArea />
        <h2 className={styles.prodSecHead}>Products:</h2>
        <div className={styles.productDiv}>
        {displayProducts}
        </div>
        </>
    );
}