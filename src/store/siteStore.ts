import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { defaultPropsMap, sectionNameMap } from '../components/editor/SectionRenderer';
import { getAllPageConfigs } from '../components/editor/pageConfigs';
import type { PageCategory } from '../components/editor/pageConfigs/types';
import { useContentStateStore } from './contentStateStore';

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
  type: string;                // page config type key (e.g., 'shop', 'product-details')
  category: PageCategory;      // storefront, commerce, customer, legal, system
  status: 'draft' | 'published';
  seoTitle?: string;
  seoDescription?: string;
  socialImage?: string;
  canonicalUrl?: string;
  searchVisibility?: boolean;
  sections: SectionData[];
  pageProps: Record<string, any>; // page-level props (layout, content, style, etc.)
  visibility: {
    desktop: boolean;
    tablet: boolean;
    mobile: boolean;
  };
}

import type { GlobalThemeData } from '../components/editor/theme/themePresets';
import { getDefaultTheme, themePresets } from '../components/editor/theme/themePresets';
import { useThemeHistoryStore } from './themeHistoryStore';

export type ThemeData = GlobalThemeData;

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
  updateTheme: (newTheme: Partial<ThemeData> | Record<string, any>, forceHistory?: boolean) => void;
  updateSettings: (newSettings: Record<string, any>) => void;
  resetTheme: () => void;
  resetAllThemeSettings: () => void;
  resetColorPalette: () => void;
  resetTypography: () => void;
  resetButtons: () => void;
  resetEffects: () => void;
  undoTheme: () => void;
  redoTheme: () => void;
  // New methods for Pages Editor
  updatePageSettings: (pageId: string, settings: Record<string, any>) => void;
  resetPageToDefault: (pageId: string) => void;
  publishPage: (pageId: string) => void;
  unpublishPage: (pageId: string) => void;
}

// Helper to create a section with default props
const createSection = (id: string, type: string, overrides?: Partial<SectionData>): SectionData => ({
  id,
  type,
  name: sectionNameMap[type] || type.replace(/([A-Z])/g, ' $1').trim(),
  isHidden: false,
  props: { ...defaultPropsMap[type] },
  ...overrides,
});

// Helper to generate default sections for a page config
const generateDefaultSections = (pageId: string, configType: string): SectionData[] => {
  const config = getAllPageConfigs().find(c => c.type === configType);
  if (!config) return [];
  return config.defaultSections.map((def, i) => 
    createSection(`${pageId}-${def.type.toLowerCase()}-${i}`, def.type, {
      name: def.name,
      props: { ...defaultPropsMap[def.type], ...def.defaultProps },
    })
  );
};

// Build the initial pages from page configs
const buildPredefinedPages = (): PageData[] => {
  const configs = getAllPageConfigs();
  return configs.map(config => {
    const pageId = `${config.type}-page`;
    return {
      id: pageId,
      name: config.name,
      path: config.path,
      type: config.type,
      category: config.category,
      status: 'published' as const,
      seoTitle: `${config.name} - BillionBiz`,
      seoDescription: config.description || '',
      sections: generateDefaultSections(pageId, config.type),
      pageProps: { ...config.defaultProps },
      visibility: { desktop: true, tablet: true, mobile: true },
    };
  });
};

// Initial mock data — Landing page + predefined pages
const initialPages: PageData[] = [
  {
    id: 'landing-page',
    name: 'Home page',
    path: '/',
    type: 'landing',
    category: 'storefront',
    status: 'published',
    seoTitle: 'BillionBiz | Build, Launch & Grow Your Business',
    seoDescription: 'The best platform to launch your store.',
    sections: [
      createSection('announcement-bar', 'AnnouncementBar'),
      createSection('utility-bar', 'UtilityBar'),
      createSection('header-main', 'Header'),
      createSection('footer-menu', 'FooterMenu'),
      createSection('footer-text', 'FooterText'),
      createSection('footer-main', 'Footer'),
    ],
    pageProps: {},
    visibility: { desktop: true, tablet: true, mobile: true },
  },
  ...buildPredefinedPages(),
];

export const useSiteStore = create<SiteState>()(
  persist<SiteState>(
    (set, get) => ({
      pages: initialPages,
  theme: getDefaultTheme(),
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
    // Clean up content states for the deleted section
    useContentStateStore.getState().deleteSectionStates(sectionId);
    
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
      ],
      category: 'storefront',
      status: 'draft',
      pageProps: {},
      visibility: { desktop: true, tablet: true, mobile: true }
    };
    return { pages: [...state.pages, newPage] };
  }),

  removePage: (pageId) => set((state) => ({
    pages: state.pages.filter(page => page.id !== pageId)
  })),

  updateTheme: (newTheme, forceHistory = false) => {
    useThemeHistoryStore.getState().pushState(get().theme, forceHistory);
    set((state) => {
      const merged = { ...state.theme, ...newTheme };
      // Synchronize legacy colors object if palette is updated
      if (newTheme.colors) {
        merged.colors = { ...newTheme.colors };
      } else if (newTheme.palette?.brand?.primary) {
        merged.colors = {
          ...merged.colors,
          primary: newTheme.palette.brand.primary,
          secondary: newTheme.palette.brand.secondary || merged.colors.secondary,
          background: newTheme.palette.background.background || merged.colors.background,
          text: newTheme.palette.text.body || merged.colors.text,
          accent: newTheme.palette.brand.accent || merged.colors.accent,
          border: newTheme.palette.border.border || merged.colors.border,
        };
      } else if (newTheme.colors?.primary && merged.palette) {
        merged.palette = {
          ...merged.palette,
          brand: {
            ...merged.palette.brand,
            primary: newTheme.colors.primary,
            secondary: newTheme.colors.secondary || merged.palette.brand.secondary,
            accent: newTheme.colors.accent || merged.palette.brand.accent,
          },
          background: {
            ...merged.palette.background,
            background: newTheme.colors.background || merged.palette.background.background,
          },
          text: {
            ...merged.palette.text,
            body: newTheme.colors.text || merged.palette.text.body,
          },
          border: {
            ...merged.palette.border,
            border: newTheme.colors.border || merged.palette.border.border,
          },
        };
      }
      return { theme: merged };
    });
  },

  resetTheme: () => {
    useThemeHistoryStore.getState().pushState(get().theme, true);
    set(() => ({
      theme: getDefaultTheme(),
    }));
  },

  resetAllThemeSettings: () => {
    useThemeHistoryStore.getState().pushState(get().theme, true);
    set((state) => {
      const preset = themePresets[state.theme.presetName] || getDefaultTheme();
      return {
        theme: {
          presetName: state.theme.presetName,
          description: preset.description,
          palette: JSON.parse(JSON.stringify(preset.palette)),
          typography: JSON.parse(JSON.stringify(preset.typography)),
          buttons: JSON.parse(JSON.stringify(preset.buttons)),
          effects: JSON.parse(JSON.stringify(preset.effects)),
          colors: { ...preset.colors },
          ui: { ...preset.ui },
          layout: { ...preset.layout },
          animation: { ...preset.animation },
        }
      };
    });
  },

  resetColorPalette: () => {
    useThemeHistoryStore.getState().pushState(get().theme, true);
    set((state) => {
      const preset = themePresets[state.theme.presetName] || getDefaultTheme();
      return {
        theme: {
          ...state.theme,
          colors: { ...preset.colors },
          palette: JSON.parse(JSON.stringify(preset.palette)),
        }
      };
    });
  },

  resetTypography: () => {
    useThemeHistoryStore.getState().pushState(get().theme, true);
    set((state) => {
      const preset = themePresets[state.theme.presetName] || getDefaultTheme();
      return {
        theme: {
          ...state.theme,
          typography: JSON.parse(JSON.stringify(preset.typography)),
        }
      };
    });
  },

  resetButtons: () => {
    useThemeHistoryStore.getState().pushState(get().theme, true);
    set((state) => {
      const preset = themePresets[state.theme.presetName] || getDefaultTheme();
      return {
        theme: {
          ...state.theme,
          buttons: JSON.parse(JSON.stringify(preset.buttons)),
        }
      };
    });
  },

  resetEffects: () => {
    useThemeHistoryStore.getState().pushState(get().theme, true);
    set((state) => {
      const preset = themePresets[state.theme.presetName] || getDefaultTheme();
      return {
        theme: {
          ...state.theme,
          effects: JSON.parse(JSON.stringify(preset.effects)),
          ui: { ...preset.ui },
        }
      };
    });
  },

  undoTheme: () => {
    const previousTheme = useThemeHistoryStore.getState().undo(get().theme);
    if (previousTheme) {
      set({ theme: previousTheme });
    }
  },

  redoTheme: () => {
    const nextTheme = useThemeHistoryStore.getState().redo(get().theme);
    if (nextTheme) {
      set({ theme: nextTheme });
    }
  },

  updateSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings }
  })),

  // --- Pages Editor Methods ---
  
  updatePageSettings: (pageId, settings) => set((state) => {
    const pages = state.pages.map(page => 
      page.id === pageId ? { ...page, pageProps: { ...page.pageProps, ...settings } } : page
    );
    return { pages };
  }),
  
  resetPageToDefault: (pageId) => set((state) => {
    const pages = state.pages.map(page => {
      if (page.id !== pageId) return page;
      const config = getAllPageConfigs().find(c => c.type === page.type);
      if (!config) return page;
      
      return {
        ...page,
        sections: generateDefaultSections(pageId, config.type),
        pageProps: { ...config.defaultProps }
      };
    });
    return { pages };
  }),
  
  publishPage: (pageId) => set((state) => {
    const pages = state.pages.map(page => 
      page.id === pageId ? { ...page, status: 'published' as const } : page
    );
    return { pages };
  }),
  
  unpublishPage: (pageId) => set((state) => {
    const pages = state.pages.map(page => 
      page.id === pageId ? { ...page, status: 'draft' as const } : page
    );
    return { pages };
  })
    }),
    {
      name: 'billionbiz-storage-v4',
      merge: (persistedState: any, currentState: any) => {
        const defaultTheme = getDefaultTheme();
        const storedTheme = persistedState?.theme || {};
        return {
          ...currentState,
          ...persistedState,
          theme: {
            ...defaultTheme,
            ...storedTheme,
            palette: storedTheme.palette ? { ...defaultTheme.palette, ...storedTheme.palette } : defaultTheme.palette,
            typography: storedTheme.typography ? { ...defaultTheme.typography, ...storedTheme.typography } : defaultTheme.typography,
            buttons: storedTheme.buttons ? { ...defaultTheme.buttons, ...storedTheme.buttons } : defaultTheme.buttons,
            effects: storedTheme.effects ? { ...defaultTheme.effects, ...storedTheme.effects } : defaultTheme.effects,
          }
        };
      }
    }
  )
);
