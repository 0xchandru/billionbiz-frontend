import React, { useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import styles from './EditorLayout.module.css';
import { EditorTopBar } from '../../components/editor/EditorTopBar';
import { EditorLeftSidebar } from '../../components/editor/EditorLeftSidebar';
import { EditorRightSidebar } from '../../components/editor/EditorRightSidebar';
import { EditorCanvas } from '../../components/editor/EditorCanvas';
import { useLandingEditorStore } from '../../store/landingEditorStore';
import { useSiteStore, type PageData } from '../../store/siteStore';

const resolvePageId = (rawId: string, pages: PageData[]): string | null => {
  if (!rawId) return null;

  const aliases: Record<string, string> = {
    'products-list': 'shop-page',
    'products': 'shop-page',
    'shop': 'shop-page',
    'product-details': 'product-details-page',
    'refund-policy-page': 'return-policy-page',
    'refund-policy': 'return-policy-page',
    'returns': 'return-policy-page',
    'landing': 'landing-page',
    'home': 'landing-page',
  };

  const target = aliases[rawId] || rawId;

  // 1. Direct ID match
  const matchId = pages.find(p => p.id === target);
  if (matchId) return matchId.id;

  // 2. ID with -page suffix
  const matchIdSuffix = pages.find(p => p.id === `${target}-page`);
  if (matchIdSuffix) return matchIdSuffix.id;

  // 3. Type match
  const matchType = pages.find(p => p.type === target || p.type === target.replace(/-page$/, ''));
  if (matchType) return matchType.id;

  // 4. Normalized path or name match
  const matchName = pages.find(p => p.name.toLowerCase() === target.toLowerCase() || p.name.toLowerCase().replace(/[^a-z0-9]/g, '') === target.toLowerCase().replace(/[^a-z0-9]/g, ''));
  if (matchName) return matchName.id;

  return null;
};

const EditorLayout: React.FC = () => {
  const { tab } = useParams<{ tab?: string }>();
  const [searchParams] = useSearchParams();
  const pageIdParam = searchParams.get('pageId');
  const tabParam = (searchParams.get('tab') || tab || '').toLowerCase();

  const { setActivePanel, setSelectedPageId } = useLandingEditorStore();
  const { pages } = useSiteStore();

  const lastProcessedRef = useRef<string>('');

  useEffect(() => {
    const key = `${tabParam}|${pageIdParam || ''}`;
    if (lastProcessedRef.current === key) return;
    lastProcessedRef.current = key;

    if (pageIdParam) {
      const resolved = resolvePageId(pageIdParam, pages);
      if (resolved) {
        if (tabParam === 'pages') {
          setSelectedPageId(resolved);
          setActivePanel('pages');
          useLandingEditorStore.setState({ isRightSidebarOpen: true });
        } else if (tabParam === 'theme') {
          setSelectedPageId('landing-page');
          setActivePanel('theme');
        } else if (tabParam === 'settings') {
          setSelectedPageId(resolved);
          setActivePanel('settings');
        } else {
          setSelectedPageId('landing-page');
          setActivePanel('editor');
        }
        return;
      }
    }

    if (tabParam === 'pages') {
      setActivePanel('pages');
      useLandingEditorStore.setState({ isRightSidebarOpen: true });
    } else if (tabParam === 'theme') {
      setSelectedPageId('landing-page');
      setActivePanel('theme');
    } else if (tabParam === 'settings') {
      setActivePanel('settings');
    } else {
      setActivePanel('editor');
      setSelectedPageId('landing-page');
    }
  }, [tabParam, pageIdParam, pages, setActivePanel, setSelectedPageId]);

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
