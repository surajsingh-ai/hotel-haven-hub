import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type SortOption = "popular" | "price-low" | "price-high" | "rating" | "newest";

type SortBarProps = {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  hotelCount: number;
};

const SortBar = ({ sortBy, onSortChange, hotelCount }: SortBarProps) => {
  const sortLabels: Record<SortOption, string> = {
    popular: "Popular",
    "price-low": "Price: Low to High",
    "price-high": "Price: High to Low",
    rating: "Guest Rating",
    newest: "Newest First",
  };

  return (
    <div className="flex items-center justify-between py-4 px-6 bg-card/50 dark:bg-card/30 rounded-xl border border-border dark:border-white/5 mb-6">
      <span className="text-sm text-muted-foreground dark:text-white/70">
        {hotelCount} hotels found
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-border dark:border-white/10 text-foreground dark:text-white hover:bg-muted dark:hover:bg-white/5"
          >
            Sort by: {sortLabels[sortBy]}
            <ChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {(Object.entries(sortLabels) as [SortOption, string][]).map(([key, label]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => onSortChange(key)}
              className={sortBy === key ? "bg-primary/10 text-primary" : ""}
            >
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SortBar;
