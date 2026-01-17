import React, { useEffect, useState } from "react";
import "./PatientPortal.css";
import Navbar from "../NavigationBar/Navbar";

const PatientPortal = () => {
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("patientData");
    if (data) {
      setPatient(JSON.parse(data));
    }
  }, []);

  if (!patient) {
    return <h2 style={{ textAlign: "center" }}>No Patient Data Found</h2>;
  }

  return (
    <div className="portal-page">
      {/* Navbar */}
      <div>
        <Navbar />
      </div>

      <div className="portal-container">
        {/* Left Profile Card */}
        <div className="profile-card">
          <img src={patient.image} alt="Patient" />
          <h3>{patient.name}</h3>
          <p><strong>Health ID</strong></p>
          <p>{patient.healthId}</p>
        </div>

        {/* Right Details Section */}
        <div className="details-card">
          <h2>Patient Details :</h2>

          <div className="detail-row">
            <span>Age</span>
            <span>{patient.age}</span>
          </div>

          <div className="detail-row">
            <span>Gender</span>
            <span>{patient.gender}</span>
          </div>

          <div className="detail-row">
            <span>Blood Group</span>
            <span>{patient.blood}</span>
          </div>

          <div className="detail-row">
            <span>Address</span>
            <span>{patient.address}</span>
          </div>
        </div>
      </div>

      {/* Diagnosis Section */}
      <div className="diagnosis-section">
        <h2>My Diagnosis :</h2>
        <div className="diagnosis-cards">
          {patient.diagnosis && patient.diagnosis.length > 0 ? (
            patient.diagnosis.map((d, idx) => (
              <div className="diagnosis-card" key={idx}>
                <div className="diagnosis-date">{d.date}</div>
                <p><strong>Namaste Code :</strong> {d.namasteCode}</p>
                <p><strong>Description :</strong> {d.description}</p>
                <p><strong>ICD-11 Code :</strong> {d.icd11}</p>
                <p><strong>Equivalent :</strong> {d.equivalent}</p>
                <div className="diagnosis-links">
                  <a href="#">[view more details]</a>
                  <a href="#">[Download pdf]</a>
                </div>
              </div>
            ))
          ) : (
            <p>No diagnosis records found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientPortal;
