import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Plus, Palette, Type, Settings, Eye, 
  UploadCloud, Layers, Monitor, Tablet, Smartphone, 
  Columns, FileText, CheckCircle2, X, Command
} from 'lucide-react';
import { useLandingEditorStore } from '../../../store/landingEditorStore';
import { useSiteStore } from '../../../store/siteStore';
import styles from './topbar.module.css';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onPublish: () => void;
  onPreview: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onPublish,
  onPreview,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    setActivePanel,
    setAddSectionWidgetOpen,
    setSelectedThemeCategory,
    setDevice,
    setSelectedSectionId,
    selectedPageId,
    setActiveSettingItem,
  } = useLandingEditorStore();

  const { pages } = useSiteStore();
  const activePage = pages.find((p) => p.id === selectedPageId) || pages[0];

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Accessible features list
  const features = [
    {
      id: 'add-section',
      title: 'Add Section to Page',
      badge: 'Editor',
      icon: <Plus size={15} color="#10b981" />,
      action: () => {
        setActivePanel('editor');
        setAddSectionWidgetOpen(true);
        onClose();
      },
    },
    {
      id: 'theme-colors',
      title: 'Theme Color Palette',
      badge: 'Theme',
      icon: <Palette size={15} color="#8b5cf6" />,
      action: () => {
        setActivePanel('theme');
        setSelectedThemeCategory('colors');
        onClose();
      },
    },
    {
      id: 'theme-typography',
      title: 'Typography & Fonts',
      badge: 'Theme',
      icon: <Type size={15} color="#3b82f6" />,
      action: () => {
        setActivePanel('theme');
        setSelectedThemeCategory('typography');
        onClose();
      },
    },
    {
      id: 'pages-manager',
      title: 'Manage Site Pages',
      badge: 'Navigation',
      icon: <FileText size={15} color="#f59e0b" />,
      action: () => {
        setActivePanel('pages');
        onClose();
      },
    },
    {
      id: 'site-settings',
      title: 'Site & Store Settings',
      badge: 'Settings',
      icon: <Settings size={15} color="#64748b" />,
      action: () => {
        setActivePanel('settings');
        setActiveSettingItem('General');
        onClose();
      },
    },
    {
      id: 'seo-settings',
      title: 'SEO & Social Sharing',
      badge: 'Settings',
      icon: <CheckCircle2 size={15} color="#059669" />,
      action: () => {
        setActivePanel('settings');
        setActiveSettingItem('SEO');
        onClose();
      },
    },
    {
      id: 'view-desktop',
      title: 'Switch to Desktop View',
      badge: 'Viewport',
      icon: <Monitor size={15} color="#475569" />,
      action: () => {
        setDevice('desktop');
        onClose();
      },
    },
    {
      id: 'view-tablet',
      title: 'Switch to Tablet View',
      badge: 'Viewport',
      icon: <Tablet size={15} color="#475569" />,
      action: () => {
        setDevice('tablet');
        onClose();
      },
    },
    {
      id: 'view-mobile',
      title: 'Switch to Mobile View',
      badge: 'Viewport',
      icon: <Smartphone size={15} color="#475569" />,
      action: () => {
        setDevice('mobile');
        onClose();
      },
    },
    {
      id: 'view-all',
      title: 'Switch to All Devices Responsive View',
      badge: 'Viewport',
      icon: <Columns size={15} color="#475569" />,
      action: () => {
        setDevice('all');
        onClose();
      },
    },
    {
      id: 'save-site',
      title: 'Save Current Changes',
      badge: 'Action',
      icon: <CheckCircle2 size={15} color="#059669" />,
      action: () => {
        onSave();
        onClose();
      },
    },
    {
      id: 'preview-site',
      title: 'Preview Live Storefront',
      badge: 'Action',
      icon: <Eye size={15} color="#2563eb" />,
      action: () => {
        onPreview();
        onClose();
      },
    },
    {
      id: 'publish-site',
      title: 'Publish Storefront',
      badge: 'Action',
      icon: <UploadCloud size={15} color="#16a34a" />,
      action: () => {
        onPublish();
        onClose();
      },
    },
  ];

  // Sections added in current editor page
  const currentSections = activePage?.sections || [];

  const handleSelectSection = (sectionId: string) => {
    setActivePanel('editor');
    setSelectedSectionId(sectionId);
    useLandingEditorStore.setState({ isRightSidebarOpen: true, activeSectionTab: 'content' });
    onClose();
  };

  const filteredFeatures = features.filter((f) =>
    f.title.toLowerCase().includes(query.toLowerCase()) ||
    f.badge.toLowerCase().includes(query.toLowerCase())
  );

  const filteredSections = currentSections.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.type.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className={styles.commandPaletteOverlay} onClick={onClose}>
      <div 
        className={styles.commandPaletteBox} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className={styles.commandInputContainer}>
          <Search size={18} color="#94a3b8" />
          <input
            ref={inputRef}
            type="text"
            className={styles.commandInput}
            placeholder="Search features, tools, or sections added in editor..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
            >
              <X size={16} />
            </button>
          )}
          <div className={styles.shortcutKey}>ESC</div>
        </div>

        {/* Results List */}
        <div className={styles.commandList}>
          {/* Group 1: Accessible Features & Tools */}
          {filteredFeatures.length > 0 && (
            <div className={styles.commandGroup}>
              <div className={styles.commandGroupTitle}>Features & Tools</div>
              {filteredFeatures.map((item) => (
                <button
                  key={item.id}
                  className={styles.commandItem}
                  onClick={item.action}
                >
                  <div className={styles.commandItemLeft}>
                    {item.icon}
                    <span>{item.title}</span>
                  </div>
                  <span className={styles.commandItemBadge}>{item.badge}</span>
                </button>
              ))}
            </div>
          )}

          {/* Group 2: Sections Added in the Editor */}
          {filteredSections.length > 0 && (
            <div className={styles.commandGroup}>
              <div className={styles.commandGroupTitle}>
                Sections on {activePage?.name || 'Page'} ({currentSections.length})
              </div>
              {filteredSections.map((section, index) => (
                <button
                  key={section.id}
                  className={styles.commandItem}
                  onClick={() => handleSelectSection(section.id)}
                >
                  <div className={styles.commandItemLeft}>
                    <Layers size={14} color="#6366f1" />
                    <span>
                      {section.name || section.type}
                    </span>
                    {section.isHidden && (
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>(Hidden)</span>
                    )}
                  </div>
                  <span className={styles.commandItemBadge}>
                    Section #{index + 1} • Click to jump
                  </span>
                </button>
              ))}
            </div>
          )}

          {filteredFeatures.length === 0 && filteredSections.length === 0 && (
            <div style={{ padding: '30px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
              No tools or sections found matching "{query}".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.commandFooter}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Command size={13} />
            <span>Select section to jump and inspect in canvas</span>
          </div>
          <span>BillionBiz Command Palette</span>
        </div>
      </div>
    </div>
  );
};
