import h1 from "@/assets/hotel-1.jpg";
import h2 from "@/assets/hotel-2.jpg";
import h3 from "@/assets/hotel-3.jpg";
import h4 from "@/assets/hotel-4.jpg";
import type { Hotel, RoomType, SearchCriteria } from "@/lib/api";

export type FallbackHotel = Hotel & {
  img: string;
  amenities: string[];
  type: "Luxury" | "Mid-Range" | "Budget" | "Boutique";
  highlights: string[];
};

export const fallbackHotels: FallbackHotel[] = [
  {
    id: 1,
    img: h1,
    name: "The Grand Skyline",
    city: "Mumbai",
    area: "Bandra West",
    rating: 4.8,
    reviews: 2847,
    price: 7499,
    original_price: 9999,
    tag: "City Favourite",
    amenities: ["wifi", "breakfast", "ac", "parking", "restaurant", "tv"],
    type: "Luxury",
    highlights: ["Near Bandra Kurla Complex", "Rooftop dining", "Business lounge"],
  },
  {
    id: 2,
    img: h1,
    name: "Oceanic Luxe Suites",
    city: "Mumbai",
    area: "Marine Drive",
    rating: 4.7,
    reviews: 2181,
    price: 6599,
    original_price: 8999,
    tag: "Best Value",
    amenities: ["wifi", "breakfast", "ac", "restaurant", "tv"],
    type: "Boutique",
    highlights: ["Sea-facing suites", "Walkable promenade", "Late checkout"],
  },
  {
    id: 3,
    img: h2,
    name: "Azure Beach Resort",
    city: "Goa",
    area: "Calangute",
    rating: 4.9,
    reviews: 1923,
    price: 12499,
    original_price: 15999,
    tag: "Best Seller",
    amenities: ["wifi", "pool", "breakfast", "ac", "parking", "restaurant", "gym", "tv"],
    type: "Luxury",
    highlights: ["Beach access", "Infinity pool", "Spa and wellness"],
  },
  {
    id: 4,
    img: h2,
    name: "Saffron Shores Hotel",
    city: "Goa",
    area: "Baga Beach",
    rating: 4.6,
    reviews: 1578,
    price: 8999,
    original_price: 11999,
    tag: "Beachfront",
    amenities: ["wifi", "pool", "breakfast", "ac", "restaurant"],
    type: "Mid-Range",
    highlights: ["Beachfront rooms", "Family friendly", "Cafe and bar"],
  },
  {
    id: 5,
    img: h3,
    name: "Heritage Palace Hotel",
    city: "Jaipur",
    area: "City Palace",
    rating: 4.7,
    reviews: 3201,
    price: 5999,
    original_price: 8499,
    tag: "Member Deal",
    amenities: ["wifi", "breakfast", "ac", "parking", "restaurant", "tv"],
    type: "Boutique",
    highlights: ["Heritage architecture", "Old city access", "Courtyard dining"],
  },
  {
    id: 6,
    img: h3,
    name: "Royal City Gardens",
    city: "Jaipur",
    area: "Amer Road",
    rating: 4.8,
    reviews: 2745,
    price: 7499,
    original_price: 9999,
    tag: "Luxury Stay",
    amenities: ["wifi", "pool", "breakfast", "ac", "parking", "restaurant", "gym"],
    type: "Luxury",
    highlights: ["Garden suites", "Poolside breakfast", "Fort-view terrace"],
  },
  {
    id: 7,
    img: h4,
    name: "Pinewood Mountain Lodge",
    city: "Manali",
    area: "Old Manali",
    rating: 4.6,
    reviews: 1456,
    price: 4299,
    original_price: 5999,
    tag: "Mountain View",
    amenities: ["wifi", "breakfast", "parking", "restaurant"],
    type: "Budget",
    highlights: ["Mountain views", "Bonfire evenings", "Pet friendly"],
  },
  {
    id: 8,
    img: h4,
    name: "Alpine Vista Retreat",
    city: "Manali",
    area: "Solang Valley",
    rating: 4.5,
    reviews: 1398,
    price: 4899,
    original_price: 6999,
    tag: "Nature Escape",
    amenities: ["wifi", "breakfast", "parking", "restaurant", "tv"],
    type: "Mid-Range",
    highlights: ["Valley views", "Adventure desk", "Heated rooms"],
  },
];

export const getHotelImage = (hotelName: string) =>
  fallbackHotels.find((hotel) => hotel.name === hotelName)?.img || h1;

export const findFallbackHotel = (id: string | number) =>
  fallbackHotels.find((hotel) => String(hotel.id) === String(id));

export const filterFallbackHotels = (criteria?: Partial<SearchCriteria>) => {
  const city = criteria?.city?.trim().toLowerCase();
  if (!city) return fallbackHotels;

  const matches = fallbackHotels.filter((hotel) =>
    [hotel.city, hotel.area, hotel.name].some((value) => value.toLowerCase().includes(city))
  );

  return matches.length ? matches : fallbackHotels;
};

export const getFallbackRooms = (hotelId: string | number, criteria?: Partial<SearchCriteria>): RoomType[] => {
  const hotel = findFallbackHotel(hotelId) || fallbackHotels[0];
  const roomsRequested = Number(criteria?.rooms || 1);
  const base = Number(hotel.price);

  return [
    {
      id: hotel.id * 100 + 1,
      name: "Deluxe Room",
      capacity: 2,
      bed: "1 Queen Bed",
      meal_plan: "Room only",
      cancellable: true,
      supplier_code: "LOCAL",
      available_rooms: Math.max(roomsRequested, 3),
      nightly_price: base,
      total_price: base * roomsRequested,
    },
    {
      id: hotel.id * 100 + 2,
      name: "Premium Room with Breakfast",
      capacity: 3,
      bed: "1 King Bed",
      meal_plan: "Breakfast included",
      cancellable: true,
      supplier_code: "LOCAL",
      available_rooms: Math.max(roomsRequested, 2),
      nightly_price: Math.round(base * 1.18),
      total_price: Math.round(base * 1.18) * roomsRequested,
    },
    {
      id: hotel.id * 100 + 3,
      name: "Family Suite",
      capacity: 4,
      bed: "2 Queen Beds",
      meal_plan: "Breakfast and dinner",
      cancellable: true,
      supplier_code: "LOCAL",
      available_rooms: Math.max(roomsRequested, 1),
      nightly_price: Math.round(base * 1.48),
      total_price: Math.round(base * 1.48) * roomsRequested,
    },
  ];
};
