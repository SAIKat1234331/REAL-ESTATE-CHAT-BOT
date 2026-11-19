import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  LayoutGrid,
  List,
  Map as MapIcon,
  SlidersHorizontal,
  RotateCcw,
  Scale,
  X,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import type {
  AvailabilityStatus,
  FurnishingStatus,
  ListingType,
  PropertyCategory,
  PropertyType,
  SortOption,
} from '../types/marketplace';
import { filterProperties, sortProperties } from '../utils/propertyFilters';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyMapExplorer } from '../components/PropertyMapExplorer';

const PAGE_SIZE = 6;

export const PropertiesPage: React.FC = () => {
  const { state } = useMarketplace();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [city, setCity] = useState(searchParams.get('city') ?? 'all');
  const [listingType, setListingType] = useState<ListingType | 'all'>(
    (searchParams.get('listingType') as ListingType | 'all') ?? 'all'
  );
  const [category, setCategory] = useState<PropertyCategory | 'all'>(
    (searchParams.get('category') as PropertyCategory | 'all') ?? 'all'
  );
  const [propertyType, setPropertyType] = useState<PropertyType | 'all'>(
    (searchParams.get('propertyType') as PropertyType | 'all') ?? 'all'
  );
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '');
  const [minBedrooms, setMinBedrooms] = useState(searchParams.get('minBedrooms') ?? '');
  const [minBathrooms, setMinBathrooms] = useState('');
  const [minArea, setMinArea] = useState('');
  const [maxArea, setMaxArea] = useState('');
  const [furnishing, setFurnishing] = useState<FurnishingStatus | 'all'>('all');
  const [availability, setAvailability] = useState<AvailabilityStatus | 'all'>('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams.get('sort') as SortOption) ?? 'newest'
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [compareNotice, setCompareNotice] = useState<string | null>(null);

  // Sync URL query params when top navigation links change
  useEffect(() => {
    setQuery(searchParams.get('q') ?? '');
    setCity(searchParams.get('city') ?? 'all');
    setListingType((searchParams.get('listingType') as ListingType | 'all') ?? 'all');
    setCategory((searchParams.get('category') as PropertyCategory | 'all') ?? 'all');
    setPropertyType((searchParams.get('propertyType') as PropertyType | 'all') ?? 'all');
    setMinPrice(searchParams.get('minPrice') ?? '');
    setMaxPrice(searchParams.get('maxPrice') ?? '');
    setMinBedrooms(searchParams.get('minBedrooms') ?? '');
    setSortBy((searchParams.get('sort') as SortOption) ?? 'newest');
    setVisibleCount(PAGE_SIZE);
  }, [searchParams]);

  const availableCities = useMemo(() => {
    const unique = Array.from(
      new Set(
        state.properties
          .filter((p) => p.approvalStatus === 'approved')
          .map((p) => p.city)
      )
    );
    return unique.sort();
  }, [state.properties]);

  const filteredAndSorted = useMemo(() => {
    const filtered = filterProperties(state.properties, {
      query,
      city,
      listingType,
      category,
      propertyType,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minBedrooms: minBedrooms ? Number(minBedrooms) : undefined,
      minBathrooms: minBathrooms ? Number(minBathrooms) : undefined,
      minArea: minArea ? Number(minArea) : undefined,
      maxArea: maxArea ? Number(maxArea) : undefined,
      furnishing,
      availability,
      verifiedOnly,
    });
    return sortProperties(filtered, sortBy);
  }, [
    state.properties,
    query,
    city,
    listingType,
    category,
    propertyType,
    minPrice,
    maxPrice,
    minBedrooms,
    minBathrooms,
    minArea,
    maxArea,
    furnishing,
    availability,
    verifiedOnly,
    sortBy,
  ]);

  const visibleProperties = filteredAndSorted.slice(0, visibleCount);

  const recentlyViewed = useMemo(
    () =>
      state.recentlyViewedIds
        .map((id) => state.properties.find((p) => p.id === id && p.approvalStatus === 'approved'))
        .filter((p): p is NonNullable<typeof p> => Boolean(p))
        .slice(0, 3),
    [state.recentlyViewedIds, state.properties]
  );

  const resetFilters = () => {
    setQuery('');
    setCity('all');
    setListingType('all');
    setCategory('all');
    setPropertyType('all');
    setMinPrice('');
    setMaxPrice('');
    setMinBedrooms('');
    setMinBathrooms('');
    setMinArea('');
    setMaxArea('');
    setFurnishing('all');
    setAvailability('all');
    setVerifiedOnly(false);
    setSortBy('newest');
    setSearchParams({});
  };

  const renderFilterForm = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-[#E6EAF0]">
        <h2 className="text-sm font-semibold text-[#142D4E]">Filter Properties</h2>
        <button
          type="button"
          onClick={resetFilters}
          className="inline-flex items-center gap-1 text-xs font-medium text-[#4778B8] hover:text-[#142D4E]"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Reset All
        </button>
      </div>

      <div>
        <label htmlFor="flt-query" className="block text-xs font-medium text-[#202B3C] mb-1.5">
          Location or Keyword
        </label>
        <input
          id="flt-query"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Locality, street, property ID..."
          className="w-full px-3 py-2 text-sm border border-[#E6EAF0] rounded-[8px] bg-white text-[#202B3C]"
        />
      </div>

      <div>
        <label htmlFor="flt-city" className="block text-xs font-medium text-[#202B3C] mb-1.5">
          City
        </label>
        <select
          id="flt-city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-[#E6EAF0] rounded-[8px] bg-white text-[#202B3C]"
        >
          <option value="all">All Cities</option>
          {availableCities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="flt-listing" className="block text-xs font-medium text-[#202B3C] mb-1.5">
            Buy / Rent
          </label>
          <select
            id="flt-listing"
            value={listingType}
            onChange={(e) => setListingType(e.target.value as ListingType | 'all')}
            className="w-full px-2.5 py-2 text-sm border border-[#E6EAF0] rounded-[8px] bg-white text-[#202B3C]"
          >
            <option value="all">All</option>
            <option value="sale">Buy</option>
            <option value="rent">Rent</option>
          </select>
        </div>

        <div>
          <label htmlFor="flt-category" className="block text-xs font-medium text-[#202B3C] mb-1.5">
            Category
          </label>
          <select
            id="flt-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as PropertyCategory | 'all')}
            className="w-full px-2.5 py-2 text-sm border border-[#E6EAF0] rounded-[8px] bg-white text-[#202B3C]"
          >
            <option value="all">All</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="flt-prop-type" className="block text-xs font-medium text-[#202B3C] mb-1.5">
          Property Type
        </label>
        <select
          id="flt-prop-type"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value as PropertyType | 'all')}
          className="w-full px-3 py-2 text-sm border border-[#E6EAF0] rounded-[8px] bg-white text-[#202B3C]"
        >
          <option value="all">All Property Types</option>
          <option value="apartment">Apartment / Flat</option>
          <option value="villa">Villa</option>
          <option value="house">Independent House</option>
          <option value="plot">Plot / Land</option>
          <option value="office">Office Space</option>
          <option value="retail">Shop / Retail</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="flt-min-price" className="block text-xs font-medium text-[#202B3C] mb-1.5">
            Min Price ($)
          </label>
          <input
            id="flt-min-price"
            type="number"
            min={0}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="0"
            className="w-full px-3 py-2 text-sm border border-[#E6EAF0] rounded-[8px] bg-white text-[#202B3C] tabular-nums"
          />
        </div>
        <div>
          <label htmlFor="flt-max-price" className="block text-xs font-medium text-[#202B3C] mb-1.5">
            Max Price ($)
          </label>
          <input
            id="flt-max-price"
            type="number"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Any"
            className="w-full px-3 py-2 text-sm border border-[#E6EAF0] rounded-[8px] bg-white text-[#202B3C] tabular-nums"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="flt-beds" className="block text-xs font-medium text-[#202B3C] mb-1.5">
            Bedrooms
          </label>
          <select
            id="flt-beds"
            value={minBedrooms}
            onChange={(e) => setMinBedrooms(e.target.value)}
            className="w-full px-2.5 py-2 text-sm border border-[#E6EAF0] rounded-[8px] bg-white text-[#202B3C]"
          >
            <option value="">Any</option>
            <option value="1">1+ Bed</option>
            <option value="2">2+ Beds</option>
            <option value="3">3+ Beds</option>
            <option value="4">4+ Beds</option>
            <option value="5">5+ Beds</option>
          </select>
        </div>

        <div>
          <label htmlFor="flt-baths" className="block text-xs font-medium text-[#202B3C] mb-1.5">
            Bathrooms
          </label>
          <select
            id="flt-baths"
            value={minBathrooms}
            onChange={(e) => setMinBathrooms(e.target.value)}
            className="w-full px-2.5 py-2 text-sm border border-[#E6EAF0] rounded-[8px] bg-white text-[#202B3C]"
          >
            <option value="">Any</option>
            <option value="1">1+ Bath</option>
            <option value="2">2+ Baths</option>
            <option value="3">3+ Baths</option>
            <option value="4">4+ Baths</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="flt-min-area" className="block text-xs font-medium text-[#202B3C] mb-1.5">
            Min Area (sq. ft.)
          </label>
          <input
            id="flt-min-area"
            type="number"
            min={0}
            value={minArea}
            onChange={(e) => setMinArea(e.target.value)}
            placeholder="0"
            className="w-full px-3 py-2 text-sm border border-[#E6EAF0] rounded-[8px] bg-white text-[#202B3C] tabular-nums"
          />
        </div>
        <div>
          <label htmlFor="flt-max-area" className="block text-xs font-medium text-[#202B3C] mb-1.5">
            Max Area (sq. ft.)
          </label>
          <input
            id="flt-max-area"
            type="number"
            min={0}
            value={maxArea}
            onChange={(e) => setMaxArea(e.target.value)}
            placeholder="Any"
            className="w-full px-3 py-2 text-sm border border-[#E6EAF0] rounded-[8px] bg-white text-[#202B3C] tabular-nums"
          />
        </div>
      </div>

      <div>
        <label htmlFor="flt-furnishing" className="block text-xs font-medium text-[#202B3C] mb-1.5">
          Furnishing Status
        </label>
        <select
          id="flt-furnishing"
          value={furnishing}
          onChange={(e) => setFurnishing(e.target.value as FurnishingStatus | 'all')}
          className="w-full px-3 py-2 text-sm border border-[#E6EAF0] rounded-[8px] bg-white text-[#202B3C]"
        >
          <option value="all">Any Furnishing</option>
          <option value="furnished">Fully Furnished</option>
          <option value="semi-furnished">Semi-Furnished</option>
          <option value="unfurnished">Unfurnished</option>
        </select>
      </div>

      <div>
        <label htmlFor="flt-availability" className="block text-xs font-medium text-[#202B3C] mb-1.5">
          Property Availability
        </label>
        <select
          id="flt-availability"
          value={availability}
          onChange={(e) => setAvailability(e.target.value as AvailabilityStatus | 'all')}
          className="w-full px-3 py-2 text-sm border border-[#E6EAF0] rounded-[8px] bg-white text-[#202B3C]"
        >
          <option value="all">Any Availability</option>
          <option value="ready-to-move">Ready to Move</option>
          <option value="under-construction">Under Construction</option>
          <option value="available-soon">Available Soon</option>
        </select>
      </div>

      <label className="flex items-center gap-2.5 pt-2 cursor-pointer">
        <input
          type="checkbox"
          checked={verifiedOnly}
          onChange={(e) => setVerifiedOnly(e.target.checked)}
          className="h-4 w-4 rounded border-[#E6EAF0] accent-[#142D4E]"
        />
        <span className="text-sm font-medium text-[#202B3C]">Verified Listings Only</span>
      </label>
    </div>
  );

  return (
    <div className="bg-[#F5F7FA] min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b border-[#E6EAF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[#4778B8] mb-1">Property Search &amp; Discovery</p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#142D4E]">
              Explore Verified Properties
            </h1>
            <p className="text-sm text-[#778397] mt-1 tabular-nums">
              Showing {filteredAndSorted.length} approved{' '}
              {filteredAndSorted.length === 1 ? 'listing' : 'listings'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {state.comparePropertyIds.length > 0 && (
              <Link
                to="/compare"
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#142D4E] bg-[#F5F7FA] border border-[#E6EAF0] hover:border-[#4778B8] rounded-[8px] whitespace-nowrap"
              >
                <Scale className="h-3.5 w-3.5 text-[#4778B8]" aria-hidden="true" />
                <span>Compare ({state.comparePropertyIds.length})</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#142D4E] bg-white border border-[#E6EAF0] rounded-[8px]"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
              Filters
            </button>

            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="text-xs text-[#778397] whitespace-nowrap">
                Sort by
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 text-xs font-medium border border-[#E6EAF0] rounded-[8px] bg-white text-[#202B3C]"
              >
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="featured">Featured Properties</option>
              </select>
            </div>

            <div
              role="group"
              aria-label="Layout view switcher"
              className="inline-flex items-center p-1 bg-[#F5F7FA] border border-[#E6EAF0] rounded-[8px]"
            >
              {(
                [
                  { id: 'grid', label: 'Grid View', icon: LayoutGrid },
                  { id: 'list', label: 'List View', icon: List },
                  { id: 'map', label: 'Map View', icon: MapIcon },
                ] as const
              ).map((item) => {
                const Icon = item.icon;
                const active = viewMode === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={item.label}
                    aria-pressed={active}
                    onClick={() => setViewMode(item.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-[6px] transition-colors ${
                      active
                        ? 'bg-white text-[#142D4E] shadow-xs'
                        : 'text-[#778397] hover:text-[#202B3C]'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    <span className="hidden sm:inline">{item.id.charAt(0).toUpperCase() + item.id.slice(1)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {compareNotice && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-white border border-[#4778B8] rounded-[10px] px-4 py-3 flex items-center justify-between text-sm text-[#142D4E]">
            <span>{compareNotice}</span>
            <button
              type="button"
              onClick={() => setCompareNotice(null)}
              aria-label="Dismiss notice"
              className="text-[#778397] hover:text-[#142D4E]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block lg:col-span-3 bg-white border border-[#E6EAF0] rounded-[12px] p-5 sticky top-20">
            {renderFilterForm()}
          </aside>

          {/* Mobile Filter Drawer */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden bg-[#0B1F38]/50 flex justify-end">
              <div className="w-full max-w-sm bg-white h-full overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display font-semibold text-[#142D4E]">Search Filters</span>
                  <button
                    type="button"
                    onClick={() => setMobileFiltersOpen(false)}
                    aria-label="Close filters"
                    className="h-10 w-10 inline-flex items-center justify-center rounded-[8px] border border-[#E6EAF0]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {renderFilterForm()}
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="mt-6 w-full py-3 text-sm font-semibold text-white bg-[#142D4E] rounded-[10px]"
                >
                  Show {filteredAndSorted.length} Properties
                </button>
              </div>
            </div>
          )}

          {/* Results Area */}
          <div className="lg:col-span-9 space-y-6">
            {viewMode === 'map' ? (
              <PropertyMapExplorer properties={filteredAndSorted} />
            ) : filteredAndSorted.length === 0 ? (
              <div className="bg-white border border-[#E6EAF0] rounded-[12px] p-12 text-center">
                <h2 className="text-lg font-semibold text-[#142D4E]">
                  No properties match your current filters
                </h2>
                <p className="text-sm text-[#778397] mt-2 max-w-md mx-auto">
                  Try widening your budget range, clearing bedroom constraints, or exploring nearby
                  cities.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 px-5 py-2.5 text-sm font-medium text-white bg-[#142D4E] hover:bg-[#0B1F38] rounded-[10px]"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                      : 'space-y-5'
                  }
                >
                  {visibleProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      viewMode={viewMode}
                      onCompareNotice={setCompareNotice}
                    />
                  ))}
                </div>

                {visibleCount < filteredAndSorted.length && (
                  <div className="pt-4 text-center">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                      className="px-6 py-3 text-sm font-medium text-[#142D4E] bg-white border border-[#E6EAF0] hover:border-[#142D4E] rounded-[10px] transition-colors"
                    >
                      Load More Properties ({filteredAndSorted.length - visibleCount} remaining)
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Recently Viewed Properties */}
            {recentlyViewed.length > 0 && (
              <section className="pt-8 border-t border-[#E6EAF0]">
                <h2 className="font-display text-lg font-semibold text-[#142D4E] mb-4">
                  Recently Viewed Properties
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {recentlyViewed.map((prop) => (
                    <PropertyCard key={prop.id} property={prop} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
