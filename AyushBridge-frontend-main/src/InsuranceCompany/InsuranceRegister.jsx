import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./InsuranceRegister.css";

const InsuranceRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    registrationNumber: "",
    email: "",
    phone: "",
    coverageType: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.companyName ||
      !formData.registrationNumber ||
      !formData.email ||
      !formData.phone ||
      !formData.coverageType ||
      !formData.address ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // 🔗 Later → send to backend
    console.log("Insurance Company Registered:", formData);

    navigate("/insurance/dashboard");
  };

  return (
    <div className="insurance-register-container">
      <form className="insurance-register-form" onSubmit={handleSubmit}>
        <h2>Insurance Company Registration</h2>

        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          onChange={handleChange}
        />

        <input
          type="text"
          name="registrationNumber"
          placeholder="Registration / License Number"
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Official Email"
          onChange={handleChange}
        />

        <input
          type="tel"
          name="phone"
          placeholder="Contact Number"
          onChange={handleChange}
        />

        <select
          name="coverageType"
          onChange={handleChange}
        >
          <option value="">Select Coverage Type</option>
          <option value="AYUSH">AYUSH</option>
          <option value="Modern">Modern Medicine</option>
          <option value="Integrated">Integrated (AYUSH + Modern)</option>
        </select>

        <textarea
          name="address"
          placeholder="Office Address"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
        />

        <button type="submit">Register</button>

        <p className="login-link">
          Already registered?{" "}
          <Link to="/insurance/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default InsuranceRegister;
