import Image from "next/image";
import {ProductManagement, Header } from "./components"
import styles from "./styles.module.css"


export default function Home() {

  return (
    <>
      <Header></Header>
      <ProductManagement></ProductManagement>
    </>
  );
}
