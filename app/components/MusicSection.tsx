"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, useInView } from "framer-motion";
import { Heart } from "lucide-react";
import { content } from "../data/content";

const MagicalFloatingHearts = ({ active }: { active: boolean }) => {
  if (!active) return null;
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-primary-pink drop-shadow-[0_0_10px_rgba(199,44,104,0.8)]"
          style={{
            left: Math.random() * 100 + "%",
            top: "100%",
            opacity: Math.random() * 0.5 + 0.3,
          }}
          animate={{
            y: ["0vh", "-120vh"],
            x: Math.random() > 0.5 ? [0, 40, -40, 0] : [0, -40, 40, 0],
            scale: [1, 1.2, 1],
            rotate: [0, Math.random() > 0.5 ? 30 : -30, 0],
          }}
          transition={{
            duration: Math.random() * 15 + 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 10,
          }}
        >
          <Heart fill="currentColor" size={Math.random() * 15 + 10} />
        </motion.div>
      ))}
    </div>
  );
};

export default function MusicSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: false, amount: 0.5 });
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [20, -20]);
  const rotateY = useTransform(x, [-100, 100], [-20, 20]);

  useEffect(() => {
    if (inView && audioRef.current && !isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch((e) => {
          console.warn("Autoplay blocked. User interaction needed.", e);
          setIsPlaying(false);
        });
      }
    } else if (!inView && audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [inView]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error(e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  function handleMouse(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  // Find the active lyric index
  const activeLyricIndex = content.music.lyrics ? content.music.lyrics.reduce((acc, lyric, index) => {
    if (currentTime >= lyric.time) {
      return index;
    }
    return acc;
  }, -1) : -1;

  return (
    <section ref={sectionRef} className="min-h-screen w-full bg-transparent flex items-center justify-center flex-col relative overflow-hidden px-4 py-20 bg-cover bg-center" style={{ perspective: "1500px" }}>
      
      <MagicalFloatingHearts active={isPlaying} />

      {/* Main Content */}
      <div className="z-10 flex flex-col items-center" style={{ transformStyle: "preserve-3d" }}>
        
        {/* Photo Container */}
        <motion.div
          onClick={togglePlay}
          onMouseMove={handleMouse}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          initial={{ rotateY: 180, scale: 0.5, opacity: 0 }}
          whileInView={{ rotateY: 0, scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, type: "spring" }}
          animate={isPlaying ? { scale: [1, 1.05, 1], boxShadow: "0 0 40px 10px rgba(199, 44, 104, 0.8)" } : {}}
          className="relative w-48 h-48 md:w-64 md:h-64 rounded-full p-2 border-2 border-primary-pink cursor-pointer mb-8"
        >
          <img 
            src={content.music.finalPhoto} 
            alt="Final beautiful memory" 
            className="w-full h-full object-cover rounded-full pointer-events-none transition-all duration-500 opacity-100"
            style={{ transform: "translateZ(30px)" }}
          />
        </motion.div>

        {/* Title Lines */}
        <div className="flex flex-col items-center justify-center gap-4 mb-8">
          {content.music.lines.map((line, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30, rotateX: 20 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 1, delay: 0.5 + (idx * 0.5) }}
              className={`text-center font-serif text-white max-w-2xl glow-text ${idx === content.music.lines.length - 1 ? 'text-lg md:text-xl text-primary-pink mt-4 font-bold' : 'text-xl md:text-3xl'}`}
            >
              {line}
            </motion.div>
          ))}
        </div>

        {/* Lyrics Container */}
        {content.music.lyrics && (
          <div className="w-full max-w-2xl h-48 md:h-64 relative overflow-hidden flex flex-col items-center justify-center font-serif text-center mask-image-blur mt-4">
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-black/50 to-transparent z-10 hidden" />
            
            <motion.div 
              className="flex flex-col items-center justify-start w-full relative transition-transform duration-700 ease-out z-20"
              style={{
                transform: `translateY(calc(50% - ${activeLyricIndex * 40}px - 20px))`
              }}
            >
              {content.music.lyrics.map((lyric, index) => (
                <motion.div
                  key={index}
                  className={`h-[40px] flex items-center justify-center w-full transition-all duration-500 ease-in-out px-4 text-center md:text-2xl text-lg ${
                    index === activeLyricIndex ? "text-primary-pink scale-110 drop-shadow-[0_0_10px_rgba(199,44,104,0.8)] font-bold opacity-100" : "text-gray-500 scale-90 opacity-40 blur-[1px]"
                  }`}
                >
                  {lyric.text}
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

      </div>

      <audio 
        ref={audioRef} 
        src={content.music.songUrl} 
        loop 
        onTimeUpdate={handleTimeUpdate}
      />
    </section>
  );
}
