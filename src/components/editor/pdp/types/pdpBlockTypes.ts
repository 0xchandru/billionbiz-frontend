// ============================================================
// PDP BUILDER — COMPONENT BLOCK & TEMPLATE TYPES
// ============================================================

export type PdpBlockCategory =
  | 'Product Media'
  | 'Product Information'
  | 'Pricing & Offers'
  | 'Purchase Actions'
  | 'Product Details'
  | 'Shipping & Trust'
  | 'Recommendations'
  | 'Custom Content';

export type PdpBlockType =
  // 1. Product Media
  | 'media_gallery'
  | 'media_video'
  | 'media_zoom'
  | 'media_badges'
  | 'media_carousel'
  // 2. Product Information
  | 'info_title'
  | 'info_subtitle'
  | 'info_vendor'
  | 'info_category'
  | 'info_sku'
  | 'info_rating'
  | 'info_review_count'
  | 'info_badges'
  | 'info_stock_status'
  // 3. Pricing & Offers
  | 'price_display'
  | 'price_compare'
  | 'price_discount'
  | 'price_variant_selector'
  | 'price_measurement_qty'
  | 'price_total_calculator'
  | 'price_bulk_discounts'
  | 'price_savings_info'
  | 'price_unit_price'
  // 4. Purchase Actions
  | 'action_quantity'
  | 'action_add_to_cart'
  | 'action_buy_now'
  | 'action_wishlist'
  | 'action_share'
  | 'action_compare'
  // 5. Product Details
  | 'detail_short_description'
  | 'detail_full_description'
  | 'detail_key_features'
  | 'detail_specifications'
  | 'detail_info_table'
  | 'detail_ingredients'
  | 'detail_benefits'
  | 'detail_how_to_use'
  | 'detail_size_chart'
  | 'detail_care_instructions'
  | 'detail_tabs'
  | 'detail_accordion'
  | 'detail_faq'
  // 6. Shipping & Trust
  | 'trust_delivery_checker'
  | 'trust_shipping_info'
  | 'trust_return_policy'
  | 'trust_badges'
  | 'trust_payment_icons'
  | 'trust_shipping_benefits'
  | 'trust_estimated_delivery'
  // 7. Recommendations
  | 'rec_related'
  | 'rec_frequently_bought'
  | 'rec_recently_viewed'
  | 'rec_recommended'
  // 8. Custom Content
  | 'custom_text'
  | 'custom_heading'
  | 'custom_image'
  | 'custom_video'
  | 'custom_html'
  | 'custom_banner'
  | 'custom_divider'
  | 'custom_spacer'
  | 'custom_icon_text'
  | 'custom_info_section'
  | 'group';

export interface PdpBlockSpacing {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface PdpBlockDesign {
  bgColor?: string;
  backgroundColor?: string;
  bgGradient?: string;
  bgImage?: string;
  textColor?: string;
  headingColor?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string | number;
  lineHeight?: number | string;
  letterSpacing?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  border?: string;
  borderRadius?: number | string;
  boxShadow?: string;
  width?: string;
  maxWidth?: string;
  height?: string;
  padding?: PdpBlockSpacing;
  margin?: PdpBlockSpacing;
  gap?: number;
  display?: string;
  responsive?: {
    desktop?: Partial<PdpBlockDesign>;
    tablet?: Partial<PdpBlockDesign>;
    mobile?: Partial<PdpBlockDesign>;
  };
}

export interface PdpBlockVisibility {
  desktop: boolean;
  tablet: boolean;
  mobile: boolean;
  hideIfEmpty: boolean; // "Hide automatically when content is empty: ON/OFF" (spec §2.D.3)
  categoryFilter?: string[];
  tagFilter?: string[];
  typeFilter?: string[];
  variantFilter?: string[];
}

export interface PdpBlockAdvanced {
  customId?: string;
  customClass?: string;
  customCss?: string;
  bindingField?: string;
  fallbackValue?: string;
}

export type PdpBlockZone = 'buy_box' | 'media' | 'full_width';

export interface PdpBlock {
  id: string;
  type: PdpBlockType;
  name: string;
  category: PdpBlockCategory;
  zone?: PdpBlockZone; // 'buy_box' (Near Image), 'media' (With Image), 'full_width' (Below Fold)
  parentId?: string | null;
  children?: PdpBlock[];
  isLocked?: boolean;
  isHidden?: boolean;
  content: Record<string, any>;
  design: PdpBlockDesign;
  visibility: PdpBlockVisibility;
  advanced: PdpBlockAdvanced;
}

export interface PdpTemplate {
  id: string;
  name: string;
  description?: string;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
  layout?: 'gallery-left' | 'gallery-right' | 'split' | 'stacked';
  columnRatio?: '50-50' | '55-45' | '45-55' | '60-40';
  stickyBuyBox?: boolean;
  desktopMediaLayout?: 'stacked' | 'grid-2' | 'thumbnails-bottom' | 'thumbnails-left' | 'carousel';
  mobileMediaLayout?: 'carousel' | 'stacked';
  imageZoom?: 'lightbox' | 'hover' | 'none';
  pageWidth?: 'standard' | 'wide' | 'narrow';
  columnGap?: '24px' | '32px' | '40px' | '48px';
  detailsCardStyle?: 'flat' | 'card' | 'tinted';
  blocks: PdpBlock[];
}
