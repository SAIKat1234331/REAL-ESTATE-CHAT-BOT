import type { Property, PropertyFilterCriteria, SortOption } from '../types/marketplace';

export function filterProperties(
  properties: Property[],
  criteria: PropertyFilterCriteria
): Property[] {
  const normalizedQuery = criteria.query?.trim().toLowerCase() ?? '';
  const normalizedCity = criteria.city?.trim().toLowerCase() ?? '';

  return properties.filter((property) => {
    if (!criteria.includePending && property.approvalStatus !== 'approved') {
      return false;
    }

    if (criteria.listingType && criteria.listingType !== 'all') {
      if (property.listingType !== criteria.listingType) return false;
    }

    if (criteria.category && criteria.category !== 'all') {
      if (property.category !== criteria.category) return false;
    }

    if (criteria.propertyType && criteria.propertyType !== 'all') {
      if (property.propertyType !== criteria.propertyType) return false;
    }

    if (normalizedCity && normalizedCity !== 'all') {
      const cityMatch =
        property.city.toLowerCase().includes(normalizedCity) ||
        property.locality.toLowerCase().includes(normalizedCity);
      if (!cityMatch) return false;
    }

    if (normalizedQuery) {
      const searchableText = [
        property.title,
        property.city,
        property.locality,
        property.fullAddress,
        property.propertyType,
        property.listedByName,
        property.listedByCompany ?? '',
        property.id,
      ]
        .join(' ')
        .toLowerCase();
      if (!searchableText.includes(normalizedQuery)) return false;
    }

    if (typeof criteria.minPrice === 'number' && !Number.isNaN(criteria.minPrice) && criteria.minPrice > 0) {
      if (property.price < criteria.minPrice) return false;
    }

    if (typeof criteria.maxPrice === 'number' && !Number.isNaN(criteria.maxPrice) && criteria.maxPrice > 0) {
      if (property.price > criteria.maxPrice) return false;
    }

    if (typeof criteria.minBedrooms === 'number' && criteria.minBedrooms > 0) {
      if (property.bedrooms < criteria.minBedrooms) return false;
    }

    if (typeof criteria.minBathrooms === 'number' && criteria.minBathrooms > 0) {
      if (property.bathrooms < criteria.minBathrooms) return false;
    }

    if (typeof criteria.minArea === 'number' && !Number.isNaN(criteria.minArea) && criteria.minArea > 0) {
      if (property.builtUpAreaSqFt < criteria.minArea) return false;
    }

    if (typeof criteria.maxArea === 'number' && !Number.isNaN(criteria.maxArea) && criteria.maxArea > 0) {
      if (property.builtUpAreaSqFt > criteria.maxArea) return false;
    }

    if (criteria.furnishing && criteria.furnishing !== 'all') {
      if (property.furnishing !== criteria.furnishing) return false;
    }

    if (criteria.availability && criteria.availability !== 'all') {
      if (property.availability !== criteria.availability) return false;
    }

    if (criteria.verifiedOnly && !property.verified) {
      return false;
    }

    return true;
  });
}

export function sortProperties(properties: Property[], sortBy: SortOption): Property[] {
  const copy = [...properties];
  switch (sortBy) {
    case 'price-asc':
      return copy.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return copy.sort((a, b) => b.price - a.price);
    case 'featured':
      return copy.sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    case 'newest':
    default:
      return copy.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
}

export function formatPropertyTypeLabel(type: Property['propertyType']): string {
  const map: Record<Property['propertyType'], string> = {
    apartment: 'Apartment / Flat',
    villa: 'Luxury Villa',
    house: 'Independent House',
    plot: 'Plot / Land',
    office: 'Office Space',
    retail: 'Shop / Retail',
  };
  return map[type];
}

export function formatAvailabilityLabel(status: Property['availability']): string {
  const map: Record<Property['availability'], string> = {
    'ready-to-move': 'Ready to Move',
    'under-construction': 'Under Construction',
    'available-soon': 'Available Soon',
  };
  return map[status];
}

export function formatFurnishingLabel(status: Property['furnishing']): string {
  const map: Record<Property['furnishing'], string> = {
    furnished: 'Fully Furnished',
    'semi-furnished': 'Semi-Furnished',
    unfurnished: 'Unfurnished',
  };
  return map[status];
}
