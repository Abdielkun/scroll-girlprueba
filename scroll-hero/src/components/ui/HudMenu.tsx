"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface SectionItem {
  id: string;
  name: string;
  shortName: string;
  color: string;
}

const SECTIONS: SectionItem[] = [
  { id: "akari", name: "Akari Watanabe", shortName: "AKARI", color: "var(--accent, #a78bfa)" },
  { id: "mahiru", name: "Mahiru Shiina", shortName: "MAHIRU", color: "var(--accent-blue, #38bdf8)" },
  { id: "ghostfreak", name: "Ghostfreak", shortName: "GHOST", color: "#cbd5e1" },
  { id: "karane", name: "Karane Inda", shortName: "KARANE", color: "#f43f5e" },
  { id: "shizuka1", name: "Shizuka Yoshimoto I", shortName: "SHIZUKA I", color: "#fb7185" },
  { id: "shizuka2", name: "Shizuka Yoshimoto II", shortName: "SHIZUKA II", color: "#6366f1" },
];

export default function HudMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const currentPathId = pathname.replace(/^\//, "");
  const [activeSection, setActiveSection] = useState<string>(currentPathId || "akari");

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection(pathname.replace(/^\//, ""));
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: "-45% 0px -45% 0px", // Trigger when the section occupies the center of the screen
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  const handleScrollTo = (id: string) => {
    if (pathname === "/") {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    // Navigate to character page
    router.push(`/${id}`);
  };

  return (
    <>
      <div className="fixed right-6 md:right-8 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col items-center">
        {/* HUD label at top of the menu */}
        <span className="text-[8px] tracking-[0.3em] font-mono mb-4 rotate-90 translate-y-3 opacity-30 select-none pointer-events-none">
          SYSTEM.HUD.V1
        </span>

        {/* The glass pillar container */}
        <div 
          className="flex flex-col gap-5 py-6 px-3 rounded-full border border-[rgba(255,255,255,0.06)] relative"
          style={{
            background: "rgba(5, 5, 8, 0.4)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.05)",
          }}
        >
          {SECTIONS.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => handleScrollTo(section.id)}
                className="group relative flex items-center justify-center w-7 h-7 rounded-full focus:outline-none transition-all duration-300"
                aria-label={`Scroll to ${section.name}`}
              >
                {/* Outer pulsing ring for active section */}
                {isActive && (
                  <span 
                    className="absolute inset-0 rounded-full border opacity-60 animate-ping"
                    style={{ 
                      borderColor: section.color,
                      animationDuration: "3s"
                    }}
                  />
                )}

                {/* Inner dot indicator */}
                <span
                  className="w-2.5 h-2.5 rounded-full transition-all duration-500 relative z-10"
                  style={{
                    background: isActive ? section.color : "rgba(255, 255, 255, 0.15)",
                    boxShadow: isActive 
                      ? `0 0 12px ${section.color}, 0 0 4px ${section.color}` 
                      : "none",
                    transform: isActive ? "scale(1.2)" : "scale(1)",
                  }}
                />

                {/* Cyberpunk text panel popping out on hover */}
                <div 
                  className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out flex items-center pr-2"
                >
                  <div 
                    className="glass-pill py-1.5 px-3 rounded-md border border-[rgba(255,255,255,0.08)] flex items-center gap-2 whitespace-nowrap"
                    style={{
                      background: "rgba(10, 10, 15, 0.85)",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      boxShadow: "0 8px 16px rgba(0,0,0,0.5)"
                    }}
                  >
                    <span 
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: section.color, boxShadow: `0 0 8px ${section.color}` }}
                    />
                    <span className="text-[10px] tracking-[0.2em] font-mono uppercase text-white font-medium">
                      {section.shortName}
                    </span>
                  </div>
                  
                  {/* Visual connector line indicator */}
                  <div 
                    className="w-2 h-[1px] bg-[rgba(255,255,255,0.15)] absolute right-0 top-1/2 -translate-y-1/2" 
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Small tech bracket indicator at bottom */}
        <div className="w-2 h-1 border-b border-x border-[rgba(255,255,255,0.2)] mt-3 opacity-30 select-none pointer-events-none" />
      </div>
    </>
  );
}
