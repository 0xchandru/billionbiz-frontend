// ============================================================
// FOOTER DIRECTORY ARCHITECTURE & ENGINE MODEL
// 20 Looks, Inline Columns Management, Capability-Driven Child Controls,
// Scoped & Singleton Component Registry, Global Palette Semantic Tokens
// ============================================================

import type { FooterColumn, FooterElement, FooterRow } from './types';

// ─── 20 Recommended Footer Looks ─────────────────────────────
export type FooterLook =
  | 'classic_4_col'        // 1. Classic 4 Column: Brand, Shop, Support, Company
  | 'classic_3_col'        // 2. Classic 3 Column: Brand, Shop, Support
  | 'brand_3_dir'          // 3. Brand + 3 Directories: Large Brand | Shop | Support | Company
  | 'brand_2_dir'          // 4. Brand + 2 Directories: Large Brand Area | Shop | Support
  | 'five_col_commerce'    // 5. 5 Column Commerce: Brand | Shop | Categories | Support | Company
  | 'large_brand'          // 6. Large Brand Footer: Brand / Description over Shop | Support | Company
  | 'minimal'              // 7. Minimal Footer: Logo, Description, Links
  | 'centered'             // 8. Centered Footer: Logo, Brand Bio, Link Groups / Links
  | 'editorial'            // 9. Editorial Footer: Large brand area with spacious link directories
  | 'premium_luxury'       // 10. Premium / Luxury: Large logo, minimal links, large spacing, strong typography
  | 'dense_commerce'       // 11. Dense Commerce: High link density with compact spacing
  | 'asymmetric'           // 12. Asymmetric: Brand 2fr | Shop 1fr | Support 1fr | Company 1fr
  | 'wide_brand_grid'      // 13. Wide Brand + Directory Grid: Brand 2fr over Shop | Support | Company
  | 'bento'                // 14. Bento Footer: Unequal column/container card arrangement
  | 'dark_premium'         // 15. Dark Premium: Dark visual treatment with configurable columns
  | 'full_width_modern'    // 16. Full Width Modern: Full-width footer with contained inner content
  | 'mobile_accordion'     // 17. Mobile Accordion Footer: Expandable sections on mobile
  | 'compact_mobile'       // 18. Compact Mobile Footer: Condensed layout optimized for mobile
  | 'split_footer'         // 19. Split Footer: Brand Area | Directory Grid
  | 'fully_custom';        // 20. Fully Custom: No structural restrictions

export interface FooterLookDefinition {
  id: FooterLook;
  name: string;
  category: 'Classic' | 'Commerce' | 'Brand-Led' | 'Modern & Bento' | 'Mobile-First' | 'Custom';
  description: string;
  columns: number;
  columnWidths: string[];
  mobileBehavior: 'accordion' | 'stacked' | 'compact' | 'expanded';
  badge?: string;
  alignment?: 'start' | 'center' | 'end';
}

export const FOOTER_LOOKS: FooterLookDefinition[] = [
  {
    id: 'classic_4_col',
    name: 'Classic 4 Column',
    category: 'Classic',
    description: 'High-converting traditional retail directory: Brand identity, Shop catalog, Customer support, and Company info.',
    columns: 4,
    columnWidths: ['1.4fr', '1fr', '1fr', '1fr'],
    mobileBehavior: 'accordion',
    badge: 'Standard',
  },
  {
    id: 'classic_3_col',
    name: 'Classic 3 Column',
    category: 'Classic',
    description: 'Balanced three-column structure: Brand story on left, Shop catalog in center, Support directory on right.',
    columns: 3,
    columnWidths: ['1.5fr', '1fr', '1.2fr'],
    mobileBehavior: 'accordion',
  },
  {
    id: 'brand_3_dir',
    name: 'Brand + 3 Directories',
    category: 'Brand-Led',
    description: 'Generous brand and bio showcase (1.8fr) alongside three compact directory columns.',
    columns: 4,
    columnWidths: ['1.8fr', '1fr', '1fr', '1fr'],
    mobileBehavior: 'accordion',
    badge: 'Popular',
  },
  {
    id: 'brand_2_dir',
    name: 'Brand + 2 Directories',
    category: 'Brand-Led',
    description: 'Strong brand statement and contact details followed by two wide navigation link groups.',
    columns: 3,
    columnWidths: ['2fr', '1fr', '1fr'],
    mobileBehavior: 'stacked',
  },
  {
    id: 'five_col_commerce',
    name: '5 Column Commerce',
    category: 'Commerce',
    description: 'Deep departmental categorization: Brand | Shop | Categories | Support | Company.',
    columns: 5,
    columnWidths: ['1.2fr', '1fr', '1fr', '1fr', '1fr'],
    mobileBehavior: 'accordion',
    badge: 'Enterprise',
  },
  {
    id: 'large_brand',
    name: 'Large Brand Footer',
    category: 'Brand-Led',
    description: 'Full-width top brand headline & narrative with 3 link directories grouped underneath.',
    columns: 4,
    columnWidths: ['1.6fr', '1fr', '1fr', '1fr'],
    mobileBehavior: 'accordion',
  },
  {
    id: 'minimal',
    name: 'Minimal Footer',
    category: 'Classic',
    description: 'Understated clean layout: Store logo, single-paragraph bio, and concise inline links.',
    columns: 2,
    columnWidths: ['1.5fr', '1fr'],
    mobileBehavior: 'stacked',
    badge: 'Minimal',
  },
  {
    id: 'centered',
    name: 'Centered Footer',
    category: 'Brand-Led',
    description: 'Symmetrical centered layout: Logo, brand bio, and centered multi-group link columns.',
    columns: 1,
    columnWidths: ['1fr'],
    mobileBehavior: 'compact',
    alignment: 'center',
  },
  {
    id: 'editorial',
    name: 'Editorial Footer',
    category: 'Brand-Led',
    description: 'Spacious editorial storytelling with prominent serif typography and airy link clusters.',
    columns: 4,
    columnWidths: ['1.8fr', '1fr', '1fr', '1.2fr'],
    mobileBehavior: 'expanded',
  },
  {
    id: 'premium_luxury',
    name: 'Premium / Luxury',
    category: 'Brand-Led',
    description: 'Subtle elegance: Grand logo presentation, understated curated links, and generous white space.',
    columns: 3,
    columnWidths: ['1.6fr', '1fr', '1fr'],
    mobileBehavior: 'stacked',
    badge: 'Luxury',
  },
  {
    id: 'dense_commerce',
    name: 'Dense Commerce',
    category: 'Commerce',
    description: 'Optimized link density with tight row gaps for hyper-fast discovery across large catalog inventories.',
    columns: 5,
    columnWidths: ['1fr', '1fr', '1fr', '1fr', '1fr'],
    mobileBehavior: 'accordion',
  },
  {
    id: 'asymmetric',
    name: 'Asymmetric (2fr : 1fr : 1fr : 1fr)',
    category: 'Modern & Bento',
    description: 'Distinctive visual hierarchy with double-weight anchor column and three secondary directories.',
    columns: 4,
    columnWidths: ['2fr', '1fr', '1fr', '1fr'],
    mobileBehavior: 'accordion',
  },
  {
    id: 'wide_brand_grid',
    name: 'Wide Brand + Directory Grid',
    category: 'Brand-Led',
    description: 'Spanned primary brand identity card balanced against an evenly distributed grid.',
    columns: 4,
    columnWidths: ['2fr', '1fr', '1fr', '1.2fr'],
    mobileBehavior: 'accordion',
  },
  {
    id: 'bento',
    name: 'Bento Footer',
    category: 'Modern & Bento',
    description: 'Modern glassmorphic bento cards with distinct surface highlights and asymmetric proportions.',
    columns: 4,
    columnWidths: ['1.5fr', '1fr', '1fr', '1.2fr'],
    mobileBehavior: 'compact',
    badge: 'Bento',
  },
  {
    id: 'dark_premium',
    name: 'Dark Premium',
    category: 'Modern & Bento',
    description: 'High-contrast dark obsidian canvas with tailored glowing accents and border definition.',
    columns: 4,
    columnWidths: ['1.4fr', '1fr', '1fr', '1fr'],
    mobileBehavior: 'accordion',
  },
  {
    id: 'full_width_modern',
    name: 'Full Width Modern',
    category: 'Modern & Bento',
    description: 'Edge-to-edge footer canvas containing a neatly proportioned inner grid with dynamic padding.',
    columns: 4,
    columnWidths: ['1.5fr', '1fr', '1fr', '1fr'],
    mobileBehavior: 'accordion',
  },
  {
    id: 'mobile_accordion',
    name: 'Mobile Accordion Footer',
    category: 'Mobile-First',
    description: 'Standard desktop directory that automatically collapses columns into expandable accordions on touchscreens.',
    columns: 4,
    columnWidths: ['1.4fr', '1fr', '1fr', '1fr'],
    mobileBehavior: 'accordion',
    badge: 'Responsive',
  },
  {
    id: 'compact_mobile',
    name: 'Compact Mobile Footer',
    category: 'Mobile-First',
    description: 'Ultra-condensed mobile-first footprint eliminating unnecessary vertical scroll.',
    columns: 3,
    columnWidths: ['1.2fr', '1fr', '1fr'],
    mobileBehavior: 'compact',
  },
  {
    id: 'split_footer',
    name: 'Split Footer',
    category: 'Modern & Bento',
    description: 'Half-screen brand hero block paired with a half-screen directory grid.',
    columns: 3,
    columnWidths: ['1.8fr', '1fr', '1fr'],
    mobileBehavior: 'stacked',
  },
  {
    id: 'fully_custom',
    name: 'Fully Custom',
    category: 'Custom',
    description: 'Unconstrained canvas: Configure arbitrary column counts, widths, and placements freely.',
    columns: 4,
    columnWidths: ['1fr', '1fr', '1fr', '1fr'],
    mobileBehavior: 'accordion',
    badge: 'Flexible',
  },
];

// ─── Component Scope & Registry ──────────────────────────────
export type FooterComponentScope = 'footer-directory';

export type FooterComponentType =
  | 'logo'
  | 'brand-description'
  | 'brand-story'
  | 'link-group'
  | 'contact'
  | 'business-hours'
  | 'rich-text'
  | 'image'
  | 'custom-html'
  | 'divider'
  | 'spacer'
  | 'newsletter-form'
  | 'social-links'
  | 'payment-methods'
  | 'trust-badges'
  | 'app-download'
  | 'copyright';

export interface ComponentPickerItem {
  id: string;
  type: FooterComponentType;
  name: string;
  category: 'BRANDING' | 'NAVIGATION' | 'CONTACT' | 'CONTENT' | 'LAYOUT';
  description: string;
  scope: FooterComponentScope;
  singleton?: boolean;
  preset?: string;
  icon: string;
  defaults: Record<string, any>;
}

export const FOOTER_DIRECTORY_COMPONENTS: ComponentPickerItem[] = [
  // ── BRANDING ──
  {
    id: 'store-logo',
    type: 'logo',
    name: 'Store Logo',
    category: 'BRANDING',
    description: 'Primary store emblem or typographic brand wordmark with sizing & link controls.',
    scope: 'footer-directory',
    singleton: true,
    icon: 'Sparkles',
    defaults: {
      sourceType: 'text',
      text: 'Store Logo',
      fontSize: 22,
      fontWeight: 800,
      textColor: '#0f172a',
      width: 140,
      height: 38,
      href: '/',
      openInNewTab: false,
      alignment: 'left',
      opacity: 100,
      hoverOpacity: 85,
      radius: 0,
    },
  },
  {
    id: 'brand-bio',
    type: 'brand-description',
    name: 'Brand Bio',
    category: 'BRANDING',
    description: 'Concise summary of your merchant mission, value proposition, and origin.',
    scope: 'footer-directory',
    icon: 'FileText',
    defaults: {
      brandName: '',
      text: 'Empowering modern online merchants with frictionless store infrastructure, intelligent workflows, and conversion-optimized retail tools.',
      tagline: 'Crafted for high-growth commerce',
      fontSize: 13,
      textColor: '#64748b',
      maxWidth: 320,
      alignment: 'left',
      ctaText: 'Learn More',
      ctaHref: '/about',
      showCta: false,
    },
  },
  {
    id: 'brand-story',
    type: 'brand-story',
    name: 'Brand Story / Description',
    category: 'BRANDING',
    description: 'Extended brand paragraph highlighting craftsmanship, materials, or merchant ethos.',
    scope: 'footer-directory',
    icon: 'BookOpen',
    defaults: {
      heading: 'Our Story',
      text: 'We set out with a simple purpose: to design enduring essentials that elevate everyday routines while upholding sustainable, ethical craftsmanship.',
      fontSize: 13,
      textColor: '#64748b',
      alignment: 'left',
    },
  },

  // ── NAVIGATION ──
  {
    id: 'footer-link-group',
    type: 'link-group',
    name: 'Footer Link Group',
    category: 'NAVIGATION',
    description: 'Custom directory of links with heading, external indicators, and badges.',
    scope: 'footer-directory',
    icon: 'Menu',
    preset: 'Custom',
    defaults: {
      heading: 'Directory',
      headingSize: 14,
      headingColor: '#0f172a',
      links: [
        { label: 'Featured Collection', href: '/collections' },
        { label: 'New Arrivals', href: '/new' },
        { label: 'Customer Reviews', href: '/reviews' },
        { label: 'Help Desk', href: '/help' },
      ],
      fontSize: 13,
      textColor: '#64748b',
      hoverColor: '#2563eb',
      gap: 10,
    },
  },
  {
    id: 'shop-links',
    type: 'link-group',
    name: 'Shop Links',
    category: 'NAVIGATION',
    description: 'Curated links directed to your store catalog, new releases, and specials.',
    scope: 'footer-directory',
    preset: 'Shop',
    icon: 'ShoppingBag',
    defaults: {
      heading: 'Shop',
      headingSize: 14,
      headingColor: '#0f172a',
      links: [
        { label: 'All Products', href: '/products' },
        { label: 'New Arrivals', href: '/new', badge: 'NEW' },
        { label: 'Best Sellers', href: '/best-sellers' },
        { label: 'Seasonal Sale', href: '/sale', badge: 'SALE' },
        { label: 'Gift Cards', href: '/gift-cards' },
      ],
      fontSize: 13,
      textColor: '#64748b',
      hoverColor: '#2563eb',
      gap: 10,
    },
  },
  {
    id: 'category-links',
    type: 'link-group',
    name: 'Category Links',
    category: 'NAVIGATION',
    description: 'Structured links pointing to top merchant product categories.',
    scope: 'footer-directory',
    preset: 'Category',
    icon: 'Layers',
    defaults: {
      heading: 'Categories',
      headingSize: 14,
      headingColor: '#0f172a',
      links: [
        { label: 'Apparel & Wear', href: '/categories/apparel' },
        { label: 'Accessories', href: '/categories/accessories' },
        { label: 'Footwear', href: '/categories/footwear' },
        { label: 'Home Goods', href: '/categories/home' },
      ],
      fontSize: 13,
      textColor: '#64748b',
      hoverColor: '#2563eb',
      gap: 10,
    },
  },
  {
    id: 'support-links',
    type: 'link-group',
    name: 'Support Links',
    category: 'NAVIGATION',
    description: 'Helpful customer service links: Order tracking, FAQs, returns, and hotline.',
    scope: 'footer-directory',
    preset: 'Support',
    icon: 'HelpCircle',
    defaults: {
      heading: 'Support',
      headingSize: 14,
      headingColor: '#0f172a',
      links: [
        { label: 'Help Center & FAQ', href: '/help' },
        { label: 'Track Your Order', href: '/track' },
        { label: 'Shipping & Delivery', href: '/shipping' },
        { label: 'Returns & Exchanges', href: '/returns' },
        { label: 'Contact Support', href: '/contact' },
      ],
      fontSize: 13,
      textColor: '#64748b',
      hoverColor: '#2563eb',
      gap: 10,
    },
  },
  {
    id: 'company-links',
    type: 'link-group',
    name: 'Company Links',
    category: 'NAVIGATION',
    description: 'Corporate and brand narrative links: About us, careers, press, and impact.',
    scope: 'footer-directory',
    preset: 'Company',
    icon: 'Building2',
    defaults: {
      heading: 'Company',
      headingSize: 14,
      headingColor: '#0f172a',
      links: [
        { label: 'About Our Brand', href: '/about' },
        { label: 'Careers & Team', href: '/careers' },
        { label: 'Press & Media', href: '/press' },
        { label: 'Sustainability', href: '/sustainability' },
        { label: 'Store Locations', href: '/stores' },
      ],
      fontSize: 13,
      textColor: '#64748b',
      hoverColor: '#2563eb',
      gap: 10,
    },
  },
  {
    id: 'resource-links',
    type: 'link-group',
    name: 'Resource Links',
    category: 'NAVIGATION',
    description: 'Guides, community resources, sizing charts, and user manuals.',
    scope: 'footer-directory',
    preset: 'Resource',
    icon: 'Compass',
    defaults: {
      heading: 'Resources',
      headingSize: 14,
      headingColor: '#0f172a',
      links: [
        { label: 'Size & Fit Guide', href: '/size-guide' },
        { label: 'Product Care', href: '/care' },
        { label: 'Community Forum', href: '/community' },
        { label: 'Merchant Stories', href: '/stories' },
      ],
      fontSize: 13,
      textColor: '#64748b',
      hoverColor: '#2563eb',
      gap: 10,
    },
  },
  {
    id: 'custom-link-group',
    type: 'link-group',
    name: 'Custom Link Group',
    category: 'NAVIGATION',
    description: 'Blank link directory ready for custom headers and URLs.',
    scope: 'footer-directory',
    preset: 'Custom',
    icon: 'ListPlus',
    defaults: {
      heading: 'Custom Group',
      headingSize: 14,
      headingColor: '#0f172a',
      links: [
        { label: 'Custom Page 1', href: '#' },
        { label: 'Custom Page 2', href: '#' },
      ],
      fontSize: 13,
      textColor: '#64748b',
      hoverColor: '#2563eb',
      gap: 10,
    },
  },

  // ── CONTACT ──
  {
    id: 'contact-info',
    type: 'contact',
    name: 'Contact Information',
    category: 'CONTACT',
    description: 'Direct communication channels: Phone hotline, email, physical store address, and WhatsApp.',
    scope: 'footer-directory',
    icon: 'PhoneCall',
    defaults: {
      heading: 'Contact Us',
      phone: '+1 (800) 555-0199',
      email: 'support@yourstore.com',
      address: '100 Commerce Boulevard, Suite 400',
      whatsapp: '+1 (800) 555-0198',
      contactUrl: '/contact',
      fontSize: 13,
      textColor: '#64748b',
      showIcons: true,
      iconColor: '#38bdf8',
      gap: 8,
    },
  },
  {
    id: 'business-hours',
    type: 'business-hours',
    name: 'Business Hours',
    category: 'CONTACT',
    description: 'Operating store hours, weekend schedules, and live customer service availability.',
    scope: 'footer-directory',
    icon: 'Clock',
    defaults: {
      heading: 'Business Hours',
      layout: 'column', // 'row' | 'column'
      schedules: [
        { days: 'Monday – Friday', hours: '9:00 AM – 7:00 PM EST' },
        { days: 'Saturday', hours: '10:00 AM – 5:00 PM EST' },
        { days: 'Sunday', hours: 'Closed' },
      ],
      showLiveStatus: true, // "Open Now" badge
      fontSize: 13,
      textColor: '#64748b',
      accentColor: '#10b981',
      gap: 8,
    },
  },

  // ── CONTENT ──
  {
    id: 'rich-text',
    type: 'rich-text',
    name: 'Rich Text',
    category: 'CONTENT',
    description: 'Formatted textual content supporting headings, paragraphs, bullet points, and inline links.',
    scope: 'footer-directory',
    icon: 'Type',
    defaults: {
      heading: 'About Our Quality',
      content: 'Every product is hand-inspected in our workshop before dispatch to guarantee lasting satisfaction.',
      alignment: 'left',
      fontSize: 13,
      textColor: '#64748b',
    },
  },
  {
    id: 'image-block',
    type: 'image',
    name: 'Image',
    category: 'CONTENT',
    description: 'Storefront certification badge, workshop photography, or custom illustration.',
    scope: 'footer-directory',
    icon: 'Image',
    defaults: {
      imageUrl: '',
      altText: 'Footer illustration',
      linkUrl: '',
      width: 220,
      height: 120,
      radius: 6,
      objectFit: 'cover',
      alignment: 'left',
    },
  },
  {
    id: 'custom-html',
    type: 'custom-html',
    name: 'Custom HTML',
    category: 'CONTENT',
    description: 'Raw HTML/SVG embed for third-party widgets, trust seal snippets, or custom badges.',
    scope: 'footer-directory',
    icon: 'Code',
    defaults: {
      html: '<div class="custom-badge">Verified Merchant Guarantee</div>',
      cssClass: '',
      dataAttributes: '',
    },
  },

  // ── LAYOUT ──
  {
    id: 'divider',
    type: 'divider',
    name: 'Divider',
    category: 'LAYOUT',
    description: 'Subtle separator line to divide stacked components within a column.',
    scope: 'footer-directory',
    icon: 'Minus',
    defaults: {
      style: 'solid', // solid, dashed, dotted
      color: '#e2e8f0',
      thickness: 1,
      marginTop: 12,
      marginBottom: 12,
      width: '100%',
    },
  },
  {
    id: 'spacer',
    type: 'spacer',
    name: 'Spacer',
    category: 'LAYOUT',
    description: 'Vertical whitespace spacer to fine-tune spacing between column components.',
    scope: 'footer-directory',
    icon: 'Maximize2',
    defaults: {
      height: 20,
    },
  },

  // ── NEWSLETTER & SOCIAL (Column Child Items) ──
  {
    id: 'newsletter-signup-col',
    type: 'newsletter-form',
    name: 'Small Newsletter Signup',
    category: 'CONTENT',
    description: 'Compact inline email signup field with heading, placeholder & subscribe button for any column.',
    scope: 'footer-directory',
    icon: 'Mail',
    defaults: {
      title: 'Stay in the loop',
      subtitle: 'Subscribe for weekly releases, stories & member perks.',
      placeholder: 'Enter your email address...',
      buttonText: 'Subscribe',
      buttonStyle: 'solid',
      layout: 'stacked',
      showDisclaimer: true,
      disclaimerText: 'By subscribing you agree to our Privacy Policy.',
      fontSize: 14,
      buttonBg: '#2563eb',
      buttonColor: '#ffffff',
    },
  },
  {
    id: 'social-links-col',
    type: 'social-links',
    name: 'Social Links',
    category: 'BRANDING',
    description: 'Icon links for Instagram, Twitter/X, Facebook, YouTube, TikTok, LinkedIn.',
    scope: 'footer-directory',
    icon: 'Share2',
    defaults: {
      heading: 'Connect With Us',
      showHeading: true,
      variant: 'circles',
      size: 16,
      gap: 8,
      iconColor: 'currentColor',
      hoverColor: '#2563eb',
      platforms: [
        { platform: 'instagram', url: 'https://instagram.com', enabled: true },
        { platform: 'twitter', url: 'https://twitter.com', enabled: true },
        { platform: 'facebook', url: 'https://facebook.com', enabled: true },
        { platform: 'youtube', url: 'https://youtube.com', enabled: true },
        { platform: 'tiktok', url: 'https://tiktok.com', enabled: false },
        { platform: 'linkedin', url: 'https://linkedin.com', enabled: false },
      ],
    },
  },
  {
    id: 'payment-methods-col',
    type: 'payment-methods',
    name: 'Payment Methods',
    category: 'CONTENT',
    description: 'Accepted credit cards and payment gateways: Visa, Mastercard, Amex, Apple Pay, PayPal.',
    scope: 'footer-directory',
    icon: 'CreditCard',
    defaults: {
      heading: 'Payment Options',
      showHeading: true,
      providers: ['visa', 'mastercard', 'amex', 'paypal', 'applepay', 'googlepay'],
      iconStyle: 'badge',
      iconSize: 20,
      gap: 6,
    },
  },
  {
    id: 'trust-badges-col',
    type: 'trust-badges',
    name: 'Trust Badges & Guarantees',
    category: 'CONTENT',
    description: 'Security seals, fast shipping, and guarantee reassurance badges in column.',
    scope: 'footer-directory',
    icon: 'ShieldCheck',
    defaults: {
      heading: 'Guaranteed Safe Checkout',
      showHeading: false,
      items: [
        { icon: 'shield-check', title: '256-Bit SSL Protection' },
        { icon: 'truck', title: 'Express Tracked Shipping' },
        { icon: 'rotate-ccw', title: '30-Day Free Returns' },
      ],
      iconColor: '#10b981',
      fontSize: 12.5,
      gap: 8,
    },
  },
  {
    id: 'app-download-col',
    type: 'app-download',
    name: 'Mobile App Badges',
    category: 'CONTENT',
    description: 'App Store and Google Play download badges for your shoppers.',
    scope: 'footer-directory',
    icon: 'Smartphone',
    defaults: {
      heading: 'Download Mobile App',
      showHeading: true,
      showAppStore: true,
      showGooglePlay: true,
      appStoreUrl: '#',
      googlePlayUrl: '#',
    },
  },
  {
    id: 'copyright-col',
    type: 'copyright',
    name: 'Copyright & Notice',
    category: 'CONTENT',
    description: 'Legal copyright statement with current year and merchant brand.',
    scope: 'footer-directory',
    icon: 'FileText',
    defaults: {
      text: '© 2026 BillionBiz, Inc. All rights reserved.',
      fontSize: 12,
      textColor: '#94a3b8',
    },
  },
];

// Helper to look up component metadata by type or ID
export function getFooterComponentMeta(type: string): ComponentPickerItem | undefined {
  return FOOTER_DIRECTORY_COMPONENTS.find((c) => c.type === type || c.id === type);
}

// ─── Semantic CSS Variables for Footer Directory ──────────────
export interface FooterPaletteVariables {
  '--footer-bg': string;
  '--footer-heading': string;
  '--footer-text': string;
  '--footer-muted-text': string;
  '--footer-link': string;
  '--footer-link-hover': string;
  '--footer-icon': string;
  '--footer-border': string;
  '--footer-divider': string;
  '--footer-accent': string;
  '--footer-input-bg': string;
  '--footer-input-border': string;
  '--footer-input-text': string;
}

export function computeFooterPaletteVariables(styling: any, theme?: any): FooterPaletteVariables {
  const bg = styling?.bgColor || (styling?.bgType === 'dark' ? '#0f172a' : '#ffffff');
  const isDark = isColorDark(bg);

  const defaultBg = bg;
  const defaultHeading = styling?.headingColor || (isDark ? '#f8fafc' : '#0f172a');
  const defaultText = styling?.textColor || (isDark ? '#cbd5e1' : '#334155');
  const defaultMuted = styling?.mutedTextColor || (isDark ? '#94a3b8' : '#64748b');
  const defaultLink = styling?.linkColor || defaultText;
  const defaultLinkHover = styling?.linkHoverColor || theme?.colors?.primary || '#2563eb';
  const defaultIcon = styling?.iconColor || (isDark ? '#94a3b8' : '#64748b');
  const defaultBorder = styling?.borderColor || (isDark ? 'rgba(255, 255, 255, 0.12)' : '#e2e8f0');
  const defaultDivider = styling?.dividerColor || defaultBorder;
  const defaultAccent = styling?.accentColor || theme?.colors?.primary || '#2563eb';
  const defaultInputBg = isDark ? 'rgba(255, 255, 255, 0.08)' : '#f8fafc';
  const defaultInputBorder = isDark ? 'rgba(255, 255, 255, 0.2)' : '#cbd5e1';
  const defaultInputText = defaultHeading;

  return {
    '--footer-bg': defaultBg,
    '--footer-heading': defaultHeading,
    '--footer-text': defaultText,
    '--footer-muted-text': defaultMuted,
    '--footer-link': defaultLink,
    '--footer-link-hover': defaultLinkHover,
    '--footer-icon': defaultIcon,
    '--footer-border': defaultBorder,
    '--footer-divider': defaultDivider,
    '--footer-accent': defaultAccent,
    '--footer-input-bg': defaultInputBg,
    '--footer-input-border': defaultInputBorder,
    '--footer-input-text': defaultInputText,
  };
}

export function isColorDark(color?: string): boolean {
  if (!color) return false;
  const trimmed = color.trim().toLowerCase();
  if (trimmed === 'black' || trimmed === 'dark' || trimmed === '#000' || trimmed === '#000000') return true;
  if (trimmed.startsWith('rgb')) {
    const match = trimmed.match(/\d+/g);
    if (match && match.length >= 3) {
      const r = parseInt(match[0], 10);
      const g = parseInt(match[1], 10);
      const b = parseInt(match[2], 10);
      return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
    }
  }
  if (!trimmed.startsWith('#')) return false;
  const c = trimmed.replace('#', '');
  if (c.length !== 3 && c.length !== 6) return false;
  const r = parseInt(c.length === 3 ? c[0] + c[0] : c.substring(0, 2), 16);
  const g = parseInt(c.length === 3 ? c[1] + c[1] : c.substring(2, 4), 16);
  const b = parseInt(c.length === 3 ? c[2] + c[2] : c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}

// ─── Look Switching With Child Preservation ──────────────────
export function switchFooterLook(currentRow: FooterRow, newLookId: FooterLook): FooterRow {
  const lookDef = FOOTER_LOOKS.find((l) => l.id === newLookId) || FOOTER_LOOKS[0];

  // Collect all existing elements across all columns to preserve merchant content
  const existingElements: FooterElement[] = [];
  (currentRow.columns || []).forEach((col) => {
    (col.elements || []).forEach((el) => {
      existingElements.push(el);
    });
  });

  const newColumnCount = lookDef.columns;
  const newColumns: FooterColumn[] = [];

  for (let i = 0; i < newColumnCount; i++) {
    const width = lookDef.columnWidths[i] || '1fr';
    newColumns.push({
      id: `col-dir-${i + 1}-${Date.now().toString(36)}`,
      width,
      elements: [],
    });
  }

  // Distribute existing elements into new columns sensibly
  if (existingElements.length > 0) {
    existingElements.forEach((el, index) => {
      // Branding elements (logo, bio, story) prefer Column 1
      if (el.type === 'logo' || el.type === 'brand-description' || el.type === 'brand-story') {
        newColumns[0].elements.push(el);
      } else {
        // Distribute other components evenly across remaining columns (or all columns if only 1 column)
        const targetColIdx = newColumnCount === 1 ? 0 : 1 + ((index - 1 + newColumnCount - 1) % (newColumnCount - 1));
        const safeIdx = Math.min(targetColIdx, newColumnCount - 1);
        newColumns[safeIdx].elements.push(el);
      }
    });
  } else {
    // Fallback: Populate with defaults if no elements existed
    newColumns[0].elements.push({
      id: `el-ftr-logo-${Date.now().toString(36)}`,
      type: 'logo',
      name: 'Store Logo',
      isLocked: false,
      capabilities: ['style', 'content', 'link', 'responsive', 'advanced'],
      props: FOOTER_DIRECTORY_COMPONENTS[0].defaults,
    });
    newColumns[0].elements.push({
      id: `el-ftr-bio-${Date.now().toString(36)}`,
      type: 'brand-description',
      name: 'Brand Bio',
      capabilities: ['style', 'content', 'design', 'responsive', 'advanced'],
      props: FOOTER_DIRECTORY_COMPONENTS[1].defaults,
    });

    if (newColumnCount > 1) {
      newColumns[1].elements.push({
        id: `el-ftr-shop-${Date.now().toString(36)}`,
        type: 'link-group',
        name: 'Shop Links',
        capabilities: ['style', 'menu', 'design', 'responsive', 'advanced'],
        props: FOOTER_DIRECTORY_COMPONENTS[4].defaults,
      });
    }
    if (newColumnCount > 2) {
      newColumns[2].elements.push({
        id: `el-ftr-support-${Date.now().toString(36)}`,
        type: 'link-group',
        name: 'Support Links',
        capabilities: ['style', 'menu', 'design', 'responsive', 'advanced'],
        props: FOOTER_DIRECTORY_COMPONENTS[6].defaults,
      });
    }
    if (newColumnCount > 3) {
      newColumns[3].elements.push({
        id: `el-ftr-company-${Date.now().toString(36)}`,
        type: 'link-group',
        name: 'Company Links',
        capabilities: ['style', 'menu', 'design', 'responsive', 'advanced'],
        props: FOOTER_DIRECTORY_COMPONENTS[7].defaults,
      });
    }
  }

  return {
    ...currentRow,
    layout: {
      ...currentRow.layout,
      columns: newColumnCount,
      variantId: newLookId,
    },
    columns: newColumns,
    responsive: {
      ...currentRow.responsive,
      mobileLayout: lookDef.mobileBehavior === 'accordion' ? 'accordion' : 'stack',
    },
  };
}
