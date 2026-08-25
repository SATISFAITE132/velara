'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative h-[92vh] min-h-[640px] overflow-hidden bg-obsidian">
      <Image
        src="https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=1800&q=80"
        alt="Golden hair oil dripping"
        fill
        priority
        className="object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-obsidian/40" />

      {/* Ambient drifting droplets — signature motif */}
      <div className="absolute top-1/4 left-[15%] w-3 h-3 rounded-full bg-gold/60 animate-drift" />
      <div className="absolute top-1/3 right-[20%] w-2 h-2 rounded-full bg-gold-light/70 animate-drift" style={{ animationDelay: '1.5s' }} />
      <div className="absolute bottom-1/3 left-[35%] w-2.5 h-2.5 rounded-full bg-gold/50 animate-drift" style={{ animationDelay: '3s' }} />

      <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="eyebrow text-gold-light"
        >
          Small-Batch Luxury Hair Oil
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="font-display italic text-cream text-5xl md:text-7xl mt-4 leading-[1.05]"
        >
          Liquid Gold<br />for Hair
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-cream/70 mt-6 max-w-md text-sm md:text-base"
        >
          24-karat gold elixirs and repair oils, cold-blended in small runs for a
          finish that feels as luxurious as it looks.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex gap-4 mt-10"
        >
          <Link href="/shop" className="btn-primary bg-gold text-obsidian hover:bg-gold-light">Shop the Collection</Link>
          <Link href="/product/gold-elixir" className="btn-outline border-cream/50 text-cream hover:bg-cream hover:text-obsidian">Our Bestseller</Link>
        </motion.div>
      </div>
    </section>
  );
}
