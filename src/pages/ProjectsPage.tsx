import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, ArrowRight } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { formatCurrency } from '../utils/finance';
import { SafeImage } from '../components/SafeImage';

export const ProjectsPage: React.FC = () => {
  const { state } = useMarketplace();
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'residential' | 'commercial'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredProjects = useMemo(() => {
    return state.projects.filter((p) => {
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      return true;
    });
  }, [state.projects, categoryFilter, statusFilter]);

  return (
    <div className="bg-[#F5F7FA] min-h-screen pb-16">
      <div className="bg-white border-b border-[#E6EAF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[#4778B8] mb-1">Direct Developer Portfolio</p>
            <h1 className="font-display text-3xl font-bold text-[#142D4E]">
              New Development Projects
            </h1>
            <p className="text-sm text-[#778397] mt-1.5 max-w-2xl">
              Explore RERA-registered residential towers, master-planned land enclaves, and
              Grade-A commercial business districts directly from institutional developers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex p-1 bg-[#F5F7FA] border border-[#E6EAF0] rounded-[8px]">
              {(['all', 'residential', 'commercial'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-[6px] capitalize ${
                    categoryFilter === cat
                      ? 'bg-white text-[#142D4E] shadow-xs'
                      : 'text-[#778397] hover:text-[#202B3C]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <select
              aria-label="Filter projects by construction status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium border border-[#E6EAF0] rounded-[8px] bg-white text-[#202B3C]"
            >
              <option value="all">All Statuses</option>
              <option value="New Launch">New Launch</option>
              <option value="Under Construction">Under Construction</option>
              <option value="Ready to Move">Ready to Move</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {filteredProjects.length === 0 ? (
          <div className="bg-white border border-[#E6EAF0] rounded-[12px] p-12 text-center">
            <p className="text-base font-semibold text-[#142D4E]">No projects match your filter</p>
            <button
              type="button"
              onClick={() => {
                setCategoryFilter('all');
                setStatusFilter('all');
              }}
              className="mt-4 px-4 py-2 text-xs font-medium text-white bg-[#142D4E] rounded-[8px]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                className="group bg-white border border-[#E6EAF0] rounded-[12px] overflow-hidden hover:border-[#4778B8] transition-all flex flex-col"
              >
                <div className="aspect-[16/9] bg-[#F5F7FA] overflow-hidden">
                  <Link to={`/projects/${project.id}`} className="block h-full w-full">
                    <SafeImage
                      src={project.images[0]}
                      alt={project.name}
                      className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  </Link>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between gap-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#778397] mb-2">
                      <span className="font-medium text-[#4778B8]">{project.status}</span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{project.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>Possession {project.possessionTimeline}</span>
                      {project.verified && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="inline-flex items-center gap-1 font-medium text-[#142D4E]">
                            <ShieldCheck className="h-3.5 w-3.5 text-[#4778B8]" aria-hidden="true" />
                            RERA Verified
                          </span>
                        </>
                      )}
                    </div>

                    <h2 className="font-display text-xl font-bold text-[#142D4E] group-hover:text-[#4778B8] transition-colors">
                      <Link to={`/projects/${project.id}`}>{project.name}</Link>
                    </h2>

                    <p className="text-sm text-[#778397] mt-1 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[#4778B8]" aria-hidden="true" />
                      <span>
                        {project.locality}, {project.city} · By {project.developerName}
                      </span>
                    </p>

                    <p className="text-sm text-[#202B3C]/85 mt-3 line-clamp-2 leading-relaxed">
                      {project.overview}
                    </p>

                    <div className="mt-4 pt-4 border-t border-[#E6EAF0] grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <p className="text-[#778397]">Starting Price</p>
                        <p className="font-display text-base font-bold text-[#142D4E] tabular-nums mt-0.5">
                          {formatCurrency(project.startingPrice)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#778397]">Total Inventory</p>
                        <p className="font-semibold text-[#202B3C] tabular-nums mt-0.5">
                          {project.totalUnits} Units
                        </p>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <p className="text-[#778397]">RERA Number</p>
                        <p className="font-mono text-[#202B3C] truncate mt-0.5">
                          {project.reraNumber}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#E6EAF0]">
                    <span className="text-xs text-[#778397]">
                      {project.configurations.length} unit configurations available
                    </span>
                    <Link
                      to={`/projects/${project.id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#142D4E] hover:text-[#4778B8]"
                    >
                      <span>View Project</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
