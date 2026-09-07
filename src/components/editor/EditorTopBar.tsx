import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Undo, Redo, Monitor, Tablet, Smartphone, Columns, 
  Search, Sparkles, Save, ExternalLink, UploadCloud, ChevronDown,
  CheckCircle2, Compass
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
  const { pages, undoTheme, redoTheme, updatePageProps, hasUnsavedChanges, markSaved } = useSiteStore();
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

  // Dynamic status: Live vs Draft
  const pageStatus = activePage?.status || 'published';
  const isLive = pageStatus === 'published' && !hasUnsavedChanges;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

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
          if (hasUnsavedChanges) {
            markSaved();
            showToast('All edits saved successfully');
          }
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
  }, [isTheme, canUndo, canRedo, undoTheme, redoTheme, hasUnsavedChanges, markSaved]);

  const handleSave = () => {
    if (!hasUnsavedChanges) return;
    markSaved();
    showToast('All edits saved successfully');
  };

  const handlePublish = () => {
    setIsPublishModalOpen(true);
  };

  const handlePreview = () => {
    const previewPath = activePage?.path || '/';
    window.open(previewPath, '_blank');
    showToast('Opening preview in new tab...');
  };

  const togglePageStatus = () => {
    if (activePage) {
      const newStatus = activePage.status === 'published' ? 'draft' : 'published';
      updatePageProps(activePage.id, { status: newStatus });
      showToast(`Page status changed to ${newStatus}`);
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

          {/* 2. Landing Page / Contextual Page Selector */}
          <PageSelectorDropdown />

          {/* 12. Live / Draft Status Label */}
          <button 
            className={`${styles.statusBadge} ${isLive ? styles.statusLive : styles.statusDraft}`}
            onClick={togglePageStatus}
            title={`Status: ${isLive ? 'Live on storefront' : 'Draft / Unsaved'}. Click to toggle.`}
          >
            <span className={styles.statusDot} />
            <span>{isLive ? 'Live' : 'Draft'}</span>
          </button>

          <div className={styles.divider} />

          {/* 3. Undo and Redo Buttons */}
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
              title={isTheme ? (canUndo ? 'Undo theme change (Ctrl+Z)' : 'Undo') : 'Undo'}
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
              title={isTheme ? (canRedo ? 'Redo theme change (Ctrl+Y)' : 'Redo') : 'Redo'}
              aria-label="Redo"
            >
              <Redo size={14} />
            </button>
          </div>
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
            <span>Setup</span>
            <span className={styles.setupProgressBadge}>3/5</span>
          </button>

          {/* 6. AI Assistant Button */}
          <button 
            className={styles.btnAi}
            onClick={() => setIsAiDrawerOpen(true)}
            title="Open BillionBiz AI Assistant"
          >
            <Sparkles size={13} />
            <span>AI</span>
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
              <span>Preview</span>
            </button>
          )}          {/* 9. Save Icon + "Save" Button */}
          <button 
            className={styles.btnGhost}
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
            style={!hasUnsavedChanges ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
            title={hasUnsavedChanges ? "Save edits (Ctrl+S)" : "All edits saved"}
          >
            <Save size={13} />
            <span>Save</span>
          </button>

          {/* 11. Publish Icon + "Publish" Button */}
          <button 
            className={styles.btnPrimary}
            onClick={handlePublish}
            title="Review & publish changes to live storefront"
          >
            <UploadCloud size={13} />
            <span>Publish</span>
            <ChevronDown size={11} style={{ opacity: 0.8 }} />
          </button>

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
