import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo"></div>
      <div className="nav-links">
        {token && <Link to={role === "admin" ? "/admin" : "/user"}>Home</Link>}
        {token && role === "admin" && <Link to="/admin">Admin Dashboard</Link>}
        {token && <Link to="/profile">My Profile</Link>}
        {token ? (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <Link to="/login">Login</Link>
          
        )}
      </div>
    </nav>
  );
};

export default Navbar;
