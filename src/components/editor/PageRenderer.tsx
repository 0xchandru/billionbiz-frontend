import React, { useEffect, useRef } from 'react';
import type { PageData } from '../../store/siteStore';
import { SectionRenderer } from './SectionRenderer';
import { useEditorStore } from '../../store/editorStore';
import { useSiteStore } from '../../store/siteStore';
import { Settings, Copy, Trash2, Plus, Home, Search, ShoppingCart, User as UserIcon, Heart, Menu, Grid, List, Check } from 'lucide-react';
import styles from '../../pages/editor/EditorLayout.module.css';

export const PageRenderer: React.FC<{ page: PageData, overrideDevice?: string }> = ({ page, overrideDevice }) => {
  const { selectedSectionId, setSelectedSectionId } = useEditorStore();
  const storeDevice = useEditorStore(state => state.device);
  const device = overrideDevice || storeDevice;
  const { addSection, theme } = useSiteStore();
  const settings = useSiteStore(state => state.settings);

  const themeStyles = `
    .preview-theme-wrapper {
      --theme-primary: ${theme.colors.primary};
      --theme-secondary: ${theme.colors.secondary};
      --theme-background: ${theme.colors.background};
      --theme-text: ${theme.colors.text};
      --theme-accent: ${theme.colors.accent};
      --theme-border: ${theme.colors.border};
      
      --theme-font-heading: ${theme.typography.headingFont};
      --theme-font-body: ${theme.typography.bodyFont};
      --theme-base-size: ${theme.typography.baseSize}px;
      
      --theme-radius: ${theme.ui.borderRadius};
      --theme-shadow: ${theme.ui.shadow};
      
      --theme-max-width: ${theme.layout.maxWidth}px;
      
      font-family: var(--theme-font-body);
      font-size: var(--theme-base-size);
      color: var(--theme-text);
      background-color: var(--theme-background);
    }
    
    .preview-theme-wrapper h1, 
    .preview-theme-wrapper h2, 
    .preview-theme-wrapper h3, 
    .preview-theme-wrapper h4, 
    .preview-theme-wrapper h5, 
    .preview-theme-wrapper h6 {
      font-family: var(--theme-font-heading);
    }
  `;

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

  const headerSection = page.sections.find(s => s.type === 'Header');
  const hasHeader = !!headerSection;
  const showBottomNav = settings.showBottomNav !== false;
  const bottomNavLinks = settings.bottomNavLinks || [
    { id: 'home', icon: 'Home', text: 'Home', link: '/' },
    { id: 'shop', icon: 'Grid', text: 'Shop', link: '/collections/all' },
    { id: 'cart', icon: 'ShoppingCart', text: 'Cart', link: '/cart' },
    { id: 'profile', icon: 'User', text: 'Profile', link: '/profile' }
  ];

  const IconMap: Record<string, React.FC<any>> = {
    Home, Search, ShoppingCart, User: UserIcon, Settings, Heart, Menu, Grid, List, Check
  };
  
  return (
    <div 
      className={`${styles.previewPage} preview-theme-wrapper`}
      style={{ paddingBottom: (device === 'mobile' && hasHeader && showBottomNav && bottomNavLinks.length > 0) ? '80px' : '0' }}
    >
      <style>{themeStyles}</style>
      {page.sections.map(section => {
        if (isSectionHidden(section)) return null;

        return (
          <div 
            key={section.id} 
          ref={(el) => { sectionRefs.current[section.id] = el; }}
          className={`${styles.previewSectionWrapper} ${selectedSectionId === section.id ? styles.activeSectionBorder : ''}`}
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
      
      {device === 'mobile' && hasHeader && showBottomNav && bottomNavLinks && bottomNavLinks.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'var(--theme-background)',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '12px 16px',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
          zIndex: 10000,
          boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
        }}>
          {bottomNavLinks.map((item: any) => {
            const Icon = IconMap[item.icon] || Home;
            return (
              <a key={item.id} href={item.link} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                textDecoration: 'none',
                color: 'var(--theme-text)',
                opacity: 0.7,
                flex: 1,
              }}>
                <Icon size={20} />
                <span style={{ fontSize: '10px', fontWeight: 600 }}>{item.text}</span>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};
