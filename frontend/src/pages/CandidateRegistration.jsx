
import { useState } from "react";
import { motion } from "framer-motion";

const CandidateRegistration = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    department: "",
    year: "",
    manifesto: "",
    image: null,
    imageURL: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "sagar-project");
    data.append("cloud_name", "djilifntv");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/djilifntv/image/upload", {
        method: "POST",
        body: data,
      });
      const uploadedImage = await res.json();
      setFormData((prev) => ({ ...prev, imageURL: uploadedImage.url }));
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/candidates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Candidate Registered Successfully!");
        console.log("Response:", data);
        setFormData({
          fullName: "",
          email: "",
          department: "",
          year: "",
          manifesto: "",
          image: null,
          imageURL: "",
        });
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong! Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center px-6 py-12 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="w-full max-w-xl p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 shadow-xl backdrop-blur-md"
      >
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-400 text-center mb-6">
          Candidate Registration
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-teal-400"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-teal-400"
            required
          />

          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-teal-400"
            required
          />

          <select
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-lg bg-white/10 text-white focus:ring-2 focus:ring-teal-400"
            required
          >
            <option value="">Select Year</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>

          <textarea
            name="manifesto"
            placeholder="Your Election Manifesto"
            value={formData.manifesto}
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-teal-400"
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-300"
          />

          {formData.imageURL && (
            <motion.img
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              src={formData.imageURL}
              alt="Uploaded"
              className="mt-4 w-full rounded-lg shadow-md"
            />
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold text-lg shadow-md transition-all"
          >
            Register
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default CandidateRegistration;