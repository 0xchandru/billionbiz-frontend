import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Check, FileText, Palette, Settings } from 'lucide-react';
import { useSiteStore } from '../../../store/siteStore';
import { useLandingEditorStore } from '../../../store/landingEditorStore';
import styles from './topbar.module.css';

export const PageSelectorDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const { pages } = useSiteStore();
  const { selectedPageId, setSelectedPageId, activePanel, setActivePanel } = useLandingEditorStore();

  const activePage = pages.find((p) => p.id === selectedPageId) || pages[0];

  // Dynamic title based on active panel & page
  const getContextTitle = () => {
    if (activePanel === 'theme') return 'Theme & Styles';
    if (activePanel === 'settings') return 'Site Settings';
    if (!activePage) return 'Landing Page';
    if (activePage.id === 'landing-page') return 'Landing Page';
    return activePage.name;
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelectPage = (pageId: string) => {
    setSelectedPageId(pageId);
    if (activePanel !== 'editor') {
      setActivePanel('editor');
    }
    navigate(pageId === 'landing-page' ? '/editor' : `/editor?pageId=${pageId}`, { replace: true });
    setIsOpen(false);
  };

  const handleSelectTheme = () => {
    setActivePanel('theme');
    navigate('/editor/theme', { replace: true });
    setIsOpen(false);
  };

  const handleSelectSettings = () => {
    setActivePanel('settings');
    navigate('/editor/settings', { replace: true });
    setIsOpen(false);
  };

  const isThemeActive = activePanel === 'theme';
  const isSettingsActive = activePanel === 'settings';

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button 
        className={styles.pageSelectorTrigger}
        onClick={() => setIsOpen(!isOpen)}
        title={getContextTitle()}
        aria-expanded={isOpen}
      >
        <span className={styles.pageTitleText}>{getContextTitle()}</span>
        <ChevronDown 
          size={13} 
          className={styles.chevronIcon} 
          style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}
        />
      </button>

      {isOpen && (
        <div className={`${styles.popoverCard} ${styles.pageSelectorPopover}`}>
          {/* Section: Pages */}
          <div style={{ padding: '4px 8px 6px', borderBottom: '1px solid #f1f5f9', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Pages
            </span>
          </div>

          <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
            {pages.map((p) => {
              const isSelected = !isThemeActive && !isSettingsActive && p.id === (activePage?.id || selectedPageId);
              const displayName = p.id === 'landing-page' ? 'Landing Page' : p.name;
              return (
                <button
                  key={p.id}
                  className={`${styles.pageItem} ${isSelected ? styles.activePageItem : ''}`}
                  onClick={() => handleSelectPage(p.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <FileText size={13} style={{ opacity: isSelected ? 1 : 0.6, flexShrink: 0 }} />
                    <span style={{ fontWeight: isSelected ? 600 : 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {displayName}
                    </span>
                  </div>
                  {isSelected && <Check size={14} color="#059669" style={{ flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '6px 4px 4px' }} />

          {/* Section: Global Styles & Settings */}
          <div style={{ padding: '4px 8px 6px', marginBottom: '2px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Site Styles & Settings
            </span>
          </div>

          {/* Theme Option */}
          <button
            className={`${styles.pageItem} ${isThemeActive ? styles.activePageItem : ''}`}
            onClick={handleSelectTheme}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
              <Palette size={13} style={{ opacity: isThemeActive ? 1 : 0.6, flexShrink: 0 }} />
              <span style={{ fontWeight: isThemeActive ? 600 : 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Theme & Styles
              </span>
            </div>
            {isThemeActive && <Check size={14} color="#059669" style={{ flexShrink: 0 }} />}
          </button>

          {/* Settings Option */}
          <button
            className={`${styles.pageItem} ${isSettingsActive ? styles.activePageItem : ''}`}
            onClick={handleSelectSettings}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
              <Settings size={13} style={{ opacity: isSettingsActive ? 1 : 0.6, flexShrink: 0 }} />
              <span style={{ fontWeight: isSettingsActive ? 600 : 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Site Settings
              </span>
            </div>
            {isSettingsActive && <Check size={14} color="#059669" style={{ flexShrink: 0 }} />}
          </button>
        </div>
      )}
    </div>
  );
};
