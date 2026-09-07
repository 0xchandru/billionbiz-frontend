import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronRight, ChevronLeft, ChevronDown, ChevronUp, MoreVertical, Check, UploadCloud, Plus, Trash2, Calendar, Edit2, Monitor, EyeOff, GripVertical, RotateCcw } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useLandingEditorStore } from '../../store/landingEditorStore';
import { useSiteStore } from '../../store/siteStore';
import { getSectionConfig } from './sectionConfigs';
import { TabRenderer } from './ui/TabRenderer';
import { PageTabRenderer } from './ui/PageTabRenderer';
import { getPageConfig } from './pageConfigs';
import { ThemesPanel } from './theme/panels/ThemesPanel';
import { ColorPalettePanel } from './theme/panels/ColorPalettePanel';
import { TypographyPanel } from './theme/panels/TypographyPanel';
import { ButtonsPanel } from './theme/panels/ButtonsPanel';
import { EffectsPanel } from './theme/panels/EffectsPanel';
import type { ThemeCategoryType } from '../../store/landingEditorStore';
import { ThemeResetButton } from './theme/ui/ThemeResetButton';
import { isCategoryDefault } from './theme/themeDefaultChecker';
import { ColorPickerPopover } from './ui/ColorPickerPopover';
import styles from '../../pages/editor/EditorLayout.module.css';

// --- Editor field config types ---
type FieldType = 'text' | 'textarea' | 'color' | 'image' | 'toggle' | 'select' | 'number' | 'url' | 'list';

interface EditorField {
  key: string;
  label: string;
  type: FieldType;
  options?: string[]; // for select
  listFields?: { key: string; label: string; type: 'text' | 'textarea' | 'url' | 'icon' }[]; // for list items
}

// --- Section editor configs ---
const sectionEditorConfigs: Record<string, EditorField[]> = {
  AnnouncementBar: [
    { key: 'text', label: 'Announcement Text', type: 'text' },
  ],
  Header: [
    { key: 'logo', label: 'Logo Text', type: 'text' },
    { key: 'ctaText', label: 'CTA Button Text', type: 'text' },
    { key: 'showSearch', label: 'Show Search', type: 'toggle' },
    { key: 'links', label: 'Desktop Navigation Links', type: 'list', listFields: [{ key: 'value', label: 'Link Name', type: 'text' }] },
  ],
  HeroBanner: [
    { key: 'badge', label: 'Badge Text', type: 'text' },
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'primaryBtn', label: 'Primary Button', type: 'text' },
    { key: 'secondaryBtn', label: 'Secondary Button', type: 'text' },
    { key: 'image', label: 'Hero Image URL', type: 'image' },
    { key: 'layout', label: 'Layout', type: 'select', options: ['left', 'center', 'right'] },
    { key: 'bgColor', label: 'Background Color', type: 'color' },
  ],
  FeaturedCollection: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'linkText', label: 'Link Text', type: 'text' },
    { key: 'columns', label: 'Columns', type: 'select', options: ['2', '3', '4'] },
    { key: 'products', label: 'Products', type: 'list', listFields: [
      { key: 'name', label: 'Product Name', type: 'text' },
      { key: 'price', label: 'Price', type: 'text' },
      { key: 'image', label: 'Image URL', type: 'url' },
    ]},
  ],
  ImageWithText: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'body', label: 'Body Text', type: 'textarea' },
    { key: 'image', label: 'Image URL', type: 'image' },
    { key: 'imagePosition', label: 'Image Position', type: 'select', options: ['left', 'right'] },
    { key: 'buttonText', label: 'Button Text', type: 'text' },
    { key: 'buttonLink', label: 'Button Link', type: 'url' },
    { key: 'bgColor', label: 'Background Color', type: 'color' },
  ],
  RichText: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'body', label: 'Body Text', type: 'textarea' },
    { key: 'alignment', label: 'Text Alignment', type: 'select', options: ['left', 'center', 'right'] },
    { key: 'bgColor', label: 'Background Color', type: 'color' },
  ],
  Newsletter: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'buttonText', label: 'Button Text', type: 'text' },
    { key: 'bgColor', label: 'Background Color', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
  ],
  Testimonials: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'testimonials', label: 'Testimonials', type: 'list', listFields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'role', label: 'Role', type: 'text' },
      { key: 'quote', label: 'Quote', type: 'textarea' },
      { key: 'avatar', label: 'Avatar URL', type: 'url' },
    ]},
  ],
  LogoList: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'logos', label: 'Logos', type: 'list', listFields: [
      { key: 'name', label: 'Brand Name', type: 'text' },
      { key: 'image', label: 'Logo Image URL (optional)', type: 'url' },
    ]},
  ],
  Video: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'videoUrl', label: 'Video URL', type: 'url' },
    { key: 'bgColor', label: 'Background Color', type: 'color' },
  ],
  FAQ: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'items', label: 'FAQ Items', type: 'list', listFields: [
      { key: 'question', label: 'Question', type: 'text' },
      { key: 'answer', label: 'Answer', type: 'textarea' },
    ]},
  ],
  ContactForm: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'buttonText', label: 'Button Text', type: 'text' },
    { key: 'bgColor', label: 'Background Color', type: 'color' },
  ],
  BlogPosts: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'posts', label: 'Blog Posts', type: 'list', listFields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'excerpt', label: 'Excerpt', type: 'textarea' },
      { key: 'image', label: 'Image URL', type: 'url' },
      { key: 'date', label: 'Date', type: 'text' },
    ]},
  ],
  Gallery: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'columns', label: 'Columns', type: 'select', options: ['2', '3', '4'] },
    { key: 'images', label: 'Images', type: 'list', listFields: [
      { key: 'src', label: 'Image URL', type: 'url' },
      { key: 'alt', label: 'Alt Text', type: 'text' },
    ]},
  ],
  Map: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'address', label: 'Address', type: 'textarea' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'hours', label: 'Business Hours', type: 'text' },
    { key: 'embedUrl', label: 'Google Maps Embed URL', type: 'url' },
  ],
  PricingTable: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'plans', label: 'Pricing Plans', type: 'list', listFields: [
      { key: 'name', label: 'Plan Name', type: 'text' },
      { key: 'price', label: 'Price', type: 'text' },
      { key: 'period', label: 'Period', type: 'text' },
      { key: 'buttonText', label: 'Button Text', type: 'text' },
    ]},
  ],
  Footer: [
    { key: 'logo', label: 'Logo Text', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'copyright', label: 'Copyright Text', type: 'text' },
  ],
};

// --- Reusable field components ---

const FieldInput: React.FC<{ value: string; onChange: (v: string) => void; placeholder?: string }> = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    className={styles.inputField}
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
  />
);

const FieldTextarea: React.FC<{ value: string; onChange: (v: string) => void; placeholder?: string }> = ({ value, onChange, placeholder }) => (
  <textarea
    className={styles.textareaField}
    rows={3}
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
  />
);

const FieldColor: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
    <ColorPickerPopover
      value={value}
      onChange={onChange}
      size="md"
    />
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      style={{ flex: 1, fontSize: '13px', padding: '4px 8px', border: '1px solid var(--border-color)', borderRadius: '4px', fontFamily: 'monospace' }}
    />
  </div>
);

const FieldImage: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    {value && (
      <div style={{ width: '100%', height: '120px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
        <img src={value} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    )}
    <input
      type="text"
      className={styles.inputField}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter image URL..."
    />
  </div>
);

const FieldToggle: React.FC<{ value: boolean; onChange: (v: boolean) => void }> = ({ value, onChange }) => (
  <button
    onClick={() => onChange(!value)}
    style={{
      width: '44px',
      height: '24px',
      borderRadius: '12px',
      backgroundColor: value ? 'var(--primary)' : '#e2e8f0',
      border: 'none',
      cursor: 'pointer',
      position: 'relative',
      transition: 'background-color 0.2s',
      padding: 0,
    }}
  >
    <div style={{
      width: '18px',
      height: '18px',
      borderRadius: '50%',
      backgroundColor: 'white',
      position: 'absolute',
      top: '3px',
      left: value ? '23px' : '3px',
      transition: 'left 0.2s',
      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
    }} />
  </button>
);

const FieldSelect: React.FC<{ value: string; onChange: (v: string) => void; options: string[] }> = ({ value, onChange, options }) => (
  <select
    value={value || options[0]}
    onChange={(e) => onChange(e.target.value)}
    style={{
      width: '100%',
      padding: '10px 14px',
      border: '1px solid var(--border-color)',
      borderRadius: '8px',
      fontSize: '13px',
      fontFamily: 'inherit',
      backgroundColor: '#f8fafc',
      cursor: 'pointer',
      outline: 'none',
      textTransform: 'capitalize',
    }}
  >
    {options.map(opt => (
      <option key={opt} value={opt} style={{ textTransform: 'capitalize' }}>{opt}</option>
    ))}
  </select>
);

// --- List editor for repeater fields ---

const SortableListItem = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 999 : 0,
    position: isDragging ? 'relative' : undefined,
    boxShadow: isDragging ? '0 10px 15px -3px rgb(0 0 0 / 0.1)' : undefined,
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#f8fafc',
  } as React.CSSProperties;

  return (
    <div ref={setNodeRef} style={style}>
      <div style={{ position: 'absolute', top: '10px', left: '8px', cursor: 'grab', color: 'var(--text-muted)' }} {...attributes} {...listeners}>
        <GripVertical size={14} />
      </div>
      <div style={{ paddingLeft: '24px' }}>
        {children}
      </div>
    </div>
  );
};

interface ListEditorProps {
  items: any[];
  onChange: (items: any[]) => void;
  listFields?: { key: string; label: string; type: 'text' | 'textarea' | 'url' | 'icon' }[];
  maxItems?: number;
  isStringList?: boolean;
}

export const ListEditor: React.FC<ListEditorProps> = ({ items, onChange, listFields = [], maxItems, isStringList }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((_, i) => `item-${i}` === active.id);
      const newIndex = items.findIndex((_, i) => `item-${i}` === over.id);
      
      const newItems = [...items];
      const [movedItem] = newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, movedItem);
      onChange(newItems);

      if (expandedIndex === oldIndex) setExpandedIndex(newIndex);
      else if (expandedIndex === newIndex) setExpandedIndex(oldIndex);
    }
  };

  const handleItemChange = (index: number, key: string, value: string) => {
    if (isStringList) {
      const newItems = [...items];
      newItems[index] = value;
      onChange(newItems);
    } else {
      const newItems = items.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      );
      onChange(newItems);
    }
  };

  const addItem = () => {
    if (maxItems && items.length >= maxItems) {
      alert(`You can only add up to ${maxItems} items.`);
      return;
    }
    if (isStringList) {
      onChange([...items, 'New Link']);
    } else {
      const newItem: Record<string, string> = { id: `id-${Date.now()}` };
      listFields.forEach(f => { newItem[f.key] = ''; });
      onChange([...items, newItem]);
    }
    setExpandedIndex(items.length);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
    if (expandedIndex === index) setExpandedIndex(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((_, i) => `item-${i}`)} strategy={verticalListSortingStrategy}>
          {items.map((item, i) => (
            <SortableListItem key={`item-${i}`} id={`item-${i}`}>
              <div
                onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px 10px 4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                }}
              >
                <span>{isStringList ? item : (item[listFields[0]?.key] || `Item ${i + 1}`)}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Trash2
                    size={14}
                    style={{ color: '#ef4444', cursor: 'pointer' }}
                    onClick={(e) => { e.stopPropagation(); removeItem(i); }}
                  />
                  <ChevronDown
                    size={14}
                    style={{
                      transform: expandedIndex === i ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                    }}
                  />
                </div>
              </div>
              {expandedIndex === i && (
                <div style={{ padding: '12px', marginLeft: '-24px', display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--border-color)', backgroundColor: 'white' }}>
                  {isStringList ? (
                    <input
                      type="text"
                      className={styles.inputField}
                      value={item || ''}
                      onChange={(e) => handleItemChange(i, 'value', e.target.value)}
                    />
                  ) : (
                    listFields.map(field => (
                      <div key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{field.label}</span>
                        {field.type === 'textarea' ? (
                          <textarea
                            className={styles.textareaField}
                            rows={2}
                            value={item[field.key] || ''}
                            onChange={(e) => handleItemChange(i, field.key, e.target.value)}
                          />
                        ) : field.type === 'icon' ? (
                          <select
                            className={styles.inputField}
                            value={item[field.key] || 'Home'}
                            onChange={(e) => handleItemChange(i, field.key, e.target.value)}
                          >
                            {['Home', 'Search', 'ShoppingCart', 'User', 'Settings', 'Heart', 'Menu', 'Grid', 'List', 'Check'].map(icon => (
                              <option key={icon} value={icon}>{icon}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            className={styles.inputField}
                            value={item[field.key] || ''}
                            onChange={(e) => handleItemChange(i, field.key, e.target.value)}
                          />
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </SortableListItem>
          ))}
        </SortableContext>
      </DndContext>
      <button
        onClick={addItem}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          padding: '10px',
          border: '1px dashed var(--border-color)',
          borderRadius: '8px',
          background: 'transparent',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--primary)',
          transition: 'all 0.2s',
        }}
      >
        <Plus size={14} /> Add Item
      </button>
    </div>
  );
};

// --- Main Component ---

export const EditorRightSidebar: React.FC = () => {
  const { isRightSidebarOpen, closeRightSidebar, selectedSectionId, selectedPageId, isColorWidgetOpen, setColorWidgetOpen, isTypographyWidgetOpen, setTypographyWidgetOpen, activePanel, selectedThemeCategory } = useLandingEditorStore();
  const { pages, updateSectionProps, theme, updateTheme, updatePageProps, resetTheme: _resetTheme, resetAllThemeSettings, resetColorPalette, resetTypography, resetButtons, resetEffects } = useSiteStore();
  const [activeEditorTab, setActiveEditorTab] = useState<'content' | 'design' | 'visibility' | 'advanced' | 'abtest' | 'personalize'>('content');
  const [visibilitySectionsOpen, setVisibilitySectionsOpen] = useState({ devices: true, schedule: true, audience: true, segment: true });
  const [confirmResetCategory, setConfirmResetCategory] = useState<ThemeCategoryType | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: direction === 'left' ? -150 : 150, behavior: 'smooth' });
    }
  };

  const isHidden = !isRightSidebarOpen && !isColorWidgetOpen && !isTypographyWidgetOpen;

  const activePage = pages.find(p => p.id === selectedPageId) || pages[0];
  const activeSection = activePage?.sections.find(s => s.id === selectedSectionId);

  React.useEffect(() => {
    if (isRightSidebarOpen && activePanel === 'editor' && selectedPageId === 'landing-page' && !activeSection && !isColorWidgetOpen && !isTypographyWidgetOpen) {
      useLandingEditorStore.setState({ isRightSidebarOpen: false });
    }
  }, [isRightSidebarOpen, activePanel, selectedPageId, activeSection, isColorWidgetOpen, isTypographyWidgetOpen]);

  // If in 'theme' tab, render theme category editing panel in the right sidebar
  if (activePanel === 'theme') {
    const categoryTitles: Record<ThemeCategoryType, string> = {
      themes: 'Themes',
      colors: 'Color Palette',
      typography: 'Typography',
      buttons: 'Buttons',
      effects: 'Effects',
    };
    const activeCategory = selectedThemeCategory || 'themes';
    const title = categoryTitles[activeCategory] || 'Theme';

    const categoryResetLabels: Record<ThemeCategoryType, string> = {
      themes: 'Reset All',
      colors: 'Reset Colors',
      typography: 'Reset Typography',
      buttons: 'Reset Buttons',
      effects: 'Reset Effects',
    };
    const resetLabel = categoryResetLabels[activeCategory] || 'Reset to default';
    const isCurrentDefault = isCategoryDefault(activeCategory, theme);

    const handleConfirmReset = () => {
      if (!confirmResetCategory) return;
      if (confirmResetCategory === 'themes') {
        resetAllThemeSettings();
      } else if (confirmResetCategory === 'colors') {
        resetColorPalette();
      } else if (confirmResetCategory === 'typography') {
        resetTypography();
      } else if (confirmResetCategory === 'buttons') {
        resetButtons();
      } else if (confirmResetCategory === 'effects') {
        resetEffects();
      }
      setConfirmResetCategory(null);
    };

    const getResetModalContent = (cat: ThemeCategoryType) => {
      const presetName = theme.presetName || 'Modern';
      switch (cat) {
        case 'themes':
          return {
            title: 'Reset All Theme Settings?',
            description: `Are you sure you want to reset all theme customizations back to the "${presetName}" preset defaults? All custom colors, typography, buttons, and effects will be discarded.`,
            confirmLabel: 'Reset All',
          };
        case 'colors':
          return {
            title: 'Reset Color Palette?',
            description: `Are you sure you want to reset the color palette back to the "${presetName}" preset defaults? Your customized brand, background, and text colors will be discarded.`,
            confirmLabel: 'Reset Colors',
          };
        case 'typography':
          return {
            title: 'Reset Typography?',
            description: `Are you sure you want to reset typography back to the "${presetName}" preset defaults? Your font family choices and scale settings will be discarded.`,
            confirmLabel: 'Reset Typography',
          };
        case 'buttons':
          return {
            title: 'Reset Buttons?',
            description: `Are you sure you want to reset button styles back to the "${presetName}" preset defaults? Your button shape and style customizations will be discarded.`,
            confirmLabel: 'Reset Buttons',
          };
        case 'effects':
          return {
            title: 'Reset Effects?',
            description: `Are you sure you want to reset effects back to the "${presetName}" preset defaults? Your radius, shadow, and animation customizations will be discarded.`,
            confirmLabel: 'Reset Effects',
          };
        default:
          return {
            title: 'Reset to Default?',
            description: 'Are you sure you want to reset these settings back to their default values?',
            confirmLabel: 'Reset',
          };
      }
    };

    return (
      <>
        <aside className={`${styles.rightPanel} ${isHidden ? styles.rightPanelHidden : ''}`}>
          <div className={styles.panelHeader} style={{ padding: '14px 18px', gap: '14px' }}>
            <div className={styles.phLeft} style={{ gap: '8px', minWidth: 0, flexShrink: 1 }}>
              <button className={styles.iconBtn} onClick={() => closeRightSidebar()} style={{ flexShrink: 0 }}>
                <ChevronRight size={18} className={styles.backIcon} />
              </button>
              <h3 className={styles.fw600} style={{ margin: 0, fontSize: '15px', whiteSpace: 'nowrap' }}>
                {title}
              </h3>
            </div>
            <ThemeResetButton
              size="sm"
              onClick={() => {
                if (!isCurrentDefault) {
                  setConfirmResetCategory(activeCategory);
                }
              }}
              isDefault={isCurrentDefault}
              label={resetLabel}
              title={isCurrentDefault ? 'Already default' : resetLabel}
            />
          </div>
          <div className={styles.propContent} style={{ padding: '16px', overflowY: 'auto' }}>
            {activeCategory === 'themes' && <ThemesPanel />}
            {activeCategory === 'colors' && <ColorPalettePanel />}
            {activeCategory === 'typography' && <TypographyPanel />}
            {activeCategory === 'buttons' && <ButtonsPanel />}
            {activeCategory === 'effects' && <EffectsPanel />}
          </div>
        </aside>

        {confirmResetCategory && createPortal(
          <div 
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.45)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 99999,
              padding: '16px',
            }}
            onClick={() => setConfirmResetCategory(null)}
          >
            <div 
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '24px',
                width: '100%',
                maxWidth: '380px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                border: '1px solid #f1f5f9',
                display: 'flex',
                flexDirection: 'column',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}>
                <RotateCcw size={20} />
              </div>

              <h3 style={{
                margin: '0 0 8px 0',
                fontSize: '17px',
                fontWeight: 600,
                color: '#0f172a',
                fontFamily: '"Outfit", sans-serif',
              }}>
                {getResetModalContent(confirmResetCategory).title}
              </h3>

              <p style={{
                margin: '0 0 24px 0',
                fontSize: '13px',
                lineHeight: 1.5,
                color: '#64748b',
              }}>
                {getResetModalContent(confirmResetCategory).description}
              </p>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setConfirmResetCategory(null)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#334155',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReset}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(220, 38, 38, 0.25)',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#b91c1c';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#dc2626';
                  }}
                >
                  {getResetModalContent(confirmResetCategory).confirmLabel}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      </>
    );
  }

  // Determine if we should show Page Settings
  // We show page settings if we are in the 'pages' tab, OR if there is no active section selected.
  const shouldShowPageSettings = activePanel === 'pages' || !activeSection;

  if (shouldShowPageSettings) {
    let pageConfig = getPageConfig(activePage.type) || getPageConfig(activePage.id.replace('-page', '')); 
    
    // Fallback config for landing-page or pages without a registered config
    if (!pageConfig) {
      pageConfig = {
        type: activePage.type,
        name: activePage.name,
        category: activePage.category,
        path: activePage.path,
        description: 'Manage page settings',
        defaultSections: [],
        layouts: [],
        getTabs: () => []
      } as any;
    }

    if (pageConfig) {
      return (
        <aside className={`${styles.rightPanel} ${isHidden ? styles.rightPanelHidden : ''}`}>
          <div className={styles.panelHeader}>
            <div className={styles.phLeft}>
              <button className={styles.iconBtn} onClick={() => closeRightSidebar()}>
                <ChevronRight size={20} className={styles.backIcon} />
              </button>
              <h3 className={styles.fw600}>{pageConfig.name} Settings</h3>
            </div>
          </div>
          <div className={styles.propContent} style={{ padding: 0 }}>
            <PageTabRenderer
              tabs={pageConfig.getTabs(activePage.pageProps?._selectedLayout, activePage.pageProps)}
              layouts={pageConfig.layouts}
              props={activePage.pageProps || {}}
              onPropChange={(key, value) => updatePageProps(activePage.id, { [key]: value })}
              pageName={pageConfig.name}
            />
          </div>
        </aside>
      );
    }
  }


  const handlePropChange = (key: string, value: any) => {
    if (activePage && activeSection) {
      updateSectionProps(activePage.id, activeSection.id, { [key]: value });
    }
  };



  const presets = [
    {name: 'Default', colors: { primary: '#198754', secondary: '#ff6b00', background: '#ffffff', text: '#0f172a', accent: '#22c55e', border: '#e2e8f0' }},
    {name: 'Ocean', colors: { primary: '#0ea5e9', secondary: '#0284c7', background: '#f0f9ff', text: '#082f49', accent: '#38bdf8', border: '#bae6fd' }},
    {name: 'Luxury', colors: { primary: '#000000', secondary: '#4b5563', background: '#fafafa', text: '#111111', accent: '#d4af37', border: '#e5e5e5' }},
    {name: 'Forest', colors: { primary: '#16a34a', secondary: '#854d0e', background: '#fefce8', text: '#1a2e05', accent: '#22c55e', border: '#dcfce7' }},
    {name: 'Midnight', colors: { primary: '#8b5cf6', secondary: '#ec4899', background: '#0f0f23', text: '#e2e8f0', accent: '#c084fc', border: '#334155' }},
  ];

  const fonts = [
    {name: 'Modern Sans', style: {fontFamily: 'Inter, sans-serif'}},
    {name: 'Classic Serif', style: {fontFamily: 'Georgia, serif'}},
    {name: 'Mono Space', style: {fontFamily: 'monospace'}},
    {name: 'Elegant', style: {fontFamily: '"Playfair Display", serif'}},
  ];

  // Render field by type
  const renderField = (field: EditorField) => {
    const value = activeSection?.props?.[field.key];

    return (
      <div key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>{field.label}</span>
        </div>
        {field.type === 'text' && <FieldInput value={value} onChange={(v) => handlePropChange(field.key, v)} />}
        {field.type === 'textarea' && <FieldTextarea value={value} onChange={(v) => handlePropChange(field.key, v)} />}
        {field.type === 'color' && <FieldColor value={value} onChange={(v) => handlePropChange(field.key, v)} />}
        {field.type === 'image' && <FieldImage value={value} onChange={(v) => handlePropChange(field.key, v)} />}
        {field.type === 'url' && <FieldInput value={value} onChange={(v) => handlePropChange(field.key, v)} placeholder="https://..." />}
        {field.type === 'toggle' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-main)' }}>{value ? 'Enabled' : 'Disabled'}</span>
            <FieldToggle value={!!value} onChange={(v) => handlePropChange(field.key, v)} />
          </div>
        )}
        {field.type === 'number' && (
          <input
            type="number"
            className={styles.inputField}
            value={value || 0}
            onChange={(e) => handlePropChange(field.key, Number(e.target.value))}
          />
        )}
        {field.type === 'select' && field.options && <FieldSelect value={value} onChange={(v) => handlePropChange(field.key, field.key === 'columns' ? Number(v) : v)} options={field.options} />}
        {field.type === 'list' && field.listFields && (
          <ListEditor
            items={Array.isArray(value) ? value : []}
            listFields={field.listFields}
            onChange={(items) => handlePropChange(field.key, items)}
            isStringList={field.key === 'links'}
          />
        )}
      </div>
    );
  };

  // Get editor config for the active section
  const editorConfig = activeSection ? sectionEditorConfigs[activeSection.type] : null;
  // Get new config-driven section config (takes priority over legacy editorConfig)
  const sectionConfig = activeSection ? getSectionConfig(activeSection.type) : undefined;

  return (
    <aside className={`${styles.rightPanel} ${isHidden ? styles.rightPanelHidden : ''}`}>
      {isColorWidgetOpen ? (
        <>
          <div className={styles.panelHeader}>
            <div className={styles.phLeft}>
              <button className={styles.iconBtn} onClick={() => setColorWidgetOpen(false)}>
                <ChevronRight size={20} className={styles.backIcon} />
              </button>
              <h3 className={styles.fw600}>Color Palette</h3>
            </div>
          </div>
          <div className={styles.propContent} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginTop: '8px' }}>Presets</h4>
            {presets.map((t, i) => (
              <div 
                key={i} 
                className={`${styles.themeCard} ${theme.presetName === t.name ? styles.tcActive : ''}`}
                style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '16px' }}
                onClick={() => updateTheme({ presetName: t.name, colors: t.colors })}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '16px' }}>
                  <span className={styles.tcName} style={{ fontSize: '14px' }}>{t.name}</span>
                  {theme.presetName === t.name && <Check size={16} color="var(--primary)" />}
                </div>
                <div className={styles.tcColors} style={{ gap: '8px', width: '100%' }}>
                  {Object.values(t.colors).map((c, j) => (
                    <span key={j} style={{ backgroundColor: c as string, width: '24px', height: '24px', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }}></span>
                  ))}
                </div>
              </div>
            ))}

            <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>Custom Colors</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['primary', 'secondary', 'background', 'text'].map(key => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <ColorPickerPopover 
                      value={theme.colors?.[key as keyof typeof theme.colors] || '#000000'} 
                      onChange={(val) => updateTheme({ presetName: 'Custom', colors: { ...theme.colors, [key]: val } as any })}
                      size="sm"
                    />
                    <span style={{ fontSize: '13px', fontWeight: 500, textTransform: 'capitalize' }}>{key}</span>
                  </div>
                  <input 
                    type="text" 
                    value={theme.colors?.[key as keyof typeof theme.colors] || '#000000'}
                    onChange={(e) => updateTheme({ presetName: 'Custom', colors: { ...theme.colors, [key]: e.target.value } as any })}
                    style={{ width: '70px', fontSize: '12px', padding: '4px 8px', border: '1px solid var(--border-color)', borderRadius: '4px', fontFamily: 'monospace' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      ) : isTypographyWidgetOpen ? (
        <>
          <div className={styles.panelHeader}>
            <div className={styles.phLeft}>
              <button className={styles.iconBtn} onClick={() => setTypographyWidgetOpen(false)}>
                <ChevronRight size={20} className={styles.backIcon} />
              </button>
              <h3 className={styles.fw600}>Typography</h3>
            </div>
          </div>
          <div className={styles.propContent} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {fonts.map((t, i) => (
              <div 
                key={i} 
                className={`${styles.themeCard} ${theme.typography?.headingFont === t.style.fontFamily ? styles.tcActive : ''}`}
                style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                onClick={() => updateTheme({ typography: { ...theme.typography, headingFont: t.style.fontFamily, bodyFont: t.style.fontFamily } })}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', width: '32px', textAlign: 'center', color: 'var(--text-main)', ...t.style }}>Ag</div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>{t.name}</span>
                  </div>
                </div>
                {theme.typography?.headingFont === t.style.fontFamily && <Check size={16} color="var(--primary)" />}
              </div>
            ))}

            <div 
              className={styles.themeCard} 
              style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', borderStyle: 'dashed', backgroundColor: '#f8fafc', marginTop: '16px' }}
            >
              <UploadCloud size={24} color="var(--primary)" />
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', display: 'block' }}>Upload Custom Font</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>.ttf or .woff2 files</span>
              </div>
              <button style={{ marginTop: '8px', padding: '6px 12px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '4px', fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: '12px' }}>
                Browse files
              </button>
            </div>
          </div>
        </>
      ) : activeSection && sectionConfig ? (
        /* ======= NEW CONFIG-DRIVEN EDITOR ======= */
        <>
          <div className={styles.panelHeader}>
            <div className={styles.phLeft}>
              <button className={styles.iconBtn} onClick={closeRightSidebar}>
                <ChevronRight size={20} className={styles.backIcon} />
              </button>
              <h3 className={styles.fw600}>{activeSection.name}</h3>
            </div>
            <MoreVertical size={20} className={styles.moreIcon} />
          </div>

          <TabRenderer
            tabs={sectionConfig.getTabs(
              activeSection.props?.selectedLayout || sectionConfig.layouts?.[0]?.id,
              activeSection.props
            )}
            layouts={sectionConfig.layouts}
            props={activeSection.props || {}}
            onPropChange={handlePropChange}
            sectionName={activeSection.name}
            sectionId={activeSection.id}
            sectionType={activeSection.type}
          />

          {activeSection.isHidden && (
            <div style={{ margin: '16px', padding: '12px', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #ffeeba' }}>
              <EyeOff size={16} style={{ flexShrink: 0 }} />
              <span>This section is currently hidden.</span>
            </div>
          )}
        </>
      ) : activeSection && editorConfig ? (
        /* ======= LEGACY FLAT EDITOR (fallback for unmigrated sections) ======= */
        <>
          <div className={styles.panelHeader}>
            <div className={styles.phLeft}>
              <button className={styles.iconBtn} onClick={closeRightSidebar}>
                <ChevronRight size={20} className={styles.backIcon} />
              </button>
              <h3 className={styles.fw600}>{activeSection.name}</h3>
            </div>
            <MoreVertical size={20} className={styles.moreIcon} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border-color)', background: '#f8fafc' }}>
            <button onClick={() => scrollTabs('left')} style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}>
              <ChevronLeft size={16} />
            </button>
            <div 
              ref={tabsRef}
              className={styles.propTabs} 
              style={{ overflowX: 'auto', flexWrap: 'nowrap', borderBottom: 'none' }}
            >
              {[
                { id: 'content', label: 'Content' },
                { id: 'design', label: 'Design' },
                { id: 'visibility', label: 'Visibility' },
                { id: 'advanced', label: 'Advanced' },
                { id: 'abtest', label: 'A/B test' },
                { id: 'personalize', label: 'Personalize' },
              ].map(tab => (
                <div
                  key={tab.id}
                  className={`${styles.propTab} ${activeEditorTab === tab.id ? styles.activePropTab : ''}`}
                  onClick={() => setActiveEditorTab(tab.id as any)}
                  style={{ flex: '0 0 auto', padding: '12px 16px' }}
                >
                  {tab.label}
                </div>
              ))}
            </div>
            <button onClick={() => scrollTabs('right')} style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className={styles.propContent} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeEditorTab === 'content' ? (
              <>
                {editorConfig
                  .filter(f => f.type !== 'color')
                  .map(field => renderField(field))
                }
              </>
            ) : activeEditorTab === 'design' ? (
              <>
                <div className={styles.propSection}>
                  <h4 className={styles.fw600} style={{ marginBottom: '12px' }}>Layout Options</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Content Width</span>
                      <select 
                        className={styles.inputField} 
                        style={{ padding: '8px' }}
                        value={activeSection?.props?.layout?.width || 'full'}
                        onChange={(e) => handlePropChange('layout', { ...activeSection?.props?.layout, width: e.target.value })}
                      >
                        <option value="narrow">Narrow (640px)</option>
                        <option value="standard">Standard (1024px)</option>
                        <option value="wide">Wide (1280px)</option>
                        <option value="full">Full Width (100%)</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className={styles.propSection} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                  <h4 className={styles.fw600} style={{ marginBottom: '12px' }}>Spacing (Padding)</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Top (px)</span>
                      <input 
                        type="number" className={styles.inputField} placeholder="e.g. 64"
                        value={activeSection?.props?.spacing?.paddingTop || ''}
                        onChange={(e) => handlePropChange('spacing', { ...activeSection?.props?.spacing, paddingTop: e.target.value })}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Bottom (px)</span>
                      <input 
                        type="number" className={styles.inputField} placeholder="e.g. 64"
                        value={activeSection?.props?.spacing?.paddingBottom || ''}
                        onChange={(e) => handlePropChange('spacing', { ...activeSection?.props?.spacing, paddingBottom: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.propSection} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                  <h4 className={styles.fw600} style={{ marginBottom: '12px' }}>Section Colors</h4>
                  {editorConfig
                    .filter(f => f.type === 'color')
                    .map(field => renderField(field))
                  }
                  {editorConfig.filter(f => f.type === 'color').length === 0 && (
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>This section uses the global theme colors.</p>
                  )}
                </div>
              </>
            ) : activeEditorTab === 'visibility' ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Devices */}
                <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>
                  <div 
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: visibilitySectionsOpen.devices ? '16px' : '0' }}
                    onClick={() => setVisibilitySectionsOpen(prev => ({ ...prev, devices: !prev.devices }))}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Monitor size={16} />
                      <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px' }}>DEVICES</span>
                    </div>
                    {visibilitySectionsOpen.devices ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                  {visibilitySectionsOpen.devices && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {['desktop', 'tablet', 'mobile'].map((dev) => (
                        <div key={dev} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <button
                            onClick={() => {
                              const currentVis = activeSection?.props?.visibility || {};
                              const devKey = dev as 'desktop' | 'tablet' | 'mobile';
                              const currentVal = currentVis[devKey] !== false;
                              handlePropChange('visibility', { ...currentVis, [devKey]: !currentVal });
                            }}
                            style={{
                              width: '40px', height: '22px', borderRadius: '12px',
                              backgroundColor: (activeSection?.props?.visibility?.[dev as any] !== false) ? 'var(--primary)' : '#e2e8f0',
                              border: 'none', cursor: 'pointer', position: 'relative', transition: 'all 0.2s'
                            }}
                          >
                            <div style={{
                              width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'white',
                              position: 'absolute', top: '3px',
                              left: (activeSection?.props?.visibility?.[dev as any] !== false) ? '21px' : '3px',
                              transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                            }} />
                          </button>
                          <span style={{ fontSize: '14px', textTransform: 'capitalize', color: 'var(--text-main)' }}>{dev}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Schedule */}
                <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>
                  <div 
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: visibilitySectionsOpen.schedule ? '12px' : '0' }}
                    onClick={() => setVisibilitySectionsOpen(prev => ({ ...prev, schedule: !prev.schedule }))}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={16} />
                      <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px' }}>SCHEDULE</span>
                    </div>
                    {visibilitySectionsOpen.schedule ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                  {visibilitySectionsOpen.schedule && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Leave blank to show always. ISO date-time (e.g. 2025-12-31T00:00:00Z).</p>
                      
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', top: '-8px', left: '12px', background: 'white', padding: '0 4px', fontSize: '11px', color: 'var(--text-muted)' }}>Show from</span>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px' }}>
                          <input type="text" placeholder="mm/dd/yyyy, --:-- --" style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px' }} 
                            value={activeSection?.props?.visibility?.showFrom || ''}
                            onChange={(e) => handlePropChange('visibility', { ...activeSection?.props?.visibility, showFrom: e.target.value })}
                          />
                          <Calendar size={16} style={{ color: 'var(--text-main)' }} />
                        </div>
                      </div>

                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', top: '-8px', left: '12px', background: 'white', padding: '0 4px', fontSize: '11px', color: 'var(--text-muted)' }}>Hide after</span>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px' }}>
                          <input type="text" placeholder="mm/dd/yyyy, --:-- --" style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px' }}
                            value={activeSection?.props?.visibility?.hideAfter || ''}
                            onChange={(e) => handlePropChange('visibility', { ...activeSection?.props?.visibility, hideAfter: e.target.value })}
                          />
                          <Calendar size={16} style={{ color: 'var(--text-main)' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Audience */}
                <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>
                  <div 
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: visibilitySectionsOpen.audience ? '12px' : '0' }}
                    onClick={() => setVisibilitySectionsOpen(prev => ({ ...prev, audience: !prev.audience }))}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                      <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px' }}>AUDIENCE</span>
                    </div>
                    {visibilitySectionsOpen.audience ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                  {visibilitySectionsOpen.audience && (
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', top: '-8px', left: '12px', background: 'white', padding: '0 4px', fontSize: '11px', color: 'var(--text-muted)' }}>Show to</span>
                      <select 
                        style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', outline: 'none', fontSize: '14px', appearance: 'none', backgroundColor: 'transparent' }}
                        value={activeSection?.props?.visibility?.audience || 'everyone'}
                        onChange={(e) => handlePropChange('visibility', { ...activeSection?.props?.visibility, audience: e.target.value })}
                      >
                        <option value="everyone">Everyone</option>
                        <option value="logged-in">Logged in users</option>
                        <option value="guests">Guests (not logged in)</option>
                      </select>
                      <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '14px', pointerEvents: 'none', color: 'var(--text-muted)' }} />
                    </div>
                  )}
                </div>

                {/* Segment */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px' }}>SEGMENT</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                      <span style={{ fontSize: '14px', color: 'var(--text-main)' }}>Everyone</span>
                    </div>
                    <Edit2 size={14} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  This tab is coming soon.
                </p>
              </div>
            )}
          </div>

          {activeSection.isHidden && (
            <div style={{ margin: '16px', padding: '12px', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #ffeeba' }}>
              <EyeOff size={16} style={{ flexShrink: 0 }} />
              <span>This section is currently hidden.</span>
            </div>
          )}
        </>
      ) : (
        <>
          <div className={styles.panelHeader}>
            <div className={styles.phLeft}>
              <button className={styles.iconBtn} onClick={closeRightSidebar}>
                <ChevronRight size={20} className={styles.backIcon} />
              </button>
              <h3 className={styles.fw600}>Page Settings</h3>
            </div>
          </div>
          <div className={styles.propContent}>
            <p className={styles.labelSm} style={{textAlign: 'center', marginTop: '40px'}}>
              Select a section to edit its properties, or use the tabs above to manage global page settings.
            </p>
          </div>
        </>
      )}
    </aside>
  );
};
