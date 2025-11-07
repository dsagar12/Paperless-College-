import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  HomeIcon,
  BellIcon,
  CalendarIcon,
  DocumentTextIcon,
  ChatBubbleBottomCenterTextIcon,
  BanknotesIcon,
  ExclamationCircleIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";

const ModuleCard = ({ icon: Icon, title, description, link, i }) => (
  <motion.div
    key={title}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.08, type: "spring", stiffness: 110 }}
    whileHover={{ scale: 1.03, y: -4 }}
    whileTap={{ scale: 0.98 }}
    className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-white/4 to-white/2 border border-white/6 shadow-lg"
  >
    <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-gradient-to-br from-teal-600/20 to-blue-600/10 blur-2xl pointer-events-none" />
    <div className="flex items-start gap-4">
      <div className="p-3 rounded-lg bg-white/6">
        <Icon className="w-7 h-7 text-teal-300" />
      </div>
      <div className="text-left">
        <h3 className="text-white font-semibold">{title}</h3>
        <p className="text-sm text-gray-300 mt-1">{description}</p>
        <Link to={link} className="mt-3 inline-block text-sm text-teal-300 hover:text-white">
          Open →
        </Link>
      </div>
    </div>
  </motion.div>
);

const HomePage = () => {
  const modules = [
    { id: 1, title: "Elections", description: "Secure voting & live tracking", icon: HomeIcon, link: "/vote" },
    { id: 2, title: "Notifications", description: "Health & leave alerts", icon: BellIcon, link: "/notifications" },
    { id: 3, title: "Booking", description: "Reserve campus facilities", icon: CalendarIcon, link: "/booking" },
    { id: 4, title: "Applications", description: "Submit & track approvals", icon: DocumentTextIcon, link: "/applications" },
    { id: 5, title: "Complaints", description: "Anonymous complaint system", icon: ChatBubbleBottomCenterTextIcon, link: "/complaints" },
    { id: 6, title: "Budget Tracking", description: "Transparent finance records", icon: BanknotesIcon, link: "/budget" },
    { id: 7, title: "Cheating Record", description: "Academic integrity & records", icon: ExclamationCircleIcon, link: "/cheating" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">
      {/* Topbar */}
      <nav className="bg-gradient-to-r from-blue-800 to-blue-900/95 backdrop-blur-md border-b border-white/6">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-white/6">
              <Bars3Icon className="w-6 h-6 text-teal-300" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-blue-400">
                Team Sanyojan
              </h1>
              <p className="text-xs text-gray-300 -mt-1">Automated College System</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {modules.slice(0, 5).map((m) => (
              <Link key={m.id} to={m.link} className="text-sm text-gray-200 hover:text-white transition">
                {m.title}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/profile" className="text-sm text-gray-200 hover:text-white">Profile</Link>
            <Link to="/logout" className="px-3 py-1 text-sm font-medium rounded-md bg-red-600/20 hover:bg-red-600/30 transition">
              Logout
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-72 flex-col p-6 gap-6 bg-gradient-to-b from-white/3 to-white/2 backdrop-blur-md border-r border-white/6">
          <div>
            <h2 className="text-lg font-semibold text-teal-300">Dashboard</h2>
            <p className="text-xs text-gray-300 mt-1">Quick access to modules</p>
          </div>

          <nav className="flex-1">
            <ul className="space-y-2">
              {modules.map((m) => (
                <li key={m.id}>
                  <Link to={m.link} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/6 transition">
                    <m.icon className="w-5 h-5 text-teal-300" />
                    <span className="text-sm text-gray-100 font-medium">{m.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="text-sm text-gray-300">
            <div>Signed in as</div>
            <div className="mt-1 font-medium text-white">Student / Staff</div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <header className="flex items-start justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-blue-400">
                Welcome to the Automated College System
              </h2>
              <p className="text-gray-300 mt-2 max-w-xl">
                Ensuring efficiency, fairness, and transparency across campus operations.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-600 to-blue-600 text-sm font-semibold shadow"
              >
                Overview
              </motion.button>
              <div className="w-12 h-12 rounded-full bg-white/6 grid place-items-center">
                <HomeIcon className="w-6 h-6 text-teal-300" />
              </div>
            </div>
          </header>

          {/* Modules grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {modules.map((m, idx) => (
              <ModuleCard key={m.id} icon={m.icon} title={m.title} description={m.description} link={m.link} i={idx} />
            ))}
          </section>

          {/* Feature highlights */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-white/4 to-white/2 border border-white/6 shadow-lg"
            >
              <h4 className="text-xl font-semibold text-white">Secure Elections</h4>
              <p className="text-sm text-gray-300 mt-2">
                End-to-end encrypted voting with tamper-evident records and real-time turnout tracking.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <Link to="/vote" className="text-sm text-teal-300 hover:text-white">Go to Elections →</Link>
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-700/20 text-emerald-300">Live</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-white/4 to-white/2 border border-white/6 shadow-lg"
            >
              <h4 className="text-xl font-semibold text-white">Transparent Finance</h4>
              <p className="text-sm text-gray-300 mt-2">
                Keep track of budgets, approvals, and audit-ready expense logs for institutional accountability.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <Link to="/budget" className="text-sm text-teal-300 hover:text-white">View Budgets →</Link>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-700/20 text-blue-300">Verified</span>
              </div>
            </motion.div>
          </section>

          <footer className="text-center text-gray-400 mt-8 pt-6 border-t border-white/6">
            © {new Date().getFullYear()} Team Sanyojan. Crafted with modern UI, React, and Framer Motion.
          </footer>
        </main>
      </div>
    </div>
  );
};

export default HomePage;