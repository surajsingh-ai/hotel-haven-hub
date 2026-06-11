import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarDays, CheckCircle2, Hotel, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cancelReservation } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// In a real app this would come from an API. We use localStorage for demo.
const getBookings = (): BookingItem[] => {
  try {
    return JSON.parse(localStorage.getItem("staykart_bookings") || "[]");
  } catch {
    return [];
  }
};

type BookingItem = {
  ref: string;
  amount: number;
  hotelName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  status: string;
  paymentStatus?: string;
};

const statusColor: Record<string, string> = {
  CONFIRMED: "bg-success text-success-foreground",
  HELD: "bg-yellow-100 text-yellow-800",
  PAYMENT_FAILED: "bg-destructive/10 text-destructive",
  CANCELLED: "bg-muted text-muted-foreground",
};

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState(getBookings);
  const cancelMutation = useMutation({
    mutationFn: (reference: string) => cancelReservation(reference),
    onSuccess: (data) => {
      const updated = bookings.map((booking: BookingItem) =>
        booking.ref === data.reservation.booking_reference
          ? { ...booking, status: data.reservation.status, paymentStatus: data.reservation.payment_status }
          : booking,
      );
      localStorage.setItem("staykart_bookings", JSON.stringify(updated));
      setBookings(updated);
      toast.success("Booking cancelled", {
        description: "Inventory was released back into the room calendar.",
      });
    },
    onError: () => toast.error("Unable to cancel booking"),
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-10 pt-28">
        <div className="mb-8">
          <span className="text-accent text-xs font-bold uppercase tracking-widest mb-2 block">Your trips</span>
          <h1 className="font-display text-4xl md:text-5xl">My Bookings</h1>
        </div>

        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="size-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <Hotel className="size-10 text-muted-foreground" />
            </div>
            <h2 className="font-display text-2xl mb-2">No bookings yet</h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
              You haven't made any bookings yet. Start exploring hotels and plan your next trip!
            </p>
            <Button className="gradient-cta border-0 shadow-cta" onClick={() => navigate("/")}>
              Explore Hotels
            </Button>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl">
            {bookings.map((b: BookingItem) => (
              <div key={b.ref} className="rounded-2xl border border-border bg-card shadow-card p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-display text-xl">{b.hotelName}</h3>
                      <Badge className={statusColor[b.status] || "bg-muted text-muted-foreground"}>
                        {b.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                      <MapPin className="size-3" /> {b.roomName}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="size-4" /> {b.checkIn} → {b.checkOut}
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="size-4 text-success" /> Ref: <span className="font-mono font-semibold text-primary">{b.ref}</span>
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">₹{Number(b.amount).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total paid</p>
                    {["HELD", "CONFIRMED"].includes(b.status) && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        disabled={cancelMutation.isPending}
                        onClick={() => cancelMutation.mutate(b.ref)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyBookings;
