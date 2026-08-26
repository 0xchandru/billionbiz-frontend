import React from 'react';
import { Search, ChevronDown, Plus, Settings, MoreVertical, LayoutTemplate, Palette, FileText, Code, Share2, Share, Globe, Image as ImageIcon, Wand2 } from 'lucide-react';
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
    setAddSectionWidgetOpen
  } = useEditorStore();
  const { pages, toggleSectionVisibility, reorderSections, removeSection, theme, updateTheme } = useSiteStore();
  const activePage = pages.find(p => p.id === selectedPageId) || pages[0];
  const [sectionToDelete, setSectionToDelete] = React.useState<string | null>(null);

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
                {icon: Search, title: 'SEO basic', desc: 'Title, meta description and indexing', active: true},
                {icon: Code, title: 'JSON-LD', desc: 'Structured data for search engines'},
                {icon: Share2, title: 'Sitemap', desc: 'Manage and update sitemap'},
                {icon: Share, title: 'Social media', desc: 'Social links and share settings'},
                {icon: LayoutTemplate, title: 'Header & Footer', desc: 'Manage header and footer content'},
                {icon: ImageIcon, title: 'OG Image', desc: 'Default social sharing image'},
                {icon: Globe, title: 'Language', desc: 'Default language and text'}
              ].map((item, i) => (
                <div key={i} className={`${styles.settingItem} ${item.active ? styles.settingItemActive : ''}`}>
                  <item.icon size={18} className={item.active ? styles.siIconActive : styles.siIcon} />
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

            <div className={styles.themeCategoryList}>
              <div className={styles.themeCategory}>
                <div className={styles.tcHeader}>
                  <h4>Color palettes</h4>
                  <a href="#">Edit all</a>
                </div>
                <div className={styles.tcGrid}>
                  {[
                    {name: 'Default', colors: { primary: '#198754', secondary: '#ff6b00', background: '#ffffff', text: '#0f172a' }},
                    {name: 'Ocean', colors: { primary: '#0ea5e9', secondary: '#0284c7', background: '#f0f9ff', text: '#082f49' }},
                    {name: 'Luxury', colors: { primary: '#000000', secondary: '#4b5563', background: '#fafafa', text: '#111111' }}
                  ].map((t, i) => (
                    <div 
                      key={i} 
                      className={`${styles.themeCard} ${theme.presetName === t.name ? styles.tcActive : ''}`}
                      onClick={() => updateTheme({ presetName: t.name, colors: t.colors })}
                    >
                      <div className={styles.tcLeft}>
                        <span className={styles.tcName}>{t.name}</span>
                      </div>
                      <div className={styles.tcColors}>
                        {Object.values(t.colors).map((c, j) => <span key={j} style={{backgroundColor: c, flex: 1}}></span>)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.themeCategory}>
                <div className={styles.tcHeader}>
                  <h4>Typography</h4>
                  <a href="#">Edit fonts</a>
                </div>
                <div className={styles.tcGrid}>
                  {[
                    {name: 'Modern Sans', style: {fontFamily: 'Inter'}, active: true},
                    {name: 'Classic Serif', style: {fontFamily: 'Georgia'}},
                    {name: 'Mono Space', style: {fontFamily: 'monospace'}}
                  ].map((t, i) => (
                    <div key={i} className={`${styles.themeCard} ${t.active ? styles.tcActive : ''}`}>
                      <div className={styles.tcLeft}>
                        <div className={styles.tcThumbnail} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 'bold', color: 'var(--text-main)', ...t.style}}>Ag</div>
                        <span className={styles.tcName}>{t.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'pages' ? (
          <>
            <div className={styles.sectionHeader}>
              <h3 className={styles.fw600}>All pages</h3>
            </div>
            <div className={styles.pageList}>
              {pages.map(p => (
                <div 
                  key={p.id} 
                  className={`${styles.pageItem} ${selectedPageId === p.id ? styles.activePageItem : ''}`}
                  onClick={() => setSelectedPageId(p.id)}
                >
                  <div className={styles.pageItemLeft}>
                    <LayoutTemplate size={18} className={selectedPageId === p.id ? styles.pageIconActive : styles.pageIconDef} />
                    <div className={styles.pageInfo}>
                      <span className={styles.pageItemName}>{p.name}</span>
                      <span className={styles.pageItemPath}>{p.path}</span>
                    </div>
                  </div>
                  <div className={styles.pageItemRight}>
                    <MoreVertical size={14} className={styles.moreIcon} />
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

            <div className={styles.miniThemeGroup} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', backgroundColor: 'var(--panel-bg)', paddingBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
               <button className={styles.addSectionBtn} onClick={() => setAddSectionWidgetOpen(true)} style={{ marginBottom: '4px' }}>
                 <Plus size={16} /> Add section
               </button>
               
               <div className={styles.miniThemeItem} onClick={() => setColorWidgetOpen(true)}>
                  <span>Color palette</span>
                  <div className={styles.miniColors}>
                    <span style={{backgroundColor: theme?.colors?.primary || '#198754'}}></span>
                    <span style={{backgroundColor: theme?.colors?.secondary || '#ff6b00'}}></span>
                    <span style={{backgroundColor: theme?.colors?.background || '#ffffff'}}></span>
                    <span style={{backgroundColor: theme?.colors?.text || '#0f172a'}}></span>
                  </div>
               </div>
               <div className={styles.miniThemeItem} onClick={() => setTypographyWidgetOpen(true)}>
                  <span>Typography</span>
                  <div className={styles.miniFont} style={{fontFamily: theme?.typography?.fontFamily || 'Inter'}}>Ag</div>
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
    </aside>
  );
};
