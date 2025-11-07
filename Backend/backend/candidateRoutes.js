import express from "express";
import multer from "multer";
import Candidate from "./candidateModel.js";

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Candidate Registration Route
router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log("➡️ Received POST request");
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

    const { name, email, manifesto } = req.body;

    if (!name || !email || !manifesto) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const candidate = new Candidate({ name, email, manifesto, imageUrl });
    await candidate.save();

    res.status(201).json({ message: "Candidate registered successfully", candidate });
  } catch (error) {
    console.error("❌ Error saving candidate:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
