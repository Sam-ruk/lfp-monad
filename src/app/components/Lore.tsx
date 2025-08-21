"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { patrick } from "../fonts";
import Heading from './Heading'

const Lore = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [doorsOpen, setDoorsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);

  const slides = [
    { id: 1, bgImage: "/lore/1.png", title: "The Birth", description: "On the planet Monad, scientists ran a secret experiment and gave a foot a soul." },
    { id: 2, bgImage: "/lore/2.png", title: "Great Escape", description: "They kept it locked in a laboratory… until one day, the foot escaped." },
    { id: 3, bgImage: "/lore/3.png", title: "Being Found", description: "On Earth, a group of scientists discovered it and dragged it into a hidden underground lab." },
    { id: 4, bgImage: "/lore/4.png", title: "New Looks", description: "There, they performed surgery, changed its appearance." },
    { id: 5, bgImage: "/lore/5.png", title: "Hard to Flee", description: 'They placed the foot under “special care.”' },
    { id: 6, bgImage: "/lore/6.png", title: "Gone Again", description: "But the foot slipped away once more and vanished into the forest." },
    { id: 7, bgImage: "/lore/7.png", title: "To the Heavens", description: "By blasting strange frequencies, it summoned the Foot Fetish spaceship from the stars." },
    { id: 8, bgImage: "/lore/8.png", title: "Back Home", description: "The ship carried it back to Monad—where its true story is about to begin." },
    { id: 9, bgImage: "/lore/9.png", title: "Roadmap", description: "Follow the footsteps to reach the roadmap.." }
  ];

  // Mouse move parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
        });
      }
    };
    const container = containerRef.current;
    if (container) container.addEventListener("mousemove", handleMouseMove);
    return () => container?.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Wheel + touch swipe handling
  useEffect(() => {
    let lastScrollTime = 0;

    const handleWheel = (e: WheelEvent) => {

      const now = Date.now();
      if (now - lastScrollTime < 700) return;
      lastScrollTime = now;

      if (e.deltaY > 0 && currentSlide < slides.length - 1) {
        setCurrentSlide((p) => p + 1);
      } else if (e.deltaY < 0 && currentSlide > 0) {
        setCurrentSlide((p) => p - 1);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartY.current === null) return;
      const delta = e.changedTouches[0].clientY - touchStartY.current;

      if (Math.abs(delta) > 50) {
        if (delta > 0 && currentSlide > 0) setCurrentSlide((p) => p - 1);
        if (delta < 0 && currentSlide < slides.length - 1) setCurrentSlide((p) => p + 1);
      }
      touchStartY.current = null;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false }); 
      container.addEventListener("touchstart", handleTouchStart, { passive: true });
      container.addEventListener("touchend", handleTouchEnd, { passive: false });
    }
    return () => {
      container?.removeEventListener("wheel", handleWheel);
      container?.removeEventListener("touchstart", handleTouchStart);
      container?.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentSlide]);

  useEffect(() => {
    if (!doorsOpen) return;

    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => {
          if (prev >= slides.length - 1) return 0;
          return prev + 1;
        });
      }, 12000);

      // store interval cleanup inside timeout
      return () => clearInterval(interval);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [doorsOpen, slides.length]);


  const handleOpenDoors = () => {
    setDoorsOpen(true);
    setCurrentSlide(0); 
  };

  return (
    <section id="lore" className="min-h-screen flex flex-col">
    <Heading text="LORE-MAP" className="mt-1"/>
    <div ref={containerRef} className="mt-1 relative w-full min-h-screen overflow-hidden bg-black">
      <AnimatePresence>
        {/* Doors Overlay */}
        <motion.div
          key="doors-overlay"
          className="absolute inset-0 flex items-center justify-center z-50"
          initial={{ opacity: 1 }}
          animate={{ opacity: doorsOpen ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: doorsOpen ? 1.5 : 0 }}
        >
          {/* Left Door */}
          <motion.div
            className="absolute left-0 top-0 h-full w-1/2"
            style={{
              backgroundImage: "url(/lore/door-l.png)",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right center",
            }}
            initial={{ x: 0 }}
            animate={{ x: doorsOpen ? "-100%" : 0 }}
            transition={{ 
              duration: 1.5, 
              ease: [0.25, 0.46, 0.45, 0.94], // Custom cubic-bezier for smooth motion
              delay: 0
            }}
          />

          {/* Right Door */}
          <motion.div
            className="absolute right-0 top-0 h-full w-1/2"
            style={{
              backgroundImage: "url(/lore/door-r.png)",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "left center",
            }}
            initial={{ x: 0 }}
            animate={{ x: doorsOpen ? "100%" : 0 }}
            transition={{ 
              duration: 1.5, 
              ease: [0.25, 0.46, 0.45, 0.94], // Custom cubic-bezier for smooth motion
              delay: 0
            }}
          />

          <motion.button
            className={`${patrick.className} relative z-50 px-10 py-4 bg-purple-400/80 text-white font-bold text-2xl rounded-full shadow-lg hover:scale-105 transition-transform`}
            onClick={handleOpenDoors}
            initial={{ scale: 0 }}
            animate={{ scale: doorsOpen ? 0 : 1 }}
            whileHover={{ scale: doorsOpen ? 0 : 1.1 }}
            transition={{ duration: 0.5 }}
          >
            Exp-LORE
          </motion.button>
        </motion.div>

        {doorsOpen && (
          <motion.div 
            key="story-content"
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {/* Background Slides */}
            {slides.map((slide, index) => (
              <motion.div
                key={slide.id}
                className="absolute inset-0 w-full h-full"
                animate={{ opacity: index === currentSlide ? 1 : 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                style={{
                  backgroundImage: `url(${slide.bgImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  willChange: "opacity, transform",
                  pointerEvents: index === currentSlide ? "auto" : "none", 
                }}
              >
                <div className="absolute inset-0 bg-purple-900/50"></div>
              </motion.div>
            ))}

            {/* Floating Parallax Layer */}
            <motion.div
              className="absolute right-[15%] top-1/3 hidden md:block z-10"
              animate={{
                x: mousePosition.x * -1.2,
                y: mousePosition.y * -1.5,
                rotateY: mousePosition.x * 0.3,
                rotateX: mousePosition.y * -0.2,
              }}
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
            />

            {/* Content */}
            <div className="relative z-20 h-full flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`slide-${slides[currentSlide].id}-content`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                  <h1
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white whitespace-pre-line leading-[0.9] mt-4"
                    style={{ textShadow: "0 10px 40px rgba(0,0,0,0.8)" }}
                  >
                    {slides[currentSlide].title}
                  </h1>
                  <p
                    className={`${patrick.className} mt-6 max-w-xl mx-auto text-white text-xl md:text-4xl leading-loose`}
                    style={{ textShadow: "0 2px 8px rgba(0, 0, 0, 0.7)" }}
                  >
                    {slides[currentSlide].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dots Navigation */}
            <div className="absolute bottom-6 right-6 z-[60] flex flex-col items-center space-y-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-white" : "bg-white/30"} hover:bg-white/70`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </section>
  );
};

export default Lore;