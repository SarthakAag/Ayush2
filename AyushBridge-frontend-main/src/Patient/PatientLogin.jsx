import React, { useState, useEffect } from "react";
import { FiEye, FiEyeOff, FiRefreshCw } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import API from "../utils/api.js";
import "./PatientLogin.css";

const PatientLogin = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState("");

  const [abhaId, setAbhaId] = useState("");
  const [password, setPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleLogin = async () => {
    try {
      if (!abhaId || !password || !captchaInput) {
        alert("Please fill all fields");
        return;
      }

      if (captchaInput !== captcha) {
        alert("Captcha does not match");
        generateCaptcha();
        return;
      }

      const res = await API.post("/patients/login", {
        healthId: abhaId,
        password
      });

      localStorage.setItem("accessToken", res.data.accessToken);
      navigate("/patient/portal");

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
      generateCaptcha();
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Log In</h2>

        <input
          type="text"
          placeholder="ABHA ID"
          value={abhaId}
          onChange={(e) => setAbhaId(e.target.value)}
        />

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        <div className="captcha-row">
          <input
            type="text"
            placeholder="Enter captcha"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
          />
          <div className="captcha-box">{captcha}</div>
        </div>

        <div className="captcha-reload" onClick={generateCaptcha}>
          <FiRefreshCw /> Reload
        </div>

        <button className="login-btn" onClick={handleLogin}>
          Log In
        </button>

        {/* ✅ REGISTER LINK (ADD THIS) */}
        <p className="register-text">
          Not registered?{" "}
          <span
            style={{ color: "#3f6fa9", cursor: "pointer" }}
            onClick={() => navigate("/patient/register")}
          >
            Register Now
          </span>
        </p>

      </div>
    </div>
  );
};

export default PatientLogin;
