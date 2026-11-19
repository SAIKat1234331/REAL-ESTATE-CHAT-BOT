import test from 'node:test';
import assert from 'node:assert/strict';
import { filterProperties, sortProperties } from './propertyFilters';
import type { Property } from '../types/marketplace';

const sampleProperties: Property[] = [
  {
    id: 'ME-PRP-101',
    title: 'Skyline Penthouse',
    listingType: 'sale',
    category: 'residential',
    propertyType: 'apartment',
    price: 1250000,
    priceUnit: 'total',
    city: 'Austin',
    locality: 'Downtown West',
    fullAddress: '400 West 4th St, Austin, TX',
    coordinates: { x: 40, y: 45 },
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    builtUpAreaSqFt: 2450,
    carpetAreaSqFt: 2100,
    floorNumber: 24,
    totalFloors: 32,
    propertyAge: '1 Year',
    furnishing: 'furnished',
    availability: 'ready-to-move',
    verified: true,
    featured: true,
    approvalStatus: 'approved',
    images: ['/img1.jpg'],
    description: 'Luxury penthouse',
    keyFeatures: [],
    amenities: [],
    floorPlans: [],
    nearbyFacilities: [],
    legalInfo: 'Clear title',
    ownershipType: 'Freehold',
    listedById: 'usr-agent-1',
    listedByName: 'Claire Vance',
    listedByRole: 'agent',
    viewsCount: 220,
    createdAt: '2026-10-01T10:00:00Z',
  },
  {
    id: 'ME-PRP-102',
    title: 'Harborview Grade-A Office',
    listingType: 'rent',
    category: 'commercial',
    propertyType: 'office',
    price: 9500,
    priceUnit: 'monthly',
    city: 'Seattle',
    locality: 'South Lake Union',
    fullAddress: '810 Terry Ave N, Seattle, WA',
    coordinates: { x: 65, y: 30 },
    bedrooms: 0,
    bathrooms: 4,
    balconies: 0,
    builtUpAreaSqFt: 4200,
    carpetAreaSqFt: 3800,
    floorNumber: 9,
    totalFloors: 18,
    propertyAge: '3 Years',
    furnishing: 'semi-furnished',
    availability: 'ready-to-move',
    verified: false,
    featured: false,
    approvalStatus: 'approved',
    images: ['/img2.jpg'],
    description: 'Corporate office',
    keyFeatures: [],
    amenities: [],
    floorPlans: [],
    nearbyFacilities: [],
    legalInfo: 'Commercial lease ready',
    ownershipType: 'Leasehold',
    listedById: 'usr-agent-2',
    listedByName: 'Marcus Sterling',
    listedByRole: 'agent',
    viewsCount: 150,
    createdAt: '2026-11-10T10:00:00Z',
  },
  {
    id: 'ME-PRP-103',
    title: 'Pending Villa Listing',
    listingType: 'sale',
    category: 'residential',
    propertyType: 'villa',
    price: 2100000,
    priceUnit: 'total',
    city: 'Austin',
    locality: 'Westlake Hills',
    fullAddress: '12 Crestline Rd, Austin, TX',
    coordinates: { x: 30, y: 60 },
    bedrooms: 5,
    bathrooms: 5,
    balconies: 3,
    builtUpAreaSqFt: 4800,
    carpetAreaSqFt: 4300,
    floorNumber: 0,
    totalFloors: 2,
    propertyAge: 'New Build',
    furnishing: 'unfurnished',
    availability: 'under-construction',
    verified: true,
    featured: false,
    approvalStatus: 'pending',
    images: ['/img3.jpg'],
    description: 'Pending villa',
    keyFeatures: [],
    amenities: [],
    floorPlans: [],
    nearbyFacilities: [],
    legalInfo: 'Under review',
    ownershipType: 'Freehold',
    listedById: 'usr-owner-1',
    listedByName: 'David Chen',
    listedByRole: 'owner',
    viewsCount: 0,
    createdAt: '2026-11-18T10:00:00Z',
  },
];

test('filterProperties excludes pending listings by default', () => {
  const result = filterProperties(sampleProperties, {});
  assert.equal(result.length, 2);
  assert.ok(result.every((p) => p.approvalStatus === 'approved'));
});

test('filterProperties filters by listingType, city, bedrooms, price, and verified status', () => {
  const result = filterProperties(sampleProperties, {
    listingType: 'sale',
    city: 'Austin',
    minBedrooms: 3,
    minPrice: 1000000,
    maxPrice: 1500000,
    verifiedOnly: true,
  });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'ME-PRP-101');
});

test('filterProperties filters commercial rentals by area and furnishing', () => {
  const result = filterProperties(sampleProperties, {
    category: 'commercial',
    listingType: 'rent',
    minArea: 4000,
    furnishing: 'semi-furnished',
  });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'ME-PRP-102');
});

test('sortProperties orders by newest, price-asc, price-desc, and featured', () => {
  const approved = filterProperties(sampleProperties, {});
  assert.equal(sortProperties(approved, 'newest')[0].id, 'ME-PRP-102');
  assert.equal(sortProperties(approved, 'price-asc')[0].id, 'ME-PRP-102');
  assert.equal(sortProperties(approved, 'price-desc')[0].id, 'ME-PRP-101');
  assert.equal(sortProperties(approved, 'featured')[0].id, 'ME-PRP-101');
});
