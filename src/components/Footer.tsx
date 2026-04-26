import { Hotel, Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => (
  <footer className="bg-background border-t border-border">
    <div className="container mx-auto px-6 py-16">
      <div className="grid md:grid-cols-5 gap-10 mb-12">
        <div className="md:col-span-2">
          <a href="/" className="flex items-center gap-2 mb-4">
            <div className="size-10 rounded-xl gradient-cta flex items-center justify-center shadow-cta">
              <Hotel className="size-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-2xl">StayKart</span>
          </a>
          <p className="text-muted-foreground text-sm max-w-sm leading-relaxed mb-5">
            India's most loved hotel booking platform. Better stays, better prices, every time.
          </p>
          <div className="flex gap-3">
            {[Facebook, Instagram, Twitter].map((Icon, i) => (
              <a key={i} href="#" className="size-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth">
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
        {[
          { title: "Company", links: ["About", "Careers", "Press", "Blog"] },
          { title: "Support", links: ["Help center", "Contact us", "Cancellation", "Safety"] },
          { title: "For partners", links: ["List your property", "Partner login", "Affiliate", "Resources"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="font-display text-base mb-4">{col.title}</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {col.links.map((l) => (
                <li key={l}><a href="#" className="hover:text-primary transition-smooth">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between gap-4 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} StayKart. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-primary transition-smooth">Privacy</a>
          <a href="#" className="hover:text-primary transition-smooth">Terms</a>
          <a href="#" className="hover:text-primary transition-smooth">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
