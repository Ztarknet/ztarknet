import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Architecture } from '@/components/sections/Architecture';
import { Hero } from '@/components/sections/Hero';
import { Resources } from '@/components/sections/Resources';
import { Roadmap } from '@/components/sections/Roadmap';
import { Stack } from '@/components/sections/Stack';
import { Thesis } from '@/components/sections/Thesis';

export default function Home(): React.ReactElement {
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
