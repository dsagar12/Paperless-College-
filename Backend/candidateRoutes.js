import express from "express";
const router = express.Router();

// Example route
router.get("/", (req, res) => {
  res.send("Candidate API is working");
});

export default router; // ✅ Correct export for ES Modules
