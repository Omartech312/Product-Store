import Image from "next/image";
import {Card} from "./components"
import maruchan from "./assets/images/Maruchan.avif";

export default function Home() {
  return (
    <>
      <Card name="Soup" description="Maruchan" price={15} image={maruchan.src}></Card>
    </>
  );
}
