import React, { useEffect, useState } from "react";
import "./VisitorBadge.css";

const VisitorBadge = () => {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("visit_counted");

    const fetchVisits = async () => {
      try {
        if (!hasVisited) {
          const response = await fetch(
            "https://t7nw7v6l7bda3whxicuj4pzvmi0kjcyg.lambda-url.us-east-2.on.aws"
          );
          const data = await response.json();
          setCount(data.count);
          sessionStorage.setItem("visit_counted", "true");
          sessionStorage.setItem("visit_count_cache", data.count);
        } else {
          const cached = sessionStorage.getItem("visit_count_cache");
          setCount(cached ? parseInt(cached) : 0);
        }
      } catch (error) {
        console.error("Visitor count error", error);
        setCount(1024);
      } finally {
        setLoading(false);
      }
    };

    fetchVisits();
  }, []);

  return (
    <div className="visitor-badge-container">
      <div className="visitor-icon-wrapper">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
      </div>

      <div className="visitor-text-group">
        <span className="visitor-label">Unique Visits</span>
        <div className="visitor-count-row">
          <span className="visitor-number">
            {loading ? "..." : count?.toLocaleString()}
          </span>
          <span className="visitor-live-dot"></span>
        </div>
        <span className="visitor-handle">clientserverwala.com</span>
      </div>
    </div>
  );
};

export default VisitorBadge;
