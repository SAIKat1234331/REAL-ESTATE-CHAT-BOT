import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Mail, Globe, ArrowRight, Building2 } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { formatCurrency } from '../utils/finance';

export const DevelopersPage: React.FC = () => {
  const { state } = useMarketplace();

  return (
    <div className="bg-[#F5F7FA] min-h-screen pb-16">
      <div className="bg-white border-b border-[#E6EAF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-xs font-medium text-[#4778B8] mb-1">Institutional Partners</p>
          <h1 className="font-display text-3xl font-bold text-[#142D4E]">Developers Directory</h1>
          <p className="text-sm text-[#778397] mt-1.5 max-w-2xl">
            Review verified property developers, RERA credentials, track records, and active
            residential and commercial project portfolios.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {state.developers.map((dev) => {
          const portfolio = state.projects.filter((p) => p.developerId === dev.id);
          return (
            <section
              key={dev.id}
              className="bg-white border border-[#E6EAF0] rounded-[12px] p-6 sm:p-8 space-y-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="flex items-start gap-4 max-w-3xl">
                  <div className="h-14 w-14 rounded-[12px] bg-[#142D4E] text-white font-display text-lg font-bold flex items-center justify-center shrink-0">
                    {dev.monogram}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="font-display text-xl font-bold text-[#142D4E]">
                        {dev.companyName}
                      </h2>
                      {dev.verified && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#142D4E]">
                          <ShieldCheck className="h-4 w-4 text-[#4778B8]" aria-hidden="true" />
                          Verified Developer
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#4778B8] font-medium mt-0.5">{dev.tagline}</p>
                    <p className="text-sm text-[#202B3C]/85 mt-3 leading-relaxed">{dev.about}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 lg:min-w-[300px] bg-[#F5F7FA] border border-[#E6EAF0] rounded-[10px] p-4 text-center">
                  <div>
                    <p className="text-xs text-[#778397]">Experience</p>
                    <p className="font-display text-lg font-bold text-[#142D4E] tabular-nums mt-0.5">
                      {dev.yearsExperience} yrs
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#778397]">Delivered</p>
                    <p className="font-display text-lg font-bold text-[#142D4E] tabular-nums mt-0.5">
                      {dev.completedProjects}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#778397]">Ongoing</p>
                    <p className="font-display text-lg font-bold text-[#142D4E] tabular-nums mt-0.5">
                      {dev.ongoingProjects}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-4 border-y border-[#E6EAF0] text-xs text-[#202B3C]">
                <div>
                  <span className="text-[#778397] block">RERA Registration</span>
                  <span className="font-mono font-semibold text-[#142D4E] mt-0.5 block">
                    {dev.reraRegistration}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-[#4778B8]" aria-hidden="true" />
                  <span className="tabular-nums">{dev.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-[#4778B8]" aria-hidden="true" />
                  <span className="truncate">{dev.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 text-[#4778B8]" aria-hidden="true" />
                  <span>{dev.headquarters}</span>
                </div>
              </div>

              {/* Project Portfolio */}
              <div>
                <h3 className="text-sm font-semibold text-[#142D4E] mb-3 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#4778B8]" aria-hidden="true" />
                  <span>Project Portfolio ({portfolio.length} Active)</span>
                </h3>
                {portfolio.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {portfolio.map((prj) => (
                      <Link
                        key={prj.id}
                        to={`/projects/${prj.id}`}
                        className="group p-4 border border-[#E6EAF0] rounded-[10px] hover:border-[#4778B8] transition-colors flex items-center justify-between gap-4"
                      >
                        <div>
                          <p className="text-xs text-[#778397]">
                            {prj.status} · {prj.locality}, {prj.city}
                          </p>
                          <p className="text-sm font-semibold text-[#142D4E] group-hover:text-[#4778B8] mt-0.5">
                            {prj.name}
                          </p>
                          <p className="text-xs text-[#778397] mt-1 tabular-nums">
                            From {formatCurrency(prj.startingPrice)} · Possession{' '}
                            {prj.possessionTimeline}
                          </p>
                        </div>
                        <ArrowRight
                          className="h-4 w-4 text-[#778397] group-hover:text-[#142D4E] shrink-0"
                          aria-hidden="true"
                        />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#778397]">
                    Contact {dev.companyName} directly for upcoming private releases.
                  </p>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
