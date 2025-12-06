import React from "react";
import "./RoomSwitch.css";

const RoomSwitch = ({ isOn, onToggle }) => {
  return (
    <div className="room-switch-wrapper">
      <div className="wall-plate">
        <div className="screw top"></div>
        <div className={`rocker ${isOn ? "on" : "off"}`} onClick={onToggle}>
          <div className="rocker-face"></div>
        </div>
        <div className="screw bottom"></div>
      </div>
    </div>
  );
};

export default RoomSwitch;
