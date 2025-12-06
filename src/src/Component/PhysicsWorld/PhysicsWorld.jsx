import React, { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import "./PhysicsWorld.css";

const PhysicsWorld = () => {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const arrowRefs = useRef({});
  const [items, setItems] = useState([]);

  const TECH_STACKS = [
    {
      label: "JS",
      texture:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
      width: 60,
      height: 60,
      scale: 0.4,
    },
    {
      label: "React",
      texture:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
      width: 65,
      height: 60,
      scale: 0.45,
    },
    {
      label: "HTML5",
      texture:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
      width: 60,
      height: 60,
      scale: 0.4,
    },
    {
      label: "CSS3",
      texture:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",
      width: 60,
      height: 60,
      scale: 0.4,
    },
    {
      label: "Angular",
      texture:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angular/angular-original.svg",
      width: 65,
      height: 65,
      scale: 0.45,
    },
    {
      label: "Spring",
      texture:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg",
      width: 60,
      height: 60,
      scale: 0.4,
    },
    {
      label: "Node",
      texture:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
      width: 60,
      height: 60,
      scale: 0.4,
    },
    {
      label: "Redis",
      texture:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg",
      width: 60,
      height: 60,
      scale: 0.4,
    },
    {
      label: "K8s",
      texture:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-plain.svg",
      width: 65,
      height: 65,
      scale: 0.45,
    },
  ];

  const ARROW_COLORS = {
    JS: "#F7DF1E",
    React: "#61DAFB",
    HTML5: "#E34F26",
    CSS3: "#1572B6",
    Angular: "#DD0031",
    Spring: "#6DB33F",
    Node: "#339933",
    Redis: "#DC382D",
    K8s: "#326CE5",
  };

  useEffect(() => {
    if (engineRef.current) return;

    const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint,
      Events = Matter.Events;

    const engine = Engine.create();
    engineRef.current = engine;
    const world = engine.world;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const render = Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: "transparent",
        pixelRatio: window.devicePixelRatio || 1,
      },
    });

    const bodies = TECH_STACKS.map((tech, index) => {
      const xPos = width / 2 + (Math.random() * 400 - 200);
      const yPos = -200 - index * 150;

      return Bodies.rectangle(xPos, yPos, tech.width, tech.height, {
        label: tech.label,
        restitution: 0.5,
        frictionAir: 0.02,
        chamfer: { radius: 10 },
        render: {
          sprite: {
            texture: tech.texture,
            xScale: tech.scale,
            yScale: tech.scale,
          },
        },
      });
    });

    setItems(
      bodies.map((b) => ({
        id: b.id,
        label: b.label,
        color: ARROW_COLORS[b.label] || "#ffffff",
      }))
    );

    const ground = Bodies.rectangle(width / 2, height + 60, width, 100, {
      isStatic: true,
      render: { visible: false },
    });
    const leftWall = Bodies.rectangle(-50, height / 2, 100, height * 5, {
      isStatic: true,
      render: { visible: false },
    });
    const rightWall = Bodies.rectangle(
      width + 50,
      height / 2,
      100,
      height * 5,
      { isStatic: true, render: { visible: false } }
    );

    Composite.add(world, [...bodies, ground, leftWall, rightWall]);

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });
    Composite.add(world, mouseConstraint);
    render.mouse = mouse;

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    Events.on(engine, "afterUpdate", () => {
      bodies.forEach((body) => {
        const arrowEl = arrowRefs.current[body.id];
        if (!arrowEl) return;

        const { x, y } = body.position;
        const viewW = window.innerWidth;
        const viewH = window.innerHeight;
        const padding = 50;

        const isOffScreen = x < 0 || x > viewW || y < -50 || y > viewH + 50;

        if (isOffScreen) {
          arrowEl.style.opacity = "1";
          arrowEl.style.display = "flex";

          let tx = x;
          let ty = y;
          if (tx < padding) tx = padding;
          if (tx > viewW - padding) tx = viewW - padding;
          if (ty < padding) ty = padding;
          if (ty > viewH - padding) ty = viewH - padding;

          const cx = viewW / 2;
          const cy = viewH / 2;
          const angle = Math.atan2(y - cy, x - cx) * (180 / Math.PI);

          const dist = Math.floor(
            Math.sqrt(Math.pow(x - tx, 2) + Math.pow(y - ty, 2))
          );

          const distEl = arrowEl.querySelector(".arrow-distance");
          if (distEl) distEl.innerText = `${dist}m`;

          arrowEl.style.transform = `translate(${tx}px, ${ty}px) rotate(${
            angle + 90
          }deg)`;

          if (distEl) {
            distEl.style.transform = `rotate(-${angle + 90}deg)`;
          }
        } else {
          arrowEl.style.opacity = "0";
        }
      });
    });

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Composite.clear(world);
      Engine.clear(engine);
      engineRef.current = null;
    };
  }, []);

  return (
    <div className="physics-container">
      <canvas ref={canvasRef} className="physics-canvas" />

      <div className="indicators-layer">
        {items.map((item) => (
          <div
            key={item.id}
            className="indicator-arrow"
            ref={(el) => (arrowRefs.current[item.id] = el)}
            style={{ color: item.color }}
          >
            <span className="arrow-distance">0m</span>
            <div className="arrow-shape"></div>
            <span className="arrow-label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhysicsWorld;
