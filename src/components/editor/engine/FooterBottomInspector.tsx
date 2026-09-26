import React, { useState } from 'react';
import {
  Check,
  Plus,
  Trash2,
  ChevronRight,
  ArrowUp,
  Globe,
} from 'lucide-react';
import styles from '../../../pages/editor/EditorLayout.module.css';
import type { FooterRow } from './types';
import { useEditorContextStore } from '../../../store/editorContextStore';

interface FooterBottomInspectorProps {
  row: FooterRow;
  onClose: () => void;
}

export const BOTTOM_VARIANTS = [
  {
    id: 'split-classic',
    name: 'Split Classic',
    description: 'Copyright and legal links on the left, payment security badges on the right',
  },
  {
    id: 'stacked-center',
    name: 'Stacked Centered',
    description: 'Centered copyright statement with policy links and payment badges in balanced tiers',
  },
  {
    id: 'minimal-inline',
    name: 'Minimal Inline Bar',
    description: 'Compact single-line ribbon with bullet dot dividers between legal policies',
  },
  {
    id: 'commerce-trust',
    name: 'Trust & Payments Focus',
    description: 'Emphasizes payment gateway icons and compliance assurances',
  },
];

const DEFAULT_METHODS = [
  { id: 'visa', name: 'Visa', enabled: true },
  { id: 'mastercard', name: 'Mastercard', enabled: true },
  { id: 'amex', name: 'American Express', enabled: true },
  { id: 'paypal', name: 'PayPal', enabled: true },
  { id: 'apple-pay', name: 'Apple Pay', enabled: true },
  { id: 'google-pay', name: 'Google Pay', enabled: true },
  { id: 'klarna', name: 'Klarna', enabled: true },
  { id: 'shopify-pay', name: 'Shop Pay', enabled: false },
  { id: 'discover', name: 'Discover', enabled: false },
];

export const FooterBottomInspector: React.FC<FooterBottomInspectorProps> = ({ row: propRow, onClose }) => {
  const { footerRows, updateFooterRow, updateFooterElement, updateFooterSettings, footerSettings } = useEditorContextStore();
  const [activeTab, setActiveTab] = useState<'look' | 'content' | 'layout' | 'design'>('content');

  const row = footerRows.find((r) => r.id === propRow.id) || propRow;
  const styling = row.styling || {};
  const layout = row.layout || {};
  const currentVariantId = layout.variantId || 'split-classic';

  const elements = (row.columns || []).flatMap((c) => c.elements) || [];
  const copyrightEl: any = elements.find((e) => e.type === 'copyright') || elements[0];
  const policyEl: any = elements.find((e) => e.type === 'policy-links');
  const paymentEl: any = elements.find((e) => e.type === 'payment-methods');

  const copyrightText = copyrightEl?.props?.text || '© {year} BillionBiz Technologies Inc. All rights reserved.';
  const policyLinks: any[] = policyEl?.props?.links || [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Settings', href: '#cookies' },
    { label: 'Refund Policy', href: '/refund' },
  ];
  const paymentMethods: any[] = paymentEl?.props?.methods || DEFAULT_METHODS;

  const handleUpdateCopyright = (text: string) => {
    if (copyrightEl) {
      updateFooterElement(row.id, copyrightEl.id, {
        props: { ...copyrightEl.props, text },
      });
    }
  };

  const handleUpdatePolicyLinks = (links: any[]) => {
    if (policyEl) {
      updateFooterElement(row.id, policyEl.id, {
        props: { ...policyEl.props, links },
      });
    }
  };

  const handleUpdateMethods = (methods: any[]) => {
    if (paymentEl) {
      updateFooterElement(row.id, paymentEl.id, {
        props: { ...paymentEl.props, methods },
      });
    }
  };

  const handleSelectVariant = (variantId: string) => {
    updateFooterRow(row.id, {
      layout: { ...row.layout, variantId },
    });
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
          <h3 className={styles.fw600}>Legal & Bottom Bar</h3>
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

      {/* Panels */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px' }}>
        {/* TAB 1: LOOK */}
        {activeTab === 'look' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
              Select a visual display style for your bottom copyright & legal bar. Only modifies this section.
            </div>
            {BOTTOM_VARIANTS.map((v) => {
              const isSelected = currentVariantId === v.id;
              return (
                <div
                  key={v.id}
                  onClick={() => handleSelectVariant(v.id)}
                  style={{
                    padding: '14px',
                    borderRadius: '8px',
                    border: isSelected ? '2px solid #0f172a' : '1px solid #e2e8f0',
                    backgroundColor: isSelected ? '#f8fafc' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: isSelected ? '#0f172a' : '#334155' }}>
                      {v.name}
                    </span>
                    {isSelected && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '11px', fontWeight: 700, color: '#0f172a' }}>
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
            {/* Copyright */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Copyright Text
              </label>
              <input
                type="text"
                value={copyrightText}
                onChange={(e) => handleUpdateCopyright(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              />
              <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                Tip: <code>{'{year}'}</code> automatically displays the current year.
              </span>
            </div>

            {/* Policy Links */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                  Policy Links ({policyLinks.length})
                </label>
                <button
                  type="button"
                  onClick={() => {
                    handleUpdatePolicyLinks([...policyLinks, { label: 'New Policy', href: '#' }]);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 8px',
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '4px',
                    color: '#2563eb',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={12} /> Add Link
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {policyLinks.map((link, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => {
                        const copy = [...policyLinks];
                        copy[idx] = { ...copy[idx], label: e.target.value };
                        handleUpdatePolicyLinks(copy);
                      }}
                      placeholder="Label"
                      style={{ flex: 1, padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                    />
                    <input
                      type="text"
                      value={link.href}
                      onChange={(e) => {
                        const copy = [...policyLinks];
                        copy[idx] = { ...copy[idx], href: e.target.value };
                        handleUpdatePolicyLinks(copy);
                      }}
                      placeholder="URL"
                      style={{ flex: 1, padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const copy = policyLinks.filter((_, i) => i !== idx);
                        handleUpdatePolicyLinks(copy);
                      }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '2px' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
                Payment Badges
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {paymentMethods.map((m, idx) => (
                  <label
                    key={m.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: m.enabled ? '#f8fafc' : '#ffffff',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 500,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={m.enabled !== false}
                      onChange={(e) => {
                        const copy = [...paymentMethods];
                        copy[idx] = { ...copy[idx], enabled: e.target.checked };
                        handleUpdateMethods(copy);
                      }}
                    />
                    <span style={{ color: '#1e293b' }}>{m.name || m.id}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Back to top & locale toggles */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={footerSettings?.backToTop !== false}
                  onChange={(e) => updateFooterSettings({ backToTop: e.target.checked })}
                />
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <ArrowUp size={13} /> Show Back to Top floating button
                </span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={footerSettings?.localization !== false}
                  onChange={(e) => updateFooterSettings({ localization: e.target.checked })}
                />
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Globe size={13} /> Show Language & Currency selector
                </span>
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
                  { id: 'narrow', label: 'Narrow' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleUpdateLayout({ container: c.id })}
                    style={{
                      padding: '8px 4px',
                      borderRadius: '6px',
                      border: (layout.container || 'constrained') === c.id ? '2px solid #0f172a' : '1px solid #cbd5e1',
                      backgroundColor: (layout.container || 'constrained') === c.id ? '#f1f5f9' : '#ffffff',
                      color: (layout.container || 'constrained') === c.id ? '#0f172a' : '#334155',
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
                Vertical Padding ({layout.paddingY ?? 24}px)
              </label>
              <input
                type="range"
                min="8"
                max="48"
                value={layout.paddingY ?? 24}
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
                  value={styling.bgColor || '#090d16'}
                  onChange={(e) => handleUpdateStyling({ bgColor: e.target.value, bgType: 'custom' })}
                  style={{ width: '36px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={styling.bgColor || '#090d16'}
                  onChange={(e) => handleUpdateStyling({ bgColor: e.target.value, bgType: 'custom' })}
                  style={{ flex: 1, padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Text / Muted Color
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="color"
                  value={styling.textColor || '#94a3b8'}
                  onChange={(e) => handleUpdateStyling({ textColor: e.target.value })}
                  style={{ width: '36px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={styling.textColor || '#94a3b8'}
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
