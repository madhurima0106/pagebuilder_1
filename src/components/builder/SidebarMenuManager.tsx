'use client';

import React, { useState } from 'react';
import { MenuItem } from '@/types';
import {
  Plus,
  Edit2,
  Trash2,
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Layers,
  Sparkles,
  FileText
} from 'lucide-react';

interface SidebarMenuManagerProps {
  menuItems: MenuItem[];
  activeMenuItemId: string;
  onSelectMenuItem: (id: string) => void;
  onAddMenuItem: (label: string) => void;
  onRenameMenuItem: (id: string, newLabel: string) => void;
  onDeleteMenuItem: (id: string) => void;
  onSetDefaultMenuItem: (id: string) => void;
  onReorderMenuItem: (sourceIndex: number, destinationIndex: number) => void;
}

export default function SidebarMenuManager({
  menuItems,
  activeMenuItemId,
  onSelectMenuItem,
  onAddMenuItem,
  onRenameMenuItem,
  onDeleteMenuItem,
  onSetDefaultMenuItem,
  onReorderMenuItem
}: SidebarMenuManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newMenuLabel, setNewMenuLabel] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState('');

  const handleStartAdd = () => {
    setIsAdding(true);
    setNewMenuLabel('');
  };

  const handleConfirmAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMenuLabel.trim()) {
      onAddMenuItem(newMenuLabel.trim());
      setNewMenuLabel('');
      setIsAdding(false);
    }
  };

  const handleStartRename = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(item.id);
    setEditingLabel(item.label);
  };

  const handleConfirmRename = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    if (editingLabel.trim()) {
      onRenameMenuItem(id, editingLabel.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="bg-navy-900 text-white px-4 py-2 border-b border-navy-800 flex items-center justify-between gap-4 select-none shrink-0 overflow-x-auto">
      {/* Label and Info */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1.5 text-xs font-bold text-navy-300 uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5 text-primary-300" />
          <span>Sidebar Tabs:</span>
        </div>
        <span className="text-[11px] text-navy-400 hidden sm:inline">
          (Each tab maintains independent layout & content)
        </span>
      </div>

      {/* Menu Items Tab Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
        {menuItems.map((item, idx) => {
          const isActive = item.id === activeMenuItemId;
          const isEditing = editingId === item.id;

          if (isEditing) {
            return (
              <form
                key={item.id}
                onSubmit={(e) => handleConfirmRename(item.id, e)}
                className="flex items-center gap-1 bg-navy-800 p-1 rounded-xl border border-primary-500 shrink-0"
              >
                <input
                  type="text"
                  autoFocus
                  value={editingLabel}
                  onChange={(e) => setEditingLabel(e.target.value)}
                  className="bg-navy-950 text-white text-xs px-2 py-1 rounded-lg border border-navy-700 focus:outline-none w-28"
                />
                <button
                  type="submit"
                  className="p-1 text-emerald-400 hover:text-emerald-300 rounded"
                  title="Save Name"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="p-1 text-navy-400 hover:text-navy-200 rounded"
                  title="Cancel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            );
          }

          return (
            <div
              key={item.id}
              onClick={() => onSelectMenuItem(item.id)}
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all shrink-0 border ${
                isActive
                  ? 'bg-primary-600 text-white border-primary-400 shadow-md shadow-primary-600/30'
                  : 'bg-navy-800/80 text-navy-300 border-navy-700/60 hover:bg-navy-800 hover:text-white'
              }`}
            >
              {/* Default star indicator */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSetDefaultMenuItem(item.id);
                }}
                title={item.isDefault ? 'Default landing tab' : 'Set as default landing tab'}
                className={`transition-colors ${
                  item.isDefault
                    ? 'text-amber-300'
                    : 'text-navy-500 opacity-0 group-hover:opacity-100 hover:text-amber-300'
                }`}
              >
                <Star className={`w-3 h-3 ${item.isDefault ? 'fill-amber-300' : ''}`} />
              </button>

              <span>{item.label}</span>

              {/* Component count badge */}
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-navy-900 text-navy-400'
                }`}
              >
                {item.components.length}
              </span>

              {/* Quick actions for menu item */}
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Reorder buttons */}
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReorderMenuItem(idx, idx - 1);
                    }}
                    title="Move Left"
                    className="p-0.5 text-navy-400 hover:text-white rounded"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                )}
                {idx < menuItems.length - 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReorderMenuItem(idx, idx + 1);
                    }}
                    title="Move Right"
                    className="p-0.5 text-navy-400 hover:text-white rounded"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}

                {/* Rename */}
                <button
                  type="button"
                  onClick={(e) => handleStartRename(item, e)}
                  title="Rename Tab"
                  className="p-0.5 text-navy-400 hover:text-white rounded"
                >
                  <Edit2 className="w-3 h-3" />
                </button>

                {/* Delete (if > 1 menu items) */}
                {menuItems.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteMenuItem(item.id);
                    }}
                    title="Delete Tab"
                    className="p-0.5 text-navy-400 hover:text-rose-400 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Add New Tab Form / Trigger */}
        {isAdding ? (
          <form
            onSubmit={handleConfirmAdd}
            className="flex items-center gap-1 bg-navy-800 p-1 rounded-xl border border-primary-500 shrink-0"
          >
            <input
              type="text"
              autoFocus
              placeholder="e.g. Pricing, Team"
              value={newMenuLabel}
              onChange={(e) => setNewMenuLabel(e.target.value)}
              className="bg-navy-950 text-white text-xs px-2.5 py-1 rounded-lg border border-navy-700 focus:outline-none w-32 placeholder-navy-500"
            />
            <button
              type="submit"
              className="p-1 text-emerald-400 hover:text-emerald-300 rounded"
              title="Add Tab"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="p-1 text-navy-400 hover:text-navy-200 rounded"
              title="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={handleStartAdd}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-navy-800/60 hover:bg-navy-800 text-primary-300 hover:text-blue-300 border border-dashed border-primary-500/40 transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Tab</span>
          </button>
        )}
      </div>
    </div>
  );
}
