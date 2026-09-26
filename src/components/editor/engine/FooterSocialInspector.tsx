import React, { useState } from 'react';
import {
  Check,
  ChevronRight,
} from 'lucide-react';
import styles from '../../../pages/editor/EditorLayout.module.css';
import type { FooterRow } from './types';
import { useEditorContextStore } from '../../../store/editorContextStore';

interface FooterSocialInspectorProps {
  row: FooterRow;
  onClose: () => void;
}

export const SOCIAL_VARIANTS = [
  {
    id: 'icon-bar',
    name: 'Centered Icon Bar',
    description: 'Clean centered social media badges with subtle hover glow',
  },
  {
    id: 'split-follow',
    name: 'Split Brand Callout',
    description: 'Headline and handle callout on the left, social pills on the right',
  },
  {
    id: 'counters',
    name: 'Follower Metrics Showcase',
    description: 'Displays social platforms alongside community audience metrics',
  },
  {
    id: 'pill-buttons',
    name: 'Capsule Pill Buttons',
    description: 'Full-width capsule chips displaying both platform icon and brand name',
  },
];

const DEFAULT_PLATFORMS = [
  { platform: 'instagram', url: 'https://instagram.com', enabled: true, count: '120K' },
  { platform: 'twitter', url: 'https://x.com', enabled: true, count: '45K' },
  { platform: 'facebook', url: 'https://facebook.com', enabled: true, count: '80K' },
  { platform: 'youtube', url: 'https://youtube.com', enabled: true, count: '250K' },
  { platform: 'tiktok', url: 'https://tiktok.com', enabled: false, count: '90K' },
  { platform: 'linkedin', url: 'https://linkedin.com', enabled: false, count: '30K' },
  { platform: 'pinterest', url: 'https://pinterest.com', enabled: false, count: '60K' },
];

export const FooterSocialInspector: React.FC<FooterSocialInspectorProps> = ({ row: propRow, onClose }) => {
  const { footerRows, updateFooterRow, updateFooterElement } = useEditorContextStore();
  const [activeTab, setActiveTab] = useState<'look' | 'content' | 'layout' | 'design'>('content');

  const row = footerRows.find((r) => r.id === propRow.id) || propRow;
  const styling = row.styling || {};
  const layout = row.layout || {};
  const currentVariantId = layout.variantId || 'icon-bar';

  const primaryCol = row.columns?.[0];
  const socialElement = primaryCol?.elements?.find((e) => e.type === 'social-links' || e.type === 'social-icons') || primaryCol?.elements?.[0];
  const elProps = socialElement?.props || {};
  const platforms: any[] = elProps.platforms || DEFAULT_PLATFORMS;

  const handleUpdateProps = (patch: Record<string, any>) => {
    if (socialElement && primaryCol) {
      updateFooterElement(row.id, socialElement.id, {
        props: { ...socialElement.props, ...patch },
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
          <h3 className={styles.fw600}>Social Showcase</h3>
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
              Select a visual display style for your social community bar. Only modifies this section.
            </div>
            {SOCIAL_VARIANTS.map((v) => {
              const isSelected = currentVariantId === v.id;
              return (
                <div
                  key={v.id}
                  onClick={() => handleSelectVariant(v.id)}
                  style={{
                    padding: '14px',
                    borderRadius: '8px',
                    border: isSelected ? '2px solid #7c3aed' : '1px solid #e2e8f0',
                    backgroundColor: isSelected ? '#f5f3ff' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: isSelected ? '#6d28d9' : '#0f172a' }}>
                      {v.name}
                    </span>
                    {isSelected && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '11px', fontWeight: 700, color: '#7c3aed' }}>
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
                Headline / Title
              </label>
              <input
                type="text"
                value={elProps.heading || elProps.title || 'Follow Us on Social Media'}
                onChange={(e) => handleUpdateProps({ heading: e.target.value, title: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
                Active Platforms
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {platforms.map((p, idx) => (
                  <div
                    key={p.platform}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: p.enabled ? '#ffffff' : '#f8fafc',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={p.enabled}
                          onChange={(e) => {
                            const copy = [...platforms];
                            copy[idx] = { ...copy[idx], enabled: e.target.checked };
                            handleUpdateProps({ platforms: copy });
                          }}
                        />
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', textTransform: 'capitalize' }}>
                          {p.platform}
                        </span>
                      </label>
                      <input
                        type="text"
                        placeholder="Count (e.g. 120K)"
                        value={p.count || ''}
                        onChange={(e) => {
                          const copy = [...platforms];
                          copy[idx] = { ...copy[idx], count: e.target.value };
                          handleUpdateProps({ platforms: copy });
                        }}
                        style={{
                          width: '75px',
                          padding: '4px 6px',
                          borderRadius: '4px',
                          border: '1px solid #cbd5e1',
                          fontSize: '11px',
                          textAlign: 'right',
                        }}
                      />
                    </div>
                    {p.enabled && (
                      <input
                        type="text"
                        placeholder={`https://${p.platform}.com/...`}
                        value={p.url || ''}
                        onChange={(e) => {
                          const copy = [...platforms];
                          copy[idx] = { ...copy[idx], url: e.target.value };
                          handleUpdateProps({ platforms: copy });
                        }}
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          borderRadius: '4px',
                          border: '1px solid #cbd5e1',
                          fontSize: '12px',
                          boxSizing: 'border-box',
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
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
                      border: (layout.container || 'constrained') === c.id ? '2px solid #7c3aed' : '1px solid #cbd5e1',
                      backgroundColor: (layout.container || 'constrained') === c.id ? '#f5f3ff' : '#ffffff',
                      color: (layout.container || 'constrained') === c.id ? '#6d28d9' : '#334155',
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
                min="12"
                max="64"
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
