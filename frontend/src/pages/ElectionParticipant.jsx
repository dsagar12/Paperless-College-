import { useState, useEffect } from "react";

const ElectionParticipant = () => {
    const [candidates, setCandidates] = useState([]);
  
    useEffect(() => {
      fetch("http://localhost:5000/api/candidates")
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched Candidates Data:", data);
          setCandidates(data);
        })
        .catch((error) => console.error("Error fetching candidates:", error));
    }, []);
  
    return (
      <div className="min-h-screen bg-gray-100 py-10">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Election Candidates</h1>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {candidates.length > 0 ? (
            candidates.map((candidate) => (
              <div key={candidate._id} className="bg-white shadow-lg rounded-xl p-6 transform hover:scale-105 transition duration-300">
                <img
                  src={candidate.profileImage || "https://via.placeholder.com/150"}
                  alt={candidate.name}
                  className="w-32 h-32 object-cover rounded-full mx-auto mb-4 border-4 border-blue-500"
                />
                <h2 className="text-xl font-semibold text-center text-gray-900">{candidate.name}</h2>
                <p className="text-gray-600 text-center">{candidate.position}</p>
                <div className="mt-3 text-gray-700 text-sm">
                  <p><strong>Email:</strong> {candidate.email}</p>
                  <p><strong>Year:</strong> {candidate.year}</p>
                  <p><strong>Manifesto:</strong> {candidate.manifesto}</p>
                </div>
                <div className="text-center mt-4">
                  <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm">
                    Votes: {candidate.votes}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-3">No candidates found</p>
          )}
        </div>
      </div>
    );
  };
  
  export default ElectionParticipant;
  

