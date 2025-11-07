import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: 'YOUR_CLOUD_NAME', // Replace with your Cloudinary cloud name
  api_key: 'YOUR_API_KEY', // Replace with your Cloudinary API key
  api_secret: 'YOUR_API_SECRET', // Replace with your Cloudinary API secret
});

export default cloudinary;
