import { betterAuth } from "better-auth";
import {mongodbAdapter} from "better-auth/adapters/mongodb";
import { connectToDatabase } from "@/Database/mongoose";
import {nextCookies} from "better-auth/next-js";



let authInstance: ReturnType<typeof betterAuth> | null = null;


export const getAuth = async () => {
    //if we already have an authentication instance then there is no need to create a new one , just simply return the existing one
    if(authInstance) return authInstance;

    //if there is no auth instance exits , then create a new connection to the database and create a new auth instance
    try {
        const mongoose= await connectToDatabase();
        const db = mongoose.connection.db;

        //if connection fails , then throw an error
        if(!db) throw new Error("Failed to connect to database");

        authInstance = betterAuth({
            database: mongodbAdapter(db as any),
            secret: process.env.BETTER_AUTH_SECRET,
            baseURL: process.env.BETTER_AUTH_URL,

            emailAndPassword: {
                enabled: true,
                disableSignUp: false,
                requireEmailVerification: false,
                minPasswordLength: 8,
                maxPasswordLength: 128,
                autoSignIn: true,
            },

            plugins: [nextCookies()],
            
            // Add session configuration
            session: {
                expiresIn: 60 * 60 * 24 * 7, // 7 days
                updateAge: 60 * 60 * 24, // 1 day
            },

            // Add rate limiting
            rateLimit: {
                window: 60, // 1 minute
                max: 10, // 10 requests per minute
            }
        })

        return authInstance
    } catch (error) {
        console.error("❌ Failed to initialize authentication:", error);
        // Return a mock auth instance to prevent app crashes
        // This allows the app to load but auth features won't work
        return betterAuth({
            database: mongodbAdapter({} as any),
            secret: process.env.BETTER_AUTH_SECRET || "fallback-secret",
            baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
            emailAndPassword: {
                enabled: true,
                disableSignUp: false,
                requireEmailVerification: false,
                minPasswordLength: 8,
                maxPasswordLength: 128,
                autoSignIn: true,
            },
            plugins: [nextCookies()]
        });
    }
}

export const auth = await getAuth();