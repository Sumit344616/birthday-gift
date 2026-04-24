"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { content } from "../data/content";

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const parallaxX = useTransform(mouseX, [-1000, 1000], [-50, 50]);
  const parallaxY = useTransform(mouseY, [-1000, 1000], [-50, 50]);
  const parallaxXReverse = useTransform(mouseX, [-1000, 1000], [50, -50]);
  const parallaxYReverse = useTransform(mouseY, [-1000, 1000], [50, -50]);

  if (!mounted) return null;

  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-transparent" style={{ perspective: "1000px" }}>
      
      {/* Premium Ambient Background Orbs */}
      <motion.div 
        style={{ x: parallaxX, y: parallaxY }}
        className="absolute inset-0 overflow-hidden pointer-events-none z-0"
      >
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
          className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-primary-pink/10 blur-[120px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 25, ease: "easeInOut" }}
          className="absolute bottom-[20%] right-[20%] w-[50vw] h-[50vw] rounded-full bg-primary-purple/30 blur-[150px]"
        />
      </motion.div>

      {/* Floating particles background */}
      <motion.div 
        style={{ x: parallaxXReverse, y: parallaxYReverse }}
        className="absolute inset-0 overflow-hidden pointer-events-none z-0"
      >
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-primary-pink opacity-20"
            initial={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
              y: typeof window !== "undefined" ? window.innerHeight + 100 : 1000,
              scale: Math.random() * 0.5 + 0.5,
              rotateX: Math.random() * 360,
              rotateY: Math.random() * 360,
            }}
            animate={{
              y: -100,
              x: `calc(${Math.random() * 100}vw)`,
              rotateX: Math.random() * 720,
              rotateY: Math.random() * 720,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Heart fill="currentColor" size={24} />
          </motion.div>
        ))}
      </motion.div>

      <div className="z-10 text-center px-4" style={{ transformStyle: "preserve-3d" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotateX: 45, filter: "blur(10px)", z: -200 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0, filter: "blur(0px)", z: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mb-6"
        >
          <h1 className="text-5xl md:text-7xl font-serif glow-text text-white leading-tight md:leading-normal">
            {content.hero.title}
          </h1>
          <Heart className="text-primary-pink fill-current w-12 h-12 md:w-16 md:h-16 animate-pulse glow-text" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          className="text-lg md:text-2xl text-gray-300 font-light tracking-wide mb-6 px-4"
        >
          {content.hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.5, delay: 1.6, ease: "easeOut" }}
          className="text-sm md:text-xl text-primary-pink font-serif italic mt-4"
        >
          <Typewriter text={content.hero.typingText} delay={2000} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 4, duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-xs md:text-sm tracking-widest uppercase z-20 text-center w-full"
      >
        Scroll down ↓
      </motion.div>
    </section>
  );
}

function Typewriter({ text, delay }: { text: string; delay: number }) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    timeout = setTimeout(() => {
      let i = 0;
      const typing = setInterval(() => {
        setDisplayText(text.slice(0, i + 1));
        i++;
        if (i === text.length) clearInterval(typing);
      }, 50);
      
      return () => clearInterval(typing);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, delay]);

  return <span>{displayText}</span>;
}
