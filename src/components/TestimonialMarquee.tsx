'use client';
import { Star } from 'lucide-react';

const QUOTES = [
  { text: 'My hairdresser asked what I was using — I have never gotten that before.', author: 'Amelia R.' },
  { text: 'The only oil that doesn\u2019t weigh my fine hair down.', author: 'Noor K.' },
  { text: 'Feels like a spa ritual every single night.', author: 'Priya S.' },
  { text: 'Worth the splurge. My ends have never looked better.', author: 'Jonas W.' },
];

export default function TestimonialMarquee() {
  const items = [...QUOTES, ...QUOTES];
  return (
    <section className="py-16 overflow-hidden border-y border-obsidian/10">
      <div className="flex gap-16 animate-[marquee_32s_linear_infinite] w-max">
        {items.map((q, i) => (
          <div key={i} className="flex items-center gap-3 shrink-0">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, s) => <Star key={s} size={13} className="fill-gold text-gold" />)}
            </div>
            <p className="font-display italic text-lg whitespace-nowrap">&ldquo;{q.text}&rdquo;</p>
            <span className="text-xs text-obsidian/40 whitespace-nowrap">— {q.author}</span>
          </div>
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </section>
  );
}
