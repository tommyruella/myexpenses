"use client";
import React from "react";
import Link from "next/link";

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
          <Link href="/dashboard/pages/home" style={{ 
            color: "inherit", 
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: 500,
            transition: "color 0.2s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "#007AFF"}
          onMouseLeave={(e) => e.currentTarget.style.color = "inherit"}
          >
            Expenses
          </Link>
          <Link href="/dashboard/pages/health" style={{ 
            color: "inherit", 
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: 500,
            transition: "color 0.2s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "#007AFF"}
          onMouseLeave={(e) => e.currentTarget.style.color = "inherit"}
          >
            Health
          </Link>
          <button 
            onClick={handleLogout}
            style={{
              background: "none",
              border: "1px solid #ccc",
              borderRadius: "6px",
              padding: "6px 12px",
              fontSize: "12px",
              cursor: "pointer",
              color: "#666",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f5f5f5";
              e.currentTarget.style.color = "#333";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "none";
              e.currentTarget.style.color = "#666";
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}