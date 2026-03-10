import PromoCarousel from "../component/PromoCarousel";
import InfoSection from "../component/InfoSection";

function HomePage() {
  return (
    <div className="bg-neutral-100">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <PromoCarousel />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <InfoSection />
      </section>
    </div>
  );
}

export default HomePage;