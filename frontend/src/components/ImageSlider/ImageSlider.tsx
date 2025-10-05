import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  "https://i.kym-cdn.com/entries/icons/mobile/000/055/084/coco-martin-sir-tapos-na-po.jpg",
  "https://source.unsplash.com/600x300/?success",
  "https://i.kym-cdn.com/entries/icons/mobile/000/055/084/coco-martin-sir-tapos-na-po.jpg",
];

function ImageSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const prevSlide = () => {
    setDirection("left");
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextSlide = () => {
    setDirection("right");
    setCurrent((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="relative w-full max-w-xl mt-8 rounded-2xl shadow-lg">
      {/* inner container keeps images clipped */}
      <div className="relative h-64 overflow-hidden rounded-2xl">
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-transform duration-700 ease-in-out ${
              index === current
                ? "translate-x-0 opacity-100 z-10"
                : direction === "right"
                ? "translate-x-full opacity-0"
                : "-translate-x-full opacity-0"
            }`}
          >
            <img
              src={img}
              alt={`Slide ${index}`}
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        ))}
      </div>

      {/* Prev Button */}
      <button
        onClick={prevSlide}
        className="absolute -left-6 top-1/2 -translate-y-1/2 z-20
                   bg-white/40 hover:bg-white/60 text-white p-3 rounded-full transition shadow-lg"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        className="absolute -right-6 top-1/2 -translate-y-1/2 z-20
                   bg-white/40 hover:bg-white/60 text-white p-3 rounded-full transition shadow-lg"
      >
        <ChevronRight size={28} />
      </button>
    </div>
  );
}

export default ImageSlider;
