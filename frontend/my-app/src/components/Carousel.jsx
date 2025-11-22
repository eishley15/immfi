"use client";
import React, { useRef, useState, useEffect } from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const cards = [
  {
    img: "/images/cards/card-1.webp",
    title: "Education",
    desc: "IMMFI help Children with Special Needs in their education, through subsidy of their transportation expenses.",
  },
  {
    img: "/images/cards/card-2.webp",
    title: "Medical & Allied Services",
    desc: "IMMFI offers therapy assessments and 20 sessions with LGU support, while guiding families through home programs for lasting care.",
  },
  {
    img: "/images/cards/card-3.webp",
    title: "Palengkiskwela",
    desc: 'Provides street children access to education through ALS, with a mobile teacher at the "Palengkiskwela" in San Fernando\'s old market.',
  },
  {
    img: "/images/cards/card-4.webp",
    title: "Socio & Cultural Activities",
    desc: "IMMFI builds social skills through fun activities and meaningful disability-focused community events.",
  },
  {
    img: "/images/cards/card-5.webp",
    title: "Networking & Partnership Building",
    desc: "IMMFI partners with donors, NGOs, volunteers, schools, LGUs, and communities, building linkages with groups that share its advocacy.",
  },
  {
    img: "/images/cards/card-6.webp",
    title: "Advocacy & Community Education",
    desc: "This activity promotes PWD rights, raises awareness, and encourages independence and inclusion in society.",
  },
];

export default function Carousel() {
  const sliderRef = useRef(null);
  const wrapperRef = useRef(null);

  const [slidesToShow, setSlidesToShow] = useState(3);
  const [activeIndexes, setActiveIndexes] = useState([0, 1, 2]);

  useEffect(() => {
    const initial = [];
    for (let i = 0; i < slidesToShow; i++) initial.push(i % cards.length);
    setActiveIndexes(initial);
  }, [slidesToShow]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const update = (width) => {
      if (width < 640) setSlidesToShow(1);
      else if (width >= 640 && width < 1024) setSlidesToShow(2);
      else setSlidesToShow(3);
    };

    update(el.clientWidth);

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        update(w);
      }
    });
    ro.observe(el);

    const onResize = () => update(el.clientWidth);
    window.addEventListener("resize", onResize);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const handleBeforeChange = (oldIndex, newIndex) => {
    const visible = [];
    for (let i = 0; i < slidesToShow; i++) {
      visible.push((newIndex + i) % cards.length);
    }
    setActiveIndexes(visible);
  };

  const goToPrev = () => {
    sliderRef.current?.slickPrev();
  };

  const goToNext = () => {
    sliderRef.current?.slickNext();
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    cssEase: "ease",
    pauseOnHover: true,
    arrows: false,
    swipe: true,
    swipeToSlide: true,
    draggable: true,
    touchMove: true,
    touchThreshold: 6,
    beforeChange: handleBeforeChange,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 640, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="w-full h-auto flex justify-center pb-10">
      <div
        ref={wrapperRef}
        className="w-[1100px] max-w-full relative"
        style={{ cursor: "grab" }}
        onMouseDown={(e) => (e.currentTarget.style.cursor = "grabbing")}
        onMouseUp={(e) => (e.currentTarget.style.cursor = "grab")}
        onMouseLeave={(e) => (e.currentTarget.style.cursor = "grab")}
      >
        {/* Previous Button */}
        <button
          onClick={goToPrev}
          className="absolute left-0 sm:-left-4 lg:-left-12 top-1/2 -translate-y-1/2 z-10
                     w-10 h-10 sm:w-12 sm:h-12 
                     bg-white hover:bg-[#2E7D32] 
                     border border-gray-200 hover:border-[#2E7D32]
                     rounded-full shadow-lg hover:shadow-xl
                     flex items-center justify-center
                     transition-all duration-300 ease-out
                     group"
          aria-label="Previous slide"
        >
          <ChevronLeft
            size={24}
            className="text-gray-600 group-hover:text-white transition-colors duration-300"
          />
        </button>

        {/* Next Button */}
        <button
          onClick={goToNext}
          className="absolute right-0 sm:-right-4 lg:-right-12 top-1/2 -translate-y-1/2 z-10
                     w-10 h-10 sm:w-12 sm:h-12 
                     bg-white hover:bg-[#2E7D32] 
                     border border-gray-200 hover:border-[#2E7D32]
                     rounded-full shadow-lg hover:shadow-xl
                     flex items-center justify-center
                     transition-all duration-300 ease-out
                     group"
          aria-label="Next slide"
        >
          <ChevronRight
            size={24}
            className="text-gray-600 group-hover:text-white transition-colors duration-300"
          />
        </button>

        <Slider ref={sliderRef} {...settings}>
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              className="px-4 py-8 sm:py-10 lg:py-15"
              initial={{ opacity: 0, y: 50 }}
              animate={
                activeIndexes.includes(idx)
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0.7, y: 50, scale: 0.97 }
              }
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div
                className="w-full bg-white rounded-xl border-1 border-gray-300 flex flex-col items-center justify-start text-xl font-bold shadow-md
                           h-[380px] sm:h-[450px] lg:h-[510px]"
              >
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-full object-cover rounded-t-lg mb-4
                             h-[180px] sm:h-[220px] lg:h-[260px]"
                />
                <div
                  className="montserrat w-full text-white font-semibold text-left
                             text-[12px] sm:text-[13px] lg:text-[14px]
                             pr-6 sm:pr-12 lg:pr-20 -mt-8 sm:-mt-10 lg:-mt-12 mb-6 sm:mb-8"
                >
                  <div className="p-3 bg-[#F09F1B] text-center tracking-[0.04em]">
                    {card.title}
                  </div>
                </div>
                <div
                  className="text-gray-700 font-normal text-left
                             text-sm sm:text-base lg:text-base
                             mx-6 sm:mx-8 lg:mx-10"
                >
                  {card.desc}
                </div>
              </div>
            </motion.div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
