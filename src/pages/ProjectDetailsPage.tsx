import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, MapPin, Check, Calendar } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { formatCurrency } from '../utils/finance';
import { SafeImage } from '../components/SafeImage';
import { EnquiryPanel } from '../components/EnquiryPanel';
import { EmiCalculator } from '../components/EmiCalculator';

export const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state } = useMarketplace();
  const project = state.projects.find((p) => p.id === id);

  const [activeImage, setActiveImage] = useState(0);

  if (!project) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-[#142D4E]">Project Not Found</h1>
        <p className="text-sm text-[#778397] mt-2">
          The development project you requested could not be found.
        </p>
        <Link
          to="/projects"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#142D4E] rounded-[10px]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to New Projects
        </Link>
      </div>
    );
  }

  const developer = state.developers.find((d) => d.id === project.developerId);

  return (
    <div className="bg-[#F5F7FA] min-h-screen pb-16">
      <div className="bg-white border-b border-[#E6EAF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#778397] hover:text-[#142D4E]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>All New Development Projects</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Project Header Card */}
        <div className="bg-white border border-[#E6EAF0] rounded-[12px] p-6 mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#778397] mb-2">
              <span className="font-mono text-[#142D4E] font-medium">{project.id}</span>
              <span aria-hidden="true">·</span>
              <span className="font-medium text-[#4778B8]">{project.status}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{project.category}</span>
              {project.verified && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1 font-medium text-[#142D4E]">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#4778B8]" aria-hidden="true" />
                    RERA Registered
                  </span>
                </>
              )}
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#142D4E]">
              {project.name}
            </h1>
            <p className="text-sm text-[#778397] mt-1.5 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-[#4778B8]" aria-hidden="true" />
              <span>
                {project.locality}, {project.city} · Developed by{' '}
                <strong className="text-[#202B3C] font-medium">{project.developerName}</strong>
              </span>
            </p>
          </div>

          <div className="lg:text-right border-t lg:border-t-0 pt-4 lg:pt-0 border-[#E6EAF0]">
            <p className="text-xs text-[#778397]">Starting Price</p>
            <p className="font-display text-3xl font-bold text-[#142D4E] tabular-nums">
              {formatCurrency(project.startingPrice)}
            </p>
            <p className="text-xs text-[#778397] mt-1 flex lg:justify-end items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#4778B8]" aria-hidden="true" />
              <span>Possession: {project.possessionTimeline}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            {/* Project Gallery */}
            <section className="bg-white border border-[#E6EAF0] rounded-[12px] overflow-hidden">
              <div className="aspect-[16/9] bg-[#F5F7FA]">
                <SafeImage
                  src={project.images[activeImage] ?? project.images[0]}
                  alt={project.name}
                  className="h-full w-full object-cover"
                />
              </div>
              {project.images.length > 1 && (
                <div className="p-4 flex items-center gap-3 border-t border-[#E6EAF0]">
                  {project.images.map((img, idx) => (
                    <button
                      key={`prj-img-${idx}`}
                      type="button"
                      onClick={() => setActiveImage(idx)}
                      aria-label={`Select project photo ${idx + 1}`}
                      className={`h-16 w-24 rounded-[8px] overflow-hidden border-2 ${
                        activeImage === idx ? 'border-[#142D4E]' : 'border-transparent opacity-70'
                      }`}
                    >
                      <SafeImage src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* Overview & RERA */}
            <section className="bg-white border border-[#E6EAF0] rounded-[12px] p-6 space-y-4">
              <h2 className="font-display text-lg font-semibold text-[#142D4E]">Project Overview</h2>
              <p className="text-sm text-[#202B3C]/90 leading-relaxed">{project.overview}</p>

              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#E6EAF0] text-sm">
                <div>
                  <dt className="text-xs text-[#778397]">Project Status</dt>
                  <dd className="font-semibold text-[#202B3C] mt-0.5">{project.status}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[#778397]">Possession</dt>
                  <dd className="font-semibold text-[#202B3C] mt-0.5">
                    {project.possessionTimeline}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[#778397]">Total Units</dt>
                  <dd className="font-mono font-semibold text-[#202B3C] tabular-nums mt-0.5">
                    {project.totalUnits}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[#778397]">RERA Number</dt>
                  <dd className="font-mono text-xs font-semibold text-[#142D4E] mt-1 break-all">
                    {project.reraNumber}
                  </dd>
                </div>
              </dl>
            </section>

            {/* Available Configurations */}
            <section className="bg-white border border-[#E6EAF0] rounded-[12px] p-6">
              <h2 className="font-display text-lg font-semibold text-[#142D4E] mb-4">
                Available Configurations
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#E6EAF0] text-xs text-[#778397]">
                      <th className="py-3 pr-4 font-medium">Configuration</th>
                      <th className="py-3 px-4 font-medium">Area Range</th>
                      <th className="py-3 px-4 font-medium">Indicative Price</th>
                      <th className="py-3 pl-4 font-medium text-right">Available Units</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6EAF0]">
                    {project.configurations.map((cfg) => (
                      <tr key={cfg.type} className="hover:bg-[#F5F7FA]/60">
                        <td className="py-3.5 pr-4 font-semibold text-[#202B3C]">{cfg.type}</td>
                        <td className="py-3.5 px-4 text-[#778397] font-mono text-xs tabular-nums">
                          {cfg.areaSqFt}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#142D4E] tabular-nums">
                          {cfg.priceRange}
                        </td>
                        <td className="py-3.5 pl-4 text-right font-mono text-xs text-[#202B3C] tabular-nums">
                          {cfg.availableUnits}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Floor Plans */}
            {project.floorPlans.length > 0 && (
              <section className="bg-white border border-[#E6EAF0] rounded-[12px] p-6 space-y-4">
                <h2 className="font-display text-lg font-semibold text-[#142D4E]">
                  Master Floor Plans
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.floorPlans.map((fp) => (
                    <div
                      key={fp.id}
                      className="p-4 bg-[#F5F7FA] border border-[#E6EAF0] rounded-[10px] space-y-2"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="text-sm font-semibold text-[#142D4E]">{fp.label}</h3>
                        <span className="font-mono text-xs text-[#4778B8] tabular-nums">
                          {fp.areaSqFt.toLocaleString()} sq. ft.
                        </span>
                      </div>
                      <p className="text-xs text-[#778397] font-mono">
                        Footprint: {fp.dimensions} · From {formatCurrency(fp.price)}
                      </p>
                      <ul className="pt-2 space-y-1 text-xs text-[#202B3C]">
                        {fp.rooms.map((r) => (
                          <li key={r} className="flex items-center gap-1.5">
                            <Check className="h-3.5 w-3.5 text-[#4778B8]" aria-hidden="true" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Amenities */}
            <section className="bg-white border border-[#E6EAF0] rounded-[12px] p-6">
              <h2 className="font-display text-lg font-semibold text-[#142D4E] mb-4">
                Development Amenities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#202B3C]">
                {project.amenities.map((am) => (
                  <div key={am} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#4778B8] shrink-0" aria-hidden="true" />
                    <span>{am}</span>
                  </div>
                ))}
              </div>
            </section>

            <EmiCalculator propertyPrice={project.startingPrice} />
          </div>

          <aside className="lg:col-span-4 lg:sticky lg:top-20 space-y-5">
            <EnquiryPanel
              projectId={project.id}
              projectTitle={project.name}
              ownerOrAgentId={developer?.userId ?? 'usr-dev-1'}
              ownerOrAgentName={project.developerName}
              ownerOrAgentRoleLabel="Official Developer Sales Desk"
              developerId={developer?.userId ?? 'usr-dev-1'}
              leadSourcePrefix="Project Details"
            />
          </aside>
        </div>
      </div>
    </div>
  );
};
