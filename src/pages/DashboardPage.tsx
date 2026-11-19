import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Building2,
  Heart,
  MessageSquare,
  Bell,
  Settings,
  Plus,
  Trash2,
  LogOut,
  Check,
  X,
  Landmark,
  Edit3,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ASSET_IMAGES } from '../data/seedData';
import type { LeadStatus, Property } from '../types/marketplace';
import { formatCurrency, formatListingPrice } from '../utils/finance';
import { canUserManageLead, getAuthorizedLeadsForUser } from '../utils/leadAttribution';
import { PropertyCard } from '../components/PropertyCard';

type DashboardTab =
  | 'overview'
  | 'profile'
  | 'properties'
  | 'projects'
  | 'saved'
  | 'enquiries'
  | 'notifications'
  | 'settings';

const LEAD_STATUSES: LeadStatus[] = [
  'New',
  'Contacted',
  'Site Visit Scheduled',
  'Interested',
  'Converted',
  'Closed',
];

export const DashboardPage: React.FC = () => {
  const {
    state,
    currentUser,
    logout,
    updateCurrentUserProfile,
    updateLeadStatus,
    decideLeadVisit,
    updatePropertyListing,
    deletePropertyListing,
    addDevelopmentProject,
    deleteDevelopmentProject,
    markAllNotificationsRead,
  } = useMarketplace();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  // Profile form state
  const [profileName, setProfileName] = useState(currentUser?.fullName ?? '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone ?? '');
  const [profileCity, setProfileCity] = useState(currentUser?.city ?? '');
  const [profileCompany, setProfileCompany] = useState(currentUser?.companyName ?? '');
  const [profileBio, setProfileBio] = useState(currentUser?.bio ?? '');
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  // Quick edit property modal state
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editAvailability, setEditAvailability] = useState<Property['availability']>('ready-to-move');

  // Developer Add Project state
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [prjName, setPrjName] = useState('');
  const [prjCity, setPrjCity] = useState('Austin');
  const [prjLocality, setPrjLocality] = useState('');
  const [prjCategory, setPrjCategory] = useState<'residential' | 'commercial'>('residential');
  const [prjPrice, setPrjPrice] = useState('');
  const [prjStatus, setPrjStatus] = useState<'New Launch' | 'Under Construction' | 'Ready to Move'>('New Launch');
  const [prjPossession, setPrjPossession] = useState('Q4 2027');
  const [prjRera, setPrjRera] = useState('');
  const [prjOverview, setPrjOverview] = useState('');
  const [prjError, setPrjError] = useState<string | null>(null);

  const authorizedLeads = useMemo(
    () => getAuthorizedLeadsForUser(state.leads, currentUser),
    [state.leads, currentUser]
  );

  const myProperties = useMemo(() => {
    if (!currentUser) return [];
    return state.properties.filter((p) => p.listedById === currentUser.id);
  }, [state.properties, currentUser]);

  const myDeveloperProfile = useMemo(
    () => state.developers.find((d) => d.userId === currentUser?.id),
    [state.developers, currentUser]
  );

  const myProjects = useMemo(() => {
    if (!currentUser) return [];
    if (myDeveloperProfile) {
      return state.projects.filter((p) => p.developerId === myDeveloperProfile.id);
    }
    return state.projects.filter((p) => p.developerName === (currentUser.companyName ?? currentUser.fullName));
  }, [state.projects, currentUser, myDeveloperProfile]);

  const savedProperties = useMemo(
    () =>
      state.savedPropertyIds
        .map((id) => state.properties.find((p) => p.id === id))
        .filter((p): p is NonNullable<typeof p> => Boolean(p)),
    [state.savedPropertyIds, state.properties]
  );

  const myNotifications = useMemo(
    () => state.notifications.filter((n) => n.userId === currentUser?.id),
    [state.notifications, currentUser]
  );

  if (!currentUser) {
    return (
      <div className="bg-[#F5F7FA] min-h-screen py-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-white border border-[#E6EAF0] rounded-[14px] p-8 space-y-4">
          <h1 className="font-display text-2xl font-bold text-[#142D4E]">Sign In Required</h1>
          <p className="text-sm text-[#778397]">
            Sign in or select a demo role to access your Buyer, Agent, Owner, or Developer
            dashboard.
          </p>
          <Link
            to="/auth"
            className="inline-block px-6 py-3 text-sm font-semibold text-white bg-[#142D4E] hover:bg-[#0B1F38] rounded-[10px]"
          >
            Go to Login / Register
          </Link>
        </div>
      </div>
    );
  }

  const isListingPartner =
    currentUser.role === 'agent' ||
    currentUser.role === 'owner' ||
    currentUser.role === 'developer';
  const isDeveloper = currentUser.role === 'developer';

  const navItems: { id: DashboardTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: User },
    ...(isListingPartner ? [{ id: 'properties' as const, label: 'My Properties', icon: Building2 }] : []),
    ...(isDeveloper ? [{ id: 'projects' as const, label: 'My Projects', icon: Landmark }] : []),
    { id: 'saved', label: 'Saved Properties', icon: Heart },
    {
      id: 'enquiries',
      label: currentUser.role === 'buyer' ? 'My Enquiries' : 'Lead Tracking',
      icon: MessageSquare,
    },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUserProfile({
      fullName: profileName,
      phone: profilePhone,
      city: profileCity,
      companyName: profileCompany || undefined,
      bio: profileBio || undefined,
    });
    setProfileSavedMsg(true);
    setTimeout(() => setProfileSavedMsg(false), 3000);
  };

  const openEditProperty = (prop: Property) => {
    setEditingProperty(prop);
    setEditTitle(prop.title);
    setEditPrice(String(prop.price));
    setEditAvailability(prop.availability);
  };

  const handleSavePropertyEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProperty || !editTitle.trim() || Number(editPrice) <= 0) return;
    updatePropertyListing(editingProperty.id, {
      title: editTitle.trim(),
      price: Number(editPrice),
      availability: editAvailability,
    });
    setEditingProperty(null);
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    setPrjError(null);
    if (prjName.trim().length < 3 || !prjLocality.trim() || !prjPrice || Number(prjPrice) <= 0) {
      setPrjError('Please fill in project name, locality, and starting price.');
      return;
    }

    addDevelopmentProject({
      name: prjName.trim(),
      developerId: myDeveloperProfile?.id ?? currentUser.id,
      developerName: currentUser.companyName ?? currentUser.fullName,
      category: prjCategory,
      city: prjCity.trim(),
      locality: prjLocality.trim(),
      overview:
        prjOverview.trim() ||
        'Architectural new development featuring modern residences, curated amenities, and RERA compliance.',
      startingPrice: Number(prjPrice),
      status: prjStatus,
      configurations: [
        {
          type: prjCategory === 'commercial' ? 'Executive Floorplate' : '2 & 3 BHK Residences',
          areaSqFt: '1,550 – 2,650 sq. ft.',
          priceRange: `From ${formatCurrency(Number(prjPrice))}`,
          availableUnits: 18,
        },
      ],
      images: [prjCategory === 'commercial' ? ASSET_IMAGES.office : ASSET_IMAGES.tower],
      floorPlans: [
        {
          id: `fp-dev-${Date.now()}`,
          label: 'Primary Unit Layout',
          areaSqFt: 1850,
          bedrooms: prjCategory === 'commercial' ? 0 : 3,
          bathrooms: 2,
          price: Number(prjPrice),
          dimensions: '50 ft × 37 ft',
          rooms: ['Main Living Hall', 'Primary Suite', 'Balcony Terrace'],
        },
      ],
      amenities: ['24/7 Concierge', 'Resident Clubhouse', 'EV Parking', 'Landscaped Terraces'],
      possessionTimeline: prjPossession,
      reraNumber: prjRera.trim() || `RERA-2026-${Date.now().toString().slice(-5)}`,
      totalUnits: 64,
    });

    setShowProjectForm(false);
    setPrjName('');
    setPrjLocality('');
    setPrjPrice('');
    setPrjRera('');
    setPrjOverview('');
  };

  const totalListingViews = myProperties.reduce((sum, p) => sum + p.viewsCount, 0);

  return (
    <div className="bg-[#F5F7FA] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-3 bg-white border border-[#E6EAF0] rounded-[12px] p-4 space-y-5">
          <div className="px-2 pb-4 border-b border-[#E6EAF0]">
            <p className="text-xs text-[#4778B8] font-medium capitalize">
              {currentUser.role} Workspace
            </p>
            <h1 className="font-display text-lg font-bold text-[#142D4E] mt-0.5">
              {currentUser.fullName}
            </h1>
            <p className="text-xs text-[#778397] truncate">{currentUser.email}</p>
          </div>

          <nav aria-label="Dashboard sections" className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-[8px] transition-colors ${
                    active
                      ? 'bg-[#142D4E] text-white'
                      : 'text-[#202B3C] hover:bg-[#F5F7FA] hover:text-[#142D4E]'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-[#E6EAF0] space-y-2">
            {currentUser.role === 'admin' && (
              <Link
                to="/admin"
                className="block w-full text-center py-2.5 px-3 text-xs font-semibold text-white bg-[#4778B8] rounded-[8px]"
              >
                Open Admin Console
              </Link>
            )}
            {isListingPartner && (
              <Link
                to="/list-property"
                className="flex items-center justify-center gap-1.5 w-full py-2.5 px-3 text-xs font-semibold text-white bg-[#142D4E] hover:bg-[#0B1F38] rounded-[8px]"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                Add Property
              </Link>
            )}
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="flex items-center justify-center gap-1.5 w-full py-2 px-3 text-xs font-medium text-[#778397] hover:text-[#142D4E] border border-[#E6EAF0] rounded-[8px]"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Workspace Panel */}
        <div className="lg:col-span-9 space-y-6">
          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {isListingPartner ? (
                  <>
                    <div className="bg-white border border-[#E6EAF0] rounded-[12px] p-5">
                      <p className="text-xs text-[#778397]">Active Listings</p>
                      <p className="font-display text-2xl font-bold text-[#142D4E] tabular-nums mt-1">
                        {myProperties.length}
                      </p>
                    </div>
                    <div className="bg-white border border-[#E6EAF0] rounded-[12px] p-5">
                      <p className="text-xs text-[#778397]">Listing Views</p>
                      <p className="font-display text-2xl font-bold text-[#142D4E] tabular-nums mt-1">
                        {totalListingViews.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-white border border-[#E6EAF0] rounded-[12px] p-5">
                      <p className="text-xs text-[#778397]">Attributed Leads</p>
                      <p className="font-display text-2xl font-bold text-[#142D4E] tabular-nums mt-1">
                        {authorizedLeads.length}
                      </p>
                    </div>
                    <div className="bg-white border border-[#E6EAF0] rounded-[12px] p-5">
                      <p className="text-xs text-[#778397]">
                        {isDeveloper ? 'Active Projects' : 'Pending Approvals'}
                      </p>
                      <p className="font-display text-2xl font-bold text-[#142D4E] tabular-nums mt-1">
                        {isDeveloper
                          ? myProjects.length
                          : myProperties.filter((p) => p.approvalStatus === 'pending').length}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-white border border-[#E6EAF0] rounded-[12px] p-5">
                      <p className="text-xs text-[#778397]">Saved Properties</p>
                      <p className="font-display text-2xl font-bold text-[#142D4E] tabular-nums mt-1">
                        {savedProperties.length}
                      </p>
                    </div>
                    <div className="bg-white border border-[#E6EAF0] rounded-[12px] p-5">
                      <p className="text-xs text-[#778397]">Submitted Enquiries</p>
                      <p className="font-display text-2xl font-bold text-[#142D4E] tabular-nums mt-1">
                        {authorizedLeads.length}
                      </p>
                    </div>
                    <div className="bg-white border border-[#E6EAF0] rounded-[12px] p-5">
                      <p className="text-xs text-[#778397]">Comparison List</p>
                      <p className="font-display text-2xl font-bold text-[#142D4E] tabular-nums mt-1">
                        {state.comparePropertyIds.length} / 4
                      </p>
                    </div>
                    <div className="bg-white border border-[#E6EAF0] rounded-[12px] p-5">
                      <p className="text-xs text-[#778397]">Notifications</p>
                      <p className="font-display text-2xl font-bold text-[#142D4E] tabular-nums mt-1">
                        {myNotifications.filter((n) => !n.read).length}
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="bg-white border border-[#E6EAF0] rounded-[12px] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-lg font-bold text-[#142D4E]">
                    Recent Enquiries &amp; Lead Activity
                  </h2>
                  <button
                    type="button"
                    onClick={() => setActiveTab('enquiries')}
                    className="text-xs font-semibold text-[#4778B8] hover:text-[#142D4E]"
                  >
                    Manage All
                  </button>
                </div>

                {authorizedLeads.length === 0 ? (
                  <p className="text-sm text-[#778397] py-6 text-center">
                    No enquiries recorded yet.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-[#E6EAF0] text-xs text-[#778397]">
                          <th className="py-2.5 pr-4 font-medium">Lead ID</th>
                          <th className="py-2.5 px-3 font-medium">Listing / Project</th>
                          <th className="py-2.5 px-3 font-medium">Party</th>
                          <th className="py-2.5 pl-3 font-medium text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E6EAF0]">
                        {authorizedLeads.slice(0, 5).map((lead) => (
                          <tr key={lead.leadId}>
                            <td className="py-3 pr-4 font-mono text-xs font-semibold text-[#142D4E]">
                              {lead.leadId}
                            </td>
                            <td className="py-3 px-3 text-[#202B3C] font-medium">
                              {lead.propertyTitle ?? lead.projectTitle ?? 'Direct Advisory'}
                            </td>
                            <td className="py-3 px-3 text-[#778397]">
                              {currentUser.role === 'buyer'
                                ? lead.ownerOrAgentName
                                : lead.customerName}
                            </td>
                            <td className="py-3 pl-3 text-right text-xs font-semibold text-[#142D4E]">
                              {lead.status}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* PROFILE */}
          {activeTab === 'profile' && (
            <section className="bg-white border border-[#E6EAF0] rounded-[12px] p-6">
              <h2 className="font-display text-xl font-bold text-[#142D4E] mb-4">My Profile</h2>
              {profileSavedMsg && (
                <div className="mb-4 p-3 rounded-[8px] bg-[#F5F7FA] border border-[#4778B8] text-xs font-medium text-[#142D4E]">
                  Profile changes saved locally.
                </div>
              )}
              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="prof-name" className="block text-xs font-medium text-[#202B3C] mb-1">
                      Full Name
                    </label>
                    <input
                      id="prof-name"
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[8px]"
                    />
                  </div>
                  <div>
                    <label htmlFor="prof-phone" className="block text-xs font-medium text-[#202B3C] mb-1">
                      Phone Number
                    </label>
                    <input
                      id="prof-phone"
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[8px]"
                    />
                  </div>
                  <div>
                    <label htmlFor="prof-city" className="block text-xs font-medium text-[#202B3C] mb-1">
                      City
                    </label>
                    <input
                      id="prof-city"
                      type="text"
                      value={profileCity}
                      onChange={(e) => setProfileCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[8px]"
                    />
                  </div>
                  <div>
                    <label htmlFor="prof-company" className="block text-xs font-medium text-[#202B3C] mb-1">
                      Company / Agency
                    </label>
                    <input
                      id="prof-company"
                      type="text"
                      value={profileCompany}
                      onChange={(e) => setProfileCompany(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[8px]"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="prof-bio" className="block text-xs font-medium text-[#202B3C] mb-1">
                    Professional Bio
                  </label>
                  <textarea
                    id="prof-bio"
                    rows={3}
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[8px]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-[#142D4E] hover:bg-[#0B1F38] rounded-[10px]"
                >
                  Save Profile
                </button>
              </form>
            </section>
          )}

          {/* MY PROPERTIES (Agents, Owners, Developers) */}
          {activeTab === 'properties' && isListingPartner && (
            <section className="bg-white border border-[#E6EAF0] rounded-[12px] p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-bold text-[#142D4E]">
                    Manage My Listings
                  </h2>
                  <p className="text-xs text-[#778397]">
                    Edit pricing, update availability, or track approval statuses.
                  </p>
                </div>
                <Link
                  to="/list-property"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#142D4E] rounded-[8px]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add New Listing
                </Link>
              </div>

              {myProperties.length === 0 ? (
                <p className="text-sm text-[#778397] py-8 text-center">
                  You have not published any properties yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-[#E6EAF0] text-xs text-[#778397]">
                        <th className="py-3 pr-4 font-medium">Property</th>
                        <th className="py-3 px-3 font-medium">Price</th>
                        <th className="py-3 px-3 font-medium">Views</th>
                        <th className="py-3 px-3 font-medium">Approval</th>
                        <th className="py-3 pl-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E6EAF0]">
                      {myProperties.map((prop) => (
                        <tr key={prop.id}>
                          <td className="py-3.5 pr-4">
                            <Link
                              to={`/properties/${prop.id}`}
                              className="font-semibold text-[#142D4E] hover:text-[#4778B8]"
                            >
                              {prop.title}
                            </Link>
                            <p className="text-xs text-[#778397]">
                              {prop.id} · {prop.locality}, {prop.city}
                            </p>
                          </td>
                          <td className="py-3.5 px-3 font-mono text-xs font-semibold tabular-nums">
                            {formatListingPrice(prop.price, prop.priceUnit)}
                          </td>
                          <td className="py-3.5 px-3 font-mono text-xs tabular-nums text-[#778397]">
                            {prop.viewsCount}
                          </td>
                          <td className="py-3.5 px-3 text-xs font-semibold capitalize">
                            <span
                              className={
                                prop.approvalStatus === 'approved'
                                  ? 'text-emerald-700'
                                  : prop.approvalStatus === 'pending'
                                  ? 'text-amber-700'
                                  : 'text-red-700'
                              }
                            >
                              {prop.approvalStatus}
                            </span>
                          </td>
                          <td className="py-3.5 pl-3 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => openEditProperty(prop)}
                              aria-label={`Edit ${prop.title}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#142D4E] border border-[#E6EAF0] hover:bg-[#F5F7FA] rounded-[6px] mr-2"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => deletePropertyListing(prop.id)}
                              aria-label={`Delete ${prop.title}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-700 border border-red-200 hover:bg-red-50 rounded-[6px]"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Inline Edit Modal */}
              {editingProperty && (
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-label="Edit listing"
                  className="fixed inset-0 z-50 bg-[#0B1F38]/50 flex items-center justify-center p-4"
                >
                  <form
                    onSubmit={handleSavePropertyEdit}
                    className="bg-white border border-[#E6EAF0] rounded-[12px] p-6 max-w-md w-full space-y-4"
                  >
                    <h3 className="font-display text-lg font-bold text-[#142D4E]">
                      Edit Property ({editingProperty.id})
                    </h3>
                    <div>
                      <label htmlFor="ed-title" className="block text-xs font-medium text-[#202B3C] mb-1">
                        Title
                      </label>
                      <input
                        id="ed-title"
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-[#E6EAF0] rounded-[8px]"
                      />
                    </div>
                    <div>
                      <label htmlFor="ed-price" className="block text-xs font-medium text-[#202B3C] mb-1">
                        Price ($)
                      </label>
                      <input
                        id="ed-price"
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-[#E6EAF0] rounded-[8px] tabular-nums"
                      />
                    </div>
                    <div>
                      <label htmlFor="ed-avail" className="block text-xs font-medium text-[#202B3C] mb-1">
                        Availability
                      </label>
                      <select
                        id="ed-avail"
                        value={editAvailability}
                        onChange={(e) =>
                          setEditAvailability(e.target.value as Property['availability'])
                        }
                        className="w-full px-3 py-2 text-sm border border-[#E6EAF0] rounded-[8px] bg-white"
                      >
                        <option value="ready-to-move">Ready to Move</option>
                        <option value="under-construction">Under Construction</option>
                        <option value="available-soon">Available Soon</option>
                      </select>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingProperty(null)}
                        className="px-4 py-2 text-xs font-medium text-[#778397] border border-[#E6EAF0] rounded-[8px]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-xs font-semibold text-white bg-[#142D4E] rounded-[8px]"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </section>
          )}

          {/* MY PROJECTS (Developers) */}
          {activeTab === 'projects' && isDeveloper && (
            <section className="bg-white border border-[#E6EAF0] rounded-[12px] p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-bold text-[#142D4E]">
                    Developer Project Portfolio
                  </h2>
                  <p className="text-xs text-[#778397]">
                    Publish new residential or commercial developments with RERA filings.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowProjectForm((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#142D4E] rounded-[8px]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {showProjectForm ? 'Close Form' : 'Add New Project'}
                </button>
              </div>

              {showProjectForm && (
                <form
                  onSubmit={handleAddProject}
                  className="bg-[#F5F7FA] border border-[#E6EAF0] rounded-[10px] p-5 space-y-4"
                >
                  <h3 className="text-sm font-semibold text-[#142D4E]">Publish New Development</h3>
                  {prjError && <p className="text-xs text-red-600">{prjError}</p>}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <input
                      type="text"
                      placeholder="Project Name *"
                      value={prjName}
                      onChange={(e) => setPrjName(e.target.value)}
                      className="px-3 py-2 text-sm border border-[#E6EAF0] rounded-[8px] bg-white"
                    />
                    <select
                      value={prjCategory}
                      onChange={(e) => setPrjCategory(e.target.value as 'residential' | 'commercial')}
                      className="px-3 py-2 text-sm border border-[#E6EAF0] rounded-[8px] bg-white"
                    >
                      <option value="residential">Residential Project</option>
                      <option value="commercial">Commercial Project</option>
                    </select>
                    <input
                      type="text"
                      placeholder="City *"
                      value={prjCity}
                      onChange={(e) => setPrjCity(e.target.value)}
                      className="px-3 py-2 text-sm border border-[#E6EAF0] rounded-[8px] bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Locality *"
                      value={prjLocality}
                      onChange={(e) => setPrjLocality(e.target.value)}
                      className="px-3 py-2 text-sm border border-[#E6EAF0] rounded-[8px] bg-white"
                    />
                    <input
                      type="number"
                      placeholder="Starting Price ($) *"
                      value={prjPrice}
                      onChange={(e) => setPrjPrice(e.target.value)}
                      className="px-3 py-2 text-sm border border-[#E6EAF0] rounded-[8px] bg-white"
                    />
                    <select
                      value={prjStatus}
                      onChange={(e) =>
                        setPrjStatus(
                          e.target.value as 'New Launch' | 'Under Construction' | 'Ready to Move'
                        )
                      }
                      className="px-3 py-2 text-sm border border-[#E6EAF0] rounded-[8px] bg-white"
                    >
                      <option value="New Launch">New Launch</option>
                      <option value="Under Construction">Under Construction</option>
                      <option value="Ready to Move">Ready to Move</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Possession Timeline (e.g. Q4 2027)"
                      value={prjPossession}
                      onChange={(e) => setPrjPossession(e.target.value)}
                      className="px-3 py-2 text-sm border border-[#E6EAF0] rounded-[8px] bg-white"
                    />
                    <input
                      type="text"
                      placeholder="RERA Registration Number"
                      value={prjRera}
                      onChange={(e) => setPrjRera(e.target.value)}
                      className="px-3 py-2 text-sm border border-[#E6EAF0] rounded-[8px] bg-white font-mono"
                    />
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Project Overview"
                    value={prjOverview}
                    onChange={(e) => setPrjOverview(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#E6EAF0] rounded-[8px] bg-white"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-[#142D4E] rounded-[8px]"
                  >
                    Publish Development Project
                  </button>
                </form>
              )}

              <div className="space-y-3">
                {myProjects.map((prj) => (
                  <div
                    key={prj.id}
                    className="p-4 border border-[#E6EAF0] rounded-[10px] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
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
                        {prj.locality}, {prj.city} · {prj.status} · From{' '}
                        {formatCurrency(prj.startingPrice)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteDevelopmentProject(prj.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 border border-red-200 rounded-[8px] self-start sm:self-center"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SAVED PROPERTIES */}
          {activeTab === 'saved' && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-[#142D4E]">Saved Properties</h2>
                <Link to="/compare" className="text-xs font-semibold text-[#4778B8]">
                  Compare Shortlist
                </Link>
              </div>
              {savedProperties.length === 0 ? (
                <div className="bg-white border border-[#E6EAF0] rounded-[12px] p-10 text-center text-sm text-[#778397]">
                  No saved properties yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {savedProperties.map((prop) => (
                    <PropertyCard key={prop.id} property={prop} />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ENQUIRIES & LEAD TRACKING */}
          {activeTab === 'enquiries' && (
            <section className="bg-white border border-[#E6EAF0] rounded-[12px] p-6 space-y-4">
              <div>
                <h2 className="font-display text-xl font-bold text-[#142D4E]">
                  {currentUser.role === 'buyer'
                    ? 'My Enquiries & Site Visit Requests'
                    : 'Lead & Enquiry Management'}
                </h2>
                <p className="text-xs text-[#778397] mt-1">
                  Enquiries are scoped strictly to your authorized account attribution. Site visits
                  require explicit approval before confirmation.
                </p>
              </div>

              {authorizedLeads.length === 0 ? (
                <p className="text-sm text-[#778397] py-10 text-center">
                  No enquiries found for your account.
                </p>
              ) : (
                <div className="space-y-4">
                  {authorizedLeads.map((lead) => {
                    const manageable = canUserManageLead(lead, currentUser);
                    return (
                      <div
                        key={lead.leadId}
                        className="p-5 border border-[#E6EAF0] rounded-[10px] space-y-3"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-mono font-semibold text-[#142D4E]">
                              {lead.leadId} · <span className="font-sans text-[#778397]">{lead.leadSource}</span>
                            </p>
                            <h3 className="text-base font-semibold text-[#202B3C] mt-0.5">
                              {lead.propertyTitle ?? lead.projectTitle ?? 'Direct Professional Enquiry'}
                            </h3>
                            <p className="text-xs text-[#778397] mt-0.5">
                              Client: <strong className="text-[#202B3C]">{lead.customerName}</strong> ({lead.phone} · {lead.email})
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {manageable ? (
                              <select
                                aria-label={`Update status for lead ${lead.leadId}`}
                                value={lead.status}
                                onChange={(e) =>
                                  updateLeadStatus(lead.leadId, e.target.value as LeadStatus)
                                }
                                className="px-3 py-1.5 text-xs font-semibold border border-[#E6EAF0] rounded-[8px] bg-[#F5F7FA] text-[#142D4E]"
                              >
                                {LEAD_STATUSES.map((st) => (
                                  <option key={st} value={st}>
                                    {st}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className="text-xs font-semibold text-[#142D4E] bg-[#F5F7FA] px-3 py-1.5 rounded-[8px] border border-[#E6EAF0]">
                                {lead.status}
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-[#202B3C]/90 bg-[#F5F7FA] rounded-[8px] p-3">
                          {lead.message}
                        </p>

                        {lead.preferredVisitDate && (
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E6EAF0] text-xs">
                            <div>
                              <span className="text-[#778397]">Requested Site Visit: </span>
                              <span className="font-mono font-semibold text-[#142D4E]">
                                {lead.preferredVisitDate}
                              </span>
                              <span className="text-[#778397]"> · Visit Status: </span>
                              <span className="font-semibold capitalize text-[#202B3C]">
                                {lead.visitApprovalStatus.replace('-', ' ')}
                              </span>
                            </div>

                            {manageable && lead.visitApprovalStatus === 'pending-approval' && (
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => decideLeadVisit(lead.leadId, 'approved')}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-[#142D4E] hover:bg-[#0B1F38] rounded-[6px]"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                  Approve Visit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => decideLeadVisit(lead.leadId, 'declined')}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 border border-red-200 hover:bg-red-50 rounded-[6px]"
                                >
                                  <X className="h-3.5 w-3.5" />
                                  Decline
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <section className="bg-white border border-[#E6EAF0] rounded-[12px] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-[#142D4E]">Notifications</h2>
                <button
                  type="button"
                  onClick={markAllNotificationsRead}
                  className="text-xs font-semibold text-[#4778B8] hover:text-[#142D4E]"
                >
                  Mark all as read
                </button>
              </div>
              {myNotifications.length === 0 ? (
                <p className="text-sm text-[#778397] py-6">No notifications yet.</p>
              ) : (
                <div className="divide-y divide-[#E6EAF0]">
                  {myNotifications.map((n) => (
                    <div key={n.id} className="py-3.5 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-[#142D4E]">
                          {n.title} {!n.read && <span className="text-xs text-[#4778B8]">· Unread</span>}
                        </p>
                        <p className="text-xs text-[#778397] mt-0.5">{n.detail}</p>
                      </div>
                      <span className="text-[11px] font-mono text-[#778397] whitespace-nowrap">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* SETTINGS */}
          {activeTab === 'settings' && (
            <section className="bg-white border border-[#E6EAF0] rounded-[12px] p-6 space-y-4">
              <h2 className="font-display text-xl font-bold text-[#142D4E]">Account Settings</h2>
              <div className="space-y-3 text-sm text-[#202B3C] max-w-xl">
                <div className="p-4 border border-[#E6EAF0] rounded-[10px] flex items-center justify-between">
                  <div>
                    <p className="font-medium">Account Role</p>
                    <p className="text-xs text-[#778397] capitalize">{currentUser.role}</p>
                  </div>
                  <Link to="/auth" className="text-xs font-semibold text-[#4778B8]">
                    Switch Role
                  </Link>
                </div>
                <div className="p-4 border border-[#E6EAF0] rounded-[10px]">
                  <p className="font-medium">Local Demo Storage</p>
                  <p className="text-xs text-[#778397] mt-1">
                    Profile details, saved properties, submitted listings, and leads are stored in
                    localStorage for this session. Connect a backend API via the repository layer
                    for multi-device sync.
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
