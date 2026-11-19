// ============================================================
// PDP BUILDER — DEFAULT TEMPLATES REPOSITORY
// Pre-configured PDP templates including the Default PDP
// ============================================================

import type { PdpTemplate } from './types/pdpBlockTypes';
import { createPdpBlock } from './pdpBlockRegistry';

/**
 * 1. Master Default PDP
 * Contains the canonical 10 components from Spec §3 + core purchase blocks:
 * 1. Product Image Gallery
 * 2. Product Title
 * 3. Product Price
 * 4. Product Description
 * 5. Key Features
 * 6. Specifications
 * 7. Ingredients
 * 8. Size Chart
 * 9. FAQ
 * 10. Related Products
 */
export function createDefaultPdpTemplate(): PdpTemplate {
  return {
    id: 'template-default',
    name: 'Default PDP',
    description: 'Universal default product template inherited by all products without custom assignment',
    isDefault: true,
    layout: 'gallery-left',
    pageWidth: 'standard',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: [
      // Media
      createPdpBlock('media_gallery'),

      // Top info
      createPdpBlock('info_category'),
      createPdpBlock('info_title'),
      createPdpBlock('info_rating'),
      createPdpBlock('info_stock_status'),

      // Price & Variants
      createPdpBlock('price_display'),
      createPdpBlock('price_variant_selector'),
      createPdpBlock('price_measurement_qty'),

      // Purchase Actions
      createPdpBlock('action_quantity'),
      createPdpBlock('action_add_to_cart'),
      createPdpBlock('action_buy_now'),
      createPdpBlock('trust_delivery_checker'),

      // Spec §3 Core Product Details
      createPdpBlock('detail_full_description'),
      createPdpBlock('detail_key_features'),
      createPdpBlock('detail_specifications'),
      createPdpBlock('detail_ingredients'),
      createPdpBlock('detail_size_chart'),
      createPdpBlock('detail_faq'),

      // Trust & Recommendations
      createPdpBlock('trust_badges'),
      createPdpBlock('rec_related'),
    ],
  };
}

/**
 * 2. Electronics & Tech PDP Template
 */
export function createElectronicsPdpTemplate(): PdpTemplate {
  return {
    id: 'template-electronics',
    name: 'Electronics & Tech PDP',
    description: 'High-tech gadget layout emphasizing technical specifications, benchmarks, and video reviews',
    isDefault: false,
    layout: 'gallery-left',
    pageWidth: 'wide',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: [
      createPdpBlock('media_gallery'),
      createPdpBlock('info_vendor'),
      createPdpBlock('info_title'),
      createPdpBlock('info_rating'),
      createPdpBlock('price_display'),
      createPdpBlock('price_variant_selector'),
      createPdpBlock('info_stock_status'),
      createPdpBlock('action_add_to_cart'),
      createPdpBlock('action_buy_now'),
      createPdpBlock('detail_full_description'),
      createPdpBlock('detail_key_features'),
      createPdpBlock('detail_specifications'),
      createPdpBlock('media_video'),
      createPdpBlock('detail_faq'),
      createPdpBlock('trust_badges'),
      createPdpBlock('rec_frequently_bought'),
    ],
  };
}

/**
 * 3. Fashion & Apparel PDP Template
 */
export function createFashionPdpTemplate(): PdpTemplate {
  return {
    id: 'template-fashion',
    name: 'Fashion & Apparel PDP',
    description: 'Editorial fashion layout with large portrait imagery, swatch picker, and size guide',
    isDefault: false,
    layout: 'gallery-left',
    pageWidth: 'standard',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: [
      createPdpBlock('media_gallery'),
      createPdpBlock('info_vendor'),
      createPdpBlock('info_title'),
      createPdpBlock('price_display'),
      createPdpBlock('price_variant_selector'),
      createPdpBlock('detail_size_chart'),
      createPdpBlock('info_stock_status'),
      createPdpBlock('action_add_to_cart'),
      createPdpBlock('action_wishlist'),
      createPdpBlock('detail_full_description'),
      createPdpBlock('detail_care_instructions'),
      createPdpBlock('trust_shipping_info'),
      createPdpBlock('rec_related'),
    ],
  };
}

/**
 * 4. Grocery & Fresh PDP Template
 */
export function createGroceryPdpTemplate(): PdpTemplate {
  return {
    id: 'template-grocery',
    name: 'Grocery & Pantry PDP',
    description: 'Food & wellness layout featuring nutrition data, ingredients, origin certification, and bulk pricing',
    isDefault: false,
    layout: 'gallery-left',
    pageWidth: 'standard',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: [
      createPdpBlock('media_gallery'),
      createPdpBlock('info_badges'),
      createPdpBlock('info_title'),
      createPdpBlock('info_subtitle'),
      createPdpBlock('price_display'),
      createPdpBlock('price_unit_price'),
      createPdpBlock('info_stock_status'),
      createPdpBlock('action_quantity'),
      createPdpBlock('action_add_to_cart'),
      createPdpBlock('detail_key_features'),
      createPdpBlock('detail_ingredients'),
      createPdpBlock('detail_benefits'),
      createPdpBlock('detail_specifications'),
      createPdpBlock('trust_shipping_benefits'),
    ],
  };
}

/**
 * 5. Luxury & Furniture PDP Template
 */
export function createLuxuryPdpTemplate(): PdpTemplate {
  return {
    id: 'template-luxury',
    name: 'Luxury Furniture PDP',
    description: 'Architectural layout with custom dimensions, white-glove delivery, and bespoke swatch selections',
    isDefault: false,
    layout: 'gallery-left',
    pageWidth: 'wide',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: [
      createPdpBlock('media_gallery'),
      createPdpBlock('info_vendor'),
      createPdpBlock('info_title'),
      createPdpBlock('price_display'),
      createPdpBlock('price_variant_selector'),
      createPdpBlock('price_measurement_qty'),
      createPdpBlock('price_bulk_discounts'),
      createPdpBlock('info_stock_status'),
      createPdpBlock('action_add_to_cart'),
      createPdpBlock('action_buy_now'),
      createPdpBlock('detail_full_description'),
      createPdpBlock('detail_key_features'),
      createPdpBlock('detail_specifications'),
      createPdpBlock('trust_shipping_info'),
      createPdpBlock('trust_badges'),
    ],
  };
}

export function getInitialPdpTemplates(): PdpTemplate[] {
  return [
    createDefaultPdpTemplate(),
    createElectronicsPdpTemplate(),
    createFashionPdpTemplate(),
    createGroceryPdpTemplate(),
    createLuxuryPdpTemplate(),
  ];
}
