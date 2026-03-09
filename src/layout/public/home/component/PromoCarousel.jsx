import { useState } from "react";
import { useNavigate } from "react-router-dom";


const promos = [
  { id: 1, title: "Promoción 1", target: "/promociones/1" },
  { id: 2, title: "Promoción 2", target: "/promociones/2" },
  { id: 3, title: "Promoción 3", target: "/productos/3" },
  { id: 4, title: "Promoción 4", target: "/productos/4" },
];

function PromoCarousel() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? promos.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === promos.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex w-full items-center justify-between gap-6">
        <button
          onClick={prevSlide}
          className="rounded border-4 border-red-500 px-4 py-3 text-3xl text-yellow-300 bg-red-500"
        >
          ←
        </button>

        <button
          onClick={() => navigate(promos[current].target)}
          className="flex h-80 flex-1 items-center justify-center border-2 border-black bg-white text-4xl font-bold"
        >
          {promos[current].title}
        </button>

        <button
          onClick={nextSlide}
          className="rounded border-4 border-red-500 px-4 py-3 text-3xl text-yellow-300 bg-red-500"
        >
          →
        </button>
      </div>

      <div className="flex gap-4 content-center">
        {promos.map((promo, index) => (
          <button
            key={promo.id}
            onClick={() => setCurrent(index)}
            className={`rounded-full border-2 border-black ${
              current === index ? "h-5 w-5 bg-red-500" : "h-4 w-4 bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default PromoCarousel;