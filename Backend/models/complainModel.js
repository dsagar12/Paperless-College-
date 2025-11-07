const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema(
  {
    user: { type: String, required: true }, // User submitting the complaint
    message: { type: String, required: true }, // Complaint message
  },
  { timestamps: true } // Adds createdAt & updatedAt timestamps automatically
);

module.exports = mongoose.model("Complaint", ComplaintSchema);
