import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Thesis } from "@/components/sections/Thesis";
import { Architecture } from "@/components/sections/Architecture";
import { Stack } from "@/components/sections/Stack";
import { Roadmap } from "@/components/sections/Roadmap";
import { Resources } from "@/components/sections/Resources";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Thesis />
        <Architecture />
        <Stack />
        <Roadmap />
        <Resources />
      </main>
      <Footer />
    </>
  );
}


