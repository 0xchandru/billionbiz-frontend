import React, { useState, useEffect } from 'react';
import { 
  Menu, Globe, Moon, Sun, Bell, ChevronDown, 
  RotateCcw, AlertTriangle, X, CheckCircle2 
} from 'lucide-react';
import { PLATFORM_VERSION, PLATFORM_RESET_EVENT } from '../../config/version';
import { resetEntirePlatformStore } from '../../store/siteStore';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check if this was a first-load auto-upgrade reset
  useEffect(() => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const justUpgraded = sessionStorage.getItem('billionbiz_version_just_upgraded');
      if (justUpgraded === 'true') {
        sessionStorage.removeItem('billionbiz_version_just_upgraded');
        setToastMessage(`Platform upgraded to v${PLATFORM_VERSION}: siteStore automatically reset to factory new.`);
      }
    }

    // Listen to external reset events (e.g. from developer console or other triggers)
    const handlePlatformReset = (e: Event) => {
      const customEvent = e as CustomEvent<{ version: string }>;
      const ver = customEvent.detail?.version || PLATFORM_VERSION;
      setToastMessage(`siteStore has been completely reset to factory new (v${ver}).`);
    };

    window.addEventListener(PLATFORM_RESET_EVENT, handlePlatformReset);
    return () => window.removeEventListener(PLATFORM_RESET_EVENT, handlePlatformReset);
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleConfirmReset = () => {
    try {
      resetEntirePlatformStore();
      setIsResetModalOpen(false);
      setToastMessage(`siteStore successfully reset to factory new (v${PLATFORM_VERSION})!`);
    } catch (err) {
      console.error('Failed to reset platform store:', err);
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.left}>
          <button className={styles.iconBtn} aria-label="Toggle menu">
            <Menu size={20} />
          </button>
          <div className={styles.logo}>
            <div className={styles.logoMark}>B</div>
            <span className={styles.logoText}>BillionBiz</span>
            <span className={styles.versionBadge} title={`BillionBiz Platform v${PLATFORM_VERSION}`}>
              v{PLATFORM_VERSION}
            </span>
          </div>
        </div>
        
        <div className={styles.right}>
          {/* Topbar Reset siteStore Action Button */}
          <button 
            type="button"
            className={styles.resetSiteStoreBtn}
            onClick={() => setIsResetModalOpen(true)}
            title="Reset siteStore and restore platform to brand new state"
            aria-label="Reset siteStore"
          >
            <RotateCcw size={14} />
            <span className={styles.resetBtnText}>Reset siteStore</span>
          </button>

          <button className={styles.langSelector} aria-label="Select language">
            <Globe size={16} />
            <span>English</span>
            <ChevronDown size={14} />
          </button>
          
          <div className={styles.themeToggle}>
            <button className={styles.iconBtnSmall} aria-label="Switch to dark theme">
              <Moon size={16} />
            </button>
            <button className={styles.iconBtnSmall} aria-label="Switch to light theme">
              <Sun size={16} />
            </button>
          </div>
          
          <div className={styles.proPlanBadge}>
            Pro Plan
          </div>
          
          <button className={styles.notificationBtn} aria-label="Notifications">
            <Bell size={20} />
            <span className={styles.badge}>3</span>
          </button>
          
          <div className={styles.profile} tabIndex={0} role="button" aria-label="User profile">
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="John D." className={styles.avatar} />
            <span className={styles.profileName}>John D.</span>
            <ChevronDown size={14} />
          </div>
        </div>
      </header>

      {/* Confirmation Modal */}
      {isResetModalOpen && (
        <div 
          className={styles.modalOverlay} 
          onClick={() => setIsResetModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-modal-title"
        >
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle} id="reset-modal-title">
                <RotateCcw size={18} className={styles.modalTitleIcon} />
                <span>Reset siteStore to Factory New</span>
              </div>
              <button 
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setIsResetModalOpen(false)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <p>
                This will completely reset <strong>siteStore</strong> and browser storage for version{' '}
                <strong>v{PLATFORM_VERSION}</strong>. All storefront pages, layouts, global theme styling,
                header/footer navigation, and store settings will be restored to clean factory defaults.
              </p>

              <div className={styles.modalWarningBox}>
                <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Warning:</strong> Any customized page layouts, published snapshots, or drafts
                  in siteStore will be erased. The entire platform will be returned to a brand-new state.
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button 
                type="button"
                className={styles.modalCancelBtn}
                onClick={() => setIsResetModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                type="button"
                className={styles.modalConfirmBtn}
                onClick={handleConfirmReset}
              >
                <RotateCcw size={14} />
                <span>Reset to Like New</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className={styles.topbarToast} role="status" aria-live="polite">
          <CheckCircle2 size={16} color="#34d399" style={{ flexShrink: 0 }} />
          <span>{toastMessage}</span>
          <button 
            type="button"
            className={styles.toastCloseBtn}
            onClick={() => setToastMessage(null)}
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </>
  );
};

export default Header;
