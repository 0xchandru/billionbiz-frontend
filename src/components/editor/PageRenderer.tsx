import React, { useEffect, useRef } from 'react';
import type { PageData } from '../../store/siteStore';
import { SectionRenderer } from './SectionRenderer';
import { useLandingEditorStore } from '../../store/landingEditorStore';
import { useSiteStore } from '../../store/siteStore';
import { Settings, Copy, Trash2, Plus, Home, Search, ShoppingCart, User as UserIcon, Heart, Menu, Grid, List, Check } from 'lucide-react';
import styles from '../../pages/editor/EditorLayout.module.css';

export const PageRenderer: React.FC<{ page: PageData, overrideDevice?: string }> = ({ page, overrideDevice }) => {
  if (!page || !page.sections) {
    return null;
  }

  const { selectedSectionId, setSelectedSectionId, setAddSectionWidgetOpen, setInsertIndex, activePanel } = useLandingEditorStore();
  const storeDevice = useLandingEditorStore(state => state.device);
  const device = overrideDevice || storeDevice;
  const { theme } = useSiteStore();
  const settings = useSiteStore(state => state.settings);

  const p = theme.palette || {};
  const t = theme.typography || {};
  const b = theme.buttons || {};
  const e = theme.effects || {};
  const stylesObj = t.styles || {};

  const themeStyles = `
    .preview-theme-wrapper {
      /* Palette: Brand */
      --theme-brand-primary: ${p.brand?.primary || theme.colors?.primary || '#2563eb'};
      --theme-brand-secondary: ${p.brand?.secondary || theme.colors?.secondary || '#4f46e5'};
      --theme-brand-accent: ${p.brand?.accent || theme.colors?.accent || '#f59e0b'};
      --theme-brand-link: ${p.brand?.link || theme.colors?.primary || '#2563eb'};

      /* Palette: Background */
      --theme-bg-background: ${p.background?.background || theme.colors?.background || '#ffffff'};
      --theme-bg-surface: ${p.background?.surface || '#f8fafc'};
      --theme-bg-section: ${p.background?.sectionBg || '#ffffff'};
      --theme-bg-container: ${p.background?.containerBg || '#ffffff'};

      /* Palette: Text */
      --theme-text-heading: ${p.text?.heading || theme.colors?.text || '#0f172a'};
      --theme-text-subheading: ${p.text?.subheading || '#334155'};
      --theme-text-body: ${p.text?.body || theme.colors?.text || '#475569'};
      --theme-text-muted: ${p.text?.muted || '#94a3b8'};
      --theme-text-inverse: ${p.text?.inverse || '#ffffff'};

      /* Palette: Border */
      --theme-border-border: ${p.border?.border || theme.colors?.border || '#e2e8f0'};
      --theme-border-divider: ${p.border?.divider || '#f1f5f9'};

      /* Palette: States */
      --theme-state-success: ${p.states?.success || '#10b981'};
      --theme-state-warning: ${p.states?.warning || '#f59e0b'};
      --theme-state-error: ${p.states?.error || '#ef4444'};
      --theme-state-info: ${p.states?.info || '#3b82f6'};

      /* Typography Tokens */
      --theme-font-heading: ${t.headingFont || 'Outfit, sans-serif'};
      --theme-font-body: ${t.bodyFont || 'Inter, sans-serif'};
      --theme-font-button: ${t.buttonFont || t.bodyFont || 'Inter, sans-serif'};
      --theme-font-accent: ${t.accentFont || t.headingFont || 'Space Grotesk, sans-serif'};
      --theme-base-size: ${t.baseSize || 16}px;

      /* Button Tokens */
      --theme-btn-primary-bg: ${b.primary?.bg || '#2563eb'};
      --theme-btn-primary-text: ${b.primary?.text || '#ffffff'};
      --theme-btn-primary-border: ${b.primary?.border || '1px solid #2563eb'};
      --theme-btn-primary-radius: ${b.primary?.borderRadius || '8px'};
      --theme-btn-primary-weight: ${b.primary?.fontWeight || 600};

      --theme-btn-secondary-bg: ${b.secondary?.bg || '#f1f5f9'};
      --theme-btn-secondary-text: ${b.secondary?.text || '#0f172a'};
      --theme-btn-secondary-border: ${b.secondary?.border || '1px solid #e2e8f0'};
      --theme-btn-secondary-radius: ${b.secondary?.borderRadius || '8px'};

      /* Effects */
      --theme-radius: ${e.borderRadius || theme.ui?.borderRadius || '8px'};
      --theme-shadow: ${e.shadow || theme.ui?.shadow || '0 4px 6px -1px rgb(0 0 0 / 0.1)'};
      --theme-transition: ${e.transition || 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'};

      /* Legacy compatibility aliases */
      --theme-primary: var(--theme-brand-primary);
      --theme-secondary: var(--theme-brand-secondary);
      --theme-background: var(--theme-bg-background);
      --theme-text: var(--theme-text-body);
      --theme-accent: var(--theme-brand-accent);
      --theme-border: var(--theme-border-border);
      --theme-max-width: ${theme.layout?.maxWidth || 1280}px;

      font-family: var(--theme-font-body);
      font-size: var(--theme-base-size);
      color: var(--theme-text-body);
      background-color: var(--theme-bg-background);
    }
    
    .preview-theme-wrapper h1 {
      font-family: var(--theme-font-heading);
      font-size: ${stylesObj.h1?.fontSize || 44}px;
      font-weight: ${stylesObj.h1?.fontWeight || 700};
      line-height: ${stylesObj.h1?.lineHeight || 1.15};
      letter-spacing: ${stylesObj.h1?.letterSpacing || -1}px;
      color: var(--theme-text-heading);
    }
    .preview-theme-wrapper h2 {
      font-family: var(--theme-font-heading);
      font-size: ${stylesObj.h2?.fontSize || 34}px;
      font-weight: ${stylesObj.h2?.fontWeight || 700};
      line-height: ${stylesObj.h2?.lineHeight || 1.2};
      letter-spacing: ${stylesObj.h2?.letterSpacing || -0.5}px;
      color: var(--theme-text-heading);
    }
    .preview-theme-wrapper h3 {
      font-family: var(--theme-font-heading);
      font-size: ${stylesObj.h3?.fontSize || 26}px;
      font-weight: ${stylesObj.h3?.fontWeight || 600};
      line-height: ${stylesObj.h3?.lineHeight || 1.25};
      letter-spacing: ${stylesObj.h3?.letterSpacing || -0.3}px;
      color: var(--theme-text-heading);
    }
    .preview-theme-wrapper h4 {
      font-family: var(--theme-font-heading);
      font-size: ${stylesObj.h4?.fontSize || 20}px;
      font-weight: ${stylesObj.h4?.fontWeight || 600};
      line-height: ${stylesObj.h4?.lineHeight || 1.3};
      letter-spacing: ${stylesObj.h4?.letterSpacing || 0}px;
      color: var(--theme-text-heading);
    }
    .preview-theme-wrapper p {
      color: var(--theme-text-body);
      line-height: ${stylesObj.body?.lineHeight || 1.6};
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
      {[
        ...page.sections.filter(s => ['AnnouncementBar', 'UtilityBar', 'Header'].includes(s.type)),
        ...page.sections.filter(s => !['AnnouncementBar', 'UtilityBar', 'Header', 'FooterMenu', 'FooterText', 'Footer'].includes(s.type)),
        ...page.sections.filter(s => ['FooterMenu', 'FooterText', 'Footer'].includes(s.type))
      ].map(section => {
        if (isSectionHidden(section)) return null;

        const isEditable = page.id === 'landing-page' && activePanel === 'editor';
        const storeIndex = page.sections.findIndex(s => s.id === section.id);
        const isHeaderOrFooter = ['Header', 'Footer', 'AnnouncementBar', 'UtilityBar', 'FooterMenu', 'FooterText'].includes(section.type);

        return (
          <div 
            key={section.id} 
            ref={(el) => { sectionRefs.current[section.id] = el; }}
            className={`${isEditable ? styles.previewSectionWrapper : ''} ${isEditable && selectedSectionId === section.id ? styles.activeSectionBorder : ''}`}
            onClick={() => isEditable && setSelectedSectionId(section.id)}
            style={section.type === 'Header' && section.props?.sticky !== false ? { position: 'sticky', top: 0, zIndex: 200 } : {}}
          >
            {isEditable && storeIndex !== -1 && !isHeaderOrFooter && (
              <button 
                className={`${styles.hoverAddBtn} ${styles.hoverAddBtnTop}`}
                onClick={(e) => { e.stopPropagation(); setInsertIndex(storeIndex); setAddSectionWidgetOpen(true); }}
                title="Add section above"
              >
                <Plus size={14} />
              </button>
            )}
            {isEditable && selectedSectionId === section.id && (
              <div className={styles.sectionLabel}>
                <span>{section.name}</span>
                <div className={styles.sectionQuickActions}>
                  <button 
                    style={{ background: 'none', border: 'none', padding: 0, color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      useLandingEditorStore.getState().setRightSidebarOpen(true);
                    }}
                    title="Section Settings"
                  >
                    <Settings size={12} />
                  </button>
                  <button 
                    style={{ background: 'none', border: 'none', padding: 0, color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      useSiteStore.getState().duplicateSection(page.id, section.id);
                    }}
                    title="Duplicate Section"
                  >
                    <Copy size={12} />
                  </button>
                  {!['Header', 'Footer'].includes(section.type) && (
                    <button 
                      style={{ background: 'none', border: 'none', padding: 0, color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        useSiteStore.getState().removeSection(page.id, section.id);
                      }}
                      title="Delete Section"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>
            )}
            
            <SectionRenderer section={section} overrideDevice={overrideDevice} />
            
            
            {isEditable && storeIndex !== -1 && !isHeaderOrFooter && (
              <button 
                className={`${styles.hoverAddBtn} ${styles.hoverAddBtnBottom}`}
                onClick={(e) => { e.stopPropagation(); setInsertIndex(storeIndex + 1); setAddSectionWidgetOpen(true); }}
                title="Add section below"
              >
                <Plus size={14} />
              </button>
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
