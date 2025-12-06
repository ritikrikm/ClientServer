import React from "react";
import "./DoodleOverlay.css";

const DoodleOverlay = ({ isOn }) => {
  if (isOn) return null;

  return (
    <div className="doodle-container pointer-events-none">
      <svg
        className="doodle-svg"
        viewBox="0 0 200 250"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="sketchy-filter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.03"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        <circle
          className="doodle-path circle"
          cx="100"
          cy="80"
          r="55"
          filter="url(#sketchy-filter)"
        />

        <path
          className="doodle-path arrow"
          d="M 100, 145 Q 110, 170 130, 180"
          fill="none"
          filter="url(#sketchy-filter)"
        />
      </svg>

      <div className="doodle-text-wrapper">
        <p className="doodle-handwriting">this is a switch,</p>
        <p className="doodle-handwriting delay">turn this on</p>
      </div>
    </div>
  );
};

export default DoodleOverlay;
