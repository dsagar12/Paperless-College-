
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  auth,
  submitComplaint,
  fetchApprovedComplaints,
  fetchComplaints,
  approveComplaint,
  rejectComplaint,
  logout,
} from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";
import { UserCircle, CheckCircle2, Trash2 } from "lucide-react";

/*
  UI updated only — core functionality preserved.
  - submitComplaint(...) usage unchanged
  - small normalization: if description is empty, we save "No details provided."
*/

const SkeletonCard = () => (
  <div className="animate-pulse bg-white/6 backdrop-blur-sm border border-white/8 rounded-2xl p-5 h-40" />
);

const ComplaintCard = ({ c, isAdmin, onApprove, onReject }) => (
  <motion.article
    layout
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    className="relative bg-white/5 backdrop-blur-md border border-white/8 rounded-2xl p-5 shadow-sm"
  >
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-lg bg-white/6 grid place-items-center">
        <UserCircle className="w-7 h-7 text-teal-300" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-slate-50 truncate">{c.complaintText?.title}</h3>
            <p className="text-sm text-slate-300 mt-1 line-clamp-3">{c.complaintText?.description}</p>
          </div>

          <div className="text-xs text-slate-400 text-right">
            <div>{c.isAnonymous ? "Anonymous" : c.userName || "User"}</div>
            <div className="mt-1">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}</div>
          </div>
        </div>

        {isAdmin && (
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => onApprove(c.id)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600/90 text-white text-sm"
            >
              <CheckCircle2 className="w-4 h-4" /> Approve
            </button>

            <button
              onClick={() => onReject(c.id)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-600/90 text-white text-sm"
            >
              <Trash2 className="w-4 h-4" /> Reject
            </button>
          </div>
        )}
      </div>
    </div>
  </motion.article>
);

const ComplaintPage = () => {
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");

  // Complaints state
  const [complaints, setComplaints] = useState([]);
  const [pendingComplaints, setPendingComplaints] = useState([]);
  const [loadingApproved, setLoadingApproved] = useState(true);
  const [loadingPending, setLoadingPending] = useState(false);

  // Admin toggle
  const [isAdmin, setIsAdmin] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Auth listener (preserved)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setUserName(user.displayName || "");
      } else {
        setUserId(null);
        setUserName("");
      }
    });
    return () => unsub();
  }, []);

  // Fetch approved complaints (preserved)
  useEffect(() => {
    setLoadingApproved(true);
    fetchApprovedComplaints()
      .then((data) => setComplaints(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Error fetching approved complaints:", err);
        toast.error("Failed to load approved complaints");
      })
      .finally(() => setLoadingApproved(false));
  }, []);

  // Fetch pending complaints when admin toggled (preserved)
  useEffect(() => {
    if (!isAdmin) return;
    setLoadingPending(true);
    fetchComplaints("pending")
      .then((data) => setPendingComplaints(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Error fetching pending complaints:", err);
        toast.error("Failed to load pending complaints");
      })
      .finally(() => setLoadingPending(false));
  }, [isAdmin]);

  // Handle complaint submission — same as yours except normalize description if empty
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return; // keep original requirement for title presence

    if (!userId) {
      setSubmissionMessage("You must be logged in to submit a complaint.");
      return;
    }

    // Preserve your payload shape; only ensure description fallback
    const normalizedDescription = description && description.trim() ? description.trim() : "No details provided.";
    const newComplaint = { title: title.trim(), description: normalizedDescription, isAnonymous, userId };

    setSubmitting(true);
    submitComplaint(newComplaint)
      .then(() => {
        setSubmissionMessage("Complaint submitted successfully!");
        setTitle("");
        setDescription("");
        setIsAnonymous(true);
        toast.success("Complaint submitted");
      })
      .catch((err) => {
        console.error("Submission error:", err);
        setSubmissionMessage("Error submitting complaint.");
        toast.error("Submission failed");
      })
      .finally(() => setSubmitting(false));
  };

  // Approve / reject functions (calls preserved)
  const handleApprove = async (id) => {
    try {
      await approveComplaint(id);
      // remove from pending list locally
      setPendingComplaints((p) => p.filter((c) => c.id !== id));
      // refresh approved
      fetchApprovedComplaints().then((data) => setComplaints(Array.isArray(data) ? data : []));
      toast.success("Approved");
    } catch (err) {
      console.error(err);
      toast.error("Approve failed");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectComplaint(id);
      setPendingComplaints((p) => p.filter((c) => c.id !== id));
      toast.success("Rejected");
    } catch (err) {
      console.error(err);
      toast.error("Reject failed");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      toast.error("Logout failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">
      <Toaster position="top-right" />
      <header className="bg-gradient-to-r from-blue-800 to-blue-900/90 backdrop-blur-md border-b border-white/6">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-blue-400">
              Team Sanyojan — Complaints
            </h1>
            <p className="text-xs text-gray-300 mt-1">Submit safely, reviewed by admins.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdmin((s) => !s)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${isAdmin ? "bg-emerald-600/90" : "bg-white/6"}`}
            >
              Admin: {isAdmin ? "ON" : "OFF"}
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded-md bg-rose-600/80 flex items-center gap-2 text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-1 bg-white/5 backdrop-blur-md border border-white/8 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-white/6 grid place-items-center">
              <UserCircle className="w-7 h-7 text-teal-300" />
            </div>
            <div>
              <div className="text-sm text-gray-300">{userName || "Guest"}</div>
              <div className="text-xs text-gray-400 mt-1">{userId ? "Signed in" : "Not signed in"}</div>
            </div>
          </div>

          <nav className="mt-4 space-y-2">
            <a href="/HomePage" className="block px-3 py-2 rounded-md hover:bg-white/6 transition">Home</a>
            <a href="/complaints" className="block px-3 py-2 rounded-md hover:bg-white/6 transition">Complaints</a>
            <a href="/contact" className="block px-3 py-2 rounded-md hover:bg-white/6 transition">Contact Admin</a>
          </nav>

          <div className="mt-6">
            <h4 className="text-sm text-gray-300 mb-2">Quick stats</h4>
            <div className="text-xs text-gray-200">Approved: <span className="text-teal-300 font-medium">{complaints.length}</span></div>
            <div className="text-xs text-gray-200 mt-1">Pending: <span className="text-yellow-300 font-medium">{pendingComplaints.length}</span></div>
          </div>
        </aside>

        {/* Main */}
        <main className="lg:col-span-3 space-y-6">
          {/* Submit form */}
          <motion.section
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="bg-white/6 backdrop-blur-md border border-white/8 rounded-2xl p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Submit a Complaint</h2>
                <p className="text-sm text-gray-300 mt-1">Your complaint will be reviewed by admins. You may remain anonymous.</p>
              </div>

              <div className="text-sm text-gray-400">{submissionMessage}</div>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Complaint title"
                className="w-full p-3 bg-white/8 border border-white/10 rounded-lg text-white placeholder:text-gray-400"
                aria-label="Complaint title"
              />

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Describe the issue in detail (optional)"
                className="w-full p-3 bg-white/8 border border-white/10 rounded-lg text-white placeholder:text-gray-400"
                aria-label="Complaint description"
              />

              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-300">Submit anonymously?</label>
                <select
                  value={isAnonymous ? "yes" : "no"}
                  onChange={(e) => setIsAnonymous(e.target.value === "yes")}
                  className="p-2 bg-white/8 border border-white/10 rounded-md text-white"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>

                <div className="ml-auto flex items-center gap-2">
                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.98 }}
                    disabled={submitting}
                    className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
                  >
                    {submitting ? "Submitting..." : "Submit Complaint"}
                  </motion.button>

                  <button
                    type="button"
                    onClick={() => {
                      setTitle("");
                      setDescription("");
                      setIsAnonymous(true);
                      setSubmissionMessage("");
                    }}
                    className="px-4 py-2 rounded-lg bg-white/6 hover:bg-white/8 text-sm"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </form>
          </motion.section>

          {/* Approved Complaints */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.08 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-white">Approved Complaints</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loadingApproved
                ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
                : complaints.length === 0
                ? <div className="rounded-2xl bg-white/6 p-6 text-gray-300">No approved complaints yet.</div>
                : complaints.map((c) => <ComplaintCard key={c.id} c={c} />)}
            </div>
          </motion.section>

          {/* Pending (admin) */}
          {isAdmin && (
            <motion.section
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="bg-white/6 backdrop-blur-md border border-white/8 rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Pending Complaints</h3>
                <div className="text-sm text-gray-300">{loadingPending ? "Loading..." : `${pendingComplaints.length} items`}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loadingPending
                  ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
                  : pendingComplaints.length === 0
                  ? <div className="rounded-2xl bg-white/6 p-6 text-gray-300">No pending complaints</div>
                  : pendingComplaints.map((c) => (
                      <ComplaintCard
                        key={c.id}
                        c={c}
                        isAdmin
                        onApprove={handleApprove}
                        onReject={handleReject}
                      />
                    ))}
              </div>
            </motion.section>
          )}
        </main>
      </div>
    </div>
  );
};

export default ComplaintPage;
