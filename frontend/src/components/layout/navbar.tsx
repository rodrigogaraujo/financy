import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Dashboard', href: '/' },
  { label: 'Transações', href: '/transactions' },
  { label: 'Categorias', href: '/categories' },
];

function getInitials(name?: string): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  const first = parts[0];
  const last = parts[parts.length - 1];
  if (!first) return '';
  if (parts.length === 1) return first.charAt(0).toUpperCase();
  return (first.charAt(0) + (last?.charAt(0) ?? '')).toUpperCase();
}

export function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="border-b border-gray-200 bg-white px-6 md:px-12 py-4">
      <div className="relative flex items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img src="/logo.svg" alt="Financy" className="h-6" />
        </Link>

        {/* Nav - centered (desktop) */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'text-sm leading-5',
                location.pathname === link.href
                  ? 'font-semibold text-brand-base'
                  : 'font-normal text-gray-600 hover:text-gray-800',
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link
            to="/profile"
            className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-300"
          >
            <span className="text-sm font-medium text-gray-800 leading-5">
              {getInitials(user?.name)}
            </span>
          </Link>

          {/* Hamburger (mobile) */}
          <button
            type="button"
            className="md:hidden flex items-center justify-center h-9 w-9 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden flex flex-col gap-1 pt-4 pb-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'rounded-lg px-3 py-2.5 text-sm',
                location.pathname === link.href
                  ? 'font-semibold text-brand-base bg-brand-base/5'
                  : 'font-normal text-gray-600 hover:text-gray-800 hover:bg-gray-50',
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
