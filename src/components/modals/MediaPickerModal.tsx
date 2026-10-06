'use client';

import React, { useState } from 'react';
import { X, Upload, Search, Check, Image as ImageIcon, Filter } from 'lucide-react';
import { usePageStore } from '@/lib/store';
import { MediaItem } from '@/types';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string, alt: string) => void;
  selectedUrl?: string;
}

export default function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  selectedUrl
}: MediaPickerModalProps) {
  const { mediaItems, addMediaItem, showToast } = usePageStore();
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const allTags = ['All', ...Array.from(new Set(mediaItems.flatMap((m) => m.tags)))];

  const filteredMedia = mediaItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesTag = selectedTag === 'All' || item.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

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
      onSelect(newItem.url, newItem.alt);
      onClose();
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-navy-200 max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-navy-100 flex items-center justify-between bg-navy-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-500/10 text-primary-600 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-navy-900">Select Asset from Media Library</h2>
              <p className="text-xs text-navy-500">Pick an existing asset or upload from your computer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-navy-400 hover:text-navy-600 rounded-xl hover:bg-navy-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search, Filter, Upload */}
        <div className="p-4 border-b border-navy-100 bg-white flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-navy-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search images by name or tag..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-navy-50 border border-navy-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            />
          </div>

          {/* Tags */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {allTags.slice(0, 5).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedTag === tag
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-navy-100 text-navy-600 hover:bg-navy-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Upload Button */}
          <label className="flex items-center gap-1.5 px-3.5 py-2 bg-primary-50 hover:bg-primary-100 text-primary-600 border border-primary-200 rounded-xl text-xs font-semibold cursor-pointer transition-colors shrink-0">
            <Upload className="w-3.5 h-3.5" />
            <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp, image/svg+xml"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Media Grid */}
        <div className="flex-1 p-5 overflow-y-auto min-h-[300px]">
          {filteredMedia.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
              {filteredMedia.map((item) => {
                const isSelected = selectedUrl === item.url;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelect(item.url, item.alt);
                      onClose();
                    }}
                    className={`group relative rounded-2xl overflow-hidden border text-left transition-all aspect-video bg-navy-100 focus:outline-none ${
                      isSelected
                        ? 'border-primary-600 ring-4 ring-primary-500/30'
                        : 'border-navy-200 hover:border-navy-300 hover:shadow-md'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={item.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-end">
                      <p className="text-white text-xs font-medium truncate">{item.name}</p>
                      <p className="text-navy-300 text-[10px]">{item.size}</p>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-md">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-navy-400 py-12">
              <ImageIcon className="w-12 h-12 stroke-[1.5] mb-2" />
              <p className="text-sm font-medium text-navy-600">No assets found</p>
              <p className="text-xs text-navy-400">Try changing your search keywords or upload a new image.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
