import multer from 'multer';

// Configure multer storage
const storage = multer.memoryStorage(); // Stores files in memory as Buffer

// File filter (optional: restrict file types)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only images are allowed!'), false);
  }
};

// Multer upload middleware
const upload = multer({ storage, fileFilter });

export default upload;
