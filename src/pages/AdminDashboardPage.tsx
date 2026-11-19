import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  Building2,
  ClipboardCheck,
  MessageSquare,
  Landmark,
  BarChart3,
  Settings,
  Check,
  X,
  Trash2,
  LogOut,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { formatCurrency, formatListingPrice } from '../utils/finance';

type AdminSection =
  | 'overview'
  | 'approvals'
  | 'properties'
  | 'projects'
  | 'users'
  | 'agents'
  | 'developers'
  | 'enquiries'
  | 'reports'
  | 'settings';

export const AdminDashboardPage: React.FC = () => {
  const {
    state,
    currentUser,
    loginAsUserId,
    logout,
    setPropertyApproval,
    deletePropertyListing,
    deleteDevelopmentProject,
    toggleUserActive,
    toggleUserVerified,
    toggleAgentVerified,
    toggleDeveloperVerified,
    addCategory,
    removeCategory,
    updatePlatformSettings,
  } = useMarketplace();
  const navigate = useNavigate();

  const [section, setSection] = useState<AdminSection>('overview');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'buyer' | 'agent' | 'developer' | 'owner'>('all');
  const [newCategory, setNewCategory] = useState('');

  // Role-gated security check
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="bg-[#F5F7FA] min-h-screen py-20 px-4">
        <div className="max-w-lg mx-auto bg-white border border-[#E6EAF0] rounded-[14px] p-8 text-center space-y-4">
          <ShieldCheck className="h-10 w-10 text-[#142D4E] mx-auto" aria-hidden="true" />
          <h1 className="font-display text-2xl font-bold text-[#142D4E]">
            Admin Authorization Required
          </h1>
          <p className="text-sm text-[#778397] leading-relaxed">
            This governance console is restricted to Meridian Estates administrators for listing
            approvals, user moderation, and platform-wide lead auditing.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => loginAsUserId('usr-admin-1')}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-[#142D4E] hover:bg-[#0B1F38] rounded-[10px]"
            >
              Sign In as Demo Admin
            </button>
            <Link
              to="/"
              className="px-5 py-2.5 text-sm font-medium text-[#202B3C] border border-[#E6EAF0] rounded-[10px]"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const pendingListings = state.properties.filter((p) => p.approvalStatus === 'pending');
  const approvedListings = state.properties.filter((p) => p.approvalStatus === 'approved');
  const filteredUsers = state.users.filter((u) => {
    if (u.role === 'admin') return false;
    if (userRoleFilter === 'all') return true;
    return u.role === userRoleFilter;
  });

  const navItems: { id: AdminSection; label: string; icon: React.ComponentType<{ className?: string }>; count?: number }[] = [
    { id: 'overview', label: 'Dashboard Overview', icon: BarChart3 },
    { id: 'approvals', label: 'Listing Approvals', icon: ClipboardCheck, count: pendingListings.length },
    { id: 'properties', label: 'Property Management', icon: Building2 },
    { id: 'projects', label: 'Project Management', icon: Landmark },
    { id: 'users', label: 'User & Buyer Mgmt', icon: Users },
    { id: 'agents', label: 'Agent Management', icon: ShieldCheck },
    { id: 'developers', label: 'Developer Management', icon: Landmark },
    { id: 'enquiries', label: 'Enquiry Management', icon: MessageSquare },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Platform Settings', icon: Settings },
  ];

  return (
    <div className="bg-[#F5F7FA] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Admin Sidebar */}
        <aside className="lg:col-span-3 bg-[#0B1F38] text-white rounded-[12px] p-4 space-y-4">
          <div className="px-2 pb-4 border-b border-white/10">
            <p className="text-xs text-[#9AC0EE] font-medium">Secure Admin Console</p>
            <h1 className="font-display text-lg font-bold mt-0.5">{currentUser.fullName}</h1>
            <p className="text-xs text-[#98A8BD]">Marketplace Governance</p>
          </div>

          <nav aria-label="Admin sections" className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = section === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSection(item.id)}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 text-xs font-medium rounded-[8px] transition-colors ${
                    active ? 'bg-white text-[#142D4E]' : 'text-[#DCE5F0] hover:bg-white/10'
                  }`}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {typeof item.count === 'number' && item.count > 0 && (
                    <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-white">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-[#DCE5F0] border border-white/15 hover:bg-white/10 rounded-[8px] transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Admin Content */}
        <div className="lg:col-span-9 space-y-6">
          {/* OVERVIEW */}
          {section === 'overview' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-white border border-[#E6EAF0] rounded-[12px] p-5">
                  <p className="text-xs text-[#778397]">Approved Listings</p>
                  <p className="font-display text-2xl font-bold text-[#142D4E] tabular-nums mt-1">
                    {approvedListings.length}
                  </p>
                </div>
                <div className="bg-white border border-[#E6EAF0] rounded-[12px] p-5">
                  <p className="text-xs text-[#778397]">Pending Approvals</p>
                  <p className="font-display text-2xl font-bold text-amber-700 tabular-nums mt-1">
                    {pendingListings.length}
                  </p>
                </div>
                <div className="bg-white border border-[#E6EAF0] rounded-[12px] p-5">
                  <p className="text-xs text-[#778397]">Registered Accounts</p>
                  <p className="font-display text-2xl font-bold text-[#142D4E] tabular-nums mt-1">
                    {state.users.length}
                  </p>
                </div>
                <div className="bg-white border border-[#E6EAF0] rounded-[12px] p-5">
                  <p className="text-xs text-[#778397]">Total Platform Leads</p>
                  <p className="font-display text-2xl font-bold text-[#142D4E] tabular-nums mt-1">
                    {state.leads.length}
                  </p>
                </div>
              </div>

              <div className="bg-white border border-[#E6EAF0] rounded-[12px] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold text-[#142D4E]">
                    Pending Listing Approvals
                  </h2>
                  <button
                    type="button"
                    onClick={() => setSection('approvals')}
                    className="text-xs font-semibold text-[#4778B8]"
                  >
                    Open Queue
                  </button>
                </div>
                {pendingListings.length === 0 ? (
                  <p className="text-sm text-[#778397]">All submitted property listings have been reviewed.</p>
                ) : (
                  pendingListings.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 border border-[#E6EAF0] rounded-[10px] flex flex-wrap items-center justify-between gap-4"
                    >
                      <div>
                        <p className="text-xs font-mono text-[#778397]">
                          {p.id} · Submitted by {p.listedByName}
                        </p>
                        <p className="font-semibold text-[#142D4E]">{p.title}</p>
                        <p className="text-xs text-[#778397]">
                          {p.locality}, {p.city} · {formatListingPrice(p.price, p.priceUnit)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPropertyApproval(p.id, 'approved')}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-[#142D4E] rounded-[8px]"
                        >
                          <Check className="h-3.5 w-3.5" />
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => setPropertyApproval(p.id, 'rejected')}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 border border-red-200 rounded-[8px]"
                        >
                          <X className="h-3.5 w-3.5" />
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {/* LISTING APPROVALS */}
          {section === 'approvals' && (
            <section className="bg-white border border-[#E6EAF0] rounded-[12px] p-6 space-y-4">
              <h2 className="font-display text-xl font-bold text-[#142D4E]">
                Listing Approval Queue ({pendingListings.length})
              </h2>
              {pendingListings.length === 0 ? (
                <p className="text-sm text-[#778397] py-8 text-center">
                  Zero listings currently pending approval.
                </p>
              ) : (
                <div className="space-y-4">
                  {pendingListings.map((p) => (
                    <div
                      key={p.id}
                      className="p-5 border border-[#E6EAF0] rounded-[10px] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <p className="text-xs font-mono text-[#778397]">
                          {p.id} · {p.ownershipType} · RERA: {p.reraId ?? 'Not Provided'}
                        </p>
                        <h3 className="font-semibold text-[#142D4E]">{p.title}</h3>
                        <p className="text-xs text-[#778397]">
                          {p.fullAddress} · {formatListingPrice(p.price, p.priceUnit)} · By{' '}
                          {p.listedByName} ({p.listedByRole})
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setPropertyApproval(p.id, 'approved')}
                          className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-white bg-[#142D4E] rounded-[8px]"
                        >
                          <Check className="h-3.5 w-3.5" />
                          Approve &amp; Publish
                        </button>
                        <button
                          type="button"
                          onClick={() => setPropertyApproval(p.id, 'rejected')}
                          className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-medium text-red-700 border border-red-200 rounded-[8px]"
                        >
                          <X className="h-3.5 w-3.5" />
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* PROPERTY MANAGEMENT */}
          {section === 'properties' && (
            <section className="bg-white border border-[#E6EAF0] rounded-[12px] p-6 space-y-4">
              <h2 className="font-display text-xl font-bold text-[#142D4E]">
                All Property Listings ({state.properties.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#E6EAF0] text-xs text-[#778397]">
                      <th className="py-3 pr-3 font-medium">Listing</th>
                      <th className="py-3 px-3 font-medium">Price</th>
                      <th className="py-3 px-3 font-medium">Status</th>
                      <th className="py-3 pl-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6EAF0]">
                    {state.properties.map((p) => (
                      <tr key={p.id}>
                        <td className="py-3 pr-3">
                          <Link
                            to={`/properties/${p.id}`}
                            className="font-semibold text-[#142D4E] hover:text-[#4778B8]"
                          >
                            {p.title}
                          </Link>
                          <p className="text-xs text-[#778397]">
                            {p.id} · {p.city} · By {p.listedByName}
                          </p>
                        </td>
                        <td className="py-3 px-3 font-mono text-xs tabular-nums">
                          {formatListingPrice(p.price, p.priceUnit)}
                        </td>
                        <td className="py-3 px-3 text-xs font-semibold capitalize">
                          {p.approvalStatus}
                        </td>
                        <td className="py-3 pl-3 text-right whitespace-nowrap space-x-2">
                          {p.approvalStatus !== 'approved' && (
                            <button
                              type="button"
                              onClick={() => setPropertyApproval(p.id, 'approved')}
                              className="px-2.5 py-1 text-xs font-semibold text-white bg-[#142D4E] rounded-[6px]"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => deletePropertyListing(p.id)}
                            aria-label={`Remove ${p.title}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-red-700 border border-red-200 rounded-[6px]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* PROJECT MANAGEMENT */}
          {section === 'projects' && (
            <section className="bg-white border border-[#E6EAF0] rounded-[12px] p-6 space-y-4">
              <h2 className="font-display text-xl font-bold text-[#142D4E]">
                Development Projects ({state.projects.length})
              </h2>
              <div className="divide-y divide-[#E6EAF0]">
                {state.projects.map((prj) => (
                  <div key={prj.id} className="py-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-mono text-[#778397]">
                        {prj.id} · {prj.reraNumber}
                      </p>
                      <Link
                        to={`/projects/${prj.id}`}
                        className="font-semibold text-[#142D4E] hover:text-[#4778B8]"
                      >
                        {prj.name}
                      </Link>
                      <p className="text-xs text-[#778397]">
                        {prj.developerName} · {prj.city} · From {formatCurrency(prj.startingPrice)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteDevelopmentProject(prj.id)}
                      className="px-3 py-1.5 text-xs font-medium text-red-700 border border-red-200 rounded-[8px]"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* USER & BUYER MANAGEMENT */}
          {section === 'users' && (
            <section className="bg-white border border-[#E6EAF0] rounded-[12px] p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-xl font-bold text-[#142D4E]">
                  User &amp; Buyer Management
                </h2>
                <div className="inline-flex p-1 bg-[#F5F7FA] border border-[#E6EAF0] rounded-[8px]">
                  {(['all', 'buyer', 'owner', 'agent', 'developer'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setUserRoleFilter(r)}
                      className={`px-3 py-1 text-xs font-medium rounded-[6px] capitalize ${
                        userRoleFilter === r ? 'bg-white text-[#142D4E] shadow-xs' : 'text-[#778397]'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#E6EAF0] text-xs text-[#778397]">
                      <th className="py-2.5 pr-3 font-medium">User</th>
                      <th className="py-2.5 px-3 font-medium">Role</th>
                      <th className="py-2.5 px-3 font-medium">Status</th>
                      <th className="py-2.5 pl-3 font-medium text-right">Governance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6EAF0]">
                    {filteredUsers.map((u) => (
                      <tr key={u.id}>
                        <td className="py-3 pr-3">
                          <p className="font-semibold text-[#142D4E]">{u.fullName}</p>
                          <p className="text-xs text-[#778397]">{u.email}</p>
                        </td>
                        <td className="py-3 px-3 text-xs capitalize font-medium text-[#202B3C]">
                          {u.role}
                        </td>
                        <td className="py-3 px-3 text-xs">
                          <span className={u.active ? 'text-emerald-700 font-medium' : 'text-red-700 font-medium'}>
                            {u.active ? 'Active' : 'Suspended'}
                          </span>
                          {' · '}
                          <span className="text-[#778397]">{u.verified ? 'Verified' : 'Unverified'}</span>
                        </td>
                        <td className="py-3 pl-3 text-right whitespace-nowrap space-x-2">
                          <button
                            type="button"
                            onClick={() => toggleUserVerified(u.id)}
                            className="px-2.5 py-1 text-xs font-medium text-[#142D4E] border border-[#E6EAF0] rounded-[6px]"
                          >
                            {u.verified ? 'Revoke Verify' : 'Verify'}
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleUserActive(u.id)}
                            className={`px-2.5 py-1 text-xs font-medium rounded-[6px] border ${
                              u.active
                                ? 'text-red-700 border-red-200'
                                : 'text-emerald-700 border-emerald-200'
                            }`}
                          >
                            {u.active ? 'Suspend' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* AGENT MANAGEMENT */}
          {section === 'agents' && (
            <section className="bg-white border border-[#E6EAF0] rounded-[12px] p-6 space-y-4">
              <h2 className="font-display text-xl font-bold text-[#142D4E]">
                Agent Verification Management
              </h2>
              <div className="divide-y divide-[#E6EAF0]">
                {state.agents.map((a) => (
                  <div key={a.id} className="py-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[#142D4E]">{a.fullName}</p>
                      <p className="text-xs text-[#778397]">
                        {a.agency} · {a.specialization}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleAgentVerified(a.id)}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-[8px] border ${
                        a.verified
                          ? 'bg-[#F5F7FA] text-[#142D4E] border-[#E6EAF0]'
                          : 'bg-[#142D4E] text-white border-[#142D4E]'
                      }`}
                    >
                      {a.verified ? 'Verified (Click to Unverify)' : 'Verify Agent'}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* DEVELOPER MANAGEMENT */}
          {section === 'developers' && (
            <section className="bg-white border border-[#E6EAF0] rounded-[12px] p-6 space-y-4">
              <h2 className="font-display text-xl font-bold text-[#142D4E]">
                Developer Verification Management
              </h2>
              <div className="divide-y divide-[#E6EAF0]">
                {state.developers.map((d) => (
                  <div key={d.id} className="py-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[#142D4E]">{d.companyName}</p>
                      <p className="text-xs text-[#778397] font-mono">
                        {d.reraRegistration} · {d.headquarters}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleDeveloperVerified(d.id)}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-[8px] border ${
                        d.verified
                          ? 'bg-[#F5F7FA] text-[#142D4E] border-[#E6EAF0]'
                          : 'bg-[#142D4E] text-white border-[#142D4E]'
                      }`}
                    >
                      {d.verified ? 'Verified (Click to Unverify)' : 'Verify Developer'}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ENQUIRY MANAGEMENT */}
          {section === 'enquiries' && (
            <section className="bg-white border border-[#E6EAF0] rounded-[12px] p-6 space-y-4">
              <h2 className="font-display text-xl font-bold text-[#142D4E]">
                Platform-Wide Lead &amp; Attribution Audit ({state.leads.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#E6EAF0] text-xs text-[#778397]">
                      <th className="py-2.5 pr-3 font-medium">Lead ID</th>
                      <th className="py-2.5 px-3 font-medium">Customer</th>
                      <th className="py-2.5 px-3 font-medium">Attributed Owner / Agent</th>
                      <th className="py-2.5 px-3 font-medium">Lead Source</th>
                      <th className="py-2.5 pl-3 font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6EAF0]">
                    {state.leads.map((lead) => (
                      <tr key={lead.leadId}>
                        <td className="py-3 pr-3 font-mono text-xs font-semibold text-[#142D4E]">
                          {lead.leadId}
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-medium text-[#202B3C]">{lead.customerName}</p>
                          <p className="text-xs text-[#778397]">{lead.email}</p>
                        </td>
                        <td className="py-3 px-3 text-xs text-[#202B3C]">
                          {lead.ownerOrAgentName}
                        </td>
                        <td className="py-3 px-3 text-xs text-[#778397]">{lead.leadSource}</td>
                        <td className="py-3 pl-3 text-right text-xs font-semibold text-[#142D4E]">
                          {lead.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* REPORTS & ANALYTICS */}
          {section === 'reports' && (
            <section className="bg-white border border-[#E6EAF0] rounded-[12px] p-6 space-y-6">
              <h2 className="font-display text-xl font-bold text-[#142D4E]">
                Marketplace Reports &amp; Activity Summary
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="p-4 bg-[#F5F7FA] border border-[#E6EAF0] rounded-[10px]">
                  <p className="text-xs text-[#778397]">Residential Inventory</p>
                  <p className="font-display text-2xl font-bold text-[#142D4E] tabular-nums mt-1">
                    {state.properties.filter((p) => p.category === 'residential').length}
                  </p>
                </div>
                <div className="p-4 bg-[#F5F7FA] border border-[#E6EAF0] rounded-[10px]">
                  <p className="text-xs text-[#778397]">Commercial Inventory</p>
                  <p className="font-display text-2xl font-bold text-[#142D4E] tabular-nums mt-1">
                    {state.properties.filter((p) => p.category === 'commercial').length}
                  </p>
                </div>
                <div className="p-4 bg-[#F5F7FA] border border-[#E6EAF0] rounded-[10px]">
                  <p className="text-xs text-[#778397]">Total Listing Views</p>
                  <p className="font-display text-2xl font-bold text-[#142D4E] tabular-nums mt-1">
                    {state.properties.reduce((s, p) => s + p.viewsCount, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* PLATFORM SETTINGS & CATEGORIES */}
          {section === 'settings' && (
            <section className="bg-white border border-[#E6EAF0] rounded-[12px] p-6 space-y-6">
              <h2 className="font-display text-xl font-bold text-[#142D4E]">
                Platform Settings &amp; Property Categories
              </h2>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 border border-[#E6EAF0] rounded-[10px] cursor-pointer">
                  <div>
                    <p className="text-sm font-semibold text-[#142D4E]">
                      Require Admin Approval for New Listings
                    </p>
                    <p className="text-xs text-[#778397]">
                      When enabled, submitted listings begin with Pending Approval status.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={state.platformSettings.requireListingApproval}
                    onChange={(e) =>
                      updatePlatformSettings({ requireListingApproval: e.target.checked })
                    }
                    className="h-4 w-4 accent-[#142D4E]"
                  />
                </label>
              </div>

              <div className="pt-4 border-t border-[#E6EAF0] space-y-3">
                <h3 className="text-sm font-semibold text-[#142D4E]">Manage Property Categories</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Add category (e.g. Industrial Warehouse)"
                    className="flex-1 px-3.5 py-2 text-sm border border-[#E6EAF0] rounded-[8px]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addCategory(newCategory);
                      setNewCategory('');
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#142D4E] rounded-[8px]"
                  >
                    Add
                  </button>
                </div>
                <div className="divide-y divide-[#E6EAF0] border border-[#E6EAF0] rounded-[10px]">
                  {state.categories.map((cat) => (
                    <div key={cat} className="px-4 py-2.5 flex items-center justify-between text-sm">
                      <span>{cat}</span>
                      <button
                        type="button"
                        onClick={() => removeCategory(cat)}
                        className="text-xs text-red-700 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
