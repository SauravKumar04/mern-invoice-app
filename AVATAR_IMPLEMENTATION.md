# Avatar Upload Feature Implementation

## Overview
This document describes the implementation of the profile avatar upload feature that allows users to upload and display their profile pictures in both the profile settings page and the header.

## Features Implemented

### 1. Backend Changes

#### User Model Updates
- Added `avatar` field to the User schema in `server/models/User.js`
- Field stores the filename of the uploaded avatar image

#### File Upload Middleware
- Created `server/middleware/uploadMiddleware.js` using Multer
- Configured to accept image files only (JPG, PNG, GIF)
- 5MB file size limit
- Automatic file naming with timestamps to prevent conflicts
- Files stored in `server/uploads/` directory

#### Auth Controller Updates
- Updated `updateProfile` function in `server/controllers/authController.js`
- Handles avatar file uploads via FormData
- Automatically deletes old avatar files when new ones are uploaded
- Returns avatar filename in response
- Updated login response to include avatar field

#### Routes and Static File Serving
- Added avatar upload middleware to the update profile route
- Added static file serving for `/uploads` endpoint in `server/server.js`
- Avatar files accessible via `http://localhost:4000/uploads/filename`

### 2. Frontend Changes

#### New Components

##### AvatarUpload Component (`client/src/components/ui/AvatarUpload.jsx`)
- Interactive avatar upload component for profile settings
- Click-to-upload functionality with file picker
- Real-time preview of selected images
- File type and size validation (images only, max 5MB)
- Fallback display with user initials or default icon

##### Avatar Component (`client/src/components/ui/Avatar.jsx`)
- Reusable avatar display component
- Multiple size options (sm, md, lg, xl)
- Fallback to user initials when no avatar is present
- Error handling for broken image links
- Responsive design with proper styling

#### Updated Components

##### Profile Page (`client/src/pages/Profile.jsx`)
- Integrated AvatarUpload component
- Updated form submission to use FormData for file uploads
- Layout adjusted to show avatar on the left, form on the right

##### Header Component (`client/src/components/layout/Header.jsx`)
- Added Avatar component display next to user name
- Shows uploaded avatar or fallback with user initials

#### API Updates
- Updated `updateProfile` function in `client/src/api/auth.js`
- Handles both regular form data and FormData for file uploads
- Proper Content-Type headers for multipart requests

## Usage Instructions

### For Users
1. Navigate to Profile Settings
2. Click on the avatar placeholder or camera icon
3. Select an image file (JPG, PNG, or GIF, max 5MB)
4. Preview the image before saving
5. Click "Save Changes" to upload the avatar
6. Avatar will appear in the header immediately after successful upload

### For Developers
1. Avatar files are stored in `server/uploads/`
2. File access via `/uploads/filename` endpoint
3. User avatar filename stored in database
4. Old avatars automatically cleaned up on new uploads

## File Structure
```
server/
├── middleware/
│   └── uploadMiddleware.js          # Multer configuration
├── models/
│   └── User.js                      # Updated with avatar field
├── controllers/
│   └── authController.js            # Updated profile update logic
├── routes/
│   └── authRoutes.js               # Added upload middleware
├── uploads/                         # Avatar storage directory
└── server.js                       # Static file serving

client/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Avatar.jsx          # Reusable avatar display
│   │   │   └── AvatarUpload.jsx    # Upload component
│   │   └── layout/
│   │       └── Header.jsx          # Updated with avatar display
│   ├── pages/
│   │   └── Profile.jsx             # Updated with upload functionality
│   └── api/
│       └── auth.js                 # Updated API calls
```

## Technical Notes

- File uploads use FormData to support multipart/form-data
- Error handling includes file size, type validation
- Automatic cleanup prevents storage bloat
- Responsive design works on mobile and desktop
- Fallback initials provide good UX when no avatar is set
- Environment variables support different API URLs for development/production

## Security Considerations

- File type validation prevents malicious uploads
- File size limits prevent storage abuse
- Proper error handling prevents information leakage
- Files stored outside web root with controlled access

The implementation is complete and ready for production use!