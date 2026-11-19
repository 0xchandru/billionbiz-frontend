// ============================================================
// PDP BUILDER — COMPONENT BLOCK REGISTRY
// Central registry for all 50+ PDP components across 8 categories
// Defines metadata, default configurations, and inspector field schemas
// ============================================================

import type { PdpBlock, PdpBlockType, PdpBlockCategory, PdpBlockZone } from './types/pdpBlockTypes';

export interface PdpFieldDefinition {
  key: string;
  label: string;
  type:
    | 'text'
    | 'textarea'
    | 'number'
    | 'select'
    | 'segmented'
    | 'toggle'
    | 'color'
    | 'icon'
    | 'slider'
    | 'range';
  options?: Array<{ label: string; value: any }>;
  defaultValue?: any;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  helpText?: string;
  showWhen?: { field: string; value: any } | { field: string; notValue?: any; valueIn?: any[] };
}

export interface PdpBlockDefinition {
  type: PdpBlockType;
  name: string;
  category: PdpBlockCategory;
  iconName: string;
  description: string;
  defaultContent: Record<string, any>;
  defaultDesign?: Record<string, any>;
  defaultVisibility?: Record<string, any>;
  contentFields: PdpFieldDefinition[];
}

export const PDP_CATEGORIES: Array<{
  id: PdpBlockCategory;
  name: string;
  description: string;
  icon: string;
}> = [
  { id: 'Product Media', name: 'Product Media', description: 'Gallery, zoom, video, and image badges', icon: 'Image' },
  { id: 'Product Information', name: 'Product Information', description: 'Title, vendor, category, rating, and stock status', icon: 'Info' },
  { id: 'Pricing & Offers', name: 'Pricing & Offers', description: 'Price display, discounts, variant selectors, and tiers', icon: 'Tag' },
  { id: 'Purchase Actions', name: 'Purchase Actions', description: 'Add to cart, Buy Now, quantity counters, and wishlist', icon: 'ShoppingCart' },
  { id: 'Product Details', name: 'Product Details', description: 'Description, features, specs, size charts, and FAQs', icon: 'FileText' },
  { id: 'Shipping & Trust', name: 'Shipping & Trust', description: 'Delivery checker, shipping rules, badges, and payments', icon: 'Truck' },
  { id: 'Recommendations', name: 'Recommendations', description: 'Related products, bundles, and frequently viewed', icon: 'Sparkles' },
  { id: 'Custom Content', name: 'Custom Content', description: 'Headings, text blocks, banners, dividers, and custom HTML', icon: 'Layers' },
];

export const PDP_BLOCK_DEFINITIONS: Record<PdpBlockType, PdpBlockDefinition> = {
  // ────────────────────────────────────────────────────────────
  // 1. PRODUCT MEDIA
  // ────────────────────────────────────────────────────────────
  media_gallery: {
    type: 'media_gallery',
    name: 'Product Image Gallery',
    category: 'Product Media',
    iconName: 'Image',
    description: 'High-res image showcase with configurable thumbnails, zoom, and aspect ratios',
    defaultContent: {
      mainImagePosition: 'left', // left | right
      thumbnailPosition: 'bottom', // top | bottom | left | right
      thumbnailAlignment: 'center', // left | center | right (for top/bottom)
      thumbnailPlacement: 'inner', // inner | outer (for left/right)
      aspectRatio: '1:1', // 1:1 | 3:4 | 4:3 | auto
      thumbnailSize: 'medium', // small | medium | large
      visibleThumbnails: 5,
      imageFit: 'cover', // cover | contain
      enableZoom: true,
      zoomType: 'hover-lens', // hover-lens | click-modal
      enableLightbox: true,
      showNavArrows: true,
      showPagination: true,
      mobileSwipe: true,
      gap: 12,
    },
    defaultDesign: {
      borderRadius: 12,
      border: '1px solid #e2e8f0',
      bgColor: '#ffffff',
    },
    contentFields: [
      {
        key: 'thumbnailPosition',
        label: 'Thumbnail Position',
        type: 'segmented',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Bottom', value: 'bottom' },
          { label: 'Right', value: 'right' },
          { label: 'Top', value: 'top' },
        ],
        defaultValue: 'bottom',
      },
      // Conditional thumbnail alignment (Top / Bottom)
      {
        key: 'thumbnailAlignment',
        label: 'Thumbnail Alignment',
        type: 'segmented',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' },
          { label: 'Right', value: 'right' },
        ],
        defaultValue: 'center',
        showWhen: { field: 'thumbnailPosition', valueIn: ['top', 'bottom'] },
        helpText: 'Horizontal alignment of thumbnails when positioned Top or Bottom',
      },
      // Conditional thumbnail placement (Left / Right)
      {
        key: 'thumbnailPlacement',
        label: 'Thumbnail Placement',
        type: 'segmented',
        options: [
          { label: 'Inner Placement', value: 'inner' },
          { label: 'Outer Placement', value: 'outer' },
        ],
        defaultValue: 'inner',
        showWhen: { field: 'thumbnailPosition', valueIn: ['left', 'right'] },
        helpText: 'Side docking behavior relative to main image container',
      },
      {
        key: 'aspectRatio',
        label: 'Image Aspect Ratio',
        type: 'select',
        options: [
          { label: 'Square (1:1)', value: '1:1' },
          { label: 'Portrait (3:4)', value: '3:4' },
          { label: 'Landscape (4:3)', value: '4:3' },
          { label: 'Natural / Auto', value: 'auto' },
        ],
        defaultValue: '1:1',
      },
      {
        key: 'thumbnailSize',
        label: 'Thumbnail Size',
        type: 'segmented',
        options: [
          { label: 'Small (50px)', value: 'small' },
          { label: 'Medium (70px)', value: 'medium' },
          { label: 'Large (90px)', value: 'large' },
        ],
        defaultValue: 'medium',
      },
      {
        key: 'imageFit',
        label: 'Image Object Fit',
        type: 'segmented',
        options: [
          { label: 'Cover', value: 'cover' },
          { label: 'Contain', value: 'contain' },
        ],
        defaultValue: 'cover',
      },
      { key: 'enableZoom', label: 'Enable Image Zoom', type: 'toggle', defaultValue: true },
      { key: 'enableLightbox', label: 'Full-screen Lightbox Modal', type: 'toggle', defaultValue: true },
      { key: 'showNavArrows', label: 'Show Navigation Arrows', type: 'toggle', defaultValue: true },
      { key: 'mobileSwipe', label: 'Enable Mobile Touch Swipe', type: 'toggle', defaultValue: true },
    ],
  },

  media_video: {
    type: 'media_video',
    name: 'Product Video',
    category: 'Product Media',
    iconName: 'Play',
    description: 'Embedded video player with autoplay, looping, and controls',
    defaultContent: {
      autoplay: false,
      loop: false,
      muted: true,
      controls: true,
      aspectRatio: '16:9',
      caption: 'Watch product in action',
    },
    contentFields: [
      { key: 'controls', label: 'Show Player Controls', type: 'toggle', defaultValue: true },
      { key: 'autoplay', label: 'Autoplay Video', type: 'toggle', defaultValue: false },
      { key: 'loop', label: 'Loop Continuously', type: 'toggle', defaultValue: false },
      { key: 'muted', label: 'Mute by Default', type: 'toggle', defaultValue: true },
      { key: 'caption', label: 'Video Caption Text', type: 'text', defaultValue: 'Watch product in action' },
    ],
  },

  media_zoom: {
    type: 'media_zoom',
    name: 'Image Zoom Preview',
    category: 'Product Media',
    iconName: 'Maximize2',
    description: 'Dedicated high-resolution zoom magnifier lens for product images',
    defaultContent: {
      zoomLevel: 2.5,
      lensShape: 'circle',
      lensSize: 180,
    },
    contentFields: [
      { key: 'zoomLevel', label: 'Magnification Level (x)', type: 'number', min: 1.5, max: 4, step: 0.5, defaultValue: 2.5 },
      { key: 'lensShape', label: 'Lens Shape', type: 'segmented', options: [{ label: 'Circle', value: 'circle' }, { label: 'Square', value: 'square' }], defaultValue: 'circle' },
    ],
  },

  media_badges: {
    type: 'media_badges',
    name: 'Image Badges Overlay',
    category: 'Product Media',
    iconName: 'Award',
    description: 'Overlay promotional badges (e.g. Sale, New, Organic) directly on media',
    defaultContent: {
      position: 'top-left', // top-left | top-right | bottom-left | bottom-right
      style: 'pill', // pill | badge | ribbon
      badgeColor: '#198754',
      badgeTextColor: '#ffffff',
    },
    contentFields: [
      { key: 'position', label: 'Badge Position', type: 'select', options: [
        { label: 'Top Left', value: 'top-left' },
        { label: 'Top Right', value: 'top-right' },
        { label: 'Bottom Left', value: 'bottom-left' },
        { label: 'Bottom Right', value: 'bottom-right' },
      ], defaultValue: 'top-left' },
      { key: 'style', label: 'Badge Style', type: 'segmented', options: [
        { label: 'Pill', value: 'pill' },
        { label: 'Square', value: 'square' },
        { label: 'Ribbon', value: 'ribbon' },
      ], defaultValue: 'pill' },
      { key: 'badgeColor', label: 'Badge Color', type: 'color', defaultValue: '#198754' },
      { key: 'badgeTextColor', label: 'Text Color', type: 'color', defaultValue: '#ffffff' },
    ],
  },

  media_carousel: {
    type: 'media_carousel',
    name: 'Product Image Carousel',
    category: 'Product Media',
    iconName: 'Layers',
    description: 'Horizontal sliding gallery with touch momentum and progress indicator',
    defaultContent: {
      autoScroll: false,
      interval: 4,
      showDots: true,
      dotsPosition: 'bottom',
    },
    contentFields: [
      { key: 'autoScroll', label: 'Auto Rotate Carousel', type: 'toggle', defaultValue: false },
      { key: 'showDots', label: 'Show Dot Indicators', type: 'toggle', defaultValue: true },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 2. PRODUCT INFORMATION
  // ────────────────────────────────────────────────────────────
  info_title: {
    type: 'info_title',
    name: 'Product Title',
    category: 'Product Information',
    iconName: 'Type',
    description: 'Renders the product name with customizable HTML tag, prefix/suffix, and typography',
    defaultContent: {
      htmlTag: 'h1',
      prefix: '',
      suffix: '',
      textTransform: 'none', // none | uppercase | capitalize | lowercase
    },
    defaultDesign: {
      fontSize: 28,
      fontWeight: 700,
      headingColor: '#0f172a',
      lineHeight: 1.25,
      letterSpacing: '-0.02em',
      textAlign: 'left',
    },
    contentFields: [
      {
        key: 'htmlTag',
        label: 'HTML Heading Tag',
        type: 'segmented',
        options: [
          { label: 'H1', value: 'h1' },
          { label: 'H2', value: 'h2' },
          { label: 'H3', value: 'h3' },
          { label: 'Div', value: 'div' },
        ],
        defaultValue: 'h1',
      },
      { key: 'prefix', label: 'Custom Prefix', type: 'text', defaultValue: '', helpText: 'Optional text prepended before product title' },
      { key: 'suffix', label: 'Custom Suffix', type: 'text', defaultValue: '', helpText: 'Optional text appended after product title' },
      {
        key: 'textTransform',
        label: 'Text Transformation',
        type: 'segmented',
        options: [
          { label: 'None', value: 'none' },
          { label: 'UPPERCASE', value: 'uppercase' },
          { label: 'Capitalize', value: 'capitalize' },
        ],
        defaultValue: 'none',
      },
    ],
  },

  info_subtitle: {
    type: 'info_subtitle',
    name: 'Product Subtitle',
    category: 'Product Information',
    iconName: 'AlignLeft',
    description: 'Catchy secondary tagline or brief highlight below title',
    defaultContent: {
      fontSize: 16,
      color: '#64748b',
    },
    defaultDesign: {
      fontSize: 15,
      textColor: '#64748b',
      lineHeight: 1.4,
    },
    contentFields: [
      { key: 'fontSize', label: 'Font Size (px)', type: 'number', min: 12, max: 24, defaultValue: 15 },
    ],
  },

  info_vendor: {
    type: 'info_vendor',
    name: 'Product Vendor / Brand',
    category: 'Product Information',
    iconName: 'Store',
    description: 'Brand or manufacturer name with optional clickable store link',
    defaultContent: {
      showLabel: true,
      labelText: 'Brand:',
      linkToVendor: true,
      textTransform: 'uppercase',
    },
    defaultDesign: {
      fontSize: 12,
      fontWeight: 600,
      textColor: '#198754',
      letterSpacing: '0.05em',
    },
    contentFields: [
      { key: 'showLabel', label: 'Show "Brand:" Prefix', type: 'toggle', defaultValue: true },
      { key: 'labelText', label: 'Label Prefix', type: 'text', defaultValue: 'Brand:' },
      { key: 'linkToVendor', label: 'Make Clickable Link', type: 'toggle', defaultValue: true },
    ],
  },

  info_category: {
    type: 'info_category',
    name: 'Product Category',
    category: 'Product Information',
    iconName: 'Folder',
    description: 'Category breadcrumb or pill tag indicating product taxonomy',
    defaultContent: {
      displayStyle: 'pill', // pill | text | breadcrumb
      showParentCategory: true,
    },
    contentFields: [
      { key: 'displayStyle', label: 'Display Style', type: 'segmented', options: [{ label: 'Pill Badge', value: 'pill' }, { label: 'Plain Text', value: 'text' }], defaultValue: 'pill' },
    ],
  },

  info_sku: {
    type: 'info_sku',
    name: 'Product SKU',
    category: 'Product Information',
    iconName: 'Hash',
    description: 'Stock Keeping Unit code for inventory tracking and identification',
    defaultContent: {
      showLabel: true,
      labelText: 'SKU:',
    },
    defaultDesign: {
      fontSize: 12,
      textColor: '#94a3b8',
    },
    contentFields: [
      { key: 'showLabel', label: 'Show "SKU:" Label', type: 'toggle', defaultValue: true },
      { key: 'labelText', label: 'Label Text', type: 'text', defaultValue: 'SKU:' },
    ],
  },

  info_rating: {
    type: 'info_rating',
    name: 'Product Rating & Stars',
    category: 'Product Information',
    iconName: 'Star',
    description: 'Average star rating display with score and link to review section',
    defaultContent: {
      starColor: '#f59e0b',
      starSize: 16,
      showScoreNumber: true,
      showReviewCount: true,
      scrollToReviewsOnClick: true,
    },
    contentFields: [
      { key: 'starColor', label: 'Star Color', type: 'color', defaultValue: '#f59e0b' },
      { key: 'showScoreNumber', label: 'Show Numerical Score (e.g. 4.9)', type: 'toggle', defaultValue: true },
      { key: 'showReviewCount', label: 'Show Review Count in Parentheses', type: 'toggle', defaultValue: true },
    ],
  },

  info_review_count: {
    type: 'info_review_count',
    name: 'Review Count',
    category: 'Product Information',
    iconName: 'MessageSquare',
    description: 'Customer review counter e.g. "382 Verified Reviews"',
    defaultContent: {
      format: 'long', // long ("382 Customer Reviews") | short ("(382)")
    },
    contentFields: [
      { key: 'format', label: 'Display Format', type: 'segmented', options: [{ label: 'Full Text', value: 'long' }, { label: 'Compact', value: 'short' }], defaultValue: 'long' },
    ],
  },

  info_badges: {
    type: 'info_badges',
    name: 'Product Badges',
    category: 'Product Information',
    iconName: 'Award',
    description: 'List of product highlight tags like Bestseller, Staff Pick, New',
    defaultContent: {
      badgeStyle: 'filled', // filled | outline | soft
      size: 'medium',
    },
    contentFields: [
      { key: 'badgeStyle', label: 'Badge Style', type: 'segmented', options: [{ label: 'Solid Filled', value: 'filled' }, { label: 'Soft Pastel', value: 'soft' }, { label: 'Outline', value: 'outline' }], defaultValue: 'soft' },
    ],
  },

  info_stock_status: {
    type: 'info_stock_status',
    name: 'Stock Status',
    category: 'Product Information',
    iconName: 'CheckCircle',
    description: 'Inventory availability indicator (In Stock, Low Stock, or Out of Stock)',
    defaultContent: {
      showExactUnits: true,
      lowStockThreshold: 10,
      inStockText: 'In Stock - Ready to Ship',
      lowStockText: 'Only {count} left in stock - order soon',
      outOfStockText: 'Currently Sold Out',
      showPulseDot: true,
    },
    contentFields: [
      { key: 'showExactUnits', label: 'Show Exact Inventory Count', type: 'toggle', defaultValue: true },
      { key: 'lowStockThreshold', label: 'Low Stock Alert Threshold', type: 'number', min: 1, max: 50, defaultValue: 10 },
      { key: 'showPulseDot', label: 'Show Animated Status Dot', type: 'toggle', defaultValue: true },
      { key: 'inStockText', label: 'In Stock Message', type: 'text', defaultValue: 'In Stock - Ready to Ship' },
      { key: 'outOfStockText', label: 'Out of Stock Message', type: 'text', defaultValue: 'Currently Sold Out' },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 3. PRICING & OFFERS
  // ────────────────────────────────────────────────────────────
  price_display: {
    type: 'price_display',
    name: 'Product Price',
    category: 'Pricing & Offers',
    iconName: 'DollarSign',
    description: 'Primary product price with compare-at price and discount savings badge',
    defaultContent: {
      currencySymbol: '$',
      currencyPosition: 'left', // left | right
      showCompareAtPrice: true,
      showDiscountBadge: true,
      discountBadgeStyle: 'pill', // pill | percentage-only | text
      fontSize: 26,
      boldPrice: true,
    },
    defaultDesign: {
      fontSize: 26,
      fontWeight: 700,
      textColor: '#0f172a',
    },
    contentFields: [
      { key: 'currencySymbol', label: 'Currency Symbol', type: 'text', defaultValue: '$' },
      { key: 'showCompareAtPrice', label: 'Show Compare-at Price Strikethrough', type: 'toggle', defaultValue: true },
      { key: 'showDiscountBadge', label: 'Show Savings / Discount Badge', type: 'toggle', defaultValue: true },
      { key: 'fontSize', label: 'Price Size (px)', type: 'number', min: 18, max: 48, defaultValue: 26 },
      { key: 'showTaxNotice', label: 'Show "Taxes Included" Note', type: 'toggle', defaultValue: false },
      { key: 'showInstallments', label: 'Show Installments Note (Klarna / Afterpay)', type: 'toggle', defaultValue: true },
      { key: 'salePriceColor', label: 'Sale Price Highlight Color', type: 'color', defaultValue: '#dc2626' },
    ],
  },

  price_compare: {
    type: 'price_compare',
    name: 'Compare-at Price',
    category: 'Pricing & Offers',
    iconName: 'Percent',
    description: 'Original list price with strikethrough styling',
    defaultContent: {
      prefix: 'Original: ',
      textColor: '#94a3b8',
    },
    contentFields: [
      { key: 'prefix', label: 'Prefix Label', type: 'text', defaultValue: 'Reg: ' },
    ],
  },

  price_discount: {
    type: 'price_discount',
    name: 'Discount Percentage Badge',
    category: 'Pricing & Offers',
    iconName: 'Tag',
    description: 'Eye-catching discount percentage badge (e.g. "Save 20%")',
    defaultContent: {
      format: 'Save {percent}%',
      badgeColor: '#dc2626',
      textColor: '#ffffff',
    },
    contentFields: [
      { key: 'format', label: 'Text Format', type: 'text', defaultValue: 'Save {percent}%' },
      { key: 'badgeColor', label: 'Badge Background Color', type: 'color', defaultValue: '#dc2626' },
      { key: 'textColor', label: 'Badge Text Color', type: 'color', defaultValue: '#ffffff' },
    ],
  },

  price_variant_selector: {
    type: 'price_variant_selector',
    name: 'Variant Picker',
    category: 'Pricing & Offers',
    iconName: 'CheckSquare',
    description: 'Shopify-style variant picker with pills, dropdowns, visual color swatches, and size guide',
    defaultContent: {
      displayStyle: 'pills', // pills | dropdown | color-swatches
      swatchShape: 'circle', // circle | square | rounded
      swatchSize: 'medium', // small | medium | large
      showSelectedLabel: true,
      pillRadius: 'rounded', // square | rounded | pill
      outOfStockStyle: 'diagonal-slash', // diagonal-slash | dimmed | hide
      showSizeGuide: true,
      sizeGuideLabel: 'Size guide',
      activeBorderColor: '#2563eb',
    },
    contentFields: [
      {
        key: 'displayStyle',
        label: 'Selector Style',
        type: 'segmented',
        options: [
          { label: 'Pills', value: 'pills' },
          { label: 'Dropdown', value: 'dropdown' },
          { label: 'Color Swatches', value: 'color-swatches' },
        ],
        defaultValue: 'pills',
        helpText: 'Display variant options as clickable pills, clean select dropdown, or color swatches',
      },
      {
        key: 'swatchShape',
        label: 'Swatch Shape',
        type: 'segmented',
        options: [
          { label: 'Circle', value: 'circle' },
          { label: 'Square', value: 'square' },
          { label: 'Rounded', value: 'rounded' },
        ],
        defaultValue: 'circle',
        showWhen: { field: 'displayStyle', value: 'color-swatches' },
      },
      {
        key: 'swatchSize',
        label: 'Swatch Size',
        type: 'segmented',
        options: [
          { label: 'Small', value: 'small' },
          { label: 'Medium', value: 'medium' },
          { label: 'Large', value: 'large' },
        ],
        defaultValue: 'medium',
        showWhen: { field: 'displayStyle', value: 'color-swatches' },
      },
      {
        key: 'pillRadius',
        label: 'Pill Corner Style',
        type: 'segmented',
        options: [
          { label: 'Rounded', value: 'rounded' },
          { label: 'Pill', value: 'pill' },
          { label: 'Sharp', value: 'square' },
        ],
        defaultValue: 'rounded',
        showWhen: { field: 'displayStyle', value: 'pills' },
      },
      {
        key: 'showSelectedLabel',
        label: 'Show Selected Value Header',
        type: 'toggle',
        defaultValue: true,
        helpText: 'Display selected option value next to label (e.g. "Color: Space Gray")',
      },
      {
        key: 'outOfStockStyle',
        label: 'Out-of-Stock Styling',
        type: 'segmented',
        options: [
          { label: 'Diagonal Slash', value: 'diagonal-slash' },
          { label: 'Dimmed', value: 'dimmed' },
          { label: 'Hide', value: 'hide' },
        ],
        defaultValue: 'diagonal-slash',
        helpText: 'Visual treatment when a specific variant combination is unavailable',
      },
      {
        key: 'showSizeGuide',
        label: 'Enable Size Guide Link',
        type: 'toggle',
        defaultValue: true,
        helpText: 'Shows a clickable "Size guide" button next to size options',
      },
      {
        key: 'sizeGuideLabel',
        label: 'Size Guide Text',
        type: 'text',
        defaultValue: 'Size guide',
        showWhen: { field: 'showSizeGuide', value: true },
      },
      {
        key: 'activeBorderColor',
        label: 'Active Accent Color',
        type: 'color',
        defaultValue: '#2563eb',
        helpText: 'Border and outline highlight for currently selected variant',
      },
    ],
  },

  price_measurement_qty: {
    type: 'price_measurement_qty',
    name: 'Measurement-Based Quantity Selector',
    category: 'Pricing & Offers',
    iconName: 'Scale',
    description: 'Weight or dimension based selector (e.g. grams, kg, meters, modules)',
    defaultContent: {
      unitLabel: 'Select Units',
      step: 1,
      min: 1,
      max: 10,
    },
    contentFields: [
      { key: 'unitLabel', label: 'Unit Title', type: 'text', defaultValue: 'Select Units' },
    ],
  },

  price_total_calculator: {
    type: 'price_total_calculator',
    name: 'Total Price Calculator',
    category: 'Pricing & Offers',
    iconName: 'Calculator',
    description: 'Live subtotal calculated in real-time as quantity or variants change',
    defaultContent: {
      label: 'Subtotal:',
      highlightColor: '#198754',
    },
    contentFields: [
      { key: 'label', label: 'Subtotal Label', type: 'text', defaultValue: 'Estimated Total:' },
    ],
  },

  price_bulk_discounts: {
    type: 'price_bulk_discounts',
    name: 'Quantity-Based Discounts',
    category: 'Pricing & Offers',
    iconName: 'Percent',
    description: 'Tiered wholesale / volume discount grid e.g. Buy 2 save 10%, Buy 5 save 20%',
    defaultContent: {
      title: 'Volume Savings',
      style: 'card-grid', // card-grid | table
    },
    contentFields: [
      { key: 'title', label: 'Section Title', type: 'text', defaultValue: 'Volume Pricing' },
      { key: 'style', label: 'Card Layout', type: 'segmented', options: [{ label: 'Cards', value: 'card-grid' }, { label: 'Table', value: 'table' }], defaultValue: 'card-grid' },
    ],
  },

  price_savings_info: {
    type: 'price_savings_info',
    name: 'Savings Information',
    category: 'Pricing & Offers',
    iconName: 'DollarSign',
    description: 'Calculates and shows exact monetary amount customer saves',
    defaultContent: {
      format: 'You save ${amount} ({percent}%)',
    },
    contentFields: [
      { key: 'format', label: 'Message Format', type: 'text', defaultValue: 'You save ${amount} ({percent}%)' },
    ],
  },

  price_unit_price: {
    type: 'price_unit_price',
    name: 'Unit Price Information',
    category: 'Pricing & Offers',
    iconName: 'Hash',
    description: 'Unit pricing for legal and consumer transparency (e.g. $4.90 / 100g)',
    defaultContent: {
      prefix: 'Unit Price: ',
    },
    contentFields: [
      { key: 'prefix', label: 'Prefix Label', type: 'text', defaultValue: 'Unit Price: ' },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 4. PURCHASE ACTIONS
  // ────────────────────────────────────────────────────────────
  action_quantity: {
    type: 'action_quantity',
    name: 'Quantity Selector',
    category: 'Purchase Actions',
    iconName: 'PlusSquare',
    description: 'Interactive counter with +/- buttons and direct input',
    defaultContent: {
      label: 'Quantity',
      style: 'stepper', // stepper | dropdown
      min: 1,
      max: 99,
    },
    contentFields: [
      { key: 'label', label: 'Field Label', type: 'text', defaultValue: 'Quantity' },
      { key: 'style', label: 'Selector Style', type: 'segmented', options: [{ label: 'Stepper (+ / -)', value: 'stepper' }, { label: 'Dropdown', value: 'dropdown' }], defaultValue: 'stepper' },
    ],
  },

  action_add_to_cart: {
    type: 'action_add_to_cart',
    name: 'Add to Cart',
    category: 'Purchase Actions',
    iconName: 'ShoppingCart',
    description: 'High-converting primary Add to Cart call to action button',
    defaultContent: {
      buttonText: 'Add to Cart',
      soldOutText: 'Sold Out',
      showIcon: true,
      iconType: 'shopping-cart',
      variant: 'primary', // primary | outline | secondary
      size: 'large', // medium | large
      fullWidth: true,
    },
    defaultDesign: {
      bgColor: '#198754',
      textColor: '#ffffff',
      borderRadius: 10,
      fontWeight: 600,
    },
    contentFields: [
      { key: 'buttonText', label: 'Button Text', type: 'text', defaultValue: 'Add to Cart' },
      { key: 'soldOutText', label: 'Sold Out Button Text', type: 'text', defaultValue: 'Sold Out' },
      { key: 'showIcon', label: 'Show Cart Icon', type: 'toggle', defaultValue: true },
      { key: 'fullWidth', label: 'Full Width Button', type: 'toggle', defaultValue: true },
      { key: 'buttonShape', label: 'Button Shape', type: 'segmented', options: [{ label: 'Rounded', value: 'rounded' }, { label: 'Pill', value: 'pill' }, { label: 'Square', value: 'square' }], defaultValue: 'rounded' },
      { key: 'buttonStyle', label: 'Button Visual Style', type: 'segmented', options: [{ label: 'Solid', value: 'solid' }, { label: 'Outline', value: 'outline' }, { label: 'Gradient', value: 'gradient' }], defaultValue: 'solid' },
      { key: 'buttonBgColor', label: 'Button Color', type: 'color', defaultValue: '#198754' },
      { key: 'buttonTextColor', label: 'Button Text Color', type: 'color', defaultValue: '#ffffff' },
    ],
  },

  action_buy_now: {
    type: 'action_buy_now',
    name: 'Buy Now',
    category: 'Purchase Actions',
    iconName: 'Zap',
    description: 'Direct 1-click accelerated checkout button (Shop Pay / Apple Pay / PayPal)',
    defaultContent: {
      buttonText: 'Buy Now - Instant Checkout',
      showIcon: true,
      variant: 'secondary',
      fullWidth: true,
    },
    defaultDesign: {
      bgColor: '#0f172a',
      textColor: '#ffffff',
      borderRadius: 10,
      fontWeight: 600,
    },
    contentFields: [
      { key: 'buttonText', label: 'Button Text', type: 'text', defaultValue: 'Buy Now - Instant Checkout' },
      { key: 'showIcon', label: 'Show Lightning Icon', type: 'toggle', defaultValue: true },
      { key: 'fullWidth', label: 'Full Width Button', type: 'toggle', defaultValue: true },
      { key: 'buttonBgColor', label: 'Button Background Color', type: 'color', defaultValue: '#0f172a' },
      { key: 'buttonTextColor', label: 'Button Text Color', type: 'color', defaultValue: '#ffffff' },
      { key: 'showPaymentBadges', label: 'Show Payment Method Badges', type: 'toggle', defaultValue: true },
    ],
  },

  action_wishlist: {
    type: 'action_wishlist',
    name: 'Wishlist Button',
    category: 'Purchase Actions',
    iconName: 'Heart',
    description: 'Save to customer wishlist heart button',
    defaultContent: {
      showLabel: true,
      labelText: 'Save to Wishlist',
      iconOnly: false,
    },
    contentFields: [
      { key: 'showLabel', label: 'Show Button Text', type: 'toggle', defaultValue: true },
      { key: 'labelText', label: 'Button Label', type: 'text', defaultValue: 'Save to Wishlist' },
    ],
  },

  action_share: {
    type: 'action_share',
    name: 'Share Product',
    category: 'Purchase Actions',
    iconName: 'Share2',
    description: 'Social sharing triggers for WhatsApp, X, Facebook, and Copy Link',
    defaultContent: {
      title: 'Share this product:',
      networks: ['whatsapp', 'twitter', 'facebook', 'copy'],
    },
    contentFields: [
      { key: 'title', label: 'Title Text', type: 'text', defaultValue: 'Share this item:' },
    ],
  },

  action_compare: {
    type: 'action_compare',
    name: 'Compare Product',
    category: 'Purchase Actions',
    iconName: 'Copy',
    description: 'Add to side-by-side product comparison tray',
    defaultContent: {
      label: 'Compare with similar items',
    },
    contentFields: [
      { key: 'label', label: 'Action Label', type: 'text', defaultValue: 'Compare with similar items' },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 5. PRODUCT DETAILS
  // ────────────────────────────────────────────────────────────
  detail_short_description: {
    type: 'detail_short_description',
    name: 'Short Description',
    category: 'Product Details',
    iconName: 'AlignLeft',
    description: 'Concise summary paragraph placed near buy box',
    defaultContent: {
      fontSize: 15,
      lineHeight: 1.5,
    },
    defaultDesign: {
      fontSize: 15,
      textColor: '#475569',
      lineHeight: 1.5,
    },
    contentFields: [
      { key: 'fontSize', label: 'Font Size (px)', type: 'number', min: 12, max: 20, defaultValue: 15 },
    ],
  },

  detail_full_description: {
    type: 'detail_full_description',
    name: 'Full Description',
    category: 'Product Details',
    iconName: 'FileText',
    description: 'Comprehensive editorial product description with Read More toggle',
    defaultContent: {
      title: 'Product Overview',
      showTitle: true,
      enableReadMore: true,
      collapsedHeight: 180,
    },
    defaultDesign: {
      fontSize: 15,
      textColor: '#334155',
      lineHeight: 1.6,
    },
    contentFields: [
      { key: 'showTitle', label: 'Show Section Heading', type: 'toggle', defaultValue: true },
      { key: 'title', label: 'Heading Text', type: 'text', defaultValue: 'Product Overview' },
      { key: 'layoutStyle', label: 'Presentation Style', type: 'segmented', options: [{ label: 'Expanded Full', value: 'expanded' }, { label: 'Collapsible Read More', value: 'collapsible' }, { label: 'Card Box', value: 'card' }], defaultValue: 'collapsible' },
      { key: 'enableReadMore', label: 'Enable "Read More / Read Less" Expansion', type: 'toggle', defaultValue: true },
      { key: 'collapsedHeight', label: 'Initial Max Height (px)', type: 'number', min: 100, max: 500, defaultValue: 180, showWhen: { field: 'enableReadMore', value: true } },
    ],
  },

  detail_key_features: {
    type: 'detail_key_features',
    name: 'Key Features',
    category: 'Product Details',
    iconName: 'ListChecks',
    description: 'Bullet list or grid of standout product features with custom check icons',
    defaultContent: {
      title: 'Key Features & Highlights',
      showTitle: true,
      layout: 'grid-2', // list | grid-2 | grid-3
      iconType: 'check-circle', // check-circle | star | zap | shield
      iconColor: '#198754',
    },
    contentFields: [
      { key: 'showTitle', label: 'Show Section Heading', type: 'toggle', defaultValue: true },
      { key: 'title', label: 'Section Title', type: 'text', defaultValue: 'Key Features & Highlights' },
      {
        key: 'layout',
        label: 'Layout Columns',
        type: 'segmented',
        options: [
          { label: 'Single List', value: 'list' },
          { label: '2 Columns', value: 'grid-2' },
          { label: '3 Columns', value: 'grid-3' },
        ],
        defaultValue: 'grid-2',
      },
      {
        key: 'iconType',
        label: 'Bullet Icon',
        type: 'segmented',
        options: [
          { label: 'Checkmark', value: 'check-circle' },
          { label: 'Sparkle', value: 'sparkles' },
          { label: 'Zap', value: 'zap' },
          { label: 'Shield', value: 'shield' },
        ],
        defaultValue: 'check-circle',
      },
      { key: 'iconColor', label: 'Icon Color', type: 'color', defaultValue: '#198754' },
    ],
  },

  detail_specifications: {
    type: 'detail_specifications',
    name: 'Specifications',
    category: 'Product Details',
    iconName: 'Sliders',
    description: 'Structured technical specifications table with alternating row colors',
    defaultContent: {
      title: 'Technical Specifications',
      showTitle: true,
      tableStyle: 'striped', // striped | bordered | minimal
      columns: 2,
    },
    contentFields: [
      { key: 'showTitle', label: 'Show Heading', type: 'toggle', defaultValue: true },
      { key: 'title', label: 'Section Heading', type: 'text', defaultValue: 'Technical Specifications' },
      {
        key: 'tableStyle',
        label: 'Table Presentation',
        type: 'segmented',
        options: [
          { label: 'Striped Rows', value: 'striped' },
          { label: 'Bordered Grid', value: 'bordered' },
          { label: 'Minimal Clean', value: 'minimal' },
        ],
        defaultValue: 'striped',
      },
      { key: 'compactRows', label: 'Compact Row Spacing', type: 'toggle', defaultValue: false },
    ],
  },

  detail_info_table: {
    type: 'detail_info_table',
    name: 'Product Information Table',
    category: 'Product Details',
    iconName: 'Table',
    description: 'Formatted table of product attributes, dimensions, and materials',
    defaultContent: {
      title: 'Item Information',
      showBorder: true,
    },
    contentFields: [
      { key: 'title', label: 'Heading', type: 'text', defaultValue: 'Item Information' },
      { key: 'showBorder', label: 'Show Outer Border', type: 'toggle', defaultValue: true },
    ],
  },

  detail_ingredients: {
    type: 'detail_ingredients',
    name: 'Ingredients',
    category: 'Product Details',
    iconName: 'Droplet',
    description: 'Dietary, food, and cosmetic ingredient list with badges',
    defaultContent: {
      title: 'Ingredients',
      style: 'badges', // badges | paragraph | list
    },
    contentFields: [
      { key: 'title', label: 'Section Heading', type: 'text', defaultValue: 'Ingredients' },
      { key: 'style', label: 'Display Style', type: 'segmented', options: [{ label: 'Badges / Pills', value: 'badges' }, { label: 'List', value: 'list' }], defaultValue: 'badges' },
    ],
  },

  detail_benefits: {
    type: 'detail_benefits',
    name: 'Benefits',
    category: 'Product Details',
    iconName: 'ThumbsUp',
    description: 'Health, ergonomic, or lifestyle benefits with icons',
    defaultContent: {
      title: 'Product Benefits',
    },
    contentFields: [
      { key: 'title', label: 'Heading Text', type: 'text', defaultValue: 'Why You\'ll Love It' },
    ],
  },

  detail_how_to_use: {
    type: 'detail_how_to_use',
    name: 'How to Use',
    category: 'Product Details',
    iconName: 'HelpCircle',
    description: 'Step-by-step instructions or application guide',
    defaultContent: {
      title: 'How to Use / Instructions',
    },
    contentFields: [
      { key: 'title', label: 'Heading', type: 'text', defaultValue: 'Instructions & Directions' },
    ],
  },

  detail_size_chart: {
    type: 'detail_size_chart',
    name: 'Size Chart',
    category: 'Product Details',
    iconName: 'Maximize',
    description: 'Interactive garment or footwear measurement chart (inline or popup)',
    defaultContent: {
      title: 'Size & Fit Guide',
      displayMode: 'inline', // inline | modal-button
      buttonLabel: 'View Size Chart & Measurements',
    },
    contentFields: [
      { key: 'title', label: 'Chart Title', type: 'text', defaultValue: 'Size & Fit Guide' },
      {
        key: 'displayMode',
        label: 'Display Mode',
        type: 'segmented',
        options: [
          { label: 'Inline Table', value: 'inline' },
          { label: 'Popup Modal Button', value: 'modal-button' },
        ],
        defaultValue: 'inline',
      },
      { key: 'buttonLabel', label: 'Modal Button Label', type: 'text', defaultValue: 'View Size Guide', showWhen: { field: 'displayMode', value: 'modal-button' } },
    ],
  },

  detail_care_instructions: {
    type: 'detail_care_instructions',
    name: 'Care Instructions',
    category: 'Product Details',
    iconName: 'Sun',
    description: 'Washing, maintenance, and cleaning instructions',
    defaultContent: {
      title: 'Care & Maintenance',
    },
    contentFields: [
      { key: 'title', label: 'Heading', type: 'text', defaultValue: 'Care & Cleaning' },
    ],
  },

  detail_tabs: {
    type: 'detail_tabs',
    name: 'Product Details Tabs',
    category: 'Product Details',
    iconName: 'Columns',
    description: 'Organized tabs grouping Description, Specs, Features, and Shipping',
    defaultContent: {
      tabStyle: 'underline', // underline | pills | boxed
      defaultTab: 'description',
    },
    contentFields: [
      { key: 'tabStyle', label: 'Tab Switcher Style', type: 'segmented', options: [{ label: 'Underline', value: 'underline' }, { label: 'Pill Buttons', value: 'pills' }, { label: 'Boxed', value: 'boxed' }], defaultValue: 'underline' },
    ],
  },

  detail_accordion: {
    type: 'detail_accordion',
    name: 'Accordion',
    category: 'Product Details',
    iconName: 'ChevronDown',
    description: 'Space-saving collapsible sections for product details',
    defaultContent: {
      allowMultipleOpen: false,
      firstOpenByDefault: true,
    },
    contentFields: [
      { key: 'firstOpenByDefault', label: 'First Section Open by Default', type: 'toggle', defaultValue: true },
      { key: 'allowMultipleOpen', label: 'Allow Multiple Open Simultaneously', type: 'toggle', defaultValue: false },
    ],
  },

  detail_faq: {
    type: 'detail_faq',
    name: 'FAQ',
    category: 'Product Details',
    iconName: 'HelpCircle',
    description: 'Frequently asked questions accordion with instant expand/collapse',
    defaultContent: {
      title: 'Frequently Asked Questions',
      showTitle: true,
    },
    contentFields: [
      { key: 'showTitle', label: 'Show Section Title', type: 'toggle', defaultValue: true },
      { key: 'title', label: 'Title Text', type: 'text', defaultValue: 'Frequently Asked Questions' },
      { key: 'faqStyle', label: 'FAQ Presentation Style', type: 'segmented', options: [{ label: 'Accordion', value: 'accordion' }, { label: 'Cards', value: 'cards' }, { label: 'Two Columns', value: '2-col' }], defaultValue: 'accordion' },
      { key: 'firstOpenByDefault', label: 'First Question Open by Default', type: 'toggle', defaultValue: true },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 6. SHIPPING & TRUST
  // ────────────────────────────────────────────────────────────
  trust_delivery_checker: {
    type: 'trust_delivery_checker',
    name: 'Delivery Checker',
    category: 'Shipping & Trust',
    iconName: 'MapPin',
    description: 'Postal/Zip code input allowing shoppers to check delivery speed and cost',
    defaultContent: {
      title: 'Check Delivery & Availability',
      placeholder: 'Enter ZIP / Postal Code',
      buttonText: 'Check',
      successMessage: 'Express delivery available to this location!',
    },
    contentFields: [
      { key: 'title', label: 'Heading Text', type: 'text', defaultValue: 'Check Delivery Options' },
      { key: 'placeholder', label: 'Input Placeholder', type: 'text', defaultValue: 'Enter Zip / Postal Code' },
      { key: 'buttonText', label: 'Button Text', type: 'text', defaultValue: 'Check' },
    ],
  },

  trust_shipping_info: {
    type: 'trust_shipping_info',
    name: 'Shipping Information',
    category: 'Shipping & Trust',
    iconName: 'Truck',
    description: 'Delivery timelines, shipping carrier, and free delivery thresholds',
    defaultContent: {
      showIcon: true,
      freeShippingThresholdText: 'Free shipping on orders over ${threshold}',
    },
    contentFields: [
      { key: 'showIcon', label: 'Show Shipping Truck Icon', type: 'toggle', defaultValue: true },
    ],
  },

  trust_return_policy: {
    type: 'trust_return_policy',
    name: 'Return Policy',
    category: 'Shipping & Trust',
    iconName: 'RotateCcw',
    description: 'Hassle-free return policy statement e.g. 30-Day Easy Returns',
    defaultContent: {
      showBadge: true,
      badgeText: '30-Day Returns',
    },
    contentFields: [
      { key: 'showBadge', label: 'Show Highlight Badge', type: 'toggle', defaultValue: true },
      { key: 'badgeText', label: 'Badge Text', type: 'text', defaultValue: '30-Day Returns' },
    ],
  },

  trust_badges: {
    type: 'trust_badges',
    name: 'Trust Badges',
    category: 'Shipping & Trust',
    iconName: 'ShieldCheck',
    description: 'Reassurance icons: 100% Authentic, Secure Checkout, Money-Back Guarantee',
    defaultContent: {
      layout: 'row', // row | grid
      showGuaranteed: true,
      showAuthentic: true,
      showSecure: true,
    },
    contentFields: [
      { key: 'layout', label: 'Badge Layout', type: 'segmented', options: [{ label: 'Horizontal Row', value: 'row' }, { label: '2x2 Grid', value: 'grid' }], defaultValue: 'row' },
      { key: 'showSecure', label: 'Show "256-Bit SSL Encrypted"', type: 'toggle', defaultValue: true },
      { key: 'showAuthentic', label: 'Show "100% Authentic Guaranteed"', type: 'toggle', defaultValue: true },
      { key: 'showGuaranteed', label: 'Show "Money-Back Guarantee"', type: 'toggle', defaultValue: true },
    ],
  },

  trust_payment_icons: {
    type: 'trust_payment_icons',
    name: 'Payment Information',
    category: 'Shipping & Trust',
    iconName: 'CreditCard',
    description: 'Payment brand icons: Visa, Mastercard, Amex, Apple Pay, PayPal, Klarna',
    defaultContent: {
      title: 'Guaranteed Safe Checkout',
      iconSize: 'medium', // small | medium | large
    },
    contentFields: [
      { key: 'title', label: 'Title Text', type: 'text', defaultValue: 'Guaranteed Safe & Secure Checkout' },
      { key: 'iconSize', label: 'Icon Size', type: 'segmented', options: [{ label: 'Small', value: 'small' }, { label: 'Medium', value: 'medium' }, { label: 'Large', value: 'large' }], defaultValue: 'medium' },
    ],
  },

  trust_shipping_benefits: {
    type: 'trust_shipping_benefits',
    name: 'Shipping Benefits',
    category: 'Shipping & Trust',
    iconName: 'PackageCheck',
    description: 'Highlights: Free Returns, Contactless Delivery, Eco-friendly Packaging',
    defaultContent: {
      title: 'Why Buy From Us',
    },
    contentFields: [
      { key: 'title', label: 'Heading', type: 'text', defaultValue: 'Store Benefits' },
    ],
  },

  trust_estimated_delivery: {
    type: 'trust_estimated_delivery',
    name: 'Estimated Delivery Information',
    category: 'Shipping & Trust',
    iconName: 'Clock',
    description: 'Countdown urgency timer e.g. "Order in next 3h 12m to get it by Thursday"',
    defaultContent: {
      showCountdown: true,
      countdownHours: 4,
      daysToAdd: 3,
    },
    contentFields: [
      { key: 'showCountdown', label: 'Show Live Urgency Countdown Timer', type: 'toggle', defaultValue: true },
      { key: 'daysToAdd', label: 'Delivery Transit Days', type: 'number', min: 1, max: 14, defaultValue: 3 },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 7. RECOMMENDATIONS
  // ────────────────────────────────────────────────────────────
  rec_related: {
    type: 'rec_related',
    name: 'Related Products',
    category: 'Recommendations',
    iconName: 'Sparkles',
    description: 'Curated products from the same category or collection',
    defaultContent: {
      heading: 'You May Also Like',
      count: 4,
      layout: 'grid', // grid | carousel
    },
    contentFields: [
      { key: 'heading', label: 'Section Heading', type: 'text', defaultValue: 'You May Also Like' },
      { key: 'count', label: 'Number of Items', type: 'number', min: 2, max: 8, defaultValue: 4 },
      { key: 'layout', label: 'Layout Format', type: 'segmented', options: [{ label: 'Grid', value: 'grid' }, { label: 'Carousel Slider', value: 'carousel' }], defaultValue: 'grid' },
      { key: 'showPrice', label: 'Show Product Prices', type: 'toggle', defaultValue: true },
      { key: 'showRating', label: 'Show Star Ratings', type: 'toggle', defaultValue: true },
    ],
  },

  rec_frequently_bought: {
    type: 'rec_frequently_bought',
    name: 'Frequently Bought Together',
    category: 'Recommendations',
    iconName: 'PlusSquare',
    description: 'Cross-sell bundle widget with 1-click "Add All to Cart" button',
    defaultContent: {
      heading: 'Frequently Bought Together',
      bundleDiscount: 10,
    },
    contentFields: [
      { key: 'heading', label: 'Widget Title', type: 'text', defaultValue: 'Frequently Bought Together' },
      { key: 'bundleDiscount', label: 'Bundle Discount Percent (%)', type: 'number', min: 0, max: 30, defaultValue: 10 },
    ],
  },

  rec_recently_viewed: {
    type: 'rec_recently_viewed',
    name: 'Recently Viewed Products',
    category: 'Recommendations',
    iconName: 'Eye',
    description: 'Customer browsing history carousel for seamless return navigation',
    defaultContent: {
      heading: 'Recently Viewed',
      count: 4,
    },
    contentFields: [
      { key: 'heading', label: 'Heading Text', type: 'text', defaultValue: 'Recently Viewed' },
    ],
  },

  rec_recommended: {
    type: 'rec_recommended',
    name: 'Recommended Products',
    category: 'Recommendations',
    iconName: 'Sparkles',
    description: 'AI personalized product recommendations',
    defaultContent: {
      heading: 'Recommended For You',
      count: 4,
    },
    contentFields: [
      { key: 'heading', label: 'Heading Text', type: 'text', defaultValue: 'Recommended For You' },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 8. CUSTOM CONTENT
  // ────────────────────────────────────────────────────────────
  custom_text: {
    type: 'custom_text',
    name: 'Custom Text',
    category: 'Custom Content',
    iconName: 'AlignLeft',
    description: 'Custom rich paragraph or notice anywhere in the template',
    defaultContent: {
      text: 'BillionBiz guarantees authentic items, fast logistics, and 24/7 client support.',
    },
    contentFields: [
      { key: 'text', label: 'Text Content', type: 'textarea', defaultValue: 'Custom informational paragraph text.' },
    ],
  },

  custom_heading: {
    type: 'custom_heading',
    name: 'Custom Heading',
    category: 'Custom Content',
    iconName: 'Heading',
    description: 'Custom headline for section breaks or announcements',
    defaultContent: {
      text: 'Special Promotional Notice',
      tag: 'h3',
    },
    contentFields: [
      { key: 'text', label: 'Heading Text', type: 'text', defaultValue: 'Special Promotional Notice' },
      { key: 'tag', label: 'HTML Tag', type: 'segmented', options: [{ label: 'H2', value: 'h2' }, { label: 'H3', value: 'h3' }, { label: 'H4', value: 'h4' }], defaultValue: 'h3' },
    ],
  },

  custom_image: {
    type: 'custom_image',
    name: 'Custom Image',
    category: 'Custom Content',
    iconName: 'Image',
    description: 'Custom promotional banner or certification graphic',
    defaultContent: {
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&h=400&fit=crop',
      altText: 'Promotional Banner',
      linkUrl: '',
    },
    contentFields: [
      { key: 'imageUrl', label: 'Image URL', type: 'text', defaultValue: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&h=400&fit=crop' },
      { key: 'altText', label: 'Alt Text', type: 'text', defaultValue: 'Promotional Banner' },
      { key: 'linkUrl', label: 'Click Destination URL', type: 'text', defaultValue: '' },
    ],
  },

  custom_video: {
    type: 'custom_video',
    name: 'Custom Video',
    category: 'Custom Content',
    iconName: 'Video',
    description: 'Embed YouTube, Vimeo, or MP4 video banner',
    defaultContent: {
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      aspectRatio: '16:9',
    },
    contentFields: [
      { key: 'videoUrl', label: 'Video Embed URL', type: 'text', defaultValue: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    ],
  },

  custom_html: {
    type: 'custom_html',
    name: 'Custom HTML',
    category: 'Custom Content',
    iconName: 'Code',
    description: 'Arbitrary custom HTML, embeds, or script tags',
    defaultContent: {
      html: '<div style="padding: 12px; background: #e0f2fe; border-radius: 8px; color: #0369a1; font-weight: 500;">✓ Free expedited shipping available on all orders today!</div>',
    },
    contentFields: [
      { key: 'html', label: 'Raw HTML / Embed Code', type: 'textarea', defaultValue: '<div style="padding: 12px; background: #e0f2fe; border-radius: 8px; color: #0369a1;">Custom HTML Banner</div>' },
    ],
  },

  custom_banner: {
    type: 'custom_banner',
    name: 'Custom Banner',
    category: 'Custom Content',
    iconName: 'Flag',
    description: 'Promotional announcement box with CTA button and colored background',
    defaultContent: {
      headline: 'Limited Time Seasonal Offer',
      subheadline: 'Receive a complimentary gift with purchase over $100.',
      buttonText: 'Learn More',
      buttonUrl: '#',
      bgColor: '#f0fdf4',
      textColor: '#166534',
    },
    contentFields: [
      { key: 'headline', label: 'Banner Headline', type: 'text', defaultValue: 'Limited Time Seasonal Offer' },
      { key: 'subheadline', label: 'Sub-headline Text', type: 'text', defaultValue: 'Receive a complimentary gift with purchase over $100.' },
      { key: 'buttonText', label: 'Button Text', type: 'text', defaultValue: 'Learn More' },
      { key: 'bgColor', label: 'Banner Background Color', type: 'color', defaultValue: '#f0fdf4' },
      { key: 'textColor', label: 'Text Color', type: 'color', defaultValue: '#166534' },
    ],
  },

  custom_divider: {
    type: 'custom_divider',
    name: 'Divider',
    category: 'Custom Content',
    iconName: 'Minus',
    description: 'Horizontal subtle separator line between sections',
    defaultContent: {
      thickness: 1,
      style: 'solid', // solid | dashed | dotted
      color: '#e2e8f0',
      width: '100%',
    },
    contentFields: [
      { key: 'thickness', label: 'Line Thickness (px)', type: 'number', min: 1, max: 10, defaultValue: 1 },
      { key: 'style', label: 'Line Style', type: 'segmented', options: [{ label: 'Solid', value: 'solid' }, { label: 'Dashed', value: 'dashed' }, { label: 'Dotted', value: 'dotted' }], defaultValue: 'solid' },
      { key: 'color', label: 'Line Color', type: 'color', defaultValue: '#e2e8f0' },
    ],
  },

  custom_spacer: {
    type: 'custom_spacer',
    name: 'Spacer',
    category: 'Custom Content',
    iconName: 'Maximize2',
    description: 'Adjustable blank vertical spacing block',
    defaultContent: {
      height: 32,
    },
    contentFields: [
      { key: 'height', label: 'Space Height (px)', type: 'number', min: 8, max: 160, step: 4, defaultValue: 32 },
    ],
  },

  custom_icon_text: {
    type: 'custom_icon_text',
    name: 'Icon with Text',
    category: 'Custom Content',
    iconName: 'HelpCircle',
    description: 'Feature callout item with icon, headline, and subtext',
    defaultContent: {
      headline: 'Authenticity Guaranteed',
      text: 'Directly sourced from verified brands and workshops.',
      icon: 'ShieldCheck',
    },
    contentFields: [
      { key: 'headline', label: 'Headline', type: 'text', defaultValue: 'Authenticity Guaranteed' },
      { key: 'text', label: 'Description', type: 'textarea', defaultValue: 'Directly sourced from verified brands and workshops.' },
    ],
  },

  custom_info_section: {
    type: 'custom_info_section',
    name: 'Custom Information Section',
    category: 'Custom Content',
    iconName: 'Info',
    description: 'Callout notification card with colored border accent',
    defaultContent: {
      title: 'Important Care Note',
      body: 'Please review specifications carefully prior to assembly.',
      variant: 'info', // info | warning | success
    },
    contentFields: [
      { key: 'title', label: 'Title', type: 'text', defaultValue: 'Important Notice' },
      { key: 'body', label: 'Message Body', type: 'textarea', defaultValue: 'Please review specifications carefully prior to installation.' },
    ],
  },

  group: {
    type: 'group',
    name: 'Group',
    category: 'Custom Content',
    iconName: 'Folder',
    description: 'Container for grouping multiple inner blocks together',
    defaultContent: {
      direction: 'vertical',
      gap: 12,
    },
    defaultDesign: {
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    contentFields: [
      {
        key: 'direction',
        label: 'Layout Direction',
        type: 'segmented',
        options: [
          { label: 'Vertical', value: 'vertical' },
          { label: 'Horizontal', value: 'horizontal' },
        ],
      },
      {
        key: 'gap',
        label: 'Gap (px)',
        type: 'number',
        min: 0,
        max: 64,
        step: 4,
        unit: 'px',
      },
    ],
  },
};

/**
 * Resolves the default layout zone for any block type
 * - 'media': Product imagery column
 * - 'buy_box': Near the image (Title, Price, Variants, Actions, Short description, Trust)
 * - 'full_width': Below the fold (Full description, Specs, FAQ, Recommendations, Custom content)
 */
export function getDefaultZoneForType(type: PdpBlockType): PdpBlockZone {
  if (type === 'group') {
    return 'buy_box';
  }
  if (type.startsWith('media_')) {
    return 'media';
  }
  if (
    type.startsWith('info_') ||
    type.startsWith('price_') ||
    type.startsWith('action_') ||
    type === 'detail_short_description' ||
    type.startsWith('trust_')
  ) {
    return 'buy_box'; // Near the Image
  }
  return 'full_width'; // Below the fold
}

/**
 * Returns the effective zone of a block, falling back to its smart default
 */
export function resolveBlockZone(block: PdpBlock): PdpBlockZone {
  if (block.zone) return block.zone;
  return getDefaultZoneForType(block.type);
}

/**
 * Checks if a block belongs inside the "Product information" hero section (Shopify architecture)
 */
export function isProductInfoBlock(block: PdpBlock): boolean {
  const zone = resolveBlockZone(block);
  return zone === 'buy_box' || zone === 'media';
}

/**
 * Checks if a block is a full-width Template Section below Product information (Shopify architecture)
 */
export function isTemplateSection(block: PdpBlock): boolean {
  return resolveBlockZone(block) === 'full_width';
}

/**
 * User-friendly display names for PDP blocks
 */
export function getPdpBlockDisplayName(block: { type: string; name?: string }): string {
  if (block.type === 'group') {
    return block.name || 'Group';
  }
  const cleanNames: Record<string, string> = {
    info_title: 'Title',
    info_subtitle: 'Subtitle',
    info_vendor: 'Vendor',
    info_category: 'Category',
    info_sku: 'SKU',
    info_rating: 'Rating & reviews',
    info_review_count: 'Review count',
    info_badges: 'Product badges',
    info_stock_status: 'Stock status',
    price_display: 'Price',
    price_compare: 'Compare price',
    price_discount: 'Discount badge',
    price_variant_selector: 'Variant picker',
    price_measurement_qty: 'Measurement qty',
    price_total_calculator: 'Price calculator',
    price_bulk_discounts: 'Volume pricing',
    price_savings_info: 'Savings info',
    price_unit_price: 'Unit price',
    action_quantity: 'Quantity selector',
    action_add_to_cart: 'Add to cart',
    action_buy_now: 'Buy now',
    action_wishlist: 'Wishlist button',
    action_share: 'Share button',
    action_compare: 'Compare button',
    media_gallery: 'Product media gallery',
    media_video: 'Product video',
    media_zoom: 'Image zoom',
    media_badges: 'Image badges',
    media_carousel: 'Media carousel',
    detail_short_description: 'Short description',
    detail_full_description: 'Description',
    detail_key_features: 'Key features',
    detail_specifications: 'Specifications',
    detail_info_table: 'Information table',
    detail_ingredients: 'Ingredients',
    detail_benefits: 'Benefits',
    detail_how_to_use: 'How to use',
    detail_size_chart: 'Size chart',
    detail_care_instructions: 'Care instructions',
    detail_tabs: 'Tabbed details',
    detail_accordion: 'Collapsible rows',
    detail_faq: 'FAQ',
    trust_delivery_checker: 'Delivery checker',
    trust_shipping_info: 'Shipping information',
    trust_return_policy: 'Return policy',
    trust_badges: 'Trust badges',
    trust_payment_icons: 'Payment icons',
    trust_shipping_benefits: 'Shipping benefits',
    trust_estimated_delivery: 'Estimated delivery',
    rec_related: 'Related products',
    rec_frequently_bought: 'Frequently bought together',
    rec_recently_viewed: 'Recently viewed',
    rec_recommended: 'Recommended products',
    custom_text: 'Custom text',
    custom_heading: 'Custom heading',
    custom_image: 'Custom image',
    custom_video: 'Custom video',
    custom_html: 'Custom HTML',
    custom_banner: 'Announcement banner',
    custom_divider: 'Divider',
    custom_spacer: 'Spacer',
    custom_icon_text: 'Icon with text',
    custom_info_section: 'Custom section',
  };

  return cleanNames[block.type] || block.name || 'Component';
}

/**
 * Creates a brand-new PdpBlock instance with fresh IDs and sensible defaults
 */
export function createPdpBlock(type: PdpBlockType, nameOverride?: string): PdpBlock {
  const def = PDP_BLOCK_DEFINITIONS[type];
  if (!def) {
    throw new Error(`Unknown PDP block type: ${type}`);
  }

  const id = `block-${type.replace(/_/g, '-')}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

  return {
    id,
    type,
    name: nameOverride || def.name,
    category: def.category,
    zone: getDefaultZoneForType(type),
    isLocked: false,
    isHidden: false,
    children: type === 'group' ? [] : undefined,
    content: { ...def.defaultContent },
    design: {
      padding: { top: 8, right: 0, bottom: 8, left: 0 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      ...def.defaultDesign,
    },
    visibility: {
      desktop: true,
      tablet: true,
      mobile: true,
      hideIfEmpty: true, // Default: dynamically hide when product data is empty! (spec §2.D.3)
      ...def.defaultVisibility,
    },
    advanced: {
      customId: id,
      customClass: '',
      customCss: '',
      bindingField: '',
      fallbackValue: '',
    },
  };
}
