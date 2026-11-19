import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  marketplaceRepository,
  type MarketplaceSnapshot,
} from '../services/marketplaceRepository';
import type {
  ApprovalStatus,
  DevelopmentProject,
  LeadEnquiry,
  LeadStatus,
  Property,
  UserAccount,
  UserRole,
} from '../types/marketplace';
import { generatePropertyId } from '../utils/finance';
import {
  createAttributedLead,
  type CreateLeadInput,
  updateLeadVisitDecision,
} from '../utils/leadAttribution';

interface RegisterUserInput {
  fullName: string;
  email: string;
  phone: string;
  role: Exclude<UserRole, 'admin'>;
  city: string;
  companyName?: string;
}

interface MarketplaceContextValue {
  state: MarketplaceSnapshot;
  currentUser: UserAccount | null;
  loginByEmail: (email: string) => { ok: boolean; error?: string };
  loginAsUserId: (userId: string) => void;
  registerUser: (input: RegisterUserInput) => { ok: boolean; error?: string; user?: UserAccount };
  logout: () => void;
  updateCurrentUserProfile: (patch: Partial<Pick<UserAccount, 'fullName' | 'phone' | 'city' | 'companyName' | 'bio'>>) => void;

  toggleSavedProperty: (propertyId: string) => void;
  toggleCompareProperty: (propertyId: string) => { added: boolean; limitReached?: boolean };
  clearCompareProperties: () => void;
  recordPropertyView: (propertyId: string) => void;

  submitLeadEnquiry: (input: CreateLeadInput) => LeadEnquiry;
  updateLeadStatus: (leadId: string, status: LeadStatus) => void;
  decideLeadVisit: (leadId: string, decision: 'approved' | 'declined') => void;

  addPropertyListing: (
    listing: Omit<Property, 'id' | 'approvalStatus' | 'viewsCount' | 'createdAt' | 'verified' | 'featured'>
  ) => Property;
  updatePropertyListing: (propertyId: string, patch: Partial<Property>) => void;
  deletePropertyListing: (propertyId: string) => void;
  setPropertyApproval: (propertyId: string, status: ApprovalStatus) => void;

  addDevelopmentProject: (
    project: Omit<DevelopmentProject, 'id' | 'createdAt' | 'featured' | 'verified'>
  ) => DevelopmentProject;
  deleteDevelopmentProject: (projectId: string) => void;

  toggleUserActive: (userId: string) => void;
  toggleUserVerified: (userId: string) => void;
  toggleAgentVerified: (agentId: string) => void;
  toggleDeveloperVerified: (developerId: string) => void;
  addCategory: (name: string) => void;
  removeCategory: (name: string) => void;
  updatePlatformSettings: (patch: Partial<MarketplaceSnapshot['platformSettings']>) => void;
  markAllNotificationsRead: () => void;
}

const MarketplaceContext = createContext<MarketplaceContextValue | null>(null);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<MarketplaceSnapshot>(() => marketplaceRepository.load());

  useEffect(() => {
    marketplaceRepository.save(state);
  }, [state]);

  const currentUser = useMemo(
    () => state.users.find((u) => u.id === state.currentUserId) ?? null,
    [state.users, state.currentUserId]
  );

  const loginByEmail = useCallback(
    (email: string): { ok: boolean; error?: string } => {
      const normalized = email.trim().toLowerCase();
      const found = state.users.find((u) => u.email.toLowerCase() === normalized);
      if (!found) {
        return {
          ok: false,
          error: 'No account found with that email address. Register a new account or choose a demo role below.',
        };
      }
      if (!found.active) {
        return {
          ok: false,
          error: 'This account has been suspended by the platform administrator.',
        };
      }
      setState((prev) => ({ ...prev, currentUserId: found.id }));
      return { ok: true };
    },
    [state.users]
  );

  const loginAsUserId = useCallback((userId: string) => {
    setState((prev) => {
      const found = prev.users.find((u) => u.id === userId && u.active);
      if (!found) return prev;
      return { ...prev, currentUserId: found.id };
    });
  }, []);

  const registerUser = useCallback(
    (input: RegisterUserInput): { ok: boolean; error?: string; user?: UserAccount } => {
      const normalized = input.email.trim().toLowerCase();
      if (state.users.some((u) => u.email.toLowerCase() === normalized)) {
        return { ok: false, error: 'An account with this email already exists. Please sign in instead.' };
      }

      const newUser: UserAccount = {
        id: `usr-${input.role}-${Date.now().toString().slice(-5)}`,
        fullName: input.fullName.trim(),
        email: input.email.trim(),
        phone: input.phone.trim(),
        role: input.role,
        companyName: input.companyName?.trim() || undefined,
        city: input.city.trim() || 'Austin',
        verified: false,
        active: true,
        joinedAt: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        users: [newUser, ...prev.users],
        currentUserId: newUser.id,
        notifications: [
          {
            id: `ntf-${Date.now()}`,
            userId: newUser.id,
            title: 'Welcome to Meridian Estates',
            detail: `Your ${input.role} workspace is active. Complete your profile or explore verified listings.`,
            createdAt: new Date().toISOString(),
            read: false,
          },
          ...prev.notifications,
        ],
      }));

      return { ok: true, user: newUser };
    },
    [state.users]
  );

  const logout = useCallback(() => {
    setState((prev) => ({ ...prev, currentUserId: null }));
  }, []);

  const updateCurrentUserProfile = useCallback(
    (patch: Partial<Pick<UserAccount, 'fullName' | 'phone' | 'city' | 'companyName' | 'bio'>>) => {
      setState((prev) => {
        if (!prev.currentUserId) return prev;
        return {
          ...prev,
          users: prev.users.map((u) =>
            u.id === prev.currentUserId ? { ...u, ...patch } : u
          ),
        };
      });
    },
    []
  );

  const toggleSavedProperty = useCallback((propertyId: string) => {
    setState((prev) => {
      const exists = prev.savedPropertyIds.includes(propertyId);
      return {
        ...prev,
        savedPropertyIds: exists
          ? prev.savedPropertyIds.filter((id) => id !== propertyId)
          : [propertyId, ...prev.savedPropertyIds],
      };
    });
  }, []);

  const toggleCompareProperty = useCallback(
    (propertyId: string): { added: boolean; limitReached?: boolean } => {
      const exists = state.comparePropertyIds.includes(propertyId);
      if (exists) {
        setState((prev) => ({
          ...prev,
          comparePropertyIds: prev.comparePropertyIds.filter((id) => id !== propertyId),
        }));
        return { added: false };
      }
      if (state.comparePropertyIds.length >= 4) {
        return { added: false, limitReached: true };
      }
      setState((prev) => ({
        ...prev,
        comparePropertyIds: [...prev.comparePropertyIds, propertyId],
      }));
      return { added: true };
    },
    [state.comparePropertyIds]
  );

  const clearCompareProperties = useCallback(() => {
    setState((prev) => ({ ...prev, comparePropertyIds: [] }));
  }, []);

  const recordPropertyView = useCallback((propertyId: string) => {
    setState((prev) => {
      const nextRecent = [
        propertyId,
        ...prev.recentlyViewedIds.filter((id) => id !== propertyId),
      ].slice(0, 8);
      return {
        ...prev,
        recentlyViewedIds: nextRecent,
        properties: prev.properties.map((p) =>
          p.id === propertyId ? { ...p, viewsCount: p.viewsCount + 1 } : p
        ),
      };
    });
  }, []);

  const submitLeadEnquiry = useCallback(
    (input: CreateLeadInput): LeadEnquiry => {
      const created = createAttributedLead(input, state.leads.length);
      setState((prev) => ({
        ...prev,
        leads: [created, ...prev.leads],
        notifications: [
          {
            id: `ntf-${Date.now()}`,
            userId: created.ownerOrAgentId,
            title: `New Enquiry Received (${created.leadId})`,
            detail: `${created.customerName} enquired regarding ${created.propertyTitle ?? created.projectTitle ?? 'your services'}.`,
            createdAt: created.createdAt,
            read: false,
          },
          ...prev.notifications,
        ],
      }));
      return created;
    },
    [state.leads.length]
  );

  const updateLeadStatus = useCallback((leadId: string, status: LeadStatus) => {
    setState((prev) => ({
      ...prev,
      leads: prev.leads.map((l) => (l.leadId === leadId ? { ...l, status } : l)),
    }));
  }, []);

  const decideLeadVisit = useCallback((leadId: string, decision: 'approved' | 'declined') => {
    setState((prev) => {
      const target = prev.leads.find((l) => l.leadId === leadId);
      const updatedLeads = prev.leads.map((l) =>
        l.leadId === leadId ? updateLeadVisitDecision(l, decision) : l
      );
      const extraNotification =
        target?.customerId
          ? [
              {
                id: `ntf-visit-${Date.now()}`,
                userId: target.customerId,
                title:
                  decision === 'approved'
                    ? `Site Visit Approved (${leadId})`
                    : `Site Visit Reschedule Needed (${leadId})`,
                detail:
                  decision === 'approved'
                    ? `${target.ownerOrAgentName} confirmed your requested viewing${target.preferredVisitDate ? ` for ${target.preferredVisitDate}` : ''}.`
                    : `${target.ownerOrAgentName} declined the requested date and will follow up with alternative times.`,
                createdAt: new Date().toISOString(),
                read: false,
              },
            ]
          : [];
      return {
        ...prev,
        leads: updatedLeads,
        notifications: [...extraNotification, ...prev.notifications],
      };
    });
  }, []);

  const addPropertyListing = useCallback(
    (
      listing: Omit<
        Property,
        'id' | 'approvalStatus' | 'viewsCount' | 'createdAt' | 'verified' | 'featured'
      >
    ): Property => {
      const created: Property = {
        ...listing,
        id: generatePropertyId(state.properties.length),
        approvalStatus: state.platformSettings.requireListingApproval ? 'pending' : 'approved',
        verified: false,
        featured: false,
        viewsCount: 0,
        createdAt: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        properties: [created, ...prev.properties],
        notifications: [
          {
            id: `ntf-prop-${Date.now()}`,
            userId: 'usr-admin-1',
            title: `New Listing Pending Approval (${created.id})`,
            detail: `"${created.title}" submitted by ${created.listedByName} awaits review.`,
            createdAt: created.createdAt,
            read: false,
          },
          ...prev.notifications,
        ],
      }));

      return created;
    },
    [state.properties.length, state.platformSettings.requireListingApproval]
  );

  const updatePropertyListing = useCallback((propertyId: string, patch: Partial<Property>) => {
    setState((prev) => ({
      ...prev,
      properties: prev.properties.map((p) => (p.id === propertyId ? { ...p, ...patch } : p)),
    }));
  }, []);

  const deletePropertyListing = useCallback((propertyId: string) => {
    setState((prev) => ({
      ...prev,
      properties: prev.properties.filter((p) => p.id !== propertyId),
      savedPropertyIds: prev.savedPropertyIds.filter((id) => id !== propertyId),
      comparePropertyIds: prev.comparePropertyIds.filter((id) => id !== propertyId),
    }));
  }, []);

  const setPropertyApproval = useCallback((propertyId: string, status: ApprovalStatus) => {
    setState((prev) => {
      const target = prev.properties.find((p) => p.id === propertyId);
      const nextProperties = prev.properties.map((p) =>
        p.id === propertyId
          ? { ...p, approvalStatus: status, verified: status === 'approved' ? true : p.verified }
          : p
      );
      const notify = target
        ? [
            {
              id: `ntf-apr-${Date.now()}`,
              userId: target.listedById,
              title:
                status === 'approved'
                  ? `Listing Approved (${target.id})`
                  : `Listing Status Updated (${target.id})`,
              detail: `"${target.title}" is now marked as ${status}.`,
              createdAt: new Date().toISOString(),
              read: false,
            },
          ]
        : [];
      return {
        ...prev,
        properties: nextProperties,
        notifications: [...notify, ...prev.notifications],
      };
    });
  }, []);

  const addDevelopmentProject = useCallback(
    (
      project: Omit<DevelopmentProject, 'id' | 'createdAt' | 'featured' | 'verified'>
    ): DevelopmentProject => {
      const created: DevelopmentProject = {
        ...project,
        id: `ME-PRJ-${state.projects.length + 201}`,
        featured: false,
        verified: state.platformSettings.autoVerifyReraDevelopers && Boolean(project.reraNumber),
        createdAt: new Date().toISOString(),
      };
      setState((prev) => ({
        ...prev,
        projects: [created, ...prev.projects],
      }));
      return created;
    },
    [state.projects.length, state.platformSettings.autoVerifyReraDevelopers]
  );

  const deleteDevelopmentProject = useCallback((projectId: string) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== projectId),
    }));
  }, []);

  const toggleUserActive = useCallback((userId: string) => {
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) => (u.id === userId ? { ...u, active: !u.active } : u)),
    }));
  }, []);

  const toggleUserVerified = useCallback((userId: string) => {
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) => (u.id === userId ? { ...u, verified: !u.verified } : u)),
    }));
  }, []);

  const toggleAgentVerified = useCallback((agentId: string) => {
    setState((prev) => ({
      ...prev,
      agents: prev.agents.map((a) => (a.id === agentId ? { ...a, verified: !a.verified } : a)),
    }));
  }, []);

  const toggleDeveloperVerified = useCallback((developerId: string) => {
    setState((prev) => ({
      ...prev,
      developers: prev.developers.map((d) =>
        d.id === developerId ? { ...d, verified: !d.verified } : d
      ),
    }));
  }, []);

  const addCategory = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setState((prev) => {
      if (prev.categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) return prev;
      return { ...prev, categories: [...prev.categories, trimmed] };
    });
  }, []);

  const removeCategory = useCallback((name: string) => {
    setState((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== name),
    }));
  }, []);

  const updatePlatformSettings = useCallback(
    (patch: Partial<MarketplaceSnapshot['platformSettings']>) => {
      setState((prev) => ({
        ...prev,
        platformSettings: { ...prev.platformSettings, ...patch },
      }));
    },
    []
  );

  const markAllNotificationsRead = useCallback(() => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.userId === prev.currentUserId ? { ...n, read: true } : n
      ),
    }));
  }, []);

  const value = useMemo(
    () => ({
      state,
      currentUser,
      loginByEmail,
      loginAsUserId,
      registerUser,
      logout,
      updateCurrentUserProfile,
      toggleSavedProperty,
      toggleCompareProperty,
      clearCompareProperties,
      recordPropertyView,
      submitLeadEnquiry,
      updateLeadStatus,
      decideLeadVisit,
      addPropertyListing,
      updatePropertyListing,
      deletePropertyListing,
      setPropertyApproval,
      addDevelopmentProject,
      deleteDevelopmentProject,
      toggleUserActive,
      toggleUserVerified,
      toggleAgentVerified,
      toggleDeveloperVerified,
      addCategory,
      removeCategory,
      updatePlatformSettings,
      markAllNotificationsRead,
    }),
    [
      state,
      currentUser,
      loginByEmail,
      loginAsUserId,
      registerUser,
      logout,
      updateCurrentUserProfile,
      toggleSavedProperty,
      toggleCompareProperty,
      clearCompareProperties,
      recordPropertyView,
      submitLeadEnquiry,
      updateLeadStatus,
      decideLeadVisit,
      addPropertyListing,
      updatePropertyListing,
      deletePropertyListing,
      setPropertyApproval,
      addDevelopmentProject,
      deleteDevelopmentProject,
      toggleUserActive,
      toggleUserVerified,
      toggleAgentVerified,
      toggleDeveloperVerified,
      addCategory,
      removeCategory,
      updatePlatformSettings,
      markAllNotificationsRead,
    ]
  );

  return <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>;
};

export function useMarketplace(): MarketplaceContextValue {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) {
    throw new Error('useMarketplace must be used inside MarketplaceProvider');
  }
  return ctx;
}
