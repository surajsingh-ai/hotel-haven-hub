import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, MapPin, Search, Users, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const popularCities = ["Mumbai", "Goa", "Jaipur", "Manali", "Bengaluru", "Udaipur"];

const SearchBar = () => {
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState<Date | undefined>(new Date());
  const [checkOut, setCheckOut] = useState<Date | undefined>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d;
  });
  const [adults, setAdults] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [showSuggest, setShowSuggest] = useState(false);

  const handleSearch = () => {
    if (!city) return toast.error("Please select a destination");
    toast.success(`Searching hotels in ${city}`, {
      description: `${format(checkIn!, "dd MMM")} → ${format(checkOut!, "dd MMM")} · ${rooms} room · ${adults} guests`,
    });
  };

  return (
    <div className="bg-card rounded-2xl shadow-search border border-border/50 p-2 grid grid-cols-1 md:grid-cols-12 gap-2">
      {/* City */}
      <div className="md:col-span-4 relative">
        <div className="px-5 py-4 rounded-xl hover:bg-muted/60 transition-smooth h-full">
          <label className="block text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1">
            City, Hotel or Area
          </label>
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-primary shrink-0" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onFocus={() => setShowSuggest(true)}
              onBlur={() => setTimeout(() => setShowSuggest(false), 150)}
              placeholder="Where are you going?"
              className="bg-transparent w-full outline-none text-base font-semibold text-foreground placeholder:text-muted-foreground/60 placeholder:font-normal"
            />
          </div>
        </div>
        {showSuggest && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-popover rounded-xl shadow-elegant border border-border z-20 p-2">
            <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground px-3 py-2">Popular</p>
            {popularCities.map((c) => (
              <button
                key={c}
                onMouseDown={() => { setCity(c); setShowSuggest(false); }}
                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-muted flex items-center gap-3 text-sm font-medium"
              >
                <MapPin className="size-4 text-muted-foreground" /> {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Check in */}
      <div className="md:col-span-2">
        <Popover>
          <PopoverTrigger asChild>
            <button className="w-full text-left px-5 py-4 rounded-xl hover:bg-muted/60 transition-smooth h-full">
              <span className="block text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1">Check-in</span>
              <span className="flex items-center gap-2 text-base font-semibold">
                <CalendarIcon className="size-4 text-primary" />
                {checkIn ? format(checkIn, "dd MMM") : "Add"}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} className={cn("p-3 pointer-events-auto")} />
          </PopoverContent>
        </Popover>
      </div>

      {/* Check out */}
      <div className="md:col-span-2">
        <Popover>
          <PopoverTrigger asChild>
            <button className="w-full text-left px-5 py-4 rounded-xl hover:bg-muted/60 transition-smooth h-full">
              <span className="block text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1">Check-out</span>
              <span className="flex items-center gap-2 text-base font-semibold">
                <CalendarIcon className="size-4 text-primary" />
                {checkOut ? format(checkOut, "dd MMM") : "Add"}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} className={cn("p-3 pointer-events-auto")} />
          </PopoverContent>
        </Popover>
      </div>

      {/* Guests */}
      <div className="md:col-span-2">
        <Popover>
          <PopoverTrigger asChild>
            <button className="w-full text-left px-5 py-4 rounded-xl hover:bg-muted/60 transition-smooth h-full">
              <span className="block text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1">Rooms & Guests</span>
              <span className="flex items-center gap-2 text-base font-semibold">
                <Users className="size-4 text-primary" />
                {rooms} Room · {adults} Guests
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-4" align="end">
            <div className="space-y-4">
              {[
                { label: "Rooms", val: rooms, set: setRooms, min: 1 },
                { label: "Adults", val: adults, set: setAdults, min: 1 },
              ].map((r) => (
                <div key={r.label} className="flex items-center justify-between">
                  <span className="font-medium">{r.label}</span>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8 rounded-full" onClick={() => r.set(Math.max(r.min, r.val - 1))}>
                      <Minus className="size-3" />
                    </Button>
                    <span className="w-6 text-center font-semibold tabular-nums">{r.val}</span>
                    <Button variant="outline" size="icon" className="size-8 rounded-full" onClick={() => r.set(r.val + 1)}>
                      <Plus className="size-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Search button */}
      <div className="md:col-span-2">
        <Button
          onClick={handleSearch}
          className="w-full h-full min-h-14 gradient-cta hover:opacity-95 text-accent-foreground font-bold text-base rounded-xl shadow-cta border-0"
        >
          <Search className="size-5" /> Search
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
