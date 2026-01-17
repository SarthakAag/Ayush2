import { useState } from "react";
import "./ClinicianDashboard.css";

const ClinicianDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);

  const [diagnosisList, setDiagnosisList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    patientName: "",
    abhaId: "",
    date: "",
    diseaseName: "",
    diseaseDetails: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.patientName ||
      !formData.abhaId ||
      !formData.date ||
      !formData.diseaseName ||
      !formData.diseaseDetails
    ) {
      alert("Please fill all fields");
      return;
    }

    setDiagnosisList([...diagnosisList, formData]);

    setFormData({
      patientName: "",
      abhaId: "",
      date: "",
      diseaseName: "",
      diseaseDetails: "",
    });

    setShowForm(false);
  };

  const handleViewMore = (item) => {
    setSelectedDiagnosis(item);
    setShowViewModal(true);
  };

  // 🔍 SEARCH FILTER
  const filteredDiagnosisList = diagnosisList.filter(
    (item) =>
      item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.abhaId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="top-bar"></div>

      {/* Hospital Name */}
      <h2 className="hospital-name">
        Hospital : <span>SRM Ayurveda Hospital</span>
      </h2>

      {/* Doctor Details */}
      <div className="doctor-card">
        <div className="doctor-info">
          <h3>Doctor Details :</h3>
          <div className="info-grid">
            <p><b>Name :</b> Kunal Meshram</p>
            <p><b>Qualification :</b> BAMS, MS (Ayurveda)</p>
            <p><b>Gender :</b> <span className="link">Male</span></p>
            <p><b>Specialization :</b> <span className="link">Shalya Tantra</span></p>
            <p><b>Age :</b> 20</p>
            <p><b>Address :</b> K.K. Nagar, Chennai</p>
          </div>
        </div>

        <div className="doctor-image">
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="Doctor"
          />
        </div>
      </div>

      {/* Diagnosis Section */}
      <div className="diagnosis-section">
        <div className="diagnosis-header">
          <h3>Diagnosis List :</h3>

          <div className="search-add">
            <input
              type="text"
              placeholder="Search by Patient Name or ABHA ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <button className="add-btn" onClick={() => setShowForm(true)}>
              + Add Diagnosis
            </button>
          </div>
        </div>

        {/* Table */}
        <table className="diagnosis-table">
          <thead>
            <tr>
              <th>S. No.</th>
              <th>Patient Name</th>
              <th>ABHA ID</th>
              <th>Date</th>
              <th>Disease Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredDiagnosisList.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-row">
                  No records found
                </td>
              </tr>
            ) : (
              filteredDiagnosisList.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.patientName}</td>
                  <td>{item.abhaId}</td>
                  <td>{item.date}</td>
                  <td>
                    <strong>{item.diseaseName}</strong>
                    <br />
                    <button
                      className="view-btn"
                      onClick={() => handleViewMore(item)}
                    >
                      View More
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Diagnosis Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Diagnosis</h3>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="patientName"
                placeholder="Patient Name"
                value={formData.patientName}
                onChange={handleChange}
              />

              <input
                type="text"
                name="abhaId"
                placeholder="ABHA ID"
                value={formData.abhaId}
                onChange={handleChange}
              />

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />

              <input
                type="text"
                name="diseaseName"
                placeholder="Disease Name (e.g. Prameha)"
                value={formData.diseaseName}
                onChange={handleChange}
              />

              <textarea
                name="diseaseDetails"
                placeholder="Detailed Disease Description"
                value={formData.diseaseDetails}
                onChange={handleChange}
              />

              <div className="modal-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View More Modal */}
      {showViewModal && selectedDiagnosis && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Disease Details</h3>

            <h4>{selectedDiagnosis.diseaseName}</h4>

            <p><b>Patient Name:</b> {selectedDiagnosis.patientName}</p>
            <p><b>ABHA ID:</b> {selectedDiagnosis.abhaId}</p>
            <p><b>Date:</b> {selectedDiagnosis.date}</p>

            <p><b>Detailed Description:</b></p>
            <p>{selectedDiagnosis.diseaseDetails}</p>

            <div className="modal-actions">
              <button onClick={() => setShowViewModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicianDashboard;
