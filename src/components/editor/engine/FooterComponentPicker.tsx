// ============================================================
// FOOTER COMPONENT PICKER
// Reusable component picker modal for inserting Groups and
// Components/Blocks into the recursive footer tree.
// ============================================================

import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Search,
  LayoutGrid,
  Heading,
  Type,
  Image,
  Gem,
  Sparkles,
  Menu,
  Share2,
  SquareCheck,
  Mail,
  Minus,
  MoveVertical,
  CreditCard,
  Copyright,
  Layers,
  PhoneCall,
  ShieldCheck,
  Smartphone,
  Globe,
  Code,
  MousePointerClick,
  ShoppingBag,
  Plus,
  Smile,
  List,
  MapPin,
} from 'lucide-react';
import { useEditorContextStore } from '../../../store/editorContextStore';
import {
  FOOTER_COMPONENT_DEFS,
  createNodeFromDef,
  findNodeById,
} from './footerTreeEngine';
import type { FooterComponentDefinition, FooterTreeNode } from './footerTreeTypes';
import { createDefaultGroupLayout } from './footerTreeTypes';

const ICON_MAP: Record<string, React.FC<{ size?: number; color?: string; className?: string }>> = {
  LayoutGrid,
  Heading,
  Type,
  Image,
  Gem,
  Sparkles,
  Smile,
  Menu,
  List,
  MapPin,
  Share2,
  SquareCheck,
  Mail,
  Minus,
  MoveVertical,
  Space: MoveVertical,
  CreditCard,
  Copyright,
  Layers,
  PhoneCall,
  ShieldCheck,
  Smartphone,
  Globe,
  Code,
  MousePointerClick,
  ShoppingBag,
};

// Priority ordering requested: Group, Logo, Icon, Button, Custom Column Links, Map Preview, and all others
const BLOCK_ORDER_PRIORITY: Record<string, number> = {
  group: 1,
  logo: 2,
  icon: 3,
  button: 4,
  'column-links': 5,
  'map-preview': 6,
  heading: 7,
  text: 8,
  image: 9,
  newsletter: 10,
  'social-links': 11,
  'contact-info': 12,
  'policy-links': 13,
  'payment-icons': 14,
  copyright: 15,
  'trust-badge': 16,
  'app-download': 17,
  localization: 18,
  'custom-html': 19,
  divider: 20,
  spacer: 21,
  'link-list': 22,
};

export const FooterComponentPicker: React.FC = () => {
  const {
    isFooterComponentPickerOpen,
    footerPickerTargetParentId,
    footerPickerTargetIndex,
    closeFooterComponentPicker,
    addFooterTreeNode,
    footerTree,
  } = useEditorContextStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'essential' | 'navigation' | 'info'>('all');

  // Determine parent context
  const parentNode = useMemo(() => {
    if (!footerPickerTargetParentId) return null;
    return findNodeById(footerTree, footerPickerTargetParentId);
  }, [footerTree, footerPickerTargetParentId]);

  const parentType: 'root' | 'group' = parentNode ? 'group' : 'root';
  const parentName = parentNode ? parentNode.name : 'Footer';

  // Filter and sort components in user-requested order
  const orderedComponents = useMemo(() => {
    // Only real, non-mock blocks
    const allowed = FOOTER_COMPONENT_DEFS.filter((def) => {
      // Must be allowed for parent
      if (!def.allowedParents.includes(parentType)) return false;

      // Filter by tag if selected
      if (selectedFilter === 'essential') {
        if (!['group', 'logo', 'icon', 'button', 'column-links'].includes(def.nodeType)) return false;
      } else if (selectedFilter === 'navigation') {
        if (!['column-links', 'button', 'policy-links', 'social-links', 'link-list'].includes(def.nodeType)) return false;
      } else if (selectedFilter === 'info') {
        if (!['map-preview', 'contact-info', 'payment-icons', 'copyright', 'trust-badge', 'app-download', 'localization'].includes(def.nodeType)) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = def.name.toLowerCase().includes(q);
        const matchesDesc = def.description.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc) return false;
      }

      return true;
    });

    // Sort by priority order
    return [...allowed].sort((a, b) => {
      const orderA = BLOCK_ORDER_PRIORITY[a.nodeType] ?? 99;
      const orderB = BLOCK_ORDER_PRIORITY[b.nodeType] ?? 99;
      return orderA - orderB;
    });
  }, [parentType, searchQuery, selectedFilter]);

  if (!isFooterComponentPickerOpen) return null;

  const handleSelectComponent = (def: FooterComponentDefinition) => {
    let overrides: Partial<FooterTreeNode> | undefined = undefined;

    if (def.nodeType === 'group') {
      const isParentHorizontal = parentNode?.layout?.direction === 'horizontal';
      if (isParentHorizontal || !parentNode) {
        overrides = {
          layout: {
            ...createDefaultGroupLayout('vertical'),
            gap: 16,
            crossAxisAlignment: 'start',
            width: { mode: 'fill' },
          },
        };
      }
    }

    const newNode = createNodeFromDef(def, { ...overrides, name: def.name });
    addFooterTreeNode(newNode, footerPickerTargetParentId, footerPickerTargetIndex);
  };

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        backgroundColor: 'rgba(15, 23, 42, 0.35)',
        backdropFilter: 'blur(2px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeFooterComponentPicker();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '580px',
          maxHeight: '82vh',
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#ffffff',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: '#0f172a',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              Add Block
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#2563eb',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  padding: '1.5px 8px',
                  borderRadius: '12px',
                }}
              >
                Into {parentName}
              </span>
            </h2>
          </div>
          <button
            onClick={closeFooterComponentPicker}
            style={{
              padding: '6px',
              borderRadius: '6px',
              border: 'none',
              background: '#f8fafc',
              color: '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
          >
            <X size={16} />
          </button>
        </div>

        {/* Search bar & Category filters */}
        <div style={{ padding: '12px 18px', backgroundColor: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
          {/* Search Input */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '6px 10px',
              marginBottom: '10px',
            }}
          >
            <Search size={15} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search footer blocks (group, logo, icon, button, links, map...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '13px',
                color: '#0f172a',
                backgroundColor: 'transparent',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {[
              { id: 'all', label: 'All Blocks' },
              { id: 'essential', label: 'Core (Group, Logo, Icon, Button)' },
              { id: 'navigation', label: 'Navigation & Links' },
              { id: 'info', label: 'Store Info & Map' },
            ].map((f) => {
              const active = selectedFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedFilter(f.id as any)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: active ? '1px solid #2563eb' : '1px solid #e2e8f0',
                    backgroundColor: active ? '#eff6ff' : '#ffffff',
                    color: active ? '#1d4ed8' : '#64748b',
                    fontSize: '11px',
                    fontWeight: active ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.12s ease',
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Ordered Block List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '8px 16px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            maxHeight: '56vh',
          }}
        >
          {orderedComponents.length === 0 ? (
            <div
              style={{
                padding: '40px 16px',
                textAlign: 'center',
                color: '#94a3b8',
              }}
            >
              <LayoutGrid size={28} style={{ margin: '0 auto 8px auto', opacity: 0.5 }} />
              <p style={{ margin: '0 0 4px 0', fontSize: 13, fontWeight: 600, color: '#475569' }}>
                No matching blocks found
              </p>
              <p style={{ margin: 0, fontSize: 11.5 }}>
                Try searching for another block name.
              </p>
            </div>
          ) : (
            orderedComponents.map((def) => {
              const IconComp = ICON_MAP[def.icon] || LayoutGrid;
              const isTopPick = ['group', 'logo', 'icon', 'button', 'column-links', 'map-preview'].includes(def.nodeType);

              return (
                <button
                  key={def.nodeType}
                  type="button"
                  onClick={() => handleSelectComponent(def)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: isTopPick ? '1px solid #e2e8f0' : '1px solid #f1f5f9',
                    backgroundColor: isTopPick ? '#ffffff' : '#ffffff',
                    textAlign: 'left',
                    color: '#0f172a',
                    cursor: 'pointer',
                    transition: 'all 0.12s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                    e.currentTarget.style.borderColor = '#bfdbfe';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.borderColor = isTopPick ? '#e2e8f0' : '#f1f5f9';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      backgroundColor: isTopPick ? '#eff6ff' : '#f8fafc',
                      color: isTopPick ? '#2563eb' : '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <IconComp size={17} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
                        {def.name}
                      </span>
                      {def.nodeType === 'column-links' && (
                        <span style={{ fontSize: '9.5px', fontWeight: 700, backgroundColor: '#ecfdf5', color: '#047857', padding: '1px 5px', borderRadius: '3px' }}>
                          Custom
                        </span>
                      )}
                      {def.nodeType === 'map-preview' && (
                        <span style={{ fontSize: '9.5px', fontWeight: 700, backgroundColor: '#fef3c7', color: '#b45309', padding: '1px 5px', borderRadius: '3px' }}>
                          Real-time
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: '#64748b',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginTop: '1px',
                      }}
                    >
                      {def.description}
                    </div>
                  </div>
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#475569',
                      flexShrink: 0,
                    }}
                  >
                    <Plus size={14} />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info bar */}
        <div
          style={{
            padding: '10px 18px',
            backgroundColor: '#f8fafc',
            borderTop: '1px solid #e4e7ec',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11.5px',
            color: '#64748b',
          }}
        >
          <span>
            {orderedComponents.length} real-time block{orderedComponents.length !== 1 ? 's' : ''} available
          </span>
          <button
            onClick={closeFooterComponentPicker}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: '11.5px',
              fontWeight: 500,
              color: '#475569',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
