import React, { createContext, useState, useContext } from "react";

export const PHASES = {
  LANDING: "LANDING",
  LOADING: "LOADING",
  CRASHED: "CRASHED",
  INTERACTIVE: "INTERACTIVE",
};

const SequenceContext = createContext();

export const SequenceProvider = ({ children }) => {
  const [phase, setPhase] = useState(PHASES.LANDING);

  return (
    <SequenceContext.Provider value={{ phase, setPhase }}>
      {children}
    </SequenceContext.Provider>
  );
};

export const useSequence = () => useContext(SequenceContext);
