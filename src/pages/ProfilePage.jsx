import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { toast } from 'react-toastify';
import {
  User,
  Mail,
  Phone,
  Shield,
  Briefcase,
  MapPin,
  Key,
  Clock,
  CheckCircle2,
  Save,
  Activity,
  Building,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
];

const RECENT_ACTIVITIES = [
  {
    id: 1,
    action: 'Approved Rental Booking #BK-904',
    time: '15 mins ago',
    detail: 'Customer: Rajesh Kumar (Toyota Fortuner SUV)',
    type: 'booking'
  },
  {
    id: 2,
    action: 'Updated Vehicle Availability',
    time: '2 hours ago',
    detail: 'Set status of Honda City (CAR-102) to Maintenance',
    type: 'vehicle'
  },
  {
    id: 3,
    action: 'Exported Financial Revenue Report',
    time: 'Yesterday at 4:30 PM',
    detail: 'Monthly analytics statement for Q3 2026',
    type: 'report'
  },
  {
    id: 4,
    action: 'Verified Customer Driving License',
    time: '2 days ago',
    detail: 'License #DL-2026-9041 verified successfully',
    type: 'customer'
  }
];

const ProfilePage = () => {
  const { user, updateProfile, resetPassword } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');

  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || 'Administrator',
    email: user?.email || 'admin@carrental.com',
    phone: user?.phone || '+91 98765 43210',
    role: user?.role || 'Fleet Operations Manager',
    department: user?.department || 'Executive Logistics',
    location: user?.location || 'Bengaluru, India',
    bio: user?.bio || 'Managing luxury fleet vehicles, customer relations, and rental logistics operations for Velocity Car Rentals.',
    avatar: user?.avatar || ''
  });

  // Password Change State
  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPass, setShowPass] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const result = updateProfile(formData);
    if (result.success) {
      toast.success('✨ Profile information updated successfully!');
    } else {
      toast.error(result.message || 'Failed to update profile.');
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!passwordState.newPassword) {
      toast.error('Please enter a new password.');
      return;
    }
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }

    const res = resetPassword(user?.email, passwordState.newPassword);
    if (res.success) {
      toast.success('🔒 Security password updated successfully!');
      setPasswordState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fadeIn pb-12">
      <Breadcrumbs paths={[{ name: 'My Profile' }]} />

      {/* Unique Hero Banner Card */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-orange-950 rounded-3xl p-6 sm:p-8 text-white overflow-hidden shadow-2xl border border-slate-800">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar Container */}
          <div className="relative group">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-orange-500 to-amber-500 p-1 shadow-xl shadow-orange-500/30">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt={formData.name}
                  className="w-full h-full object-cover rounded-[22px]"
                />
              ) : (
                <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center font-extrabold text-4xl text-orange-400">
                  {formData.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl shadow-lg border-2 border-slate-900" title="Verified Staff">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          {/* User Bio & Title Summary */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{formData.name}</h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                <Shield className="w-3.5 h-3.5 text-orange-400" /> {formData.role}
              </span>
            </div>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              {formData.bio}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-orange-400" /> {formData.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-amber-400" /> {formData.phone}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" /> {formData.location}
              </span>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700/60">
            <div className="text-center px-3">
              <div className="text-xl font-extrabold text-orange-400">142+</div>
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Bookings Handled</div>
            </div>
            <div className="text-center px-3 border-l border-slate-700">
              <div className="text-xl font-extrabold text-amber-400">99.8%</div>
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Fleet Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content & Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar Tabs */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-3 shadow-sm space-y-1 h-fit">
          <button
            onClick={() => setActiveTab('personal')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs transition cursor-pointer ${
              activeTab === 'personal'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4" /> Personal Details
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs transition cursor-pointer ${
              activeTab === 'security'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Key className="w-4 h-4" /> Password & Security
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs transition cursor-pointer ${
              activeTab === 'activity'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-4 h-4" /> Activity Log
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="lg:col-span-3">
          {activeTab === 'personal' && (
            <form onSubmit={handleSaveProfile} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-orange-500" /> Account Profile Settings
                  </h3>
                  <p className="text-xs text-slate-500">Update your personal credentials and manager information.</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  Active Operational Staff
                </span>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Choose Preset Avatar
                </label>
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  <button
                    type="button"
                    onClick={() => handleInputChange('avatar', '')}
                    className={`w-12 h-12 rounded-2xl bg-slate-100 font-bold text-slate-700 text-xs flex items-center justify-center border-2 ${
                      !formData.avatar ? 'border-orange-500 ring-2 ring-orange-200' : 'border-slate-200'
                    }`}
                  >
                    Text
                  </button>
                  {AVATAR_PRESETS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleInputChange('avatar', url)}
                      className={`w-12 h-12 rounded-2xl overflow-hidden border-2 transition ${
                        formData.avatar === url ? 'border-orange-500 ring-2 ring-orange-200 scale-105' : 'border-slate-200'
                      }`}
                    >
                      <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-orange-500 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-orange-500 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Phone / Mobile
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-orange-500 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Job Title / Role
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-orange-500 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Department
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-orange-500 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Office Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-orange-500 text-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Professional Bio
                </label>
                <textarea
                  rows="3"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 text-slate-800"
                ></textarea>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 text-xs uppercase tracking-wider cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save Profile Details
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handlePasswordChange} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Key className="w-5 h-5 text-orange-500" /> Password & Account Security
                </h3>
                <p className="text-xs text-slate-500">Ensure your administrative account remains protected.</p>
              </div>

              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    New Security Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={passwordState.newPassword}
                      onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={passwordState.confirmPassword}
                      onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-md text-xs uppercase tracking-wider cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Update Password
                </button>
              </div>
            </form>
          )}

          {activeTab === 'activity' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-orange-500" /> Activity Audit Trail
                </h3>
                <p className="text-xs text-slate-500">Log of recent fleet administrative operations performed by your account.</p>
              </div>

              <div className="space-y-4">
                {RECENT_ACTIVITIES.map((act) => (
                  <div key={act.id} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
                    <div className="p-2.5 rounded-xl bg-orange-100 text-orange-600">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900">{act.action}</h4>
                        <span className="text-[11px] font-semibold text-slate-400">{act.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{act.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
