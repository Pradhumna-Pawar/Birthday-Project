"use client";
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CountdownIntro from "@/components/CountdownIntro";
import F1Car from "@/components/F1Car";
import Driver from "@/components/Driver";
import SoundManager from "@/components/SoundManager";
import PhotoGallery from "@/components/PhotoGallery";
import WishesSection from "@/components/WishesSection";

type Phase =
  | "intro"
  | "countdown"
  | "car-enters"
  | "car-stops"
  | "driver-reveal"
  | "driver-wave"
  | "gallery"
  | "wishes";

const DRIVERS = [
  {
    name: "Max Verstappen",
    team: "World Champion · Red Bull Racing",
    carNo: "1",
    image: "/driver.png",
    carImage: "/f1car.png",
    accentColor: "#dc0000",
  },
  {
    name: "Lewis Hamilton",
    team: "7X World Champion · Mercedes-AMG",
    carNo: "44",
    image: "/driver_lewis.png",
    carImage: "/car_lewis.png",
    accentColor: "#00d2be",
  },
];

export default function Home() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentDriverIndex, setCurrentDriverIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPhase("countdown"), 300);
    return () => clearTimeout(t);
  }, []);

  const handleCountdownComplete = useCallback(() => {
    setPhase("car-enters");
  }, []);

  const handleCarStopped = useCallback(() => {
    setPhase("car-stops");
    setTimeout(() => {
      setPhase("driver-wave");
      setPhase("driver-reveal");
      setCanScroll(true);
    }, 600);
  }, []);

  const handleNext = useCallback(() => {
    if (!canScroll) return;

    if (currentDriverIndex < DRIVERS.length - 1) {
      // Move to next driver
      setCanScroll(false);
      setPhase("intro");
      setTimeout(() => {
        setCurrentDriverIndex((prev) => prev + 1);
        setPhase("car-enters");
      }, 2500);
    } else if (phase === "driver-reveal") {
      // Move to gallery
      setCanScroll(false);
      setPhase("gallery");
      // Allow normal page scrolling for the gallery
      document.body.style.overflow = "auto";
    }
  }, [canScroll, currentDriverIndex, phase]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 50) {
        handleNext();
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY; // Positive means swiped up
      if (deltaY > 50) {
        handleNext();
      }
    };

    window.addEventListener("wheel", handleWheel);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleNext]);

  const carPhaseVisible = phase === "car-enters" || phase === "car-stops";
  const driverVisible = phase === "driver-reveal";
  const currentDriver = DRIVERS[currentDriverIndex];

  const handleReplay = () => {
    setCanScroll(false);
    setCurrentDriverIndex(0);
    setPhase("intro");
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
    setTimeout(() => setPhase("countdown"), 150);
  };

  return (
    <main
      style={{
        position: "relative",
        width: "100vw",
        minHeight: "100vh",
        background: "#ffffff",
        overflowX: "hidden",
      }}
    >
      {/* Background grid - only fixed during animation phases */}
      <div className={`page-bg ${(phase === "gallery" || phase === "wishes") ? "absolute" : "fixed"}`} />

      {/* Track strip - fixed during animation */}
      {(phase !== "gallery" && phase !== "wishes") && (
        <>
          <div className="track-strip" />
          <div className="track-center-line" />
        </>
      )}

      {/* Sound Manager */}
      <SoundManager muted={muted} phase={phase} />

      {/* Mute Button */}
      <button
        className="mute-btn"
        onClick={() => setMuted((m) => !m)}
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? "🔇 MUTED" : "🔊 SOUND"}
      </button>

      {/* Countdown Intro */}
      <AnimatePresence>
        {phase === "countdown" && (
          <CountdownIntro onComplete={handleCountdownComplete} />
        )}
      </AnimatePresence>

      {/* F1 Car */}
      {carPhaseVisible && (
        <F1Car 
          phase={phase} 
          onCarStopped={handleCarStopped} 
          carImage={currentDriver.carImage} 
        />
      )}

      {/* Driver Reveal Card */}
      <Driver 
        visible={driverVisible} 
        name={currentDriver.name}
        team={currentDriver.team}
        image={currentDriver.image}
        carNo={currentDriver.carNo}
        accentColor={currentDriver.accentColor}
      />

      {/* Photo Gallery Section */}
      {phase === "gallery" && <PhotoGallery />}

      {/* Final Wishes Section */}
      {phase === "gallery" && <WishesSection />}

      {/* Scroll Hint */}
      {driverVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1, repeat: Infinity, repeatType: "reverse" }}
          style={{
            position: "fixed",
            bottom: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            color: "#666",
            fontSize: "0.8rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            zIndex: 100,
          }}
        >
          {currentDriverIndex < DRIVERS.length - 1 ? "SCROLL FOR MORE ↓" : "SCROLL TO JOURNEY ↓"}
        </motion.div>
      )}

      {/* Replay button at the very end */}
      {phase === "gallery" && (
        <div
          style={{
            padding: "60px 0",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button className="replay-btn" onClick={handleReplay}>
            ↩ REPLAY JOURNEY
          </button>
        </div>
      )}
    </main>
  );
}

