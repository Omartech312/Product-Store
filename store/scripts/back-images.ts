import pg from "pg";
import {readFile} from "node:fs/promises";

// creating a new pool connection to DB
const pool = new pg.Pool();