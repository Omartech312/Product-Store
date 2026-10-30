"use client";
import styles from "./styles.module.css";
import { useState, useRef } from 'react';
import type { Product } from './products';

type NewProductDetails = Omit<Product, "id">;

type NewProductsProps = {
    onAddProduct: (details: NewProductDetails) => void;
};

type CardProps = Product & {
    onRemoveProduct: (id: number) => void;
    onEditProduct: (id: number) => void;
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

type NotificationProp = {
    message: string;
    positive: boolean;
}

// function to add a new value to the database, it takes details which is basically a product omitting id, since the database
// is in charge of adding unique id (technically its just a counter that increments by one with each new product).
// and this function returns a Product objet unless an error happens
async function createProduct(details: NewProductDetails): Promise<Product>{

    // HTTP request targeting POST function in /api/products
    const response = await fetch("/api/products", {
        method: "POST",
        // Since Im passing a JSON I specify that here
        headers: {
            "Content-Type": "application/json",
        },
        // this is the JSON Im passing which bascailly contains the name, priceCents, description and image of the new product
        // I want to add to my database
        body: JSON.stringify(details),
    });

    // If the response was not sucessful then I throw an error
    if(!response.ok){
        throw new Error("Couldn't save product");
    }

    // othwerise it was successful and I return the response
    return response.json();
}

// This function does exactly the opposite of createProduct, but instead of passing a Product without an id
// im only getting the id
async function deleteProduct(id: number): Promise<Pick<Product, "id" | "name">>{
    // Again a HTTP request to /api/products
    const response = await fetch("/api/products", {
        // targeting the delete function
        method: "DELETE",
        // again passing a JSON
        headers: {
            "Content-Type": "application/json",
        },
        // This is the JSON, its just the product id since I'm targeting this on /api/products
        body: JSON.stringify(id)
    });

    // if an issue was found then I create an Error object and throw it
    if(!response.ok){
        throw new Error("Couldn't remove product");
    }

    //otherwise no error and I return the product's id and name. Name is mostly for the toast notification
    return response.json();
}

async function editProduct(product: Product): Promise<Product>{
    const response = await fetch("/api/products", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product),
    })

    if(!response.ok){
        throw new Error("Couln't edit product");
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
            <button type="button"
            onClick={() => prop.onEditProduct(prop.id)}>Edit</button>
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

// Component that allows the addition of new products to the array of element and database
export function NewProductsArea({onAddProduct}: NewProductsProps){
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [message, setMessage] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);

    return(
        <div className={styles.newProdInputsArea} >
            <form
            onSubmit={async (event) => {
                event.preventDefault();

                if (isSubmitting) return;
                setIsSubmitting(true);

                try{
                    if(!name.trim() || !description.trim() || !imageFile ||
                    !Number.isFinite(price) || price < 0 ){
                        setMessage("Error uploading new product");
                        return;
                    }

                    const result = await uploadImage(imageFile);
                    console.log("Server got:", result);
                    setMessage("The server received an image");
        
                }
                catch(error){
                    console.log(error);
                    setMessage("failed to upload")
                }
                finally{
                    setIsSubmitting(false);
                }

                onAddProduct({
                    name:name.trim(),
                    priceCents: Math.round(price * 100),
                    description: description.trim(),
                    image: "/images/yogurt.jpg"
                });
                setName("");
                setPrice(0);
                setDescription("");
                setImageFile(null);
                setMessage(`New Product: ${name} was Successfully added!`);

            }}>
            <input value={name} className={styles.newProdInputs} type="text" placeholder="name" onChange={(event) => setName(event.currentTarget.value)}></input><br></br>
            <input min="0" step={0.01} value={price} className={styles.newProdInputs} type="number" placeholder="price" onChange={(event) => setPrice(Number(event.currentTarget.value))}></input><br></br>
            <input value={description} className={styles.newProdInputs} type="text" placeholder="description" onChange={(event) => setDescription(event.currentTarget.value)}></input><br></br>
            <input className={styles.newProdInputs} type="file" accept="image/*" onChange={(event) => setImageFile(event.currentTarget.files?.[0] ?? null)}></input><br></br>
            <button disabled={isSubmitting} className={`${styles.newProdButton}`} type="submit">Submit</button>
            </form>
            <p className={styles.addProdMessage}>{message}</p>
        </div>
    )
}

export function ProductManagement({ products: databaseProducts, }: ProductManagementProps){
    // Array with a list a list of products
    const [products, setProducts] = useState<Product[]>(databaseProducts);
    // determines whether to display addNewProduct or the list of Products
    const [check, setCheck] = useState(false);
    // Filters the products based on this state
    const [nameFilter, setNameFilter] = useState("");
    // Used to display the toast notifications
    const [notification, setNotification] = useState<(NotificationProp & { id: string }) | null>(null);
    const [editProd, setEditProd] = useState<Product | null>(null);
    
    // traverses array of types to create cards and filters them based on the nameFilter, so that the array doesnt change, but the values displayed do
    const displayProducts = products.filter((prod) => prod.name.includes(nameFilter)).map((prod) =>(
    <Card id={prod.id} key={prod.id} name={prod.name} priceCents={prod.priceCents} description={prod.description} image={prod.image} onRemoveProduct={removeProduct} onEditProduct={() => setEditProd(prod)}></Card>
    ));

    // function to add a new product
    async function addProduct(details: NewProductDetails){
        try{
            // Calls createProduct which then makes a HTTP request to add the product to the database
            const savedProduct = await createProduct(details);

            // Creates a Toast Notification letting the user know that the product was added to database
            setNotification({id: crypto.randomUUID(), message: `${savedProduct.name} was added`, positive:true});

            // spreads (destructs) prevProducts within squared brackets along with product to integrate it into the array
            setProducts((prevProducts) => [...prevProducts, savedProduct]);
        }
        catch(error){
            console.error(error);
        }
    }

    async function removeProduct(id: number){
        try{
            // returning the name and id, so that a sucess message can be displayed for some secs.
            const removedItem = await deleteProduct(id);

            setNotification({id: crypto.randomUUID(), message: `${removedItem.name} was removed`, positive: false});

            // using filter method of array keeps all elements that do not have the same id as the one passed to this function
            setProducts(prevProducts => prevProducts.filter((cur) => cur.id != id))
        }
        // in case an error is detected it will be displayed on the error console
        catch(error){
            console.error(error);
        }
    }

    async function saveProduct(product: Product){
        const updatedProd = await editProduct(product);

        setProducts(prevProducts => prevProducts.map(prod =>
            prod.id === updatedProd.id ? updatedProd : prod
        ));

        setEditProd(null);

        setNotification({id: crypto.randomUUID(), message: `${updatedProd.name} was updated`, positive: true});
    }

    function swapWindow(){
        // toggles true/flase to decide whether to display the list of elements or the new Product compnent
        setCheck(prevCheck => !prevCheck);
    }

    function filterByName(input : HTMLInputElement){
        //sets State name which causes a rerender that filters out anything that does not contain the input
        setNameFilter(input.value);
    }

    // Function creates a sorted array based on price and replaces the current Product array with this copy
    function sortByPrice(){
        const copy: Product[] = [...products].sort((a,b) => a.priceCents - b.priceCents);
        setProducts((copy));
    }

    // Same as above, but using name rather than product price
    function sortByName(){
        const copy: Product[] = [...products].sort((a,b) => a.name.localeCompare(b.name));
        setProducts(copy);
    }

    return(
        <>
            <Header onSwapWindow={swapWindow} state={check}></Header>
            {notification && (<Notification key={notification.id} message={notification.message} positive={notification.positive} onDismiss={() => setNotification(null)}></Notification>)}
            {check ? <div>
            <h2 className={styles.prodSecHead}>Add New Products:</h2>
            <NewProductsArea onAddProduct={addProduct}/>
            </div> 
            : 
            <div>
            <h2 className={styles.prodSecHead}>Products:</h2>
                <div className={styles.filteringSection}>
                    Sort by:
                    <button onClick={sortByName} className={`${styles.filterButton} bg-white`}>Name</button>
                    <button onClick={sortByPrice} className={`${styles.filterButton} bg-white`}>Price</button>
                    <br></br>
                    <label>Search by name:</label>
                    <input value={nameFilter} type="text" placeholder="Yogurt" onChange={(event) => filterByName(event.currentTarget)}></input>
                </div>
                <div className={styles.productDiv}>
                    {displayProducts}
                </div>
            </div>}
        </>
    );
}

/* Function takes a callback to onSwapWindow which toggles between true/false in ProductManagement 
    to decide whether to render NewProductsArea or the list of current Products on the database.
    And a boolean to decide whether to print a button with "List of Products" or "Add new product"
    */
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

// Component takes a Product object and display's its information, it also contains a callback to close
// this same compoenent with the X button
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

// Component to display toast notification. takes in a prop with the product's name and a boolean to decide
// the color of the notification: red for negative/removing and blue for positive/adding
function Notification(prop: NotificationProp & {onDismiss: () => void}){
    return(
    <div className={styles.annouceMessage} onAnimationEnd={prop.onDismiss} role="status">
        {/*if the boleean is positive then style.positive will be used to display the message resulting in blue text
        otherwise style.negative will be used for red text*/}
        {prop.positive ? 
        <p className={styles.positive}>{prop.message}</p> : 
        <p className={styles.negative}>{prop.message}</p>
        }
    </div>);
}


function EditProduct(prop: Product){

    return(
        <div className={styles.editWindow}>
            <label>Name:</label>
            <input type="text"></input><br/>
            <label>Price:</label>
            <input type="number"></input>
        </div>
    );
}