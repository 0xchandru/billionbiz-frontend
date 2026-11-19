// ============================================================
// PDP BUILDER — DYNAMIC CONTENT-BASED VISIBILITY ENGINE
// Implements Specification §3: Dynamic Content-Based Component Visibility
// ============================================================

import type { PdpBlock, PdpBlockType } from './types/pdpBlockTypes';
import type { PdpProduct } from './types/pdpProductTypes';

export interface VisibilityEvaluation {
  isVisible: boolean;
  hasData: boolean;
  reason: string;
  badgeType: 'visible' | 'hidden-empty' | 'hidden-manual' | 'hidden-device';
}

/**
 * Checks whether a given value is empty according to PDP rules:
 * - null, undefined -> empty
 * - empty string or whitespace-only -> empty
 * - empty array -> empty
 * - empty object (no keys) -> empty
 * - numeric 0 (like stock: 0 or price: 0) -> NOT EMPTY! Valid data.
 * - boolean false -> NOT EMPTY! Valid data.
 */
export function isContentEmpty(val: any): boolean {
  if (val === null || val === undefined) return true;
  if (typeof val === 'number') return false; // 0 is valid!
  if (typeof val === 'boolean') return false;
  if (typeof val === 'string') return val.trim().length === 0;
  if (Array.isArray(val)) {
    if (val.length === 0) return true;
    // Check if every item in the array is itself empty
    const nonEmpties = val.filter(item => !isContentEmpty(item));
    return nonEmpties.length === 0;
  }
  if (typeof val === 'object') {
    const keys = Object.keys(val);
    if (keys.length === 0) return true;
    // Check if all values in the object are empty
    const hasAnyContent = keys.some(k => !isContentEmpty(val[k]));
    return !hasAnyContent;
  }
  return false;
}

/**
 * Evaluates whether a product contains the required data for a block type.
 */
export function evaluateProductDataAvailability(
  type: PdpBlockType,
  product: PdpProduct,
  customBindingField?: string
): { hasData: boolean; missingLabel?: string } {
  // If a custom binding field was specified in Advanced tab:
  if (customBindingField && customBindingField.trim()) {
    const customVal = (product as any)[customBindingField.trim()];
    const empty = isContentEmpty(customVal);
    return {
      hasData: !empty,
      missingLabel: empty ? `No ${customBindingField} data` : undefined,
    };
  }

  switch (type) {
    // 1. Product Media
    case 'media_gallery':
    case 'media_carousel':
    case 'media_zoom':
      return {
        hasData: Array.isArray(product.images) && product.images.length > 0,
        missingLabel: 'No product images',
      };
    case 'media_video':
      return {
        hasData: Boolean(product.videoUrl && product.videoUrl.trim()),
        missingLabel: 'No video URL',
      };
    case 'media_badges':
      return {
        hasData: Array.isArray(product.badges) && product.badges.length > 0,
        missingLabel: 'No badges assigned',
      };

    // 2. Product Information
    case 'info_title':
      return {
        hasData: Boolean(product.name && product.name.trim()),
        missingLabel: 'No product title',
      };
    case 'info_subtitle':
      return {
        hasData: Boolean(product.subtitle && product.subtitle.trim()),
        missingLabel: 'No product subtitle',
      };
    case 'info_vendor':
      return {
        hasData: Boolean(product.vendor && product.vendor.trim()),
        missingLabel: 'No vendor/brand',
      };
    case 'info_category':
      return {
        hasData: Boolean(product.category && product.category.trim()),
        missingLabel: 'No category',
      };
    case 'info_sku':
      return {
        hasData: Boolean(product.sku && product.sku.trim()),
        missingLabel: 'No SKU',
      };
    case 'info_rating':
    case 'info_review_count':
      return {
        hasData: typeof product.rating === 'number' && product.rating > 0,
        missingLabel: 'No reviews/ratings',
      };
    case 'info_badges':
      return {
        hasData: Array.isArray(product.badges) && product.badges.length > 0,
        missingLabel: 'No product badges',
      };
    case 'info_stock_status':
      // CRITICAL: Stock 0 is VALID numeric data (indicates "Out of Stock").
      return {
        hasData: typeof product.stock === 'number',
        missingLabel: 'No inventory data',
      };

    // 3. Pricing & Offers
    case 'price_display':
    case 'price_total_calculator':
      return {
        hasData: typeof product.price === 'number',
        missingLabel: 'No price set',
      };
    case 'price_compare':
    case 'price_discount':
    case 'price_savings_info':
      return {
        hasData: typeof product.compareAtPrice === 'number' && product.compareAtPrice > product.price,
        missingLabel: 'No compare-at price / discount',
      };
    case 'price_variant_selector':
      return {
        hasData: Array.isArray(product.variants) && product.variants.length > 0,
        missingLabel: 'No variants configured',
      };
    case 'price_measurement_qty':
      return {
        hasData: Boolean(product.measurementConfig && product.measurementConfig.unit),
        missingLabel: 'No measurement config',
      };
    case 'price_bulk_discounts':
      return {
        hasData: Array.isArray(product.bulkDiscounts) && product.bulkDiscounts.length > 0,
        missingLabel: 'No bulk discounts',
      };
    case 'price_unit_price':
      return {
        hasData: Boolean(product.unitPrice && product.unitPrice.trim()),
        missingLabel: 'No unit price',
      };

    // 4. Purchase Actions (always usable if product exists, unless zero stock hides buy now if configured)
    case 'action_quantity':
    case 'action_add_to_cart':
    case 'action_buy_now':
    case 'action_wishlist':
    case 'action_share':
    case 'action_compare':
      return {
        hasData: true,
      };

    // 5. Product Details
    case 'detail_short_description':
      return {
        hasData: Boolean(product.shortDescription && product.shortDescription.trim()),
        missingLabel: 'No short description',
      };
    case 'detail_full_description':
      return {
        hasData: Boolean(product.description && product.description.trim()),
        missingLabel: 'No product description',
      };
    case 'detail_key_features':
      return {
        hasData: Array.isArray(product.keyFeatures) && product.keyFeatures.length > 0,
        missingLabel: 'No feature content available',
      };
    case 'detail_specifications':
    case 'detail_info_table':
      return {
        hasData: Boolean(product.specifications && Object.keys(product.specifications).length > 0),
        missingLabel: 'No specifications available',
      };
    case 'detail_ingredients':
      return {
        hasData: Array.isArray(product.ingredients) && product.ingredients.length > 0,
        missingLabel: 'No ingredients listed',
      };
    case 'detail_benefits':
      return {
        hasData: Array.isArray(product.benefits) && product.benefits.length > 0,
        missingLabel: 'No benefits listed',
      };
    case 'detail_how_to_use':
      return {
        hasData: Boolean(product.howToUse && product.howToUse.trim()),
        missingLabel: 'No usage instructions',
      };
    case 'detail_size_chart':
      return {
        hasData: Boolean(
          product.sizeChart &&
          Array.isArray(product.sizeChart.rows) &&
          product.sizeChart.rows.length > 0
        ),
        missingLabel: 'No size chart available',
      };
    case 'detail_care_instructions':
      return {
        hasData: Boolean(product.careInstructions && product.careInstructions.trim()),
        missingLabel: 'No care instructions',
      };
    case 'detail_faq':
      return {
        hasData: Array.isArray(product.faqs) && product.faqs.length > 0,
        missingLabel: 'No FAQ content',
      };
    case 'detail_tabs':
    case 'detail_accordion': {
      // Tabs / Accordion has data if at least one sub-source exists
      const hasAny = Boolean(
        product.description ||
        (product.keyFeatures && product.keyFeatures.length > 0) ||
        (product.specifications && Object.keys(product.specifications).length > 0) ||
        (product.faqs && product.faqs.length > 0)
      );
      return {
        hasData: hasAny,
        missingLabel: 'No tab sections available',
      };
    }

    // 6. Shipping & Trust
    case 'trust_delivery_checker':
      return { hasData: true };
    case 'trust_shipping_info':
    case 'trust_shipping_benefits':
    case 'trust_estimated_delivery':
      return {
        hasData: Boolean(product.shippingInfo && product.shippingInfo.time),
        missingLabel: 'No shipping information',
      };
    case 'trust_return_policy':
      return {
        hasData: Boolean(product.returnPolicy && product.returnPolicy.trim()),
        missingLabel: 'No return policy',
      };
    case 'trust_badges':
    case 'trust_payment_icons':
      return { hasData: true };

    // 7. Recommendations
    case 'rec_related':
    case 'rec_frequently_bought':
    case 'rec_recently_viewed':
    case 'rec_recommended':
      return { hasData: true };

    // 8. Custom Content (independent of product unless fallback or empty text)
    case 'custom_text':
    case 'custom_heading':
    case 'custom_image':
    case 'custom_video':
    case 'custom_html':
    case 'custom_banner':
    case 'custom_divider':
    case 'custom_spacer':
    case 'custom_icon_text':
    case 'custom_info_section':
      return { hasData: true };

    default:
      return { hasData: true };
  }
}

/**
 * Main visibility evaluation function.
 * Evaluates a block against the current product and device viewport.
 */
export function evaluateBlockVisibility(
  block: PdpBlock,
  product: PdpProduct,
  device: 'desktop' | 'tablet' | 'mobile' = 'desktop'
): VisibilityEvaluation {
  // 1. Manually disabled by merchant in editor
  if (block.isHidden) {
    return {
      isVisible: false,
      hasData: true,
      reason: 'Manually hidden by merchant',
      badgeType: 'hidden-manual',
    };
  }

  // 2. Device-level visibility check
  if (block.visibility && block.visibility[device] === false) {
    return {
      isVisible: false,
      hasData: true,
      reason: `Hidden on ${device}`,
      badgeType: 'hidden-device',
    };
  }

  // 3. Category filter rule
  if (
    block.visibility?.categoryFilter &&
    block.visibility.categoryFilter.length > 0 &&
    product.category &&
    !block.visibility.categoryFilter.includes(product.category)
  ) {
    return {
      isVisible: false,
      hasData: true,
      reason: `Category restricted (not in ${product.category})`,
      badgeType: 'hidden-manual',
    };
  }

  // 4. Tag filter rule
  if (
    block.visibility?.tagFilter &&
    block.visibility.tagFilter.length > 0 &&
    product.tags
  ) {
    const hasMatchingTag = block.visibility.tagFilter.some(t => product.tags?.includes(t));
    if (!hasMatchingTag) {
      return {
        isVisible: false,
        hasData: true,
        reason: 'Tag filter restriction',
        badgeType: 'hidden-manual',
      };
    }
  }

  // 5. Automatic Empty-Content Visibility Evaluation (Specification §3)
  const hideIfEmpty = block.visibility?.hideIfEmpty !== false; // Default is true!
  const customBinding = block.advanced?.bindingField;
  const dataCheck = evaluateProductDataAvailability(block.type, product, customBinding);

  if (!dataCheck.hasData) {
    // If block has a valid fallback defined in advanced settings, we can render fallback
    if (block.advanced?.fallbackValue && block.advanced.fallbackValue.trim()) {
      return {
        isVisible: true,
        hasData: false,
        reason: 'Using fallback value',
        badgeType: 'visible',
      };
    }

    if (hideIfEmpty) {
      return {
        isVisible: false,
        hasData: false,
        reason: `Hidden: ${dataCheck.missingLabel || 'No content available'}`,
        badgeType: 'hidden-empty',
      };
    }
  }

  // Everything passed: block is visible!
  return {
    isVisible: true,
    hasData: true,
    reason: 'Visible for this product',
    badgeType: 'visible',
  };
}
