import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadImage = async () => {
    if (!image) {
      alert("Please select an image first.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "your_upload_preset"); // Replace with Cloudinary upload preset
    formData.append("cloud_name", "your_cloud_name"); // Replace with your Cloudinary cloud name

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`, // Replace with your Cloudinary cloud name
        formData
      );

      console.log("Image URL:", response.data.secure_url);
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          setImage(file);
          setPreview(URL.createObjectURL(file));
        }}
      />
      {preview && <img src={preview} alt="Preview" className="mt-2 w-32 h-32 object-cover" />}
      <button
        onClick={uploadImage}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload Image"}
      </button>
    </div>
  );
};

export default FileUpload;
