'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key } from 'lucide-react';

interface EditProfileFormProps {
    initialData: {
        name: string;
        email: string;
    };
    onSave: (data: EditProfileFormData) => Promise<void>;
    onCancel: () => void;
    isSaving?: boolean;
}

export interface EditProfileFormData {
    name: string;
    email: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({
    initialData,
    onSave,
    onCancel,
    isSaving = false,
}) => {
    const [showPasswordFields, setShowPasswordFields] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<EditProfileFormData>({
        defaultValues: {
            name: initialData.name,
            email: initialData.email,
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const newPassword = watch('newPassword');

    const onSubmit = async (data: EditProfileFormData) => {
        // Remove password fields if not changing password
        if (!showPasswordFields || (!data.currentPassword && !data.newPassword)) {
            delete data.currentPassword;
            delete data.newPassword;
            delete data.confirmPassword;
        }

        await onSave(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                    id="name"
                    type="text"
                    {...register('name', {
                        required: 'Name is required',
                        minLength: {
                            value: 2,
                            message: 'Name must be at least 2 characters',
                        },
                    })}
                    disabled={isSaving}
                    className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Please enter a valid email address',
                        },
                    })}
                    disabled={isSaving}
                    className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
            </div>

            {/* Change Password Toggle Button */}
            {!showPasswordFields ? (
                <div className="pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowPasswordFields(true)}
                        disabled={isSaving}
                        className="w-full flex items-center justify-center gap-2"
                    >
                        <Key className="w-4 h-4" />
                        Change Password
                    </Button>
                </div>
            ) : (
                /* Password Fields */
                <div className="pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-200">
                            Change Password
                        </h3>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setShowPasswordFields(false);
                            }}
                            disabled={isSaving}
                            className="text-gray-400 hover:text-gray-200"
                        >
                            Cancel
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {/* Current Password */}
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                placeholder="Enter current password"
                                {...register('currentPassword', {
                                    validate: (value) => {
                                        if (showPasswordFields && newPassword && !value) {
                                            return 'Current password is required to set a new password';
                                        }
                                        return true;
                                    },
                                })}
                                disabled={isSaving}
                                className={errors.currentPassword ? 'border-red-500' : ''}
                            />
                            {errors.currentPassword && (
                                <p className="text-sm text-red-500">
                                    {errors.currentPassword.message}
                                </p>
                            )}
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                placeholder="Enter new password"
                                {...register('newPassword', {
                                    validate: (value) => {
                                        if (showPasswordFields && value && value.length < 8) {
                                            return 'Password must be at least 8 characters';
                                        }
                                        return true;
                                    },
                                })}
                                disabled={isSaving}
                                className={errors.newPassword ? 'border-red-500' : ''}
                            />
                            {errors.newPassword && (
                                <p className="text-sm text-red-500">
                                    {errors.newPassword.message}
                                </p>
                            )}
                            <p className="text-xs text-gray-500">
                                Minimum 8 characters
                            </p>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm new password"
                                {...register('confirmPassword', {
                                    validate: (value) => {
                                        if (showPasswordFields && newPassword && value !== newPassword) {
                                            return 'Passwords do not match';
                                        }
                                        return true;
                                    },
                                })}
                                disabled={isSaving}
                                className={errors.confirmPassword ? 'border-red-500' : ''}
                            />
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-500">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSaving}
                    className="flex-1"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-gray-900 font-semibold"
                >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </form>
    );
};
