'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { EditProfileForm, type EditProfileFormData } from '@/components/EditProfileForm';
import { ProfileImageUpload } from '@/components/ProfileImageUpload';
import { DeleteAccountDialog } from '@/components/DeleteAccountDialog';

interface ProfileData {
    id: string;
    name: string;
    email: string;
    image?: string | null;
}

interface ProfileClientProps {
    initialData: ProfileData;
}

export const ProfileClient: React.FC<ProfileClientProps> = ({ initialData }) => {
    const router = useRouter();
    const [isEditMode, setIsEditMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [profileData, setProfileData] = useState<ProfileData>(initialData);
    const [profileImage, setProfileImage] = useState<string | null>(initialData.image || null);

    const handleSaveProfile = async (formData: EditProfileFormData) => {
        try {
            setIsSaving(true);

            const updateData: any = {
                name: formData.name,
                email: formData.email,
                image: profileImage,
            };

            // Add password fields if provided
            if (formData.newPassword && formData.currentPassword) {
                updateData.newPassword = formData.newPassword;
                updateData.currentPassword = formData.currentPassword;
            }

            const response = await fetch('/api/profile', {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to update profile');
            }

            setProfileData(result.data);
            setProfileImage(result.data.image);
            setIsEditMode(false);
            toast.success('Profile updated successfully');

            // Refresh the page to update server-side data
            router.refresh();
        } catch (error: any) {
            console.error('Error updating profile:', error);
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const response = await fetch('/api/profile', {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    confirmEmail: profileData?.email,
                }),
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.message || 'Failed to delete account');
            }

            toast.success('Account deleted successfully');

            // Redirect to sign-up page after a brief delay
            setTimeout(() => {
                router.push('/sign-up');
            }, 1500);
        } catch (error: any) {
            console.error('Error deleting account:', error);
            toast.error(error.message || 'Failed to delete account');
        }
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
        // Reset image to current profile image
        setProfileImage(profileData?.image || null);
    };

    return (
        <section className="container max-w-3xl space-y-8 py-10">
            {/* Profile Header */}
            <div className="rounded-xl border border-gray-700 bg-gray-800/60 p-6 shadow-lg">
                <div className="flex flex-col gap-2 mb-6">
                    <span className="text-sm uppercase tracking-wide text-gray-500">Profile</span>
                    <h1 className="text-3xl font-bold text-gray-100">Account Settings</h1>
                    <p className="text-gray-500">
                        Manage your personal details and keep your Signalist account secure.
                    </p>
                </div>

                {/* Profile Image */}
                <div className="flex justify-center mb-8">
                    <ProfileImageUpload
                        currentImage={profileImage}
                        onImageChange={setProfileImage}
                        disabled={!isEditMode}
                    />
                </div>

                {/* Profile Information */}
                {isEditMode ? (
                    <EditProfileForm
                        initialData={{
                            name: profileData.name,
                            email: profileData.email,
                        }}
                        onSave={handleSaveProfile}
                        onCancel={handleCancelEdit}
                        isSaving={isSaving}
                    />
                ) : (
                    <>
                        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
                            <div className="rounded-lg border border-gray-700 bg-gray-900/40 p-4">
                                <dt className="text-sm text-gray-500">Full name</dt>
                                <dd className="text-xl font-semibold text-gray-100">{profileData.name}</dd>
                            </div>
                            <div className="rounded-lg border border-gray-700 bg-gray-900/40 p-4">
                                <dt className="text-sm text-gray-500">Email</dt>
                                <dd className="text-xl font-semibold text-gray-100">{profileData.email}</dd>
                            </div>
                        </dl>

                        <Button
                            onClick={() => setIsEditMode(true)}
                            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-gray-900 font-semibold"
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Profile
                        </Button>
                    </>
                )}
            </div>

            {/* Danger Zone */}
            {!isEditMode && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6">
                    <h2 className="text-2xl font-semibold text-red-400 mb-3 flex items-center gap-2">
                        <Trash2 className="w-6 h-6" />
                        Danger Zone
                    </h2>
                    <p className="text-gray-400 mb-4">
                        Once you delete your account, there is no going back. This action is permanent and
                        will remove all your data including your watchlist.
                    </p>
                    <Button
                        onClick={() => setShowDeleteDialog(true)}
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                    </Button>
                </div>
            )}

            {/* Delete Account Dialog */}
            <DeleteAccountDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                userEmail={profileData.email}
                onConfirmDelete={handleDeleteAccount}
            />
        </section>
    );
};
