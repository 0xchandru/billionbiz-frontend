import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  X,
  ArrowRight,
  Flame,
  Clock,
  Info,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getEditorPath } from '../utils/editorNavigation';
import { useEditorContextStore } from '../../../store/editorContextStore';
import { useLandingEditorStore } from '../../../store/landingEditorStore';
import { useSiteStore } from '../../../store/siteStore';
import { createDefaultHeaderStack } from '../engine/headerPresets';
import type { HeaderRow } from '../engine/types';
import styles from './HeaderSections.module.css';

interface AnnouncementBarSectionProps {
  props?: any;
  device?: string;
  isEditorInteractive?: boolean;
  useEditorModel?: boolean;
}

export const AnnouncementBarSection: React.FC<AnnouncementBarSectionProps> = ({
  props: passedProps,
  device: _passedDevice,
  isEditorInteractive = true,
  useEditorModel = false,
}) => {
  const navigate = useNavigate();
  const store = useEditorContextStore();
  const { selectedPageId, navigateToPage, setRightSidebarOpen, isRightSidebarOpen, requestEditorSwitch } = useLandingEditorStore();
  const { theme } = useSiteStore();

  const isEditingHeader = selectedPageId === 'header-global';

  const previewRows = store.presetPreview?.isActive && store.presetPreview.editorType === 'header'
    ? store.presetPreview.previewRows as HeaderRow[] | undefined
    : undefined;
  const persistedRows = (passedProps?._headerEditor?.rows || passedProps?._headerRows) as HeaderRow[] | undefined;
  const effectiveRows = previewRows || (useEditorModel ? store.headerRows : (persistedRows || store.headerRows));

  // All header bands read the same live/preview model as the navbar.
  const row: HeaderRow = useMemo(() => {
    const found = effectiveRows.find(
      (r) => r.type === 'announcement' || r.id === 'row-announcement' || r.id.includes('announcement')
    );
    if (found) return found;
    const defaultStack = createDefaultHeaderStack();
    const fallback = defaultStack.find((r) => r.type === 'announcement') || defaultStack[0];
    if (passedProps && fallback.elements[0]) {
      return {
        ...fallback,
        elements: [{ ...fallback.elements[0], props: { ...fallback.elements[0].props, ...passedProps } }],
      };
    }
    return fallback;
  }, [effectiveRows, passedProps]);

  const primaryEl = row.elements?.[0];
  const elProps = primaryEl?.props || passedProps || {};
  const variantId = row.layout?.variantId || elProps.variant || 'single';

  // Announcements array
  const announcements = useMemo(() => {
    if (Array.isArray(elProps.announcements) && elProps.announcements.length > 0) {
      return elProps.announcements;
    }
    if (Array.isArray(elProps.slides) && elProps.slides.length > 0) {
      return elProps.slides;
    }
    if (elProps.text) {
      return [
        {
          text: elProps.text,
          link: elProps.link || elProps.ctaLink || '/collections/sale',
          badge: elProps.badge || 'PROMO',
          cta: elProps.ctaText || elProps.cta || 'Shop Now',
        },
      ];
    }
    return [
      {
        text: '✨ Free worldwide shipping on orders over $99! Use code FREESHIP',
        link: '/collections/sale',
        badge: 'HOT',
        cta: 'Shop Now',
      },
      {
        text: '⚡ Summer Special: Save up to 40% on selected seasonal items',
        link: '/collections/featured',
        badge: 'SALE',
        cta: 'Claim Offer',
      },
    ];
  }, [elProps]);

  // Carousel Index State
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [showPreviewNotice, setShowPreviewNotice] = useState(false);
  const noticeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-rotation for carousel
  useEffect(() => {
    if (variantId !== 'carousel' || announcements.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [variantId, announcements.length]);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    if (variantId !== 'countdown' && !elProps.showCountdown) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [variantId, elProps.showCountdown]);

  if (!row.isVisible || isDismissed) {
    return null;
  }

  // Selection & Hover
  const isSelected =
    isEditingHeader &&
    isRightSidebarOpen &&
    store.selectedTarget.type === 'row' &&
    store.selectedTarget.editorType === 'header' &&
    (store.selectedTarget.rowId === row.id ||
     store.selectedTarget.rowId === 'announcement-bar' ||
     store.selectedTarget.rowId.includes('announcement'));

  const handleClick = (e: React.MouseEvent) => {
    if (!isEditorInteractive) return;
    e.stopPropagation();
    const executeSelect = () => {
      if (selectedPageId !== 'header-global') {
        navigateToPage('header-global', 'announcement-bar');
        navigate(getEditorPath('header-global', 'announcement-bar'));
        useEditorContextStore.getState().setEditorType('header');
      }
      store.selectTarget({ type: 'row', editorType: 'header', rowId: row.id });
      useLandingEditorStore.getState().setSelectedSectionId('announcement-bar');
      setRightSidebarOpen(true);
    };

    if (selectedPageId !== 'header-global') {
      requestEditorSwitch({
        targetPageId: 'header-global',
        targetName: 'Header Editor',
        onConfirm: executeSelect,
      });
      return;
    }
    executeSelect();
  };

  // Styling calculation
  const palette = theme?.palette || (theme as any)?.colors;
  const brandPrimary = palette?.brand?.primary || '#2563eb';
  const bgColor = row.styling?.bgColor || '#0f172a';
  const textColor = row.styling?.textColor || '#ffffff';
  const minHeight = row.layout?.height ? `${row.layout.height}px` : '38px';
  const fontSize = row.styling?.fontSize ? `${row.styling.fontSize}px` : '12px';

  return (
    <div
      id={`header-row-${row.id}`}
      data-header-row-id={row.id}
      data-header-row-type="announcement"
      className={`${styles.headerRow} ${isEditorInteractive ? styles.headerRowEditable : ''} ${
        isSelected && isEditingHeader ? styles.headerRowSelected : ''
      } ${hovered && !isSelected && isEditingHeader ? styles.headerRowHovered : ''}`}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        minHeight,
        fontSize,
        borderBottom: row.styling?.borderBottom !== false ? `1px solid ${row.styling?.borderColor || 'rgba(255, 255, 255, 0.1)'}` : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 25,
        padding: '0 16px',
        overflow: 'hidden',
      }}
    >
      {/* ── 1. MARQUEE TICKER VARIANT ── */}
      {variantId === 'marquee' && (
        <div style={{ width: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
          <div className={styles.marqueeTrack}>
            {[...announcements, ...announcements, ...announcements, ...announcements].map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '0 24px',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.badge && (
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      backgroundColor: brandPrimary,
                      color: '#ffffff',
                      padding: '1px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
                <span style={{ fontWeight: 500 }}>{item.text}</span>
                {item.cta && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontWeight: 700,
                      color: brandPrimary,
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    }}
                  >
                    {item.cta} <ArrowRight size={12} />
                  </span>
                )}
                <span style={{ opacity: 0.4, margin: '0 8px' }}>•</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 2. ROTATING CAROUSEL VARIANT ── */}
      {variantId === 'carousel' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            width: '100%',
            maxWidth: '1200px',
            position: 'relative',
          }}
        >
          {announcements.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlideIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: textColor,
                opacity: 0.7,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
              }}
              aria-label="Previous announcement"
            >
              <ChevronLeft size={16} />
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'center' }}>
            {announcements[currentSlideIndex]?.badge && (
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  backgroundColor: brandPrimary,
                  color: '#ffffff',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                }}
              >
                {announcements[currentSlideIndex].badge}
              </span>
            )}
            <span style={{ fontWeight: 500 }}>{announcements[currentSlideIndex]?.text}</span>
            {announcements[currentSlideIndex]?.cta && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 700,
                  color: brandPrimary,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
              >
                {announcements[currentSlideIndex].cta} <ArrowRight size={12} />
              </span>
            )}
          </div>

          {announcements.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlideIndex((prev) => (prev + 1) % announcements.length);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: textColor,
                opacity: 0.7,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
              }}
              aria-label="Next announcement"
            >
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      )}

      {/* ── 3. COUNTDOWN TIMER VARIANT ── */}
      {(variantId === 'countdown' || elProps.showCountdown) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            width: '100%',
            maxWidth: '1200px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Flame size={14} color="#f59e0b" />
            <span style={{ fontWeight: 600 }}>{announcements[0]?.text || 'Limited Time Flash Sale:'}</span>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'monospace', fontWeight: 700 }}>
            <Clock size={13} style={{ opacity: 0.8 }} />
            <span style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '2px 5px', borderRadius: '4px' }}>
              {String(timeLeft.hours).padStart(2, '0')}h
            </span>
            :
            <span style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '2px 5px', borderRadius: '4px' }}>
              {String(timeLeft.minutes).padStart(2, '0')}m
            </span>
            :
            <span style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '2px 5px', borderRadius: '4px' }}>
              {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
          </div>

          {announcements[0]?.cta && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 700,
                color: '#f59e0b',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              {announcements[0].cta} <ArrowRight size={12} />
            </span>
          )}
        </div>
      )}

      {/* ── 4. SINGLE / SPLIT / DEFAULT VARIANT ── */}
      {variantId !== 'marquee' && variantId !== 'carousel' && variantId !== 'countdown' && !elProps.showCountdown && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: variantId === 'split' ? 'space-between' : 'center',
            width: '100%',
            maxWidth: '1200px',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {announcements[0]?.badge && (
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  backgroundColor: brandPrimary,
                  color: '#ffffff',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                }}
              >
                {announcements[0].badge}
              </span>
            )}
            <span style={{ fontWeight: 500 }}>{announcements[0]?.text}</span>
          </div>

          {announcements[0]?.cta && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 700,
                color: brandPrimary,
                textDecoration: 'underline',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {announcements[0].cta} <ArrowRight size={12} />
            </span>
          )}
        </div>
      )}

      {/* Optional dismiss button */}
      {elProps.showCloseButton !== false && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (useEditorModel || isEditorInteractive) {
              if (noticeTimeoutRef.current) clearTimeout(noticeTimeoutRef.current);
              setShowPreviewNotice(true);
              noticeTimeoutRef.current = setTimeout(() => setShowPreviewNotice(false), 2600);
              return;
            }
            setIsDismissed(true);
          }}
          style={{
            position: 'absolute',
            right: '12px',
            background: 'transparent',
            border: 'none',
            color: textColor,
            opacity: 0.6,
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
          }}
          title="Dismiss"
          aria-label="Dismiss Announcement"
        >
          <X size={14} />
        </button>
      )}

      {/* Preview notice banner */}
      {showPreviewNotice && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '5px 14px',
            borderRadius: '9999px',
            fontSize: '11px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
            zIndex: 100,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <Info size={13} color="#38bdf8" />
          <span>This will not work in preview</span>
        </div>
      )}
    </div>
  );
};

export default AnnouncementBarSection;
