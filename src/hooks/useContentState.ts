import { useRef, useCallback, useMemo } from 'react';
import { getSectionConfig } from '../components/editor/sectionConfigs';
import { useContentStateStore, type ContentStatus } from '../store/contentStateStore';
import type { SectionTabConfig } from '../components/editor/sectionConfigs/types';

// ============================================================
// useContentState Hook
// Bridges the content state store, section config, and section
// props to manage content save/load/clear on layout switches.
// ============================================================

/**
 * Extract content field keys from the 'content' tab of a section config.
 * This is the fallback when `getContentFieldKeys` is not provided on the config.
 */
function extractContentFieldKeysFromTabs(
  tabs: SectionTabConfig[],
  _props: Record<string, any>
): string[] {
  const contentTab = tabs.find((t) => t.id === 'content');
  if (!contentTab) return [];

  const keys: string[] = [];
  for (const group of contentTab.groups) {
    for (const field of group.fields) {
      keys.push(field.key);
    }
  }
  return keys;
}

/**
 * Extract default values for content fields from the section config's tabs.
 */
function extractDefaultValuesFromTabs(
  tabs: SectionTabConfig[],
  configDefaultProps: Record<string, any>,
  contentFieldKeys: string[]
): Record<string, any> {
  const defaults: Record<string, any> = {};

  // First pass: get defaults from field definitions
  const contentTab = tabs.find((t) => t.id === 'content');
  if (contentTab) {
    for (const group of contentTab.groups) {
      for (const field of group.fields) {
        if (contentFieldKeys.includes(field.key) && field.defaultValue !== undefined) {
          defaults[field.key] = field.defaultValue;
        }
      }
    }
  }

  // Second pass: fill gaps from the section's defaultProps
  for (const key of contentFieldKeys) {
    if (defaults[key] === undefined && configDefaultProps[key] !== undefined) {
      defaults[key] = configDefaultProps[key];
    }
  }

  return defaults;
}



/**
 * Pick a subset of values from props matching the given keys.
 */
function pickValues(
  props: Record<string, any>,
  keys: string[]
): Record<string, any> {
  const result: Record<string, any> = {};
  for (const key of keys) {
    if (key in props) {
      result[key] = props[key];
    }
  }
  return result;
}

// ---- Main Hook ----

interface UseContentStateOptions {
  /** The section instance ID */
  sectionId: string;
  /** The section type key (e.g., 'AnnouncementBar') */
  sectionType: string;
  /** Current section props */
  props: Record<string, any>;
  /** Callback to batch-update section props */
  onPropChange: (key: string, value: any) => void;
}

interface UseContentStateReturn {
  /** The current content config key */
  contentConfigKey: string;
  /** The status of the current content config */
  contentStatus: ContentStatus;
  /** The content field keys for the current config */
  contentFieldKeys: string[];
  /** Clear the current content config's content */
  clearContent: () => void;
  /** Handle layout change — saves old content, loads new content */
  handleLayoutChange: (newLayout: string) => void;
  /** Mark the current content config as customized (called on manual edit) */
  markAsCustomized: () => void;
}

export function useContentState({
  sectionId,
  sectionType,
  props,
  onPropChange,
}: UseContentStateOptions): UseContentStateReturn {
  const sectionConfig = getSectionConfig(sectionType);

  const getContentState = useContentStateStore((s) => s.getContentState);
  const setContentCustomized = useContentStateStore((s) => s.setContentCustomized);
  const setContentCleared = useContentStateStore((s) => s.setContentCleared);

  // Track the previous layout so we can detect changes
  const prevLayoutRef = useRef<string | null>(null);

  // ---- Derive current content config key ----
  const currentLayout = props.selectedLayout || sectionConfig?.layouts?.[0]?.id || 'default';

  const contentConfigKey = useMemo(() => {
    if (sectionConfig?.getContentConfigKey) {
      return sectionConfig.getContentConfigKey(currentLayout);
    }
    return currentLayout; // Treat each layout as a separate content configuration by default
  }, [sectionConfig, currentLayout]);

  // ---- Get content field keys for current config ----
  const contentFieldKeys = useMemo(() => {
    if (!sectionConfig) return [];
    if (sectionConfig.getContentFieldKeys) {
      return sectionConfig.getContentFieldKeys(contentConfigKey);
    }
    // Auto-extract from the content tab
    const tabs = sectionConfig.getTabs(currentLayout, props);
    return extractContentFieldKeysFromTabs(tabs, props);
  }, [sectionConfig, contentConfigKey, currentLayout]);

  // ---- Get current content status reactively ----
  const storedState = useContentStateStore((s) => s.states[sectionId]?.[contentConfigKey]);
  const contentStatus: ContentStatus = storedState?.status || 'default';

  // ---- Save current content fields to the store ----
  const saveCurrentContent = useCallback(
    (configKey: string, fieldKeys: string[]) => {
      if (fieldKeys.length === 0) return;
      const currentValues = pickValues(props, fieldKeys);
      // Only save if there's something meaningful
      const hasAnyValue = Object.values(currentValues).some(
        (v) => v !== undefined && v !== null && v !== ''
      );
      
      // Check if content has been modified from defaults
      const existingState = getContentState(sectionId, configKey);
      if (existingState?.status === 'cleared') {
        // Don't overwrite cleared state
        return;
      }
      
      if (hasAnyValue || existingState?.status === 'customized') {
        setContentCustomized(sectionId, configKey, currentValues);
      }
    },
    [props, sectionId, getContentState, setContentCustomized]
  );

  // ---- Load content for a config key into props ----
  const loadContent = useCallback(
    (configKey: string, fieldKeys: string[], layout: string) => {
      if (!sectionConfig || fieldKeys.length === 0) return;

      const stored = getContentState(sectionId, configKey);

      if (stored?.status === 'customized') {
        // Restore previously edited content
        for (const [key, value] of Object.entries(stored.values)) {
          onPropChange(key, value);
        }
      } else if (stored?.status === 'cleared') {
        // Keep content cleared
        for (const key of fieldKeys) {
          onPropChange(key, undefined);
        }
      } else {
        // Default — load default values from config
        const tabs = sectionConfig.getTabs(layout, props);
        const defaults = extractDefaultValuesFromTabs(
          tabs,
          sectionConfig.defaultProps,
          fieldKeys
        );
        for (const [key, value] of Object.entries(defaults)) {
          onPropChange(key, value);
        }
      }
    },
    [sectionConfig, sectionId, getContentState, onPropChange]
  );

  // ---- Handle layout change ----
  const handleLayoutChange = useCallback(
    (newLayout: string) => {
      if (!sectionConfig) return;

      const oldLayout = currentLayout;
      const oldConfigKey = sectionConfig.getContentConfigKey
        ? sectionConfig.getContentConfigKey(oldLayout)
        : 'default';
      const newConfigKey = sectionConfig.getContentConfigKey
        ? sectionConfig.getContentConfigKey(newLayout)
        : 'default';

      // Get field keys for the old config to save
      let oldFieldKeys: string[];
      if (sectionConfig.getContentFieldKeys) {
        oldFieldKeys = sectionConfig.getContentFieldKeys(oldConfigKey);
      } else {
        const oldTabs = sectionConfig.getTabs(oldLayout, props);
        oldFieldKeys = extractContentFieldKeysFromTabs(oldTabs, props);
      }

      // Save current content under the old config key (if it's not the same key)
      if (oldConfigKey !== newConfigKey) {
        saveCurrentContent(oldConfigKey, oldFieldKeys);
      }

      // Change the layout prop
      onPropChange('selectedLayout', newLayout);

      // Get field keys for the new config
      let newFieldKeys: string[];
      if (sectionConfig.getContentFieldKeys) {
        newFieldKeys = sectionConfig.getContentFieldKeys(newConfigKey);
      } else {
        const newTabs = sectionConfig.getTabs(newLayout, props);
        newFieldKeys = extractContentFieldKeysFromTabs(newTabs, props);
      }

      // If same config key, don't reload — content is already in props
      if (oldConfigKey === newConfigKey) return;

      // Load content for the new config key
      loadContent(newConfigKey, newFieldKeys, newLayout);
    },
    [sectionConfig, currentLayout, props, saveCurrentContent, onPropChange, loadContent]
  );

  // ---- Clear content ----
  const clearContent = useCallback(() => {
    if (!sectionConfig) return;
    setContentCleared(sectionId, contentConfigKey);

    // Clear content fields in the section props
    for (const key of contentFieldKeys) {
      onPropChange(key, undefined);
    }
  }, [sectionConfig, sectionId, contentConfigKey, contentFieldKeys, setContentCleared, onPropChange]);

  // ---- Mark as customized (called when user manually edits a content field) ----
  const markAsCustomized = useCallback(() => {
    if (!sectionId || contentFieldKeys.length === 0) return;
    const currentValues = pickValues(props, contentFieldKeys);
    setContentCustomized(sectionId, contentConfigKey, currentValues);
  }, [sectionId, contentConfigKey, contentFieldKeys, props, setContentCustomized]);

  // Initialize: set prevLayoutRef
  if (prevLayoutRef.current === null) {
    prevLayoutRef.current = currentLayout;
  }

  return {
    contentConfigKey,
    contentStatus,
    contentFieldKeys,
    clearContent,
    handleLayoutChange,
    markAsCustomized,
  };
}
