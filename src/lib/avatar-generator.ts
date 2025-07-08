import { AvatarGenerator } from 'random-avatar-generator';

const generator = new AvatarGenerator();

export interface UserProfile {
  name: string;
  gender?: 'male' | 'female';
  role?: string;
}

/**
 * Generate a consistent avatar URL for a user based on their name
 * Uses the user's name as a seed to ensure the same avatar is always generated
 * Note: The random-avatar-generator doesn't support gender-specific generation,
 * but we can modify the seed based on gender for different results
 */
export const generateUserAvatar = (user: UserProfile): string => {
  // Use name as seed for consistency, optionally modified by gender
  let seed = user.name.toLowerCase().replace(/\s+/g, '');
  
  // Modify seed based on gender to get different avatar styles
  if (user.gender === 'male') {
    seed = `male_${seed}`;
  } else if (user.gender === 'female') {
    seed = `female_${seed}`;
  }
  
  return generator.generateRandomAvatar(seed);
};

/**
 * Get initials as fallback if avatar fails to load
 */
export const getUserInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}; 