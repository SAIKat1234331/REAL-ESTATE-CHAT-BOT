import {
  SEED_AGENTS,
  SEED_DEVELOPERS,
  SEED_LEADS,
  SEED_NOTIFICATIONS,
  SEED_PROJECTS,
  SEED_PROPERTIES,
  SEED_USERS,
} from '../data/seedData';
import type {
  AgentProfile,
  DeveloperProfile,
  DevelopmentProject,
  LeadEnquiry,
  PlatformNotification,
  Property,
  UserAccount,
} from '../types/marketplace';

/**
 * Backend-ready repository abstraction.
 * Currently backed by localStorage for deterministic demo persistence.
 * Replace these methods with REST / GraphQL API calls when connecting a live backend.
 */
export interface MarketplaceSnapshot {
  properties: Property[];
  projects: DevelopmentProject[];
  developers: DeveloperProfile[];
  agents: AgentProfile[];
  users: UserAccount[];
  leads: LeadEnquiry[];
  notifications: PlatformNotification[];
  savedPropertyIds: string[];
  comparePropertyIds: string[];
  recentlyViewedIds: string[];
  currentUserId: string | null;
  categories: string[];
  platformSettings: {
    requireListingApproval: boolean;
    autoVerifyReraDevelopers: boolean;
    platformSupportEmail: string;
    platformSupportPhone: string;
  };
}

const STORAGE_KEY = 'meridian_estates_marketplace_v1';

export const DEFAULT_CATEGORIES = [
  'Apartment / Flat',
  'Luxury Villa',
  'Independent House',
  'Plot / Land',
  'Office Space',
  'Shop / Retail',
];

export function createInitialSnapshot(): MarketplaceSnapshot {
  return {
    properties: SEED_PROPERTIES,
    projects: SEED_PROJECTS,
    developers: SEED_DEVELOPERS,
    agents: SEED_AGENTS,
    users: SEED_USERS,
    leads: SEED_LEADS,
    notifications: SEED_NOTIFICATIONS,
    savedPropertyIds: ['ME-PRP-101', 'ME-PRP-102'],
    comparePropertyIds: ['ME-PRP-101', 'ME-PRP-102'],
    recentlyViewedIds: ['ME-PRP-101', 'ME-PRP-103'],
    currentUserId: null,
    categories: DEFAULT_CATEGORIES,
    platformSettings: {
      requireListingApproval: true,
      autoVerifyReraDevelopers: false,
      platformSupportEmail: 'advisory@meridian-estates.example',
      platformSupportPhone: '+1 (800) 555-0199',
    },
  };
}

export const marketplaceRepository = {
  load(): MarketplaceSnapshot {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return createInitialSnapshot();
      const parsed = JSON.parse(raw) as Partial<MarketplaceSnapshot>;
      const initial = createInitialSnapshot();
      return {
        ...initial,
        ...parsed,
        platformSettings: {
          ...initial.platformSettings,
          ...(parsed.platformSettings ?? {}),
        },
      };
    } catch {
      return createInitialSnapshot();
    }
  },

  save(snapshot: MarketplaceSnapshot): void {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch {
      // Gracefully ignore storage quota issues in private browsing contexts
    }
  },

  reset(): MarketplaceSnapshot {
    const initial = createInitialSnapshot();
    this.save(initial);
    return initial;
  },
};
