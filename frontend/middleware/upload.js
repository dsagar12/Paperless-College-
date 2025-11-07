import multer from 'multer';

// Set up the storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../public/temp'); // Specify upload folder (make sure this folder exists or create it)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Define file name format
  },
});
app.post("/api/image-upload", upload.single("photo"), imageUpload);

// Create multer instance with the storage configuration
const upload = multer({ storage: storage });

export { upload }; // Export to use in your routes
