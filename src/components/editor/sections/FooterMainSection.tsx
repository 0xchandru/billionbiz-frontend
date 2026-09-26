import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  ArrowUpRight,
  Download,
  Smartphone,
} from 'lucide-react';
import { useEditorContextStore } from '../../../store/editorContextStore';
import { useLandingEditorStore } from '../../../store/landingEditorStore';
import { getEditorPath } from '../utils/editorNavigation';
import type { FooterColumn, FooterElement } from '../engine/types';
import styles from './FooterSections.module.css';

interface FooterMainSectionProps {
  props?: any;
  device?: string;
  isEditorInteractive?: boolean;
  useEditorModel?: boolean;
}

// Social platform icon helper
const renderSocialIcon = (platform: string, size = 16) => {
  const p = platform.toLowerCase();
  switch (p) {
    case 'twitter':
    case 'x':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      );
    case 'facebook':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.761-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      );
    case 'tiktok':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.02 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      );
    default:
      return <Sparkles size={size} />;
  }
};

export const FooterMainSection: React.FC<FooterMainSectionProps> = ({
  props = {},
  device = 'desktop',
  isEditorInteractive = false,
  useEditorModel = true,
}) => {
  const store = useEditorContextStore();
  const { selectedTarget, selectTarget } = store;

  // Derive row from store if in editor context
  const activeRow = (store.footerRows || []).find(
    (r) => r.type === 'navigation' || r.id === props.rowId || r.id === 'row-main-nav'
  );

  const styling = activeRow?.styling || props.styling || {};
  const layout = activeRow?.layout || props.layout || {};
  const columns: FooterColumn[] = activeRow?.columns || props.columns || [];

  // Mobile Accordion state: map of columnId -> boolean open state
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});

  const toggleAccordion = (colId: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [colId]: !prev[colId],
    }));
  };

  const isMobile = device === 'mobile';
  const isTablet = device === 'tablet';

  const bgColor = styling.bgColor || 'var(--theme-footer-bg, #0f172a)';
  const textColor = styling.textColor || 'var(--theme-footer-text, #ffffff)';
  const borderColor = styling.borderColor || 'rgba(255, 255, 255, 0.12)';
  const containerMode = layout.container || 'constrained';

  const isRowSelected =
    selectedTarget.type === 'row' &&
    selectedTarget.editorType === 'footer' &&
    (selectedTarget.rowId === activeRow?.id || selectedTarget.rowId === 'row-main-nav');

  const navigate = useNavigate();
  const { selectedPageId, navigateToPage, setRightSidebarOpen, setSelectedSectionId, requestEditorSwitch } = useLandingEditorStore();

  const handleRowClick = (e: React.MouseEvent) => {
    if (!isEditorInteractive && !useEditorModel) return;
    e.stopPropagation();

    const executeSelect = () => {
      if (selectedPageId !== 'footer-global') {
        navigateToPage('footer-global', activeRow?.id || 'footer-main');
        navigate(getEditorPath('footer-global', activeRow?.id || 'footer-main'));
        store.setEditorType('footer');
      }
      if (activeRow) {
        selectTarget({ type: 'row', editorType: 'footer', rowId: activeRow.id });
        setSelectedSectionId(activeRow.id);
        setRightSidebarOpen(true);
      }
    };

    if (selectedPageId !== 'footer-global') {
      requestEditorSwitch({
        targetPageId: 'footer-global',
        targetName: 'Footer Editor',
        onConfirm: executeSelect,
      });
      return;
    }
    executeSelect();
  };

  const handleElementClick = (e: React.MouseEvent, element: FooterElement) => {
    if (!isEditorInteractive && !useEditorModel) return;
    e.stopPropagation();

    const executeSelect = () => {
      if (selectedPageId !== 'footer-global') {
        navigateToPage('footer-global', activeRow?.id || 'footer-main');
        navigate(getEditorPath('footer-global', activeRow?.id || 'footer-main'));
        store.setEditorType('footer');
      }
      if (activeRow) {
        selectTarget({
          type: 'element',
          editorType: 'footer',
          rowId: activeRow.id,
          elementId: element.id,
          elementType: element.type,
        });
        setSelectedSectionId(activeRow.id);
        setRightSidebarOpen(true);
      }
    };

    if (selectedPageId !== 'footer-global') {
      requestEditorSwitch({
        targetPageId: 'footer-global',
        targetName: 'Footer Editor',
        onConfirm: executeSelect,
      });
      return;
    }
    executeSelect();
  };

  const isCentered = layout.variantId === 'centered-brand';
  const isBento = layout.variantId === 'bento-grid';

  // Compute CSS grid template columns
  const getGridTemplate = () => {
    if (isMobile) return '1fr';
    if (isCentered) return '1fr';
    if (isTablet) return 'repeat(2, 1fr)';
    if (columns.length === 0) return 'repeat(4, 1fr)';
    return columns.map((c) => c.width || '1fr').join(' ');
  };

  return (
    <footer
      id={activeRow?.id || 'footer-row-main'}
      data-section-type="FooterMain"
      data-footer-row-type="navigation"
      className={`${styles.footerRow} ${isEditorInteractive ? styles.footerRowEditable : ''} ${
        isRowSelected ? styles.footerRowSelected : ''
      }`}
      onClick={handleRowClick}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        borderTop: styling.borderTop ? `1px solid ${borderColor}` : 'none',
        borderBottom: styling.borderBottom ? `1px solid ${borderColor}` : 'none',
        paddingTop: `${layout.paddingY ?? 64}px`,
        paddingBottom: `${layout.paddingY ?? 64}px`,
        paddingLeft: isMobile ? '20px' : `${layout.paddingX ?? 32}px`,
        paddingRight: isMobile ? '20px' : `${layout.paddingX ?? 32}px`,
      }}
    >
      {isRowSelected && <div className={styles.rowBadge}>Footer Directory</div>}

      <div
        className={
          containerMode === 'boxed'
            ? styles.containerBoxed
            : containerMode === 'full'
            ? styles.containerFull
            : styles.containerConstrained
        }
      >
        <div
          className={styles.mainFooterGrid}
          style={{
            gridTemplateColumns: getGridTemplate(),
            gap: isMobile ? '28px' : `${layout.gap ?? 40}px`,
          }}
        >
          {columns.map((col, colIdx) => {
            const isAccordionOpen = openAccordions[col.id] ?? false;

            return (
              <div
                key={col.id || colIdx}
                className={styles.columnCard}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isCentered ? 'center' : 'flex-start',
                  textAlign: isCentered ? 'center' : 'left',
                  ...(isBento
                    ? {
                        backgroundColor: 'rgba(255, 255, 255, 0.035)',
                        border: '1px solid rgba(255, 255, 255, 0.09)',
                        borderRadius: '12px',
                        padding: '24px 20px',
                      }
                    : {}),
                }}
              >
                {col.elements.map((el) => {
                  const isElSelected =
                    selectedTarget.type === 'element' &&
                    selectedTarget.editorType === 'footer' &&
                    selectedTarget.elementId === el.id;

                  const elProps = el.props || {};

                  // ─── 1. Brand Logo ───
                  if (el.type === 'logo') {
                    const isImage = elProps.sourceType === 'image' || Boolean(elProps.imageUrl);
                    return (
                      <div
                        key={el.id}
                        onClick={(e) => handleElementClick(e, el)}
                        className={`${isEditorInteractive ? styles.elementEditable : ''} ${
                          isElSelected ? styles.elementSelected : ''
                        }`}
                        style={{
                          marginBottom: '4px',
                          display: isCentered ? 'flex' : 'block',
                          justifyContent: isCentered ? 'center' : 'flex-start',
                          width: isCentered ? '100%' : 'auto',
                        }}
                      >
                        {isImage && elProps.imageUrl ? (
                          <img
                            src={elProps.imageUrl}
                            alt={elProps.text || 'Store Logo'}
                            style={{
                              height: `${elProps.height ?? 36}px`,
                              width: 'auto',
                              objectFit: 'contain',
                              display: 'block',
                            }}
                          />
                        ) : (
                          <h3
                            style={{
                              margin: 0,
                              fontSize: `${elProps.fontSize ?? 24}px`,
                              fontWeight: elProps.fontWeight ?? 800,
                              color: elProps.textColor || textColor,
                              letterSpacing: '-0.03em',
                              textAlign: isCentered ? 'center' : 'left',
                            }}
                          >
                            {elProps.text || 'BillionBiz'}
                          </h3>
                        )}
                      </div>
                    );
                  }

                  // ─── 2. Brand Description / Bio ───
                  if (el.type === 'brand-description' || el.type === 'brand-mission') {
                    return (
                      <div
                        key={el.id}
                        onClick={(e) => handleElementClick(e, el)}
                        className={`${isEditorInteractive ? styles.elementEditable : ''} ${
                          isElSelected ? styles.elementSelected : ''
                        }`}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: `${elProps.fontSize ?? 13.5}px`,
                            color: elProps.textColor || 'rgba(255, 255, 255, 0.72)',
                            lineHeight: 1.6,
                            maxWidth: elProps.maxWidth ? `${elProps.maxWidth}px` : isCentered ? '540px' : '320px',
                            textAlign: isCentered ? 'center' : 'left',
                          }}
                        >
                          {elProps.text ||
                            'Empowering modern online merchants with frictionless store infrastructure, intelligent workflows, and conversion-optimized retail tools.'}
                        </p>
                      </div>
                    );
                  }

                  // ─── 3. Contact Information ───
                  if (el.type === 'contact' || el.type === 'address' || el.type === 'business-hours') {
                    return (
                      <div
                        key={el.id}
                        onClick={(e) => handleElementClick(e, el)}
                        className={`${isEditorInteractive ? styles.elementEditable : ''} ${
                          isElSelected ? styles.elementSelected : ''
                        }`}
                        style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}
                      >
                        {elProps.phone && (
                          <a
                            href={`tel:${elProps.phone}`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              color: 'rgba(255,255,255,0.75)',
                              textDecoration: 'none',
                            }}
                          >
                            <Phone size={14} color="#38bdf8" />
                            <span>{elProps.phone}</span>
                          </a>
                        )}
                        {elProps.email && (
                          <a
                            href={`mailto:${elProps.email}`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              color: 'rgba(255,255,255,0.75)',
                              textDecoration: 'none',
                            }}
                          >
                            <Mail size={14} color="#ec4899" />
                            <span>{elProps.email}</span>
                          </a>
                        )}
                        {elProps.address && (
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'flex-start',
                              gap: '8px',
                              color: 'rgba(255,255,255,0.75)',
                            }}
                          >
                            <MapPin size={14} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span>{elProps.address}</span>
                          </div>
                        )}
                        {elProps.hours && (
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              color: 'rgba(255,255,255,0.75)',
                            }}
                          >
                            <Clock size={14} color="#10b981" />
                            <span>{elProps.hours}</span>
                          </div>
                        )}
                      </div>
                    );
                  }

                  // ─── 4. Social Links ───
                  if (el.type === 'social-links' || el.type === 'social-icons' || el.type === 'social-follow') {
                    const platforms = elProps.platforms || [
                      { platform: 'twitter', url: 'https://twitter.com', enabled: true },
                      { platform: 'instagram', url: 'https://instagram.com', enabled: true },
                      { platform: 'linkedin', url: 'https://linkedin.com', enabled: true },
                      { platform: 'youtube', url: 'https://youtube.com', enabled: true },
                    ];

                    return (
                      <div
                        key={el.id}
                        onClick={(e) => handleElementClick(e, el)}
                        className={`${styles.socialIconRow} ${isEditorInteractive ? styles.elementEditable : ''} ${
                          isElSelected ? styles.elementSelected : ''
                        }`}
                        style={{
                          marginTop: '8px',
                          display: 'flex',
                          justifyContent: isCentered ? 'center' : 'flex-start',
                          width: isCentered ? '100%' : 'auto',
                        }}
                      >
                        {platforms
                          .filter((p: any) => p.enabled !== false)
                          .map((p: any, pIdx: number) => (
                            <a
                              key={pIdx}
                              href={p.url || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.socialIconBtn}
                              style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                color: textColor,
                              }}
                              title={p.platform}
                            >
                              {renderSocialIcon(p.platform, 15)}
                            </a>
                          ))}
                      </div>
                    );
                  }

                  // ─── 5. Link Group (Directory Columns) ───
                  if (el.type === 'link-group' || el.type === 'navigation-menu' || el.type === 'category-menu') {
                    const links = elProps.links || [
                      { label: 'All Products', href: '/products' },
                      { label: 'Featured Collections', href: '/collections', badge: 'HOT' },
                      { label: 'New Arrivals', href: '/new', badge: 'NEW' },
                      { label: 'Special Discounts', href: '/sale' },
                    ];

                    const heading = elProps.heading || el.name || 'Quick Links';

                    return (
                      <div
                        key={el.id}
                        onClick={(e) => handleElementClick(e, el)}
                        className={`${isEditorInteractive ? styles.elementEditable : ''} ${
                          isElSelected ? styles.elementSelected : ''
                        }`}
                        style={{
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: isCentered ? 'center' : 'stretch',
                        }}
                      >
                        {/* Column Header (Clickable Accordion on Mobile) */}
                        <div
                          className={styles.linkGroupHeading}
                          onClick={isMobile ? (e) => { e.stopPropagation(); toggleAccordion(col.id); } : undefined}
                          style={{
                            color: elProps.headingColor || textColor,
                            fontSize: `${elProps.headingSize ?? 13.5}px`,
                            cursor: isMobile ? 'pointer' : 'default',
                            paddingBottom: isMobile ? '8px' : '14px',
                            borderBottom: isMobile ? '1px solid rgba(255,255,255,0.08)' : 'none',
                            justifyContent: isCentered ? 'center' : 'flex-start',
                            textAlign: isCentered ? 'center' : 'left',
                          }}
                        >
                          <span>{heading}</span>
                          {isMobile && (
                            <span
                              style={{
                                transform: isAccordionOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s ease',
                                display: 'flex',
                              }}
                            >
                              <ChevronDown size={16} />
                            </span>
                          )}
                        </div>

                        {/* Link Items (Collapsible on Mobile) */}
                        {(!isMobile || isAccordionOpen) && (
                          <ul
                            className={styles.linkList}
                            style={{
                              paddingTop: isMobile ? '10px' : '0',
                              gap: isCentered ? '18px' : `${elProps.gap ?? 11}px`,
                              display: 'flex',
                              flexDirection: isCentered && !isMobile ? 'row' : 'column',
                              flexWrap: 'wrap',
                              justifyContent: isCentered ? 'center' : 'flex-start',
                              alignItems: isCentered ? 'center' : 'flex-start',
                            }}
                          >
                            {links.map((link: any, lIdx: number) => (
                              <li key={lIdx}>
                                <a
                                  href={link.href || '#'}
                                  onClick={(e) => {
                                    if (isEditorInteractive) e.preventDefault();
                                  }}
                                  className={styles.linkItemAnchor}
                                  style={{
                                    color: elProps.textColor || 'rgba(255, 255, 255, 0.72)',
                                    fontSize: `${elProps.fontSize ?? 13.5}px`,
                                  }}
                                >
                                  <span>{link.label}</span>
                                  {link.badge && (
                                    <span
                                      className={styles.linkBadge}
                                      style={{
                                        backgroundColor:
                                          link.badge === 'HOT'
                                            ? '#ef4444'
                                            : link.badge === 'NEW'
                                            ? '#10b981'
                                            : link.badge === 'SALE'
                                            ? '#f59e0b'
                                            : '#6366f1',
                                        color: '#ffffff',
                                      }}
                                    >
                                      {link.badge}
                                    </span>
                                  )}
                                  {link.openInNewTab && (
                                    <ArrowUpRight size={11} style={{ opacity: 0.6 }} />
                                  )}
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  }

                  // ─── 6. Newsletter Form in Column ───
                  if (el.type === 'newsletter-form') {
                    return (
                      <div
                        key={el.id}
                        onClick={(e) => handleElementClick(e, el)}
                        className={`${isEditorInteractive ? styles.elementEditable : ''} ${
                          isElSelected ? styles.elementSelected : ''
                        }`}
                        style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
                      >
                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: textColor }}>
                          {elProps.title || 'Newsletter'}
                        </h4>
                        <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
                          {elProps.subtitle || 'Get weekly product drops & promotions.'}
                        </p>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input
                            type="email"
                            placeholder={elProps.placeholder || 'Email address'}
                            style={{
                              flex: 1,
                              padding: '8px 12px',
                              borderRadius: '6px',
                              backgroundColor: 'rgba(255,255,255,0.08)',
                              border: '1px solid rgba(255,255,255,0.2)',
                              color: textColor,
                              fontSize: '12.5px',
                              outline: 'none',
                            }}
                          />
                          <button
                            type="button"
                            style={{
                              padding: '8px 14px',
                              borderRadius: '6px',
                              backgroundColor: '#6366f1',
                              color: '#fff',
                              border: 'none',
                              fontWeight: 600,
                              fontSize: '12.5px',
                              cursor: 'pointer',
                            }}
                          >
                            {elProps.buttonText || 'Join'}
                          </button>
                        </div>
                      </div>
                    );
                  }

                  // ─── 7. App Download & QR Code ───
                  if (el.type === 'app-download' || el.type === 'qr-code') {
                    return (
                      <div
                        key={el.id}
                        onClick={(e) => handleElementClick(e, el)}
                        className={`${isEditorInteractive ? styles.elementEditable : ''} ${
                          isElSelected ? styles.elementSelected : ''
                        }`}
                        style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                      >
                        <span style={{ fontSize: '12px', fontWeight: 700, color: textColor, textTransform: 'uppercase' }}>
                          {elProps.title || 'Get Our App'}
                        </span>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            style={{
                              padding: '6px 12px',
                              borderRadius: '6px',
                              backgroundColor: 'rgba(255,255,255,0.08)',
                              border: '1px solid rgba(255,255,255,0.15)',
                              color: textColor,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            <Smartphone size={14} /> App Store
                          </button>
                          <button
                            type="button"
                            style={{
                              padding: '6px 12px',
                              borderRadius: '6px',
                              backgroundColor: 'rgba(255,255,255,0.08)',
                              border: '1px solid rgba(255,255,255,0.15)',
                              color: textColor,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            <Download size={14} /> Google Play
                          </button>
                        </div>
                      </div>
                    );
                  }

                  // Fallback generic element
                  return (
                    <div
                      key={el.id}
                      onClick={(e) => handleElementClick(e, el)}
                      className={`${isEditorInteractive ? styles.elementEditable : ''} ${
                        isElSelected ? styles.elementSelected : ''
                      }`}
                    >
                      <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
                        {el.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </footer>
  );
};

export default FooterMainSection;
