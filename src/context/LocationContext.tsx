"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ServiceabilityResult {
  serviceable: boolean;
  city?: string;
  travelCharge: number;
  message: string;
}

interface LocationContextType {
  currentPin: string;
  serviceStatus: ServiceabilityResult | null;
  isChecking: boolean;
  checkPin: (pin: string) => Promise<ServiceabilityResult>;
  clearPin: () => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [currentPin, setCurrentPin] = useState<string>("");
  const [serviceStatus, setServiceStatus] = useState<ServiceabilityResult | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedPin = localStorage.getItem("zovra_pin");
      const savedStatus = localStorage.getItem("zovra_pin_status");
      if (savedPin && savedStatus) {
        setCurrentPin(savedPin);
        setServiceStatus(JSON.parse(savedStatus));
      }
    } catch {
      // ignore
    }
  }, []);

  const checkPin = async (pin: string): Promise<ServiceabilityResult> => {
    setIsChecking(true);
    try {
      const cleanPin = pin.trim();
      const res = await fetch(`/api/serviceability?pin=${encodeURIComponent(cleanPin)}`);
      const data = await res.json();
      const result: ServiceabilityResult = {
        serviceable: data.serviceable || false,
        city: data.city,
        travelCharge: data.travelCharge || 0,
        message: data.message || (data.serviceable ? "Serviceable" : "Not serviceable"),
      };

      setCurrentPin(cleanPin);
      setServiceStatus(result);

      if (typeof window !== "undefined") {
        localStorage.setItem("zovra_pin", cleanPin);
        localStorage.setItem("zovra_pin_status", JSON.stringify(result));
      }

      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Network error checking PIN";
      const fallbackResult: ServiceabilityResult = {
        serviceable: false,
        travelCharge: 0,
        message,
      };
      setServiceStatus(fallbackResult);
      return fallbackResult;
    } finally {
      setIsChecking(false);
    }
  };

  const clearPin = () => {
    setCurrentPin("");
    setServiceStatus(null);
    localStorage.removeItem("zovra_pin");
    localStorage.removeItem("zovra_pin_status");
  };

  return (
    <LocationContext.Provider
      value={{
        currentPin,
        serviceStatus,
        isChecking,
        checkPin,
        clearPin,
        isLocationModalOpen,
        setIsLocationModalOpen,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}

