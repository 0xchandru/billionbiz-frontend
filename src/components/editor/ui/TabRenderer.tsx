import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { SectionTabConfig, SectionLayoutOption } from '../sectionConfigs/types';
import { FieldRenderer, isConditionMet } from './FieldRenderer';
import { CollapsibleGroup } from './CollapsibleGroup';
import { LayoutSelector } from './LayoutSelector';
import { SpacingEditor, SectionWidthEditor } from './SpacingEditor';
import { VisibilityEditor } from './VisibilityEditor';
import { AdvancedEditor } from './AdvancedEditor';
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
}

export const TabRenderer: React.FC<TabRendererProps> = ({
  tabs,
  layouts,
  props,
  onPropChange,
  sectionName: _sectionName,
}) => {
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

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: direction === 'left' ? -150 : 150, behavior: 'smooth' });
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
              onChange={(layoutId) => onPropChange('selectedLayout', layoutId)}
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
              value={props._padding || {}}
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
                  onChange={onPropChange}
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
    </>
  );
};
