'use client';

import React from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import { usePageStore } from '@/lib/store';
import {
  UserCheck,
  ShieldCheck,
  Mail,
  Building,
  Key,
  Calendar,
  Lock,
  Sparkles,
  Save
} from 'lucide-react';

export default function ProfilePage() {
  const { showToast } = usePageStore();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Admin profile updated successfully', 'success');
  };

  return (
    <div className="flex min-h-screen bg-navy-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />

        <main className="flex-1 p-6 sm:p-8 max-w-4xl w-full mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-navy-900 tracking-tight">Admin Profile</h1>
            <p className="text-xs text-navy-500 mt-1">
              Manage your administrator credentials, roles, and cryptographic signature key.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-navy-200/80 shadow-soft p-6 sm:p-8 space-y-6">
            {/* User Avatar Card */}
            <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-navy-100">
              <div className="w-20 h-20 rounded-3xl bg-navy-900 text-white font-extrabold text-2xl flex items-center justify-center ring-4 ring-navy-100 shadow-lg">
                AV
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h2 className="text-lg font-bold text-navy-900">Alex Vance</h2>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Super Admin</span>
                  </span>
                </div>
                <p className="text-xs text-navy-500">Lead Enterprise Architect & Studio Master</p>
                <p className="text-[11px] text-navy-400 font-mono">alex.vance@enterprise-clientcraft.io</p>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSave} className="space-y-4 max-w-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Alex"
                    className="w-full text-xs px-3.5 py-2.5 bg-navy-50 border border-navy-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 text-navy-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Vance"
                    className="w-full text-xs px-3.5 py-2.5 bg-navy-50 border border-navy-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 text-navy-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue="alex.vance@enterprise-clientcraft.io"
                  className="w-full text-xs px-3.5 py-2.5 bg-navy-50 border border-navy-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 text-navy-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
                  Role Title
                </label>
                <input
                  type="text"
                  defaultValue="Lead Solutions Architect"
                  className="w-full text-xs px-3.5 py-2.5 bg-navy-50 border border-navy-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 text-navy-900"
                />
              </div>

              <div className="pt-4 border-t border-navy-100 flex items-center justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow-md shadow-primary-600/20 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Profile</span>
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
