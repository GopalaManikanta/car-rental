import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { toast } from 'react-toastify';
import {
  Settings,
  Save,
  DollarSign,
  Bell,
  Shield,
  Sliders,
  Building,
  Globe,
  Lock,
  Sparkles,
  CheckCircle2,
  Mail,
  Phone,
  FileText,
  Activity,
  Server
} from 'lucide-react';

const DEFAULT_SETTINGS = {
  companyName: 'Velocity Car Rentals Enterprise Inc.',
  supportEmail: 'support@velocityrentals.com',
  supportPhone: '+91 98765 43210',
  taxId: 'GSTIN-29AAAAA0000A1Z5',
  headquarters: 'B-402, Green Glen Layout, Outer Ring Road, Bengaluru, KA',
  currency: 'USD ($)',
  taxRate: 12,
  timeZone: 'UTC +05:30 (India Standard Time)',
  enableNotifications: true,
  autoApprove: true,
  twoFactorAuth: false,
  autoPrintReceipts: false
};

const SettingsPage = () => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('car_rental_settings');
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('car_rental_settings', JSON.stringify(settings));
  }, [settings]);

  const handleChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('car_rental_settings', JSON.stringify(settings));
    toast.success('✨ System settings saved & persisted to LocalStorage!');
  };

  // Storage Stats Calculation
  const storageUsageKB = useMemo(() => {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += (localStorage[key].length + key.length) * 2;
      }
    }
    return (total / 1024).toFixed(2);
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      <Breadcrumbs paths={[{ name: 'System Settings' }]} />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-md">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200 w-fit mb-2">
            <Activity className="w-3.5 h-3.5" /> System Diagnostics
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Settings className="w-7 h-7 text-orange-500" /> Enterprise System Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure company profile, financial tax parameters, security controls, and local storage cache engine.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-2xl border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> API: Connected
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 px-3.5 py-2 rounded-2xl border border-slate-200">
            <Server className="w-4 h-4 text-orange-500" /> Cache: {storageUsageKB} KB
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Organization & Legal Details */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building className="w-5 h-5 text-orange-500" /> Organization Profile & Support
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Company Legal Name
              </label>
              <div className="relative">
                <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={settings.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 font-semibold text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Tax Registration Number (GSTIN / TIN)
              </label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={settings.taxId}
                  onChange={(e) => handleChange('taxId', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 font-mono text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Primary Support Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={settings.supportEmail}
                  onChange={(e) => handleChange('supportEmail', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Support Helpline Mobile
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={settings.supportPhone}
                  onChange={(e) => handleChange('supportPhone', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Headquarters Business Address
            </label>
            <input
              type="text"
              required
              value={settings.headquarters}
              onChange={(e) => handleChange('headquarters', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Financial & Currency Setup */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders className="w-5 h-5 text-orange-500" /> Financial & Currency Parameters
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Base Currency Symbol
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={settings.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 font-bold"
                >
                  <option value="USD ($)">USD ($)</option>
                  <option value="INR (₹)">INR (₹)</option>
                  <option value="EUR (€)">EUR (€)</option>
                  <option value="GBP (£)">GBP (£)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Commercial Tax Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={settings.taxRate}
                onChange={(e) => handleChange('taxRate', Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                System Time Zone
              </label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={settings.timeZone}
                  onChange={(e) => handleChange('timeZone', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-orange-500"
                >
                  <option value="UTC +05:30 (India Standard Time)">UTC +05:30 (IST - India)</option>
                  <option value="UTC +00:00 (London GMT)">UTC +00:00 (GMT - London)</option>
                  <option value="UTC -05:00 (New York EST)">UTC -05:00 (EST - New York)</option>
                  <option value="UTC +08:00 (Singapore SGT)">UTC +08:00 (SGT - Singapore)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Notification Controls */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Shield className="w-5 h-5 text-orange-500" /> Security Policies & Notifications
          </h3>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-bold text-slate-800">Toast Notifications & Alerts</p>
              <p className="text-xs text-slate-500">Display real-time visual alerts for bookings, edits, and deletions.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.enableNotifications}
              onChange={(e) => handleChange('enableNotifications', e.target.checked)}
              className="w-5 h-5 accent-orange-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-2 border-t border-slate-100">
            <div>
              <p className="text-sm font-bold text-slate-800">Auto-Approve Registered Customers</p>
              <p className="text-xs text-slate-500">Automatically activate customer profiles upon driving license verification.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoApprove}
              onChange={(e) => handleChange('autoApprove', e.target.checked)}
              className="w-5 h-5 accent-orange-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-2 border-t border-slate-100">
            <div>
              <p className="text-sm font-bold text-slate-800">Enforce Two-Factor Authentication (2FA)</p>
              <p className="text-xs text-slate-500">Require secondary OTP token for manager access.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.twoFactorAuth}
              onChange={(e) => handleChange('twoFactorAuth', e.target.checked)}
              className="w-5 h-5 accent-orange-600 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/30 transition text-sm cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save & Persist System Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
