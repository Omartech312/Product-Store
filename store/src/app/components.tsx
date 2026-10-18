
type cardProp = {
    name: string;
    price: number;
    description: string;

}

export function Header(){

}

export function Card(prop: cardProp){

    return(
        <div className="">
            <img></img>
            <p className="Card-Product-Name">{prop.name}</p>
        </div>
    );
}