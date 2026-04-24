"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { content } from "../data/content";
import { useMobile } from "../hooks/useMobile";

function TypewriterText({ text, delay, active }: { text: string; delay: number, active: boolean }) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (!active) return;

    const timeout = setTimeout(() => {
      let i = 0;
      const typing = setInterval(() => {
        setDisplayText(text.slice(0, i + 1));
        i++;
        if (i === text.length) clearInterval(typing);
      }, 50);
      
      return () => clearInterval(typing);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, delay, active]);

  return <span>{displayText}</span>;
}

const GoldenFireflies = ({ isMobile }: { isMobile: boolean }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    {[...Array(isMobile ? 20 : 120)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full glow-effect"
        style={{
          width: Math.random() * 4 + 2 + "px",
          height: Math.random() * 4 + 2 + "px",
          left: Math.random() * 100 + "%",
          top: "100%",
          backgroundColor: Math.random() > 0.5 ? "#FFD700" : "#ffb6c1",
          boxShadow: `0 0 ${Math.random() * 10 + 5}px ${Math.random() > 0.5 ? "#FFD700" : "#ffb6c1"}`,
        }}
        animate={{
          y: ["0vh", "-100vh"],
          x: Math.random() > 0.5 ? [0, 50, -50, 0] : [0, -50, 50, 0],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: Math.random() * 10 + 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: Math.random() * 5,
        }}
      />
    ))}
  </div>
);

export default function Memory() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const isMobile = useMobile();
  
  return (
    <section ref={sectionRef} className="min-h-screen w-full relative flex items-center justify-center bg-transparent overflow-hidden px-6 py-24">
      <GoldenFireflies isMobile={isMobile} />
      
      <div className="z-10 flex flex-col items-center justify-center gap-4 text-center max-w-4xl min-h-[300px]">
        {content.memory.lines.map((line, idx) => (
          <motion.h2 
            key={idx}
            initial={{ opacity: 0, filter: isMobile ? "none" : "blur(5px)" }}
            whileInView={{ opacity: 1, filter: isMobile ? "none" : "blur(0px)" }}
            transition={{ duration: 1, delay: idx * 1.5 }}
            viewport={{ once: true, margin: "-100px" }}
            className={`text-3xl md:text-5xl font-serif text-white text-center glow-text h-12 md:h-16 flex items-center justify-center ${idx === 0 ? "mb-4" : "mt-6 text-xl md:text-3xl text-primary-pink drop-shadow-lg"}`}
          >
            <TypewriterText text={line} delay={idx * 1500} active={isInView} />
          </motion.h2>
        ))}
      </div>
    </section>
  );
}
