import React, { useState } from 'react';
import { CheckCircle2, Calendar, Phone, Mail, Clock } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import type { LeadEnquiry } from '../types/marketplace';

interface EnquiryPanelProps {
  propertyId?: string;
  propertyTitle?: string;
  projectId?: string;
  projectTitle?: string;
  ownerOrAgentId: string;
  ownerOrAgentName: string;
  ownerOrAgentRoleLabel: string;
  developerId?: string;
  leadSourcePrefix: string;
}

type EnquiryMode = 'contact' | 'callback' | 'site-visit';

export const EnquiryPanel: React.FC<EnquiryPanelProps> = ({
  propertyId,
  propertyTitle,
  projectId,
  projectTitle,
  ownerOrAgentId,
  ownerOrAgentName,
  ownerOrAgentRoleLabel,
  developerId,
  leadSourcePrefix,
}) => {
  const { currentUser, submitLeadEnquiry } = useMarketplace();
  const [mode, setMode] = useState<EnquiryMode>('contact');
  const [fullName, setFullName] = useState(currentUser?.fullName ?? '');
  const [phone, setPhone] = useState(currentUser?.phone ?? '');
  const [email, setEmail] = useState(currentUser?.email ?? '');
  const [preferredVisitDate, setPreferredVisitDate] = useState('');
  const [message, setMessage] = useState(
    propertyTitle
      ? `I would like more information regarding ${propertyTitle}.`
      : projectTitle
      ? `Please share the brochure and availability for ${projectTitle}.`
      : 'I would like to discuss property options.'
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedLead, setSubmittedLead] = useState<LeadEnquiry | null>(null);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (fullName.trim().length < 2) nextErrors.fullName = 'Please enter your full name.';
    if (phone.trim().length < 7) nextErrors.phone = 'Please enter a valid contact phone number.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (message.trim().length < 8) {
      nextErrors.message = 'Please include a brief note about your enquiry.';
    }
    if (mode === 'site-visit' && !preferredVisitDate) {
      nextErrors.preferredVisitDate = 'Please select a preferred date for your site visit request.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const modeLabel =
      mode === 'site-visit'
        ? 'Site Visit Request'
        : mode === 'callback'
        ? 'Callback Request'
        : 'Direct Contact';

    const created = submitLeadEnquiry({
      customerId: currentUser?.id,
      customerName: fullName,
      phone,
      email,
      propertyId,
      propertyTitle,
      projectId,
      projectTitle,
      ownerOrAgentId,
      ownerOrAgentName,
      developerId,
      enquiryType: projectId && mode === 'contact' ? 'project-enquiry' : mode,
      message,
      preferredVisitDate: preferredVisitDate || undefined,
      leadSource: `${leadSourcePrefix} — ${modeLabel}`,
    });

    setSubmittedLead(created);
  };

  if (submittedLead) {
    return (
      <div className="bg-white border border-[#E6EAF0] rounded-[12px] p-6 space-y-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-6 w-6 text-[#142D4E] shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h3 className="text-lg font-semibold text-[#142D4E]">Enquiry Submitted</h3>
            <p className="text-sm text-[#778397] mt-1">
              Your enquiry has been routed to{' '}
              <span className="font-medium text-[#202B3C]">{ownerOrAgentName}</span>.
            </p>
          </div>
        </div>

        <div className="bg-[#F5F7FA] border border-[#E6EAF0] rounded-[10px] p-4 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[#778397]">Enquiry Reference ID</span>
            <span className="font-mono font-semibold text-[#142D4E] tabular-nums">
              {submittedLead.leadId}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#778397]">Status</span>
            <span className="font-medium text-[#202B3C]">{submittedLead.status}</span>
          </div>
          {submittedLead.preferredVisitDate && (
            <div className="flex items-center justify-between">
              <span className="text-[#778397]">Preferred Visit Date</span>
              <span className="font-mono text-[#202B3C] tabular-nums">
                {submittedLead.preferredVisitDate}
              </span>
            </div>
          )}
        </div>

        {submittedLead.visitApprovalStatus === 'pending-approval' && (
          <div className="flex items-start gap-2.5 text-xs text-[#202B3C] bg-[#F5F7FA] border border-[#E6EAF0] rounded-[10px] p-3.5">
            <Clock className="h-4 w-4 text-[#4778B8] shrink-0 mt-0.5" aria-hidden="true" />
            <p className="leading-relaxed">
              <strong>Pending Professional Approval:</strong> Site visits are not automatically
              confirmed. {ownerOrAgentName} will review your preferred date and confirm availability.
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            setSubmittedLead(null);
            setErrors({});
          }}
          className="w-full py-2.5 px-4 text-sm font-medium text-[#142D4E] border border-[#E6EAF0] hover:bg-[#F5F7FA] rounded-[10px] transition-colors"
        >
          Send Another Enquiry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E6EAF0] rounded-[12px] p-6">
      <div className="pb-4 border-b border-[#E6EAF0]">
        <p className="text-xs text-[#778397]">{ownerOrAgentRoleLabel}</p>
        <h3 className="text-lg font-semibold text-[#142D4E] mt-0.5">{ownerOrAgentName}</h3>
      </div>

      {/* Mode selector segmented buttons */}
      <div
        role="tablist"
        aria-label="Enquiry options"
        className="grid grid-cols-3 gap-1 p-1 bg-[#F5F7FA] rounded-[10px] mt-4"
      >
        {(
          [
            { id: 'contact', label: 'Contact', icon: Mail },
            { id: 'callback', label: 'Callback', icon: Phone },
            { id: 'site-visit', label: 'Site Visit', icon: Calendar },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          const active = mode === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                setMode(tab.id);
                setErrors({});
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-medium rounded-[8px] transition-colors whitespace-nowrap ${
                active
                  ? 'bg-white text-[#142D4E] shadow-xs'
                  : 'text-[#778397] hover:text-[#202B3C]'
              }`}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-3.5">
        <div>
          <label htmlFor="enq-name" className="block text-xs font-medium text-[#202B3C] mb-1">
            Full Name *
          </label>
          <input
            id="enq-name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[8px] bg-white text-[#202B3C] focus:border-[#4778B8]"
          />
          {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
        </div>

        <div className="space-y-3.5">
          <div>
            <label htmlFor="enq-phone" className="block text-xs font-medium text-[#202B3C] mb-1">
              Phone Number *
            </label>
            <input
              id="enq-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (512) 555-0199"
              className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[8px] bg-white text-[#202B3C] focus:border-[#4778B8]"
            />
            {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="enq-email" className="block text-xs font-medium text-[#202B3C] mb-1">
              Email *
            </label>
            <input
              id="enq-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[8px] bg-white text-[#202B3C] focus:border-[#4778B8]"
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="enq-visit-date" className="block text-xs font-medium text-[#202B3C] mb-1">
            Preferred Visit Date {mode === 'site-visit' ? '*' : '(Optional)'}
          </label>
          <input
            id="enq-visit-date"
            type="date"
            value={preferredVisitDate}
            onChange={(e) => setPreferredVisitDate(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[8px] bg-white text-[#202B3C] focus:border-[#4778B8]"
          />
          {errors.preferredVisitDate && (
            <p className="text-xs text-red-600 mt-1">{errors.preferredVisitDate}</p>
          )}
          {mode === 'site-visit' && (
            <p className="text-[11px] text-[#778397] mt-1">
              Visit appointments require confirmation from the listing professional.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="enq-message" className="block text-xs font-medium text-[#202B3C] mb-1">
            Message *
          </label>
          <textarea
            id="enq-message"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[8px] bg-white text-[#202B3C] focus:border-[#4778B8]"
          />
          {errors.message && <p className="text-xs text-red-600 mt-1">{errors.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 text-sm font-medium text-white bg-[#142D4E] hover:bg-[#0B1F38] rounded-[10px] transition-colors"
        >
          {mode === 'site-visit'
            ? 'Request Site Visit'
            : mode === 'callback'
            ? 'Request a Callback'
            : 'Send Property Enquiry'}
        </button>

        <p className="text-[11px] text-[#778397] leading-relaxed">
          Generates a unique Enquiry ID stored locally in your session. No automated external SMS or
          email notifications are dispatched in demo mode.
        </p>
      </form>
    </div>
  );
};
