import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Heart, Menu, X, User, ShieldCheck } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export const Navbar: React.FC = () => {
  const { state, currentUser, logout } = useMarketplace();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const savedCount = state.savedPropertyIds.length;

  const isNavActive = (path: string, searchMatch?: string) => {
    if (searchMatch) {
      return location.pathname === '/properties' && location.search.includes(searchMatch);
    }
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinkClass = (active: boolean) =>
    `text-sm font-medium whitespace-nowrap shrink-0 pb-0.5 transition-colors border-b-2 ${
      active
        ? 'text-[#142D4E] border-[#142D4E]'
        : 'text-[#202B3C]/80 border-transparent hover:text-[#142D4E] hover:border-[#E6EAF0]'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#E6EAF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Left: Original text-based brand wordmark */}
        <Link
          to="/"
          className="font-display text-xl font-bold tracking-tight text-[#142D4E] whitespace-nowrap shrink-0"
        >
          Meridian Estates
        </Link>

        {/* Center: Primary Navigation */}
        <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-7">
          <Link to="/" className={navLinkClass(isNavActive('/'))}>
            Home
          </Link>
          <Link
            to="/properties?listingType=sale"
            className={navLinkClass(isNavActive('/properties', 'listingType=sale'))}
          >
            Buy
          </Link>
          <Link
            to="/properties?listingType=rent"
            className={navLinkClass(isNavActive('/properties', 'listingType=rent'))}
          >
            Rent
          </Link>
          <Link
            to="/properties?category=commercial"
            className={navLinkClass(isNavActive('/properties', 'category=commercial'))}
          >
            Commercial
          </Link>
          <NavLink
            to="/projects"
            className={({ isActive }) => navLinkClass(isActive)}
          >
            New Projects
          </NavLink>
          <NavLink
            to="/agents"
            className={({ isActive }) => navLinkClass(isActive)}
          >
            Agents
          </NavLink>
        </nav>

        {/* Right: Saved Properties, Auth / Dashboard, List Your Property CTA */}
        <div className="hidden lg:flex items-center gap-5 shrink-0">
          <Link
            to="/saved"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#202B3C] hover:text-[#142D4E] transition-colors whitespace-nowrap shrink-0"
          >
            <Heart className="h-4 w-4 text-[#4778B8]" aria-hidden="true" />
            <span>Saved Properties</span>
            {savedCount > 0 && (
              <span className="text-xs font-mono tabular-nums text-[#778397]">({savedCount})</span>
            )}
          </Link>

          {currentUser ? (
            <Link
              to={currentUser.role === 'admin' ? '/admin' : '/dashboard'}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#142D4E] hover:text-[#4778B8] transition-colors whitespace-nowrap shrink-0"
            >
              {currentUser.role === 'admin' ? (
                <ShieldCheck className="h-4 w-4 text-[#4778B8]" aria-hidden="true" />
              ) : (
                <User className="h-4 w-4 text-[#4778B8]" aria-hidden="true" />
              )}
              <span className="max-w-[120px] truncate">{currentUser.fullName.split(' ')[0]}</span>
            </Link>
          ) : (
            <Link
              to="/auth"
              className="text-sm font-medium text-[#202B3C] hover:text-[#142D4E] transition-colors whitespace-nowrap shrink-0"
            >
              Login / Register
            </Link>
          )}

          <Link
            to="/list-property"
            className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-[#142D4E] hover:bg-[#0B1F38] rounded-[10px] transition-colors whitespace-nowrap shrink-0"
          >
            List Your Property
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden items-center gap-3">
          <Link
            to="/saved"
            aria-label={`Saved Properties (${savedCount})`}
            className="inline-flex items-center justify-center h-11 w-11 rounded-[10px] border border-[#E6EAF0] text-[#142D4E]"
          >
            <Heart className="h-4 w-4" aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="inline-flex items-center justify-center h-11 w-11 rounded-[10px] border border-[#E6EAF0] text-[#142D4E]"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Collapsible Mobile Navigation */}
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="lg:hidden border-t border-[#E6EAF0] bg-white px-4 py-4 space-y-1"
        >
          {[
            { label: 'Home', to: '/' },
            { label: 'Buy Properties', to: '/properties?listingType=sale' },
            { label: 'Rent Properties', to: '/properties?listingType=rent' },
            { label: 'Commercial', to: '/properties?category=commercial' },
            { label: 'New Projects', to: '/projects' },
            { label: 'Developers', to: '/developers' },
            { label: 'Agents', to: '/agents' },
            { label: 'Buying Guides', to: '/guides' },
            { label: `Saved Properties (${savedCount})`, to: '/saved' },
            { label: 'Compare Properties', to: '/compare' },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-3 text-base font-medium text-[#202B3C] hover:bg-[#F5F7FA] rounded-[10px]"
            >
              {item.label}
            </Link>
          ))}

          <div className="pt-3 mt-3 border-t border-[#E6EAF0] space-y-2">
            {currentUser ? (
              <>
                <Link
                  to={currentUser.role === 'admin' ? '/admin' : '/dashboard'}
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center px-4 py-3 text-sm font-medium text-[#142D4E] bg-[#F5F7FA] rounded-[10px]"
                >
                  {currentUser.role === 'admin' ? 'Admin Dashboard' : `${currentUser.fullName} — Dashboard`}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="block w-full text-center px-4 py-3 text-sm font-medium text-[#778397] border border-[#E6EAF0] rounded-[10px]"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-4 py-3 text-sm font-medium text-[#142D4E] border border-[#E6EAF0] rounded-[10px]"
              >
                Login / Register
              </Link>
            )}
            <Link
              to="/list-property"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center px-4 py-3 text-sm font-medium text-white bg-[#142D4E] rounded-[10px]"
            >
              List Your Property
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};
