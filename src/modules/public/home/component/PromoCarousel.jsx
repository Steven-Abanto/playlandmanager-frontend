import { useState } from "react";
import { useNavigate } from "react-router-dom";


const promos = [
  { id: 1, title: "Promoción 1", image: "https://picsum.photos/1000/300", target: "/promociones/1" },
  { id: 2, title: "Promoción 2", image: "https://picsum.photos/1000/300", target: "/promociones/2" },
  { id: 3, title: "Promoción 3", image: "https://picsum.photos/1000/300", target: "/productos/3" },
  { id: 4, title: "Promoción 4", image: "https://picsum.photos/1000/300", target: "/productos/4" },
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
    <div className="flex flex-col items-center w-full">
      <div className="relative w-full group">
        <button
          onClick={() => navigate(promos[current].target)}
          className="flex w-full h-[500px] items-center justify-center bg-white text-4xl font-bold overflow-hidden transition"
        >
          {promos[current].image ? (
            <img src={promos[current].image} alt={promos[current].title} className="h-full w-full object-cover" />
          ) : (
            promos[current].title
          )}
        </button>

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-gray-400 px-4 py-3 text-2xl font-bold text-white hover:bg-gray-500 transition opacity-0 group-hover:opacity-100 cursor-pointer"
        >
          ←
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-gray-400 px-4 py-3 text-2xl font-bold text-white hover:bg-gray-500 transition opacity-0 group-hover:opacity-100 cursor-pointer"
        >
          →
        </button>
      </div>

      <div className="flex gap-3 mt-4 pb-4">
        {promos.map((promo, index) => (
          <button
            key={promo.id}
            onClick={() => setCurrent(index)}
            className={`rounded-full transition cursor-pointer ${
              current === index ? "h-4 w-4 bg-yellow-400" : "h-3 w-3 bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default PromoCarousel;
