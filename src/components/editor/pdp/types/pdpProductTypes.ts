// ============================================================
// PDP BUILDER — PRODUCT DATA TYPES & SAMPLE CATALOGUE
// ============================================================

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Size", "Color"
  options: string[]; // e.g. ["S", "M", "L", "XL"] or ["Space Gray", "Silver"]
  selectedOption?: string;
  inStock?: boolean;
  priceDelta?: number;
}

export interface SizeChartData {
  title: string;
  columns: string[];
  rows: Array<Record<string, string>>;
}

export interface BulkDiscountTier {
  minQty: number;
  discountPercent: number;
  label?: string;
}

export interface ShippingInfoData {
  time: string; // e.g. "2-4 Business Days"
  freeThreshold?: number; // e.g. 50
  returnDays?: number; // e.g. 30
  carrier?: string; // e.g. "FedEx Express"
  shipsFrom?: string; // e.g. "San Francisco, CA"
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface PdpProduct {
  id: string;
  name: string;
  slug: string;
  subtitle?: string;
  vendor?: string;
  category?: string;
  productType?: string;
  sku?: string;
  rating?: number;
  reviewCount?: number;
  badges?: string[];
  price: number;
  compareAtPrice?: number;
  stock: number; // Important: 0 is valid "Out of Stock" and must NOT be treated as empty!
  variants?: ProductVariant[];
  shortDescription?: string;
  description?: string;
  images: string[];
  videoUrl?: string;
  keyFeatures?: string[];
  specifications?: Record<string, string>;
  ingredients?: string[];
  sizeChart?: SizeChartData;
  benefits?: string[];
  howToUse?: string;
  faqs?: FaqItem[];
  careInstructions?: string;
  shippingInfo?: ShippingInfoData;
  returnPolicy?: string;
  tags?: string[];
  unitPrice?: string; // e.g. "$4.50 / 100g"
  bulkDiscounts?: BulkDiscountTier[];
  measurementConfig?: {
    unit: string;
    step: number;
    min: number;
    max: number;
  };
  relatedProductIds?: string[];
  assignedTemplateId?: string | null; // null or 'default' = resolves to default template
}

// ────────────────────────────────────────────────────────────
// SAMPLE PRODUCT CATALOGUE
// Designed specifically to test all content availability edge cases:
// Product A: Complete (all content)
// Product B: Features + Specs (No Description, No Size Chart, No FAQ)
// Product C: Description + Size Chart (No Features, No Specs, No FAQ)
// Product D: Specs + FAQ (No Description, No Features, No Size Chart)
// Product E: Zero Stock Test (Description, Features, stock = 0 - Out of Stock)
// Product F: Luxury Furniture (Measurements, Bulk Tier, Custom Details)
// ────────────────────────────────────────────────────────────

export const SAMPLE_PRODUCTS: PdpProduct[] = [
  // ── PRODUCT A: COMPLETE DATA (Electronics) ──
  {
    id: 'prod-a',
    name: 'Apex Pro Wireless Mechanical Keyboard',
    slug: 'apex-pro-wireless-keyboard',
    subtitle: 'Ultra-low latency dual wireless with hot-swappable tactile switches',
    vendor: 'NordicTech',
    category: 'Electronics',
    productType: 'Keyboards',
    sku: 'NT-APEX-WL-01',
    rating: 4.9,
    reviewCount: 382,
    badges: ['Bestseller', 'Staff Pick', 'Save 20%'],
    price: 179.99,
    compareAtPrice: 224.99,
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=800&fit=crop',
    ],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    shortDescription: 'Precision engineered for competitive gaming and all-day typing comfort with custom PBT keycaps.',
    description: `The Apex Pro Wireless represents the pinnacle of mechanical keyboard engineering. Featuring our proprietary OmniPoint optical switches with adjustable actuation points from 0.2mm to 3.8mm, every keystroke delivers instantaneous feedback. 

With aerospace-grade aluminum construction, sound-dampening silicone foam, and 200 hours of continuous wireless battery life over 2.4GHz Slipstream or Bluetooth 5.2, this is the ultimate deck for enthusiasts.`,
    keyFeatures: [
      'OmniPoint 2.0 Adjustable Optical Switches (0.2mm - 3.8mm)',
      'Dual Wireless: 2.4GHz Slipstream (1ms) & Bluetooth 5.2',
      'Double-shot PBT keycaps with textured oil-resistant finish',
      'Per-key RGB illumination with dynamic reactive lighting presets',
      'OLED Smart Display for notifications, profiles, and GIFs on-the-fly',
      'Detachable magnetic soft-touch wrist rest included',
    ],
    specifications: {
      'Switch Type': 'OmniPoint 2.0 Adjustable Hyper-Magnetic',
      'Actuation Distance': '0.1mm to 4.0mm customizable',
      'Polling Rate': '8,000 Hz / 0.125ms response',
      'Connectivity': '2.4GHz Wireless, Bluetooth 5.2, USB-C Wired',
      'Battery Life': 'Up to 200 hours (Bluetooth), 140 hours (2.4GHz)',
      'Dimensions': '355 x 128 x 42 mm',
      'Weight': '960g (2.11 lbs)',
      'Frame Material': 'Series 5000 Aircraft Grade Aluminum',
      'Warranty': '2-Year International Manufacturer Warranty',
    },
    variants: [
      { id: 'v-switch', name: 'Switch Type', options: ['Tactile Brown', 'Linear Red', 'Clicky Blue'], selectedOption: 'Linear Red', inStock: true },
      { id: 'v-layout', name: 'Layout', options: ['ANSI (US)', 'ISO (UK)', 'Nordic'], selectedOption: 'ANSI (US)', inStock: true },
    ],
    faqs: [
      { question: 'Is this keyboard compatible with macOS and Windows?', answer: 'Yes! It features a dedicated hardware toggle switch for instant switching between macOS and Windows layouts, with Mac-specific modifier keys included in the box.' },
      { question: 'Can I swap the switches myself?', answer: 'Absolutely. The hot-swap PCB supports both 3-pin and 5-pin Cherry MX style mechanical and magnetic switches without soldering.' },
      { question: 'How long does a full charge take?', answer: 'A full charge from 0% takes roughly 90 minutes via the included braided USB-C fast-charging cable.' },
    ],
    shippingInfo: {
      time: '1-3 Business Days',
      freeThreshold: 75,
      returnDays: 30,
      carrier: 'FedEx Express Courier',
      shipsFrom: 'Austin, TX',
    },
    returnPolicy: '30-day money-back guarantee with zero restocking fees. Free return shipping labels provided.',
    tags: ['electronics', 'gaming', 'wireless', 'mechanical', 'rgb', 'premium'],
    bulkDiscounts: [
      { minQty: 2, discountPercent: 10, label: 'Buy 2, Save 10%' },
      { minQty: 5, discountPercent: 20, label: 'Buy 5+, Save 20%' },
    ],
    assignedTemplateId: 'template-electronics',
  },

  // ── PRODUCT B: FEATURES + SPECS ONLY (Grocery / Natural Food) ──
  // No description, No size chart, No FAQ
  {
    id: 'prod-b',
    name: 'Raw Organic Wildflower Forest Honey',
    slug: 'raw-organic-wildflower-honey',
    subtitle: 'Unpasteurized, single-origin cold-extracted raw mountain honey',
    vendor: 'Hive & Valley Botanicals',
    category: 'Grocery',
    productType: 'Pantry',
    sku: 'HV-HONEY-500G',
    rating: 4.8,
    reviewCount: 147,
    badges: ['Organic Certified', 'Raw & Unfiltered', 'Non-GMO'],
    price: 24.50,
    compareAtPrice: 29.00,
    stock: 28,
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&h=800&fit=crop',
    ],
    // Explicitly NO description!
    shortDescription: '100% pure raw wildflower honey harvested sustainably from pristine alpine meadows.',
    keyFeatures: [
      'Single-origin raw wildflower nectar from high-altitude apiaries',
      'Cold-extracted below 95°F to preserve active enzymes and pollen',
      'Naturally rich in antioxidants, flavonoids, and prebiotics',
      'Zero additives, preservatives, corn syrup, or artificial coloring',
      'Packaged in amber UV-protective glass jar with tamper-proof seal',
    ],
    specifications: {
      'Net Weight': '500g (17.6 oz)',
      'Ingredients': '100% Pure Raw Certified Organic Honey',
      'Origin': 'Cascades Mountain Range, Oregon, USA',
      'Certifications': 'USDA Organic, Non-GMO Project Verified',
      'Storage': 'Store at room temperature; do not refrigerate',
      'Shelf Life': 'Indefinite (natural crystallization is normal)',
    },
    ingredients: [
      '100% Pure Raw Wildflower Honey',
      'Natural Bee Pollen (trace)',
      'Propolis (trace)',
    ],
    benefits: [
      'Natural sustained energy booster',
      'Soothes throat irritation naturally',
      'Rich in antibacterial polyphenols',
    ],
    unitPrice: '$4.90 / 100g',
    shippingInfo: {
      time: '2-4 Business Days',
      freeThreshold: 40,
      returnDays: 14,
      carrier: 'USPS Priority Mail',
    },
    returnPolicy: 'Food & Pantry items are eligible for refund or replacement within 14 days if damaged in transit.',
    tags: ['grocery', 'organic', 'raw-honey', 'superfood', 'natural'],
    assignedTemplateId: 'template-grocery',
  },

  // ── PRODUCT C: DESCRIPTION + SIZE CHART ONLY (Fashion / Apparel) ──
  // No features, No specs, No FAQ
  {
    id: 'prod-c',
    name: 'Heavyweight Japanese Loopback Cotton Hoodie',
    slug: 'heavyweight-loopback-cotton-hoodie',
    subtitle: '500 GSM custom-knit French terry with double-needle flatlock stitching',
    vendor: 'Atelier Kuro',
    category: 'Fashion',
    productType: 'Apparel',
    sku: 'AK-HOODIE-BLK',
    rating: 4.7,
    reviewCount: 94,
    badges: ['New Arrival', 'Limited Batch'],
    price: 145.00,
    compareAtPrice: 175.00,
    stock: 19,
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&h=800&fit=crop',
    ],
    shortDescription: 'An heirloom quality pullover crafted from custom-spun 500 GSM loopback cotton terry.',
    description: `Constructed in Wakayama, Japan on vintage circular knitting looms, our Heavyweight Loopback Hoodie offers a substantial, structured drape that softens beautifully with age.

Featuring pre-shrunk organic cotton yarn, an oversized double-layered hood without drawstrings for clean minimalism, and reinforced ribbed side gussets for maximum range of movement. Each piece is garment-dyed in small batches with low-impact botanical dyes.`,
    // Explicitly NO keyFeatures!
    // Explicitly NO specifications!
    // Explicitly NO faqs!
    sizeChart: {
      title: 'Men & Unisex Sizing Guide (Inches)',
      columns: ['Size', 'Chest', 'Length', 'Sleeve', 'Shoulder'],
      rows: [
        { Size: 'Small (S)', Chest: '42"', Length: '26.5"', Sleeve: '33.5"', Shoulder: '19"' },
        { Size: 'Medium (M)', Chest: '45"', Length: '27.5"', Sleeve: '34.5"', Shoulder: '20"' },
        { Size: 'Large (L)', Chest: '48"', Length: '28.5"', Sleeve: '35.5"', Shoulder: '21"' },
        { Size: 'X-Large (XL)', Chest: '51"', Length: '29.5"', Sleeve: '36.5"', Shoulder: '22"' },
      ],
    },
    careInstructions: 'Machine wash cold with like colors inside out. Hang dry or tumble dry low. Do not bleach. Cool iron if needed.',
    variants: [
      { id: 'v-color', name: 'Color', options: ['Washed Black', 'Oatmeal Heather', 'Deep Forest'], selectedOption: 'Washed Black', inStock: true },
      { id: 'v-size', name: 'Size', options: ['S', 'M', 'L', 'XL'], selectedOption: 'M', inStock: true },
    ],
    shippingInfo: {
      time: '2-3 Business Days',
      freeThreshold: 100,
      returnDays: 30,
      carrier: 'UPS Ground',
    },
    returnPolicy: 'Free exchanges and returns within 30 days of delivery. Items must be unworn with original tags attached.',
    tags: ['fashion', 'apparel', 'hoodie', 'organic-cotton', 'japanese-terry'],
    assignedTemplateId: 'template-fashion',
  },

  // ── PRODUCT D: SPECS + FAQ ONLY (Hardware / Outdoor) ──
  // No description, No features, No size chart
  {
    id: 'prod-d',
    name: 'Titanium Grade-5 EDC Quick-Release Carabiner',
    slug: 'titanium-edc-quick-release-carabiner',
    subtitle: 'Ultralight CNC-machined skeleton keyclip with integrated bottle opener',
    vendor: 'AeroForge Labs',
    category: 'Everyday Carry',
    productType: 'Hardware',
    sku: 'AF-CARAB-TI-05',
    rating: 4.95,
    reviewCount: 620,
    badges: ['Lifetime Guarantee', 'Best EDC 2026'],
    price: 38.00,
    compareAtPrice: 48.00,
    stock: 85,
    images: [
      'https://images.unsplash.com/photo-1541689592655-f5f52825a3b8?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?w=800&h=800&fit=crop',
    ],
    // Explicitly NO description!
    // Explicitly NO keyFeatures!
    // Explicitly NO sizeChart!
    specifications: {
      'Material': 'Solid Aerospace Grade 5 Titanium (Ti-6Al-4V)',
      'Weight': '18.4 grams (0.65 oz)',
      'Dimensions': '65mm x 32mm x 5.5mm',
      'Gate Mechanism': 'Integral CNC wire spring (Tested to 100k cycles)',
      'Tensile Strength': 'Non-climbing utility rating: 120 kg (265 lbs)',
      'Surface Finish': 'Stone-washed matte blasted finish',
      'Integrated Tools': 'Bottle opener, pry bar, 1/4" hex bit driver slot',
      'Origin': 'Machined in Bozeman, Montana, USA',
    },
    faqs: [
      { question: 'Can this carabiner be used for rock climbing or safety harness rigging?', answer: 'No. This carabiner is designed strictly for everyday carry gear, keys, and accessories. It is not climbing-rated.' },
      { question: 'Will the titanium spring lose its tension over time?', answer: 'Never. Grade 5 Titanium exhibits virtually zero work fatigue under normal spring deflection and retains full snap tension indefinitely.' },
      { question: 'Does the stone-washed finish show scratches?', answer: 'The tumbling and stone-washing process naturally resists and conceals keys and pocket wear over years of daily carry.' },
    ],
    shippingInfo: {
      time: '1-3 Business Days',
      freeThreshold: 35,
      returnDays: 60,
      carrier: 'USPS First Class / Priority',
    },
    returnPolicy: 'Backed by our unbreakable lifetime warranty. If it ever bends, snaps, or fails, we will replace it free of charge.',
    tags: ['edc', 'titanium', 'hardware', 'accessories', 'gear'],
    assignedTemplateId: null, // Resolves to Default PDP!
  },

  // ── PRODUCT E: ZERO STOCK EDGE CASE TEST (Home / Ceramic) ──
  // Stock = 0 (Must test that 0 stock is NOT treated as empty and shows "Out of Stock" correctly!)
  // Has Description + Features, No specs, No size chart, No FAQ
  {
    id: 'prod-e',
    name: 'Artisan Terracotta Ribbed Planter Pot',
    slug: 'artisan-terracotta-ribbed-planter',
    subtitle: 'Hand-thrown porous clay vessel with integrated drainage saucer',
    vendor: 'Studio Terre',
    category: 'Home & Living',
    productType: 'Planters',
    sku: 'ST-PLANTER-TC-08',
    rating: 4.6,
    reviewCount: 31,
    badges: ['Handmade', 'Sold Out'],
    price: 52.00,
    compareAtPrice: 65.00,
    stock: 0, // CRITICAL: ZERO STOCK! Valid data, must display "Out of Stock", not disappear!
    images: [
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&h=800&fit=crop',
    ],
    shortDescription: 'Handcrafted natural porous clay pot that encourages healthy root aeration.',
    description: `Each Studio Terre planter pot is individually wheel-thrown by master artisans using locally sourced unglazed terracotta clay. 

The micro-porous walls allow plant roots to breathe and naturally regulate soil moisture levels, preventing overwatering and root rot. Complete with a matching snug-fitting saucer and drainage hole mesh pad.`,
    keyFeatures: [
      '100% Natural unglazed porous Italian terracotta clay',
      'Individually thrown by hand with subtle unique character lines',
      'Includes matching detachable water catchment saucer',
      'Generous 1-inch central drainage hole with brass filter mesh',
      'Ideal for aroids, monsteras, cacti, and tropical foliage',
    ],
    // Explicitly NO specifications!
    // Explicitly NO sizeChart!
    // Explicitly NO faqs!
    shippingInfo: {
      time: '3-5 Business Days',
      freeThreshold: 60,
      returnDays: 30,
      carrier: 'FedEx Fragile Special Handling',
    },
    returnPolicy: '30-day returns. Due to the delicate ceramic nature, each item is packed in reinforced molded pulp shells.',
    tags: ['home', 'ceramics', 'plants', 'handmade', 'artisan'],
    assignedTemplateId: null, // Resolves to Default PDP!
  },

  // ── PRODUCT F: LUXURY FURNITURE & CUSTOM MEASUREMENTS ──
  {
    id: 'prod-f',
    name: 'Milano Velvet Modular 3-Piece Sectional Sofa',
    slug: 'milano-velvet-modular-sectional',
    subtitle: 'Performance stain-resistant velvet with high-resiliency down-wrapped cushions',
    vendor: 'Casa Moderna',
    category: 'Furniture',
    productType: 'Sofas',
    sku: 'CM-MILANO-SEC-03',
    rating: 4.9,
    reviewCount: 112,
    badges: ['Free White Glove Delivery', 'Custom Made'],
    price: 2890.00,
    compareAtPrice: 3450.00,
    stock: 7,
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?w=800&h=800&fit=crop',
    ],
    shortDescription: 'The pinnacle of relaxed Italian modernism crafted for supreme entertaining and lingering.',
    description: `Designed in Milan and upholstered by hand, the Milano Sectional combines architectural proportions with indulgent comfort. 

Constructed upon a kiln-dried FSC-certified solid European beech frame with steel sinuous spring suspension. The 5-layer cushions blend high-density organic latex foam core with a lavish 70/30 European goose feather surround.`,
    keyFeatures: [
      'Stain-resistant commercial grade Italian performance velvet (100k Martindale rubs)',
      'Modular configuration: includes Left Arm Loveseat, Corner Wedge, and Right Chaise',
      'Kiln-dried solid European hardwood frame with corner-blocked joinery',
      'Hypoallergenic feather-down cushion casing with channel stitching',
      'Recessed solid brass block legs for an airy floating aesthetic',
    ],
    specifications: {
      'Overall Width': '118 inches (300 cm)',
      'Overall Depth': '68 inches (Chaise) / 38 inches (Sofa)',
      'Overall Height': '31.5 inches (80 cm)',
      'Seat Height': '17.5 inches (44 cm)',
      'Seat Depth': '25 inches (63 cm)',
      'Frame Guarantee': '10-Year Structural Frame Warranty',
    },
    variants: [
      { id: 'v-fabric', name: 'Fabric Color', options: ['Emerald Moss Velvet', 'Cognac Gold Velvet', 'Midnight Navy Velvet'], selectedOption: 'Emerald Moss Velvet', inStock: true },
      { id: 'v-orient', name: 'Chaise Orientation', options: ['Right-Facing Chaise', 'Left-Facing Chaise'], selectedOption: 'Right-Facing Chaise', inStock: true },
    ],
    measurementConfig: {
      unit: 'Seat Modules',
      step: 1,
      min: 3,
      max: 6,
    },
    bulkDiscounts: [
      { minQty: 2, discountPercent: 15, label: 'Room Set: Order 2+ pieces for 15% off' },
    ],
    shippingInfo: {
      time: '2-3 Weeks (Custom Built)',
      carrier: 'White Glove In-Home Delivery & Assembly',
      freeThreshold: 0,
      returnDays: 45,
    },
    returnPolicy: '45-Day in-home trial. We will arrange pickup if it does not fit your living space perfectly.',
    tags: ['furniture', 'luxury', 'sectional', 'velvet', 'modular'],
    assignedTemplateId: 'template-luxury',
  },
];
