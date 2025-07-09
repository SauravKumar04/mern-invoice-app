import React, { useState, useRef } from 'react';
import { Camera, User } from 'lucide-react';

const AvatarUpload = ({ currentAvatar, onAvatarChange, name }) => {
  const [preview, setPreview] = useState(currentAvatar ? (
    currentAvatar.startsWith('http') ? currentAvatar : `${import.meta.env.VITE_API || 'http://localhost:4000'}/uploads/${currentAvatar}`
  ) : null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Call parent handler
      onAvatarChange(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div 
          className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-200 shadow-lg cursor-pointer hover:border-purple-400 transition-colors"
          onClick={handleClick}
        >
          {preview ? (
            <img 
              src={preview} 
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
              <User className="w-12 h-12 text-purple-400" />
            </div>
          )}
        </div>
        
        <button
          type="button"
          onClick={handleClick}
          className="absolute bottom-0 right-0 p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg transition-colors"
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600 mb-1">Click to upload avatar</p>
        <p className="text-xs text-gray-400">JPG, PNG or GIF (max 5MB)</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
    </div>
  );
};

export default AvatarUpload;