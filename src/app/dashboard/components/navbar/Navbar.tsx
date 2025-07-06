import React from "react";
import Link from "next/link";

export default function Navbar() {
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
        <Link href="/" style={{fontWeight: 900, fontSize: 20, color: "inherit", textDecoration: "none"}}>tommytegamino</Link>
        <div>dashboard</div>
      </div>
    </div>
  );
}