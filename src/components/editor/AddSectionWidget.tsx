import React, { useState, useEffect } from 'react';
import { X, Search, HelpCircle, FileText, MapPin, Grid, MessageSquare, LayoutTemplate, Share2, ShoppingBag } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { useSiteStore } from '../../store/siteStore';
import styles from '../../pages/editor/EditorLayout.module.css';

export const AddSectionWidget: React.FC = () => {
  const { isAddSectionWidgetOpen, setAddSectionWidgetOpen, selectedPageId, insertIndex, setInsertIndex } = useEditorStore();
  const { pages, addSection } = useSiteStore();
  const [activeCategory, setActiveCategory] = useState('All Sections');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle ESC key press to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAddSectionWidgetOpen) setAddSectionWidgetOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAddSectionWidgetOpen, setAddSectionWidgetOpen]);

  if (!isAddSectionWidgetOpen) return null;

  const activePage = pages.find(p => p.id === selectedPageId) || pages[0];

  const categories = [
    { name: 'All Sections', icon: HelpCircle },
    { name: 'Hero', icon: LayoutTemplate },
    { name: 'Products', icon: ShoppingBag },
    { name: 'Navigation', icon: MapPin },
    { name: 'Content', icon: FileText },
    { name: 'Social Proof', icon: Share2 },
    { name: 'Contact', icon: MessageSquare },
  ];

  const sectionOptions = [
    { type: 'HeroBanner', name: 'Hero Banner', desc: 'Standard hero banner', category: 'Hero', tags: ['hero', 'banner'], badges: [], img: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=200&fit=crop' },
    { type: 'HeroCarousel', name: 'Hero Carousel', desc: 'Multi-slide hero banner', category: 'Hero', tags: ['carousel', 'banner', '3 variants'], badges: [], img: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=200&fit=crop' },
    { type: 'FeaturedCollection', name: 'Dynamic Showcase', desc: 'Smart Grid/Carousel', category: 'Products', tags: ['carousel', 'grid'], badges: ['NEW'], img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=200&fit=crop' },
    { type: 'CategoryList', name: 'Category List', desc: 'List product categories', category: 'Products', tags: ['categories', 'grid'], badges: [], img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=200&fit=crop' },
    { type: 'Newsletter', name: 'Newsletter Signup', desc: 'Email signup banner', category: 'Navigation', tags: ['announcement', 'banner', '3 variants'], badges: [], img: 'https://images.unsplash.com/photo-1555529771-835f59fc5efe?w=400&h=200&fit=crop' },
    { type: 'Testimonials', name: 'Testimonials', desc: 'Show customer reviews', category: 'Social Proof', tags: ['reviews', 'social', '3 variants'], badges: [], img: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&h=200&fit=crop' },
    { type: 'ImageWithText', name: 'Image with Text', desc: 'Text side-by-side with an image.', category: 'Content', tags: ['image', 'text'], badges: [], img: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=400&h=200&fit=crop' },
    { type: 'Video', name: 'Video Player', desc: 'Embed a YouTube or Vimeo player.', category: 'Content', tags: ['video', 'media'], badges: [], img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=200&fit=crop' },
    { type: 'RichText', name: 'Rich Text', desc: 'A simple block of formatted text.', category: 'Content', tags: ['text', 'typography'], badges: [], img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=200&fit=crop' },
    { type: 'FAQ', name: 'FAQ Accordion', desc: 'Frequently asked questions.', category: 'Content', tags: ['faq', 'accordion'], badges: [], img: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=200&fit=crop' },
    { type: 'ContactForm', name: 'Contact Form', desc: 'Let customers get in touch.', category: 'Contact', tags: ['form', 'contact'], badges: [], img: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=400&h=200&fit=crop' },
    { type: 'BlogPosts', name: 'Latest Articles', desc: 'Latest articles from your blog.', category: 'Content', tags: ['blog', 'news'], badges: [], img: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&h=200&fit=crop' },
    { type: 'LogoList', name: 'Brand Marquee', desc: 'Logos of brands or partners.', category: 'Social Proof', tags: ['logos', 'marquee'], badges: [], img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=200&fit=crop' },
  ];

  const filteredSections = sectionOptions.filter(opt => {
    const matchesCategory = activeCategory === 'All Sections' || opt.category === activeCategory;
    const matchesSearch = opt.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAdd = (type: string) => {
    if (activePage) {
      addSection(activePage.id, type, insertIndex !== null ? insertIndex : undefined);
      setInsertIndex(null);
      setAddSectionWidgetOpen(false);
    }
  };

  return (
    <div className={styles.fullscreenModalOverlay} onClick={() => setAddSectionWidgetOpen(false)}>
      <div className={styles.libraryModal} onClick={(e) => e.stopPropagation()}>
        
        {/* Header Area */}
        <div style={{ padding: '24px 32px 0 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top Row: Icon, Title, Close */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <HelpCircle size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Section Library</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Browse all available section types</p>
              </div>
            </div>
            <button onClick={() => setAddSectionWidgetOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <X size={24} />
            </button>
          </div>

          {/* Main Tabs */}
          <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#10b981', paddingBottom: '12px', borderBottom: '2px solid #10b981', cursor: 'pointer' }}>All sections</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', paddingBottom: '12px', cursor: 'pointer' }}>My snippets</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', paddingBottom: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HelpCircle size={14} /> Start from template
            </div>
          </div>
        </div>

        {/* Toolbar & Categories */}
        <div style={{ padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '24px', borderBottom: '1px solid var(--border-color)' }}>
          {/* Search */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '8px 16px', width: '280px' }}>
              <Search size={16} color="var(--text-muted)" style={{ marginRight: '8px' }} />
              <input 
                type="text" 
                placeholder="Search sections... (Press / to focus)" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', width: '100%' }}
              />
            </div>
            <button style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#eedeff', color: '#8b5cf6', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Grid size={16} />
            </button>
          </div>

          {/* Horizontal Categories */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', overflowX: 'auto', flex: 1, paddingBottom: '4px' }}>
            {categories.map((cat, idx) => (
              <div 
                key={idx}
                onClick={() => setActiveCategory(cat.name)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', whiteSpace: 'nowrap',
                  padding: '8px 12px', borderRadius: '24px',
                  backgroundColor: activeCategory === cat.name ? '#ecfdf5' : 'transparent',
                  color: activeCategory === cat.name ? '#10b981' : 'var(--text-main)',
                  fontWeight: activeCategory === cat.name ? 700 : 500,
                  fontSize: '14px'
                }}
              >
                <cat.icon size={16} color={activeCategory === cat.name ? '#10b981' : 'var(--text-muted)'} />
                {cat.name}
              </div>
            ))}
          </div>
        </div>

        {/* Subheader: Counts & Filters */}
        <div style={{ padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>Showing {filteredSections.length} sections</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, padding: '4px 10px', border: '1px solid #e2e8f0', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>🔥 6 Popular</span>
            <span style={{ fontSize: '12px', fontWeight: 700, padding: '4px 10px', border: '1px solid #e2e8f0', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>🆕 71 New</span>
          </div>
        </div>

        {/* Grid Area */}
        <div style={{ flex: 1, padding: '0 32px 32px 32px', overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {filteredSections.map((opt, i) => (
              <div 
                key={i} 
                onClick={() => handleAdd(opt.type)}
                style={{ display: 'flex', flexDirection: 'column', gap: '12px', cursor: 'pointer' }}
              >
                {/* Image Preview Card */}
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', backgroundColor: '#f1f5f9', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', padding: '16px', transition: 'box-shadow 0.2s', ...({ '&:hover': { boxShadow: 'var(--shadow-md)' } } as any) }}>
                  
                  {opt.badges.map(b => (
                    <span key={b} style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: '#ec4899', color: 'white', fontSize: '10px', fontWeight: 800, padding: '4px 8px', borderRadius: '12px', zIndex: 2 }}>{b}</span>
                  ))}
                  
                  <div style={{ display: 'flex', gap: '4px', position: 'absolute', top: '12px', right: '12px', zIndex: 2 }}>
                     <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.2)' }}></span>
                     <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.2)' }}></span>
                     <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.2)' }}></span>
                  </div>

                  <img src={opt.img} alt={opt.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                </div>

                {/* Info Text */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <HelpCircle size={14} color="#8b5cf6" />
                    <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>{opt.name}</span>
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{opt.desc}</span>
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {opt.tags.map((t, tidx) => (
                    <span key={tidx} style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '12px', border: '1px solid #e2e8f0', color: tidx === 2 ? '#8b5cf6' : 'var(--text-muted)', backgroundColor: tidx === 2 ? '#f3e8ff' : 'transparent' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Area */}
        <div style={{ padding: '16px 32px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>Click a section to add it instantly:</span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Press ESC to close</span>
        </div>

      </div>
    </div>
  );
};
