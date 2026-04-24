"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { content } from "../data/content";
import { useMobile } from "../hooks/useMobile";
import Image from "next/image";

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


export default function Memory() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const isMobile = useMobile();
  
  return (
    <section ref={sectionRef} className="min-h-screen w-full relative flex items-center justify-center overflow-hidden px-6 py-24">
      {/* Static Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/gallery-2.jpeg"
          alt="Memory Background"
          fill
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      
      <div className="z-10 flex flex-col items-center justify-center gap-4 text-center max-w-4xl min-h-[300px]">
        {content.memory.lines.map((line, idx) => (
          <motion.h2 
            key={idx}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: idx * 1.5 }}
            viewport={{ once: true, margin: "-100px" }}
            className={`text-3xl md:text-5xl font-serif text-white text-center h-12 md:h-16 flex items-center justify-center ${idx === 0 ? "mb-4" : "mt-6 text-xl md:text-3xl text-primary-pink"}`}
          >
            <TypewriterText text={line} delay={idx * 1500} active={isInView} />
          </motion.h2>
        ))}
      </div>
    </section>
  );
}
