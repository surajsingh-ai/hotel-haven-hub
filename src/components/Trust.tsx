import { ShieldCheck, Headphones, Tag, Zap } from "lucide-react";

const features = [
  { icon: ShieldCheck, title: "Verified hotels", desc: "Every property quality-checked by our team" },
  { icon: Tag, title: "Best price guarantee", desc: "Find a lower price? We'll match it, instantly" },
  { icon: Headphones, title: "24/7 support", desc: "Real humans available any time, in any timezone" },
  { icon: Zap, title: "Instant confirmation", desc: "Book in 60 seconds. No waiting, no hassle." },
];

const Trust = () => (
  <section className="bg-foreground text-background py-20">
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-10">
        {features.map((f) => (
          <div key={f.title} className="flex flex-col items-start">
            <div className="size-12 rounded-xl gradient-cta flex items-center justify-center mb-4 shadow-cta">
              <f.icon className="size-6 text-white" strokeWidth={2} />
            </div>
            <h3 className="font-display text-xl mb-1.5 text-background">{f.title}</h3>
            <p className="text-background/65 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Trust;
