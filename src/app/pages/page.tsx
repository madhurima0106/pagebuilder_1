'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import { usePageStore } from '@/lib/store';
import {
  LayoutGrid,
  List,
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  MoreVertical,
  Edit3,
  ExternalLink,
  Copy,
  Trash2,
  CopyPlus,
  Link2,
  Check,
  Globe,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';
import CreatePageModal from '@/components/modals/CreatePageModal';
import PrivateUrlModal from '@/components/modals/PrivateUrlModal';
import { ClientPage, PageStatus } from '@/types';

export default function ClientPagesManagementPage() {
  const { pages, deletePage, duplicatePage, showToast } = usePageStore();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PageStatus>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'client'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPageForUrl, setSelectedPageForUrl] = useState<ClientPage | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Filtered & Sorted Pages
  const filteredPages = useMemo(() => {
    return pages
      .filter((p) => {
        const matchesSearch =
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.clientName.toLowerCase().includes(search.toLowerCase()) ||
          p.slug.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === 'date') {
          diff = new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        } else if (sortBy === 'title') {
          diff = a.title.localeCompare(b.title);
        } else if (sortBy === 'client') {
          diff = a.clientName.localeCompare(b.clientName);
        }
        return sortOrder === 'desc' ? diff : -diff;
      });
  }, [pages, search, statusFilter, sortBy, sortOrder]);

  // Pagination
  const totalPagesCount = Math.ceil(filteredPages.length / itemsPerPage) || 1;
  const paginatedPages = filteredPages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCopyLink = (page: ClientPage) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${origin}/p/${page.slug}?token=${page.privateToken}`;
    navigator.clipboard.writeText(url);
    setCopiedId(page.id);
    showToast(`Copied private link for "${page.clientName}"`, 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDuplicate = (id: string) => {
    duplicatePage(id);
    setOpenDropdownId(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this client page?')) {
      deletePage(id);
      setOpenDropdownId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-navy-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Page Title & Main Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-navy-900 tracking-tight">Client Pages</h1>
              <p className="text-xs text-navy-500 mt-1">
                Manage, design, and configure private sharing permissions for client portals.
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-md shadow-primary-600/20 transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Page</span>
            </button>
          </div>

          {/* Controls: Search, Status Filter, Sort, View Toggle */}
          <div className="bg-white p-4 rounded-2xl border border-navy-200/80 shadow-soft flex flex-wrap items-center justify-between gap-4">
            {/* Left: Search input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by client, title, or slug..."
                className="w-full text-xs text-navy-800 placeholder-navy-400 pl-10 pr-4 py-2.5 bg-navy-50 border border-navy-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              />
            </div>

            {/* Middle: Status Filter Tabs */}
            <div className="flex items-center gap-1 bg-navy-100 p-1 rounded-xl">
              {(['all', 'published', 'draft', 'archived'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    setStatusFilter(st);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    statusFilter === st
                      ? 'bg-white text-navy-900 shadow-sm'
                      : 'text-navy-500 hover:text-navy-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Right: Sort & Grid/Table Toggle */}
            <div className="flex items-center gap-2">
              {/* Sort selector */}
              <div className="flex items-center gap-1.5 bg-navy-50 border border-navy-200 px-3 py-1.5 rounded-xl text-xs font-medium text-navy-700">
                <ArrowUpDown className="w-3.5 h-3.5 text-navy-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  aria-label="Sort client pages by"
                  className="bg-transparent border-none focus:outline-none text-xs text-navy-800 font-medium cursor-pointer"
                >
                  <option value="date">Last Updated</option>
                  <option value="title">Page Title</option>
                  <option value="client">Client Name</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="text-navy-400 hover:text-navy-800 px-1 font-bold"
                  title="Toggle Order"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-navy-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'table' ? 'bg-white text-primary-600 shadow-sm' : 'text-navy-500 hover:text-navy-800'
                  }`}
                  title="Table View"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-white text-primary-600 shadow-sm' : 'text-navy-500 hover:text-navy-800'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* View Content: Table or Grid */}
          {paginatedPages.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-navy-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h2 className="text-sm font-bold text-navy-800">No client pages found</h2>
              <p className="text-xs text-navy-500 max-w-sm mx-auto">
                No portals matched your current filter criteria. Try adjusting filters or create a new page.
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-semibold"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Page</span>
              </button>
            </div>
          ) : viewMode === 'table' ? (
            /* Table View */
            <div className="bg-white rounded-3xl border border-navy-200/80 shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-navy-50/80 border-b border-navy-100 text-[11px] font-bold text-navy-500 uppercase tracking-wider">
                      <th className="py-3.5 px-6">Client Portal</th>
                      <th className="py-3.5 px-4">Slug / Private Token</th>
                      <th className="py-3.5 px-4">Tabs</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Last Updated</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-100 text-xs text-navy-700">
                    {paginatedPages.map((page) => (
                      <tr key={page.id} className="hover:bg-navy-50/80 transition-colors group">
                        {/* Thumbnail & Title */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3.5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={page.thumbnailUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=120&q=80'}
                              alt={page.title}
                              className="w-12 h-12 rounded-2xl object-cover border border-navy-200 shrink-0 shadow-sm"
                            />
                            <div className="min-w-0">
                              <Link
                                href={`/builder/${page.id}`}
                                className="font-bold text-navy-900 hover:text-primary-600 transition-colors truncate block text-sm"
                              >
                                {page.title}
                              </Link>
                              <p className="text-xs text-navy-500 font-medium">
                                Organization: <span className="text-navy-800">{page.clientName}</span>
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Slug & Token */}
                        <td className="py-4 px-4 font-mono text-[11px] text-navy-500">
                          <div>/p/{page.slug}</div>
                          <div className="text-[10px] text-navy-400 truncate max-w-[120px]">{page.privateToken}</div>
                        </td>

                        {/* Tabs / Menu items */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md bg-primary-50 text-primary-700 text-[11px] font-semibold">
                              {page.menuItems.length} {page.menuItems.length === 1 ? 'Tab' : 'Tabs'}
                            </span>
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
                                : 'bg-navy-100 text-navy-600 border border-navy-200'
                            }`}
                          >
                            {page.status}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="py-4 px-4 text-navy-500 text-[11px]">{page.lastUpdated}</td>

                        {/* Action buttons */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5 relative">
                            <button
                              onClick={() => handleCopyLink(page)}
                              title="Copy Secret Link"
                              className="p-2 text-navy-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
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
                              title="Preview Client View"
                              className="p-2 text-navy-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>

                            <Link
                              href={`/builder/${page.id}`}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold text-xs shadow-sm transition-all"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </Link>

                            {/* More Options Dropdown */}
                            <div className="relative">
                              <button
                                onClick={() =>
                                  setOpenDropdownId(openDropdownId === page.id ? null : page.id)
                                }
                                className="p-2 text-navy-400 hover:text-navy-700 rounded-xl hover:bg-navy-100 transition-colors"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>

                              {openDropdownId === page.id && (
                                <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-2xl shadow-dropdown border border-navy-200 py-1.5 z-40 animate-fade-in text-left">
                                  <button
                                    onClick={() => {
                                      setSelectedPageForUrl(page);
                                      setOpenDropdownId(null);
                                    }}
                                    className="w-full px-3.5 py-2 text-xs font-medium text-navy-700 hover:bg-navy-50 flex items-center gap-2"
                                  >
                                    <Link2 className="w-3.5 h-3.5 text-primary-500" />
                                    <span>Private URL Settings</span>
                                  </button>
                                  <button
                                    onClick={() => handleDuplicate(page.id)}
                                    className="w-full px-3.5 py-2 text-xs font-medium text-navy-700 hover:bg-navy-50 flex items-center gap-2"
                                  >
                                    <CopyPlus className="w-3.5 h-3.5 text-navy-400" />
                                    <span>Duplicate Page</span>
                                  </button>
                                  <div className="h-px bg-navy-100 my-1"></div>
                                  <button
                                    onClick={() => handleDelete(page.id)}
                                    className="w-full px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete Page</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedPages.map((page) => (
                <div
                  key={page.id}
                  className="bg-white rounded-3xl border border-navy-200/80 shadow-soft hover:shadow-card transition-all overflow-hidden flex flex-col group"
                >
                  {/* Thumbnail & Status Overlay */}
                  <div className="relative h-44 bg-navy-900 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={page.thumbnailUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80'}
                      alt={page.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent"></div>

                    {/* Status badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                          page.status === 'published'
                            ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-500/30'
                            : 'bg-amber-900/80 text-amber-200 border border-amber-500/30'
                        }`}
                      >
                        {page.status}
                      </span>
                    </div>

                    {/* Client Name pill */}
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2.5 py-1 rounded-xl bg-navy-900/80 backdrop-blur-md text-white text-xs font-semibold border border-navy-700/60">
                        {page.clientName}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <Link
                        href={`/builder/${page.id}`}
                        className="font-bold text-navy-900 text-base group-hover:text-primary-600 transition-colors line-clamp-1 block"
                      >
                        {page.title}
                      </Link>
                      <p className="text-xs text-navy-500 mt-1 flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-navy-400" />
                        <span>/p/{page.slug}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-navy-100 text-xs text-navy-500">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-navy-400" />
                        <span>{page.menuItems.length} Sidebar Tabs</span>
                      </span>
                      <span className="flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3 text-navy-400" />
                        <span>{page.lastUpdated}</span>
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between pt-2 gap-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopyLink(page)}
                          title="Copy Link"
                          className="p-2 text-navy-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
                        >
                          {copiedId === page.id ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => setSelectedPageForUrl(page)}
                          title="Private URL settings"
                          className="p-2 text-navy-500 hover:text-accent-600 hover:bg-accent-50 rounded-xl transition-colors"
                        >
                          <Link2 className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/p/${page.slug}?token=${page.privateToken}`}
                          target="_blank"
                          title="Preview"
                          className="p-2 text-navy-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>

                      <Link
                        href={`/builder/${page.id}`}
                        className="flex items-center gap-1.5 px-4 py-2 bg-navy-900 hover:bg-primary-600 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Open Builder</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPagesCount > 1 && (
            <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-navy-200 text-xs">
              <span className="text-navy-500">
                Showing {paginatedPages.length} of {filteredPages.length} pages
              </span>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPagesCount }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-xl font-bold transition-all ${
                      currentPage === i + 1
                        ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/30'
                        : 'text-navy-600 hover:bg-navy-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

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
