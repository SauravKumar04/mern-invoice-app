const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Check if Cloudinary credentials are provided
const cloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET
);

if (!cloudinaryConfigured) {
  console.warn('⚠️ Cloudinary credentials not found. Profile picture uploads will be disabled.');
  console.warn('Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your .env file');
}

// Configure Cloudinary only if credentials are available
if (cloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Configure storage based on whether Cloudinary is available
const storage = cloudinaryConfigured 
  ? new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'user-avatars', // Folder name in Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
        transformation: [
          { width: 400, height: 400, crop: 'fill' }, // Resize and crop to 400x400
          { quality: 'auto' } // Optimize quality automatically
        ],
        public_id: (req, file) => {
          // Generate unique public ID using timestamp and random number
          return `avatar-${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        },
      },
    })
  : multer.memoryStorage(); // Fallback to memory storage if Cloudinary not configured

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = { cloudinary: cloudinaryConfigured ? cloudinary : null, upload, cloudinaryConfigured };