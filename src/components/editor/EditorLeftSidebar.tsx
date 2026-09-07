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
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ThemeSecondaryNav } from './theme/ThemeSecondaryNav';
import styles from '../../pages/editor/EditorLayout.module.css';

export const EditorLeftSidebar: React.FC = () => {
  const navigate = useNavigate();
  const { 
    activePanel: activeTab, setActivePanel: setActiveTab, selectedSectionId, setSelectedSectionId, 
    activeSettingItem, setActiveSettingItem,
    setAddSectionWidgetOpen, selectedPageId, setSelectedPageId,
    isLeftSidebarCollapsed, setLeftSidebarCollapsed
  } = useLandingEditorStore();
  const { pages, toggleSectionVisibility, reorderSections, removeSection, updatePageProps } = useSiteStore();
  const activePage = pages.find(p => p.id === selectedPageId) || pages[0];

  // Cleanup duplicate locked sections that might have been added manually before restrictions
  React.useEffect(() => {
    if (activePage) {
      const headerCount = activePage.sections.filter(s => s.type === 'Header').length;
      const footerCount = activePage.sections.filter(s => s.type === 'Footer').length;
      
      if (headerCount > 1 || footerCount > 1) {
        const seen = new Set();
        const deduplicated = activePage.sections.filter(s => {
          if (s.type === 'Header' || s.type === 'Footer') {
            if (seen.has(s.type)) return false;
            seen.add(s.type);
          }
          return true;
        });
        updatePageProps(activePage.id, { sections: deduplicated });
      }
    }
  }, [activePage, updatePageProps]);
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && activePage) {
      const oldIndex = activePage.sections.findIndex(s => s.id === active.id);
      let newIndex = activePage.sections.findIndex(s => s.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const headerGroupTypes = ['AnnouncementBar', 'UtilityBar', 'Header'];
        const footerGroupTypes = ['FooterMenu', 'FooterText', 'Footer'];
        
        const isHeaderItem = headerGroupTypes.includes(activePage.sections[oldIndex].type);
        const isFooterItem = footerGroupTypes.includes(activePage.sections[oldIndex].type);
        const isBodyItem = !isHeaderItem && !isFooterItem;

        const headerIndex = activePage.sections.findIndex(s => s.type === 'Header');
        const footerIndex = activePage.sections.findIndex(s => s.type === 'Footer');
        
        const firstFooterItemIndex = activePage.sections.findIndex(s => footerGroupTypes.includes(s.type));
        const actualFooterStartIndex = firstFooterItemIndex !== -1 ? firstFooterItemIndex : footerIndex;

        if (isHeaderItem) {
          if (newIndex > headerIndex) newIndex = headerIndex;
        } else if (isFooterItem) {
          if (newIndex < actualFooterStartIndex) newIndex = actualFooterStartIndex;
          if (newIndex > footerIndex) newIndex = footerIndex;
        } else if (isBodyItem) {
          if (newIndex <= headerIndex) newIndex = headerIndex + 1;
          if (newIndex >= actualFooterStartIndex && actualFooterStartIndex !== -1) newIndex = actualFooterStartIndex - 1;
        }

        if (oldIndex !== newIndex) {
          reorderSections(activePage.id, oldIndex, newIndex);
        }
      }
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
            const targetId = (selectedPageId && selectedPageId !== 'landing-page') ? selectedPageId : 'shop-page';
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
                  {activePage && (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                  >
                    <SortableContext
                      items={activePage.sections.map(s => s.id)}
                      strategy={verticalListSortingStrategy}
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
                        {activePage.sections.filter(s => ['AnnouncementBar', 'UtilityBar', 'Header'].includes(s.type)).map(section => {
                          return (
                            <SortableItem
                              key={section.id}
                              id={section.id}
                              section={section}
                              isSelected={selectedSectionId === section.id}
                              onSelect={() => setSelectedSectionId(section.id)}
                              onToggleVisibility={(e) => { e.stopPropagation(); toggleSectionVisibility(activePage.id, section.id); }}
                              onRemove={(e) => { e.stopPropagation(); setSectionToDelete(section.id); }}
                            />
                          );
                        })}
                      </div>

                      <div className={styles.sectionGroup}>
                        <div className={styles.sectionCategoryHeader}>Template</div>
                        {activePage.sections.filter(s => !['AnnouncementBar', 'UtilityBar', 'Header', 'FooterMenu', 'FooterText', 'Footer'].includes(s.type)).map(section => {
                          const index = activePage.sections.findIndex(s => s.id === section.id);
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
                                useLandingEditorStore.getState().setInsertIndex(index + 1);
                                setAddSectionWidgetOpen(true);
                              }}
                            />
                          );
                        })}
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
                        {activePage.sections.filter(s => ['FooterMenu', 'FooterText', 'Footer'].includes(s.type)).map(section => {
                          return (
                            <SortableItem
                              key={section.id}
                              id={section.id}
                              section={section}
                              isSelected={selectedSectionId === section.id}
                              onSelect={() => setSelectedSectionId(section.id)}
                              onToggleVisibility={(e) => { e.stopPropagation(); toggleSectionVisibility(activePage.id, section.id); }}
                              onRemove={(e) => { e.stopPropagation(); setSectionToDelete(section.id); }}
                            />
                          );
                        })}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
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
