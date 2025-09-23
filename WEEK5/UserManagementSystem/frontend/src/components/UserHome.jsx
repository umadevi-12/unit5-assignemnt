import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import API from "../api";
import "../index.css";

const UserHome = () => {
  const role = localStorage.getItem("role");
  if (role !== "user") return <Navigate to="/admin" />;

  const [resources, setResources] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchResources = async () => {
    try {
      const res = await API.get("/resources", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResources(res.data);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to fetch resources");
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  return (
    <div className="admin-dashboard">
      <h2>Welcome, User!</h2>
      <p className="dashboard-info">You can view and manage your resources here.</p>

      {message && <p className="message">{message}</p>}

      <h3>Your Resources:</h3>
      {resources.length === 0 ? (
        <p className="no-resources">No resources available.</p>
      ) : (
        <div className="resources-container">
          {resources.map((res) => (
            <div key={res._id} className="resource-card">
              <strong>{res.title}</strong>
              <p>{res.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserHome;
