import { Hotel, Menu, User, Globe, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => (
  <header className="absolute top-0 left-0 right-0 z-50">
    <div className="container mx-auto px-6 py-5 flex items-center justify-between">
      <a href="/" className="flex items-center gap-2 text-white">
        <div className="size-10 rounded-xl gradient-cta flex items-center justify-center shadow-cta">
          <Hotel className="size-5" strokeWidth={2.5} />
        </div>
        <span className="font-display text-2xl">StayKart</span>
      </a>
      <nav className="hidden md:flex items-center gap-8 text-white/90 text-sm font-medium">
        <a href="#hotels" className="hover:text-white transition-smooth">Hotels</a>
        <a href="#destinations" className="hover:text-white transition-smooth">Destinations</a>
        <a href="#deals" className="hover:text-white transition-smooth">Deals</a>
        <a href="#" className="hover:text-white transition-smooth">Help</a>
      </nav>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="text-white hover:bg-white/15 hover:text-white hidden sm:inline-flex">
          <Globe className="size-4" /> EN / INR
        </Button>
        <Button variant="ghost" size="sm" className="text-white hover:bg-white/15 hover:text-white">
          <User className="size-4" /> Sign in
        </Button>
        <Button size="sm" className="md:hidden bg-white/15 hover:bg-white/25 text-white">
          <Menu />
        </Button>
      </div>
    </div>
  </header>
);

export default Header;
