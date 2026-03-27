"use client";
import { motion } from "framer-motion";

const PHOTOS = [
  { src: "/gallery_1.png", caption: "The Beginning 🏁" },
  { src: "/gallery_2.png", caption: "Beautiful Memories ❤️" },
  { src: "/gallery_3.png", caption: "Crazy Fun Moments 😄" },
  { src: "/gallery_4.png", caption: "Still Winning My Heart 💫" },
  { src: "/gallery_5.png", caption: "Champion Forever 🏆" },
];

export default function PhotoGallery() {
  return (
    <section className="gallery-container">
      <motion.header 
        className="gallery-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <span className="gallery-eyebrow">The Journey Begins</span>
        <h2 className="gallery-birthdate">23 APRIL 2006</h2>
        <div className="header-line" />
      </motion.header>

      <div className="timeline-line" />
      
      {PHOTOS.map((photo, index) => (
        <motion.div
          key={index}
          className={`gallery-item ${index % 2 === 0 ? "left" : "right"}`}
          initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="photo-card">
            <div className="photo-img-container">
              <motion.img
                src={photo.src}
                alt={photo.caption}
                className="gallery-img"
                initial={{ scale: 1 }}
                whileInView={{ scale: 1.1 }}
                transition={{ duration: 6, ease: "linear" }}
              />
            </div>
            <p className="photo-caption">{photo.caption}</p>
          </div>
          
          <div className="timeline-dot" />
        </motion.div>
      ))}
    </section>
  );
}
