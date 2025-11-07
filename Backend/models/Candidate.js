const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._%+-]+@sggs\.ac\.in$/, // Only allow SGGS emails
  },
  department: { type: String, required: true },
  year: { type: String, required: true, enum: ["1st Year", "2nd Year", "3rd Year", "4th Year"] },
  position: { type: String, required: true },  // ✅ Add this line
  manifesto: { type: String, required: true, trim: true },
  profileImage: {
    type: String,
    default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV7cMJ19KfPveG2awIC_PQomfpYFqQpyTSAg&s",
  },
  votes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Candidate = mongoose.model("Candidate", candidateSchema);
module.exports = Candidate;
