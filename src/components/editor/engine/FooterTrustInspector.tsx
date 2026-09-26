import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Award,
  Lock,
  Heart,
  Clock,
  Plus,
  Trash2,
  Check,
  ChevronRight,
} from 'lucide-react';
import styles from '../../../pages/editor/EditorLayout.module.css';
import type { FooterRow } from './types';
import { useEditorContextStore } from '../../../store/editorContextStore';

interface FooterTrustInspectorProps {
  row: FooterRow;
  onClose: () => void;
}

export const TRUST_VARIANTS = [
  {
    id: 'grid-4',
    name: '4-Column Balanced Grid',
    description: 'Evenly distributed icons and value propositions across the container',
  },
  {
    id: 'inline-bar',
    name: 'Compact Horizontal Ribbon',
    description: 'Slim single-line ticker with bullet separators between guarantees',
  },
  {
    id: 'cards',
    name: 'Elevated Feature Cards',
    description: 'Framed guarantee cards with subtle borders and surface contrast',
  },
  {
    id: 'minimal',
    name: 'Minimal Icon + Headline',
    description: 'Clean high-density presentation without secondary description text',
  },
];

const AVAILABLE_ICONS = [
  { id: 'shield-check', label: 'Shield (Security)', icon: ShieldCheck },
  { id: 'truck', label: 'Truck (Shipping)', icon: Truck },
  { id: 'rotate-ccw', label: 'Rotate (Returns)', icon: RotateCcw },
  { id: 'headphones', label: 'Headphones (Support)', icon: Headphones },
  { id: 'award', label: 'Award (Quality)', icon: Award },
  { id: 'lock', label: 'Lock (Privacy)', icon: Lock },
  { id: 'heart', label: 'Heart (Care)', icon: Heart },
  { id: 'clock', label: 'Clock (Speed)', icon: Clock },
];

export const FooterTrustInspector: React.FC<FooterTrustInspectorProps> = ({ row: propRow, onClose }) => {
  const { footerRows, updateFooterRow, updateFooterElement } = useEditorContextStore();
  const [activeTab, setActiveTab] = useState<'look' | 'content' | 'layout' | 'design'>('content');

  // Reactively derive row from store
  const row = footerRows.find((r) => r.id === propRow.id) || propRow;
  const styling = row.styling || {};
  const layout = row.layout || {};
  const currentVariantId = layout.variantId || 'grid-4';

  const primaryCol = row.columns?.[0];
  const trustElement = primaryCol?.elements?.find((e) => e.type === 'trust-badges' || e.type === 'shipping-benefits') || primaryCol?.elements?.[0];
  const items: any[] = trustElement?.props?.items || [
    { icon: 'shield-check', title: 'Bank-Grade Security', description: '256-bit SSL encrypted payments' },
    { icon: 'truck', title: 'Fast Free Delivery', description: 'Orders shipped within 24 hours' },
    { icon: 'rotate-ccw', title: '30-Day Guarantee', description: 'Hassle-free returns & refunds' },
    { icon: 'headphones', title: '24/7 Dedicated Support', description: 'Direct access to specialists' },
  ];

  const handleUpdateItems = (newItems: any[]) => {
    if (trustElement && primaryCol) {
      updateFooterElement(row.id, trustElement.id, {
        props: { ...trustElement.props, items: newItems },
      });
    }
  };

  const handleSelectVariant = (variantId: string) => {
    updateFooterRow(row.id, {
      layout: {
        ...row.layout,
        variantId,
      },
    });
    if (trustElement) {
      updateFooterElement(row.id, trustElement.id, {
        props: { ...trustElement.props, layout: variantId },
      });
    }
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
          <h3 className={styles.fw600}>Trust & Guarantees</h3>
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

      {/* Tab Panels */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px' }}>
        {/* TAB 1: LOOK */}
        {activeTab === 'look' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
              Select a visual display style for your trust guarantees. Only modifies this section.
            </div>
            {TRUST_VARIANTS.map((v) => {
              const isSelected = currentVariantId === v.id;
              return (
                <div
                  key={v.id}
                  onClick={() => handleSelectVariant(v.id)}
                  style={{
                    padding: '14px',
                    borderRadius: '8px',
                    border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: isSelected ? '#1d4ed8' : '#0f172a' }}>
                      {v.name}
                    </span>
                    {isSelected && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '11px', fontWeight: 700, color: '#2563eb' }}>
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                Guarantees ({items.length})
              </span>
              <button
                type="button"
                onClick={() => {
                  if (items.length >= 6) return;
                  handleUpdateItems([
                    ...items,
                    { icon: 'shield-check', title: 'New Guarantee', description: 'Customer trust benefit' },
                  ]);
                }}
                disabled={items.length >= 6}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 8px',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '6px',
                  color: '#2563eb',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: items.length >= 6 ? 'not-allowed' : 'pointer',
                }}
              >
                <Plus size={13} /> Add Item
              </button>
            </div>

            {items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <select
                      value={item.icon || 'shield-check'}
                      onChange={(e) => {
                        const copy = [...items];
                        copy[idx] = { ...copy[idx], icon: e.target.value };
                        handleUpdateItems(copy);
                      }}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '12px',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      {AVAILABLE_ICONS.map((ico) => (
                        <option key={ico.id} value={ico.id}>
                          {ico.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const copy = items.filter((_, i) => i !== idx);
                        handleUpdateItems(copy);
                      }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '2px' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '3px' }}>
                    Title
                  </label>
                  <input
                    type="text"
                    value={item.title || ''}
                    onChange={(e) => {
                      const copy = [...items];
                      copy[idx] = { ...copy[idx], title: e.target.value };
                      handleUpdateItems(copy);
                    }}
                    style={{
                      width: '100%',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '12px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '3px' }}>
                    Description
                  </label>
                  <input
                    type="text"
                    value={item.description || ''}
                    onChange={(e) => {
                      const copy = [...items];
                      copy[idx] = { ...copy[idx], description: e.target.value };
                      handleUpdateItems(copy);
                    }}
                    style={{
                      width: '100%',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '12px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
            ))}
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
                  { id: 'full', label: 'Full' },
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
                      border: (layout.container || 'constrained') === c.id ? '2px solid #2563eb' : '1px solid #cbd5e1',
                      backgroundColor: (layout.container || 'constrained') === c.id ? '#eff6ff' : '#ffffff',
                      color: (layout.container || 'constrained') === c.id ? '#1d4ed8' : '#334155',
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
                Vertical Padding ({layout.paddingY ?? 28}px)
              </label>
              <input
                type="range"
                min="12"
                max="80"
                value={layout.paddingY ?? 28}
                onChange={(e) => handleUpdateLayout({ paddingY: Number(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Horizontal Padding ({layout.paddingX ?? 32}px)
              </label>
              <input
                type="range"
                min="12"
                max="64"
                value={layout.paddingX ?? 32}
                onChange={(e) => handleUpdateLayout({ paddingX: Number(e.target.value) })}
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
                  value={styling.bgColor || '#f8fafc'}
                  onChange={(e) => handleUpdateStyling({ bgColor: e.target.value, bgType: 'custom' })}
                  style={{ width: '36px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={styling.bgColor || '#f8fafc'}
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
