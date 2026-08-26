import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  GripVertical, Eye, EyeOff, Trash2, Lock, MoreVertical, 
  ChevronUp, ChevronDown, Copy, Clock, Smartphone, Monitor, Code, Bookmark 
} from 'lucide-react';
import type { SectionData } from '../../store/siteStore';
import styles from '../../pages/editor/EditorLayout.module.css';

interface SortableItemProps {
  id: string;
  section: SectionData;
  isSelected: boolean;
  onSelect: () => void;
  onToggleVisibility: (e: React.MouseEvent) => void;
  onRemove: (e: React.MouseEvent) => void;
  onInsertClick?: () => void;
}

export const SortableItem: React.FC<SortableItemProps> = ({ 
  id, section, isSelected, onSelect, onToggleVisibility, onRemove, onInsertClick 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current && !menuRef.current.contains(target) &&
        (!dropdownRef.current || !dropdownRef.current.contains(target))
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: isDragging ? 'none' : transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 999 : 0,
    position: isDragging ? 'relative' : undefined,
    boxShadow: isDragging ? '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' : undefined,
  } as React.CSSProperties;

  const isLocked = section.type === 'Header' || section.type === 'Footer' || section.type === 'AnnouncementBar';

  return (
    <div
      ref={setNodeRef} 
      style={style}
      className={styles.sortableWrapper}
    >
      <div 
        className={`${styles.sectionItem} ${isSelected ? styles.activeSectionItem : ''}`}
        onClick={onSelect}
      >
        <div className={styles.sectionItemLeft}>
          {isLocked ? (
            <div style={{ width: '16px', display: 'flex', alignItems: 'center' }}>
               {section.type === 'AnnouncementBar' && (
                 <div 
                   style={{ cursor: 'pointer', display: 'flex', color: 'var(--text-muted)' }} 
                   onClick={onToggleVisibility}
                   title={section.isHidden ? 'Show announcement bar' : 'Hide announcement bar'}
                 >
                   {section.isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                 </div>
               )}
            </div>
          ) : (
            <div {...attributes} {...listeners} style={{ cursor: 'grab', display: 'flex', alignItems: 'center' }}>
              <GripVertical size={16} className={styles.dragIcon} />
            </div>
          )}
          <span className={styles.sectionName}>{section.name}</span>
        </div>
        <div className={styles.sectionItemRight}>
          {isLocked ? (
            <Lock size={14} style={{ color: 'var(--text-muted)' }} />
          ) : (
            <div style={{ position: 'relative' }} ref={menuRef}>
              <div 
                style={{ cursor: 'pointer', display: 'flex', padding: '4px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isMenuOpen) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setMenuPos({ top: rect.top, left: rect.right + 8 });
                  }
                  setIsMenuOpen(!isMenuOpen);
                }}
              >
                <MoreVertical size={16} style={{ color: 'var(--text-muted)' }} />
              </div>
              
              {isMenuOpen && createPortal(
                <div 
                  ref={dropdownRef}
                  className={styles.dropdownMenu} 
                  style={{ position: 'fixed', top: menuPos.top, left: menuPos.left, margin: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>
                    <ChevronUp size={16} /> Move Up
                  </button>
                  <button className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>
                    <ChevronDown size={16} /> Move Down
                  </button>
                  
                  <div className={styles.dropdownDivider}></div>
                  
                  <button className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>
                    <Copy size={16} /> Duplicate
                  </button>
                  <button className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>
                    <Clock size={16} /> Schedule visibility
                  </button>
                  
                  <button className={styles.dropdownItem} onClick={(e) => {
                    onToggleVisibility(e);
                    setIsMenuOpen(false);
                  }}>
                    {section.isHidden ? <Eye size={16} /> : <EyeOff size={16} />} 
                    {section.isHidden ? 'Show' : 'Hide'}
                  </button>
                  
                  <button className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>
                    <Smartphone size={16} /> Hide on mobile
                  </button>
                  <button className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>
                    <Monitor size={16} /> Hide on desktop
                  </button>
                  
                  <button className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>
                    <Code size={16} /> Copy as code
                  </button>
                  <button className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>
                    <Bookmark size={16} /> Save as snippet
                  </button>
                  <button className={`${styles.dropdownItem} ${styles.disabled}`} disabled>
                    <Bookmark size={16} /> Apply preset
                  </button>
                  
                  <div className={styles.dropdownDivider}></div>
                  
                  <button 
                    className={`${styles.dropdownItem} ${styles.dangerText}`}
                    onClick={(e) => {
                      onRemove(e);
                      setIsMenuOpen(false);
                    }}
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>,
                document.body
              )}
            </div>
          )}
        </div>
      </div>
      
      {onInsertClick && section.type !== 'Footer' && section.type !== 'AnnouncementBar' && (
        <div className={styles.insertArea}>
           <div className={styles.insertLine}></div>
           <div 
             className={styles.insertBtn} 
             onClick={(e) => {
               e.stopPropagation();
               onInsertClick();
             }}
             style={{ cursor: 'pointer' }}
           >
             + Insert
           </div>
        </div>
      )}
    </div>
  );
};
