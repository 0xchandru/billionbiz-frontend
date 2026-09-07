import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Check, FileText } from 'lucide-react';
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

  // Dynamic title based on active page
  const getContextTitle = () => {
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
          <div style={{ padding: '4px 8px 6px', borderBottom: '1px solid #f1f5f9', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Switch Page
            </span>
          </div>

          <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
            {pages.map((p) => {
              const isSelected = p.id === (activePage?.id || selectedPageId);
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
        </div>
      )}
    </div>
  );
};
