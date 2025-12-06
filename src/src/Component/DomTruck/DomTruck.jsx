import React from "react";
import "./DomTruck.css";

const DomTruck = ({ config }) => {
  const { speed, delay, cargo, willDrop, dropAtPercent } = config;

  const wrapperStyle = {
    "--duration": `${speed}s`,
    "--delay": `${delay}s`,
  };

  const cargoStyle = {
    "--drop-time": `${delay + speed * dropAtPercent}s`,
  };

  const wheelStyle = {
    animation: `spinWheel ${speed / 12}s linear infinite`,
  };

  return (
    <div className="truck-wrapper" style={wrapperStyle}>
      <div
        className={`truck-cargo-stack ${willDrop ? "dropping" : ""}`}
        style={cargoStyle}
      >
        {cargo.map((nodeLabel, index) => (
          <div key={index} className="dom-node-box">
            <span className="node-tag">{nodeLabel}</span>
          </div>
        ))}
      </div>

      <div className="truck-body-group">
        <div className="truck-bed-detailed"></div>
        <div className="truck-cab-detailed">
          <div className="cab-window"></div>
          <div className="cab-grille">
            <div className="grille-line"></div>
            <div className="grille-line"></div>
            <div className="grille-line"></div>
          </div>
        </div>
      </div>

      <div className="truck-wheels-group">
        <div className="wheel-detailed back" style={wheelStyle}>
          <div className="wheel-hubcap"></div>
        </div>
        <div className="wheel-detailed front" style={wheelStyle}>
          <div className="wheel-hubcap"></div>
        </div>
      </div>
    </div>
  );
};

export default DomTruck;
