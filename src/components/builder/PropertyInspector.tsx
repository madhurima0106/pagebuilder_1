'use client';

import React, { useState } from 'react';
import { BuilderComponent } from '@/types';
import {
  Sliders,
  Paintbrush,
  Code2,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Upload,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Sparkles,
  Info,
  X
} from 'lucide-react';
import MediaPickerModal from '../modals/MediaPickerModal';

interface PropertyInspectorProps {
  component: BuilderComponent | null;
  onUpdateComponent: (updates: Partial<BuilderComponent>) => void;
  onDeleteComponent: (id: string) => void;
  onDuplicateComponent: (id: string) => void;
  onDeselect: () => void;
}

export default function PropertyInspector({
  component,
  onUpdateComponent,
  onDeleteComponent,
  onDuplicateComponent,
  onDeselect
}: PropertyInspectorProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'advanced'>('content');
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaTargetField, setMediaTargetField] = useState<string>('imageUrl');

  if (!component) {
    return (
      <div className="w-80 bg-white border-l border-navy-200/80 flex flex-col h-full shrink-0 select-none p-6 text-center justify-center items-center shadow-soft">
        <div className="w-12 h-12 rounded-2xl bg-navy-100 text-navy-400 flex items-center justify-center mb-3">
          <Sliders className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-navy-800">No Component Selected</h3>
        <p className="text-xs text-navy-500 mt-1 max-w-[200px]">
          Click any component on the canvas or in the Layers list to customize its properties and design.
        </p>
      </div>
    );
  }

  const { type, content, style, advanced } = component;

  const handleContentChange = (field: string, value: any) => {
    onUpdateComponent({
      content: { ...content, [field]: value }
    });
  };

  const handleStyleChange = (field: string, value: any) => {
    onUpdateComponent({
      style: { ...style, [field]: value }
    });
  };

  const handleAdvancedChange = (field: string, value: any) => {
    onUpdateComponent({
      advanced: { ...advanced, [field]: value }
    });
  };

  return (
    <div className="w-80 bg-white border-l border-navy-200/80 flex flex-col h-full shrink-0 select-none shadow-soft">
      {/* Header */}
      <div className="p-3.5 border-b border-navy-100 flex items-center justify-between bg-navy-50/70">
        <div className="min-w-0 pr-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-primary-100 text-primary-700">
              {type}
            </span>
            <span className="text-xs font-bold text-navy-900 truncate block">
              {component.label || 'Settings'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onDuplicateComponent(component.id)}
            title="Duplicate"
            className="p-1.5 text-navy-400 hover:text-primary-600 rounded-lg transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDeleteComponent(component.id)}
            title="Delete"
            className="p-1.5 text-navy-400 hover:text-rose-600 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDeselect}
            title="Close"
            className="p-1.5 text-navy-400 hover:text-navy-700 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-3 pt-2.5 pb-1 border-b border-navy-100 bg-white">
        <div className="flex bg-navy-100 p-0.5 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('content')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
              activeTab === 'content'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-navy-600 hover:text-navy-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Content</span>
          </button>
          <button
            onClick={() => setActiveTab('style')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
              activeTab === 'style'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-navy-600 hover:text-navy-900'
            }`}
          >
            <Paintbrush className="w-3.5 h-3.5" />
            <span>Style</span>
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
              activeTab === 'advanced'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-navy-600 hover:text-navy-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Advanced</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'content' && (
          <div className="space-y-4 text-xs">
            {/* Component Name / Label */}
            <div>
              <label className="block text-[11px] font-bold text-navy-700 uppercase tracking-wider mb-1">
                Layer Name
              </label>
              <input
                type="text"
                value={component.label}
                onChange={(e) => onUpdateComponent({ label: e.target.value })}
                className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 text-navy-900 font-medium"
              />
            </div>

            {/* Heading specific */}
            {type === 'heading' && (
              <>
                <div>
                  <label className="block text-[11px] font-bold text-navy-700 uppercase tracking-wider mb-1">
                    Heading Tag Level
                  </label>
                  <select
                    value={content.headingLevel || 'h2'}
                    onChange={(e) => handleContentChange('headingLevel', e.target.value)}
                    className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-xl text-navy-900 font-medium"
                  >
                    <option value="h1">H1 - Page Main Title</option>
                    <option value="h2">H2 - Section Header</option>
                    <option value="h3">H3 - Subsection Header</option>
                    <option value="h4">H4 - Small Subtitle</option>
                    <option value="h5">H5 - Minor Header</option>
                    <option value="h6">H6 - Small Caption Tag</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-navy-700 uppercase tracking-wider mb-1">
                    Heading Text
                  </label>
                  <textarea
                    rows={3}
                    value={content.text || ''}
                    onChange={(e) => handleContentChange('text', e.target.value)}
                    className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-xl text-navy-900 font-medium resize-none"
                  />
                </div>
              </>
            )}

            {/* Paragraph Text specific */}
            {type === 'text' && (
              <div>
                <label className="block text-[11px] font-bold text-navy-700 uppercase tracking-wider mb-1">
                  Paragraph Copy
                </label>
                <textarea
                  rows={5}
                  value={content.text || ''}
                  onChange={(e) => handleContentChange('text', e.target.value)}
                  className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-xl text-navy-900 font-medium resize-none leading-relaxed"
                />
              </div>
            )}

            {/* Image / Banner / Gallery specific */}
            {(type === 'image' || type === 'banner' || type === 'imageText') && (
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-navy-700 uppercase tracking-wider">
                      Image Asset URL
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMediaTargetField('imageUrl');
                        setIsMediaPickerOpen(true);
                      }}
                      className="text-[11px] font-semibold text-primary-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Choose from Media</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={content.imageUrl || ''}
                    onChange={(e) => handleContentChange('imageUrl', e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-xl text-navy-900 font-mono text-[11px]"
                  />
                </div>

                {type === 'banner' && (
                  <>
                    <div>
                      <label className="block text-[11px] font-bold text-navy-700 uppercase tracking-wider mb-1">
                        Banner Headline
                      </label>
                      <input
                        type="text"
                        value={content.text || ''}
                        onChange={(e) => handleContentChange('text', e.target.value)}
                        className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-xl text-navy-900 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-navy-700 uppercase tracking-wider mb-1">
                        Banner Subtitle
                      </label>
                      <textarea
                        rows={3}
                        value={content.bannerSubtitle || ''}
                        onChange={(e) => handleContentChange('bannerSubtitle', e.target.value)}
                        className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-xl text-navy-900 font-medium resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-navy-700 uppercase tracking-wider mb-1">
                          CTA Button Text
                        </label>
                        <input
                          type="text"
                          value={content.bannerCtaText || ''}
                          onChange={(e) => handleContentChange('bannerCtaText', e.target.value)}
                          className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-xl text-navy-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-navy-700 uppercase tracking-wider mb-1">
                          CTA URL Link
                        </label>
                        <input
                          type="text"
                          value={content.bannerCtaUrl || ''}
                          onChange={(e) => handleContentChange('bannerCtaUrl', e.target.value)}
                          className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-xl text-navy-900"
                        />
                      </div>
                    </div>
                  </>
                )}

                {type === 'imageText' && (
                  <>
                    <div>
                      <label className="block text-[11px] font-bold text-navy-700 uppercase tracking-wider mb-1">
                        Feature Headline
                      </label>
                      <input
                        type="text"
                        value={content.text || ''}
                        onChange={(e) => handleContentChange('text', e.target.value)}
                        className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-xl text-navy-900 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-navy-700 uppercase tracking-wider mb-1">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={content.featureDescription || ''}
                        onChange={(e) => handleContentChange('featureDescription', e.target.value)}
                        className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-xl text-navy-900 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-navy-700 uppercase tracking-wider mb-1">
                        Image Alignment
                      </label>
                      <select
                        value={content.imagePosition || 'right'}
                        onChange={(e) => handleContentChange('imagePosition', e.target.value)}
                        className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-xl text-navy-900"
                      >
                        <option value="right">Image on Right / Text on Left</option>
                        <option value="left">Image on Left / Text on Right</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Button specific */}
            {type === 'button' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-navy-700 uppercase tracking-wider mb-1">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={content.buttonText || ''}
                    onChange={(e) => handleContentChange('buttonText', e.target.value)}
                    className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-xl text-navy-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-navy-700 uppercase tracking-wider mb-1">
                    Button Link Destination (URL or #anchor)
                  </label>
                  <input
                    type="text"
                    value={content.buttonUrl || ''}
                    onChange={(e) => handleContentChange('buttonUrl', e.target.value)}
                    placeholder="https://... or #contact"
                    className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-xl text-navy-900 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-navy-700 uppercase tracking-wider mb-1">
                    Button Style Variant
                  </label>
                  <select
                    value={content.buttonVariant || 'primary'}
                    onChange={(e) => handleContentChange('buttonVariant', e.target.value)}
                    className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-xl text-navy-900"
                  >
                    <option value="primary">Solid Blue (Primary)</option>
                    <option value="navy">Solid Dark Navy</option>
                    <option value="secondary">Slate Solid</option>
                    <option value="outline">Outlined Border</option>
                    <option value="ghost">Ghost Text Link</option>
                  </select>
                </div>
              </div>
            )}

            {/* Feature Card specific */}
            {type === 'featureCard' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-navy-700 uppercase tracking-wider mb-1">
                    Badge / Tag Text
                  </label>
                  <input
                    type="text"
                    value={content.badgeText || ''}
                    onChange={(e) => handleContentChange('badgeText', e.target.value)}
                    className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-xl text-navy-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-navy-700 uppercase tracking-wider mb-1">
                    Card Title
                  </label>
                  <input
                    type="text"
                    value={content.featureTitle || ''}
                    onChange={(e) => handleContentChange('featureTitle', e.target.value)}
                    className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-xl text-navy-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-navy-700 uppercase tracking-wider mb-1">
                    Card Description
                  </label>
                  <textarea
                    rows={3}
                    value={content.featureDescription || ''}
                    onChange={(e) => handleContentChange('featureDescription', e.target.value)}
                    className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-xl text-navy-900 resize-none"
                  />
                </div>
              </div>
            )}

            {/* Quote specific */}
            {type === 'quote' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-navy-700 uppercase tracking-wider mb-1">
                    Quote Body
                  </label>
                  <textarea
                    rows={3}
                    value={content.text || ''}
                    onChange={(e) => handleContentChange('text', e.target.value)}
                    className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-xl text-navy-900 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-navy-700 uppercase tracking-wider mb-1">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={content.quoteAuthor || ''}
                    onChange={(e) => handleContentChange('quoteAuthor', e.target.value)}
                    className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-xl text-navy-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-navy-700 uppercase tracking-wider mb-1">
                    Author Role / Company
                  </label>
                  <input
                    type="text"
                    value={content.quoteRole || ''}
                    onChange={(e) => handleContentChange('quoteRole', e.target.value)}
                    className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-xl text-navy-900"
                  />
                </div>
              </div>
            )}

            {/* Columns specific */}
            {type === 'columns' && (
              <div>
                <label className="block text-[11px] font-bold text-navy-700 uppercase tracking-wider mb-1">
                  Column Count
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[2, 3, 4].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleContentChange('columnsCount', c)}
                      className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                        (content.columnsCount || 2) === c
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-navy-200 hover:border-navy-300 text-navy-700'
                      }`}
                    >
                      {c} Columns
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Video specific */}
            {type === 'video' && (
              <div>
                <label className="block text-[11px] font-bold text-navy-700 uppercase tracking-wider mb-1">
                  Video Showcase Title
                </label>
                <input
                  type="text"
                  value={content.videoUrl || ''}
                  onChange={(e) => handleContentChange('videoUrl', e.target.value)}
                  className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-xl text-navy-900 font-medium"
                />
              </div>
            )}

            {/* Map specific */}
            {type === 'map' && (
              <div>
                <label className="block text-[11px] font-bold text-navy-700 uppercase tracking-wider mb-1">
                  Location Title / Office Name
                </label>
                <input
                  type="text"
                  value={content.mapLocation || ''}
                  onChange={(e) => handleContentChange('mapLocation', e.target.value)}
                  className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-xl text-navy-900 font-medium"
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'style' && (
          <div className="space-y-4 text-xs">
            {/* Text Alignment */}
            <div>
              <label className="block text-[11px] font-bold text-navy-700 uppercase tracking-wider mb-1.5">
                Alignment
              </label>
              <div className="grid grid-cols-4 gap-1 bg-navy-100 p-1 rounded-xl">
                {[
                  { align: 'left', icon: AlignLeft },
                  { align: 'center', icon: AlignCenter },
                  { align: 'right', icon: AlignRight },
                  { align: 'justify', icon: AlignJustify }
                ].map(({ align, icon: Icon }) => (
                  <button
                    key={align}
                    type="button"
                    onClick={() => handleStyleChange('textAlign', align)}
                    className={`py-1.5 flex items-center justify-center rounded-lg transition-all ${
                      (style.textAlign || 'left') === align
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-navy-500 hover:text-navy-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            {/* Text Color */}
            <div>
              <label className="block text-[11px] font-bold text-navy-700 uppercase tracking-wider mb-1">
                Text Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={style.textColor || '#0f172a'}
                  onChange={(e) => handleStyleChange('textColor', e.target.value)}
                  className="w-8 h-8 rounded-lg border border-navy-200 p-0.5 cursor-pointer"
                />
                <input
                  type="text"
                  value={style.textColor || '#0f172a'}
                  onChange={(e) => handleStyleChange('textColor', e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-navy-50 border border-navy-200 rounded-xl text-navy-800 font-mono text-xs"
                />
              </div>
            </div>

            {/* Background Color */}
            <div>
              <label className="block text-[11px] font-bold text-navy-700 uppercase tracking-wider mb-1">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={style.backgroundColor || '#ffffff'}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  className="w-8 h-8 rounded-lg border border-navy-200 p-0.5 cursor-pointer"
                />
                <input
                  type="text"
                  value={style.backgroundColor || '#ffffff'}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-navy-50 border border-navy-200 rounded-xl text-navy-800 font-mono text-xs"
                />
              </div>
            </div>

            {/* Padding Controls */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-navy-700 uppercase tracking-wider">
                Padding Spacing
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-navy-400">Vertical (Top/Bottom)</span>
                  <select
                    value={style.paddingTop || '0px'}
                    onChange={(e) => {
                      handleStyleChange('paddingTop', e.target.value);
                      handleStyleChange('paddingBottom', e.target.value);
                    }}
                    className="w-full px-2.5 py-1.5 bg-navy-50 border border-navy-200 rounded-xl text-navy-900 font-medium"
                  >
                    <option value="0px">None (0px)</option>
                    <option value="16px">Small (16px)</option>
                    <option value="24px">Medium (24px)</option>
                    <option value="32px">Large (32px)</option>
                    <option value="48px">Extra Large (48px)</option>
                    <option value="64px">Huge (64px)</option>
                  </select>
                </div>
                <div>
                  <span className="text-[10px] text-navy-400">Horizontal (Left/Right)</span>
                  <select
                    value={style.paddingLeft || '0px'}
                    onChange={(e) => {
                      handleStyleChange('paddingLeft', e.target.value);
                      handleStyleChange('paddingRight', e.target.value);
                    }}
                    className="w-full px-2.5 py-1.5 bg-navy-50 border border-navy-200 rounded-xl text-navy-900 font-medium"
                  >
                    <option value="0px">None (0px)</option>
                    <option value="16px">Small (16px)</option>
                    <option value="24px">Medium (24px)</option>
                    <option value="32px">Large (32px)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Border Radius & Shadow */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-navy-700 uppercase tracking-wider mb-1">
                  Corner Radius
                </label>
                <select
                  value={style.borderRadius || 'md'}
                  onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-navy-50 border border-navy-200 rounded-xl text-navy-900"
                >
                  <option value="none">Square (0)</option>
                  <option value="sm">Small (6px)</option>
                  <option value="md">Medium (12px)</option>
                  <option value="lg">Large (16px)</option>
                  <option value="xl">Pill (24px)</option>
                  <option value="full">Full Round</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-navy-700 uppercase tracking-wider mb-1">
                  Elevation Shadow
                </label>
                <select
                  value={style.shadow || 'none'}
                  onChange={(e) => handleStyleChange('shadow', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-navy-50 border border-navy-200 rounded-xl text-navy-900"
                >
                  <option value="none">None</option>
                  <option value="sm">Soft Light</option>
                  <option value="md">Medium Card</option>
                  <option value="lg">Deep Shadow</option>
                  <option value="xl">Floating Shadow</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-4 text-xs">
            {/* Custom CSS Class */}
            <div>
              <label className="block text-[11px] font-bold text-navy-700 uppercase tracking-wider mb-1">
                Custom CSS Classes
              </label>
              <input
                type="text"
                value={advanced?.customClass || ''}
                onChange={(e) => handleAdvancedChange('customClass', e.target.value)}
                placeholder="e.g. shadow-2xl hover:scale-105"
                className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-xl text-navy-900 font-mono text-[11px]"
              />
            </div>

            {/* Custom HTML Anchor ID */}
            <div>
              <label className="block text-[11px] font-bold text-navy-700 uppercase tracking-wider mb-1">
                HTML Anchor ID
              </label>
              <input
                type="text"
                value={advanced?.customId || ''}
                onChange={(e) => handleAdvancedChange('customId', e.target.value)}
                placeholder="e.g. executive-summary"
                className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-xl text-navy-900 font-mono text-[11px]"
              />
            </div>

            {/* Entrance Animation */}
            <div>
              <label className="block text-[11px] font-bold text-navy-700 uppercase tracking-wider mb-1">
                Entrance Animation
              </label>
              <select
                value={advanced?.animation || 'none'}
                onChange={(e) => handleAdvancedChange('animation', e.target.value)}
                className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-xl text-navy-900"
              >
                <option value="none">None</option>
                <option value="fade">Fade In</option>
                <option value="slide-up">Slide Up</option>
                <option value="zoom-in">Zoom In</option>
              </select>
            </div>

            <div className="p-3 bg-primary-50/70 rounded-2xl border border-primary-200/60 text-[11px] text-blue-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Info className="w-3.5 h-3.5 text-primary-600" />
                <span>Responsive Viewports</span>
              </div>
              <p className="text-primary-700 leading-relaxed">
                All components are automatically optimized to flex seamlessly between desktop, tablet, and mobile screens.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Media Picker Modal */}
      {isMediaPickerOpen && (
        <MediaPickerModal
          isOpen={isMediaPickerOpen}
          onClose={() => setIsMediaPickerOpen(false)}
          onSelect={(url, alt) => {
            handleContentChange('imageUrl', url);
            handleContentChange('imageAlt', alt);
          }}
          selectedUrl={content.imageUrl}
        />
      )}
    </div>
  );
}
