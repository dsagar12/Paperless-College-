import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { motion } from "framer-motion";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const LiveResults = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/candidates");
        const data = await response.json();
        setCandidates(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching results:", error);
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const chartData = {
    labels: candidates.map((c) => c.name),
    datasets: [
      {
        label: "Votes",
        data: candidates.map((c) => c.votes || 0),
        backgroundColor: "rgba(20, 184, 166, 0.6)", // teal tone
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white px-6 py-10 flex flex-col items-center">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-400 mb-8 text-center"
      >
        Live Election Results
      </motion.h2>

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-300 text-sm animate-pulse"
        >
          Fetching live data...
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 120 }}
          className="w-full max-w-4xl p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 shadow-lg backdrop-blur-md"
        >
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              },
              scales: {
                x: {
                  ticks: { color: "#ccc" },
                  grid: { color: "rgba(255,255,255,0.05)" },
                },
                y: {
                  ticks: { color: "#ccc" },
                  grid: { color: "rgba(255,255,255,0.05)" },
                },
              },
            }}
          />
        </motion.div>
      )}
    </div>
  );
};

export default LiveResults;