'use client';

import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';
import Image from 'next/image';
import Link from 'next/link';

interface TeamMember {
  role: string;
  name: string;
  image: string;
  link: string;
}

const teamMembers: TeamMember[] = [
  {
    role: 'Architecture',
    name: 'Abdel — @AbdelStark',
    image: '/abdel.jpg',
    link: 'https://x.com/AbdelStark',
  },
  {
    role: 'Core Dev',
    name: 'Michael',
    image: '/michel.jpeg',
    link: 'https://x.com/monsieur_kus',
  },
  {
    role: 'Application',
    name: 'Brandon Roberts',
    image: '/roberts.jpeg',
    link: 'https://github.com/b-j-roberts',
  },
  {
    role: 'Infrastructure',
    name: 'Karnot (Apoorv & Team)',
    image: '/apoorv.jpeg',
    link: 'https://github.com/apoorvsadana',
  },
  {
    role: 'Ecosystem',
    name: 'Odin',
    image: '/odin.jpg',
    link: 'https://x.com/odin_free',
  },
  {
    role: 'Engine',
    name: 'StarkWare (Cairo/Stwo)',
    image: '/starkware.jpg',
    link: 'https://x.com/StarkwareLTD',
  },
];

export function Team() {
  useRevealOnScroll();

  return (
    <section className="relative pb-16 md:pb-24" id="team">
      <div className="max-w-container mx-auto px-4 lg:px-0">
        {/* Orange bordered container */}
        <div className="relative border border-[#e96b2d] rounded-3xl overflow-hidden p-8 md:p-12 lg:p-16">
          {/* Title */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl leading-[1.1] font-bold text-[#e96b2d] mb-16">
            Built by Humans.
            <br />
            Verified by Cryptography.
          </h2>

          {/* Team Grid - Single column on mobile (horizontal cards), grid on larger screens */}
          <div className="flex flex-col gap-4 md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 md:gap-8">
            {teamMembers.map((member) => (
              <Link
                key={member.role}
                href={member.link}
                target="_blank"
                rel="noreferrer"
                className="flex flex-row md:flex-col items-center md:text-center group gap-4 md:gap-0"
              >
                {/* Avatar */}
                <div className="w-16 h-16 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full bg-[#1a1a2e] border border-[rgba(233,107,45,0.3)] md:mb-4 overflow-hidden transition-all duration-300 group-hover:border-[#e96b2d] group-hover:scale-105 flex-shrink-0">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={144}
                    height={144}
                    className="w-full h-full object-cover grayscale transition-all duration-300 group-hover:grayscale-0"
                  />
                </div>

                {/* Info */}
                <div className="flex flex-col md:items-center">
                  {/* Role */}
                  <p className="text-[#e96b2d] font-bold text-sm md:text-base mb-0.5 md:mb-1">{member.role}</p>

                  {/* Name */}
                  <p className="text-white italic text-sm md:text-base group-hover:text-[#e96b2d] transition-colors">
                    {member.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
