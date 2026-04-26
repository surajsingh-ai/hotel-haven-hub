import { Star, MapPin, Heart, Wifi, Coffee, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import h1 from "@/assets/hotel-1.jpg";
import h2 from "@/assets/hotel-2.jpg";
import h3 from "@/assets/hotel-3.jpg";
import h4 from "@/assets/hotel-4.jpg";

const hotels = [
  { img: h1, name: "The Grand Skyline", city: "Mumbai, Bandra West", rating: 4.8, reviews: 2847, price: 7499, original: 9999, tag: "City Favourite", amenities: ["Wifi", "Pool", "Breakfast"] },
  { img: h2, name: "Azure Beach Resort", city: "Goa, Calangute", rating: 4.9, reviews: 1923, price: 12499, original: 15999, tag: "Best Seller", amenities: ["Wifi", "Pool", "Breakfast"] },
  { img: h3, name: "Heritage Palace Hotel", city: "Jaipur, City Palace", rating: 4.7, reviews: 3201, price: 5999, original: 8499, tag: "Member Deal", amenities: ["Wifi", "Pool", "Breakfast"] },
  { img: h4, name: "Pinewood Mountain Lodge", city: "Manali, Old Manali", rating: 4.6, reviews: 1456, price: 4299, original: 5999, tag: "Mountain View", amenities: ["Wifi", "Pool", "Breakfast"] },
];

const iconMap: Record<string, any> = { Wifi, Pool: Waves, Breakfast: Coffee };

const PopularHotels = () => (
  <section id="hotels" className="bg-secondary/40 py-24">
    <div className="container mx-auto px-6">
      <div className="flex items-end justify-between mb-12 gap-6 flex-wrap">
        <div>
          <span className="text-accent text-xs font-bold uppercase tracking-widest mb-2 block">Handpicked stays</span>
          <h2 className="font-display text-4xl md:text-5xl text-foreground text-balance">
            Hotels travelers love right now
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {hotels.map((h) => {
          const off = Math.round(((h.original - h.price) / h.original) * 100);
          return (
            <article key={h.name} className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elegant transition-smooth group flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={h.img} alt={h.name} loading="lazy" width={800} height={600} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-cta">
                  {h.tag}
                </span>
                <button className="absolute top-3 right-3 size-9 rounded-full bg-white/95 backdrop-blur flex items-center justify-center hover:bg-white transition-smooth shadow-card group/h">
                  <Heart className="size-4 text-foreground group-hover/h:fill-accent group-hover/h:text-accent transition-smooth" />
                </button>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-display text-xl leading-tight">{h.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                  <MapPin className="size-3" /> {h.city}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-success text-success-foreground text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <Star className="size-3 fill-current" /> {h.rating}
                  </span>
                  <span className="text-xs text-muted-foreground">({h.reviews.toLocaleString()} reviews)</span>
                </div>
                <div className="flex items-center gap-3 mb-4 text-muted-foreground">
                  {h.amenities.map((a) => {
                    const Icon = iconMap[a];
                    return <Icon key={a} className="size-4" />;
                  })}
                </div>
                <div className="mt-auto pt-4 border-t border-border flex items-end justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-foreground">₹{h.price.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground line-through">₹{h.original.toLocaleString()}</span>
                    </div>
                    <span className="text-xs text-success font-semibold">{off}% off · per night</span>
                  </div>
                  <Button size="sm" className="bg-primary hover:bg-primary-glow text-primary-foreground rounded-lg">Book</Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  </section>
);

export default PopularHotels;
