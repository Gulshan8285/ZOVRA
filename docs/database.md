# ZOVRA 2026 – Database & Data Models Specification

## 1. Storage Architecture

ZOVRA uses a unified data model between the **Flutter mobile app** (Local Reactive Cache & Offline-first via `SharedPreferences` + encrypted JSON) and the **Next.js Web Backend** (High-concurrency SQLite with WAL mode + REST JSON APIs).

---

## 2. Shared Database Entities

### 2.1 Services (`services`)
| Field | Type | Description |
|-------|------|-------------|
| `id` | `TEXT PRIMARY KEY` | Unique identifier (e.g. `srv_dry_massage`, `deep-tissue-massage`) |
| `name` | `TEXT NOT NULL` | Service display name |
| `slug` | `TEXT UNIQUE` | SEO slug (`dry-massage`, `deep-tissue-massage`) |
| `category` | `TEXT NOT NULL` | Category group (e.g. `Therapeutic`, `Relaxation`, `Recovery`) |
| `basePrice` | `REAL NOT NULL` | Starting price in INR |
| `rating` | `REAL NOT NULL` | Average review rating (e.g. 4.93) |
| `reviewCount` | `INTEGER` | Total verified client reviews count |
| `imageUrl` | `TEXT NOT NULL` | Unsplash CDN editorial image |
| `durations` | `JSON NOT NULL` | Array of `{ durationMinutes, price, originalPrice }` |
| `inclusions` | `JSON` | In-home spa inclusions |
| `benefits` | `JSON` | Health & wellness benefits |
| `preparation` | `JSON` | Client room setup instructions |
| `addOns` | `JSON` | Optional add-on therapies |
| `isActive` | `INTEGER` | 1 = visible, 0 = hidden |

#### Master 1-Hour Baseline Pricing
- **Dry Massage (No-Oil Acupressure)**: **₹849** (1 hr)
- **Classic Swedish Relaxation Massage**: **₹1,249** (1 hr)
- **Deep Tissue Muscle Release Therapy**: **₹1,549** (1 hr)
- **Sports Recovery & Mobility Massage**: **₹1,749** (1 hr)
- **Sensory Aromatherapy & Sleep Massage**: **₹2,049** (1 hr)

---

### 2.2 Bookings (`bookings`)
| Field | Type | Description |
|-------|------|-------------|
| `id` | `TEXT PRIMARY KEY` | Reference code (e.g. `ZOV-2026-8941`) |
| `customerName` | `TEXT NOT NULL` | Client full name |
| `customerPhone` | `TEXT NOT NULL` | Contact number for WhatsApp updates |
| `appointmentDate` | `TEXT NOT NULL` | Date (`YYYY-MM-DD`) |
| `timeSlot` | `TEXT NOT NULL` | Time interval (`11:00 AM - 12:30 PM`) |
| `serviceName` | `TEXT NOT NULL` | Booked therapy |
| `durationMinutes`| `INTEGER` | Package duration (30, 60, 90, 120 mins) |
| `subtotal` | `REAL NOT NULL` | Service cost before coupon discount |
| `couponDiscount` | `REAL DEFAULT 0`| Discount deducted |
| `couponCode` | `TEXT` | Applied promo code (`WELCOME20`, `ZOVRA10`) |
| `taxAmount` | `REAL NOT NULL` | Configurable GST & service fee |
| `totalAmount` | `REAL NOT NULL` | Final payable total in INR |
| `paymentStatus` | `TEXT NOT NULL` | `Paid` (UPI / Card) or `Pending (COD)` |
| `status` | `TEXT NOT NULL` | `PENDING`, `CONFIRMED`, `THERAPIST_ASSIGNED`, `ON_THE_WAY`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED` |
| `assignedTherapistName`| `TEXT` | Dispatched professional (e.g. `Vikram Singh`) |
| `transactionId` | `TEXT NOT NULL` | Unique payment gateway reference (`TXN-UPI-...`) |
| `createdAt` | `TEXT NOT NULL` | ISO 8601 timestamp |

---

### 2.3 Coupons & Vouchers (`coupons`)
| Field | Type | Description |
|-------|------|-------------|
| `code` | `TEXT PRIMARY KEY` | Promo code uppercase (e.g. `WELCOME20`) |
| `title` | `TEXT NOT NULL` | Human-readable banner label |
| `discountType`| `TEXT NOT NULL` | `'percentage'` (e.g. 20%) or `'flat'` (e.g. ₹50) |
| `discountValue`| `REAL NOT NULL` | Magnitude of discount |
| `minOrderAmount`| `REAL DEFAULT 0`| Minimum cart spend required |
| `maxDiscount`| `REAL` | Maximum cap for percentage discounts |
| `validTill` | `TEXT NOT NULL` | Expiry date |
| `isActive` | `INTEGER` | 1 = enabled, 0 = disabled |

---

### 2.4 Customer CRM & Addresses (`customers`)
| Field | Type | Description |
|-------|------|-------------|
| `phone` | `TEXT PRIMARY KEY` | Customer mobile number |
| `name` | `TEXT` | Full customer name |
| `email` | `TEXT` | Notification email address |
| `savedAddresses`| `JSON` | List of `{ houseNumber, building, street, city, pinCode, tag }` |
| `totalSpend` | `REAL` | Aggregate lifetime order value |
| `bookingCount` | `INTEGER` | Total completed bookings count |
