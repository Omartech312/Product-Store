"use client";
import styles from "./styles.module.css"
import {Product, initialProducts} from "./products"
import { useState, useRef } from 'react';

type NewProductDetails = Omit<Product, "id">;

type NewProductsProps = {
    onAddProduct: (details: NewProductDetails) => void;
};

type CardProps = Product & {
    onRemoveProduct: (id: number) => void;
};


type SwapindowProp = {
    state: boolean;
    onSwapWindow: () => void;
}

export function Card(prop: CardProps){
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
            <button
                type="button" className={styles.cardRemoveButton}
                onClick={() => prop.onRemoveProduct(prop.id)}
                aria-label={`Remove ${prop.name}`}
            >X</button>
            <img className={styles.cardImage} src={prop.image}></img>
            <p className={styles.prodHeader}>{prop.name}</p>
            <div>
                <p>{prop.description}</p>
            </div>
            <p>${prop.priceCents / 100}</p>
            <div className={styles.cardButton}>
                <button onClick={decrement} className={styles.cardButtonsMinus}> - </button>
                <input value={counter} onChange={(event) => modify(event.currentTarget)} className={`${styles.cardInput}`} placeholder="0"></input>
                <button onClick={increment} className={styles.cardButtonsPlus}> + </button>
            </div>
            <button >Add to Card</button>
        </div>
    );
}

export function NewProductsArea({onAddProduct}: NewProductsProps){
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");

    return(
        <div className={styles.newProdInputsArea} >
            <form
            onSubmit={ (event) => {
                event.preventDefault();

                if(!name.trim() || !description.trim() || !image.trim() ||
                    !Number.isFinite(price) || price < 0 ){
                    return;
                }

                onAddProduct({
                    name:name.trim(),
                    priceCents: Math.round(price * 100),
                    description: description.trim(),
                    image: image.trim(),
                });
            }}>
            <input value={name} className={styles.newProdInputs} type="text" placeholder="name" onChange={(event) => setName(event.currentTarget.value)}></input><br></br>
            <input value={price} className={styles.newProdInputs} type="number" placeholder="price" onChange={(event) => setPrice(Number(event.currentTarget.value))}></input><br></br>
            <input value={description} className={styles.newProdInputs} type="description" placeholder="description" onChange={(event) => setDescription(event.currentTarget.value)}></input><br></br>
            <input value={image} className={styles.newProdInputs} type="file" accept="image/*" onChange={(event) => setImage(event.currentTarget.value)}></input><br></br>
            <button className={`${styles.newProdButton}`} type="submit">Submit</button>
            </form>
        </div>
    )
}

export function ProductManagement(){
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [check, setCheck] = useState(false);
    
    const displayProducts = products.map((prod) =>(
    <Card id={prod.id} key={prod.id} name={prod.name} priceCents={prod.priceCents} description={prod.description} image={prod.image} onRemoveProduct={removeProduct} ></Card>
    ));

    const nextId = useRef(Math.max(0, ...initialProducts.map((product) => product.id)) + 1);

    function addProduct(details: NewProductDetails){
        const product: Product = { ...details, id: nextId.current++, };
        setProducts((previous) => [...previous, product]);
    }

    function removeProduct(id: number){
        setProducts(prevProducts => prevProducts.filter((cur) => cur.id != id))
    }

    function swapWindow(){
        console.log(check);
        setCheck(prevCheck => !prevCheck);
    }

    return(
        <>
            <Header onSwapWindow={swapWindow} state={check}></Header>
            {check ? 
            <div>
            <h2 className={styles.prodSecHead}>Add New Products:</h2>
            <NewProductsArea onAddProduct={addProduct}/>
            </div> : <div>
            <h2 className={styles.prodSecHead}>Products:</h2>
                <div className={styles.productDiv}>
                    {displayProducts}
                </div>
            </div>}
        </>
    );
}

export function Header(prop: SwapindowProp){
    return(
        <div className={styles.pageHeader}>
            <img className={styles.storeImage} src='./images/missing.avif'></img>
            <h1 className={styles.storeName}>Store Name</h1>
            <div className={styles.pageHeaderNav}>
                {prop.state ? 
                <button onClick={prop.onSwapWindow} className={styles.navButtons}>List of Products</button> :
                <button onClick={prop.onSwapWindow} className={styles.navButtons}>Add new Product</button>}
            </div>
        </div>
    );
}