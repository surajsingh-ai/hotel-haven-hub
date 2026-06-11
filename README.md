
## PostgreSQL setup

1. Create a PostgreSQL database named `hotel_booking`.
2. Copy `.env.example` to `.env.local` and update `DATABASE_URL` if your username, password, host, port, or database name is different.
3. Run the schema and seed data:

```sh
psql "postgres://postgres:postgres@localhost:5432/hotel_booking" -f server/schema.sql
```

4. Start the frontend and API together:

```sh
npm run dev:full
```

The API runs on `http://localhost:3001` and Vite proxies frontend requests from `/api` to that server.
