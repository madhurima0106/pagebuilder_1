'use client';

import React, { useState } from 'react';
import {
  X,
  Link as LinkIcon,
  Copy,
  Check,
  RotateCw,
  Ban,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Lock,
  Unlock,
  QrCode
} from 'lucide-react';
import { ClientPage } from '@/types';
import { usePageStore } from '@/lib/store';

interface PrivateUrlModalProps {
  page: ClientPage;
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivateUrlModal({ page, isOpen, onClose }: PrivateUrlModalProps) {
  const { resetPrivateUrl, revokePrivateUrl, reactivatePrivateUrl, showToast } = usePageStore();
  const [copied, setCopied] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'none' | 'reset' | 'revoke'>('none');
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const fullUrl = `${origin}/p/${page.slug}?token=${page.privateToken}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    showToast('Private link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExecuteReset = () => {
    resetPrivateUrl(page.id);
    setConfirmAction('none');
  };

  const handleExecuteRevoke = () => {
    revokePrivateUrl(page.id);
    setConfirmAction('none');
  };

  const handleExecuteReactivate = () => {
    reactivatePrivateUrl(page.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-navy-200 max-w-lg w-full overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-navy-100 flex items-center justify-between bg-navy-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-500/10 text-primary-600 flex items-center justify-center">
              <LinkIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-navy-900">Private URL Management</h2>
              <p className="text-xs text-navy-500 truncate max-w-xs">{page.title}</p>
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
        <div className="p-6 space-y-5">
          {/* Status & Security Badge */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-navy-50 border border-navy-200">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-3 h-3 rounded-full ${
                  page.isUrlActive ? 'bg-emerald-500 ring-4 ring-emerald-100 animate-pulse' : 'bg-rose-500 ring-4 ring-rose-100'
                }`}
              />
              <div>
                <p className="text-xs font-bold text-navy-900">
                  {page.isUrlActive ? 'URL Status: Active & Secured' : 'URL Status: Revoked / Access Denied'}
                </p>
                <p className="text-[11px] text-navy-500">
                  {page.isUrlActive
                    ? 'Only clients with this secret token can view this portal.'
                    : 'External client visits will see an Access Revoked notice.'}
                </p>
              </div>
            </div>
            <span
              className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full ${
                page.isUrlActive
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}
            >
              {page.isUrlActive ? 'Active' : 'Disabled'}
            </span>
          </div>

          {/* URL Box & Copy */}
          <div>
            <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-1.5">
              Secret Client URL
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 min-w-0 bg-navy-100 border border-navy-300/80 rounded-xl px-3.5 py-2.5 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-mono text-navy-800 truncate select-all">{fullUrl}</span>
              </div>
              <button
                onClick={handleCopy}
                disabled={!page.isUrlActive}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-sm transition-all shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex items-center gap-2 pt-1">
            <a
              href={fullUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-navy-200 text-navy-700 hover:bg-navy-50 text-xs font-semibold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-navy-400" />
              <span>Test Client View</span>
            </a>
            <button
              onClick={() => setShowQr(!showQr)}
              className="py-2 px-3 rounded-xl border border-navy-200 text-navy-700 hover:bg-navy-50 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <QrCode className="w-3.5 h-3.5 text-navy-400" />
              <span>{showQr ? 'Hide QR' : 'Show QR'}</span>
            </button>
          </div>

          {showQr && (
            <div className="p-4 bg-navy-50 rounded-2xl border border-navy-200 text-center animate-fade-in">
              <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl shadow-sm border border-navy-200 flex items-center justify-center">
                {/* SVG QR Code Simulation */}
                <div className="grid grid-cols-6 gap-1 w-full h-full p-1 bg-navy-900 rounded-lg">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`${(i * 7) % 3 === 0 || i % 2 === 0 ? 'bg-white' : 'bg-transparent'} rounded-[1px]`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-navy-500 mt-2 font-medium">Scan to open on tablet or mobile device</p>
            </div>
          )}

          {/* Confirmation Modals / Buttons */}
          {confirmAction === 'none' && (
            <div className="pt-3 border-t border-navy-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmAction('reset')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Reset URL (New Token)</span>
                </button>

                {page.isUrlActive ? (
                  <button
                    type="button"
                    onClick={() => setConfirmAction('revoke')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Revoke URL</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleExecuteReactivate}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Reactivate URL</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-navy-600 hover:text-navy-800 hover:bg-navy-100 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          )}

          {/* Reset Confirmation Dialog */}
          {confirmAction === 'reset' && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-3 animate-fade-in">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Confirm URL Reset</h4>
                  <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                    Resetting will instantly generate a new private token. Any previous links sent to the client will immediately stop working. 
                    <strong className="block mt-1 text-navy-900">Note: Your page layout, images, sidebar tabs, and content will remain 100% untouched.</strong>
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setConfirmAction('none')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-navy-700 hover:bg-amber-100/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteReset}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
                >
                  Yes, Reset Token
                </button>
              </div>
            </div>
          )}

          {/* Revoke Confirmation Dialog */}
          {confirmAction === 'revoke' && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-3 animate-fade-in">
              <div className="flex items-start gap-2.5">
                <Ban className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Confirm URL Revocation</h4>
                  <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                    Revoking will immediately disable client access without deleting any page content, sidebar menus, or uploaded media. You can reactivate access at any time.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setConfirmAction('none')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-navy-700 hover:bg-rose-100/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteRevoke}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
                >
                  Yes, Revoke Access
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
