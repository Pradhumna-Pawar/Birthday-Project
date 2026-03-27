"use client";
import { motion, AnimatePresence } from "framer-motion";

interface DriverProps {
  visible: boolean;
  name: string;
  team: string;
  image: string;
  carNo: string;
  accentColor?: string;
}

export default function Driver({ 
  visible, 
  name, 
  team, 
  image, 
  carNo, 
  accentColor = "#dc0000" 
}: DriverProps) {
  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key={name}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="driver-section"
        >
          <motion.div
            initial={{ y: 80, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 40, 
              damping: 15, 
              delay: 0.8,
              duration: 1.5 
            }}
            className="driver-card"
          >
            {/* Photo column */}
            <div className="driver-img-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt={name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                draggable={false}
              />
            </div>

            {/* Text column - Modern Typography */}
            <div className="driver-text-wrap">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                style={{
                  fontSize: "clamp(0.7rem, 1.2vw, 0.9rem)",
                  fontWeight: 800,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: accentColor,
                  marginBottom: "8px",
                }}
              >
                {team}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.7 }}
                style={{
                  fontSize: "clamp(2.5rem, 6vw, 5rem)",
                  fontWeight: 900,
                  color: "#0a0a0a",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.0,
                  marginBottom: "4px",
                }}
              >
                Happy Birthday
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.7 }}
                style={{
                  fontSize: "clamp(2rem, 5vw, 4rem)",
                  fontWeight: 800,
                  color: accentColor,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                }}
              >
                LAVANYA 🏁
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.8 }}
                style={{
                  fontSize: "clamp(0.8rem, 1.5vw, 1.1rem)",
                  fontWeight: 500,
                  color: "#666",
                  marginTop: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <span style={{ width: "30px", height: "1px", background: "#ccc" }} />
                {name.toUpperCase()} · NO. {carNo}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

