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
};

type PickerCategory = 'basic' | 'decorative' | 'footer' | 'forms' | 'layout' | 'links';
type PickerTab = 'blocks' | 'apps';

const SHOPIFY_FOOTER_BLOCKS = new Set([
  'group', 'heading', 'text', 'image', 'logo', 'icon', 'link-list', 'policy-links',
  'social-links', 'button', 'newsletter', 'divider', 'payment-icons', 'copyright',
]);
const CATEGORY_ORDER: Array<{ id: PickerCategory; label: string }> = [
  { id: 'basic', label: 'Basic' },
  { id: 'decorative', label: 'Decorative' },
  { id: 'footer', label: 'Footer' },
  { id: 'forms', label: 'Forms' },
  { id: 'layout', label: 'Layout' },
  { id: 'links', label: 'Links' },
];

const getPickerCategory = (def: FooterComponentDefinition): PickerCategory => {
  if (def.name === 'Jumbo text') return 'decorative';
  if (def.name === 'Follow on Shop' || ['policy-links', 'social-links', 'payment-icons', 'copyright'].includes(def.nodeType)) return 'footer';
  if (def.nodeType === 'group' || def.nodeType === 'divider') return 'layout';
  if (def.nodeType === 'link-list') return 'links';
  if (def.nodeType === 'newsletter') return 'forms';
  if (['button', 'heading', 'icon', 'image', 'logo', 'text'].includes(def.nodeType)) return 'basic';
  return 'basic';
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
  const [activeTab, setActiveTab] = useState<PickerTab>('blocks');

  const pickerComponents = useMemo(() => {
    const heading = FOOTER_COMPONENT_DEFS.find((def) => def.nodeType === 'heading');
    const button = FOOTER_COMPONENT_DEFS.find((def) => def.nodeType === 'button');
    const extras: FooterComponentDefinition[] = [];
    if (heading) {
      extras.push({
        ...heading,
        name: 'Jumbo text',
        description: 'Large display text for a bold footer statement',
        defaultProps: { ...heading.defaultProps, text: 'Your store name', level: 'h2', fontSize: 48, fontWeight: 700 },
      });
    }
    if (button) {
      extras.push({
        ...button,
        name: 'Follow on Shop',
        description: 'Add a Shop follow button to help customers keep up with your store',
        defaultProps: { ...button.defaultProps, label: 'Follow on Shop', link: '/collections/all', variant: 'secondary' },
      });
    }
    return [...FOOTER_COMPONENT_DEFS, ...extras];
  }, []);

  // Determine parent context
  const parentNode = useMemo(() => {
    if (!footerPickerTargetParentId) return null;
    return findNodeById(footerTree, footerPickerTargetParentId);
  }, [footerTree, footerPickerTargetParentId]);

  const parentType: 'root' | 'group' = parentNode ? 'group' : 'root';
  const parentName = parentNode ? parentNode.name : 'Footer Root';

  // Filter components
  const filteredComponents = useMemo(() => {
    if (activeTab === 'apps') return [];
    return pickerComponents.filter((def) => {
      if (!SHOPIFY_FOOTER_BLOCKS.has(def.nodeType) && !['Jumbo text', 'Follow on Shop'].includes(def.name)) return false;
      // Must be allowed for parent
      if (!def.allowedParents.includes(parentType)) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = def.name.toLowerCase().includes(q);
        const matchesDesc = def.description.toLowerCase().includes(q);
        const matchesCat = getPickerCategory(def).toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }

      return true;
    });
  }, [pickerComponents, parentType, searchQuery, activeTab]);

  const groupedComponents = useMemo(() => CATEGORY_ORDER.map((category) => ({
    ...category,
    blocks: filteredComponents.filter((definition) => getPickerCategory(definition) === category.id),
  })).filter((category) => category.blocks.length > 0), [filteredComponents]);

  if (!isFooterComponentPickerOpen) return null;

  const handleSelectComponent = (def: FooterComponentDefinition) => {
    let overrides: Partial<FooterTreeNode> | undefined = undefined;

    if (def.nodeType === 'group') {
      const isParentHorizontal = parentNode?.layout?.direction === 'horizontal';
      // When added into a horizontal group (like the main footer row) or at root,
      // the new group acts as a column. Columns should always stack children vertically
      // by default so components added inside are vertically aligned, never squished horizontally!
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

    const specialProps = def.name === 'Jumbo text'
      ? { text: 'Your store name', level: 'h2', fontSize: 48, fontWeight: 700 }
      : def.name === 'Follow on Shop'
        ? { label: 'Follow on Shop', link: '/collections/all', variant: 'secondary' }
        : undefined;
    const newNode = createNodeFromDef(def, { ...overrides, name: def.name, ...(specialProps ? { props: specialProps } : {}) });
    addFooterTreeNode(newNode, footerPickerTargetParentId, footerPickerTargetIndex);
  };

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        backgroundColor: 'rgba(15, 23, 42, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeFooterComponentPicker();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '85vh',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
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
            padding: '20px 24px',
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
                fontSize: '18px',
                fontWeight: 700,
                color: '#0f172a',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              Add block
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#64748b',
                  backgroundColor: '#f1f5f9',
                  padding: '2px 8px',
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
              padding: '8px',
              borderRadius: '8px',
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
            <X size={18} />
          </button>
        </div>

        {/* Search bar & Categories */}
        <div style={{ padding: '14px 18px 12px', backgroundColor: '#fff', borderBottom: '1px solid #e4e7ec' }}>
          {/* Search Input */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '7px 10px',
              marginBottom: '10px',
            }}
          >
            <Search size={16} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search blocks"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '14px',
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
                <X size={14} />
              </button>
            )}
          </div>

          {/* Shopify-style Blocks / Apps switch */}
          <div role="tablist" aria-label="Block source" style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
            {(['blocks', 'apps'] as const).map((tab) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '7px',
                    border: active ? '1px solid #2563eb' : '1px solid #e2e8f0',
                    backgroundColor: active ? '#eff6ff' : '#ffffff',
                    color: active ? '#1d4ed8' : '#64748b',
                    fontSize: '12px',
                    fontWeight: active ? 600 : 500,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {tab === 'blocks' ? 'Blocks' : 'Apps'}
                </button>
              );
            })}
          </div>

        </div>

        {/* Shopify-style grouped block list */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '4px 18px 16px',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '58vh',
          }}
        >
          {filteredComponents.length === 0 ? (
            <div
              style={{
                padding: '44px 16px',
                textAlign: 'center',
                color: '#94a3b8',
              }}
            >
              <LayoutGrid size={30} style={{ margin: '0 auto 10px auto', opacity: 0.5 }} />
              <p style={{ margin: '0 0 4px 0', fontSize: 14, fontWeight: 600, color: '#475569' }}>
                {activeTab === 'apps' ? 'No app blocks available' : 'No blocks found'}
              </p>
              <p style={{ margin: 0, fontSize: 12 }}>
                {activeTab === 'apps' ? 'Installed apps can add footer blocks here.' : 'Try another search.'}
              </p>
            </div>
          ) : (
            groupedComponents.map((group) => (
              <section key={group.id} style={{ paddingTop: 12 }}>
                <h3 style={{ margin: '0 0 6px', padding: '0 2px', color: '#475467', fontSize: 12, fontWeight: 600 }}>{group.label}</h3>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {group.blocks.map((def) => {
                    const IconComp = ICON_MAP[def.icon] || LayoutGrid;
                    return (
                      <button key={`${def.nodeType}-${def.name}`} type="button" onClick={() => handleSelectComponent(def)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 4px', border: 0, borderBottom: '1px solid #f2f4f7', background: '#fff', textAlign: 'left', color: '#202223', cursor: 'pointer' }}>
                        <IconComp size={17} color="#475467" />
                        <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{def.name}</span>
                        <Plus size={15} color="#667085" />
                      </button>
                    );
                  })}
                </div>
              </section>
            ))
          )}
        </div>

        {/* Footer info bar */}
        <div
          style={{
            padding: '10px 18px',
            backgroundColor: '#fff',
            borderTop: '1px solid #e4e7ec',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#64748b',
          }}
        >
          <span>
            {activeTab === 'apps'
              ? 'No apps installed'
              : `${filteredComponents.length} block${filteredComponents.length !== 1 ? 's' : ''} available`}
          </span>
          <button
            onClick={closeFooterComponentPicker}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: '12px',
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
