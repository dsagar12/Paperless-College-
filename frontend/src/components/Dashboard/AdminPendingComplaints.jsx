import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { fetchComplaints, approveComplaint, rejectComplaint } from "../../firebase";

const AdminPendingComplaints = () => {
  const [pendingComplaints, setPendingComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPendingComplaints = async () => {
      try {
        const response = await fetchComplaints("pending");
        if (!response.success) throw new Error("Error fetching complaints");
        setPendingComplaints(response.complaints);
      } catch (error) {
        console.error("Error fetching pending complaints:", error);
      } finally {
        setLoading(false);
      }
    };

    getPendingComplaints();
  }, []);

  const handleApprove = async (complaintId) => {
    try {
      await approveComplaint(complaintId);
      setPendingComplaints((prev) => prev.filter((c) => c.id !== complaintId));
    } catch (err) {
      console.error("Error approving complaint:", err);
    }
  };

  const handleReject = async (complaintId) => {
    try {
      await rejectComplaint(complaintId);
      setPendingComplaints((prev) => prev.filter((c) => c.id !== complaintId));
    } catch (err) {
      console.error("Error rejecting complaint:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-gray-600 text-lg">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
        ></motion.div>
        <span className="ml-3">Fetching complaints...</span>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <motion.h2
        className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Clock className="text-blue-600" />
        Pending Complaints
      </motion.h2>

      {pendingComplaints.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {pendingComplaints.map((complaint, index) => (
            <motion.div
              key={complaint.id}
              className="bg-white border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="absolute top-0 right-0 bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-bl-xl">
                Pending
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {complaint.complaintText?.title || "Untitled Complaint"}
              </h3>
              <p className="text-gray-700 mb-3">
                <strong>Description:</strong> {complaint.complaintText?.description || "No description provided."}
              </p>
              <p className="text-gray-500 text-sm">
                <strong>User ID:</strong> {complaint.userId || "Unknown"}
              </p>
              <p className="text-gray-500 text-sm">
                <strong>Time:</strong>{" "}
                {complaint.timestamp?.seconds
                  ? new Date(complaint.timestamp.seconds * 1000).toLocaleString()
                  : "No timestamp"}
              </p>

              <div className="mt-5 flex justify-between">
                <motion.button
                  onClick={() => handleApprove(complaint.id)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium shadow-sm"
                  whileTap={{ scale: 0.9 }}
                >
                  <CheckCircle size={18} /> Approve
                </motion.button>

                <motion.button
                  onClick={() => handleReject(complaint.id)}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium shadow-sm"
                  whileTap={{ scale: 0.9 }}
                >
                  <XCircle size={18} /> Reject
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <p className="text-gray-600 text-center mt-10 text-lg">No pending complaints found 🎉</p>
      )}
    </div>
  );
};

export default AdminPendingComplaints;
