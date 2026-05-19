import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import VideoScrollHero from "@/components/sections/VideoScrollHero";
import VideoScrollHero2 from "@/components/sections/VideoScrollHero2";
import VideoScrollHero4 from "@/components/sections/VideoScrollHero4";
import VideoScrollHero5 from "@/components/sections/VideoScrollHero5";
import VideoScrollHero6 from "@/components/sections/VideoScrollHero6";
import HudMenu from "@/components/ui/HudMenu";
import Navbar from "@/components/ui/Navbar";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <main>
        <Navbar />
        <HudMenu />
        
        <div id="akari">
          <VideoScrollHero />
        </div>
        
        <div id="mahiru">
          <VideoScrollHero2 />
        </div>
        
        <div id="karane">
          <VideoScrollHero4 />
        </div>
        
        <div id="shizuka1">
          <VideoScrollHero5 />
        </div>
        
        <div id="shizuka2">
          <VideoScrollHero6 />
        </div>
      </main>
    </SmoothScrollProvider>
  );
}

