import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, TrendingUp, ArrowRight, Check } from 'lucide-react';
import { BUYING_GUIDES, LOCALITY_INSIGHTS } from '../data/seedData';
import { EmiCalculator } from '../components/EmiCalculator';

export const GuidesPage: React.FC = () => {
  const [activeGuideId, setActiveGuideId] = useState(BUYING_GUIDES[0].id);
  const activeGuide = BUYING_GUIDES.find((g) => g.id === activeGuideId) ?? BUYING_GUIDES[0];

  return (
    <div className="bg-[#F5F7FA] min-h-screen pb-16">
      <div className="bg-white border-b border-[#E6EAF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-xs font-medium text-[#4778B8] mb-1">Research &amp; Market Intelligence</p>
          <h1 className="font-display text-3xl font-bold text-[#142D4E]">
            Property Buying Guides &amp; Locality Insights
          </h1>
          <p className="text-sm text-[#778397] mt-1.5 max-w-2xl">
            Structured due-diligence frameworks, neighborhood price benchmarks, and financing tools
            to support disciplined real estate decisions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        {/* Locality Information */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="h-5 w-5 text-[#142D4E]" aria-hidden="true" />
            <h2 className="font-display text-2xl font-bold text-[#142D4E]">
              Locality Price &amp; Yield Benchmarks
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {LOCALITY_INSIGHTS.map((loc) => (
              <article
                key={loc.id}
                className="bg-white border border-[#E6EAF0] rounded-[12px] p-6 space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium text-[#4778B8]">{loc.city}</p>
                    <h3 className="font-display text-lg font-bold text-[#142D4E] mt-0.5">
                      {loc.locality}
                    </h3>
                  </div>
                  <Link
                    to={`/properties?city=${encodeURIComponent(loc.city)}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#142D4E] hover:text-[#4778B8] whitespace-nowrap"
                  >
                    <span>View Homes</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>

                <p className="text-sm text-[#778397] leading-relaxed">{loc.summary}</p>

                <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-[#E6EAF0] text-xs">
                  <div>
                    <dt className="text-[#778397]">Avg. Price</dt>
                    <dd className="font-mono font-semibold text-[#142D4E] tabular-nums mt-0.5">
                      ${loc.avgPricePerSqFt}/sq.ft.
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#778397]">YoY Growth</dt>
                    <dd className="font-mono font-semibold text-[#142D4E] tabular-nums mt-0.5">
                      +{loc.yoyGrowthPercent}%
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#778397]">Est. Yield</dt>
                    <dd className="font-mono font-semibold text-[#142D4E] tabular-nums mt-0.5">
                      {loc.rentalYieldPercent}%
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#778397]">Connectivity</dt>
                    <dd className="font-mono font-semibold text-[#142D4E] tabular-nums mt-0.5">
                      {loc.connectivityScore}
                    </dd>
                  </div>
                </dl>

                <ul className="space-y-1.5 text-xs text-[#202B3C]">
                  {loc.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-[#4778B8]" aria-hidden="true" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* Property Buying Guides */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <BookOpen className="h-5 w-5 text-[#142D4E]" aria-hidden="true" />
            <h2 className="font-display text-2xl font-bold text-[#142D4E]">
              Property Buying Guides
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4 space-y-3">
              {BUYING_GUIDES.map((guide) => {
                const active = guide.id === activeGuide.id;
                return (
                  <button
                    key={guide.id}
                    type="button"
                    onClick={() => setActiveGuideId(guide.id)}
                    className={`w-full text-left p-5 rounded-[12px] border transition-colors ${
                      active
                        ? 'bg-[#142D4E] text-white border-[#142D4E]'
                        : 'bg-white text-[#202B3C] border-[#E6EAF0] hover:border-[#4778B8]'
                    }`}
                  >
                    <p
                      className={`text-xs ${
                        active ? 'text-[#A9C6EA]' : 'text-[#778397]'
                      }`}
                    >
                      {guide.category} · {guide.readTime}
                    </p>
                    <p className="font-display text-base font-semibold mt-1">{guide.title}</p>
                  </button>
                );
              })}
            </div>

            <article className="lg:col-span-8 bg-white border border-[#E6EAF0] rounded-[12px] p-6 sm:p-8 space-y-6">
              <div>
                <p className="text-xs font-medium text-[#4778B8]">
                  {activeGuide.category} · {activeGuide.readTime}
                </p>
                <h3 className="font-display text-2xl font-bold text-[#142D4E] mt-1">
                  {activeGuide.title}
                </h3>
                <p className="text-sm text-[#778397] mt-2 leading-relaxed">
                  {activeGuide.summary}
                </p>
              </div>

              <div className="bg-[#F5F7FA] border border-[#E6EAF0] rounded-[10px] p-5">
                <p className="text-xs font-semibold text-[#142D4E] mb-2.5">Key Takeaways</p>
                <ul className="space-y-2 text-sm text-[#202B3C]">
                  {activeGuide.keyTakeaways.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-[#4778B8] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-5">
                {activeGuide.sections.map((sec) => (
                  <div key={sec.heading}>
                    <h4 className="text-base font-semibold text-[#142D4E]">{sec.heading}</h4>
                    <p className="text-sm text-[#202B3C]/90 mt-1.5 leading-relaxed">{sec.body}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        {/* Standalone EMI Calculator */}
        <section>
          <EmiCalculator propertyPrice={1250000} />
        </section>
      </div>
    </div>
  );
};
