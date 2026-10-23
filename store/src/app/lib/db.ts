import "server-only";
import { Pool } from "pg";

const globalForDb = globalThis as typeof globalThis & {
    postgresPool?: Pool;
};

export const pool = globalForDb.postgresPool ?? new Pool();

if (process.env.NODE_ENV !== "production") {
    globalForDb.postgresPool = pool;
}