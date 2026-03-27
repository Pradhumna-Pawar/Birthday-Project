"use client";
import { motion } from "framer-motion";
import BirthdayCake from "./BirthdayCake";

export default function WishesSection() {
  return (
    <section className="wishes-view">
      {/* Background Sparkles */}
      <div className="sparkle-container">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="sparkle"
            initial={{ 
              opacity: 0, 
              scale: 0,
              x: Math.random() * 100 - 50 + "%",
              y: Math.random() * 100 - 50 + "%"
            }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>

      <motion.div
        className="wishes-content"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <h2 className="wishes-title">Happy Birthday Lavanya ❤️</h2>
        <p className="wishes-text">
          You make every moment feel like a victory lap.<br />
          Keep shining, keep smiling, and keep being amazing.
        </p>

        {/* Aesthetic Cake */}
        <BirthdayCake />
      </motion.div>
    </section>
  );
}
