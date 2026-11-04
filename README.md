# ZOVRA – Premium Men's Wellness at Home

**Brand Tagline:** *Relax. Recharge. Rejuvenate.*

ZOVRA is a production-ready, full-stack web platform built for booking premium, therapeutic men's home massage services in India (Delhi NCR, Mumbai, Bengaluru, Hyderabad).

---

## 💎 Brand Identity & Design System

- **Primary Background:** Crisp Pure White (`#FFFFFF`)
- **Typography & Primary Buttons:** Deep Obsidian Black (`#111111`)
- **Highlights & Accents:** Soft Powder Blue (`#DCEEFF`)
- **Secondary Accents:** Deep Atlantic Blue (`#244B70`)
- **Card & Section Backgrounds:** Ultra-Light Minimal Grey (`#F5F6F7`)
- **Visual Aesthetic:** Minimalist editorial design, generous whitespace, elegant micro-interactions, and authentic commercial-grade wellness photography.

---

## 🚀 Key Features Built & Functional

### 1. Customer Discovery & Experience
- **Hero & Location Checker:** Instant 6-digit Indian PIN verification (Delhi NCR, Mumbai, Bengaluru, Hyderabad) with operational feedback.
- **10 Specialised Men's Massage Therapies:**
  1. Deep Tissue Massage (Firm trigger-point release for chronic knots)
  2. Classic Swedish Relaxation Massage (Effleurage stress relief)
  3. Sports Recovery & Mobility Massage (Assisted PNF stretching & DOMS relief)
  4. Head, Neck & Shoulder Relief Therapy (Targeted tech neck release)
  5. Spine & Lower Back Therapeutic Massage (Lumbar decompression & hot towel therapy)
  6. Thai Foot Reflexology & Leg Revitaliser (Plantar acupressure & calf drainage)
  7. ZOVRA Signature Full Body Recharge (90/120 min flagship holistic session)
  8. Traditional Balinese Deep Healing Massage (Acupressure & virgin coconut oils)
  9. Sensory Aromatherapy & Sleep Inducing Massage (Pharmaceutical grade lavender/cedarwood)
  10. Executive Anti-Stress & Decompression Massage (Rapid corporate fatigue relief)

### 2. Service Details & Customisation
- Left/Right split layout on desktop; sticky booking drawer on mobile.
- **Duration Variants:** 45 min, 60 min, 90 min, 120 min with instantaneous live price recalculation.
- **Approved Add-ons:** Herbal pain-relief balms, French lavender essential oils, hot herbal potli fomentation, and scalp therapy.
- **Full Inclusions & Prep Guides:** Details what the therapist brings (portable massage table, single-use linens, oils, music) and home room setup.
- **Ethical Care Pledge:** Strict non-sexual therapeutic conduct policy and professional draping standards.

### 3. Shopping Cart & Checkout
- Persistent cart state across sessions and drawer slide-overs.
- **Strict 2-Hour Advance Booking Rule:** Server and frontend enforce that slots less than 2 hours from current server time cannot be booked.
- **Double Booking Protection:** Atomic transaction locks ensure that once a slot is booked, it is immediately disabled for other users.
- **Address & PIN Validation:** Verifies house/flat, building, street, and supported PIN code.
- **Mobile OTP Authentication:** Clean OTP login/signup with demo code preview (`123456`) and verification.
- **Cash on Delivery (COD):** 100% pay-after-service guarantee.

### 4. Customer Dashboard (`/account`)
- **Overview:** Active appointment highlights and statistics.
- **My Bookings:** Status pills (`Pending`, `Confirmed`, `Therapist Assigned`, `On The Way`, `In Progress`, `Completed`, `Cancelled`).
- **Assigned Therapist Details:** View assigned masseur name, phone, and experience.
- **Cancellation:** Self-serve cancellation up to 2 hours before slot according to policy.
- **Verified Review Submission:** 1 to 5 star rating modal with therapy quality, therapist professionalism, and written review.
- **Saved Addresses:** Add, edit, and delete multiple addresses.
- **Profile Management:** Update name and email.

### 5. Secure Admin & Dispatch Portal (`/admin`)
- **Access Passphrase:** `zovra2026`
- **Real-Time Database Metrics:** Total bookings, today's appointments, completed sessions, real revenue calculated from completed bookings, and outstanding COD collections.
- **Booking Management:** Search by ID/name/phone, filter by status and date, assign certified therapists, change status through lifecycle, toggle COD collected, and add internal notes.
- **Service Catalog Control:** Edit base prices, descriptions, and active toggles.
- **Therapist Roster:** View therapist certifications, contact details, and dispatch status.
- **Location Management:** Active cities and serviceable PIN codes.
- **Review Moderation:** Approve, reject, and submit official replies to reviews.

---

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router, Server Components & Route Handlers)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom ZOVRA design tokens
- **Database:** SQLite via `better-sqlite3` with ACID transactions (`data/zovra.db`)
- **Icons:** Lucide React

---

## 💻 Running the Application

```bash
# Run development server
npm run dev

# Run production build
npm run build
npm start
```

Default port: `http://localhost:3000`

Admin URL: `http://localhost:3000/admin` (Passphrase: `zovra2026`)

