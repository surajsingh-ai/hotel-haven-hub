import heroImage from "@/assets/hero-hotel.jpg";
import SearchBar from "./SearchBar";

const Hero = () => (
  <section className="relative min-h-[760px] md:min-h-[820px] flex flex-col">
    <img
      src={heroImage}
      alt="Luxury infinity pool overlooking ocean at sunset"
      className="absolute inset-0 w-full h-full object-cover"
      width={1920}
      height={1080}
    />
    <div className="absolute inset-0 gradient-hero" />

    <div className="relative container mx-auto px-6 pt-40 pb-32 flex-1 flex flex-col">
      <div className="max-w-3xl text-white mb-12">
        <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-widest mb-6">
          ✦ Over 1.2 Million stays worldwide
        </span>
        <h1 className="font-display text-5xl md:text-7xl leading-[1.05] mb-6 text-balance">
          Find your perfect <em className="text-accent-glow not-italic">stay</em>, anywhere.
        </h1>
        <p className="text-lg md:text-xl text-white/85 max-w-xl leading-relaxed">
          From budget-friendly rooms to luxury beach resorts — book the right hotel at the best price, instantly.
        </p>
      </div>

      <div className="mt-auto">
        <SearchBar />
      </div>
    </div>
  </section>
);

export default Hero;
