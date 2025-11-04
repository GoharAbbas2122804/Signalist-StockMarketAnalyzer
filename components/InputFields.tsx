'use client'

import { cn } from "@/lib/utils"
import { Label } from "./ui/label"

const InputFields = ({name , label , placeholder , type = 'text' , register , error , validation , disabled , value }: FormInputProps) => {
  return (
    <div className='space-y-2'>
        <Label htmlFor={name} className="form-label">
            {label}
        </Label>
        <input 
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        className={cn('form-input w-full' , {'opacity-50 cursor-not-allowed' : disabled})}
        {...register(name , validation)}
        /> 
        {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  )
}

export default InputFields