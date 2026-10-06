'use client';

import React, { useState } from 'react';
import {
  Type,
  Heading,
  Image as ImageIcon,
  Square,
  Minus,
  MoveVertical,
  Layout,
  Columns,
  Sparkles,
  ShieldCheck,
  Images,
  Flag,
  Quote,
  Mail,
  Video,
  MapPin,
  ListCollapse,
  Search,
  Layers,
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { BuilderComponent, ComponentType } from '@/types';

interface ComponentLibraryProps {
  onAddComponent: (type: ComponentType) => void;
  activeComponents: BuilderComponent[];
  selectedComponentId: string | null;
  onSelectComponent: (id: string) => void;
  onDeleteComponent: (id: string) => void;
  onDuplicateComponent: (id: string) => void;
  onMoveComponent: (fromIdx: number, toIdx: number) => void;
}

export default function ComponentLibrary({
  onAddComponent,
  activeComponents,
  selectedComponentId,
  onSelectComponent,
  onDeleteComponent,
  onDuplicateComponent,
  onMoveComponent
}: ComponentLibraryProps) {
  const [activeTab, setActiveTab] = useState<'components' | 'layers'>('components');
  const [search, setSearch] = useState('');

  const componentTemplates: {
    type: ComponentType;
    label: string;
    description: string;
    category: 'basic' | 'layout' | 'advanced';
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    // Basic
    {
      type: 'heading',
      label: 'Heading',
      description: 'H1 to H6 structured headers',
      category: 'basic',
      icon: Heading
    },
    {
      type: 'text',
      label: 'Text Paragraph',
      description: 'Body text and copy',
      category: 'basic',
      icon: Type
    },
    {
      type: 'image',
      label: 'Image',
      description: 'Responsive media asset',
      category: 'basic',
      icon: ImageIcon
    },
    {
      type: 'button',
      label: 'Action Button',
      description: 'Interactive CTA link',
      category: 'basic',
      icon: Square
    },
    {
      type: 'divider',
      label: 'Divider',
      description: 'Horizontal separator line',
      category: 'basic',
      icon: Minus
    },
    {
      type: 'spacer',
      label: 'Spacer',
      description: 'Vertical whitespace block',
      category: 'basic',
      icon: MoveVertical
    },

    // Layout
    {
      type: 'section',
      label: 'Section Block',
      description: 'Full-width wrapped section',
      category: 'layout',
      icon: Layout
    },
    {
      type: 'container',
      label: 'Container Box',
      description: 'Padded content wrapper',
      category: 'layout',
      icon: Square
    },
    {
      type: 'columns',
      label: 'Multi-Column Grid',
      description: '2, 3 or 4 column grid',
      category: 'layout',
      icon: Columns
    },

    // Advanced
    {
      type: 'banner',
      label: 'Hero Banner',
      description: 'High-impact title with background',
      category: 'advanced',
      icon: Flag
    },
    {
      type: 'imageText',
      label: 'Image & Text',
      description: 'Side-by-side feature layout',
      category: 'advanced',
      icon: Sparkles
    },
    {
      type: 'featureCard',
      label: 'Feature Card',
      description: 'Highlighted capability card',
      category: 'advanced',
      icon: ShieldCheck
    },
    {
      type: 'gallery',
      label: 'Media Gallery',
      description: 'Multi-image grid with zoom',
      category: 'advanced',
      icon: Images
    },
    {
      type: 'quote',
      label: 'Quote / Testimonial',
      description: 'Executive endorsement card',
      category: 'advanced',
      icon: Quote
    },
    {
      type: 'contactForm',
      label: 'Contact Form',
      description: 'Interactive lead message form',
      category: 'advanced',
      icon: Mail
    },
    {
      type: 'video',
      label: 'Video Embed',
      description: 'Responsive video showcase',
      category: 'advanced',
      icon: Video
    },
    {
      type: 'map',
      label: 'Location Map',
      description: 'Interactive office / site map',
      category: 'advanced',
      icon: MapPin
    },
    {
      type: 'accordion',
      label: 'Accordion / FAQ',
      description: 'Collapsible QA sections',
      category: 'advanced',
      icon: ListCollapse
    }
  ];

  const filteredTemplates = componentTemplates.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  const basicItems = filteredTemplates.filter((i) => i.category === 'basic');
  const layoutItems = filteredTemplates.filter((i) => i.category === 'layout');
  const advancedItems = filteredTemplates.filter((i) => i.category === 'advanced');

  return (
    <div className="w-80 bg-white border-r border-navy-200/80 flex flex-col h-full shrink-0 select-none shadow-soft">
      {/* Tabs Header */}
      <div className="p-3 border-b border-navy-100 flex items-center bg-navy-50/70">
        <div className="flex w-full bg-navy-200/70 p-0.5 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('components')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'components'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-navy-600 hover:text-navy-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Components</span>
          </button>
          <button
            onClick={() => setActiveTab('layers')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'layers'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-navy-600 hover:text-navy-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Layers ({activeComponents.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'components' ? (
        <>
          {/* Search Box */}
          <div className="p-3 border-b border-navy-100">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-navy-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search components..."
                className="w-full text-xs pl-8 pr-3 py-2 bg-navy-50 border border-navy-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 text-navy-800"
              />
            </div>
          </div>

          {/* Component List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-5">
            {/* Basic Components */}
            {basicItems.length > 0 && (
              <div className="space-y-1.5">
                <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-navy-400">
                  Basic Elements
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {basicItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => onAddComponent(item.type)}
                        className="p-2.5 rounded-xl border border-navy-200/80 bg-white hover:border-primary-500 hover:bg-primary-50/40 text-left transition-all group flex flex-col items-start gap-2 shadow-xs"
                      >
                        <div className="w-7 h-7 rounded-lg bg-navy-100 group-hover:bg-primary-600 group-hover:text-white text-navy-600 flex items-center justify-center transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-navy-900 group-hover:text-primary-600">
                            {item.label}
                          </p>
                          <p className="text-[10px] text-navy-400 line-clamp-1 leading-tight mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Layout Components */}
            {layoutItems.length > 0 && (
              <div className="space-y-1.5">
                <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-navy-400">
                  Layout & Columns
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {layoutItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => onAddComponent(item.type)}
                        className="p-2.5 rounded-xl border border-navy-200/80 bg-white hover:border-primary-500 hover:bg-primary-50/40 text-left transition-all group flex flex-col items-start gap-2 shadow-xs"
                      >
                        <div className="w-7 h-7 rounded-lg bg-navy-100 group-hover:bg-primary-600 group-hover:text-white text-navy-600 flex items-center justify-center transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-navy-900 group-hover:text-primary-600">
                            {item.label}
                          </p>
                          <p className="text-[10px] text-navy-400 line-clamp-1 leading-tight mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Advanced Components */}
            {advancedItems.length > 0 && (
              <div className="space-y-1.5">
                <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-navy-400">
                  Advanced Blocks
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {advancedItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => onAddComponent(item.type)}
                        className="p-2.5 rounded-xl border border-navy-200/80 bg-white hover:border-primary-500 hover:bg-primary-50/40 text-left transition-all group flex flex-col items-start gap-2 shadow-xs"
                      >
                        <div className="w-7 h-7 rounded-lg bg-navy-100 group-hover:bg-primary-600 group-hover:text-white text-navy-600 flex items-center justify-center transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-navy-900 group-hover:text-primary-600">
                            {item.label}
                          </p>
                          <p className="text-[10px] text-navy-400 line-clamp-1 leading-tight mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {filteredTemplates.length === 0 && (
              <div className="p-6 text-center text-xs text-navy-400">
                No matching components found for &quot;{search}&quot;
              </div>
            )}
          </div>
        </>
      ) : (
        /* Layers / Component Tree Outline */
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-navy-400">
            Current Section Layers ({activeComponents.length})
          </div>

          {activeComponents.length > 0 ? (
            activeComponents.map((comp, idx) => {
              const isSelected = selectedComponentId === comp.id;
              return (
                <div
                  key={comp.id}
                  onClick={() => onSelectComponent(comp.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-primary-50 border-primary-500 text-blue-900 shadow-sm'
                      : 'bg-white border-navy-200 hover:border-navy-300 text-navy-700'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-[10px] font-mono text-navy-400 w-4">{idx + 1}.</span>
                    <span className="text-xs font-semibold truncate">{comp.label || comp.type}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => onMoveComponent(idx, idx - 1)}
                      className="p-1 text-navy-400 hover:text-navy-700 disabled:opacity-30 rounded"
                      title="Move Up"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === activeComponents.length - 1}
                      onClick={() => onMoveComponent(idx, idx + 1)}
                      className="p-1 text-navy-400 hover:text-navy-700 disabled:opacity-30 rounded"
                      title="Move Down"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDuplicateComponent(comp.id)}
                      className="p-1 text-navy-400 hover:text-primary-600 rounded"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteComponent(comp.id)}
                      className="p-1 text-navy-400 hover:text-rose-600 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-navy-400">
              No components added to this section yet. Click a component on the left to add it!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
