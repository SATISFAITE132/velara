import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-vl py-32 text-center">
      <p className="font-display text-6xl text-gold/40">404</p>
      <h1 className="font-display text-3xl mt-4">Page Not Found</h1>
      <p className="text-obsidian/60 mt-3">The page you&apos;re looking for has drifted off like a stray drop of oil.</p>
      <Link href="/" className="btn-primary inline-flex mt-8">Back to Home</Link>
    </div>
  );
}
