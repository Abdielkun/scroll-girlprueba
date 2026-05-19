import { notFound } from "next/navigation";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import VideoScrollHero from "@/components/sections/VideoScrollHero";
import VideoScrollHero2 from "@/components/sections/VideoScrollHero2";
import VideoScrollHero3 from "@/components/sections/VideoScrollHero3";
import VideoScrollHero4 from "@/components/sections/VideoScrollHero4";
import VideoScrollHero5 from "@/components/sections/VideoScrollHero5";
import VideoScrollHero6 from "@/components/sections/VideoScrollHero6";
import HudMenu from "@/components/ui/HudMenu";
import Navbar from "@/components/ui/Navbar";

interface PageProps {
  params: Promise<{ character: string }>;
}

export async function generateStaticParams() {
  return [
    { character: "akari" },
    { character: "mahiru" },
    { character: "ghostfreak" },
    { character: "karane" },
    { character: "shizuka1" },
    { character: "shizuka2" },
  ];
}

export async function generateMetadata({ params }: PageProps) {
  const { character } = await params;
  const nameMap: Record<string, string> = {
    akari: "Akari Watanabe",
    mahiru: "Mahiru Shiina",
    ghostfreak: "Ghostfreak",
    karane: "Karane Inda",
    shizuka1: "Shizuka Yoshimoto I",
    shizuka2: "Shizuka Yoshimoto II",
  };

  const name = nameMap[character] || "Character";

  return {
    title: `${name} — Iridescent Scroll`,
    description: `Scroll-driven animation for ${name}`,
  };
}

export default async function CharacterPage({ params }: PageProps) {
  const { character } = await params;

  const renderHero = () => {
    switch (character) {
      case "akari":
        return <VideoScrollHero />;
      case "mahiru":
        return <VideoScrollHero2 />;
      case "ghostfreak":
        return <VideoScrollHero3 />;
      case "karane":
        return <VideoScrollHero4 />;
      case "shizuka1":
        return <VideoScrollHero5 />;
      case "shizuka2":
        return <VideoScrollHero6 />;
      default:
        notFound();
    }
  };

  return (
    <SmoothScrollProvider>
      <main>
        <Navbar />
        <HudMenu />
        <div id={character}>
          {renderHero()}
        </div>
      </main>
    </SmoothScrollProvider>
  );
}

