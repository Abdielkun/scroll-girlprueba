import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import VideoScrollHero from "@/components/sections/VideoScrollHero";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <main>
        <VideoScrollHero />
      </main>
    </SmoothScrollProvider>
  );
}
