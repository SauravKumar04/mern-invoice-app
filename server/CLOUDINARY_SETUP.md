# Cloudinary Setup Guide

This project has been migrated from local file storage (multer) to Cloudinary for handling profile picture uploads. This ensures that uploaded images persist even after server restarts and deployments.

## Why Cloudinary?

- **Persistent Storage**: Images are stored in the cloud, not locally on the server
- **Automatic Optimization**: Images are automatically compressed and optimized
- **Transformations**: Automatic resizing and cropping to 400x400 pixels
- **CDN**: Fast image delivery worldwide
- **Reliability**: No data loss during deployments or server restarts

## Setup Instructions

### 1. Create a Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com) and sign up for a free account
2. Navigate to your Dashboard to find your credentials

### 2. Configure Environment Variables
Add the following variables to your `.env` file in the server directory:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### 3. Where to Find Your Credentials
In your Cloudinary Dashboard:
- **Cloud Name**: Found at the top of your dashboard
- **API Key**: Found in the "Account Details" section
- **API Secret**: Found in the "Account Details" section (click the eye icon to reveal)

### 4. Folder Structure
Images are uploaded to the `user-avatars` folder in your Cloudinary account for better organization.

### 5. Image Transformations
All uploaded avatars are automatically:
- Resized to 400x400 pixels
- Cropped to maintain aspect ratio
- Optimized for web delivery

## Migration Notes

### What Changed
- Removed `multer` package dependency
- Removed local `uploads` directory serving
- Added `cloudinary` and `multer-storage-cloudinary` packages
- Updated avatar URL handling in frontend components

### Backward Compatibility
The system maintains backward compatibility with existing local file URLs. If a user has an avatar stored locally, it will still work while new uploads use Cloudinary.

### Frontend Changes
- `Avatar.jsx` component now handles both Cloudinary URLs and legacy local paths
- `AvatarUpload.jsx` component updated for Cloudinary URL preview
- `Profile.jsx` page updated to display Cloudinary images

## Testing

1. Ensure all environment variables are set
2. Restart your server
3. Try uploading a new profile picture
4. Verify the image appears correctly and persists after server restart

## Troubleshooting

### "Invalid credentials" error
- Double-check your Cloudinary credentials in the `.env` file
- Ensure there are no extra spaces or quotes around the values

### Images not uploading
- Verify internet connection (Cloudinary requires internet access)
- Check that the file size is under 5MB
- Ensure the file is a valid image format (JPG, PNG, GIF)

### Old images not showing
- This is normal - old local files may not be accessible if the uploads directory was cleaned
- Users can simply re-upload their profile pictures