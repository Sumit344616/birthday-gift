"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { content } from "../data/content";

const HeartConfetti = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[999999]">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-primary-pink drop-shadow-[0_0_15px_rgba(199,44,104,0.8)]"
          initial={{
            x: "50vw",
            y: "50vh",
            scale: 0,
          }}
          animate={{
            x: `calc(50vw + ${(Math.random() - 0.5) * 100}vw)`,
            y: `calc(50vh + ${(Math.random() - 0.5) * 100}vh)`,
            scale: Math.random() * 1.5 + 0.5,
            rotate: Math.random() * 720,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            ease: "easeOut",
          }}
        >
          <Heart fill="currentColor" size={Math.random() * 20 + 10} />
        </motion.div>
      ))}
    </div>
  );
};

export default function SecretSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <section className="w-full bg-transparent py-32 flex flex-col items-center justify-center relative overflow-hidden">
      
      <AnimatePresence>
        {showConfetti && <HeartConfetti />}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(true)}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.05, boxShadow: "0 0 20px 5px rgba(199, 44, 104, 0.4)" }}
        whileTap={{ scale: 0.95 }}
        className="px-8 py-4 rounded-full border border-primary-pink/50 text-primary-pink font-serif tracking-widest text-sm md:text-base uppercase transition-all duration-300"
      >
        {content.secret.buttonText}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center px-4 bg-black/80 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="max-w-2xl p-8 md:p-16 text-center rounded-3xl glass-panel cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-2xl md:text-5xl font-serif text-white leading-relaxed glow-text whitespace-pre-line tracking-wide">
                {content.secret.message}
              </p>
              
              <button 
                onClick={() => setIsOpen(false)}
                className="mt-16 text-xs text-gray-400 hover:text-white transition-colors uppercase tracking-[0.3em]"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
