"use client";
import styles from "./styles.module.css"
import {Product} from "./products"
import { useState } from 'react';


export function Card(prop: Product){
    const [counter, setCounter] = useState(0);
    //console.log("CSS Module:", styles);
    //console.log("cardBack:", styles.cardBack);


    return(
        <div className={styles.cardBack}>
            <img className={styles.cardImage} src={prop.image}></img>
            <p className={styles.prodHeader}>{prop.name}</p>
            <div>
                <p>{prop.description}</p>
            </div>
            <p>${prop.priceCents / 100}</p>
            <div>
                <button className="">-</button>
                <input className={`${styles.cardInput}`} placeholder="0"></input>
                <button>+</button>
            </div>
        </div>
    );
}