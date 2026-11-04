import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { LocationProvider } from "@/context/LocationContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import LocationModal from "@/components/LocationModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZOVRA – Premium Men's Wellness & Massage at Home | Relax. Recharge. Rejuvenate.",
  description:
    "Book verified, certified male massage therapists in the privacy of your home. Deep Tissue, Swedish Relaxation, Sports Recovery, Balinese & Back Pain Therapy in Delhi NCR, Mumbai, Bengaluru, and Hyderabad. 100% Cash on Delivery.",
  keywords: [
    "Men's massage at home",
    "Male massage therapist Delhi NCR",
    "Male massage therapist Mumbai",
    "Male massage therapist Bangalore",
    "Deep tissue massage at home for men",
    "Urban company massage alternative",
    "Sports recovery massage home",
    "ZOVRA wellness",
  ],
  openGraph: {
    title: "ZOVRA – Premium Men's Home Massage Booking",
    description: "Relax. Recharge. Rejuvenate. Certified male therapists, portable spa beds, and Cash on Delivery.",
    siteName: "ZOVRA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-white text-zovra-black`}>
        <AuthProvider>
          <CartProvider>
            <LocationProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <CartDrawer />
              <LocationModal />
            </LocationProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
