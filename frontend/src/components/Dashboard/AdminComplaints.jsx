import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchComplaintCount,
  fetchComplaints,
  approveComplaint,
  rejectComplaint,
  logout,
} from "../../firebase";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [pendingComplaints, setPendingComplaints] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    const getComplaintStats = async () => {
      try {
        const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
          fetchComplaintCount("pending"),
          fetchComplaintCount("approved"),
          fetchComplaintCount("rejected"),
        ]);
        setStats({
          pending: pendingRes.count,
          approved: approvedRes.count,
          rejected: rejectedRes.count,
        });
      } catch (error) {
        console.error("Error fetching complaint stats:", error);
      }
    };

    const getPendingComplaints = async () => {
      try {
        const response = await fetchComplaints("pending");
        setPendingComplaints(response.complaints);
      } catch (error) {
        console.error("Error fetching pending complaints:", error);
      }
    };

    getComplaintStats();
    getPendingComplaints();
  }, []);

  const handleApprove = async (complaintId) => {
    await approveComplaint(complaintId);
    setPendingComplaints((prev) => prev.filter((c) => c.id !== complaintId));
  };

  const handleReject = async (complaintId) => {
    await rejectComplaint(complaintId);
    setPendingComplaints((prev) => prev.filter((c) => c.id !== complaintId));
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.4 },
    }),
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">
      {/* Top Navbar */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-blue-800 to-blue-900/95 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center"
      >
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-blue-400">
          🛡️ Admin Dashboard
        </h1>
        <div className="flex gap-6 items-center text-sm">
          <Link to="/admin/notifications" className="text-gray-200 hover:text-white transition">Notifications</Link>
          <Link to="/" className="text-gray-200 hover:text-white transition">Home</Link>
          <button
            onClick={handleLogout}
            className="px-3 py-1 rounded-md bg-red-600/20 hover:bg-red-600/30 transition font-medium"
          >
            Logout
          </button>
        </div>
      </motion.header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex w-72 flex-col p-6 gap-6 bg-gradient-to-b from-white/5 to-white/10 backdrop-blur-md border-r border-white/10"
        >
          <div>
            <h2 className="text-lg font-semibold text-teal-300">Menu</h2>
            <p className="text-xs text-gray-300 mt-1">Admin controls</p>
          </div>
          <nav className="flex-1">
            <ul className="space-y-2">
              {[
                { label: "Dashboard", path: "/admin-dashboard" },
                { label: "Pending Complaints", path: "/admin/pending" },
                { label: "Approved Complaints", path: "/admin/approved" },
                { label: "Rejected Complaints", path: "/admin/rejected" },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/6 transition text-gray-100 font-medium text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {/* Stats */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
            initial="hidden"
            animate="visible"
          >
            {[
              { label: "Pending", value: stats.pending, color: "text-yellow-400" },
              { label: "Approved", value: stats.approved, color: "text-green-400" },
              { label: "Rejected", value: stats.rejected, color: "text-red-400" },
              {
                label: "Total",
                value: stats.pending + stats.approved + stats.rejected,
                color: "text-blue-400",
              },
            ].map((card, i) => (
              <motion.div
                key={card.label}
                variants={cardVariants}
                custom={i}
                className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 shadow-lg backdrop-blur-md"
              >
                <h3 className="text-lg font-semibold text-white">{card.label}</h3>
                <p className={`text-4xl font-bold mt-2 ${card.color}`}>{card.value}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Pending Complaints */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-400 mb-6">
              📋 Pending Complaints
            </h2>
            {pendingComplaints.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {pendingComplaints.map((complaint, i) => (
                  <motion.div
                    key={complaint.id}
                    variants={cardVariants}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 shadow-md backdrop-blur-md transition hover:shadow-lg"
                  >
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {complaint.complaintText?.title || "Untitled Complaint"}
                    </h3>
                    <p className="text-sm text-gray-300 mb-3">
                      {complaint.complaintText?.description || "No details provided."}
                    </p>
                    <p className="text-xs text-gray-400 mb-1">
                      <strong>User ID:</strong> {complaint.userId || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-400">
                      <strong>Date:</strong>{" "}
                      {complaint.timestamp?.seconds
                        ? new Date(complaint.timestamp.seconds * 1000).toLocaleString()
                        : "N/A"}
                    </p>
                    <div className="mt-4 flex justify-between">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleApprove(complaint.id)}
                        className="px-4 py-1 rounded-lg bg-green-600/20 hover:bg-green-600/30 text-green-300 font-medium text-sm"
                      >
                        Approve
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleReject(complaint.id)}
                                               className="px-4 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 font-medium text-sm"
                      >
                        Reject
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-lg italic">No pending complaints right now 🚀</p>
            )}
          </motion.section>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-900 to-slate-900 text-white py-4 text-center border-t border-white/10">
        © {new Date().getFullYear()} <strong>Team Sanyojan</strong> — Empowering Smart Campus Systems.
      </footer>
    </div>
  );
};

export default AdminDashboard;