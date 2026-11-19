import type { LeadEnquiry, LeadStatus, UserAccount, VisitApprovalStatus } from '../types/marketplace';
import { generateLeadId } from './finance';

export interface CreateLeadInput {
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
  enquiryType: LeadEnquiry['enquiryType'];
  message: string;
  preferredVisitDate?: string;
  leadSource: string;
}

export function createAttributedLead(
  input: CreateLeadInput,
  existingCount: number,
  nowIso = new Date().toISOString()
): LeadEnquiry {
  const requestedVisit = input.enquiryType === 'site-visit' || Boolean(input.preferredVisitDate?.trim());

  // Site visits are never automatically confirmed; they always await professional approval.
  const visitApprovalStatus: VisitApprovalStatus = requestedVisit
    ? 'pending-approval'
    : 'not-requested';

  return {
    leadId: generateLeadId(existingCount),
    customerId: input.customerId,
    customerName: input.customerName.trim(),
    phone: input.phone.trim(),
    email: input.email.trim(),
    propertyId: input.propertyId,
    propertyTitle: input.propertyTitle,
    projectId: input.projectId,
    projectTitle: input.projectTitle,
    ownerOrAgentId: input.ownerOrAgentId,
    ownerOrAgentName: input.ownerOrAgentName,
    developerId: input.developerId,
    enquiryType: input.enquiryType,
    message: input.message.trim(),
    preferredVisitDate: input.preferredVisitDate?.trim() || undefined,
    visitApprovalStatus,
    leadSource: input.leadSource,
    createdAt: nowIso,
    status: 'New',
  };
}

export function getAuthorizedLeadsForUser(
  leads: LeadEnquiry[],
  user: UserAccount | null
): LeadEnquiry[] {
  if (!user) return [];
  if (user.role === 'admin') return leads;

  if (user.role === 'buyer') {
    return leads.filter(
      (lead) =>
        lead.customerId === user.id ||
        lead.email.toLowerCase() === user.email.toLowerCase()
    );
  }

  if (user.role === 'developer') {
    return leads.filter(
      (lead) => lead.developerId === user.id || lead.ownerOrAgentId === user.id
    );
  }

  // Agent or Property Owner only sees leads attributed to their listings/profile
  return leads.filter((lead) => lead.ownerOrAgentId === user.id);
}

export function canUserManageLead(lead: LeadEnquiry, user: UserAccount | null): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;
  if (user.role === 'developer') {
    return lead.developerId === user.id || lead.ownerOrAgentId === user.id;
  }
  if (user.role === 'agent' || user.role === 'owner') {
    return lead.ownerOrAgentId === user.id;
  }
  return false;
}

export function updateLeadVisitDecision(
  lead: LeadEnquiry,
  decision: 'approved' | 'declined'
): LeadEnquiry {
  const nextStatus: LeadStatus =
    decision === 'approved' ? 'Site Visit Scheduled' : lead.status === 'New' ? 'Contacted' : lead.status;

  return {
    ...lead,
    visitApprovalStatus: decision,
    status: nextStatus,
  };
}
