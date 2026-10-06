'use client';

import React, { useState, useEffect, use, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePageStore } from '@/lib/store';
import {
  ShieldCheck,
  Menu,
  X,
  Lock,
  Ban,
  LayoutDashboard,
  Sparkles,
  Image as ImageIcon,
  Code2,
  Mail,
  FileText,
  Printer,
  Share2,
  Check,
  ChevronRight
} from 'lucide-react';
import ComponentRenderer from '@/components/builder/ComponentRenderer';
import { MenuItem } from '@/types';

interface ClientViewProps {
  params: Promise<{ slug: string }>;
}

function ClientFacingContent({ params }: ClientViewProps) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { pages, showToast } = usePageStore();
  const page = pages.find((p) => p.slug === resolvedParams.slug || p.id === resolvedParams.slug);

  const [activeMenuId, setActiveMenuId] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Initialize active menu item
  useEffect(() => {
    if (page && page.menuItems.length > 0 && !activeMenuId) {
      const defaultItem = page.menuItems.find((m) => m.isDefault) || page.menuItems[0];
      setActiveMenuId(defaultItem.id);
    }
  }, [page, activeMenuId]);

  if (!page) {
    return (
      <div className="min-h-screen bg-navy-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-3">
          <Lock className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-bold">Client Portal Not Found</h1>
        <p className="text-xs text-navy-400 mt-1 max-w-sm">
          The requested private portal link does not exist or has expired. Please verify the URL with your account executive.
        </p>
      </div>
    );
  }

  // Check URL Active status
  if (!page.isUrlActive) {
    return (
      <div className="min-h-screen bg-navy-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4 ring-8 ring-rose-500/5">
          <Ban className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold">Access Revoked</h1>
        <p className="text-sm text-navy-400 mt-2 max-w-md leading-relaxed">
          Access to this private client portal for <strong className="text-white">{page.clientName}</strong> has been temporarily suspended by the administrator.
        </p>
        <p className="text-xs text-navy-500 mt-4 font-mono">Security Token: {page.privateToken.substring(0, 8)}***</p>
      </div>
    );
  }

  const activeMenuItem =
    page.menuItems.find((m) => m.id === activeMenuId) || page.menuItems[0] || null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    showToast('Client portal link copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const getMenuIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Sparkles': return Sparkles;
      case 'Image': return ImageIcon;
      case 'Code2': return Code2;
      case 'Mail': return Mail;
      case 'LayoutDashboard': return LayoutDashboard;
      default: return FileText;
    }
  };

  return (
    <div className="min-h-screen bg-navy-100/70 flex flex-col md:flex-row text-navy-900 font-sans">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-navy-900 text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center font-bold text-xs">
            {page.theme.logoText ? page.theme.logoText.charAt(0) : 'P'}
          </div>
          <div>
            <h2 className="font-bold text-sm tracking-tight">{page.theme.logoText || page.clientName}</h2>
            <p className="text-[10px] text-navy-400">Private Client Portal</p>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-navy-300 hover:text-white rounded-lg hover:bg-navy-800"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        style={{
          backgroundColor: page.theme.sidebarBg || '#0f172a',
          color: page.theme.sidebarText || '#ffffff'
        }}
        className={`fixed md:sticky top-0 h-screen w-72 flex flex-col justify-between border-r border-navy-800 z-30 transition-transform duration-300 ease-in-out shrink-0 select-none ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header / Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div
              style={{ backgroundColor: page.theme.primaryColor || '#2563eb' }}
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-extrabold shadow-lg shadow-primary-500/20"
            >
              {page.theme.logoText ? page.theme.logoText.charAt(0) : 'P'}
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-base tracking-tight truncate">
                {page.theme.logoText || page.clientName}
              </h2>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Client Access</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Menu Items */}
        <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-navy-400">
            Document Sections
          </div>
          {page.menuItems.map((item) => {
            const isActive = item.id === activeMenuItem?.id;
            const Icon = getMenuIcon(item.icon);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveMenuId(item.id);
                  setMobileMenuOpen(false);
                }}
                style={
                  isActive
                    ? { backgroundColor: page.theme.primaryColor || '#2563eb', color: '#ffffff' }
                    : {}
                }
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'shadow-md'
                    : 'text-navy-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 opacity-80" />}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 text-center space-y-2 text-xs text-navy-400">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Link' : 'Share'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
          <p className="text-[10px] text-navy-500">
            Confidential Client Documentation &copy; {new Date().getFullYear()}
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Confidentiality Banner */}
        <div className="bg-white border-b border-navy-200/80 px-6 sm:px-10 py-3.5 flex items-center justify-between text-xs text-navy-600 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-navy-800">Private Briefing for {page.clientName}</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-navy-500">
            <span className="hidden sm:inline">Last synched: {page.lastUpdated}</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
              AUTHENTICATED
            </span>
          </div>
        </div>

        {/* Content Viewport */}
        <div className="flex-1 p-6 sm:p-10 max-w-5xl w-full mx-auto space-y-6">
          {activeMenuItem && activeMenuItem.components.length > 0 ? (
            <div className="space-y-6 animate-fade-in">
              {activeMenuItem.components.map((component) => (
                <ComponentRenderer key={component.id} component={component} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-navy-200 text-center space-y-2">
              <h3 className="text-base font-bold text-navy-800">Section Content Pending</h3>
              <p className="text-xs text-navy-500">
                This section ({activeMenuItem?.label}) does not have published components yet.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function ClientFacingPage(props: ClientViewProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-navy-900 text-white flex items-center justify-center p-6">
          <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
        </div>
      }
    >
      <ClientFacingContent {...props} />
    </Suspense>
  );
}
