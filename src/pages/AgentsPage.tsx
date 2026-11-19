import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Mail, MapPin, X, CheckCircle2 } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import type { AgentProfile, LeadEnquiry } from '../types/marketplace';
import { SafeImage } from '../components/SafeImage';

export const AgentsPage: React.FC = () => {
  const { state, currentUser, submitLeadEnquiry } = useMarketplace();
  const [search, setSearch] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const [selectedAgent, setSelectedAgent] = useState<AgentProfile | null>(null);
  const [clientName, setClientName] = useState(currentUser?.fullName ?? '');
  const [clientPhone, setClientPhone] = useState(currentUser?.phone ?? '');
  const [clientEmail, setClientEmail] = useState(currentUser?.email ?? '');
  const [clientMessage, setClientMessage] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedLead, setSubmittedLead] = useState<LeadEnquiry | null>(null);

  const filteredAgents = useMemo(() => {
    const q = search.trim().toLowerCase();
    return state.agents.filter((agent) => {
      if (verifiedOnly && !agent.verified) return false;
      if (!q) return true;
      return [
        agent.fullName,
        agent.agency,
        agent.specialization,
        ...agent.serviceLocations,
      ]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [state.agents, search, verifiedOnly]);

  const openEnquiryModal = (agent: AgentProfile) => {
    setSelectedAgent(agent);
    setClientName(currentUser?.fullName ?? '');
    setClientPhone(currentUser?.phone ?? '');
    setClientEmail(currentUser?.email ?? '');
    setClientMessage(`Hello ${agent.fullName}, I am looking for advisory assistance in ${agent.serviceLocations[0]}.`);
    setFormError(null);
    setSubmittedLead(null);
  };

  const handleAgentEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgent) return;
    if (clientName.trim().length < 2 || clientPhone.trim().length < 7 || !clientEmail.includes('@')) {
      setFormError('Please provide your full name, valid phone number, and email address.');
      return;
    }
    const created = submitLeadEnquiry({
      customerId: currentUser?.id,
      customerName: clientName,
      phone: clientPhone,
      email: clientEmail,
      ownerOrAgentId: selectedAgent.userId,
      ownerOrAgentName: selectedAgent.fullName,
      enquiryType: 'agent-enquiry',
      message: clientMessage || 'General advisory enquiry.',
      leadSource: 'Agent Directory — Client Enquiry',
    });
    setSubmittedLead(created);
  };

  return (
    <div className="bg-[#F5F7FA] min-h-screen pb-16">
      <div className="bg-white border-b border-[#E6EAF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <p className="text-xs font-medium text-[#4778B8] mb-1">Verified Brokerage Network</p>
            <h1 className="font-display text-3xl font-bold text-[#142D4E]">
              Real Estate Agent Directory
            </h1>
            <p className="text-sm text-[#778397] mt-1.5 max-w-2xl">
              Connect with experienced residential advisors and commercial brokers across major
              metropolitan corridors.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              aria-label="Search agents by name, city, or specialization"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, location, or specialty..."
              className="px-3.5 py-2 text-sm border border-[#E6EAF0] rounded-[8px] bg-white text-[#202B3C] min-w-[240px]"
            />
            <label className="inline-flex items-center gap-2 text-xs font-medium text-[#202B3C] cursor-pointer">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="h-4 w-4 accent-[#142D4E]"
              />
              Verified Only
            </label>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAgents.map((agent) => {
            const listedProperties = state.properties.filter(
              (p) => p.listedById === agent.userId && p.approvalStatus === 'approved'
            );

            return (
              <article
                key={agent.id}
                className="bg-white border border-[#E6EAF0] rounded-[12px] p-6 flex flex-col justify-between gap-5"
              >
                <div>
                  <div className="flex items-start gap-4">
                    <SafeImage
                      src={agent.photo}
                      alt={agent.fullName}
                      className="h-20 w-20 rounded-[12px] object-cover border border-[#E6EAF0] shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-display text-lg font-bold text-[#142D4E]">
                          {agent.fullName}
                        </h2>
                        {agent.verified && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#142D4E]">
                            <ShieldCheck className="h-4 w-4 text-[#4778B8]" aria-hidden="true" />
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#4778B8] font-medium">{agent.agency}</p>
                      <p className="text-xs text-[#778397] mt-1 tabular-nums">
                        {agent.yearsExperience} Years Experience · {agent.closedDeals} Closed
                        Transactions
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-[#202B3C]/85 mt-4 leading-relaxed">{agent.bio}</p>

                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#E6EAF0] text-xs">
                    <div>
                      <dt className="text-[#778397]">Specialization</dt>
                      <dd className="font-medium text-[#202B3C] mt-0.5">{agent.specialization}</dd>
                    </div>
                    <div>
                      <dt className="text-[#778397]">Service Locations</dt>
                      <dd className="font-medium text-[#202B3C] mt-0.5 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-[#4778B8] shrink-0" aria-hidden="true" />
                        <span>{agent.serviceLocations.join(', ')}</span>
                      </dd>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#202B3C] tabular-nums">
                      <Phone className="h-3.5 w-3.5 text-[#4778B8]" aria-hidden="true" />
                      <span>{agent.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#202B3C] truncate">
                      <Mail className="h-3.5 w-3.5 text-[#4778B8] shrink-0" aria-hidden="true" />
                      <span className="truncate">{agent.email}</span>
                    </div>
                  </dl>
                </div>

                <div className="pt-4 border-t border-[#E6EAF0] flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-[#778397]">
                    <span className="font-semibold text-[#142D4E] tabular-nums">
                      {listedProperties.length}
                    </span>{' '}
                    active {listedProperties.length === 1 ? 'listing' : 'listings'}
                    {listedProperties.length > 0 && (
                      <>
                        {' · '}
                        <Link
                          to={`/properties?q=${encodeURIComponent(agent.fullName)}`}
                          className="text-[#4778B8] hover:text-[#142D4E] font-medium"
                        >
                          View Listings
                        </Link>
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => openEnquiryModal(agent)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#142D4E] hover:bg-[#0B1F38] rounded-[8px] transition-colors"
                  >
                    Client Enquiry
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Agent Client Enquiry Modal */}
      {selectedAgent && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Enquire with ${selectedAgent.fullName}`}
          className="fixed inset-0 z-50 bg-[#0B1F38]/55 flex items-center justify-center p-4"
        >
          <div className="bg-white border border-[#E6EAF0] rounded-[14px] max-w-md w-full p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E6EAF0]">
              <div>
                <p className="text-xs text-[#778397]">{selectedAgent.agency}</p>
                <h2 className="font-display text-lg font-bold text-[#142D4E]">
                  Contact {selectedAgent.fullName}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAgent(null)}
                aria-label="Close modal"
                className="h-9 w-9 inline-flex items-center justify-center rounded-[8px] border border-[#E6EAF0] text-[#778397] hover:text-[#142D4E]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {submittedLead ? (
              <div className="pt-5 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-[#142D4E] shrink-0" />
                  <div>
                    <p className="font-semibold text-[#142D4E]">Enquiry Recorded</p>
                    <p className="text-sm text-[#778397] mt-1">
                      Reference ID:{' '}
                      <span className="font-mono font-semibold text-[#142D4E]">
                        {submittedLead.leadId}
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAgent(null)}
                  className="w-full py-2.5 text-sm font-medium text-white bg-[#142D4E] rounded-[10px]"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleAgentEnquiry} className="pt-4 space-y-3.5">
                {formError && <p className="text-xs text-red-600">{formError}</p>}
                <div>
                  <label htmlFor="ag-name" className="block text-xs font-medium text-[#202B3C] mb-1">
                    Full Name *
                  </label>
                  <input
                    id="ag-name"
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#E6EAF0] rounded-[8px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="ag-phone" className="block text-xs font-medium text-[#202B3C] mb-1">
                      Phone *
                    </label>
                    <input
                      id="ag-phone"
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-[#E6EAF0] rounded-[8px]"
                    />
                  </div>
                  <div>
                    <label htmlFor="ag-email" className="block text-xs font-medium text-[#202B3C] mb-1">
                      Email *
                    </label>
                    <input
                      id="ag-email"
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-[#E6EAF0] rounded-[8px]"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="ag-msg" className="block text-xs font-medium text-[#202B3C] mb-1">
                    Requirements
                  </label>
                  <textarea
                    id="ag-msg"
                    rows={3}
                    value={clientMessage}
                    onChange={(e) => setClientMessage(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#E6EAF0] rounded-[8px]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 text-sm font-semibold text-white bg-[#142D4E] hover:bg-[#0B1F38] rounded-[10px]"
                >
                  Submit Client Enquiry
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
