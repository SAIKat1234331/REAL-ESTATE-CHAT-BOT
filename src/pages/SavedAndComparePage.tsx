import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Scale, X, ArrowRight } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { calculatePricePerSqFt, formatCurrency, formatListingPrice } from '../utils/finance';
import {
  formatAvailabilityLabel,
  formatFurnishingLabel,
  formatPropertyTypeLabel,
} from '../utils/propertyFilters';
import { PropertyCard } from '../components/PropertyCard';
import { SafeImage } from '../components/SafeImage';

interface SavedAndComparePageProps {
  defaultTab: 'saved' | 'compare';
}

export const SavedAndComparePage: React.FC<SavedAndComparePageProps> = ({ defaultTab }) => {
  const { state, toggleCompareProperty, clearCompareProperties } = useMarketplace();

  const savedProperties = state.savedPropertyIds
    .map((id) => state.properties.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const comparedProperties = state.comparePropertyIds
    .map((id) => state.properties.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="bg-[#F5F7FA] min-h-screen pb-16">
      <div className="bg-white border-b border-[#E6EAF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[#4778B8] mb-1">Shortlist &amp; Evaluation</p>
            <h1 className="font-display text-3xl font-bold text-[#142D4E]">
              {defaultTab === 'saved' ? 'Saved Properties' : 'Property Comparison'}
            </h1>
          </div>

          <div className="inline-flex p-1 bg-[#F5F7FA] border border-[#E6EAF0] rounded-[10px]">
            <Link
              to="/saved"
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-[8px] ${
                defaultTab === 'saved'
                  ? 'bg-white text-[#142D4E] shadow-xs'
                  : 'text-[#778397] hover:text-[#202B3C]'
              }`}
            >
              <Heart className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Wishlist ({savedProperties.length})</span>
            </Link>
            <Link
              to="/compare"
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-[8px] ${
                defaultTab === 'compare'
                  ? 'bg-white text-[#142D4E] shadow-xs'
                  : 'text-[#778397] hover:text-[#202B3C]'
              }`}
            >
              <Scale className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Compare ({comparedProperties.length})</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {defaultTab === 'saved' ? (
          savedProperties.length === 0 ? (
            <div className="bg-white border border-[#E6EAF0] rounded-[12px] p-12 text-center">
              <Heart className="h-8 w-8 text-[#778397] mx-auto mb-3" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-[#142D4E]">Your wishlist is empty</h2>
              <p className="text-sm text-[#778397] mt-1">
                Save residential or commercial properties while exploring to review them later.
              </p>
              <Link
                to="/properties"
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#142D4E] rounded-[10px]"
              >
                Browse Properties
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          )
        ) : comparedProperties.length === 0 ? (
          <div className="bg-white border border-[#E6EAF0] rounded-[12px] p-12 text-center">
            <Scale className="h-8 w-8 text-[#778397] mx-auto mb-3" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-[#142D4E]">No properties selected to compare</h2>
            <p className="text-sm text-[#778397] mt-1">
              Click the compare icon on up to 4 properties to inspect pricing, area, and legal
              credentials side by side.
            </p>
            <Link
              to="/properties"
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#142D4E] rounded-[10px]"
            >
              Explore Listings
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-[#E6EAF0] rounded-[12px] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E6EAF0] flex items-center justify-between">
              <p className="text-sm font-medium text-[#202B3C]">
                Comparing {comparedProperties.length} of 4 maximum properties
              </p>
              <button
                type="button"
                onClick={clearCompareProperties}
                className="text-xs font-medium text-[#778397] hover:text-[#142D4E]"
              >
                Clear Comparison
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[#E6EAF0] align-top">
                    <th className="p-5 w-48 text-xs font-semibold text-[#778397] bg-[#F5F7FA]">
                      Specification
                    </th>
                    {comparedProperties.map((prop) => (
                      <th key={prop.id} className="p-5 min-w-[240px] font-normal">
                        <div className="relative aspect-[4/3] rounded-[8px] overflow-hidden bg-[#F5F7FA] mb-3">
                          <SafeImage
                            src={prop.images[0]}
                            alt={prop.title}
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => toggleCompareProperty(prop.id)}
                            aria-label={`Remove ${prop.title} from comparison`}
                            className="absolute top-2 right-2 h-7 w-7 rounded-[6px] bg-white/95 text-[#202B3C] inline-flex items-center justify-center hover:bg-white"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <Link
                          to={`/properties/${prop.id}`}
                          className="font-semibold text-[#142D4E] hover:text-[#4778B8] block line-clamp-2"
                        >
                          {prop.title}
                        </Link>
                        <p className="text-xs text-[#778397] mt-0.5">
                          {prop.locality}, {prop.city}
                        </p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6EAF0]">
                  {[
                    {
                      label: 'Price',
                      render: (p: (typeof comparedProperties)[0]) => (
                        <span className="font-display font-bold text-[#142D4E] tabular-nums">
                          {formatListingPrice(p.price, p.priceUnit)}
                        </span>
                      ),
                    },
                    {
                      label: 'Price / sq. ft.',
                      render: (p: (typeof comparedProperties)[0]) => (
                        <span className="font-mono text-xs tabular-nums">
                          {p.priceUnit === 'total'
                            ? `${formatCurrency(calculatePricePerSqFt(p.price, p.builtUpAreaSqFt))}/sq. ft.`
                            : 'Monthly Lease'}
                        </span>
                      ),
                    },
                    {
                      label: 'Property Type',
                      render: (p: (typeof comparedProperties)[0]) =>
                        formatPropertyTypeLabel(p.propertyType),
                    },
                    {
                      label: 'Built-Up Area',
                      render: (p: (typeof comparedProperties)[0]) => (
                        <span className="font-mono tabular-nums">
                          {p.builtUpAreaSqFt.toLocaleString()} sq. ft.
                        </span>
                      ),
                    },
                    {
                      label: 'Carpet Area',
                      render: (p: (typeof comparedProperties)[0]) => (
                        <span className="font-mono tabular-nums">
                          {p.carpetAreaSqFt.toLocaleString()} sq. ft.
                        </span>
                      ),
                    },
                    {
                      label: 'Bedrooms / Baths',
                      render: (p: (typeof comparedProperties)[0]) =>
                        p.bedrooms > 0 ? `${p.bedrooms} Bed · ${p.bathrooms} Bath` : 'Commercial / Land',
                    },
                    {
                      label: 'Furnishing',
                      render: (p: (typeof comparedProperties)[0]) =>
                        formatFurnishingLabel(p.furnishing),
                    },
                    {
                      label: 'Availability',
                      render: (p: (typeof comparedProperties)[0]) =>
                        formatAvailabilityLabel(p.availability),
                    },
                    {
                      label: 'Verification & RERA',
                      render: (p: (typeof comparedProperties)[0]) => (
                        <span className="font-mono text-xs">
                          {p.verified ? 'Verified' : 'Standard'} · {p.reraId ?? 'N/A'}
                        </span>
                      ),
                    },
                    {
                      label: 'Action',
                      render: (p: (typeof comparedProperties)[0]) => (
                        <Link
                          to={`/properties/${p.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#142D4E] hover:text-[#4778B8]"
                        >
                          <span>Inspect Listing</span>
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                      ),
                    },
                  ].map((row) => (
                    <tr key={row.label}>
                      <td className="p-4 text-xs font-medium text-[#778397] bg-[#F5F7FA]">
                        {row.label}
                      </td>
                      {comparedProperties.map((prop) => (
                        <td key={`${row.label}-${prop.id}`} className="p-4 text-[#202B3C]">
                          {row.render(prop)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
