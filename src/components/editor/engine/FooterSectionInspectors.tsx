// ============================================================
// MASTER FOOTER ARCHITECTURE — FOOTER SECTION INSPECTORS
// Reusable Look-driven right sidebar inspectors for all 7
// independent Footer Stack sections:
// 1. Trust & Guarantees
// 2. Newsletter / Email Signup
// 3. Social / Community
// 4. App Download
// 5. Contact / Store Information
// 6. Payment & Security
// 7. Legal & Bottom Bar
// Tabs: Look | Content | Layout | Behavior* | Design | Responsive | Visibility | Advanced
// Chevrons only scroll the tab bar horizontally.
// ============================================================

import React, { useState, useRef } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Calendar,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Monitor,
  Tablet,
} from 'lucide-react';
import { useEditorContextStore } from '../../../store/editorContextStore';
import type { FooterRow } from './types';
import {
  FOOTER_STACK_SECTION_REGISTRY,
  switchSectionLook,
  getSectionSupportedTabs,
  type SectionLookDefinition,
} from './footerSectionsModel';
import styles from '../../../pages/editor/EditorLayout.module.css';

// ─── Shared Horizontal Scrolling Tab Navigation ─────────────
interface SectionTabsHeaderProps {
  title: string;
  activeTab: string;
  supportedTabs: string[];
  onSelectTab: (tab: any) => void;
  onClose: () => void;
}

export const SectionTabsHeader: React.FC<SectionTabsHeaderProps> = ({
  title,
  activeTab,
  supportedTabs,
  onSelectTab,
  onClose,
}) => {
  const tabsScrollRef = useRef<HTMLDivElement>(null);

  const handleScrollLeft = () => {
    if (tabsScrollRef.current) {
      tabsScrollRef.current.scrollBy({ left: -100, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (tabsScrollRef.current) {
      tabsScrollRef.current.scrollBy({ left: 100, behavior: 'smooth' });
    }
  };

  const TAB_LABELS: Record<string, string> = {
    look: 'Look',
    content: 'Content',
    layout: 'Layout',
    behavior: 'Behavior',
    design: 'Design',
    responsive: 'Responsive',
    visibility: 'Visibility',
    advanced: 'Advanced',
  };

  return (
    <div style={{ flexShrink: 0, backgroundColor: '#ffffff' }}>
      {/* Title Bar */}
      <div className={styles.panelHeader}>
        <div className={styles.phLeft}>
          <button className={styles.iconBtn} onClick={onClose} title="Collapse sidebar">
            <ChevronRight size={20} className={styles.backIcon} />
          </button>
          <h3 className={styles.fw600} style={{ margin: 0 }}>{title}</h3>
        </div>
      </div>

      {/* Tabs — text-only, matching other editors */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-color, #e2e8f0)',
          background: '#f8fafc',
        }}
      >
        <button
          type="button"
          onClick={handleScrollLeft}
          title="Scroll tabs left"
          style={{
            padding: '8px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: 'var(--text-muted, #64748b)',
            flexShrink: 0,
          }}
        >
          <ChevronLeft size={16} />
        </button>

        <div
          ref={tabsScrollRef}
          className={styles.propTabs}
          style={{
            overflowX: 'auto',
            flexWrap: 'nowrap',
            borderBottom: 'none',
            flex: 1,
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {supportedTabs.map((tabId) => (
            <div
              key={tabId}
              className={`${styles.propTab} ${activeTab === tabId ? styles.activePropTab : ''}`}
              onClick={() => onSelectTab(tabId)}
              style={{
                flex: '0 0 auto',
                padding: '12px 14px',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              {TAB_LABELS[tabId] || tabId}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleScrollRight}
          title="Scroll tabs right"
          style={{
            padding: '8px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: 'var(--text-muted, #64748b)',
            flexShrink: 0,
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

// ─── Shared Look Picker Component ───────────────────────────
interface LookPickerGridProps {
  looks: SectionLookDefinition[];
  currentLookId: string;
  onSelectLook: (lookId: string) => void;
}

export const LookPickerGrid: React.FC<LookPickerGridProps> = ({
  looks,
  currentLookId,
  onSelectLook,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.04em' }}>
        Select Section Look ({looks.length} Presets Available)
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {looks.map((look) => {
          const isSelected = look.id === currentLookId;
          return (
            <div
              key={look.id}
              onClick={() => onSelectLook(look.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                padding: '12px 14px',
                borderRadius: '8px',
                border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: isSelected ? '0 2px 8px rgba(37,99,235,0.1)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: isSelected ? '#1d4ed8' : '#0f172a' }}>
                  {look.name}
                </span>
                {isSelected && (
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#2563eb', backgroundColor: '#dbeafe', padding: '2px 8px', borderRadius: '12px' }}>
                    Active
                  </span>
                )}
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: isSelected ? '#3b82f6' : '#64748b', lineHeight: 1.4 }}>
                {look.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Shared Generic Tabs (Design, Responsive, Visibility, Advanced)
interface SharedTabProps {
  row: FooterRow;
  updateRow: (patch: Record<string, any>) => void;
}

export const SharedDesignTab: React.FC<SharedTabProps> = ({ row, updateRow }) => {
  const styling = row.styling || ({} as any);

  const handleUpdate = (patch: Record<string, any>) => {
    updateRow({ styling: { ...styling, ...patch } });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ padding: '10px 12px', backgroundColor: '#f0fdf4', borderRadius: '6px', border: '1px solid #bbf7d0', fontSize: '12px', color: '#166534', lineHeight: 1.4 }}>
        <strong>Global Palette Linked:</strong> Colors inherit from <code style={{ fontSize: '11px' }}>--footer-section-*</code> variables unless a custom color override is chosen below.
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
          Background Color
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="color"
            value={styling.bgColor || '#ffffff'}
            onChange={(e) => handleUpdate({ bgColor: e.target.value, bgType: 'custom' })}
            style={{ width: '36px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          />
          <input
            type="text"
            value={styling.bgColor || '#ffffff'}
            onChange={(e) => handleUpdate({ bgColor: e.target.value, bgType: 'custom' })}
            style={{ flex: 1, padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
          />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
          Text & Heading Color
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="color"
            value={styling.textColor || '#0f172a'}
            onChange={(e) => handleUpdate({ textColor: e.target.value })}
            style={{ width: '36px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          />
          <input
            type="text"
            value={styling.textColor || '#0f172a'}
            onChange={(e) => handleUpdate({ textColor: e.target.value })}
            style={{ flex: 1, padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
          />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
          Divider Border Color
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="color"
            value={styling.borderColor || '#e2e8f0'}
            onChange={(e) => handleUpdate({ borderColor: e.target.value })}
            style={{ width: '36px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          />
          <input
            type="text"
            value={styling.borderColor || '#e2e8f0'}
            onChange={(e) => handleUpdate({ borderColor: e.target.value })}
            style={{ flex: 1, padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={styling.borderTop !== false}
            onChange={(e) => handleUpdate({ borderTop: e.target.checked })}
          />
          <span>Show Top Border</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={styling.borderBottom === true}
            onChange={(e) => handleUpdate({ borderBottom: e.target.checked })}
          />
          <span>Show Bottom Border</span>
        </label>
      </div>
    </div>
  );
};

export const SharedResponsiveTab: React.FC<SharedTabProps> = ({ row, updateRow }) => {
  const resp = row.responsive || {};

  const handleUpdate = (patch: Record<string, any>) => {
    updateRow({ responsive: { ...resp, ...patch } });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
        Device Visibility & Layout Modes
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={resp.showOnDesktop !== false}
            onChange={(e) => handleUpdate({ showOnDesktop: e.target.checked })}
          />
          <Monitor size={15} color="#2563eb" />
          <span>Show on Desktop</span>
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={resp.showOnTablet !== false}
            onChange={(e) => handleUpdate({ showOnTablet: e.target.checked })}
          />
          <Tablet size={15} color="#0ea5e9" />
          <span>Show on Tablet</span>
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={resp.showOnMobile !== false}
            onChange={(e) => handleUpdate({ showOnMobile: e.target.checked })}
          />
          <Smartphone size={15} color="#10b981" />
          <span>Show on Mobile</span>
        </label>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
          Mobile Layout Format
        </label>
        <select
          value={resp.mobileLayout || 'stack'}
          onChange={(e) => handleUpdate({ mobileLayout: e.target.value })}
          style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
        >
          <option value="stack">Vertical Stack (Stacked items)</option>
          <option value="accordion">Accordion / Collapsible</option>
          <option value="horizontal-scroll">Horizontal Carousel / Scroll</option>
          <option value="compact">Compact Condensed Strip</option>
        </select>
      </div>
    </div>
  );
};

export const SharedVisibilityTab: React.FC<SharedTabProps> = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
        Page & Scheduling Rules
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
          Display Pages
        </label>
        <select
          defaultValue="all"
          style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
        >
          <option value="all">All Pages (Global Storewide)</option>
          <option value="homepage">Homepage Only</option>
          <option value="shop">Product & Catalog Pages Only</option>
          <option value="checkout">Cart & Checkout Only</option>
        </select>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
          Audience Segment
        </label>
        <select
          defaultValue="all"
          style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
        >
          <option value="all">Everyone (Guests + Logged-in)</option>
          <option value="guest">First-Time Visitors Only</option>
          <option value="registered">Registered Customers Only</option>
        </select>
      </div>

      <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, color: '#334155' }}>
          <Calendar size={14} color="#6366f1" />
          <span>Promotional Schedule Window</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <span style={{ fontSize: '10px', color: '#64748b' }}>Start Date</span>
            <input type="date" style={{ width: '100%', padding: '6px', fontSize: '11px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
          </div>
          <div>
            <span style={{ fontSize: '10px', color: '#64748b' }}>End Date</span>
            <input type="date" style={{ width: '100%', padding: '6px', fontSize: '11px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const SharedAdvancedTab: React.FC<SharedTabProps> = ({ row }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
        Developer & Accessibility Metadata
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
          Custom Section HTML ID
        </label>
        <input
          type="text"
          defaultValue={row.id}
          style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', fontFamily: 'monospace' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
          ARIA Landmark Role
        </label>
        <input
          type="text"
          defaultValue="region"
          style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', fontFamily: 'monospace' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
          Custom CSS Classes
        </label>
        <input
          type="text"
          placeholder="e.g. custom-trust-banner-dark"
          style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
        />
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────
// 1. TRUST & GUARANTEES INSPECTOR
// ────────────────────────────────────────────────────────────
export const TrustSectionInspector: React.FC<{ row: FooterRow; onClose: () => void }> = ({ row: propRow, onClose }) => {
  const { footerRows, updateFooterRow, updateFooterElement } = useEditorContextStore();
  const row = footerRows.find((r) => r.id === propRow.id) || propRow;

  const currentLookId = row.layout?.variantId || 'horizontal-benefits';
  const supportedTabs = getSectionSupportedTabs('trust', currentLookId);
  const [activeTab, setActiveTab] = useState<string>('look');

  const primaryCol = row.columns?.[0];
  const trustElement = primaryCol?.elements?.[0];
  const items: any[] = trustElement?.props?.items || [
    { icon: 'shield-check', title: 'Bank-Grade Security', description: '256-bit SSL encrypted payments' },
    { icon: 'truck', title: 'Fast Free Delivery', description: 'Orders shipped within 24 hours' },
    { icon: 'rotate-ccw', title: '30-Day Guarantees', description: 'Zero question return policy' },
    { icon: 'headphones', title: '24/7 Priority Support', description: 'Direct access to specialists' },
  ];

  const handleSelectLook = (newLookId: string) => {
    const updated = switchSectionLook(row, 'trust', newLookId);
    updateFooterRow(row.id, {
      layout: updated.layout,
      styling: updated.styling,
      behavior: updated.behavior,
    });
  };

  const handleUpdateItems = (newItems: any[]) => {
    if (trustElement) {
      updateFooterElement(row.id, trustElement.id, {
        props: { ...trustElement.props, items: newItems },
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#ffffff', overflow: 'hidden' }}>
      <SectionTabsHeader
        title="Trust & Guarantees"
        activeTab={activeTab}
        supportedTabs={supportedTabs}
        onSelectTab={setActiveTab}
        onClose={onClose}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {activeTab === 'look' && (
          <LookPickerGrid
            looks={FOOTER_STACK_SECTION_REGISTRY.trust.looks}
            currentLookId={currentLookId}
            onSelectLook={handleSelectLook}
          />
        )}

        {activeTab === 'content' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
                Trust Items ({items.length})
              </span>
              <button
                type="button"
                onClick={() => handleUpdateItems([...items, { icon: 'award', title: 'New Guarantee', description: 'Description text' }])}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <Plus size={12} /> Add Item
              </button>
            </div>

            {items.map((item, idx) => (
              <div key={idx} style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700 }}>Item {idx + 1}</span>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleUpdateItems(items.filter((_, i) => i !== idx))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={item.title}
                  placeholder="Guarantee Title"
                  onChange={(e) => {
                    const next = [...items];
                    next[idx].title = e.target.value;
                    handleUpdateItems(next);
                  }}
                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                />
                <input
                  type="text"
                  value={item.description}
                  placeholder="Short Description"
                  onChange={(e) => {
                    const next = [...items];
                    next[idx].description = e.target.value;
                    handleUpdateItems(next);
                  }}
                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'layout' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Items Per Row ({row.layout?.itemsPerRow || 4})
              </label>
              <input
                type="range"
                min="1"
                max="6"
                value={row.layout?.itemsPerRow || 4}
                onChange={(e) => updateFooterRow(row.id, { layout: { ...row.layout, itemsPerRow: Number(e.target.value) } })}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Vertical Padding ({row.layout?.paddingY ?? 28}px)
              </label>
              <input
                type="range"
                min="12"
                max="80"
                value={row.layout?.paddingY ?? 28}
                onChange={(e) => updateFooterRow(row.id, { layout: { ...row.layout, paddingY: Number(e.target.value) } })}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}

        {activeTab === 'behavior' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
              Micro-Animations & Scroll
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked />
              <span>Enable card hover lift animation</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
              <input type="checkbox" />
              <span>Auto-scroll carousel items</span>
            </label>
          </div>
        )}

        {activeTab === 'design' && <SharedDesignTab row={row} updateRow={(patch) => updateFooterRow(row.id, patch)} />}
        {activeTab === 'responsive' && <SharedResponsiveTab row={row} updateRow={(patch) => updateFooterRow(row.id, patch)} />}
        {activeTab === 'visibility' && <SharedVisibilityTab row={row} updateRow={(patch) => updateFooterRow(row.id, patch)} />}
        {activeTab === 'advanced' && <SharedAdvancedTab row={row} updateRow={(patch) => updateFooterRow(row.id, patch)} />}
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────
// 2. NEWSLETTER / EMAIL SIGNUP INSPECTOR
// ────────────────────────────────────────────────────────────
export const NewsletterSectionInspector: React.FC<{ row: FooterRow; onClose: () => void }> = ({ row: propRow, onClose }) => {
  const { footerRows, updateFooterRow, updateFooterElement } = useEditorContextStore();
  const row = footerRows.find((r) => r.id === propRow.id) || propRow;

  const currentLookId = row.layout?.variantId || 'centered-signup';
  const supportedTabs = getSectionSupportedTabs('newsletter', currentLookId);
  const [activeTab, setActiveTab] = useState<string>('look');

  const primaryCol = row.columns?.[0];
  const newsElement = primaryCol?.elements?.[0];
  const elProps = newsElement?.props || {};

  const handleSelectLook = (newLookId: string) => {
    const updated = switchSectionLook(row, 'newsletter', newLookId);
    updateFooterRow(row.id, {
      layout: updated.layout,
      styling: updated.styling,
      behavior: updated.behavior,
    });
  };

  const handleUpdateProps = (patch: Record<string, any>) => {
    if (newsElement) {
      updateFooterElement(row.id, newsElement.id, {
        props: { ...newsElement.props, ...patch },
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#ffffff', overflow: 'hidden' }}>
      <SectionTabsHeader
        title="Newsletter / Email Signup"
        activeTab={activeTab}
        supportedTabs={supportedTabs}
        onSelectTab={setActiveTab}
        onClose={onClose}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {activeTab === 'look' && (
          <LookPickerGrid
            looks={FOOTER_STACK_SECTION_REGISTRY.newsletter.looks}
            currentLookId={currentLookId}
            onSelectLook={handleSelectLook}
          />
        )}

        {activeTab === 'content' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Heading Title
              </label>
              <input
                type="text"
                value={elProps.title || 'Stay in the loop'}
                onChange={(e) => handleUpdateProps({ title: e.target.value })}
                style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Subtitle / Description
              </label>
              <textarea
                rows={2}
                value={elProps.subtitle || 'Subscribe for weekly releases, member stories & exclusive offers.'}
                onChange={(e) => handleUpdateProps({ subtitle: e.target.value })}
                style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Button Text
              </label>
              <input
                type="text"
                value={elProps.buttonText || 'Subscribe'}
                onChange={(e) => handleUpdateProps({ buttonText: e.target.value })}
                style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Input Placeholder
              </label>
              <input
                type="text"
                value={elProps.placeholder || 'Enter your email...'}
                onChange={(e) => handleUpdateProps({ placeholder: e.target.value })}
                style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              />
            </div>
          </div>
        )}

        {activeTab === 'layout' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Max Form Width ({row.layout?.formWidth || 480}px)
              </label>
              <input
                type="range"
                min="320"
                max="800"
                value={row.layout?.formWidth || 480}
                onChange={(e) => updateFooterRow(row.id, { layout: { ...row.layout, formWidth: Number(e.target.value) } })}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}

        {activeTab === 'behavior' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
              Submission & Consent Behavior
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked />
              <span>Show inline checkmark success state</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked />
              <span>Prevent duplicate email submissions</span>
            </label>
          </div>
        )}

        {activeTab === 'design' && <SharedDesignTab row={row} updateRow={(patch) => updateFooterRow(row.id, patch)} />}
        {activeTab === 'responsive' && <SharedResponsiveTab row={row} updateRow={(patch) => updateFooterRow(row.id, patch)} />}
        {activeTab === 'visibility' && <SharedVisibilityTab row={row} updateRow={(patch) => updateFooterRow(row.id, patch)} />}
        {activeTab === 'advanced' && <SharedAdvancedTab row={row} updateRow={(patch) => updateFooterRow(row.id, patch)} />}
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────
// 3. SOCIAL / COMMUNITY INSPECTOR
// ────────────────────────────────────────────────────────────
export const SocialSectionInspector: React.FC<{ row: FooterRow; onClose: () => void }> = ({ row: propRow, onClose }) => {
  const { footerRows, updateFooterRow, updateFooterElement } = useEditorContextStore();
  const row = footerRows.find((r) => r.id === propRow.id) || propRow;

  const currentLookId = row.layout?.variantId || 'icon-row';
  const supportedTabs = getSectionSupportedTabs('social', currentLookId);
  const [activeTab, setActiveTab] = useState<string>('look');

  const primaryCol = row.columns?.[0];
  const socialEl = primaryCol?.elements?.[0];
  const platforms: any[] = socialEl?.props?.platforms || [
    { platform: 'twitter', url: 'https://twitter.com', enabled: true },
    { platform: 'instagram', url: 'https://instagram.com', enabled: true },
    { platform: 'linkedin', url: 'https://linkedin.com', enabled: true },
    { platform: 'youtube', url: 'https://youtube.com', enabled: true },
  ];

  const handleSelectLook = (newLookId: string) => {
    const updated = switchSectionLook(row, 'social', newLookId);
    updateFooterRow(row.id, {
      layout: updated.layout,
      styling: updated.styling,
      behavior: updated.behavior,
    });
  };

  const handleTogglePlatform = (idx: number) => {
    const next = [...platforms];
    next[idx].enabled = !next[idx].enabled;
    if (socialEl) {
      updateFooterElement(row.id, socialEl.id, {
        props: { ...socialEl.props, platforms: next },
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#ffffff', overflow: 'hidden' }}>
      <SectionTabsHeader
        title="Social / Community"
        activeTab={activeTab}
        supportedTabs={supportedTabs}
        onSelectTab={setActiveTab}
        onClose={onClose}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {activeTab === 'look' && (
          <LookPickerGrid
            looks={FOOTER_STACK_SECTION_REGISTRY.social.looks}
            currentLookId={currentLookId}
            onSelectLook={handleSelectLook}
          />
        )}

        {activeTab === 'content' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
              Active Social Profiles
            </div>

            {platforms.map((p, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#f8fafc' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, textTransform: 'capitalize' }}>{p.platform}</span>
                <input
                  type="checkbox"
                  checked={p.enabled}
                  onChange={() => handleTogglePlatform(idx)}
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'layout' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Icon Gap ({row.layout?.gap ?? 16}px)
              </label>
              <input
                type="range"
                min="8"
                max="40"
                value={row.layout?.gap ?? 16}
                onChange={(e) => updateFooterRow(row.id, { layout: { ...row.layout, gap: Number(e.target.value) } })}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}

        {activeTab === 'behavior' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked />
              <span>Glow & elevate icon on hover</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked />
              <span>Open social link in external tab</span>
            </label>
          </div>
        )}

        {activeTab === 'design' && <SharedDesignTab row={row} updateRow={(patch) => updateFooterRow(row.id, patch)} />}
        {activeTab === 'responsive' && <SharedResponsiveTab row={row} updateRow={(patch) => updateFooterRow(row.id, patch)} />}
        {activeTab === 'visibility' && <SharedVisibilityTab row={row} updateRow={(patch) => updateFooterRow(row.id, patch)} />}
        {activeTab === 'advanced' && <SharedAdvancedTab row={row} updateRow={(patch) => updateFooterRow(row.id, patch)} />}
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────
// 4. APP DOWNLOAD INSPECTOR
// ────────────────────────────────────────────────────────────
export const AppSectionInspector: React.FC<{ row: FooterRow; onClose: () => void }> = ({ row: propRow, onClose }) => {
  const { footerRows, updateFooterRow, updateFooterElement } = useEditorContextStore();
  const row = footerRows.find((r) => r.id === propRow.id) || propRow;

  const currentLookId = row.layout?.variantId || 'simple-app-cta';
  const supportedTabs = getSectionSupportedTabs('app', currentLookId);
  const [activeTab, setActiveTab] = useState<string>('look');

  const primaryCol = row.columns?.[0];
  const appEl = primaryCol?.elements?.[0];
  const elProps = appEl?.props || {};

  const handleSelectLook = (newLookId: string) => {
    const updated = switchSectionLook(row, 'app', newLookId);
    updateFooterRow(row.id, {
      layout: updated.layout,
      styling: updated.styling,
      behavior: updated.behavior,
    });
  };

  const handleUpdateProps = (patch: Record<string, any>) => {
    if (appEl) {
      updateFooterElement(row.id, appEl.id, {
        props: { ...appEl.props, ...patch },
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#ffffff', overflow: 'hidden' }}>
      <SectionTabsHeader
        title="App Download"
        activeTab={activeTab}
        supportedTabs={supportedTabs}
        onSelectTab={setActiveTab}
        onClose={onClose}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {activeTab === 'look' && (
          <LookPickerGrid
            looks={FOOTER_STACK_SECTION_REGISTRY.app.looks}
            currentLookId={currentLookId}
            onSelectLook={handleSelectLook}
          />
        )}

        {activeTab === 'content' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Heading
              </label>
              <input
                type="text"
                value={elProps.heading || 'Get the Mobile Experience'}
                onChange={(e) => handleUpdateProps({ heading: e.target.value })}
                style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                App Store URL
              </label>
              <input
                type="text"
                value={elProps.appStoreUrl || '#'}
                onChange={(e) => handleUpdateProps({ appStoreUrl: e.target.value })}
                style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Google Play URL
              </label>
              <input
                type="text"
                value={elProps.googlePlayUrl || '#'}
                onChange={(e) => handleUpdateProps({ googlePlayUrl: e.target.value })}
                style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
              />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={elProps.qrEnabled !== false}
                onChange={(e) => handleUpdateProps({ qrEnabled: e.target.checked })}
              />
              <span>Display Instant QR Code</span>
            </label>
          </div>
        )}

        {activeTab === 'layout' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Vertical Padding ({row.layout?.paddingY ?? 36}px)
              </label>
              <input
                type="range"
                min="16"
                max="80"
                value={row.layout?.paddingY ?? 36}
                onChange={(e) => updateFooterRow(row.id, { layout: { ...row.layout, paddingY: Number(e.target.value) } })}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}

        {activeTab === 'design' && <SharedDesignTab row={row} updateRow={(patch) => updateFooterRow(row.id, patch)} />}
        {activeTab === 'responsive' && <SharedResponsiveTab row={row} updateRow={(patch) => updateFooterRow(row.id, patch)} />}
        {activeTab === 'visibility' && <SharedVisibilityTab row={row} updateRow={(patch) => updateFooterRow(row.id, patch)} />}
        {activeTab === 'advanced' && <SharedAdvancedTab row={row} updateRow={(patch) => updateFooterRow(row.id, patch)} />}
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────
// 5. CONTACT / STORE INFORMATION INSPECTOR
// ────────────────────────────────────────────────────────────
export const ContactSectionInspector: React.FC<{ row: FooterRow; onClose: () => void }> = ({ row: propRow, onClose }) => {
  const { footerRows, updateFooterRow, updateFooterElement } = useEditorContextStore();
  const row = footerRows.find((r) => r.id === propRow.id) || propRow;

  const currentLookId = row.layout?.variantId || 'contact-list';
  const supportedTabs = getSectionSupportedTabs('contact', currentLookId);
  const [activeTab, setActiveTab] = useState<string>('look');

  const primaryCol = row.columns?.[0];
  const contactEl = primaryCol?.elements?.[0];
  const elProps = contactEl?.props || {};

  const handleSelectLook = (newLookId: string) => {
    const updated = switchSectionLook(row, 'contact', newLookId);
    updateFooterRow(row.id, {
      layout: updated.layout,
      styling: updated.styling,
      behavior: updated.behavior,
    });
  };

  const handleUpdateProps = (patch: Record<string, any>) => {
    if (contactEl) {
      updateFooterElement(row.id, contactEl.id, {
        props: { ...contactEl.props, ...patch },
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#ffffff', overflow: 'hidden' }}>
      <SectionTabsHeader
        title="Contact / Store Information"
        activeTab={activeTab}
        supportedTabs={supportedTabs}
        onSelectTab={setActiveTab}
        onClose={onClose}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {activeTab === 'look' && (
          <LookPickerGrid
            looks={FOOTER_STACK_SECTION_REGISTRY.contact.looks}
            currentLookId={currentLookId}
            onSelectLook={handleSelectLook}
          />
        )}

        {activeTab === 'content' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Phone Number
              </label>
              <input
                type="text"
                value={elProps.phone || '+1 (800) 555-0199'}
                onChange={(e) => handleUpdateProps({ phone: e.target.value })}
                style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Support Email Address
              </label>
              <input
                type="email"
                value={elProps.email || 'support@billionbiz.com'}
                onChange={(e) => handleUpdateProps({ email: e.target.value })}
                style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Store Physical Address
              </label>
              <input
                type="text"
                value={elProps.address || '742 Evergreen Terrace, San Francisco, CA 94107'}
                onChange={(e) => handleUpdateProps({ address: e.target.value })}
                style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Business Hours
              </label>
              <input
                type="text"
                value={elProps.hours || 'Mon – Fri: 9:00 AM – 7:00 PM EST'}
                onChange={(e) => handleUpdateProps({ hours: e.target.value })}
                style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              />
            </div>
          </div>
        )}

        {activeTab === 'layout' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Vertical Padding ({row.layout?.paddingY ?? 32}px)
              </label>
              <input
                type="range"
                min="16"
                max="80"
                value={row.layout?.paddingY ?? 32}
                onChange={(e) => updateFooterRow(row.id, { layout: { ...row.layout, paddingY: Number(e.target.value) } })}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}

        {activeTab === 'design' && <SharedDesignTab row={row} updateRow={(patch) => updateFooterRow(row.id, patch)} />}
        {activeTab === 'responsive' && <SharedResponsiveTab row={row} updateRow={(patch) => updateFooterRow(row.id, patch)} />}
        {activeTab === 'visibility' && <SharedVisibilityTab row={row} updateRow={(patch) => updateFooterRow(row.id, patch)} />}
        {activeTab === 'advanced' && <SharedAdvancedTab row={row} updateRow={(patch) => updateFooterRow(row.id, patch)} />}
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────
// 6. PAYMENT & SECURITY INSPECTOR
// ────────────────────────────────────────────────────────────
export const PaymentSectionInspector: React.FC<{ row: FooterRow; onClose: () => void }> = ({ row: propRow, onClose }) => {
  const { footerRows, updateFooterRow, updateFooterElement } = useEditorContextStore();
  const row = footerRows.find((r) => r.id === propRow.id) || propRow;

  const currentLookId = row.layout?.variantId || 'payment-logos';
  const supportedTabs = getSectionSupportedTabs('payment', currentLookId);
  const [activeTab, setActiveTab] = useState<string>('look');

  const primaryCol = row.columns?.[0];
  const paymentEl = primaryCol?.elements?.[0];
  const elProps = paymentEl?.props || {};

  const handleSelectLook = (newLookId: string) => {
    const updated = switchSectionLook(row, 'payment', newLookId);
    updateFooterRow(row.id, {
      layout: updated.layout,
      styling: updated.styling,
      behavior: updated.behavior,
    });
  };

  const handleUpdateProps = (patch: Record<string, any>) => {
    if (paymentEl) {
      updateFooterElement(row.id, paymentEl.id, {
        props: { ...paymentEl.props, ...patch },
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#ffffff', overflow: 'hidden' }}>
      <SectionTabsHeader
        title="Payment & Security"
        activeTab={activeTab}
        supportedTabs={supportedTabs}
        onSelectTab={setActiveTab}
        onClose={onClose}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {activeTab === 'look' && (
          <LookPickerGrid
            looks={FOOTER_STACK_SECTION_REGISTRY.payment.looks}
            currentLookId={currentLookId}
            onSelectLook={handleSelectLook}
          />
        )}

        {activeTab === 'content' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
              Badges & Trust Assurances
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={elProps.showSecurity !== false}
                onChange={(e) => handleUpdateProps({ showSecurity: e.target.checked })}
              />
              <ShieldCheck size={16} color="#10b981" />
              <span>Show 256-Bit SSL Protection Badge</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={elProps.showCOD === true}
                onChange={(e) => handleUpdateProps({ showCOD: e.target.checked })}
              />
              <CreditCard size={16} color="#0ea5e9" />
              <span>Highlight Cash on Delivery (COD)</span>
            </label>
          </div>
        )}

        {activeTab === 'layout' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Vertical Padding ({row.layout?.paddingY ?? 22}px)
              </label>
              <input
                type="range"
                min="12"
                max="60"
                value={row.layout?.paddingY ?? 22}
                onChange={(e) => updateFooterRow(row.id, { layout: { ...row.layout, paddingY: Number(e.target.value) } })}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}

        {activeTab === 'design' && <SharedDesignTab row={row} updateRow={(patch) => updateFooterRow(row.id, patch)} />}
        {activeTab === 'responsive' && <SharedResponsiveTab row={row} updateRow={(patch) => updateFooterRow(row.id, patch)} />}
        {activeTab === 'visibility' && <SharedVisibilityTab row={row} updateRow={(patch) => updateFooterRow(row.id, patch)} />}
        {activeTab === 'advanced' && <SharedAdvancedTab row={row} updateRow={(patch) => updateFooterRow(row.id, patch)} />}
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────
// 7. LEGAL & BOTTOM BAR INSPECTOR
// ────────────────────────────────────────────────────────────
export const LegalSectionInspector: React.FC<{ row: FooterRow; onClose: () => void }> = ({ row: propRow, onClose }) => {
  const { footerRows, updateFooterRow, updateFooterElement } = useEditorContextStore();
  const row = footerRows.find((r) => r.id === propRow.id) || propRow;

  const currentLookId = row.layout?.variantId || 'classic-bottom-bar';
  const supportedTabs = getSectionSupportedTabs('legal', currentLookId);
  const [activeTab, setActiveTab] = useState<string>('look');

  const elements = (row.columns || []).flatMap((c) => c.elements) || [];
  const copyrightEl: any = elements.find((e) => e.type === 'copyright') || elements[0];
  const policyEl: any = elements.find((e) => e.type === 'policy-links');

  const copyrightText = copyrightEl?.props?.text || '© {year} BillionBiz Technologies Inc. Built with BillionBiz Engine.';
  const policyLinks: any[] = policyEl?.props?.links || [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Settings', href: '#cookies' },
    { label: 'Security', href: '/security' },
  ];

  const handleSelectLook = (newLookId: string) => {
    const updated = switchSectionLook(row, 'legal', newLookId);
    updateFooterRow(row.id, {
      layout: updated.layout,
      styling: updated.styling,
      behavior: updated.behavior,
    });
  };

  const handleUpdateCopyright = (text: string) => {
    if (copyrightEl) {
      updateFooterElement(row.id, copyrightEl.id, {
        props: { ...copyrightEl.props, text },
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#ffffff', overflow: 'hidden' }}>
      <SectionTabsHeader
        title="Legal & Bottom Bar"
        activeTab={activeTab}
        supportedTabs={supportedTabs}
        onSelectTab={setActiveTab}
        onClose={onClose}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {activeTab === 'look' && (
          <LookPickerGrid
            looks={FOOTER_STACK_SECTION_REGISTRY.legal.looks}
            currentLookId={currentLookId}
            onSelectLook={handleSelectLook}
          />
        )}

        {activeTab === 'content' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Copyright Statement (Use {'{year}'} for dynamic year)
              </label>
              <textarea
                rows={2}
                value={copyrightText}
                onChange={(e) => handleUpdateCopyright(e.target.value)}
                style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
              />
            </div>

            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
              Policy Links ({policyLinks.length})
            </div>
            {policyLinks.map((link, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  value={link.label}
                  readOnly
                  style={{ flex: 1, padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px', backgroundColor: '#f8fafc' }}
                />
                <input
                  type="text"
                  value={link.href}
                  readOnly
                  style={{ width: '100px', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '11px', backgroundColor: '#f8fafc', color: '#64748b' }}
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'layout' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Vertical Padding ({row.layout?.paddingY ?? 24}px)
              </label>
              <input
                type="range"
                min="12"
                max="60"
                value={row.layout?.paddingY ?? 24}
                onChange={(e) => updateFooterRow(row.id, { layout: { ...row.layout, paddingY: Number(e.target.value) } })}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}

        {activeTab === 'design' && <SharedDesignTab row={row} updateRow={(patch) => updateFooterRow(row.id, patch)} />}
        {activeTab === 'responsive' && <SharedResponsiveTab row={row} updateRow={(patch) => updateFooterRow(row.id, patch)} />}
        {activeTab === 'visibility' && <SharedVisibilityTab row={row} updateRow={(patch) => updateFooterRow(row.id, patch)} />}
        {activeTab === 'advanced' && <SharedAdvancedTab row={row} updateRow={(patch) => updateFooterRow(row.id, patch)} />}
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────
// 8. SEO / RICH CONTENT INSPECTOR
// ────────────────────────────────────────────────────────────
export const SeoSectionInspector: React.FC<{ row: FooterRow; onClose: () => void }> = ({ row: propRow, onClose }) => {
  const { footerRows, updateFooterRow, updateFooterElement } = useEditorContextStore();
  const row = footerRows.find((r) => r.id === propRow.id) || propRow;

  const currentLookId = row.layout?.variantId || 'keyword-story';
  const supportedTabs = getSectionSupportedTabs('seo', currentLookId);
  const [activeTab, setActiveTab] = useState<string>('look');
  const [newKeyword, setNewKeyword] = useState<string>('');

  const elements = (row.columns || []).flatMap((c) => c.elements) || [];
  const seoEl: any = elements.find((e) => e.type === 'rich-text' || e.type === 'custom-html') || elements[0];

  const seoHeading = seoEl?.props?.heading ?? 'Discover Premium Online Shopping with BillionBiz';
  const seoText = seoEl?.props?.text ?? 'We curate authentic, premium essentials crafted for conscious consumers. Enjoy lightning-fast doorstep shipping across India, guaranteed genuine products, hassle-free returns, and dedicated 24/7 customer concierge support.';
  const keywords: string[] = seoEl?.props?.keywords || [
    'Organic Skincare',
    'Ayurvedic Products',
    'Eco-Friendly Essentials',
    'Pan-India Fast Delivery',
    '100% Genuine Certified',
  ];
  const isExpandable = seoEl?.props?.isExpandable ?? true;
  const enableSchema = seoEl?.props?.enableSchema ?? true;

  const handleSelectLook = (newLookId: string) => {
    const updated = switchSectionLook(row, 'seo', newLookId);
    updateFooterRow(row.id, {
      layout: updated.layout,
      styling: updated.styling,
      behavior: updated.behavior,
    });
  };

  const handleUpdateProps = (partialProps: Record<string, any>) => {
    if (seoEl) {
      updateFooterElement(row.id, seoEl.id, {
        props: { ...seoEl.props, ...partialProps },
      });
    } else {
      updateFooterRow(row.id, {
        behavior: { ...row.behavior, ...partialProps },
      });
    }
  };

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;
    const updated = [...keywords, newKeyword.trim()];
    handleUpdateProps({ keywords: updated });
    setNewKeyword('');
  };

  const handleRemoveKeyword = (index: number) => {
    const updated = keywords.filter((_, idx) => idx !== index);
    handleUpdateProps({ keywords: updated });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#ffffff', overflow: 'hidden' }}>
      <SectionTabsHeader
        title="SEO / Rich Content"
        activeTab={activeTab}
        supportedTabs={supportedTabs}
        onSelectTab={setActiveTab}
        onClose={onClose}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {activeTab === 'look' && (
          <LookPickerGrid
            looks={FOOTER_STACK_SECTION_REGISTRY.seo.looks}
            currentLookId={currentLookId}
            onSelectLook={handleSelectLook}
          />
        )}

        {activeTab === 'content' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                SEO Section Heading
              </label>
              <input
                type="text"
                value={seoHeading}
                onChange={(e) => handleUpdateProps({ heading: e.target.value })}
                placeholder="Section title for search engines..."
                style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Rich SEO Content & Keyword Story
              </label>
              <textarea
                rows={5}
                value={seoText}
                onChange={(e) => handleUpdateProps({ text: e.target.value })}
                placeholder="High-density, organic keyword-rich copy describing products, categories, delivery, and guarantee..."
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', lineHeight: 1.5 }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Target Keywords & Tags ({keywords.length})
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                {keywords.map((kw, idx) => (
                  <span
                    key={idx}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      backgroundColor: '#eff6ff',
                      color: '#1d4ed8',
                      fontSize: '11px',
                      fontWeight: 600,
                      border: '1px solid #bfdbfe',
                    }}
                  >
                    #{kw}
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(idx)}
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#93c5fd', display: 'flex', alignItems: 'center' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#93c5fd'; }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddKeyword(); }}
                  placeholder="Add search keyword or phrase..."
                  style={{ flex: 1, padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                />
                <button
                  type="button"
                  onClick={handleAddKeyword}
                  style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Add
                </button>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', color: '#1e293b', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={isExpandable}
                  onChange={(e) => handleUpdateProps({ isExpandable: e.target.checked })}
                />
                Enable "Read More / Show Less" expandable block
              </label>
              <p style={{ margin: '4px 0 0 22px', fontSize: '11px', color: '#64748b' }}>
                Truncates long SEO copy on initial view to keep footer compact while preserving full search engine indexability.
              </p>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', color: '#1e293b', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={enableSchema}
                  onChange={(e) => handleUpdateProps({ enableSchema: e.target.checked })}
                />
                Inject JSON-LD Structured Data Schema
              </label>
              <p style={{ margin: '4px 0 0 22px', fontSize: '11px', color: '#64748b' }}>
                Outputs rich Organization and WebSite microdata for Google and Bing snippet optimization.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'layout' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Container Width
              </label>
              <select
                value={row.layout?.container || 'constrained'}
                onChange={(e) => updateFooterRow(row.id, { layout: { ...row.layout, container: e.target.value as any } })}
                style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
              >
                <option value="constrained">Constrained (Standard)</option>
                <option value="full">Full Width</option>
                <option value="boxed">Boxed Container</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Text Alignment
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(['left', 'center', 'right'] as const).map((align) => (
                  <button
                    key={align}
                    type="button"
                    onClick={() => updateFooterRow(row.id, { layout: { ...row.layout, alignment: align } })}
                    style={{
                      flex: 1,
                      padding: '6px',
                      borderRadius: '5px',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      textTransform: 'capitalize',
                      border: '1px solid',
                      borderColor: (row.layout?.alignment || 'left') === align ? '#2563eb' : '#cbd5e1',
                      backgroundColor: (row.layout?.alignment || 'left') === align ? '#eff6ff' : '#ffffff',
                      color: (row.layout?.alignment || 'left') === align ? '#1d4ed8' : '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    {align}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Vertical Padding ({row.layout?.paddingY ?? 32}px)
              </label>
              <input
                type="range"
                min="12"
                max="80"
                value={row.layout?.paddingY ?? 32}
                onChange={(e) => updateFooterRow(row.id, { layout: { ...row.layout, paddingY: Number(e.target.value) } })}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}

        {activeTab === 'behavior' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Collapsed Height ({row.behavior?.collapsedHeight ?? 70}px)
              </label>
              <input
                type="range"
                min="40"
                max="200"
                value={row.behavior?.collapsedHeight ?? 70}
                onChange={(e) => updateFooterRow(row.id, { behavior: { ...row.behavior, collapsedHeight: Number(e.target.value) } })}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}

        {activeTab === 'design' && <SharedDesignTab row={row} updateRow={(patch) => updateFooterRow(row.id, patch)} />}
        {activeTab === 'responsive' && <SharedResponsiveTab row={row} updateRow={(patch) => updateFooterRow(row.id, patch)} />}
        {activeTab === 'visibility' && <SharedVisibilityTab row={row} updateRow={(patch) => updateFooterRow(row.id, patch)} />}
        {activeTab === 'advanced' && <SharedAdvancedTab row={row} updateRow={(patch) => updateFooterRow(row.id, patch)} />}
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────
// 8. CATEGORY DIRECTORY LINKS INSPECTOR
// ────────────────────────────────────────────────────────────
export const CategoryLinksSectionInspector: React.FC<{ row: FooterRow; onClose: () => void }> = ({ row: propRow, onClose }) => {
  const { footerRows, updateFooterRow, updateFooterElement } = useEditorContextStore();
  const row = (footerRows || []).find((r) => r.id === propRow.id) || propRow;

  const currentLookId = row.layout?.variantId || 'classic-inline-comma';
  const supportedTabs = getSectionSupportedTabs('category-links', currentLookId);
  const [activeTab, setActiveTab] = useState<string>('look');
  const [expandedCatId, setExpandedCatId] = useState<string | null>(null);
  const [bulkCatId, setBulkCatId] = useState<string | null>(null);
  const [bulkText, setBulkText] = useState<string>('');

  const primaryCol = row.columns?.[0];
  const catElement = primaryCol?.elements?.[0];
  const elProps = catElement?.props || {};

  const categories: any[] = elProps.categories || [];
  const separator = elProps.separator ?? ', ';
  const titleTransform = elProps.titleTransform || 'uppercase';

  const handleSelectLook = (newLookId: string) => {
    const updated = switchSectionLook(row, 'category-links', newLookId);
    updateFooterRow(row.id, {
      layout: updated.layout,
      styling: updated.styling,
      behavior: updated.behavior,
    });
  };

  const handleUpdateProps = (patch: Record<string, any>) => {
    if (catElement) {
      updateFooterElement(row.id, catElement.id, {
        props: { ...catElement.props, ...patch },
      });
    }
  };

  const handleAddCategory = () => {
    const newCat = {
      id: `cat-${Date.now().toString(36)}`,
      name: 'NEW CATEGORY',
      links: [
        { label: 'Example Link 1', url: '#' },
        { label: 'Example Link 2', url: '#' },
      ],
    };
    handleUpdateProps({ categories: [...categories, newCat] });
    setExpandedCatId(newCat.id);
  };

  const handleDeleteCategory = (catId: string) => {
    handleUpdateProps({ categories: categories.filter((c) => c.id !== catId) });
  };

  const handleUpdateCategoryName = (catId: string, name: string) => {
    handleUpdateProps({
      categories: categories.map((c) => (c.id === catId ? { ...c, name } : c)),
    });
  };

  const handleAddLink = (catId: string) => {
    handleUpdateProps({
      categories: categories.map((c) =>
        c.id === catId
          ? { ...c, links: [...c.links, { label: 'New Link', url: '#' }] }
          : c
      ),
    });
  };

  const handleDeleteLink = (catId: string, linkIdx: number) => {
    handleUpdateProps({
      categories: categories.map((c) =>
        c.id === catId
          ? { ...c, links: c.links.filter((_: any, i: number) => i !== linkIdx) }
          : c
      ),
    });
  };

  const handleUpdateLink = (catId: string, linkIdx: number, patch: Partial<{ label: string; url: string }>) => {
    handleUpdateProps({
      categories: categories.map((c) =>
        c.id === catId
          ? {
              ...c,
              links: c.links.map((l: any, i: number) => (i === linkIdx ? { ...l, ...patch } : l)),
            }
          : c
      ),
    });
  };

  const handleBulkAdd = (catId: string) => {
    if (!bulkText.trim()) return;
    const lines = bulkText.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
    const newLinks = lines.map((label) => ({ label, url: '#' }));
    handleUpdateProps({
      categories: categories.map((c) =>
        c.id === catId ? { ...c, links: [...c.links, ...newLinks] } : c
      ),
    });
    setBulkText('');
    setBulkCatId(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#ffffff', overflow: 'hidden' }}>
      <SectionTabsHeader
        title="Category Directory Links"
        activeTab={activeTab}
        supportedTabs={supportedTabs}
        onSelectTab={setActiveTab}
        onClose={onClose}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {activeTab === 'look' && (
          <LookPickerGrid
            looks={FOOTER_STACK_SECTION_REGISTRY['category-links'].looks}
            currentLookId={currentLookId}
            onSelectLook={handleSelectLook}
          />
        )}

        {activeTab === 'content' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Global Link Separator */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Link Separator
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  { label: 'Comma ( , )', val: ' , ' },
                  { label: 'Bullet ( • )', val: '  •  ' },
                  { label: 'Pipe ( | )', val: '  |  ' },
                  { label: 'Slash ( / )', val: '  /  ' },
                  { label: 'None', val: '' },
                ].map((sep) => (
                  <button
                    key={sep.val}
                    type="button"
                    onClick={() => handleUpdateProps({ separator: sep.val })}
                    style={{
                      flex: 1,
                      padding: '6px 4px',
                      borderRadius: '5px',
                      fontSize: '11px',
                      fontWeight: 600,
                      border: '1px solid',
                      borderColor: separator === sep.val ? '#2563eb' : '#cbd5e1',
                      backgroundColor: separator === sep.val ? '#eff6ff' : '#ffffff',
                      color: separator === sep.val ? '#1d4ed8' : '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    {sep.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title Casing */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Category Title Case
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  { label: 'UPPERCASE', val: 'uppercase' },
                  { label: 'Capitalize', val: 'capitalize' },
                  { label: 'Normal', val: 'none' },
                ].map((tc) => (
                  <button
                    key={tc.val}
                    type="button"
                    onClick={() => handleUpdateProps({ titleTransform: tc.val })}
                    style={{
                      flex: 1,
                      padding: '6px 4px',
                      borderRadius: '5px',
                      fontSize: '11px',
                      fontWeight: 600,
                      border: '1px solid',
                      borderColor: titleTransform === tc.val ? '#2563eb' : '#cbd5e1',
                      backgroundColor: titleTransform === tc.val ? '#eff6ff' : '#ffffff',
                      color: titleTransform === tc.val ? '#1d4ed8' : '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    {tc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Groups Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
                Categories ({categories.length})
              </span>
              <button
                type="button"
                onClick={handleAddCategory}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <Plus size={12} /> Add Category
              </button>
            </div>

            {/* List of Categories */}
            {categories.map((cat, cIdx) => {
              const isExpanded = expandedCatId === cat.id;
              const isBulk = bulkCatId === cat.id;

              return (
                <div
                  key={cat.id || cIdx}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    backgroundColor: '#f8fafc',
                    overflow: 'hidden',
                  }}
                >
                  {/* Category Title Row */}
                  <div
                    style={{
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#ffffff',
                      borderBottom: isExpanded ? '1px solid #e2e8f0' : 'none',
                    }}
                  >
                    <input
                      type="text"
                      value={cat.name}
                      onChange={(e) => handleUpdateCategoryName(cat.id, e.target.value)}
                      placeholder="Category Name"
                      style={{
                        flex: 1,
                        padding: '4px 8px',
                        borderRadius: '5px',
                        border: '1px solid #cbd5e1',
                        fontSize: '12px',
                        fontWeight: 700,
                        textTransform: titleTransform as any,
                      }}
                    />
                    <span style={{ fontSize: '11px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                      {cat.links?.length || 0} links
                    </span>
                    <button
                      type="button"
                      onClick={() => setExpandedCatId(isExpanded ? null : cat.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        color: '#64748b',
                        fontSize: '11px',
                        fontWeight: 600,
                      }}
                    >
                      {isExpanded ? 'Collapse' : 'Edit Links'}
                    </button>
                    {categories.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat.id)}
                        title="Delete category"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>

                  {/* Expanded Links Editor */}
                  {isExpanded && (
                    <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>
                          Category Links
                        </span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => setBulkCatId(isBulk ? null : cat.id)}
                            style={{ fontSize: '11px', fontWeight: 600, color: '#4f46e5', background: 'none', border: 'none', cursor: 'pointer' }}
                          >
                            {isBulk ? 'Cancel Bulk' : '+ Bulk Add'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddLink(cat.id)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', fontSize: '11px', fontWeight: 700, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}
                          >
                            <Plus size={11} /> Add Link
                          </button>
                        </div>
                      </div>

                      {/* Bulk Add Textarea */}
                      {isBulk && (
                        <div style={{ padding: '8px', backgroundColor: '#eef2ff', borderRadius: '6px', border: '1px solid #c7d2fe', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '11px', color: '#3730a3', fontWeight: 600 }}>
                            Paste comma-separated or newline-separated links:
                          </label>
                          <textarea
                            rows={3}
                            value={bulkText}
                            onChange={(e) => setBulkText(e.target.value)}
                            placeholder="Storage Jars, Storage Containers, Lunch Boxes..."
                            style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '11.5px', boxSizing: 'border-box' }}
                          />
                          <button
                            type="button"
                            onClick={() => handleBulkAdd(cat.id)}
                            style={{ alignSelf: 'flex-end', padding: '4px 10px', backgroundColor: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                          >
                            Append Links
                          </button>
                        </div>
                      )}

                      {/* Individual Links */}
                      {cat.links?.map((link: any, lIdx: number) => (
                        <div key={lIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input
                            type="text"
                            value={link.label}
                            onChange={(e) => handleUpdateLink(cat.id, lIdx, { label: e.target.value })}
                            placeholder="Link Title"
                            style={{ flex: 1, padding: '4px 6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '11.5px' }}
                          />
                          <input
                            type="text"
                            value={link.url}
                            onChange={(e) => handleUpdateLink(cat.id, lIdx, { url: e.target.value })}
                            placeholder="URL (#)"
                            style={{ width: '80px', padding: '4px 6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '11.5px' }}
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteLink(cat.id, lIdx)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '2px' }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'layout' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Container Width
              </label>
              <select
                value={row.layout?.container || 'constrained'}
                onChange={(e) => updateFooterRow(row.id, { layout: { ...row.layout, container: e.target.value as any } })}
                style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
              >
                <option value="constrained">Constrained (Standard 1280px)</option>
                <option value="full">Full Width</option>
                <option value="boxed">Boxed (Compact 1024px)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Alignment
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(['left', 'center', 'right'] as const).map((align) => (
                  <button
                    key={align}
                    type="button"
                    onClick={() => updateFooterRow(row.id, { layout: { ...row.layout, alignment: align } })}
                    style={{
                      flex: 1,
                      padding: '6px',
                      borderRadius: '5px',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      textTransform: 'capitalize',
                      border: '1px solid',
                      borderColor: (row.layout?.alignment || 'left') === align ? '#2563eb' : '#cbd5e1',
                      backgroundColor: (row.layout?.alignment || 'left') === align ? '#eff6ff' : '#ffffff',
                      color: (row.layout?.alignment || 'left') === align ? '#1d4ed8' : '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    {align}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Gap Between Categories ({row.layout?.categoryGap ?? 24}px)
              </label>
              <input
                type="range"
                min="12"
                max="60"
                value={row.layout?.categoryGap ?? 24}
                onChange={(e) => updateFooterRow(row.id, { layout: { ...row.layout, categoryGap: Number(e.target.value) } })}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Gap Between Title and Links ({row.layout?.titleGap ?? 8}px)
              </label>
              <input
                type="range"
                min="4"
                max="28"
                value={row.layout?.titleGap ?? 8}
                onChange={(e) => updateFooterRow(row.id, { layout: { ...row.layout, titleGap: Number(e.target.value) } })}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Vertical Padding ({row.layout?.paddingY ?? 36}px)
              </label>
              <input
                type="range"
                min="12"
                max="80"
                value={row.layout?.paddingY ?? 36}
                onChange={(e) => updateFooterRow(row.id, { layout: { ...row.layout, paddingY: Number(e.target.value) } })}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}

        {activeTab === 'design' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Background Color
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={row.styling?.bgColor || '#ffffff'}
                  onChange={(e) => updateFooterRow(row.id, { styling: { ...row.styling, bgColor: e.target.value } })}
                  style={{ width: '36px', height: '32px', borderRadius: '4px', border: '1px solid #cbd5e1', padding: '0', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={row.styling?.bgColor || '#ffffff'}
                  onChange={(e) => updateFooterRow(row.id, { styling: { ...row.styling, bgColor: e.target.value } })}
                  style={{ flex: 1, padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Category Title Color
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={row.styling?.titleColor || '#0f172a'}
                  onChange={(e) => updateFooterRow(row.id, { styling: { ...row.styling, titleColor: e.target.value } })}
                  style={{ width: '36px', height: '32px', borderRadius: '4px', border: '1px solid #cbd5e1', padding: '0', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={row.styling?.titleColor || '#0f172a'}
                  onChange={(e) => updateFooterRow(row.id, { styling: { ...row.styling, titleColor: e.target.value } })}
                  style={{ flex: 1, padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Link Text Color
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={row.styling?.linkColor || '#64748b'}
                  onChange={(e) => updateFooterRow(row.id, { styling: { ...row.styling, linkColor: e.target.value } })}
                  style={{ width: '36px', height: '32px', borderRadius: '4px', border: '1px solid #cbd5e1', padding: '0', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={row.styling?.linkColor || '#64748b'}
                  onChange={(e) => updateFooterRow(row.id, { styling: { ...row.styling, linkColor: e.target.value } })}
                  style={{ flex: 1, padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Link Hover Color
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={row.styling?.linkHoverColor || '#0f172a'}
                  onChange={(e) => updateFooterRow(row.id, { styling: { ...row.styling, linkHoverColor: e.target.value } })}
                  style={{ width: '36px', height: '32px', borderRadius: '4px', border: '1px solid #cbd5e1', padding: '0', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={row.styling?.linkHoverColor || '#0f172a'}
                  onChange={(e) => updateFooterRow(row.id, { styling: { ...row.styling, linkHoverColor: e.target.value } })}
                  style={{ flex: 1, padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Separator Color
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={row.styling?.separatorColor || '#94a3b8'}
                  onChange={(e) => updateFooterRow(row.id, { styling: { ...row.styling, separatorColor: e.target.value } })}
                  style={{ width: '36px', height: '32px', borderRadius: '4px', border: '1px solid #cbd5e1', padding: '0', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={row.styling?.separatorColor || '#94a3b8'}
                  onChange={(e) => updateFooterRow(row.id, { styling: { ...row.styling, separatorColor: e.target.value } })}
                  style={{ flex: 1, padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Link Font Size ({row.styling?.fontSize ?? 13}px)
              </label>
              <input
                type="range"
                min="11"
                max="16"
                value={row.styling?.fontSize ?? 13}
                onChange={(e) => updateFooterRow(row.id, { styling: { ...row.styling, fontSize: Number(e.target.value) } })}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}

        {activeTab === 'responsive' && <SharedResponsiveTab row={row} updateRow={(patch) => updateFooterRow(row.id, patch)} />}
        {activeTab === 'visibility' && <SharedVisibilityTab row={row} updateRow={(patch) => updateFooterRow(row.id, patch)} />}
        {activeTab === 'advanced' && <SharedAdvancedTab row={row} updateRow={(patch) => updateFooterRow(row.id, patch)} />}
      </div>
    </div>
  );
};


