import PromoCarousel from "../component/PromoCarousel";
import InfoSection from "../component/InfoSection";

function HomePage() {
  return (
    <div className="bg-gradient-to-br from-blue-100 via-yellow-100 to-red-100 min-h-screen">
      <section className="w-full">
        <PromoCarousel />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <InfoSection />
      </section>
    </div>
  );
}

export default HomePage;
