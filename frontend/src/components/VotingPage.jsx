import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { Share2, CheckCircle, XCircle } from "lucide-react";    

const SkeletonCard = () => (
  <div className="animate-pulse bg-white/6 backdrop-blur-sm border border-white/8 rounded-2xl p-6">
    <div className="h-28 w-28 rounded-full bg-white/8 mx-auto" />
    <div className="h-4 bg-white/8 rounded mt-4 w-3/5 mx-auto" />
    <div className="h-3 bg-white/8 rounded mt-2 w-1/2 mx-auto" />
    <div className="mt-4 space-y-2">
      <div className="h-3 bg-white/8 rounded" />
      <div className="h-3 bg-white/8 rounded w-4/5" />
    </div>
    <div className="mt-6 h-10 bg-white/8 rounded" />
  </div>
);

const VotingCard = ({
  candidate,
  i,
  votedCandidate,
  onVote,
  manifestoVisible,
  toggleManifesto,
}) => {
  const voted = votedCandidate === candidate._id;
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: i * 0.06, type: "spring", stiffness: 120 }}
      whileHover={{ translateY: -8 }}
      className="relative bg-gradient-to-br from-white/4 to-white/2 backdrop-blur-md border border-white/8 rounded-2xl p-6 text-center overflow-hidden shadow-md"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 w-40 h-40 rounded-full bg-gradient-to-br from-teal-500/8 to-blue-500/6 blur-2xl" />

      <img
        src={candidate.profileImage?.trim() ? candidate.profileImage : "/default-placeholder.png"}
        alt={candidate.name}
        className="w-28 h-28 object-cover rounded-full border-4 border-white/6 shadow-md mx-auto"
      />

      <h3 className="mt-4 text-xl font-semibold text-white truncate">{candidate.name}</h3>
      <p className="text-sm text-gray-300 mt-1 truncate">{candidate.position} • {candidate.department}</p>

      <div className="mt-3 flex items-center justify-center gap-3">
        <div className="text-xs text-gray-300 bg-white/6 px-3 py-1 rounded-full">Year: {candidate.year}</div>
        <div className="text-xs text-teal-300 bg-white/6 px-3 py-1 rounded-full">Votes: {candidate.votes || 0}</div>
      </div>

      <p className="mt-3 text-sm text-gray-300 line-clamp-3">{candidate.description}</p>

      {candidate.manifesto && (
        <button
          onClick={() => toggleManifesto(candidate._id)}
          className="mt-3 text-sm text-teal-300 hover:text-white underline transition"
          aria-expanded={!!manifestoVisible[candidate._id]}
        >
          {manifestoVisible[candidate._id] ? "🔽 Hide Manifesto" : "📜 View Manifesto"}
        </button>
      )}

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={manifestoVisible[candidate._id] ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.28 }}
        className="mt-3 overflow-hidden"
      >
        {manifestoVisible[candidate._id] && (
          <div className="text-left bg-white/6 p-4 rounded-lg text-gray-200 text-sm">
            {candidate.manifesto}
          </div>
        )}
      </motion.div>

      <div className="mt-5 flex items-center gap-3 justify-center">
        <motion.button
          onClick={() => onVote(candidate._id)}
          whileTap={{ scale: voted ? 1 : 0.98 }}
          whileHover={voted ? {} : { scale: 1.03 }}
          disabled={!!voted}
          className={`px-6 py-2 rounded-lg font-semibold text-white transition ${
            voted ? "bg-gray-500 cursor-not-allowed" : "bg-emerald-500 hover:bg-emerald-600"
          }`}
          aria-pressed={!!voted}
        >
          {voted ? "Voted" : "Vote"}
        </motion.button>

        <button
          onClick={() => {
            try {
              navigator.clipboard?.writeText(window.location.href);
              toast.success("Link copied");
            } catch {
              toast.error("Could not copy");
            }
          }}
          className="px-3 py-2 rounded-lg bg-white/6 text-sm text-gray-200 hover:bg-white/8 transition flex items-center gap-2"
          title="Copy page link"
        >
          <Share2 className="w-4 h-4" /> Share
        </button>
      </div>

      <div className="absolute top-4 left-4">
        {voted ? (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-emerald-700/20 text-emerald-300">
            <CheckCircle className="w-4 h-4" /> Voted
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-700/20 text-yellow-300">
            Live
          </span>
        )}
      </div>
    </motion.article>
  );
};

const VotingSection = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votedCandidate, setVotedCandidate] = useState(localStorage.getItem("votedCandidate") || null);
  const [manifestoVisible, setManifestoVisible] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchCandidates = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/candidates");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (!mounted) return;
        setCandidates(Array.isArray(data) ? data.reverse() : []);
      } catch (err) {
        console.error(err);
        toast.error("Unable to load candidates");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchCandidates();
    return () => {
      mounted = false;
    };
  }, []);

  const handleVote = async (candidateId) => {
    if (votedCandidate) {
      toast.error("You have already voted");
      return;
    }
    if (submitting) return;

    setSubmitting(true);
    const tId = toast.loading("Submitting vote...");
    try {
      const res = await fetch(`http://localhost:5000/api/vote/${candidateId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Vote failed");
      const updated = await res.json();

      setCandidates((prev) =>
        prev.map((c) => (c._id === candidateId ? { ...c, votes: updated.votes ?? c.votes } : c))
      );
      localStorage.setItem("votedCandidate", candidateId);
      setVotedCandidate(candidateId);
      toast.success("Vote recorded ✅", { id: tId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to record vote", { id: tId });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleManifesto = (candidateId) =>
    setManifestoVisible((prev) => ({ ...prev, [candidateId]: !prev[candidateId] }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900/80 via-indigo-900/60 to-black text-white py-12 px-6">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        <motion.header
          initial={{ y: -18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-blue-400">
              🗳️ Live Voting
            </h1>
            <p className="text-sm text-gray-300 mt-2 max-w-xl">
              Choose your representative — votes are final. Results are live and updated in real time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => navigate("/results")}
              whileHover={{ scale: 1.03 }}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-blue-500 text-sm font-semibold shadow"
            >
              📊 View Live Results
            </motion.button>

            <div className="text-sm text-gray-300">
              {loading ? "Loading..." : `${candidates.length} candidate${candidates.length !== 1 ? "s" : ""}`}
            </div>
          </div>
        </motion.header>

        <section>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))}
            </div>
          ) : candidates.length === 0 ? (
            <div className="rounded-2xl bg-white/6 backdrop-blur-md border border-white/8 p-8 text-center">
              <XCircle className="w-12 h-12 mx-auto text-rose-400" />
              <h3 className="mt-4 text-lg font-semibold">No candidates found</h3>
              <p className="mt-2 text-sm text-gray-300">Check back later or contact admin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.map((candidate, idx) => (
                <VotingCard
                  key={candidate._id}
                  candidate={candidate}
                  i={idx}
                  votedCandidate={votedCandidate}
                  onVote={handleVote}
                  manifestoVisible={manifestoVisible}
                  toggleManifesto={toggleManifesto}
                />
              ))}
            </div>
          )}
        </section>

        <footer className="mt-12 text-center text-gray-400">
          © {new Date().getFullYear()} Automated College System — Crafted with React and Framer Motion.
        </footer>
      </div>
    </div>
  );
};

export default VotingSection;

