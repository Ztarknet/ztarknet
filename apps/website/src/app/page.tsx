import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Architecture } from '@/components/sections/Architecture';
import { Demo } from '@/components/sections/Demo';
import { Hero } from '@/components/sections/Hero';
import { Problem } from '@/components/sections/Problem';
import { Team } from '@/components/sections/Team';

export default function Home(): React.ReactElement {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Problem />
        <Architecture />
        <Demo />
        <Team />
      </main>
      <Footer />
    </>
  );
}
