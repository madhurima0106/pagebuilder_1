'use client';

import React, { useState } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import { usePageStore } from '@/lib/store';
import {
  Settings,
  Shield,
  Cloud,
  Palette,
  Save,
  Key,
  Globe,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function SettingsPage() {
  const { showToast } = usePageStore();

  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'cloudinary' | 'branding'>('general');
  const [cloudinaryCloudName, setCloudinaryCloudName] = useState('demo-enterprise');
  const [cloudinaryApiKey, setCloudinaryApiKey] = useState('98412894129841');
  const [defaultPrimaryColor, setDefaultPrimaryColor] = useState('#2563eb');
  const [defaultDarkSidebar, setDefaultDarkSidebar] = useState(true);
  const [enforceTokenAuth, setEnforceTokenAuth] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Platform settings saved successfully', 'success');
  };

  return (
    <div className="flex min-h-screen bg-navy-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />

        <main className="flex-1 p-6 sm:p-8 max-w-5xl w-full mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-navy-900 tracking-tight">Studio Settings</h1>
            <p className="text-xs text-navy-500 mt-1">
              Configure system defaults, private URL encryption policies, and third-party media endpoints.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-navy-200/80 shadow-soft overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-navy-100 bg-navy-50/70 p-2 gap-1 overflow-x-auto">
              {[
                { id: 'general', label: 'General Defaults', icon: Settings },
                { id: 'security', label: 'URL Security & Cryptography', icon: Shield },
                { id: 'cloudinary', label: 'Cloudinary API', icon: Cloud },
                { id: 'branding', label: 'Theme & Brand Tokens', icon: Palette }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === id
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-navy-600 hover:text-navy-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6">
              {activeTab === 'general' && (
                <div className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
                      Default Organization Prefix
                    </label>
                    <input
                      type="text"
                      defaultValue="CLIENT-PORTAL"
                      className="w-full text-xs px-3.5 py-2.5 bg-navy-50 border border-navy-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 text-navy-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
                      Base Domain for Private Links
                    </label>
                    <input
                      type="text"
                      defaultValue="https://clientcraft.app"
                      className="w-full text-xs px-3.5 py-2.5 bg-navy-50 border border-navy-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 text-navy-900 font-mono"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-navy-50 border border-navy-200">
                    <div>
                      <p className="text-xs font-bold text-navy-800">Auto-Save Drafts in Builder</p>
                      <p className="text-[11px] text-navy-500">Automatically sync components to local storage every 5 seconds</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600 cursor-pointer" />
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-4 max-w-lg">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-navy-50 border border-navy-200">
                    <div>
                      <p className="text-xs font-bold text-navy-800">Enforce Cryptographic Token Verification</p>
                      <p className="text-[11px] text-navy-500">Require valid private token on all client-facing URL visits</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={enforceTokenAuth}
                      onChange={(e) => setEnforceTokenAuth(e.target.checked)}
                      className="w-4 h-4 accent-blue-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
                      Default Private Link Validity Period
                    </label>
                    <select className="w-full text-xs px-3.5 py-2.5 bg-navy-50 border border-navy-200 rounded-xl text-navy-900">
                      <option value="90">90 Days</option>
                      <option value="180">180 Days</option>
                      <option value="365">1 Year</option>
                      <option value="unlimited">No Expiration</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'cloudinary' && (
                <div className="space-y-4 max-w-lg">
                  <div className="p-3.5 rounded-2xl bg-primary-50 border border-primary-200 text-xs text-blue-800 flex items-start gap-2.5">
                    <Cloud className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                    <span>
                      Connect your Cloudinary credentials to enable automatic CDN asset transformation, background removal, and WebP transcoding.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
                      Cloudinary Cloud Name
                    </label>
                    <input
                      type="text"
                      value={cloudinaryCloudName}
                      onChange={(e) => setCloudinaryCloudName(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-navy-50 border border-navy-200 rounded-xl font-mono text-navy-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
                      API Key
                    </label>
                    <input
                      type="text"
                      value={cloudinaryApiKey}
                      onChange={(e) => setCloudinaryApiKey(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-navy-50 border border-navy-200 rounded-xl font-mono text-navy-900"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'branding' && (
                <div className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
                      Default Accent Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={defaultPrimaryColor}
                        onChange={(e) => setDefaultPrimaryColor(e.target.value)}
                        className="w-8 h-8 rounded-lg border border-navy-200 p-0.5 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={defaultPrimaryColor}
                        onChange={(e) => setDefaultPrimaryColor(e.target.value)}
                        className="flex-1 text-xs px-3.5 py-2 bg-navy-50 border border-navy-200 rounded-xl font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-navy-50 border border-navy-200">
                    <div>
                      <p className="text-xs font-bold text-navy-800">Default to Dark Navy Sidebar</p>
                      <p className="text-[11px] text-navy-500">Apply executive dark slate theme to new client pages by default</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={defaultDarkSidebar}
                      onChange={(e) => setDefaultDarkSidebar(e.target.checked)}
                      className="w-4 h-4 accent-blue-600 cursor-pointer"
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-navy-100 flex items-center justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow-md shadow-primary-600/20 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
