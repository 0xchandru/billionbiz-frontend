import React from 'react';
import { ChevronRight, Sparkles, Trash2 } from 'lucide-react';
import { useEditorContextStore } from '../../../store/editorContextStore';
import { findNodeById } from './footerTreeEngine';
import { FooterShopifySettings } from './FooterShopifySettings';
import styles from '../../../pages/editor/EditorLayout.module.css';

interface FooterRightEditorProps {
  onClose?: () => void;
}

export const FooterRightEditor: React.FC<FooterRightEditorProps> = ({ onClose }) => {
  const {
    footerTree,
    footerRows,
    pendingFooterTree,
    selectedFooterNodeId,
    pendingFooterTemplateId,
    applyPendingFooterTemplate,
    cancelPendingFooterTemplate,
    deleteFooterTreeNode,
  } = useEditorContextStore();

  const effectiveTree = pendingFooterTree || footerTree;
  const selectedNode = selectedFooterNodeId
    ? findNodeById(effectiveTree, selectedFooterNodeId)
    : null;
  const selectedTitle = selectedNode?.nodeType === 'group'
    ? 'Group'
    : selectedNode?.name || 'Footer';
  const rootRow = footerRows.find((row) => row.id === 'footer-main') || footerRows[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', minWidth: 0, overflow: 'hidden' }}>
      <div className={styles.panelHeader}>
        <div className={styles.phLeft}>
          <button type="button" className={styles.iconBtn} onClick={onClose} title="Collapse sidebar">
            <ChevronRight size={20} className={styles.backIcon} />
          </button>
          <h3 className={styles.fw600} style={{ margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {selectedTitle}
          </h3>
        </div>
      </div>

      {pendingFooterTemplateId && (
        <div style={{ padding: '10px 14px', background: '#eff6ff', borderBottom: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#1d4ed8' }}>
            <Sparkles size={15} /> Previewing footer template
          </span>
          <span style={{ display: 'flex', gap: 6 }}>
            <button type="button" onClick={applyPendingFooterTemplate} style={smallButton('#16a34a', '#fff')}>Apply</button>
            <button type="button" onClick={cancelPendingFooterTemplate} style={smallButton('#e2e8f0', '#334155')}>Cancel</button>
          </span>
        </div>
      )}

      <div className={styles.propContent} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minWidth: 0, padding: 0 }}>
        <FooterShopifySettings node={selectedNode} rootRow={rootRow} />
      </div>

      {selectedNode && (
        <div style={{ padding: '12px 16px', borderTop: '1px solid #e2e8f0' }}>
          <button
            type="button"
            onClick={() => deleteFooterTreeNode(selectedNode.id)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, border: 0, borderRadius: 6, padding: '8px 12px', background: '#fff', color: '#b42318', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
          >
            <Trash2 size={14} /> Remove block
          </button>
        </div>
      )}
    </div>
  );
};

const smallButton = (background: string, color: string): React.CSSProperties => ({
  padding: '5px 9px', background, color, border: 0, borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: 'pointer',
});
