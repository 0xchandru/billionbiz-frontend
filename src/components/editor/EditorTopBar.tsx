import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Undo, Redo, ChevronDown, Monitor, Tablet, Smartphone, ArrowLeft, Columns } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import styles from '../../pages/editor/EditorLayout.module.css';

export const EditorTopBar: React.FC = () => {
  const navigate = useNavigate();
  const { device, setDevice } = useEditorStore();

  return (
    <header className={styles.topBar}>
      <div className={styles.topLeft}>
        <button className={styles.backNavBtn} onClick={() => navigate('/pages')}>
          <ArrowLeft size={18} />
        </button>
        <div className={styles.logoBox}>B</div>
        <div className={styles.siteSelector}>
          <span className={styles.siteName}>BillionBiz</span>
          <ChevronDown size={14} />
        </div>
        <div className={styles.liveStatus}>
          <div className={styles.liveDot}></div>
          <span>Live</span>
        </div>
      </div>

      <div className={styles.deviceToggles}>
        <button 
          className={`${styles.deviceBtn} ${device === 'desktop' ? styles.activeDevice : ''}`} 
          onClick={() => setDevice('desktop')}
        >
          <Monitor size={18} />
        </button>
        <button 
          className={`${styles.deviceBtn} ${device === 'tablet' ? styles.activeDevice : ''}`} 
          onClick={() => setDevice('tablet')}
        >
          <Tablet size={18} />
        </button>
        <button 
          className={`${styles.deviceBtn} ${device === 'mobile' ? styles.activeDevice : ''}`} 
          onClick={() => setDevice('mobile')}
        >
          <Smartphone size={18} />
        </button>
        <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0', margin: '0 8px' }} />
        <button 
          className={`${styles.deviceBtn} ${device === 'all' ? styles.activeDevice : ''}`} 
          onClick={() => setDevice('all')}
          title="All Devices View"
        >
          <Columns size={18} />
        </button>
      </div>

      <div className={styles.topRight}>
        <div className={styles.historyBtns}>
          <button className={styles.iconBtn}><Undo size={18} /></button>
          <button className={styles.iconBtn}><Redo size={18} /></button>
        </div>
        <div className={styles.actionBtns}>
          <button className={styles.btnOutline} onClick={() => navigate('/pages')}>Save</button>
          <button className={styles.btnOutline}>Preview</button>
          <button className={styles.btnPrimary}>
            <span>Publish</span>
            <ChevronDown size={14} />
          </button>
        </div>
      </div>
    </header>
  );
};
