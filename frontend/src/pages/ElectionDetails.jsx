import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, collection, getDocs, query, where } from "../firebase";

const ElectionDetails = () => {
  const { electionId } = useParams(); // Get electionId from the URL
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);

  // Fetch election details and candidates
  useEffect(() => {
    const fetchElectionDetails = async () => {
      try {
        // Fetch election details
        const electionsRef = collection(db, "elections");
        const q = query(electionsRef, where("__name__", "==", electionId));
        const electionSnapshot = await getDocs(q);
        if (!electionSnapshot.empty) {
          setElection({ id: electionSnapshot.docs[0].id, ...electionSnapshot.docs[0].data() });
        }

        // Fetch candidates for this election
        const candidatesRef = collection(db, "candidates");
        const candidatesQuery = query(candidatesRef, where("electionId", "==", electionId));
        const candidatesSnapshot = await getDocs(candidatesQuery);
        setCandidates(candidatesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching election details:", error);
      }
    };

    fetchElectionDetails();
  }, [electionId]);

  if (!election) {
    return <div className="p-6 text-gray-600">Loading election details...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{election.title}</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600 mb-2"><strong>Status:</strong> {election.status}</p>
        <p className="text-gray-600 mb-2"><strong>Start Date:</strong> {election.startDate?.toDate().toLocaleString()}</p>
        <p className="text-gray-600 mb-2"><strong>End Date:</strong> {election.endDate?.toDate().toLocaleString()}</p>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Candidates</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map(candidate => (
          <div key={candidate.id} className="bg-white p-6 rounded-lg shadow-md">
            <img src={candidate.photoUrl} alt={candidate.name} className="w-24 h-24 rounded-full mx-auto mb-4" />
            <h3 className="text-xl font-bold text-center text-gray-800">{candidate.name}</h3>
            <p className="text-gray-600 text-center">{candidate.bio}</p>
            <p className="text-gray-600 text-center"><strong>Status:</strong> {candidate.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ElectionDetails;