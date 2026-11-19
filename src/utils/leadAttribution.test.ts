import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canUserManageLead,
  createAttributedLead,
  getAuthorizedLeadsForUser,
  updateLeadVisitDecision,
} from './leadAttribution';
import type { UserAccount } from '../types/marketplace';

const agentA: UserAccount = {
  id: 'usr-agent-1',
  fullName: 'Claire Vance',
  email: 'claire@meridian.test',
  phone: '+1 555-0101',
  role: 'agent',
  city: 'Austin',
  verified: true,
  active: true,
  joinedAt: '2025-01-01T00:00:00Z',
};

const agentB: UserAccount = {
  ...agentA,
  id: 'usr-agent-2',
  fullName: 'Marcus Sterling',
  email: 'marcus@meridian.test',
};

const buyer: UserAccount = {
  ...agentA,
  id: 'usr-buyer-1',
  fullName: 'Priya Nair',
  email: 'priya@buyer.test',
  role: 'buyer',
};

const admin: UserAccount = {
  ...agentA,
  id: 'usr-admin-1',
  fullName: 'System Admin',
  email: 'admin@meridian.test',
  role: 'admin',
};

test('createAttributedLead never auto-confirms a site visit request', () => {
  const lead = createAttributedLead(
    {
      customerId: buyer.id,
      customerName: buyer.fullName,
      phone: '+1 555-0199',
      email: buyer.email,
      propertyId: 'ME-PRP-101',
      propertyTitle: 'Skyline Penthouse',
      ownerOrAgentId: agentA.id,
      ownerOrAgentName: agentA.fullName,
      enquiryType: 'site-visit',
      message: 'Would like to inspect the terrace and amenities.',
      preferredVisitDate: '2026-12-05',
      leadSource: 'Property Details — Site Visit Form',
    },
    10
  );

  assert.match(lead.leadId, /^LD-0111-\d{4}$/);
  assert.equal(lead.visitApprovalStatus, 'pending-approval');
  assert.equal(lead.status, 'New');
  assert.equal(lead.ownerOrAgentId, agentA.id);
});

test('getAuthorizedLeadsForUser enforces strict RBAC lead isolation', () => {
  const leadForA = createAttributedLead(
    {
      customerId: buyer.id,
      customerName: buyer.fullName,
      phone: '+1 555-0199',
      email: buyer.email,
      propertyId: 'ME-PRP-101',
      ownerOrAgentId: agentA.id,
      ownerOrAgentName: agentA.fullName,
      enquiryType: 'contact',
      message: 'Interested in pricing.',
      leadSource: 'Property Details',
    },
    1
  );

  const leadForB = createAttributedLead(
    {
      customerName: 'Other Client',
      phone: '+1 555-0200',
      email: 'other@client.test',
      propertyId: 'ME-PRP-102',
      ownerOrAgentId: agentB.id,
      ownerOrAgentName: agentB.fullName,
      enquiryType: 'callback',
      message: 'Call back please.',
      leadSource: 'Property Details',
    },
    2
  );

  const allLeads = [leadForA, leadForB];

  assert.equal(getAuthorizedLeadsForUser(allLeads, null).length, 0);
  assert.equal(getAuthorizedLeadsForUser(allLeads, agentA).length, 1);
  assert.equal(getAuthorizedLeadsForUser(allLeads, agentA)[0].ownerOrAgentId, agentA.id);
  assert.equal(getAuthorizedLeadsForUser(allLeads, buyer).length, 1);
  assert.equal(getAuthorizedLeadsForUser(allLeads, admin).length, 2);
  assert.equal(canUserManageLead(leadForA, agentA), true);
  assert.equal(canUserManageLead(leadForA, agentB), false);
  assert.equal(canUserManageLead(leadForA, buyer), false);
});

test('updateLeadVisitDecision transitions visit to approved and updates lead status', () => {
  const lead = createAttributedLead(
    {
      customerName: 'Priya Nair',
      phone: '+1 555-0199',
      email: 'priya@buyer.test',
      propertyId: 'ME-PRP-101',
      ownerOrAgentId: agentA.id,
      ownerOrAgentName: agentA.fullName,
      enquiryType: 'site-visit',
      message: 'Saturday morning works.',
      preferredVisitDate: '2026-12-06',
      leadSource: 'Property Details',
    },
    3
  );

  const approved = updateLeadVisitDecision(lead, 'approved');
  assert.equal(approved.visitApprovalStatus, 'approved');
  assert.equal(approved.status, 'Site Visit Scheduled');
});
