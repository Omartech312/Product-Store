import "server-only";
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { pool } from "./db";

export const auth = betterAuth({
    database: pool,
    emailAndPassword: {enabled: true},
    plugins: [admin()],
});