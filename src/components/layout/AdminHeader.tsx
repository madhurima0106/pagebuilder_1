'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Bell,
  Plus,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';
import { usePageStore } from '@/lib/store';
import CreatePageModal from '../modals/CreatePageModal';

export default function AdminHeader() {
  const { notifications, pages } = usePageStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResultsOpen, setSearchResultsOpen] = useState(false);

  const filteredPages = searchQuery.trim()
    ? pages.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.clientName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        {/* Search Bar */}
        <div className="relative w-80 max-w-full">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchResultsOpen(true);
              }}
              onFocus={() => setSearchResultsOpen(true)}
              placeholder="Search client portals, proposals..."
              className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white text-sm text-slate-800 placeholder-slate-400 pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResultsOpen(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown */}
          {searchResultsOpen && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-2xl shadow-dropdown border border-slate-200 p-2 z-50 animate-fade-in">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Client Pages ({filteredPages.length})
              </div>
              {filteredPages.length > 0 ? (
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {filteredPages.map((page) => (
                    <Link
                      key={page.id}
                      href={`/builder/${page.id}`}
                      onClick={() => setSearchResultsOpen(false)}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-sm font-medium text-slate-900 truncate group-hover:text-blue-600">
                          {page.title}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{page.clientName}</p>
                      </div>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          page.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {page.status}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-500">
                  No client pages matching &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Section: Actions & Profile */}
        <div className="flex items-center gap-3">
          {/* Quick Create Page Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-sm shadow-blue-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Page</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-dropdown border border-slate-200 p-3 z-50 animate-fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-1">
                  <span className="text-xs font-semibold text-slate-800">Notifications</span>
                  <span className="text-[11px] text-blue-600 font-medium">Mark all read</span>
                </div>
                <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600 shrink-0 mt-0.5">
                          <CheckCircle className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-slate-900">{notif.title}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                            {notif.message}
                          </p>
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1.5">
                            <Clock className="w-3 h-3" />
                            <span>{notif.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-slate-200"></div>

          {/* Admin User Badge */}
          <Link
            href="/profile"
            className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-semibold text-xs flex items-center justify-center ring-2 ring-slate-100">
              AV
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-900 leading-tight">Alex Vance</p>
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                <ShieldCheck className="w-3 h-3" />
                <span>Super Admin</span>
              </div>
            </div>
          </Link>
        </div>
      </header>

      {/* Create New Page Modal */}
      {isCreateModalOpen && (
        <CreatePageModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      )}
    </>
  );
}
