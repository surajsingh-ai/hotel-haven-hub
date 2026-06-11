import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft, BedDouble, CheckCircle2, CreditCard,
  Hotel, Lock, ShieldCheck, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createReservation, confirmPayment } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function reservationKey(hotelId: string, roomTypeId: string, checkIn: string, checkOut: string, rooms: string) {
  return `SK-${hotelId}-${roomTypeId}-${checkIn}-${checkOut}-${rooms}`.replace(/-/g, "");
}

const Booking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [confirmed, setConfirmed] = useState<{ ref: string; amount: number } | null>(null);

  const hotelId = searchParams.get("hotelId") || "";
  const roomTypeId = searchParams.get("roomTypeId") || "";
  const hotelName = searchParams.get("hotelName") || "Hotel";
  const roomName = searchParams.get("roomName") || "Room";
  const totalPrice = Number(searchParams.get("totalPrice") || 0);
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const rooms = searchParams.get("rooms") || "1";
  const adults = searchParams.get("adults") || "2";

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: "",
  });

  const nights = Math.max(
    1,
    Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)
  );
  const taxes = Math.round(totalPrice * 0.12);
  const grandTotal = totalPrice + taxes;

  const bookMutation = useMutation({
    mutationFn: async () => {
      const reservationId = reservationKey(hotelId, roomTypeId, checkIn, checkOut, rooms);
      const hold = await createReservation({
        reservationId,
        hotelId: Number(hotelId),
        roomTypeId: Number(roomTypeId),
        checkIn,
        checkOut,
        rooms: Number(rooms),
        guestName: `${form.firstName} ${form.lastName}`,
        guestEmail: form.email,
      });
      const paid = await confirmPayment(hold.reservation.booking_reference);
      return paid;
    },
    onSuccess: (data) => {
      const booking = {
        ref: data.reservation.booking_reference,
        amount: Number(data.reservation.amount),
        hotelName,
        roomName,
        checkIn,
        checkOut,
        status: data.reservation.status,
      };
      const prev = JSON.parse(localStorage.getItem("staykart_bookings") || "[]");
      localStorage.setItem("staykart_bookings", JSON.stringify([booking, ...prev]));
      setConfirmed({ ref: booking.ref, amount: booking.amount });
    },
    onError: () => {
      toast.error("Booking failed", {
        description: "Room inventory may have changed. Please go back and try again.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.phone) {
      return toast.error("Please fill in all guest details");
    }
    if (!form.cardNumber || !form.expiry || !form.cvv || !form.cardName) {
      return toast.error("Please fill in all payment details");
    }
    bookMutation.mutate();
  };

  if (confirmed) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-32 flex flex-col items-center text-center max-w-lg">
          <div className="size-20 rounded-full bg-success/15 flex items-center justify-center mb-6">
            <CheckCircle2 className="size-10 text-success" />
          </div>
          <h1 className="font-display text-4xl mb-3">Booking Confirmed!</h1>
          <p className="text-muted-foreground mb-6">
            Your reservation has been confirmed. A confirmation email has been sent.
          </p>
          <div className="w-full rounded-2xl border border-border bg-card p-6 text-left space-y-3 mb-8 shadow-card">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Booking reference</span>
              <span className="font-mono font-bold text-primary">{confirmed.ref}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Hotel</span>
              <span className="font-medium">{hotelName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Room</span>
              <span className="font-medium">{roomName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Check-in</span>
              <span className="font-medium">{checkIn}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Check-out</span>
              <span className="font-medium">{checkOut}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-border pt-3">
              <span className="font-semibold">Total paid</span>
              <span className="font-bold text-lg">₹{confirmed.amount.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex gap-3 w-full">
            <Button variant="outline" className="flex-1" onClick={() => navigate("/bookings")}>
              My Bookings
            </Button>
            <Button className="flex-1 gradient-cta border-0" onClick={() => navigate("/")}>
              Book Another
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-10 pt-28">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth mb-8 text-sm font-medium"
        >
          <ArrowLeft className="size-4" /> Back to hotel
        </button>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8">
            {/* Guest details */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h2 className="font-display text-2xl mb-5 flex items-center gap-2">
                <User className="size-5 text-primary" /> Guest Details
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" placeholder="John" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" placeholder="Doe" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email address</Label>
                  <Input id="email" type="email" placeholder="john@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input id="phone" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h2 className="font-display text-2xl mb-1 flex items-center gap-2">
                <CreditCard className="size-5 text-primary" /> Payment Details
              </h2>
              <p className="text-xs text-muted-foreground mb-5 flex items-center gap-1">
                <Lock className="size-3" /> Secured with 256-bit SSL encryption
              </p>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="cardName">Name on card</Label>
                  <Input id="cardName" placeholder="John Doe" value={form.cardName} onChange={(e) => setForm({ ...form, cardName: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cardNumber">Card number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    value={form.cardNumber}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                      setForm({ ...form, cardNumber: v.replace(/(.{4})/g, "$1 ").trim() });
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="expiry">Expiry date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={form.expiry}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                        setForm({ ...form, expiry: v.length > 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v });
                      }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" maxLength={3} value={form.cvv} onChange={(e) => setForm({ ...form, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })} />
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-14 gradient-cta border-0 text-base font-bold shadow-cta"
              disabled={bookMutation.isPending}
            >
              <ShieldCheck className="size-5" />
              {bookMutation.isPending ? "Processing..." : `Confirm & Pay ₹${grandTotal.toLocaleString()}`}
            </Button>
          </form>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-border bg-card shadow-elegant p-6">
              <h3 className="font-display text-xl mb-4">Booking Summary</h3>
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-border">
                <div className="size-10 rounded-xl gradient-cta flex items-center justify-center shadow-cta">
                  <Hotel className="size-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{hotelName}</p>
                  <p className="text-xs text-muted-foreground">{roomName}</p>
                </div>
              </div>
              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-in</span>
                  <span className="font-medium">{checkIn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-out</span>
                  <span className="font-medium">{checkOut}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{nights} night{nights > 1 ? "s" : ""}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rooms</span>
                  <span className="font-medium">{rooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Guests</span>
                  <span className="font-medium">{adults} adults</span>
                </div>
              </div>
              <div className="space-y-2 text-sm border-t border-border pt-4 mb-5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Room charges</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes & fees (12%)</span>
                  <span>₹{taxes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t border-border pt-2 mt-2">
                  <span>Total</span>
                  <span>₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p className="flex items-center gap-2"><CheckCircle2 className="size-3 text-success" /> Free cancellation available</p>
                <p className="flex items-center gap-2"><CheckCircle2 className="size-3 text-success" /> Instant confirmation</p>
                <p className="flex items-center gap-2"><BedDouble className="size-3 text-success" /> Best price guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Booking;
