import Image from "next/image";
import {Card} from "./components"

export default function Home() {
  return (
    <>
      <Card name="Soup" description="Maruchan" price={15} image="Nya"></Card>
    </>
  );
}
