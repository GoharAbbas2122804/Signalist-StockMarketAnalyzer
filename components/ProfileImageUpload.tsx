'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ProfileImageUploadProps {
    currentImage?: string | null;
    onImageChange: (imageData: string | null) => void;
    disabled?: boolean;
}

export const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
    currentImage,
    onImageChange,
    disabled = false,
}) => {
    const [previewImage, setPreviewImage] = useState<string | null>(currentImage || null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            toast.error('Invalid file type', {
                description: 'Please upload a JPEG, PNG, or WebP image.'
            });
            return;
        }

        // Validate file size (2MB max)
        const maxSize = 2 * 1024 * 1024; // 2MB in bytes
        if (file.size > maxSize) {
            toast.error('File too large', {
                description: 'Please upload an image smaller than 2MB.'
            });
            return;
        }

        setIsUploading(true);

        try {
            // Convert to base64
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setPreviewImage(base64String);
                onImageChange(base64String);
                setIsUploading(false);
                toast.success('Image uploaded successfully');
            };
            reader.onerror = () => {
                toast.error('Failed to read image');
                setIsUploading(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Image upload error:', error);
            toast.error('Failed to upload image');
            setIsUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setPreviewImage(null);
        onImageChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        toast.success('Image removed');
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Avatar Preview */}
            <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-700 bg-gray-800 flex items-center justify-center">
                    {previewImage ? (
                        <Image
                            src={previewImage}
                            alt="Profile"
                            width={128}
                            height={128}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-600">
                            <span className="text-4xl font-bold text-gray-900">
                                {/* Placeholder - first letter of name would go here */}
                                <Camera className="w-12 h-12" />
                            </span>
                        </div>
                    )}
                </div>

                {/* Remove button */}
                {previewImage && !disabled && (
                    <button
                        onClick={handleRemoveImage}
                        className="absolute top-0 right-0 w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg transition-all"
                        type="button"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Upload Button */}
            <div className="flex flex-col items-center gap-2">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={disabled || isUploading}
                />
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleButtonClick}
                    disabled={disabled || isUploading}
                    className="flex items-center gap-2"
                >
                    <Camera className="w-4 h-4" />
                    {isUploading ? 'Uploading...' : previewImage ? 'Change Image' : 'Upload Image'}
                </Button>
                <p className="text-xs text-gray-500">
                    JPEG, PNG, or WebP • Max 2MB
                </p>
            </div>
        </div>
    );
};
