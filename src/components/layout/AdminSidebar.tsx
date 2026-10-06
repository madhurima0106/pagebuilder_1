'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Settings,
  UserCheck,
  LogOut,
  Layers,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { usePageStore } from '@/lib/store';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { pages, showToast } = usePageStore();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      active: pathname === '/'
    },
    {
      label: 'Client Pages',
      href: '/pages',
      icon: FileText,
      badge: pages.length.toString(),
      active: pathname.startsWith('/pages') || pathname.startsWith('/builder')
    },
    {
      label: 'Media Library',
      href: '/media',
      icon: ImageIcon,
      active: pathname.startsWith('/media')
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: Settings,
      active: pathname.startsWith('/settings')
    },
    {
      label: 'Admin Profile',
      href: '/profile',
      icon: UserCheck,
      active: pathname.startsWith('/profile')
    },
  ];

  const handleLogout = () => {
    showToast('Logged out of Admin Session safely.', 'info');
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 min-h-screen flex flex-col border-r border-slate-800 shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800/80 bg-slate-950/40">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-semibold text-white text-base tracking-tight leading-none flex items-center gap-1.5">
            ClientCraft
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              PRO
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Private Page Builder</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-3 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Core Studio
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                item.active
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    item.active ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge ? (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    item.active
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              ) : (
                item.active && <ChevronRight className="w-4 h-4 text-white/70" />
              )}
            </Link>
          );
        })}

        {/* Quick Pro Feature Highlight */}
        <div className="pt-6 px-2">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/90 border border-slate-700/60 shadow-inner text-xs">
            <div className="flex items-center gap-2 text-blue-400 font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Tab Builder</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[12px]">
              Every sidebar menu item maintains independent layouts and isolated components.
            </p>
          </div>
        </div>
      </div>

      {/* Admin User Footer / Logout */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/60 transition-colors">
          <Link href="/profile" className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold text-xs ring-2 ring-emerald-400/30">
              AD
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">Alex Vance</p>
              <p className="text-[11px] text-slate-400 truncate">Lead Architect</p>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
