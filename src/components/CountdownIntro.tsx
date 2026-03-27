"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CountdownIntroProps {
  onComplete: () => void;
}

const RED_LIGHT_DELAY = 500; // ms between each light turning on

export default function CountdownIntro({ onComplete }: CountdownIntroProps) {
  const [phase, setPhase] = useState<"typing" | "lights" | "go" | "done">("typing");
  const [typedText, setTypedText] = useState("");
  const [litLights, setLitLights] = useState(0);
  const [showGo, setShowGo] = useState(false);

  const introText = "Get ready to race...";

  // Typing animation
  useEffect(() => {
    if (phase !== "typing") return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypedText(introText.slice(0, i));
      if (i >= introText.length) {
        clearInterval(interval);
        setTimeout(() => setPhase("lights"), 600);
      }
    }, 60);
    return () => clearInterval(interval);
  }, [phase]);

  // Racing lights sequence
  useEffect(() => {
    if (phase !== "lights") return;
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setLitLights(count);
      if (count >= 5) {
        clearInterval(interval);
        // All lights off → GO!
        setTimeout(() => {
          setLitLights(0);
          setShowGo(true);
          setTimeout(() => {
            setPhase("done");
            onComplete();
          }, 900);
        }, 800);
      }
    }, RED_LIGHT_DELAY);
    return () => clearInterval(interval);
  }, [phase, onComplete]);

  if (phase === "done") return null;

  return (
    <motion.div
      className="intro-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "60px",
        background: "#ffffff",
      }}
    >
      {/* Typing text - Hero Style */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "clamp(2.5rem, 8vw, 6rem)",
          fontWeight: 900,
          color: "#0a0a0a",
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          textAlign: "center",
          maxWidth: "90%",
          textTransform: "uppercase",
        }}
      >
        {typedText}
        <span
          style={{
            borderRight: "4px solid #dc0000",
            marginLeft: "4px",
            animation: "blink 0.7s step-end infinite",
          }}
        />
      </motion.div>

      {/* Racing lights panel */}
      <AnimatePresence>
        {phase === "lights" || phase === "go" ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "32px",
            }}
          >
            <div
              style={{
                background: "#f0f0f0",
                border: "1px solid #e0e0e0",
                borderRadius: "20px",
                padding: "32px 48px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
              }}
            >
              <div className="lights-container">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`race-light ${litLights >= i ? "lit" : ""}`}
                    style={{
                      width: "40px",
                      height: "40px",
                      background: litLights >= i ? "#dc0000" : "#d1d1d1",
                      border: "none",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* GO! text */}
            <AnimatePresence>
              {showGo && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "clamp(4rem, 15vw, 12rem)",
                    fontWeight: 950,
                    color: "#dc0000",
                    letterSpacing: "-0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  GO!
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <style>{`
        @keyframes blink { 50% { opacity: 0; } }
        .lights-container { display: flex; gap: 16px; }
        .race-light { 
          border-radius: 50%; 
          transition: background 0.1s ease, box-shadow 0.1s ease;
        }
        .race-light.lit {
          box-shadow: 0 0 20px rgba(220, 0, 0, 0.4);
        }
      `}</style>
    </motion.div>
  );
}
