export type UserRole = 'buyer' | 'agent' | 'developer' | 'owner' | 'admin';

export type ListingType = 'sale' | 'rent';

export type PropertyCategory = 'residential' | 'commercial';

export type PropertyType =
  | 'apartment'
  | 'villa'
  | 'house'
  | 'plot'
  | 'office'
  | 'retail';

export type FurnishingStatus = 'unfurnished' | 'semi-furnished' | 'furnished';

export type AvailabilityStatus = 'ready-to-move' | 'under-construction' | 'available-soon';

export type ApprovalStatus = 'approved' | 'pending' | 'rejected';

export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Site Visit Scheduled'
  | 'Interested'
  | 'Converted'
  | 'Closed';

export type VisitApprovalStatus = 'not-requested' | 'pending-approval' | 'approved' | 'declined';

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'featured';

export interface FloorPlan {
  id: string;
  label: string;
  areaSqFt: number;
  bedrooms: number;
  bathrooms: number;
  price: number;
  dimensions: string;
  rooms: string[];
}

export interface NearbyFacility {
  name: string;
  category: 'Transit' | 'School' | 'Healthcare' | 'Business Hub' | 'Retail' | 'Park';
  distance: string;
}

export interface Property {
  id: string;
  title: string;
  listingType: ListingType;
  category: PropertyCategory;
  propertyType: PropertyType;
  price: number;
  priceUnit: 'total' | 'monthly';
  city: string;
  locality: string;
  fullAddress: string;
  coordinates: { x: number; y: number }; // 0-100 normalized district map coordinates
  bedrooms: number;
  bathrooms: number;
  balconies: number;
  builtUpAreaSqFt: number;
  carpetAreaSqFt: number;
  floorNumber: number;
  totalFloors: number;
  propertyAge: string;
  furnishing: FurnishingStatus;
  availability: AvailabilityStatus;
  verified: boolean;
  featured: boolean;
  approvalStatus: ApprovalStatus;
  images: string[];
  videoTourTitle?: string;
  videoDuration?: string;
  description: string;
  keyFeatures: string[];
  amenities: string[];
  floorPlans: FloorPlan[];
  nearbyFacilities: NearbyFacility[];
  legalInfo: string;
  reraId?: string;
  ownershipType: string;
  listedById: string;
  listedByName: string;
  listedByRole: 'owner' | 'agent' | 'developer';
  listedByCompany?: string;
  developerId?: string;
  projectId?: string;
  viewsCount: number;
  createdAt: string; // ISO date string
}

export interface ProjectConfiguration {
  type: string;
  areaSqFt: string;
  priceRange: string;
  availableUnits: number;
}

export interface DevelopmentProject {
  id: string;
  name: string;
  developerId: string;
  developerName: string;
  category: PropertyCategory;
  city: string;
  locality: string;
  overview: string;
  startingPrice: number;
  status: 'New Launch' | 'Under Construction' | 'Ready to Move';
  configurations: ProjectConfiguration[];
  images: string[];
  floorPlans: FloorPlan[];
  amenities: string[];
  possessionTimeline: string;
  reraNumber: string;
  totalUnits: number;
  featured: boolean;
  verified: boolean;
  createdAt: string;
}

export interface DeveloperProfile {
  id: string;
  userId: string;
  companyName: string;
  monogram: string;
  tagline: string;
  about: string;
  yearsExperience: number;
  completedProjects: number;
  ongoingProjects: number;
  headquarters: string;
  phone: string;
  email: string;
  website: string;
  reraRegistration: string;
  verified: boolean;
}

export interface AgentProfile {
  id: string;
  userId: string;
  fullName: string;
  agency: string;
  photo: string;
  yearsExperience: number;
  specialization: string;
  serviceLocations: string[];
  phone: string;
  email: string;
  verified: boolean;
  bio: string;
  closedDeals: number;
  languages: string[];
}

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  companyName?: string;
  city: string;
  verified: boolean;
  active: boolean;
  joinedAt: string;
  bio?: string;
}

export interface LeadEnquiry {
  leadId: string;
  customerId?: string;
  customerName: string;
  phone: string;
  email: string;
  propertyId?: string;
  propertyTitle?: string;
  projectId?: string;
  projectTitle?: string;
  ownerOrAgentId: string;
  ownerOrAgentName: string;
  developerId?: string;
  enquiryType: 'contact' | 'callback' | 'site-visit' | 'agent-enquiry' | 'project-enquiry';
  message: string;
  preferredVisitDate?: string;
  visitApprovalStatus: VisitApprovalStatus;
  leadSource: string;
  createdAt: string;
  status: LeadStatus;
}

export interface PlatformNotification {
  id: string;
  userId: string;
  title: string;
  detail: string;
  createdAt: string;
  read: boolean;
}

export interface PropertyFilterCriteria {
  query?: string;
  city?: string;
  listingType?: ListingType | 'all';
  category?: PropertyCategory | 'all';
  propertyType?: PropertyType | 'all';
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  minBathrooms?: number;
  minArea?: number;
  maxArea?: number;
  furnishing?: FurnishingStatus | 'all';
  availability?: AvailabilityStatus | 'all';
  verifiedOnly?: boolean;
  includePending?: boolean;
}

export interface BuyingGuide {
  id: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  keyTakeaways: string[];
  sections: { heading: string; body: string }[];
}

export interface LocalityInsight {
  id: string;
  city: string;
  locality: string;
  avgPricePerSqFt: number;
  yoyGrowthPercent: number;
  rentalYieldPercent: number;
  connectivityScore: string;
  summary: string;
  highlights: string[];
}
