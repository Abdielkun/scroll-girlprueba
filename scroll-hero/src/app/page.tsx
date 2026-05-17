import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import VideoScrollHero from "@/components/sections/VideoScrollHero";
import VideoScrollHero2 from "@/components/sections/VideoScrollHero2";
import VideoScrollHero4 from "@/components/sections/VideoScrollHero4";
import VideoScrollHero5 from "@/components/sections/VideoScrollHero5";
import VideoScrollHero6 from "@/components/sections/VideoScrollHero6";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <main>
        <VideoScrollHero />
        <VideoScrollHero2 />
        <VideoScrollHero4 />
        <VideoScrollHero5 />
        <VideoScrollHero6 />
      </main>
    </SmoothScrollProvider>
  );
}
