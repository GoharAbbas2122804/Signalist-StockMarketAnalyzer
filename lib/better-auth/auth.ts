import { connectToDatabase } from "@/Database/mongoose";
import { betterAuth } from "better-auth";
import { mongodbAdapter} from "better-auth/adapters/mongodb";
import { nextCookies} from "better-auth/next-js";
import { UserRole } from '@/lib/types/user';

let authInstance: ReturnType<typeof betterAuth> | null = null;

export const getAuth = async () => {
    if(authInstance) return authInstance;

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    if(!db) throw new Error('MongoDB connection not found');

    authInstance = betterAuth({
        database: mongodbAdapter(db),
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
        user: {
            additionalFields: {
                role: {
                    type: "string",
                    defaultValue: UserRole.USER,
                    required: false,
                    input: false, // Prevent users from setting role during signup
                },
                deletedAt: {
                    type: "date",
                    required: false,
                },
                lastLoginAt: {
                    type: "date",
                    required: false,
                }
            }
        },
        plugins: [nextCookies()],
    });

    return authInstance;
}

export const auth = await getAuth();