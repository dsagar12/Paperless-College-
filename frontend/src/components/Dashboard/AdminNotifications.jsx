import React, { useState } from "react"; import { motion } from "framer-motion"; import { db } from "../../firebase"; import { collection, addDoc, serverTimestamp } from "firebase/firestore"; import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

const AdminNotifications = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState({ type: "", text: "" }); // { type: 'success'|'error', text: string }

  const clearResult = () => setResult({ type: "", text: "" });

  const handleSendNotification = async (e) => {
    e.preventDefault();
    clearResult();

    const t = title.trim();
    const m = message.trim();
    if (!t || !m) {
      setResult({ type: "error", text: "Please enter both title and message." });
      return;
    }

    try {
      setSubmitting(true);
      await addDoc(collection(db, "notifications"), {
        title: t,
        message: m,
        timestamp: serverTimestamp(),
      });

      setResult({ type: "success", text: "Notification sent to users." });
      setTitle("");
      setMessage("");
      setTimeout(clearResult, 3500);
    } catch (err) {
      console.error("send notification error:", err);
      setResult({ type: "error", text: "Failed to send. Check console." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-start justify-center p-28 bg-gradient-to-br from-slate-900 to-black">
      <motion.section
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36 }}
        className="w-full max-w-2xl rounded-2xl overflow-hidden border border-white/6 bg-gradient-to-br from-white/6 to-white/4 backdrop-blur-md shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/8">
          <div>
            <h2 className="text-2xl font-extrabold text-white">Broadcast Notification</h2>
            <p className="text-sm text-slate-300 mt-1">Quickly send messages to all users. Use short title + detailed message.</p>
          </div>

          <div className="flex items-center gap-3">
            {result.type === "success" && (
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="inline-flex items-center gap-2 bg-emerald-700/10 text-emerald-200 px-3 py-1 rounded-full">
                <CheckCircleIcon className="w-5 h-5 text-emerald-300" />
                <span className="text-sm font-medium">{result.text}</span>
              </motion.div>
            )}
            {result.type === "error" && (
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="inline-flex items-center gap-2 bg-rose-700/10 text-rose-200 px-3 py-1 rounded-full">
                <XCircleIcon className="w-5 h-5 text-rose-300" />
                <span className="text-sm font-medium">{result.text}</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSendNotification} className="p-6 space-y-4">
          <div>
            <label htmlFor="notif-title" className="block text-sm font-medium text-slate-200 mb-2">
              Title
            </label>
            <input
              id="notif-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              placeholder="Short headline (max 120 chars)"
              className="w-full rounded-lg px-3 py-2 bg-white/8 text-white placeholder:text-slate-400 border border-white/8 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
            />
            <div className="flex justify-between mt-2 text-xs text-slate-400">
              <div className="italic">Make it concise and actionable.</div>
              <div>{title.length}/120</div>
            </div>
          </div>

          <div>
            <label htmlFor="notif-message" className="block text-sm font-medium text-slate-200 mb-2">
              Message
            </label>
            <textarea
              id="notif-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={2000}
              placeholder="Detailed message. Add timings, links or instructions."
              className="w-full min-h-[140px] rounded-lg px-3 py-3 bg-white/8 text-white placeholder:text-slate-400 border border-white/8 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
            />
            <div className="mt-2 text-right text-xs text-slate-400">{message.length}/2000</div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setTitle("");
                  setMessage("");
                  clearResult();
                }}
                className="px-4 py-2 rounded-lg bg-white/10 border border-white/8 text-white hover:bg-white/12 transition"
              >
                Reset
              </button>

              <button
                type="submit"
                disabled={submitting}
                className={`px-5 py-2 rounded-lg text-white font-semibold shadow ${submitting ? "bg-teal-400/60 cursor-wait" : "bg-teal-500 hover:bg-teal-600"} transition`}
              >
                {submitting ? "Sending..." : "Send Notification"}
              </button>
            </div>

            <div className="text-xs text-slate-400">Tip: include clear action + time. Avoid sending duplicate alerts.</div>
          </div>
        </form>
      </motion.section>
    </div>
  );
};

export default AdminNotifications;
