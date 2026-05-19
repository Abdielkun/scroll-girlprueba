"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-8 py-5"
      style={{
        background: "rgba(5,5,8,0.6)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <Link
        href="/"
        className="text-xs tracking-[0.3em] uppercase font-mono iridescent-text cursor-pointer hover:opacity-80 transition-opacity"
      >
        Iridescent
      </Link>
      <div className="flex items-center gap-6">
        <span className="text-xs tracking-widest uppercase font-mono select-none" style={{ color: "var(--muted)" }}>
          Scroll to explore
        </span>
        <div
          className="glass-pill px-3 py-1.5 rounded-full flex items-center gap-2"
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "#34d399" }}
          />
          <span className="text-[10px] font-mono tracking-wider select-none" style={{ color: "var(--muted)" }}>
            LIVE
          </span>
        </div>
      </div>
    </nav>
  );
}
