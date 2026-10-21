import styles from "./styles.module.css"
import {Product} from "./products"


export function Card(prop: Product){
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
        </div>
    );
}