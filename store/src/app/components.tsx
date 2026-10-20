import styles from "./styles.module.css"


type cardProp = {
    name: string;
    price: number;
    description: string;
    image: string;
}

export function Card(prop: cardProp){
    //console.log("CSS Module:", styles);
    //console.log("cardBack:", styles.cardBack);


    return(
        <div className={styles.cardBack}>
            <img className={styles.cardImage} src={prop.image}></img>
            <p className="Card-Product-Name">{prop.name}</p>
            <div>
                <p>{prop.description}</p>
            </div>
            <p>{prop.price}</p>
        </div>
    );
}