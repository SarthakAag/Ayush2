import { useState } from "react";
import "./InsuranceDashboard.css";

const InsuranceDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [claims, setClaims] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);

  const handleView = (claim) => {
    setSelectedClaim(claim);
    setShowModal(true);
  };

  const filteredClaims = claims.filter(
    (item) =>
      item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.abhaId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="insurance-dashboard">
      {/* Top Bar */}
      <div className="top-bar"></div>

      {/* Company Name */}
      <h2 className="company-name">
        Insurance Company : <span>Ayush Secure Health</span>
      </h2>

      {/* Company Details */}
      <div className="company-card">
        <div className="company-info">
          <h3>Company Details :</h3>
          <p><b>Reg. ID :</b> INS-AYU-2025</p>
          <p><b>Contact :</b> support@ayushsecure.in</p>
          <p><b>Coverage :</b> AYUSH & Integrated Care</p>
        </div>
      </div>

      {/* Claims Section */}
      <div className="claims-section">
        <div className="claims-header">
          <h3>Insurance Claims</h3>

          <input
            type="text"
            placeholder="Search by Patient Name or ABHA ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table */}
        <table className="claims-table">
          <thead>
            <tr>
              <th>S. No.</th>
              <th>Patient Name</th>
              <th>ABHA ID</th>
              <th>Claim Type</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>

          <tbody>
            {filteredClaims.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-row">
                  No claims found
                </td>
              </tr>
            ) : (
              filteredClaims.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.patientName}</td>
                  <td>{item.abhaId}</td>
                  <td>{item.claimType}</td>
                  <td>
                    <span className={`status ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => handleView(item)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* View Claim Modal */}
      {showModal && selectedClaim && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Claim Details</h3>

            <p><b>Patient Name:</b> {selectedClaim.patientName}</p>
            <p><b>ABHA ID:</b> {selectedClaim.abhaId}</p>
            <p><b>Claim Type:</b> {selectedClaim.claimType}</p>
            <p><b>Status:</b> {selectedClaim.status}</p>
            <p><b>Description:</b></p>
            <p>{selectedClaim.description}</p>

            <div className="modal-actions">
              <button onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsuranceDashboard;
