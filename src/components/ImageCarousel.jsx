import React from 'react';
import { motion } from 'framer-motion';

const carouselImages = [
  { src: "/images/hero1.webp", alt: "Creative Design" },
  { src: "/images/hero2.webp", alt: "Innovative Projects" },
  { src: "/images/hero3.webp", alt: "Dynamic Solutions" },
];

const ImageCarousel = () => (
  <div className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden">
    {carouselImages.map((image, index) => (
      <motion.img
        key={index}
        src={image.src}
        alt={image.alt}
        className="w-[80%] max-w-[500px] rounded-2xl shadow-lg hover:scale-105 transition-transform duration-500 cursor-pointer"
        whileHover={{ scale: 1.1, rotate: 3 }}
        initial={{ opacity: 0, x: -50 * index }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          delay: index * 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

export default ImageCarousel;
