# 🌾 AgriTech – Smart Farming Web App (MERN)

Full-stack agri-tech platform built with **React (Vite) + Node.js/Express + MongoDB (Mongoose)**, following the MVC pattern.

## Features
- **Auth** – register / login with JWT, protected routes, farmer & admin roles
- **Farm Management** – CRUD farms, log activities (planting, irrigation, fertilizing…), water & fertilizer tracking
- **Soil Health** – moisture, pH, N-P-K readings with automatic recommendations
- **Crop Management** – CRUD crops, growth stages, health, expected yield
- **Crop Info** – planting guides, care tips and pest management (from `server/db/crops.json`)
- **Weather Forecasting** – live 7-day forecast per farm location (Open-Meteo, no API key) + farming advice
- **Pest & Disease Alerts** – published by admin, shown on dashboard
- **Buy Resources** – seeds, fertilizers, pesticides, equipment, services (stock aware)
- **My Orders** – view / cancel purchases and service bookings (equipment rental, expert consultation)
- **Community Forum** – posts and replies
- **Reports** – farmer dashboard analytics; admin stats (revenue, bookings, low stock)
- **Admin Panel** – verify/delete users, manage products, update booking status, publish alerts

## Project structure
```
client/                 React + Vite frontend
  src/pages/            Home, Login, Register, Dashboard, Farms, Crops, CropInfo,
                        Weather, Shop, Orders, Forum, Profile, Admin
server/                 Express backend (MVC)
  index.js              entry point
  db/config.js          MongoDB connection
  db/User, db/Admin     user/admin schemas
  db/crops.json         static crop data
  db/seed.js            seeds products, alerts and an admin account
  models/               Farm, Crop, Product, Booking, Post, Alert
  controllers/          user, farm, crop, product, booking, forum, admin, report
  routes/               index.js (all /api routes), user.js
  middleware/auth.js    JWT protect + adminOnly
```

## Run locally
Requirements: Node.js 18+, MongoDB (local or MongoDB Atlas).

```bash
# 1. Backend
cd server
cp .env.example .env      # set MONGO_URI and JWT_SECRET
npm install
npm run seed              # optional: sample products, alerts, admin user
npm run dev               # http://localhost:5000

# 2. Frontend (new terminal)
cd client
cp .env.example .env
npm install
npm run dev               # http://localhost:5173
```

Seeded admin login: `admin@agritech.com` / `admin123` (change it after first login).

## API overview
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/users/register, /api/users/login | Auth |
| GET/PUT | /api/users/me | Profile |
| CRUD | /api/farms, POST /api/farms/:id/activities, GET /api/farms/:id/soil-advice | Farms |
| CRUD | /api/crops, GET /api/crops/info, GET /api/crops/alerts | Crops |
| GET (public) / CUD (admin) | /api/products | Products |
| POST /api/bookings, GET /api/bookings/mine, PUT /api/bookings/:id/cancel | Orders |
| GET/POST | /api/forum, POST /api/forum/:id/replies | Forum |
| GET | /api/reports/summary | Farmer analytics |
| * | /api/admin/... | Admin stats, users, bookings, alerts |

## Push to GitHub
```bash
git init
git add .
git commit -m "AgriTech MERN app"
git branch -M main
git remote add origin https://github.com/<your-username>/agritech.git
git push -u origin main
```
