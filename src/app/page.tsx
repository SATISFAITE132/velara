'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import HeroSection from '@/components/HeroSection';
import GoldPour from '@/components/GoldPour';
import ProductCard from '@/components/ProductCard';
import TestimonialMarquee from '@/components/TestimonialMarquee';
import RevealSection from '@/components/RevealSection';

import { createClient } from '@/lib/supabase/client';

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const supabase = createClient();

    async function loadProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) {
        console.error('Products error:', error);
        return;
      }

      setProducts(
        (data || []).map((p) => ({
          ...p,
          heroImage: p.hero_image,
          compareAtPrice: p.compare_at_price,
          reviewCount: p.review_count,
          isNew: p.is_new,
          howToUse: p.how_to_use,
        }))
      );
    }

    loadProducts();
  }, []);

  const bestsellers = products.filter((p) => p.bestseller);

  return (
    <>
      <HeroSection />

      <section className="container-vl py-24">
        <RevealSection>
          <p className="eyebrow text-center">Most Loved</p>

          <h2 className="font-display text-3xl md:text-4xl text-center mt-3">
            The Bestsellers
          </h2>
        </RevealSection>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12 mt-14">
          {bestsellers.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              index={i}
            />
          ))}
        </div>

        <div className="text-center mt-14">
          <Link href="/shop" className="btn-outline">
            Shop All
          </Link>
        </div>
      </section>

      <GoldPour className="py-4" />

      <section
        id="story"
        className="bg-obsidian text-cream py-28"
      >
        <div className="container-vl grid md:grid-cols-2 gap-16 items-center">
          <RevealSection>
            <div className="relative aspect-[4/5]">
              <Image
                src="https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=1000&q=80"
                alt="VELARA beauty products"
                fill
                className="object-cover"
              />
            </div>
          </RevealSection>

          <RevealSection delay={0.1}>
            <p className="eyebrow text-gold">
              Our Philosophy
            </p>

            <h2 className="font-display text-3xl md:text-4xl mt-3 leading-tight">
              Beauty should feel
              <br />
              effortless.
            </h2>

            <p className="text-cream/70 mt-6 leading-relaxed max-w-md">
              At VELARA, we believe the products you choose
              should do more than simply look beautiful. They
              should make everyday life feel a little better.
            </p>

            <p className="text-cream/70 mt-4 leading-relaxed max-w-md">
              We bring together thoughtfully selected
              essentials that combine elegant design, practical
              function, and a quality-first approach.
            </p>

            <Link
              href="/shop"
              className="inline-block mt-8 text-sm tracking-widest2 uppercase border-b border-gold pb-1"
            >
              Explore Our Collection
            </Link>
          </RevealSection>
        </div>
      </section>

      <section className="container-vl py-28">
        <RevealSection>
          <p className="eyebrow text-center">
            The VELARA Experience
          </p>

          <h2 className="font-display text-3xl md:text-4xl text-center mt-3">
            Three Steps to Better Choices
          </h2>
        </RevealSection>

        <div className="grid md:grid-cols-3 gap-12 mt-16">
          {[
            {
              title: 'Discover',
              copy: 'Explore carefully selected products designed to bring beauty and practicality into your everyday life.',
            },
            {
              title: 'Choose',
              copy: 'Find the pieces that match your needs, your style, and the way you live.',
            },
            {
              title: 'Enjoy',
              copy: 'Experience products chosen to make everyday moments simpler, better, and more enjoyable.',
            },
          ].map((step, i) => (
            <RevealSection
              key={step.title}
              delay={i * 0.1}
            >
              <div className="text-center">
                <p className="font-display text-5xl text-gold/30">
                  0{i + 1}
                </p>

                <h3 className="font-display text-xl mt-2">
                  {step.title}
                </h3>

                <p className="text-obsidian/60 text-sm mt-3 leading-relaxed">
                  {step.copy}
                </p>
              </div>
            </RevealSection>
          ))}
        </div>
      </section>

      <TestimonialMarquee />

      <section
        className="bg-blush py-24"
        id="contact"
      >
        <div className="container-vl text-center max-w-xl mx-auto">
          <p className="eyebrow">
            Stay Connected
          </p>

          <h2 className="font-display text-3xl mt-3">
            Be the First to Know
          </h2>

          <p className="text-obsidian/60 mt-4 text-sm">
            Discover new arrivals, special offers, and
            carefully selected products from VELARA —
            delivered straight to your inbox.
          </p>

          <form
            className="mt-8 flex gap-3 max-w-sm mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="flex-1 bg-cream border border-obsidian/20 px-4 py-3 text-sm focus:outline-none focus:border-gold"
            />

            <button
              type="submit"
              className="btn-primary"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
