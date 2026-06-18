import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

// Ensure local upload directories exist for fallback
const localUploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(localUploadDir)) {
  fs.mkdirSync(localUploadDir, { recursive: true });
}

// Multer storage engine - temporary storage before Cloudinary/Fallback
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, localUploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// File filter limits to valid visual images
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid image file format. Only JPEG, PNG, and WEBP allowed.'), false);
  }
};

export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limits
  fileFilter: fileFilter
});

// Middleware to upload to Cloudinary or fall back to local server hosting
export const uploadImages = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  // Cloudinary credentials configuration check
  const isCloudinaryConfigured =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'mock_cloudinary_cloud_name';

  try {
    const uploadedImages = [];

    if (isCloudinaryConfigured) {
      // Connect and upload to Cloudinary CDN
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
      });

      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'shopmern/products',
          use_filename: true
        });

        uploadedImages.push({
          url: result.secure_url,
          public_id: result.public_id
        });

        // Delete temporary local file
        fs.unlinkSync(file.path);
      }
    } else {
      // Fallback: Use local file system URLs
      for (const file of req.files) {
        uploadedImages.push({
          url: `/uploads/${file.filename}`,
          public_id: `local-${file.filename}`
        });
      }
    }

    req.uploadedImages = uploadedImages;
    next();
  } catch (error) {
    console.error('Image upload failed:', error);
    next(new Error('Image upload failed: ' + error.message));
  }
};
