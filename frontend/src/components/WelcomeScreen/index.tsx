import React, { useEffect, useState } from "react";

function WelcomeScreenComponent() {
  const [name, setName] = useState("System");

  return (
    <div className="form-group">
      <label>
        Your Name:
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
    </div>
  );
}

export default WelcomeScreenComponent;
