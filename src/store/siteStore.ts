import { create } from 'zustand';
import { defaultPropsMap, sectionNameMap } from '../components/editor/SectionRenderer';

export interface SectionData {
  id: string;
  type: string;
  name: string;
  props: Record<string, any>;
  isHidden: boolean;
}

export interface PageData {
  id: string;
  name: string;
  path: string;
  type: 'System' | 'Custom';
  sections: SectionData[];
}

export interface ThemeData {
  presetName: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  typography: {
    fontFamily: string;
  };
}

export interface SiteState {
  pages: PageData[];
  theme: ThemeData;
  settings: Record<string, any>;
  isLoading: boolean;
  
  loadStore: () => Promise<void>;
  saveStore: () => Promise<void>;
  
  updateSectionProps: (pageId: string, sectionId: string, newProps: Record<string, any>) => void;
  reorderSections: (pageId: string, startIndex: number, endIndex: number) => void;
  toggleSectionVisibility: (pageId: string, sectionId: string) => void;
  addSection: (pageId: string, sectionType: string, insertIndex?: number) => void;
  removeSection: (pageId: string, sectionId: string) => void;
  updatePageProps: (pageId: string, newProps: Partial<PageData>) => void;
  addPage: (name: string, path: string) => void;
  updateTheme: (newTheme: Partial<ThemeData>) => void;
  updateSettings: (newSettings: Record<string, any>) => void;
}

// Helper to create a section with default props
const createSection = (id: string, type: string, overrides?: Partial<SectionData>): SectionData => ({
  id,
  type,
  name: sectionNameMap[type] || type.replace(/([A-Z])/g, ' $1').trim(),
  isHidden: false,
  props: { ...(defaultPropsMap[type] || {}) },
  ...overrides,
});

// Initial mock data — Home page is a full showcase of all section types
const initialPages: PageData[] = [
  {
    id: 'landing-page',
    name: 'Home page',
    path: '/',
    type: 'System',
    sections: [
      createSection('announcement-bar-landing', 'AnnouncementBar', { isHidden: true }),
      createSection('header-landing', 'Header'),
      createSection('sec-hero', 'HeroBanner'),
      createSection('sec-logos', 'LogoList'),
      createSection('sec-feat', 'FeaturedCollection'),
      createSection('sec-imgtext', 'ImageWithText'),
      createSection('sec-richtext', 'RichText'),
      createSection('sec-testimonials', 'Testimonials'),
      createSection('sec-video', 'Video'),
      createSection('sec-blog', 'BlogPosts'),
      createSection('sec-gallery', 'Gallery'),
      createSection('sec-newsletter', 'Newsletter'),
      createSection('sec-faq', 'FAQ'),
      createSection('sec-pricing', 'PricingTable'),
      createSection('sec-contact', 'ContactForm'),
      createSection('sec-map', 'Map'),
      createSection('footer-landing', 'Footer'),
    ]
  },
  {
    id: 'products-showcase',
    name: 'Products showcase',
    path: '/collections/all',
    type: 'System',
    sections: [
      createSection('announcement-bar-sys', 'AnnouncementBar', { isHidden: true }),
      createSection('header-sys', 'Header'),
      createSection('hero-1', 'HeroBanner', { props: { ...defaultPropsMap.HeroBanner, heading: 'Shop Our Collections', badge: 'Shop Now' } }),
      createSection('collection-1', 'FeaturedCollection'),
      createSection('sec-imgtext-sys', 'ImageWithText'),
      createSection('sec-testimonials-sys', 'Testimonials'),
      createSection('footer-sys', 'Footer'),
    ]
  },
  {
    id: 'about-page',
    name: 'About page',
    path: '/about',
    type: 'System',
    sections: [
      createSection('announcement-bar-about', 'AnnouncementBar', { isHidden: true }),
      createSection('header-about', 'Header'),
      createSection('hero-2', 'HeroBanner', { props: { ...defaultPropsMap.HeroBanner, heading: 'Our Story', description: 'We started with a simple idea: make great design accessible to everyone.', layout: 'center' } }),
      createSection('sec-richtext-about', 'RichText'),
      createSection('sec-gallery-about', 'Gallery'),
      createSection('sec-logos-about', 'LogoList'),
      createSection('footer-about', 'Footer'),
    ]
  },
  {
    id: 'page-4',
    name: 'Contact',
    path: '/contact',
    type: 'System',
    sections: [
      createSection('announcement-bar-contact', 'AnnouncementBar', { isHidden: true }),
      createSection('header-contact', 'Header'),
      createSection('sec-contact-page', 'ContactForm'),
      createSection('sec-map-contact', 'Map'),
      createSection('sec-faq-contact', 'FAQ'),
      createSection('footer-contact', 'Footer'),
    ]
  },
  {
    id: 'page-5',
    name: 'FAQ',
    path: '/faq',
    type: 'System',
    sections: [
      createSection('announcement-bar-faq', 'AnnouncementBar', { isHidden: true }),
      createSection('header-faq', 'Header'),
      createSection('sec-faq-page', 'FAQ', { props: { ...defaultPropsMap.FAQ, heading: 'Frequently Asked Questions' } }),
      createSection('sec-contact-faq', 'ContactForm', { props: { ...defaultPropsMap.ContactForm, heading: 'Still Have Questions?', description: 'Can\'t find what you\'re looking for? Send us a message.' } }),
      createSection('footer-faq', 'Footer'),
    ]
  }
];

export const useSiteStore = create<SiteState>((set, get) => ({
  pages: initialPages,
  theme: {
    presetName: 'Default',
    colors: {
      primary: '#198754',
      secondary: '#ff6b00',
      background: '#ffffff',
      text: '#0f172a'
    },
    typography: {
      fontFamily: 'Inter, sans-serif'
    }
  },
  settings: {
    siteName: 'BillionBiz',
    tagline: 'Build, Launch & Grow Your Business',
    description: 'Build stunning websites, launch your store, and grow your business with BillionBiz.',
    language: 'English',
    announcement: 'Free shipping on orders above $99',
    copyright: '© 2025 BillionBiz. All rights reserved.'
  },
  isLoading: false,

  loadStore: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('http://localhost:4000/api/store');
      if (res.ok) {
        const data = await res.json();
        if (data.pages && data.pages.length > 0) {
          set({ pages: data.pages, theme: data.theme || {}, settings: data.settings || {} });
        }
      }
    } catch (e) {
      console.warn('Failed to load from backend, using default mock data.');
    } finally {
      set({ isLoading: false });
    }
  },

  saveStore: async () => {
    const { pages, theme, settings } = get();
    try {
      await fetch('http://localhost:4000/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pages, theme, settings })
      });
    } catch (e) {
      console.error('Failed to save to backend');
    }
  },

  updateSectionProps: (pageId, sectionId, newProps) => set((state) => {
    const pages = state.pages.map(page => {
      if (page.id !== pageId) return page;
      return {
        ...page,
        sections: page.sections.map(sec => 
          sec.id === sectionId ? { ...sec, props: { ...sec.props, ...newProps } } : sec
        )
      };
    });
    return { pages };
  }),

  reorderSections: (pageId, startIndex, endIndex) => set((state) => {
    const pages = state.pages.map(page => {
      if (page.id !== pageId) return page;
      const sections = Array.from(page.sections);
      const [removed] = sections.splice(startIndex, 1);
      sections.splice(endIndex, 0, removed);
      return { ...page, sections };
    });
    return { pages };
  }),

  toggleSectionVisibility: (pageId, sectionId) => set((state) => {
    const pages = state.pages.map(page => {
      if (page.id !== pageId) return page;
      return {
        ...page,
        sections: page.sections.map(sec => 
          sec.id === sectionId ? { ...sec, isHidden: !sec.isHidden } : sec
        )
      };
    });
    return { pages };
  }),

  addSection: (pageId, sectionType, insertIndex) => set((state) => {
    const pages = state.pages.map(page => {
      if (page.id !== pageId) return page;
      const newSection = createSection(`sec-${Date.now()}`, sectionType);
      
      const sections = [...page.sections];
      
      if (insertIndex !== undefined && insertIndex !== null) {
        sections.splice(insertIndex, 0, newSection);
      } else {
        const footerIndex = sections.findIndex(s => s.type === 'Footer');
        if (footerIndex !== -1) {
          sections.splice(footerIndex, 0, newSection);
        } else {
          sections.push(newSection);
        }
      }
      
      return { ...page, sections };
    });
    return { pages };
  }),

  removeSection: (pageId, sectionId) => set((state) => {
    const pages = state.pages.map(page => {
      if (page.id !== pageId) return page;
      return {
        ...page,
        sections: page.sections.filter(sec => sec.id !== sectionId)
      };
    });
    return { pages };
  }),

  updatePageProps: (pageId, newProps) => set((state) => {
    const pages = state.pages.map(page => 
      page.id === pageId ? { ...page, ...newProps } : page
    );
    return { pages };
  }),

  addPage: (name, path) => set((state) => {
    const newPage: PageData = {
      id: `page-${Date.now()}`,
      name,
      path,
      type: 'Custom',
      sections: [
        createSection(`announcement-bar-${Date.now()}`, 'AnnouncementBar', { isHidden: true }),
        createSection(`header-${Date.now()}`, 'Header'),
        createSection(`sec-hero-${Date.now()}`, 'HeroBanner', { props: { ...defaultPropsMap.HeroBanner, heading: name } }),
        createSection(`footer-${Date.now()}`, 'Footer'),
      ]
    };
    return { pages: [...state.pages, newPage] };
  }),

  updateTheme: (newTheme) => set((state) => ({
    theme: { ...state.theme, ...newTheme }
  })),

  updateSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings }
  }))
}));
