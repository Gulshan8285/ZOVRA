import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  inverted?: boolean;
}

export default function Logo({ className = "", size = "md", inverted = false }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg tracking-[0.2em]",
    md: "text-2xl tracking-[0.25em]",
    lg: "text-3xl tracking-[0.3em]",
  };

  const textColor = inverted ? "text-white" : "text-zovra-black";

  return (
    <Link href="/" className={`inline-flex items-center gap-1.5 group font-bold select-none ${className}`}>
      <span className={`font-black font-sans uppercase transition-opacity group-hover:opacity-80 ${sizeClasses[size]} ${textColor}`}>
        ZOVRA
      </span>
      <span className="w-1.5 h-1.5 rounded-full bg-zovra-deepBlue inline-block mb-1 group-hover:scale-125 transition-transform"></span>
    </Link>
  );
}

