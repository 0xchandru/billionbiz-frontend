import React, { useEffect, useRef, useMemo } from 'react';
import type { PageData } from '../../store/siteStore';
import { SectionRenderer } from './SectionRenderer';
import { useLandingEditorStore } from '../../store/landingEditorStore';
import { useSiteStore } from '../../store/siteStore';
import { getDefaultTheme } from './theme/themePresets';
import { 
  Settings, 
  Copy, 
  Trash2, 
  Plus, 
  Home, 
  Search, 
  ShoppingCart, 
  User as UserIcon, 
  Heart, 
  Menu, 
  Grid, 
  List, 
  Check 
} from 'lucide-react';
import styles from '../../pages/editor/EditorLayout.module.css';

interface PageRendererProps {
  page: PageData;
  overrideDevice?: string;
}

export const PageRenderer: React.FC<PageRendererProps> = ({ page, overrideDevice }) => {
  if (!page || !page.sections) {
    return null;
  }

  const { 
    selectedSectionId, 
    setSelectedSectionId, 
    setAddSectionWidgetOpen, 
    setInsertIndex, 
    activePanel 
  } = useLandingEditorStore();
  const storeDevice = useLandingEditorStore(state => state.device);
  const device = overrideDevice || storeDevice;
  const { theme } = useSiteStore();
  const settings = useSiteStore(state => state.settings) || {};

  const defaultTheme = getDefaultTheme();
  const safeTheme = theme || defaultTheme;
  const p = safeTheme.palette || defaultTheme.palette;
  const t = safeTheme.typography || defaultTheme.typography;
  const b = safeTheme.buttons || defaultTheme.buttons;
  const e = safeTheme.effects || defaultTheme.effects;
  const stylesObj = t.styles || defaultTheme.typography.styles;

  const themeStyles = useMemo(() => `
    .preview-theme-wrapper {
      /* Palette: Brand */
      --theme-brand-primary: ${p.brand?.primary || safeTheme.colors?.primary || defaultTheme.palette.brand.primary};
      --theme-brand-secondary: ${p.brand?.secondary || safeTheme.colors?.secondary || defaultTheme.palette.brand.secondary};
      --theme-brand-accent: ${p.brand?.accent || safeTheme.colors?.accent || defaultTheme.palette.brand.accent};
      --theme-brand-link: ${p.brand?.link || safeTheme.colors?.primary || defaultTheme.palette.brand.link};

      /* Palette: Background */
      --theme-bg-background: ${p.background?.background || safeTheme.colors?.background || defaultTheme.palette.background.background};
      --theme-bg-surface: ${p.background?.surface || defaultTheme.palette.background.surface};
      --theme-bg-section: ${p.background?.sectionBg || defaultTheme.palette.background.sectionBg};
      --theme-bg-container: ${p.background?.containerBg || defaultTheme.palette.background.containerBg};

      /* Palette: Footer */
      --theme-footer-bg: ${p.background?.footerBg || (safeTheme.presetName === 'Luxury' ? '#08080c' : safeTheme.presetName === 'Ocean' ? '#082f49' : safeTheme.presetName === 'Warm' ? '#1c1917' : safeTheme.presetName === 'Minimal' ? '#18181b' : '#0f172a')};
      --theme-footer-text: ${p.text?.footerText || (safeTheme.presetName === 'Luxury' ? '#f8f6f0' : safeTheme.presetName === 'Warm' ? '#fafaf9' : safeTheme.presetName === 'Ocean' ? '#f0f9ff' : '#ffffff')};
      --theme-footer-muted: ${p.text?.footerMuted || '#94a3b8'};
      --theme-footer-border: ${p.border?.footerBorder || 'rgba(255, 255, 255, 0.12)'};

      /* Palette: Text */
      --theme-text-heading: ${p.text?.heading || safeTheme.colors?.text || defaultTheme.palette.text.heading};
      --theme-text-subheading: ${p.text?.subheading || defaultTheme.palette.text.subheading};
      --theme-text-body: ${p.text?.body || safeTheme.colors?.text || defaultTheme.palette.text.body};
      --theme-text-muted: ${p.text?.muted || defaultTheme.palette.text.muted};
      --theme-text-inverse: ${p.text?.inverse || defaultTheme.palette.text.inverse};

      /* Palette: Border */
      --theme-border-border: ${p.border?.border || safeTheme.colors?.border || defaultTheme.palette.border.border};
      --theme-border-divider: ${p.border?.divider || defaultTheme.palette.border.divider};

      /* Palette: States */
      --theme-state-success: ${p.states?.success || defaultTheme.palette.states.success};
      --theme-state-warning: ${p.states?.warning || defaultTheme.palette.states.warning};
      --theme-state-error: ${p.states?.error || defaultTheme.palette.states.error};
      --theme-state-info: ${p.states?.info || defaultTheme.palette.states.info};

      /* Typography Tokens */
      --theme-font-heading: ${t.headingFont || defaultTheme.typography.headingFont};
      --theme-font-body: ${t.bodyFont || defaultTheme.typography.bodyFont};
      --theme-font-button: ${t.buttonFont || t.bodyFont || defaultTheme.typography.buttonFont};
      --theme-font-accent: ${t.accentFont || t.headingFont || defaultTheme.typography.accentFont};
      --theme-base-size: ${t.baseSize ?? defaultTheme.typography.baseSize}px;

      /* Button Tokens */
      --theme-btn-primary-bg: ${b.primary?.bg || defaultTheme.buttons.primary.bg};
      --theme-btn-primary-text: ${b.primary?.text || defaultTheme.buttons.primary.text};
      --theme-btn-primary-border: ${b.primary?.border || defaultTheme.buttons.primary.border};
      --theme-btn-primary-radius: ${b.primary?.borderRadius || defaultTheme.buttons.primary.borderRadius};
      --theme-btn-primary-weight: ${b.primary?.fontWeight ?? defaultTheme.buttons.primary.fontWeight};

      --theme-btn-secondary-bg: ${b.secondary?.bg || defaultTheme.buttons.secondary.bg};
      --theme-btn-secondary-text: ${b.secondary?.text || defaultTheme.buttons.secondary.text};
      --theme-btn-secondary-border: ${b.secondary?.border || defaultTheme.buttons.secondary.border};
      --theme-btn-secondary-radius: ${b.secondary?.borderRadius || defaultTheme.buttons.secondary.borderRadius};

      /* Effects */
      --theme-radius: ${e.borderRadius || safeTheme.ui?.borderRadius || defaultTheme.effects.borderRadius};
      --theme-shadow: ${e.shadow || safeTheme.ui?.shadow || defaultTheme.effects.shadow};
      --theme-transition: ${e.transition || defaultTheme.effects.transition};

      /* Legacy compatibility aliases */
      --theme-primary: var(--theme-brand-primary);
      --theme-secondary: var(--theme-brand-secondary);
      --theme-background: var(--theme-bg-background);
      --theme-text: var(--theme-text-body);
      --theme-accent: var(--theme-brand-accent);
      --theme-border: var(--theme-border-border);
      --theme-max-width: ${safeTheme.layout?.maxWidth ?? defaultTheme.layout.maxWidth}px;

      font-family: var(--theme-font-body);
      font-size: var(--theme-base-size);
      color: var(--theme-text-body);
      background-color: var(--theme-bg-background);
    }
    
    .preview-theme-wrapper h1 {
      font-family: var(--theme-font-heading);
      font-size: ${stylesObj.h1?.fontSize ?? 44}px;
      font-weight: ${stylesObj.h1?.fontWeight ?? 700};
      line-height: ${stylesObj.h1?.lineHeight ?? 1.15};
      letter-spacing: ${stylesObj.h1?.letterSpacing ?? -1}px;
      color: var(--theme-text-heading);
    }
    .preview-theme-wrapper h2 {
      font-family: var(--theme-font-heading);
      font-size: ${stylesObj.h2?.fontSize ?? 34}px;
      font-weight: ${stylesObj.h2?.fontWeight ?? 700};
      line-height: ${stylesObj.h2?.lineHeight ?? 1.2};
      letter-spacing: ${stylesObj.h2?.letterSpacing ?? -0.5}px;
      color: var(--theme-text-heading);
    }
    .preview-theme-wrapper h3 {
      font-family: var(--theme-font-heading);
      font-size: ${stylesObj.h3?.fontSize ?? 26}px;
      font-weight: ${stylesObj.h3?.fontWeight ?? 600};
      line-height: ${stylesObj.h3?.lineHeight ?? 1.25};
      letter-spacing: ${stylesObj.h3?.letterSpacing ?? -0.3}px;
      color: var(--theme-text-heading);
    }
    .preview-theme-wrapper h4 {
      font-family: var(--theme-font-heading);
      font-size: ${stylesObj.h4?.fontSize ?? 20}px;
      font-weight: ${stylesObj.h4?.fontWeight ?? 600};
      line-height: ${stylesObj.h4?.lineHeight ?? 1.3};
      letter-spacing: ${stylesObj.h4?.letterSpacing ?? 0}px;
      color: var(--theme-text-heading);
    }
    .preview-theme-wrapper p {
      color: var(--theme-text-body);
      line-height: ${stylesObj.body?.lineHeight ?? 1.6};
    }
  `, [p, t, b, e, stylesObj, safeTheme, defaultTheme]);

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isSectionHidden = (section: any) => {
    if (!section || section.isHidden) return true;
    if (section.props?.visibility) {
      if (device === 'desktop' && section.props.visibility.desktop === false) return true;
      if (device === 'tablet' && section.props.visibility.tablet === false) return true;
      if (device === 'mobile' && section.props.visibility.mobile === false) return true;
    }
    return false;
  };

  useEffect(() => {
    if (selectedSectionId && sectionRefs.current[selectedSectionId]) {
      sectionRefs.current[selectedSectionId]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedSectionId, overrideDevice, device]);

  const headerSection = (page.sections || []).find(s => s && s.type === 'Header');
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

  const headerTypes = ['AnnouncementBar', 'UtilityBar', 'Header'];
  const footerTypes = ['FooterMenu', 'FooterText', 'Footer'];

  const validSections = (page.sections || []).filter(Boolean);
  const headerSections = validSections.filter(s => headerTypes.includes(s.type));
  const bodySections = validSections.filter(s => !headerTypes.includes(s.type) && !footerTypes.includes(s.type));
  const footerSections = validSections.filter(s => footerTypes.includes(s.type));

  const orderedSections = [...headerSections, ...bodySections, ...footerSections];

  const isEditable = activePanel === 'editor';
  
  return (
    <div 
      className={`${styles.previewPage} preview-theme-wrapper`}
      style={{ paddingBottom: (device === 'mobile' && hasHeader && showBottomNav && bottomNavLinks.length > 0) ? '80px' : '0' }}
    >
      <style>{themeStyles}</style>
      {safeTheme.customCss ? (
        <style id="custom-theme-css" dangerouslySetInnerHTML={{ __html: safeTheme.customCss }} />
      ) : null}
      {orderedSections.map((section, index) => {
        if (isSectionHidden(section)) return null;

        const storeIndex = page.sections.findIndex(s => s && s.id === section.id);
        const isHeaderOrFooter = headerTypes.includes(section.type) || footerTypes.includes(section.type);

        return (
          <div 
            key={section.id || `${section.type}-${index}`} 
            ref={(el) => { 
              if (section?.id) {
                sectionRefs.current[section.id] = el; 
              }
            }}
            className={`${isEditable ? styles.previewSectionWrapper : ''} ${isEditable && selectedSectionId === section.id ? styles.activeSectionBorder : ''}`}
            onClick={() => isEditable && setSelectedSectionId(section.id)}
            style={section.type === 'Header' && section.props?.sticky !== false ? { position: 'sticky', top: 0, zIndex: 200 } : undefined}
          >
            {isEditable && storeIndex !== -1 && !isHeaderOrFooter && (
              <button 
                type="button"
                className={`${styles.hoverAddBtn} ${styles.hoverAddBtnTop}`}
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setInsertIndex(storeIndex); 
                  setAddSectionWidgetOpen(true); 
                }}
                title="Add section above"
                aria-label="Add section above"
              >
                <Plus size={14} />
              </button>
            )}
            {isEditable && selectedSectionId === section.id && (
              <div className={styles.sectionLabel}>
                <span>{section.name}</span>
                <div className={styles.sectionQuickActions}>
                  <button 
                    type="button"
                    style={{ background: 'none', border: 'none', padding: 0, color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      useLandingEditorStore.getState().setRightSidebarOpen(true);
                    }}
                    title="Section Settings"
                    aria-label="Section Settings"
                  >
                    <Settings size={12} />
                  </button>
                  <button 
                    type="button"
                    style={{ background: 'none', border: 'none', padding: 0, color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      useSiteStore.getState().duplicateSection(page.id, section.id);
                    }}
                    title="Duplicate Section"
                    aria-label="Duplicate Section"
                  >
                    <Copy size={12} />
                  </button>
                  {!isHeaderOrFooter && (
                    <button 
                      type="button"
                      style={{ background: 'none', border: 'none', padding: 0, color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (selectedSectionId === section.id) {
                          setSelectedSectionId(null);
                        }
                        useSiteStore.getState().removeSection(page.id, section.id);
                      }}
                      title="Delete Section"
                      aria-label="Delete Section"
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
                type="button"
                className={`${styles.hoverAddBtn} ${styles.hoverAddBtnBottom}`}
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setInsertIndex(storeIndex + 1); 
                  setAddSectionWidgetOpen(true); 
                }}
                title="Add section below"
                aria-label="Add section below"
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
            const Icon = (item?.icon && IconMap[item.icon]) ? IconMap[item.icon] : Home;
            return (
              <a 
                key={item.id || item.text || Math.random()} 
                href={item.link || '#'} 
                onClick={(e) => e.preventDefault()}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  textDecoration: 'none',
                  color: 'var(--theme-text)',
                  opacity: 0.7,
                  flex: 1,
                }}
              >
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
