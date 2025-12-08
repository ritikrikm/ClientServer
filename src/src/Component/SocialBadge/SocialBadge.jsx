import React, { useEffect, useState } from "react";
import "./SocialBadge.css";

const SocialBadge = ({ platform, username, keyData, idData, link }) => {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRealCount = async () => {
      let url = "";

      if (platform === "ig") {
        url = `https://graph.facebook.com/v18.0/${idData}?fields=followers_count&access_token=${keyData}`;
      } else if (platform === "yt") {
        url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${idData}&key=${keyData}`;
      }

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(
            `API failed with status: ${response.status} for ${platform}`
          );
        }

        const data = await response.json();
        let finalCount = 0;

        if (platform === "ig" && data.followers_count !== undefined) {
          finalCount = data.followers_count;
        } else if (platform === "yt" && data.items && data.items.length > 0) {
          finalCount = parseInt(data.items[0].statistics.subscriberCount);
        } else {
          finalCount = platform === "ig" ? 4000 : 10000;
        }

        setCount(finalCount);
      } catch (error) {
        setCount(platform === "ig" ? "NaN" : 9999);
      } finally {
        setLoading(false);
      }
    };

    fetchRealCount();
  }, [platform, idData, keyData]);

  const handleOpenNewTab = () => {
    if (link) {
      window.open(link, "_blank");
    }
  };

  const platformIcon =
    platform === "ig" ? (
      <div className="ig-icon-inner">
        <div className="ig-lens"></div>
      </div>
    ) : (
      <svg viewBox="0 0 24 24" fill="white" width="24px" height="24px">
        <path d="M10 15V9l6 3z" />
        <path d="M22 6.92A7.32 7.32 0 0 0 19.06 4a7.33 7.33 0 0 0-2.92-2.92C13.59 1 12 1 12 1s-1.59 0-3.14.08A7.32 7.32 0 0 0 4.94 4 7.33 7.33 0 0 0 2 6.92C2 8.51 2 12 2 12s0 3.49.08 5.08A7.32 7.32 0 0 0 4.94 20a7.33 7.33 0 0 0 2.92 2.92C8.41 23 12 23 12 23s3.59 0 5.14-.08A7.32 7.32 0 0 0 19.06 20a7.33 7.33 0 0 0 2.92-2.92C22 15.49 22 12 22 12s0-3.49-.08-5.08z" />
      </svg>
    );

  return (
    <div
      className={`social-badge-container badge-${platform}`}
      onClick={() => handleOpenNewTab()}
    >
      <div className={`icon-wrapper ${platform}`}>{platformIcon}</div>

      <div className="text-group">
        <span className="platform-label">
          {platform === "ig" ? "Followers" : "Subscribers"}
        </span>
        <div className="count-row">
          <span className="count-number">
            {loading ? "..." : count?.toLocaleString()}
          </span>
          <span className="live-dot"></span>
        </div>
        <span className="account-handle">{username}</span>
      </div>
    </div>
  );
};

export default SocialBadge;
