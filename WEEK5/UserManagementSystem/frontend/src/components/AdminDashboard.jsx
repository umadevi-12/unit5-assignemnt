import React, { useState, useEffect } from "react";
import API from "../api";
import "../index.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [resources, setResources] = useState([]);
  const [message, setMessage] = useState("");
  const [newResource, setNewResource] = useState({ title: "", description: "" });

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Fetch users error:", err);
      setMessage(err.response?.data?.message || "Failed to fetch users");
    }
  };

  const fetchResources = async () => {
    try {
      const res = await API.get("/resources", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResources(res.data);
    } catch (err) {
      console.error("Fetch resources error:", err);
      setMessage(err.response?.data?.message || "Failed to fetch resources");
    }
  };

  const createResource = async () => {
    if (!newResource.title || !newResource.description) {
      setMessage("All fields are required");
      return;
    }
    try {
      await API.post(
        "/resources",
        { title: newResource.title, description: newResource.description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Resource created successfully");
      setNewResource({ title: "", description: "" });
      fetchResources(); 
    } catch (err) {
      console.error("Create resource error:", err);
      setMessage(err.response?.data?.message || "Failed to create resource");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchResources();
  }, []);

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <p className="dashboard-info">Manage users and resources here.</p>

      {message && <p className="message">{message}</p>}

      <div className="create-resource-form">
        <input
          type="text"
          placeholder="Resource Title"
          value={newResource.title}
          onChange={(e) =>
            setNewResource({ ...newResource, title: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Resource Description"
          value={newResource.description}
          onChange={(e) =>
            setNewResource({ ...newResource, description: e.target.value })
          }
        />
        <button type="button" onClick={createResource}>
          Create Resource
        </button>
      </div>

      <h3>All Users:</h3>
      {users.length === 0 ? (
        <p className="no-resources">No users found.</p>
      ) : (
        <div className="users-container">
          {users.map((user) => (
            <div key={user._id} className={`user-card ${user.role}`}>
              <strong>{user.email}</strong>
              <span>Role: {user.role}</span>
            </div>
          ))}
        </div>
      )}

      <h3>All Resources:</h3>
      {resources.length === 0 ? (
        <p className="no-resources">No resources found.</p>
      ) : (
        <div className="resources-container">
          {resources.map((res) => (
            <div key={res._id} className="resource-card">
              <strong>{res.title}</strong>
              <p>{res.description}</p>
              <span>Owner: {res.createdBy}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
