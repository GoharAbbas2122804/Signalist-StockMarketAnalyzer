'use server';

import {auth} from "@/lib/better-auth/auth";
import {inngest} from "@/lib/inngest/client";
import {headers} from "next/headers";
import { parseAuthError } from "@/lib/utils/auth-errors";

// Response interface for consistency
interface AuthActionResponse {
    success: boolean;
    data?: any;
    error?: {
        type: string;
        title: string;
        message: string;
    };
}

export const signUpWithEmail = async ({ email, password, fullName, country, investmentGoals, riskTolerance, preferredIndustry }: SignUpFormData): Promise<AuthActionResponse> => {
    try {
        const response = await auth.api.signUpEmail({ body: { email, password, name: fullName } })

        if(response) {
            await inngest.send({
                name: 'app/user.created',
                data: { email, name: fullName, country, investmentGoals, riskTolerance, preferredIndustry }
            })
        }

        return { success: true, data: response }
    } catch (error) {
        console.error('Sign up failed:', error)
        const parsedError = parseAuthError(error, 'signup');
        
        return { 
            success: false, 
            error: {
                type: parsedError.type,
                title: parsedError.title,
                message: parsedError.message
            }
        }
    }
}

export const signInWithEmail = async ({ email, password }: SignInFormData): Promise<AuthActionResponse> => {
    try {
        const response = await auth.api.signInEmail({ body: { email, password } })

        return { success: true, data: response }
    } catch (error) {
        console.error('Sign in failed:', error)
        const parsedError = parseAuthError(error, 'signin');
        
        return { 
            success: false, 
            error: {
                type: parsedError.type,
                title: parsedError.title,
                message: parsedError.message
            }
        }
    }
}

export const signOut = async (): Promise<AuthActionResponse> => {
    try {
        await auth.api.signOut({ headers: await headers() });
        return { success: true };
    } catch (error) {
        console.error('Sign out failed:', error);
        return { 
            success: false, 
            error: {
                type: 'SIGNOUT_ERROR',
                title: 'Sign Out Failed',
                message: 'Failed to sign out. Please try again.'
            }
        };
    }
}