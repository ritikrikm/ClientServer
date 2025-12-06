import { useEffect, useState } from "react";
import { PHASES, useSequence } from "../../Context/SequenceContext";
import RoomSwitch from "../RoomSwitch";
import DoodleOverlay from "../DoodleOverlay/DoodleOverlay";
import "./Landing.css";

const Landing = () => {
  const { phase, setPhase } = useSequence();
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    if (phase !== PHASES.LANDING || !isOn) return;

    const animationDuration = 5500;

    const timer = setTimeout(() => {
      setPhase(PHASES.LOADING);
    }, animationDuration);

    return () => clearTimeout(timer);
  }, [phase, setPhase, isOn]);

  const isLoading = phase === PHASES.LOADING;
  const isCrashed = phase === PHASES.CRASHED;

  let containerClass = "landing-container";
  if (isLoading) containerClass += " loading-mode";
  if (isCrashed) containerClass += " crash-mode";

  return (
    <section className={containerClass}>
      <div
        className={`switch-wrapper ${isLoading || isCrashed ? "hidden" : ""}`}
      >
        <DoodleOverlay isOn={isOn} />
        <RoomSwitch isOn={isOn} onToggle={() => setIsOn(!isOn)} />
      </div>

      <div className={`tubelight-wrapper ${isCrashed ? "falling" : ""}`}>
        <div
          className={`hanging-rope left ${isCrashed ? "snapped" : ""}`}
        ></div>
        <div
          className={`hanging-rope right ${isCrashed ? "snapped" : ""}`}
        ></div>

        <h1 className="brand-text">
          <span className={`flicker-text ${isOn ? "delay-short" : ""}`}>
            Client
          </span>
          <span className={`flicker-text ${isOn ? "delay-long" : ""}`}>
            Server
          </span>
          <span
            className={`flicker-text ${isOn ? "delay-medium" : ""} ${
              isCrashed ? "broken-wala" : ""
            }`}
          >
            Wala
          </span>
        </h1>
      </div>
    </section>
  );
};

export default Landing;
