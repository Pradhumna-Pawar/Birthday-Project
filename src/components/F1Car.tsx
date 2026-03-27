"use client";
import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

interface F1CarProps {
  phase: string;
  onCarStopped: () => void;
  carImage: string;
}

export default function F1Car({ phase, onCarStopped, carImage }: F1CarProps) {
  const controls = useAnimation();

  useEffect(() => {
    if (phase === "car-enters") {
      controls.set({ x: "120vw" }); // Reset position for new driver
      controls
        .start({
          x: 0,
          transition: { duration: 2.5, ease: [0.22, 1, 0.36, 1] },
        })
        .then(() => {
          // Keep a very subtle deceleration for realism
          controls.start({
            x: [0, -8, 4, -2, 0],
            transition: { duration: 0.4, ease: "easeOut" },
          }).then(() => {
            setTimeout(() => onCarStopped(), 300);
          });
        });
    }
  }, [phase, controls, onCarStopped, carImage]);

  if (phase === "intro" || phase === "countdown") return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 5,
        pointerEvents: "none",
        overflow: "hidden",
        width: "100vw",
        height: "100vh",
      }}
    >
      <motion.div
        animate={controls}
        initial={{ x: "120vw" }}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        {/* The actual F1 car image - Total Cinematic Coverage */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={carImage}
          src={carImage}
          alt="Formula 1 car"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 70%",
            display: "block",
            userSelect: "none",
            WebkitUserDrag: "none",
            imageRendering: "auto",
            filter: "none",
          } as React.CSSProperties}
          draggable={false}
        />
      </motion.div>
    </div>
  );
}

