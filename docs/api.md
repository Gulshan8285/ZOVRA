# ZOVRA 2026 – REST API Documentation

Base Production URL: `https://zovra.vercel.app/api`

---

## 1. Catalog & Services Endpoints

### `GET /services`
Retrieve active massage catalogue.
- **Query Params**: `?all=true` (includes inactive items for Admin)
- **Response**:
```json
{
  "success": true,
  "services": [
    {
      "id": "dry-massage",
      "name": "Dry Massage (No-Oil Acupressure)",
      "slug": "dry-massage",
      "basePrice": 849,
      "durations": [
        { "durationMinutes": 60, "price": 849, "originalPrice": 1199 },
        { "durationMinutes": 30, "price": 549, "originalPrice": 799 },
        { "durationMinutes": 90, "price": 1249, "originalPrice": 1699 }
      ],
      "rating": 4.93,
      "reviewCount": 420
    }
  ]
}
```

### `GET /services/:slug`
Retrieve comprehensive details of a single therapy including duration packages, room preparation instructions, FAQs, and verified client feedback.

---

## 2. Bookings & Checkout Endpoints

### `POST /bookings`
Place a new booking.
- **Request Body**:
```json
{
  "customerName": "Gulshan Yadav",
  "customerPhone": "+91 98765 43210",
  "serviceId": "dry-massage",
  "durationMinutes": 60,
  "appointmentDate": "2026-11-05",
  "timeSlot": "11:00 AM - 12:30 PM",
  "address": {
    "houseNumber": "Flat 402, Tower B",
    "building": "The Palm Springs Luxury Residences",
    "street": "Golf Course Road, Sector 54",
    "city": "Gurugram",
    "pinCode": "122002"
  },
  "subtotal": 849,
  "discount": 0,
  "totalAmount": 1050.82,
  "paymentMethod": "UPI (Google Pay)",
  "paymentStatus": "Paid"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "booking": {
    "id": "ZOV-2026-8941",
    "status": "CONFIRMED",
    "assignedTherapistName": "Vikram Singh"
  }
}
```

### `GET /bookings/:id`
Fetch live progress status, assigned therapist details, and stage timeline for real-time tracking.

### `PATCH /bookings/:id`
(Admin Operations) Advance booking stage (`CONFIRMED` -> `THERAPIST_ASSIGNED` -> `ON_THE_WAY` -> `IN_PROGRESS` -> `COMPLETED`) or reassign therapist.

---

## 3. Administrative Operations

### `GET /admin/stats`
Live KPI overview: total bookings, today's schedule, completed sessions, real revenue, outstanding COD, and therapist availability.

### `GET /admin/therapists`
Directory of certified male therapists with experience ratings, verification statuses, and current availability toggles.

### `GET /reviews?status=ALL` & `PATCH /reviews`
Fetch and moderate customer reviews (Approve, Reject, or append official ZOVRA response).

### Passphrase Authentication
All admin endpoints require session validation with the master key:
`zovra2026`
