import React from 'react';
import { createPortal } from 'react-dom';
import { Search, ChevronDown, Plus, Settings, MoreVertical, LayoutTemplate, Palette, FileText, Share, Globe, Wand2, Trash2, Smartphone } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { useSiteStore } from '../../store/siteStore';
import { SortableItem } from './SortableItem';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import styles from '../../pages/editor/EditorLayout.module.css';

export const EditorLeftSidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedSectionId,
    setSelectedSectionId,
    selectedPageId,
    setSelectedPageId,
    setAddSectionWidgetOpen,
    activeSettingItem,
    setActiveSettingItem
  } = useEditorStore();
  const { pages, toggleSectionVisibility, reorderSections, removeSection, theme, updateTheme, removePage, updatePageProps } = useSiteStore();
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
  const [pageToDelete, setPageToDelete] = React.useState<string | null>(null);
  const [headerAddOpen, setHeaderAddOpen] = React.useState(false);
  const [footerAddOpen, setFooterAddOpen] = React.useState(false);
  
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

  return (
    <aside className={styles.leftPanel}>
      {/* Primary Tabs */}
      <div className={styles.panelTabs}>
        <button className={`${styles.panelTab} ${activeTab === 'landing' ? styles.activeTab : ''}`} onClick={() => setActiveTab('landing')}>
          <LayoutTemplate size={20} />
          Editor
        </button>
        <button className={`${styles.panelTab} ${activeTab === 'pages' ? styles.activeTab : ''}`} onClick={() => setActiveTab('pages')}>
          <FileText size={20} />
          Pages
        </button>
        <button className={`${styles.panelTab} ${activeTab === 'theme' ? styles.activeTab : ''}`} onClick={() => setActiveTab('theme')}>
          <Palette size={20} />
          Theme
        </button>
        <button className={`${styles.panelTab} ${activeTab === 'settings' ? styles.activeTab : ''}`} onClick={() => setActiveTab('settings')}>
          <Settings size={20} />
          Settings
        </button>
      </div>

      <div className={styles.panelContent} style={activeTab === 'landing' ? { padding: 0 } : {}}>
        {activeTab === 'settings' ? (
          <div className={styles.settingsSidebar}>
            <div className={styles.sectionHeaderCol}>
              <h3 className={styles.fw600}>Global Settings</h3>
              <p className={styles.labelSm}>Manage your site configuration</p>
            </div>
            <div className={styles.settingsList}>
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
          <div className={styles.themeSidebar}>
            <div className={styles.sectionHeaderCol}>
              <h3 className={styles.fw600}>Theme styles</h3>
            </div>

            <div className={styles.inheritThemeBlock}>
              <Wand2 size={20} className={styles.itIcon} />
              <div className={styles.itContent}>
                <h4>Inherit global theme <span className={styles.itBadge}>Active</span></h4>
                <p>Changes here will apply to all pages automatically.</p>
              </div>
            </div>

            <div className={styles.themeCategoryList} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div className={styles.themeCategory}>
                <div className={styles.tcHeader} style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 600 }}>Global Colors</h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {Object.entries(theme.colors).map(([key, value]) => (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', textTransform: 'capitalize', color: 'var(--text-main)' }}>{key}</span>
                      <input 
                        type="color" 
                        value={value} 
                        onChange={(e) => updateTheme({ colors: { ...theme.colors, [key]: e.target.value } })}
                        style={{ width: '36px', height: '36px', padding: 0, border: 'none', borderRadius: '6px', cursor: 'pointer', backgroundColor: 'transparent' }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.themeCategory}>
                <div className={styles.tcHeader} style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 600 }}>Typography</h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Heading Font</label>
                    <select 
                      value={theme.typography.headingFont}
                      onChange={(e) => updateTheme({ typography: { ...theme.typography, headingFont: e.target.value } })}
                      style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }}
                    >
                      <option value="Outfit, sans-serif">Outfit</option>
                      <option value="Inter, sans-serif">Inter</option>
                      <option value="Playfair Display, serif">Playfair Display</option>
                      <option value="Roboto, sans-serif">Roboto</option>
                      <option value="Space Grotesk, sans-serif">Space Grotesk</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Body Font</label>
                    <select 
                      value={theme.typography.bodyFont}
                      onChange={(e) => updateTheme({ typography: { ...theme.typography, bodyFont: e.target.value } })}
                      style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }}
                    >
                      <option value="Inter, sans-serif">Inter</option>
                      <option value="Roboto, sans-serif">Roboto</option>
                      <option value="Lato, sans-serif">Lato</option>
                      <option value="Open Sans, sans-serif">Open Sans</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Base Size</label>
                      <span style={{ fontSize: '12px', fontWeight: 600 }}>{theme.typography.baseSize}px</span>
                    </div>
                    <input 
                      type="range" min="12" max="24" step="1" 
                      value={theme.typography.baseSize}
                      onChange={(e) => updateTheme({ typography: { ...theme.typography, baseSize: parseInt(e.target.value) } })}
                      style={{ accentColor: 'var(--theme-primary)' }}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.themeCategory}>
                <div className={styles.tcHeader} style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 600 }}>UI Elements</h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Border Radius</label>
                    <select 
                      value={theme.ui.borderRadius}
                      onChange={(e) => updateTheme({ ui: { ...theme.ui, borderRadius: e.target.value } })}
                      style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }}
                    >
                      <option value="0px">Sharp (0px)</option>
                      <option value="4px">Slight (4px)</option>
                      <option value="8px">Rounded (8px)</option>
                      <option value="16px">Extra Rounded (16px)</option>
                      <option value="24px">Soft (24px)</option>
                      <option value="999px">Pill (999px)</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Shadows</label>
                    <select 
                      value={theme.ui.shadow}
                      onChange={(e) => updateTheme({ ui: { ...theme.ui, shadow: e.target.value } })}
                      style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }}
                    >
                      <option value="none">None</option>
                      <option value="0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)">Soft</option>
                      <option value="0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)">Medium</option>
                      <option value="0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)">Large</option>
                      <option value="0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)">Extra Large</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={styles.themeCategory}>
                <div className={styles.tcHeader} style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 600 }}>Layout</h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Max Width</label>
                      <span style={{ fontSize: '12px', fontWeight: 600 }}>{theme.layout.maxWidth}px</span>
                    </div>
                    <input 
                      type="range" min="800" max="1600" step="100" 
                      value={theme.layout.maxWidth}
                      onChange={(e) => updateTheme({ layout: { ...theme.layout, maxWidth: parseInt(e.target.value) } })}
                      style={{ accentColor: 'var(--theme-primary)' }}
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : activeTab === 'pages' ? (
          <>
            <div className={styles.sectionHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '12px' }}>
              <h3 className={styles.fw600}>All pages</h3>
            </div>
            <div className={styles.pageList}>
              {pages.filter(p => p.path !== '/').map(p => (
                <div
                  key={p.id}
                  className={`${styles.pageItem} ${selectedPageId === p.id ? styles.activePageItem : ''}`}
                  onClick={() => setSelectedPageId(p.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.pageItemLeft}>
                    <LayoutTemplate size={18} className={selectedPageId === p.id ? styles.pageIconActive : styles.pageIconDef} />
                    <div className={styles.pageInfo}>
                      <span className={styles.pageItemName}>{p.name}</span>
                      <span className={styles.pageItemPath}>{p.path}</span>
                    </div>
                  </div>
                  <div className={styles.pageItemRight}>
                    {p.type === 'Custom' ? (
                      <Trash2 
                        size={14} 
                        className={styles.moreIcon} 
                        style={{ color: '#ef4444', cursor: 'pointer' }} 
                        onClick={(e) => {
                          e.stopPropagation();
                          setPageToDelete(p.id);
                        }} 
                      />
                    ) : (
                      <MoreVertical size={14} className={styles.moreIcon} />
                    )}
                  </div>
                </div>
              ))}
            </div>

          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }} className={styles.innerScroll}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.fw600}>{activePage?.name || 'Home page'}</h3>
                <ChevronDown size={16} />
              </div>

              <div className={styles.sectionsList}>
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
                                useEditorStore.getState().setInsertIndex(index + 1);
                                setAddSectionWidgetOpen(true);
                              }}
                            />
                          );
                        })}
                        <button 
                          className={styles.groupAddBtn} 
                          onClick={() => {
                            const lastBodyIndex = activePage.sections.findIndex(s => s.type === 'Footer');
                            useEditorStore.getState().setInsertIndex(lastBodyIndex !== -1 ? lastBodyIndex : null);
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

            <div style={{ borderTop: '1px solid var(--border-color)', padding: '12px', backgroundColor: 'var(--panel-bg)' }}>
              <button 
                className={styles.addSectionBtn} 
                onClick={() => {
                  const lastBodyIndex = activePage?.sections.findIndex(s => s.type === 'Footer') ?? -1;
                  useEditorStore.getState().setInsertIndex(lastBodyIndex !== -1 ? lastBodyIndex : null);
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
      {pageToDelete && createPortal(
        <div className={styles.fullscreenModalOverlay} style={{ zIndex: 99999 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', width: '320px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontFamily: '"Outfit", sans-serif' }}>Delete Page</h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: 'var(--text-muted)' }}>Are you sure you want to delete this page? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setPageToDelete(null)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  removePage(pageToDelete);
                  if (selectedPageId === pageToDelete) {
                    setSelectedPageId(pages[0].id);
                  }
                  setPageToDelete(null);
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
    </aside>
  );
};
