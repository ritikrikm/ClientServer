import React, { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import SocialStats from "../SocialStats/SocialStats.jsx";
import "./PhysicsWorld.css";

const PhysicsWorld = () => {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const arrowRefs = useRef({});
  const [items, setItems] = useState([]);

  const bodiesRef = useRef({});
  const allBodiesRef = useRef([]);

  const wallsRef = useRef({ ground: null, left: null, right: null });

  const INITIAL_DEBRIS = [
    {
      label: "JS",
      texture:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
      width: 60,
      height: 60,
      scale: 0.4,
      isBadge: false,
    },
    {
      label: "React",
      texture:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
      width: 65,
      height: 60,
      scale: 0.45,
      isBadge: false,
    },
    {
      label: "HTML5",
      texture:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
      width: 60,
      height: 60,
      scale: 0.4,
      isBadge: false,
    },
    {
      label: "CSS3",
      texture:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",
      width: 60,
      height: 60,
      scale: 0.4,
      isBadge: false,
    },
    {
      label: "Angular",
      texture:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angular/angular-original.svg",
      width: 65,
      height: 65,
      scale: 0.45,
      isBadge: false,
    },
    {
      label: "Spring",
      texture:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg",
      width: 60,
      height: 60,
      scale: 0.4,
      isBadge: false,
    },
    {
      label: "Node",
      texture:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
      width: 60,
      height: 60,
      scale: 0.4,
      isBadge: false,
    },
    {
      label: "Redis",
      texture:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg",
      width: 60,
      height: 60,
      scale: 0.4,
      isBadge: false,
    },
    {
      label: "K8s",
      texture:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-plain.svg",
      width: 65,
      height: 65,
      scale: 0.45,
      isBadge: false,
    },
    { label: "SocialStats", width: 320, height: 160, isBadge: true },
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
    renderRef.current = render;

    const bodies = INITIAL_DEBRIS.map((item, index) => {
      let xPos, yPos;
      let body;

      if (item.isBadge) {
        xPos = width - item.width / 2 - 20;
        yPos = item.height / 2 + 20;

        body = Bodies.rectangle(xPos, yPos, item.width, item.height, {
          label: item.label,
          restitution: 0.2,
          frictionAir: 0.02,
          density: 0.005,
          render: { visible: false },
        });
        Matter.Body.setVelocity(body, { x: 0, y: 5 });
      } else {
        xPos = width / 2 + (Math.random() * 400 - 200);
        yPos = -200 - index * 150;

        body = Bodies.rectangle(xPos, yPos, item.width, item.height, {
          label: item.label,
          restitution: 0.5,
          frictionAir: 0.02,
          chamfer: { radius: 10 },
          render: {
            sprite: {
              texture: item.texture,
              xScale: item.scale,
              yScale: item.scale,
            },
          },
        });
      }
      return body;
    });

    setItems(
      bodies.map((b) => ({
        id: b.id,
        label: b.label,
        color: ARROW_COLORS[b.label] || "#ffffff",
      }))
    );
    allBodiesRef.current = bodies;

    const createWalls = (w, h) => {
      const wallOptions = {
        isStatic: true,
        render: { visible: false },
        label: "Wall",
      };
      return {
        ground: Bodies.rectangle(w / 2, h + 25, w, 100, wallOptions),
        left: Bodies.rectangle(-50, h / 2, 100, h * 5, wallOptions),
        right: Bodies.rectangle(w + 50, h / 2, 100, h * 5, wallOptions),
      };
    };

    const newWalls = createWalls(width, height);
    wallsRef.current = newWalls;
    Composite.add(world, [
      ...bodies,
      newWalls.ground,
      newWalls.left,
      newWalls.right,
    ]);

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
      collisionFilter: { mask: 0x0001 },
    });
    Composite.add(world, mouseConstraint);
    render.mouse = mouse;

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    Events.on(engine, "afterUpdate", () => {
      allBodiesRef.current.forEach((body) => {
        const arrowEl = arrowRefs.current[body.id];

        if (body.label === "SocialStats") {
          const domElement = document.querySelector(
            ".social-stats-actual-wrapper"
          );
          if (domElement) {
            const { x, y } = body.position;
            const angle = body.angle;
            const halfWidth = 320 / 2;
            const halfHeight = 160 / 2;

            domElement.style.position = "absolute";
            domElement.style.left = `${x - halfWidth}px`;
            domElement.style.top = `${y - halfHeight}px`;
            domElement.style.transform = `rotate(${angle}rad)`;
            domElement.style.transition = "none";
            domElement.style.margin = "0";
          }
        } else {
          if (!arrowEl) return;
          const { x, y } = body.position;
          const viewW = window.innerWidth;
          const viewH = window.innerHeight;
          const padding = 50;
          const isOffScreen = x < 0 || x > viewW || y < -50 || y > viewH + 50;

          if (isOffScreen) {
            arrowEl.style.opacity = "1";
            arrowEl.style.display = "flex";
            let tx = Math.max(padding, Math.min(x, viewW - padding));
            let ty = Math.max(padding, Math.min(y, viewH - padding));

            const cx = viewW / 2;
            const cy = viewH / 2;
            const angleVal = Math.atan2(y - cy, x - cx) * (180 / Math.PI);
            const dist = Math.floor(
              Math.sqrt(Math.pow(x - tx, 2) + Math.pow(y - ty, 2))
            );

            const distEl = arrowEl.querySelector(".arrow-distance");
            if (distEl) distEl.innerText = `${dist}m`;
            arrowEl.style.transform = `translate(${tx}px, ${ty}px) rotate(${
              angleVal + 90
            }deg)`;
            if (distEl) distEl.style.transform = `rotate(-${angleVal + 90}deg)`;
          } else {
            arrowEl.style.opacity = "0";
          }
        }
      });
    });

    const handleResize = () => {
      const newW = window.innerWidth;
      const newH = window.innerHeight;

      render.canvas.width = newW;
      render.canvas.height = newH;
      render.bounds.max.x = newW;
      render.bounds.max.y = newH;
      render.options.width = newW;
      render.options.height = newH;

      const { ground, left, right } = wallsRef.current;
      Composite.remove(world, [ground, left, right]);

      const updatedWalls = createWalls(newW, newH);
      wallsRef.current = updatedWalls;
      Composite.add(world, [
        updatedWalls.ground,
        updatedWalls.left,
        updatedWalls.right,
      ]);

      allBodiesRef.current.forEach((body) => {
        if (body.position.y > newH - 50) {
          Matter.Body.setPosition(body, { x: body.position.x, y: newH - 100 });
          Matter.Body.setVelocity(body, { x: 0, y: -2 });
        }

        if (body.position.x > newW) {
          Matter.Body.setPosition(body, { x: newW - 50, y: body.position.y });
          Matter.Body.setVelocity(body, { x: -2, y: 0 });
        }
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
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

      <div className="social-stats-wrapper">
        <SocialStats isCrashed={true} />
      </div>

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
