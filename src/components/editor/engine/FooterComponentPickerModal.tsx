// ============================================================
// FOOTER COMPONENT PICKER MODAL (CENTER OVERLAY WIDGET)
// Centered over the editor viewport, category filtered,
// singleton validated with clear inline explanations.
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
} from 'lucide-react';
import { useEditorContextStore } from '../../../store/editorContextStore';
import { useLandingEditorStore } from '../../../store/landingEditorStore';
import {
  FOOTER_DIRECTORY_COMPONENTS,
  type ComponentPickerItem,
} from './footerDirectoryModel';

interface FooterComponentPickerModalProps {
  isOpen: boolean;
  rowId: string;
  columnId: string;
  columnIdx?: number;
  onClose: () => void;
}

// Icon renderer for picker items
const renderPickerIcon = (iconName: string, size = 18, color = '#2563eb') => {
  switch (iconName) {
    case 'Sparkles':
      return <Sparkles size={size} color="#f59e0b" />;
    case 'FileText':
      return <FileText size={size} color="#6366f1" />;
    case 'BookOpen':
      return <BookOpen size={size} color="#8b5cf6" />;
    case 'Menu':
      return <Menu size={size} color={color} />;
    case 'ShoppingBag':
      return <ShoppingBag size={size} color="#10b981" />;
    case 'Layers':
      return <Layers size={size} color="#0ea5e9" />;
    case 'HelpCircle':
      return <HelpCircle size={size} color="#ec4899" />;
    case 'Building2':
      return <Building2 size={size} color="#64748b" />;
    case 'Compass':
      return <Compass size={size} color="#f97316" />;
    case 'ListPlus':
      return <ListPlus size={size} color="#14b8a6" />;
    case 'PhoneCall':
      return <PhoneCall size={size} color="#38bdf8" />;
    case 'Clock':
      return <Clock size={size} color="#10b981" />;
    case 'Type':
      return <Type size={size} color="#6366f1" />;
    case 'Image':
      return <ImageIcon size={size} color="#8b5cf6" />;
    case 'Code':
      return <Code size={size} color="#64748b" />;
    case 'Minus':
      return <Minus size={size} color="#94a3b8" />;
    case 'Maximize2':
      return <Maximize2 size={size} color="#94a3b8" />;
    case 'Mail':
      return <Mail size={size} color="#ec4899" />;
    case 'Share2':
      return <Share2 size={size} color="#f59e0b" />;
    case 'CreditCard':
      return <CreditCard size={size} color="#0ea5e9" />;
    case 'ShieldCheck':
      return <ShieldCheck size={size} color="#10b981" />;
    case 'Smartphone':
      return <Smartphone size={size} color="#6366f1" />;
    default:
      return <Sparkles size={size} color={color} />;
  }
};

export const FooterComponentPickerModal: React.FC<FooterComponentPickerModalProps> = ({
  isOpen,
  rowId,
  columnId,
  columnIdx = 0,
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

  // Filtered components grouped by category
  const categories: Array<'BRANDING' | 'NAVIGATION' | 'CONTACT' | 'CONTENT' | 'LAYOUT'> = [
    'BRANDING',
    'NAVIGATION',
    'CONTACT',
    'CONTENT',
    'LAYOUT',
  ];

  const filteredByCategory = categories.map((cat) => {
    const items = FOOTER_DIRECTORY_COMPONENTS.filter((comp) => {
      if (comp.category !== cat) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        comp.name.toLowerCase().includes(q) ||
        comp.description.toLowerCase().includes(q) ||
        (comp.preset && comp.preset.toLowerCase().includes(q))
      );
    });
    return { category: cat, items };
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
      comp.defaults
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
          maxWidth: '640px',
          maxHeight: '85vh',
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
        </div>

        {/* Component Category Groups */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          {filteredByCategory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>No matching components found</p>
              <p style={{ margin: '4px 0 0', fontSize: '12px' }}>Try a different search term</p>
            </div>
          ) : (
            filteredByCategory.map((group) => (
              <div key={group.category} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    color: '#64748b',
                    textTransform: 'uppercase',
                  }}
                >
                  {group.category}
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: '10px',
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
                          padding: '12px 14px',
                          borderRadius: '10px',
                          border: isSingletonUsed ? '1px dashed #cbd5e1' : '1px solid #e2e8f0',
                          backgroundColor: isSingletonUsed ? '#f8fafc' : '#ffffff',
                          cursor: isSingletonUsed ? 'not-allowed' : 'pointer',
                          opacity: isSingletonUsed ? 0.65 : 1,
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px',
                          transition: 'all 0.15s ease',
                          position: 'relative',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSingletonUsed) {
                            e.currentTarget.style.borderColor = '#2563eb';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.08)';
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
                            width: '34px',
                            height: '34px',
                            borderRadius: '8px',
                            backgroundColor: isSingletonUsed ? '#f1f5f9' : '#eff6ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {renderPickerIcon(comp.icon, 18)}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                            <span
                              style={{
                                fontSize: '13px',
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
                              margin: '3px 0 0',
                              fontSize: '11px',
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

        {/* Modal Footer Tip */}
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
          <span>Tip: Newsletter, Social, Trust, & Legal rows belong in dedicated Footer Stack sections.</span>
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
