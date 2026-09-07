import React, { useState, useEffect } from 'react';
import { CheckCircle2, X, UploadCloud, Plus, Minus, Edit3, ShieldCheck } from 'lucide-react';
import { useSiteStore, type SectionData } from '../../../store/siteStore';
import { useLandingEditorStore } from '../../../store/landingEditorStore';
import styles from './topbar.module.css';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [confirmText, setConfirmText] = useState('');
  const { selectedPageId } = useLandingEditorStore();
  const { pages, lastPublishedSnapshots, publishPage } = useSiteStore();

  const activePage = pages.find((p) => p.id === selectedPageId) || pages[0];

  useEffect(() => {
    if (isOpen) {
      setConfirmText('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !activePage) return null;

  const snapshot = lastPublishedSnapshots?.[activePage.id];
  const snapshotSections: SectionData[] = snapshot?.sections || [];
  const currentSections: SectionData[] = activePage.sections || [];

  // Calculate Added, Removed, Modified sections
  const snapshotMap = new Map(snapshotSections.map((s) => [s.id, s]));
  const currentMap = new Map(currentSections.map((s) => [s.id, s]));

  const addedSections: SectionData[] = [];
  const modifiedSections: SectionData[] = [];
  const removedSections: SectionData[] = [];

  // Detect added and modified
  for (const current of currentSections) {
    const prev = snapshotMap.get(current.id);
    if (!prev) {
      addedSections.push(current);
    } else {
      const isPropsDiff = JSON.stringify(current.props || {}) !== JSON.stringify(prev.props || {});
      const isNameDiff = current.name !== prev.name;
      const isHiddenDiff = current.isHidden !== prev.isHidden;
      if (isPropsDiff || isNameDiff || isHiddenDiff) {
        modifiedSections.push(current);
      }
    }
  }

  // Detect removed
  for (const prev of snapshotSections) {
    if (!currentMap.has(prev.id)) {
      removedSections.push(prev);
    }
  }

  const hasChanges = addedSections.length > 0 || removedSections.length > 0 || modifiedSections.length > 0;
  const isInputValid = confirmText.trim().toLowerCase() === 'publish';

  const handleConfirmPublish = () => {
    if (!isInputValid && hasChanges) return;
    publishPage(activePage.id);
    onClose();
    onSuccess(`Published "${activePage.name}" to live storefront!`);
  };

  return (
    <div className={styles.publishModalOverlay} onClick={onClose}>
      <div className={styles.publishModalBox} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.publishHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UploadCloud size={18} color="#15803d" />
            <span className={styles.publishTitle}>
              {hasChanges ? 'Publish Changes to Storefront' : 'Storefront Up to Date'}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.publishBody}>
          {!hasChanges ? (
            /* Condition: No changes detected */
            <div style={{ textAlign: 'center', padding: '16px 8px 8px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#f0fdf4', marginBottom: '16px' }}>
                <CheckCircle2 size={32} color="#15803d" />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>
                All Sections Match Live Storefront
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, margin: '0 auto 20px', maxWidth: '360px' }}>
                There are no pending additions, removals, or edits on <strong>{activePage.name}</strong>. Your storefront is currently showing the latest version.
              </p>
              <div className={styles.publishFooter} style={{ justifyContent: 'center' }}>
                <button className={styles.btnCancel} onClick={onClose} style={{ minWidth: '100px' }}>
                  Got it
                </button>
              </div>
            </div>
          ) : (
            /* Condition: Changes detected */
            <>
              <p style={{ fontSize: '13px', color: '#475569', marginBottom: '14px', lineHeight: 1.4 }}>
                Review the changes made to <strong>{activePage.name}</strong> before publishing to the live storefront:
              </p>

              {/* Summary Pills */}
              <div className={styles.publishDiffSummary}>
                {addedSections.length > 0 && (
                  <span className={`${styles.diffPill} ${styles.diffPillAdded}`}>
                    <Plus size={12} /> {addedSections.length} Added
                  </span>
                )}
                {removedSections.length > 0 && (
                  <span className={`${styles.diffPill} ${styles.diffPillRemoved}`}>
                    <Minus size={12} /> {removedSections.length} Removed
                  </span>
                )}
                {modifiedSections.length > 0 && (
                  <span className={`${styles.diffPill} ${styles.diffPillModified}`}>
                    <Edit3 size={12} /> {modifiedSections.length} Modified
                  </span>
                )}
              </div>

              {/* Diff List */}
              <div className={styles.diffList}>
                {addedSections.map((sec) => (
                  <div key={`added-${sec.id}`} className={styles.diffItem}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`${styles.diffItemType} ${styles.diffItemTypeAdded}`}>+ ADDED</span>
                      <span>{sec.name}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>{sec.type}</span>
                  </div>
                ))}

                {modifiedSections.map((sec) => (
                  <div key={`mod-${sec.id}`} className={styles.diffItem}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`${styles.diffItemType} ${styles.diffItemTypeModified}`}>~ MODIFIED</span>
                      <span>{sec.name}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>Content or Layout</span>
                  </div>
                ))}

                {removedSections.map((sec) => (
                  <div key={`rem-${sec.id}`} className={styles.diffItem}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`${styles.diffItemType} ${styles.diffItemTypeRemoved}`}>- REMOVED</span>
                      <span style={{ textDecoration: 'line-through', opacity: 0.8 }}>{sec.name}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>{sec.type}</span>
                  </div>
                ))}
              </div>

              {/* Confirmation Input */}
              <div className={styles.confirmInputSection}>
                <label className={styles.confirmInputLabel}>
                  Type <strong style={{ color: '#0f172a' }}>publish</strong> to confirm publishing changes:
                </label>
                <input
                  type="text"
                  className={styles.confirmInput}
                  placeholder="Type 'publish' to confirm"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  autoFocus
                />
              </div>

              {/* Footer Buttons */}
              <div className={styles.publishFooter}>
                <button className={styles.btnCancel} onClick={onClose}>
                  Cancel
                </button>
                <button
                  className={styles.btnConfirmPublish}
                  disabled={!isInputValid}
                  onClick={handleConfirmPublish}
                >
                  <ShieldCheck size={14} />
                  <span>Confirm & Publish</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
