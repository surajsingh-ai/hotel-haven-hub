import { useState } from "react";
import { ChevronDown, MapPin, Star, DollarSign, Wifi, Waves, Coffee, Wind, Car, Dumbbell, Utensils, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export type FilterState = {
  priceRange: [number, number];
  ratings: number[];
  amenities: string[];
  hotelType: string[];
};

const amenityOptions = [
  { id: "wifi", label: "Free WiFi", icon: Wifi },
  { id: "pool", label: "Swimming Pool", icon: Waves },
  { id: "breakfast", label: "Breakfast", icon: Coffee },
  { id: "ac", label: "Air Conditioning", icon: Wind },
  { id: "parking", label: "Free Parking", icon: Car },
  { id: "gym", label: "Fitness Center", icon: Dumbbell },
  { id: "restaurant", label: "Restaurant", icon: Utensils },
  { id: "tv", label: "Flat-screen TV", icon: Tv },
];

const hotelTypes = ["Luxury", "Mid-Range", "Budget", "Boutique"];
const ratingOptions = [4.5, 4.0, 3.5, 3.0];

type FilterSidebarProps = {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
};

const FilterSidebar = ({ filters, onFilterChange }: FilterSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    price: true,
    rating: true,
    amenities: true,
    hotelType: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const updatePriceRange = (min: number, max: number) => {
    onFilterChange({ ...filters, priceRange: [min, max] });
  };

  const toggleRating = (rating: number) => {
    const updated = filters.ratings.includes(rating)
      ? filters.ratings.filter((r) => r !== rating)
      : [...filters.ratings, rating];
    onFilterChange({ ...filters, ratings: updated });
  };

  const toggleAmenity = (amenity: string) => {
    const updated = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];
    onFilterChange({ ...filters, amenities: updated });
  };

  const toggleHotelType = (type: string) => {
    const updated = filters.hotelType.includes(type)
      ? filters.hotelType.filter((t) => t !== type)
      : [...filters.hotelType, type];
    onFilterChange({ ...filters, hotelType: updated });
  };

  const clearAllFilters = () => {
    onFilterChange({
      priceRange: [0, 50000],
      ratings: [],
      amenities: [],
      hotelType: [],
    });
  };

  const hasActiveFilters =
    filters.ratings.length > 0 || filters.amenities.length > 0 || filters.hotelType.length > 0;

  return (
    <div className="w-full max-w-sm bg-card dark:bg-card/80 rounded-2xl p-6 shadow-card border border-border dark:border-white/10 h-fit sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-semibold text-foreground dark:text-white">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs font-semibold text-primary hover:text-primary/80 transition-smooth"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Price Range */}
      <Collapsible open={expandedSections.price}>
        <CollapsibleTrigger className="w-full flex items-center justify-between py-3 hover:bg-muted/40 dark:hover:bg-white/5 px-2 rounded-lg transition-smooth">
          <span className="font-semibold text-foreground dark:text-white">Price per night</span>
          <ChevronDown
            className={`size-4 transition-transform ${expandedSections.price ? "rotate-180" : ""}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 py-3 px-2">
          <div className="space-y-2">
            {[
              { label: "₹0 - ₹5,000", min: 0, max: 5000 },
              { label: "₹5,000 - ₹10,000", min: 5000, max: 10000 },
              { label: "₹10,000 - ₹20,000", min: 10000, max: 20000 },
              { label: "₹20,000+", min: 20000, max: 50000 },
            ].map((range) => (
              <label key={range.label} className="flex items-center gap-2 cursor-pointer hover:bg-muted/40 dark:hover:bg-white/5 px-2 py-1 rounded transition-smooth">
                <Checkbox
                  checked={
                    filters.priceRange[0] === range.min && filters.priceRange[1] === range.max
                  }
                  onCheckedChange={() => updatePriceRange(range.min, range.max)}
                />
                <span className="text-sm text-muted-foreground dark:text-white/70">{range.label}</span>
              </label>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="border-t border-border dark:border-white/10 my-4" />

      {/* Ratings */}
      <Collapsible open={expandedSections.rating}>
        <CollapsibleTrigger className="w-full flex items-center justify-between py-3 hover:bg-muted/40 dark:hover:bg-white/5 px-2 rounded-lg transition-smooth">
          <span className="font-semibold text-foreground dark:text-white">Guest ratings</span>
          <ChevronDown
            className={`size-4 transition-transform ${expandedSections.rating ? "rotate-180" : ""}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 py-3 px-2">
          {ratingOptions.map((rating) => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer hover:bg-muted/40 dark:hover:bg-white/5 px-2 py-1 rounded transition-smooth">
              <Checkbox
                checked={filters.ratings.includes(rating)}
                onCheckedChange={() => toggleRating(rating)}
              />
              <div className="flex items-center gap-1">
                <Star className="size-4 fill-accent text-accent" />
                <span className="text-sm text-muted-foreground dark:text-white/70">{rating}+ Stars</span>
              </div>
            </label>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <div className="border-t border-border dark:border-white/10 my-4" />

      {/* Hotel Type */}
      <Collapsible open={expandedSections.hotelType}>
        <CollapsibleTrigger className="w-full flex items-center justify-between py-3 hover:bg-muted/40 dark:hover:bg-white/5 px-2 rounded-lg transition-smooth">
          <span className="font-semibold text-foreground dark:text-white">Hotel type</span>
          <ChevronDown
            className={`size-4 transition-transform ${expandedSections.hotelType ? "rotate-180" : ""}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 py-3 px-2">
          {hotelTypes.map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer hover:bg-muted/40 dark:hover:bg-white/5 px-2 py-1 rounded transition-smooth">
              <Checkbox
                checked={filters.hotelType.includes(type)}
                onCheckedChange={() => toggleHotelType(type)}
              />
              <span className="text-sm text-muted-foreground dark:text-white/70">{type}</span>
            </label>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <div className="border-t border-border dark:border-white/10 my-4" />

      {/* Amenities */}
      <Collapsible open={expandedSections.amenities}>
        <CollapsibleTrigger className="w-full flex items-center justify-between py-3 hover:bg-muted/40 dark:hover:bg-white/5 px-2 rounded-lg transition-smooth">
          <span className="font-semibold text-foreground dark:text-white">Amenities</span>
          <ChevronDown
            className={`size-4 transition-transform ${expandedSections.amenities ? "rotate-180" : ""}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="grid grid-cols-2 gap-2 py-3 px-2">
          {amenityOptions.map((amenity) => {
            const Icon = amenity.icon;
            return (
              <label
                key={amenity.id}
                className="flex items-center gap-2 cursor-pointer hover:bg-muted/40 dark:hover:bg-white/5 p-2 rounded transition-smooth"
              >
                <Checkbox
                  checked={filters.amenities.includes(amenity.id)}
                  onCheckedChange={() => toggleAmenity(amenity.id)}
                />
                <Icon className="size-3 text-primary" />
                <span className="text-xs text-muted-foreground dark:text-white/70">{amenity.label}</span>
              </label>
            );
          })}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default FilterSidebar;
