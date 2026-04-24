"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { Flower2, Heart } from "lucide-react";
import Image from "next/image";
import { content } from "../data/content";
import { useMobile } from "../hooks/useMobile";

function Card3D({ photo, index }: { photo: { src: string; alt: string }; index: number }) {
  return (
    <div className={`relative rounded-xl shadow-xl z-10 hover:z-20 ${index % 2 === 0 ? "translate-y-8" : ""}`}>
      <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.02]">
        <div className="absolute inset-0 glow-effect opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover pointer-events-none"
        />
      </div>
    </div>
  );
}

const SnowEffect = ({ isMobile }: { isMobile: boolean }) => (
  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-3xl">
    {[...Array(isMobile ? 10 : 30)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute bg-white rounded-full opacity-60 drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]"
        style={{
          width: Math.random() * 4 + 2 + "px",
          height: Math.random() * 4 + 2 + "px",
          left: Math.random() * 100 + "%",
          top: -20,
        }}
        animate={{
          y: [-20, 1000],
          x: Math.random() > 0.5 ? [0, 30, -30, 0] : [0, -30, 30, 0],
        }}
        transition={{
          duration: Math.random() * 8 + 6,
          repeat: Infinity,
          ease: "linear",
          delay: Math.random() * 5,
        }}
      />
    ))}
  </div>
);

const RoseRainEffect = ({ isMobile }: { isMobile: boolean }) => (
  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-3xl">
    {[...Array(isMobile ? 8 : 25)].map((_, i) => {
      const Icon = i % 3 === 0 ? Heart : Flower2;
      return (
        <motion.div
          key={i}
          className="absolute text-primary-pink opacity-40 drop-shadow-[0_0_8px_rgba(199,44,104,0.6)]"
          style={{
            left: Math.random() * 100 + "%",
            top: -50,
          }}
          animate={{
            y: [-50, 1000],
            x: Math.random() > 0.5 ? [0, 50, -50, 0] : [0, -50, 50, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: Math.random() * 8 + 7,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
        >
          <Icon size={Math.random() * 16 + 12} fill={i % 3 === 0 ? "currentColor" : "none"} />
        </motion.div>
      )
    })}
  </div>
);

export default function Gallery() {
  const isMobile = useMobile();

  return (
    <section className="min-h-screen py-24 bg-transparent w-full px-6 md:px-12 flex flex-col md:flex-row items-center justify-center gap-12" style={{ perspective: "1500px" }}>
      
      {/* Left side text with Snow */}
      <div className="relative w-full md:w-1/2 flex flex-col justify-center gap-2 min-h-[50vh] p-4 md:p-8">
        <SnowEffect isMobile={isMobile} />
        
        <div className="z-10 flex flex-col gap-2">
          {content.gallery.lines.map((line, idx) => (
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: idx * 0.3 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`text-2xl md:text-4xl font-serif leading-relaxed ${line === "" ? "h-6" : "text-white"}`}
            >
              {line}
            </motion.p>
          ))}
        </div>
      </div>

      {/* Right side photos with Rose Rain */}
      <div className="relative w-full md:w-1/2 grid grid-cols-2 gap-8 md:gap-4 p-8 min-h-[50vh]">
        <RoseRainEffect isMobile={isMobile} />
        
        {content.gallery.photos.map((photo, i) => (
          <Card3D key={i} photo={photo} index={i} />
        ))}
      </div>

    </section>
  );
}
