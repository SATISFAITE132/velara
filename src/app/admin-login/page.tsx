'use client';

import { FormEvent, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      setLoading(false);
      return;
    }

    window.location.href = '/admin';
  }

  return (
    <main className="min-h-screen bg-obsidian text-cream flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <p className="font-display text-4xl">VELARA</p>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-cream/50">
            Admin Portal
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-cream text-obsidian rounded-2xl p-8 shadow-2xl"
        >
          <h1 className="text-2xl font-semibold mb-2">
            Admin Login
          </h1>

          <p className="text-sm text-obsidian/60 mb-7">
            Sign in to access the Velara administration dashboard.
          </p>

          <label className="block text-sm mb-2">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
            className="w-full rounded-lg border border-obsidian/15 px-4 py-3 mb-5 outline-none focus:ring-2 focus:ring-obsidian/20"
            placeholder="admin@example.com"
          />

          <label className="block text-sm mb-2">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
            className="w-full rounded-lg border border-obsidian/15 px-4 py-3 mb-6 outline-none focus:ring-2 focus:ring-obsidian/20"
            placeholder="••••••••"
          />

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-obsidian text-cream py-3 font-medium transition-opacity disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  );
}