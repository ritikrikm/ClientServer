import React, { useState, useEffect } from "react";
import { useSequence, PHASES } from "../../Context/SequenceContext";
import "./Loading.css";
import DomTruck from "../DomTruck/DomTruck";
import TruckManager from "../DomTruck/TruckManager";

const Loading = () => {
  const { phase, setPhase } = useSequence();
  const TOTAL_SLOTS = 7;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [narrative, setNarrative] = useState("Initializing React Root...");
  const [isCrashed, setIsCrashed] = useState(false);

  const steps = [
    "Initializing React Root...",
    "Creating Fiber Nodes...",
    "Reconciling Tree...",
    "Diffing Virtual DOM...",
    "Committing Changes...",
    "Hydrating Event Listeners...",
    "CRITICAL ERROR: FIBER TREE BREAK",
  ];

  useEffect(() => {
    if (phase !== PHASES.LOADING) return;

    const cycleTime = 2500;

    const timer = setTimeout(() => {
      if (currentIndex === TOTAL_SLOTS - 1) {
        setIsCrashed(true);
        setNarrative("⚠ SYSTEM FAILURE: DOM TREE BROKEN ⚠");
        setTimeout(() => {
          setPhase(PHASES.CRASHED);
        }, 2500);
      } else {
        setCurrentIndex((prev) => prev + 1);
        setNarrative(steps[currentIndex + 1] || "Loading...");
      }
    }, cycleTime);

    return () => clearTimeout(timer);
  }, [currentIndex, phase, setPhase, steps]);

  return (
    <div className={`loading-container ${isCrashed ? "crash-mode" : ""}`}>
      <h2 className="loading-title flicker-text-loading">
        {isCrashed ? "SYSTEM FAILURE" : "BUILDING DOM..."}
      </h2>

      <div className="progress-bar-container">
        <div className="progress-grid">
          {[...Array(TOTAL_SLOTS)].map((_, i) => (
            <div key={`slot-${i}`} className="progress-slot-bg"></div>
          ))}
        </div>

        <div className="progress-grid overlay">
          {[...Array(TOTAL_SLOTS)].map((_, i) => {
            let statusClass = "empty";
            if (i < currentIndex) statusClass = "filled";
            if (i === currentIndex && !isCrashed) statusClass = "filling";
            if (i === currentIndex && isCrashed) statusClass = "glitch";

            return (
              <div
                key={`block-${i}`}
                className={`progress-block-item ${statusClass}`}
              >
                <div className="block-visual flicker-box-loading"></div>
              </div>
            );
          })}
        </div>

        {!isCrashed && (
          <div
            className="hand-layer"
            key={currentIndex}
            style={{
              "--target-col": currentIndex,
              "--total-cols": TOTAL_SLOTS,
            }}
          >
            <div className="hand-group">
              <div className="hand-block flicker-box-loading"></div>
              <div className="hand-graphic"></div>
            </div>
          </div>
        )}
      </div>
      {!isCrashed && <TruckManager />}
      <p
        className={`loading-narrative ${
          isCrashed ? "text-error" : "flicker-text-subtle-loading"
        }`}
      >
        {narrative}
      </p>
    </div>
  );
};

export default Loading;
