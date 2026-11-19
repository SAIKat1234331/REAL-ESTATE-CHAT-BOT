import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ChevronLeft, ChevronRight, Upload, ShieldCheck } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ASSET_IMAGES } from '../data/seedData';
import type {
  AvailabilityStatus,
  FurnishingStatus,
  ListingType,
  Property,
  PropertyCategory,
  PropertyType,
} from '../types/marketplace';
import { formatListingPrice } from '../utils/finance';
import {
  formatAvailabilityLabel,
  formatFurnishingLabel,
  formatPropertyTypeLabel,
} from '../utils/propertyFilters';
import { SafeImage } from '../components/SafeImage';

const STEPS = [
  'User Type',
  'Property Info',
  'Specifications',
  'Description & Amenities',
  'Photos & Video',
  'Legal & Verification',
  'Preview & Submit',
];

const AMENITY_OPTIONS = [
  '24/7 Concierge & Security',
  'Swimming Pool',
  'Fitness Studio',
  'Covered Parking',
  'EV Charging',
  'Power Backup',
  'High-Speed Fiber',
  'Central HVAC',
  'Landscaped Courtyard',
  'Elevator Access',
];

const PRESET_GALLERY = [
  { label: 'Modern Apartment Interior', src: ASSET_IMAGES.apartment },
  { label: 'Luxury Villa Exterior', src: ASSET_IMAGES.villa },
  { label: 'Grade-A Commercial Office', src: ASSET_IMAGES.office },
  { label: 'Flagship Retail Promenade', src: ASSET_IMAGES.retail },
  { label: 'Residential High-Rise Tower', src: ASSET_IMAGES.tower },
  { label: 'Gated Estate Land Parcel', src: ASSET_IMAGES.plot },
];

export const AddPropertyPage: React.FC = () => {
  const { currentUser, addPropertyListing } = useMarketplace();
  const [step, setStep] = useState(0);
  const [stepError, setStepError] = useState<string | null>(null);
  const [submittedProperty, setSubmittedProperty] = useState<Property | null>(null);

  // Step 1
  const [submitterType, setSubmitterType] = useState<'owner' | 'agent' | 'broker' | 'developer'>(
    currentUser?.role === 'developer'
      ? 'developer'
      : currentUser?.role === 'agent'
      ? 'agent'
      : 'owner'
  );
  const [contactName, setContactName] = useState(currentUser?.fullName ?? '');
  const [companyName, setCompanyName] = useState(currentUser?.companyName ?? '');

  // Step 2
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PropertyCategory>('residential');
  const [propertyType, setPropertyType] = useState<PropertyType>('apartment');
  const [listingType, setListingType] = useState<ListingType>('sale');
  const [price, setPrice] = useState('');
  const [city, setCity] = useState('Austin');
  const [locality, setLocality] = useState('');
  const [fullAddress, setFullAddress] = useState('');

  // Step 3
  const [bedrooms, setBedrooms] = useState('3');
  const [bathrooms, setBathrooms] = useState('2');
  const [balconies, setBalconies] = useState('1');
  const [builtUpArea, setBuiltUpArea] = useState('');
  const [carpetArea, setCarpetArea] = useState('');
  const [floorNumber, setFloorNumber] = useState('4');
  const [totalFloors, setTotalFloors] = useState('12');
  const [furnishing, setFurnishing] = useState<FurnishingStatus>('semi-furnished');
  const [propertyAge, setPropertyAge] = useState('New Build');
  const [availability, setAvailability] = useState<AvailabilityStatus>('ready-to-move');

  // Step 4
  const [description, setDescription] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    '24/7 Concierge & Security',
    'Covered Parking',
  ]);
  const [keyFeatureText, setKeyFeatureText] = useState('');

  // Step 5
  const [selectedImages, setSelectedImages] = useState<string[]>([ASSET_IMAGES.apartment]);
  const [videoTourTitle, setVideoTourTitle] = useState('');

  // Step 6
  const [ownershipType, setOwnershipType] = useState('Freehold');
  const [reraId, setReraId] = useState('');
  const [legalInfo, setLegalInfo] = useState(
    'Clear title documentation available for inspection upon qualified buyer enquiry.'
  );
  const [supportingDocs, setSupportingDocs] = useState<string[]>([
    'Title Deed / Ownership Proof',
  ]);

  const toggleAmenity = (item: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const toggleImagePreset = (src: string) => {
    setSelectedImages((prev) =>
      prev.includes(src)
        ? prev.length > 1
          ? prev.filter((i) => i !== src)
          : prev
        : [...prev, src]
    );
  };

  const handleLocalPhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSelectedImages((prev) => [reader.result as string, ...prev]);
      }
    };
    reader.readAsDataURL(file);
  };

  const validateCurrentStep = (): boolean => {
    setStepError(null);
    if (step === 0) {
      if (contactName.trim().length < 2) {
        setStepError('Please enter your full name or representative name.');
        return false;
      }
    }
    if (step === 1) {
      if (title.trim().length < 5) {
        setStepError('Please provide a clear property title (at least 5 characters).');
        return false;
      }
      if (!price || Number(price) <= 0) {
        setStepError('Please enter a valid positive price.');
        return false;
      }
      if (!city.trim() || !locality.trim() || !fullAddress.trim()) {
        setStepError('Please complete city, locality, and full address.');
        return false;
      }
    }
    if (step === 2) {
      if (!builtUpArea || Number(builtUpArea) <= 0) {
        setStepError('Please specify the built-up area in sq. ft.');
        return false;
      }
    }
    if (step === 3) {
      if (description.trim().length < 20) {
        setStepError('Please provide a meaningful property description (at least 20 characters).');
        return false;
      }
    }
    if (step === 4) {
      if (selectedImages.length === 0) {
        setStepError('Please select or upload at least one property photograph.');
        return false;
      }
    }
    if (step === 5) {
      if (!ownershipType.trim() || !legalInfo.trim()) {
        setStepError('Please provide ownership type and legal verification summary.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    setStep((prev) => Math.min(STEPS.length - 1, prev + 1));
  };

  const handleBack = () => {
    setStepError(null);
    setStep((prev) => Math.max(0, prev - 1));
  };

  const handleSubmitListing = () => {
    const numericPrice = Number(price);
    const numericBuiltUp = Number(builtUpArea);
    const numericCarpet = carpetArea ? Number(carpetArea) : Math.round(numericBuiltUp * 0.88);
    const keyFeatures = keyFeatureText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const created = addPropertyListing({
      title: title.trim(),
      listingType,
      category,
      propertyType,
      price: numericPrice,
      priceUnit: listingType === 'rent' ? 'monthly' : 'total',
      city: city.trim(),
      locality: locality.trim(),
      fullAddress: fullAddress.trim(),
      coordinates: {
        x: 30 + Math.floor(Math.random() * 45),
        y: 25 + Math.floor(Math.random() * 45),
      },
      bedrooms: category === 'commercial' || propertyType === 'plot' ? 0 : Number(bedrooms || 0),
      bathrooms: propertyType === 'plot' ? 0 : Number(bathrooms || 0),
      balconies: Number(balconies || 0),
      builtUpAreaSqFt: numericBuiltUp,
      carpetAreaSqFt: numericCarpet,
      floorNumber: Number(floorNumber || 0),
      totalFloors: Number(totalFloors || 0),
      propertyAge: propertyAge.trim() || 'New Build',
      furnishing,
      availability,
      images: selectedImages,
      videoTourTitle: videoTourTitle.trim() || undefined,
      description: description.trim(),
      keyFeatures:
        keyFeatures.length > 0
          ? keyFeatures
          : ['Verified listing documentation submitted', 'Direct enquiry routing enabled'],
      amenities: selectedAmenities,
      floorPlans: [
        {
          id: `fp-new-${Date.now()}`,
          label: 'Primary Layout',
          areaSqFt: numericBuiltUp,
          bedrooms: Number(bedrooms || 0),
          bathrooms: Number(bathrooms || 0),
          price: numericPrice,
          dimensions: 'Per Architectural Plan',
          rooms: ['Main Living / Operations Zone', 'Primary Wing', 'Utility & Access'],
        },
      ],
      nearbyFacilities: [
        { name: `${locality.trim()} Transit Hub`, category: 'Transit', distance: '0.5 mi' },
        { name: `${city.trim()} Business Corridor`, category: 'Business Hub', distance: '1.2 mi' },
      ],
      legalInfo: `${legalInfo.trim()} Supporting documents declared: ${supportingDocs.join(', ')}.`,
      reraId: reraId.trim() || undefined,
      ownershipType: ownershipType.trim(),
      listedById: currentUser?.id ?? 'usr-owner-1',
      listedByName: contactName.trim(),
      listedByRole: submitterType === 'broker' ? 'agent' : submitterType,
      listedByCompany: companyName.trim() || undefined,
    });

    setSubmittedProperty(created);
  };

  if (submittedProperty) {
    return (
      <div className="bg-[#F5F7FA] min-h-screen py-16 px-4">
        <div className="max-w-2xl mx-auto bg-white border border-[#E6EAF0] rounded-[14px] p-8 space-y-6">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="h-8 w-8 text-[#142D4E] shrink-0" aria-hidden="true" />
            <div>
              <h1 className="font-display text-2xl font-bold text-[#142D4E]">
                Property Submitted for Approval
              </h1>
              <p className="text-sm text-[#778397] mt-1">
                Your listing has been recorded with <strong>Pending Approval</strong> status. Once
                approved by a platform administrator, it will appear in public search results.
              </p>
            </div>
          </div>

          <div className="bg-[#F5F7FA] border border-[#E6EAF0] rounded-[10px] p-5 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#778397]">Property ID</span>
              <span className="font-mono font-semibold text-[#142D4E]">{submittedProperty.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#778397]">Title</span>
              <span className="font-medium text-[#202B3C]">{submittedProperty.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#778397]">Approval Status</span>
              <span className="font-semibold text-amber-700 capitalize">
                {submittedProperty.approvalStatus} Approval
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/dashboard"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-[#142D4E] hover:bg-[#0B1F38] rounded-[10px]"
            >
              Go to My Dashboard
            </Link>
            <Link
              to="/admin"
              className="px-5 py-2.5 text-sm font-semibold text-[#142D4E] border border-[#E6EAF0] hover:bg-[#F5F7FA] rounded-[10px]"
            >
              Review in Admin Approvals
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F7FA] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <p className="text-xs font-medium text-[#4778B8] mb-1">Structured Listing Workflow</p>
          <h1 className="font-display text-3xl font-bold text-[#142D4E]">List Your Property</h1>
          <p className="text-sm text-[#778397] mt-1">
            Complete all 7 steps to submit a verified residential or commercial listing.
          </p>
        </div>

        {/* Step Indicator */}
        <ol className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-8">
          {STEPS.map((label, idx) => {
            const active = idx === step;
            const completed = idx < step;
            return (
              <li key={label}>
                <button
                  type="button"
                  onClick={() => idx < step && setStep(idx)}
                  disabled={idx > step}
                  className={`w-full text-left p-2.5 rounded-[10px] border text-xs transition-colors ${
                    active
                      ? 'bg-[#142D4E] text-white border-[#142D4E]'
                      : completed
                      ? 'bg-white text-[#142D4E] border-[#4778B8]/50'
                      : 'bg-white text-[#778397] border-[#E6EAF0]'
                  }`}
                >
                  <span className="font-mono text-[11px] block opacity-80">Step {idx + 1}</span>
                  <span className="font-medium line-clamp-1 mt-0.5">{label}</span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="bg-white border border-[#E6EAF0] rounded-[14px] p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-[#E6EAF0]">
            <h2 className="font-display text-xl font-bold text-[#142D4E]">
              Step {step + 1}: {STEPS[step]}
            </h2>
          </div>

          {stepError && (
            <div className="p-3.5 rounded-[10px] border border-red-200 bg-red-50 text-sm text-red-700">
              {stepError}
            </div>
          )}

          {/* STEP 1 */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <span className="block text-xs font-medium text-[#202B3C] mb-2">
                  Select User Type *
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(['owner', 'agent', 'broker', 'developer'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSubmitterType(type)}
                      className={`py-3.5 px-4 text-sm font-semibold rounded-[10px] border capitalize transition-colors ${
                        submitterType === type
                          ? 'bg-[#142D4E] text-white border-[#142D4E]'
                          : 'bg-white text-[#202B3C] border-[#E6EAF0] hover:border-[#4778B8]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ap-contact-name" className="block text-xs font-medium text-[#202B3C] mb-1.5">
                    Listed By Name *
                  </label>
                  <input
                    id="ap-contact-name"
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Full name or firm representative"
                    className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px]"
                  />
                </div>
                <div>
                  <label htmlFor="ap-company" className="block text-xs font-medium text-[#202B3C] mb-1.5">
                    Company / Agency (Optional)
                  </label>
                  <input
                    id="ap-company"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Brokerage or Developer Firm"
                    className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="ap-title" className="block text-xs font-medium text-[#202B3C] mb-1.5">
                  Property Title *
                </label>
                <input
                  id="ap-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Parkview 3 BHK Residence with River Terrace"
                  className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="ap-category" className="block text-xs font-medium text-[#202B3C] mb-1.5">
                    Property Category *
                  </label>
                  <select
                    id="ap-category"
                    value={category}
                    onChange={(e) => {
                      const next = e.target.value as PropertyCategory;
                      setCategory(next);
                      setPropertyType(next === 'commercial' ? 'office' : 'apartment');
                    }}
                    className="w-full px-3 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px] bg-white"
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="ap-prop-type" className="block text-xs font-medium text-[#202B3C] mb-1.5">
                    Property Type *
                  </label>
                  <select
                    id="ap-prop-type"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                    className="w-full px-3 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px] bg-white"
                  >
                    {category === 'commercial' ? (
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

                <div>
                  <label htmlFor="ap-listing-type" className="block text-xs font-medium text-[#202B3C] mb-1.5">
                    Listing Type *
                  </label>
                  <select
                    id="ap-listing-type"
                    value={listingType}
                    onChange={(e) => setListingType(e.target.value as ListingType)}
                    className="w-full px-3 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px] bg-white"
                  >
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="ap-price" className="block text-xs font-medium text-[#202B3C] mb-1.5">
                    {listingType === 'rent' ? 'Monthly Rent ($) *' : 'Sale Price ($) *'}
                  </label>
                  <input
                    id="ap-price"
                    type="number"
                    min={1}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder={listingType === 'rent' ? '5500' : '1250000'}
                    className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px] tabular-nums"
                  />
                </div>
                <div>
                  <label htmlFor="ap-city" className="block text-xs font-medium text-[#202B3C] mb-1.5">
                    City *
                  </label>
                  <input
                    id="ap-city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px]"
                  />
                </div>
                <div>
                  <label htmlFor="ap-locality" className="block text-xs font-medium text-[#202B3C] mb-1.5">
                    Locality / District *
                  </label>
                  <input
                    id="ap-locality"
                    type="text"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="e.g. Westlake Hills"
                    className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="ap-address" className="block text-xs font-medium text-[#202B3C] mb-1.5">
                  Full Street Address *
                </label>
                <input
                  id="ap-address"
                  type="text"
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder="Street number, building/unit, city, postal code"
                  className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px]"
                />
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="ap-beds" className="block text-xs font-medium text-[#202B3C] mb-1.5">
                  Bedrooms
                </label>
                <input
                  id="ap-beds"
                  type="number"
                  min={0}
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px] tabular-nums"
                />
              </div>
              <div>
                <label htmlFor="ap-baths" className="block text-xs font-medium text-[#202B3C] mb-1.5">
                  Bathrooms
                </label>
                <input
                  id="ap-baths"
                  type="number"
                  min={0}
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px] tabular-nums"
                />
              </div>
              <div>
                <label htmlFor="ap-balconies" className="block text-xs font-medium text-[#202B3C] mb-1.5">
                  Balconies
                </label>
                <input
                  id="ap-balconies"
                  type="number"
                  min={0}
                  value={balconies}
                  onChange={(e) => setBalconies(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px] tabular-nums"
                />
              </div>
              <div>
                <label htmlFor="ap-builtup" className="block text-xs font-medium text-[#202B3C] mb-1.5">
                  Built-Up Area (sq. ft.) *
                </label>
                <input
                  id="ap-builtup"
                  type="number"
                  min={1}
                  value={builtUpArea}
                  onChange={(e) => setBuiltUpArea(e.target.value)}
                  placeholder="2200"
                  className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px] tabular-nums"
                />
              </div>
              <div>
                <label htmlFor="ap-carpet" className="block text-xs font-medium text-[#202B3C] mb-1.5">
                  Carpet Area (sq. ft.)
                </label>
                <input
                  id="ap-carpet"
                  type="number"
                  min={0}
                  value={carpetArea}
                  onChange={(e) => setCarpetArea(e.target.value)}
                  placeholder="Optional (auto 88%)"
                  className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px] tabular-nums"
                />
              </div>
              <div>
                <label htmlFor="ap-age" className="block text-xs font-medium text-[#202B3C] mb-1.5">
                  Property Age
                </label>
                <input
                  id="ap-age"
                  type="text"
                  value={propertyAge}
                  onChange={(e) => setPropertyAge(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px]"
                />
              </div>
              <div>
                <label htmlFor="ap-floor" className="block text-xs font-medium text-[#202B3C] mb-1.5">
                  Floor Number
                </label>
                <input
                  id="ap-floor"
                  type="number"
                  min={0}
                  value={floorNumber}
                  onChange={(e) => setFloorNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px] tabular-nums"
                />
              </div>
              <div>
                <label htmlFor="ap-total-floors" className="block text-xs font-medium text-[#202B3C] mb-1.5">
                  Total Floors
                </label>
                <input
                  id="ap-total-floors"
                  type="number"
                  min={0}
                  value={totalFloors}
                  onChange={(e) => setTotalFloors(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px] tabular-nums"
                />
              </div>
              <div>
                <label htmlFor="ap-furnishing" className="block text-xs font-medium text-[#202B3C] mb-1.5">
                  Furnishing Status
                </label>
                <select
                  id="ap-furnishing"
                  value={furnishing}
                  onChange={(e) => setFurnishing(e.target.value as FurnishingStatus)}
                  className="w-full px-3 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px] bg-white"
                >
                  <option value="furnished">Fully Furnished</option>
                  <option value="semi-furnished">Semi-Furnished</option>
                  <option value="unfurnished">Unfurnished</option>
                </select>
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="ap-availability" className="block text-xs font-medium text-[#202B3C] mb-1.5">
                  Availability Status
                </label>
                <select
                  id="ap-availability"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value as AvailabilityStatus)}
                  className="w-full px-3 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px] bg-white"
                >
                  <option value="ready-to-move">Ready to Move</option>
                  <option value="under-construction">Under Construction</option>
                  <option value="available-soon">Available Soon</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label htmlFor="ap-desc" className="block text-xs font-medium text-[#202B3C] mb-1.5">
                  Property Description *
                </label>
                <textarea
                  id="ap-desc"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe architectural highlights, natural light, neighborhood advantages, and recent upgrades..."
                  className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px]"
                />
              </div>

              <div>
                <label htmlFor="ap-features" className="block text-xs font-medium text-[#202B3C] mb-1.5">
                  Key Highlights (One per line)
                </label>
                <textarea
                  id="ap-features"
                  rows={3}
                  value={keyFeatureText}
                  onChange={(e) => setKeyFeatureText(e.target.value)}
                  placeholder="Floor-to-ceiling glazing&#10;Two EV-ready parking bays"
                  className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px]"
                />
              </div>

              <div>
                <span className="block text-xs font-medium text-[#202B3C] mb-2">
                  Select Amenities
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {AMENITY_OPTIONS.map((am) => {
                    const checked = selectedAmenities.includes(am);
                    return (
                      <label
                        key={am}
                        className={`flex items-center gap-2 p-2.5 rounded-[8px] border text-xs cursor-pointer ${
                          checked
                            ? 'border-[#142D4E] bg-[#F5F7FA] font-medium text-[#142D4E]'
                            : 'border-[#E6EAF0] text-[#202B3C]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleAmenity(am)}
                          className="accent-[#142D4E]"
                        />
                        <span>{am}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5 */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-[#202B3C] mb-2">
                  Upload Property Photo (Local Browser Preview)
                </label>
                <label className="flex items-center justify-center gap-2 border border-dashed border-[#4778B8] bg-[#F5F7FA] rounded-[10px] p-5 cursor-pointer hover:bg-[#EDF2F8] transition-colors">
                  <Upload className="h-4 w-4 text-[#142D4E]" aria-hidden="true" />
                  <span className="text-sm font-medium text-[#142D4E]">
                    Choose image file from device
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLocalPhotoSelect}
                    className="sr-only"
                  />
                </label>
                <p className="text-[11px] text-[#778397] mt-1.5">
                  Or select from verified architectural sample media below for instant preview.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PRESET_GALLERY.map((item) => {
                  const chosen = selectedImages.includes(item.src);
                  return (
                    <button
                      key={item.src}
                      type="button"
                      onClick={() => toggleImagePreset(item.src)}
                      className={`text-left rounded-[10px] overflow-hidden border-2 transition-all ${
                        chosen ? 'border-[#142D4E]' : 'border-[#E6EAF0] opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div className="aspect-[4/3]">
                        <SafeImage src={item.src} alt={item.label} className="h-full w-full object-cover" />
                      </div>
                      <p className="p-2 text-xs font-medium text-[#202B3C] truncate">
                        {chosen ? 'Selected · ' : ''}
                        {item.label}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div>
                <label htmlFor="ap-video" className="block text-xs font-medium text-[#202B3C] mb-1.5">
                  Video Walkthrough Title (Optional)
                </label>
                <input
                  id="ap-video"
                  type="text"
                  value={videoTourTitle}
                  onChange={(e) => setVideoTourTitle(e.target.value)}
                  placeholder="e.g. 4K Exterior & Living Room Walkthrough"
                  className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px]"
                />
              </div>
            </div>
          )}

          {/* STEP 6 */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ap-ownership" className="block text-xs font-medium text-[#202B3C] mb-1.5">
                    Ownership Type *
                  </label>
                  <select
                    id="ap-ownership"
                    value={ownershipType}
                    onChange={(e) => setOwnershipType(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px] bg-white"
                  >
                    <option value="Freehold">Freehold</option>
                    <option value="Leasehold">Leasehold</option>
                    <option value="Co-operative Society">Co-operative Society</option>
                    <option value="Commercial Lease">Commercial Lease</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="ap-rera" className="block text-xs font-medium text-[#202B3C] mb-1.5">
                    RERA Registration ID (Where Applicable)
                  </label>
                  <input
                    id="ap-rera"
                    type="text"
                    value={reraId}
                    onChange={(e) => setReraId(e.target.value)}
                    placeholder="e.g. RERA-TX-2026-00912"
                    className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px] font-mono"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="ap-legal" className="block text-xs font-medium text-[#202B3C] mb-1.5">
                  Legal &amp; Compliance Summary *
                </label>
                <textarea
                  id="ap-legal"
                  rows={3}
                  value={legalInfo}
                  onChange={(e) => setLegalInfo(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px]"
                />
              </div>

              <div>
                <span className="block text-xs font-medium text-[#202B3C] mb-2">
                  Supporting Verification Documents Available
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    'Title Deed / Ownership Proof',
                    'Occupancy / Completion Certificate',
                    'Latest Municipal Tax Receipt',
                    'Broker / Developer RERA License',
                  ].map((doc) => {
                    const checked = supportingDocs.includes(doc);
                    return (
                      <label
                        key={doc}
                        className="flex items-center gap-2 p-2.5 rounded-[8px] border border-[#E6EAF0] text-xs cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            setSupportingDocs((prev) =>
                              prev.includes(doc) ? prev.filter((d) => d !== doc) : [...prev, doc]
                            )
                          }
                          className="accent-[#142D4E]"
                        />
                        <span>{doc}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Preview & Submit */}
          {step === 6 && (
            <div className="space-y-5">
              <div className="flex items-start gap-3 p-4 rounded-[10px] bg-[#F5F7FA] border border-[#E6EAF0] text-xs text-[#202B3C]">
                <ShieldCheck className="h-5 w-5 text-[#4778B8] shrink-0" aria-hidden="true" />
                <p>
                  All new listings enter our moderation queue with{' '}
                  <strong>Pending Approval</strong> status until verified by an administrator.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 border border-[#E6EAF0] rounded-[12px] p-5">
                <div className="md:col-span-5 aspect-[4/3] rounded-[10px] overflow-hidden bg-[#F5F7FA]">
                  <SafeImage
                    src={selectedImages[0]}
                    alt={title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="md:col-span-7 space-y-2.5 text-sm">
                  <p className="text-xs text-[#4778B8] font-medium">
                    {listingType === 'sale' ? 'For Sale' : 'For Rent'} ·{' '}
                    {formatPropertyTypeLabel(propertyType)} · {formatAvailabilityLabel(availability)}
                  </p>
                  <h3 className="font-display text-xl font-bold text-[#142D4E]">{title}</h3>
                  <p className="text-xs text-[#778397]">
                    {fullAddress} ({locality}, {city})
                  </p>
                  <p className="font-display text-2xl font-bold text-[#142D4E] tabular-nums">
                    {formatListingPrice(Number(price || 0), listingType === 'rent' ? 'monthly' : 'total')}
                  </p>
                  <div className="pt-2 border-t border-[#E6EAF0] grid grid-cols-2 gap-2 text-xs text-[#202B3C]">
                    <span>Built-up: {Number(builtUpArea || 0).toLocaleString()} sq. ft.</span>
                    <span>Furnishing: {formatFurnishingLabel(furnishing)}</span>
                    <span>Listed by: {contactName} ({submitterType})</span>
                    <span>Ownership: {ownershipType}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Navigation Buttons */}
          <div className="pt-6 border-t border-[#E6EAF0] flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-[#202B3C] border border-[#E6EAF0] hover:bg-[#F5F7FA] rounded-[10px] disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Previous
            </button>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 text-sm font-semibold text-white bg-[#142D4E] hover:bg-[#0B1F38] rounded-[10px]"
              >
                Continue
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitListing}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-[#142D4E] hover:bg-[#0B1F38] rounded-[10px]"
              >
                Submit Listing for Approval
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
