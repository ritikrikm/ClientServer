import React from "react";
import Landing from "../Component/LandingPage/Landing";
import Loading from "../Component/Loading/Loading";
import PhysicsWorld from "../Component/PhysicsWorld/PhysicsWorld.jsx";
import Background3D from "../Component/Background3D/Background3D.jsx";
import CrashApology from "../Component/CrashApology/CrashApology.jsx";
import {
  SequenceProvider,
  useSequence,
  PHASES,
} from "../Context/SequenceContext";
import "./MainLayout.css";
import MobileBlocker from "../Component/MobileBlocker/MobileBlocker.jsx";
import SocialStats from "../Component/SocialStats/SocialStats.jsx";

const LayoutContent = () => {
  const { phase } = useSequence();

  return (
    <div className="main-layout-container">
      <MobileBlocker />
      {phase !== PHASES.CRASHED && <SocialStats />}
      <Background3D />
      <div
        className={`main-layout-header ${
          phase !== PHASES.LANDING ? "compact" : ""
        }`}
      >
        <Landing />
      </div>

      {phase === PHASES.LOADING && (
        <div className="main-layout-loader">
          <Loading />
        </div>
      )}

      {phase === PHASES.CRASHED && (
        <>
          <CrashApology />
          <div className="debris-layer">
            <PhysicsWorld />
          </div>
        </>
      )}
    </div>
  );
};

export const MainLayout = () => {
  return (
    <SequenceProvider>
      <LayoutContent />
    </SequenceProvider>
  );
};
