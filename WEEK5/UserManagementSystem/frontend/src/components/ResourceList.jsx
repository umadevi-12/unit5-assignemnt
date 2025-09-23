import React, { useEffect, useState } from "react";
import API from "../api";

export default function ResourceList() {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    API.get("/resources")
      .then(res => setResources(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h2>Resources</h2>
      <ul>
        {resources.map(r => (
          <li key={r._id}>{r.name}</li>
        ))}
      </ul>
    </div>
  );
}
