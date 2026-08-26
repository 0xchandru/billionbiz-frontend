import React from 'react';
import styles from './EditorLayout.module.css';
import { EditorTopBar } from '../../components/editor/EditorTopBar';
import { EditorLeftSidebar } from '../../components/editor/EditorLeftSidebar';
import { EditorRightSidebar } from '../../components/editor/EditorRightSidebar';
import { EditorCanvas } from '../../components/editor/EditorCanvas';
import { useSiteStore } from '../../store/siteStore';

const EditorLayout: React.FC = () => {
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
