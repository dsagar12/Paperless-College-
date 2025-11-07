// controllers/imageController.js
// frontend/controllers/imageController.js

import cloudinary from '../config/cloudinaryConfig.js';
export const imageUpload = async (req, res) => {
  try {
    // Check if file is attached in the request
    if (!req.file) return res.status(400).send({ message: 'No file found' });

    const filePath = req.file.path;

    if (!filePath) return res.status(404).send({ message: 'File not found' });

    // Upload file to Cloudinary
    const response = await cloudinary.uploader.upload(filePath, { resource_type: 'auto' });

    // Clean up the file after upload
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return res.status(200).send({ imageUrl: response.secure_url }); // Return the URL of the uploaded image

  } catch (error) {
    // Handle error by deleting the file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).send({ error: error.message, message: 'Image upload failed' });
  }
};

export const deleteImage = async (req, res) => {
  try {
    // Get the public_id from the request body
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({ message: 'No image public_id provided.' });
    }

    // Delete the image from Cloudinary using the public_id
    const result = await cloudinary.uploader.destroy(public_id);

    return res.status(200).json({
      message: 'Image deleted successfully!',
      result,
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Failed to delete image from Cloudinary.',
      error: error.message,
    });
  }
};
