import React, { useState } from 'react';
import { CheckCircle2, Mail, Phone, MapPin } from 'lucide-react';

interface StaticInfoPageProps {
  page: 'about' | 'contact' | 'privacy' | 'terms';
}

export const StaticInfoPage: React.FC<StaticInfoPageProps> = ({ page }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2 || !email.includes('@') || message.trim().length < 10) {
      setErr('Please fill in your name, a valid email address, and a brief message.');
      return;
    }
    setErr(null);
    setSent(true);
  };

  if (page === 'contact') {
    return (
      <div className="bg-[#F5F7FA] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-5">
            <p className="text-xs font-medium text-[#4778B8]">Corporate &amp; Partner Desk</p>
            <h1 className="font-display text-3xl font-bold text-[#142D4E]">Contact Meridian Estates</h1>
            <p className="text-sm text-[#778397] leading-relaxed">
              Reach our marketplace operations team regarding brokerage onboarding, developer RERA
              verification, or corporate real estate enquiries.
            </p>
            <div className="space-y-3 pt-2 text-sm text-[#202B3C]">
              <p className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#4778B8]" aria-hidden="true" />
                <span>advisory@meridian-estates.example</span>
              </p>
              <p className="flex items-center gap-2.5 tabular-nums">
                <Phone className="h-4 w-4 text-[#4778B8]" aria-hidden="true" />
                <span>+1 (800) 555-0199</span>
              </p>
              <p className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-[#4778B8]" aria-hidden="true" />
                <span>500 Congress Avenue, Suite 2100, Austin, TX</span>
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white border border-[#E6EAF0] rounded-[14px] p-6 sm:p-8">
            {sent ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="h-8 w-8 text-[#142D4E] mx-auto" aria-hidden="true" />
                <h2 className="font-display text-xl font-bold text-[#142D4E]">Message Received</h2>
                <p className="text-sm text-[#778397]">
                  Thank you, {name}. Your enquiry has been recorded in this demo session.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setName('');
                    setEmail('');
                    setSubject('');
                    setMessage('');
                  }}
                  className="mt-2 px-5 py-2.5 text-sm font-medium text-[#142D4E] border border-[#E6EAF0] rounded-[10px]"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <h2 className="font-display text-lg font-bold text-[#142D4E]">Send a Message</h2>
                {err && <p className="text-xs text-red-600">{err}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="c-name" className="block text-xs font-medium text-[#202B3C] mb-1">
                      Full Name *
                    </label>
                    <input
                      id="c-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px]"
                    />
                  </div>
                  <div>
                    <label htmlFor="c-email" className="block text-xs font-medium text-[#202B3C] mb-1">
                      Email Address *
                    </label>
                    <input
                      id="c-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px]"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="c-subject" className="block text-xs font-medium text-[#202B3C] mb-1">
                    Subject
                  </label>
                  <input
                    id="c-subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brokerage onboarding, developer listing, general inquiry"
                    className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px]"
                  />
                </div>
                <div>
                  <label htmlFor="c-msg" className="block text-xs font-medium text-[#202B3C] mb-1">
                    Message *
                  </label>
                  <textarea
                    id="c-msg"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 text-sm font-semibold text-white bg-[#142D4E] hover:bg-[#0B1F38] rounded-[10px]"
                >
                  Submit Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  const contentMap = {
    about: {
      kicker: 'Company Overview',
      title: 'About Meridian Estates',
      paragraphs: [
        'Meridian Estates is a modern real estate marketplace built to bring institutional clarity, verified documentation, and structured enquiry workflows to both residential and commercial property transactions.',
        'We connect homebuyers, corporate tenants, property owners, accredited brokers, and RERA-registered developers through transparent property data—including built-up vs. carpet area metrics, floor plans, locality benchmarks, and direct lead attribution.',
        'Every listing submitted on the platform follows a structured approval workflow, and site visits are scheduled only when explicitly confirmed by the responsible property professional.',
      ],
    },
    privacy: {
      kicker: 'Data Governance',
      title: 'Privacy Policy',
      paragraphs: [
        'Meridian Estates respects user privacy and enforces role-based access control over all property enquiries and contact records. Lead attribution data is shared solely with the authorized owner, agent, or developer associated with the specific listing.',
        'In this frontend marketplace build, user preferences, saved wishlists, submitted listings, and enquiries are persisted locally in your browser storage and are not transmitted to external marketing third parties.',
      ],
    },
    terms: {
      kicker: 'Platform Governance',
      title: 'Terms & Conditions',
      paragraphs: [
        'All property descriptions, pricing figures, RERA identifiers, and floor plan dimensions published by owners, brokers, and developers are subject to independent legal and physical due diligence prior to executing any sale or lease contract.',
        'Submitting a site visit request generates a unique Enquiry Reference ID and notifies the listing professional; appointments are not automatically confirmed until approved by the responsible party.',
      ],
    },
  };

  const info = contentMap[page];

  return (
    <div className="bg-[#F5F7FA] min-h-screen py-14 px-4 sm:px-6 lg:px-8">
      <article className="max-w-3xl mx-auto bg-white border border-[#E6EAF0] rounded-[14px] p-8 sm:p-10 space-y-5">
        <p className="text-xs font-medium text-[#4778B8]">{info.kicker}</p>
        <h1 className="font-display text-3xl font-bold text-[#142D4E]">{info.title}</h1>
        <div className="space-y-4 text-sm text-[#202B3C]/90 leading-relaxed pt-2">
          {info.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </article>
    </div>
  );
};
