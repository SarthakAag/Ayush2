import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DoctorDetails.css";

const DoctorDetails = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    traditionalQualifications: [],
    modernQualifications: [],
    specializations: [
      { traditional: "", modern: "" }
    ],
    experience: "",
    dob: "",
    clinicAddress: "",
  });

  const handleCheckboxChange = (e, type) => {
    const { value, checked } = e.target;

    setFormData((prev) => {
      const list = checked
        ? [...prev[type], value]
        : prev[type].filter((item) => item !== value);

      return { ...prev, [type]: list };
    });
  };

  const handleSpecializationChange = (index, field, value) => {
    const updated = [...formData.specializations];
    updated[index][field] = value;
    setFormData({ ...formData, specializations: updated });
  };

  const addSpecialization = () => {
    setFormData({
      ...formData,
      specializations: [
        ...formData.specializations,
        { traditional: "", modern: "" }
      ],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      formData.traditionalQualifications.length === 0 ||
      formData.specializations.length === 0 ||
      !formData.experience ||
      !formData.dob ||
      !formData.clinicAddress
    ) {
      alert("Please fill all required fields");
      return;
    }

    console.log("Doctor Details Submitted:", formData);
    navigate("/clinician/dashboard");
  };

  return (
    <div className="doctor-details-container">
      <form className="doctor-details-form" onSubmit={handleSubmit}>
        <h2>Doctor Details</h2>

        {/* Full Name */}
        <input
          type="text"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
        />

        {/* Traditional Qualifications */}
        <div className="section">
          <h4>Traditional Qualifications (AYUSH)</h4>
          {["BAMS", "MD (Ayurveda)", "MS (Ayurveda)", "BNYS", "BHMS"].map(
            (q) => (
              <label key={q}>
                <input
                  type="checkbox"
                  value={q}
                  onChange={(e) =>
                    handleCheckboxChange(e, "traditionalQualifications")
                  }
                />
                {q}
              </label>
            )
          )}
        </div>

        {/* Modern Qualifications */}
        <div className="section">
          <h4>Modern Qualifications</h4>
          {["MBBS", "MD", "MS", "DM", "DNB"].map((q) => (
            <label key={q}>
              <input
                type="checkbox"
                value={q}
                onChange={(e) =>
                  handleCheckboxChange(e, "modernQualifications")
                }
              />
              {q}
            </label>
          ))}
        </div>

        {/* Disease Specialization */}
        <div className="section">
          <h4>Disease Specialization</h4>

          {formData.specializations.map((item, index) => (
            <div className="specialization-row" key={index}>
              <input
                type="text"
                placeholder="Traditional (e.g. Prameha)"
                value={item.traditional}
                onChange={(e) =>
                  handleSpecializationChange(
                    index,
                    "traditional",
                    e.target.value
                  )
                }
              />

              <input
                type="text"
                placeholder="Modern (e.g. Diabetes Mellitus)"
                value={item.modern}
                onChange={(e) =>
                  handleSpecializationChange(
                    index,
                    "modern",
                    e.target.value
                  )
                }
              />
            </div>
          ))}

          <button
            type="button"
            className="add-small-btn"
            onClick={addSpecialization}
          >
            + Add More
          </button>
        </div>

        {/* DOB */}
        <input
          type="date"
          value={formData.dob}
          onChange={(e) =>
            setFormData({ ...formData, dob: e.target.value })
          }
        />

        {/* Experience */}
        <input
          type="number"
          placeholder="Years of Experience"
          value={formData.experience}
          onChange={(e) =>
            setFormData({ ...formData, experience: e.target.value })
          }
        />

        {/* Clinic Address */}
        <textarea
          placeholder="Clinic Address"
          value={formData.clinicAddress}
          onChange={(e) =>
            setFormData({ ...formData, clinicAddress: e.target.value })
          }
        />

        <button type="submit">Continue</button>
      </form>
    </div>
  );
};

export default DoctorDetails;
