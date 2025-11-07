import React, { useState, useEffect } from "react";
import { fetchComplaints } from "../../firebase"; // ✅ Ensure correct path

const AdminRejectedComplaints = () => {
  const [rejectedComplaints, setRejectedComplaints] = useState([]);

  useEffect(() => {
    const getRejectedComplaints = async () => {
      try {
        const response = await fetchComplaints("rejected"); // ✅ Fetch only rejected complaints
        if (!response.success) {
          throw new Error("Error fetching complaints");
        }
        setRejectedComplaints(response.complaints);
      } catch (error) {
        console.error("Error fetching rejected complaints:", error);
      }
    };

    getRejectedComplaints();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Rejected Complaints</h2>
      {rejectedComplaints.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rejectedComplaints.map((complaint) => (
            <div key={complaint.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
              <h3 className="text-xl font-semibold text-gray-800">{complaint.complaintText.title || "No Title"}</h3>
              <p className="text-gray-600 mt-2"><strong>Description:</strong> {complaint.complaintText.description || "N/A"}</p>
              <p className="text-gray-600 mt-2"><strong>User ID:</strong> {complaint.userId || "N/A"}</p>
              <p className="text-gray-600">
                <strong>Timestamp:</strong> {complaint.timestamp?.seconds ? new Date(complaint.timestamp.seconds * 1000).toLocaleString() : "N/A"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">Fetching complaints.........</p>
      )}
    </div>
  );
};

export default AdminRejectedComplaints;
