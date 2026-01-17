import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import "./PatientRegister.css";

const PatientRegister = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    healthId: "",
    age: "",
    gender: "",
    blood: "",
    address: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      if (Object.values(form).some((v) => !v)) {
        alert("Please fill all fields");
        return;
      }

      await API.post("/patients/register", form);

      alert("Registration successful");
      navigate("/patient/login");

    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Create Patient Account</h2>

        <input name="name" placeholder="Full Name" onChange={handleChange} />
        <input name="healthId" placeholder="ABHA ID" onChange={handleChange} />
        <input name="age" placeholder="Age" onChange={handleChange} />
        <input name="gender" placeholder="Gender" onChange={handleChange} />
        <input name="blood" placeholder="Blood Group" onChange={handleChange} />
        <input name="address" placeholder="Address" onChange={handleChange} />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button className="login-btn" onClick={handleRegister}>
          Register
        </button>

        <p className="register-text">
          Already have an account?{" "}
          <span
            style={{ color: "#3f6fa9", cursor: "pointer" }}
            onClick={() => navigate("/patient/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default PatientRegister;
