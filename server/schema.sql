create table if not exists hotels (
  id bigserial primary key,
  name text not null unique,
  city text not null,
  area text not null,
  rating numeric(2, 1) not null default 0,
  reviews integer not null default 0,
  price integer not null,
  original_price integer not null,
  tag text,
  created_at timestamptz not null default now()
);

create table if not exists searches (
  id bigserial primary key,
  city text not null,
  check_in date not null,
  check_out date not null,
  adults integer not null default 1,
  rooms integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists room_types (
  id bigserial primary key,
  hotel_id bigint not null references hotels(id) on delete cascade,
  name text not null,
  capacity integer not null default 2,
  bed text not null,
  meal_plan text not null default 'Room only',
  base_price integer not null,
  cancellable boolean not null default true,
  supplier_code text not null default 'DIRECT',
  unique (hotel_id, name)
);

create table if not exists room_inventory (
  id bigserial primary key,
  room_type_id bigint not null references room_types(id) on delete cascade,
  stay_date date not null,
  total_rooms integer,
  available_rooms integer not null default 0,
  held_rooms integer not null default 0,
  blocked_rooms integer not null default 0,
  stop_sell boolean not null default false,
  min_stay integer not null default 1,
  max_stay integer,
  price integer not null,
  currency text not null default 'INR',
  source text not null default 'DIRECT',
  updated_at timestamptz not null default now(),
  unique (room_type_id, stay_date)
);

create table if not exists reservations (
  id bigserial primary key,
  booking_reference text not null unique,
  hotel_id bigint not null references hotels(id),
  room_type_id bigint not null references room_types(id),
  guest_name text not null,
  guest_email text not null,
  check_in date not null,
  check_out date not null,
  rooms integer not null default 1,
  amount integer not null,
  status text not null default 'HELD',
  payment_status text not null default 'PENDING',
  hold_expires_at timestamptz not null default now() + interval '10 minutes',
  released_at timestamptz,
  cancelled_at timestamptz,
  cancellation_reason text,
  supplier_reservation_id text,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists users (
  id bigserial primary key,
  name text not null,
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now(),
  last_login_at timestamptz
);

create table if not exists supplier_events (
  id bigserial primary key,
  supplier text not null,
  hotel_id bigint references hotels(id),
  room_type_id bigint references room_types(id),
  event_type text not null,
  payload jsonb not null,
  status text not null default 'INDEXED',
  processed_at timestamptz,
  error_message text,
  created_at timestamptz not null default now()
);

insert into hotels (name, city, area, rating, reviews, price, original_price, tag)
values
  ('The Grand Skyline', 'Mumbai', 'Bandra West', 4.8, 2847, 7499, 9999, 'City Favourite'),
  ('Azure Beach Resort', 'Goa', 'Calangute', 4.9, 1923, 12499, 15999, 'Best Seller'),
  ('Heritage Palace Hotel', 'Jaipur', 'City Palace', 4.7, 3201, 5999, 8499, 'Member Deal'),
  ('Pinewood Mountain Lodge', 'Manali', 'Old Manali', 4.6, 1456, 4299, 5999, 'Mountain View'),
  ('Sea Breeze Bay Resort', 'Goa', 'Baga', 4.6, 1321, 9999, 12999, 'Sea View'),
  ('Royal Palace Inn', 'Jaipur', 'Amer Road', 4.8, 2740, 6999, 8999, 'Royal Stay'),
  ('Mumbai Marina Suites', 'Mumbai', 'Lower Parel', 4.7, 2201, 8199, 10999, 'Premium'),
  ('Snowview Chalet', 'Manali', 'Solang Valley', 4.7, 1120, 4599, 6599, 'Snow View'),
  ('Malabar Sands Resort', 'Goa', 'Vagator', 4.4, 940, 8999, 11499, 'Surfside')
on conflict do nothing;

insert into hotels (name, city, area, rating, reviews, price, original_price, tag)
select
  'StayKart ' || city || ' Collection ' || gs,
  city,
  area,
  round((4.1 + random() * 0.8)::numeric, 1),
  (600 + random() * 3600)::int,
  base_price + ((gs % 5) * 650),
  base_price + ((gs % 5) * 650) + 2200,
  tag
from generate_series(1, greatest(0, 50 - (select count(*)::int from hotels))) gs
cross join lateral (
  select
    (array['Mumbai','Goa','Jaipur','Manali','Delhi','Bengaluru','Udaipur','Pune'])[1 + ((gs - 1) % 8)] as city,
    (array['Business District','Lake Road','Old Town','Airport Zone','Beachfront','Market Street','Heritage Quarter','Garden Enclave'])[1 + ((gs - 1) % 8)] as area,
    (array['Direct Contract','Channel Managed','Member Deal','Fast Confirmation'])[1 + ((gs - 1) % 4)] as tag,
    (array[5200,8200,4800,3900,5600,6100,7600,4700])[1 + ((gs - 1) % 8)] as base_price
) data
on conflict do nothing;

insert into room_types (hotel_id, name, capacity, bed, meal_plan, base_price, cancellable, supplier_code)
select h.id, rt.name, rt.capacity, rt.bed, rt.meal_plan, rt.base_price, rt.cancellable, rt.supplier_code
from hotels h
cross join lateral (
  values
    ('Smart Saver', 2, 'Queen bed', 'Room only', greatest(h.price - 900, 2499), true, 'CLEARTRIP'),
    ('Flex Breakfast', 3, 'King bed', 'Breakfast included', h.price, true, 'DIRECT'),
    ('Family Suite', 4, 'King bed + sofa', 'Breakfast and dinner', h.price + 2600, false, 'EXPEDIA')
) as rt(name, capacity, bed, meal_plan, base_price, cancellable, supplier_code)
on conflict do nothing;

insert into room_inventory (room_type_id, stay_date, available_rooms, total_rooms, price, source)
select
  rt.id,
  gs.stay_date::date,
  case
    when rt.name = 'Family Suite' then 3
    when rt.name = 'Smart Saver' then 8
    else 6
  end,
  case
    when rt.name = 'Family Suite' then 3
    when rt.name = 'Smart Saver' then 8
    else 6
  end,
  rt.base_price + ((extract(dow from gs.stay_date)::int in (5, 6))::int * 900),
  rt.supplier_code
from room_types rt
cross join generate_series(current_date, current_date + interval '90 days', interval '1 day') as gs(stay_date)
on conflict do nothing;
