'use client';

import { useState } from 'react';

type ReviewFormProps = {
  productId: string;
};

export default function ReviewForm({ productId }: ReviewFormProps) {
  const [open, setOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage('');

    if (!author.trim() || !body.trim()) {
      setMessage('Please enter your name and review.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          author: author.trim(),
          email: email.trim(),
          rating,
          body: body.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not submit review.');
      }

      setAuthor('');
      setEmail('');
      setRating(5);
      setBody('');
      setMessage(
        'Thank you! Your review has been submitted and is awaiting approval.'
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Could not submit review.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-10 border-t border-obsidian/10 pt-8">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-sm underline underline-offset-4"
        >
          Write a Review
        </button>
      ) : (
        <>
          <h3 className="font-display text-xl mb-6">Write a Review</h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm mb-2">Your Name</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full border border-obsidian/15 px-4 py-3 text-sm outline-none"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Your Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-obsidian/15 px-4 py-3 text-sm outline-none"
                placeholder="Your email (optional)"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Rating</label>

              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className="text-xl"
                    aria-label={`${value} stars`}
                  >
                    <span
                      className={
                        value <= rating
                          ? 'text-gold'
                          : 'text-obsidian/20'
                      }
                    >
                      ★
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">Your Review</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full border border-obsidian/15 px-4 py-3 text-sm outline-none min-h-32 resize-y"
                placeholder="Tell us about your experience..."
                required
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-obsidian text-white px-6 py-3 text-sm disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm text-obsidian/60"
              >
                Cancel
              </button>
            </div>

            {message && (
              <p className="text-sm text-obsidian/60">
                {message}
              </p>
            )}
          </form>
        </>
      )}
    </div>
  );
}