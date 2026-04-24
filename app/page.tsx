"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "./components/Hero";
import Memory from "./components/Memory";
import Gallery from "./components/Gallery";
import BusStand from "./components/BusStand";
import MusicSection from "./components/MusicSection";
import SecretSection from "./components/SecretSection";
import { Heart } from "lucide-react";
import { useMobile } from "./hooks/useMobile";

export default function Home() {
  const [started, setStarted] = useState(false);
  const isMobile = useMobile();

  return (
    <main className="flex min-h-screen flex-col bg-black text-white selection:bg-primary-pink selection:text-white relative w-full animated-gradient-bg">
      
      <AnimatePresence>
        {!started && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: isMobile ? "none" : "blur(20px)" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/60 backdrop-blur-md cursor-pointer"
            onClick={() => setStarted(true)}
          >
            {/* Pulsing rings behind the card */}
            <motion.div 
              animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0.2, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeOut" }}
              className="absolute w-48 h-48 rounded-full border border-primary-pink/50 pointer-events-none"
            />
            <motion.div 
              animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0.2, 0] }}
              transition={{ repeat: Infinity, duration: 3, delay: 1.5, ease: "easeOut" }}
              className="absolute w-48 h-48 rounded-full border border-primary-pink/50 pointer-events-none"
            />

            {/* Glassmorphism Invitation Card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative flex flex-col items-center justify-center px-12 py-16 rounded-3xl glass-panel glow-effect hover:bg-white/10 transition-colors duration-500"
            >
              <Heart className="w-12 h-12 text-primary-pink fill-current mb-6 drop-shadow-[0_0_15px_rgba(199,44,104,0.8)]" />
              <span className="font-serif text-2xl tracking-[0.3em] uppercase text-white/90 font-light drop-shadow-md">
                Click to Begin
              </span>
              <span className="text-xs text-white/40 mt-4 font-mono uppercase tracking-widest">
                Please turn on sound
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`${started ? "block" : "hidden"} w-full`}>
        {started && (
          <>
            <Hero />
            <Memory />
            <Gallery />
            <BusStand />
            <MusicSection />
            <SecretSection />
          </>
        )}
      </div>
    </main>
  );
}
