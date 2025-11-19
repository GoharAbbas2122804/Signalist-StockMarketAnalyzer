'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signInWithEmail } from '@/lib/actions/auth.action';
import InputFields from '@/components/InputFields';
import FooterLink from '@/components/FooterLink';
import GuestModeButton from '@/components/GuestModeButton';

const SignIn = () => {
    const router = useRouter()
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormData>({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onBlur',
    });

    const onSubmit = async (data: SignInFormData) => {
        try {
            const result = await signInWithEmail(data);
            
            if (result.success) {
                // Show success toast
                toast.success('Welcome back!', {
                    description: "You've been logged in successfully.",
                    duration: 4000,
                });
                
                // Redirect to home page
                router.push('/');
            } else {
                // Show error toast with parsed error details
                toast.error(result.error?.title || 'Login Failed', {
                    description: result.error?.message || 'Failed to sign in. Please try again.',
                    duration: 6000,
                });
            }
        } catch (error) {
            // Fallback error handling
            console.error('Unexpected error:', error);
            toast.error('Login Failed', {
                description: 'An unexpected error occurred. Please try again later.',
                duration: 6000,
            });
        }
    }

    return (
        <>
            <h1 className="form-title">Welcome back</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <InputFields
                    name="email"
                    label="Email"
                    placeholder="email@gmail.com"
                    register={register}
                    error={errors.email}
                    validation={{ 
                        required: 'Email is required', 
                        pattern: {
                            value: /^\w+@\w+\.\w+$/,
                            message: 'Please enter a valid email address'
                        }
                    }}
                />

                <InputFields
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    register={register}
                    error={errors.password}
                    validation={{ 
                        required: 'Password is required', 
                        minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters'
                        }
                    }}
                />

                <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                    {isSubmitting ? 'Signing In...' : 'Sign In'}
                </Button>

                <FooterLink text="Don't have an account?" linkText="Create an account" href="/sign-up" />
            </form>

            {/* Guest Mode Separator and Button */}
            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gray-900 text-gray-500">or</span>
                    </div>
                </div>
                <div className="mt-6">
                    <GuestModeButton />
                </div>
            </div>
        </>
    );
};
export default SignIn;