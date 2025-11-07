import multer from 'multer';

// Set up the storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Specify upload folder (make sure this folder exists or create it)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Define file name format
  },
});

// Create multer instance with the storage configuration
const upload = multer({ storage: storage });

export { upload }; // Export to use in your routes
