import React, { useEffect, useState } from "react";
import { db, collection, getDocs, doc, updateDoc, onSnapshot } from "../firebase";

const VotingSection = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votedCandidate, setVotedCandidate] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "candidates"));
        const candidatesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCandidates(candidatesList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching candidates:", error);
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "candidates"), (snapshot) => {
      const updatedCandidates = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCandidates(updatedCandidates);
    });
    return () => unsubscribe();
  }, []);

  const handleVote = async (candidateId) => {
    if (votedCandidate) {
      alert("You have already voted!");
      return;
    }

    try {
      const candidateRef = doc(db, "candidates", candidateId);
      const selectedCandidate = candidates.find((cand) => cand.id === candidateId);
      await updateDoc(candidateRef, {
        votes: (selectedCandidate.votes || 0) + 1,
      });
      setVotedCandidate(candidateId);
    } catch (error) {
      console.error("Error updating vote count:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Live Voting</h2>
        {loading ? (
          <p className="text-center">Loading candidates...</p>
        ) : (
          <div className="space-y-4">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="p-4 border rounded-lg flex justify-between items-center bg-gray-50"
              >
                <div>
                  <h3 className="text-lg font-semibold">{candidate.name}</h3>
                  <p className="text-gray-600">{candidate.department} - {candidate.year}</p>
                  <p className="text-blue-600 font-bold">Votes: {candidate.votes || 0}</p>
                </div>
                <button
                  onClick={() => handleVote(candidate.id)}
                  disabled={!!votedCandidate}
                  className={`px-4 py-2 rounded-lg text-white font-semibold transition ${votedCandidate ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
                >
                  {votedCandidate ? "Voted" : "Vote"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VotingSection;
