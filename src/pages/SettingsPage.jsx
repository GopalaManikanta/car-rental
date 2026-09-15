import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { toast } from 'react-toastify';
import {
  Settings,
  Save,
  DollarSign,
  Bell,
  Sliders,
  Building,
  Activity,
  Percent,
  Clock,
  Zap
} from 'lucide-react';

const DEFAULT_SETTINGS = {
  // General & Enterprise
  companyName: 'Velocity Car Rentals Enterprise Inc.',
  supportEmail: 'support@velocityrentals.com',
  supportPhone: '+91 98765 43210',
  taxId: 'GSTIN-29AAAAA0000A1Z5',
  headquarters: 'B-402, Green Glen Layout, Outer Ring Road, Bengaluru, KA',
  currency: 'USD ($)',
  taxRate: 12,
  timeZone: 'UTC +05:30 (India Standard Time)',

  // Business & Rental Rules
  defaultDeposit: 500,
  minRentalHours: 24,
  lateReturnHourlyFee: 25,
  cancellationRefundFee: 10,
  autoDriverAssign: true,

  // Notifications & Automation
  enableNotifications: true,
  emailBookingReceipts: true,
  smsAlerts: false,
  autoApprove: true,
  dailySummaryEmail: true
};

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
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
    toast.success('✨ Enterprise settings updated and persisted successfully!');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fadeIn pb-12">
      <Breadcrumbs paths={[{ name: 'System Settings' }]} />

      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200 w-fit mb-2">
            <Activity className="w-3.5 h-3.5" /> Real-time Enterprise Engine
          </div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
            <Settings className="w-7 h-7 text-orange-500" /> Enterprise System Controls
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage company parameters, financial rules, and automated workflow triggers.
          </p>
        </div>
      </div>

      {/* Tab Controls & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Tabs */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-3 shadow-sm space-y-1 h-fit">
          <button
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs transition cursor-pointer ${
              activeTab === 'general'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building className="w-4 h-4" /> General & Business
          </button>

          <button
            onClick={() => setActiveTab('policies')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs transition cursor-pointer ${
              activeTab === 'policies'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sliders className="w-4 h-4" /> Rental & Pricing Rules
          </button>

          <button
            onClick={() => setActiveTab('automation')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs transition cursor-pointer ${
              activeTab === 'automation'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bell className="w-4 h-4" /> Notifications & Automation
          </button>
        </div>

        {/* Tab Form Content */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSave} className="space-y-6">
            {activeTab === 'general' && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5 animate-fadeIn">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <Building className="w-5 h-5 text-orange-500" /> Organization Profile & Support Details
                  </h3>
                  <p className="text-xs text-slate-500">Legal business entity branding, tax registrations, and primary contact channels.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Company Legal Name
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.companyName}
                      onChange={(e) => handleChange('companyName', e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-orange-500 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Tax Registration ID (GSTIN / TIN)
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.taxId}
                      onChange={(e) => handleChange('taxId', e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:border-orange-500 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Support Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={settings.supportEmail}
                      onChange={(e) => handleChange('supportEmail', e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Helpline Phone Number
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.supportPhone}
                      onChange={(e) => handleChange('supportPhone', e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Base Currency
                    </label>
                    <select
                      value={settings.currency}
                      onChange={(e) => handleChange('currency', e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-orange-500"
                    >
                      <option value="USD ($)">USD ($)</option>
                      <option value="INR (₹)">INR (₹)</option>
                      <option value="EUR (€)">EUR (€)</option>
                      <option value="GBP (£)">GBP (£)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      System Time Zone
                    </label>
                    <select
                      value={settings.timeZone}
                      onChange={(e) => handleChange('timeZone', e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-orange-500"
                    >
                      <option value="UTC +05:30 (India Standard Time)">UTC +05:30 (IST - India)</option>
                      <option value="UTC +00:00 (London GMT)">UTC +00:00 (GMT - London)</option>
                      <option value="UTC -05:00 (New York EST)">UTC -05:00 (EST - New York)</option>
                      <option value="UTC +08:00 (Singapore SGT)">UTC +08:00 (SGT - Singapore)</option>
                    </select>
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
            )}

            {activeTab === 'policies' && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5 animate-fadeIn">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-orange-500" /> Commercial Rental & Pricing Controls
                  </h3>
                  <p className="text-xs text-slate-500">Configure financial security deposits, taxes, and late penalty charges.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Commercial Tax Rate (%)
                    </label>
                    <div className="relative">
                      <Percent className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={settings.taxRate}
                        onChange={(e) => handleChange('taxRate', Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Default Security Deposit ($ / ₹)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="number"
                        min="0"
                        value={settings.defaultDeposit}
                        onChange={(e) => handleChange('defaultDeposit', Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Minimum Rental Duration (Hours)
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="number"
                        min="1"
                        value={settings.minRentalHours}
                        onChange={(e) => handleChange('minRentalHours', Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Late Return Fee Rate ($ / Hour)
                    </label>
                    <div className="relative">
                      <Zap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="number"
                        min="0"
                        value={settings.lateReturnHourlyFee}
                        onChange={(e) => handleChange('lateReturnHourlyFee', Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Auto-Assign Available Chauffeurs</p>
                    <p className="text-xs text-slate-500">Automatically allocate available drivers when customer selects chauffeur service.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoDriverAssign}
                    onChange={(e) => handleChange('autoDriverAssign', e.target.checked)}
                    className="w-5 h-5 accent-orange-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            )}

            {activeTab === 'automation' && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 animate-fadeIn">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-orange-500" /> Automated Notifications & Workflow Triggers
                  </h3>
                  <p className="text-xs text-slate-500">Configure email receipts, SMS alerts, and background job notifications.</p>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Visual Toast Alerts & System Notifications</p>
                    <p className="text-xs text-slate-500">Show real-time alert popups for booking creations, edits, and deletions.</p>
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
                    <p className="text-sm font-bold text-slate-800">Auto Email Invoices to Customers</p>
                    <p className="text-xs text-slate-500">Send PDF rental receipts directly to customer emails upon booking confirmation.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.emailBookingReceipts}
                    onChange={(e) => handleChange('emailBookingReceipts', e.target.checked)}
                    className="w-5 h-5 accent-orange-600 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between py-2 border-t border-slate-100">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Auto-Approve Customer License Verification</p>
                    <p className="text-xs text-slate-500">Automatically activate customer profiles when driving license number is entered.</p>
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
                    <p className="text-sm font-bold text-slate-800">Daily Fleet Revenue Summary Digest</p>
                    <p className="text-xs text-slate-500">Deliver a daily automated summary report to enterprise managers at 09:00 AM.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.dailySummaryEmail}
                    onChange={(e) => handleChange('dailySummaryEmail', e.target.checked)}
                    className="w-5 h-5 accent-orange-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold rounded-2xl shadow-lg shadow-orange-500/30 transition text-sm cursor-pointer"
              >
                <Save className="w-4.5 h-4.5" /> Save & Persist System Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
