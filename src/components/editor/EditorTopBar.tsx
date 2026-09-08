import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Undo, Redo, Monitor, Tablet, Smartphone, Columns, 
  Search, Sparkles, Save, ExternalLink, UploadCloud, ChevronDown,
  CheckCircle2, Compass, Palette, Settings
} from 'lucide-react';
import { useLandingEditorStore } from '../../store/landingEditorStore';
import { useSiteStore } from '../../store/siteStore';
import { useThemeHistoryStore } from '../../store/themeHistoryStore';
import { PageSelectorDropdown } from './topbar/PageSelectorDropdown';
import { CommandPaletteModal } from './topbar/CommandPaletteModal';
import { AiAssistantDrawer } from './topbar/AiAssistantDrawer';
import { GuidedSetupModal } from './topbar/GuidedSetupModal';
import { MoreOptionsMenu } from './topbar/MoreOptionsMenu';
import { PublishModal } from './topbar/PublishModal';
import styles from './topbar/topbar.module.css';

export const EditorTopBar: React.FC = () => {
  const navigate = useNavigate();
  const { device, setDevice, activePanel, selectedPageId } = useLandingEditorStore();
  const { 
    pages, 
    theme, 
    settings,
    undoTheme, 
    redoTheme, 
    hasUnsavedChanges, 
    markSaved, 
    lastPublishedSnapshots,
    unpublishPage,
  } = useSiteStore();
  const { canUndo, canRedo } = useThemeHistoryStore();

  // Dialog & Drawer States
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activePage = pages.find((p) => p.id === selectedPageId) || pages[0];
  const isSettings = activePanel === 'settings';
  const isTheme = activePanel === 'theme';

  // Compare active page against its last published snapshot to detect unpublished changes
  const snapshot = activePage?.lastPublishedSnapshot || (activePage ? lastPublishedSnapshots?.[activePage.id] : null);

  // A page has been published on the top bar ONLY if a valid snapshot exists with a publishedAt timestamp
  const hasPublishedBaseline = Boolean(
    snapshot &&
    snapshot.publishedAt &&
    Array.isArray(snapshot.sections)
  );

  // Are there unpublished changes?
  // - If it has NEVER been published on top bar, all changes are unpublished (!hasPublishedBaseline === true)
  // - If it was published before, compare current sections & pageProps to the snapshot
  const hasUnpublishedChanges = Boolean(
    !hasPublishedBaseline ||
    (activePage && (
      JSON.stringify(activePage.sections) !== JSON.stringify(snapshot?.sections) ||
      JSON.stringify(activePage.pageProps || {}) !== JSON.stringify(snapshot?.pageProps || {})
    ))
  );

  // Status lifecycle:
  // - Live: ONLY when all editing has been published on top bar (status is published, published baseline exists, no unpublished changes, and no unsaved changes)
  // - Saved: edits are saved in storage, but have NOT been published to live storefront yet (or page is draft)
  // - Draft: active unsaved changes exist
  const isLive = Boolean(
    activePage?.status === 'published' &&
    hasPublishedBaseline &&
    !hasUnpublishedChanges &&
    !hasUnsavedChanges
  );
  const isSavedDraft = Boolean(!isLive && !hasUnsavedChanges);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  const handleSave = () => {
    if (isTheme) {
      markSaved();
      showToast('Theme changes saved successfully');
      return;
    }
    if (isSettings) {
      markSaved();
      showToast('Settings saved successfully');
      return;
    }
    if (!hasUnsavedChanges) {
      showToast('All changes already saved to draft');
      return;
    }
    markSaved();
    showToast('Draft edits saved successfully');
  };

  // Auto-save effect: if hasUnsavedChanges is true, and user does not change anything for 4 seconds (3-5s), automatically save
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const autoSaveTimer = setTimeout(() => {
      markSaved();
      if (isTheme) {
        showToast('Theme auto-saved');
      } else if (isSettings) {
        showToast('Settings auto-saved');
      } else {
        showToast('Draft auto-saved');
      }
    }, 4000);

    return () => clearTimeout(autoSaveTimer);
  }, [hasUnsavedChanges, pages, theme, settings, markSaved, isTheme, isSettings]);

  // Keyboard Shortcuts: Ctrl+K / Cmd+K for Command Palette, Ctrl+Z/Y for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = typeof navigator !== 'undefined' && navigator.platform?.toUpperCase().includes('MAC');
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      // Ctrl/Cmd + K: Toggle Command Palette
      if (modifier && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // Undo / Redo when modifier is active
      const target = e.target as HTMLElement | null;
      if (target) {
        const tagName = target.tagName?.toLowerCase();
        if (tagName === 'textarea') return;
        if (tagName === 'input') {
          const inputType = (target as HTMLInputElement).type?.toLowerCase();
          if (['text', 'password', 'search', 'email', 'url', 'number'].includes(inputType)) {
            return;
          }
        }
      }

      if (modifier) {
        // Ctrl/Cmd + S: Save
        if (e.key.toLowerCase() === 's') {
          e.preventDefault();
          handleSave();
          return;
        }

        if ((e.key.toLowerCase() === 'y' && !e.shiftKey) || (e.key.toLowerCase() === 'z' && e.shiftKey)) {
          e.preventDefault();
          if (isTheme && canRedo) {
            redoTheme();
            showToast('Redone theme change');
          }
          return;
        }

        if (e.key.toLowerCase() === 'z' && !e.shiftKey) {
          e.preventDefault();
          if (isTheme && canUndo) {
            undoTheme();
            showToast('Undone theme change');
          }
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTheme, canUndo, canRedo, undoTheme, redoTheme, hasUnsavedChanges, isSettings]);

  const handlePublish = () => {
    setIsPublishModalOpen(true);
  };

  const handlePreview = () => {
    const previewPath = activePage?.path || '/';
    window.open(previewPath, '_blank');
    showToast('Opening preview in new tab...');
  };

  const handleStatusBadgeClick = () => {
    if (isLive) {
      if (activePage) {
        unpublishPage(activePage.id);
        showToast(`"${activePage.name}" unpublished to draft`);
      }
    } else {
      setIsPublishModalOpen(true);
    }
  };

  const undoDisabled = isTheme ? !canUndo : true;
  const redoDisabled = isTheme ? !canRedo : true;

  return (
    <>
      <header className={styles.topBarContainer}>
        {/* ============================================================
            ZONE LEFT: Navigation, Page Context, Status, History
           ============================================================ */}
        <div className={styles.zoneLeft}>
          {/* 1. Back Icon */}
          <button 
            className={styles.backNavBtn} 
            onClick={() => navigate('/pages')}
            title="Back to Pages"
          >
            <ArrowLeft size={15} />
          </button>

          <div className={styles.divider} />

          {/* Context Tag or Page Selector + Status */}
          {isSettings ? (
            <div className={styles.contextTag}>
              <Settings size={14} color="#64748b" />
              <span>Store Settings</span>
            </div>
          ) : isTheme ? (
            <div className={styles.contextTag}>
              <Palette size={14} color="#2563eb" />
              <span>Theme: {theme?.presetName || 'Modern'}</span>
            </div>
          ) : (
            <>
              {/* 2. Landing Page / Contextual Page Selector */}
              <PageSelectorDropdown />

              {/* 12. Live / Draft / Saved Status Label */}
              <button 
                className={`${styles.statusBadge} ${isLive ? styles.statusLive : isSavedDraft ? styles.statusSaved : styles.statusDraft}`}
                onClick={handleStatusBadgeClick}
                title={
                  isLive 
                    ? 'Status: Live on storefront (published). Click to unpublish.' 
                    : isSavedDraft 
                      ? 'Status: Saved to draft. Click to review & publish to live storefront.' 
                      : 'Status: Draft / Unsaved. Click to review & publish.'
                }
              >
                <span className={styles.statusDot} />
                <span>{isLive ? 'Live' : isSavedDraft ? 'Saved' : 'Draft'}</span>
              </button>
            </>
          )}

          {!isSettings && <div className={styles.divider} />}

          {/* 3. Undo and Redo Buttons (Hidden for Settings) */}
          {!isSettings && (
            <div className={styles.historyGroup}>
              <button 
                className={styles.iconBtn}
                onClick={() => {
                  if (isTheme) {
                    undoTheme();
                    showToast('Undone theme change');
                  }
                }}
                disabled={undoDisabled}
                title={isTheme ? (canUndo ? 'Undo theme change (Ctrl+Z)' : 'Undo') : 'Undo (available in Theme)'}
                aria-label="Undo"
              >
                <Undo size={14} />
              </button>
              <button 
                className={styles.iconBtn}
                onClick={() => {
                  if (isTheme) {
                    redoTheme();
                    showToast('Redone theme change');
                  }
                }}
                disabled={redoDisabled}
                title={isTheme ? (canRedo ? 'Redo theme change (Ctrl+Y)' : 'Redo') : 'Redo (available in Theme)'}
                aria-label="Redo"
              >
                <Redo size={14} />
              </button>
            </div>
          )}
        </div>

        {/* ============================================================
            ZONE CENTER: Search Bar, Viewport Modes
           ============================================================ */}
        <div className={styles.zoneCenter}>
          {/* 4. Search Bar (Command Palette Trigger) */}
          <button 
            className={styles.searchTriggerBar}
            onClick={() => setIsCommandPaletteOpen(true)}
            title="Search tools, features, and sections (Ctrl+K)"
          >
            <Search size={13} color="#94a3b8" />
            <span className={styles.searchPlaceholder}>Search or jump to...</span>
            <span className={styles.shortcutKey}>⌘K</span>
          </button>

          {/* 5. Preview Mode Change (Desktop, Tablet, Mobile, All) */}
          {!isSettings && (
            <div className={styles.deviceToggles}>
              <button 
                className={`${styles.deviceBtn} ${device === 'desktop' ? styles.activeDevice : ''}`} 
                onClick={() => setDevice('desktop')}
                title="Desktop View"
              >
                <Monitor size={13} />
              </button>
              <button 
                className={`${styles.deviceBtn} ${device === 'tablet' ? styles.activeDevice : ''}`} 
                onClick={() => setDevice('tablet')}
                title="Tablet View"
              >
                <Tablet size={13} />
              </button>
              <button 
                className={`${styles.deviceBtn} ${device === 'mobile' ? styles.activeDevice : ''}`} 
                onClick={() => setDevice('mobile')}
                title="Mobile View"
              >
                <Smartphone size={13} />
              </button>
              <div style={{ width: '1px', height: '14px', backgroundColor: '#e2e8f0', margin: '0 1px' }} />
              <button 
                className={`${styles.deviceBtn} ${device === 'all' ? styles.activeDevice : ''}`} 
                onClick={() => setDevice('all')}
                title="All Devices View"
              >
                <Columns size={13} />
              </button>
            </div>
          )}
        </div>

        {/* ============================================================
            ZONE RIGHT: Setup, AI, Preview, Save, Publish, More
           ============================================================ */}
        <div className={styles.zoneRight}>
          {/* 7. Guided Setup Button */}
          <button 
            className={styles.btnSecondary}
            onClick={() => setIsSetupModalOpen(true)}
            title="Store Launch Guided Setup"
          >
            <Compass size={13} color="#0284c7" />
            <span className={styles.btnLabel}>Setup</span>
            <span className={styles.setupProgressBadge}>3/5</span>
          </button>

          {/* 6. AI Assistant Button */}
          <button 
            className={styles.btnAi}
            onClick={() => setIsAiDrawerOpen(true)}
            title="Open BillionBiz AI Assistant"
          >
            <Sparkles size={13} />
            <span className={styles.btnLabel}>AI</span>
          </button>

          <div className={styles.divider} />

          {/* 10. Preview Icon + "Preview" Button */}
          {!isSettings && (
            <button 
              className={styles.btnGhost}
              onClick={handlePreview}
              title="Preview storefront in new tab"
            >
              <ExternalLink size={13} />
              <span className={styles.btnLabel}>Preview</span>
            </button>
          )}

          {/* Save & Publish Buttons based on Active Panel */}
          {isTheme ? (
            /* Theme Mode: Primary Save Button only (No Publish) */
            <button 
              className={styles.btnPrimarySave}
              onClick={handleSave}
              disabled={!hasUnsavedChanges}
              style={!hasUnsavedChanges ? { opacity: 0.45, cursor: 'not-allowed' } : undefined}
              title={hasUnsavedChanges ? "Save theme customizations" : "All theme changes saved"}
            >
              <Save size={13} />
              <span>Save Theme</span>
            </button>
          ) : isSettings ? (
            /* Settings Mode: Primary Save Button only (No Publish) */
            <button 
              className={styles.btnPrimarySave}
              onClick={handleSave}
              disabled={!hasUnsavedChanges}
              style={!hasUnsavedChanges ? { opacity: 0.45, cursor: 'not-allowed' } : undefined}
              title={hasUnsavedChanges ? "Save store settings" : "All settings saved"}
            >
              <Save size={13} />
              <span>Save Settings</span>
            </button>
          ) : (
            /* Editor & Pages: Ghost Save + Primary Publish Button */
            <>
              <button 
                className={styles.btnGhost}
                onClick={handleSave}
                disabled={!hasUnsavedChanges}
                style={!hasUnsavedChanges ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
                title={hasUnsavedChanges ? "Save draft edits (Ctrl+S)" : "All edits saved to draft"}
              >
                <Save size={13} />
                <span className={styles.btnLabel}>Save</span>
              </button>

              <button 
                className={styles.btnPrimary}
                onClick={handlePublish}
                title="Review & publish changes to live storefront"
              >
                <UploadCloud size={13} />
                <span>Publish</span>
                <ChevronDown size={11} style={{ opacity: 0.8 }} />
              </button>
            </>
          )}

          {/* 8. Three-Dot Button & Options Menu */}
          <MoreOptionsMenu onNotify={showToast} />
        </div>
      </header>

      {/* ============================================================
          COMMAND PALETTE TOP-TO-BOTTOM WIDGET
         ============================================================ */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSave={handleSave}
        onPublish={handlePublish}
        onPreview={handlePreview}
      />

      {/* ============================================================
          PUBLISH CONFIRMATION MODAL
         ============================================================ */}
      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onSuccess={showToast}
      />

      {/* ============================================================
          AI ASSISTANT FULL-HEIGHT RIGHT SLIDE-OVER DRAWER
         ============================================================ */}
      <AiAssistantDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
      />

      {/* ============================================================
          GUIDED SETUP MODAL
         ============================================================ */}
      <GuidedSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
      />

      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className={styles.topbarToast}>
          <CheckCircle2 size={16} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
};
