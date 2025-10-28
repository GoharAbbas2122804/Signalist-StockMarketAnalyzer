'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type ContactFormValues = {
  name: string
  email: string
  contactNumber: string
  title: string
  description: string
}

const Page = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactFormValues>({
    defaultValues: {
      name: '',
      email: '',
      contactNumber: '',
      title: '',
      description: ''
    }
  })

  const onSubmit = async (values: ContactFormValues) => {
    try {
      const res = await fetch('/api/contact-us', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message || 'Failed to send message')
      }
      toast.success('Message sent successfully')
      reset()
    } catch (err: any) {
      toast.error(err?.message || 'Something went wrong')
    }
  }

  return (
    <section className="mx-auto max-w-3xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white">Contact Us</h1>
        <p className="mt-2 text-gray-400">We typically respond within 1 business day.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border border-white/10 bg-[#0F0F0F] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Name</label>
            <input
              type="text"
              className={`w-full rounded-md bg-[#121212] px-4 py-3 text-white placeholder:text-gray-500 outline-none ring-1 ring-inset ${errors.name ? 'ring-red-500' : 'ring-white/10'} focus:ring-2 focus:ring-yellow-500`}
              placeholder="John Doe"
              {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Too short' } })}
            />
            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              className={`w-full rounded-md bg-[#121212] px-4 py-3 text-white placeholder:text-gray-500 outline-none ring-1 ring-inset ${errors.email ? 'ring-red-500' : 'ring-white/10'} focus:ring-2 focus:ring-yellow-500`}
              placeholder="you@example.com"
              {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })}
            />
            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Contact Number</label>
            <input
              type="tel"
              className={`w-full rounded-md bg-[#121212] px-4 py-3 text-white placeholder:text-gray-500 outline-none ring-1 ring-inset ${errors.contactNumber ? 'ring-red-500' : 'ring-white/10'} focus:ring-2 focus:ring-yellow-500`}
              placeholder="+1 555 0100"
              {...register('contactNumber', {
                required: 'Contact number is required',
                minLength: { value: 6, message: 'Too short' }
              })}
            />
            {errors.contactNumber && <p className="mt-1 text-sm text-red-400">{errors.contactNumber.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Title</label>
            <input
              type="text"
              className={`w-full rounded-md bg-[#121212] px-4 py-3 text-white placeholder:text-gray-500 outline-none ring-1 ring-inset ${errors.title ? 'ring-red-500' : 'ring-white/10'} focus:ring-2 focus:ring-yellow-500`}
              placeholder="Brief subject"
              {...register('title', { required: 'Title is required', minLength: { value: 4, message: 'Too short' } })}
            />
            {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>}
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-gray-300">Description</label>
          <textarea
            rows={6}
            className={`w-full resize-y rounded-md bg-[#121212] px-4 py-3 text-white placeholder:text-gray-500 outline-none ring-1 ring-inset ${errors.description ? 'ring-red-500' : 'ring-white/10'} focus:ring-2 focus:ring-yellow-500`}
            placeholder="Tell us more about your query..."
            {...register('description', { required: 'Description is required', minLength: { value: 10, message: 'Please provide more details' } })}
          />
          {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>}
        </div>

        <div className="mt-7 flex items-center justify-end gap-3">
          <button
            type="reset"
            onClick={() => reset()}
            className="rounded-md px-4 py-2 text-sm font-medium text-gray-300 ring-1 ring-inset ring-white/10 transition-colors hover:text-white"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 px-6 py-2 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(255,179,0,0.25)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(255,179,0,0.35)] hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : 'Send message'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default Page


