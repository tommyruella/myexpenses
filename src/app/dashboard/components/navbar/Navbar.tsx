"use client";
import React from "react";
import Link from "next/link";
import { FiLogOut } from "react-icons/fi";

export default function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("authTime");
    window.location.reload();
  };

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 999,
        width: "100%",
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid #eee"
      }}
    >
      <div style={{height: 60, display: "flex", justifyContent: "space-between", flexDirection: "row", padding: "0 20px", alignItems: "center"}}>
        <Link href="/" style={{fontWeight: 700, fontSize: 20, color: "inherit", textDecoration: "none"}}>tommytegamino</Link>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <button 
            onClick={handleLogout}
            style={{
              background: "none",
              border: "none",
              borderRadius: "50%",
              padding: "6px",
              fontSize: "20px",
              cursor: "pointer",
              color: "#666",
              transition: "color 0.2s ease, background 0.2s ease"
            }}
            aria-label="Logout"
            onMouseEnter={e => {
              e.currentTarget.style.background = "#f5f5f5";
              e.currentTarget.style.color = "#fecaca";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "none";
              e.currentTarget.style.color = "#666";
            }}
          >
            <FiLogOut size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}