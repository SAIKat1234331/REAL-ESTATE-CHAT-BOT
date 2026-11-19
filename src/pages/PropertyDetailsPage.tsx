import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Scale,
  ShieldCheck,
  MapPin,
  Maximize2,
  Play,
  X,
  Check,
  FileText,
  Building2,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { calculatePricePerSqFt, formatCurrency, formatListingPrice } from '../utils/finance';
import {
  formatAvailabilityLabel,
  formatFurnishingLabel,
  formatPropertyTypeLabel,
} from '../utils/propertyFilters';
import { SafeImage } from '../components/SafeImage';
import { EnquiryPanel } from '../components/EnquiryPanel';
import { EmiCalculator } from '../components/EmiCalculator';
import { PropertyMapExplorer } from '../components/PropertyMapExplorer';

export const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state, toggleSavedProperty, toggleCompareProperty, recordPropertyView } = useMarketplace();

  const property = state.properties.find((p) => p.id === id);

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeFloorPlanIdx, setActiveFloorPlanIdx] = useState(0);

  useEffect(() => {
    if (property?.id) {
      recordPropertyView(property.id);
      setActiveImageIdx(0);
      setShowVideoPreview(false);
      setActiveFloorPlanIdx(0);
    }
  }, [property?.id, recordPropertyView]);

  if (!property) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-[#142D4E]">Property Not Found</h1>
        <p className="text-sm text-[#778397] mt-2">
          This listing may have been removed or is no longer active on the marketplace.
        </p>
        <Link
          to="/properties"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#142D4E] rounded-[10px]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Properties
        </Link>
      </div>
    );
  }

  const isSaved = state.savedPropertyIds.includes(property.id);
  const isCompared = state.comparePropertyIds.includes(property.id);
  const pricePerSqFt = calculatePricePerSqFt(property.price, property.builtUpAreaSqFt);
  const activeFloorPlan = property.floorPlans[activeFloorPlanIdx] ?? property.floorPlans[0];

  const specifications = [
    { label: 'Property ID', value: property.id, mono: true },
    {
      label: 'Category',
      value: `${property.category === 'residential' ? 'Residential' : 'Commercial'} · ${formatPropertyTypeLabel(property.propertyType)}`,
    },
    { label: 'Bedrooms', value: property.bedrooms > 0 ? String(property.bedrooms) : 'N/A' },
    { label: 'Bathrooms', value: property.bathrooms > 0 ? String(property.bathrooms) : 'N/A' },
    { label: 'Balconies', value: property.balconies > 0 ? String(property.balconies) : 'None' },
    { label: 'Built-Up Area', value: `${property.builtUpAreaSqFt.toLocaleString()} sq. ft.`, mono: true },
    { label: 'Carpet Area', value: `${property.carpetAreaSqFt.toLocaleString()} sq. ft.`, mono: true },
    {
      label: 'Floor',
      value:
        property.totalFloors > 0
          ? property.floorNumber === 0
            ? `Ground of ${property.totalFloors}`
            : `${property.floorNumber} of ${property.totalFloors}`
          : 'Land Parcel',
    },
    { label: 'Property Age', value: property.propertyAge },
    { label: 'Furnishing Status', value: formatFurnishingLabel(property.furnishing) },
    { label: 'Availability', value: formatAvailabilityLabel(property.availability) },
    { label: 'Ownership', value: property.ownershipType },
  ];

  return (
    <div className="bg-[#F5F7FA] min-h-screen pb-16">
      {/* Top Breadcrumb & Action Strip */}
      <div className="bg-white border-b border-[#E6EAF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/properties"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#778397] hover:text-[#142D4E]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to Search Results</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => toggleCompareProperty(property.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-[8px] border transition-colors ${
                isCompared
                  ? 'bg-[#142D4E] text-white border-[#142D4E]'
                  : 'bg-white text-[#202B3C] border-[#E6EAF0] hover:border-[#142D4E]'
              }`}
            >
              <Scale className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{isCompared ? 'In Comparison' : 'Compare'}</span>
            </button>
            <button
              type="button"
              onClick={() => toggleSavedProperty(property.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-[8px] border transition-colors ${
                isSaved
                  ? 'bg-[#142D4E] text-white border-[#142D4E]'
                  : 'bg-white text-[#202B3C] border-[#E6EAF0] hover:border-[#142D4E]'
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${isSaved ? 'fill-current' : ''}`} aria-hidden="true" />
              <span>{isSaved ? 'Saved' : 'Save Property'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Title & Price Header */}
        <div className="bg-white border border-[#E6EAF0] rounded-[12px] p-6 mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#778397] mb-2">
              <span className="font-mono text-[#142D4E] font-medium">{property.id}</span>
              <span aria-hidden="true">·</span>
              <span className="font-medium text-[#4778B8]">
                {property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
              </span>
              <span aria-hidden="true">·</span>
              <span>{formatAvailabilityLabel(property.availability)}</span>
              {property.verified && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1 font-medium text-[#142D4E]">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#4778B8]" aria-hidden="true" />
                    Verified Listing
                  </span>
                </>
              )}
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#142D4E]">
              {property.title}
            </h1>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-[#778397]">
              <MapPin className="h-4 w-4 text-[#4778B8] shrink-0" aria-hidden="true" />
              <span>{property.fullAddress}</span>
            </p>
          </div>

          <div className="lg:text-right border-t lg:border-t-0 pt-4 lg:pt-0 border-[#E6EAF0]">
            <p className="font-display text-3xl font-bold text-[#142D4E] tabular-nums">
              {formatListingPrice(property.price, property.priceUnit)}
            </p>
            {property.priceUnit === 'total' && pricePerSqFt > 0 && (
              <p className="text-xs text-[#778397] font-mono tabular-nums mt-1">
                {formatCurrency(pricePerSqFt)} / sq. ft. (Built-up)
              </p>
            )}
          </div>
        </div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 8 Columns: Gallery + Specs + Details */}
          <div className="lg:col-span-8 space-y-6">
            {/* Property Gallery */}
            <section className="bg-white border border-[#E6EAF0] rounded-[12px] overflow-hidden">
              <div className="relative aspect-[16/10] bg-[#0B1F38]">
                {showVideoPreview ? (
                  <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center text-white relative">
                    <SafeImage
                      src={property.images[0]}
                      alt={property.title}
                      className="absolute inset-0 h-full w-full object-cover opacity-35"
                    />
                    <div className="relative z-10 max-w-md space-y-3">
                      <div className="mx-auto h-14 w-14 rounded-full bg-white/15 border border-white/30 flex items-center justify-center">
                        <Play className="h-6 w-6 text-white ml-0.5" aria-hidden="true" />
                      </div>
                      <p className="font-display text-lg font-semibold">
                        {property.videoTourTitle ?? 'Guided Property Walkthrough'}
                      </p>
                      <p className="text-xs text-[#DCE5F0]">
                        Duration {property.videoDuration ?? '03:15'} · Video streaming is disabled in
                        offline demo mode. Switch back to high-resolution photos or schedule a site
                        visit.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowVideoPreview(false)}
                        className="px-4 py-2 text-xs font-medium bg-white text-[#142D4E] rounded-[8px]"
                      >
                        Return to Photo Gallery
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <SafeImage
                      src={property.images[activeImageIdx] ?? property.images[0]}
                      alt={`${property.title} — photo ${activeImageIdx + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-4 right-4 flex items-center gap-2">
                      {property.videoTourTitle && (
                        <button
                          type="button"
                          onClick={() => setShowVideoPreview(true)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-[#0B1F38]/85 text-white rounded-[8px] hover:bg-[#0B1F38]"
                        >
                          <Play className="h-3.5 w-3.5" aria-hidden="true" />
                          Video Tour
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setLightboxOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-white/95 text-[#142D4E] rounded-[8px] hover:bg-white"
                      >
                        <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Fullscreen Gallery
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              <div className="p-4 flex items-center gap-3 overflow-x-auto bg-white border-t border-[#E6EAF0]">
                {property.images.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    type="button"
                    onClick={() => {
                      setShowVideoPreview(false);
                      setActiveImageIdx(idx);
                    }}
                    aria-label={`View photo ${idx + 1} of ${property.title}`}
                    className={`relative h-16 w-24 shrink-0 rounded-[8px] overflow-hidden border-2 transition-all ${
                      !showVideoPreview && activeImageIdx === idx
                        ? 'border-[#142D4E]'
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <SafeImage
                      src={img}
                      alt={`${property.title} thumbnail ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
                {property.videoTourTitle && (
                  <button
                    type="button"
                    onClick={() => setShowVideoPreview(true)}
                    className={`h-16 px-4 shrink-0 rounded-[8px] border text-xs font-medium inline-flex items-center gap-1.5 ${
                      showVideoPreview
                        ? 'border-[#142D4E] bg-[#142D4E] text-white'
                        : 'border-[#E6EAF0] bg-[#F5F7FA] text-[#142D4E]'
                    }`}
                  >
                    <Play className="h-3.5 w-3.5" aria-hidden="true" />
                    Video
                  </button>
                )}
              </div>
            </section>

            {/* Property Information / Specifications Grid */}
            <section className="bg-white border border-[#E6EAF0] rounded-[12px] p-6">
              <h2 className="font-display text-lg font-semibold text-[#142D4E] mb-4">
                Property Specifications
              </h2>
              <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
                {specifications.map((spec) => (
                  <div key={spec.label} className="pb-3 border-b border-[#E6EAF0]/70">
                    <dt className="text-xs text-[#778397]">{spec.label}</dt>
                    <dd
                      className={`text-sm font-semibold text-[#202B3C] mt-0.5 ${
                        spec.mono ? 'font-mono tabular-nums' : ''
                      }`}
                    >
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* Description & Key Features */}
            <section className="bg-white border border-[#E6EAF0] rounded-[12px] p-6 space-y-5">
              <div>
                <h2 className="font-display text-lg font-semibold text-[#142D4E] mb-2">
                  Property Description
                </h2>
                <p className="text-sm text-[#202B3C]/90 leading-relaxed">{property.description}</p>
              </div>

              {property.keyFeatures.length > 0 && (
                <div className="pt-4 border-t border-[#E6EAF0]">
                  <h3 className="text-sm font-semibold text-[#142D4E] mb-3">Key Features</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {property.keyFeatures.map((feat) => (
                      <li key={feat} className="flex items-start gap-2 text-sm text-[#202B3C]">
                        <Check className="h-4 w-4 text-[#4778B8] shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {property.amenities.length > 0 && (
                <div className="pt-4 border-t border-[#E6EAF0]">
                  <h3 className="text-sm font-semibold text-[#142D4E] mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 text-sm text-[#202B3C]">
                    {property.amenities.map((am) => (
                      <span key={am} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#4778B8]" aria-hidden="true" />
                        <span>{am}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Floor Plans */}
            {property.floorPlans.length > 0 && activeFloorPlan && (
              <section className="bg-white border border-[#E6EAF0] rounded-[12px] p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <h2 className="font-display text-lg font-semibold text-[#142D4E]">Floor Plans</h2>
                  {property.floorPlans.length > 1 && (
                    <div className="flex items-center gap-1 p-1 bg-[#F5F7FA] rounded-[8px]">
                      {property.floorPlans.map((fp, idx) => (
                        <button
                          key={fp.id}
                          type="button"
                          onClick={() => setActiveFloorPlanIdx(idx)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-[6px] ${
                            activeFloorPlanIdx === idx
                              ? 'bg-white text-[#142D4E] shadow-xs'
                              : 'text-[#778397]'
                          }`}
                        >
                          {fp.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-[#F5F7FA] border border-[#E6EAF0] rounded-[10px] p-5">
                  {/* Architectural Schematic Representation */}
                  <div className="md:col-span-6 bg-white border border-[#E6EAF0] rounded-[8px] p-4">
                    <svg
                      viewBox="0 0 320 200"
                      className="w-full h-44"
                      role="img"
                      aria-label={`Architectural schematic for ${activeFloorPlan.label}`}
                    >
                      <rect x="10" y="10" width="300" height="180" fill="#FAFCFF" stroke="#142D4E" strokeWidth="2" />
                      <line x1="170" y1="10" x2="170" y2="190" stroke="#142D4E" strokeWidth="1.5" />
                      <line x1="170" y1="100" x2="310" y2="100" stroke="#142D4E" strokeWidth="1.5" />
                      <line x1="10" y1="125" x2="170" y2="125" stroke="#4778B8" strokeWidth="1" strokeDasharray="4 3" />
                      <text x="90" y="70" textAnchor="middle" fill="#142D4E" fontSize="11" fontWeight="600">
                        PRIMARY ZONE
                      </text>
                      <text x="90" y="160" textAnchor="middle" fill="#778397" fontSize="10">
                        TERRACE / ACCESS
                      </text>
                      <text x="240" y="58" textAnchor="middle" fill="#202B3C" fontSize="10">
                        SUITE / WING A
                      </text>
                      <text x="240" y="148" textAnchor="middle" fill="#202B3C" fontSize="10">
                        SUITE / WING B
                      </text>
                    </svg>
                    <p className="text-[11px] font-mono text-center text-[#778397] mt-2">
                      Dimensions: {activeFloorPlan.dimensions}
                    </p>
                  </div>

                  <div className="md:col-span-6 space-y-3">
                    <h3 className="text-base font-semibold text-[#142D4E]">
                      {activeFloorPlan.label}
                    </h3>
                    <p className="text-xs text-[#778397] font-mono tabular-nums">
                      {activeFloorPlan.areaSqFt.toLocaleString()} sq. ft. ·{' '}
                      {formatListingPrice(activeFloorPlan.price, property.priceUnit)}
                    </p>
                    <ul className="space-y-1.5 text-sm text-[#202B3C]">
                      {activeFloorPlan.rooms.map((room) => (
                        <li key={room} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#142D4E]" aria-hidden="true" />
                          <span>{room}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            )}

            {/* Location Map & Nearby Facilities */}
            <section className="space-y-4">
              <div className="bg-white border border-[#E6EAF0] rounded-[12px] p-6">
                <h2 className="font-display text-lg font-semibold text-[#142D4E] mb-4">
                  Location &amp; Nearby Facilities
                </h2>
                <PropertyMapExplorer properties={[property]} selectedPropertyId={property.id} />

                {property.nearbyFacilities.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                    {property.nearbyFacilities.map((fac) => (
                      <div
                        key={fac.name}
                        className="flex items-center justify-between py-2.5 px-3.5 bg-[#F5F7FA] rounded-[8px] border border-[#E6EAF0] text-sm"
                      >
                        <div>
                          <p className="font-medium text-[#202B3C]">{fac.name}</p>
                          <p className="text-xs text-[#778397]">{fac.category}</p>
                        </div>
                        <span className="font-mono text-xs font-medium text-[#142D4E] tabular-nums">
                          {fac.distance}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Legal & RERA Information */}
            <section className="bg-white border border-[#E6EAF0] rounded-[12px] p-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5 text-[#142D4E]" aria-hidden="true" />
                <h2 className="font-display text-lg font-semibold text-[#142D4E]">
                  Legal &amp; RERA Compliance
                </h2>
              </div>
              <p className="text-sm text-[#202B3C]/90 leading-relaxed">{property.legalInfo}</p>
              <div className="mt-4 pt-4 border-t border-[#E6EAF0] grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-[#778397]">RERA / Regulatory ID</p>
                  <p className="font-mono font-semibold text-[#142D4E] mt-0.5">
                    {property.reraId ?? 'Not Applicable / Individual Resale'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#778397]">Listed By</p>
                  <p className="font-medium text-[#202B3C] mt-0.5 flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-[#4778B8]" aria-hidden="true" />
                    <span>
                      {property.listedByName}
                      {property.listedByCompany ? ` · ${property.listedByCompany}` : ''}
                    </span>
                  </p>
                </div>
              </div>
            </section>

            {/* EMI Calculator (for Sale listings) */}
            {property.listingType === 'sale' && <EmiCalculator propertyPrice={property.price} />}
          </div>

          {/* Right 4 Columns: Sticky Enquiry Panel */}
          <aside className="lg:col-span-4 lg:sticky lg:top-20 space-y-5">
            <EnquiryPanel
              propertyId={property.id}
              propertyTitle={property.title}
              ownerOrAgentId={property.listedById}
              ownerOrAgentName={property.listedByName}
              ownerOrAgentRoleLabel={
                property.listedByRole === 'owner'
                  ? 'Verified Property Owner'
                  : property.listedByRole === 'developer'
                  ? 'Official Developer Sales Desk'
                  : property.listedByCompany ?? 'Verified Real Estate Advisor'
              }
              developerId={property.developerId}
              leadSourcePrefix="Property Details"
            />
          </aside>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen property gallery"
          className="fixed inset-0 z-50 bg-[#0B1F38]/95 flex flex-col justify-between p-4 sm:p-8"
        >
          <div className="flex items-center justify-between text-white">
            <p className="text-sm font-medium">
              {property.title} · Photo {activeImageIdx + 1} of {property.images.length}
            </p>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close fullscreen gallery"
              className="h-10 w-10 inline-flex items-center justify-center rounded-[8px] border border-white/20 hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center py-6">
            <SafeImage
              src={property.images[activeImageIdx] ?? property.images[0]}
              alt={`${property.title} full view`}
              className="max-h-[75vh] max-w-full rounded-[10px] object-contain"
            />
          </div>

          <div className="flex items-center justify-center gap-3">
            {property.images.map((img, idx) => (
              <button
                key={`lb-${idx}`}
                type="button"
                onClick={() => setActiveImageIdx(idx)}
                aria-label={`Select gallery image ${idx + 1}`}
                className={`h-14 w-20 rounded-[6px] overflow-hidden border-2 ${
                  activeImageIdx === idx ? 'border-white' : 'border-transparent opacity-60'
                }`}
              >
                <SafeImage src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
