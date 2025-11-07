import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { db, collection, getDocs, updateDoc, doc } from "../../firebase";
import toast, { Toaster } from "react-hot-toast";
import {
  ChartBarIcon,
  BellIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";

const SectionCard = ({ icon: Icon, title, desc, link, i }) => {
  return (
    <motion.div
      custom={i}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 18 },
        visible: (i) => ({
          opacity: 1,
          y: 0,
          transition: { delay: i * 0.08, type: "spring", stiffness: 90 },
        }),
      }}
      whileHover={{ scale: 1.03, y: -4 }}
      className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-white/6 to-white/3 border border-white/6 shadow-lg hover:shadow-teal-500/20 transition"
    >
      <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-gradient-to-br from-teal-600/20 to-blue-600/10 blur-2xl pointer-events-none" />
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-white/6">
          <Icon className="w-7 h-7 text-teal-300" />
        </div>
        <div>
          <h3 className="text-white font-semibold">{title}</h3>
          <p className="text-sm text-gray-300 mt-1">{desc}</p>
          <Link to={link} className="inline-block mt-3 text-sm text-teal-300 hover:text-white">
            Manage →
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const CandidateCard = ({ candidate, onApprove }) => {
  const statusColors =
    candidate.status === "approved"
      ? "bg-emerald-700/20 text-emerald-300"
      : candidate.status === "rejected"
      ? "bg-red-700/20 text-red-300"
      : "bg-yellow-700/20 text-yellow-300";

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="relative p-5 rounded-xl bg-gradient-to-br from-white/4 to-white/2 border border-white/6 shadow-md"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-white/6 flex items-center justify-center">
          <UserCircleIcon className="w-8 h-8 text-teal-300" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="text-white font-semibold">{candidate.name}</h4>
              <p className="text-sm text-gray-300 mt-1 line-clamp-2">{candidate.bio || "No bio provided."}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors}`}>
              {candidate.status}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3">
            {candidate.status === "pending" ? (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => onApprove(candidate.id)}
                className="flex-1 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-sm font-semibold shadow-md hover:opacity-95"
              >
                Approve Candidate
              </motion.button>
            ) : (
              <button disabled className="flex-1 py-2 rounded-lg bg-white/6 text-sm text-gray-300">
                {candidate.status === "approved" ? "Approved" : "Actioned"}
              </button>
            )}
            <Link
              to={`/admin/candidates/${candidate.id}`}
              className="text-sm text-teal-300 hover:text-white px-3 py-2 rounded-lg"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const skeletonArray = Array.from({ length: 6 });

const AdminDashboard = () => {
  const [elections, setElections] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const electionsSnapshot = await getDocs(collection(db, "elections"));
        setElections(electionsSnapshot.docs.map((d) => ({ id: d.id, ...d.data() })));

        const candidatesSnapshot = await getDocs(collection(db, "candidates"));
        setCandidates(candidatesSnapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        toast.error("Failed to fetch data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApproveCandidate = async (candidateId) => {
    const t = toast.loading("Approving...");
    try {
      const candidateRef = doc(db, "candidates", candidateId);
      await updateDoc(candidateRef, { status: "approved" });
      setCandidates((prev) => prev.map((c) => (c.id === candidateId ? { ...c, status: "approved" } : c)));
      toast.success("Candidate approved ✅", { id: t });
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve candidate", { id: t });
    }
  };

  const sections = [
    { title: "Manage Elections", desc: "View, create, and monitor elections.", icon: ChartBarIcon, link: "/admin/election" },
    { title: "Complaints", desc: "Review & resolve student issues.", icon: ChatBubbleLeftRightIcon, link: "/admin/complaints" },
    { title: "Budgets", desc: "Track budgets & verify expenses.", icon: CurrencyDollarIcon, link: "/admin/budgets" },
    { title: "Notifications", desc: "Send & monitor campus alerts.", icon: BellIcon, link: "/admin/notifications" },
    { title: "Bookings", desc: "Approve or cancel facility bookings.", icon: CalendarIcon, link: "/admin/bookings" },
    { title: "Applications", desc: "Review & approve applications.", icon: DocumentTextIcon, link: "/admin/applications" },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">
      <Toaster position="top-right" />
      {/* SIDEBAR */}
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.45 }}
        className="hidden md:flex flex-col w-72 p-6 gap-6 bg-gradient-to-b from-white/3 to-white/2 backdrop-blur-md border-r border-white/6"
      >
        <div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-400">
            Admin Panel
          </h1>
          <p className="text-sm text-gray-300 mt-1">Overview & management</p>
        </div>

        <nav className="flex-1 space-y-2">
          {sections.map((s, i) => (
            <Link key={s.title} to={s.link} className="block">
              <motion.div
                whileHover={{ x: 6 }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/6 transition"
              >
                <div className="p-2 rounded-md bg-white/6">
                  <s.icon className="w-5 h-5 text-teal-300" />
                </div>
                <div className="text-sm text-gray-200 font-medium">{s.title}</div>
              </motion.div>
            </Link>
          ))}
        </nav>

        <div className="pt-4 border-t border-white/6">
          <div className="text-xs text-gray-300">Signed in as</div>
          <div className="mt-2 text-sm font-medium">Administrator</div>
          <div className="text-xs text-gray-400 mt-1">Automated College System</div>
        </div>
      </motion.aside>

      {/* MAIN */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between gap-4 mb-8"
        >
          <div>
            <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-blue-400">
              Welcome, Admin
            </h2>
            <p className="text-sm text-gray-300 mt-1">Here's the latest summary of activities and approvals.</p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-600 to-blue-600 text-sm font-semibold shadow"
            >
              Dashboard Overview
            </motion.button>
            <motion.div whileHover={{ scale: 1.06 }} className="w-12 h-12 rounded-full bg-white/6 grid place-items-center">
              <CheckBadgeIcon className="w-6 h-6 text-teal-300" />
            </motion.div>
          </div>
        </motion.header>

        {/* CARDS GRID */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {sections.map((s, i) => (
            <SectionCard key={s.title} icon={s.icon} title={s.title} desc={s.desc} link={s.link} i={i} />
          ))}
        </section>

        {/* ELECTIONS */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-teal-300">Active Elections</h3>
            <Link to="/admin/election" className="text-sm text-teal-300 hover:text-white">
              See all elections →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? skeletonArray.map((_, idx) => (
                  <div
                    key={idx}
                    className="animate-pulse h-36 rounded-xl bg-white/6 border border-white/6"
                  />
                ))
              : elections.length === 0
              ? (
                <div className="col-span-full p-6 rounded-xl bg-white/6 text-gray-300">
                  No elections found.
                </div>
              )
              : elections.map((e) => (
                  <motion.div
                    key={e.id}
                    whileHover={{ scale: 1.03 }}
                    className="p-5 rounded-xl bg-gradient-to-br from-white/4 to-white/2 border border-white/6 shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-semibold">{e.title}</h4>
                        <p className="text-sm text-gray-300 mt-1 truncate">{e.description || "No description"}</p>
                      </div>
                      <div className="text-xs px-3 py-1 rounded-full bg-white/6 text-gray-200">
                        {e.status}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <Link to={`/admin/elections/${e.id}`} className="text-sm text-teal-300 hover:text-white">
                        View Details →
                      </Link>
                      <div className="text-xs text-gray-400">Starts: {e.startDate || "TBD"}</div>
                    </div>
                  </motion.div>
                ))}
          </div>
        </motion.section>

        {/* CANDIDATES */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-teal-300">Candidate Applications</h3>
            <Link to="/admin/applications" className="text-sm text-teal-300 hover:text-white">
              Review all →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? skeletonArray.map((_, i) => (
                  <div key={i} className="animate-pulse p-5 rounded-xl bg-white/6 h-36" />
                ))
              : candidates.length === 0
              ? (
                <div className="col-span-full p-6 rounded-xl bg-white/6 text-gray-300">
                  No candidate applications yet.
                </div>
              )
              : candidates.map((c) => (
                  <CandidateCard key={c.id} candidate={c} onApprove={handleApproveCandidate} />
                ))}
          </div>
        </motion.section>

        <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-400 mt-12 pt-6 border-t border-white/6">
          © {new Date().getFullYear()} Automated College System. Crafted with modern UI, React and Framer Motion.
        </motion.footer>
      </main>
    </div>
  );
};

export default AdminDashboard;