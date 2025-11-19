'use client';

import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS} from "@/lib/constants";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import { signUpWithEmail } from "@/lib/actions/auth.action";
import InputFields from "@/components/InputFields";
import CountryPicker from "@/components/CountryPicker";
import SelectFields from "@/components/SelectFields";
import FooterLink from "@/components/FooterLink";
import GuestModeButton from "@/components/GuestModeButton";

const SignUp = () => {
    const router = useRouter()
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormData>({
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            country: 'PK',
            investmentGoals: 'Growth',
            riskTolerance: 'Medium',
            preferredIndustry: 'Technology'
        },
        mode: 'onBlur'
    }, );

    const onSubmit = async (data: SignUpFormData) => {
        try {
            const result = await signUpWithEmail(data);
            
            if (result.success) {
                // Show success toast
                toast.success('Welcome aboard!', {
                    description: 'Your account has been created successfully.',
                    duration: 4000,
                });
                
                // Redirect to home page
                router.push('/');
            } else {
                // Show error toast with parsed error details
                toast.error(result.error?.title || 'Sign Up Failed', {
                    description: result.error?.message || 'Failed to create account. Please try again.',
                    duration: 6000,
                });
            }
        } catch (error) {
            // Fallback error handling
            console.error('Unexpected error:', error);
            toast.error('Sign Up Failed', {
                description: 'An unexpected error occurred. Please try again later.',
                duration: 6000,
            });
        }
    }

    return (
        <>
            <h1 className="form-title">Sign Up & Personalize</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <InputFields
                    name="fullName"
                    label="Full Name"
                    placeholder="John Doe"
                    register={register}
                    error={errors.fullName}
                    validation={{ 
                        required: 'Full name is required', 
                        minLength: {
                            value: 2,
                            message: 'Name must be at least 2 characters'
                        }
                    }}
                />

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
                    placeholder="Enter a strong password"
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

                <CountryPicker
                    name="country"
                    label="Country"
                    control={control}
                    error={errors.country}
                    required
                />

                <SelectFields
                    name="investmentGoals"
                    label="Investment Goals"
                    placeholder="Select your investment goal"
                    options={INVESTMENT_GOALS}
                    control={control}
                    error={errors.investmentGoals}
                    required
                />

                <SelectFields
                    name="riskTolerance"
                    label="Risk Tolerance"
                    placeholder="Select your risk level"
                    options={RISK_TOLERANCE_OPTIONS}
                    control={control}
                    error={errors.riskTolerance}
                    required
                />

                <SelectFields
                    name="preferredIndustry"
                    label="Preferred Industry"
                    placeholder="Select your preferred industry"
                    options={PREFERRED_INDUSTRIES}
                    control={control}
                    error={errors.preferredIndustry}
                    required
                />

                <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                    {isSubmitting ? 'Creating Account...' : 'Start Your Investing Journey'}
                </Button>

                <FooterLink text="Already have an account?" linkText="Sign in" href="/sign-in" />
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
    )
}
export default SignUp;