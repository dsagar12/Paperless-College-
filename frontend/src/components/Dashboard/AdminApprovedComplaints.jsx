import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock } from "lucide-react";
import { fetchComplaints } from "../../firebase";

const AdminApprovedComplaints = () => {
  const [approvedComplaints, setApprovedComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getApprovedComplaints = async () => {
      try {
        const response = await fetchComplaints("approved");
        if (!response.success) throw new Error("Error fetching complaints");
        setApprovedComplaints(response.complaints);
      } catch (error) {
        console.error("Error fetching approved complaints:", error);
      } finally {
        setLoading(false);
      }
    };
    getApprovedComplaints();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-gray-600 text-lg">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"
        ></motion.div>
        <span className="ml-3">Fetching approved complaints...</span>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <motion.h2
        className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <CheckCircle2 className="text-green-600" />
        Approved Complaints
      </motion.h2>

      {approvedComplaints.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {approvedComplaints.map((complaint, index) => (
            <motion.div
              key={complaint.id}
              className="bg-white border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-lg hover:border-green-400 transition-all duration-300 relative overflow-hidden"
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="absolute top-0 right-0 bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-bl-xl">
                Approved
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {complaint.complaintText?.title || "Untitled Complaint"}
              </h3>
              <p className="text-gray-700 mb-3 leading-relaxed">
                <strong className="text-green-700">Description:</strong>{" "}
                {complaint.complaintText?.description || "No description provided."}
              </p>

              <div className="border-t border-gray-100 pt-3 mt-2 text-sm text-gray-500 space-y-1">
                <p>
                  <strong>User ID:</strong> {complaint.userId || "Unknown"}
                </p>
                <p className="flex items-center gap-1">
                  <Clock size={14} className="text-green-500" />
                  {complaint.timestamp?.seconds
                    ? new Date(complaint.timestamp.seconds * 1000).toLocaleString()
                    : "No timestamp"}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.p
          className="text-gray-600 text-center mt-10 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No approved complaints yet ✅
        </motion.p>
      )}
    </div>
  );
};

export default AdminApprovedComplaints;
