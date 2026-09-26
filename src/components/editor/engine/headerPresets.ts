import type {
  HeaderRow,
  HeaderResponsiveArrangement,
  HeaderSlotArrangement,
  GlobalHeaderSettings,
} from './types';

/** Keep the renderer's responsive slots aligned with visual arrangement choices. */
export const createResponsiveArrangement = (
  current: HeaderResponsiveArrangement | undefined,
  layout: Partial<HeaderRow['layout']>,
  options: { variantId?: string; preserveMobile?: boolean } = {},
): HeaderResponsiveArrangement => {
  const fallback: HeaderResponsiveArrangement = {
    desktop: { left: ['logo'], center: ['navigation'], right: ['actions'], disabled: ['search', 'cta'] },
    tablet: { left: ['logo'], center: ['navigation'], right: ['actions'], disabled: ['search', 'cta'] },
    mobile: { left: ['menu'], center: ['logo'], right: ['actions'], disabled: ['navigation', 'search', 'cta'] },
  };
  const result = JSON.parse(JSON.stringify(current || fallback)) as HeaderResponsiveArrangement;
  const slots: Array<keyof HeaderSlotArrangement> = ['left', 'center', 'right', 'disabled'];
  const slotFor = (position: string | undefined): 'left' | 'center' | 'right' =>
    position === 'left' || position === 'right' ? position : 'center';

  (['desktop', 'tablet', 'mobile'] as const).forEach((device) => {
    if (device === 'mobile' && options.preserveMobile) return;
    const arrangement = result[device];
    const keys = slots.flatMap((slot) => arrangement[slot])
      .map((key) => key === 'navigation-left' || key === 'navigation-right' ? 'navigation' : key)
      .filter((key, index, list) => list.indexOf(key) === index);
    slots.forEach((slot) => { arrangement[slot] = []; });
    const place = (key: string, slot: keyof HeaderSlotArrangement) => {
      if (!arrangement[slot].includes(key)) arrangement[slot].push(key);
    };

    keys.forEach((key) => {
      if (key === 'logo') place(key, slotFor(layout.logoPosition));
      else if (key === 'actions') place(key, slotFor(layout.actionsPosition));
      else if (key === 'navigation') {
        if (layout.navPosition === 'split') {
          place('navigation-left', 'left');
          place('navigation-right', 'right');
        } else place(key, slotFor(layout.navPosition));
      } else {
        place(key, key === 'menu' ? (layout.navPosition === 'left' ? 'left' : 'right') : 'disabled');
      }
    });

    if (options.variantId === 'minimal-hamburger') {
      (['left', 'center', 'right'] as const).forEach((slot) => {
        arrangement[slot] = arrangement[slot].filter((key) => key !== 'navigation');
      });
      if (!arrangement.right.includes('menu')) arrangement.right.unshift('menu');
    }
  });
  return result;
};

export type StructurePresetId =
  | 'standard'
  | 'centered-nav'
  | 'centered-split'
  | 'logo-left'
  | 'logo-right'
  | 'split-nav'
  | 'full-center'
  | 'stacked'
  | 'search-first'
  | 'category-first'
  | 'compact'
  | 'rail'
  | 'double-deck'
  | 'minimal'
  | 'side-rail'
  | (string & {});

export type AppearancePresetId =
  | 'clean-light'
  | 'dark-luxury'
  | 'glassmorphic'
  | 'high-contrast'
  | 'brand-accent'
  | 'warm-editorial'
  | 'floating-island'
  | 'transparent-hero'
  | 'minimal'
  | 'modern'
  | 'luxury'
  | 'editorial'
  | 'tech'
  | 'bold'
  | 'playful'
  | 'glass'
  | 'monochrome'
  | 'clean'
  | (string & {});

export type CuratedPresetId =
  | 'modern-commerce'
  | 'luxury-fashion'
  | 'tech-saas'
  | 'tech-electronics'
  | 'marketplace'
  | 'department-store'
  | 'fashion-editorial'
  | 'minimal-store'
  | 'bold-retail'
  | 'glass-commerce'
  | 'magazine'
  | 'restaurant'
  | 'portfolio'
  | 'electronics'
  | 'beauty-cosmetics'
  | 'minimalist-goods'
  | 'food-beverage'
  | 'sports-outdoors'
  | (string & {});
export type AnnouncementVariant = 'single' | 'carousel' | 'marquee' | 'split' | 'countdown' | 'multi-slot';

export interface AnnouncementVariantConfig {
  id: AnnouncementVariant;
  name: string;
  description: string;
  previewDiagram: string;
  components: {
    cta: boolean;
    closeButton: boolean;
    navArrows: boolean;
    dotIndicators: boolean;
    countdown: boolean;
    icon: boolean;
  };
  maxItems: number;
  defaultProps: Record<string, any>;
}

export const ANNOUNCEMENT_VARIANTS: AnnouncementVariantConfig[] = [
  {
    id: 'single',
    name: 'Single Message',
    description: 'One centered announcement with optional CTA link',
    previewDiagram: '────── ✨ Free Shipping on orders $99+ ── Shop Now → ──────',
    components: {
      cta: true,
      closeButton: true,
      navArrows: false,
      dotIndicators: false,
      countdown: false,
      icon: true,
    },
    maxItems: 1,
    defaultProps: {
      variant: 'single',
      autoRotate: false,
      showCloseButton: true,
    },
  },
  {
    id: 'carousel',
    name: 'Rotating Carousel',
    description: 'Multiple messages with arrow navigation and dot indicators',
    previewDiagram: '← ✨ Summer Sale 40% OFF  •  🚚 Free Shipping  •  🎁 Gift Boxing →',
    components: {
      cta: true,
      closeButton: true,
      navArrows: true,
      dotIndicators: true,
      countdown: false,
      icon: true,
    },
    maxItems: 10,
    defaultProps: {
      variant: 'carousel',
      autoRotate: true,
      rotationInterval: 5000,
      transitionType: 'slide',
      showNavArrows: true,
      showDotIndicators: true,
      showCloseButton: true,
      pauseOnHover: true,
    },
  },
  {
    id: 'marquee',
    name: 'Continuous Marquee',
    description: 'Smooth scrolling ticker with infinite loop animation',
    previewDiagram: '→→ Summer Sale 40% OFF ★ Free Shipping ★ Gift Boxing ★ New Arrivals →→',
    components: {
      cta: false,
      closeButton: true,
      navArrows: false,
      dotIndicators: false,
      countdown: false,
      icon: false,
    },
    maxItems: 10,
    defaultProps: {
      variant: 'marquee',
      speed: 25,
      direction: 'ltr',
      pauseOnHover: true,
      showCloseButton: false,
    },
  },
  {
    id: 'split',
    name: 'Split Layout',
    description: 'Left-aligned message with right-aligned CTA button',
    previewDiagram: '✨ Summer Festive Sale: Up to 40% OFF          [Shop Now →]',
    components: {
      cta: true,
      closeButton: true,
      navArrows: false,
      dotIndicators: false,
      countdown: false,
      icon: true,
    },
    maxItems: 1,
    defaultProps: {
      variant: 'split',
      ctaStyle: 'button',
      showCloseButton: true,
    },
  },
  {
    id: 'countdown',
    name: 'Countdown Timer',
    description: 'Urgency-driven announcement with live countdown and CTA',
    previewDiagram: '🔥 Flash Sale Ends In: 02:14:33:07  ── [Grab Deal →] ── ✕',
    components: {
      cta: true,
      closeButton: true,
      navArrows: false,
      dotIndicators: false,
      countdown: true,
      icon: true,
    },
    maxItems: 1,
    defaultProps: {
      variant: 'countdown',
      showCountdown: true,
      countdownFormat: 'dhms',
      ctaStyle: 'pill',
      showCloseButton: true,
    },
  },
  {
    id: 'multi-slot',
    name: 'Multi-Slot Banner',
    description: 'Multiple messages displayed simultaneously in columns',
    previewDiagram: '🚚 Free Shipping  │  💳 Buy Now Pay Later  │  🔄 Easy Returns  │  📞 24/7 Support',
    components: {
      cta: false,
      closeButton: true,
      navArrows: false,
      dotIndicators: false,
      countdown: false,
      icon: true,
    },
    maxItems: 4,
    defaultProps: {
      variant: 'multi-slot',
      showCloseButton: false,
    },
  },
];

export const getAnnouncementVariant = (id: AnnouncementVariant): AnnouncementVariantConfig | undefined =>
  ANNOUNCEMENT_VARIANTS.find((v) => v.id === id);

export const getDefaultAnnouncementVariant = (): AnnouncementVariantConfig =>
  ANNOUNCEMENT_VARIANTS[0];

export interface StructurePresetConfig {
  id: StructurePresetId;
  name: string;
  category: 'core' | 'advanced';
  description: string;
  diagram: string;
  layout: {
    container: 'full' | 'constrained' | 'boxed' | 'edge-to-edge';
    alignment: 'left' | 'center' | 'right' | 'space-between' | 'distributed';
    logoPosition: 'left' | 'center' | 'right' | 'custom';
    navPosition: 'left' | 'center' | 'right' | 'split';
    actionsPosition: 'left' | 'right' | 'inline' | 'separate';
  };
}

export const STRUCTURE_PRESETS: StructurePresetConfig[] = [
  {
    id: 'standard',
    name: 'Standard',
    category: 'core',
    description: 'Classic storefront layout with left logo, center nav, and right actions.',
    diagram: 'Logo | Navigation | Actions',
    layout: {
      container: 'constrained',
      alignment: 'space-between',
      logoPosition: 'left',
      navPosition: 'center',
      actionsPosition: 'right',
    },
  },
  {
    id: 'centered-nav',
    name: 'Centered Navigation',
    category: 'core',
    description: 'Logo left, prominently centered navigation, and right utility actions.',
    diagram: 'Logo |    Navigation    | Actions',
    layout: {
      container: 'constrained',
      alignment: 'space-between',
      logoPosition: 'left',
      navPosition: 'center',
      actionsPosition: 'right',
    },
  },
  {
    id: 'centered-split',
    name: 'Centered Logo Split',
    category: 'core',
    description: 'Navigation split equally around a central high-impact brand mark.',
    diagram: 'Nav (Left) | Logo (Center) | Nav (Right) + Actions',
    layout: {
      container: 'constrained',
      alignment: 'center',
      logoPosition: 'center',
      navPosition: 'split',
      actionsPosition: 'right',
    },
  },
  {
    id: 'logo-left',
    name: 'Logo Left',
    category: 'core',
    description: 'Inline left-anchored layout with logo leading immediately into nav.',
    diagram: 'Logo | Navigation | Actions',
    layout: {
      container: 'full',
      alignment: 'left',
      logoPosition: 'left',
      navPosition: 'left',
      actionsPosition: 'right',
    },
  },
  {
    id: 'logo-right',
    name: 'Logo Right',
    category: 'core',
    description: 'Creative right-aligned branding with left navigation and center actions.',
    diagram: 'Navigation | Actions | Logo',
    layout: {
      container: 'constrained',
      alignment: 'space-between',
      logoPosition: 'right',
      navPosition: 'left',
      actionsPosition: 'right',
    },
  },
  {
    id: 'full-center',
    name: 'Full Center',
    category: 'core',
    description: 'Heroic top centered logo with stacked navigation and actions below.',
    diagram: '       [ Logo ]\nNavigation / Actions',
    layout: {
      container: 'boxed',
      alignment: 'center',
      logoPosition: 'center',
      navPosition: 'center',
      actionsPosition: 'inline',
    },
  },
  {
    id: 'split-nav',
    name: 'Split Navigation',
    category: 'core',
    description: 'Categorized left links, center brand, and right secondary links with actions.',
    diagram: 'Navigation | Logo | Navigation',
    layout: {
      container: 'constrained',
      alignment: 'space-between',
      logoPosition: 'center',
      navPosition: 'split',
      actionsPosition: 'right',
    },
  },
  {
    id: 'stacked',
    name: 'Stacked Two-Tier',
    category: 'advanced',
    description: 'Brand masthead on top tier, dedicated full navigation bar below.',
    diagram: '       Logo\nNavigation | Actions',
    layout: {
      container: 'constrained',
      alignment: 'space-between',
      logoPosition: 'center',
      navPosition: 'left',
      actionsPosition: 'right',
    },
  },
  {
    id: 'search-first',
    name: 'Search First',
    category: 'advanced',
    description: 'High-conversion retail setup prioritizing an expansive central search bar.',
    diagram: 'Logo | Search | Actions',
    layout: {
      container: 'full',
      alignment: 'space-between',
      logoPosition: 'left',
      navPosition: 'center',
      actionsPosition: 'right',
    },
  },
  {
    id: 'category-first',
    name: 'Category First',
    category: 'advanced',
    description: 'Multi-category department store with dedicated secondary catalog bar.',
    diagram: 'Logo | Main Navigation\n─────────────────────\nCategories',
    layout: {
      container: 'constrained',
      alignment: 'space-between',
      logoPosition: 'left',
      navPosition: 'center',
      actionsPosition: 'right',
    },
  },
  {
    id: 'compact',
    name: 'Compact Minimal',
    category: 'advanced',
    description: 'Ultra-slim height with icon menu trigger and condensed actions.',
    diagram: 'Logo | Menu | Actions',
    layout: {
      container: 'edge-to-edge',
      alignment: 'space-between',
      logoPosition: 'left',
      navPosition: 'center',
      actionsPosition: 'right',
    },
  },
  {
    id: 'rail',
    name: 'Side Rail',
    category: 'advanced',
    description: 'Vertical dock architecture for modern tech and design portfolios.',
    diagram: 'Logo\nMenu\nSearch\nCart',
    layout: {
      container: 'boxed',
      alignment: 'left',
      logoPosition: 'left',
      navPosition: 'left',
      actionsPosition: 'left',
    },
  },
];

export interface AppearancePresetConfig {
  id: AppearancePresetId;
  name: string;
  description: string;
  badge: string;
  tokens: {
    bgColor: string;
    bgGlass: boolean;
    textColor: string;
    textMutedColor: string;
    accentColor: string;
    borderColor: string;
    fontFamily: string;
    buttonRadius: number;
    shadow: 'none' | 'soft' | 'medium' | 'strong';
  };
}

export const APPEARANCE_PRESETS: AppearancePresetConfig[] = [
  {
    id: 'clean',
    name: 'Clean',
    description: 'Crisp, airy white aesthetic with subtle dividers and modern typography.',
    badge: 'Versatile',
    tokens: {
      bgColor: '#ffffff',
      bgGlass: false,
      textColor: '#0f172a',
      textMutedColor: '#64748b',
      accentColor: '#2563eb',
      borderColor: '#e2e8f0',
      fontFamily: 'Inter, sans-serif',
      buttonRadius: 6,
      shadow: 'soft',
    },
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Polished zinc tones, bold contrasts, and smooth rounded action pills.',
    badge: 'Popular',
    tokens: {
      bgColor: '#ffffff',
      bgGlass: false,
      textColor: '#18181b',
      textMutedColor: '#71717a',
      accentColor: '#10b981',
      borderColor: '#f4f4f5',
      fontFamily: 'Inter, sans-serif',
      buttonRadius: 10,
      shadow: 'medium',
    },
  },
  {
    id: 'editorial',
    name: 'Editorial',
    description: 'Classic high-fashion magazine aesthetic with rich serif typography.',
    badge: 'Fashion',
    tokens: {
      bgColor: '#fdfbf7',
      bgGlass: false,
      textColor: '#1c1917',
      textMutedColor: '#78716c',
      accentColor: '#854d0e',
      borderColor: '#e7e5e4',
      fontFamily: '"Playfair Display", Georgia, serif',
      buttonRadius: 2,
      shadow: 'none',
    },
  },
  {
    id: 'luxury',
    name: 'Luxury',
    description: 'Deep onyx tones, refined champagne accents, and elevated spacing.',
    badge: 'High-End',
    tokens: {
      bgColor: '#09090b',
      bgGlass: false,
      textColor: '#f4f4f5',
      textMutedColor: '#a1a1aa',
      accentColor: '#d4af37',
      borderColor: '#27272a',
      fontFamily: '"Cinzel", "Playfair Display", serif',
      buttonRadius: 4,
      shadow: 'strong',
    },
  },
  {
    id: 'tech',
    name: 'Tech SaaS',
    description: 'Silicon valley dark mode, vibrant cyan accents, and monospaced badges.',
    badge: 'Digital',
    tokens: {
      bgColor: '#0b0f19',
      bgGlass: true,
      textColor: '#f8fafc',
      textMutedColor: '#94a3b8',
      accentColor: '#06b6d4',
      borderColor: '#1e293b',
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      buttonRadius: 8,
      shadow: 'soft',
    },
  },
  {
    id: 'playful',
    name: 'Playful',
    description: 'Vibrant punchy pastels, energetic buttons, and friendly rounded radii.',
    badge: 'Youth',
    tokens: {
      bgColor: '#fffbeb',
      bgGlass: false,
      textColor: '#451a03',
      textMutedColor: '#92400e',
      accentColor: '#f97316',
      borderColor: '#fde68a',
      fontFamily: '"Outfit", sans-serif',
      buttonRadius: 24,
      shadow: 'medium',
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Stripped back to essentials. Zero border clutter and laser-focused clarity.',
    badge: 'Essential',
    tokens: {
      bgColor: '#ffffff',
      bgGlass: false,
      textColor: '#171717',
      textMutedColor: '#737373',
      accentColor: '#171717',
      borderColor: 'transparent',
      fontFamily: 'Inter, sans-serif',
      buttonRadius: 0,
      shadow: 'none',
    },
  },
  {
    id: 'bold',
    name: 'Bold Retail',
    description: 'High impact black and yellow, heavy strokes, and assertive presence.',
    badge: 'Direct',
    tokens: {
      bgColor: '#000000',
      bgGlass: false,
      textColor: '#ffffff',
      textMutedColor: '#d4d4d4',
      accentColor: '#facc15',
      borderColor: '#333333',
      fontFamily: '"Cabinet Grotesk", Impact, sans-serif',
      buttonRadius: 6,
      shadow: 'strong',
    },
  },
  {
    id: 'glass',
    name: 'Glassmorphism',
    description: 'Frosted translucent backdrop filter with ultra-fine luminous borders.',
    badge: 'Sleek',
    tokens: {
      bgColor: 'rgba(255, 255, 255, 0.72)',
      bgGlass: true,
      textColor: '#0f172a',
      textMutedColor: '#475569',
      accentColor: '#6366f1',
      borderColor: 'rgba(255, 255, 255, 0.4)',
      fontFamily: 'Inter, sans-serif',
      buttonRadius: 12,
      shadow: 'soft',
    },
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Pure black & white contrast with razor-sharp lines and typographic balance.',
    badge: 'Architectural',
    tokens: {
      bgColor: '#000000',
      bgGlass: false,
      textColor: '#ffffff',
      textMutedColor: '#888888',
      accentColor: '#ffffff',
      borderColor: '#222222',
      fontFamily: 'Inter, sans-serif',
      buttonRadius: 0,
      shadow: 'none',
    },
  },
  {
    id: 'high-contrast',
    name: 'High Contrast',
    description: 'WCAG AAA compliant readability with distinct borders and accessible focus rings.',
    badge: 'A11y',
    tokens: {
      bgColor: '#ffffff',
      bgGlass: false,
      textColor: '#000000',
      textMutedColor: '#222222',
      accentColor: '#0033cc',
      borderColor: '#000000',
      fontFamily: 'Inter, sans-serif',
      buttonRadius: 4,
      shadow: 'none',
    },
  },
];

export interface CuratedPresetConfig {
  id: CuratedPresetId;
  name: string;
  category: 'Commerce' | 'Brand' | 'Specialty';
  description: string;
  structure: StructurePresetId;
  appearance: AppearancePresetId;
  behavior: GlobalHeaderSettings['scrollBehavior'];
}

export const CURATED_PRESETS: CuratedPresetConfig[] = [
  {
    id: 'modern-commerce',
    name: 'Modern Commerce',
    category: 'Commerce',
    description: 'Announcement bar, full search, mega menu, cart and utility bar combo.',
    structure: 'standard',
    appearance: 'clean',
    behavior: 'sticky',
  },
  {
    id: 'luxury-fashion',
    name: 'Luxury Fashion',
    category: 'Brand',
    description: 'Centered split nav, serif typography, champagne accents, and elevated spacing.',
    structure: 'centered-split',
    appearance: 'luxury',
    behavior: 'shrink-on-scroll',
  },
  {
    id: 'tech-saas',
    name: 'Tech SaaS',
    category: 'Specialty',
    description: 'Translucent glass navbar, prominent CTA button, docs links, dark mode.',
    structure: 'standard',
    appearance: 'tech',
    behavior: 'sticky-after-scroll',
  },
  {
    id: 'marketplace',
    name: 'Marketplace',
    category: 'Commerce',
    description: 'Multi-category drawer, prominent search, wishlist, currency selector.',
    structure: 'search-first',
    appearance: 'modern',
    behavior: 'sticky',
  },
  {
    id: 'department-store',
    name: 'Department Store',
    category: 'Commerce',
    description: 'Three-tiered stack with utility info, main brand nav, and category bar.',
    structure: 'stacked',
    appearance: 'bold',
    behavior: 'shrink-on-scroll',
  },
  {
    id: 'fashion-editorial',
    name: 'Fashion Editorial',
    category: 'Brand',
    description: 'High-contrast typography, marquee promo, category bar, magazine styling.',
    structure: 'category-first',
    appearance: 'editorial',
    behavior: 'hide-down-reveal-up',
  },
  {
    id: 'minimal-store',
    name: 'Minimal Store',
    category: 'Brand',
    description: 'Stripped back laser clarity, ultra-clean links, and uncluttered layout.',
    structure: 'compact',
    appearance: 'minimal',
    behavior: 'static',
  },
  {
    id: 'bold-retail',
    name: 'Bold Retail',
    category: 'Commerce',
    description: 'High-voltage contrast, strong badges, yellow accents, and impactful CTAs.',
    structure: 'standard',
    appearance: 'bold',
    behavior: 'sticky',
  },
  {
    id: 'glass-commerce',
    name: 'Glass Commerce',
    category: 'Specialty',
    description: 'Frosted translucent floating header with luminous borders and backdrop blur.',
    structure: 'centered-nav',
    appearance: 'glass',
    behavior: 'shrink-on-scroll',
  },
  {
    id: 'magazine',
    name: 'Magazine',
    category: 'Brand',
    description: 'Classic publication masthead, centered logo, category catalog, and reading mode.',
    structure: 'full-center',
    appearance: 'editorial',
    behavior: 'hide-down-reveal-up',
  },
  {
    id: 'restaurant',
    name: 'Restaurant',
    category: 'Specialty',
    description: 'Centered logo, reservation CTA, opening hours utility, transparent hero.',
    structure: 'full-center',
    appearance: 'editorial',
    behavior: 'sticky',
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    category: 'Brand',
    description: 'Minimalist compact header with smooth micro-interactions and glass backdrop.',
    structure: 'compact',
    appearance: 'minimal',
    behavior: 'sticky',
  },
  {
    id: 'electronics',
    name: 'Electronics Store',
    category: 'Commerce',
    description: 'Expanded category grid, live search predictive results, multi-tier promo.',
    structure: 'category-first',
    appearance: 'clean',
    behavior: 'sticky',
  },
];

export const createDefaultHeaderStack = (): HeaderRow[] => [
  {
    id: 'row-announcement',
    type: 'announcement',
    name: 'Announcement Bar',
    isVisible: true,
    layout: {
      container: 'full',
      alignment: 'center',
      logoPosition: 'left',
      navPosition: 'center',
      actionsPosition: 'right',
      paddingX: 20,
      paddingY: 8,
      gap: 12,
      height: 38,
    },
    styling: {
      bgType: 'theme',
      bgColor: '#198754',
      textColor: '#ffffff',
      textMutedColor: '#e0f2fe',
      borderBottom: true,
      borderColor: 'rgba(255, 255, 255, 0.15)',
      shadow: 'none',
      radius: 0,
      fontSize: 12,
      fontWeight: 500,
    },
    elements: [
      {
        id: 'el-announcement-content',
        type: 'promo-text',
        name: 'Announcement Notice',
        props: {
          stylePreset: 'marquee',
          announcements: [
            { text: '✨ Summer Festive Sale: Up to 40% OFF with code BILLION40', link: '/collections/sale', badge: 'SALE' },
            { text: '🚚 Free Express Shipping across all orders over $99', link: '/shipping', badge: 'FREE' },
            { text: '🎁 Complimentary Gift Box with every luxury purchase', link: '/shop', badge: 'LIMITED' },
          ],
          speed: 25,
          pauseOnHover: true,
          showCountdown: true,
          countdownTarget: '2026-12-31T23:59:59',
          ctaText: 'Shop Now',
          ctaLink: '/shop',
        },
      },
    ],
  },
  {
    id: 'row-utility',
    type: 'utility',
    name: 'Utility Bar',
    isVisible: false,
    layout: {
      container: 'constrained',
      alignment: 'space-between',
      logoPosition: 'left',
      navPosition: 'left',
      actionsPosition: 'right',
      paddingX: 24,
      paddingY: 6,
      gap: 16,
      height: 34,
    },
    styling: {
      bgType: 'theme',
      bgColor: '#f8fafc',
      textColor: '#475569',
      borderBottom: true,
      borderColor: '#e2e8f0',
      shadow: 'none',
      radius: 0,
      fontSize: 11,
      fontWeight: 500,
    },
    elements: [
      {
        id: 'el-utility-blocks',
        type: 'utility-links',
        name: 'Utility Group',
        props: {
          leftGroup: [
            { icon: 'phone', label: '+1 (800) 555-0199', link: 'tel:+18005550199' },
            { icon: 'mail', label: 'support@store.com', link: 'mailto:support@store.com' },
          ],
          centerGroup: [
            { icon: 'tag', label: 'VIP Club Member Discounts Active', link: '/vip' },
          ],
          rightGroup: [
            { icon: 'truck', label: 'Track Order', link: '/order-tracking' },
            { icon: 'globe', label: 'English | USD ($)', link: '#' },
          ],
        },
      },
    ],
  },
  {
    id: 'row-primary-nav',
    type: 'primary-nav',
    name: 'Header',
    isVisible: true,
    isLocked: true,
    layout: {
      container: 'constrained',
      alignment: 'space-between',
      logoPosition: 'left',
      navPosition: 'center',
      actionsPosition: 'right',
      paddingX: 28,
      paddingY: 14,
      gap: 24,
      height: 72,
      responsiveArrangement: {
        desktop: { left: ['logo'], center: ['navigation'], right: ['actions'], disabled: ['search', 'cta'] },
        tablet: { left: ['logo'], center: ['navigation'], right: ['actions'], disabled: ['search', 'cta'] },
        mobile: { left: ['menu'], center: ['logo'], right: ['actions'], disabled: ['search', 'cta'] },
      },
    },
    styling: {
      bgType: 'theme',
      bgColor: '#ffffff',
      textColor: '#0f172a',
      borderBottom: true,
      borderColor: '#e2e8f0',
      shadow: 'soft',
      radius: 0,
      fontSize: 14,
      fontWeight: 600,
    },
    elements: [
      {
        id: 'el-logo',
        type: 'logo',
        name: 'Logo & Brandname',
        isLocked: true,
        props: {
          logoType: 'text',
          text: 'BillionBiz',
          tagline: 'LUXURY STOREFRONT',
          desktopWidth: 150,
          tabletWidth: 130,
          mobileWidth: 110,
          link: '/',
        },
      },
      {
        id: 'el-nav-links',
        type: 'navigation',
        name: 'Navigation',
        isLocked: true,
        props: {
          links: [
            {
              id: 'nav-home',
              label: 'Home',
              url: '/',
            },
            {
              id: 'nav-shop',
              label: 'Shop',
              url: '/shop',
              badge: 'HOT',
              hasMegaMenu: true,
              megaMenu: {
                columns: [
                  {
                    title: 'New Arrivals',
                    items: [
                      { label: 'Spring Essentials', url: '/shop?cat=spring' },
                      { label: 'Bestselling Jackets', url: '/shop?cat=jackets' },
                      { label: 'Trending Footwear', url: '/shop?cat=footwear' },
                      { label: 'Leather Accessories', url: '/shop?cat=leather' },
                    ],
                  },
                  {
                    title: 'Men Collection',
                    items: [
                      { label: 'Tailored Shirts', url: '/shop?cat=shirts' },
                      { label: 'Chino Trousers', url: '/shop?cat=pants' },
                      { label: 'Formal Blazers', url: '/shop?cat=blazers' },
                      { label: 'Activewear Tech', url: '/shop?cat=active' },
                    ],
                  },
                  {
                    title: 'Women Collection',
                    items: [
                      { label: 'Silk Dresses', url: '/shop?cat=dresses' },
                      { label: 'Designer Tops', url: '/shop?cat=tops' },
                      { label: 'Luxury Handbags', url: '/shop?cat=handbags' },
                      { label: 'Fine Jewelry', url: '/shop?cat=jewelry' },
                    ],
                  },
                  {
                    title: 'Exclusive Promo',
                    isPromoCard: true,
                    promoImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&auto=format&fit=crop&q=60',
                    promoTitle: 'New Season Capsule',
                    promoSubtitle: 'Discover 120+ curated minimalist silhouettes.',
                    promoButtonText: 'Explore Lookbook',
                    promoButtonLink: '/collections',
                  },
                ],
              },
            },
            {
              id: 'nav-collections',
              label: 'Collections',
              url: '/collections',
              children: [
                { label: 'Minimalist Autumn', url: '/collections/autumn' },
                { label: 'Urban Athletics', url: '/collections/athletics' },
                { label: 'Evening Soiree', url: '/collections/evening' },
              ],
            },
            {
              id: 'nav-about',
              label: 'About Us',
              url: '/about',
            },
            {
              id: 'nav-contact',
              label: 'Contact',
              url: '/contact',
            },
          ],
        },
      },
      {
        id: 'el-search',
        type: 'search',
        name: 'Search',
        isLocked: true,
        props: {
          mode: 'icon',
          placeholder: 'Search products...',
          searchSource: 'products',
        },
      },
      {
        id: 'el-actions',
        type: 'actions',
        name: 'Actions',
        isLocked: true,
        props: {
          showSearch: true,
          showAccount: true,
          showWishlist: true,
          showCart: true,
          showCta: false,
          ctaText: 'Sign Up',
          ctaLink: '/register',
          cartItemCount: 3,
          wishlistItemCount: 5,
        },
      },
      {
        id: 'el-cta',
        type: 'cta',
        name: 'CTA',
        isLocked: true,
        props: {
          text: 'Shop Now',
          url: '/shop',
          variant: 'primary',
          size: 'sm',
        },
      },
    ],
  },
  {
    id: 'row-secondary-nav',
    type: 'secondary-nav',
    name: 'Category Bar',
    isVisible: true,
    layout: {
      container: 'constrained',
      alignment: 'left',
      logoPosition: 'left',
      navPosition: 'left',
      actionsPosition: 'right',
      paddingX: 28,
      paddingY: 8,
      gap: 20,
      height: 42,
    },
    styling: {
      bgType: 'theme',
      bgColor: '#fafafa',
      textColor: '#334155',
      borderBottom: true,
      borderColor: '#f1f5f9',
      shadow: 'none',
      radius: 0,
      fontSize: 13,
      fontWeight: 500,
    },
    elements: [
      {
        id: 'el-categories',
        type: 'navigation',
        name: 'Quick Categories',
        props: {
          categories: [
            { label: 'All Products', icon: 'grid', link: '/shop' },
            { label: 'New In', icon: 'sparkles', link: '/shop?filter=new' },
            { label: 'Best Sellers', icon: 'flame', link: '/shop?filter=bestsellers' },
            { label: 'Apparel', icon: 'shirt', link: '/shop?cat=apparel' },
            { label: 'Shoes & Bags', icon: 'package', link: '/shop?cat=shoes' },
            { label: 'Watches', icon: 'watch', link: '/shop?cat=watches' },
            { label: 'Sale %', icon: 'tag', link: '/shop?cat=sale', highlight: true },
          ],
        },
      },
    ],
  },
];

export const createDefaultGlobalSettings = (): GlobalHeaderSettings => ({
  positioning: 'sticky',
  scrollBehavior: 'sticky',
  transitions: 'fade',
  stickyThreshold: 50,
  scrolledHeight: 60,

  navInteraction: 'hover',
  megaMenuBehavior: 'hover-open',
  mobileMenuType: 'drawer',
  searchMode: 'dropdown',

  heroAwareMode: 'standard',

  tokens: {
    bgType: 'theme',
    bgColor: '#ffffff',
    textColorType: 'theme',
    textColor: '#0f172a',
    accentColorType: 'theme',
    accentColor: '#198754',
    borderColorType: 'theme',
    borderColor: '#e2e8f0',
    fontFamilyType: 'theme',
    fontFamily: 'Inter, sans-serif',
    buttonRadiusType: 'theme',
    buttonRadius: 8,
    shadowType: 'theme',
    shadow: 'soft',
  },

  responsiveRules: {
    desktop: {
      visible: true,
      layout: 'horizontal',
      logoWidth: 150,
    },
    tablet: {
      visible: true,
      layout: 'horizontal',
      logoWidth: 130,
    },
    mobile: {
      visible: true,
      layout: 'collapse',
      navMode: 'drawer',
      logoWidth: 110,
      showSearch: true,
      showCart: true,
      showAccount: true,
      showWishlist: false,
    },
  },

  displayRules: {
    targetAudience: 'all',
    countries: ['ALL'],
    devices: ['desktop', 'tablet', 'mobile'],
    scheduleEnabled: false,
    timezone: 'UTC',
  },

  accessibility: {
    ariaLabels: true,
    landmarkRole: 'banner',
    keyboardNavigation: true,
    focusOutline: true,
    skipToContent: true,
  },

  seo: {
    structuredLinks: true,
    logoH1OnHome: true,
    breadcrumbRelationship: true,
  },

  performance: {
    lazyLoadMegaMedia: true,
    optimizeImages: true,
    reduceMotion: false,
    disableExpensiveEffects: false,
  },

  customCss: '',
  customClasses: '',
  customAttributes: '',

  structurePreset: 'standard',
  appearancePreset: 'clean',
  curatedPreset: 'modern-commerce',
});

// ─── Header Variants ──────────────────────────────────────
// A Variant defines the overall header concept, component composition,
// default style, and recommended child items.

import type {
  HeaderVariant,
  HeaderArrangement,
  HeaderTemplate,
} from '../engine/types';

const createUseCaseVariant = (
  id: string,
  name: string,
  description: string,
  category: HeaderVariant['category'],
  layout: Partial<HeaderRow['layout']>,
  globalOverrides: HeaderVariant['globalOverrides'] = {},
): HeaderVariant => {
  const primaryRow = createDefaultHeaderStack().find((row) => row.type === 'primary-nav')!;
  return {
    id,
    name,
    description,
    category,
    previewDiagram: 'Logo | Navigation | Search · Account · CTA',
    rows: [{ ...primaryRow, layout: { ...primaryRow.layout, ...layout } }],
    globalOverrides,
    compatibleArrangementIds: ['general', 'logo-nav-left', 'center-split'],
    compatibleTemplateIds: [],
  };
};

export const HEADER_VARIANTS: HeaderVariant[] = [
  {
    id: 'standard',
    name: 'Standard Header',
    description: 'General-purpose header with logo, brand name, navigation links, and action icons. The go-to for most websites.',
    category: 'commerce',
    previewDiagram: '🏷️ Logo | Navigation | 🔍 🛒 👤',
    rows: createDefaultHeaderStack(),
    compatibleArrangementIds: ['general', 'center-split', 'center-split-inverse', 'split-navigation', 'inverse-general', 'logo-nav-left'],
    compatibleTemplateIds: ['tpl-modern-commerce', 'tpl-marketplace', 'tpl-search-first'],
  },
  {
    id: 'floating',
    name: 'Floating Header',
    description: 'Floating navbar with rounded corners and spacing from page edges. Glassmorphism backdrop with elevated shadow.',
    category: 'creative',
    previewDiagram: '    ╭─────────────────────────────╮\n    │ Logo   Nav Nav   🔍 🛒 👤  │\n    ╰─────────────────────────────╯',
    rows: [
      {
        id: 'row-primary-nav', type: 'primary-nav', name: 'Header', isVisible: true, isLocked: true,
        layout: { container: 'boxed', alignment: 'space-between', logoPosition: 'left', navPosition: 'center', actionsPosition: 'right', paddingX: 24, paddingY: 10, gap: 20, height: 64, arrangementId: 'floating-general' },
        styling: { bgType: 'custom', bgColor: 'rgba(255,255,255,0.85)', bgGlass: true, textColor: '#0f172a', borderBottom: false, borderColor: 'rgba(255,255,255,0.3)', shadow: 'medium', radius: 999, fontSize: 14, fontWeight: 500 },
        elements: [
          { id: 'el-logo', type: 'logo', name: 'Logo', isLocked: true, props: { logoType: 'text', text: 'BillionBiz', desktopWidth: 130, tabletWidth: 110, mobileWidth: 100, link: '/' } },
          { id: 'el-nav-links', type: 'navigation', name: 'Navigation', isLocked: true, props: { links: [{ id: 'n1', label: 'Shop', url: '/shop' }, { id: 'n2', label: 'Collections', url: '/collections' }, { id: 'n3', label: 'About', url: '/about' }] } },
          { id: 'el-actions', type: 'actions', name: 'Actions', isLocked: true, props: { showSearch: true, showCart: true, showAccount: true, showWishlist: false, cartItemCount: 2 } },
        ],
      },
    ],
    globalOverrides: { positioning: 'floating', scrollBehavior: 'sticky' },
    compatibleArrangementIds: ['floating-general', 'floating-center-brand', 'floating-split-nav', 'floating-inline-end'],
    compatibleTemplateIds: ['tpl-glass-commerce', 'tpl-minimal-store'],
  },
  {
    id: 'transparent',
    name: 'Transparent Header',
    description: 'Header with a transparent/overlay appearance that sits on top of hero content. Becomes solid on scroll.',
    category: 'creative',
    previewDiagram: '┊ Logo    Nav Nav Nav   🔍 🛒  ┊\n┊          (transparent)        ┊\n┊═══════ HERO CONTENT ═════════┊',
    rows: [
      {
        id: 'row-primary-nav', type: 'primary-nav', name: 'Header', isVisible: true, isLocked: true,
        layout: { container: 'constrained', alignment: 'space-between', logoPosition: 'left', navPosition: 'center', actionsPosition: 'right', paddingX: 28, paddingY: 16, gap: 24, height: 64, arrangementId: 'transparent-general' },
        styling: { bgType: 'custom', bgColor: 'transparent', textColor: '#f8fafc', borderBottom: false, borderColor: 'transparent', shadow: 'none', radius: 0, fontSize: 14, fontWeight: 500, overlayHero: true },
        elements: [
          { id: 'el-logo', type: 'logo', name: 'Logo', isLocked: true, props: { logoType: 'text', text: 'BillionBiz', desktopWidth: 150, link: '/' } },
          { id: 'el-nav-links', type: 'navigation', name: 'Navigation', isLocked: true, props: { links: [{ id: 'n1', label: 'Shop', url: '/shop' }, { id: 'n2', label: 'Collections', url: '/collections' }, { id: 'n3', label: 'About', url: '/about' }] } },
          { id: 'el-actions', type: 'actions', name: 'Actions', isLocked: true, props: { showSearch: true, showCart: true, showAccount: true, showWishlist: false, cartItemCount: 0 } },
        ],
      },
    ],
    globalOverrides: { positioning: 'overlay', scrollBehavior: 'sticky', heroAwareMode: 'transparent-hero' },
    compatibleArrangementIds: ['transparent-general', 'transparent-center-split', 'transparent-split-nav', 'transparent-minimal'],
    compatibleTemplateIds: ['tpl-glass-commerce', 'tpl-tech-saas'],
  },
  {
    id: 'minimal-hamburger',
    name: 'Minimal Hamburger',
    description: 'Only logo/brand name and a hamburger/menu icon on the right. Navigation opens via a drawer or full-screen overlay.',
    category: 'creative',
    previewDiagram: '☰  Logo                    🛒',
    rows: [
      {
        id: 'row-primary-nav', type: 'primary-nav', name: 'Header', isVisible: true, isLocked: true,
        layout: { container: 'constrained', alignment: 'space-between', logoPosition: 'left', navPosition: 'right', actionsPosition: 'right', paddingX: 20, paddingY: 10, gap: 12, height: 64, arrangementId: 'hamburger-right' },
        styling: { bgType: 'theme', bgColor: '#ffffff', textColor: '#171717', borderBottom: false, borderColor: 'transparent', shadow: 'none', radius: 0, fontSize: 14, fontWeight: 500 },
        elements: [
          { id: 'el-logo', type: 'logo', name: 'Logo', isLocked: true, props: { logoType: 'text', text: 'BillionBiz', desktopWidth: 120, link: '/' } },
          { id: 'el-nav-links', type: 'navigation', name: 'Navigation', isLocked: true, props: { links: [{ id: 'n1', label: 'Shop', url: '/shop' }, { id: 'n2', label: 'About', url: '/about' }] } },
          { id: 'el-actions', type: 'actions', name: 'Actions', isLocked: true, props: { showSearch: false, showCart: true, showAccount: false, showWishlist: false, cartItemCount: 0 } },
        ],
      },
    ],
    globalOverrides: { mobileMenuType: 'full-screen' },
    compatibleArrangementIds: ['hamburger-right', 'hamburger-left-logo-center', 'hamburger-left-logo-right'],
    compatibleTemplateIds: ['tpl-minimal-store', 'tpl-glass-commerce'],
  },
  {
    id: 'side-rail',
    name: 'Side Rail',
    description: 'Vertical navigation header positioned on the left side of the screen with stacked navigation.',
    category: 'creative',
    previewDiagram: 'Logo\nMenu\nSearch\nCart',
    rows: [
      {
        id: 'row-primary-nav', type: 'primary-nav', name: 'Header', isVisible: true, isLocked: true,
        layout: { container: 'boxed', alignment: 'left', logoPosition: 'left', navPosition: 'left', actionsPosition: 'left', paddingX: 16, paddingY: 16, gap: 16, height: 64, arrangementId: 'rail-stacked' },
        styling: { bgType: 'theme', bgColor: '#ffffff', textColor: '#0f172a', borderBottom: true, borderColor: '#e2e8f0', shadow: 'soft', radius: 0, fontSize: 14, fontWeight: 500 },
        elements: [
          { id: 'el-logo', type: 'logo', name: 'Logo', isLocked: true, props: { logoType: 'text', text: 'BillionBiz', desktopWidth: 120, link: '/' } },
          { id: 'el-nav-links', type: 'navigation', name: 'Navigation', isLocked: true, props: { links: [{ id: 'n1', label: 'Home', url: '/' }, { id: 'n2', label: 'Work', url: '/work' }, { id: 'n3', label: 'About', url: '/about' }, { id: 'n4', label: 'Contact', url: '/contact' }] } },
          { id: 'el-actions', type: 'actions', name: 'Actions', isLocked: true, props: { showSearch: true, showCart: false, showAccount: false, showWishlist: false } },
        ],
      },
    ],
    globalOverrides: { positioning: 'sticky' },
    compatibleArrangementIds: ['rail-stacked', 'rail-compact-icons', 'rail-nav-top'],
    compatibleTemplateIds: [],
  },
  {
    id: 'search-command',
    name: 'Search Command Center',
    description: 'Commerce-first navbar with a spacious search-led middle and fast-access shopping actions.',
    category: 'commerce',
    previewDiagram: 'Logo |        Search        | Wishlist Cart Account',
    rows: [createDefaultHeaderStack().find((row) => row.type === 'primary-nav')!],
    globalOverrides: { searchMode: 'inline', navInteraction: 'click', scrollBehavior: 'sticky' },
    compatibleArrangementIds: ['general', 'logo-nav-left', 'floating-inline-end'],
    compatibleTemplateIds: ['tpl-search-first', 'tpl-marketplace'],
  },
  {
    id: 'editorial-masthead',
    name: 'Editorial Masthead',
    description: 'A centered, high-contrast masthead for fashion, publishing, hospitality, and premium brands.',
    category: 'editorial',
    previewDiagram: 'Navigation |      Logo      | Actions',
    rows: [{
      ...createDefaultHeaderStack().find((row) => row.type === 'primary-nav')!,
      layout: {
        ...createDefaultHeaderStack().find((row) => row.type === 'primary-nav')!.layout,
        container: 'constrained', alignment: 'space-between', logoPosition: 'center', navPosition: 'left', actionsPosition: 'right',
        arrangementId: 'center-split', paddingY: 18, gap: 28,
      },
      styling: {
        ...createDefaultHeaderStack().find((row) => row.type === 'primary-nav')!.styling,
        bgColor: '#fdfbf7', textColor: '#1c1917', borderColor: '#e7e5e4', shadow: 'none', radius: 0, fontSize: 13, fontWeight: 500,
      },
    }],
    globalOverrides: { navInteraction: 'hover', scrollBehavior: 'shrink-on-scroll' },
    compatibleArrangementIds: ['center-split', 'split-navigation', 'center-split-inverse'],
    compatibleTemplateIds: ['tpl-magazine', 'tpl-luxury-fashion'],
  },
  {
    id: 'conversion-bar',
    name: 'Conversion Bar',
    description: 'A compact retail header tuned for quick discovery, persistent actions, and campaign-led storefronts.',
    category: 'commerce',
    previewDiagram: 'Logo | Navigation + Search | Cart CTA',
    rows: [{
      ...createDefaultHeaderStack().find((row) => row.type === 'primary-nav')!,
      layout: {
        ...createDefaultHeaderStack().find((row) => row.type === 'primary-nav')!.layout,
        container: 'full', alignment: 'space-between', logoPosition: 'left', navPosition: 'center', actionsPosition: 'right',
        arrangementId: 'logo-nav-left', paddingX: 22, paddingY: 10, gap: 16, height: 60,
      },
      styling: {
        ...createDefaultHeaderStack().find((row) => row.type === 'primary-nav')!.styling,
        bgColor: '#0f172a', textColor: '#ffffff', borderBottom: false, borderColor: '#0f172a', shadow: 'medium', radius: 0, fontSize: 14, fontWeight: 600,
      },
    }],
    globalOverrides: { navInteraction: 'click', scrollBehavior: 'sticky', searchMode: 'dropdown' },
    compatibleArrangementIds: ['logo-nav-left', 'general', 'split-navigation'],
    compatibleTemplateIds: ['tpl-modern-commerce', 'tpl-electronics'],
  },
  {
    id: 'studio-compact',
    name: 'Studio Compact',
    description: 'A focused compact header for portfolios, SaaS products, and content-first experiences.',
    category: 'saas',
    previewDiagram: 'Logo | Links | Menu + Account',
    rows: [{
      ...createDefaultHeaderStack().find((row) => row.type === 'primary-nav')!,
      layout: {
        ...createDefaultHeaderStack().find((row) => row.type === 'primary-nav')!.layout,
        container: 'edge-to-edge', alignment: 'space-between', logoPosition: 'left', navPosition: 'center', actionsPosition: 'right',
        arrangementId: 'general', paddingX: 18, paddingY: 8, gap: 14, height: 54, isCompact: true,
      },
      styling: {
        ...createDefaultHeaderStack().find((row) => row.type === 'primary-nav')!.styling,
        bgColor: '#ffffff', textColor: '#111827', borderBottom: true, borderColor: '#e5e7eb', shadow: 'none', radius: 0, fontSize: 13, fontWeight: 600,
      },
    }],
    globalOverrides: { navInteraction: 'click', mobileMenuType: 'full-screen', scrollBehavior: 'sticky' },
    compatibleArrangementIds: ['general', 'logo-nav-left', 'hamburger-right'],
    compatibleTemplateIds: ['tpl-minimal-store', 'tpl-tech-saas'],
  },
  createUseCaseVariant(
    'service-concierge',
    'Service Concierge',
    'Trust-first header for agencies, consultants, clinics, and appointment-led businesses with clear contact and booking paths.',
    'corporate',
    { container: 'constrained', logoPosition: 'left', navPosition: 'center', actionsPosition: 'right', height: 68, gap: 20 },
    { navInteraction: 'click', scrollBehavior: 'sticky' },
  ),
  createUseCaseVariant(
    'hospitality-welcome',
    'Hospitality Welcome',
    'Warm, editorial navigation for restaurants, hotels, venues, and travel brands with a prominent reservation action.',
    'editorial',
    { container: 'constrained', logoPosition: 'center', navPosition: 'left', actionsPosition: 'right', height: 76, gap: 28 },
    { navInteraction: 'hover', scrollBehavior: 'shrink-on-scroll' },
  ),
  createUseCaseVariant(
    'saas-product',
    'SaaS Product Nav',
    'Conversion-ready product navigation for software companies with docs, pricing, account, and sign-up actions.',
    'saas',
    { container: 'constrained', logoPosition: 'left', navPosition: 'center', actionsPosition: 'right', height: 64, gap: 18 },
    { navInteraction: 'click', mobileMenuType: 'full-screen', searchMode: 'overlay', scrollBehavior: 'sticky' },
  ),
  createUseCaseVariant(
    'real-estate-showcase',
    'Real Estate Showcase',
    'Discovery-led header for property, architecture, and interior brands with room for location search and lead capture.',
    'corporate',
    { container: 'full', logoPosition: 'left', navPosition: 'center', actionsPosition: 'right', height: 70, gap: 24 },
    { navInteraction: 'hybrid', searchMode: 'inline', scrollBehavior: 'sticky' },
  ),
  createUseCaseVariant(
    'creator-portfolio',
    'Creator Portfolio',
    'Minimal, content-first navigation for photographers, studios, freelancers, and creative portfolios.',
    'creative',
    { container: 'full', logoPosition: 'left', navPosition: 'right', actionsPosition: 'right', height: 56, gap: 14, isCompact: true },
    { navInteraction: 'click', mobileMenuType: 'drawer', scrollBehavior: 'static' },
  ),
];

// ─── Header Arrangements ──────────────────────────────────
// An Arrangement controls positioning of existing components
// without destroying content. Dynamic & variant-specific.

export const HEADER_ARRANGEMENTS: (HeaderArrangement & { variantId?: string })[] = [
  // ── Standard Header Arrangements ──
  {
    id: 'general',
    name: 'General',
    description: 'Logo/brand → navigation links → actions. Classic balanced layout.',
    variantId: 'standard',
    layout: { alignment: 'space-between', logoPosition: 'left', navPosition: 'center', actionsPosition: 'right' },
  },
  {
    id: 'center-split',
    name: 'Center Split',
    description: 'Navigation links on the left, logo/brand centered, actions on the right.',
    variantId: 'standard',
    layout: { alignment: 'space-between', logoPosition: 'center', navPosition: 'left', actionsPosition: 'right' },
  },
  {
    id: 'center-split-inverse',
    name: 'Center Split Inverse',
    description: 'Actions on the left, logo/brand centered, navigation links on the right.',
    variantId: 'standard',
    layout: { alignment: 'space-between', logoPosition: 'center', navPosition: 'right', actionsPosition: 'left' },
  },
  {
    id: 'split-navigation',
    name: 'Split Navigation',
    description: 'Half navigation links left and half right of centered logo/brand.',
    variantId: 'standard',
    layout: { alignment: 'space-between', logoPosition: 'center', navPosition: 'split', actionsPosition: 'right' },
  },
  {
    id: 'inverse-general',
    name: 'Inverse General',
    description: 'Actions on the left, navigation in the center, logo/brand on the right.',
    variantId: 'standard',
    layout: { alignment: 'space-between', logoPosition: 'right', navPosition: 'center', actionsPosition: 'left' },
  },
  {
    id: 'logo-nav-left',
    name: 'Logo & Nav Left',
    description: 'Logo/brand and navigation links grouped on left, actions on the right.',
    variantId: 'standard',
    layout: { alignment: 'space-between', logoPosition: 'left', navPosition: 'left', actionsPosition: 'right' },
  },

  // ── Floating Header Arrangements ──
  {
    id: 'floating-general',
    name: 'Floating Balanced',
    description: 'Logo left, navigation centered, actions right within floating pill.',
    variantId: 'floating',
    layout: { alignment: 'space-between', logoPosition: 'left', navPosition: 'center', actionsPosition: 'right' },
  },
  {
    id: 'floating-center-brand',
    name: 'Floating Center Brand',
    description: 'Navigation left, prominent centered logo, actions right.',
    variantId: 'floating',
    layout: { alignment: 'space-between', logoPosition: 'center', navPosition: 'left', actionsPosition: 'right' },
  },
  {
    id: 'floating-split-nav',
    name: 'Floating Split Nav',
    description: 'Navigation split evenly around centered brand inside floating island.',
    variantId: 'floating',
    layout: { alignment: 'space-between', logoPosition: 'center', navPosition: 'split', actionsPosition: 'right' },
  },
  {
    id: 'floating-inline-end',
    name: 'Floating Right Grouped',
    description: 'Logo left, with navigation links and actions grouped towards right.',
    variantId: 'floating',
    layout: { alignment: 'space-between', logoPosition: 'left', navPosition: 'right', actionsPosition: 'right' },
  },

  // ── Transparent Header Arrangements ──
  {
    id: 'transparent-general',
    name: 'Transparent Hero Overlay',
    description: 'Logo left, navigation centered, actions right over hero visual.',
    variantId: 'transparent',
    layout: { alignment: 'space-between', logoPosition: 'left', navPosition: 'center', actionsPosition: 'right' },
  },
  {
    id: 'transparent-center-split',
    name: 'Transparent Center Brand',
    description: 'Navigation left, centered brand crest, actions right over hero.',
    variantId: 'transparent',
    layout: { alignment: 'space-between', logoPosition: 'center', navPosition: 'left', actionsPosition: 'right' },
  },
  {
    id: 'transparent-split-nav',
    name: 'Transparent Split Nav',
    description: 'Split navigation links framing centered logo over cinematic media.',
    variantId: 'transparent',
    layout: { alignment: 'space-between', logoPosition: 'center', navPosition: 'split', actionsPosition: 'right' },
  },
  {
    id: 'transparent-minimal',
    name: 'Transparent Minimal',
    description: 'Logo on left and clean compact navigation on right.',
    variantId: 'transparent',
    layout: { alignment: 'space-between', logoPosition: 'left', navPosition: 'right', actionsPosition: 'right' },
  },

  // ── Minimal Hamburger Arrangements ──
  {
    id: 'hamburger-right',
    name: 'Logo Left + Menu Right',
    description: 'Logo/brand on left, drawer menu toggle and cart icon on right.',
    variantId: 'minimal-hamburger',
    layout: { alignment: 'space-between', logoPosition: 'left', navPosition: 'right', actionsPosition: 'right' },
  },
  {
    id: 'hamburger-left-logo-center',
    name: 'Menu Left + Logo Center',
    description: 'Menu drawer toggle on left, centered brand prominence, actions right.',
    variantId: 'minimal-hamburger',
    layout: { alignment: 'space-between', logoPosition: 'center', navPosition: 'left', actionsPosition: 'right' },
  },
  {
    id: 'hamburger-left-logo-right',
    name: 'Menu Left + Logo Right',
    description: 'Menu drawer toggle on left, brand and actions right-aligned.',
    variantId: 'minimal-hamburger',
    layout: { alignment: 'space-between', logoPosition: 'right', navPosition: 'left', actionsPosition: 'right' },
  },

  // ── Side Rail Arrangements ──
  {
    id: 'rail-stacked',
    name: 'Top Brand + Middle Nav',
    description: 'Brand logo at top, vertical nav links in middle, actions/account at bottom.',
    variantId: 'side-rail',
    layout: { alignment: 'space-between', logoPosition: 'left', navPosition: 'center', actionsPosition: 'right' },
  },
  {
    id: 'rail-compact-icons',
    name: 'Compact Icon Dock',
    description: 'Icon logo top, iconized vertical navigation dock, actions at bottom.',
    variantId: 'side-rail',
    layout: { alignment: 'space-between', logoPosition: 'left', navPosition: 'left', actionsPosition: 'right' },
  },
  {
    id: 'rail-nav-top',
    name: 'Nav Top + Brand Bottom',
    description: 'Navigation items starting from top, brand insignia and actions at bottom.',
    variantId: 'side-rail',
    layout: { alignment: 'space-between', logoPosition: 'right', navPosition: 'left', actionsPosition: 'right' },
  },
];

// ─── Header Templates ─────────────────────────────────────
// A Template is a curated combination of Variant + Arrangement +
// Style + Behavior + Responsive configuration.

export const HEADER_TEMPLATES: HeaderTemplate[] = [
  {
    id: 'tpl-modern-commerce',
    name: 'Modern Commerce',
    description: 'Full-featured storefront header with announcement, utility, navigation, and category bars.',
    category: 'commerce',
    variantId: 'modern-commerce',
    arrangementId: 'standard',
    rows: createDefaultHeaderStack(),
    globalOverrides: { scrollBehavior: 'sticky' },
  },
  {
    id: 'tpl-luxury-fashion',
    name: 'Luxury Fashion',
    description: 'Serif luxury centered logo with split navigation, dark theme, and gold accents.',
    category: 'fashion',
    variantId: 'serif-luxury',
    arrangementId: 'centered-split',
    rows: [
      {
        id: 'row-announcement',
        type: 'announcement',
        name: 'Announcement Bar',
        isVisible: true,
        layout: { container: 'full', alignment: 'center', logoPosition: 'left', navPosition: 'center', actionsPosition: 'right', paddingX: 20, paddingY: 6, gap: 12, height: 34 },
        styling: { bgType: 'custom', bgColor: '#18181b', textColor: '#e4d4b2', borderBottom: true, borderColor: '#27272a', shadow: 'none', radius: 0, fontSize: 11, fontWeight: 500 },
        elements: [
          {
            id: 'el-announcement-content',
            type: 'promo-text',
            name: 'Announcement Notice',
            props: {
              variant: 'single',
              announcements: [{ text: '✦ COMPLIMENTARY WHITE-GLOVE CONCIERGE DELIVERY ON ORDERS OVER $500 ✦', badge: 'PRIVÉ' }],
              ctaText: 'DISCOVER NOW',
              ctaLink: '/collections/prive',
            },
          },
        ],
      },
      {
        id: 'row-primary-nav',
        type: 'primary-nav',
        name: 'Header',
        isVisible: true,
        isLocked: true,
        layout: { container: 'constrained', alignment: 'center', logoPosition: 'center', navPosition: 'split', actionsPosition: 'right', paddingX: 36, paddingY: 18, gap: 28, height: 86 },
        styling: { bgType: 'custom', bgColor: '#09090b', textColor: '#f4f4f5', borderBottom: true, borderColor: '#27272a', shadow: 'strong', radius: 0, fontSize: 13, fontWeight: 400 },
        elements: [
          { id: 'el-logo', type: 'logo', name: 'Logo', isLocked: true, props: { logoType: 'text', text: 'BILLIONBIZ', tagline: 'MAISON DE LUXE', desktopWidth: 180, tabletWidth: 150, mobileWidth: 120, link: '/' } },
          { id: 'el-nav-links', type: 'navigation', name: 'Navigation', isLocked: true, props: { links: [{ id: 'n1', label: 'Women', url: '/women' }, { id: 'n2', label: 'Men', url: '/men' }, { id: 'n3', label: 'Accessories', url: '/accessories' }, { id: 'n4', label: 'Haute Horlogerie', url: '/watches' }, { id: 'n5', label: 'Sale', url: '/sale', badge: 'PRIVÉ' }] } },
          { id: 'el-actions', type: 'actions', name: 'Actions', isLocked: true, props: { showSearch: true, showCart: true, showAccount: true, showWishlist: true, cartItemCount: 1, wishlistItemCount: 3 } },
        ],
      },
    ],
    globalOverrides: { scrollBehavior: 'shrink-on-scroll' },
  },
  {
    id: 'tpl-tech-saas',
    name: 'Tech SaaS',
    description: 'Translucent dark navbar with CTA, docs links, and sticky-after-scroll.',
    category: 'saas',
    variantId: 'tech-saas',
    arrangementId: 'standard',
    rows: [
      {
        id: 'row-announcement',
        type: 'announcement',
        name: 'Announcement Bar',
        isVisible: true,
        layout: { container: 'full', alignment: 'center', logoPosition: 'left', navPosition: 'center', actionsPosition: 'right', paddingX: 20, paddingY: 6, gap: 10, height: 34 },
        styling: { bgType: 'custom', bgColor: '#1e1b4b', textColor: '#c7d2fe', borderBottom: true, borderColor: '#312e81', shadow: 'none', radius: 0, fontSize: 12, fontWeight: 500 },
        elements: [
          {
            id: 'el-announcement-content',
            type: 'promo-text',
            name: 'Announcement Notice',
            props: {
              variant: 'single',
              announcements: [{ text: '🚀 BillionBiz Cloud 3.0 is live! Explore the next-gen headless commerce engine', badge: 'NEW' }],
              ctaText: 'Read Changelog →',
              ctaLink: '/changelog',
            },
          },
        ],
      },
      {
        id: 'row-primary-nav',
        type: 'primary-nav',
        name: 'Header',
        isVisible: true,
        isLocked: true,
        layout: { container: 'constrained', alignment: 'space-between', logoPosition: 'left', navPosition: 'center', actionsPosition: 'right', paddingX: 28, paddingY: 12, gap: 24, height: 66 },
        styling: { bgType: 'custom', bgColor: '#0b0f19', bgGlass: true, textColor: '#f8fafc', borderBottom: true, borderColor: '#1e293b', shadow: 'soft', radius: 0, fontSize: 14, fontWeight: 500 },
        elements: [
          { id: 'el-logo', type: 'logo', name: 'Logo', isLocked: true, props: { logoType: 'text', text: 'BillionBiz', tagline: 'PLATFORM', desktopWidth: 140, tabletWidth: 120, mobileWidth: 100, link: '/' } },
          { id: 'el-nav-links', type: 'navigation', name: 'Navigation', isLocked: true, props: { links: [{ id: 'n1', label: 'Platform', url: '/platform' }, { id: 'n2', label: 'Solutions', url: '/solutions' }, { id: 'n3', label: 'Pricing', url: '/pricing' }, { id: 'n4', label: 'Docs', url: '/docs' }] } },
          { id: 'el-actions', type: 'actions', name: 'Actions', isLocked: true, props: { showSearch: true, showCart: false, showAccount: true, showWishlist: false, showCta: true, ctaText: 'Start Free Trial', ctaLink: '/signup', ctaVariant: 'filled', ctaColor: '#3b82f6' } },
        ],
      },
    ],
    globalOverrides: { scrollBehavior: 'sticky-after-scroll' },
  },
  {
    id: 'tpl-marketplace',
    name: 'Marketplace',
    description: 'Search-first layout with categories, large catalog navigation, and wishlist.',
    category: 'commerce',
    variantId: 'search-first',
    arrangementId: 'standard',
    rows: [
      {
        id: 'row-announcement',
        type: 'announcement',
        name: 'Announcement Bar',
        isVisible: true,
        layout: { container: 'full', alignment: 'center', logoPosition: 'left', navPosition: 'center', actionsPosition: 'right', paddingX: 20, paddingY: 6, gap: 10, height: 34 },
        styling: { bgType: 'custom', bgColor: '#2563eb', textColor: '#ffffff', borderBottom: true, borderColor: 'rgba(255,255,255,0.2)', shadow: 'none', radius: 0, fontSize: 12, fontWeight: 600 },
        elements: [
          {
            id: 'el-announcement-content',
            type: 'promo-text',
            name: 'Announcement Notice',
            props: {
              variant: 'single',
              announcements: [{ text: '⚡ Super Flash Sale: Up to 60% OFF 10,000+ Verified Vendors & Stores', badge: 'DEALS' }],
              ctaText: 'Shop Deals',
              ctaLink: '/deals',
            },
          },
        ],
      },
      {
        id: 'row-primary-nav',
        type: 'primary-nav',
        name: 'Header',
        isVisible: true,
        isLocked: true,
        layout: { container: 'constrained', alignment: 'space-between', logoPosition: 'left', navPosition: 'center', actionsPosition: 'right', paddingX: 24, paddingY: 12, gap: 20, height: 70 },
        styling: { bgType: 'theme', bgColor: '#ffffff', textColor: '#0f172a', borderBottom: true, borderColor: '#e2e8f0', shadow: 'soft', radius: 0, fontSize: 14, fontWeight: 500 },
        elements: [
          { id: 'el-logo', type: 'logo', name: 'Logo', isLocked: true, props: { logoType: 'text', text: 'BillionBiz', desktopWidth: 135, link: '/' } },
          { id: 'el-search', type: 'search', name: 'Search', props: { placeholder: 'Search 50,000+ products, brands & sellers...', width: 340, borderRadius: 9999 } },
          { id: 'el-actions', type: 'actions', name: 'Actions', isLocked: true, props: { showSearch: false, showCart: true, showAccount: true, showWishlist: true, cartItemCount: 4, wishlistItemCount: 2 } },
        ],
      },
      {
        id: 'row-secondary-nav',
        type: 'secondary-nav',
        name: 'Category Bar',
        isVisible: true,
        layout: { container: 'constrained', alignment: 'left', logoPosition: 'left', navPosition: 'left', actionsPosition: 'right', paddingX: 24, paddingY: 6, gap: 18, height: 38 },
        styling: { bgType: 'theme', bgColor: '#f8fafc', textColor: '#334155', borderBottom: true, borderColor: '#f1f5f9', shadow: 'none', radius: 0, fontSize: 13, fontWeight: 500 },
        elements: [
          { id: 'el-cats', type: 'navigation', name: 'Categories', props: { categories: [{ label: 'All Categories', link: '/categories' }, { label: '⚡ Daily Deals', link: '/deals', highlight: true, icon: 'flame' }, { label: 'Electronics', link: '/electronics' }, { label: 'Fashion & Apparel', link: '/fashion' }, { label: 'Home & Kitchen', link: '/home' }, { label: 'Industrial & B2B', link: '/b2b' }] } },
        ],
      },
    ],
    globalOverrides: { scrollBehavior: 'sticky' },
  },
  {
    id: 'tpl-editorial',
    name: 'Editorial Magazine',
    description: 'Large centered masthead logo with stacked nav, magazine editorial style.',
    category: 'editorial',
    variantId: 'editorial-masthead',
    arrangementId: 'full-center',
    rows: [
      {
        id: 'row-primary-nav',
        type: 'primary-nav',
        name: 'Header',
        isVisible: true,
        isLocked: true,
        layout: { container: 'constrained', alignment: 'center', logoPosition: 'center', navPosition: 'center', actionsPosition: 'inline', paddingX: 32, paddingY: 20, gap: 16, height: 104 },
        styling: { bgType: 'custom', bgColor: '#fdfbf7', textColor: '#1c1917', borderBottom: true, borderColor: '#e7e5e4', shadow: 'none', radius: 0, fontSize: 14, fontWeight: 500 },
        elements: [
          { id: 'el-logo', type: 'logo', name: 'Logo', isLocked: true, props: { logoType: 'text', text: 'BILLIONBIZ CHRONICLE', tagline: 'CULTURE, COMMERCE & DESIGN', desktopWidth: 220, link: '/' } },
          { id: 'el-nav-links', type: 'navigation', name: 'Navigation', isLocked: true, props: { links: [{ id: 'n1', label: 'Features', url: '/features' }, { id: 'n2', label: 'Long Reads', url: '/long-reads' }, { id: 'n3', label: 'Culture', url: '/culture' }, { id: 'n4', label: 'Opinion', url: '/opinion' }, { id: 'n5', label: 'Shop Editions', url: '/shop' }] } },
          { id: 'el-actions', type: 'actions', name: 'Actions', isLocked: true, props: { showSearch: true, showCart: true, showAccount: true, showWishlist: false, showCta: true, ctaText: 'Subscribe', ctaVariant: 'outline', cartItemCount: 0 } },
        ],
      },
    ],
    globalOverrides: { scrollBehavior: 'hide-down-reveal-up' },
  },
  {
    id: 'tpl-glass-commerce',
    name: 'Glass Commerce',
    description: 'Frosted translucent floating pill header with glassmorphism and backdrop blur.',
    category: 'creative',
    variantId: 'floating-pill',
    arrangementId: 'standard',
    rows: [
      {
        id: 'row-primary-nav',
        type: 'primary-nav',
        name: 'Header',
        isVisible: true,
        isLocked: true,
        layout: { container: 'boxed', alignment: 'space-between', logoPosition: 'left', navPosition: 'center', actionsPosition: 'right', paddingX: 24, paddingY: 10, gap: 20, height: 58 },
        styling: { bgType: 'custom', bgColor: 'rgba(255,255,255,0.85)', bgGlass: true, textColor: '#0f172a', borderBottom: false, borderColor: 'rgba(255,255,255,0.3)', shadow: 'medium', radius: 999, fontSize: 14, fontWeight: 500 },
        elements: [
          { id: 'el-logo', type: 'logo', name: 'Logo', isLocked: true, props: { logoType: 'text', text: 'BillionBiz', desktopWidth: 130, tabletWidth: 110, mobileWidth: 100, link: '/' } },
          { id: 'el-nav-links', type: 'navigation', name: 'Navigation', isLocked: true, props: { links: [{ id: 'n1', label: 'Shop', url: '/shop' }, { id: 'n2', label: 'Collections', url: '/collections' }, { id: 'n3', label: 'About', url: '/about' }] } },
          { id: 'el-actions', type: 'actions', name: 'Actions', isLocked: true, props: { showSearch: true, showCart: true, showAccount: true, showWishlist: false, cartItemCount: 2 } },
        ],
      },
    ],
    globalOverrides: { positioning: 'floating', scrollBehavior: 'sticky' },
  },
  {
    id: 'tpl-search-first',
    name: 'Search-First Store',
    description: 'Prominent search bar as the focal point, ideal for large catalogs.',
    category: 'commerce',
    variantId: 'search-first',
    arrangementId: 'standard',
    rows: [
      {
        id: 'row-primary-nav',
        type: 'primary-nav',
        name: 'Header',
        isVisible: true,
        isLocked: true,
        layout: { container: 'constrained', alignment: 'space-between', logoPosition: 'left', navPosition: 'center', actionsPosition: 'right', paddingX: 24, paddingY: 12, gap: 16, height: 68 },
        styling: { bgType: 'theme', bgColor: '#ffffff', textColor: '#0f172a', borderBottom: true, borderColor: '#e2e8f0', shadow: 'soft', radius: 0, fontSize: 14, fontWeight: 500 },
        elements: [
          { id: 'el-logo', type: 'logo', name: 'Logo', isLocked: true, props: { logoType: 'text', text: 'BillionBiz', desktopWidth: 130, link: '/' } },
          { id: 'el-search', type: 'search', name: 'Search', props: { placeholder: 'Search products, brands, categories...', width: 320, borderRadius: 9999 } },
          { id: 'el-actions', type: 'actions', name: 'Actions', isLocked: true, props: { showSearch: false, showCart: true, showAccount: true, showWishlist: true, cartItemCount: 3 } },
        ],
      },
      {
        id: 'row-secondary-nav',
        type: 'secondary-nav',
        name: 'Category Bar',
        isVisible: true,
        layout: { container: 'constrained', alignment: 'left', logoPosition: 'left', navPosition: 'left', actionsPosition: 'right', paddingX: 24, paddingY: 6, gap: 16, height: 38 },
        styling: { bgType: 'theme', bgColor: '#f8fafc', textColor: '#334155', borderBottom: true, borderColor: '#f1f5f9', shadow: 'none', radius: 0, fontSize: 13, fontWeight: 500 },
        elements: [
          { id: 'el-cats', type: 'navigation', name: 'Categories', props: { categories: [{ label: 'All', link: '/shop' }, { label: '⚡ Flash Deals', link: '/deals', highlight: true }, { label: 'New Arrivals', link: '/new' }, { label: 'Best Sellers', link: '/bestsellers' }] } },
        ],
      },
    ],
    globalOverrides: { scrollBehavior: 'sticky' },
  },
  {
    id: 'tpl-minimal',
    name: 'Minimal Store',
    description: 'Clean minimal hamburger-driven header. Zero clutter, maximum content focus.',
    category: 'creative',
    variantId: 'minimal-hamburger',
    arrangementId: 'compact',
    rows: [
      {
        id: 'row-primary-nav',
        type: 'primary-nav',
        name: 'Header',
        isVisible: true,
        isLocked: true,
        layout: { container: 'constrained', alignment: 'space-between', logoPosition: 'left', navPosition: 'left', actionsPosition: 'right', paddingX: 20, paddingY: 10, gap: 12, height: 52 },
        styling: { bgType: 'theme', bgColor: '#ffffff', textColor: '#171717', borderBottom: false, borderColor: 'transparent', shadow: 'none', radius: 0, fontSize: 14, fontWeight: 500 },
        elements: [
          { id: 'el-logo', type: 'logo', name: 'Logo', isLocked: true, props: { logoType: 'text', text: 'BillionBiz', desktopWidth: 120, link: '/' } },
          { id: 'el-nav-links', type: 'navigation', name: 'Navigation', isLocked: true, props: { links: [{ id: 'n1', label: 'Shop', url: '/shop' }, { id: 'n2', label: 'About', url: '/about' }] } },
          { id: 'el-actions', type: 'actions', name: 'Actions', isLocked: true, props: { showSearch: false, showCart: true, showAccount: false, showWishlist: false, cartItemCount: 0 } },
        ],
      },
    ],
    globalOverrides: { scrollBehavior: 'static', mobileMenuType: 'full-screen' },
  },
];
