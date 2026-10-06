'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import { usePageStore } from '@/lib/store';
import {
  FileText,
  CheckCircle,
  Clock,
  Archive,
  Plus,
  ArrowUpRight,
  ExternalLink,
  Edit3,
  Copy,
  Link2,
  TrendingUp,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  Check
} from 'lucide-react';
import CreatePageModal from '@/components/modals/CreatePageModal';
import PrivateUrlModal from '@/components/modals/PrivateUrlModal';
import { ClientPage } from '@/types';

export default function DashboardPage() {
  const { pages, showToast } = usePageStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPageForUrl, setSelectedPageForUrl] = useState<ClientPage | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Statistics Calculation
  const totalPages = pages.length;
  const publishedCount = pages.filter((p) => p.status === 'published').length;
  const draftCount = pages.filter((p) => p.status === 'draft').length;
  const archivedCount = pages.filter((p) => p.status === 'archived').length;
  const activePrivateLinks = pages.filter((p) => p.isUrlActive).length;

  const recentPages = [...pages].sort(
    (a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
  ).slice(0, 5);

  const handleCopyLink = (page: ClientPage) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${origin}/p/${page.slug}?token=${page.privateToken}`;
    navigator.clipboard.writeText(url);
    setCopiedId(page.id);
    showToast(`Copied private link for "${page.clientName}"`, 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Dark Navy Sidebar */}
      <AdminSidebar />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* Welcome Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 sm:p-8 rounded-3xl text-white shadow-card border border-slate-800">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Executive Portal Engine</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Client Page Management
              </h1>
              <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
                Design custom private client briefing pages with isolated multi-tab content, real-time live preview, and cryptographic private URL management.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/pages"
                className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              >
                Browse All Pages
              </Link>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Page</span>
              </button>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Total Pages */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex items-center justify-between hover:shadow-card transition-shadow">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Portals</p>
                <p className="text-2xl font-bold text-slate-900">{totalPages}</p>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                  <TrendingUp className="w-3 h-3" />
                  <span>100% cloud synched</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
            </div>

            {/* Published */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex items-center justify-between hover:shadow-card transition-shadow">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Published</p>
                <p className="text-2xl font-bold text-slate-900">{publishedCount}</p>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                  <CheckCircle className="w-3 h-3" />
                  <span>Live client access</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>

            {/* Drafts */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex items-center justify-between hover:shadow-card transition-shadow">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">In Draft</p>
                <p className="text-2xl font-bold text-slate-900">{draftCount}</p>
                <div className="flex items-center gap-1 text-[11px] text-amber-600 font-medium">
                  <Clock className="w-3 h-3" />
                  <span>Work in progress</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            {/* Active Private Links */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex items-center justify-between hover:shadow-card transition-shadow">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active URLs</p>
                <p className="text-2xl font-bold text-slate-900">{activePrivateLinks}</p>
                <div className="flex items-center gap-1 text-[11px] text-indigo-600 font-medium">
                  <Link2 className="w-3 h-3" />
                  <span>Secured private tokens</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Link2 className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Recent Client Pages Section */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Recent Client Pages</h2>
                <p className="text-xs text-slate-500">Quickly resume editing or manage client share links</p>
              </div>
              <Link
                href="/pages"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 self-start sm:self-auto"
              >
                <span>View all ({pages.length})</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-6">Portal & Client</th>
                    <th className="py-3.5 px-4">Menu Sections</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Private URL</th>
                    <th className="py-3.5 px-4">Last Updated</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {recentPages.map((page) => (
                    <tr key={page.id} className="hover:bg-slate-50/80 transition-colors group">
                      {/* Title & Client */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {/* Thumbnail */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={page.thumbnailUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=120&q=80'}
                            alt={page.title}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <Link
                              href={`/builder/${page.id}`}
                              className="font-semibold text-slate-900 hover:text-blue-600 transition-colors truncate block"
                            >
                              {page.title}
                            </Link>
                            <span className="text-[11px] text-slate-500 font-medium">
                              Client: <strong className="text-slate-700">{page.clientName}</strong>
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Menu Sections Count */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {page.menuItems.slice(0, 3).map((item) => (
                            <span
                              key={item.id}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium"
                            >
                              {item.label}
                            </span>
                          ))}
                          {page.menuItems.length > 3 && (
                            <span className="text-[10px] text-slate-400 font-semibold">
                              +{page.menuItems.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            page.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : page.status === 'draft'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              page.status === 'published'
                                ? 'bg-emerald-500'
                                : page.status === 'draft'
                                ? 'bg-amber-500'
                                : 'bg-slate-400'
                            }`}
                          />
                          {page.status}
                        </span>
                      </td>

                      {/* Private URL Link Status */}
                      <td className="py-4 px-4">
                        <button
                          onClick={() => setSelectedPageForUrl(page)}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                            page.isUrlActive
                              ? 'text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/60'
                              : 'text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/60'
                          }`}
                        >
                          <Link2 className="w-3.5 h-3.5" />
                          <span>{page.isUrlActive ? 'Active' : 'Disabled'}</span>
                        </button>
                      </td>

                      {/* Last Updated */}
                      <td className="py-4 px-4 text-slate-500 text-[11px]">{page.lastUpdated}</td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleCopyLink(page)}
                            title="Copy Private Link"
                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                          >
                            {copiedId === page.id ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>

                          <Link
                            href={`/p/${page.slug}?token=${page.privateToken}`}
                            target="_blank"
                            title="Open Client View"
                            className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          <Link
                            href={`/builder/${page.id}`}
                            title="Edit in Visual Page Builder"
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-semibold text-[11px] shadow-sm transition-all"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {isCreateModalOpen && (
        <CreatePageModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      )}

      {selectedPageForUrl && (
        <PrivateUrlModal
          page={selectedPageForUrl}
          isOpen={!!selectedPageForUrl}
          onClose={() => setSelectedPageForUrl(null)}
        />
      )}
    </div>
  );
}
