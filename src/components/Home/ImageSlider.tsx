import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    url: "https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg",
    title: "Temple of the Sacred Tooth Relic",
    description: "Discover the ancient Buddhist temple in Kandy, Sri Lanka"
  },
  {
    url: "https://images.pexels.com/photos/1903702/pexels-photo-1903702.jpeg",
    title: "Pristine Coastal Beauty",
    description: "Experience the untouched beaches and rugged coastlines"
  },
  {
    url: "https://images.pexels.com/photos/247597/pexels-photo-247597.jpeg",
    title: "Rice Terraces Experience",
    description: "Immerse yourself in the traditional farming culture"
  }
];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <div className="relative h-screen w-full">
      <div
        className="w-full h-full bg-center bg-cover duration-500"
        style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40">
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                {slides[currentIndex].title}
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
                {slides[currentIndex].description}
              </p>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg text-lg transition-colors duration-300">
                Start Your Journey
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Left Arrow */}
      <div className="absolute top-1/2 left-5 -translate-y-1/2">
        <button
          onClick={prevSlide}
          className="p-2 bg-black/30 text-white rounded-full hover:bg-black/50 transition-colors duration-300"
        >
          <ChevronLeft size={30} />
        </button>
      </div>

      {/* Right Arrow */}
      <div className="absolute top-1/2 right-5 -translate-y-1/2">
        <button
          onClick={nextSlide}
          className="p-2 bg-black/30 text-white rounded-full hover:bg-black/50 transition-colors duration-300"
        >
          <ChevronRight size={30} />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentIndex === index ? 'bg-white w-8' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;