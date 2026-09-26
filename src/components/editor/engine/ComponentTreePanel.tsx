// ============================================================
// MASTER EDITOR ENGINE — SHARED COMPONENT TREE PANEL
// Unified left sidebar tree panel powering Header and Footer editors
// with full DnD, expand/collapse, visibility,
// cloning, deleting, and component addition (spec §3, §22, §23).
// ============================================================

import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  MoreVertical,
  Plus,
  GripVertical,
  Trash2,
  Copy,
  Box,
  Megaphone,
  Phone,
  Navigation,
  Sparkles,
  Layers,
  ShieldCheck,
  CreditCard,
  Mail,
  Share2,
  FileText,
  SlidersHorizontal,
  Search,
  User,
  ShoppingCart,
  Heart,
  Globe,
  Code,
  ShoppingBag,
  MousePointerClick,
  Lock,
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEditorContextStore } from '../../../store/editorContextStore';
import { useLandingEditorStore } from '../../../store/landingEditorStore';
import { scrollPreviewToHeaderSection, scrollPreviewToFooterSection } from '../utils/previewScroll';
import { resolveFooterRowId } from '../utils/editorNavigation';

// ─── Shared Sortable Row Component ──────────────────────────

export interface ChildMenuItem {
  type: string;
  name: string;
  icon: React.ReactNode;
  desc?: string;
  defaults?: Record<string, any>;
}

interface SortableRowProps {
  id: string;
  name: string;
  type: string;
  isVisible: boolean;
  isSelected: boolean;
  isLocked?: boolean;
  childMenuItems?: ChildMenuItem[];
  onAddChildItem?: (item: ChildMenuItem) => void;
  onSelect: () => void;
  onToggleVisibility: (e: React.MouseEvent) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  children?: React.ReactNode;
}

const SortableRow: React.FC<SortableRowProps> = ({
  id,
  name,
  type,
  isVisible,
  isSelected,
  isLocked,
  childMenuItems,
  onAddChildItem,
  onSelect,
  onToggleVisibility,
  onDuplicate,
  onDelete,
  children,
}) => {
  const isDraggable = true;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled: !isDraggable,
  });
  const [menuOpen, setMenuOpen] = useState(false);

  const style: React.CSSProperties = {
    transform: isDraggable ? CSS.Transform.toString(transform) : undefined,
    transition: isDraggable ? transition : undefined,
    opacity: isDragging ? 0.35 : 1,
    marginBottom: '8px',
    borderRadius: '8px',
    border: isSelected ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    boxShadow: isSelected ? '0 1px 4px rgba(37, 99, 235, 0.12)' : '0 1px 2px rgba(0, 0, 0, 0.03)',
    position: 'relative',
  };

  const getRowIcon = () => {
    switch (type) {
      // Header
      case 'announcement':
        return <Megaphone size={14} color="#f59e0b" />;
      case 'utility':
        return <Phone size={14} color="#0ea5e9" />;
      case 'primary-nav':
        return <Navigation size={14} color="#10b981" />;
      case 'secondary-nav':
        return <Layers size={14} color="#8b5cf6" />;
      case 'promo':
        return <Sparkles size={14} color="#ec4899" />;

      // Footer
      case 'brand':
        return <Box size={14} color="#3b82f6" />;
      case 'navigation':
        return <Navigation size={14} color="#10b981" />;
      case 'newsletter':
        return <Mail size={14} color="#ec4899" />;
      case 'trust':
        return <ShieldCheck size={14} color="#6366f1" />;
      case 'payment':
        return <CreditCard size={14} color="#0ea5e9" />;
      case 'social':
        return <Share2 size={14} color="#f59e0b" />;
      case 'legal':
        return <FileText size={14} color="#64748b" />;
      default:
        return <SlidersHorizontal size={14} color="#64748b" />;
    }
  };

  const hasExpandedChildren = Boolean(children);

  return (
    <div ref={setNodeRef} style={style}>
      <div
        onClick={onSelect}
        style={{
          backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
          borderBottom: hasExpandedChildren ? '1px solid #f1f5f9' : 'none',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          borderBottomLeftRadius: hasExpandedChildren ? 0 : '8px',
          borderBottomRightRadius: hasExpandedChildren ? 0 : '8px',
          padding: '8px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'background-color 0.15s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
          {isDraggable && (
            <div
              {...attributes}
              {...listeners}
              onClick={(e) => e.stopPropagation()}
              style={{ cursor: 'grab', display: 'flex', alignItems: 'center', color: '#94a3b8' }}
              title="Drag to reorder"
            >
              <GripVertical size={14} />
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
            {getRowIcon()}
            <span
              style={{
                fontSize: '13px',
                fontWeight: isSelected ? 700 : 600,
                color: isSelected ? '#1d4ed8' : '#0f172a',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {name}
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>

          {isLocked ? (
            <div
              title="Locked default section"
              style={{
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                color: '#94a3b8',
                cursor: 'default',
              }}
            >
              <Lock size={13} />
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={onToggleVisibility}
                title={isVisible ? 'Hide row' : 'Show row'}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {isVisible ? <Eye size={13} color="#64748b" /> : <EyeOff size={13} color="#ef4444" />}
              </button>

              <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  title="More options"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    color: '#64748b',
                  }}
                >
                  <MoreVertical size={13} />
                </button>

                {menuOpen && (
                  <>
                    <div
                      style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
                      onClick={() => setMenuOpen(false)}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 'calc(100% + 4px)',
                        right: 0,
                        zIndex: 9999,
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.16)',
                        minWidth: '165px',
                        padding: '4px',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          onDuplicate();
                          setMenuOpen(false);
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '7px 10px',
                          background: 'none',
                          border: 'none',
                          fontSize: '12px',
                          color: '#334155',
                          cursor: 'pointer',
                          borderRadius: '6px',
                          textAlign: 'left',
                        }}
                      >
                        <Copy size={13} /> Duplicate Row
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onDelete();
                          setMenuOpen(false);
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '7px 10px',
                          background: 'none',
                          border: 'none',
                          fontSize: '12px',
                          color: '#ef4444',
                          cursor: 'pointer',
                          borderRadius: '6px',
                          textAlign: 'left',
                        }}
                      >
                        <Trash2 size={13} /> Delete Row
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Children are always expanded */}
      {hasExpandedChildren && (
        <div
          style={{
            backgroundColor: '#fafbfc',
            padding: '6px 8px 8px 8px',
            borderBottomLeftRadius: '8px',
            borderBottomRightRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}
        >
          {children}
          {childMenuItems && childMenuItems.length > 0 && (
            <div style={{ marginTop: '6px' }}>
              <button
                type="button"
                onClick={(event) => { event.stopPropagation(); onAddChildItem?.(childMenuItems[0]); }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '6px', border: '1px dashed #93c5fd', borderRadius: '5px', background: '#eff6ff', color: '#2563eb', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
              >
                <Plus size={12} /> Manage components
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main Shared Component Tree Panel ───────────────────────

const HEADER_CHILD_OPTIONS: ChildMenuItem[] = [
  {
    type: 'menu',
    name: 'Menu Button',
    icon: <Navigation size={13} color="#0ea5e9" />,
    desc: 'Mobile navigation menu trigger',
    defaults: { label: 'Menu' },
  },
  {
    type: 'search',
    name: 'Search Bar',
    icon: <Search size={13} color="#6366f1" />,
    desc: 'Live predictive search box',
    defaults: { placeholder: 'Search products, collections...', variant: 'inline' },
  },
  {
    type: 'cta',
    name: 'Call to Action',
    icon: <MousePointerClick size={13} color="#f97316" />,
    desc: 'Primary conversion button with destination',
    defaults: { text: 'Shop Now', url: '/shop', variant: 'primary', size: 'sm' },
  },
];

const FOOTER_CHILD_OPTIONS: ChildMenuItem[] = [
  {
    type: 'link-group',
    name: 'Link Directory Column',
    icon: <Navigation size={13} color="#10b981" />,
    desc: 'New categorized link column',
    defaults: {
      heading: 'Quick Links',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' },
      ],
    },
  },
  {
    type: 'brand-description',
    name: 'Brand Bio / Tagline',
    icon: <Box size={13} color="#3b82f6" />,
    desc: 'Company bio and tagline',
    defaults: { text: 'Empowering online retail with intelligent infrastructure.' },
  },
  {
    type: 'social-links',
    name: 'Social Profiles',
    icon: <Share2 size={13} color="#f59e0b" />,
    desc: 'Instagram, Twitter/X, YouTube',
    defaults: {
      platforms: [
        { platform: 'twitter', url: 'https://twitter.com', enabled: true },
        { platform: 'instagram', url: 'https://instagram.com', enabled: true },
      ],
    },
  },
  {
    type: 'newsletter-form',
    name: 'Newsletter Form',
    icon: <Mail size={13} color="#ec4899" />,
    desc: 'Inline email signup input & button',
    defaults: { headline: 'Subscribe to our newsletter', placeholder: 'Enter your email...' },
  },
  {
    type: 'trust-badges',
    name: 'Trust Guarantees',
    icon: <ShieldCheck size={13} color="#6366f1" />,
    desc: 'Security seals & guarantee badges',
    defaults: {
      items: [
        { icon: 'shield-check', title: 'Secure Payment' },
        { icon: 'truck', title: 'Fast Delivery' },
      ],
    },
  },
  {
    type: 'payment-methods',
    name: 'Payment Icons',
    icon: <CreditCard size={13} color="#0ea5e9" />,
    desc: 'Accepted payment credit card icons',
    defaults: { providers: ['visa', 'mastercard', 'amex', 'paypal'] },
  },
  {
    type: 'copyright',
    name: 'Copyright Notice',
    icon: <FileText size={13} color="#64748b" />,
    desc: 'Legal copyright statement',
    defaults: { text: '© 2026 BillionBiz, Inc. All rights reserved.' },
  },
];

export const ComponentTreePanel: React.FC<{ editorType?: 'header' | 'footer' }> = ({
  editorType: overrideEditorType,
}) => {
  const store = useEditorContextStore();
  const editorType = overrideEditorType || (store.editorType === 'page' ? 'header' : store.editorType);
  const headerRows = store.headerRows;
  const [addHeaderMenuOpen, setAddHeaderMenuOpen] = useState(false);
  const [addFooterMenuOpen, setAddFooterMenuOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    if (editorType === 'header') {
      const oldIndex = store.headerRows.findIndex((r) => r.id === active.id);
      const newIndex = store.headerRows.findIndex((r) => r.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        store.reorderHeaderRows(oldIndex, newIndex);
      }
    } else {
      const oldIndex = store.footerRows.findIndex((r) => r.id === active.id);
      const newIndex = store.footerRows.findIndex((r) => r.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        store.reorderFooterRows(oldIndex, newIndex);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>

      {/* Stack Header Title */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px 8px 16px',
          flexShrink: 0,
        }}
      >
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' }}>
          {editorType === 'header' ? 'Header Stack' : 'Footer Stack'}
        </div>
        <div style={{ fontSize: '11px', color: '#94a3b8' }}>
          {editorType === 'header' ? `${headerRows.length} sections` : `${store.footerRows.length} rows`}
        </div>
      </div>

      {/* Header and Footer Stack List */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 16px' }}>
        {editorType === 'header' ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={headerRows.map((r) => r.id)}
              strategy={verticalListSortingStrategy}
            >
              {headerRows.map((row) => {
                const isLockedRow = row.type === 'primary-nav';
                const rowDisplayName =
                  row.type === 'announcement'
                    ? 'Announcement Bar'
                    : row.type === 'utility'
                    ? 'Utility Bar'
                    : row.type === 'primary-nav'
                    ? 'Header Navbar'
                    : row.type === 'secondary-nav'
                    ? 'Secondary Navigation'
                    : row.name;

                const isSelected =
                  store.selectedTarget.type === 'row' &&
                  store.selectedTarget.editorType === 'header' &&
                  (store.selectedTarget.rowId === row.id ||
                   (store.selectedTarget.rowId === 'announcement-bar' && (row.type === 'announcement' || row.id.includes('announcement'))) ||
                   (store.selectedTarget.rowId === 'utility-bar' && (row.type === 'utility' || row.id.includes('utility'))) ||
                   ((store.selectedTarget.rowId === 'category-bar' || store.selectedTarget.rowId === 'secondary-nav') && (row.type === 'secondary-nav' || row.id.includes('secondary') || row.id.includes('category'))) ||
                   (store.selectedTarget.rowId === 'header-main' && (row.type === 'primary-nav' || row.id.includes('primary'))));

                const handleSelect = () => {
                  store.selectTarget({ type: 'row', editorType: 'header', rowId: row.id });
                  useLandingEditorStore.getState().setRightSidebarOpen(true);
                  const secId = row.type === 'announcement'
                    ? 'announcement-bar'
                    : row.type === 'utility'
                    ? 'utility-bar'
                    : row.type === 'secondary-nav'
                    ? 'category-bar'
                    : 'header-main';
                  useLandingEditorStore.getState().setSelectedSectionId(secId);
                  scrollPreviewToHeaderSection(row.id);
                };

                const childMenuItems =
                  row.type === 'primary-nav'
                    ? HEADER_CHILD_OPTIONS
                    : undefined;

                return (
                  <SortableRow
                    key={row.id}
                    id={row.id}
                    name={rowDisplayName}
                    type={row.type}
                    isVisible={row.isVisible}
                    isSelected={isSelected}
                    isLocked={isLockedRow}
                    childMenuItems={childMenuItems}
                    onAddChildItem={() => {
                      store.selectTarget({ type: 'row', editorType: 'header', rowId: row.id });
                      store.setActiveTab('content');
                      useLandingEditorStore.getState().setRightSidebarOpen(true);
                    }}
                    onSelect={handleSelect}
                    onToggleVisibility={(e) => {
                      e.stopPropagation();
                      store.toggleHeaderRowVisibility(row.id);
                    }}
                    onDuplicate={() => store.duplicateHeaderRow(row.id)}
                    onDelete={() => store.deleteHeaderRow(row.id)}
                  >
                    {/* Navbar children remain in the component tab and can be reordered from their drag handles. */}
                    {row.type === 'primary-nav' ? row.elements.filter((el) => {
                      const key = el.type === 'logo' ? 'logo' : el.type === 'navigation' || el.type === 'primary-nav' || el.type === 'navigation-menu' ? 'navigation' : el.type === 'actions' || el.type === 'action-group' ? 'actions' : el.type;
                      const arrangement = row.layout?.responsiveArrangement;
                      return !arrangement || [arrangement.desktop, arrangement.tablet, arrangement.mobile].some((deviceSlots) =>
                        (['left', 'center', 'right'] as const).some((slot) => deviceSlots[slot].includes(key))
                      );
                    }).map((el, elIdx, visibleElements) => {
                      const isLast = elIdx === visibleElements.length - 1;
                      const isElSelected =
                        store.selectedTarget.type === 'element' &&
                        store.selectedTarget.editorType === 'header' &&
                        store.selectedTarget.rowId === row.id &&
                        store.selectedTarget.elementId === el.id;

                      const isLockedEl = false;

                      let elDisplayName = el.name;
                      if (el.id === 'el-logo' || el.type === 'logo' || el.name === 'Logo') {
                        elDisplayName = 'Logo & Brandname';
                      } else if (el.id === 'el-nav-links' || el.type === 'navigation' || el.type === 'primary-nav') {
                        elDisplayName = 'Navigation';
                      } else if (el.id === 'el-actions' || el.type === 'actions' || el.type === 'action-group') {
                        elDisplayName = 'Actions';
                      } else if (el.type === 'search') {
                        elDisplayName = 'Search';
                      } else if (el.type === 'cta') {
                        elDisplayName = 'CTA';
                      }

                      return (
                        <div
                          key={el.id}
                          style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            minHeight: '28px',
                            paddingLeft: '20px',
                            margin: '1px 0',
                          }}
                        >
                          {/* Tree Branch Vertical Line */}
                          <div
                            style={{
                              position: 'absolute',
                              left: '8px',
                              top: 0,
                              bottom: isLast ? '50%' : 0,
                              width: '1.5px',
                              backgroundColor: '#cbd5e1',
                            }}
                          />
                          {/* Tree Branch Horizontal Elbow */}
                          <div
                            style={{
                              position: 'absolute',
                              left: '8px',
                              top: '50%',
                              width: '10px',
                              height: '1.5px',
                              backgroundColor: '#cbd5e1',
                              borderBottomLeftRadius: isLast ? '3px' : 0,
                            }}
                          />

                          {/* Element Item — no separate box border */}
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              store.selectTarget({
                                type: 'element',
                                editorType: 'header',
                                rowId: row.id,
                                elementId: el.id,
                                elementType: el.type,
                              });
                              useLandingEditorStore.getState().setRightSidebarOpen(true);
                              useLandingEditorStore.getState().setSelectedSectionId('header-main');
                              scrollPreviewToHeaderSection('row-primary-nav');
                            }}
                            style={{
                              flex: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '5px 8px',
                              borderRadius: '6px',
                              backgroundColor: isElSelected ? '#eff6ff' : 'transparent',
                              color: isElSelected ? '#1d4ed8' : '#334155',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: isElSelected ? 600 : 500,
                              transition: 'all 0.12s ease',
                              border: isElSelected ? '1px solid #bfdbfe' : '1px solid transparent',
                            }}
                            onMouseEnter={(e) => {
                              if (!isElSelected) {
                                e.currentTarget.style.backgroundColor = '#f1f5f9';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isElSelected) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                              {(() => {
                                const c = isElSelected ? '#2563eb' : '#64748b';
                                switch (el.type) {
                                  case 'logo':
                                    return <Sparkles size={13} color={isElSelected ? '#2563eb' : '#f59e0b'} style={{ flexShrink: 0 }} />;
                                  case 'navigation-menu':
                                  case 'navigation':
                                  case 'primary-nav':
                                    return <Navigation size={13} color={isElSelected ? '#2563eb' : '#10b981'} style={{ flexShrink: 0 }} />;
                                  case 'mega-menu':
                                    return <Layers size={13} color={isElSelected ? '#2563eb' : '#8b5cf6'} style={{ flexShrink: 0 }} />;
                                  case 'secondary-nav':
                                    return <Layers size={13} color={isElSelected ? '#2563eb' : '#0ea5e9'} style={{ flexShrink: 0 }} />;
                                  case 'search':
                                    return <Search size={13} color={isElSelected ? '#2563eb' : '#6366f1'} style={{ flexShrink: 0 }} />;
                                  case 'cta':
                                    return <MousePointerClick size={13} color={isElSelected ? '#2563eb' : '#f97316'} style={{ flexShrink: 0 }} />;
                                  case 'action-group':
                                  case 'actions':
                                    return <ShoppingBag size={13} color={isElSelected ? '#2563eb' : '#ec4899'} style={{ flexShrink: 0 }} />;
                                  case 'account':
                                    return <User size={13} color={isElSelected ? '#2563eb' : '#3b82f6'} style={{ flexShrink: 0 }} />;
                                  case 'cart':
                                    return <ShoppingCart size={13} color={isElSelected ? '#2563eb' : '#10b981'} style={{ flexShrink: 0 }} />;
                                  case 'wishlist':
                                    return <Heart size={13} color={isElSelected ? '#2563eb' : '#f43f5e'} style={{ flexShrink: 0 }} />;
                                  case 'announcement-bar':
                                  case 'promo-text':
                                    return <Megaphone size={13} color={isElSelected ? '#2563eb' : '#f59e0b'} style={{ flexShrink: 0 }} />;
                                  case 'utility-bar':
                                  case 'utility-links':
                                    return <Phone size={13} color={isElSelected ? '#2563eb' : '#0ea5e9'} style={{ flexShrink: 0 }} />;
                                  case 'localization':
                                    return <Globe size={13} color={c} style={{ flexShrink: 0 }} />;
                                  case 'promo-bar':
                                    return <Sparkles size={13} color={isElSelected ? '#2563eb' : '#d946ef'} style={{ flexShrink: 0 }} />;
                                  case 'custom-row':
                                  case 'custom-html':
                                    return <Code size={13} color={c} style={{ flexShrink: 0 }} />;
                                  default:
                                    return <Box size={13} color={c} style={{ flexShrink: 0 }} />;
                                }
                              })()}
                              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {elDisplayName}
                              </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                              {isLockedEl ? (
                                <div
                                  title="Locked"
                                  style={{
                                    padding: '2px 4px',
                                    color: '#94a3b8',
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: 'default',
                                  }}
                                >
                                  <Lock size={11} />
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    store.deleteHeaderElement(row.id, el.id);
                                  }}
                                  title="Delete element"
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: '2px 4px',
                                    cursor: 'pointer',
                                    color: '#94a3b8',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                  }}
                                >
                                  <Trash2 size={11} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }) : null}
                  </SortableRow>
                );
              })}
            </SortableContext>
          </DndContext>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={store.footerRows.map((r) => r.id)}
              strategy={verticalListSortingStrategy}
            >
              {store.footerRows.map((row) => {
                const isMainFooter = Boolean(
                  row.type === 'navigation' ||
                  row.id === 'row-main-nav' ||
                  row.isLocked
                );
                const rowDisplayName = isMainFooter
                  ? 'Footer'
                  : (row.type === 'trust' ? 'Trust & Guarantees' :
                     row.type === 'newsletter' ? 'Newsletter' :
                     row.type === 'social' ? 'Social Media' :
                     (row.type === 'legal' || row.type === 'payment') ? 'Legal & Bottom Bar' :
                     row.name || 'Footer Section');

                const isSelected =
                  store.selectedTarget.type === 'row' &&
                  store.selectedTarget.editorType === 'footer' &&
                  (store.selectedTarget.rowId === row.id || resolveFooterRowId(store.selectedTarget.rowId, store.footerRows) === row.id);

                const handleSelect = () => {
                  store.selectTarget({ type: 'row', editorType: 'footer', rowId: row.id });
                  useLandingEditorStore.getState().setSelectedSectionId(row.id);
                  useLandingEditorStore.getState().setRightSidebarOpen(true);
                  scrollPreviewToFooterSection(row.id);
                };

                const childMenuItems = isMainFooter ? FOOTER_CHILD_OPTIONS : undefined;

                return (
                  <SortableRow
                    key={row.id}
                    id={row.id}
                    name={rowDisplayName}
                    type={row.type}
                    isVisible={row.isVisible}
                    isSelected={isSelected}
                    isLocked={isMainFooter}
                    childMenuItems={childMenuItems}
                    onAddChildItem={(childItem) => {
                      const targetColId =
                        row.columns && row.columns.length > 0
                          ? row.columns[row.columns.length - 1].id
                          : `col-${Date.now().toString(36)}`;
                      store.addFooterElement(row.id, targetColId, childItem.type as any, childItem.name, childItem.defaults);
                    }}
                    onSelect={handleSelect}
                    onToggleVisibility={(e) => {
                      e.stopPropagation();
                      store.toggleFooterRowVisibility(row.id);
                    }}
                    onDuplicate={() => store.duplicateFooterRow(row.id)}
                    onDelete={() => store.deleteFooterRow(row.id)}
                  >
                    {/* Columns & Elements with Tree Branch Lines — ONLY rendered for the Main Footer Section */}
                    {isMainFooter ? row.columns.map((col, cIdx) => {
                      const isLastCol = cIdx === row.columns.length - 1;
                      return (
                        <div key={col.id} style={{ position: 'relative', margin: '2px 0' }}>
                          {/* Column level connector line */}
                          <div
                            style={{
                              position: 'absolute',
                              left: '8px',
                              top: 0,
                              bottom: isLastCol ? 'calc(100% - 13px)' : 0,
                              width: '1.5px',
                              backgroundColor: '#cbd5e1',
                            }}
                          />
                          {/* Column level horizontal elbow */}
                          <div
                            style={{
                              position: 'absolute',
                              left: '8px',
                              top: '13px',
                              width: '10px',
                              height: '1.5px',
                              backgroundColor: '#cbd5e1',
                            }}
                          />

                          {/* Column Header */}
                          <div
                            style={{
                              paddingLeft: '22px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              paddingTop: '3px',
                              paddingBottom: '3px',
                            }}
                          >
                            <span
                              style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                color: '#64748b',
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                              }}
                            >
                              Column {cIdx + 1} ({col.width})
                            </span>
                          </div>

                          {/* Nested Elements in Column with sub-branch lines */}
                          <div style={{ position: 'relative', paddingLeft: '18px' }}>
                            {col.elements.map((el, elIdx) => {
                              const isLastEl = elIdx === col.elements.length - 1;
                              const isElSelected =
                                store.selectedTarget.type === 'element' &&
                                store.selectedTarget.editorType === 'footer' &&
                                store.selectedTarget.rowId === row.id &&
                                store.selectedTarget.elementId === el.id;

                              const isLockedEl = Boolean(
                                el.isLocked ||
                                (row.isLocked && (el.id === 'el-footer-logo' || el.id === 'el-shop-links'))
                              );

                              return (
                                <div
                                  key={el.id}
                                  style={{
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    minHeight: '28px',
                                    paddingLeft: '18px',
                                    margin: '1px 0',
                                  }}
                                >
                                  {/* Sub-branch vertical connector */}
                                  <div
                                    style={{
                                      position: 'absolute',
                                      left: '6px',
                                      top: 0,
                                      bottom: isLastEl ? '50%' : 0,
                                      width: '1.5px',
                                      backgroundColor: '#cbd5e1',
                                    }}
                                  />
                                  {/* Sub-branch horizontal elbow */}
                                  <div
                                    style={{
                                      position: 'absolute',
                                      left: '6px',
                                      top: '50%',
                                      width: '9px',
                                      height: '1.5px',
                                      backgroundColor: '#cbd5e1',
                                      borderBottomLeftRadius: isLastEl ? '3px' : 0,
                                    }}
                                  />

                                  {/* Element Card — NO separate border, seamless highlight */}
                                  <div
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      store.selectTarget({
                                        type: 'element',
                                        editorType: 'footer',
                                        rowId: row.id,
                                        elementId: el.id,
                                        elementType: el.type,
                                      });
                                      useLandingEditorStore.getState().setSelectedSectionId(row.id);
                                      useLandingEditorStore.getState().setRightSidebarOpen(true);
                                    }}
                                    style={{
                                      flex: 1,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      padding: '5px 8px',
                                      borderRadius: '6px',
                                      backgroundColor: isElSelected ? '#eff6ff' : 'transparent',
                                      color: isElSelected ? '#1d4ed8' : '#334155',
                                      fontSize: '12px',
                                      fontWeight: isElSelected ? 600 : 500,
                                      cursor: 'pointer',
                                      transition: 'all 0.12s ease',
                                      border: isElSelected ? '1px solid #bfdbfe' : '1px solid transparent',
                                    }}
                                    onMouseEnter={(e) => {
                                      if (!isElSelected) {
                                        e.currentTarget.style.backgroundColor = '#f1f5f9';
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      if (!isElSelected) {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                      }
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                                      <Box size={13} color={isElSelected ? '#2563eb' : '#64748b'} style={{ flexShrink: 0 }} />
                                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {el.name}
                                      </span>
                                    </div>
                                    {isLockedEl ? (
                                      <div
                                        title="Locked"
                                        style={{
                                          padding: '2px 4px',
                                          color: '#94a3b8',
                                          display: 'flex',
                                          alignItems: 'center',
                                          cursor: 'default',
                                        }}
                                      >
                                        <Lock size={11} />
                                      </div>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          store.deleteFooterElement(row.id, el.id);
                                        }}
                                        title="Delete element"
                                        style={{
                                          background: 'none',
                                          border: 'none',
                                          padding: '2px 4px',
                                          cursor: 'pointer',
                                          color: '#94a3b8',
                                          borderRadius: '4px',
                                          display: 'flex',
                                          alignItems: 'center',
                                        }}
                                      >
                                        <Trash2 size={11} />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }) : null}
                  </SortableRow>
                );
              })}
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Sticky section/component actions */}
      {editorType === 'header' ? <div
        style={{
          position: 'relative',
          padding: '12px 16px 16px',
          borderTop: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          flexShrink: 0,
        }}
      >
        {addHeaderMenuOpen && (
          <div style={{ position: 'absolute', bottom: '68px', left: '16px', right: '16px', padding: '6px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', boxShadow: '0 10px 24px rgba(15,23,42,0.14)', zIndex: 20 }}>
            {[
              { type: 'announcement', name: 'Announcement Bar' },
              { type: 'utility', name: 'Utility Bar' },
              { type: 'primary-nav', name: 'Header Navbar' },
              { type: 'secondary-nav', name: 'Secondary Navigation' },
            ].map((option) => {
              const exists = headerRows.some((row) => row.type === option.type);
              const unavailable = exists || option.type === 'primary-nav';
              return (
                <button key={option.type} type="button" disabled={unavailable} onClick={() => { store.addHeaderRow(option.type as any, option.name); setAddHeaderMenuOpen(false); }} style={{ display: 'flex', width: '100%', justifyContent: 'space-between', padding: '8px 10px', border: 0, borderRadius: '5px', background: unavailable ? '#f8fafc' : '#ffffff', color: unavailable ? '#94a3b8' : '#0f172a', cursor: unavailable ? 'not-allowed' : 'pointer', fontSize: '12px', textAlign: 'left' }}>
                  <span>{option.name}</span><span>{unavailable ? 'Unavailable' : 'Add'}</span>
                </button>
              );
            })}
          </div>
        )}
        <button type="button" onClick={() => setAddHeaderMenuOpen((open) => !open)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 14px', background: '#eff6ff', border: '1.5px dashed #93c5fd', borderRadius: '8px', color: '#1d4ed8', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
          <Plus size={15} /> Add Header Section
        </button>
      </div> : <div
        style={{
          position: 'relative',
          padding: '12px 16px 16px',
          borderTop: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          flexShrink: 0,
        }}
      >
        {addFooterMenuOpen && (
          <div style={{
            position: 'absolute',
            bottom: '68px',
            left: '16px',
            right: '16px',
            padding: '6px',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            boxShadow: '0 10px 24px rgba(15,23,42,0.14)',
            zIndex: 20
          }}>
            {[
              { type: 'trust', name: 'Trust & Guarantees' },
              { type: 'newsletter', name: 'Newsletter Signup' },
              { type: 'navigation', name: 'Footer' },
              { type: 'social', name: 'Social Media' },
              { type: 'legal', name: 'Legal & Bottom Bar' },
            ].map((option) => {
              const exists = store.footerRows.some((row) =>
                row.type === option.type || (option.type === 'navigation' && (row.type === 'navigation' || row.id === 'row-main-nav'))
              );
              const unavailable = exists;
              return (
                <button
                  key={option.type}
                  type="button"
                  disabled={unavailable}
                  onClick={() => {
                    store.addFooterRow(option.type as any, option.name);
                    setAddFooterMenuOpen(false);
                    useLandingEditorStore.getState().setRightSidebarOpen(true);
                  }}
                  style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    border: 0,
                    borderRadius: '5px',
                    background: unavailable ? '#f8fafc' : '#ffffff',
                    color: unavailable ? '#94a3b8' : '#0f172a',
                    cursor: unavailable ? 'not-allowed' : 'pointer',
                    fontSize: '12px',
                    textAlign: 'left',
                  }}
                >
                  <span>{option.name}</span>
                  <span>{unavailable ? 'Unavailable' : 'Add'}</span>
                </button>
              );
            })}
          </div>
        )}
        <button
          type="button"
          onClick={() => setAddFooterMenuOpen((open) => !open)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px 14px',
            background: '#eff6ff',
            border: '1.5px dashed #93c5fd',
            borderRadius: '8px',
            color: '#1d4ed8',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Plus size={15} /> Add Footer Section
        </button>
      </div>}
    </div>
  );
};
