import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Scale, ShieldCheck, MapPin } from 'lucide-react';
import type { Property } from '../types/marketplace';
import { useMarketplace } from '../context/MarketplaceContext';
import { formatListingPrice } from '../utils/finance';
import { formatAvailabilityLabel, formatPropertyTypeLabel } from '../utils/propertyFilters';
import { SafeImage } from './SafeImage';

interface PropertyCardProps {
  property: Property;
  viewMode?: 'grid' | 'list';
  onCompareNotice?: (message: string) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  viewMode = 'grid',
  onCompareNotice,
}) => {
  const { state, toggleSavedProperty, toggleCompareProperty } = useMarketplace();
  const isSaved = state.savedPropertyIds.includes(property.id);
  const isCompared = state.comparePropertyIds.includes(property.id);

  const handleCompare = () => {
    const res = toggleCompareProperty(property.id);
    if (res.limitReached && onCompareNotice) {
      onCompareNotice('You can compare up to 4 properties at once.');
    }
  };

  if (viewMode === 'list') {
    return (
      <article className="group bg-white border border-[#E6EAF0] rounded-[12px] overflow-hidden hover:border-[#4778B8]/60 hover:shadow-md transition-all duration-200 flex flex-col md:flex-row">
        <div className="relative md:w-80 lg:w-96 shrink-0 aspect-[4/3] md:aspect-auto bg-[#F5F7FA] overflow-hidden">
          <Link to={`/properties/${property.id}`} className="block h-full w-full">
            <SafeImage
              src={property.images[0]}
              alt={property.title}
              className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            />
          </Link>
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleCompare}
              aria-label={isCompared ? `Remove ${property.title} from comparison` : `Add ${property.title} to comparison`}
              className={`h-9 w-9 inline-flex items-center justify-center rounded-[8px] backdrop-blur-sm transition-colors ${
                isCompared
                  ? 'bg-[#142D4E] text-white'
                  : 'bg-white/90 text-[#202B3C] hover:bg-white'
              }`}
            >
              <Scale className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => toggleSavedProperty(property.id)}
              aria-label={isSaved ? `Remove ${property.title} from saved properties` : `Save ${property.title} to wishlist`}
              className={`h-9 w-9 inline-flex items-center justify-center rounded-[8px] backdrop-blur-sm transition-colors ${
                isSaved
                  ? 'bg-[#142D4E] text-white'
                  : 'bg-white/90 text-[#202B3C] hover:bg-white'
              }`}
            >
              <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#778397] mb-2">
              <span className="font-medium text-[#4778B8]">
                {property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
              </span>
              <span aria-hidden="true">·</span>
              <span>{formatPropertyTypeLabel(property.propertyType)}</span>
              <span aria-hidden="true">·</span>
              <span>{formatAvailabilityLabel(property.availability)}</span>
              {property.featured && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium text-[#142D4E]">Featured</span>
                </>
              )}
              {property.verified && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1 font-medium text-[#142D4E]">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#4778B8]" aria-hidden="true" />
                    Verified
                  </span>
                </>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold text-[#202B3C] group-hover:text-[#142D4E] transition-colors">
                  <Link to={`/properties/${property.id}`}>{property.title}</Link>
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-[#778397]">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-[#4778B8]" aria-hidden="true" />
                  <span>
                    {property.locality}, {property.city}
                  </span>
                </p>
              </div>
              <p className="font-display text-xl font-bold text-[#142D4E] tabular-nums whitespace-nowrap">
                {formatListingPrice(property.price, property.priceUnit)}
              </p>
            </div>

            <p className="mt-3 text-sm text-[#778397] line-clamp-2 leading-relaxed">
              {property.description}
            </p>
          </div>

          <div className="pt-4 border-t border-[#E6EAF0] flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 text-sm text-[#202B3C] tabular-nums">
              {property.bedrooms > 0 && (
                <>
                  <span>{property.bedrooms} Bed</span>
                  <span className="text-[#E6EAF0]" aria-hidden="true">|</span>
                </>
              )}
              {property.bathrooms > 0 && (
                <>
                  <span>{property.bathrooms} Bath</span>
                  <span className="text-[#E6EAF0]" aria-hidden="true">|</span>
                </>
              )}
              <span>{property.builtUpAreaSqFt.toLocaleString()} sq. ft.</span>
              <span className="text-[#E6EAF0]" aria-hidden="true">|</span>
              <span className="text-[#778397]">By {property.listedByName}</span>
            </div>

            <Link
              to={`/properties/${property.id}`}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#142D4E] hover:bg-[#0B1F38] rounded-[8px] transition-colors whitespace-nowrap"
            >
              View Details
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group bg-white border border-[#E6EAF0] rounded-[12px] overflow-hidden hover:border-[#4778B8]/60 hover:shadow-md transition-all duration-200 flex flex-col">
      <div className="relative aspect-[4/3] bg-[#F5F7FA] overflow-hidden">
        <Link to={`/properties/${property.id}`} className="block h-full w-full">
          <SafeImage
            src={property.images[0]}
            alt={property.title}
            className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        </Link>
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            type="button"
            onClick={handleCompare}
            aria-label={isCompared ? `Remove ${property.title} from comparison` : `Add ${property.title} to comparison`}
            className={`h-9 w-9 inline-flex items-center justify-center rounded-[8px] backdrop-blur-sm border transition-colors ${
              isCompared
                ? 'bg-[#142D4E] text-white border-[#142D4E]'
                : 'bg-white/95 text-[#202B3C] border-black/10 hover:bg-white'
            }`}
          >
            <Scale className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => toggleSavedProperty(property.id)}
            aria-label={isSaved ? `Remove ${property.title} from saved properties` : `Save ${property.title} to wishlist`}
            className={`h-9 w-9 inline-flex items-center justify-center rounded-[8px] backdrop-blur-sm border transition-colors ${
              isSaved
                ? 'bg-[#142D4E] text-white border-[#142D4E]'
                : 'bg-white/95 text-[#202B3C] border-black/10 hover:bg-white'
            }`}
          >
            <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <div className="flex items-center justify-between gap-2 text-xs text-[#778397] mb-2 min-h-[18px]">
            <div className="flex items-center gap-1.5 min-w-0 truncate">
              <span className="font-medium text-[#4778B8] shrink-0">
                {property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
              </span>
              <span aria-hidden="true">·</span>
              <span className="truncate">{formatPropertyTypeLabel(property.propertyType)}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {property.featured && (
                <span className="font-medium text-[#142D4E] whitespace-nowrap">Featured</span>
              )}
              {property.verified && (
                <span className="inline-flex items-center gap-1 font-medium text-[#142D4E] whitespace-nowrap">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#4778B8]" aria-hidden="true" />
                  Verified
                </span>
              )}
            </div>
          </div>

          <p className="font-display text-xl font-bold text-[#142D4E] tabular-nums">
            {formatListingPrice(property.price, property.priceUnit)}
          </p>

          <h3 className="mt-1.5 text-base font-semibold text-[#202B3C] leading-snug line-clamp-1 group-hover:text-[#142D4E] transition-colors">
            <Link to={`/properties/${property.id}`}>{property.title}</Link>
          </h3>

          <p className="mt-1 flex items-center gap-1.5 text-sm text-[#778397] truncate">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#4778B8]" aria-hidden="true" />
            <span className="truncate">
              {property.locality}, {property.city}
            </span>
          </p>

          <div className="mt-3.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium text-[#202B3C] tabular-nums">
            {property.bedrooms > 0 && (
              <>
                <span>{property.bedrooms} Bed</span>
                <span className="text-[#CBD3DF]" aria-hidden="true">·</span>
              </>
            )}
            {property.bathrooms > 0 && (
              <>
                <span>{property.bathrooms} Bath</span>
                <span className="text-[#CBD3DF]" aria-hidden="true">·</span>
              </>
            )}
            <span>{property.builtUpAreaSqFt.toLocaleString()} sq. ft.</span>
          </div>
        </div>

        <div className="pt-3.5 border-t border-[#E6EAF0] flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-[#778397] truncate">
              {property.listedByRole === 'owner'
                ? 'Owner'
                : property.listedByRole === 'developer'
                ? 'Developer'
                : 'Agent'}
              : <span className="text-[#202B3C] font-medium">{property.listedByName}</span>
            </p>
          </div>
          <Link
            to={`/properties/${property.id}`}
            className="text-sm font-medium text-[#142D4E] hover:text-[#4778B8] transition-colors whitespace-nowrap shrink-0"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
};
