import express from 'express';
import multer from 'multer';  // Handle file uploads
import path from 'path';

const router = express.Router();

// Setup Multer for file storage and handling
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Path to save uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Generating unique file names
  },
});

const upload = multer({ storage: storage });

// Define route to handle image upload
router.post('/upload', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.status(200).json({
    message: 'File uploaded successfully!',
    imageUrl: `/uploads/${req.file.filename}`, // Image URL path to access it
  });
});

export default router;
