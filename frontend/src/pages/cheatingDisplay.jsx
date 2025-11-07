import React, { useEffect, useState } from "react";
import { fetchCheatingRecords } from "./firebaseFunctions";

const CheatingRecordsList = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const getRecords = async () => {
      const response = await fetchCheatingRecords();
      if (response.success) {
        setRecords(response.records);
      }
    };
    getRecords();
  }, []);

  return (
    <div>
      <h2>Academic Integrity Violations</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll Number</th>
            <th>Exam</th>
            <th>Reason</th>
            <th>Proof</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td>{record.name}</td>
              <td>{record.rollNumber}</td>
              <td>{record.exam}</td>
              <td>{record.reason}</td>
              <td>
                {record.proof ? (
                  <a href={record.proof} target="_blank" rel="noopener noreferrer">
                    View Proof
                  </a>
                ) : (
                  "No Proof"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CheatingRecordsList;
