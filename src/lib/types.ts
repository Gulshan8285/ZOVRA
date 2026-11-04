export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "THERAPIST_ASSIGNED"
  | "ON_THE_WAY"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus = "PENDING_COLLECTION" | "COLLECTED";

export interface ServiceVariant {
  durationMinutes: number;
  price: number;
  originalPrice?: number;
}

export interface ServiceAddOn {
  id: string;
  name: string;
  price: number;
  durationAddMinutes: number;
  description: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  category: "Therapeutic" | "Relaxation" | "Recovery" | "Specialty";
  tag?: string;
  shortDescription: string;
  fullDescription: string;
  basePrice: number;
  rating: number;
  reviewCount: number;
  image: string;
  gallery: string[];
  durations: ServiceVariant[];
  inclusions: string[];
  benefits: string[];
  suitableFor: string[];
  preparation: string[];
  guidelines: string[];
  faqs: { question: string; answer: string }[];
  addOns: ServiceAddOn[];
  isActive: boolean;
  displayOrder: number;
}

export interface Address {
  id?: string;
  fullName: string;
  phone: string;
  email?: string;
  houseNumber: string;
  building: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pinCode: string;
  addressType: "Home" | "Work" | "Other";
  instructions?: string;
  isDefault?: boolean;
}

export interface SelectedAddOn {
  id: string;
  name: string;
  price: number;
  durationAddMinutes: number;
}

export interface CartItem {
  cartItemId: string;
  serviceId: string;
  serviceName: string;
  serviceSlug: string;
  serviceImage: string;
  durationMinutes: number;
  basePrice: number;
  selectedAddOns: SelectedAddOn[];
  totalItemPrice: number;
  quantity: number;
}

export interface Booking {
  id: string; // e.g. ZOV-2026-000108
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceId: string;
  serviceName: string;
  serviceImage: string;
  durationMinutes: number;
  selectedAddOns: SelectedAddOn[];
  appointmentDate: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "03:00 PM"
  address: Address;
  subtotal: number;
  travelCharge: number;
  discount: number;
  couponCode?: string;
  totalAmount: number;
  paymentMethod: "COD";
  paymentStatus: PaymentStatus;
  status: BookingStatus;
  assignedTherapistId?: string;
  assignedTherapistName?: string;
  assignedTherapistPhone?: string;
  cancellationReason?: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Therapist {
  id: string;
  name: string;
  phone: string;
  email: string;
  photo: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  specializations: string[];
  certifications: string[];
  verificationStatus: "VERIFIED" | "PENDING_VERIFICATION";
  isAvailable: boolean;
  activeBookingsCount: number;
}

export interface Review {
  id: string;
  bookingId: string;
  serviceId: string;
  serviceName: string;
  customerName: string;
  customerPhone: string;
  rating: number; // 1 to 5
  serviceQualityRating: number;
  therapistRating: number;
  experienceRating: number;
  comment: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
  verifiedBooking: boolean;
  therapistReply?: string;
  createdAt: string;
}

export interface LocationArea {
  id: string;
  city: string;
  pinCodes: string[];
  travelCharge: number;
  isActive: boolean;
}

export interface SlotConfig {
  id: string;
  workingHoursStart: string; // "09:00"
  workingHoursEnd: string; // "21:00"
  slotIntervalMinutes: number; // 60
  minAdvanceHours: number; // 2
  maxDaysInAdvance: number; // 7
  blockedDates: string[]; // ["2026-11-15"]
}

export interface CustomerUser {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  savedAddresses: Address[];
  createdAt: string;
}

