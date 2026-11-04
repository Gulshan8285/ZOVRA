"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CustomerUser, Address } from "@/lib/types";

interface AuthContextType {
  customer: CustomerUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  sendOtp: (phone: string) => Promise<{ success: boolean; message: string; code?: string }>;
  verifyOtp: (phone: string, code: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  updateProfile: (name: string, email: string) => Promise<boolean>;
  saveAddress: (address: Address) => Promise<boolean>;
  deleteAddress: (addressId: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("zovra_user");
      if (savedUser) {
        setCustomer(JSON.parse(savedUser));
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendOtp = async (phone: string) => {
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send OTP";
      return { success: false, message };
    }
  };

  const verifyOtp = async (phone: string, code: string) => {
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();
      if (data.success && data.customer) {
        setCustomer(data.customer);
        localStorage.setItem("zovra_user", JSON.stringify(data.customer));
        return { success: true, message: data.message };
      }
      return { success: false, error: data.error || "Verification failed" };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Verification error";
      return { success: false, error: message };
    }
  };

  const updateProfile = async (name: string, email: string) => {
    if (!customer?.phone) return false;
    try {
      const res = await fetch("/api/customer/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: customer.phone, name, email }),
      });
      const data = await res.json();
      if (data.success && data.customer) {
        setCustomer(data.customer);
        localStorage.setItem("zovra_user", JSON.stringify(data.customer));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const saveAddress = async (address: Address) => {
    if (!customer?.phone) return false;
    try {
      const res = await fetch("/api/customer/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: customer.phone, address }),
      });
      const data = await res.json();
      if (data.success && data.customer) {
        setCustomer(data.customer);
        localStorage.setItem("zovra_user", JSON.stringify(data.customer));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const deleteAddress = async (addressId: string) => {
    if (!customer?.phone) return false;
    try {
      const res = await fetch(`/api/customer/address?phone=${encodeURIComponent(customer.phone)}&addressId=${addressId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success && data.customer) {
        setCustomer(data.customer);
        localStorage.setItem("zovra_user", JSON.stringify(data.customer));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setCustomer(null);
    localStorage.removeItem("zovra_user");
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        isLoggedIn: !!customer,
        isLoading,
        sendOtp,
        verifyOtp,
        updateProfile,
        saveAddress,
        deleteAddress,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

