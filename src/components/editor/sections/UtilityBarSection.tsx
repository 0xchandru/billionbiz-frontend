import React, { useState, useMemo } from 'react';
import {
  Phone,
  Mail,
  Clock,
  Truck,
  Globe,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getEditorPath } from '../utils/editorNavigation';
import { useEditorContextStore } from '../../../store/editorContextStore';
import { useLandingEditorStore } from '../../../store/landingEditorStore';
import { createDefaultHeaderStack } from '../engine/headerPresets';
import type { HeaderRow } from '../engine/types';
import styles from './HeaderSections.module.css';

interface UtilityBarSectionProps {
  props?: any;
  device?: string;
  isEditorInteractive?: boolean;
  useEditorModel?: boolean;
}

export const UtilityBarSection: React.FC<UtilityBarSectionProps> = ({
  props: passedProps,
  device: passedDevice,
  isEditorInteractive = true,
  useEditorModel = false,
}) => {
  const navigate = useNavigate();
  const store = useEditorContextStore();
  const { selectedPageId, navigateToPage, setRightSidebarOpen, isRightSidebarOpen, requestEditorSwitch } = useLandingEditorStore();
  const storeDevice = useLandingEditorStore((s) => s.device);
  const device = passedDevice || storeDevice || 'desktop';

  const isEditingHeader = selectedPageId === 'header-global';

  const previewRows = store.presetPreview?.isActive && store.presetPreview.editorType === 'header'
    ? store.presetPreview.previewRows as HeaderRow[] | undefined
    : undefined;
  const persistedRows = (passedProps?._headerEditor?.rows || passedProps?._headerRows) as HeaderRow[] | undefined;
  const effectiveRows = previewRows || (useEditorModel ? store.headerRows : (persistedRows || store.headerRows));

  // Find row data from the active header model or fallback.
  const row: HeaderRow = useMemo(() => {
    const found = effectiveRows.find(
      (r) => r.type === 'utility' || r.id === 'row-utility' || r.id.includes('utility')
    );
    if (found) return found;
    const defaultStack = createDefaultHeaderStack();
    const fallback = defaultStack.find((r) => r.type === 'utility') || defaultStack[0];
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
     store.selectedTarget.rowId === 'utility-bar' ||
     store.selectedTarget.rowId.includes('utility'));

  const handleClick = (e: React.MouseEvent) => {
    if (!isEditorInteractive) return;
    e.stopPropagation();
    const executeSelect = () => {
      if (selectedPageId !== 'header-global') {
        navigateToPage('header-global', 'utility-bar');
        navigate(getEditorPath('header-global', 'utility-bar'));
        useEditorContextStore.getState().setEditorType('header');
      }
      store.selectTarget({ type: 'row', editorType: 'header', rowId: row.id });
      useLandingEditorStore.getState().setSelectedSectionId('utility-bar');
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

  const bgColor = row.styling?.bgColor || '#f8fafc';
  const textColor = row.styling?.textColor || '#475569';
  const minHeight = row.layout?.height ? `${row.layout.height}px` : '34px';
  const fontSize = row.styling?.fontSize ? `${row.styling.fontSize}px` : '11px';

  return (
    <div
      id={`header-row-${row.id}`}
      data-header-row-id={row.id}
      data-header-row-type="utility"
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
        borderBottom: row.styling?.borderBottom !== false ? `1px solid ${row.styling?.borderColor || '#e2e8f0'}` : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 22,
        padding: '0 24px',
      }}
    >
      {/* Left: Contact Info & Store Hours */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {elProps.phone && (
          <a
            href={`tel:${elProps.phone}`}
            onClick={(e) => isEditorInteractive && e.preventDefault()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              color: 'inherit',
              textDecoration: 'none',
              transition: 'opacity 0.15s',
            }}
          >
            <Phone size={12} style={{ opacity: 0.7 }} />
            <span>{elProps.phone}</span>
          </a>
        )}

        {device !== 'mobile' && elProps.email && (
          <a
            href={`mailto:${elProps.email}`}
            onClick={(e) => isEditorInteractive && e.preventDefault()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              color: 'inherit',
              textDecoration: 'none',
              transition: 'opacity 0.15s',
            }}
          >
            <Mail size={12} style={{ opacity: 0.7 }} />
            <span>{elProps.email}</span>
          </a>
        )}

        {device === 'desktop' && elProps.hours && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', opacity: 0.85 }}>
            <Clock size={12} style={{ opacity: 0.7 }} />
            <span>{elProps.hours}</span>
          </div>
        )}
      </div>

      {/* Right: Tracking Link, Currency & Help */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {elProps.trackingLink && (
          <a
            href={elProps.trackingLink}
            onClick={(e) => isEditorInteractive && e.preventDefault()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              color: 'inherit',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            <Truck size={12} style={{ opacity: 0.7 }} />
            <span>Track Order</span>
          </a>
        )}

        {elProps.currency !== false && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            <Globe size={12} style={{ opacity: 0.7 }} />
            <span>{elProps.currency || 'USD ($)'}</span>
            <ChevronDown size={11} style={{ opacity: 0.6 }} />
          </div>
        )}

        {device !== 'mobile' && (
          <a
            href="/help"
            onClick={(e) => isEditorInteractive && e.preventDefault()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              color: 'inherit',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            <HelpCircle size={12} style={{ opacity: 0.7 }} />
            <span>Help</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default UtilityBarSection;
