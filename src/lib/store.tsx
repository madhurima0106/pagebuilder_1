'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ClientPage, MenuItem, BuilderComponent, MediaItem, NotificationItem } from '@/types';
import { INITIAL_CLIENT_PAGES, INITIAL_MEDIA_ITEMS, INITIAL_NOTIFICATIONS } from './mock-data';

interface PageStoreContextType {
  pages: ClientPage[];
  mediaItems: MediaItem[];
  notifications: NotificationItem[];
  isLoading: boolean;
  getPage: (idOrSlug: string) => ClientPage | undefined;
  createPage: (page: Partial<ClientPage>) => ClientPage;
  updatePage: (id: string, updates: Partial<ClientPage>) => void;
  deletePage: (id: string) => void;
  duplicatePage: (id: string) => ClientPage;
  // Menu Item operations
  addMenuItem: (pageId: string, label: string) => MenuItem;
  updateMenuItem: (pageId: string, menuItemId: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (pageId: string, menuItemId: string) => void;
  reorderMenuItems: (pageId: string, newOrder: MenuItem[]) => void;
  setDefaultMenuItem: (pageId: string, menuItemId: string) => void;
  // Component operations for a specific menu item
  addComponent: (pageId: string, menuItemId: string, component: BuilderComponent, index?: number) => void;
  updateComponent: (pageId: string, menuItemId: string, componentId: string, updates: Partial<BuilderComponent>) => void;
  deleteComponent: (pageId: string, menuItemId: string, componentId: string) => void;
  duplicateComponent: (pageId: string, menuItemId: string, componentId: string) => void;
  reorderComponent: (pageId: string, menuItemId: string, sourceIndex: number, destinationIndex: number) => void;
  // Private URL management
  generatePrivateUrl: (pageId: string) => { token: string; url: string };
  resetPrivateUrl: (pageId: string) => { token: string; url: string };
  revokePrivateUrl: (pageId: string) => void;
  reactivatePrivateUrl: (pageId: string) => void;
  // Media library operations
  addMediaItem: (item: Omit<MediaItem, 'id' | 'uploadedAt'>) => MediaItem;
  deleteMediaItem: (id: string) => void;
  // Toast notifications
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'error' | 'warning') => void;
  removeToast: (id: string) => void;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error' | 'warning';
}

const PageStoreContext = createContext<PageStoreContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PAGES = 'client_page_builder_pages_v1';
const LOCAL_STORAGE_KEY_MEDIA = 'client_page_builder_media_v1';

export function PageStoreProvider({ children }: { children: React.ReactNode }) {
  const [pages, setPages] = useState<ClientPage[]>(INITIAL_CLIENT_PAGES);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(INITIAL_MEDIA_ITEMS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from LocalStorage safely on client
  useEffect(() => {
    try {
      const savedPages = localStorage.getItem(LOCAL_STORAGE_KEY_PAGES);
      const savedMedia = localStorage.getItem(LOCAL_STORAGE_KEY_MEDIA);
      if (savedPages) {
        const parsed = JSON.parse(savedPages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPages(parsed);
        }
      }
      if (savedMedia) {
        const parsedMedia = JSON.parse(savedMedia);
        if (Array.isArray(parsedMedia) && parsedMedia.length > 0) {
          setMediaItems(parsedMedia);
        }
      }
    } catch (e) {
      console.warn('Failed to load storage:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to LocalStorage whenever pages change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY_PAGES, JSON.stringify(pages));
      } catch (e) {
        console.warn('Failed to save pages to storage:', e);
      }
    }
  }, [pages, isLoading]);

  // Save to LocalStorage whenever mediaItems change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY_MEDIA, JSON.stringify(mediaItems));
      } catch (e) {
        console.warn('Failed to save media to storage:', e);
      }
    }
  }, [mediaItems, isLoading]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' | 'warning' = 'success') => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getPage = (idOrSlug: string) => {
    return pages.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
  };

  const createPage = (pageData: Partial<ClientPage>): ClientPage => {
    const randomSlug = (pageData.clientName || 'new-client')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    const newId = 'page-' + Math.random().toString(36).substring(2, 9);
    const token = 'priv_' + Math.random().toString(36).substring(2, 12);
    
    const defaultMenu: MenuItem = {
      id: 'menu-' + Math.random().toString(36).substring(2, 7),
      label: 'Overview',
      slug: 'overview',
      icon: 'LayoutDashboard',
      isDefault: true,
      order: 1,
      components: [
        {
          id: 'comp-' + Math.random().toString(36).substring(2, 8),
          type: 'banner',
          label: 'Hero Banner',
          content: {
            text: pageData.title || 'Client Briefing & Executive Portal',
            bannerSubtitle: `Confidential proposal prepared for ${pageData.clientName || 'Client'}.`,
            bannerCtaText: 'Get Started'
          },
          style: {
            paddingTop: '48px',
            paddingBottom: '48px',
            borderRadius: 'xl'
          }
        }
      ]
    };

    const newPage: ClientPage = {
      id: newId,
      title: pageData.title || 'Confidential Client Proposal',
      clientName: pageData.clientName || 'Enterprise Partner',
      slug: randomSlug,
      status: pageData.status || 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      privateToken: token,
      isUrlActive: true,
      thumbnailUrl: pageData.thumbnailUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
      theme: {
        primaryColor: '#2563eb',
        sidebarBg: '#0f172a',
        sidebarText: '#ffffff',
        fontFamily: 'Inter',
        logoText: (pageData.clientName || 'PORTAL').toUpperCase(),
        borderRadius: '12px',
        ...pageData.theme
      },
      menuItems: pageData.menuItems && pageData.menuItems.length > 0 ? pageData.menuItems : [defaultMenu],
      activeMenuItemId: defaultMenu.id
    };

    setPages((prev) => [newPage, ...prev]);
    showToast(`Page for "${newPage.clientName}" created successfully!`, 'success');
    return newPage;
  };

  const updatePage = (id: string, updates: Partial<ClientPage>) => {
    setPages((prev) =>
      prev.map((page) => {
        if (page.id === id) {
          return {
            ...page,
            ...updates,
            lastUpdated: new Date().toISOString().split('T')[0]
          };
        }
        return page;
      })
    );
  };

  const deletePage = (id: string) => {
    const page = pages.find((p) => p.id === id);
    setPages((prev) => prev.filter((p) => p.id !== id));
    showToast(`Page "${page?.title || 'Page'}" deleted.`, 'info');
  };

  const duplicatePage = (id: string): ClientPage => {
    const original = pages.find((p) => p.id === id);
    if (!original) throw new Error('Page not found');

    const newId = 'page-' + Math.random().toString(36).substring(2, 9);
    const token = 'priv_' + Math.random().toString(36).substring(2, 12);
    const duplicated: ClientPage = {
      ...JSON.parse(JSON.stringify(original)),
      id: newId,
      title: `${original.title} (Copy)`,
      slug: `${original.slug}-copy-${Math.random().toString(36).substring(2, 5)}`,
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      privateToken: token,
      isUrlActive: true
    };

    setPages((prev) => [duplicated, ...prev]);
    showToast(`Duplicated "${original.title}" as draft.`, 'success');
    return duplicated;
  };

  // Menu item management
  const addMenuItem = (pageId: string, label: string): MenuItem => {
    const page = pages.find((p) => p.id === pageId);
    if (!page) throw new Error('Page not found');

    const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newMenu: MenuItem = {
      id: 'menu-' + Math.random().toString(36).substring(2, 8),
      label: label.trim() || 'New Section',
      slug: slug || 'section',
      icon: 'FileText',
      isDefault: false,
      order: page.menuItems.length + 1,
      components: [
        {
          id: 'comp-' + Math.random().toString(36).substring(2, 8),
          type: 'heading',
          label: `${label} Section Header`,
          content: {
            text: `${label}`,
            headingLevel: 'h2'
          },
          style: {
            fontSize: '3xl',
            fontWeight: 'bold',
            textColor: '#0f172a',
            marginBottom: '16px'
          }
        },
        {
          id: 'comp-' + Math.random().toString(36).substring(2, 8),
          type: 'text',
          label: 'Section Intro Text',
          content: {
            text: `This is the dedicated content for the ${label} section. Add components using the library on the left.`
          },
          style: {
            fontSize: 'base',
            textColor: '#475569',
            marginBottom: '24px'
          }
        }
      ]
    };

    setPages((prev) =>
      prev.map((p) => {
        if (p.id === pageId) {
          return {
            ...p,
            menuItems: [...p.menuItems, newMenu],
            lastUpdated: new Date().toISOString().split('T')[0]
          };
        }
        return p;
      })
    );

    showToast(`Added menu section "${label}"`, 'success');
    return newMenu;
  };

  const updateMenuItem = (pageId: string, menuItemId: string, updates: Partial<MenuItem>) => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.id === pageId) {
          return {
            ...p,
            menuItems: p.menuItems.map((m) => (m.id === menuItemId ? { ...m, ...updates } : m)),
            lastUpdated: new Date().toISOString().split('T')[0]
          };
        }
        return p;
      })
    );
  };

  const deleteMenuItem = (pageId: string, menuItemId: string) => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.id === pageId) {
          if (p.menuItems.length <= 1) {
            showToast('Cannot delete the only menu item', 'error');
            return p;
          }
          const filtered = p.menuItems.filter((m) => m.id !== menuItemId);
          const newActive = p.activeMenuItemId === menuItemId ? filtered[0].id : p.activeMenuItemId;
          return {
            ...p,
            menuItems: filtered,
            activeMenuItemId: newActive,
            lastUpdated: new Date().toISOString().split('T')[0]
          };
        }
        return p;
      })
    );
    showToast('Menu item removed', 'info');
  };

  const reorderMenuItems = (pageId: string, newOrder: MenuItem[]) => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.id === pageId) {
          return {
            ...p,
            menuItems: newOrder.map((item, idx) => ({ ...item, order: idx + 1 })),
            lastUpdated: new Date().toISOString().split('T')[0]
          };
        }
        return p;
      })
    );
  };

  const setDefaultMenuItem = (pageId: string, menuItemId: string) => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.id === pageId) {
          return {
            ...p,
            menuItems: p.menuItems.map((m) => ({
              ...m,
              isDefault: m.id === menuItemId
            })),
            lastUpdated: new Date().toISOString().split('T')[0]
          };
        }
        return p;
      })
    );
    showToast('Default menu item updated', 'success');
  };

  // Component manipulations inside a specific menu item
  const addComponent = (pageId: string, menuItemId: string, component: BuilderComponent, index?: number) => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.id === pageId) {
          return {
            ...p,
            menuItems: p.menuItems.map((m) => {
              if (m.id === menuItemId) {
                const updatedComponents = [...m.components];
                if (index !== undefined && index >= 0) {
                  updatedComponents.splice(index, 0, component);
                } else {
                  updatedComponents.push(component);
                }
                return { ...m, components: updatedComponents };
              }
              return m;
            }),
            lastUpdated: new Date().toISOString().split('T')[0]
          };
        }
        return p;
      })
    );
  };

  const updateComponent = (
    pageId: string,
    menuItemId: string,
    componentId: string,
    updates: Partial<BuilderComponent>
  ) => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.id === pageId) {
          return {
            ...p,
            menuItems: p.menuItems.map((m) => {
              if (m.id === menuItemId) {
                return {
                  ...m,
                  components: m.components.map((c) => {
                    if (c.id === componentId) {
                      return {
                        ...c,
                        ...updates,
                        content: updates.content ? { ...c.content, ...updates.content } : c.content,
                        style: updates.style ? { ...c.style, ...updates.style } : c.style,
                        advanced: updates.advanced ? { ...c.advanced, ...updates.advanced } : c.advanced
                      };
                    }
                    return c;
                  })
                };
              }
              return m;
            }),
            lastUpdated: new Date().toISOString().split('T')[0]
          };
        }
        return p;
      })
    );
  };

  const deleteComponent = (pageId: string, menuItemId: string, componentId: string) => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.id === pageId) {
          return {
            ...p,
            menuItems: p.menuItems.map((m) => {
              if (m.id === menuItemId) {
                return {
                  ...m,
                  components: m.components.filter((c) => c.id !== componentId)
                };
              }
              return m;
            }),
            lastUpdated: new Date().toISOString().split('T')[0]
          };
        }
        return p;
      })
    );
    showToast('Component removed', 'info');
  };

  const duplicateComponent = (pageId: string, menuItemId: string, componentId: string) => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.id === pageId) {
          return {
            ...p,
            menuItems: p.menuItems.map((m) => {
              if (m.id === menuItemId) {
                const targetIdx = m.components.findIndex((c) => c.id === componentId);
                if (targetIdx === -1) return m;
                const orig = m.components[targetIdx];
                const dup: BuilderComponent = {
                  ...JSON.parse(JSON.stringify(orig)),
                  id: 'comp-' + Math.random().toString(36).substring(2, 8),
                  label: `${orig.label} (Copy)`
                };
                const updated = [...m.components];
                updated.splice(targetIdx + 1, 0, dup);
                return { ...m, components: updated };
              }
              return m;
            }),
            lastUpdated: new Date().toISOString().split('T')[0]
          };
        }
        return p;
      })
    );
    showToast('Component duplicated', 'success');
  };

  const reorderComponent = (
    pageId: string,
    menuItemId: string,
    sourceIndex: number,
    destinationIndex: number
  ) => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.id === pageId) {
          return {
            ...p,
            menuItems: p.menuItems.map((m) => {
              if (m.id === menuItemId) {
                const components = [...m.components];
                const [removed] = components.splice(sourceIndex, 1);
                components.splice(destinationIndex, 0, removed);
                return { ...m, components };
              }
              return m;
            }),
            lastUpdated: new Date().toISOString().split('T')[0]
          };
        }
        return p;
      })
    );
  };

  // Private URL operations
  const generatePrivateUrl = (pageId: string) => {
    const token = 'priv_' + Math.random().toString(36).substring(2, 12);
    const page = pages.find((p) => p.id === pageId);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${origin}/p/${page?.slug || pageId}?token=${token}`;

    setPages((prev) =>
      prev.map((p) => (p.id === pageId ? { ...p, privateToken: token, isUrlActive: true } : p))
    );
    showToast('Private URL generated', 'success');
    return { token, url };
  };

  const resetPrivateUrl = (pageId: string) => {
    const newToken = 'priv_' + Math.random().toString(36).substring(2, 12);
    const page = pages.find((p) => p.id === pageId);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${origin}/p/${page?.slug || pageId}?token=${newToken}`;

    setPages((prev) =>
      prev.map((p) => (p.id === pageId ? { ...p, privateToken: newToken, isUrlActive: true } : p))
    );
    showToast('Private URL has been reset with a fresh token', 'info');
    return { token: newToken, url };
  };

  const revokePrivateUrl = (pageId: string) => {
    setPages((prev) => prev.map((p) => (p.id === pageId ? { ...p, isUrlActive: false } : p)));
    showToast('Private URL access revoked. External visitors can no longer view this page.', 'warning');
  };

  const reactivatePrivateUrl = (pageId: string) => {
    setPages((prev) => prev.map((p) => (p.id === pageId ? { ...p, isUrlActive: true } : p)));
    showToast('Private URL access re-enabled', 'success');
  };

  // Media Library
  const addMediaItem = (item: Omit<MediaItem, 'id' | 'uploadedAt'>): MediaItem => {
    const newItem: MediaItem = {
      ...item,
      id: 'media-' + Math.random().toString(36).substring(2, 8),
      uploadedAt: new Date().toISOString().split('T')[0]
    };
    setMediaItems((prev) => [newItem, ...prev]);
    showToast(`Uploaded "${newItem.name}" to Media Library`, 'success');
    return newItem;
  };

  const deleteMediaItem = (id: string) => {
    setMediaItems((prev) => prev.filter((m) => m.id !== id));
    showToast('Media item deleted', 'info');
  };

  return (
    <PageStoreContext.Provider
      value={{
        pages,
        mediaItems,
        notifications,
        isLoading,
        getPage,
        createPage,
        updatePage,
        deletePage,
        duplicatePage,
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
        generatePrivateUrl,
        resetPrivateUrl,
        revokePrivateUrl,
        reactivatePrivateUrl,
        addMediaItem,
        deleteMediaItem,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </PageStoreContext.Provider>
  );
}

export function usePageStore() {
  const context = useContext(PageStoreContext);
  if (!context) {
    throw new Error('usePageStore must be used within a PageStoreProvider');
  }
  return context;
}
