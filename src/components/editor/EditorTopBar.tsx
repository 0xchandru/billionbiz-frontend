import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Undo, Redo, ChevronDown, Monitor, Tablet, Smartphone, ArrowLeft, Columns } from 'lucide-react';
import { useLandingEditorStore } from '../../store/landingEditorStore';
import { useSiteStore } from '../../store/siteStore';
import { useThemeHistoryStore } from '../../store/themeHistoryStore';
import styles from '../../pages/editor/EditorLayout.module.css';

export const EditorTopBar: React.FC = () => {
  const navigate = useNavigate();
  const { device, setDevice, activePanel } = useLandingEditorStore();
  const { undoTheme, redoTheme } = useSiteStore();
  const { canUndo, canRedo } = useThemeHistoryStore();

  const isSettings = activePanel === 'settings';
  const isTheme = activePanel === 'theme';
  const showDeviceToggles = !isSettings;
  const showHistory = !isSettings;
  const showPreview = !isSettings;

  // Global keyboard shortcuts for undo/redo when on theme panel
  useEffect(() => {
    if (!isTheme) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is actively typing in a text field or textarea
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

      const isMac = typeof navigator !== 'undefined' && navigator.platform?.toUpperCase().includes('MAC');
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (!modifier) return;

      // Redo: Ctrl+Y or Ctrl+Shift+Z / Cmd+Shift+Z
      if ((e.key.toLowerCase() === 'y' && !e.shiftKey) || (e.key.toLowerCase() === 'z' && e.shiftKey)) {
        e.preventDefault();
        useSiteStore.getState().redoTheme();
        return;
      }

      // Undo: Ctrl+Z
      if (e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        useSiteStore.getState().undoTheme();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTheme]);

  const handleUndo = () => {
    if (isTheme) {
      undoTheme();
    }
  };

  const handleRedo = () => {
    if (isTheme) {
      redoTheme();
    }
  };

  const undoDisabled = isTheme ? !canUndo : true;
  const redoDisabled = isTheme ? !canRedo : true;

  return (
    <header className={styles.topBar}>
      <div className={styles.topLeft}>
        <button className={styles.backNavBtn} onClick={() => navigate('/pages')}>
          <ArrowLeft size={16} />
        </button>
        <div className={styles.logoBox}>B</div>
        <div className={styles.siteSelector}>
          <span className={styles.siteName}>BillionBiz</span>
          <ChevronDown size={13} />
        </div>
        <div className={styles.liveStatus}>
          <div className={styles.liveDot}></div>
          <span>Live</span>
        </div>
      </div>

      {showDeviceToggles ? (
        <div className={styles.deviceToggles}>
          <button 
            className={`${styles.deviceBtn} ${device === 'desktop' ? styles.activeDevice : ''}`} 
            onClick={() => setDevice('desktop')}
          >
            <Monitor size={15} />
          </button>
          <button 
            className={`${styles.deviceBtn} ${device === 'tablet' ? styles.activeDevice : ''}`} 
            onClick={() => setDevice('tablet')}
          >
            <Tablet size={15} />
          </button>
          <button 
            className={`${styles.deviceBtn} ${device === 'mobile' ? styles.activeDevice : ''}`} 
            onClick={() => setDevice('mobile')}
          >
            <Smartphone size={15} />
          </button>
          <div style={{ width: '1px', height: '18px', backgroundColor: '#e2e8f0', margin: '0 4px' }} />
          <button 
            className={`${styles.deviceBtn} ${device === 'all' ? styles.activeDevice : ''}`} 
            onClick={() => setDevice('all')}
            title="All Devices View"
          >
            <Columns size={15} />
          </button>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          backgroundColor: '#f1f5f9',
          borderRadius: '6px',
          border: '1px solid #e2e8f0',
        }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569', letterSpacing: '0.2px' }}>
            Site Settings
          </span>
        </div>
      )}

      <div className={styles.topRight}>
        {showHistory && (
          <div className={styles.historyBtns}>
            <button 
              className={styles.iconBtn}
              onClick={handleUndo}
              disabled={undoDisabled}
              title={isTheme ? (canUndo ? 'Undo theme change (Ctrl+Z)' : 'Undo') : 'Undo'}
              aria-label="Undo"
            >
              <Undo size={15} />
            </button>
            <button 
              className={styles.iconBtn}
              onClick={handleRedo}
              disabled={redoDisabled}
              title={isTheme ? (canRedo ? 'Redo theme change (Ctrl+Y / Cmd+Shift+Z)' : 'Redo') : 'Redo'}
              aria-label="Redo"
            >
              <Redo size={15} />
            </button>
          </div>
        )}
        <div className={styles.actionBtns}>
          <button className={styles.btnOutline} onClick={() => navigate('/pages')}>Save</button>
          {showPreview && <button className={styles.btnOutline}>Preview</button>}
          <button className={styles.btnPrimary}>
            <span>Publish</span>
            <ChevronDown size={13} />
          </button>
        </div>
      </div>
    </header>
  );
};
