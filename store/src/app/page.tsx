import Image from "next/image";
import {ProductManagement, Header } from "./components"
import styles from "./styles.module.css"
import { pool } from "./lib/db";


export default async function Home() {
  const result = await pool.query(
    "SELECT current_database() AS database_name"
  );

  console.log("Connected to:", result.rows[0].database_name);

  return <ProductManagement />;
}