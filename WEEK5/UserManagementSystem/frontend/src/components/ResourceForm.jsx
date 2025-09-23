import React, { useState } from "react";
import API from "../api";

export default function ResourceForm() {
  const [name, setName] = useState("");

  const handleAdd = async () => {
    try {
      await API.post("/resources", { name });
      alert("Resource added");
      setName("");
    } catch (err) {
      alert(err.response.data);
    }
  };

  return (
    <div>
      <input placeholder="Resource Name" value={name} onChange={e => setName(e.target.value)} />
      <button onClick={handleAdd}>Add Resource</button>
    </div>
  );
}
