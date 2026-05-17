import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import VideoScrollHero from "@/components/sections/VideoScrollHero";
import VideoScrollHero2 from "@/components/sections/VideoScrollHero2";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <main>
        <VideoScrollHero />
        <VideoScrollHero2 />
      </main>
    </SmoothScrollProvider>
  );
}
