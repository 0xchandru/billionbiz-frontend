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
import styles from './topbar/topbar.module.css';

export const EditorTopBar: React.FC = () => {
  const navigate = useNavigate();
  const { device, setDevice, activePanel, selectedPageId } = useLandingEditorStore();
  const { pages, undoTheme, redoTheme, publishPage, updatePageProps } = useSiteStore();
  const { canUndo, canRedo } = useThemeHistoryStore();

  // Dialog & Drawer States
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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
  }, [isTheme, canUndo, canRedo, undoTheme, redoTheme]);

  const handleSave = () => {
    setHasUnsavedChanges(false);
    showToast('All changes saved successfully');
  };

  const handlePublish = () => {
    if (activePage) {
      publishPage(activePage.id);
      setHasUnsavedChanges(false);
      showToast(`Published "${activePage.name}" to live storefront!`);
    }
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
            ZONE LEFT: Navigation, Brand, Page Context, Status, History
           ============================================================ */}
        <div className={styles.zoneLeft}>
          {/* 1. Back Icon */}
          <button 
            className={styles.backNavBtn} 
            onClick={() => navigate('/pages')}
            title="Back to Pages"
          >
            <ArrowLeft size={16} />
          </button>

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
            title="Search accessible features, tools, and sections (Ctrl+K)"
          >
            <Search size={14} color="#94a3b8" />
            <span className={styles.searchPlaceholder}>Search features & sections...</span>
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
                <Monitor size={14} />
              </button>
              <button 
                className={`${styles.deviceBtn} ${device === 'tablet' ? styles.activeDevice : ''}`} 
                onClick={() => setDevice('tablet')}
                title="Tablet View"
              >
                <Tablet size={14} />
              </button>
              <button 
                className={`${styles.deviceBtn} ${device === 'mobile' ? styles.activeDevice : ''}`} 
                onClick={() => setDevice('mobile')}
                title="Mobile View"
              >
                <Smartphone size={14} />
              </button>
              <div style={{ width: '1px', height: '16px', backgroundColor: '#e2e8f0', margin: '0 2px' }} />
              <button 
                className={`${styles.deviceBtn} ${device === 'all' ? styles.activeDevice : ''}`} 
                onClick={() => setDevice('all')}
                title="All Devices Responsive View"
              >
                <Columns size={14} />
              </button>
            </div>
          )}
        </div>

        {/* ============================================================
            ZONE RIGHT: Guided Setup, AI, Save, Preview, Publish, 3-Dot
           ============================================================ */}
        <div className={styles.zoneRight}>
          {/* 7. Guided Setup Button */}
          <button 
            className={styles.btnGuidedSetup}
            onClick={() => setIsSetupModalOpen(true)}
            title="Store Launch Guided Setup"
          >
            <Compass size={14} color="#0284c7" />
            <span>Guided Setup</span>
            <span className={styles.setupProgressBadge}>3/5</span>
          </button>

          {/* 6. AI Assistant Button (Opens Full Height Right Drawer) */}
          <button 
            className={styles.btnAiAssistant}
            onClick={() => setIsAiDrawerOpen(true)}
            title="Open BillionBiz AI Assistant"
          >
            <Sparkles size={14} />
            <span>AI Studio</span>
          </button>

          {/* 9. Save Icon + "Save" Button */}
          <button 
            className={styles.btnSave}
            onClick={handleSave}
            title="Save changes"
          >
            <Save size={14} />
            <span>Save</span>
          </button>

          {/* 10. Preview Icon + "Preview" Button */}
          {!isSettings && (
            <button 
              className={styles.btnPreview}
              onClick={handlePreview}
              title="Preview storefront in new tab"
            >
              <ExternalLink size={14} />
              <span>Preview</span>
            </button>
          )}

          {/* 11. Publish Icon + "Publish" Button */}
          <button 
            className={styles.btnPublish}
            onClick={handlePublish}
            title="Publish page to live store"
          >
            <UploadCloud size={14} />
            <span>Publish</span>
            <ChevronDown size={12} style={{ opacity: 0.8 }} />
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
