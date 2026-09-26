import React, { useState } from 'react';
import {
  Check,
  ChevronRight,
} from 'lucide-react';
import styles from '../../../pages/editor/EditorLayout.module.css';
import type { FooterRow } from './types';
import { useEditorContextStore } from '../../../store/editorContextStore';

interface FooterNewsletterInspectorProps {
  row: FooterRow;
  onClose: () => void;
}

export const NEWSLETTER_VARIANTS = [
  {
    id: 'centered-card',
    name: 'Centered Hero Card',
    description: 'Focused high-conversion card with prominent heading, copy, and centered subscription form',
  },
  {
    id: 'split-banner',
    name: 'Horizontal Split Banner',
    description: 'Brand pitch and incentives on the left, email input and action button on the right',
  },
  {
    id: 'minimal-bar',
    name: 'Compact Horizontal Bar',
    description: 'Space-saving slim inline banner suitable for secondary placement',
  },
  {
    id: 'badge-highlight',
    name: 'VIP Discount Highlight',
    description: 'Features a coupon code tag (e.g. WELCOME10) with one-click copy badge',
  },
];

export const FooterNewsletterInspector: React.FC<FooterNewsletterInspectorProps> = ({ row: propRow, onClose }) => {
  const { footerRows, updateFooterRow, updateFooterElement } = useEditorContextStore();
  const [activeTab, setActiveTab] = useState<'look' | 'content' | 'layout' | 'design'>('content');

  const row = footerRows.find((r) => r.id === propRow.id) || propRow;
  const styling = row.styling || {};
  const layout = row.layout || {};
  const currentVariantId = layout.variantId || 'centered-card';

  const primaryCol = row.columns?.[0];
  const newsElement = primaryCol?.elements?.find((e) => e.type === 'newsletter-form') || primaryCol?.elements?.[0];
  const elProps = newsElement?.props || {};

  const handleUpdateProps = (patch: Record<string, any>) => {
    if (newsElement && primaryCol) {
      updateFooterElement(row.id, newsElement.id, {
        props: { ...newsElement.props, ...patch },
      });
    }
  };

  const handleSelectVariant = (variantId: string) => {
    updateFooterRow(row.id, {
      layout: { ...row.layout, variantId },
    });
    handleUpdateProps({ variant: variantId });
  };

  const handleUpdateStyling = (patch: Record<string, any>) => {
    updateFooterRow(row.id, {
      styling: { ...row.styling, ...patch },
    });
  };

  const handleUpdateLayout = (patch: Record<string, any>) => {
    updateFooterRow(row.id, {
      layout: { ...row.layout, ...patch },
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#ffffff', overflow: 'hidden' }}>
      {/* ─── Inspector Header: matching EditorRightSidebar ─── */}
      <div className={styles.panelHeader}>
        <div className={styles.phLeft}>
          <button className={styles.iconBtn} onClick={onClose} title="Collapse sidebar">
            <ChevronRight size={20} className={styles.backIcon} />
          </button>
          <h3 className={styles.fw600}>Newsletter Signup</h3>
        </div>
      </div>

      {/* ─── Exact EditorRightSidebar Tabs Header ─── */}
      <div className={styles.propTabs} style={{ overflowX: 'auto', flexWrap: 'nowrap' }}>
        {[
          { id: 'look', label: 'Look' },
          { id: 'content', label: 'Content' },
          { id: 'layout', label: 'Layout' },
          { id: 'design', label: 'Design' },
        ].map((tab) => (
          <div
            key={tab.id}
            className={`${styles.propTab} ${activeTab === tab.id ? styles.activePropTab : ''}`}
            onClick={() => setActiveTab(tab.id as any)}
            style={{ flex: 1, padding: '12px 14px', whiteSpace: 'nowrap', cursor: 'pointer', textAlign: 'center' }}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px' }}>
        {/* TAB 1: LOOK */}
        {activeTab === 'look' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
              Select a visual display style for your newsletter lead capture. Only modifies this section.
            </div>
            {NEWSLETTER_VARIANTS.map((v) => {
              const isSelected = currentVariantId === v.id;
              return (
                <div
                  key={v.id}
                  onClick={() => handleSelectVariant(v.id)}
                  style={{
                    padding: '14px',
                    borderRadius: '8px',
                    border: isSelected ? '2px solid #db2777' : '1px solid #e2e8f0',
                    backgroundColor: isSelected ? '#fdf2f8' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: isSelected ? '#be185d' : '#0f172a' }}>
                      {v.name}
                    </span>
                    {isSelected && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '11px', fontWeight: 700, color: '#db2777' }}>
                        <Check size={14} /> Active
                      </span>
                    )}
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>
                    {v.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: CONTENT */}
        {activeTab === 'content' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Heading
              </label>
              <input
                type="text"
                value={elProps.headline || elProps.heading || 'Stay in the Loop'}
                onChange={(e) => handleUpdateProps({ headline: e.target.value, heading: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Description / Subtitle
              </label>
              <textarea
                rows={2}
                value={elProps.description || 'Subscribe to receive exclusive offers, new product launches, and private sales.'}
                onChange={(e) => handleUpdateProps({ description: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Input Placeholder
              </label>
              <input
                type="text"
                value={elProps.placeholder || 'Enter your email address'}
                onChange={(e) => handleUpdateProps({ placeholder: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                CTA Button Text
              </label>
              <input
                type="text"
                value={elProps.buttonText || 'Subscribe'}
                onChange={(e) => handleUpdateProps({ buttonText: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Promotional Coupon Badge (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. WELCOME10"
                value={elProps.couponCode || 'WELCOME10'}
                onChange={(e) => handleUpdateProps({ couponCode: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={elProps.showConsent !== false}
                  onChange={(e) => handleUpdateProps({ showConsent: e.target.checked })}
                />
                <span>Include privacy policy consent checkbox</span>
              </label>
            </div>
          </div>
        )}

        {/* TAB 3: LAYOUT */}
        {activeTab === 'layout' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Container Width
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {[
                  { id: 'full', label: 'Full Width' },
                  { id: 'constrained', label: 'Constrained' },
                  { id: 'narrow', label: 'Narrow Card' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleUpdateLayout({ container: c.id })}
                    style={{
                      padding: '8px 4px',
                      borderRadius: '6px',
                      border: (layout.container || 'constrained') === c.id ? '2px solid #db2777' : '1px solid #cbd5e1',
                      backgroundColor: (layout.container || 'constrained') === c.id ? '#fdf2f8' : '#ffffff',
                      color: (layout.container || 'constrained') === c.id ? '#be185d' : '#334155',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Vertical Padding ({layout.paddingY ?? 40}px)
              </label>
              <input
                type="range"
                min="16"
                max="96"
                value={layout.paddingY ?? 40}
                onChange={(e) => handleUpdateLayout({ paddingY: Number(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}

        {/* TAB 4: DESIGN */}
        {activeTab === 'design' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Background Color
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="color"
                  value={styling.bgColor || '#ffffff'}
                  onChange={(e) => handleUpdateStyling({ bgColor: e.target.value, bgType: 'custom' })}
                  style={{ width: '36px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={styling.bgColor || '#ffffff'}
                  onChange={(e) => handleUpdateStyling({ bgColor: e.target.value, bgType: 'custom' })}
                  style={{ flex: 1, padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Text Color
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="color"
                  value={styling.textColor || '#0f172a'}
                  onChange={(e) => handleUpdateStyling({ textColor: e.target.value })}
                  style={{ width: '36px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={styling.textColor || '#0f172a'}
                  onChange={(e) => handleUpdateStyling({ textColor: e.target.value })}
                  style={{ flex: 1, padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={styling.borderTop !== false}
                  onChange={(e) => handleUpdateStyling({ borderTop: e.target.checked })}
                />
                <span>Show Border Top</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={styling.borderBottom === true}
                  onChange={(e) => handleUpdateStyling({ borderBottom: e.target.checked })}
                />
                <span>Show Border Bottom</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
