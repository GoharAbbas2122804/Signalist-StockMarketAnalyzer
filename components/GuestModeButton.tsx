'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useGuestSession } from '@/lib/context/GuestSessionContext';

interface GuestModeButtonProps {
  className?: string;
  onGuestModeEnter?: () => void;
}

const GuestModeButton: React.FC<GuestModeButtonProps> = ({ 
  className = '', 
  onGuestModeEnter 
}) => {
  const router = useRouter();
  const { enterGuestMode } = useGuestSession();

  const handleGuestMode = () => {
    // Enter guest mode
    enterGuestMode();
    
    // Call optional callback
    if (onGuestModeEnter) {
      onGuestModeEnter();
    }
    
    // Navigate to home page
    router.push('/');
  };

  return (
    <Button
      type="button"
      onClick={handleGuestMode}
      variant="outline"
      className={`w-full h-12 text-base font-medium border-gray-600 bg-transparent text-gray-400 hover:bg-gray-700 hover:text-gray-300 rounded-lg transition-colors ${className}`}
    >
      Continue as Guest
    </Button>
  );
};

export default GuestModeButton;
