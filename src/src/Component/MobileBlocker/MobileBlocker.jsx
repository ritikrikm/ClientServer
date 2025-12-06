import React from "react";
import "./MobileBlocker.css";

const MobileBlocker = () => {
  return (
    <div className="mobile-blocker-container">
      <div className="blocker-content">
        <div className="monitor-icon">
          <div className="screen">
            <div className="code-lines"></div>
          </div>
          <div className="stand"></div>
          <div className="base"></div>
        </div>

        <h1 className="blocker-title">DESKTOP ONLY</h1>
        <p className="blocker-text">
          Client Server Wala is designed for an immersive
          <br />
          Desktop or Tablet experience.
        </p>
        <p className="blocker-subtext">
          Please open this link on a larger screen.
        </p>
      </div>
    </div>
  );
};

export default MobileBlocker;
