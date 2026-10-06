'use client';

import React, { useState, useMemo } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import { usePageStore } from '@/lib/store';
import {
  Upload,
  Search,
  LayoutGrid,
  List,
  Image as ImageIcon,
  Copy,
  Trash2,
  ExternalLink,
  Check,
  Filter,
  Info,
  Layers,
  Sparkles,
  Cloud
} from 'lucide-react';
import { MediaItem } from '@/types';

export default function MediaLibraryPage() {
  const { mediaItems, addMediaItem, deleteMediaItem, showToast } = usePageStore();

  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const allTags = ['All', ...Array.from(new Set(mediaItems.flatMap((m) => m.tags)))];

  const filteredMedia = useMemo(() => {
    return mediaItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.alt.toLowerCase().includes(search.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchesTag = selectedTag === 'All' || item.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [mediaItems, search, selectedTag]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file (PNG, JPG, SVG, WebP)', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('File size must be under 5MB', 'error');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const newItem = addMediaItem({
        name: file.name,
        url: dataUrl,
        alt: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        bytes: file.size,
        type: file.type,
        dimensions: '1920x1080',
        tags: ['Uploads']
      });
      setIsUploading(false);
      setSelectedItem(newItem);
    };
    reader.readAsDataURL(file);
  };

  const handleCopyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    showToast(`Copied asset URL for "${item.name}"`, 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="flex min-h-screen bg-navy-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Header & Upload action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-navy-900 tracking-tight">Media Library</h1>
              <p className="text-xs text-navy-500 mt-1">
                Manage, preview, and upload high-resolution imagery and brand assets for client pages.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-50 text-primary-700 text-xs font-semibold border border-primary-200">
                <Cloud className="w-4 h-4 text-primary-600" />
                <span>Cloudinary Sync Ready</span>
              </div>

              <label className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-md shadow-primary-600/20 cursor-pointer transition-all">
                <Upload className="w-4 h-4" />
                <span>{isUploading ? 'Processing...' : 'Upload Image'}</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Controls: Search, Tag filter, View mode */}
          <div className="bg-white p-4 rounded-2xl border border-navy-200/80 shadow-soft flex flex-wrap items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search assets by file name, tag, or description..."
                className="w-full text-xs pl-10 pr-4 py-2.5 bg-navy-50 border border-navy-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              />
            </div>

            {/* Tag Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                    selectedTag === tag
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-navy-100 text-navy-600 hover:bg-navy-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-navy-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-primary-600 shadow-sm' : 'text-navy-500 hover:text-navy-800'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-white text-primary-600 shadow-sm' : 'text-navy-500 hover:text-navy-800'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Content: Gallery Grid or List + Asset Detail Drawer */}
          <div className="flex gap-6 items-start">
            {/* Gallery View */}
            <div className="flex-1">
              {filteredMedia.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 border border-navy-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-navy-800">No media assets found</h3>
                  <p className="text-xs text-navy-500 max-w-xs mx-auto">
                    Try different search keywords or upload a new image from your system.
                  </p>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredMedia.map((item) => {
                    const isSelected = selectedItem?.id === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`group bg-white rounded-2xl border overflow-hidden cursor-pointer transition-all shadow-soft hover:shadow-card flex flex-col ${
                          isSelected
                            ? 'border-primary-600 ring-4 ring-primary-500/20'
                            : 'border-navy-200 hover:border-navy-300'
                        }`}
                      >
                        <div className="aspect-video bg-navy-100 overflow-hidden relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.url}
                            alt={item.alt}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-3 space-y-1">
                          <p className="text-xs font-semibold text-navy-900 truncate">{item.name}</p>
                          <div className="flex items-center justify-between text-[10px] text-navy-400">
                            <span>{item.size}</span>
                            <span>{item.dimensions}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* List View */
                <div className="bg-white rounded-3xl border border-navy-200/80 shadow-soft overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-navy-50 border-b border-navy-100 text-[11px] font-bold text-navy-500 uppercase tracking-wider">
                        <th className="py-3 px-4">Asset Preview & Name</th>
                        <th className="py-3 px-4">Tags</th>
                        <th className="py-3 px-4">Dimensions</th>
                        <th className="py-3 px-4">Size</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-100">
                      {filteredMedia.map((item) => (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedItem(item)}
                          className="hover:bg-navy-50/80 cursor-pointer transition-colors"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={item.url}
                                alt={item.alt}
                                className="w-10 h-10 rounded-xl object-cover border border-navy-200 shrink-0"
                              />
                              <span className="font-semibold text-navy-900 truncate max-w-[200px]">
                                {item.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1 flex-wrap">
                              {item.tags.map((t) => (
                                <span
                                  key={t}
                                  className="px-2 py-0.5 rounded-md bg-navy-100 text-navy-600 text-[10px] font-medium"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-navy-500">{item.dimensions}</td>
                          <td className="py-3 px-4 text-navy-500">{item.size}</td>
                          <td className="py-3 px-4 text-navy-500">{item.uploadedAt}</td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyUrl(item);
                              }}
                              className="p-1.5 text-navy-400 hover:text-primary-600 rounded-lg hover:bg-primary-50"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Asset Detail Panel / Drawer */}
            {selectedItem && (
              <div className="w-80 bg-white rounded-3xl border border-navy-200/80 shadow-soft p-5 space-y-4 shrink-0 animate-fade-in sticky top-24">
                <div className="flex items-center justify-between pb-2 border-b border-navy-100">
                  <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider">Asset Details</h3>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="text-xs text-navy-400 hover:text-navy-700"
                  >
                    Close
                  </button>
                </div>

                <div className="rounded-2xl overflow-hidden aspect-video bg-navy-100 border border-navy-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selectedItem.url} alt={selectedItem.alt} className="w-full h-full object-cover" />
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-navy-400 uppercase tracking-wider">
                      File Name
                    </label>
                    <p className="font-semibold text-navy-900 break-all">{selectedItem.name}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-navy-400 uppercase tracking-wider">
                        Dimensions
                      </label>
                      <p className="text-navy-700 font-medium">{selectedItem.dimensions}</p>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-navy-400 uppercase tracking-wider">
                        File Size
                      </label>
                      <p className="text-navy-700 font-medium">{selectedItem.size}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-navy-400 uppercase tracking-wider">
                      Alt Text / Accessibility
                    </label>
                    <p className="text-navy-600 bg-navy-50 p-2 rounded-xl border border-navy-200 text-[11px] leading-snug">
                      {selectedItem.alt}
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(selectedItem)}
                      className="w-full flex items-center justify-center gap-2 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold shadow-sm transition-all"
                    >
                      {copiedId === selectedItem.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedId === selectedItem.id ? 'URL Copied!' : 'Copy Asset URL'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        deleteMediaItem(selectedItem.id);
                        setSelectedItem(null);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 text-rose-600 hover:bg-rose-50 rounded-xl font-semibold border border-rose-200 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Asset</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
