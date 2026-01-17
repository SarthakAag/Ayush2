import React, { useState } from "react";
import "./ClinicianRegister.css";

const ClinicianRegister = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/doctors/register-basic",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("❌ Non-JSON response:", text);
        throw new Error("Server returned non-JSON response");
      }

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      alert("Clinician registered successfully ✅");

      setFormData({
        username: "",
        email: "",
        password: ""
      });
    } catch (error) {
      console.error("❌ Error:", error);
      alert(error.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <h2>Clinician Registration</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default ClinicianRegister;


