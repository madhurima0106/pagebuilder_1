'use client';

import React from 'react';
import { BuilderComponent, ClientPage, MenuItem } from '@/types';
import ComponentRenderer from './ComponentRenderer';
import {
  Monitor,
  Tablet,
  Smartphone,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Move,
  Layers
} from 'lucide-react';

interface LiveCanvasProps {
  page: ClientPage;
  activeMenuItem: MenuItem;
  components: BuilderComponent[];
  selectedComponentId: string | null;
  viewportMode: 'desktop' | 'tablet' | 'mobile';
  setViewportMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  zoomLevel: number;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  onSelectComponent: (id: string) => void;
  onDeleteComponent: (id: string) => void;
  onDuplicateComponent: (id: string) => void;
  onMoveComponent: (fromIdx: number, toIdx: number) => void;
  onOpenComponentLibrary: () => void;
}

export default function LiveCanvas({
  page,
  activeMenuItem,
  components,
  selectedComponentId,
  viewportMode,
  setViewportMode,
  zoomLevel,
  setZoomLevel,
  onSelectComponent,
  onDeleteComponent,
  onDuplicateComponent,
  onMoveComponent,
  onOpenComponentLibrary
}: LiveCanvasProps) {
  const getContainerWidthClass = () => {
    switch (viewportMode) {
      case 'tablet':
        return 'device-tablet';
      case 'mobile':
        return 'device-mobile';
      default:
        return 'device-desktop';
    }
  };

  return (
    <div className="flex-1 bg-navy-100/90 flex flex-col min-w-0 h-full overflow-hidden relative select-none">
      {/* Canvas Top Bar: Viewport controls & Zoom */}
      <div className="h-12 bg-white border-b border-navy-200/80 px-6 flex items-center justify-between z-20 shrink-0 shadow-xs">
        {/* Active Section Info */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-navy-900">Editing Section:</span>
          <span className="px-2.5 py-0.5 rounded-lg bg-primary-50 text-primary-700 text-xs font-bold border border-primary-200">
            {activeMenuItem.label}
          </span>
          <span className="text-[11px] text-navy-400">({components.length} components)</span>
        </div>

        {/* Viewport Switcher */}
        <div className="flex items-center bg-navy-100 p-0.5 rounded-xl border border-navy-200">
          <button
            type="button"
            onClick={() => setViewportMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewportMode === 'desktop'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-navy-500 hover:text-navy-800'
            }`}
            title="Desktop Full-Width"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setViewportMode('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewportMode === 'tablet'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-navy-500 hover:text-navy-800'
            }`}
            title="Tablet (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => setViewportMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewportMode === 'mobile'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-navy-500 hover:text-navy-800'
            }`}
            title="Mobile (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-navy-100 p-0.5 rounded-xl text-xs font-semibold text-navy-600">
            <button
              onClick={() => setZoomLevel((z) => Math.max(50, z - 25))}
              className="p-1 hover:text-navy-900 rounded"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(150, z + 25))}
              className="p-1 hover:text-navy-900 rounded"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-start">
        <div
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease-out'
          }}
          className={`${getContainerWidthClass()} bg-white min-h-[600px] shadow-2xl rounded-2xl border border-navy-200/80 overflow-hidden relative flex flex-col`}
        >
          {/* Simulated Client Portal Header inside the preview */}
          <div className="bg-navy-900 text-white px-6 py-3 border-b border-navy-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary-500 animate-pulse" />
              <span className="font-bold tracking-wider">{page.theme.logoText || page.clientName}</span>
              <span className="text-navy-500">|</span>
              <span className="text-navy-400 font-medium">{activeMenuItem.label}</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-navy-400">
              <span className="hidden sm:inline">🔒 Private Client Portal</span>
              <span className="px-2 py-0.5 rounded bg-primary-500/20 text-blue-300 font-bold text-[10px]">
                LIVE PREVIEW
              </span>
            </div>
          </div>

          {/* Component Content Canvas */}
          <div className="p-6 sm:p-10 flex-1 space-y-6 bg-navy-50/30">
            {components.length > 0 ? (
              components.map((component, idx) => {
                const isSelected = selectedComponentId === component.id;

                return (
                  <div
                    key={component.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectComponent(component.id);
                    }}
                    className={`relative rounded-2xl transition-all cursor-pointer group ${
                      isSelected
                        ? 'ring-2 ring-primary-600 ring-offset-4 ring-offset-slate-50 shadow-lg'
                        : 'hover:ring-1 hover:ring-primary-400/60'
                    }`}
                  >
                    {/* Component Action Toolbar for Selected Item */}
                    {isSelected && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute -top-10 left-2 z-40 bg-navy-900 text-white rounded-xl shadow-xl px-2 py-1 flex items-center gap-1 text-xs border border-navy-700 animate-fade-in"
                      >
                        <span className="text-[10px] uppercase font-bold text-primary-300 px-1 border-r border-navy-700 mr-1">
                          {component.type}
                        </span>

                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => onMoveComponent(idx, idx - 1)}
                          className="p-1 hover:bg-navy-800 disabled:opacity-30 rounded text-navy-300 hover:text-white"
                          title="Move Up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === components.length - 1}
                          onClick={() => onMoveComponent(idx, idx + 1)}
                          className="p-1 hover:bg-navy-800 disabled:opacity-30 rounded text-navy-300 hover:text-white"
                          title="Move Down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDuplicateComponent(component.id)}
                          className="p-1 hover:bg-navy-800 rounded text-navy-300 hover:text-white"
                          title="Duplicate Component"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteComponent(component.id)}
                          className="p-1 hover:bg-rose-900/80 rounded text-rose-300 hover:text-rose-200"
                          title="Delete Component"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Component Render Output */}
                    <ComponentRenderer
                      component={component}
                      isEditor={true}
                      onChildClick={onSelectComponent}
                      selectedComponentId={selectedComponentId}
                    />
                  </div>
                );
              })
            ) : (
              /* Empty State when tab has no components yet */
              <div className="py-20 border-2 border-dashed border-navy-300 rounded-3xl flex flex-col items-center justify-center text-center p-8 bg-white/70 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-navy-900">
                    &quot;{activeMenuItem.label}&quot; Tab is Empty
                  </h3>
                  <p className="text-xs text-navy-500 max-w-sm mt-1">
                    Select any component from the Component Library on the left to start assembling this section.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onOpenComponentLibrary}
                  className="mt-2 flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-md shadow-primary-600/20 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Component</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
