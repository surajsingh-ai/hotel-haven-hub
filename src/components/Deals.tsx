import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const deals = [
  { tag: "Limited time", title: "Weekend Getaway", desc: "Up to 35% off on weekend bookings across India", code: "WKND35", color: "from-primary to-primary-glow" },
  { tag: "New users", title: "First Stay Bonus", desc: "Flat ₹1,000 off on your first hotel booking", code: "FIRST1000", color: "from-accent to-accent-glow" },
  { tag: "Member only", title: "Gold Member Deals", desc: "Exclusive prices + free breakfast at 5,000+ hotels", code: "GOLD", color: "from-foreground to-primary" },
];

const Deals = () => (
  <section id="deals" className="container mx-auto px-6 py-24">
    <div className="text-center max-w-2xl mx-auto mb-12">
      <span className="text-accent text-xs font-bold uppercase tracking-widest mb-2 block">Don't miss out</span>
      <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4 text-balance">Today's hottest deals</h2>
      <p className="text-muted-foreground">Save more with curated offers, refreshed daily.</p>
    </div>

    <div className="grid md:grid-cols-3 gap-6">
      {deals.map((d) => (
        <div key={d.code} className={`relative rounded-2xl p-8 text-white overflow-hidden bg-gradient-to-br ${d.color} shadow-elegant group cursor-pointer`}>
          <div className="absolute -top-10 -right-10 size-48 rounded-full bg-white/10 group-hover:scale-110 transition-smooth" />
          <Sparkles className="size-8 mb-4 relative" />
          <span className="text-[10px] uppercase tracking-widest font-bold opacity-80 relative">{d.tag}</span>
          <h3 className="font-display text-3xl mt-1 mb-3 relative">{d.title}</h3>
          <p className="text-white/85 mb-6 relative">{d.desc}</p>
          <div className="flex items-center justify-between relative">
            <span className="font-mono text-sm bg-white/15 backdrop-blur px-3 py-1.5 rounded-md border border-white/20 border-dashed">
              {d.code}
            </span>
            <Button size="sm" variant="ghost" className="text-white hover:bg-white/15 hover:text-white">
              Apply <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default Deals;
