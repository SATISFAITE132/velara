'use client';

import { useState } from 'react';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    await fetch('/api/logout', {
      method: 'POST',
    });

    window.location.href = '/admin-login';
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-cream/60 hover:text-cream hover:bg-cream/10 rounded transition-colors"
    >
      <LogOut size={17} />
      {loading ? 'Signing out...' : 'Logout'}
    </button>
  );
}