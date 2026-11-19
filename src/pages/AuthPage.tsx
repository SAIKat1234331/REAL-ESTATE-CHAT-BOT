import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, UserCheck } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import type { UserRole } from '../types/marketplace';

export const AuthPage: React.FC = () => {
  const { state, loginByEmail, loginAsUserId, registerUser } = useMarketplace();
  const navigate = useNavigate();

  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Registration state
  const [regRole, setRegRole] = useState<Exclude<UserRole, 'admin'>>('buyer');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCity, setRegCity] = useState('Austin');
  const [regCompany, setRegCompany] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!loginEmail.trim() || loginPassword.length < 4) {
      setError('Enter your registered email address and password (minimum 4 characters).');
      return;
    }
    const res = loginByEmail(loginEmail);
    if (!res.ok) {
      setError(res.error ?? 'Unable to sign in.');
      return;
    }
    const user = state.users.find((u) => u.email.toLowerCase() === loginEmail.trim().toLowerCase());
    navigate(user?.role === 'admin' ? '/admin' : '/dashboard');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (regName.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (regPhone.trim().length < 7) {
      setError('Please enter a valid phone number.');
      return;
    }
    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const res = registerUser({
      fullName: regName,
      email: regEmail,
      phone: regPhone,
      role: regRole,
      city: regCity,
      companyName: regRole === 'agent' || regRole === 'developer' ? regCompany : undefined,
    });

    if (!res.ok) {
      setError(res.error ?? 'Registration failed.');
      return;
    }
    navigate('/dashboard');
  };

  const handleDemoSwitch = (userId: string, role: UserRole) => {
    loginAsUserId(userId);
    navigate(role === 'admin' ? '/admin' : '/dashboard');
  };

  const roleChoices: { id: Exclude<UserRole, 'admin'>; title: string; desc: string }[] = [
    {
      id: 'buyer',
      title: 'Buyer / Tenant',
      desc: 'Save & compare listings, submit enquiries, track visits.',
    },
    {
      id: 'agent',
      title: 'Agent / Broker',
      desc: 'Publish listings, manage client leads & approve site visits.',
    },
    {
      id: 'developer',
      title: 'Developer',
      desc: 'Launch residential/commercial projects & track inquiries.',
    },
    {
      id: 'owner',
      title: 'Property Owner',
      desc: 'List your property directly & coordinate verified viewings.',
    },
  ];

  return (
    <div className="bg-[#F5F7FA] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Login / Register Form */}
        <div className="lg:col-span-7 bg-white border border-[#E6EAF0] rounded-[14px] p-6 sm:p-8">
          <div className="inline-flex p-1 bg-[#F5F7FA] border border-[#E6EAF0] rounded-[10px] mb-6">
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setError(null);
              }}
              className={`px-5 py-2 text-sm font-medium rounded-[8px] ${
                tab === 'login' ? 'bg-[#142D4E] text-white' : 'text-[#778397]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('register');
                setError(null);
              }}
              className={`px-5 py-2 text-sm font-medium rounded-[8px] ${
                tab === 'register' ? 'bg-[#142D4E] text-white' : 'text-[#778397]'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-[10px] border border-red-200 bg-red-50 text-sm text-red-700">
              {error}
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} noValidate className="space-y-4">
              <div>
                <h1 className="font-display text-2xl font-bold text-[#142D4E]">
                  Sign in to Meridian Estates
                </h1>
                <p className="text-sm text-[#778397] mt-1">
                  Access your saved properties, listings, enquiries, and role workspace.
                </p>
              </div>

              <div>
                <label htmlFor="login-email" className="block text-xs font-medium text-[#202B3C] mb-1.5">
                  Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px]"
                />
              </div>

              <div>
                <label htmlFor="login-password" className="block text-xs font-medium text-[#202B3C] mb-1.5">
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#142D4E] hover:bg-[#0B1F38] rounded-[10px] transition-colors"
              >
                Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} noValidate className="space-y-5">
              <div>
                <h1 className="font-display text-2xl font-bold text-[#142D4E]">
                  Create Your Marketplace Account
                </h1>
                <p className="text-sm text-[#778397] mt-1">
                  Select your account type to configure the right dashboard and tools.
                </p>
              </div>

              <div>
                <span className="block text-xs font-medium text-[#202B3C] mb-2">
                  Account Type *
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {roleChoices.map((rc) => {
                    const selected = regRole === rc.id;
                    return (
                      <button
                        key={rc.id}
                        type="button"
                        onClick={() => setRegRole(rc.id)}
                        className={`text-left p-3.5 rounded-[10px] border transition-colors ${
                          selected
                            ? 'border-[#142D4E] bg-[#F5F7FA]'
                            : 'border-[#E6EAF0] bg-white hover:border-[#4778B8]'
                        }`}
                      >
                        <p className="text-sm font-semibold text-[#142D4E]">{rc.title}</p>
                        <p className="text-xs text-[#778397] mt-0.5 leading-snug">{rc.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="reg-name" className="block text-xs font-medium text-[#202B3C] mb-1">
                    Full Name *
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px]"
                  />
                </div>
                <div>
                  <label htmlFor="reg-phone" className="block text-xs font-medium text-[#202B3C] mb-1">
                    Phone Number *
                  </label>
                  <input
                    id="reg-phone"
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+1 (512) 555-0190"
                    className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="reg-email" className="block text-xs font-medium text-[#202B3C] mb-1">
                    Email Address *
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="alex@domain.com"
                    className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px]"
                  />
                </div>
                <div>
                  <label htmlFor="reg-city" className="block text-xs font-medium text-[#202B3C] mb-1">
                    Primary City
                  </label>
                  <input
                    id="reg-city"
                    type="text"
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px]"
                  />
                </div>
              </div>

              {(regRole === 'agent' || regRole === 'developer') && (
                <div>
                  <label htmlFor="reg-company" className="block text-xs font-medium text-[#202B3C] mb-1">
                    {regRole === 'developer' ? 'Developer Company Name' : 'Agency / Brokerage Name'}
                  </label>
                  <input
                    id="reg-company"
                    type="text"
                    value={regCompany}
                    onChange={(e) => setRegCompany(e.target.value)}
                    placeholder="Company name"
                    className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px]"
                  />
                </div>
              )}

              <div>
                <label htmlFor="reg-password" className="block text-xs font-medium text-[#202B3C] mb-1">
                  Password *
                </label>
                <input
                  id="reg-password"
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2.5 text-sm border border-[#E6EAF0] rounded-[10px]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#142D4E] hover:bg-[#0B1F38] rounded-[10px] transition-colors"
              >
                Register as {roleChoices.find((r) => r.id === regRole)?.title}
              </button>
            </form>
          )}
        </div>

        {/* Right: Local Demo Account Access */}
        <div className="lg:col-span-5 bg-white border border-[#E6EAF0] rounded-[14px] p-6 space-y-5">
          <div>
            <div className="flex items-center gap-2 text-[#142D4E] mb-1">
              <UserCheck className="h-5 w-5 text-[#4778B8]" aria-hidden="true" />
              <h2 className="font-display text-lg font-bold">Instant Role Preview</h2>
            </div>
            <p className="text-xs text-[#778397] leading-relaxed">
              This initial build uses local browser persistence rather than a live authentication
              server. Select any seeded role below to explore its dedicated dashboard immediately.
            </p>
          </div>

          <div className="space-y-2.5">
            {state.users.map((u) => (
              <button
                key={u.id}
                type="button"
                disabled={!u.active}
                onClick={() => handleDemoSwitch(u.id, u.role)}
                className="w-full text-left p-3.5 rounded-[10px] border border-[#E6EAF0] hover:border-[#4778B8] hover:bg-[#F5F7FA] transition-colors flex items-center justify-between gap-3 disabled:opacity-50"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#142D4E] truncate">{u.fullName}</p>
                  <p className="text-xs text-[#778397] truncate">{u.email}</p>
                </div>
                <span className="text-xs font-medium text-[#4778B8] capitalize whitespace-nowrap shrink-0 flex items-center gap-1">
                  {u.role === 'admin' && <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />}
                  {u.role}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
