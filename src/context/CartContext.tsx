"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, Service, SelectedAddOn } from "@/lib/types";

interface CartContextType {
  items: CartItem[];
  addItem: (service: Service, durationMinutes: number, selectedAddOns?: SelectedAddOn[]) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  subtotal: number;
  travelCharge: number;
  discount: number;
  couponCode: string;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  totalAmount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string>("");
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("zovra_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
      const savedCoupon = localStorage.getItem("zovra_coupon");
      if (savedCoupon) {
        setCouponCode(savedCoupon);
      }
    } catch {
      // ignore
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem("zovra_cart", JSON.stringify(items));
        if (couponCode) {
          localStorage.setItem("zovra_coupon", couponCode);
        } else {
          localStorage.removeItem("zovra_coupon");
        }
      } catch {
        // ignore
      }
    }
  }, [items, couponCode, isHydrated]);

  const addItem = (service: Service, durationMinutes: number, selectedAddOns: SelectedAddOn[] = []) => {
    const variant = service.durations.find((d) => d.durationMinutes === durationMinutes) || service.durations[0];
    const basePrice = variant ? variant.price : service.basePrice;
    const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
    const totalItemPrice = basePrice + addOnsTotal;

    const cartItemId = `${service.id}-${durationMinutes}-${selectedAddOns.map((a) => a.id).sort().join("-")}`;

    // For home wellness appointments, a single primary booking session per slot is recommended
    // Replace or add item cleanly
    const newItem: CartItem = {
      cartItemId,
      serviceId: service.id,
      serviceName: service.name,
      serviceSlug: service.slug,
      serviceImage: service.image,
      durationMinutes,
      basePrice,
      selectedAddOns,
      totalItemPrice,
      quantity: 1,
    };

    setItems([newItem]); // We maintain single focal booking session to prevent conflicting therapist slots
    setIsCartOpen(true);
  };

  const removeItem = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode("");
  };

  const subtotal = items.reduce((sum, item) => sum + item.totalItemPrice * item.quantity, 0);
  const travelCharge = items.length > 0 ? (subtotal >= 2000 ? 0 : 49) : 0;

  let discount = 0;
  if (couponCode.toUpperCase() === "WELCOME10") {
    discount = Math.round(subtotal * 0.1);
  }

  const totalAmount = Math.max(0, subtotal + travelCharge - discount);

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === "WELCOME10") {
      setCouponCode("WELCOME10");
      return { success: true, message: "10% Welcome discount applied successfully!" };
    }
    return { success: false, message: "Invalid promo code. Try WELCOME10 for 10% off." };
  };

  const removeCoupon = () => {
    setCouponCode("");
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        subtotal,
        travelCharge,
        discount,
        couponCode,
        applyCoupon,
        removeCoupon,
        totalAmount,
        isCartOpen,
        setIsCartOpen,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

