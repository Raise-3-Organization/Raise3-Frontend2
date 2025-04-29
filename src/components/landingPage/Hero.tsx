"use client";

import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import Waitlist from "../ui/waitlist-modal";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const openmodal = () => {
    setOpen(true);
  };

  const closemodal = () => {
    console.log("clicked");
    setOpen(false);
  };

  // ✅ Correct particle generation
  const particles = useMemo(
    () =>
      [...Array(5)].map(() => ({
        left: Math.random() * 100 + "%", // left position
        top: Math.random() * 100 + "%",  // top position
        initialOpacity: 0.2 + Math.random() * 0.3,
        animateY: Math.random() * -40 - 10, // upward floating
        animateOpacity: 0,
        transitionDuration: 4 + Math.random() * 6,
        transitionDelay: Math.random() * 2,
      })),
    []
  );

  return (
    <>
      {open ? <Waitlist close={closemodal} /> : null}

      <section
        className="relative w-full h-[90vh] flex flex-col items-center justify-center text-center px-4 text-white bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/detc4yjdi/image/upload/v1745444983/Frame_1_1_off7gt.png')",
        }}
      >
        {/* Dark overlay */}
        <motion.div
          className="absolute inset-0 bg-[#0B0B0F]/80 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Glowing Circle */}
        <motion.img
          src="https://res.cloudinary.com/detc4yjdi/image/upload/v1745445887/Ellipse_532_zl7m3f.png"
          alt="Glow"
          className="absolute z-10 w-[30rem] h-[30rem] object-contain top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 pointer-events-none opacity-60"
          initial={{ opacity: 0, scale: 1 }}
          animate={{
            opacity: [0.4, 0.6, 0.4],
            scale: [1.4, 1.5, 1.4],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />

        {/* Content */}
        <div className="relative z-20 flex flex-col items-center">
          {/* Badge */}
          <motion.div
            className="mb-4 text-sm rounded-full px-4 py-1 border border-gray-500 inline-flex items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img
              src="https://res.cloudinary.com/detc4yjdi/image/upload/v1745446839/Frame_axv68h.png"
              alt="Icon"
              className="w-5 h-5"
            />
            Connecting Founders to Investors
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-4xl md:text-6xl font-bold max-w-3xl leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Raising capital shouldn't feel like a pitch marathon
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="mt-4 text-gray-300 max-w-xl text-base font-krona"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Raise3 helps Web3 founders connect with the right early investors — transparently, on-chain, and without the noise.
          </motion.p>

          {/* Buttons */}
          <motion.div
            className="mt-8 flex gap-4 flex-wrap justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <motion.button
              className="bg-white text-black px-6 py-3 rounded-full font-semibold flex items-center gap-2 font-krona cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              onClick={openmodal}
            >
              <img
                src="https://res.cloudinary.com/detc4yjdi/image/upload/v1745446860/Frame_1_qkcrgd.png"
                alt="Launch Icon"
                className="w-5 h-5"
              />
              Launch a Campaign
            </motion.button>

            <motion.button
              className="border border-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition-colors duration-300 font-krona cursor-pointer"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 1)",
                color: "#000",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Explore Projects
            </motion.button>
          </motion.div>
        </div>

        {/* ✅ Floating Particles FIXED */}
        {particles.map((particle, i) => (
          <motion.div
            suppressHydrationWarning
            key={i + 1}
            className="absolute w-2 h-2 bg-white rounded-full opacity-50 z-10"
            style={{ top: particle.top, left: particle.left }}
            initial={{
              opacity: particle.initialOpacity,
            }}
            animate={{
              y: particle.animateY,
              opacity: particle.animateOpacity,
            }}
            transition={{
              duration: particle.transitionDuration,
              repeat: Infinity,
              delay: particle.transitionDelay,
            }}
          />
        ))}
      </section>
    </>
  );
};

export default Hero;
