"use client";

import { useState } from "react";
import { authClient } from "../lib/auth-client";

export default function SignUp(){
    // values needed to sig up
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    //prevents another submit whenever one is being process
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault();

        if(isSubmitting) return;

        if(!name.trim()){
            setMessage("You must provide a valid name");
            return;
        }

        setIsSubmitting(true);
        setMessage("");

        try{
            // attempts to signup through authClient signup method, which returns an error if something goes wrong
            const {error} = await authClient.signUp.email({name: name.trim(), email: email.trim(), password});

            // if an error was detected then it lets the user know there was an issue and exits
            if(error){
                setMessage(error.message ?? "Could not create an account");
                return;
            }

            //otherwise it was a sucess
            setPassword("");
            setMessage("Account created Successfully");
        }
        catch{
            setMessage("Couldn't Connect, please try again");
        }
        finally{
            setIsSubmitting(false);
        }
    }

    return(
        <main>
            <h1>Create an account</h1>

            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name: </label>
                <input id="name" autoComplete="name" value={name} onChange={(event) => setName(event.currentTarget.value)} required></input>

                <label htmlFor="email">Email: </label>
                <input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.currentTarget.value)} required></input>

                <label htmlFor="password">Password: </label>
                <input id="password" type="password" autoComplete="new-password" minLength={8} maxLength={100} value={password} onChange={(event) => setPassword(event.currentTarget.value)} required></input>

                <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating account..." : "Sign up"}</button>
            </form>

            <p role="status">{message}</p>
        </main>
    );
}