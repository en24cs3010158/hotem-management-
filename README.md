# Roomly — MERN Hotel Management System

A runnable MERN starter for hotel operations: JWT authentication, guest/staff/admin roles, room search and inventory, reservation workflow, guest booking history, reviews, dashboard stats, and a safe demo payment flow. The code is structured so you can extend it for real email, Stripe/Razorpay, cloud image storage, and deployment.

## Requirements
- Node.js 18+ (Node 20 LTS recommended), npm
- MongoDB local instance or MongoDB Atlas database

## 1. Configure backend
```bash
cd server
cp .env.example .env
npm install
npm run seed   # optional: creates demo admin and sample rooms
npm run dev
```
Backend runs at `http://localhost:5000`. The seed admin is `admin@roomly.local` / `Admin123!` (change immediately outside local development).

## 2. Configure frontend
In a second terminal:
```bash
cd client
cp .env.example .env
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

## Demo accounts
- Admin: `admin@roomly.local` / `Admin123!` (created by seed)
- Guest: register using the UI.

## Important configuration
Set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, and optionally SMTP/payment/cloud credentials in `server/.env`. The payment endpoint is deliberately **demo mode** unless real provider credentials and provider-side verification are implemented. Never collect or store raw card data. The email utility is a safe console fallback until SMTP is configured.

## Main API routes
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/rooms`, `GET /api/rooms/:id`, `POST /api/rooms` (staff/admin), `PATCH /api/rooms/:id` (staff/admin), `DELETE /api/rooms/:id` (admin)
- `POST /api/bookings`, `GET /api/bookings/my`, `GET /api/bookings` (staff/admin), `PATCH /api/bookings/:id/status` (staff/admin), `POST /api/bookings/:id/cancel`
- `POST /api/payments/demo-checkout`, `GET /api/payments/my`
- `POST /api/reviews`, `GET /api/reviews`
- `GET /api/admin/stats`, `GET /api/health`

## Scope and production checklist
This is a complete educational starter, not a certified production PMS. Before production: add integration tests, rate limiting, CSRF strategy if using cookies, stricter schemas and audit retention, provider-backed payment/refund webhooks, SMTP verification, object storage, backups, monitoring, and deployment secrets. Booking creation checks overlapping confirmed/pending reservations on the server, but high-concurrency deployments should use transactions/locking or a dedicated inventory strategy.
