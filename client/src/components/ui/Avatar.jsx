import React from 'react';
import { User } from 'lucide-react';

const Avatar = ({ src, name, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarUrl = src ? `${import.meta.env.VITE_API || 'http://localhost:4000'}/uploads/${src}` : null;

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-white/20 shadow-sm ${className}`}>
      {avatarUrl ? (
        <>
          <img 
            src={avatarUrl} 
            alt={name || 'Avatar'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div 
            className={`w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center ${textSizes[size]} font-semibold text-white`}
            style={{ display: 'none' }}
          >
            {name ? getInitials(name) : <User className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'}`} />}
          </div>
        </>
      ) : (
        <div className={`w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center ${textSizes[size]} font-semibold text-white`}>
          {name ? getInitials(name) : <User className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'}`} />}
        </div>
      )}
    </div>
  );
};

export default Avatar;