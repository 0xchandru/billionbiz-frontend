// ============================================================
// PDP BUILDER — LIVE PRODUCT DETAIL PAGE PREVIEW (CENTER PANEL)
// Dynamic product rendering, interactive components, responsive modes,
// click-to-select, and dynamic content-based layout reflow
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  Star,
  CheckCircle2,
  Truck,
  RotateCcw,
  ShieldCheck,
  Heart,
  Plus,
  Minus,
  Zap,
  ShoppingBag,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Check,
  X,
  Ruler,
} from 'lucide-react';
import { usePdpStore } from './pdpStore';
import { useLandingEditorStore } from '../../../store/landingEditorStore';
import type { PdpBlock } from './types/pdpBlockTypes';
import { resolveBlockZone, isProductInfoBlock, isTemplateSection } from './pdpBlockRegistry';
import { evaluateBlockVisibility } from './pdpVisibilityEngine';
import styles from './pdp.module.css';

const COLOR_HEX_MAP: Record<string, string> = {
  black: '#111827',
  white: '#ffffff',
  slate: '#475569',
  gray: '#6b7280',
  grey: '#6b7280',
  silver: '#cbd5e1',
  blue: '#2563eb',
  navy: '#1e3a8a',
  red: '#dc2626',
  burgundy: '#881337',
  green: '#16a34a',
  emerald: '#059669',
  olive: '#556b2f',
  yellow: '#eab308',
  gold: '#d97706',
  orange: '#ea580c',
  purple: '#9333ea',
  pink: '#ec4899',
  rose: '#f43f5e',
  rosegold: '#b76e79',
  'rose gold': '#b76e79',
  brown: '#78350f',
  tan: '#d2b48c',
  beige: '#f5f5dc',
  cream: '#fffdd0',
  cyan: '#06b6d4',
  teal: '#0d9488',
};

const resolveColorHex = (colorName: string): string => {
  const clean = colorName.toLowerCase().trim();
  if (COLOR_HEX_MAP[clean]) return COLOR_HEX_MAP[clean];
  for (const [k, v] of Object.entries(COLOR_HEX_MAP)) {
    if (clean.includes(k)) return v;
  }
  return '#cbd5e1';
};

interface PdpLivePreviewProps {
  overrideDevice?: string;
}

export const PdpLivePreview: React.FC<PdpLivePreviewProps> = ({ overrideDevice }) => {
  const {
    getActiveTemplate,
    getSelectedProduct,
    selectedBlockId,
    setPreviewDevice,
    selectBlock,
    products,
    selectProduct,
  } = usePdpStore();

  const storeDevice = useLandingEditorStore(state => state.device);
  const setRightSidebarOpen = useLandingEditorStore(state => state.setRightSidebarOpen);
  const currentDevice = ((overrideDevice || (storeDevice === 'all' ? 'desktop' : storeDevice) || 'desktop')) as 'desktop' | 'tablet' | 'mobile';

  // Synchronize preview device with topbar device selector
  useEffect(() => {
    if (['desktop', 'tablet', 'mobile'].includes(currentDevice)) {
      setPreviewDevice(currentDevice);
    }
  }, [currentDevice, setPreviewDevice]);

  const activeTemplate = getActiveTemplate();
  const product = getSelectedProduct();

  // Interactive component states inside the preview
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [expandedFaqs, setExpandedFaqs] = useState<Record<number, boolean>>({ 0: true });
  const [deliveryZip, setDeliveryZip] = useState('');
  const [deliveryResult, setDeliveryResult] = useState<string | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const handleBlockClick = (blockId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const landingStore = useLandingEditorStore.getState();
    const executeSelect = () => {
      if (landingStore.selectedPageId !== 'product-details-page') {
        landingStore.navigateToPage('product-details-page');
      }
      selectBlock(blockId);
      landingStore.setRightSidebarOpen(true);
    };

    if (landingStore.selectedPageId !== 'product-details-page' && landingStore.pagesNavLevel === 'page-detail') {
      landingStore.requestEditorSwitch({
        targetPageId: 'product-details-page',
        targetName: 'Product Detail Page Builder',
        onConfirm: executeSelect,
      });
      return;
    }
    executeSelect();
  };

  // Handle variant selection
  const handleVariantSelect = (variantId: string, option: string) => {
    setSelectedVariants(prev => ({ ...prev, [variantId]: option }));
  };

  // Handle postal code delivery test
  const handleCheckDelivery = () => {
    if (!deliveryZip.trim()) return;
    setDeliveryResult(`Estimated delivery by this Thursday to ${deliveryZip.trim()}`);
  };

  // ────────────────────────────────────────────────────────────
  // RENDER INDIVIDUAL BLOCKS
  // ────────────────────────────────────────────────────────────
  const renderBlockContent = (block: PdpBlock) => {
    const c = block.content;
    const d = block.design;

    switch (block.type) {
      // ── 1. PRODUCT MEDIA ──
      case 'media_gallery': {
        const images = product.images || [];
        const desktopLayout = activeTemplate.desktopMediaLayout || (c.thumbnailPosition === 'left' ? 'thumbnails-left' : 'thumbnails-bottom');
        const mobileLayout = activeTemplate.mobileMediaLayout || 'carousel';
        const zoomMode = activeTemplate.imageZoom || (c.enableZoom ? 'hover' : 'none');
        const ratio = c.aspectRatio || '1:1';
        const currentImg = images[selectedImageIdx] || images[0] || 'https://via.placeholder.com/600';

        const ratioStyle: React.CSSProperties = {
          aspectRatio: ratio === '1:1' ? '1/1' : ratio === '3:4' ? '3/4' : ratio === '4:3' ? '4/3' : 'auto',
        };

        const thumbSizePx = c.thumbnailSize === 'small' ? 52 : c.thumbnailSize === 'large' ? 84 : 68;

        // ── Mobile layout handling ──
        if (currentDevice === 'mobile') {
          if (mobileLayout === 'stacked') {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    style={{
                      borderRadius: `${d.borderRadius || 12}px`,
                      overflow: 'hidden',
                      background: '#f8fafc',
                      border: d.border || '1px solid #e2e8f0',
                      ...ratioStyle,
                    }}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.name} ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: c.imageFit || 'cover' }}
                    />
                  </div>
                ))}
              </div>
            );
          }

          // Mobile Carousel with swipe / dot indicator
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div
                style={{
                  position: 'relative',
                  borderRadius: `${d.borderRadius || 12}px`,
                  overflow: 'hidden',
                  background: '#f8fafc',
                  border: d.border || '1px solid #e2e8f0',
                  ...ratioStyle,
                }}
              >
                <img
                  src={currentImg}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: c.imageFit || 'cover' }}
                />

                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIdx(prev => (prev === 0 ? images.length - 1 : prev - 1));
                      }}
                      style={{
                        position: 'absolute',
                        left: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                      }}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIdx(prev => (prev === images.length - 1 ? 0 : prev + 1));
                      }}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                      }}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', padding: '4px 0' }}>
                  {images.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIdx(dotIdx);
                      }}
                      style={{
                        width: selectedImageIdx === dotIdx ? '18px' : '6px',
                        height: '6px',
                        borderRadius: '999px',
                        border: 'none',
                        background: selectedImageIdx === dotIdx ? '#198754' : '#cbd5e1',
                        padding: 0,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        }

        // ── Desktop / Tablet layouts ──
        if (desktopLayout === 'stacked') {
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  style={{
                    borderRadius: `${d.borderRadius || 12}px`,
                    overflow: 'hidden',
                    background: '#f8fafc',
                    border: d.border || '1px solid #e2e8f0',
                    ...ratioStyle,
                    cursor: zoomMode === 'lightbox' ? 'zoom-in' : 'default',
                  }}
                  onClick={() => {
                    if (zoomMode === 'lightbox') {
                      setSelectedImageIdx(idx);
                      setIsLightboxOpen(true);
                    }
                  }}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: c.imageFit || 'cover' }}
                  />
                </div>
              ))}
            </div>
          );
        }

        if (desktopLayout === 'grid-2') {
          return (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  style={{
                    borderRadius: `${d.borderRadius || 12}px`,
                    overflow: 'hidden',
                    background: '#f8fafc',
                    border: d.border || '1px solid #e2e8f0',
                    ...ratioStyle,
                    gridColumn: idx === 0 && images.length % 2 === 1 ? 'span 2' : undefined,
                    cursor: zoomMode === 'lightbox' ? 'zoom-in' : 'default',
                  }}
                  onClick={() => {
                    if (zoomMode === 'lightbox') {
                      setSelectedImageIdx(idx);
                      setIsLightboxOpen(true);
                    }
                  }}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: c.imageFit || 'cover' }}
                  />
                </div>
              ))}
            </div>
          );
        }

        // Thumbnails Layout (Bottom or Left)
        const isThumbLeft = desktopLayout === 'thumbnails-left';

        const thumbnailsList = (
          <div
            style={{
              display: 'flex',
              flexDirection: isThumbLeft ? 'column' : 'row',
              justifyContent: isThumbLeft ? 'flex-start' : 'center',
              gap: '8px',
              overflowX: isThumbLeft ? 'hidden' : 'auto',
              overflowY: isThumbLeft ? 'auto' : 'hidden',
              padding: '4px',
              maxHeight: isThumbLeft ? '500px' : undefined,
            }}
          >
            {images.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIdx(idx);
                }}
                style={{
                  width: `${thumbSizePx}px`,
                  height: `${thumbSizePx}px`,
                  flexShrink: 0,
                  borderRadius: '8px',
                  border: selectedImageIdx === idx ? '2px solid #198754' : '1px solid #e2e8f0',
                  padding: '2px',
                  background: '#ffffff',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  transition: 'all 0.15s ease',
                }}
              >
                <img
                  src={imgUrl}
                  alt={`Thumbnail ${idx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: c.imageFit || 'cover', borderRadius: '6px' }}
                />
              </button>
            ))}
          </div>
        );

        return (
          <div
            style={{
              display: 'flex',
              flexDirection: isThumbLeft ? 'row' : 'column',
              gap: '12px',
              alignItems: isThumbLeft ? 'flex-start' : 'stretch',
            }}
          >
            {/* If thumbnails left, render them before main stage */}
            {isThumbLeft && thumbnailsList}

            {/* Main Stage Image */}
            <div
              style={{
                flex: 1,
                position: 'relative',
                borderRadius: `${d.borderRadius || 12}px`,
                overflow: 'hidden',
                background: '#f8fafc',
                border: d.border || '1px solid #e2e8f0',
                ...ratioStyle,
                cursor: zoomMode === 'lightbox' ? 'zoom-in' : 'default',
              }}
              onMouseEnter={() => zoomMode === 'hover' && setIsZoomed(true)}
              onMouseLeave={() => zoomMode === 'hover' && setIsZoomed(false)}
              onClick={() => {
                if (zoomMode === 'lightbox') {
                  setIsLightboxOpen(true);
                }
              }}
            >
              <img
                src={currentImg}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: c.imageFit || 'cover',
                  transform: zoomMode === 'hover' && isZoomed ? 'scale(1.25)' : 'scale(1)',
                  transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />

              {/* Navigation Arrows */}
              {c.showNavArrows && images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIdx(prev => (prev === 0 ? images.length - 1 : prev - 1));
                    }}
                    style={{
                      position: 'absolute',
                      left: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    }}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIdx(prev => (prev === images.length - 1 ? 0 : prev + 1));
                    }}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>

            {/* If thumbnails bottom, render them after main stage */}
            {!isThumbLeft && thumbnailsList}
          </div>
        );
      }

      case 'media_video': {
        if (!product.videoUrl) return null;
        return (
          <div style={{ borderRadius: '12px', overflow: 'hidden', background: '#000000' }}>
            <video
              src={product.videoUrl}
              controls={c.controls !== false}
              autoPlay={c.autoplay === true}
              loop={c.loop === true}
              muted={c.muted !== false}
              style={{ width: '100%', maxHeight: '420px', display: 'block' }}
            />
            {c.caption && (
              <div style={{ padding: '8px 12px', fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>
                {c.caption}
              </div>
            )}
          </div>
        );
      }

      // ── 2. PRODUCT INFORMATION ──
      case 'info_title': {
        const titleText = `${c.prefix || ''}${product.name}${c.suffix || ''}`;
        const Tag = (c.htmlTag || 'h1') as keyof React.JSX.IntrinsicElements;
        return (
          <Tag
            style={{
              margin: 0,
              fontSize: `${d.fontSize || 28}px`,
              fontWeight: d.fontWeight || 700,
              color: d.headingColor || '#0f172a',
              textTransform: c.textTransform || 'none',
              textAlign: d.textAlign || 'left',
              lineHeight: 1.25,
            }}
          >
            {titleText}
          </Tag>
        );
      }

      case 'info_subtitle': {
        if (!product.subtitle) return null;
        return (
          <div style={{ fontSize: `${d.fontSize || 15}px`, color: d.textColor || '#64748b', lineHeight: 1.4 }}>
            {product.subtitle}
          </div>
        );
      }

      case 'info_vendor': {
        if (!product.vendor) return null;
        return (
          <div style={{ fontSize: `${d.fontSize || 12}px`, fontWeight: 600, color: d.textColor || '#198754', letterSpacing: '0.05em' }}>
            {c.showLabel && <span style={{ color: '#64748b', marginRight: '4px' }}>{c.labelText || 'Brand:'}</span>}
            <span>{product.vendor}</span>
          </div>
        );
      }

      case 'info_category': {
        if (!product.category) return null;
        return (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px' }}>
              {product.category}
            </span>
          </div>
        );
      }

      case 'info_sku': {
        if (!product.sku) return null;
        return (
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
            {c.showLabel && <span style={{ marginRight: '4px' }}>{c.labelText || 'SKU:'}</span>}
            <span style={{ fontFamily: 'monospace' }}>{product.sku}</span>
          </div>
        );
      }

      case 'info_rating': {
        if (!product.rating) return null;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ display: 'flex', color: c.starColor || '#f59e0b' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  size={c.starSize || 15}
                  fill={star <= Math.round(product.rating || 5) ? (c.starColor || '#f59e0b') : 'none'}
                />
              ))}
            </div>
            {c.showScoreNumber && (
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                {product.rating.toFixed(1)}
              </span>
            )}
            {c.showReviewCount && product.reviewCount && (
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                ({product.reviewCount} customer reviews)
              </span>
            )}
          </div>
        );
      }

      case 'info_stock_status': {
        // CRITICAL SPEC REQUIREMENT: Stock = 0 is VALID data, MUST NOT BE HIDDEN!
        const stockCount = typeof product.stock === 'number' ? product.stock : 10;
        const isOutOfStock = stockCount <= 0;
        const isLowStock = !isOutOfStock && stockCount <= (c.lowStockThreshold || 10);

        const statusColor = isOutOfStock ? '#dc2626' : isLowStock ? '#d97706' : '#16a34a';
        const statusBg = isOutOfStock ? '#fef2f2' : isLowStock ? '#fffbeb' : '#f0fdf4';
        const statusText = isOutOfStock
          ? c.outOfStockText || 'Currently Sold Out'
          : isLowStock
          ? (c.lowStockText || 'Only {count} left in stock - order soon').replace('{count}', String(stockCount))
          : c.inStockText || 'In Stock - Ready to Ship';

        return (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 10px',
              borderRadius: '6px',
              background: statusBg,
              color: statusColor,
              fontSize: '12.5px',
              fontWeight: 600,
            }}
          >
            {c.showPulseDot && (
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: statusColor,
                  display: 'inline-block',
                }}
              />
            )}
            <span>{statusText}</span>
          </div>
        );
      }

      // ── 3. PRICING & OFFERS ──
      case 'price_display': {
        const symbol = c.currencySymbol || '$';
        const price = product.price || 0;
        const compareAt = product.compareAtPrice;
        const hasDiscount = typeof compareAt === 'number' && compareAt > price;
        const discountPct = hasDiscount ? Math.round(((compareAt - price) / compareAt) * 100) : 0;

        const saleColor = (c.salePriceColor as string) || '#dc2626';
        const showTaxNotice = !!c.showTaxNotice;
        const showInstallments = c.showInstallments !== false;

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: `${d.fontSize || 26}px`,
                  fontWeight: 700,
                  color: hasDiscount ? saleColor : (d.textColor || '#0f172a'),
                }}
              >
                {symbol}{price.toFixed(2)}
              </span>

              {c.showCompareAtPrice && hasDiscount && (
                <span style={{ fontSize: '16px', color: '#94a3b8', textDecoration: 'line-through' }}>
                  {symbol}{compareAt.toFixed(2)}
                </span>
              )}

              {c.showDiscountBadge && hasDiscount && (
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    background: '#fef2f2',
                    color: saleColor,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid #fee2e2',
                  }}
                >
                  Save {discountPct}%
                </span>
              )}
            </div>

            {showTaxNotice && (
              <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                Tax included. Free shipping calculated at checkout.
              </div>
            )}

            {showInstallments && price > 20 && (
              <div style={{ fontSize: '12px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>or 4 interest-free payments of <strong>{symbol}{(price / 4).toFixed(2)}</strong> with</span>
                <span style={{ fontWeight: 700, color: '#ec4899' }}>Klarna</span>
              </div>
            )}
          </div>
        );
      }

      case 'price_variant_selector': {
        const variants = product.variants || [];
        if (variants.length === 0) return null;

        const displayStyle = (c.displayStyle as string) || 'pills';
        const swatchShape = (c.swatchShape as string) || 'circle';
        const swatchSize = (c.swatchSize as string) || 'medium';
        const pillRadius = (c.pillRadius as string) || 'rounded';
        const showSelectedLabel = c.showSelectedLabel !== false;
        const outOfStockStyle = (c.outOfStockStyle as string) || 'diagonal-slash';
        const showSizeGuide = c.showSizeGuide !== false;
        const sizeGuideLabel = (c.sizeGuideLabel as string) || 'Size guide';
        const activeBorderColor = (c.activeBorderColor as string) || '#2563eb';

        const getPillBorderRadius = () => {
          if (pillRadius === 'pill') return '9999px';
          if (pillRadius === 'square') return '2px';
          return '6px';
        };

        const getSwatchDimensions = () => {
          if (swatchSize === 'small') return { width: 28, height: 28, fontSize: 11 };
          if (swatchSize === 'large') return { width: 44, height: 44, fontSize: 14 };
          return { width: 36, height: 36, fontSize: 12 };
        };

        const getSwatchBorderRadius = () => {
          if (swatchShape === 'circle') return '50%';
          if (swatchShape === 'square') return '3px';
          return '8px';
        };

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {variants.map(v => {
              const currentChoice = selectedVariants[v.id] || v.selectedOption || v.options[0];
              const isColorOption = v.name.toLowerCase().includes('color') || v.name.toLowerCase().includes('colour') || displayStyle === 'color-swatches';
              const isSizeOption = v.name.toLowerCase().includes('size') || v.id.includes('size');

              return (
                <div key={v.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* Option Header: Name, Selected Value, and Size Guide Link */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                      <span>{v.name}</span>
                      {showSelectedLabel && (
                        <>
                          <span style={{ margin: '0 4px', color: '#94a3b8' }}>:</span>
                          <span style={{ fontWeight: 500, color: '#64748b' }}>{currentChoice}</span>
                        </>
                      )}
                    </div>

                    {showSizeGuide && isSizeOption && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsSizeGuideOpen(true);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#2563eb',
                          fontSize: '12px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: 0,
                          textDecoration: 'underline',
                        }}
                      >
                        <Ruler size={13} />
                        <span>{sizeGuideLabel}</span>
                      </button>
                    )}
                  </div>

                  {/* 1. DROPDOWN STYLE */}
                  {displayStyle === 'dropdown' ? (
                    <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
                      <select
                        value={currentChoice}
                        onChange={(e) => handleVariantSelect(v.id, e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: getPillBorderRadius(),
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          fontSize: '13px',
                          color: '#0f172a',
                          fontWeight: 500,
                          cursor: 'pointer',
                          outline: 'none',
                        }}
                      >
                        {v.options.map(opt => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : isColorOption ? (
                    /* 2. COLOR SWATCHES STYLE */
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                      {v.options.map(opt => {
                        const isSelected = currentChoice === opt;
                        const hex = resolveColorHex(opt);
                        const isLight = hex === '#ffffff' || hex === '#fffdd0' || hex === '#f5f5dc';
                        const dims = getSwatchDimensions();
                        const isOutOfStock = opt.includes('(Sold Out)') || opt.includes('(Unavailable)');
                        if (isOutOfStock && outOfStockStyle === 'hide') return null;

                        return (
                          <button
                            key={opt}
                            type="button"
                            title={opt}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVariantSelect(v.id, opt);
                            }}
                            style={{
                              width: `${dims.width}px`,
                              height: `${dims.height}px`,
                              borderRadius: getSwatchBorderRadius(),
                              backgroundColor: hex,
                              border: isLight ? '1px solid #cbd5e1' : '1px solid rgba(0,0,0,0.1)',
                              cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              position: 'relative',
                              padding: 0,
                              outline: 'none',
                              opacity: isOutOfStock ? (outOfStockStyle === 'dimmed' ? 0.4 : 0.6) : 1,
                              boxShadow: isSelected
                                ? `0 0 0 2px #ffffff, 0 0 0 4px ${activeBorderColor}`
                                : '0 1px 2px rgba(0,0,0,0.06)',
                              transition: 'all 0.15s ease',
                              transform: isSelected ? 'scale(1.06)' : 'scale(1)',
                            }}
                          >
                            {isSelected && (
                              <Check size={dims.fontSize} color={isLight ? '#0f172a' : '#ffffff'} strokeWidth={2.5} />
                            )}
                            {isOutOfStock && outOfStockStyle === 'diagonal-slash' && (
                              <div
                                style={{
                                  position: 'absolute',
                                  inset: 0,
                                  background: 'linear-gradient(to top right, transparent calc(50% - 1px), #ef4444, transparent calc(50% + 1px))',
                                  borderRadius: getSwatchBorderRadius(),
                                  pointerEvents: 'none',
                                }}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    /* 3. BUTTON PILLS STYLE */
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {v.options.map(opt => {
                        const isSelected = currentChoice === opt;
                        const isOutOfStock = opt.includes('(Sold Out)') || opt.includes('(Unavailable)');
                        if (isOutOfStock && outOfStockStyle === 'hide') return null;

                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVariantSelect(v.id, opt);
                            }}
                            style={{
                              padding: '7px 16px',
                              borderRadius: getPillBorderRadius(),
                              border: isSelected ? `2px solid ${activeBorderColor}` : '1px solid #cbd5e1',
                              background: isSelected ? '#eff6ff' : '#ffffff',
                              color: isSelected ? activeBorderColor : '#0f172a',
                              fontWeight: isSelected ? 600 : 500,
                              fontSize: '13px',
                              cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                              transition: 'all 0.12s ease',
                              boxShadow: isSelected ? '0 1px 2px rgba(37,99,235,0.1)' : 'none',
                              position: 'relative',
                              opacity: isOutOfStock ? (outOfStockStyle === 'dimmed' ? 0.45 : 0.65) : 1,
                              textDecoration: isOutOfStock && outOfStockStyle === 'diagonal-slash' ? 'line-through' : 'none',
                            }}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      }

      case 'price_measurement_qty': {
        if (!product.measurementConfig) return null;
        const cfg = product.measurementConfig;
        return (
          <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
              Custom {cfg.unit}:
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '13px', color: '#0f172a' }}>Units ({cfg.min} - {cfg.max}):</span>
              <span style={{ fontWeight: 700, color: '#198754' }}>{cfg.step} {cfg.unit} per selection</span>
            </div>
          </div>
        );
      }

      case 'price_bulk_discounts': {
        const tiers = product.bulkDiscounts || [];
        if (tiers.length === 0) return null;

        return (
          <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
              {c.title || 'Volume Savings'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
              {tiers.map((t, i) => (
                <div key={i} style={{ padding: '8px', background: '#ffffff', borderRadius: '6px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>Buy {t.minQty}+</div>
                  <div style={{ fontSize: '11px', color: '#15803d', fontWeight: 600 }}>Save {t.discountPercent}%</div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      // ── 4. PURCHASE ACTIONS ──
      case 'action_quantity': {
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Quantity:</span>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#ffffff' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setQuantity(q => Math.max(1, q - 1));
                }}
                style={{ width: '32px', height: '32px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Minus size={14} />
              </button>
              <span style={{ width: '36px', textAlign: 'center', fontWeight: 600, fontSize: '13px' }}>
                {quantity}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setQuantity(q => q + 1);
                }}
                style={{ width: '32px', height: '32px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        );
      }

      case 'action_add_to_cart': {
        const isSoldOut = product.stock <= 0;
        const btnBg = (c.buttonBgColor as string) || d.bgColor || '#198754';
        const btnText = (c.buttonTextColor as string) || d.textColor || '#ffffff';
        const shape = (c.buttonShape as string) || 'rounded';
        const radius = shape === 'pill' ? '9999px' : shape === 'square' ? '2px' : `${d.borderRadius || 10}px`;
        const styleVariant = (c.buttonStyle as string) || 'solid';

        const bg = isSoldOut
          ? '#cbd5e1'
          : styleVariant === 'outline'
          ? 'transparent'
          : styleVariant === 'gradient'
          ? `linear-gradient(135deg, ${btnBg} 0%, #15803d 100%)`
          : btnBg;

        const border = styleVariant === 'outline' ? `2px solid ${btnBg}` : 'none';
        const color = isSoldOut ? '#64748b' : styleVariant === 'outline' ? btnBg : btnText;

        return (
          <button
            disabled={isSoldOut}
            style={{
              width: '100%',
              padding: '12px 20px',
              borderRadius: radius,
              border,
              background: bg,
              color,
              fontSize: '14px',
              fontWeight: 700,
              cursor: isSoldOut ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: isSoldOut ? 'none' : '0 4px 12px rgba(25, 135, 84, 0.25)',
              transition: 'all 0.15s ease',
            }}
          >
            {c.showIcon !== false && <ShoppingBag size={18} />}
            <span>{isSoldOut ? (c.soldOutText || 'Sold Out') : (c.buttonText || 'Add to Cart')}</span>
          </button>
        );
      }

      case 'action_buy_now': {
        const isSoldOut = product.stock <= 0;
        if (isSoldOut) return null;
        const btnBg = (c.buttonBgColor as string) || d.bgColor || '#0f172a';
        const btnText = (c.buttonTextColor as string) || d.textColor || '#ffffff';
        const showPaymentBadges = c.showPaymentBadges !== false;

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              style={{
                width: '100%',
                padding: '12px 20px',
                borderRadius: `${d.borderRadius || 10}px`,
                border: 'none',
                background: btnBg,
                color: btnText,
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
                transition: 'all 0.15s ease',
              }}
            >
              {c.showIcon !== false && <Zap size={18} />}
              <span>{c.buttonText || 'Buy Now - Instant Checkout'}</span>
            </button>

            {showPaymentBadges && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '11px', color: '#64748b', paddingTop: '2px' }}>
                <span>Accelerated checkout:</span>
                <span style={{ fontWeight: 600, color: '#5a31f4' }}>Shop Pay</span>
                <span>•</span>
                <span style={{ fontWeight: 600, color: '#003087' }}>PayPal</span>
                <span>•</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>Apple Pay</span>
                <span>•</span>
                <span style={{ fontWeight: 600, color: '#4285f4' }}>G Pay</span>
              </div>
            )}
          </div>
        );
      }

      case 'action_wishlist': {
        return (
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: 500,
              color: '#475569',
              cursor: 'pointer',
            }}
          >
            <Heart size={15} color="#ec4899" />
            <span>{c.labelText || 'Save to Wishlist'}</span>
          </button>
        );
      }

      // ── 5. PRODUCT DETAILS ──
      case 'detail_short_description': {
        if (!product.shortDescription) return null;
        return (
          <div style={{ fontSize: `${d.fontSize || 15}px`, color: d.textColor || '#475569', lineHeight: 1.5 }}>
            {product.shortDescription}
          </div>
        );
      }

      case 'detail_full_description': {
        if (!product.description) return null;
        const isCard = c.layoutStyle === 'card';
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              padding: isCard ? '24px' : '0px',
              background: isCard ? '#ffffff' : 'transparent',
              borderRadius: isCard ? '12px' : '0px',
              border: isCard ? '1px solid #e2e8f0' : 'none',
              boxShadow: isCard ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
            }}
          >
            {c.showTitle !== false && (
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
                {c.title || 'Product Overview'}
              </h3>
            )}
            <div
              style={{
                fontSize: `${d.fontSize || 15}px`,
                color: d.textColor || '#334155',
                lineHeight: 1.6,
                maxHeight: c.enableReadMore && !isDescriptionExpanded ? `${c.collapsedHeight || 180}px` : 'none',
                overflow: 'hidden',
                whiteSpace: 'pre-line',
                position: 'relative',
              }}
            >
              {product.description}
            </div>

            {c.enableReadMore && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDescriptionExpanded(!isDescriptionExpanded);
                }}
                style={{
                  alignSelf: 'flex-start',
                  border: 'none',
                  background: 'none',
                  color: '#2563eb',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                  marginTop: '4px',
                }}
              >
                {isDescriptionExpanded ? 'Read Less ↑' : 'Read More ↓'}
              </button>
            )}
          </div>
        );
      }

      case 'detail_key_features': {
        const features = product.keyFeatures || [];
        if (features.length === 0) return null;

        const isGrid2 = c.layout === 'grid-2';
        const isGrid3 = c.layout === 'grid-3';

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {c.showTitle !== false && (
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>
                {c.title || 'Key Features & Highlights'}
              </h3>
            )}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isGrid3 ? 'repeat(3, 1fr)' : isGrid2 ? 'repeat(2, 1fr)' : '1fr',
                gap: '10px',
              }}
            >
              {features.map((feat, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    fontSize: '13.5px',
                    color: '#334155',
                    lineHeight: 1.4,
                  }}
                >
                  <CheckCircle2 size={16} color={c.iconColor || '#198754'} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'detail_specifications': {
        const specs = product.specifications || {};
        const entries = Object.entries(specs);
        if (entries.length === 0) return null;

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {c.showTitle !== false && (
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>
                {c.title || 'Technical Specifications'}
              </h3>
            )}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
              {entries.map(([key, val], idx) => (
                <div
                  key={key}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: idx % 2 === 0 ? '#f8fafc' : '#ffffff',
                    borderBottom: idx === entries.length - 1 ? 'none' : '1px solid #f1f5f9',
                    fontSize: '13px',
                  }}
                >
                  <span style={{ fontWeight: 600, color: '#475569', width: '40%' }}>{key}</span>
                  <span style={{ color: '#0f172a', width: '60%' }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'detail_ingredients': {
        const ings = product.ingredients || [];
        if (ings.length === 0) return null;

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
              {c.title || 'Ingredients'}
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {ings.map((ing, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '12px',
                    background: '#f0fdf4',
                    color: '#166534',
                    border: '1px solid #dcfce7',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontWeight: 500,
                  }}
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>
        );
      }

      case 'detail_size_chart': {
        const chart = product.sizeChart;
        if (!chart || !chart.rows || chart.rows.length === 0) return null;

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                {chart.title || 'Size Chart & Measurements'}
              </h4>
            </div>

            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    {chart.columns.map(col => (
                      <th key={col} style={{ padding: '8px 12px', fontWeight: 600, color: '#475569' }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {chart.rows.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: idx === chart.rows.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                      {chart.columns.map(col => (
                        <td key={col} style={{ padding: '8px 12px', color: '#0f172a' }}>
                          {row[col] || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      case 'detail_faq': {
        const faqs = product.faqs || [];
        if (faqs.length === 0) return null;

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {c.showTitle !== false && (
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>
                {c.title || 'Frequently Asked Questions'}
              </h3>
            )}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: c.faqStyle === '2-col' && currentDevice !== 'mobile' ? '1fr 1fr' : '1fr',
                gap: '8px',
              }}
            >
              {faqs.map((faq, idx) => {
                const isOpen = !!expandedFaqs[idx] || (idx === 0 && c.firstOpenByDefault);
                if (c.faqStyle === 'cards') {
                  return (
                    <div
                      key={idx}
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '16px',
                        background: '#ffffff',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                      }}
                    >
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                        {faq.question}
                      </div>
                      <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                        {faq.answer}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={idx}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      background: '#ffffff',
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedFaqs(prev => ({ ...prev, [idx]: !isOpen }));
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: 'none',
                        background: '#f8fafc',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '13.5px',
                        fontWeight: 600,
                        color: '#0f172a',
                      }}
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        size={16}
                        style={{
                          transform: isOpen ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.15s ease',
                          color: '#64748b',
                        }}
                      />
                    </button>
                    {isOpen && (
                      <div style={{ padding: '12px 14px', fontSize: '13px', color: '#475569', lineHeight: 1.5, background: '#ffffff' }}>
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      // ── 6. SHIPPING & TRUST ──
      case 'trust_delivery_checker': {
        return (
          <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
              <MapPin size={16} color="#198754" />
              <span>{c.title || 'Check Delivery Options'}</span>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <input
                type="text"
                placeholder={c.placeholder || 'Enter Postal Code'}
                value={deliveryZip}
                onChange={(e) => setDeliveryZip(e.target.value)}
                style={{ flex: 1, padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCheckDelivery();
                }}
                style={{ padding: '6px 14px', background: '#198754', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer' }}
              >
                {c.buttonText || 'Check'}
              </button>
            </div>

            {deliveryResult && (
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#15803d', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Check size={14} />
                <span>{deliveryResult}</span>
              </div>
            )}
          </div>
        );
      }

      case 'trust_badges': {
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', padding: '12px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569' }}>
              <ShieldCheck size={18} color="#198754" />
              <span>Authentic Guaranteed</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569' }}>
              <Truck size={18} color="#198754" />
              <span>Fast Tracked Courier</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569' }}>
              <RotateCcw size={18} color="#198754" />
              <span>30-Day Easy Returns</span>
            </div>
          </div>
        );
      }

      // ── 7. RECOMMENDATIONS ──
      case 'rec_related': {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
              {c.heading || 'You May Also Like'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
              {products.filter(p => p.id !== product.id).slice(0, c.count || 4).map(p => (
                <div
                  key={p.id}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '10px',
                    background: '#ffffff',
                    cursor: 'pointer',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectProduct(p.id);
                  }}
                >
                  <img
                    src={p.images[0] || 'https://via.placeholder.com/150'}
                    alt={p.name}
                    style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px' }}
                  />
                  <div style={{ marginTop: '8px', fontSize: '12.5px', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {p.name}
                  </div>
                  {c.showPrice !== false && (
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#198754', marginTop: '2px' }}>
                      ${p.price.toFixed(2)}
                    </div>
                  )}
                  {c.showRating !== false && p.rating && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11.5px', color: '#f59e0b', marginTop: '2px' }}>
                      <span>★</span>
                      <span style={{ fontWeight: 600 }}>{p.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      }

      // ── 8. CUSTOM CONTENT ──
      case 'custom_divider': {
        return (
          <hr
            style={{
              margin: '12px 0',
              border: 'none',
              borderTop: `${c.thickness || 1}px ${c.style || 'solid'} ${c.color || '#e2e8f0'}`,
            }}
          />
        );
      }

      case 'custom_spacer': {
        return <div style={{ height: `${c.height || 32}px` }} />;
      }

      case 'custom_banner': {
        return (
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '8px',
              background: c.bgColor || '#f0fdf4',
              color: c.textColor || '#166534',
              border: '1px solid #bbf7d0',
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 700 }}>{c.headline || 'Promotional Notice'}</div>
            {c.subheadline && <div style={{ fontSize: '12.5px', marginTop: '2px' }}>{c.subheadline}</div>}
          </div>
        );
      }

      case 'custom_html': {
        return <div dangerouslySetInnerHTML={{ __html: c.html || '' }} />;
      }

      case 'group': {
        const children = block.children || [];
        const direction = c.direction || (d.display === 'flex' && d.width ? 'row' : 'column');
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: direction === 'horizontal' || direction === 'row' ? 'row' : 'column',
              gap: `${d.gap ?? 12}px`,
              width: '100%',
              flexWrap: direction === 'horizontal' || direction === 'row' ? 'wrap' : undefined,
            }}
          >
            {children.map(child => {
              const evalRes = evaluateBlockVisibility(child, product, currentDevice);
              if (!evalRes.isVisible) return null;
              const isChildSelected = child.id === selectedBlockId;
              return (
                <div
                  key={child.id}
                  className={`${styles.interactiveBlockWrapper} ${isChildSelected ? styles.interactiveBlockSelected : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectBlock(child.id);
                    setRightSidebarOpen(true);
                  }}
                  style={{
                    paddingTop: `${child.design.padding?.top ?? 0}px`,
                    paddingBottom: `${child.design.padding?.bottom ?? 0}px`,
                    flex: direction === 'horizontal' || direction === 'row' ? '1 1 0%' : undefined,
                    minWidth: 0,
                  }}
                >
                  {isChildSelected && <div className={styles.blockSelectionPill}>{child.name}</div>}
                  {renderBlockContent(child)}
                </div>
              );
            })}
          </div>
        );
      }

      default:
        return (
          <div style={{ padding: '8px', fontSize: '12px', color: '#64748b', background: '#f8fafc', borderRadius: '4px' }}>
            {block.name} (Preview Ready)
          </div>
        );
    }
  };

  return (
    <div style={{ width: '100%', backgroundColor: '#ffffff' }}>
      {/* ── Main PDP Layout Canvas ── */}
      <div
        style={{
          width: '100%',
          maxWidth: currentDevice === 'mobile' ? '100%' : '1240px',
          margin: '0 auto',
          padding: currentDevice === 'mobile' ? '16px' : '36px 32px 56px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          boxSizing: 'border-box',
        }}
      >
        {/* ── Product information (Main Hero Section) ── */}
        {(() => {
          const isProductInfoSectionSelected = selectedBlockId === 'section-product-info';
          const columnRatio = activeTemplate.columnRatio || '55-45';
          const isGalleryRight = activeTemplate.layout === 'gallery-right';
          const isStickyBuyBox = activeTemplate.stickyBuyBox !== false;

          let gridColumns = '1fr 1fr';
          if (columnRatio === '55-45') gridColumns = isGalleryRight ? '45fr 55fr' : '55fr 45fr';
          else if (columnRatio === '50-50') gridColumns = '1fr 1fr';
          else if (columnRatio === '45-55') gridColumns = isGalleryRight ? '55fr 45fr' : '45fr 55fr';
          else if (columnRatio === '60-40') gridColumns = isGalleryRight ? '40fr 60fr' : '60fr 40fr';

          const mediaBlocks = activeTemplate.blocks.filter(b => isProductInfoBlock(b) && resolveBlockZone(b) === 'media');
          const buyBoxBlocks = activeTemplate.blocks.filter(b => isProductInfoBlock(b) && resolveBlockZone(b) === 'buy_box');
          const templateSections = activeTemplate.blocks.filter(b => isTemplateSection(b));

          const renderMediaColumn = () => (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                position: isStickyBuyBox && currentDevice !== 'mobile' ? 'sticky' : undefined,
                top: isStickyBuyBox && currentDevice !== 'mobile' ? '24px' : undefined,
                alignSelf: 'start',
                minWidth: 0,
                width: '100%',
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  handleBlockClick('section-product-info', e);
                }
              }}
            >
              {mediaBlocks.map(block => {
                const evalRes = evaluateBlockVisibility(block, product, currentDevice);
                if (!evalRes.isVisible) return null;

                const isSelected = block.id === selectedBlockId;
                return (
                  <div
                    key={block.id}
                    className={`${styles.interactiveBlockWrapper} ${isSelected ? styles.interactiveBlockSelected : ''}`}
                    onClick={(e) => handleBlockClick(block.id, e)}
                    style={{
                      paddingTop: `${block.design.padding?.top ?? 0}px`,
                      paddingBottom: `${block.design.padding?.bottom ?? 0}px`,
                    }}
                  >
                    {isSelected && <div className={styles.blockSelectionPill}>{block.name}</div>}
                    {renderBlockContent(block)}
                  </div>
                );
              })}
            </div>
          );

          const renderBuyBoxColumn = () => {
            const cardWrapperStyle: React.CSSProperties = activeTemplate.detailsCardStyle === 'card'
              ? {
                  padding: '24px',
                  background: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                }
              : activeTemplate.detailsCardStyle === 'tinted'
              ? {
                  padding: '24px',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                }
              : {};

            return (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  position: isStickyBuyBox && currentDevice !== 'mobile' ? 'sticky' : undefined,
                  top: isStickyBuyBox && currentDevice !== 'mobile' ? '24px' : undefined,
                  alignSelf: 'start',
                  minWidth: 0,
                  width: '100%',
                  ...cardWrapperStyle,
                }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    handleBlockClick('section-product-info', e);
                  }
                }}
              >
                {buyBoxBlocks.map(block => {
                  const evalRes = evaluateBlockVisibility(block, product, currentDevice);
                  if (!evalRes.isVisible) return null;

                  const isSelected = block.id === selectedBlockId;
                  return (
                    <div
                      key={block.id}
                      className={`${styles.interactiveBlockWrapper} ${isSelected ? styles.interactiveBlockSelected : ''}`}
                      onClick={(e) => handleBlockClick(block.id, e)}
                      style={{
                        paddingTop: `${block.design.padding?.top ?? 0}px`,
                        paddingBottom: `${block.design.padding?.bottom ?? 0}px`,
                      }}
                    >
                      {isSelected && <div className={styles.blockSelectionPill}>{block.name}</div>}
                      {renderBlockContent(block)}
                    </div>
                  );
                })}
              </div>
            );
          };

          return (
            <>
              {/* Product information Container */}
              <div
                className={`${styles.interactiveBlockWrapper} ${isProductInfoSectionSelected ? styles.interactiveBlockSelected : ''}`}
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    handleBlockClick('section-product-info', e);
                  }
                }}
                style={{
                  position: 'relative',
                  borderRadius: '12px',
                  padding: isProductInfoSectionSelected ? '10px' : '0px',
                  transition: 'all 0.15s ease',
                }}
              >
                {isProductInfoSectionSelected && (
                  <div className={styles.blockSelectionPill}>
                    Product information
                  </div>
                )}

                {activeTemplate.layout === 'stacked' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>
                    <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
                      {renderMediaColumn()}
                    </div>
                    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
                      {renderBuyBoxColumn()}
                    </div>
                  </div>
                ) : currentDevice !== 'mobile' ? (
                  <div style={{ display: 'grid', gridTemplateColumns: gridColumns, gap: activeTemplate.columnGap || '40px', alignItems: 'start' }}>
                    {isGalleryRight ? (
                      <>
                        {renderBuyBoxColumn()}
                        {renderMediaColumn()}
                      </>
                    ) : (
                      <>
                        {renderMediaColumn()}
                        {renderBuyBoxColumn()}
                      </>
                    )}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {renderMediaColumn()}
                    {renderBuyBoxColumn()}
                  </div>
                )}
              </div>

              {/* Template Sections (Full-width sections below the hero) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '16px' }}>
                {templateSections.map(block => {
                  const evalRes = evaluateBlockVisibility(block, product, currentDevice);
                  if (!evalRes.isVisible) return null;

                  const isSelected = block.id === selectedBlockId;
                  return (
                    <div
                      key={block.id}
                      className={`${styles.interactiveBlockWrapper} ${isSelected ? styles.interactiveBlockSelected : ''}`}
                      onClick={(e) => handleBlockClick(block.id, e)}
                      style={{
                        paddingTop: `${block.design.padding?.top ?? 0}px`,
                        paddingBottom: `${block.design.padding?.bottom ?? 0}px`,
                      }}
                    >
                      {isSelected && <div className={styles.blockSelectionPill}>{block.name}</div>}
                      {renderBlockContent(block)}
                    </div>
                  );
                })}
              </div>
            </>
          );
        })()}
      </div>

      {/* ── Fullscreen Lightbox Modal ── */}
      {isLightboxOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '30px',
            cursor: 'zoom-out',
          }}
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
          <img
            src={product.images[selectedImageIdx] || product.images[0]}
            alt={product.name}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: '10px',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            }}
          />
        </div>
      )}

      {/* ── Size Guide Interactive Modal ── */}
      {isSizeGuideOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setIsSizeGuideOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              maxWidth: '520px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Ruler size={18} color="#2563eb" />
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>
                  Size Chart & Fit Guide
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px',
                  color: '#64748b',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748b', lineHeight: 1.4 }}>
              Measurements are in inches. For a looser fit, we recommend ordering one size up.
            </p>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '8px 12px', fontWeight: 600, color: '#475569' }}>Size</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600, color: '#475569' }}>Chest</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600, color: '#475569' }}>Waist</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600, color: '#475569' }}>Length</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { size: 'XS', chest: '34 - 36', waist: '28 - 30', length: '27' },
                  { size: 'S', chest: '36 - 38', waist: '30 - 32', length: '28' },
                  { size: 'M', chest: '38 - 40', waist: '32 - 34', length: '29' },
                  { size: 'L', chest: '40 - 42', waist: '34 - 36', length: '30' },
                  { size: 'XL', chest: '42 - 45', waist: '36 - 39', length: '31' },
                  { size: 'XXL', chest: '45 - 48', waist: '39 - 42', length: '32' },
                ].map((row, idx) => (
                  <tr key={row.size} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 1 ? '#fafafa' : '#ffffff' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 600, color: '#0f172a' }}>{row.size}</td>
                    <td style={{ padding: '8px 12px', color: '#475569' }}>{row.chest}"</td>
                    <td style={{ padding: '8px 12px', color: '#475569' }}>{row.waist}"</td>
                    <td style={{ padding: '8px 12px', color: '#475569' }}>{row.length}"</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
