// middleware/multerMiddleware.js
import multer from 'multer';

// Set storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/temp'); // Temp directory for storing files before upload
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Store the original file name
  },
});

// Set file size limit (50MB) and attach the storage configuration
export const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });
