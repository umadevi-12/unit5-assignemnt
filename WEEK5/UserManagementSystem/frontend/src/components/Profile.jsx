import React, { useState, useEffect } from "react";
import API from "../api";

const Profile = () => {
  const [user, setUser] = useState({ email: "", role: "" });
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");


  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to fetch profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put(
        "/auth/profile",
        { email: user.email, role: user.role }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
      setMessage("Profile updated successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="form-container">
      <h2>My Profile</h2>
      <form onSubmit={handleUpdate}>
        <label>Email:</label>
        <input
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          required
        />
        <label>Role:</label>
        <input type="text" value={user.role} disabled />

        <button type="submit">Update Profile</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Profile;
