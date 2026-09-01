import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
  seoTitle?: string;
  seoDescription?: string;
  sections: SectionData[];
}

export interface ThemeData {
  presetName: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
    border: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    baseSize: number;
  };
  ui: {
    borderRadius: string;
    shadow: string;
    buttonHover: string;
    glassmorphism: boolean;
  };
  layout: {
    maxWidth: number;
  };
  animation: {
    enableScrollReveal: boolean;
  };
}

export interface SiteState {
  pages: PageData[];
  theme: ThemeData;
  settings: Record<string, any>;
  isLoading: boolean;
  
  updateSectionProps: (pageId: string, sectionId: string, newProps: Record<string, any>) => void;
  reorderSections: (pageId: string, startIndex: number, endIndex: number) => void;
  toggleSectionVisibility: (pageId: string, sectionId: string) => void;
  addSection: (pageId: string, sectionType: string, insertIndex?: number) => void;
  removeSection: (pageId: string, sectionId: string) => void;
  duplicateSection: (pageId: string, sectionId: string) => void;
  updatePageProps: (pageId: string, newProps: Partial<PageData>) => void;
  addPage: (name: string, path: string) => void;
  removePage: (pageId: string) => void;
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

// Initial mock data — Full showcase of all section types and pages
const initialPages: PageData[] = [
  {
    id: 'landing-page',
    name: 'Home page',
    path: '/',
    type: 'System',
    seoTitle: 'BillionBiz | Build, Launch & Grow Your Business',
    seoDescription: 'The best platform to launch your store.',
    sections: [
      createSection('announcement-bar', 'AnnouncementBar'),
      createSection('utility-bar', 'UtilityBar'),
      createSection('header-main', 'Header'),
      createSection('footer-menu', 'FooterMenu'),
      createSection('footer-text', 'FooterText'),
      createSection('footer-main', 'Footer'),
    ]
  },
  {
    id: 'products-list',
    name: 'Products List',
    path: '/collections/all',
    type: 'System',
    seoTitle: 'All Products - BillionBiz',
    sections: [
      createSection('announcement-bar-sys', 'AnnouncementBar'),
      createSection('utility-bar-sys', 'UtilityBar'),
      createSection('header-sys', 'Header'),
      createSection('footer-menu-sys', 'FooterMenu'),
      createSection('footer-text-sys', 'FooterText'),
      createSection('footer-sys', 'Footer'),
    ]
  },
  {
    id: 'product-details',
    name: 'Product Details',
    path: '/products/sample',
    type: 'System',
    seoTitle: 'Product Name - BillionBiz',
    sections: [
      createSection('header-prod', 'Header'),
      createSection('footer-prod', 'Footer'),
    ]
  },
  {
    id: 'cart-page',
    name: 'Cart',
    path: '/cart',
    type: 'System',
    seoTitle: 'Your Cart - BillionBiz',
    sections: [
      createSection('header-cart', 'Header'),
      createSection('footer-cart', 'Footer'),
    ]
  },
  {
    id: 'checkout-page',
    name: 'Checkout',
    path: '/checkout',
    type: 'System',
    seoTitle: 'Checkout - BillionBiz',
    sections: [
      createSection('header-checkout', 'Header'),
      createSection('footer-checkout', 'Footer'),
    ]
  },
  {
    id: 'about-page',
    name: 'About Us',
    path: '/about',
    type: 'System',
    seoTitle: 'About Us - BillionBiz',
    sections: [
      createSection('announcement-bar-about', 'AnnouncementBar'),
      createSection('header-about', 'Header'),
      createSection('footer-about', 'Footer'),
    ]
  },
  {
    id: 'contact-page',
    name: 'Contact Us',
    path: '/contact',
    type: 'System',
    seoTitle: 'Contact Us - BillionBiz',
    sections: [
      createSection('announcement-bar-contact', 'AnnouncementBar'),
      createSection('header-contact', 'Header'),
      createSection('footer-contact', 'Footer'),
    ]
  },
  {
    id: 'faq-page',
    name: 'FAQ',
    path: '/faq',
    type: 'System',
    seoTitle: 'FAQ - BillionBiz',
    sections: [
      createSection('announcement-bar-faq', 'AnnouncementBar'),
      createSection('header-faq', 'Header'),
      createSection('footer-faq', 'Footer'),
    ]
  },
  {
    id: 'privacy-policy-page',
    name: 'Privacy Policy',
    path: '/policies/privacy',
    type: 'System',
    seoTitle: 'Privacy Policy - BillionBiz',
    sections: [
      createSection('header-privacy', 'Header'),
      createSection('footer-privacy', 'Footer'),
    ]
  },
  {
    id: 'terms-conditions-page',
    name: 'Terms & Conditions',
    path: '/policies/terms',
    type: 'System',
    seoTitle: 'Terms & Conditions - BillionBiz',
    sections: [
      createSection('header-terms', 'Header'),
      createSection('footer-terms', 'Footer'),
    ]
  },
  {
    id: 'refund-policy-page',
    name: 'Refund Policy',
    path: '/policies/refunds',
    type: 'System',
    seoTitle: 'Refund Policy - BillionBiz',
    sections: [
      createSection('header-refunds', 'Header'),
      createSection('footer-refunds', 'Footer'),
    ]
  }
];

export const useSiteStore = create<SiteState>()(
  persist(
    (set) => ({
      pages: initialPages,
  theme: {
    presetName: 'Default',
    colors: {
      primary: '#198754',
      secondary: '#ff6b00',
      background: '#ffffff',
      text: '#0f172a',
      accent: '#facc15',
      border: '#e2e8f0'
    },
    typography: {
      headingFont: 'Outfit, sans-serif',
      bodyFont: 'Inter, sans-serif',
      baseSize: 16
    },
    ui: {
      borderRadius: '8px',
      shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      buttonHover: 'lift',
      glassmorphism: false
    },
    layout: {
      maxWidth: 1200
    },
    animation: {
      enableScrollReveal: false
    }
  },
  settings: {
    siteName: 'BillionBiz',
    tagline: 'Build, Launch & Grow Your Business',
    description: 'Build stunning websites, launch your store, and grow your business with BillionBiz.',
    language: 'English',
    announcement: 'Free shipping on orders above $99',
    copyright: '© 2025 BillionBiz. All rights reserved.',
    showBottomNav: true,
    bottomNavLinks: [
      { id: 'home', icon: 'Home', text: 'Home', link: '/' },
      { id: 'shop', icon: 'Grid', text: 'Shop', link: '/collections/all' },
      { id: 'cart', icon: 'ShoppingCart', text: 'Cart', link: '/cart' },
      { id: 'profile', icon: 'User', text: 'Profile', link: '/profile' }
    ]
  },
  isLoading: false,

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

  duplicateSection: (pageId, sectionId) => set((state) => {
    const pages = state.pages.map(page => {
      if (page.id !== pageId) return page;
      const sectionIndex = page.sections.findIndex(sec => sec.id === sectionId);
      if (sectionIndex === -1) return page;
      const original = page.sections[sectionIndex];
      const duplicate: SectionData = {
        ...original,
        id: `sec-${Date.now()}`,
        name: `${original.name} (Copy)`,
        props: JSON.parse(JSON.stringify(original.props)),
      };
      const sections = [...page.sections];
      sections.splice(sectionIndex + 1, 0, duplicate);
      return { ...page, sections };
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
        createSection(`announcement-bar-${Date.now()}`, 'AnnouncementBar'),
        createSection(`utility-bar-${Date.now()}`, 'UtilityBar'),
        createSection(`header-${Date.now()}`, 'Header'),
        createSection(`footer-${Date.now()}`, 'Footer'),
      ]
    };
    return { pages: [...state.pages, newPage] };
  }),

  removePage: (pageId) => set((state) => ({
    pages: state.pages.filter(page => page.id !== pageId)
  })),

  updateTheme: (newTheme) => set((state) => ({
    theme: { ...state.theme, ...newTheme }
  })),

  updateSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings }
  }))
    }),
    {
      name: 'billionbiz-storage-v3',
    }
  )
);
