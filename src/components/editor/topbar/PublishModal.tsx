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

  const snapshot = activePage.lastPublishedSnapshot || (activePage ? lastPublishedSnapshots?.[activePage.id] : null);
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
    if (!isInputValid) return;
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
            <span className={styles.publishTitle}>Publish Changes to Storefront</span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
            title="Close dialog"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.publishBody}>
          <p style={{ fontSize: '13px', color: '#475569', marginBottom: '14px', lineHeight: 1.4 }}>
            Review sections for <strong>{activePage.name}</strong> before publishing to the live storefront:
          </p>

          {hasChanges ? (
            <>
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
            </>
          ) : (
            <div className={styles.noChangesBox}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#15803d', fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>
                <CheckCircle2 size={16} color="#15803d" />
                <span>No Section Changes Detected</span>
              </div>
              <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b', lineHeight: 1.4 }}>
                All sections on <strong>{activePage.name}</strong> currently match the live storefront. You can still confirm below to re-publish if desired.
              </p>
            </div>
          )}

          {/* Confirmation Input */}
          <div className={styles.confirmInputSection}>
            <label className={styles.confirmInputLabel}>
              Type <strong style={{ color: '#0f172a' }}>publish</strong> to confirm publishing:
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
        </div>
      </div>
    </div>
  );
};
