"use client";
import styles from "./styles.module.css";
//import {Product} from "./products";
import { useState, useRef } from 'react';
import type { Product } from './products';

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

type DisplayDetailsProp = Product & {
    onDisplayDetails: () => void;
}

type ProductManagementProps = {
    products: Product[];
};

async function createProduct(details: NewProductDetails): Promise<Product>{
    const response = await fetch("/api/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
    });

    if(!response.ok){
        throw new Error("Couldn't save product");
    }

    return response.json();
}

async function deleteProduct(id: number): Promise<Pick<Product, "id" | "name">>{
    const response = await fetch("/api/products", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(id)
    });

    if(!response.ok){
        throw new Error("Couldn't remove product");
    }
    return response.json();
}

async function uploadImage(file: File){
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
    });

    if(!response.ok){
        throw new Error("Image failed to upload");
    }

    return response.json();
}

export function Card(prop: CardProps){
    const [counter, setCounter] = useState(0);
    const [display, setDisplay] = useState(false);
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

    function swapDisplay(){
        setDisplay(prevDisplay => !prevDisplay);
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
            <p>${prop.priceCents / 100}</p>
            <div className={styles.cardButton}>
                <button onClick={decrement} className={styles.cardButtonsMinus}> - </button>
                <input value={counter} onChange={(event) => modify(event.currentTarget)} className={`${styles.cardInput}`} placeholder="0"></input>
                <button onClick={increment} className={styles.cardButtonsPlus}> + </button>
            </div>
            <button >Add to Card</button>
            {display ? <ProductDescription id={prop.id} name={prop.name} priceCents={prop.priceCents} description={prop.description} image={prop.image} onDisplayDetails={swapDisplay} /> : <button onClick={swapDisplay} className={styles.productWindowExpand}><img src="./images/expand.webp"></img></button>}
        </div>
    );
}

export function NewProductsArea({onAddProduct}: NewProductsProps){
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [message, setMessage] = useState("");

    return(
        <div className={styles.newProdInputsArea} >
            <form
            onSubmit={async (event) => {
                event.preventDefault();

                if(!name.trim() || !description.trim() || !imageFile ||
                    !Number.isFinite(price) || price < 0 ){
                    setMessage("Error uploading new product");
                    return;
                }
                try{
                    const result = await uploadImage(imageFile);
                    console.log("Server got:", result);
                    setMessage("The server received an image");
        
                }
                catch(error){
                    console.log(error);
                    setMessage("failed to upload")
                }
                /*
                onAddProduct({
                    name:name.trim(),
                    priceCents: Math.round(price * 100),
                    description: description.trim(),
                    image: uploadImageUrl,
                });
                setName("");
                setPrice(0);
                setDescription("");
                setImageFile(null);
                setMessage(`New Product: ${name} was Successfully added!`);
                */
            }}>
            <input value={name} className={styles.newProdInputs} type="text" placeholder="name" onChange={(event) => setName(event.currentTarget.value)}></input><br></br>
            <input min="0" step={0.01} value={price} className={styles.newProdInputs} type="number" placeholder="price" onChange={(event) => setPrice(Number(event.currentTarget.value))}></input><br></br>
            <input value={description} className={styles.newProdInputs} type="text" placeholder="description" onChange={(event) => setDescription(event.currentTarget.value)}></input><br></br>
            <input className={styles.newProdInputs} type="file" accept="image/*" onChange={(event) => setImageFile(event.currentTarget.files?.[0] ?? null)}></input><br></br>
            <button className={`${styles.newProdButton}`} type="submit">Submit</button>
            </form>
            <p className={styles.addProdMessage}>{message}</p>
        </div>
    )
}

export function ProductManagement({ products: databaseProducts, }: ProductManagementProps) {
    const [products, setProducts] = useState<Product[]>(databaseProducts);
    //const [products, setProducts] = useState<Product[]>(initialProducts);
    const [check, setCheck] = useState(false);
    const [nameFilter, setNameFilter] = useState("");
    
    // traverses array of types to create cards 
    const displayProducts = products.map((prod) =>(
    <Card id={prod.id} key={prod.id} name={prod.name} priceCents={prod.priceCents} description={prod.description} image={prod.image} onRemoveProduct={removeProduct} ></Card>
    ));

    // calculates the nextId based on the id properties of each array element
    const nextId = useRef(Math.max(0, products.length + 1));

    // function to add a new product
    async function addProduct(details: NewProductDetails){
        // creates a new object using the detailed passed from the newProduct section + the nextId
        const savedProduct = await createProduct(details);
        // spreads (destructs) prevProducts within squared brackets along with product to integrate it into the array
        setProducts((prevProducts) => [...prevProducts, savedProduct]);
    }


    async function removeProduct(id: number){
        try{
            // returning the name and id, so that a sucess message can be displayed for some secs.
            const removedItem = await deleteProduct(id);

            // using filter method of array keeps all elements that do not have the same id as the one passed to this function
            setProducts(prevProducts => prevProducts.filter((cur) => cur.id != id))
        }
        // in case an error is detected it will be displayed on the error console
        catch(error){
            console.error(error);
        }
    }

    function swapWindow(){
        //console.log(check);
        // toggles true/flase to decide whether to display the list of elements or the new Product compnent
        setCheck(prevCheck => !prevCheck);
    }

    function filterByName(name: string){
        //displayProducts = products.filter().map()
    }

    function sortByPrice(){
        const copy: Product[] = [...products].sort((a,b) => a.priceCents - b.priceCents);
        setProducts((copy));
    }

    function sortByName(){
        const copy: Product[] = [...products].sort((a,b) => a.name.localeCompare(b.name));
        setProducts(copy);
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
                <div className={styles.filteringSection}>
                    Sort by:
                    <button onClick={sortByName} className={`${styles.filterButton} bg-white`}>Name</button>
                    <button onClick={sortByPrice} className={`${styles.filterButton} bg-white`}>Price</button>
                    <br></br>
                    <label>Search by name:</label>
                    <input value={nameFilter} type="text" placeholder="Yogurt" onChange={filterByName}></input>
                </div>
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

function ProductDescription(product: DisplayDetailsProp){

    return(
    <div className={styles.productWindow}>
        <div className={styles.productWindowRelative}>
            <button className={styles.closeProductWindow} onClick={product.onDisplayDetails}>X</button>
            <h1 className={styles.prodWindowTitle}>{product.name}</h1>
            <img className={styles.prodWindowImage} src={product.image}></img>
            <div className={styles.prodWindowDescription}>
                {product.description}
            </div>
        </div>
    </div>
    );
}