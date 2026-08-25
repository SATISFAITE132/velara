import Link from 'next/link';
import LogoutButton from './LogoutButton';
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, Star, Settings } from 'lucide-react';

const NAV = [
  { href: '/admin', label: 'Analytics', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/discounts', label: 'Discounts', icon: Tag },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-parchment flex">
      <aside className="w-64 bg-obsidian text-cream flex-col hidden md:flex shrink-0">
        <div className="p-6 border-b border-cream/10">
          <p className="font-display text-2xl">VELARA</p>
          <p className="text-xs text-cream/40 tracking-widest2 uppercase mt-1">Admin</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-sm rounded hover:bg-cream/10 transition-colors"
            >
              <item.icon size={17} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-cream/10 space-y-1">
  <Link
    href="/"
    className="block text-xs text-cream/50 hover:text-cream px-4 py-3"
  >
    ← Back to store
  </Link>

  <LogoutButton />
</div>
      </aside>
      <div className="flex-1 min-w-0">
        <header className="h-16 bg-cream border-b border-obsidian/10 flex items-center justify-between px-6 md:hidden">
          <p className="font-display text-xl">VELARA Admin</p>
        </header>
        <main className="p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
