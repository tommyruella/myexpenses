"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { FiHome, FiPlus, FiHeart } from "react-icons/fi";
import { PiCurrencyEurBold } from "react-icons/pi"; // Estetica scontrino/monospace

const menuItems = [
  {
    href: "/",
    label: "Home",
    icon: <FiHome size={26} color="#181818" />,
  },
  {
    href: "/dashboard/pages/health",
    label: "Health",
    icon: <FiHeart size={26} color="#181818" />,
  },
  {
    href: "/dashboard/pages/expenses",
    label: "Spese",
    icon: <PiCurrencyEurBold size={26} color="#181818" />,
  },
  {
    href: null,
    label: "Aggiungi",
    icon: <FiPlus size={30} color="#181818" />,
    onClick: true,
  },
];

export default function FloatingMenu({ onAddClick }: { onAddClick?: () => void }) {
  const router = useRouter();
  // Ordine: Home, Health, Aggiungi, Spese
  const items = [menuItems[0], menuItems[1], menuItems[3], menuItems[2]];

  return (
    <div className="floatingmenu-container">
      <nav className="floatingmenu-root open">
        {items.map((item) =>
          item.onClick ? (
            <button
              key={item.label}
              className="floatingmenu-link"
              aria-label="Aggiungi nuova spesa o entrata"
              onClick={onAddClick}
              type="button"
            >
              {item.icon}
            </button>
          ) : item.href ? (
            <button
              key={item.href}
              className="floatingmenu-link"
              aria-label={item.label}
              onClick={() => router.push(item.href!)}
              type="button"
            >
              {item.icon}
            </button>
          ) : null
        )}
      </nav>
    </div>
  );
}