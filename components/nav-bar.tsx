"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "./logout-button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "My Day" },
  { href: "/recipe", label: "Calculator" },
  { href: "/recipes", label: "My Recipes" },
  { href: "/log", label: "Log Meal" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="w-full border-b border-[#2a1545] bg-[#1a0b2e]/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm transition-colors",
                pathname === link.href
                  ? "bg-[#d946ef]/10 text-[#d946ef] font-medium"
                  : "text-[#94a3b8] hover:text-white hover:bg-[#2a1545]/50"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <LogoutButton />
      </div>
    </nav>
  );
}
