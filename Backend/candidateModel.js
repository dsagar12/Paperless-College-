import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Removes extra spaces
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9._%+-]+@sggs\.ac\.in$/, // Strict SGGS email validation
    },
    position: {
      type: String,
      required: true,
      enum: ["President", "Minister", "Secretary", "Treasurer"], // Restrict to predefined roles
    },
    manifesto: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      default: "https://via.placeholder.com/150", // Default profile image
    },
    votes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt fields
);

export default mongoose.model("Candidate", candidateSchema);
