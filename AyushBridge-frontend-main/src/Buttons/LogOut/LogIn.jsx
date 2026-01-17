import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiChevronDown } from "react-icons/fi";
import "./LogIn.css";

const LogIn = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const hoverTimeout = useRef(null);

  const handleNavigate = (path) => {
    setOpen(false);
    navigate(path);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div
      className="login-dropdown"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="login-btn"
        onClick={() => setOpen((prev) => !prev)}
      >
        <FiUser />
        <span>Log In</span>
        <FiChevronDown />
      </div>

      {open && (
        <div className="dropdown-menu">
          <div onClick={() => handleNavigate("/patient/login")}>
            Patient
          </div>
          <div onClick={() => handleNavigate("/clinician/login")}>
            Doctor
          </div>
          <div onClick={() => handleNavigate("/insurance/login")}>
            Insurance Company
          </div>
        </div>
      )}
    </div>
  );
};

export default LogIn;
