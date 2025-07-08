import React, { useState } from "react";
import { generateUserAvatar, getUserInitials, UserProfile } from "@/lib/avatar-generator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface GeneratedAvatarProps {
  user: UserProfile;
  className?: string;
  size?: number;
}

export const GeneratedAvatar: React.FC<GeneratedAvatarProps> = ({ 
  user, 
  className = "w-8 h-8",
  size = 32
}) => {
  const [imageError, setImageError] = useState(false);
  
  const avatarUrl = generateUserAvatar(user);
  const initials = getUserInitials(user.name);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Avatar className={className}>
      {!imageError && (
        <AvatarImage 
          src={avatarUrl} 
          alt={`${user.name} avatar`}
          onError={handleImageError}
          style={{ width: size, height: size }}
        />
      )}
      <AvatarFallback className="text-xs font-semibold">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}; 