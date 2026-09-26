import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEditorPath } from '../utils/editorNavigation';
import { Grid } from 'lucide-react';
import { useEditorContextStore } from '../../../store/editorContextStore';
import { useLandingEditorStore } from '../../../store/landingEditorStore';
import { useSiteStore } from '../../../store/siteStore';
import { createDefaultHeaderStack } from '../engine/headerPresets';
import type { HeaderRow } from '../engine/types';
import styles from './HeaderSections.module.css';

interface CategoryBarSectionProps {
  props?: any;
  device?: string;
  isEditorInteractive?: boolean;
  useEditorModel?: boolean;
}

export const CategoryBarSection: React.FC<CategoryBarSectionProps> = ({
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

  // Find row data from the active header model or fallback.
  const row: HeaderRow = useMemo(() => {
    const found = effectiveRows.find(
      (r) => r.type === 'secondary-nav' || r.id === 'row-secondary-nav' || r.id.includes('secondary') || r.id.includes('category')
    );
    if (found) return found;
    const defaultStack = createDefaultHeaderStack();
    const fallback = defaultStack.find((r) => r.type === 'secondary-nav') || defaultStack[0];
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
  const [hovered, setHovered] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = useMemo(() => {
    if (Array.isArray(elProps.categories) && elProps.categories.length > 0) {
      return elProps.categories;
    }
    return [
      { id: 'all', label: 'All Products', href: '/collections/all', icon: 'grid' },
      { id: 'new', label: 'New Arrivals', href: '/collections/new', badge: 'NEW', badgeColor: '#3b82f6' },
      { id: 'trending', label: 'Trending Deals', href: '/collections/trending', badge: 'HOT', badgeColor: '#ef4444' },
      { id: 'electronics', label: 'Electronics', href: '/collections/electronics' },
      { id: 'apparel', label: 'Apparel & Fashion', href: '/collections/apparel' },
      { id: 'footwear', label: 'Shoes & Footwear', href: '/collections/footwear' },
      { id: 'beauty', label: 'Health & Beauty', href: '/collections/beauty' },
      { id: 'home', label: 'Home & Kitchen', href: '/collections/home' },
      { id: 'sale', label: 'Clearance Sale', href: '/collections/sale', badge: 'SALE', badgeColor: '#f59e0b' },
    ];
  }, [elProps]);

  if (!row.isVisible) {
    return null;
  }

  // Selection & Hover
  const isSelected =
    isEditingHeader &&
    isRightSidebarOpen &&
    store.selectedTarget.type === 'row' &&
    store.selectedTarget.editorType === 'header' &&
    (store.selectedTarget.rowId === row.id ||
     store.selectedTarget.rowId === 'category-bar' ||
     store.selectedTarget.rowId === 'secondary-nav' ||
     store.selectedTarget.rowId.includes('secondary') ||
     store.selectedTarget.rowId.includes('category'));

  const handleClick = (e: React.MouseEvent) => {
    if (!isEditorInteractive) return;
    e.stopPropagation();
    const executeSelect = () => {
      if (selectedPageId !== 'header-global') {
        navigateToPage('header-global', 'category-bar');
        navigate(getEditorPath('header-global', 'category-bar'));
        useEditorContextStore.getState().setEditorType('header');
      }
      store.selectTarget({ type: 'row', editorType: 'header', rowId: row.id });
      useLandingEditorStore.getState().setSelectedSectionId('category-bar');
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

  const palette = theme?.palette || (theme as any)?.colors;
  const brandPrimary = palette?.brand?.primary || '#2563eb';
  const bgColor = row.styling?.bgColor || '#ffffff';
  const textColor = row.styling?.textColor || '#334155';
  const minHeight = row.layout?.height ? `${row.layout.height}px` : '42px';
  const displayStyle = row.layout?.variantId || elProps.style || 'text-links';
  const categoryKeyCounts = new Map<string, number>();
  const getCategoryKey = (cat: any) => {
    const baseKey = String(cat.id || cat.href || cat.label || 'category');
    const occurrence = categoryKeyCounts.get(baseKey) || 0;
    categoryKeyCounts.set(baseKey, occurrence + 1);
    return occurrence === 0 ? `category-${baseKey}` : `category-${baseKey}-${occurrence}`;
  };

  return (
    <div
      id={`header-row-${row.id}`}
      data-header-row-id={row.id}
      data-header-row-type="secondary-nav"
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
        borderBottom: row.styling?.borderBottom !== false ? `1px solid ${row.styling?.borderColor || '#e2e8f0'}` : 'none',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        zIndex: 18,
        padding: '0 24px',
        overflow: 'hidden',
      }}
    >
      <div
        className={styles.categoryBarScroll}
        style={{
          width: '100%',
          gap: displayStyle === 'pills' ? '8px' : '22px',
          justifyContent: row.layout?.alignment === 'center' ? 'center' : 'flex-start',
        }}
      >
        {categories.map((cat: any) => {
          const isActive = activeCategory === cat.id;
          const categoryKey = getCategoryKey(cat);

          if (displayStyle === 'pills') {
            return (
              <button
                key={`${categoryKey}-pill`}
                type="button"
                onClick={(e) => {
                  if (isEditorInteractive) {
                    e.stopPropagation();
                    handleClick(e);
                  }
                  setActiveCategory(cat.id);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: isActive ? 700 : 500,
                  backgroundColor: isActive ? brandPrimary : '#f1f5f9',
                  color: isActive ? '#ffffff' : textColor,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat.icon === 'grid' && <Grid size={12} />}
                <span>{cat.label}</span>
                {cat.badge && (
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: 800,
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : (cat.badgeColor || brandPrimary),
                      color: '#ffffff',
                      padding: '1px 5px',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          }

          return (
            <a
              key={`${categoryKey}-link`}
              href={cat.href || '#'}
              onClick={(e) => {
                if (isEditorInteractive) {
                  e.preventDefault();
                  handleClick(e);
                }
                setActiveCategory(cat.id);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 0',
                fontSize: '13px',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? brandPrimary : textColor,
                textDecoration: 'none',
                position: 'relative',
                whiteSpace: 'nowrap',
                borderBottom: isActive ? `2px solid ${brandPrimary}` : '2px solid transparent',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{cat.label}</span>
              {cat.badge && (
                <span
                  style={{
                    fontSize: '9px',
                    fontWeight: 800,
                    backgroundColor: cat.badgeColor || '#ef4444',
                    color: '#ffffff',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                  }}
                >
                  {cat.badge}
                </span>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryBarSection;
