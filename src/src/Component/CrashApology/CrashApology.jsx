import React from "react";
import "./CrashApology.css";

const CrashApology = () => {
  return (
    <div className="apology-container">
      <h2 className="doodle-line line-1 heading">
        Hey, Something went wrong...
      </h2>

      <p className="doodle-line line-2">
        ...and we know this is exactly what you
        <br />
        <span className="sketch-highlight">didn't want to see.</span>
      </p>

      <p className="doodle-line line-3">
        We sincerely apologize for this digital mess.
      </p>

      <div className="doodle-line line-4 status-box">
        <span className="status-icon">⚙️</span>
        <p>
          Don't worry, our team is actively working
          <br />
          in the backend to fix this!
        </p>
      </div>
    </div>
  );
};

export default CrashApology;
