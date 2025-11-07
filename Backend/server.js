const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/electionDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Define Candidate Schema & Model
const candidateSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9._%+-]+@sggs\.ac\.in$/, // Only allow SGGS emails
    },
    department: { type: String, required: true },
    year: { 
      type: String, 
      required: true, 
      enum: ["1st Year", "2nd Year", "3rd Year", "4th Year"] // Restrict year values
    },
    manifesto: { type: String, required: true, trim: true },
    profileImage: {
      type: String,
      default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV7cMJ19KfPveG2awIC_PQomfpYFqQpyTSAg&s", // Default image if not provided
    },
    votes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  });
  
  const Candidate = mongoose.model("Candidate", candidateSchema);
  
  

// Test Route
app.get("/", (req, res) => {
  res.send("✅ Server is Running...");
});

// Get All Candidates Route
app.get("/api/candidates", async (req, res) => {
  try {
    const candidates = await Candidate.find(); // Fetch all candidate details
    res.json(candidates);
  } catch (error) {
    console.error("❌ Error fetching candidates:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Add New Candidate Route
app.post("/api/candidates", async (req, res) => {
    try {
      const { fullName, email, department, year, manifesto, imageURL } = req.body;
  
      if (!["1st Year", "2nd Year", "3rd Year", "4th Year"].includes(year)) {
        return res.status(400).json({ message: "Invalid year format. Use '1st Year', '2nd Year', etc." });
      }
  
      const existingCandidate = await Candidate.findOne({ email });
      if (existingCandidate) {
        return res.status(400).json({ message: "Candidate with this email already exists." });
      }
  
      const newCandidate = new Candidate({
        name: fullName,
        email,
        department,
        year,
        manifesto,
        profileImage: imageURL || "https://via.placeholder.com/150",
        votes: 0,
      });
  
      await newCandidate.save();
      res.status(201).json({ message: "✅ Candidate registered successfully", candidate: newCandidate });
    } catch (error) {
      console.error("❌ Error saving candidate:", error);
      
      // Handle Mongoose validation errors
      if (error.name === "ValidationError") {
        return res.status(400).json({ message: "Validation Error", errors: error.errors });
      }
  
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  app.post("/api/vote/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const candidate = await Candidate.findById(id);
      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }
      candidate.votes += 1;
      await candidate.save();
      res.json({ votes: candidate.votes });
    } catch (error) {
      res.status(500).json({ message: "Error updating vote" });
    }
  });
  
  

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
