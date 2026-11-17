"use client";

import { useState } from "react";

export default function SignUp(){
    // values needed to sig up
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");


    return(
        <main>
            <h1>Create an account</h1>

            <form>
                <label htmlFor="name">Name: </label>
                <input id="name" autoComplete="name" value={name} onChange={(event) => setName(event.currentTarget.value)} required></input>

                <label htmlFor="email">Email:</label>
                <input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.currentTarget.value)} required></input>

                <label htmlFor="password"></label>
                <input id="password" type="password" autoComplete="new-password" minLength={10} maxLength={100} value={password} onChange={(event) => setPassword(event.currentTarget.value)} required></input>

                <button>Submit</button>
            </form>
        </main>
    );
}