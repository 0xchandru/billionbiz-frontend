import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { Search, Plus, Settings, LayoutTemplate, Palette, Share, Globe, Smartphone, Files, ChevronDown, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

import { useLandingEditorStore } from '../../store/landingEditorStore';
import { useSiteStore } from '../../store/siteStore';
import { getCategoryDisplayName, getPageConfig } from './pageConfigs';
import { SortableItem } from './SortableItem';
import { Home } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ThemeSecondaryNav } from './theme/ThemeSecondaryNav';
import styles from '../../pages/editor/EditorLayout.module.css';

export const EditorLeftSidebar: React.FC = () => {
  const navigate = useNavigate();
  const { 
    activePanel: activeTab, setActivePanel: setActiveTab, selectedSectionId, setSelectedSectionId, 
    activeSettingItem, setActiveSettingItem,
    setAddSectionWidgetOpen, selectedPageId, setSelectedPageId,
    isLeftSidebarCollapsed, setLeftSidebarCollapsed, lastPagesMemory
  } = useLandingEditorStore();
  const { pages, toggleSectionVisibility, removeSection, updatePageProps } = useSiteStore();
  const activePage = pages.find(p => p.id === selectedPageId) || pages[0];

  const headerBarTypes = ['AnnouncementBar', 'UtilityBar'];
  const footerBarTypes = ['FooterMenu', 'FooterText'];

  // Cleanup duplicate locked sections and guarantee canonical page section ordering:
  // [AnnouncementBar?, UtilityBar?, Header, ...TemplateSections, FooterMenu?, FooterText?, Footer]
  React.useEffect(() => {
    if (activePage && activePage.sections) {
      const seen = new Set<string>();
      const deduplicated = activePage.sections.filter(s => {
        if (s.type === 'Header' || s.type === 'Footer') {
          if (seen.has(s.type)) return false;
          seen.add(s.type);
        }
        return true;
      });

      const headerBars = deduplicated.filter(s => headerBarTypes.includes(s.type));
      const header = deduplicated.find(s => s.type === 'Header');
      const templateSections = deduplicated.filter(
        s => !headerBarTypes.includes(s.type) &&
             s.type !== 'Header' &&
             !footerBarTypes.includes(s.type) &&
             s.type !== 'Footer'
      );
      const footerBars = deduplicated.filter(s => footerBarTypes.includes(s.type));
      const footer = deduplicated.find(s => s.type === 'Footer');

      const canonical = [
        ...headerBars,
        ...(header ? [header] : []),
        ...templateSections,
        ...footerBars,
        ...(footer ? [footer] : []),
      ];

      const isChanged = 
        canonical.length !== activePage.sections.length ||
        canonical.some((s, i) => s.id !== activePage.sections[i]?.id);

      if (isChanged) {
        updatePageProps(activePage.id, { sections: canonical });
      }
    }
  }, [activePage?.id, activePage?.sections, updatePageProps]);

  const [sectionToDelete, setSectionToDelete] = React.useState<string | null>(null);
  
  const [headerAddOpen, setHeaderAddOpen] = React.useState(false);
  const [footerAddOpen, setFooterAddOpen] = React.useState(false);
  const [collapsedCategories, setCollapsedCategories] = React.useState<Record<string, boolean>>({});
  const [isHovered, setIsHovered] = React.useState(false);
  
  const headerAddRef = React.useRef<HTMLDivElement>(null);
  const footerAddRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerAddRef.current && !headerAddRef.current.contains(event.target as Node)) {
        setHeaderAddOpen(false);
      }
      if (footerAddRef.current && !footerAddRef.current.contains(event.target as Node)) {
        setFooterAddOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Ensure the category containing selectedPageId is uncollapsed
  React.useEffect(() => {
    if (activePage && activePage.category && collapsedCategories[activePage.category]) {
      setCollapsedCategories(prev => ({ ...prev, [activePage.category]: false }));
    }
  }, [activePage?.category, selectedPageId, collapsedCategories]);

  React.useEffect(() => {
    if (activeTab === 'pages') {
      if ((!selectedPageId || selectedPageId === 'landing-page') && pages.length > 0) {
        const firstNonLandingPage = pages.find(p => p.id !== 'landing-page');
        if (firstNonLandingPage) {
          setSelectedPageId(firstNonLandingPage.id);
        }
      }
      
      const timer = setTimeout(() => {
        const activeElement = document.querySelector(`.${styles.activePageItem}`);
        if (activeElement) {
          activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [activeTab, selectedPageId, pages, setSelectedPageId]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const moveHeaderBar = (sectionId: string, direction: 'up' | 'down') => {
    if (!activePage) return;
    const currentBars = activePage.sections.filter(s => headerBarTypes.includes(s.type));
    const idx = currentBars.findIndex(s => s.id === sectionId);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= currentBars.length) return;

    const reordered = [...currentBars];
    const [removed] = reordered.splice(idx, 1);
    reordered.splice(targetIdx, 0, removed);

    const header = activePage.sections.find(s => s.type === 'Header');
    const rest = activePage.sections.filter(s => !headerBarTypes.includes(s.type) && s.type !== 'Header');
    updatePageProps(activePage.id, { sections: [...reordered, ...(header ? [header] : []), ...rest] });
  };

  const moveFooterBar = (sectionId: string, direction: 'up' | 'down') => {
    if (!activePage) return;
    const currentBars = activePage.sections.filter(s => footerBarTypes.includes(s.type));
    const idx = currentBars.findIndex(s => s.id === sectionId);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= currentBars.length) return;

    const reordered = [...currentBars];
    const [removed] = reordered.splice(idx, 1);
    reordered.splice(targetIdx, 0, removed);

    const nonFooter = activePage.sections.filter(s => !footerBarTypes.includes(s.type) && s.type !== 'Footer');
    const footer = activePage.sections.find(s => s.type === 'Footer');
    updatePageProps(activePage.id, { sections: [...nonFooter, ...reordered, ...(footer ? [footer] : [])] });
  };

  const moveTemplateSection = (sectionId: string, direction: 'up' | 'down') => {
    if (!activePage) return;
    const currentTemplate = activePage.sections.filter(
      s => !headerBarTypes.includes(s.type) && s.type !== 'Header' && !footerBarTypes.includes(s.type) && s.type !== 'Footer'
    );
    const idx = currentTemplate.findIndex(s => s.id === sectionId);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= currentTemplate.length) return;

    const reordered = [...currentTemplate];
    const [removed] = reordered.splice(idx, 1);
    reordered.splice(targetIdx, 0, removed);

    const headers = activePage.sections.filter(s => headerBarTypes.includes(s.type) || s.type === 'Header');
    const footers = activePage.sections.filter(s => footerBarTypes.includes(s.type) || s.type === 'Footer');
    updatePageProps(activePage.id, { sections: [...headers, ...reordered, ...footers] });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !activePage) return;

    const sections = [...activePage.sections];
    const activeSection = sections.find(s => s.id === active.id);
    const overSection = sections.find(s => s.id === over.id);
    if (!activeSection || !overSection) return;

    // Disallow dragging locked Header or Footer
    if (activeSection.type === 'Header' || activeSection.type === 'Footer') return;

    const isHeaderBar = headerBarTypes.includes(activeSection.type);
    const isFooterBar = footerBarTypes.includes(activeSection.type);
    const isTemplate = !isHeaderBar && !isFooterBar;

    // --- Case 1: Dragging within Header group ---
    if (isHeaderBar) {
      const currentBars = sections.filter(s => headerBarTypes.includes(s.type));
      const oldBarIndex = currentBars.findIndex(s => s.id === active.id);
      let newBarIndex = currentBars.findIndex(s => s.id === over.id);

      if (overSection.type === 'Header' || newBarIndex === -1) {
        // Dragged onto or past Header -> place as the last header bar (right above Header)
        newBarIndex = currentBars.length - 1;
      }

      if (oldBarIndex !== -1 && newBarIndex !== -1 && oldBarIndex !== newBarIndex) {
        const reordered = Array.from(currentBars);
        const [removed] = reordered.splice(oldBarIndex, 1);
        reordered.splice(newBarIndex, 0, removed);

        const header = sections.find(s => s.type === 'Header');
        const otherSections = sections.filter(s => !headerBarTypes.includes(s.type) && s.type !== 'Header');

        const updated = [...reordered, ...(header ? [header] : []), ...otherSections];
        updatePageProps(activePage.id, { sections: updated });
      }
      return;
    }

    // --- Case 2: Dragging within Footer group ---
    if (isFooterBar) {
      const currentBars = sections.filter(s => footerBarTypes.includes(s.type));
      const oldBarIndex = currentBars.findIndex(s => s.id === active.id);
      let newBarIndex = currentBars.findIndex(s => s.id === over.id);

      if (overSection.type === 'Footer' || newBarIndex === -1) {
        // Dragged onto or past Footer -> place as the last footer bar (right above Footer)
        newBarIndex = currentBars.length - 1;
      }

      if (oldBarIndex !== -1 && newBarIndex !== -1 && oldBarIndex !== newBarIndex) {
        const reordered = Array.from(currentBars);
        const [removed] = reordered.splice(oldBarIndex, 1);
        reordered.splice(newBarIndex, 0, removed);

        const nonFooterSections = sections.filter(s => !footerBarTypes.includes(s.type) && s.type !== 'Footer');
        const footer = sections.find(s => s.type === 'Footer');

        const updated = [...nonFooterSections, ...reordered, ...(footer ? [footer] : [])];
        updatePageProps(activePage.id, { sections: updated });
      }
      return;
    }

    // --- Case 3: Dragging within Template group ---
    if (isTemplate) {
      const currentTemplate = sections.filter(
        s => !headerBarTypes.includes(s.type) && s.type !== 'Header' && !footerBarTypes.includes(s.type) && s.type !== 'Footer'
      );
      const oldTemplateIndex = currentTemplate.findIndex(s => s.id === active.id);
      let newTemplateIndex = currentTemplate.findIndex(s => s.id === over.id);

      if (headerBarTypes.includes(overSection.type) || overSection.type === 'Header') {
        newTemplateIndex = 0;
      } else if (footerBarTypes.includes(overSection.type) || overSection.type === 'Footer') {
        newTemplateIndex = currentTemplate.length - 1;
      }

      if (oldTemplateIndex !== -1 && newTemplateIndex !== -1 && oldTemplateIndex !== newTemplateIndex) {
        const reordered = Array.from(currentTemplate);
        const [removed] = reordered.splice(oldTemplateIndex, 1);
        reordered.splice(newTemplateIndex, 0, removed);

        const headerSections = sections.filter(s => headerBarTypes.includes(s.type) || s.type === 'Header');
        const footerSections = sections.filter(s => footerBarTypes.includes(s.type) || s.type === 'Footer');

        const updated = [...headerSections, ...reordered, ...footerSections];
        updatePageProps(activePage.id, { sections: updated });
      }
      return;
    }
  };

  const handleAddHeaderItem = (type: string) => {
    if (!activePage) return;
    const insertIndex = activePage.sections.findIndex(s => s.type === 'Header');
    useSiteStore.getState().addSection(activePage.id, type, insertIndex);
    setHeaderAddOpen(false);
  };

  const handleAddFooterItem = (type: string) => {
    if (!activePage) return;
    const insertIndex = activePage.sections.findIndex(s => s.type === 'Footer');
    useSiteStore.getState().addSection(activePage.id, type, insertIndex !== -1 ? insertIndex : undefined);
    setFooterAddOpen(false);
  };

  const sidebarContent = (
    <>
      {/* Primary Tabs */}
      <div className={styles.panelTabs}>
        <button 
          className={`${styles.panelTab} ${activeTab === 'editor' ? styles.activeTab : ''}`} 
          onClick={() => {
            setActiveTab('editor');
            setSelectedPageId('landing-page');
            navigate('/editor', { replace: true });
          }}
        >
          <LayoutTemplate size={20} />
          Editor
        </button>
        <button 
          className={`${styles.panelTab} ${activeTab === 'pages' ? styles.activeTab : ''}`} 
          onClick={() => {
            setActiveTab('pages');
            const targetId = (lastPagesMemory?.selectedPageId && lastPagesMemory.selectedPageId !== 'landing-page') 
              ? lastPagesMemory.selectedPageId 
              : ((selectedPageId && selectedPageId !== 'landing-page') ? selectedPageId : 'shop-page');
            navigate(`/editor/pages?pageId=${targetId}`, { replace: true });
          }}
        >
          <Files size={20} />
          Pages
        </button>

        <button 
          className={`${styles.panelTab} ${activeTab === 'theme' ? styles.activeTab : ''}`} 
          onClick={() => {
            setActiveTab('theme');
            setSelectedPageId('landing-page');
            navigate('/editor/theme', { replace: true });
          }}
        >
          <Palette size={20} />
          Theme
        </button>
        <button 
          className={`${styles.panelTab} ${activeTab === 'settings' ? styles.activeTab : ''}`} 
          onClick={() => {
            setActiveTab('settings');
            navigate('/editor/settings', { replace: true });
          }}
        >
          <Settings size={20} />
          Settings
        </button>
      </div>

      <div className={styles.panelContent} style={{ padding: 0, overflowY: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'pages' ? (
          <div className={styles.pagesSidebar} style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div className={styles.settingsList} style={{ padding: '0', flex: 1, overflowY: 'auto' }}>
              <div className={styles.sectionHeaderCol} style={{ padding: '20px 16px 8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '4px' }}>
                  <h3 className={styles.fw600} style={{ margin: 0, fontSize: '15px' }}>Pages</h3>
                  <button onClick={() => setLeftSidebarCollapsed(!isLeftSidebarCollapsed)} style={{ 
                    background: isLeftSidebarCollapsed ? 'var(--primary-light)' : 'transparent', 
                    border: 'none', cursor: 'pointer', 
                    color: isLeftSidebarCollapsed ? 'var(--primary)' : 'var(--text-muted)', 
                    display: 'flex', alignItems: 'center', padding: '4px', borderRadius: '4px', transition: 'all 0.2s' 
                  }}>
                    {isLeftSidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
                  </button>
                </div>
                <p className={styles.labelSm} style={{ margin: 0, color: 'var(--text-muted)' }}>Manage your website pages</p>
              </div>
              <div style={{ padding: '0 12px 16px' }}>
                {(() => {
                  const groupedPages = pages.reduce((acc, page) => {
                    if (page.id === 'landing-page') return acc;
                    if (!acc[page.category]) acc[page.category] = [];
                    acc[page.category].push(page);
                    return acc;
                  }, {} as Record<string, typeof pages>);

                  return Object.entries(groupedPages).map(([category, categoryPages]) => {
                    if (categoryPages.length === 0) return null;
                    const isCollapsed = collapsedCategories[category];
                return (
                  <div key={category} className={styles.categoryGroup} style={{ marginBottom: '16px' }}>
                    <div 
                      className={styles.categoryTitle} 
                      onClick={() => setCollapsedCategories(prev => ({ ...prev, [category]: !prev[category] }))}
                      style={{ 
                        fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', 
                        letterSpacing: '0.5px', marginBottom: isCollapsed ? '0' : '8px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        cursor: 'pointer', padding: '8px 8px'
                      }}
                    >
                      {getCategoryDisplayName(category as any)}
                      {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                    </div>
                    {!isCollapsed && categoryPages.map(page => {
                      const pageId = page.id;
                      const isSelected = pageId === selectedPageId;
                      const Icon = page.type === 'landing' ? Home : (getPageConfig(page.type)?.icon || Settings);
                      return (
                        <div 
                          key={pageId} 
                          className={`${styles.pageItem} ${isSelected ? styles.activePageItem : ''}`}
                          onClick={() => {
                            setSelectedPageId(pageId);
                            useLandingEditorStore.setState({ isRightSidebarOpen: true });
                            navigate(`/editor/pages?pageId=${pageId}`, { replace: true });
                          }}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '12px', padding: '10px 12px',
                            marginBottom: '2px', width: '100%', boxSizing: 'border-box'
                          }}
                        >
                          <div style={{
                            width: '32px', height: '32px', borderRadius: '6px',
                            backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-muted)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: isSelected ? 'var(--primary)' : 'var(--text-muted)',
                            flexShrink: 0
                          }}>
                            <Icon size={16} />
                          </div>
                          <div style={{ textAlign: 'left', flex: 1, overflow: 'hidden' }}>
                            <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: isSelected ? 'var(--primary)' : 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{page.name}</h4>
                            <p style={{ margin: 0, fontSize: '11px', color: isSelected ? 'var(--primary)' : 'var(--text-muted)', opacity: isSelected ? 0.8 : 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{page.path}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              });
              })()}
              </div>
            </div>
          </div>
        ) : activeTab === 'settings' ? (
          <div className={styles.settingsSidebar} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div className={styles.sectionHeaderCol} style={{ padding: '20px 16px 16px' }}>
              <h3 className={styles.fw600} style={{ margin: 0, marginBottom: '4px' }}>Global Settings</h3>
              <p className={styles.labelSm} style={{ margin: 0, color: 'var(--text-muted)' }}>Manage your site configuration</p>
            </div>
            <div className={styles.settingsList} style={{ padding: '0 16px 16px' }}>
              {[
                { id: 'General', icon: LayoutTemplate, title: 'General', desc: 'Site info, logo, & contact' },
                { id: 'SEO & Geo', icon: Search, title: 'SEO & Geo', desc: 'SEO, structured data, sitemap & OG image' },
                { id: 'Social media', icon: Share, title: 'Social media', desc: 'Social links and share settings' },
                { id: 'Header & Footer', icon: LayoutTemplate, title: 'Header & Footer', desc: 'Manage header and footer content' },
                { id: 'Mobile Apps', icon: Smartphone, title: 'Mobile Apps', desc: 'Configure mobile bottom navigation' },
                { id: 'Language', icon: Globe, title: 'Language', desc: 'Default language and region' }
              ].map((item, i) => (
                <div 
                  key={i} 
                  className={`${styles.settingItem} ${activeSettingItem === item.id ? styles.settingItemActive : ''}`}
                  onClick={() => setActiveSettingItem(item.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <item.icon size={18} className={activeSettingItem === item.id ? styles.siIconActive : styles.siIcon} />
                  <div className={styles.siContent}>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'theme' ? (
          <ThemeSecondaryNav />
        ) : (
          <div className={styles.sectionsSidebar} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '0' }} className={styles.innerScroll}>
              <div className={styles.sectionHeaderCol} style={{ padding: '20px 16px 8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '4px' }}>
                  <h3 className={styles.fw600} style={{ margin: 0, fontSize: '15px' }}>{activePage?.name || 'Home page'}</h3>
                  <button onClick={() => setLeftSidebarCollapsed(!isLeftSidebarCollapsed)} style={{ 
                    background: isLeftSidebarCollapsed ? 'var(--primary-light)' : 'transparent', 
                    border: 'none', cursor: 'pointer', 
                    color: isLeftSidebarCollapsed ? 'var(--primary)' : 'var(--text-muted)', 
                    display: 'flex', alignItems: 'center', padding: '4px', borderRadius: '4px', transition: 'all 0.2s' 
                  }}>
                    {isLeftSidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
                  </button>
                </div>
                <p className={styles.labelSm} style={{ margin: 0, color: 'var(--text-muted)' }}>Manage your page structure</p>
              </div>
              <div className={styles.sectionsList} style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '0 16px 16px' }}>
                  {activePage && (() => {
                    const headerSections = activePage.sections.filter(s => headerBarTypes.includes(s.type) || s.type === 'Header');
                    const headerBars = activePage.sections.filter(s => headerBarTypes.includes(s.type));
                    const templateSections = activePage.sections.filter(s => !headerBarTypes.includes(s.type) && s.type !== 'Header' && !footerBarTypes.includes(s.type) && s.type !== 'Footer');
                    const footerSections = activePage.sections.filter(s => footerBarTypes.includes(s.type) || s.type === 'Footer');
                    const footerBars = activePage.sections.filter(s => footerBarTypes.includes(s.type));

                    return (
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        modifiers={[restrictToVerticalAxis]}
                      >
                        <div className={styles.sectionGroup}>
                          <div className={styles.sectionCategoryHeader}>
                            <span>Header</span>
                            <div style={{ position: 'relative' }} ref={headerAddRef}>
                              <button 
                                className={styles.miniAddBtn}
                                disabled={activePage.sections.some(s => s.type === 'AnnouncementBar') && activePage.sections.some(s => s.type === 'UtilityBar')}
                                onClick={() => setHeaderAddOpen(!headerAddOpen)}
                                title="Add header block"
                                style={{ display: 'flex', gap: '4px', fontSize: '11px', padding: '4px 8px' }}
                              >
                                <Plus size={12} /> Add
                              </button>
                              {headerAddOpen && (
                                <div className={styles.dropdownMenu} style={{ top: '100%', right: 0 }}>
                                  <button 
                                    className={styles.dropdownItem} 
                                    disabled={activePage.sections.some(s => s.type === 'AnnouncementBar')}
                                    style={{ 
                                      opacity: activePage.sections.some(s => s.type === 'AnnouncementBar') ? 0.5 : 1, 
                                      cursor: activePage.sections.some(s => s.type === 'AnnouncementBar') ? 'not-allowed' : 'pointer' 
                                    }}
                                    onClick={() => !activePage.sections.some(s => s.type === 'AnnouncementBar') && handleAddHeaderItem('AnnouncementBar')}
                                  >
                                    Announcement Bar
                                  </button>
                                  <button 
                                    className={styles.dropdownItem} 
                                    disabled={activePage.sections.some(s => s.type === 'UtilityBar')}
                                    style={{ 
                                      opacity: activePage.sections.some(s => s.type === 'UtilityBar') ? 0.5 : 1, 
                                      cursor: activePage.sections.some(s => s.type === 'UtilityBar') ? 'not-allowed' : 'pointer' 
                                    }}
                                    onClick={() => !activePage.sections.some(s => s.type === 'UtilityBar') && handleAddHeaderItem('UtilityBar')}
                                  >
                                    Utility Bar
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          <SortableContext
                            items={headerSections.map(s => s.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {headerSections.map(section => {
                              const isHeaderBar = headerBarTypes.includes(section.type);
                              const barIdx = isHeaderBar ? headerBars.findIndex(s => s.id === section.id) : -1;
                              return (
                                <SortableItem
                                  key={section.id}
                                  id={section.id}
                                  section={section}
                                  isSelected={selectedSectionId === section.id}
                                  onSelect={() => setSelectedSectionId(section.id)}
                                  onToggleVisibility={(e) => { e.stopPropagation(); toggleSectionVisibility(activePage.id, section.id); }}
                                  onRemove={(e) => { e.stopPropagation(); setSectionToDelete(section.id); }}
                                  onMoveUp={isHeaderBar && barIdx > 0 ? () => moveHeaderBar(section.id, 'up') : undefined}
                                  onMoveDown={isHeaderBar && barIdx !== -1 && barIdx < headerBars.length - 1 ? () => moveHeaderBar(section.id, 'down') : undefined}
                                />
                              );
                            })}
                          </SortableContext>
                        </div>

                        <div className={styles.sectionGroup}>
                          <div className={styles.sectionCategoryHeader}>Template</div>
                          <SortableContext
                            items={templateSections.map(s => s.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {templateSections.map((section, idx) => {
                              const storeIndex = activePage.sections.findIndex(s => s.id === section.id);
                              return (
                                <SortableItem
                                  key={section.id}
                                  id={section.id}
                                  section={section}
                                  isSelected={selectedSectionId === section.id}
                                  onSelect={() => setSelectedSectionId(section.id)}
                                  onToggleVisibility={(e) => { e.stopPropagation(); toggleSectionVisibility(activePage.id, section.id); }}
                                  onRemove={(e) => { e.stopPropagation(); setSectionToDelete(section.id); }}
                                  onInsertClick={() => {
                                    useLandingEditorStore.getState().setInsertIndex(storeIndex + 1);
                                    setAddSectionWidgetOpen(true);
                                  }}
                                  onMoveUp={idx > 0 ? () => moveTemplateSection(section.id, 'up') : undefined}
                                  onMoveDown={idx < templateSections.length - 1 ? () => moveTemplateSection(section.id, 'down') : undefined}
                                />
                              );
                            })}
                          </SortableContext>
                          <button 
                            className={styles.groupAddBtn} 
                            onClick={() => {
                              const firstFooterIndex = activePage.sections.findIndex(s => ['FooterMenu', 'FooterText', 'Footer'].includes(s.type));
                              useLandingEditorStore.getState().setInsertIndex(firstFooterIndex !== -1 ? firstFooterIndex : null);
                              setAddSectionWidgetOpen(true);
                            }}
                          >
                            <Plus size={14} /> Add section
                          </button>
                        </div>

                        <div className={styles.sectionGroup}>
                          <div className={styles.sectionCategoryHeader}>
                            <span>Footer</span>
                            <div style={{ position: 'relative' }} ref={footerAddRef}>
                              <button 
                                className={styles.miniAddBtn}
                                onClick={() => setFooterAddOpen(!footerAddOpen)}
                                title="Add footer block"
                                style={{ display: 'flex', gap: '4px', fontSize: '11px', padding: '4px 8px' }}
                              >
                                <Plus size={12} /> Add
                              </button>
                              {footerAddOpen && (
                                <div className={styles.dropdownMenu} style={{ bottom: '100%', right: 0, top: 'auto', marginBottom: '4px', marginTop: 0 }}>
                                  <button 
                                    className={styles.dropdownItem} 
                                    disabled={activePage.sections.some(s => s.type === 'FooterMenu')}
                                    style={{ 
                                      opacity: activePage.sections.some(s => s.type === 'FooterMenu') ? 0.5 : 1, 
                                      cursor: activePage.sections.some(s => s.type === 'FooterMenu') ? 'not-allowed' : 'pointer' 
                                    }}
                                    onClick={() => !activePage.sections.some(s => s.type === 'FooterMenu') && handleAddFooterItem('FooterMenu')}
                                  >
                                    Footer Menu
                                  </button>
                                  <button 
                                    className={styles.dropdownItem} 
                                    disabled={activePage.sections.some(s => s.type === 'FooterText')}
                                    style={{ 
                                      opacity: activePage.sections.some(s => s.type === 'FooterText') ? 0.5 : 1, 
                                      cursor: activePage.sections.some(s => s.type === 'FooterText') ? 'not-allowed' : 'pointer' 
                                    }}
                                    onClick={() => !activePage.sections.some(s => s.type === 'FooterText') && handleAddFooterItem('FooterText')}
                                  >
                                    Footer Text
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          <SortableContext
                            items={footerSections.map(s => s.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {footerSections.map(section => {
                              const isFooterBar = footerBarTypes.includes(section.type);
                              const barIdx = isFooterBar ? footerBars.findIndex(s => s.id === section.id) : -1;
                              return (
                                <SortableItem
                                  key={section.id}
                                  id={section.id}
                                  section={section}
                                  isSelected={selectedSectionId === section.id}
                                  onSelect={() => setSelectedSectionId(section.id)}
                                  onToggleVisibility={(e) => { e.stopPropagation(); toggleSectionVisibility(activePage.id, section.id); }}
                                  onRemove={(e) => { e.stopPropagation(); setSectionToDelete(section.id); }}
                                  onMoveUp={isFooterBar && barIdx > 0 ? () => moveFooterBar(section.id, 'up') : undefined}
                                  onMoveDown={isFooterBar && barIdx !== -1 && barIdx < footerBars.length - 1 ? () => moveFooterBar(section.id, 'down') : undefined}
                                />
                              );
                            })}
                          </SortableContext>
                        </div>
                      </DndContext>
                    );
                  })()}
              </div>
            </div>
            
            <div style={{ borderTop: '1px solid var(--border-color)', padding: '12px 16px', backgroundColor: 'var(--panel-bg)', flexShrink: 0, zIndex: 10 }}>
              <button 
                className={styles.addSectionBtn} 
                onClick={() => {
                  const firstFooterIndex = activePage?.sections.findIndex(s => ['FooterMenu', 'FooterText', 'Footer'].includes(s.type)) ?? -1;
                  useLandingEditorStore.getState().setInsertIndex(firstFooterIndex !== -1 ? firstFooterIndex : null);
                  setAddSectionWidgetOpen(true);
                }} 
                style={{ width: '100%', margin: 0, padding: '10px', fontSize: '13px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={16} /> Add Section
              </button>
            </div>
          </div>
        )}
      </div>
      {sectionToDelete && createPortal(
        <div className={styles.fullscreenModalOverlay} style={{ zIndex: 99999 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', width: '320px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontFamily: '"Outfit", sans-serif' }}>Delete Section</h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: 'var(--text-muted)' }}>Are you sure you want to delete this section? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSectionToDelete(null)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  removeSection(activePage.id, sectionToDelete);
                  setSectionToDelete(null);
                }}
                style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#ef4444', color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '13px', boxShadow: '0 4px 10px rgba(239, 68, 68, 0.2)' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );

  const isSettings = activeTab === 'settings';
  const shouldCollapse = isLeftSidebarCollapsed && !isSettings;

  if (shouldCollapse) {
    return (
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ 
          width: '24px', 
          position: 'relative', 
          flexShrink: 0, 
          borderRight: '1px solid var(--border-color)', 
          backgroundColor: 'var(--panel-bg)', 
          cursor: 'pointer',
          zIndex: 40
        }}
      >
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--text-muted)' }}>
          <ChevronRight size={16} />
        </div>
        
        <aside 
          className={styles.leftPanel}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '280px',
            zIndex: 100,
            transform: isHovered ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: isHovered ? 'var(--shadow-lg)' : 'none',
          }}
        >
          {sidebarContent}
        </aside>
      </div>
    );
  }

  return (
    <aside className={styles.leftPanel} style={{ position: 'relative', width: '280px', transition: 'width 0.3s' }}>
      {sidebarContent}
    </aside>
  );
};
