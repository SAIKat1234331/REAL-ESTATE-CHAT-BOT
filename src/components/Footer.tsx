import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Instagram, Globe, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B1F38] text-white border-t border-[#142D4E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <Link to="/" className="font-display text-xl font-bold tracking-tight text-white">
              Meridian Estates
            </Link>
            <p className="text-sm text-[#B8C4D4] leading-relaxed">
              An international residential and commercial real estate marketplace connecting buyers,
              tenants, verified brokers, property owners, and premier developers.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <Link
                to="/contact"
                aria-label="LinkedIn and corporate enquiries"
                className="inline-flex items-center justify-center h-9 w-9 rounded-[8px] border border-white/15 text-[#B8C4D4] hover:text-white hover:border-white/40 transition-colors"
              >
                <Linkedin className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to="/contact"
                aria-label="Instagram showcase"
                className="inline-flex items-center justify-center h-9 w-9 rounded-[8px] border border-white/15 text-[#B8C4D4] hover:text-white hover:border-white/40 transition-colors"
              >
                <Instagram className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to="/guides"
                aria-label="International market insights"
                className="inline-flex items-center justify-center h-9 w-9 rounded-[8px] border border-white/15 text-[#B8C4D4] hover:text-white hover:border-white/40 transition-colors"
              >
                <Globe className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to="/contact"
                aria-label="Contact advisory team"
                className="inline-flex items-center justify-center h-9 w-9 rounded-[8px] border border-white/15 text-[#B8C4D4] hover:text-white hover:border-white/40 transition-colors"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Explore</h3>
            <ul className="space-y-2.5 text-sm text-[#B8C4D4]">
              <li>
                <Link to="/properties?listingType=sale" className="hover:text-white transition-colors">
                  Buy Properties
                </Link>
              </li>
              <li>
                <Link to="/properties?listingType=rent" className="hover:text-white transition-colors">
                  Rent Properties
                </Link>
              </li>
              <li>
                <Link to="/properties?category=commercial" className="hover:text-white transition-colors">
                  Commercial
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-white transition-colors">
                  New Projects
                </Link>
              </li>
              <li>
                <Link to="/guides" className="hover:text-white transition-colors">
                  Buying Guides &amp; Localities
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Professionals */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Professionals</h3>
            <ul className="space-y-2.5 text-sm text-[#B8C4D4]">
              <li>
                <Link to="/agents" className="hover:text-white transition-colors">
                  Find Agents
                </Link>
              </li>
              <li>
                <Link to="/developers" className="hover:text-white transition-colors">
                  Developers
                </Link>
              </li>
              <li>
                <Link to="/list-property" className="hover:text-white transition-colors">
                  List Your Property
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Partner Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">
                  Admin Governance
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2.5 text-sm text-[#B8C4D4]">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#98A8BD]">
          <p>© {new Date().getFullYear()} Meridian Estates Group. All rights reserved.</p>
          <p>
            Interactive frontend marketplace with local browser persistence. Backend APIs ready for integration.
          </p>
        </div>
      </div>
    </footer>
  );
};
