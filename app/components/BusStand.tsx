"use client";

import { motion } from "framer-motion";
import { content } from "../data/content";

const ShootingStars = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"
        style={{
          width: Math.random() * 100 + 50 + "px",
          left: Math.random() * 100 + "%",
          top: Math.random() * 50 + "%",
          rotate: -45,
        }}
        animate={{
          x: [200, -1000],
          y: [-200, 1000],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: Math.random() * 2 + 1,
          repeat: Infinity,
          repeatDelay: Math.random() * 10 + 5,
          ease: "linear",
          delay: Math.random() * 5,
        }}
      />
    ))}
  </div>
);

export default function BusStand() {
  return (
    <section className="min-h-screen w-full flex items-center justify-center relative overflow-hidden px-6 py-24">
      
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/IMG_6843.jpg')",
        }}
      />
      <div className="absolute inset-0 z-0 bg-black/70 backdrop-blur-[2px]" />
      
      {/* Gradient fade on top and bottom to blend with other sections */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />

      <ShootingStars />
      
      <div className="max-w-4xl text-center flex flex-col gap-2 relative z-10">
        {content.busStand.lines.map((line, idx) => (
          <motion.p
            key={idx}
            initial={{ opacity: 0, filter: "blur(8px)", y: 10 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 1.2, delay: idx * 0.6, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className={`text-2xl md:text-4xl font-serif glow-text drop-shadow-md ${line === "" ? "h-8" : "text-gray-200"}`}
          >
            {line}
          </motion.p>
        ))}
      </div>
    </section>
  );
}
