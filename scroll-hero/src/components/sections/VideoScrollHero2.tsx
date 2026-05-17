"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export default function VideoScrollHero2() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const FRAME_COUNT = 178;
  const [shouldLoad, setShouldLoad] = useState(false);

  const drawCover = useCallback((ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number) => {
    const imgRatio = img.width / img.height;
    const canvasRatio = w / h;
    let drawW, drawH, drawX, drawY;

    if (imgRatio > canvasRatio) {
      drawH = h;
      drawW = img.width * (h / img.height);
      drawX = (w - drawW) / 2;
      drawY = 0;
    } else {
      drawW = w;
      drawH = img.height * (w / img.width);
      drawX = 0;
      drawY = (h - drawH) / 2;
    }
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);
  const progressRef = useRef<HTMLDivElement>(null);
  const tickingRef = useRef(false);
  const [videoReady, setVideoReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // IntersectionObserver to handle lazy preloading & memory release
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
        } else {
          setShouldLoad(false);
          imagesRef.current = [];
          setVideoReady(false);
          setLoadProgress(0);
        }
      },
      { rootMargin: "800px 0px 800px 0px" } // Preload 800px before entering viewport
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Load frames
  useEffect(() => {
    if (!shouldLoad) return;

    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    const onImageLoad = () => {
      loadedCount++;
      setLoadProgress(loadedCount / FRAME_COUNT);
      if (loadedCount === FRAME_COUNT) {
        imagesRef.current = images;
        setVideoReady(true);
        
        // Draw first frame
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          const ctx = canvas.getContext("2d");
          if (ctx && images[0]) {
            drawCover(ctx, images[0], canvas.width, canvas.height);
          }
        }
      }
    };

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      const frameNum = i.toString().padStart(4, "0");
      img.src = `/frames2/frame_${frameNum}.jpg`;
      img.onload = onImageLoad;
      // In case of error, still count it so we don't hang
      img.onerror = onImageLoad;
      images.push(img);
    }
    
    // Resize handler
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const ctx = canvas.getContext("2d");
      const img = imagesRef.current[currentFrameRef.current];
      if (ctx && img) {
        drawCover(ctx, img, canvas.width, canvas.height);
      }
    };
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      images.forEach(img => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [shouldLoad, drawCover]);

  // Scroll handler
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const scrollableHeight = section.offsetHeight - window.innerHeight;
        const progress = Math.min(1, Math.max(0, -rect.top / scrollableHeight));

        // Scrub frames
        if (videoReady && imagesRef.current.length > 0) {
          const frameIndex = Math.min(
            FRAME_COUNT - 1,
            Math.max(0, Math.floor(progress * (FRAME_COUNT - 1)))
          );
          
          if (frameIndex !== currentFrameRef.current) {
            currentFrameRef.current = frameIndex;
            const canvas = canvasRef.current;
            if (canvas) {
              const ctx = canvas.getContext("2d");
              const img = imagesRef.current[frameIndex];
              if (ctx && img) {
                drawCover(ctx, img, canvas.width, canvas.height);
              }
            }
          }
        }

        // Fade overlay text on first 10% of scroll
        if (overlayRef.current) {
          const opacity = Math.max(0, 1 - progress / 0.1);
          overlayRef.current.style.opacity = String(opacity);
        }

        // Update scroll progress bar
        if (progressRef.current) {
          progressRef.current.style.width = `${progress * 100}%`;
        }

        tickingRef.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [videoReady]);

  return (
    <>
      {/* Scroll progress bar at top */}
      {shouldLoad && (
        <div
          className="fixed top-0 left-0 z-40 h-[2px]"
          style={{ background: "rgba(255,255,255,0.05)", width: "100%" }}
        >
          <div
            ref={progressRef}
            className="h-full progress-bar transition-none"
            style={{ width: "0%", transitionProperty: "none" }}
          />
        </div>
      )}

      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-8 py-5"
        style={{
          background: "rgba(5,5,8,0.6)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <span
          className="text-xs tracking-[0.3em] uppercase font-mono iridescent-text"
        >
          Iridescent
        </span>
        <div className="flex items-center gap-6">
          <span className="text-xs tracking-widest uppercase font-mono" style={{ color: "var(--muted)" }}>
            Scroll to explore
          </span>
          <div
            className="glass-pill px-3 py-1.5 rounded-full flex items-center gap-2"
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "#34d399" }}
            />
            <span className="text-[10px] font-mono tracking-wider" style={{ color: "var(--muted)" }}>
              LIVE
            </span>
          </div>
        </div>
      </nav>

      {/* Main scroll section */}
      <section ref={sectionRef} className="scroll-section relative">
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Loading screen contained inside the section */}
          {!videoReady && shouldLoad && (
            <div
              className="absolute inset-0 z-20 flex flex-col items-center justify-center"
              style={{ background: "var(--background)" }}
            >
              {/* Animated orbs */}
              <div
                className="absolute w-64 h-64 rounded-full blur-3xl opacity-20"
                style={{
                  background: "radial-gradient(circle, #a78bfa, transparent)",
                  top: "30%",
                  left: "30%",
                }}
              />
              <div
                className="absolute w-48 h-48 rounded-full blur-3xl opacity-15"
                style={{
                  background: "radial-gradient(circle, #38bdf8, transparent)",
                  bottom: "30%",
                  right: "30%",
                }}
              />

              <div className="relative z-10 flex flex-col items-center gap-8">
                {/* Logo / title */}
                <div className="flex flex-col items-center gap-2">
                  <span
                    className="text-[10px] tracking-[0.4em] uppercase font-mono"
                    style={{ color: "var(--muted)" }}
                  >
                    Loading
                  </span>
                  <h1
                    className="text-3xl font-semibold tracking-tighter iridescent-text"
                  >
                    Iridescent
                  </h1>
                </div>

                {/* Progress bar */}
                <div className="w-48 h-px" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div
                    className="h-full progress-bar transition-all duration-300"
                    style={{ width: `${loadProgress * 100}%` }}
                  />
                </div>

                <span
                  className="text-xs font-mono tabular-nums"
                  style={{ color: "var(--muted)" }}
                >
                  {Math.round(loadProgress * 100)}%
                </span>
              </div>
            </div>
          )}

          {/* Canvas sequence */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ opacity: videoReady ? 1 : 0, transition: "opacity 0.5s ease" }}
          />

          {/* Dark vignette overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 40%, rgba(5,5,8,0.7) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Bottom fade */}
          <div
            className="absolute bottom-0 left-0 right-0 h-40"
            style={{
              background: "linear-gradient(to top, var(--background), transparent)",
              pointerEvents: "none",
            }}
          />

          {/* Scan line effect */}
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{ opacity: 0.3 }}
          >
            <div
              className="absolute w-full h-32"
              style={{
                background: "linear-gradient(180deg, transparent 0%, rgba(167,139,250,0.04) 50%, transparent 100%)",
                animation: "scan 10s linear infinite",
              }}
            />
          </div>

          {/* Hero text overlay */}
          <div
            ref={overlayRef}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
            style={{ transition: "opacity 0.1s linear" }}
          >
            <div className="flex flex-col items-center gap-6 max-w-2xl">
              <span
                className="glass-pill px-4 py-2 rounded-full text-[10px] tracking-[0.4em] uppercase font-mono"
                style={{ color: "var(--muted)" }}
              >
                Scroll to reveal
              </span>

              <h1
                className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tighter leading-[1.02] iridescent-text"
              >
                Mahiru Shiina
              </h1>

              <p
                className="text-sm md:text-base leading-relaxed max-w-md"
                style={{ color: "var(--muted)" }}
              >
                Scroll down to watch the transformation unfold — frame by frame.
              </p>

              {/* Scroll indicator */}
              <div className="flex flex-col items-center gap-3 mt-4">
                <div
                  className="w-px h-12 overflow-hidden rounded-full"
                  style={{ background: "rgba(255,255,255,0.1)" }}
                >
                  <div
                    className="w-full h-1/2 progress-bar"
                    style={{ animation: "scrollIndicator 1.5s ease-in-out infinite" }}
                  />
                </div>
                <span
                  className="text-[10px] tracking-[0.3em] uppercase font-mono"
                  style={{ color: "var(--muted)" }}
                >
                  Scroll
                </span>
              </div>
            </div>
          </div>

          {/* Corner HUD elements */}
          <div
            className="absolute bottom-8 left-8 flex flex-col gap-1 font-mono"
            style={{ color: "var(--muted)" }}
          >
            <span className="text-[9px] tracking-widest uppercase">Frame sequence</span>
            <span className="text-[9px] tracking-widest">V.02 — Synthetic Vision</span>
          </div>

          <div
            className="absolute bottom-8 right-8 flex flex-col items-end gap-1 font-mono"
            style={{ color: "var(--muted)" }}
          >
            <span className="text-[9px] tracking-widest uppercase">Resolution</span>
            <span className="text-[9px] tracking-widest">1920 × 1080</span>
          </div>
        </div>
      </section>

      {/* After-scroll section */}
      <section
        className="relative flex flex-col items-center justify-center py-40 px-6 text-center"
        style={{ background: "var(--background)" }}
      >
        {/* Glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 blur-3xl opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #a78bfa, transparent)" }}
        />

        <div className="relative z-10 flex flex-col items-center gap-6 max-w-xl">
          <span
            className="glass-pill px-4 py-2 rounded-full text-[10px] tracking-[0.4em] uppercase font-mono"
            style={{ color: "var(--muted)" }}
          >
            Complete
          </span>
          <h2
            className="text-4xl md:text-6xl font-semibold tracking-tighter iridescent-text"
          >
            The transformation<br />is complete.
          </h2>
          <p
            className="text-sm md:text-base leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            Scroll back up to watch it again.
          </p>

          {/* Divider */}
          <div
            className="w-px h-16 mt-4"
            style={{ background: "linear-gradient(to bottom, rgba(167,139,250,0.4), transparent)" }}
          />
        </div>
      </section>

      <style jsx global>{`
        @keyframes scrollIndicator {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </>
  );
}
