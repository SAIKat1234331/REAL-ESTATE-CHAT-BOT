import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Building2,
  Home,
  Landmark,
  Briefcase,
  Store,
  Trees,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  Users,
  Compass,
  MapPin,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ASSET_IMAGES, POPULAR_LOCATIONS } from '../data/seedData';
import { filterProperties, sortProperties } from '../utils/propertyFilters';
import { formatCurrency } from '../utils/finance';
import { PropertyCard } from '../components/PropertyCard';
import { SafeImage } from '../components/SafeImage';

type SearchTab = 'buy' | 'rent' | 'commercial';

export const HomePage: React.FC = () => {
  const { state } = useMarketplace();
  const navigate = useNavigate();

  const [searchTab, setSearchTab] = useState<SearchTab>('buy');
  const [locationQuery, setLocationQuery] = useState('');
  const [propertyType, setPropertyType] = useState('all');
  const [budget, setBudget] = useState('');
  const [bedrooms, setBedrooms] = useState('');

  const approvedProperties = useMemo(
    () => filterProperties(state.properties, {}),
    [state.properties]
  );

  const featuredProperties = useMemo(
    () => sortProperties(approvedProperties.filter((p) => p.featured), 'featured').slice(0, 3),
    [approvedProperties]
  );

  const newlyAddedProperties = useMemo(
    () => sortProperties(approvedProperties, 'newest').slice(0, 3),
    [approvedProperties]
  );

  const residentialProjects = useMemo(
    () => state.projects.filter((p) => p.category === 'residential').slice(0, 3),
    [state.projects]
  );

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTab === 'buy') {
      params.set('listingType', 'sale');
      params.set('category', 'residential');
    } else if (searchTab === 'rent') {
      params.set('listingType', 'rent');
    } else {
      params.set('category', 'commercial');
    }

    if (locationQuery.trim()) params.set('q', locationQuery.trim());
    if (propertyType !== 'all') params.set('propertyType', propertyType);
    if (budget) params.set('maxPrice', budget);
    if (bedrooms) params.set('minBedrooms', bedrooms);

    navigate(`/properties?${params.toString()}`);
  };

  const categories = [
    {
      label: 'Apartments & Flats',
      subtitle: 'Skyline towers & urban residences',
      to: '/properties?propertyType=apartment',
      icon: Building2,
      count: approvedProperties.filter((p) => p.propertyType === 'apartment').length,
    },
    {
      label: 'Houses & Villas',
      subtitle: 'Standalone architectural homes',
      to: '/properties?propertyType=villa',
      icon: Home,
      count: approvedProperties.filter(
        (p) => p.propertyType === 'villa' || p.propertyType === 'house'
      ).length,
    },
    {
      label: 'Plots & Land',
      subtitle: 'Gated & entitled estate parcels',
      to: '/properties?propertyType=plot',
      icon: Trees,
      count: approvedProperties.filter((p) => p.propertyType === 'plot').length,
    },
    {
      label: 'Office Spaces',
      subtitle: 'Grade-A corporate floorplates',
      to: '/properties?propertyType=office',
      icon: Briefcase,
      count: approvedProperties.filter((p) => p.propertyType === 'office').length,
    },
    {
      label: 'Shops & Retail',
      subtitle: 'High-footfall flagship storefronts',
      to: '/properties?propertyType=retail',
      icon: Store,
      count: approvedProperties.filter((p) => p.propertyType === 'retail').length,
    },
    {
      label: 'New Developments',
      subtitle: 'Direct developer launches',
      to: '/projects',
      icon: Landmark,
      count: state.projects.length,
    },
  ];

  return (
    <div>
      {/* HERO SECTION */}
      <section className="relative bg-[#0B1F38] overflow-hidden">
        <div className="absolute inset-0">
          <SafeImage
            src={ASSET_IMAGES.hero}
            alt="Contemporary luxury glass and limestone residence at twilight"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1F38]/75 via-[#0B1F38]/65 to-[#0B1F38]/85" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-28">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-bold text-white leading-[1.1] tracking-tight text-balance">
              Find a Place You&apos;ll Love to Call Home.
            </h1>
            <p className="mt-5 text-base sm:text-lg text-[#DCE5F0] leading-relaxed max-w-2xl">
              Discover properties, connect with trusted professionals and explore your next
              investment.
            </p>
          </div>

          {/* Search Interface */}
          <div className="mt-10 bg-white rounded-[14px] shadow-xl border border-[#E6EAF0] p-4 sm:p-5 max-w-6xl">
            <div
              role="tablist"
              aria-label="Property search category"
              className="inline-flex items-center gap-1 p-1 bg-[#F5F7FA] rounded-[10px] mb-4"
            >
              {(
                [
                  { id: 'buy', label: 'Buy' },
                  { id: 'rent', label: 'Rent' },
                  { id: 'commercial', label: 'Commercial' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={searchTab === tab.id}
                  onClick={() => {
                    setSearchTab(tab.id);
                    setPropertyType('all');
                    setBudget('');
                  }}
                  className={`px-5 py-2 text-sm font-medium rounded-[8px] transition-colors whitespace-nowrap ${
                    searchTab === tab.id
                      ? 'bg-[#142D4E] text-white'
                      : 'text-[#202B3C] hover:text-[#142D4E]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form
              onSubmit={handleHeroSearch}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end"
            >
              <div className="lg:col-span-3">
                <label
                  htmlFor="hero-location"
                  className="block text-xs font-medium text-[#778397] mb-1.5"
                >
                  Location
                </label>
                <div className="relative">
                  <MapPin
                    className="h-4 w-4 text-[#4778B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    id="hero-location"
                    type="text"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    placeholder="City, locality or project"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px] text-[#202B3C] bg-white focus:border-[#4778B8]"
                  />
                </div>
              </div>

              <div className="lg:col-span-2">
                <label
                  htmlFor="hero-type"
                  className="block text-xs font-medium text-[#778397] mb-1.5"
                >
                  Property Type
                </label>
                <select
                  id="hero-type"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px] text-[#202B3C] bg-white focus:border-[#4778B8]"
                >
                  <option value="all">All Types</option>
                  {searchTab === 'commercial' ? (
                    <>
                      <option value="office">Office Space</option>
                      <option value="retail">Shop / Retail</option>
                    </>
                  ) : (
                    <>
                      <option value="apartment">Apartment / Flat</option>
                      <option value="villa">Villa</option>
                      <option value="house">Independent House</option>
                      <option value="plot">Plot / Land</option>
                    </>
                  )}
                </select>
              </div>

              <div className="lg:col-span-2">
                <label
                  htmlFor="hero-budget"
                  className="block text-xs font-medium text-[#778397] mb-1.5"
                >
                  Max Budget
                </label>
                <select
                  id="hero-budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px] text-[#202B3C] bg-white focus:border-[#4778B8]"
                >
                  <option value="">Any Budget</option>
                  {searchTab === 'rent' ? (
                    <>
                      <option value="5000">Up to $5,000/mo</option>
                      <option value="12500">Up to $12,500/mo</option>
                      <option value="20000">Up to $20,000/mo</option>
                    </>
                  ) : (
                    <>
                      <option value="1500000">Up to $1.5M</option>
                      <option value="2500000">Up to $2.5M</option>
                      <option value="3500000">Up to $3.5M</option>
                    </>
                  )}
                </select>
              </div>

              <div className="lg:col-span-2">
                <label
                  htmlFor="hero-bedrooms"
                  className="block text-xs font-medium text-[#778397] mb-1.5"
                >
                  Bedrooms
                </label>
                <select
                  id="hero-bedrooms"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  disabled={searchTab === 'commercial'}
                  className="w-full px-3 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px] text-[#202B3C] bg-white focus:border-[#4778B8] disabled:bg-[#F5F7FA] disabled:text-[#778397]"
                >
                  <option value="">Any Beds</option>
                  <option value="1">1+ Bedroom</option>
                  <option value="2">2+ Bedrooms</option>
                  <option value="3">3+ Bedrooms</option>
                  <option value="4">4+ Bedrooms</option>
                </select>
              </div>

              <div className="lg:col-span-3">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#142D4E] hover:bg-[#0B1F38] rounded-[10px] transition-colors whitespace-nowrap"
                >
                  <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Search Properties</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 1. FEATURED PROPERTIES */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-medium text-[#4778B8] mb-1.5">Curated Inventory</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#142D4E]">
                Featured Properties
              </h2>
            </div>
            <Link
              to="/properties?sort=featured"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#142D4E] hover:text-[#4778B8] transition-colors"
            >
              <span>Explore All Properties</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* 2. EXPLORE PROPERTIES BY CATEGORY */}
      <section className="py-16 lg:py-20 bg-[#F5F7FA] border-y border-[#E6EAF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-medium text-[#4778B8] mb-1.5">Residential &amp; Commercial</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#142D4E]">
              Explore Properties by Category
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.label}
                  to={cat.to}
                  className="group bg-white border border-[#E6EAF0] rounded-[12px] p-6 hover:border-[#4778B8] hover:shadow-sm transition-all flex items-start justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center justify-center h-10 w-10 rounded-[10px] bg-[#F5F7FA] text-[#142D4E] group-hover:bg-[#142D4E] group-hover:text-white transition-colors mb-2">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="text-base font-semibold text-[#202B3C] group-hover:text-[#142D4E]">
                      {cat.label}
                    </h3>
                    <p className="text-sm text-[#778397]">{cat.subtitle}</p>
                  </div>
                  <span className="font-mono text-xs font-medium text-[#778397] tabular-nums whitespace-nowrap">
                    {cat.count} listed
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. POPULAR LOCATIONS */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-medium text-[#4778B8] mb-1.5">Metropolitan Markets</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#142D4E]">
                Popular Locations
              </h2>
            </div>
            <Link
              to="/guides"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#142D4E] hover:text-[#4778B8] transition-colors"
            >
              <span>View Locality Insights</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {POPULAR_LOCATIONS.map((loc) => (
              <Link
                key={loc.city}
                to={`/properties?city=${encodeURIComponent(loc.city)}`}
                className="group relative rounded-[12px] overflow-hidden border border-[#E6EAF0] aspect-[4/5] bg-[#0B1F38] flex flex-col justify-end"
              >
                <SafeImage
                  src={loc.image}
                  alt={`${loc.city} real estate district`}
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F38]/90 via-[#0B1F38]/35 to-transparent" />
                <div className="relative p-4 text-white">
                  <h3 className="font-display text-lg font-bold">{loc.city}</h3>
                  <p className="text-xs text-[#DCE5F0] mt-0.5 line-clamp-1">{loc.listingsLabel}</p>
                  <p className="text-xs font-mono tabular-nums text-white/90 mt-2">
                    Avg. ${loc.avgPriceSqFt}/sq. ft.
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. NEWLY ADDED PROPERTIES */}
      <section className="py-16 lg:py-20 bg-[#F5F7FA] border-y border-[#E6EAF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-medium text-[#4778B8] mb-1.5">Latest Market Arrivals</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#142D4E]">
                Newly Added Properties
              </h2>
            </div>
            <Link
              to="/properties?sort=newest"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#142D4E] hover:text-[#4778B8] transition-colors"
            >
              <span>Browse Newest Listings</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newlyAddedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. FEATURED DEVELOPERS */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-medium text-[#4778B8] mb-1.5">Institutional Builders</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#142D4E]">
                Featured Developers
              </h2>
            </div>
            <Link
              to="/developers"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#142D4E] hover:text-[#4778B8] transition-colors"
            >
              <span>All Developers</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {state.developers.slice(0, 4).map((dev) => (
              <Link
                key={dev.id}
                to="/developers"
                className="group bg-white border border-[#E6EAF0] rounded-[12px] p-6 hover:border-[#4778B8] transition-colors flex flex-col justify-between gap-5"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="h-11 w-11 rounded-[10px] bg-[#142D4E] text-white font-display font-bold text-sm flex items-center justify-center">
                      {dev.monogram}
                    </div>
                    {dev.verified && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-[#142D4E]">
                        <ShieldCheck className="h-3.5 w-3.5 text-[#4778B8]" aria-hidden="true" />
                        Verified
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-[#202B3C] group-hover:text-[#142D4E]">
                    {dev.companyName}
                  </h3>
                  <p className="text-xs text-[#778397] mt-1 line-clamp-2 leading-relaxed">
                    {dev.tagline}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E6EAF0] flex items-center justify-between text-xs text-[#778397] tabular-nums">
                  <span>{dev.yearsExperience} yrs experience</span>
                  <span className="font-medium text-[#202B3C]">
                    {dev.completedProjects + dev.ongoingProjects} projects
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TRUSTED REAL ESTATE AGENTS */}
      <section className="py-16 lg:py-20 bg-[#F5F7FA] border-y border-[#E6EAF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-medium text-[#4778B8] mb-1.5">Verified Advisory Network</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#142D4E]">
                Trusted Real Estate Agents
              </h2>
            </div>
            <Link
              to="/agents"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#142D4E] hover:text-[#4778B8] transition-colors"
            >
              <span>Browse Agent Directory</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {state.agents.slice(0, 4).map((agent) => (
              <div
                key={agent.id}
                className="bg-white border border-[#E6EAF0] rounded-[12px] p-5 flex flex-col justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <SafeImage
                    src={agent.photo}
                    alt={agent.fullName}
                    className="h-14 w-14 rounded-[10px] object-cover shrink-0 border border-[#E6EAF0]"
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-[#202B3C] truncate">
                      {agent.fullName}
                    </h3>
                    <p className="text-xs text-[#778397] truncate mt-0.5">{agent.agency}</p>
                    {agent.verified && (
                      <p className="inline-flex items-center gap-1 text-xs font-medium text-[#142D4E] mt-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-[#4778B8]" aria-hidden="true" />
                        Verified Advisor
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-xs text-[#778397] space-y-1">
                  <p className="text-[#202B3C] font-medium line-clamp-1">{agent.specialization}</p>
                  <p className="tabular-nums">
                    {agent.yearsExperience} years exp · {agent.serviceLocations.slice(0, 2).join(', ')}
                  </p>
                </div>

                <Link
                  to="/agents"
                  className="text-xs font-semibold text-[#142D4E] hover:text-[#4778B8] pt-3 border-t border-[#E6EAF0] inline-flex items-center justify-between"
                >
                  <span>View Profile &amp; Enquire</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. NEW RESIDENTIAL PROJECTS */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-medium text-[#4778B8] mb-1.5">Direct from Developers</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#142D4E]">
                New Residential Projects
              </h2>
            </div>
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#142D4E] hover:text-[#4778B8] transition-colors"
            >
              <span>View All Developments</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {residentialProjects.map((project) => (
              <article
                key={project.id}
                className="group bg-white border border-[#E6EAF0] rounded-[12px] overflow-hidden hover:border-[#4778B8] transition-all flex flex-col"
              >
                <div className="aspect-[4/3] bg-[#F5F7FA] overflow-hidden">
                  <Link to={`/projects/${project.id}`} className="block h-full w-full">
                    <SafeImage
                      src={project.images[0]}
                      alt={project.name}
                      className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />
                  </Link>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <p className="text-xs text-[#778397]">
                      <span className="font-medium text-[#4778B8]">{project.status}</span> ·{' '}
                      <span>Possession {project.possessionTimeline}</span>
                    </p>
                    <h3 className="mt-1.5 text-base font-semibold text-[#202B3C] group-hover:text-[#142D4E]">
                      <Link to={`/projects/${project.id}`}>{project.name}</Link>
                    </h3>
                    <p className="text-xs text-[#778397] mt-1">
                      By {project.developerName} · {project.locality}, {project.city}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E6EAF0] flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-[#778397]">Starting From</p>
                      <p className="font-display text-base font-bold text-[#142D4E] tabular-nums">
                        {formatCurrency(project.startingPrice)}
                      </p>
                    </div>
                    <Link
                      to={`/projects/${project.id}`}
                      className="text-sm font-medium text-[#142D4E] hover:text-[#4778B8]"
                    >
                      Project Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 8. WHY CHOOSE US */}
      <section className="py-16 lg:py-20 bg-[#F5F7FA] border-t border-[#E6EAF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-medium text-[#4778B8] mb-1.5">Marketplace Standards</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#142D4E]">
              Why Choose Meridian Estates?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: 'Verified Listings & Professionals',
                body: 'Every featured property, broker, and developer undergoes RERA and ownership documentation review prior to approval.',
              },
              {
                icon: FileCheck2,
                title: 'Transparent Pricing & Area Data',
                body: 'Clear built-up vs. carpet area disclosures, floor plans, and indicative EMI estimators help buyers compare accurately.',
              },
              {
                icon: Users,
                title: 'Direct Lead & Visit Attribution',
                body: 'Every enquiry generates a trackable Lead ID routed directly to the verified owner, broker, or developer desk.',
              },
              {
                icon: Compass,
                title: 'Residential & Commercial Depth',
                body: 'From metropolitan penthouses and coastal estate plots to Grade-A corporate floorplates in one unified marketplace.',
              },
            ].map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div key={pillar.title} className="bg-white border border-[#E6EAF0] rounded-[12px] p-6">
                  <Icon className="h-6 w-6 text-[#142D4E] mb-4" aria-hidden="true" />
                  <h3 className="text-base font-semibold text-[#202B3C]">{pillar.title}</h3>
                  <p className="mt-2 text-sm text-[#778397] leading-relaxed">{pillar.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. LIST YOUR PROPERTY CTA */}
      <section className="py-16 lg:py-20 bg-[#142D4E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-[#9AC0EE] mb-2">
              For Owners, Brokers &amp; Developers
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white text-balance">
              Present Your Property to Qualified Buyers and Corporate Tenants.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#CBD7E6] leading-relaxed">
              Submit residential homes, commercial spaces, or new development portfolios through
              our structured verification workflow and manage every enquiry from one dashboard.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/list-property"
              className="px-6 py-3.5 text-sm font-semibold text-[#142D4E] bg-white hover:bg-[#F5F7FA] rounded-[10px] transition-colors whitespace-nowrap"
            >
              List Your Property
            </Link>
            <Link
              to="/auth"
              className="px-6 py-3.5 text-sm font-semibold text-white border border-white/25 hover:bg-white/10 rounded-[10px] transition-colors whitespace-nowrap"
            >
              Create Partner Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
