import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {fetchComplaintCount, fetchComplaints, approveComplaint, rejectComplaint } from "../../firebase"; // ✅ Ensure the path is correct
import { useNavigate } from "react-router-dom";
import { logout } from "../../firebase"; // Ensure correct path

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login"); // Redirect to login page after logout
  };

  const [pendingComplaints, setPendingComplaints] = useState([]);
  const [stats, setStats] = useState({ total: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    const getComplaintStats = async () => {
      try {
        const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
          fetchComplaintCount("pending"),
          fetchComplaintCount("approved"),
          fetchComplaintCount("rejected"),
        ]);
        if (!pendingRes.success || !approvedRes.success || !rejectedRes.success) {
          throw new Error("Error fetching complaint counts");
        }
        setStats({
          pending: pendingRes.count,
          approved: approvedRes.count,
          rejected: rejectedRes.count,
        });
      } catch (error) {
        console.error("Error fetching complaint stats:", error);
      }
    };

    getComplaintStats();
  }, []);

  useEffect(() => {
      const getPendingComplaints = async () => {
        try {
          const response = await fetchComplaints("pending"); // Fetch only pending complaints
          if (!response.success) {
            throw new Error("Error fetching complaints");
          }
          setPendingComplaints(response.complaints);
        } catch (error) {
          console.error("Error fetching pending complaints:", error);
        }
      };
  
      getPendingComplaints();
    }, []);

  const handleApprove = async (complaintId) => {
      try {
        await approveComplaint(complaintId);
        setPendingComplaints((prev) => prev.filter((complaint) => complaint.id !== complaintId));
      } catch (err) {
        console.error("Error approving complaint:", err);
      }
    };
  
  const handleReject = async (complaintId) => {
      try {
        await rejectComplaint(complaintId);
        setPendingComplaints((prev) => prev.filter((complaint) => complaint.id !== complaintId));
      } catch (err) {
        console.error("Error rejecting complaint:", err);
      }
    };


  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <header className="bg-blue-900 text-white py-4 px-6 shadow-md flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link to="/admin/notifications" className="text-white hover:underline">Send Notifications</Link>

        <div>
          <Link to="/" className="text-white hover:underline mr-4">Home</Link>
           <button onClick={handleLogout} className="text-red-400 hover:underline">Logout</button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-blue-800 text-white p-6">
          <nav>
            <ul className="space-y-4">
              <li><Link to="/admin" className="hover:underline">Dashboard</Link></li>
              <li><Link to="/admin/pending" className="hover:underline">Pending Complaints</Link></li>
              <li><Link to="/admin/approved" className="hover:underline">Approved Complaints</Link></li>
              <li><Link to="/admin/rejected" className="hover:underline">Rejected Complaints</Link></li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 p-10">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-800">Total Complaints</h2>
              <p className="text-3xl text-blue-600 mt-4">{stats.pending+stats.approved+stats.rejected}</p>
            </div>
           
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-800">Pending Complaints</h2>
              <p className="text-3xl text-blue-600 mt-4">{stats.pending}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-800">Approved Complaints</h2>
              <p className="text-3xl text-green-600 mt-4">{stats.approved}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-800">Rejected Complaints</h2>
              <p className="text-3xl text-red-600 mt-4">{stats.rejected}</p>
            </div>
          </div>

          {/* Pending Complaints Section */}
          <section>
           

          <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Pending Complaints</h2>
      {pendingComplaints.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingComplaints.map((complaint) => (
            <div key={complaint.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
              <h3 className="text-xl font-semibold text-gray-800">{complaint.complaintText.title || "No Title"}</h3>
              <p className="text-gray-600 mt-2"><strong>Description:</strong> {complaint.complaintText.description || "N/A"}</p>
              <p className="text-gray-600 mt-2"><strong>User ID:</strong> {complaint.userId || "N/A"}</p>
              <p className="text-gray-600">
                <strong>Date   & Time:</strong> {complaint.timestamp?.seconds ? new Date(complaint.timestamp.seconds * 1000).toLocaleString() : "N/A"}
              </p>
              <div className="mt-4 flex justify-between">
                <button onClick={() => handleApprove(complaint.id)} className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded">
                  Approve
                </button>
                <button onClick={() => handleReject(complaint.id)} className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No pending complaints at the moment.</p>
      )}
    </div>
                      
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white p-4 text-center">
        &copy; 2025 <strong>Team Sanyojan</strong>. All rights reserved.
      </footer>
    </div>
  );
};

export default AdminDashboard;
