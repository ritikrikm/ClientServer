import React, { useEffect } from "react";
import SocialBadge from "../SocialBadge/SocialBadge.jsx";

const IG_ID = import.meta.env.VITE_IG_ID;
const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;
const YOUTUBE_ID = import.meta.env.VITE_YOUTUBE_ID;
const YOUTUBE_KEY = import.meta.env.VITE_YOUTUBE_KEY;
const IG_LINK = "https://www.instagram.com/clientserverwala/";
const YT_LINK = "https://www.youtube.com/@ClientServerWala";

const SocialStats = ({ isCrashed }) => {
  const STATS_FALL_KEYFRAMES = `@keyframes statsFall {
    0% { transform: translateY(0) rotate(0deg); }
    100% { transform: translateY(70vh) rotate(10deg); }
  }`;

  const injectKeyframes = () => {
    if (document.getElementById("stats-fall-style")) return;

    const style = document.createElement("style");
    style.id = "stats-fall-style";
    style.textContent = STATS_FALL_KEYFRAMES;
    document.head.appendChild(style);
  };

  useEffect(() => {
    injectKeyframes();
  }, []);

  const baseStyle = {
    position: isCrashed ? "static" : "absolute",
    top: isCrashed ? "auto" : "20px",
    right: isCrashed ? "auto" : "20px",
    zIndex: 100,
    display: "flex",
    flexDirection: "column",
    gap: "25px",
    alignItems: "flex-end",
    transition: "opacity 0.5s ease",
  };

  return (
    <div className="social-stats-actual-wrapper" style={baseStyle}>
      <SocialBadge
        platform="ig"
        username="@ClientServerWala"
        idData={IG_ID}
        keyData={ACCESS_TOKEN}
        link={IG_LINK}
      />
      <SocialBadge
        platform="yt"
        username="/ClientServerWala"
        idData={YOUTUBE_ID}
        keyData={YOUTUBE_KEY}
        link={YT_LINK}
      />
    </div>
  );
};

export default SocialStats;
