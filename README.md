<div align="center">

# 🏘️ NexHood

### *Know Your Neighborhood. Own Your Space.*

> **The intelligent real estate intelligence platform that turns neighborhood guesswork into data-driven decisions — and transforms apartment parking chaos into a frictionless digital experience.**

[![Figma Design](https://img.shields.io/badge/Figma-Design-blue?logo=figma)](https://www.figma.com/proto/iuxNtjRbFpwefcHVPplrlT/MID_SEM?node-id=84-2&p=f&t=lhKqj6hjNmcBMt8p-0&scaling=min-zoom&content-scaling=fixed&page-id=74%3A1289&starting-point-node-id=84%3A2)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-success)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-ready-blue)](https://www.docker.com/)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()

</div>

---

## 📖 Table of Contents

- [Problem Statement](#-problem-statement)
- [Our Solution](#-our-solution)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Folder Structure](#-folder-structure)
- [Installation Guide](#-installation-guide)
- [Usage Guide](#-usage-guide)
- [Screenshots](#-screenshots)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Future Improvements](#-future-improvements)
- [Challenges Faced](#-challenges-faced)
- [Contributing](#-contributing)
- [License](#-license)
- [Authors](#-authors)

---

## 🚨 Problem Statement

Real estate is one of the most significant financial decisions a family will ever make — often involving multi-crore investments, multi-year EMIs, and permanent lifestyle shifts. Yet, the tools available to homebuyers are alarmingly primitive.

### Problem 1: The Neighborhood Data Desert

When Rahul and his family decided to buy a 3BHK in the outskirts of Pune, they visited six properties, liked two, and chose one based on the price and the builder's brochure. Six months after moving in, they discovered:

- The nearest school had a D-rated infrastructure
- A chemical processing unit 2km away consistently pushed the AQI above 180
- The area had 4–6 hour power cuts every summer
- The proposed metro line that the broker promised was still a decade away
- The local water supply was tanker-dependent for 5 months a year

**This is not an edge case. This is the norm.**

Homebuyers today rely on:
- **Broker word-of-mouth** — biased by commission
- **Google Maps reviews** — unstructured, incomplete
- **Social media groups** — anecdotal, often outdated
- **Government PDFs** — buried in bureaucratic portals, unreadable

There is no single, structured, reliable platform that aggregates:

| Data Category | Current Availability | NexHood Approach |
|---|---|---|
| School Quality Index | Scattered across state portals | Aggregated + AI-scored |
| Crime Statistics | Police records, no public API | Normalized heatmap visualization |
| Air Quality Index | CPCB portal, raw numbers | Real-time + trend analysis |
| Water Availability | Utility boards, inconsistent | Crowd-sourced + verified |
| Power Reliability | DISCOM reports | Historical outage frequency |
| Future Infrastructure | Master plans in 200-page PDFs | Extracted + mapped |

---

### Problem 2: The Apartment Parking Warzone

In any gated society with 200+ apartments, parking is a daily battlefield.

**Scenario:** Mrs. Mehta's daughter is visiting for the weekend. She parks in what seems like a guest slot. Fifteen minutes later, a resident returns and finds their paid spot occupied. The security guard has no record of the visitor. The RWA (Resident Welfare Association) gets a complaint. The visitor is embarrassed. The resident is furious. The guard is helpless.

This happens **every single day** in apartments across India.

The root causes:
- **No digital visitor registration** — paper logbooks are ineffective
- **No parking slot mapping** — residents don't know which slots are available
- **No time-bound permissions** — visitors stay beyond acceptable hours
- **No accountability chain** — when a slot is misused, there's no audit trail
- **Gatekeeping is manual** — security guards work with outdated printouts

The result: conflicts, security risks, and a degraded living experience for everyone.

---

## 💡 Our Solution

**NexHood** is a full-stack real estate intelligence platform built around two core engines:

### Engine 1: Neighborhood Intelligence Platform (NIP)
A data aggregation, scoring, and visualization system that gives homebuyers a **360° verified profile** of any neighborhood before they commit. Think of it as a credit score — but for localities.

The platform pulls from:
- Government open data APIs (CPCB, census, urban development boards)
- Partner integrations (school boards, utility providers)
- Crowd-sourced resident reports (verified through OTP + residency confirmation)
- AI-driven inference (filling gaps using pattern matching across similar localities)

Every neighborhood receives a **NexScore™** — a composite score out of 100 — broken into six sub-scores that buyers can weight according to their own priorities (e.g., a family with school-going children can prioritize the education sub-score).

### Engine 2: Smart Visitor Parking System (SVPS)
A QR-code-based, role-aware parking management system that brings digital accountability to apartment visitor access.

The flow is simple:
1. Resident invites a visitor via the app → system generates a time-bound QR pass
2. Visitor shows QR at gate → security guard scans → system validates and logs entry
3. System allocates a guest parking slot → visitor navigates to it
4. On expiry or exit, slot is automatically freed and audit log updated

No paper. No confusion. Full traceability.

---

## ✨ Features

### 🗺️ Neighborhood Analytics Dashboard

- **Interactive map view** powered by Mapbox GL with color-coded NexScore overlays
- **Comparison mode**: Compare up to 3 neighborhoods side-by-side across all metrics
- **Historical trend charts**: See how a neighborhood's scores have changed over 5 years
- **Drill-down cards**: Click any metric to see raw data, sources, and last-updated timestamp
- **Satellite + Street view toggle** for visual context
- **Pinning & bookmarking**: Save neighborhoods for later comparison

### 🤖 AI-Based Scoring System (NexScore™)

- Composite score (0–100) computed by a Python microservice
- Weighted average of 6 sub-scores:
  - 🏫 **Education Index**: School density, board affiliation, infrastructure rating
  - 🔒 **Safety Index**: Crime incident frequency, type distribution, proximity to police station
  - 🌬️ **Environment Index**: AQI, green cover percentage, proximity to industrial zones
  - 💧 **Water & Utilities Index**: Water availability months/year, tanker dependency, power outage frequency
  - 🏗️ **Infrastructure Index**: Road quality, metro/highway proximity, civic amenity density
  - 🔮 **Growth Potential Index**: Upcoming projects, land use changes, price appreciation history
- Buyers can **customize weights** via a slider interface
- AI fills data gaps using **collaborative filtering** across localities with similar profiles
- Score confidence rating shown alongside each metric (e.g., "High confidence — 3 verified sources")

### 📡 Real-Time Environmental Data

- Live AQI integration via **CPCB public API**
- PM2.5, PM10, NO₂, SO₂ pollutant breakdown
- 7-day and 30-day trend sparklines
- **Alert system**: Push notification if AQI exceeds user-set threshold
- Weather overlay: Temperature, humidity, wind patterns
- Green zone mapping: Parks, lakes, tree cover density

### 🔴 Crime Heatmaps

- Normalized crime data visualized as heatmaps on the Mapbox canvas
- Filter by crime type: theft, assault, vehicle crime, vandalism
- Time-based filters: Last 30 days / 6 months / 1 year / 5 years
- Distance radius selector (500m – 5km from property)
- Crime trend: Improving / Stable / Worsening indicator

### 🏗️ Infrastructure Prediction Insights

- Extracted data from government master plans and smart city proposals
- Upcoming metro lines, expressways, and flyovers mapped on timeline
- "This neighborhood will get a metro station by 2027" — plain language cards
- Historical accuracy of such predictions tracked and displayed
- Linked to official document sources for verification

### 🚗 QR-Based Visitor Parking System

- **Resident Portal**: Generate time-bound visitor passes (2 hours / 4 hours / full day / custom)
- Pass carries: Visitor name, vehicle number, arrival window, host apartment
- **QR code delivery**: Sent via WhatsApp / SMS / email to visitor
- **Security Guard App**: Mobile-optimized scanner UI with one-tap verify
- **Real-time slot dashboard**: Visual map of all guest slots, live availability
- **Automatic expiry**: System flags overstay and notifies security + resident
- **Blacklist management**: Admins can flag problematic visitors
- **Audit logs**: Every scan event stored with timestamp, guard ID, outcome

### 🏠 Admin + Resident Dashboards

**Admin Dashboard:**
- Society overview: Total units, active residents, parking capacity
- Daily visitor traffic analytics
- Incident reports management
- Guard shift management
- Bulk resident onboarding via CSV import
- Export reports as PDF/Excel

**Resident Dashboard:**
- Generate and manage visitor passes
- View parking slot map
- Report neighborhood issues (pothole, streetlight, water)
- Neighborhood score for their locality
- Saved neighborhood comparisons

### 📱 Mobile-Friendly UI

- Fully responsive design with **Tailwind CSS breakpoints**
- PWA-ready (installable on Android/iOS home screen)
- Optimized for low-bandwidth connections (lazy loading, compressed assets)
- Touch-optimized map interactions
- QR scanner uses native camera API via `react-qr-reader`

### 🔐 Role-Based Access Control (RBAC)

Four distinct roles with granular permissions:

| Role | Capabilities |
|---|---|
| **Super Admin** | Full platform access, manage societies, configure data sources |
| **Society Admin** | Manage residents, configure parking, view all logs, export data |
| **Resident** | Generate passes, view dashboards, submit reports |
| **Security Guard** | Scan QR codes, log manual entries, view shift assignment |

JWT-based authentication with refresh token rotation. Session invalidation on suspicious activity.

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| **React.js 18** | Component-based UI framework |
| **Next.js 14** | SSR, routing, API routes, SEO optimization |
| **Tailwind CSS 3** | Utility-first responsive styling |
| **Zustand** | Lightweight global state management |
| **Redux Toolkit** | Complex async state (data fetching, caching) |
| **Recharts** | Responsive chart components (line, bar, radar) |
| **Chart.js** | Custom canvas-based visualizations |
| **Mapbox GL JS** | Interactive maps, heatmaps, 3D layers |
| **Axios** | HTTP client with interceptors for auth headers |
| **React Hook Form** | Performant form management with validation |
| **Framer Motion** | Smooth page transitions and micro-animations |

### Backend

| Technology | Purpose |
|---|---|
| **Node.js 18** | Runtime environment |
| **Express.js** | REST API framework |
| **Socket.io** | Real-time parking slot updates, live notifications |
| **JWT + Refresh Tokens** | Stateless authentication |
| **Multer** | File uploads (profile photos, society documents) |
| **node-cron** | Scheduled jobs (QR expiry, data sync) |
| **qrcode** | Server-side QR code generation as PNG/SVG |
| **Nodemailer** | Transactional emails |
| **Winston** | Structured logging |
| **Joi** | Request payload validation |

### Database

| Technology | Purpose |
|---|---|
| **MongoDB 6** | Primary database (neighborhoods, users, passes) |
| **Mongoose** | ODM with schema validation and middleware |
| **PostgreSQL 15** | Relational data (society structures, slot maps) |
| **Prisma** | Type-safe ORM for PostgreSQL |
| **Redis** | Session caching, rate limiting, pub/sub for Socket.io |

### AI / Data Services

| Technology | Purpose |
|---|---|
| **Python 3.11 microservice** | NexScore computation engine |
| **FastAPI** | Expose ML inference as REST endpoints |
| **Pandas / NumPy** | Data normalization and aggregation |
| **Scikit-learn** | Collaborative filtering, gap-filling model |
| **CPCB API** | Live AQI data feed |

### DevOps & Tooling

| Technology | Purpose |
|---|---|
| **Docker + Docker Compose** | Containerized local and production environments |
| **GitHub Actions** | CI/CD pipeline (lint → test → build → deploy) |
| **ESLint + Prettier** | Code style enforcement |
| **Husky + lint-staged** | Pre-commit hooks |
| **Jest + Supertest** | Unit and integration testing |
| **Playwright** | End-to-end testing |
| **dotenv** | Environment variable management |

---

## 🏛️ System Architecture

NexHood follows a **microservices-lite** architecture — modular services with shared infrastructure, deployable independently but orchestrated via Docker Compose in development.

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                               │
│                                                                     │
│   ┌──────────────────────┐        ┌──────────────────────────┐     │
│   │   Next.js Web App    │        │  Mobile PWA / Guard App  │     │
│   │  (Resident / Admin)  │        │    (Security Guard UI)   │     │
│   └──────────┬───────────┘        └────────────┬─────────────┘     │
└──────────────┼─────────────────────────────────┼───────────────────┘
               │  HTTPS / WSS                    │ HTTPS / WSS
               ▼                                 ▼
┌──────────────────────────────────────────────────────────────────────┐
│                         API GATEWAY (Express)                        │
│                     Rate limiting · Auth middleware                  │
│                     CORS · Request logging · JWT verify              │
└───────┬────────────────────────┬────────────────────────┬────────────┘
        │                        │                        │
        ▼                        ▼                        ▼
┌───────────────┐   ┌────────────────────┐   ┌───────────────────────┐
│  Neighborhood │   │  Parking & Visitor │   │   User & Auth Service │
│   Service     │   │     Service        │   │                       │
│               │   │                   │   │  - Register / Login   │
│  - Fetch data │   │  - Generate QR    │   │  - Role assignment    │
│  - Score calc │   │  - Verify QR      │   │  - Token rotation     │
│  - Reports    │   │  - Slot tracking  │   │  - Profile mgmt       │
└───────┬───────┘   └────────┬───────────┘   └──────────┬────────────┘
        │                    │                           │
        ▼                    ▼                           ▼
┌──────────────┐    ┌────────────────┐        ┌──────────────────────┐
│   MongoDB    │    │  PostgreSQL    │        │       Redis          │
│              │    │                │        │                      │
│  - Neighbor- │    │  - Parking     │        │  - Sessions          │
│    hood docs │    │    slot maps   │        │  - Rate limit keys   │
│  - Reports   │    │  - Society     │        │  - Socket.io pub/sub │
│  - Audit logs│    │    structures  │        │  - QR token cache    │
└──────────────┘    └────────────────┘        └──────────────────────┘
        │
        ▼
┌──────────────────────────────────────┐
│        Python AI Microservice        │
│           (FastAPI + ML)             │
│                                      │
│  - NexScore computation              │
│  - Data gap filling (sklearn)        │
│  - Trend analysis                    │
│  - Exposed via REST at :8001         │
└──────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────┐
│         External Data Sources        │
│                                      │
│  - CPCB API (AQI)                    │
│  - OpenStreetMap (geo data)          │
│  - Government open data portals      │
│  - School board APIs                 │
└──────────────────────────────────────┘
```

### API Request Flow — Neighborhood Report

```
User clicks "Generate Report"
        │
        ▼
Next.js frontend calls POST /api/generate-report { locality_id, weights }
        │
        ▼
Express API Gateway validates JWT, routes to Neighborhood Service
        │
        ├──► MongoDB: fetch cached neighborhood base data
        │
        ├──► CPCB API: fetch live AQI (if last sync > 15 min)
        │
        └──► Python microservice POST /score { raw_data, weights }
                    │
                    ▼
              Returns NexScore + sub-scores + confidence ratings
        │
        ▼
Neighborhood Service composes full report object, stores to MongoDB
        │
        ▼
Response returned to frontend as JSON
        │
        ▼
Next.js renders dashboard with Recharts + Mapbox visualization
```

---

## 📁 Folder Structure

```
nexhood/
├── apps/
│   ├── web/                          # Next.js frontend
│   │   ├── public/
│   │   │   ├── assets/
│   │   │   └── icons/
│   │   ├── src/
│   │   │   ├── app/                  # Next.js App Router
│   │   │   │   ├── (auth)/
│   │   │   │   │   ├── login/
│   │   │   │   │   └── register/
│   │   │   │   ├── dashboard/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── neighborhood/
│   │   │   │   │   ├── parking/
│   │   │   │   │   └── admin/
│   │   │   │   └── layout.tsx
│   │   │   ├── components/
│   │   │   │   ├── ui/               # Reusable primitives
│   │   │   │   ├── maps/             # Mapbox components
│   │   │   │   ├── charts/           # Recharts wrappers
│   │   │   │   ├── parking/          # QR + slot components
│   │   │   │   └── neighborhood/     # Score + analytics cards
│   │   │   ├── store/                # Zustand stores
│   │   │   ├── hooks/                # Custom React hooks
│   │   │   ├── lib/                  # Axios, utils, constants
│   │   │   ├── types/                # TypeScript interfaces
│   │   │   └── styles/
│   │   ├── .env.local.example
│   │   ├── next.config.js
│   │   ├── tailwind.config.js
│   │   └── package.json
│   │
│   └── guard-app/                    # Lightweight PWA for security guards
│       ├── src/
│       │   ├── scanner/
│       │   └── components/
│       └── package.json
│
├── services/
│   ├── api/                          # Express.js backend
│   │   ├── src/
│   │   │   ├── config/
│   │   │   │   ├── db.ts             # MongoDB + Prisma connections
│   │   │   │   └── redis.ts
│   │   │   ├── middleware/
│   │   │   │   ├── auth.ts           # JWT verification
│   │   │   │   ├── rbac.ts           # Role-based access
│   │   │   │   ├── rateLimiter.ts
│   │   │   │   └── errorHandler.ts
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── auth.routes.ts
│   │   │   │   │   ├── auth.controller.ts
│   │   │   │   │   └── auth.service.ts
│   │   │   │   ├── neighborhood/
│   │   │   │   │   ├── neighborhood.routes.ts
│   │   │   │   │   ├── neighborhood.controller.ts
│   │   │   │   │   ├── neighborhood.service.ts
│   │   │   │   │   └── neighborhood.model.ts
│   │   │   │   ├── parking/
│   │   │   │   │   ├── parking.routes.ts
│   │   │   │   │   ├── parking.controller.ts
│   │   │   │   │   ├── parking.service.ts
│   │   │   │   │   └── qr.service.ts
│   │   │   │   └── visitor/
│   │   │   │       ├── visitor.routes.ts
│   │   │   │       ├── visitor.controller.ts
│   │   │   │       └── visitor.service.ts
│   │   │   ├── sockets/
│   │   │   │   └── parking.socket.ts
│   │   │   ├── jobs/                 # node-cron scheduled tasks
│   │   │   │   ├── expireQRPasses.ts
│   │   │   │   └── syncAQIData.ts
│   │   │   ├── utils/
│   │   │   │   ├── logger.ts
│   │   │   │   ├── mailer.ts
│   │   │   │   └── validators.ts
│   │   │   └── app.ts
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── .env.example
│   │   └── package.json
│   │
│   └── ai-engine/                    # Python FastAPI microservice
│       ├── app/
│       │   ├── main.py
│       │   ├── routers/
│       │   │   ├── score.py
│       │   │   └── predict.py
│       │   ├── models/
│       │   │   ├── nexscore.py
│       │   │   └── gap_filler.py
│       │   └── data/
│       │       └── weights_config.json
│       ├── requirements.txt
│       └── Dockerfile
│
├── packages/
│   └── shared-types/                 # Shared TypeScript interfaces (monorepo)
│
├── infrastructure/
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   └── nginx/
│       └── nginx.conf
│
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Lint + test on PRs
│       └── deploy.yml                # Deploy on main push
│
├── .eslintrc.js
├── .prettierrc
├── turbo.json                        # Turborepo config (monorepo)
└── package.json
```

---

## ⚙️ Installation Guide

### Prerequisites

Ensure you have the following installed:

- **Node.js** >= 18.0.0
- **Python** >= 3.11
- **Docker** and **Docker Compose** v2+
- **MongoDB** 6.x (or use Docker)
- **PostgreSQL** 15+ (or use Docker)
- **Redis** 7+ (or use Docker)
- **Git**

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/nexhood.git
cd nexhood
```

### 2. Install Node.js Dependencies (Monorepo)

```bash
npm install       # Installs all workspace dependencies via Turborepo
```

### 3. Set Up Environment Variables

#### Backend (`services/api/.env`)

```env
# App
NODE_ENV=development
PORT=4000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/nexhood

# PostgreSQL (Prisma)
DATABASE_URL=postgresql://nexhood_user:yourpassword@localhost:5432/nexhood_parking

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-very-long-random-secret-key-here
JWT_REFRESH_SECRET=another-very-long-random-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# External APIs
CPCB_API_KEY=your_cpcb_api_key
MAPBOX_SECRET_TOKEN=sk.eyXXXXXXXX

# Email (Nodemailer)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
MAIL_FROM=noreply@nexhood.in

# AI Microservice
AI_ENGINE_URL=http://localhost:8001

# QR Code
QR_BASE_URL=https://app.nexhood.in/verify
```

#### Frontend (`apps/web/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyXXXXXXXX
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Python AI Engine (`services/ai-engine/.env`)

```env
ENV=development
PORT=8001
MODEL_PATH=./models/nexscore_v2.pkl
CPCB_API_KEY=your_cpcb_api_key
```

---

### 4. Database Setup

#### Run with Docker (Recommended)

```bash
docker-compose up -d mongodb postgres redis
```

#### Run Prisma Migrations (PostgreSQL)

```bash
cd services/api
npx prisma migrate dev --name init
npx prisma generate
```

#### Seed Initial Data

```bash
cd services/api
npm run seed
# Populates: sample neighborhoods, demo society, admin user
```

---

### 5. Start the Development Servers

#### Option A — All services with Docker Compose

```bash
docker-compose up --build
```

This starts:
- **Next.js frontend** on `http://localhost:3000`
- **Express API** on `http://localhost:4000`
- **Python AI Engine** on `http://localhost:8001`
- **MongoDB** on `localhost:27017`
- **PostgreSQL** on `localhost:5432`
- **Redis** on `localhost:6379`

#### Option B — Manual (for active development)

```bash
# Terminal 1 — Backend API
cd services/api && npm run dev

# Terminal 2 — Frontend
cd apps/web && npm run dev

# Terminal 3 — AI Engine
cd services/ai-engine
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001

# Terminal 4 — Databases (Docker)
docker-compose up -d mongodb postgres redis
```

---

### 6. Verify Setup

Visit the following URLs to confirm everything is running:

- Frontend: `http://localhost:3000`
- API Health: `http://localhost:4000/api/health`
- AI Engine Docs: `http://localhost:8001/docs` (FastAPI auto-generated)

Default credentials after seeding:
- **Admin**: `admin@nexhood.in` / `Admin@123`
- **Resident**: `demo.resident@nexhood.in` / `Resident@123`

---

## 📘 Usage Guide

### Workflow 1: First-Time Homebuyer — Evaluating a Neighborhood

1. **Register** as a new user at `/register`
2. Navigate to **Neighborhood Explorer** from the sidebar
3. **Search** for a locality by name or pin code (e.g., "Baner, Pune")
4. View the **NexScore™ overview card** — overall score + 6 sub-scores
5. Click **"View Full Analysis"** to expand the dashboard:
   - Explore the AQI trend chart (last 30 days)
   - Toggle the crime heatmap by incident type
   - View the infrastructure timeline (upcoming projects)
6. Adjust **priority weights** with the slider panel (e.g., boost Education to 40%)
   - NexScore recalculates in real-time
7. Click **"Compare"** to add a second or third neighborhood side-by-side
8. Click **"Generate Report"** to receive a downloadable PDF report via email

---

### Workflow 2: Generating a Neighborhood Intelligence Report

```
User → /dashboard/neighborhood → Search "Whitefield, Bangalore"
      ↓
System fetches cached data + live AQI update
      ↓
AI engine computes NexScore with default weights
      ↓
Dashboard renders:
  - Score card (NexScore: 74/100)
  - Sub-scores (Education: 81, Safety: 68, Environment: 55...)
  - AQI line chart + pollutant breakdown
  - Crime heatmap (filter: last 6 months)
  - Infrastructure timeline (Purple Line Metro, 2026)
      ↓
User adjusts weights → real-time score recalculation
      ↓
User clicks "Generate PDF Report"
      ↓
POST /api/generate-report → background job → email delivered in ~30s
```

---

### Workflow 3: Visitor Parking QR Flow

**Step 1 — Resident generates a pass:**
1. Resident logs in → goes to **Parking** section
2. Clicks **"Invite Visitor"**
3. Fills form: Visitor Name, Vehicle Number, Expected Arrival, Duration
4. Clicks **"Generate Pass"**
5. System creates a time-bound QR code and sends it to visitor via WhatsApp/SMS

**Step 2 — Visitor arrives:**
1. Visitor shows QR code on phone to security guard
2. Guard opens the **Guard App** (`/guard`) and taps **"Scan QR"**
3. Camera opens → scans QR
4. System validates: checks token signature, expiry, vehicle match
5. If valid: ✅ Green screen with slot assignment (e.g., "G-07")
6. If expired/invalid: ❌ Red screen with reason

**Step 3 — Real-time slot update:**
1. Socket.io event fires → Resident's dashboard shows parking slot as "Occupied"
2. On visitor exit, guard marks exit → slot freed → socket event → dashboard updates


## 🎨 Design & Prototypes

The UI/UX of NexHood is designed with a focus on clarity, data-driven insights, and seamless user experience for both homebuyers and residential societies.

The design system emphasizes:
- Clean and intuitive dashboards for complex data visualization
- Map-first interface for neighborhood exploration
- Mobile-friendly flows for visitor parking and QR scanning
- Role-based UI tailored for Admins, Residents, and Security Guards

**Figma Project:**  
https://www.figma.com/proto/iuxNtjRbFpwefcHVPplrlT/MID_SEM?page-id=74%3A1289&node-id=84-2&p=f&viewport=80%2C-61%2C0.15&t=ee6ZGvsyigkQYL9u-1&scaling=scale-down-width&content-scaling=fixed&starting-point-node-id=84%3A2

**Key Screens Designed:**
- Neighborhood Explorer
- NexScore Dashboard
- Crime Heatmap Interface
- Infrastructure Timeline
- Visitor Pass Generation
- QR Scanner (Guard App)

> Note: The screenshots below are exported directly from the Figma designs.

---

## 📸 Screenshots

> 📌 Screenshots are from the live staging environment at `staging.nexhood.in`

| Screen | Preview |
|---|---|
| Neighborhood Explorer | ![](https://res.cloudinary.com/dsvggz83x/image/upload/v1776880132/landing_pzyto4.png) |
| NexScore™ Dashboard | ![](https://res.cloudinary.com/dsvggz83x/image/upload/v1776880132/dashboard_covjyn.png) |
| Crime Heatmap View | ![](https://res.cloudinary.com/dsvggz83x/image/upload/v1776880132/crime_hbntpp.png) |
| Infrastructure Timeline | ![](https://res.cloudinary.com/dsvggz83x/image/upload/v1776880132/infra_zwjzcc.png) |
| Neighborhood Comparison | ![](https://res.cloudinary.com/dsvggz83x/image/upload/v1776880132/compare_wj07zk.png) |
---

## 📡 API Documentation

Base URL: `https://api.nexhood.in/api/v1`

All authenticated endpoints require:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

### 🔐 Auth Endpoints

#### `POST /auth/register`
Register a new user.

**Request:**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "SecurePass@123",
  "role": "resident",
  "society_id": "soc_abc123"
}
```

**Response `201`:**
```json
{
  "success": true,
  "user": { "id": "usr_xyz", "name": "Rahul Sharma", "role": "resident" },
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci..."
}
```

---

#### `POST /auth/login`
Authenticate and receive tokens.

---

### 🏘️ Neighborhood Endpoints

#### `GET /neighborhood-data/:locality_id`
Fetch full neighborhood data object.

**Response `200`:**
```json
{
  "locality": {
    "id": "loc_pune_baner",
    "name": "Baner",
    "city": "Pune",
    "coordinates": { "lat": 18.5590, "lng": 73.7868 },
    "nexscore": 71,
    "sub_scores": {
      "education": 78,
      "safety": 65,
      "environment": 58,
      "water_utilities": 72,
      "infrastructure": 80,
      "growth_potential": 74
    },
    "aqi": {
      "current": 142,
      "category": "Moderate",
      "last_updated": "2025-04-15T08:30:00Z"
    },
    "data_confidence": "high",
    "sources": ["CPCB", "Pune Police Open Data", "MHRD School Census"]
  }
}
```

---

#### `POST /neighborhood-data/compare`
Compare multiple localities.

**Request:**
```json
{
  "locality_ids": ["loc_pune_baner", "loc_pune_wakad", "loc_pune_kothrud"],
  "weights": {
    "education": 0.30,
    "safety": 0.25,
    "environment": 0.15,
    "water_utilities": 0.10,
    "infrastructure": 0.10,
    "growth_potential": 0.10
  }
}
```

**Response `200`:** Array of scored locality objects with custom-weighted NexScores.

---

#### `POST /generate-report`
Generate a full PDF neighborhood intelligence report.

**Request:**
```json
{
  "locality_id": "loc_pune_baner",
  "weights": { "education": 0.3, "safety": 0.3, "environment": 0.2, "water_utilities": 0.1, "infrastructure": 0.05, "growth_potential": 0.05 },
  "email": "rahul@example.com"
}
```

**Response `202`:**
```json
{
  "success": true,
  "job_id": "rpt_job_991a",
  "message": "Report generation queued. You will receive an email within 2 minutes.",
  "estimated_delivery": "2025-04-15T09:05:00Z"
}
```

---

### 🚗 Visitor Parking Endpoints

#### `POST /visitor-pass`
Generate a new time-bound QR visitor pass. Requires `resident` role.

**Request:**
```json
{
  "visitor_name": "Priya Kapoor",
  "vehicle_number": "MH12AB1234",
  "arrival_window_start": "2025-04-15T14:00:00Z",
  "duration_hours": 4,
  "host_apartment": "B-402",
  "notify_via": ["whatsapp", "email"],
  "visitor_contact": "+91-9876543210"
}
```

**Response `201`:**
```json
{
  "pass_id": "vp_7f9c2a",
  "qr_code_url": "https://api.nexhood.in/qr/vp_7f9c2a.png",
  "valid_until": "2025-04-15T18:00:00Z",
  "slot_pre_assigned": "G-07",
  "status": "active"
}
```

---

#### `POST /verify-qr`
Validate a scanned QR pass. Requires `guard` or `admin` role.

**Request:**
```json
{
  "token": "vp_7f9c2a_signed_payload_here",
  "guard_id": "grd_001",
  "scan_type": "entry"
}
```

**Response `200` (valid):**
```json
{
  "valid": true,
  "visitor_name": "Priya Kapoor",
  "vehicle_number": "MH12AB1234",
  "host_apartment": "B-402",
  "slot_assigned": "G-07",
  "valid_until": "2025-04-15T18:00:00Z",
  "message": "Access granted. Direct visitor to slot G-07."
}
```

**Response `403` (expired):**
```json
{
  "valid": false,
  "reason": "pass_expired",
  "expired_at": "2025-04-15T18:00:00Z",
  "message": "This pass has expired. Please ask the resident to generate a new pass."
}
```

---

#### `PATCH /visitor-pass/:pass_id/exit`
Mark a visitor as exited and free the parking slot.

**Response `200`:**
```json
{
  "success": true,
  "slot_freed": "G-07",
  "duration_parked": "3h 22m",
  "exit_time": "2025-04-15T17:22:00Z"
}
```

---

#### `GET /parking/slots/:society_id`
Get real-time parking slot map for a society.

**Response `200`:**
```json
{
  "total_guest_slots": 20,
  "available": 13,
  "occupied": 7,
  "slots": [
    { "slot_id": "G-01", "status": "available" },
    { "slot_id": "G-07", "status": "occupied", "pass_id": "vp_7f9c2a", "visitor": "Priya Kapoor" }
  ]
}
```

---

## 🗄️ Database Schema

### MongoDB Collections

#### `neighborhoods`
```js
{
  _id: ObjectId,
  locality_id: String,        // Unique slug: "pune_baner"
  name: String,
  city: String,
  state: String,
  coordinates: { lat: Number, lng: Number },
  nexscore: Number,           // Cached composite score
  sub_scores: {
    education: Number,
    safety: Number,
    environment: Number,
    water_utilities: Number,
    infrastructure: Number,
    growth_potential: Number
  },
  raw_data: {
    aqi: { current: Number, trend: Array },
    crime_incidents: Array,
    schools: Array,
    upcoming_projects: Array
  },
  data_sources: [String],
  last_synced: Date,
  created_at: Date
}
```

#### `visitor_passes`
```js
{
  _id: ObjectId,
  pass_id: String,            // "vp_7f9c2a"
  resident_id: ObjectId,
  society_id: ObjectId,
  visitor_name: String,
  vehicle_number: String,
  host_apartment: String,
  slot_assigned: String,
  qr_token: String,           // Signed JWT-like token embedded in QR
  valid_from: Date,
  valid_until: Date,
  status: Enum['active', 'used', 'expired', 'revoked'],
  scan_logs: [{
    guard_id: ObjectId,
    scan_type: Enum['entry', 'exit'],
    timestamp: Date,
    result: Enum['success', 'failed']
  }],
  created_at: Date
}
```

### PostgreSQL Tables (Prisma Schema)

#### `societies`
| Column | Type | Description |
|---|---|---|
| id | UUID PK | Society unique ID |
| name | VARCHAR | Society name |
| address | TEXT | Full address |
| city | VARCHAR | City |
| admin_id | UUID FK | Linked admin user |
| created_at | TIMESTAMP | |

#### `parking_slots`
| Column | Type | Description |
|---|---|---|
| id | UUID PK | |
| society_id | UUID FK | Linked society |
| slot_code | VARCHAR | Display code (e.g., "G-07") |
| slot_type | ENUM | `resident` / `guest` |
| is_available | BOOLEAN | Real-time availability |
| current_pass_id | VARCHAR | Linked active pass if occupied |

#### `users`
| Column | Type | Description |
|---|---|---|
| id | UUID PK | |
| name | VARCHAR | |
| email | VARCHAR UNIQUE | |
| password_hash | VARCHAR | bcrypt |
| role | ENUM | `super_admin`, `admin`, `resident`, `guard` |
| society_id | UUID FK | |
| apartment | VARCHAR | e.g., "B-402" |
| is_active | BOOLEAN | |

---

## 🔮 Future Improvements

### 🤖 Advanced AI Predictions
- **Price appreciation forecast**: ML model trained on historical price data + infrastructure developments to predict 2–5 year property value growth
- **Neighborhood gentrification early-warning**: Detect early signals of neighborhood transformation using permit data, business opening patterns, and demographic shifts
- **Personalized matching**: Input your lifestyle profile and get ranked neighborhood recommendations

### 📱 Native Mobile App
- iOS + Android apps built with **React Native**
- Offline-first architecture with local caching for low-connectivity areas
- Biometric authentication for guard app
- Push notifications for QR expiry, slot availability

### 🔌 IoT Parking Sensors
- Ultrasonic sensors in parking slots transmit live occupancy via MQTT
- Automatic slot status updates without manual guard intervention
- Dashboard shows sensor battery levels and health
- Reduces dependency on manual scan-out process

### 🏛️ Government Data Integration
- Direct API integrations with:
  - NCRB (National Crime Records Bureau)
  - UDISE+ (Unified District Information System for Education)
  - Smart Cities Mission portal
  - MoHUA (Ministry of Housing and Urban Affairs)
- Auto-sync scheduled tasks replace manual data upload

### 🏗️ Developer API (B2B)
- Public API for PropTech companies to embed NexScore widgets
- White-label neighborhood intelligence for real estate portals
- Tiered pricing with rate limiting via API keys

### 🗣️ Multilingual Support
- UI localization: Hindi, Marathi, Tamil, Telugu, Kannada
- Voice-based neighborhood search for low-literacy users
- Regional government portal scraping for state-specific data

---

## 🧗 Challenges Faced

### 1. Data Aggregation at Scale
**Challenge:** Government data exists in 50+ formats — some as PDFs, some as Excel sheets, some as poorly structured HTML tables, and some behind login walls.

**Approach:** Built a multi-strategy scraper pipeline with:
- `pdf-parse` for PDF extraction
- `cheerio` for HTML scraping
- Manual upload fallback for locked data
- Volunteer data verification programme for crowd-sourced inputs

**Ongoing:** Coverage varies by city — metros have 85%+ coverage, tier-3 cities are at ~40%.

---

### 2. Real-Time Data Accuracy
**Challenge:** AQI readings can change drastically within hours. Crime data is often delayed by weeks. Infrastructure plans change without announcement.

**Approach:**
- AQI: Pulled every 15 minutes from CPCB API with Redis caching
- Crime data: Synced weekly with a stale-data warning shown to users
- Scores show "Data freshness" indicators (🟢 Fresh / 🟡 Aging / 🔴 Stale)
- Version history kept for all data points — users can see data from any date

---

### 3. Privacy & Misuse Concerns
**Challenge:** Detailed crime heatmaps can stigmatize areas. Visitor pass data contains PII. QR token security must be airtight.

**Approach:**
- Crime data is shown at **ward/zone level**, never street-level granularity
- Visitor PII encrypted at rest with AES-256
- QR tokens are **one-time-use signed JWTs** with 15-minute validity windows after activation
- DPDP Act (India) compliance review completed before beta launch
- GDPR-aligned data deletion flows implemented

---

### 4. QR Token Security
**Challenge:** A malicious user could screenshot a valid QR and share it, or attempt to reuse expired tokens.

**Approach:**
- QR tokens are signed with HMAC-SHA256 using a server-side secret
- Redis tracks all used tokens — a second scan attempt returns `already_used`
- Guard app displays a photo of the registered vehicle for manual cross-check
- 5-minute post-expiry grace window to handle clock drift

---

## 🤝 Contributing

We welcome contributions from developers, designers, data engineers, and domain experts in real estate and urban planning.

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature-name`
3. Follow the coding standards: `npm run lint && npm run format`
4. Write tests for new features: `npm run test`
5. Submit a pull request with a clear description

### Contribution Areas

- 🗄️ **Data**: Help source and clean neighborhood datasets for new cities
- 🎨 **Design**: UI/UX improvements, accessibility
- 🔧 **Backend**: New API endpoints, performance optimization
- 🧠 **AI/ML**: Improve NexScore model accuracy
- 📖 **Docs**: Improve documentation and add usage examples
- 🌐 **i18n**: Add language translations

### Code Standards

- All code must pass ESLint + Prettier checks
- New API endpoints must include Joi validation and Jest tests
- React components must have TypeScript types defined
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/) format

### Reporting Issues

Use the GitHub Issues tab. Please include:
- Environment (OS, Node version, browser)
- Steps to reproduce
- Expected vs actual behaviour
- Relevant logs (redact sensitive data)

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 NexHood Technologies Pvt. Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

See [LICENSE](LICENSE) for full text.

---

## 👤 Authors

<table>
  <tr>
    <td align="center">
      <strong>Hanuman Singh</strong><br/>
      <sub>Full-Stack Engineer & Product Lead</sub><br/>
      <a href="https://github.com/hanumanraj07">@Github</a> ·
      <a href="https://linkedin.com/in/hanumanraj07">LinkedIn</a>
    </td>
  </tr>
</table>

> 💌 For business inquiries, partnerships, or pilot programs: **hanumanrajpurohit.vercel.app**

---

<div align="center">

**Built with ❤️ for homebuyers who deserve better data.**

*NexHood — Know Your Neighborhood. Own Your Space.*

⭐ If this project helped you, consider giving it a star!

</div>