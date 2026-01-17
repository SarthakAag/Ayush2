import React from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import "./Logout.css";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Navigate to home page
    navigate("/");
  };

  return (
    <div className="logout-btn" onClick={handleLogout}>
      <FiLogOut className="logout-icon" />
      <span>Log Out</span>
    </div>
  );
};

export default Logout;
