import React from 'react';
import styles from './EditorLayout.module.css';
import { EditorTopBar } from '../../components/editor/EditorTopBar';
import { EditorLeftSidebar } from '../../components/editor/EditorLeftSidebar';
import { EditorRightSidebar } from '../../components/editor/EditorRightSidebar';
import { EditorCanvas } from '../../components/editor/EditorCanvas';

import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useEditorStore } from '../../store/editorStore';

const EditorLayout: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { setSelectedPageId, setActiveTab } = useEditorStore();

  useEffect(() => {
    const pageId = searchParams.get('pageId');
    const tab = searchParams.get('tab');
    if (pageId) {
      setSelectedPageId(pageId);
    }
    if (tab) {
      setActiveTab(tab as any);
    }
  }, [searchParams, setSelectedPageId, setActiveTab]);

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
