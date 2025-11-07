import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PrivateRoute from './routes/PrivateRoute';
import NotificationComponent from './components/NotificationComponent';
import BookingComponent from './components/BookingComponent';
import ComplaintPage from './pages/ComplaintPage';
import ApplicationComponent from './components/ApplicationComponent';
import AdminLogin from './pages/AdminLogin';
import BudgetComponent from './components/BudgetComponent';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ParentPortal from './pages/ParentPortal';
import AdminComplaints from './components/Dashboard/AdminComplaints';
import AdminApprovedComplaints from './components/Dashboard/AdminApprovedComplaints';
import AdminRejectedComplaints from './components/Dashboard/AdminRejectedComplaints';
import AdminPendingComplaints from './components/Dashboard/AdminPendingComplaints';
import AdminNotifications from './components/Dashboard/AdminNotifications';
import './index.css';
import LiveResults from "./components/LiveResult";
import ElectionParticipant from './pages/electionparticipant';
import CandidateRegistration from './pages/CandidateRegistration';
import VotingPage from "./components/VotingPage";
const App = () => {
  // ✅ Define uploadedImageURL in state
  const [uploadedImageURL, setUploadedImageURL] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "sagar-project");
    data.append("cloud_name", "djilifntv");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/djilifntv/image/upload", {
        method: "POST",
        body: data,
      });

      const uploadedImage = await res.json();
      setUploadedImageURL(uploadedImage.url); // ✅ Store image URL in state
      console.log("Uploaded Image URL:", uploadedImage.url);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <Router>
     
      {/* Routes */}
      <Routes>
      <Route path="/results" element={<LiveResults />} />
      
        <Route path='/admin/election' element={<CandidateRegistration/>} />
        <Route path="/electionparticipant" element={<ElectionParticipant/>}/>
        <Route path="/vote" element={<VotingPage />} />
        <Route path="/admin-dashboard" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/complaints" element={<PrivateRoute role="admin"><AdminComplaints /></PrivateRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<SignupPage />} />
        <Route path="/student-dashboard" element={<HomePage />} />
        <Route path="/parent-portal" element={<ParentPortal />} />
        <Route path="/notifications" element={<NotificationComponent />} />
        <Route path="/booking" element={<BookingComponent />} />
        <Route path="/applications" element={<ApplicationComponent />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/budget" element={<BudgetComponent />} />
        <Route path="/complaints" element={<ComplaintPage />} />
        <Route path="/admin/approved" element={<AdminApprovedComplaints />} />
        <Route path="/admin/rejected" element={<AdminRejectedComplaints />} />
        <Route path="/admin/pending" element={<AdminPendingComplaints />} />
        <Route path="/admin/notifications" element={<AdminNotifications />} />
      </Routes>
    </Router>
  );  
};

export default App;
