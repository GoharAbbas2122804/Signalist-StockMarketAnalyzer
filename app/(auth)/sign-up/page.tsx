'use client'
import InputFields from '@/components/InputFields'
import SelectFields from '@/components/SelectFields'
import CountryPicker from '@/components/CountryPicker'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS } from '@/lib/constants'
import React from 'react'
import { useForm } from 'react-hook-form'
import FooterLink from '@/components/FooterLink'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { signUpWithEmail } from '@/lib/actions/auth.action'




const SignUp = () => {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitted, isSubmitting },
    } = useForm<SignUpFormData>(
        {
            defaultValues: {
                fullName: '',
                email: '',
                password: '',
                country: 'Pakistan',
                investmentGoals: 'Growth',
                riskTolerance: 'Medium',
                preferredIndustry: 'Technology',
            },
            mode: 'onBlur'
        })

    const onSubmit = async (data: SignUpFormData) => {
        try {
            const response = await signUpWithEmail(data)
            if(response.success) {
                toast.success('Account created successfully!')
                router.push('/')
            } else {
                toast.error("Failed to SignUp", {
                    description: response.error || "Failed to Create an Account"
                })
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to SignUp", {
                description: error instanceof Error ? error.message : "Failed to Create an Account"
            })
        }
    }

    return (
        <>
            <h1 className='form-title mt-4'>
                SignUp & Personalize
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
                {/* Inpute fileds goes right here */}
                <InputFields
                    name='fullName'
                    label='Full Name'
                    placeholder='John Doe'
                    register={register}
                    error={errors.fullName}
                    validation={{ required: 'Full Name is required', minLength: 2 }}
                    disabled={isSubmitting}
                />

                <InputFields
                    name='email'
                    label='Email'
                    placeholder='JohnDoe@gmail.com'
                    register={register}
                    error={errors.email}
                    validation={{ required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' }, minLength: 9 }}
                    disabled={isSubmitting}
                />

                <InputFields
                    name='password'
                    label='Password'
                    placeholder='JohnDoe@123'
                    register={register}
                    error={errors.password}
                    validation={{ required: 'Password is required , min lenght is 7', minLength: 7 }}
                    disabled={isSubmitting}
                />

                {/* Country picker */}
                <CountryPicker
                    name='country'
                    label='Country'
                    control={control}
                    error={errors.country}
                    required
                />

                {/* Select fields goes right here */}

                <SelectFields
                    name='investmentGoals'
                    label='Investment Goals'
                    placeholder='Select Investment Goals'
                    options={INVESTMENT_GOALS}
                    control={control}
                    error={errors.investmentGoals}
                    required
                />

                <SelectFields
                    name='riskTolerance'
                    label='Risk Tolerance'
                    placeholder='Select Risk Level'
                    options={RISK_TOLERANCE_OPTIONS}
                    control={control}
                    error={errors.riskTolerance}
                    required
                />

                <SelectFields
                    name='preferredIndustry'
                    label='Preferred Industry'
                    placeholder='Select Preferred Industry'
                    options={PREFERRED_INDUSTRIES}
                    control={control}
                    error={errors.preferredIndustry}
                    required
                />



                {/* Submit button goes right here */}
                <Button type='submit' className='w-full yellow-btn  mt-5 ' disabled={isSubmitting}>
                    {isSubmitted ? 'Creating Account' : 'Start Your Investing Journey'}
                </Button>


                <FooterLink text='Already have an account?' linkText='Sign In' href='/sign-in'  />

            </form>

        </>
    )
}

export default SignUp