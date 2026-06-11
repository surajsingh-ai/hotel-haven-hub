import { Users, BedDouble, Home, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type RoomVariant = {
  id: number;
  name: string;
  description: string;
  capacity: number;
  beds: number;
  size: string;
  price: number;
  originalPrice: number;
  discount: number;
  amenities: string[];
  image?: string;
  available: boolean;
  bookings: number;
};

type RoomVariantsProps = {
  rooms: RoomVariant[];
  onSelectRoom: (room: RoomVariant) => void;
  nights: number;
};

const RoomVariants = ({ rooms, onSelectRoom, nights }: RoomVariantsProps) => (
  <section id="rooms" className="py-12 scroll-mt-24">
    <h2 className="font-display text-3xl font-semibold text-foreground mb-8">
      Available Rooms
    </h2>

    <div className="grid grid-cols-1 gap-4">
      {rooms.map((room) => {
        const totalPrice = room.price * nights;
        const originalTotalPrice = room.originalPrice * nights;

        return (
          <div
            key={room.id}
            className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-elegant transition-smooth"
          >
            <div className="grid md:grid-cols-4 gap-6 p-6">
              {room.image && (
                <div className="md:col-span-1">
                  <img src={room.image} alt={room.name} className="w-full h-40 object-cover rounded-xl" />
                </div>
              )}

              <div className={room.image ? "md:col-span-2" : "md:col-span-3"}>
                <div className="mb-3">
                  <h3 className="font-display text-2xl font-semibold text-foreground">
                    {room.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {room.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="size-4 text-primary" />
                    <span className="text-foreground">{room.capacity} guests</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <BedDouble className="size-4 text-primary" />
                    <span className="text-foreground">{room.beds} bed{room.beds > 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Home className="size-4 text-primary" />
                    <span className="text-foreground">{room.size}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {room.amenities.slice(0, 4).map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="bg-primary/10 text-primary text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {room.amenities.length > 4 && (
                    <Badge variant="secondary" className="text-xs">
                      +{room.amenities.length - 4} more
                    </Badge>
                  )}
                </div>

                {!room.available && (
                  <p className="text-xs text-destructive font-semibold">
                    {room.bookings} bookings on your dates
                  </p>
                )}
              </div>

              <div className="md:col-span-1 flex flex-col justify-between items-end">
                <div className="text-right mb-4">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-bold text-foreground">
                      Rs. {totalPrice.toLocaleString()}
                    </span>
                  </div>
                  {room.discount > 0 && (
                    <>
                      <p className="text-xs text-muted-foreground line-through">
                        Rs. {originalTotalPrice.toLocaleString()}
                      </p>
                      <Badge className="bg-success/20 text-success text-xs mt-1">
                        {room.discount}% off
                      </Badge>
                    </>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    for {nights} night{nights > 1 ? "s" : ""}
                  </p>
                </div>
                <Button
                  onClick={() => onSelectRoom(room)}
                  disabled={!room.available}
                  className="w-full gradient-cta border-0 shadow-cta gap-2"
                >
                  <ShoppingCart className="size-4" />
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </section>
);

export default RoomVariants;
