import React, { useState, useEffect } from "react";
import { FiEye, FiEyeOff, FiRefreshCw } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./ClinicianLogin.css";

const ClinicianLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState("");

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

  return (
    <div className="login-page">
      <div className="login_nav"></div>

      <div className="login-container">
        <h2>Clinician Login</h2>

        <input type="text" placeholder="Username" />

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
          />
          <span
            className="eye"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        <div className="forgot">
          <a href="#">Forgot password?</a>
        </div>

        <div className="captcha-row">
          <input type="text" placeholder="Enter the captcha" />
          <div className="captcha-box">{captcha}</div>
        </div>

        <div className="captcha-reload" onClick={generateCaptcha}>
          <FiRefreshCw />
          <span> Reload</span>
        </div>

        <button className="login-btn">Log In With Password</button>

        {/* ✅ UPDATED REGISTER LINK */}
        <p className="register-text">
          Not registered on this platform?{" "}
          <Link to="/clinician/register">Register as Clinician</Link>
        </p>
      </div>

      <div className="login-footer">
        <p>
          © Content developed as part of{" "}
          <span>Code Kalari Hackathon</span> project.
        </p>
        <p>
          This platform is conceptualized and maintained by{" "}
          <span>Team Dev Code</span>.
        </p>
        <p>
          Designed and developed for problem statement:{" "}
          <span>
            “Integration of NAMASTE and ICD-11 via TM2 into EHR systems.”
          </span>
        </p>
        <p className="last-updated">Last Updated: 15/01/2026</p>
      </div>
    </div>
  );
};

export default ClinicianLogin;

