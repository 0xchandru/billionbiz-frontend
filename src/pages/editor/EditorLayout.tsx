import React from 'react';
import styles from './EditorLayout.module.css';
import { EditorTopBar } from '../../components/editor/EditorTopBar';
import { EditorLeftSidebar } from '../../components/editor/EditorLeftSidebar';
import { EditorRightSidebar } from '../../components/editor/EditorRightSidebar';
import { EditorCanvas } from '../../components/editor/EditorCanvas';
import { useSiteStore } from '../../store/siteStore';

const EditorLayout: React.FC = () => {
  const { loadStore, saveStore, pages, theme, settings } = useSiteStore();

  React.useEffect(() => {
    loadStore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      saveStore();
    }, 1000);
    return () => clearTimeout(handler);
  }, [pages, theme, settings, saveStore]);
  return (
    <div className={styles.editorWrapper}>
      <EditorTopBar />
      <div className={styles.mainEditor}>
        <EditorLeftSidebar />
        <EditorCanvas />
        <EditorRightSidebar />
      </div>
    </div>
  );
};

export default EditorLayout;
