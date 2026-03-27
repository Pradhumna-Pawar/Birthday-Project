"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BirthdayCake() {
  const [isBlownOut, setIsBlownOut] = useState(false);

  const handleBlowOut = () => {
    if (!isBlownOut) {
      setIsBlownOut(true);
      // Trigger a confetti-like effect or simple victory animation
    }
  };

  return (
    <div className="cake-container">
      <motion.div
        className="cake-wrapper"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Candle */}
        <div className="candle-system" onClick={handleBlowOut}>
          <AnimatePresence>
            {!isBlownOut && (
              <motion.div
                className="flame"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: [1, 1.1, 1, 1.2, 1],
                  y: [0, -2, 0, -1, 0]
                }}
                exit={{ opacity: 0, scale: 0, transition: { duration: 0.2 } }}
                transition={{ 
                  duration: 0.5, 
                  repeat: Infinity,
                  repeatType: "mirror" 
                }}
              />
            )}
          </AnimatePresence>
          <div className="candle-stick">
            <div className="candle-stripes" />
          </div>
        </div>

        {/* Cake Body */}
        <div className="cake-body">
          <div className="cake-layer top chocolate">
            <div className="cake-icing chocolate-drip" />
            <div className="cherries">
              <div className="cherry" />
              <div className="cherry" />
              <div className="cherry" />
            </div>
          </div>
          <div className="cake-layer bottom chocolate">
            <div className="cake-icing chocolate-drip" />
            <div className="racing-stripe" />
          </div>
          <div className="cake-base chocolate" />
        </div>

        {/* Victory Message when blown out */}
        <AnimatePresence>
          {isBlownOut && (
            <motion.div
              className="victory-msg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <span className="victory-text">LAP 20 COMPLETE 🏁</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {!isBlownOut && (
        <motion.p 
          className="cake-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          Click the candle to celebrate!
        </motion.p>
      )}
    </div>
  );
}
