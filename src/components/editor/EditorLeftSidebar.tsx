import React from 'react';
import { Search, ChevronDown, Plus, Settings, MoreVertical, LayoutTemplate, Palette, FileText, Code, Share2, Share, Globe, Image as ImageIcon, Wand2, Trash2 } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { useSiteStore, type SectionData } from '../../store/siteStore';
import { SortableItem } from './SortableItem';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
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
    setColorWidgetOpen,
    setTypographyWidgetOpen,
    setAddSectionWidgetOpen,
    activeSettingItem,
    setActiveSettingItem
  } = useEditorStore();
  const { pages, toggleSectionVisibility, reorderSections, removeSection, theme, updateTheme, removePage } = useSiteStore();
  const activePage = pages.find(p => p.id === selectedPageId) || pages[0];
  const [sectionToDelete, setSectionToDelete] = React.useState<string | null>(null);
  const [pageToDelete, setPageToDelete] = React.useState<string | null>(null);

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
        // Find indices of locked sections
        const annIndex = activePage.sections.findIndex(s => s.type === 'AnnouncementBar');
        const headerIndex = activePage.sections.findIndex(s => s.type === 'Header');
        const footerIndex = activePage.sections.findIndex(s => s.type === 'Footer');

        // The highest index among top locked elements
        const minIndex = Math.max(annIndex, headerIndex) + 1;
        // The index of the footer (if exists)
        const maxIndex = footerIndex !== -1 ? footerIndex - 1 : activePage.sections.length - 1;

        if (newIndex < minIndex) newIndex = minIndex;
        if (newIndex > maxIndex) newIndex = maxIndex;

        if (oldIndex !== newIndex) {
          reorderSections(activePage.id, oldIndex, newIndex);
        }
      }
    }
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

      <div className={styles.panelContent}>
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
            <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '20px', paddingRight: '12px' }} className={styles.innerScroll}>
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
                    modifiers={[restrictToVerticalAxis]}
                  >
                    <SortableContext
                      items={activePage.sections.map(s => s.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {activePage.sections.map((section: SectionData, index: number) => (
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
                      ))}
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', padding: '12px', backgroundColor: 'var(--panel-bg)', display: 'flex', gap: '8px' }}>
              <button 
                className={styles.addSectionBtn} 
                onClick={() => setAddSectionWidgetOpen(true)} 
                style={{ flex: 1, margin: 0, padding: '8px', fontSize: '13px', width: 'auto' }}
              >
                <Plus size={16} /> Add
              </button>

              <div className={styles.miniThemeItem} onClick={() => setColorWidgetOpen(true)} style={{ padding: '8px 12px', width: 'auto', flexShrink: 0, margin: 0 }} title="Color palette">
                <div className={styles.miniColors} style={{ gap: '4px' }}>
                  <span style={{ backgroundColor: theme?.colors?.primary || '#198754', borderRadius: '4px' }}></span>
                  <span style={{ backgroundColor: theme?.colors?.secondary || '#ff6b00', borderRadius: '4px' }}></span>
                </div>
              </div>
              <div className={styles.miniThemeItem} onClick={() => setTypographyWidgetOpen(true)} style={{ padding: '8px 16px', width: 'auto', flexShrink: 0, margin: 0 }} title="Typography">
                <div style={{ fontFamily: theme?.typography?.bodyFont || 'Inter', fontSize: '14px', fontWeight: 'bold' }}>Ag</div>
              </div>
            </div>
          </div>
        )}
      </div>
      {sectionToDelete && (
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
        </div>
      )}
      {pageToDelete && (
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
        </div>
      )}
    </aside>
  );
};
