// ============================================================
// FOOTER COMPONENT PICKER MODAL (CENTER OVERLAY WIDGET)
// Centered over the editor viewport, 8-category grouped,
// singleton validated with clear inline explanations.
// Supports all 43 footer directory components.
// ============================================================

import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Sparkles,
  FileText,
  BookOpen,
  Menu,
  ShoppingBag,
  Layers,
  HelpCircle,
  Building2,
  Compass,
  ListPlus,
  PhoneCall,
  Clock,
  Type,
  Image as ImageIcon,
  Code,
  Minus,
  Maximize2,
  Lock,
  Mail,
  Share2,
  CreditCard,
  ShieldCheck,
  Smartphone,
  Star,
  ExternalLink,
  Shield,
  MapPin,
  MessageCircle,
  Headphones,
  Award,
  Truck,
  Banknote,
  Users,
  Play,
  QrCode,
  LayoutList,
  Megaphone,
  LayoutGrid,
  Heading,
  Box,
  Apple,
} from 'lucide-react';
import { useEditorContextStore } from '../../../store/editorContextStore';
import { useLandingEditorStore } from '../../../store/landingEditorStore';
import {
  FOOTER_DIRECTORY_COMPONENTS,
  type ComponentPickerItem,
  type FooterComponentCategory,
} from './footerDirectoryModel';

interface FooterComponentPickerModalProps {
  isOpen: boolean;
  rowId: string;
  columnId: string;
  columnIdx?: number;
  groupId?: string;
  onClose: () => void;
}

// Icon renderer for picker items — maps icon names to Lucide components
const renderPickerIcon = (iconName: string, size = 18) => {
  const iconMap: Record<string, React.ReactNode> = {
    'Sparkles': <Sparkles size={size} color="#f59e0b" />,
    'FileText': <FileText size={size} color="#6366f1" />,
    'BookOpen': <BookOpen size={size} color="#8b5cf6" />,
    'Star': <Star size={size} color="#f59e0b" />,
    'Menu': <Menu size={size} color="#2563eb" />,
    'ShoppingBag': <ShoppingBag size={size} color="#10b981" />,
    'Layers': <Layers size={size} color="#0ea5e9" />,
    'LayoutGrid': <LayoutGrid size={size} color="#6366f1" />,
    'HelpCircle': <HelpCircle size={size} color="#ec4899" />,
    'Building2': <Building2 size={size} color="#64748b" />,
    'Compass': <Compass size={size} color="#f97316" />,
    'ListPlus': <ListPlus size={size} color="#14b8a6" />,
    'ExternalLink': <ExternalLink size={size} color="#2563eb" />,
    'Shield': <Shield size={size} color="#6366f1" />,
    'PhoneCall': <PhoneCall size={size} color="#38bdf8" />,
    'Clock': <Clock size={size} color="#10b981" />,
    'MapPin': <MapPin size={size} color="#f97316" />,
    'MessageCircle': <MessageCircle size={size} color="#25d366" />,
    'Headphones': <Headphones size={size} color="#6366f1" />,
    'CreditCard': <CreditCard size={size} color="#0ea5e9" />,
    'ShieldCheck': <ShieldCheck size={size} color="#10b981" />,
    'Award': <Award size={size} color="#f59e0b" />,
    'Truck': <Truck size={size} color="#0ea5e9" />,
    'Banknote': <Banknote size={size} color="#10b981" />,
    'Lock': <Lock size={size} color="#64748b" />,
    'Mail': <Mail size={size} color="#ec4899" />,
    'Share2': <Share2 size={size} color="#f59e0b" />,
    'Users': <Users size={size} color="#6366f1" />,
    'Smartphone': <Smartphone size={size} color="#6366f1" />,
    'Apple': <Apple size={size} color="#334155" />,
    'Play': <Play size={size} color="#10b981" />,
    'QrCode': <QrCode size={size} color="#6366f1" />,
    'Type': <Type size={size} color="#6366f1" />,
    'Image': <ImageIcon size={size} color="#8b5cf6" />,
    'LayoutList': <LayoutList size={size} color="#0ea5e9" />,
    'Megaphone': <Megaphone size={size} color="#ef4444" />,
    'Code': <Code size={size} color="#64748b" />,
    'GroupIcon': <Box size={size} color="#6366f1" />,
    'Heading': <Heading size={size} color="#334155" />,
    'Minus': <Minus size={size} color="#94a3b8" />,
    'Maximize2': <Maximize2 size={size} color="#94a3b8" />,
  };
  return iconMap[iconName] || <Sparkles size={size} color="#2563eb" />;
};

// Category display configuration
const CATEGORY_CONFIG: Record<FooterComponentCategory, { label: string; description: string; accentColor: string }> = {
  'BRAND': { label: 'Brand', description: 'Logo, bio, story, rating', accentColor: '#f59e0b' },
  'NAVIGATION': { label: 'Navigation', description: 'Link groups & directories', accentColor: '#2563eb' },
  'CONTACT': { label: 'Contact', description: 'Phone, email, store locator', accentColor: '#38bdf8' },
  'COMMERCE & TRUST': { label: 'Commerce & Trust', description: 'Payments, trust, guarantees', accentColor: '#10b981' },
  'ENGAGEMENT': { label: 'Engagement', description: 'Newsletter, social, community', accentColor: '#ec4899' },
  'APP': { label: 'App', description: 'Download badges, QR codes', accentColor: '#6366f1' },
  'CONTENT': { label: 'Content', description: 'Rich text, images, promos', accentColor: '#8b5cf6' },
  'LEGAL': { label: 'Legal', description: 'Copyright & notice', accentColor: '#64748b' },
  'LAYOUT': { label: 'Layout', description: 'Group, heading, divider, spacer', accentColor: '#94a3b8' },
};

// The ordered list of categories as they should appear in the picker
const CATEGORY_ORDER: FooterComponentCategory[] = [
  'BRAND',
  'NAVIGATION',
  'CONTACT',
  'COMMERCE & TRUST',
  'ENGAGEMENT',
  'APP',
  'CONTENT',
  'LEGAL',
  'LAYOUT',
];

export const FooterComponentPickerModal: React.FC<FooterComponentPickerModalProps> = ({
  isOpen,
  rowId,
  columnId,
  columnIdx = 0,
  groupId,
  onClose,
}) => {
  const { footerRows, addFooterElement, selectTarget } = useEditorContextStore();
  const { setRightSidebarOpen } = useLandingEditorStore();
  const [searchQuery, setSearchQuery] = useState('');

  const targetRow = footerRows.find((r) => r.id === rowId || r.type === 'navigation');

  // Compute which singletons are already used in which column
  const singletonUsage = useMemo(() => {
    const usage: Record<string, { colIndex: number; colId: string }> = {};
    if (!targetRow || !targetRow.columns) return usage;

    targetRow.columns.forEach((col, cIdx) => {
      (col.elements || []).forEach((el) => {
        if (el.type === 'logo') {
          usage['store-logo'] = { colIndex: cIdx + 1, colId: col.id };
        }
      });
    });
    return usage;
  }, [targetRow]);

  if (!isOpen) return null;

  // Filtered components grouped by the 8 specified categories
  const filteredByCategory = CATEGORY_ORDER.map((cat) => {
    const items = FOOTER_DIRECTORY_COMPONENTS.filter((comp) => {
      if (comp.category !== cat) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        comp.name.toLowerCase().includes(q) ||
        comp.description.toLowerCase().includes(q) ||
        (comp.preset && comp.preset.toLowerCase().includes(q)) ||
        comp.type.toLowerCase().includes(q)
      );
    });
    return { category: cat, items, config: CATEGORY_CONFIG[cat] };
  }).filter((group) => group.items.length > 0);

  const handleSelectComponent = (comp: ComponentPickerItem, isDisabled: boolean) => {
    if (isDisabled) return;

    const newElementId = `el-ftr-${comp.type}-${Date.now().toString(36)}`;
    const effectiveRowId = targetRow ? targetRow.id : rowId;
    const effectiveColId = columnId || (targetRow?.columns?.[0]?.id) || 'col-default';

    addFooterElement(
      effectiveRowId,
      effectiveColId,
      comp.type as any,
      comp.name,
      comp.defaults,
      groupId
    );

    // Automatically select newly inserted component to open child overlay in right sidebar
    selectTarget({
      type: 'element',
      editorType: 'footer',
      rowId: effectiveRowId,
      elementId: newElementId,
      elementType: comp.type,
    });
    setRightSidebarOpen(true);

    onClose();
  };

  const totalResults = filteredByCategory.reduce((acc, g) => acc + g.items.length, 0);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '88vh',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 20px 40px -8px rgba(0, 0, 0, 0.24), 0 0 0 1px rgba(0, 0, 0, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeInScale 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 24px',
            borderBottom: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
              Add Footer Component
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
              Target: Column {columnIdx + 1} • Footer Directory
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '6px',
              borderRadius: '8px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ padding: '14px 24px', borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 14px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            }}
          >
            <Search size={16} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search components..."
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
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0 }}
              >
                <X size={14} />
              </button>
            )}
          </div>
          {searchQuery && (
            <div style={{ marginTop: '6px', fontSize: '11px', color: '#94a3b8' }}>
              {totalResults} component{totalResults !== 1 ? 's' : ''} found
            </div>
          )}
        </div>

        {/* Component Category Groups */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 24px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {filteredByCategory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>No matching components found</p>
              <p style={{ margin: '4px 0 0', fontSize: '12px' }}>Try a different search term</p>
            </div>
          ) : (
            filteredByCategory.map((group) => (
              <div key={group.category} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* Category Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    paddingBottom: '4px',
                    borderBottom: `2px solid ${group.config.accentColor}15`,
                  }}
                >
                  <div
                    style={{
                      width: '3px',
                      height: '14px',
                      backgroundColor: group.config.accentColor,
                      borderRadius: '2px',
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      color: '#334155',
                      textTransform: 'uppercase',
                    }}
                  >
                    {group.config.label}
                  </span>
                  <span
                    style={{
                      fontSize: '10.5px',
                      color: '#94a3b8',
                      fontWeight: 400,
                    }}
                  >
                    {'\u2014'} {group.config.description}
                  </span>
                </div>

                {/* Component Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
                    gap: '8px',
                  }}
                >
                  {group.items.map((comp) => {
                    const isSingletonUsed = Boolean(comp.singleton && singletonUsage[comp.id]);
                    const usedColInfo = isSingletonUsed ? singletonUsage[comp.id] : null;

                    return (
                      <div
                        key={comp.id}
                        onClick={() => handleSelectComponent(comp, isSingletonUsed)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '10px',
                          border: isSingletonUsed ? '1px dashed #cbd5e1' : '1px solid #e2e8f0',
                          backgroundColor: isSingletonUsed ? '#f8fafc' : '#ffffff',
                          cursor: isSingletonUsed ? 'not-allowed' : 'pointer',
                          opacity: isSingletonUsed ? 0.65 : 1,
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          transition: 'all 0.15s ease',
                          position: 'relative',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSingletonUsed) {
                            e.currentTarget.style.borderColor = group.config.accentColor;
                            e.currentTarget.style.boxShadow = `0 4px 12px ${group.config.accentColor}12`;
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSingletonUsed) {
                            e.currentTarget.style.borderColor = '#e2e8f0';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.transform = 'none';
                          }
                        }}
                      >
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            backgroundColor: isSingletonUsed ? '#f1f5f9' : `${group.config.accentColor}10`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {renderPickerIcon(comp.icon, 16)}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                            <span
                              style={{
                                fontSize: '12.5px',
                                fontWeight: 700,
                                color: isSingletonUsed ? '#64748b' : '#0f172a',
                              }}
                            >
                              {comp.name}
                            </span>
                            {isSingletonUsed && (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px',
                                  fontSize: '10px',
                                  fontWeight: 600,
                                  color: '#dc2626',
                                  backgroundColor: '#fee2e2',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                <Lock size={10} /> In Column {usedColInfo?.colIndex}
                              </span>
                            )}
                          </div>
                          <p
                            style={{
                              margin: '2px 0 0',
                              fontSize: '10.5px',
                              color: '#64748b',
                              lineHeight: 1.4,
                            }}
                          >
                            {isSingletonUsed
                              ? `Already used in Column ${usedColInfo?.colIndex}. Duplicate not allowed.`
                              : comp.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '12px 24px',
            backgroundColor: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            fontSize: '11.5px',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>{FOOTER_DIRECTORY_COMPONENTS.length} components available across {CATEGORY_ORDER.length} categories</span>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: '12px',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
