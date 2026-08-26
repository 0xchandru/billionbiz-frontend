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
    id: 'products-list',
    name: 'Products List',
    path: '/collections/all',
    type: 'System',
    seoTitle: 'All Products - BillionBiz',
    sections: [
      createSection('announcement-bar-sys', 'AnnouncementBar', { isHidden: true }),
      createSection('header-sys', 'Header'),
      createSection('hero-1', 'HeroBanner', { props: { ...defaultPropsMap.HeroBanner, heading: 'Shop Our Collections', badge: 'Shop Now' } }),
      createSection('collection-1', 'FeaturedCollection'),
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
      createSection('sec-imgtext-prod', 'ImageWithText', { props: { ...defaultPropsMap.ImageWithText, heading: 'Premium Widget', buttonText: 'Add to Cart' } }),
      createSection('sec-richtext-prod', 'RichText', { props: { ...defaultPropsMap.RichText, heading: 'Description' } }),
      createSection('collection-prod-related', 'FeaturedCollection', { props: { ...defaultPropsMap.FeaturedCollection, heading: 'You may also like' } }),
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
      createSection('sec-richtext-cart', 'RichText', { props: { ...defaultPropsMap.RichText, heading: 'Your Cart', body: 'Your cart is currently empty.' } }),
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
      createSection('sec-richtext-checkout', 'RichText', { props: { ...defaultPropsMap.RichText, heading: 'Checkout', body: 'Please fill in your payment details below.' } }),
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
    id: 'contact-page',
    name: 'Contact Us',
    path: '/contact',
    type: 'System',
    seoTitle: 'Contact Us - BillionBiz',
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
    id: 'faq-page',
    name: 'FAQ',
    path: '/faq',
    type: 'System',
    seoTitle: 'FAQ - BillionBiz',
    sections: [
      createSection('announcement-bar-faq', 'AnnouncementBar', { isHidden: true }),
      createSection('header-faq', 'Header'),
      createSection('sec-faq-page', 'FAQ', { props: { ...defaultPropsMap.FAQ, heading: 'Frequently Asked Questions' } }),
      createSection('sec-contact-faq', 'ContactForm', { props: { ...defaultPropsMap.ContactForm, heading: 'Still Have Questions?', description: 'Can\'t find what you\'re looking for? Send us a message.' } }),
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
      createSection('sec-richtext-privacy', 'RichText', { props: { ...defaultPropsMap.RichText, heading: 'Privacy Policy', body: 'We value your privacy...' } }),
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
      createSection('sec-richtext-terms', 'RichText', { props: { ...defaultPropsMap.RichText, heading: 'Terms & Conditions', body: 'By using this site, you agree to our terms...' } }),
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
      createSection('sec-richtext-refunds', 'RichText', { props: { ...defaultPropsMap.RichText, heading: 'Refund Policy', body: 'We offer a 30-day money-back guarantee...' } }),
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
    copyright: '© 2025 BillionBiz. All rights reserved.'
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
      name: 'billionbiz-storage-v2',
    }
  )
);
