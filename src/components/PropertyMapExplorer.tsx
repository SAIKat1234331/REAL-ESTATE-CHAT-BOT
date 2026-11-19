import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import type { Property } from '../types/marketplace';
import { formatCurrency, formatListingPrice } from '../utils/finance';
import { formatPropertyTypeLabel } from '../utils/propertyFilters';
import { SafeImage } from './SafeImage';

interface PropertyMapExplorerProps {
  properties: Property[];
  selectedPropertyId?: string;
}

const DISTRICT_LABELS = [
  { name: 'San Diego / Del Mar', x: 20, y: 30 },
  { name: 'Austin Metro', x: 42, y: 55 },
  { name: 'Chicago North', x: 58, y: 68 },
  { name: 'Seattle / Bellevue', x: 67, y: 20 },
  { name: 'Boston / Seaport', x: 81, y: 34 },
];

export const PropertyMapExplorer: React.FC<PropertyMapExplorerProps> = ({
  properties,
  selectedPropertyId,
}) => {
  const [activeId, setActiveId] = useState<string>(
    selectedPropertyId ?? properties[0]?.id ?? ''
  );

  const activeProperty =
    properties.find((p) => p.id === activeId) ?? properties[0] ?? null;

  return (
    <div className="bg-white border border-[#E6EAF0] rounded-[12px] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
      {/* Interactive Vector District Map */}
      <div className="lg:col-span-8 relative min-h-[420px] bg-[#F5F7FA] border-b lg:border-b-0 lg:border-r border-[#E6EAF0] overflow-hidden">
        <div className="absolute top-4 left-4 z-10 bg-white/95 border border-[#E6EAF0] rounded-[8px] px-3 py-1.5 text-xs text-[#778397]">
          Interactive Market Map · {properties.length}{' '}
          {properties.length === 1 ? 'property' : 'properties'} plotted (demo coordinates)
        </div>

        {/* Architectural Grid & Waterway Backdrop SVG */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1000 600"
          className="absolute inset-0 h-full w-full object-cover"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="mapGrid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#E6EAF0" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="1000" height="600" fill="#F5F7FA" />
          <rect width="1000" height="600" fill="url(#mapGrid)" />
          {/* Subtle topographic arterial lines */}
          <path
            d="M 0 380 Q 260 320 480 350 T 1000 280"
            fill="none"
            stroke="#DCE4EE"
            strokeWidth="10"
          />
          <path
            d="M 180 0 Q 250 280 320 600"
            fill="none"
            stroke="#E3E9F2"
            strokeWidth="4"
          />
          <path
            d="M 640 0 Q 610 260 690 600"
            fill="none"
            stroke="#E3E9F2"
            strokeWidth="4"
          />
          <path
            d="M 0 160 Q 450 210 1000 130"
            fill="none"
            stroke="#E3E9F2"
            strokeWidth="3"
          />
        </svg>

        {/* District reference text */}
        {DISTRICT_LABELS.map((d) => (
          <span
            key={d.name}
            style={{ left: `${d.x}%`, top: `${d.y}%` }}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-[11px] font-medium text-[#778397]/80 whitespace-nowrap select-none"
          >
            {d.name}
          </span>
        ))}

        {/* Interactive Property Markers */}
        {properties.map((property) => {
          const isSelected = activeProperty?.id === property.id;
          return (
            <button
              key={property.id}
              type="button"
              onClick={() => setActiveId(property.id)}
              style={{
                left: `${property.coordinates.x}%`,
                top: `${property.coordinates.y}%`,
              }}
              aria-label={`Select ${property.title} in ${property.city} priced at ${formatListingPrice(property.price, property.priceUnit)}`}
              className={`absolute -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded-[8px] text-xs font-mono font-semibold tabular-nums transition-all cursor-pointer border ${
                isSelected
                  ? 'z-20 bg-[#142D4E] text-white border-[#0B1F38] shadow-md scale-105'
                  : 'z-10 bg-white text-[#142D4E] border-[#CBD5E1] hover:border-[#142D4E] shadow-sm'
              }`}
            >
              {formatCurrency(property.price, true)}
            </button>
          );
        })}
      </div>

      {/* Selected Property Preview Panel */}
      <div className="lg:col-span-4 p-6 flex flex-col justify-between bg-white">
        {activeProperty ? (
          <div className="space-y-4">
            <div className="aspect-[4/3] rounded-[10px] overflow-hidden bg-[#F5F7FA]">
              <SafeImage
                src={activeProperty.images[0]}
                alt={activeProperty.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <p className="text-xs text-[#778397]">
                {activeProperty.listingType === 'sale' ? 'For Sale' : 'For Rent'} ·{' '}
                {formatPropertyTypeLabel(activeProperty.propertyType)}
              </p>
              <p className="font-display text-2xl font-bold text-[#142D4E] tabular-nums mt-1">
                {formatListingPrice(activeProperty.price, activeProperty.priceUnit)}
              </p>
              <h3 className="text-base font-semibold text-[#202B3C] mt-1">
                {activeProperty.title}
              </h3>
              <p className="text-sm text-[#778397] flex items-center gap-1.5 mt-1">
                <MapPin className="h-3.5 w-3.5 text-[#4778B8]" aria-hidden="true" />
                {activeProperty.locality}, {activeProperty.city}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 py-3 border-y border-[#E6EAF0] text-center">
              <div>
                <p className="text-xs text-[#778397]">Area</p>
                <p className="text-sm font-semibold text-[#202B3C] tabular-nums">
                  {activeProperty.builtUpAreaSqFt.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#778397]">Beds</p>
                <p className="text-sm font-semibold text-[#202B3C] tabular-nums">
                  {activeProperty.bedrooms > 0 ? activeProperty.bedrooms : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#778397]">Baths</p>
                <p className="text-sm font-semibold text-[#202B3C] tabular-nums">
                  {activeProperty.bathrooms > 0 ? activeProperty.bathrooms : '—'}
                </p>
              </div>
            </div>

            <Link
              to={`/properties/${activeProperty.id}`}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#142D4E] hover:bg-[#0B1F38] rounded-[10px] transition-colors"
            >
              <span>Inspect Property Details</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <MapPin className="h-8 w-8 text-[#778397] mb-3" aria-hidden="true" />
            <p className="text-sm font-medium text-[#202B3C]">No properties match your filters</p>
            <p className="text-xs text-[#778397] mt-1">
              Adjust your criteria to explore listings on the market map.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
