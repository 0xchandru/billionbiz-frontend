import React, { useState, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import type { SectionTabConfig, SectionLayoutOption } from '../sectionConfigs/types';
import { FieldRenderer, isConditionMet } from './FieldRenderer';
import { CollapsibleGroup } from './CollapsibleGroup';
import { LayoutSelector } from './LayoutSelector';
import { SpacingEditor, SectionWidthEditor } from './SpacingEditor';
import { VisibilityEditor } from './VisibilityEditor';
import { AdvancedEditor } from './AdvancedEditor';
import { getDefaultPadding } from '../SectionRenderer';
import { useContentState } from '../../../hooks/useContentState';
import styles from '../../../pages/editor/EditorLayout.module.css';

interface TabRendererProps {
  /** Dynamic tabs from the section config */
  tabs: SectionTabConfig[];
  /** Available layouts (if any) */
  layouts?: SectionLayoutOption[];
  /** Current section props */
  props: Record<string, any>;
  /** Callback to update a prop */
  onPropChange: (key: string, value: any) => void;
  /** Section name for display */
  sectionName: string;
  /** Section instance ID (for content state tracking) */
  sectionId?: string;
  /** Section type key (for content state tracking) */
  sectionType?: string;
}

export const TabRenderer: React.FC<TabRendererProps> = ({
  tabs,
  layouts,
  props,
  onPropChange,
  sectionName: _sectionName,
  sectionId,
  sectionType,
}) => {
  // ---- Content State Hook ----
  const contentState = useContentState({
    sectionId: sectionId || '',
    sectionType: sectionType || '',
    props,
    onPropChange,
  });

  // Wrap onPropChange to auto-detect manual edits to content fields
  const wrappedOnPropChange = useCallback(
    (key: string, value: any) => {
      onPropChange(key, value);
      // If the edited field is a content field and status is still 'default',
      // mark the content config as customized so the Clear button disappears
      if (
        sectionId &&
        sectionType &&
        contentState.contentStatus === 'default' &&
        contentState.contentFieldKeys.includes(key)
      ) {
        // Use setTimeout to ensure the prop update has been applied first
        setTimeout(() => contentState.markAsCustomized(), 0);
      }
    },
    [onPropChange, sectionId, sectionType, contentState]
  );

  // Build the full list of available tabs
  const allTabs: { id: string; label: string }[] = [];

  // Always have a Look tab since we're merging Spacing into it
  allTabs.push({ id: '__look__', label: 'Look' });

  // Dynamic tabs from config (filtered by conditions)
  tabs.forEach((tab) => {
    if (tab.showWhen && !isConditionMet(tab.showWhen, props)) return;
    allTabs.push({ id: tab.id, label: tab.label });
  });

  // Universal tabs
  allTabs.push({ id: '__visibility__', label: 'Visibility' });
  allTabs.push({ id: '__advanced__', label: 'Advanced' });

  const [activeTabId, setActiveTabId] = useState(allTabs[0]?.id || '__look__');
  const tabsRef = useRef<HTMLDivElement>(null);

  // Ensure active tab is valid
  const validTabId = allTabs.find((t) => t.id === activeTabId) ? activeTabId : allTabs[0]?.id;

  // Check if the current tab is a "content" tab (for showing the Clear button)
  const isContentTab = validTabId === 'content';

  // Only show Clear button when content is in default (untouched) state
  const showClearButton = isContentTab && sectionId && sectionType && contentState.contentStatus === 'default';

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: direction === 'left' ? -150 : 150, behavior: 'smooth' });
    }
  };

  // Handle layout change through the content state system
  const handleLayoutChange = (layoutId: string) => {
    if (sectionId && sectionType) {
      contentState.handleLayoutChange(layoutId);
    } else {
      // Fallback for sections without content state tracking
      onPropChange('selectedLayout', layoutId);
    }
  };

  // Render the content of the active tab
  const renderTabContent = () => {
    // Look tab (now includes Spacing and Global Theme elements)
    if (validTabId === '__look__') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {layouts && layouts.length > 0 && (
            <LayoutSelector
              layouts={layouts}
              value={props.selectedLayout || layouts[0]?.id || ''}
              onChange={handleLayoutChange}
            />
          )}

          {layouts && layouts.length > 0 && <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }} />}
          
          <SectionWidthEditor
            value={props.sectionWidth || 'wide'}
            onChange={(v) => onPropChange('sectionWidth', v)}
          />
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <SpacingEditor
              label="Padding"
              value={props._padding || getDefaultPadding(sectionType || '')}
              onChange={(v) => onPropChange('_padding', v)}
            />
          </div>
          <SpacingEditor
            label="Margin"
            value={props._margin || {}}
            onChange={(v) => onPropChange('_margin', v)}
            showLeftRight={false}
          />
        </div>
      );
    }

    // Visibility tab
    if (validTabId === '__visibility__') {
      return (
        <VisibilityEditor
          value={props.visibility || {}}
          onChange={(v) => onPropChange('visibility', v)}
        />
      );
    }

    // Advanced tab
    if (validTabId === '__advanced__') {
      return (
        <AdvancedEditor
          value={props._advanced || {}}
          onChange={(v) => onPropChange('_advanced', v)}
        />
      );
    }

    // Dynamic tab from config
    const tab = tabs.find((t) => t.id === validTabId);
    if (!tab) return null;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {tab.groups.map((group) => {
          // Check group-level condition
          if (group.showWhen && !isConditionMet(group.showWhen, props)) return null;

          // Filter fields by condition
          const visibleFields = group.fields.filter(
            (f) => !f.showWhen || isConditionMet(f.showWhen, props)
          );

          if (visibleFields.length === 0) return null;

          return (
            <CollapsibleGroup
              key={group.id}
              label={group.label}
              defaultCollapsed={group.defaultCollapsed}
            >
              {visibleFields.map((field) => (
                <FieldRenderer
                  key={field.key}
                  field={field}
                  value={props[field.key]}
                  onChange={wrappedOnPropChange}
                  allProps={props}
                />
              ))}
            </CollapsibleGroup>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Tab bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid var(--border-color)',
        background: '#f8fafc',
      }}>
        <button
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
        >
          <ChevronLeft size={16} />
        </button>
        <div
          ref={tabsRef}
          className={styles.propTabs}
          style={{ overflowX: 'auto', flexWrap: 'nowrap', borderBottom: 'none', flex: 1 }}
        >
          {allTabs.map((tab) => (
            <div
              key={tab.id}
              className={`${styles.propTab} ${validTabId === tab.id ? styles.activePropTab : ''}`}
              onClick={() => setActiveTabId(tab.id)}
              style={{ flex: '0 0 auto', padding: '12px 14px', whiteSpace: 'nowrap' }}
            >
              {tab.label}
            </div>
          ))}
        </div>
        <button
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
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Tab content */}
      <div className={styles.propContent} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
        {renderTabContent()}
      </div>

      {/* Clear Default Content button — only visible when content is in default (untouched) state */}
      {showClearButton && (
        <div style={{
          position: 'sticky',
          bottom: 0,
          padding: '12px 16px',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: '#fafbfc',
          zIndex: 5,
        }}>
          <button
            onClick={contentState.clearContent}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 16px',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              backgroundColor: '#fff',
              color: '#dc2626',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              transition: 'all 0.2s ease',
            }}
          >
            <Trash2 size={14} />
            Clear Default Content
          </button>
        </div>
      )}
    </>
  );
};
