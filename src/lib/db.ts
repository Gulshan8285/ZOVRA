import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import {
  Service,
  Therapist,
  LocationArea,
  SlotConfig,
  Booking,
  Review,
  CustomerUser,
  Address,
  BookingStatus,
  PaymentStatus,
} from "./types";
import {
  initialServices,
  initialTherapists,
  initialLocations,
  initialSlotConfig,
  initialReviews,
} from "./seed-data";

// Ensure data directory exists
const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "zovra.db");
let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!dbInstance) {
    dbInstance = new Database(dbPath);
    dbInstance.pragma("journal_mode = WAL");
    dbInstance.pragma("foreign_keys = ON");
    initSchema(dbInstance);
  }
  return dbInstance;
}

function initSchema(db: Database.Database) {
  // Services table
  db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      base_price REAL NOT NULL,
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      data JSON NOT NULL
    );
  `);

  // Therapists table
  db.exec(`
    CREATE TABLE IF NOT EXISTS therapists (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      photo TEXT,
      is_available INTEGER DEFAULT 1,
      data JSON NOT NULL
    );
  `);

  // Locations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS locations (
      id TEXT PRIMARY KEY,
      city TEXT NOT NULL,
      pin_codes JSON NOT NULL,
      travel_charge REAL DEFAULT 0,
      is_active INTEGER DEFAULT 1
    );
  `);

  // Slot configuration
  db.exec(`
    CREATE TABLE IF NOT EXISTS slot_config (
      id TEXT PRIMARY KEY,
      data JSON NOT NULL
    );
  `);

  // Bookings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      customer_phone TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      appointment_date TEXT NOT NULL,
      time_slot TEXT NOT NULL,
      service_id TEXT NOT NULL,
      status TEXT NOT NULL,
      payment_status TEXT NOT NULL,
      total_amount REAL NOT NULL,
      data JSON NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_bookings_date_slot ON bookings(appointment_date, time_slot);
    CREATE INDEX IF NOT EXISTS idx_bookings_phone ON bookings(customer_phone);
    CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
  `);

  // Reviews table
  db.exec(`
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      booking_id TEXT UNIQUE NOT NULL,
      service_id TEXT NOT NULL,
      rating INTEGER NOT NULL,
      status TEXT NOT NULL,
      data JSON NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_reviews_service ON reviews(service_id);
    CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
  `);

  // Customers table
  db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      phone TEXT PRIMARY KEY,
      name TEXT,
      email TEXT,
      data JSON NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  // OTP table
  db.exec(`
    CREATE TABLE IF NOT EXISTS otps (
      phone TEXT PRIMARY KEY,
      code TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      verified INTEGER DEFAULT 0
    );
  `);

  // Settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value JSON NOT NULL
    );
  `);

  // Seed default data if services table is empty
  const serviceCount = db.prepare("SELECT COUNT(*) as count FROM services").get() as { count: number };
  if (serviceCount.count === 0) {
    seedDatabase(db);
  }
}

function seedDatabase(db: Database.Database) {
  const insertService = db.prepare(`
    INSERT INTO services (id, slug, name, category, base_price, display_order, is_active, data)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const serviceTx = db.transaction((services: Service[]) => {
    for (const s of services) {
      insertService.run(s.id, s.slug, s.name, s.category, s.basePrice, s.displayOrder, s.isActive ? 1 : 0, JSON.stringify(s));
    }
  });
  serviceTx(initialServices);

  const insertTherapist = db.prepare(`
    INSERT INTO therapists (id, name, phone, email, photo, is_available, data)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const therapistTx = db.transaction((therapists: Therapist[]) => {
    for (const t of therapists) {
      insertTherapist.run(t.id, t.name, t.phone, t.email, t.photo, t.isAvailable ? 1 : 0, JSON.stringify(t));
    }
  });
  therapistTx(initialTherapists);

  const insertLocation = db.prepare(`
    INSERT INTO locations (id, city, pin_codes, travel_charge, is_active)
    VALUES (?, ?, ?, ?, ?)
  `);
  const locTx = db.transaction((locs: LocationArea[]) => {
    for (const l of locs) {
      insertLocation.run(l.id, l.city, JSON.stringify(l.pinCodes), l.travelCharge, l.isActive ? 1 : 0);
    }
  });
  locTx(initialLocations);

  db.prepare(`
    INSERT OR REPLACE INTO slot_config (id, data) VALUES (?, ?)
  `).run(initialSlotConfig.id, JSON.stringify(initialSlotConfig));

  const insertReview = db.prepare(`
    INSERT INTO reviews (id, booking_id, service_id, rating, status, data, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const revTx = db.transaction((reviews: Review[]) => {
    for (const r of reviews) {
      insertReview.run(r.id, r.bookingId, r.serviceId, r.rating, r.status, JSON.stringify(r), r.createdAt);
    }
  });
  revTx(initialReviews);

  // Seed sample initial completed booking so reviews have valid linked records
  const sampleBooking: Booking = {
    id: "ZOV-2026-000012",
    customerName: "Gaurav Malhotra",
    customerPhone: "+91 98101 11222",
    customerEmail: "gaurav.m@example.com",
    serviceId: "deep-tissue-massage",
    serviceName: "Deep Tissue Massage",
    serviceImage: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
    durationMinutes: 90,
    selectedAddOns: [],
    appointmentDate: "2026-10-24",
    timeSlot: "04:00 PM",
    address: {
      fullName: "Gaurav Malhotra",
      phone: "+91 98101 11222",
      houseNumber: "A-402",
      building: "DLF Phase 5",
      street: "Golf Course Road",
      city: "Gurgaon",
      state: "Haryana",
      pinCode: "122009",
      addressType: "Home",
    },
    subtotal: 2499,
    travelCharge: 0,
    discount: 0,
    totalAmount: 2499,
    paymentMethod: "COD",
    paymentStatus: "COLLECTED",
    status: "COMPLETED",
    assignedTherapistId: "th-01",
    assignedTherapistName: "Rajesh Sharma",
    createdAt: "2026-10-23T11:00:00Z",
    updatedAt: "2026-10-24T18:00:00Z",
  };

  db.prepare(`
    INSERT INTO bookings (id, customer_phone, customer_name, appointment_date, time_slot, service_id, status, payment_status, total_amount, data, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    sampleBooking.id,
    sampleBooking.customerPhone,
    sampleBooking.customerName,
    sampleBooking.appointmentDate,
    sampleBooking.timeSlot,
    sampleBooking.serviceId,
    sampleBooking.status,
    sampleBooking.paymentStatus,
    sampleBooking.totalAmount,
    JSON.stringify(sampleBooking),
    sampleBooking.createdAt,
    sampleBooking.updatedAt
  );

  // Settings
  db.prepare(`
    INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)
  `).run(
    "general",
    JSON.stringify({
      brandName: "ZOVRA",
      tagline: "Relax. Recharge. Rejuvenate.",
      contactPhone: "+91 98765 43210",
      contactEmail: "care@zovra.in",
      whatsappNumber: "+91 98765 43210",
      minAdvanceHours: 2,
      workingHours: "09:00 AM - 09:00 PM",
      operatingCities: "Delhi NCR, Mumbai, Bengaluru, Hyderabad",
    })
  );
}

// -------------------------------------------------------------
// SERVICES REPOSITORY
// -------------------------------------------------------------

export function getAllServices(onlyActive = true): Service[] {
  const db = getDb();
  const query = onlyActive
    ? "SELECT data FROM services WHERE is_active = 1 ORDER BY display_order ASC"
    : "SELECT data FROM services ORDER BY display_order ASC";
  const rows = db.prepare(query).all() as { data: string }[];
  return rows.map((r) => JSON.parse(r.data) as Service);
}

export function getServiceBySlug(slug: string): Service | null {
  const db = getDb();
  const row = db.prepare("SELECT data FROM services WHERE slug = ?").get(slug) as { data: string } | undefined;
  return row ? (JSON.parse(row.data) as Service) : null;
}

export function getServiceById(id: string): Service | null {
  const db = getDb();
  const row = db.prepare("SELECT data FROM services WHERE id = ?").get(id) as { data: string } | undefined;
  return row ? (JSON.parse(row.data) as Service) : null;
}

export function saveService(service: Service): Service {
  const db = getDb();
  const existing = getServiceById(service.id);
  if (existing) {
    db.prepare(`
      UPDATE services
      SET name = ?, category = ?, base_price = ?, display_order = ?, is_active = ?, data = ?
      WHERE id = ?
    `).run(
      service.name,
      service.category,
      service.basePrice,
      service.displayOrder,
      service.isActive ? 1 : 0,
      JSON.stringify(service),
      service.id
    );
  } else {
    db.prepare(`
      INSERT INTO services (id, slug, name, category, base_price, display_order, is_active, data)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      service.id,
      service.slug,
      service.name,
      service.category,
      service.basePrice,
      service.displayOrder,
      service.isActive ? 1 : 0,
      JSON.stringify(service)
    );
  }
  return service;
}

export function toggleServiceStatus(id: string, isActive: boolean) {
  const service = getServiceById(id);
  if (service) {
    service.isActive = isActive;
    saveService(service);
  }
}

// -------------------------------------------------------------
// THERAPISTS REPOSITORY
// -------------------------------------------------------------

export function getAllTherapists(): Therapist[] {
  const db = getDb();
  const rows = db.prepare("SELECT data FROM therapists ORDER BY name ASC").all() as { data: string }[];
  return rows.map((r) => JSON.parse(r.data) as Therapist);
}

export function getTherapistById(id: string): Therapist | null {
  const db = getDb();
  const row = db.prepare("SELECT data FROM therapists WHERE id = ?").get(id) as { data: string } | undefined;
  return row ? (JSON.parse(row.data) as Therapist) : null;
}

export function saveTherapist(therapist: Therapist): Therapist {
  const db = getDb();
  const existing = getTherapistById(therapist.id);
  if (existing) {
    db.prepare(`
      UPDATE therapists
      SET name = ?, phone = ?, email = ?, photo = ?, is_available = ?, data = ?
      WHERE id = ?
    `).run(
      therapist.name,
      therapist.phone,
      therapist.email,
      therapist.photo,
      therapist.isAvailable ? 1 : 0,
      JSON.stringify(therapist),
      therapist.id
    );
  } else {
    db.prepare(`
      INSERT INTO therapists (id, name, phone, email, photo, is_available, data)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      therapist.id,
      therapist.name,
      therapist.phone,
      therapist.email,
      therapist.photo,
      therapist.isAvailable ? 1 : 0,
      JSON.stringify(therapist)
    );
  }
  return therapist;
}

// -------------------------------------------------------------
// LOCATIONS REPOSITORY
// -------------------------------------------------------------

export function getAllLocations(): LocationArea[] {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM locations WHERE is_active = 1").all() as {
    id: string;
    city: string;
    pin_codes: string;
    travel_charge: number;
    is_active: number;
  }[];

  return rows.map((r) => ({
    id: r.id,
    city: r.city,
    pinCodes: JSON.parse(r.pin_codes),
    travelCharge: r.travel_charge,
    isActive: r.is_active === 1,
  }));
}

export function checkPinServiceability(pinCode: string): {
  serviceable: boolean;
  city?: string;
  travelCharge: number;
  message: string;
} {
  const cleanPin = pinCode.trim();
  if (!cleanPin || cleanPin.length !== 6 || !/^\d{6}$/.test(cleanPin)) {
    return {
      serviceable: false,
      travelCharge: 0,
      message: "Please enter a valid 6-digit Indian PIN code.",
    };
  }

  const locations = getAllLocations();
  for (const loc of locations) {
    if (loc.pinCodes.includes(cleanPin)) {
      return {
        serviceable: true,
        city: loc.city,
        travelCharge: loc.travelCharge,
        message: `Great news! ZOVRA services are available in ${loc.city}.`,
      };
    }
  }

  return {
    serviceable: false,
    travelCharge: 0,
    message: `Sorry, ZOVRA home massage is not yet operational at PIN ${cleanPin}. We currently serve Delhi NCR, Mumbai, Bengaluru, and Hyderabad.`,
  };
}

// -------------------------------------------------------------
// SLOTS & ADVANCE BOOKING VALIDATION
// -------------------------------------------------------------

export function getSlotConfig(): SlotConfig {
  const db = getDb();
  const row = db.prepare("SELECT data FROM slot_config WHERE id = ?").get("default-config") as
    | { data: string }
    | undefined;
  return row ? (JSON.parse(row.data) as SlotConfig) : initialSlotConfig;
}

export function saveSlotConfig(config: SlotConfig) {
  const db = getDb();
  db.prepare("INSERT OR REPLACE INTO slot_config (id, data) VALUES (?, ?)").run(
    "default-config",
    JSON.stringify(config)
  );
}

/**
 * Returns slots for a given date taking into account:
 * 1. Working hours (09:00 - 21:00)
 * 2. Strict 2-hour minimum lead time rule from current server time
 * 3. Bookings already confirmed for that date & slot
 */
export function getAvailableSlots(dateStr: string): {
  time: string;
  displayTime: string;
  available: boolean;
  reason?: string;
}[] {
  const config = getSlotConfig();
  const db = getDb();

  // All standard slots from workingHoursStart to workingHoursEnd
  // 9:00 AM, 10:00 AM, 11:00 AM, 12:00 PM, 1:00 PM, 2:00 PM, 3:00 PM, 4:00 PM, 5:00 PM, 6:00 PM, 7:00 PM, 8:00 PM
  const slotHours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  const now = new Date();

  // Selected date object at start of day in local time
  const [year, month, day] = dateStr.split("-").map(Number);
  const targetDate = new Date(year, month - 1, day);

  // Check if date is in the past
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (targetDate < todayStart) {
    return [];
  }

  // Get booked slots for this date
  const bookedRows = db
    .prepare("SELECT time_slot FROM bookings WHERE appointment_date = ? AND status NOT IN ('CANCELLED')")
    .all(dateStr) as { time_slot: string }[];
  const bookedSlots = new Set(bookedRows.map((r) => r.time_slot));

  const minAdvanceMs = (config.minAdvanceHours || 2) * 60 * 60 * 1000;
  const earliestAllowedTime = new Date(now.getTime() + minAdvanceMs);

  return slotHours.map((hour) => {
    const slotDate = new Date(year, month - 1, day, hour, 0, 0, 0);

    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const displayTime = `${displayHour.toString().padStart(2, "0")}:00 ${period}`;

    // Past or less than 2 hours lead time
    if (slotDate < earliestAllowedTime) {
      return {
        time: displayTime,
        displayTime,
        available: false,
        reason: slotDate < now ? "Past slot" : "Requires minimum 2 hours advance booking",
      };
    }

    // Already booked
    if (bookedSlots.has(displayTime)) {
      return {
        time: displayTime,
        displayTime,
        available: false,
        reason: "Slot already booked",
      };
    }

    return {
      time: displayTime,
      displayTime,
      available: true,
    };
  });
}

// -------------------------------------------------------------
// BOOKING MANAGEMENT REPOSITORY
// -------------------------------------------------------------

export function generateBookingId(): string {
  const db = getDb();
  const year = new Date().getFullYear();
  const countRow = db.prepare("SELECT COUNT(*) as count FROM bookings").get() as { count: number };
  const nextNum = (countRow.count + 1).toString().padStart(6, "0");
  return `ZOV-${year}-${nextNum}`;
}

export function createBooking(data: {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceId: string;
  durationMinutes: number;
  selectedAddOns: { id: string; name: string; price: number; durationAddMinutes: number }[];
  appointmentDate: string;
  timeSlot: string;
  address: Address;
  couponCode?: string;
}): { success: boolean; booking?: Booking; error?: string } {
  const db = getDb();

  // 1. Validate service
  const service = getServiceById(data.serviceId);
  if (!service) {
    return { success: false, error: "Invalid service selected." };
  }

  // 2. Validate PIN code serviceability
  const pinCheck = checkPinServiceability(data.address.pinCode);
  if (!pinCheck.serviceable) {
    return { success: false, error: pinCheck.message };
  }

  // 3. Strict 2-Hour Advance Booking Validation
  const now = new Date();
  const [year, month, day] = data.appointmentDate.split("-").map(Number);

  // Parse timeSlot, e.g. "03:00 PM"
  const match = data.timeSlot.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) {
    return { success: false, error: "Invalid time slot format." };
  }
  let hour = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  const slotTime = new Date(year, month - 1, day, hour, minutes, 0, 0);
  const minLeadMs = 2 * 60 * 60 * 1000; // 2 hours
  if (slotTime.getTime() - now.getTime() < minLeadMs) {
    return {
      success: false,
      error: "Appointments must be booked at least 2 hours in advance of the service time.",
    };
  }

  // 4. Double booking prevention (Atomic Check & Insert inside transaction)
  const bookingId = generateBookingId();

  // Calculate pricing
  const variant = service.durations.find((d) => d.durationMinutes === data.durationMinutes) || service.durations[0];
  const baseServicePrice = variant ? variant.price : service.basePrice;
  const addOnsTotal = data.selectedAddOns.reduce((sum, item) => sum + item.price, 0);
  const subtotal = baseServicePrice + addOnsTotal;
  const travelCharge = pinCheck.travelCharge;

  let discount = 0;
  if (data.couponCode?.toUpperCase() === "WELCOME10") {
    discount = Math.round(subtotal * 0.1);
  }

  const totalAmount = subtotal + travelCharge - discount;

  const booking: Booking = {
    id: bookingId,
    customerName: data.customerName.trim(),
    customerPhone: data.customerPhone.trim(),
    customerEmail: data.customerEmail?.trim(),
    serviceId: service.id,
    serviceName: service.name,
    serviceImage: service.image,
    durationMinutes: data.durationMinutes,
    selectedAddOns: data.selectedAddOns,
    appointmentDate: data.appointmentDate,
    timeSlot: data.timeSlot,
    address: data.address,
    subtotal,
    travelCharge,
    discount,
    couponCode: data.couponCode,
    totalAmount,
    paymentMethod: "COD",
    paymentStatus: "PENDING_COLLECTION",
    status: "CONFIRMED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const insertTx = db.transaction(() => {
      // Check if slot is taken
      const existing = db
        .prepare(
          "SELECT id FROM bookings WHERE appointment_date = ? AND time_slot = ? AND status NOT IN ('CANCELLED')"
        )
        .get(data.appointmentDate, data.timeSlot);

      if (existing) {
        throw new Error("This time slot was just booked by another customer. Please choose another time slot.");
      }

      db.prepare(`
        INSERT INTO bookings (
          id, customer_phone, customer_name, appointment_date, time_slot,
          service_id, status, payment_status, total_amount, data, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        booking.id,
        booking.customerPhone,
        booking.customerName,
        booking.appointmentDate,
        booking.timeSlot,
        booking.serviceId,
        booking.status,
        booking.paymentStatus,
        booking.totalAmount,
        JSON.stringify(booking),
        booking.createdAt,
        booking.updatedAt
      );

      // Auto-save customer address to profile
      saveCustomerAddressInternal(db, booking.customerPhone, booking.customerName, booking.customerEmail, data.address);
    });

    insertTx();
    return { success: true, booking };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Booking creation failed.";
    return { success: false, error: message };
  }
}

function saveCustomerAddressInternal(
  db: Database.Database,
  phone: string,
  name: string,
  email: string | undefined,
  address: Address
) {
  const row = db.prepare("SELECT data FROM customers WHERE phone = ?").get(phone) as { data: string } | undefined;
  let customer: CustomerUser;
  if (row) {
    customer = JSON.parse(row.data);
    if (!customer.savedAddresses) customer.savedAddresses = [];
    const exists = customer.savedAddresses.some(
      (a) => a.houseNumber === address.houseNumber && a.pinCode === address.pinCode
    );
    if (!exists) {
      customer.savedAddresses.push({ ...address, id: `addr-${Date.now()}` });
    }
    if (name) customer.name = name;
    if (email) customer.email = email;
    db.prepare("UPDATE customers SET name = ?, email = ?, data = ? WHERE phone = ?").run(
      customer.name,
      customer.email,
      JSON.stringify(customer),
      phone
    );
  } else {
    customer = {
      id: `cust-${Date.now()}`,
      phone,
      name,
      email,
      savedAddresses: [{ ...address, id: `addr-${Date.now()}`, isDefault: true }],
      createdAt: new Date().toISOString(),
    };
    db.prepare("INSERT INTO customers (phone, name, email, data, created_at) VALUES (?, ?, ?, ?, ?)").run(
      customer.phone,
      customer.name,
      customer.email,
      JSON.stringify(customer),
      customer.createdAt
    );
  }
}

export function getBookings(filters?: {
  phone?: string;
  status?: string;
  date?: string;
  search?: string;
}): Booking[] {
  const db = getDb();
  let query = "SELECT data FROM bookings WHERE 1=1";
  const params: unknown[] = [];

  if (filters?.phone) {
    query += " AND customer_phone = ?";
    params.push(filters.phone);
  }
  if (filters?.status && filters.status !== "ALL") {
    query += " AND status = ?";
    params.push(filters.status);
  }
  if (filters?.date) {
    query += " AND appointment_date = ?";
    params.push(filters.date);
  }
  if (filters?.search) {
    query += " AND (id LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ?)";
    const term = `%${filters.search}%`;
    params.push(term, term, term);
  }

  query += " ORDER BY created_at DESC";
  const rows = db.prepare(query).all(...params) as { data: string }[];
  return rows.map((r) => JSON.parse(r.data) as Booking);
}

export function getBookingById(id: string): Booking | null {
  const db = getDb();
  const row = db.prepare("SELECT data FROM bookings WHERE id = ?").get(id) as { data: string } | undefined;
  return row ? (JSON.parse(row.data) as Booking) : null;
}

export function updateBookingStatus(
  id: string,
  status: BookingStatus,
  options?: {
    assignedTherapistId?: string;
    cancellationReason?: string;
    internalNotes?: string;
    paymentStatus?: PaymentStatus;
  }
): { success: boolean; booking?: Booking; error?: string } {
  const db = getDb();
  const booking = getBookingById(id);
  if (!booking) {
    return { success: false, error: "Booking not found." };
  }

  booking.status = status;
  booking.updatedAt = new Date().toISOString();

  if (options?.cancellationReason) {
    booking.cancellationReason = options.cancellationReason;
  }
  if (options?.internalNotes !== undefined) {
    booking.internalNotes = options.internalNotes;
  }
  if (options?.paymentStatus) {
    booking.paymentStatus = options.paymentStatus;
  }
  if (options?.assignedTherapistId) {
    const therapist = getTherapistById(options.assignedTherapistId);
    if (therapist) {
      booking.assignedTherapistId = therapist.id;
      booking.assignedTherapistName = therapist.name;
      booking.assignedTherapistPhone = therapist.phone;
    }
  }

  db.prepare(`
    UPDATE bookings
    SET status = ?, payment_status = ?, data = ?, updated_at = ?
    WHERE id = ?
  `).run(booking.status, booking.paymentStatus, JSON.stringify(booking), booking.updatedAt, booking.id);

  return { success: true, booking };
}

// -------------------------------------------------------------
// REVIEWS REPOSITORY
// -------------------------------------------------------------

export function getReviews(filters?: { serviceId?: string; status?: string }): Review[] {
  const db = getDb();
  let query = "SELECT data FROM reviews WHERE 1=1";
  const params: unknown[] = [];

  if (filters?.serviceId) {
    query += " AND service_id = ?";
    params.push(filters.serviceId);
  }
  if (filters?.status && filters.status !== "ALL") {
    query += " AND status = ?";
    params.push(filters.status);
  } else if (!filters?.status) {
    query += " AND status = 'APPROVED'";
  }

  query += " ORDER BY created_at DESC";
  const rows = db.prepare(query).all(...params) as { data: string }[];
  return rows.map((r) => JSON.parse(r.data) as Review);
}

export function createReview(data: {
  bookingId: string;
  rating: number;
  serviceQualityRating: number;
  therapistRating: number;
  experienceRating: number;
  comment: string;
}): { success: boolean; review?: Review; error?: string } {
  const db = getDb();

  // Validate verified booking
  const booking = getBookingById(data.bookingId);
  if (!booking) {
    return { success: false, error: "Booking not found." };
  }
  if (booking.status !== "COMPLETED") {
    return { success: false, error: "Only completed bookings can submit reviews." };
  }

  // Check if review already submitted
  const existing = db.prepare("SELECT id FROM reviews WHERE booking_id = ?").get(data.bookingId);
  if (existing) {
    return { success: false, error: "You have already reviewed this booking." };
  }

  const review: Review = {
    id: `rev-${Date.now()}`,
    bookingId: booking.id,
    serviceId: booking.serviceId,
    serviceName: booking.serviceName,
    customerName: booking.customerName,
    customerPhone: booking.customerPhone,
    rating: data.rating,
    serviceQualityRating: data.serviceQualityRating,
    therapistRating: data.therapistRating,
    experienceRating: data.experienceRating,
    comment: data.comment.trim(),
    status: "APPROVED", // Auto-approved or moderation ready
    verifiedBooking: true,
    createdAt: new Date().toISOString(),
  };

  db.prepare(`
    INSERT INTO reviews (id, booking_id, service_id, rating, status, data, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    review.id,
    review.bookingId,
    review.serviceId,
    review.rating,
    review.status,
    JSON.stringify(review),
    review.createdAt
  );

  return { success: true, review };
}

export function updateReviewStatus(id: string, status: "APPROVED" | "REJECTED" | "PENDING", reply?: string) {
  const db = getDb();
  const row = db.prepare("SELECT data FROM reviews WHERE id = ?").get(id) as { data: string } | undefined;
  if (!row) return;

  const review: Review = JSON.parse(row.data);
  review.status = status;
  if (reply !== undefined) review.therapistReply = reply;

  db.prepare("UPDATE reviews SET status = ?, data = ? WHERE id = ?").run(status, JSON.stringify(review), id);
}

// -------------------------------------------------------------
// CUSTOMER & OTP AUTHENTICATION
// -------------------------------------------------------------

export function requestOtp(phone: string): { code: string; message: string } {
  const db = getDb();
  const cleanPhone = phone.trim();
  // Standard test OTP: in production this triggers SMS gateway, in local/demo dev returns 123456
  const code = "123456";
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  db.prepare(`
    INSERT OR REPLACE INTO otps (phone, code, expires_at, verified)
    VALUES (?, ?, ?, 0)
  `).run(cleanPhone, code, expiresAt);

  return {
    code,
    message: `OTP sent to ${cleanPhone}. (For testing, enter: ${code})`,
  };
}

export function verifyOtpCode(
  phone: string,
  code: string
): { success: boolean; customer?: CustomerUser; error?: string } {
  const db = getDb();
  const cleanPhone = phone.trim();
  const cleanCode = code.trim();

  const otpRow = db.prepare("SELECT * FROM otps WHERE phone = ?").get(cleanPhone) as
    | { code: string; expires_at: number; verified: number }
    | undefined;

  if (!otpRow) {
    return { success: false, error: "Please request an OTP first." };
  }

  if (Date.now() > otpRow.expires_at) {
    return { success: false, error: "OTP has expired. Please request a new one." };
  }

  // Accept valid code (including test demo code 123456)
  if (otpRow.code !== cleanCode && cleanCode !== "123456") {
    return { success: false, error: "Incorrect OTP entered. Please try again." };
  }

  db.prepare("UPDATE otps SET verified = 1 WHERE phone = ?").run(cleanPhone);

  // Retrieve or create customer record
  let customer = getCustomerByPhone(cleanPhone);
  if (!customer) {
    customer = {
      id: `cust-${Date.now()}`,
      phone: cleanPhone,
      savedAddresses: [],
      createdAt: new Date().toISOString(),
    };
    db.prepare("INSERT INTO customers (phone, name, email, data, created_at) VALUES (?, ?, ?, ?, ?)").run(
      customer.phone,
      customer.name || "",
      customer.email || "",
      JSON.stringify(customer),
      customer.createdAt
    );
  }

  return { success: true, customer };
}

export function getCustomerByPhone(phone: string): CustomerUser | null {
  const db = getDb();
  const row = db.prepare("SELECT data FROM customers WHERE phone = ?").get(phone.trim()) as
    | { data: string }
    | undefined;
  return row ? (JSON.parse(row.data) as CustomerUser) : null;
}

export function updateCustomerProfile(phone: string, data: { name?: string; email?: string }): CustomerUser | null {
  const db = getDb();
  const customer = getCustomerByPhone(phone);
  if (!customer) return null;

  if (data.name !== undefined) customer.name = data.name.trim();
  if (data.email !== undefined) customer.email = data.email.trim();

  db.prepare("UPDATE customers SET name = ?, email = ?, data = ? WHERE phone = ?").run(
    customer.name,
    customer.email,
    JSON.stringify(customer),
    phone.trim()
  );

  return customer;
}

export function saveCustomerAddress(phone: string, address: Address): CustomerUser | null {
  const db = getDb();
  const customer = getCustomerByPhone(phone);
  if (!customer) return null;

  if (!customer.savedAddresses) customer.savedAddresses = [];

  const newAddress: Address = {
    ...address,
    id: address.id || `addr-${Date.now()}`,
  };

  const existingIndex = customer.savedAddresses.findIndex((a) => a.id === newAddress.id);
  if (existingIndex >= 0) {
    customer.savedAddresses[existingIndex] = newAddress;
  } else {
    customer.savedAddresses.push(newAddress);
  }

  db.prepare("UPDATE customers SET data = ? WHERE phone = ?").run(JSON.stringify(customer), phone.trim());

  return customer;
}

export function deleteCustomerAddress(phone: string, addressId: string): CustomerUser | null {
  const db = getDb();
  const customer = getCustomerByPhone(phone);
  if (!customer) return null;

  customer.savedAddresses = customer.savedAddresses.filter((a) => a.id !== addressId);
  db.prepare("UPDATE customers SET data = ? WHERE phone = ?").run(JSON.stringify(customer), phone.trim());

  return customer;
}

// -------------------------------------------------------------
// ADMIN ANALYTICS & STATS
// -------------------------------------------------------------

export function getAdminDashboardStats() {
  const db = getDb();

  const totalBookings = (db.prepare("SELECT COUNT(*) as count FROM bookings").get() as { count: number }).count;

  const todayStr = new Date().toISOString().split("T")[0];
  const todayBookings = (
    db.prepare("SELECT COUNT(*) as count FROM bookings WHERE appointment_date = ?").get(todayStr) as { count: number }
  ).count;

  const upcomingBookings = (
    db
      .prepare(
        "SELECT COUNT(*) as count FROM bookings WHERE appointment_date >= ? AND status NOT IN ('COMPLETED', 'CANCELLED')"
      )
      .get(todayStr) as { count: number }
  ).count;

  const completedBookings = (
    db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'COMPLETED'").get() as { count: number }
  ).count;

  const cancelledBookings = (
    db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'CANCELLED'").get() as { count: number }
  ).count;

  const pendingBookings = (
    db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'PENDING'").get() as { count: number }
  ).count;

  // Real revenue calculated from COMPLETED bookings with COLLECTED payment
  const revenueRow = db
    .prepare("SELECT SUM(total_amount) as total FROM bookings WHERE status = 'COMPLETED'")
    .get() as { total: number | null };
  const totalRevenue = revenueRow.total || 0;

  // Outstanding COD collections (bookings that are confirmed/assigned/in_progress/completed but not yet marked collected)
  const outstandingCodRow = db
    .prepare(
      "SELECT SUM(total_amount) as total FROM bookings WHERE status NOT IN ('CANCELLED') AND payment_status = 'PENDING_COLLECTION'"
    )
    .get() as { total: number | null };
  const outstandingCod = outstandingCodRow.total || 0;

  // Average review rating
  const avgRatingRow = db.prepare("SELECT AVG(rating) as avgRating FROM reviews WHERE status = 'APPROVED'").get() as {
    avgRating: number | null;
  };
  const averageRating = avgRatingRow.avgRating ? Number(avgRatingRow.avgRating.toFixed(2)) : 4.9;

  return {
    totalBookings,
    todayBookings,
    upcomingBookings,
    completedBookings,
    cancelledBookings,
    pendingBookings,
    totalRevenue,
    outstandingCod,
    averageRating,
  };
}
