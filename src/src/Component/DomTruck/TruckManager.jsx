import React, { useState, useEffect } from "react";
import DomTruck from "./DomTruck";

const NODE_OPTIONS = [
  "<App />",
  "<div>",
  "<span>",
  "{API}",
  "[JSON]",
  "<Nav>",
  "Error",
  "404",
];

const TruckManager = () => {
  const [trucks, setTrucks] = useState([]);

  useEffect(() => {
    const TRUCK_COUNT = 4;

    const dropperIndex = Math.floor(Math.random() * TRUCK_COUNT);

    const newTrucks = Array.from({ length: TRUCK_COUNT }).map((_, i) => {
      const speed = 7 + Math.random() * 5;

      const delay = i * 3 + Math.random();

      const cargoCount = 1 + Math.floor(Math.random() * 2);
      const cargo = [];
      for (let j = 0; j < cargoCount; j++) {
        const randomNode =
          NODE_OPTIONS[Math.floor(Math.random() * NODE_OPTIONS.length)];
        cargo.push(randomNode);
      }

      const willDrop = i === dropperIndex;

      const dropAtPercent = 0.3 + Math.random() * 0.4;

      return {
        id: i,
        speed: speed,
        delay: delay,
        cargo: cargo,
        willDrop: willDrop,
        dropAtPercent: dropAtPercent,
      };
    });

    setTrucks(newTrucks);
  }, []);

  return (
    <div className="truck-track-layer">
      {trucks.map((config) => (
        <DomTruck key={config.id} config={config} />
      ))}
    </div>
  );
};

export default TruckManager;
