"use client";

import { useState } from "react";
import { authClient } from "../lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../styles.module.css"

export default function SignUp(){
    // values needed to sig up
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [signUp, setSignUp] = useState(true);

    //prevents another submit whenever one is being process
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();

    async function SignUpUser(event: React.FormEvent<HTMLFormElement>){
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
            router.push("/");
        }
        catch{
            setMessage("Couldn't Connect, please try again");
        }
        finally{
            setIsSubmitting(false);
        }
    }

    async function SignInUser(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault();

        if(isSubmitting) return;

        setIsSubmitting(true);
        setMessage("");
    }

    return(
        <main>
            <Link href="/">Back to products</Link>
            <h1>Authentication</h1>

            <div className={styles.signWindow}>
                <div className={styles.signPanel} inert={!signUp}>
                    <h2>Create Account</h2>
                    <form onSubmit={SignUpUser}>
                        <label htmlFor="name">Name: </label>
                        <input id="name" autoComplete="name" value={name} onChange={(event) => setName(event.currentTarget.value)} required></input>

                        <label htmlFor="email">Email: </label>
                        <input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.currentTarget.value)} required></input>

                        <label htmlFor="password">Password: </label>
                        <input id="password" type="password" autoComplete="new-password" minLength={8} maxLength={128} value={password} onChange={(event) => setPassword(event.currentTarget.value)} required></input>

                        <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating account..." : "Sign up"}</button>
                    </form>
                </div>

                <div className={styles.signPanel} inert={signUp}>
                    <h2>Sign into Account</h2>
                    <form onSubmit={SignInUser}>
                        <label htmlFor="email">Email: </label>
                        <input id="email" type="email" autoComplete="email" value={name} onChange={(event) => setName(event.currentTarget.value)} required></input>

                        <label htmlFor="password">Password: </label>
                        <input id="password" type="password" autoComplete="password" value={password} onChange={(event) => setPassword(event.currentTarget.value)} required></input>

                        <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Logging in..." : "Sign in"}</button>
                        <p>Checking</p>
                    </form>
                </div>
                    <button type="button" className={`${styles.toggleButton} ${signUp ? styles.toggleRight : ""}`} onClick={() => setSignUp(!signUp)} disabled={isSubmitting}> {signUp ? "Log in" : "Sign up"}</button>
            </div>

            <p role="status">{message}</p>
        </main>
        
    );
}