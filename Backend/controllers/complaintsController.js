const { db } = require("../firebase"); // Assuming Firebase SDK is set up in a firebase.js file
const { collection, getDocs, query, where, updateDoc, doc } = require("firebase/firestore");

const complaintsCollection = collection(db, "complaints");

// Fetch all pending complaints from Firebase
const getPendingComplaints = async (req, res) => {
  try {
    const q = query(complaintsCollection, where("status", "==", "pending"));
    const querySnapshot = await getDocs(q);
    let complaints = [];
    querySnapshot.forEach((doc) => {
      complaints.push({ id: doc.id, ...doc.data() });
    });
    res.json(complaints);
  } catch (err) {
    console.error("Error fetching complaints:", err);
    res.status(500).json({ message: "Error fetching complaints" });
  }
};

// Approve a complaint
const approveComplaint = async (req, res) => {
  const { id } = req.params;
  try {
    const complaintRef = doc(db, "complaints", id);
    await updateDoc(complaintRef, { status: "approved" });
    res.json({ message: "Complaint approved successfully" });
  } catch (err) {
    console.error("Error approving complaint:", err);
    res.status(500).json({ message: "Error approving complaint" });
  }
};

// Reject a complaint
const rejectComplaint = async (req, res) => {
  const { id } = req.params;
  try {
    const complaintRef = doc(db, "complaints", id);
    await updateDoc(complaintRef, { status: "rejected" });
    res.json({ message: "Complaint rejected successfully" });
  } catch (err) {
    console.error("Error rejecting complaint:", err);
    res.status(500).json({ message: "Error rejecting complaint" });
  }
};

module.exports = {
  getPendingComplaints,
  approveComplaint,
  rejectComplaint,
};
