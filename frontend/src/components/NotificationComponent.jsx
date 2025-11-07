import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Clock, Check, Trash2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

/**
 * Modern, glassy Notifications list with:
 * - real-time updates (onSnapshot)
 * - skeleton loader
 * - animated entrance + exit using Framer Motion
 * - mark-as-read and delete actions with optimistic UI + toasts
 * - accessible timestamps and responsive layout
 */

const NotificationItem = ({ note, index, onMarkRead, onDelete }) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, type: "spring", stiffness: 120 } }),
    exit: { opacity: 0, scale: 0.97, transition: { duration: 0.25 } },
  };

  const timeText = note.timestamp?.toDate ? note.timestamp.toDate().toLocaleString() : "Just now";

  return (
    <motion.li
      layout
      custom={index}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="relative bg-white/6 backdrop-blur-md border border-white/8 rounded-2xl p-5 shadow-md hover:shadow-teal-400/20 transition"
    >
      <div className="flex items-start gap-4">
        <div className="flex-none w-12 h-12 rounded-lg bg-gradient-to-br from-teal-600/10 to-blue-600/8 grid place-items-center">
          <Bell className="w-6 h-6 text-teal-300" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-white truncate">{note.title}</h3>
              <p className="text-sm text-gray-300 mt-1 truncate">{note.message}</p>
            </div>

            <div className="flex-shrink-0 text-xs text-gray-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{timeText}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => onMarkRead(note)}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                note.read
                  ? "bg-white/6 text-gray-300 cursor-default"
                  : "bg-emerald-600/80 hover:brightness-95 text-white"
              }`}
              aria-pressed={!!note.read}
              aria-label={note.read ? "Already marked read" : "Mark as read"}
            >
              <Check className="w-4 h-4" />
              {note.read ? "Read" : "Mark read"}
            </button>

            <button
              onClick={() => onDelete(note)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-rose-600/80 hover:brightness-95 text-white"
              aria-label="Delete notification"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {note.read ? (
        <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full bg-emerald-700/20 text-emerald-300">Read</span>
      ) : (
        <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full bg-yellow-700/20 text-yellow-300">New</span>
      )}
    </motion.li>
  );
};

const SkeletonItem = () => (
  <div className="animate-pulse bg-white/6 backdrop-blur-md border border-white/8 rounded-2xl p-5 h-28" />
);

const NotificationsList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "notifications"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setNotifications(data);
        setLoading(false);
      },
      (err) => {
        console.error("Notifications listener error:", err);
        toast.error("Failed to load notifications");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const markAsRead = async (note) => {
    if (note.read) {
      toast("Already marked as read", { icon: "ℹ️" });
      return;
    }
    const t = toast.loading("Marking read...");
    try {
      const ref = doc(db, "notifications", note.id);
      await updateDoc(ref, { read: true });
      toast.success("Marked as read", { id: t });
      // optimistic UI handled by real-time listener
    } catch (err) {
      console.error(err);
      toast.error("Could not mark read", { id: t });
    }
  };

  const deleteNotification = async (note) => {
    const t = toast.loading("Deleting...");
    try {
      const ref = doc(db, "notifications", note.id);
      await deleteDoc(ref);
      toast.success("Deleted", { id: t });
      // real-time listener will remove from UI
    } catch (err) {
      console.error(err);
      toast.error("Could not delete", { id: t });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white p-6">
      <Toaster position="top-right" />
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 110 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="p-3 rounded-lg bg-gradient-to-br from-teal-600/10 to-blue-600/8">
            <Bell className="w-7 h-7 text-teal-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-blue-400">
              Notifications
            </h1>
            <p className="text-sm text-gray-300 mt-1">Real-time alerts and campus announcements</p>
          </div>
        </motion.header>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="flex items-center justify-between mb-4"
        >
          <div className="text-sm text-gray-300">
            {loading ? "Loading..." : `${notifications.length} notification${notifications.length !== 1 ? "s" : ""}`}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                // mark all unread as read
                const unread = notifications.filter((n) => !n.read);
                if (unread.length === 0) {
                  toast("No unread notifications", { icon: "ℹ️" });
                  return;
                }
                unread.forEach((n) => {
                  const ref = doc(db, "notifications", n.id);
                  updateDoc(ref, { read: true }).catch((err) => {
                    console.error("bulk mark read failed", err);
                    toast.error("Some items failed to mark read");
                  });
                });
                toast.success("Marked all as read");
              }}
              className="px-3 py-2 rounded-lg bg-white/6 hover:bg-white/8 text-sm"
            >
              Mark all read
            </button>

            <button
              onClick={() => {
                // delete all read notifications
                const read = notifications.filter((n) => n.read);
                if (read.length === 0) {
                  toast("No read notifications to delete", { icon: "ℹ️" });
                  return;
                }
                read.forEach((n) => {
                  const ref = doc(db, "notifications", n.id);
                  deleteDoc(ref).catch((err) => {
                    console.error("bulk delete failed", err);
                    toast.error("Some items failed to delete");
                  });
                });
                toast.success("Deleting read notifications");
              }}
              className="px-3 py-2 rounded-lg bg-rose-600/80 hover:brightness-95 text-white text-sm"
            >
              Clear read
            </button>
          </div>
        </motion.div>

        {/* List */}
        <motion.ul layout className="space-y-4">
          <AnimatePresence>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonItem key={i} />)
              : notifications.length === 0
              ? (
                <motion.li
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-gray-300 py-12 bg-white/6 backdrop-blur-md rounded-2xl border border-white/8"
                >
                  No notifications found.
                </motion.li>
              )
              : notifications.map((note, i) => (
                  <NotificationItem
                    key={note.id}
                    note={note}
                    index={i}
                    onMarkRead={markAsRead}
                    onDelete={deleteNotification}
                  />
                ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </div>
  );
};

export default NotificationsList;