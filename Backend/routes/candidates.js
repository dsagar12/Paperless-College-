import express from "express";
import multer from "multer";
import Candidate from "../models/Candidate.js";

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store in uploads/ directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, email, manifesto } = req.body;
    if (!name || !email || !manifesto) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const candidate = new Candidate({
      name,
      email,
      manifesto,
      image: req.file ? req.file.path : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV7cMJ19KfPveG2awIC_PQomfpYFqQpyTSAg&s", // Save image path
    });

    console.log("Saving Candidate:", candidate);
    await candidate.save();

    res.status(201).json({ message: "Candidate registered successfully", candidate });
  } catch (error) {
    console.error("Error saving candidate:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
