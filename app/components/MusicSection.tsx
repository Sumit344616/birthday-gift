"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import Image from "next/image";
import { content } from "../data/content";
import { useMobile } from "../hooks/useMobile";

export default function MusicSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: false, amount: 0.5 });
  const isMobile = useMobile();
  
  const images = content.gallery.photos.map((p) => p.src);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bgIndex, setBgIndex] = useState(-1);

  // Slideshow interval
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        setBgIndex(prev);
        return (prev + 1) % images.length;
      });
    }, 6000); // Change image every 6 seconds
    return () => clearInterval(interval);
  }, [isPlaying, images.length]);

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
  }, [inView, isPlaying]);

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

  // Find the active lyric index
  const activeLyricIndex = content.music.lyrics ? content.music.lyrics.reduce((acc, lyric, index) => {
    if (currentTime >= lyric.time) {
      return index;
    }
    return acc;
  }, -1) : -1;

  return (
    <section ref={sectionRef} className="min-h-screen w-full bg-transparent flex items-center justify-center flex-col relative overflow-hidden px-4 py-20 bg-cover bg-center">
      
      {/* Dynamic Background */}
      <AnimatePresence>
        {bgIndex >= 0 && (
          <motion.div
            key={`bg-${bgIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            <Image
              src={images[bgIndex]}
              alt="Background"
              fill
              className="object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-black/50" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="z-10 flex flex-col items-center">
        
        {/* Photo Container */}
        <motion.div
          onClick={togglePlay}
          initial={{ scale: 0.5, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, type: "spring" }}
          animate={isPlaying ? { scale: [1, 1.05, 1] } : {}}
          className="relative flex items-center justify-center w-48 h-48 md:w-64 md:h-64 rounded-full p-2 border-2 border-primary-pink cursor-pointer mb-8 overflow-hidden z-20 shadow-[0_0_20px_rgba(199,44,104,0.5)]"
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              key={`circle-${currentIndex}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 rounded-full overflow-hidden"
            >
              <Image 
                src={images[currentIndex]} 
                alt="Beautiful memory" 
                fill
                sizes="(max-width: 768px) 192px, 256px"
                className="object-cover pointer-events-none"
              />
            </motion.div>
          </AnimatePresence>
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
                    index === activeLyricIndex ? "text-primary-pink scale-110 drop-shadow-[0_0_10px_rgba(199,44,104,0.8)] font-bold opacity-100" : `text-gray-500 scale-90 opacity-40 ${isMobile ? "" : "blur-[1px]"}`
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
