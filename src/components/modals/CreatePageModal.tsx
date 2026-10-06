'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Sparkles, Building2, Globe, Palette, ArrowRight } from 'lucide-react';
import { usePageStore } from '@/lib/store';

interface CreatePageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePageModal({ isOpen, onClose }: CreatePageModalProps) {
  const router = useRouter();
  const { createPage } = usePageStore();

  const [clientName, setClientName] = useState('');
  const [title, setTitle] = useState('');
  const [themePreset, setThemePreset] = useState<'navy' | 'emerald' | 'luxury' | 'indigo'>('navy');
  const [initialStatus, setInitialStatus] = useState<'draft' | 'published'>('draft');

  if (!isOpen) return null;

  const presets = {
    navy: {
      primaryColor: '#2563eb',
      sidebarBg: '#0f172a',
      sidebarText: '#ffffff',
      fontFamily: 'Inter',
      borderRadius: '12px'
    },
    emerald: {
      primaryColor: '#059669',
      sidebarBg: '#064e3b',
      sidebarText: '#ffffff',
      fontFamily: 'Inter',
      borderRadius: '12px'
    },
    luxury: {
      primaryColor: '#b45309',
      sidebarBg: '#1c1917',
      sidebarText: '#ffffff',
      fontFamily: 'Inter',
      borderRadius: '8px'
    },
    indigo: {
      primaryColor: '#4f46e5',
      sidebarBg: '#1e1b4b',
      sidebarText: '#ffffff',
      fontFamily: 'Inter',
      borderRadius: '16px'
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    const newPage = createPage({
      clientName: clientName.trim(),
      title: title.trim() || `${clientName.trim()} Executive Briefing Portal`,
      status: initialStatus,
      theme: {
        ...presets[themePreset],
        logoText: clientName.trim().toUpperCase()
      }
    });

    onClose();
    router.push(`/builder/${newPage.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-navy-200 max-w-lg w-full overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-navy-100 flex items-center justify-between bg-navy-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-500/10 text-primary-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-navy-900">Create Private Client Page</h2>
              <p className="text-xs text-navy-500">Configure client name, portal title, and initial design</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-navy-400 hover:text-navy-600 rounded-xl hover:bg-navy-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleCreate} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-1.5">
              Client / Organization Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Acme Global Industries"
                className="w-full text-sm pl-10 pr-4 py-2.5 bg-navy-50 border border-navy-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all text-navy-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-1.5">
              Portal / Proposal Title
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Confidential Strategic Growth Portal"
                className="w-full text-sm pl-10 pr-4 py-2.5 bg-navy-50 border border-navy-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all text-navy-900"
              />
            </div>
          </div>

          {/* Theme Preset Selector */}
          <div>
            <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-navy-400" />
              <span>Visual Style Preset</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setThemePreset('navy')}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  themePreset === 'navy'
                    ? 'border-primary-600 bg-primary-50/50 ring-2 ring-primary-500/20'
                    : 'border-navy-200 hover:border-navy-300 bg-white'
                }`}
              >
                <div className="w-6 h-6 rounded-lg bg-navy-900 border border-navy-800 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary-500"></div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-navy-900">Corporate Navy</p>
                  <p className="text-[10px] text-navy-500">Executive & Enterprise</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setThemePreset('emerald')}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  themePreset === 'emerald'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                    : 'border-navy-200 hover:border-navy-300 bg-white'
                }`}
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-navy-900">Bio / Sustainability</p>
                  <p className="text-[10px] text-navy-500">Clean Emerald Green</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setThemePreset('luxury')}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  themePreset === 'luxury'
                    ? 'border-amber-600 bg-amber-50/50 ring-2 ring-amber-500/20'
                    : 'border-navy-200 hover:border-navy-300 bg-white'
                }`}
              >
                <div className="w-6 h-6 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-navy-900">Luxury / Private</p>
                  <p className="text-[10px] text-navy-500">Warm Amber Bronze</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setThemePreset('indigo')}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  themePreset === 'indigo'
                    ? 'border-accent-600 bg-accent-50/50 ring-2 ring-indigo-500/20'
                    : 'border-navy-200 hover:border-navy-300 bg-white'
                }`}
              >
                <div className="w-6 h-6 rounded-lg bg-accent-950 border border-accent-800 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-accent-400"></div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-navy-900">Tech Indigo</p>
                  <p className="text-[10px] text-navy-500">Fintech & SaaS</p>
                </div>
              </button>
            </div>
          </div>

          {/* Initial Status */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-navy-50 border border-navy-200">
            <div>
              <p className="text-xs font-semibold text-navy-800">Initial Page Status</p>
              <p className="text-[11px] text-navy-500">Draft pages are only editable by admins</p>
            </div>
            <div className="flex rounded-lg bg-navy-200/80 p-0.5">
              <button
                type="button"
                onClick={() => setInitialStatus('draft')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  initialStatus === 'draft' ? 'bg-white text-navy-900 shadow-sm' : 'text-navy-600'
                }`}
              >
                Draft
              </button>
              <button
                type="button"
                onClick={() => setInitialStatus('published')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  initialStatus === 'published' ? 'bg-white text-navy-900 shadow-sm' : 'text-navy-600'
                }`}
              >
                Published
              </button>
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-navy-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-navy-600 hover:text-navy-800 hover:bg-navy-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-md shadow-primary-600/20 transition-all"
            >
              <span>Create & Launch Builder</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
