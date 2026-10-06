'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePageStore } from '@/lib/store';
import {
  ArrowLeft,
  Eye,
  CheckCircle,
  Save,
  RotateCcw,
  RotateCw,
  Link2,
  Globe,
  Sparkles,
  Sliders,
  ChevronRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import ComponentLibrary from '@/components/builder/ComponentLibrary';
import LiveCanvas from '@/components/builder/LiveCanvas';
import PropertyInspector from '@/components/builder/PropertyInspector';
import SidebarMenuManager from '@/components/builder/SidebarMenuManager';
import PrivateUrlModal from '@/components/modals/PrivateUrlModal';
import { BuilderComponent, ComponentType, MenuItem } from '@/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function VisualPageBuilderPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const {
    pages,
    updatePage,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    reorderMenuItems,
    setDefaultMenuItem,
    addComponent,
    updateComponent,
    deleteComponent,
    duplicateComponent,
    reorderComponent,
    showToast
  } = usePageStore();

  const page = pages.find((p) => p.id === resolvedParams.id);

  // Active Menu Tab state
  const [activeMenuId, setActiveMenuId] = useState<string>('');
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);

  // Undo / Redo History stack
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Initialize active menu item
  useEffect(() => {
    if (page && page.menuItems.length > 0 && !activeMenuId) {
      const defaultItem = page.menuItems.find((m) => m.isDefault) || page.menuItems[0];
      setActiveMenuId(defaultItem.id);
    }
  }, [page, activeMenuId]);

  if (!page) {
    return (
      <div className="min-h-screen bg-navy-900 text-white flex flex-col items-center justify-center p-6 space-y-4">
        <h2 className="text-xl font-bold">Client Page Not Found</h2>
        <p className="text-xs text-navy-400">The requested page ID does not exist or has been deleted.</p>
        <Link
          href="/pages"
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-xl"
        >
          Return to Client Pages
        </Link>
      </div>
    );
  }

  const activeMenuItem =
    page.menuItems.find((m) => m.id === activeMenuId) || page.menuItems[0] || null;

  const currentComponents = activeMenuItem ? activeMenuItem.components : [];
  const selectedComponent =
    currentComponents.find((c) => c.id === selectedComponentId) || null;

  // Component Creation factory
  const handleAddComponent = (type: ComponentType) => {
    if (!activeMenuItem) return;

    const newComp: BuilderComponent = {
      id: 'comp-' + Math.random().toString(36).substring(2, 8),
      type,
      label: type.charAt(0).toUpperCase() + type.slice(1),
      content: getDefaultContentForType(type),
      style: {
        borderRadius: 'xl',
        paddingTop: '16px',
        paddingBottom: '16px'
      },
      advanced: {
        animation: 'fade'
      }
    };

    addComponent(page.id, activeMenuItem.id, newComp);
    setSelectedComponentId(newComp.id);
    showToast(`Added ${newComp.label} component`, 'success');
  };

  const getDefaultContentForType = (type: ComponentType): any => {
    switch (type) {
      case 'heading':
        return { text: 'New Section Header', headingLevel: 'h2' };
      case 'text':
        return {
          text: 'Empowering enterprise agility with resilient, highly compliant distributed solutions tailored to your operational roadmap.'
        };
      case 'image':
        return {
          imageUrl:
            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
          imageAlt: 'Architecture facility'
        };
      case 'button':
        return {
          buttonText: 'Schedule Technical Review',
          buttonUrl: '#contact',
          buttonVariant: 'primary'
        };
      case 'divider':
        return { dividerStyle: 'solid' };
      case 'spacer':
        return { spacerHeight: '32px' };
      case 'banner':
        return {
          text: 'Accelerating Digital Transformation',
          bannerSubtitle: 'Tailored specifically for your strategic initiatives.',
          imageUrl:
            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
          bannerCtaText: 'Explore Proposal'
        };
      case 'imageText':
        return {
          text: 'Modular Cloud Infrastructure',
          featureDescription:
            'Engineered for maximum resilience and seamless interoperability across legacy environments.',
          imageUrl:
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
          imagePosition: 'right',
          buttonText: 'Learn More'
        };
      case 'featureCard':
        return {
          badgeText: 'Zero Trust Security',
          featureTitle: 'Enterprise Cryptography',
          featureDescription:
            'Multi-layer envelope encryption backed by dedicated HSM keys with automated key rotation.'
        };
      case 'gallery':
        return {
          galleryImages: [
            {
              url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
              alt: 'Skyscraper'
            },
            {
              url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
              alt: 'Office meeting'
            },
            {
              url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
              alt: 'Tech console'
            }
          ]
        };
      case 'quote':
        return {
          text: 'The strategic clarity and velocity achieved with this solution exceeded our most ambitious benchmarks.',
          quoteAuthor: 'Sarah Jenkins',
          quoteRole: 'VP of Technology'
        };
      case 'contactForm':
        return {
          formTitle: 'Confidential Client Inquiry',
          formDescription: 'Direct communication channel to the executive project delivery team.',
          formSubmitText: 'Transmit Message'
        };
      case 'accordion':
        return {
          accordionItems: [
            {
              title: 'What are the enterprise deployment timelines?',
              content: 'Standard integration takes under two weeks with dedicated DevOps guidance.'
            },
            {
              title: 'How is compliance verified?',
              content: 'Automated continuous audit reports are delivered directly to your security team.'
            }
          ]
        };
      case 'video':
        return { videoUrl: 'Interactive Product Demonstration Walkthrough' };
      case 'map':
        return { mapLocation: 'Global Solutions Center, Suite 500' };
      case 'columns':
        return { columnsCount: 2 };
      default:
        return {};
    }
  };

  const handleSaveDraft = () => {
    updatePage(page.id, { status: 'draft' });
    showToast('Page draft saved successfully', 'success');
  };

  const handlePublish = () => {
    updatePage(page.id, { status: 'published' });
    showToast(`Page for "${page.clientName}" is now LIVE!`, 'success');
  };

  return (
    <div className="flex flex-col h-screen bg-navy-100 overflow-hidden font-sans">
      {/* Top Header Navigation */}
      <header className="h-16 bg-navy-900 text-white px-6 flex items-center justify-between z-30 shrink-0 border-b border-navy-800">
        {/* Left: Back button & Page title editor */}
        <div className="flex items-center gap-4 min-w-0">
          <Link
            href="/pages"
            className="flex items-center gap-1.5 p-2 rounded-xl text-navy-300 hover:text-white hover:bg-navy-800 transition-colors text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>

          <div className="h-5 w-px bg-navy-800"></div>

          <div className="min-w-0 flex items-center gap-2">
            <input
              type="text"
              value={page.title}
              onChange={(e) => updatePage(page.id, { title: e.target.value })}
              className="bg-transparent text-sm sm:text-base font-bold text-white hover:bg-navy-800/80 focus:bg-navy-800 px-2 py-1 rounded-lg border border-transparent focus:border-navy-700 focus:outline-none transition-all truncate max-w-xs sm:max-w-md"
            />
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-navy-800 text-navy-300 border border-navy-700 shrink-0">
              Client: {page.clientName}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          {/* Status Badge */}
          <span
            className={`hidden md:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
              page.status === 'published'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                page.status === 'published' ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
            {page.status}
          </span>

          {/* Private URL Manager */}
          <button
            type="button"
            onClick={() => setIsUrlModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-navy-200 text-xs font-semibold border border-navy-700 transition-colors"
          >
            <Link2 className="w-3.5 h-3.5 text-primary-300" />
            <span className="hidden sm:inline">Private URL</span>
          </button>

          {/* Preview Button */}
          <Link
            href={`/p/${page.slug}?token=${page.privateToken}`}
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-navy-200 text-xs font-semibold border border-navy-700 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Client Preview</span>
          </Link>

          {/* Save Draft */}
          <button
            type="button"
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-navy-200 text-xs font-semibold border border-navy-700 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          {/* Publish Button */}
          <button
            type="button"
            onClick={handlePublish}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-primary-600 hover:bg-primary-500 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-primary-600/30 transition-all"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Publish</span>
          </button>
        </div>
      </header>

      {/* Sidebar Menu Builder Manager: Tab navigation & independent content switcher */}
      {activeMenuItem && (
        <SidebarMenuManager
          menuItems={page.menuItems}
          activeMenuItemId={activeMenuItem.id}
          onSelectMenuItem={(id) => {
            setActiveMenuId(id);
            setSelectedComponentId(null);
          }}
          onAddMenuItem={(label) => {
            const newMenu = addMenuItem(page.id, label);
            setActiveMenuId(newMenu.id);
            setSelectedComponentId(null);
          }}
          onRenameMenuItem={(id, label) => updateMenuItem(page.id, id, { label })}
          onDeleteMenuItem={(id) => deleteMenuItem(page.id, id)}
          onSetDefaultMenuItem={(id) => setDefaultMenuItem(page.id, id)}
          onReorderMenuItem={(from, to) => {
            const items = [...page.menuItems];
            const [removed] = items.splice(from, 1);
            items.splice(to, 0, removed);
            reorderMenuItems(page.id, items);
          }}
        />
      )}

      {/* Three Panel Studio Workspace */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Panel: Component Library & Layers */}
        <ComponentLibrary
          onAddComponent={handleAddComponent}
          activeComponents={currentComponents}
          selectedComponentId={selectedComponentId}
          onSelectComponent={(id) => setSelectedComponentId(id)}
          onDeleteComponent={(id) => {
            if (activeMenuItem) deleteComponent(page.id, activeMenuItem.id, id);
            if (selectedComponentId === id) setSelectedComponentId(null);
          }}
          onDuplicateComponent={(id) => {
            if (activeMenuItem) duplicateComponent(page.id, activeMenuItem.id, id);
          }}
          onMoveComponent={(from, to) => {
            if (activeMenuItem) reorderComponent(page.id, activeMenuItem.id, from, to);
          }}
        />

        {/* Center Panel: Live Preview Canvas */}
        {activeMenuItem && (
          <LiveCanvas
            page={page}
            activeMenuItem={activeMenuItem}
            components={currentComponents}
            selectedComponentId={selectedComponentId}
            viewportMode={viewportMode}
            setViewportMode={setViewportMode}
            zoomLevel={zoomLevel}
            setZoomLevel={setZoomLevel}
            onSelectComponent={(id) => setSelectedComponentId(id)}
            onDeleteComponent={(id) => {
              deleteComponent(page.id, activeMenuItem.id, id);
              if (selectedComponentId === id) setSelectedComponentId(null);
            }}
            onDuplicateComponent={(id) => duplicateComponent(page.id, activeMenuItem.id, id)}
            onMoveComponent={(from, to) => reorderComponent(page.id, activeMenuItem.id, from, to)}
            onOpenComponentLibrary={() => handleAddComponent('heading')}
          />
        )}

        {/* Right Panel: Property Settings Inspector */}
        <PropertyInspector
          component={selectedComponent}
          onUpdateComponent={(updates) => {
            if (activeMenuItem && selectedComponentId) {
              updateComponent(page.id, activeMenuItem.id, selectedComponentId, updates);
            }
          }}
          onDeleteComponent={(id) => {
            if (activeMenuItem) {
              deleteComponent(page.id, activeMenuItem.id, id);
              setSelectedComponentId(null);
            }
          }}
          onDuplicateComponent={(id) => {
            if (activeMenuItem) duplicateComponent(page.id, activeMenuItem.id, id);
          }}
          onDeselect={() => setSelectedComponentId(null)}
        />
      </div>

      {/* Private URL Modal */}
      {isUrlModalOpen && (
        <PrivateUrlModal
          page={page}
          isOpen={isUrlModalOpen}
          onClose={() => setIsUrlModalOpen(false)}
        />
      )}
    </div>
  );
}
