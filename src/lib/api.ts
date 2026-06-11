const API_URL = import.meta.env.VITE_API_URL || "/api";
export const LIVE_REFETCH_MS = 3000;

export type Hotel = {
  id: number;
  name: string;
  city: string;
  area: string;
  rating: number;
  reviews: number;
  price: number;
  original_price: number;
  tag: string | null;
  live_price?: number;
  inventory_price?: number;
  available_rooms?: number;
  room_type_count?: number;
};

export type SearchCriteria = {
  city: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  rooms: number;
};

export type RoomType = {
  id: number;
  name: string;
  capacity: number;
  bed: string;
  meal_plan: string;
  cancellable: boolean;
  supplier_code: string;
  available_rooms: number;
  nightly_price: number;
  total_price: number;
};

export type Reservation = {
  booking_reference: string;
  status: string;
  payment_status: string;
  amount: number;
  hold_expires_at: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  created_at: string;
  last_login_at: string | null;
};

export async function registerUser(name: string, email: string, password: string) {
  const normalizedEmail = email.toLowerCase().trim();
  const user: User = {
    id: Date.now(),
    name: name.trim() || normalizedEmail.split("@")[0] || "User",
    email: normalizedEmail,
    created_at: new Date().toISOString(),
    last_login_at: new Date().toISOString(),
  };
  localStorage.setItem("staykart_user", JSON.stringify(user));
  return { user };
}

export async function loginUser(email: string, password: string) {
  const normalizedEmail = email.toLowerCase().trim();
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("staykart_user") || "null") as User | null;
    } catch {
      return null;
    }
  })();

  if (storedUser?.email === normalizedEmail) {
    const user = { ...storedUser, last_login_at: new Date().toISOString() };
    localStorage.setItem("staykart_user", JSON.stringify(user));
    return { user };
  }

  const user: User = {
    id: Date.now(),
    name: normalizedEmail.split("@")[0] || "User",
    email: normalizedEmail,
    created_at: new Date().toISOString(),
    last_login_at: new Date().toISOString(),
  };
  localStorage.setItem("staykart_user", JSON.stringify(user));
  return { user };
}

export async function fetchUsers() {
  const response = await fetch(`${API_URL}/auth/users`);
  if (!response.ok) throw new Error("Unable to fetch users");
  return response.json() as Promise<{ users: User[]; total: number }>;
}

export async function fetchHotels(criteria?: Partial<SearchCriteria>) {
  const params = new URLSearchParams();

  if (criteria?.city) {
    params.set("city", criteria.city);
  }

  if (criteria?.checkIn) {
    params.set("checkIn", criteria.checkIn);
  }

  if (criteria?.checkOut) {
    params.set("checkOut", criteria.checkOut);
  }

  if (criteria?.adults) {
    params.set("adults", String(criteria.adults));
  }

  if (criteria?.rooms) {
    params.set("rooms", String(criteria.rooms));
  }

  const response = await fetch(`${API_URL}/hotels?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Unable to load hotels");
  }

  return response.json() as Promise<{ hotels: Hotel[]; meta: { source: string; refreshMs?: number; ttlMs?: number } }>;
}

export async function saveSearch(search: {
  city: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  rooms: number;
}) {
  const response = await fetch(`${API_URL}/searches`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(search),
  });

  if (!response.ok) {
    throw new Error("Unable to save search");
  }

  return response.json();
}

export async function fetchRooms(hotelId: number, criteria: SearchCriteria) {
  const params = new URLSearchParams({
    checkIn: criteria.checkIn,
    checkOut: criteria.checkOut,
    adults: String(criteria.adults),
    rooms: String(criteria.rooms),
  });

  const response = await fetch(`${API_URL}/hotels/${hotelId}/rooms?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Unable to load rooms");
  }

  return response.json() as Promise<{ rooms: RoomType[]; meta: { nights: number; freshness: string; refreshMs?: number } }>;
}

export async function createReservation(payload: {
  reservationId: string;
  hotelId: number;
  roomTypeId: number;
  checkIn: string;
  checkOut: string;
  rooms: number;
  guestName: string;
  guestEmail: string;
}) {
  const makeLocalReservation = (): { reservation: Reservation; idempotentReplay: boolean } => ({
    reservation: {
      booking_reference: payload.reservationId || `SK${Date.now()}`,
      status: "HELD",
      payment_status: "PENDING",
      amount: 0,
      hold_expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    },
    idempotentReplay: false,
  });

  try {
    const response = await fetch(`${API_URL}/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return makeLocalReservation();
    }

    return response.json() as Promise<{ reservation: Reservation; idempotentReplay: boolean }>;
  } catch {
    return makeLocalReservation();
  }
}

export async function confirmPayment(reservationId: string) {
  const makeLocalPayment = (): { reservation: Reservation } => ({
    reservation: {
      booking_reference: reservationId,
      status: "CONFIRMED",
      payment_status: "PAID",
      amount: 0,
      hold_expires_at: new Date().toISOString(),
    },
  });

  try {
    const response = await fetch(`${API_URL}/payments/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reservationId, success: true }),
    });

    if (!response.ok) {
      return makeLocalPayment();
    }

    return response.json() as Promise<{ reservation: Reservation }>;
  } catch {
    return makeLocalPayment();
  }
}

export async function fetchOpsStatus() {
  const response = await fetch(`${API_URL}/ops/status`);

  if (!response.ok) {
    throw new Error("Unable to load OTA status");
  }

  return response.json();
}

export async function pushSupplierDelta() {
  const response = await fetch(`${API_URL}/suppliers/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ priceDelta: -350, availableDelta: 1 }),
  });

  if (!response.ok) {
    throw new Error("Unable to process supplier update");
  }

  return response.json();
}

export async function syncInventoryUpdate() {
  const status = await fetchOpsStatus();
  const firstRoomTypeId = Number(status?.sampleRoomTypeId || status?.sample_room_type_id || 1);
  const today = new Date();
  const updates = Array.from({ length: 5 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index + 1);
    return {
      date: date.toISOString().slice(0, 10),
      availableRooms: index === 2 ? 0 : 4 + index,
      totalRooms: 8,
      price: 5200 + index * 450,
      stopSell: index === 2,
      minStay: index === 4 ? 2 : 1,
    };
  });

  const response = await fetch(`${API_URL}/inventory/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      supplier: "CHANNEL_MANAGER_DEMO",
      roomTypeId: firstRoomTypeId,
      updates,
    }),
  });

  if (!response.ok) {
    throw new Error("Unable to sync inventory");
  }

  return response.json();
}

export async function expireHolds() {
  const response = await fetch(`${API_URL}/ops/expire-holds`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Unable to expire holds");
  }

  return response.json() as Promise<{ expired: number }>;
}

export async function cancelReservation(reference: string, reason = "Guest cancelled") {
  const response = await fetch(`${API_URL}/reservations/${reference}/cancel`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
  });

  if (!response.ok) {
    throw new Error("Unable to cancel reservation");
  }

  return response.json() as Promise<{ reservation: Reservation }>;
}
