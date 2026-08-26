import React, { useEffect, useRef } from 'react';
import type { PageData } from '../../store/siteStore';
import { SectionRenderer } from './SectionRenderer';
import { useEditorStore } from '../../store/editorStore';
import { useSiteStore } from '../../store/siteStore';
import { Settings, Copy, Trash2, Plus } from 'lucide-react';
import styles from '../../pages/editor/EditorLayout.module.css';

export const PageRenderer: React.FC<{ page: PageData, overrideDevice?: string }> = ({ page, overrideDevice }) => {
  const { selectedSectionId, setSelectedSectionId } = useEditorStore();
  const storeDevice = useEditorStore(state => state.device);
  const device = overrideDevice || storeDevice;
  const { addSection } = useSiteStore();

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isSectionHidden = (section: any) => {
    if (section.isHidden) return true;
    if (section.props?.visibility) {
      if (device === 'desktop' && section.props.visibility.desktop === false) return true;
      if (device === 'tablet' && section.props.visibility.tablet === false) return true;
      if (device === 'mobile' && section.props.visibility.mobile === false) return true;
    }
    return false;
  };

  useEffect(() => {
    if (selectedSectionId && sectionRefs.current[selectedSectionId]) {
      sectionRefs.current[selectedSectionId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedSectionId]);

  return (
    <div className={styles.previewPage}>
      {page.sections.map(section => {
        if (isSectionHidden(section)) return null;

        return (
          <div 
            key={section.id} 
          ref={(el) => { sectionRefs.current[section.id] = el; }}
          className={selectedSectionId === section.id ? styles.activeSectionBorder : ''}
          onClick={() => setSelectedSectionId(section.id)}
        >
          {selectedSectionId === section.id && (
            <div className={styles.sectionLabel}>
              <span>{section.name}</span>
              <div className={styles.sectionQuickActions}>
                <Settings size={12} />
                <Copy size={12} />
                <Trash2 size={12} />
              </div>
            </div>
          )}
          
          <SectionRenderer section={section} overrideDevice={overrideDevice} />
          
          {selectedSectionId === section.id && (
            <div className={styles.addSectionDivider}>
              <button 
                className={styles.addSectionFloating} 
                onClick={(e) => { e.stopPropagation(); addSection(page.id, 'FeaturedCollection'); }}
              >
                <Plus size={14}/> Add section
              </button>
            </div>
          )}
        </div>
        );
      })}
    </div>
  );
};
