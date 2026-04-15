import { useState } from "react";
import { useNavigate } from "react-router-dom";


const promos = [
  { id: 1, title: "Promoción 1", image: "https://instagram.flim30-1.fna.fbcdn.net/v/t39.30808-6/476834670_655440843662995_7618678214351786380_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=110&ig_cache_key=MzA0MzQ0NjY5MjQzMTMwNzI3Nw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjIwNDh4MTM2NS5zZHIuQzMifQ%3D%3D&_nc_ohc=6L28OrpYJegQ7kNvwHctpx4&_nc_oc=AdqvWt1sGxYTcgRRwflMYHZp44_66bhau3m6MC33Y1jLpxtacndEJcopySq9X-tT7AprTYFF_cg10uZ3TBUsEe1J&_nc_ad=z-m&_nc_cid=1465&_nc_zt=23&_nc_ht=instagram.flim30-1.fna&_nc_gid=OqcP0FeK7r3t_JmCiW_SOg&_nc_ss=7a32e&oh=00_Af3TdviL9KQG0LEuVPYtJgbwTz40lu2qcEfzAVs8CYk_iA&oe=69E4CE79", target: "/promociones/1" },
  { id: 2, title: "Promoción 2", image: "https://instagram.flim30-1.fna.fbcdn.net/v/t39.30808-6/479189288_655440806996332_5730891265835793857_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=101&ig_cache_key=MzA0MzQ0NjY5MjQyMjg4ODIyOA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjIwNDh4MTM2NS5zZHIuQzMifQ%3D%3D&_nc_ohc=IYvHgsJEJ8IQ7kNvwFFJbYN&_nc_oc=Adr3NkNoEj0nDVj8aGlURJbGvoeConjF0snzqBeHcJl4-EPOJr1WZ7dKGefIhgV-LwODBoNs1wGx_yAaf8C5tu_A&_nc_ad=z-m&_nc_cid=1465&_nc_zt=23&_nc_ht=instagram.flim30-1.fna&_nc_gid=OqcP0FeK7r3t_JmCiW_SOg&_nc_ss=7a32e&oh=00_Af0WZmVZrFEcqGdlaQbSA8ub-_bRA34ENq9__36uRaRqqQ&oe=69E4D02B", target: "/promociones/2" },
  { id: 3, title: "Promoción 3", image: "https://instagram.flim30-1.fna.fbcdn.net/v/t39.30808-6/476829457_655440920329654_8010352033053511907_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=102&ig_cache_key=MzA0MzQ0NjY5MjExMjU4NjkzMA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjIwNDh4MTM2NS5zZHIuQzMifQ%3D%3D&_nc_ohc=rvI3KU7jzLwQ7kNvwHGtW7c&_nc_oc=AdratQaXD_TMuB5Prlqsw1vE8LLUVtd0rdQ8OLvkUczZ-Se1zlOYQx4QLBQRcyh4Cp5J3Q4RwB9At3xAwT3QosFR&_nc_ad=z-m&_nc_cid=1465&_nc_zt=23&_nc_ht=instagram.flim30-1.fna&_nc_gid=OqcP0FeK7r3t_JmCiW_SOg&_nc_ss=7a32e&oh=00_Af2xoS8aevA4lWuOoaA68n7Lf6soGxZsUoQ2s5bIqBTcgA&oe=69E4C586", target: "/productos/3" },
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
