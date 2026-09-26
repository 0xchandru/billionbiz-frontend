import React, { useState, useRef } from 'react';
import {
  Plus,
  Trash2,
  Box,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import styles from '../../../pages/editor/EditorLayout.module.css';
import { DeviceSelector, type DeviceType } from '../ui/DeviceSelector';
import type { FooterRow, FooterColumn, FooterElement, FooterRowLayout, FooterRowStyling } from './types';
import { useEditorContextStore } from '../../../store/editorContextStore';
import { FooterChildItemInspector } from './FooterChildItemInspector';
import { FooterTrustInspector } from './FooterTrustInspector';
import { FooterNewsletterInspector } from './FooterNewsletterInspector';
import { FooterSocialInspector } from './FooterSocialInspector';
import { FooterBottomInspector } from './FooterBottomInspector';

interface FooterSectionInspectorProps {
  row: FooterRow;
  onClose: () => void;
}

export interface FooterLookVariant {
  id: string;
  name: string;
  category: 'E-Commerce' | 'Modern & Split' | 'Minimalist' | 'Enterprise' | 'Community & Media';
  description: string;
  columns: number;
  columnWidths: string[];
  badge?: string;
}

export const FOOTER_MAIN_LOOK_VARIANTS: FooterLookVariant[] = [
  {
    id: '4-col-directory',
    name: 'Classic 4-Column Directory',
    category: 'E-Commerce',
    badge: 'Popular',
    description: 'High-converting retail layout: Brand story in Col 1, dual navigation columns, and store support in Col 4.',
    columns: 4,
    columnWidths: ['1.5fr', '1fr', '1fr', '1.2fr'],
  },
  {
    id: '3-col-split',
    name: '3-Column Asymmetrical Split',
    category: 'Modern & Split',
    description: 'Bold wide brand introduction (1.8fr) with social channels, alongside two wide categorized navigation columns.',
    columns: 3,
    columnWidths: ['1.8fr', '1fr', '1fr'],
  },
  {
    id: 'centered-brand',
    name: 'Centered Brand Statement',
    category: 'Minimalist',
    description: 'Minimalist editorial centerpiece: Large brand logo, core mission statement, and centered navigation links.',
    columns: 1,
    columnWidths: ['1fr'],
  },
  {
    id: '5-col-mega',
    name: '5-Column Mega Catalog',
    category: 'Enterprise',
    badge: 'High-SKU',
    description: 'Designed for extensive department stores and large inventories with 5 balanced category link columns.',
    columns: 5,
    columnWidths: ['1.2fr', '1fr', '1fr', '1fr', '1fr'],
  },
  {
    id: '2-col-boutique',
    name: '2-Column Modern Boutique',
    category: 'Modern & Split',
    description: 'Elegant split screen: Left side features the brand narrative & contact; right side features curated links.',
    columns: 2,
    columnWidths: ['1.4fr', '1fr'],
  },
  {
    id: '4-col-app-featured',
    name: '4-Column App & Retail Focus',
    category: 'E-Commerce',
    badge: 'App Focus',
    description: 'Commerce directory featuring a dedicated mobile App Store & Google Play download module in the last column.',
    columns: 4,
    columnWidths: ['1.3fr', '1fr', '1fr', '1.4fr'],
  },
  {
    id: '3-col-contact-hub',
    name: 'Customer Service & Retail Hub',
    category: 'E-Commerce',
    description: 'Structured for service-heavy stores with quick navigation, direct hotline support, and retail store business hours.',
    columns: 3,
    columnWidths: ['1.2fr', '1fr', '1.4fr'],
  },
  {
    id: '4-col-social-showcase',
    name: 'Community & Creator Directory',
    category: 'Community & Media',
    description: 'Focuses on creator engagement, brand mission, catalog discovery, and active social community follow channels.',
    columns: 4,
    columnWidths: ['1.3fr', '1fr', '1fr', '1.3fr'],
  },
  {
    id: '6-col-enterprise',
    name: '6-Column Global Enterprise',
    category: 'Enterprise',
    badge: 'Multi-Brand',
    description: 'Comprehensive global footprint for multinational e-commerce, holding companies, and enterprise retailers.',
    columns: 6,
    columnWidths: ['1fr', '1fr', '1fr', '1fr', '1fr', '1fr'],
  },
  {
    id: '3-col-newsletter-focus',
    name: 'Incentive & VIP Drop Showcase',
    category: 'Modern & Split',
    badge: 'VIP Club',
    description: 'Includes an embedded in-column newsletter subscription card with promotional incentive in the right column.',
    columns: 3,
    columnWidths: ['1.2fr', '1fr', '1.5fr'],
  },
  {
    id: 'bento-grid',
    name: 'Modern Bento Grid Cards',
    category: 'Modern & Split',
    badge: 'Trending',
    description: 'Card-based bento modules with distinct surfaces, subtle borders, and modern asymmetric layout proportions.',
    columns: 4,
    columnWidths: ['1.5fr', '1fr', '1fr', '1.2fr'],
  },
  {
    id: 'luxury-minimal',
    name: 'Luxury & Haute Horlogerie',
    category: 'Minimalist',
    badge: 'Luxury',
    description: 'Generous negative space, refined typography, and understated columns designed for premium luxury DTC brands.',
    columns: 3,
    columnWidths: ['1.5fr', '1fr', '1fr'],
  },
];

// ─── Visual Miniature Wireframe Diagram Component ─────────
export const FooterLookWireframe: React.FC<{ variant: FooterLookVariant }> = ({ variant }) => {
  const isCentered = variant.id === 'centered-brand';
  const isBento = variant.id === 'bento-grid';

  return (
    <div
      style={{
        width: '100px',
        height: '56px',
        backgroundColor: '#090d16',
        borderRadius: '6px',
        border: '1px solid rgba(255,255,255,0.12)',
        padding: '5px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: isCentered ? 'center' : 'flex-start',
        overflow: 'hidden',
        boxSizing: 'border-box',
        flexShrink: 0,
      }}
    >
      {isCentered ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', width: '100%' }}>
          <div style={{ width: '28px', height: '6px', backgroundColor: '#38bdf8', borderRadius: '2px' }} />
          <div style={{ width: '64px', height: '3px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '1px' }} />
          <div style={{ display: 'flex', gap: '3px', marginTop: '3px' }}>
            <div style={{ width: '16px', height: '4px', backgroundColor: '#6366f1', borderRadius: '2px' }} />
            <div style={{ width: '16px', height: '4px', backgroundColor: '#6366f1', borderRadius: '2px' }} />
            <div style={{ width: '16px', height: '4px', backgroundColor: '#6366f1', borderRadius: '2px' }} />
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: variant.columnWidths.map((w) => (w.includes('fr') ? w : '1fr')).join(' '),
            gap: isBento ? '4px' : '3px',
            height: '100%',
            alignItems: 'stretch',
          }}
        >
          {variant.columnWidths.map((_, colIdx) => {
            const isBrandCol = colIdx === 0;
            const isLastCol = colIdx === variant.columns - 1;
            const isAppCol = variant.id === '4-col-app-featured' && isLastCol;
            const isContactCol = variant.id === '3-col-contact-hub' && isLastCol;
            const isNewsletterCol = variant.id === '3-col-newsletter-focus' && isLastCol;

            return (
              <div
                key={colIdx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  backgroundColor: isBento ? 'rgba(255,255,255,0.08)' : 'transparent',
                  padding: isBento ? '2px' : '0',
                  borderRadius: isBento ? '3px' : '0',
                }}
              >
                {isBrandCol ? (
                  <>
                    <div style={{ width: '16px', height: '4px', backgroundColor: '#38bdf8', borderRadius: '1.5px', marginBottom: '1px' }} />
                    <div style={{ width: '100%', height: '2px', backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: '1px' }} />
                    <div style={{ width: '80%', height: '2px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '1px' }} />
                  </>
                ) : isAppCol ? (
                  <>
                    <div style={{ width: '12px', height: '3px', backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: '1px' }} />
                    <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.15)', border: '0.5px solid rgba(255,255,255,0.3)', borderRadius: '2px', marginTop: '1px' }} />
                    <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.15)', border: '0.5px solid rgba(255,255,255,0.3)', borderRadius: '2px' }} />
                  </>
                ) : isContactCol ? (
                  <>
                    <div style={{ width: '12px', height: '3px', backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: '1px' }} />
                    <div style={{ width: '100%', height: '2px', backgroundColor: '#f59e0b', borderRadius: '1px' }} />
                    <div style={{ width: '90%', height: '2px', backgroundColor: '#10b981', borderRadius: '1px' }} />
                  </>
                ) : isNewsletterCol ? (
                  <>
                    <div style={{ width: '12px', height: '3px', backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: '1px' }} />
                    <div style={{ width: '100%', height: '4.5px', backgroundColor: '#6366f1', borderRadius: '2px', marginTop: '1px' }} />
                  </>
                ) : (
                  <>
                    <div style={{ width: '12px', height: '3px', backgroundColor: 'rgba(255,255,255,0.45)', borderRadius: '1px' }} />
                    <div style={{ width: '90%', height: '2px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '1px' }} />
                    <div style={{ width: '75%', height: '2px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '1px' }} />
                    <div style={{ width: '60%', height: '2px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '1px' }} />
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const FooterSectionInspector: React.FC<FooterSectionInspectorProps> = ({ row: propRow, onClose }) => {
  const { footerRows } = useEditorContextStore();

  // Reactive derivation
  const row = (footerRows && footerRows.length > 0
    ? (footerRows.find((r: FooterRow) => r.id === propRow?.id) || footerRows.find((r: FooterRow) => r.type === propRow?.type))
    : undefined) || propRow;

  if (!row) return null;

  // ─── DEDICATED INSPECTOR DISPATCH ──────────────────────────
  if (row.type === 'trust') {
    return <FooterTrustInspector key={row.id} row={row} onClose={onClose} />;
  }
  if (row.type === 'newsletter') {
    return <FooterNewsletterInspector key={row.id} row={row} onClose={onClose} />;
  }
  if (row.type === 'social') {
    return <FooterSocialInspector key={row.id} row={row} onClose={onClose} />;
  }
  if (row.type === 'legal' || row.type === 'payment') {
    return <FooterBottomInspector key={row.id} row={row} onClose={onClose} />;
  }

  return <FooterMainInspector key={row.id} row={row} onClose={onClose} />;
};

// ─── MAIN FOOTER INSPECTOR (Columns & Child Item Editing) ───
export const FooterMainInspector: React.FC<{ row: FooterRow; onClose: () => void }> = ({ row, onClose }) => {
  const {
    updateFooterRow,
    deleteFooterElement,
    addFooterElement,
    updateFooterSettings,
    footerSettings,
    selectTarget,
  } = useEditorContextStore();

  const [currentTab, setCurrentTab] = useState<'look' | 'columns' | 'layout' | 'design' | 'behavior'>('columns');
  const [lookCategoryFilter, setLookCategoryFilter] = useState<string>('All');
  const [layoutDevice, setLayoutDevice] = useState<DeviceType>('desktop');
  const [selectedChildElementId, setSelectedChildElementId] = useState<string | null>(null);

  const styling = row.styling || {};
  const layout = row.layout || {};
  const currentVariantId = layout.variantId || (row.columns?.length === 3 ? '3-col-split' : row.columns?.length === 5 ? '5-col-mega' : row.columns?.length === 1 ? 'centered-brand' : '4-col-directory');

  // Reactively derive child element from row to avoid stale props
  const activeChildElement = selectedChildElementId
    ? (row.columns || []).flatMap((c) => c.elements).find((e) => e.id === selectedChildElementId) || null
    : null;

  // If a child element is currently drilled down, show the child inspector
  if (activeChildElement) {
    return (
      <FooterChildItemInspector
        element={activeChildElement}
        row={row}
        onClose={() => {
          setSelectedChildElementId(null);
          selectTarget({
            type: 'row',
            editorType: 'footer',
            rowId: row.id,
          });
        }}
      />
    );
  }

  const tabsRef = useRef<HTMLDivElement>(null);
  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({
        left: direction === 'left' ? -80 : 80,
        behavior: 'smooth',
      });
    }
  };

  const handleUpdateLayout = (patch: Partial<FooterRowLayout>) => {
    updateFooterRow(row.id, {
      layout: { ...row.layout, ...patch } as FooterRowLayout,
    });
  };

  const handleUpdateStyling = (patch: Partial<FooterRowStyling>) => {
    updateFooterRow(row.id, {
      styling: { ...row.styling, ...patch } as FooterRowStyling,
    });
  };

  // Look tab: ONLY modifies this section's layout & columns without adding/removing other sections!
  const handleApplyMainLook = (variant: FooterLookVariant) => {
    let updatedCols = [...(row.columns || [])];

    // Specialized template elements for new columns by variant
    const variantTemplateElements: Record<string, Record<number, { type: string; name: string; props: any }>> = {
      '4-col-app-featured': {
        3: {
          type: 'app-download',
          name: 'Mobile App Download',
          props: { title: 'Download Our App', iosUrl: 'https://apple.com', androidUrl: 'https://google.com' },
        },
      },
      '3-col-contact-hub': {
        2: {
          type: 'contact',
          name: 'Customer Support & Hours',
          props: {
            phone: '+1 (800) 246-8100',
            email: 'care@yourstore.com',
            address: '742 Evergreen Terrace, Suite 100',
            hours: 'Mon - Fri: 9am - 8pm EST',
          },
        },
      },
      '3-col-newsletter-focus': {
        2: {
          type: 'newsletter-form',
          name: 'VIP Newsletter Club',
          props: {
            title: 'Join the VIP Circle',
            subtitle: 'Subscribe to get 15% off your first order plus members-only drops.',
            placeholder: 'Enter your email',
            buttonText: 'Join',
          },
        },
      },
      '4-col-social-showcase': {
        3: {
          type: 'social-links',
          name: 'Social Community',
          props: {
            platforms: [
              { platform: 'instagram', url: 'https://instagram.com', enabled: true },
              { platform: 'twitter', url: 'https://twitter.com', enabled: true },
              { platform: 'youtube', url: 'https://youtube.com', enabled: true },
              { platform: 'tiktok', url: 'https://tiktok.com', enabled: true },
            ],
          },
        },
      },
    };

    // If switching to centered 1-col, ensure all unique elements are placed in col 1 so nothing is lost
    if (variant.columns === 1 && updatedCols.length > 1) {
      const allElements = updatedCols.flatMap((c) => c.elements);
      updatedCols = [
        {
          id: updatedCols[0]?.id || `col-nav-${Date.now().toString(36)}-1`,
          width: '1fr',
          elements: allElements.length > 0 ? allElements : [
            {
              id: `el-brand-${Date.now().toString(36)}`,
              type: 'brand-description',
              name: 'Brand Bio',
              capabilities: ['style', 'content', 'responsive'],
              props: { text: 'Empowering modern online merchants with frictionless store infrastructure.' },
            },
            {
              id: `el-links-${Date.now().toString(36)}`,
              type: 'navigation-menu',
              name: 'Navigation Links',
              capabilities: ['style', 'content', 'responsive'],
              props: {
                title: 'Explore',
                links: [
                  { label: 'Shop All', href: '/collections/all' },
                  { label: 'New Arrivals', href: '/collections/new' },
                  { label: 'About Us', href: '/about' },
                  { label: 'Contact', href: '/contact' },
                ],
              },
            },
          ],
        },
      ];
    } else {
      while (updatedCols.length < variant.columns) {
        const nextIdx = updatedCols.length;
        const template = variantTemplateElements[variant.id]?.[nextIdx];
        const newEl: FooterElement = template
          ? {
              id: `el-${template.type}-${Date.now().toString(36)}-${nextIdx + 1}`,
              type: template.type as any,
              name: template.name,
              capabilities: ['style', 'content', 'responsive'],
              props: template.props,
            }
          : {
              id: `el-links-${Date.now().toString(36)}-${nextIdx + 1}`,
              type: 'navigation-menu',
              name: `Navigation ${nextIdx + 1}`,
              capabilities: ['style', 'content', 'responsive'],
              props: {
                title: nextIdx === 1 ? 'Collections' : nextIdx === 2 ? 'Customer Support' : `Explore ${nextIdx + 1}`,
                links: [
                  { label: 'Featured Drops', href: '/collections/featured' },
                  { label: 'New Arrivals', href: '/collections/new' },
                  { label: 'Best Sellers', href: '/collections/best-sellers' },
                ],
              },
            };

        updatedCols.push({
          id: `col-nav-${Date.now().toString(36)}-${nextIdx + 1}`,
          width: variant.columnWidths[nextIdx] || '1fr',
          elements: [newEl],
        });
      }

      if (updatedCols.length > variant.columns && variant.columns > 0) {
        updatedCols = updatedCols.slice(0, variant.columns);
      }
    }

    updatedCols = updatedCols.map((col, idx) => ({
      ...col,
      width: variant.columnWidths[idx] || '1fr',
    }));

    updateFooterRow(row.id, {
      layout: {
        ...row.layout,
        variantId: variant.id,
        columns: variant.columns,
      },
      columns: updatedCols,
    });
  };

  const handleAddColumn = () => {
    if ((row.columns || []).length >= 6) return;
    const newCols: FooterColumn[] = [
      ...(row.columns || []),
      {
        id: `col-nav-${Date.now().toString(36)}`,
        width: '1fr',
        elements: [],
      },
    ];
    updateFooterRow(row.id, {
      columns: newCols,
      layout: { ...row.layout, columns: newCols.length },
    });
  };

  const handleDeleteColumn = (colId: string) => {
    if ((row.columns || []).length <= 1) return;
    const newCols = (row.columns || []).filter((c) => c.id !== colId);
    if (selectedChildElementId && !newCols.some((c) => c.elements.some((e) => e.id === selectedChildElementId))) {
      setSelectedChildElementId(null);
    }
    updateFooterRow(row.id, {
      columns: newCols,
      layout: { ...row.layout, columns: newCols.length },
    });
  };

  const handleAddElementToColumn = (colId: string, type: string, name: string) => {
    const defaultPropsMap: Record<string, any> = {
      'navigation-menu': {
        heading: 'Quick Links',
        links: [
          { label: 'Shop All', href: '/collections/all' },
          { label: 'Featured Collections', href: '/collections/featured', badge: 'HOT' },
          { label: 'New Arrivals', href: '/collections/new' },
          { label: 'Special Offers', href: '/sale' },
        ],
      },
      'brand-description': {
        text: 'Empowering modern online merchants with frictionless store infrastructure, intelligent workflows, and conversion-optimized retail tools.',
      },
      'contact': {
        phone: '+1 (800) 246-8100',
        email: 'hello@yourstore.com',
        address: '742 Evergreen Terrace, Suite 100',
        hours: 'Mon - Fri: 9am - 7pm EST',
      },
      'social-links': {
        platforms: [
          { platform: 'twitter', url: 'https://twitter.com', enabled: true },
          { platform: 'instagram', url: 'https://instagram.com', enabled: true },
          { platform: 'linkedin', url: 'https://linkedin.com', enabled: true },
          { platform: 'youtube', url: 'https://youtube.com', enabled: true },
        ],
      },
      'app-download': {
        title: 'Get Our Mobile App',
        iosUrl: 'https://apple.com',
        androidUrl: 'https://google.com',
      },
      'newsletter-form': {
        title: 'Stay in the loop',
        subtitle: 'Sign up for weekly curated drops and VIP member discounts.',
        placeholder: 'Enter your email',
        buttonText: 'Subscribe',
      },
      'logo': {
        text: 'Store Name',
        sourceType: 'text',
        fontSize: 22,
        fontWeight: 800,
      },
    };
    addFooterElement(row.id, colId, type as any, name, defaultPropsMap[type] || {});
  };

  const tabs = [
    { id: 'look', label: 'Look' },
    { id: 'columns', label: 'Columns' },
    { id: 'layout', label: 'Layout' },
    { id: 'design', label: 'Design' },
    { id: 'behavior', label: 'Behavior' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#ffffff', overflow: 'hidden' }}>
      {/* ─── Inspector Header: matching EditorRightSidebar ─── */}
      <div className={styles.panelHeader}>
        <div className={styles.phLeft}>
          <button className={styles.iconBtn} onClick={onClose} title="Collapse sidebar">
            <ChevronRight size={20} className={styles.backIcon} />
          </button>
          <h3 className={styles.fw600}>Footer Directory</h3>
        </div>
      </div>

      {/* ─── Exact EditorRightSidebar Tabs Header with Chevron Scroll Buttons ─── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid var(--border-color)',
        background: '#f8fafc',
      }}>
        <button
          type="button"
          onClick={() => scrollTabs('left')}
          style={{
            padding: '8px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: 'var(--text-muted)',
            flexShrink: 0,
          }}
          title="Scroll tabs left"
        >
          <ChevronLeft size={16} />
        </button>
        <div
          ref={tabsRef}
          className={styles.propTabs}
          style={{ overflowX: 'auto', flexWrap: 'nowrap', borderBottom: 'none', flex: 1 }}
        >
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`${styles.propTab} ${currentTab === tab.id ? styles.activePropTab : ''}`}
              onClick={() => setCurrentTab(tab.id as any)}
              style={{ flex: '0 0 auto', padding: '12px 14px', whiteSpace: 'nowrap', cursor: 'pointer' }}
            >
              {tab.label}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => scrollTabs('right')}
          style={{
            padding: '8px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: 'var(--text-muted)',
            flexShrink: 0,
          }}
          title="Scroll tabs right"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Tab Panels */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px' }}>
        {/* ========================================================
            TAB 1: LOOK (Section-Only Wireframe Presets)
            ======================================================== */}
        {currentTab === 'look' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>
              Select a visual column arrangement for the main footer. Modifies only this section layout without removing other sections.
            </div>

            {/* Category Filter Pills */}
            <div
              style={{
                display: 'flex',
                gap: '6px',
                overflowX: 'auto',
                paddingBottom: '4px',
                scrollbarWidth: 'none',
              }}
            >
              {['All', 'E-Commerce', 'Modern & Split', 'Minimalist', 'Enterprise', 'Community & Media'].map((cat) => {
                const isActive = lookCategoryFilter === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setLookCategoryFilter(cat)}
                    style={{
                      padding: '5px 11px',
                      borderRadius: '16px',
                      border: isActive ? '1px solid #2563eb' : '1px solid #e2e8f0',
                      backgroundColor: isActive ? '#2563eb' : '#ffffff',
                      color: isActive ? '#ffffff' : '#64748b',
                      fontSize: '11px',
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      boxShadow: isActive ? '0 2px 4px rgba(37,99,235,0.2)' : 'none',
                      transition: 'all 0.15s ease',
                      flexShrink: 0,
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Look Cards with Live Miniature Wireframes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {FOOTER_MAIN_LOOK_VARIANTS.filter(
                (v) => lookCategoryFilter === 'All' || v.category === lookCategoryFilter
              ).map((v) => {
                const isSelected = currentVariantId === v.id;
                return (
                  <div
                    key={v.id}
                    onClick={() => handleApplyMainLook(v)}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      backgroundColor: isSelected ? '#f8faff' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center',
                      boxShadow: isSelected ? '0 2px 8px rgba(37,99,235,0.08)' : 'none',
                    }}
                  >
                    <FooterLookWireframe variant={v} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '3px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: isSelected ? '#1d4ed8' : '#0f172a' }}>
                            {v.name}
                          </span>
                          {v.badge && (
                            <span
                              style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                padding: '2px 6px',
                                borderRadius: '4px',
                                backgroundColor: isSelected ? '#dbeafe' : '#f1f5f9',
                                color: isSelected ? '#1d4ed8' : '#475569',
                              }}
                            >
                              {v.badge}
                            </span>
                          )}
                        </div>
                        {isSelected && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', fontSize: '11px', fontWeight: 700, color: '#2563eb', flexShrink: 0 }}>
                            <Check size={14} /> Active
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '10.5px', color: '#94a3b8', fontWeight: 600, marginBottom: '4px' }}>
                        {v.columns} {v.columns === 1 ? 'Column' : 'Columns'} • {v.category}
                      </div>
                      <p style={{ margin: 0, fontSize: '11.5px', color: '#64748b', lineHeight: 1.4 }}>
                        {v.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: COLUMNS (Column-Based Child Item Editing)
            ======================================================== */}
        {currentTab === 'columns' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                Footer Columns ({row.columns?.length || 0})
              </span>
              <button
                type="button"
                onClick={handleAddColumn}
                disabled={(row.columns?.length || 0) >= 6}
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
                  cursor: (row.columns?.length || 0) >= 6 ? 'not-allowed' : 'pointer',
                }}
              >
                <Plus size={13} /> Add Column
              </button>
            </div>

            {row.columns?.map((col, colIdx) => (
              <div
                key={col.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  backgroundColor: '#f8fafc',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                    Column {colIdx + 1}
                  </span>
                  {(row.columns?.length || 0) > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteColumn(col.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '2px' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>

                {/* Elements list inside column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {col.elements?.map((el) => (
                    <div
                      key={el.id}
                      onClick={() => {
                        setSelectedChildElementId(el.id);
                        selectTarget({
                          type: 'element',
                          editorType: 'footer',
                          rowId: row.id,
                          elementId: el.id,
                          elementType: el.type,
                        });
                      }}
                      style={{
                        padding: '8px 10px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Box size={14} color="#64748b" />
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b' }}>
                          {el.name || el.type}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '10px', color: '#2563eb', fontWeight: 600 }}>Edit</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteFooterElement(row.id, el.id);
                          }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Element to Column Dropdown */}
                <select
                  value=""
                  onChange={(e) => {
                    const type = e.target.value;
                    if (!type) return;
                    const nameMap: Record<string, string> = {
                      'navigation-menu': 'Navigation Menu',
                      'brand-description': 'Brand Bio & Logo',
                      'contact': 'Contact & Hours',
                      'social-links': 'Social Links',
                      'app-download': 'Mobile App Download',
                    };
                    handleAddElementToColumn(col.id, type, nameMap[type] || 'Element');
                  }}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: '1px dashed #94a3b8',
                    backgroundColor: '#ffffff',
                    fontSize: '11px',
                    color: '#475569',
                    cursor: 'pointer',
                  }}
                >
                  <option value="">+ Add Component to Column {colIdx + 1}</option>
                  <option value="navigation-menu">Navigation Menu Links</option>
                  <option value="brand-description">Brand Bio & Logo</option>
                  <option value="contact">Contact & Business Hours</option>
                  <option value="social-links">Social Media Links</option>
                  <option value="app-download">Mobile App Download</option>
                </select>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================
            TAB 3: LAYOUT
            ======================================================== */}
        {currentTab === 'layout' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <DeviceSelector value={layoutDevice} onChange={setLayoutDevice} compact />

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Container Width
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {[
                  { id: 'full' as const, label: 'Full Width' },
                  { id: 'constrained' as const, label: 'Constrained' },
                  { id: 'boxed' as const, label: 'Boxed' },
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
                Column Gap ({layout.gap ?? 24}px)
              </label>
              <input
                type="range"
                min="12"
                max="64"
                value={layout.gap ?? 24}
                onChange={(e) => handleUpdateLayout({ gap: Number(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Vertical Padding ({layout.paddingY ?? 48}px)
              </label>
              <input
                type="range"
                min="16"
                max="96"
                value={layout.paddingY ?? 48}
                onChange={(e) => handleUpdateLayout({ paddingY: Number(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: DESIGN
            ======================================================== */}
        {currentTab === 'design' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Background Color
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="color"
                  value={styling.bgColor || '#0f172a'}
                  onChange={(e) => handleUpdateStyling({ bgColor: e.target.value, bgType: 'custom' })}
                  style={{ width: '36px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={styling.bgColor || '#0f172a'}
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
                  value={styling.textColor || '#ffffff'}
                  onChange={(e) => handleUpdateStyling({ textColor: e.target.value })}
                  style={{ width: '36px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={styling.textColor || '#ffffff'}
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

        {/* ========================================================
            TAB 5: BEHAVIOR
            ======================================================== */}
        {currentTab === 'behavior' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={footerSettings?.responsiveRules?.mobile?.layout === 'accordion'}
                onChange={(e) => {
                  const newLayout = e.target.checked ? 'accordion' : 'stack';
                  updateFooterSettings({
                    responsiveRules: {
                      ...footerSettings?.responsiveRules,
                      mobile: { ...footerSettings?.responsiveRules?.mobile, layout: newLayout },
                    },
                  });
                }}
              />
              <span>Collapse columns into accordions on Mobile</span>
            </label>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>
              When enabled, each directory column will fold into an interactive touch drawer on mobile screens.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
