import React, { useEffect, useRef } from "react";
import { useSequence, PHASES } from "../../Context/SequenceContext";

const Background3D = () => {
  const canvasRef = useRef(null);
  const { phase } = useSequence();
  const phaseRef = useRef(phase);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const STAR_COUNT = 600;
    const SPEED = 3;
    const CONNECTION_DIST = 120;
    const GRAVITY = 0.4;
    const BOUNCE = 0.5;
    const FLOOR_LEVEL = height * 0.8;

    const COLORS = ["#E8D1A7", "#ffffff", "#E34F26", "#61DAFB"];

    class Star {
      constructor() {
        this.init(true);
      }

      init(randomZ = false) {
        this.x = (Math.random() - 0.5) * width * 3;
        this.y = (Math.random() - 0.5) * height * 3;
        this.z = randomZ ? Math.random() * width : width;

        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.size = 2 + Math.random() * 2;

        this.vy = 0;
        this.vx = (Math.random() - 0.5) * 4;
        this.onFloor = false;
      }

      update(currentPhase) {
        if (currentPhase === PHASES.CRASHED) {
          this.vy += GRAVITY;
          this.y += this.vy;
          this.x += this.vx;

          if (this.y > FLOOR_LEVEL) {
            this.y = FLOOR_LEVEL;
            this.vy *= -BOUNCE;
            this.vx *= 0.95;
            this.onFloor = true;

            this.x += Math.sin(Date.now() * 0.005 + this.z) * 0.5;
          }

          if (this.onFloor) {
            this.z -= 0.5;
            if (this.z <= 0) this.z = width;
          } else {
            this.z += Math.sin(this.y * 0.01) * 2;
          }
        } else {
          this.z -= SPEED;
          if (this.z <= 0) {
            this.init(false);
          }
        }
      }

      draw() {
        const safeZ = Math.max(1, this.z);
        const scale = width / safeZ;

        const sx = (this.x / safeZ) * width + width / 2;
        const sy = (this.y / safeZ) * height + height / 2;

        if (sx < -50 || sx > width + 50 || sy < -50 || sy > height + 50)
          return null;

        const r = this.size * scale * 0.02;

        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(sx, sy, Math.max(0, r), 0, Math.PI * 2);
        ctx.fill();

        return { x: sx, y: sy };
      }
    }

    const stars = Array.from({ length: STAR_COUNT }, () => new Star());

    const animate = () => {
      ctx.fillStyle = "#1a0505";
      ctx.fillRect(0, 0, width, height);

      const points = [];
      const currentPhase = phaseRef.current;

      stars.forEach((star) => {
        star.update(currentPhase);
        const point = star.draw();
        if (point) points.push(point);
      });

      ctx.lineWidth = 0.5;

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < Math.min(i + 15, points.length); j++) {
          const p1 = points[i];
          const p2 = points[j];

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DIST) {
            const opacity = 1 - dist / CONNECTION_DIST;

            ctx.beginPath();

            ctx.strokeStyle = `rgba(232, 209, 167, ${opacity * 0.4})`;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        background: "#1a0505",
      }}
    />
  );
};

export default Background3D;
