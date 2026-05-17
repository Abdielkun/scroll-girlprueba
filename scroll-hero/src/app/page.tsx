import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import VideoScrollHero from "@/components/sections/VideoScrollHero";
import VideoScrollHero2 from "@/components/sections/VideoScrollHero2";
import VideoScrollHero3 from "@/components/sections/VideoScrollHero3";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <main>
        <VideoScrollHero />
        <VideoScrollHero2 />
        <VideoScrollHero3 />
      </main>
    </SmoothScrollProvider>
  );
}
