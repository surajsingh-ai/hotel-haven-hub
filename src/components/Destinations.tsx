import mumbai from "@/assets/dest-mumbai.jpg";
import goa from "@/assets/dest-goa.jpg";
import jaipur from "@/assets/dest-jaipur.jpg";
import manali from "@/assets/dest-manali.jpg";

const destinations = [
  { name: "Goa", img: goa, hotels: "1,240", tag: "Beach paradise" },
  { name: "Jaipur", img: jaipur, hotels: "892", tag: "Royal heritage" },
  { name: "Mumbai", img: mumbai, hotels: "2,310", tag: "City lights" },
  { name: "Manali", img: manali, hotels: "640", tag: "Mountain escape" },
];

const Destinations = () => (
  <section id="destinations" className="container mx-auto px-6 py-24">
    <div className="flex items-end justify-between mb-12 gap-6 flex-wrap">
      <div>
        <span className="text-accent text-xs font-bold uppercase tracking-widest mb-2 block">Trending now</span>
        <h2 className="font-display text-4xl md:text-5xl text-foreground max-w-2xl text-balance">
          Explore India's most loved destinations
        </h2>
      </div>
      <a href="#" className="text-primary font-semibold text-sm border-b-2 border-primary pb-1 hover:text-accent hover:border-accent transition-smooth">
        View all destinations →
      </a>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
      {destinations.map((d, i) => (
        <a
          key={d.name}
          href="#"
          className="group relative rounded-2xl overflow-hidden aspect-[4/5] shadow-card hover:shadow-elegant transition-smooth"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <img
            src={d.img}
            alt={`${d.name} - ${d.tag}`}
            loading="lazy"
            width={800}
            height={1000}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <span className="inline-block text-[10px] uppercase tracking-widest font-bold text-accent-glow mb-1">{d.tag}</span>
            <h3 className="font-display text-3xl mb-1">{d.name}</h3>
            <p className="text-sm text-white/80">{d.hotels} hotels</p>
          </div>
        </a>
      ))}
    </div>
  </section>
);

export default Destinations;
