// ============================================================
// MASTER EDITOR ENGINE — SHARED TYPES
// Unified type system for Page / Header / Footer editors
// ============================================================

// ─── Editor Context ───────────────────────────────────────

export type EditorType = 'page' | 'header' | 'footer';

export type PreviewState =
  | 'normal'
  | 'hover'
  | 'scrolled'
  | 'menu-open'
  | 'search-open'
  | 'cart-open'
  | 'mobile-menu'
  | 'focused'
  | 'expanded'
  | 'collapsed';

export type ViewportDevice = 'desktop' | 'tablet' | 'mobile';

export type ZoomLevel = 25 | 50 | 75 | 100 | 'fit' | 'custom';

export type DensityLevel = 'compact' | 'comfortable' | 'spacious' | 'custom';

// ─── Component Capability Model ───────────────────────────

/**
 * Capabilities a component can declare. The inspector dynamically
 * generates tabs based on this list (spec §14, §72).
 */
export type ComponentCapability =
  | 'style'
  | 'content'
  | 'structure'
  | 'layout'
  | 'menu'
  | 'items'
  | 'columns'
  | 'dropdown'
  | 'form'
  | 'behavior'
  | 'design'
  | 'responsive'
  | 'advanced'
  | 'link'
  | 'accounts'
  | 'methods'
  | 'benefits'
  | 'links';

/**
 * Component registration in the shared registry.
 * The inspector reads capabilities to build tabs dynamically (spec §76).
 */
export interface ComponentRegistration {
  id: string;
  type: string;
  name: string;
  category: string;
  capabilities: ComponentCapability[];
  icon?: string;
  description?: string;
  defaults: Record<string, any>;
  /** Per-capability tab configuration */
  tabConfig?: Record<string, TabOverrideConfig>;
  responsiveRules?: ResponsiveRules;
  behaviorRules?: Record<string, any>;
}

export interface TabOverrideConfig {
  label?: string;
  groups?: TabGroupConfig[];
}

export interface TabGroupConfig {
  id: string;
  label: string;
  defaultCollapsed?: boolean;
  fields: TabFieldConfig[];
}

export interface TabFieldConfig {
  key: string;
  label: string;
  type: string;
  options?: { label: string; value: any }[];
  defaultValue?: any;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  helpText?: string;
  showWhen?: { field: string; value: any };
  isStringList?: boolean;
  addLabel?: string;
  listFields?: TabFieldConfig[];
}

// ─── Shared Selection Types ───────────────────────────────

export type SelectedTarget =
  | { type: 'none' }
  | { type: 'global'; editorType: EditorType }
  | { type: 'presets'; editorType: 'header' | 'footer' }
  | { type: 'page'; pageId: string }
  | { type: 'section'; pageId: string; sectionId: string }
  | { type: 'row'; editorType: 'header' | 'footer'; rowId: string }
  | { type: 'column'; editorType: 'footer'; rowId: string; columnId: string }
  | { type: 'element'; editorType: 'header' | 'footer'; rowId: string; elementId: string; elementType: string };

// ─── Header Types ─────────────────────────────────────────

export type HeaderRowType =
  | 'announcement'
  | 'utility'
  | 'primary-nav'
  | 'secondary-nav'
  | 'promo'
  | 'custom-row'
  | 'header-row';

export type HeaderElementType =
  | 'announcement-bar'
  | 'utility-bar'
  | 'primary-nav'
  | 'logo'
  | 'navigation-menu'
  | 'menu'
  | 'mega-menu'
  | 'secondary-nav'
  | 'action-group'
  | 'cta'
  | 'search'
  | 'account'
  | 'cart'
  | 'wishlist'
  | 'localization'
  | 'promo-bar'
  | 'custom-row'
  | 'header-row'
  // Backwards compatibility aliases
  | 'logo'
  | 'navigation'
  | 'search'
  | 'actions'
  | 'promo-text'
  | 'utility-links'
  | 'custom-html';

export interface HeaderElement {
  id: string;
  type: HeaderElementType;
  name: string;
  isLocked?: boolean;
  isVisible?: boolean;
  props: Record<string, any>;
  overrides?: Record<string, any>;
}

export interface ActionItemConfig {
  id: string;
  type:
    | 'search'
    | 'wishlist'
    | 'account'
    | 'cart'
    | 'notifications'
    | 'store-locator'
    | 'help'
    | 'track-order'
    | 'phone'
    | 'chat'
    | 'currency'
    | 'language'
    | 'share'
    | 'offers'
    | 'custom'
    | string;
  label: string;
  iconType?: string;
  customIconUrl?: string;
  path?: string;
  isNavigation: boolean;
  isEnabled: boolean;
  openInNewTab?: boolean;
  color?: string;
  colorMode?: 'inherit' | 'custom';
}

export interface HeaderRowLayout {
  container: 'full' | 'constrained' | 'boxed' | 'edge-to-edge';
  alignment: 'left' | 'center' | 'right' | 'space-between' | 'distributed';
  logoPosition: 'left' | 'center' | 'right' | 'custom';
  navPosition: 'left' | 'center' | 'right' | 'split';
  actionsPosition: 'left' | 'right' | 'inline' | 'separate';
  paddingX: number;
  paddingY: number;
  gap: number;
  height: number;
  variantId?: string;
  arrangementId?: string;
  desktopHeight?: number;
  tabletHeight?: number;
  mobileHeight?: number;
  desktopGap?: number;
  tabletGap?: number;
  mobileGap?: number;
  responsivePadding?: any;
  responsiveMargin?: any;
  isCompact?: boolean;
  responsiveArrangement?: HeaderResponsiveArrangement;
}

export interface HeaderSlotArrangement {
  left: string[];
  center: string[];
  right: string[];
  disabled: string[];
}

export interface HeaderResponsiveArrangement {
  desktop: HeaderSlotArrangement;
  tablet: HeaderSlotArrangement;
  mobile: HeaderSlotArrangement;
}

export interface HeaderRowStyling {
  bgType: 'theme' | 'custom' | 'inherit' | 'color' | 'gradient' | 'image' | 'video';
  bgColor: string;
  bgGradient?: string;
  bgGlass?: boolean;
  bgImage?: string;
  bgVideo?: string;
  bgSize?: 'cover' | 'contain' | 'auto';
  bgPosition?: string;
  bgOpacity?: number;
  textColor: string;
  textColorMode?: 'inherit' | 'color' | 'gradient';
  textGradient?: string;
  textMutedColor?: string;
  borderBottom: boolean;
  borderFull?: boolean;
  borderColor: string;
  borderColorMode?: 'inherit' | 'color';
  shadow: 'none' | 'soft' | 'medium' | 'strong' | 'custom';
  radius: number;
  fontSize: number;
  fontWeight: number;
  customClass?: string;
  sticky?: boolean;
  bgOverride?: any;
  textOverride?: any;
  borderOverride?: any;
  overlayHero?: boolean;
  zIndex?: number;
}

export interface HeaderRow {
  id: string;
  type: HeaderRowType;
  name: string;
  isVisible: boolean;
  isLocked?: boolean;
  layout: HeaderRowLayout;
  styling: HeaderRowStyling;
  elements: HeaderElement[];
  responsive?: {
    showOnDesktop?: boolean;
    showOnMobile?: boolean;
  };
}

// ─── Footer Types (new composable architecture) ───────────

export type FooterRowType =
  | 'brand'
  | 'navigation'
  | 'newsletter'
  | 'trust'
  | 'payment'
  | 'social'
  | 'legal'
  | 'utility'
  | 'custom';

export type FooterElementType =
  | 'logo'
  | 'brand-description'
  | 'brand-mission'
  | 'contact'
  | 'address'
  | 'business-hours'
  | 'link-group'
  | 'navigation-menu'
  | 'category-menu'
  | 'collection-menu'
  | 'dynamic-menu'
  | 'mega-footer-nav'
  | 'newsletter-form'
  | 'track-order'
  | 'account'
  | 'store-locator'
  | 'wishlist'
  | 'cart'
  | 'social-links'
  | 'social-icons'
  | 'social-follow'
  | 'trust-badges'
  | 'shipping-benefits'
  | 'returns'
  | 'warranty'
  | 'certifications'
  | 'security'
  | 'payment-methods'
  | 'connected-payments'
  | 'language'
  | 'currency'
  | 'region'
  | 'localization'
  | 'app-download'
  | 'qr-code'
  | 'back-to-top'
  | 'copyright'
  | 'policy-links'
  | 'privacy'
  | 'terms'
  | 'refund'
  | 'shipping-policy'
  | 'cookie-preferences'
  | 'accessibility'
  | 'custom-block'
  | 'custom-html'
  | 'custom-app-block'
  | 'dynamic-data'
  | 'embed';

export interface FooterElement {
  id: string;
  type: FooterElementType;
  name: string;
  isLocked?: boolean;
  props: Record<string, any>;
  capabilities: ComponentCapability[];
  overrides?: Record<string, any>;
}

export interface FooterColumn {
  id: string;
  width: string; // '1fr', '2fr', '300px', etc.
  elements: FooterElement[];
}

export interface FooterRowLayout {
  container: 'full' | 'constrained' | 'boxed' | 'custom';
  columns: number;
  gap: number;
  alignment: 'left' | 'center' | 'right' | 'stretch' | 'space-between';
  verticalAlignment: 'top' | 'center' | 'bottom' | 'stretch';
  paddingX: number;
  paddingY: number;
  maxWidth?: number;
  variantId?: string;
}

export interface FooterRowStyling {
  bgType: 'theme' | 'custom';
  bgColor: string;
  bgGradient?: string;
  bgImage?: string;
  textColor: string;
  borderTop: boolean;
  borderBottom: boolean;
  borderColor: string;
  dividerStyle: 'none' | 'solid' | 'dashed' | 'dotted';
  shadow: 'none' | 'soft' | 'medium' | 'strong';
  radius: number;
  fontSize: number;
  customClass?: string;
}

export interface FooterRow {
  id: string;
  type: FooterRowType;
  name: string;
  isVisible: boolean;
  isLocked?: boolean;
  columns: FooterColumn[];
  layout: FooterRowLayout;
  styling: FooterRowStyling;
  responsive?: {
    showOnDesktop?: boolean;
    showOnTablet?: boolean;
    showOnMobile?: boolean;
    mobileLayout?: 'stack' | 'accordion' | 'carousel';
    mobileColumnCount?: number;
  };
}

// ─── Global Settings Types ────────────────────────────────

export interface GlobalHeaderSettings {
  // Style tab
  headerHeight?: number;
  containerWidth?: number;
  containerMode?: 'full' | 'contained' | 'boxed';
  density?: DensityLevel;
  colorScheme?: 'light' | 'dark' | 'system' | 'custom';
  overallSpacing?: number;

  // Positioning & Behavior tab
  positioning: 'static' | 'sticky' | 'floating' | 'overlay';
  stickyHeader?: boolean;
  scrollBehavior: 'static' | 'sticky' | 'sticky-after-scroll' | 'shrink-on-scroll' | 'hide-down-reveal-up';
  transitions: 'none' | 'fade' | 'slide' | 'compress' | 'morph';
  stickyThreshold: number;
  scrolledHeight: number;
  hideOnScrollDown?: boolean;
  revealOnScrollUp?: boolean;
  shrinkOnScroll?: boolean;
  transparentTransition?: boolean;
  transitionDuration?: number;
  transitionEasing?: string;

  // Structure tab
  rowsOrder?: string[];
  rowGrouping?: boolean;

  // Content tab
  globalLogoSource?: 'theme' | 'custom' | 'media';
  globalNavSource?: 'main-menu' | 'custom' | 'category-tree';
  globalActionsSource?: string;
  localizationSource?: string;
  storeInfo?: {
    phone?: string;
    email?: string;
    hours?: string;
    location?: string;
  };

  // Interactions & Hero Integration
  navInteraction: 'hover' | 'click' | 'hybrid';
  megaMenuBehavior: 'hover-open' | 'click-open' | 'delayed-open' | 'instant-open';
  mobileMenuType: 'drawer' | 'full-screen' | 'bottom-sheet' | 'accordion';
  searchMode: 'inline' | 'dropdown' | 'overlay' | 'full-screen' | 'command';
  heroAwareMode: 'standard' | 'overlay-hero' | 'transparent-hero' | 'auto-contrast';

  tokens: DesignTokenOverrides;
  responsiveRules: HeaderResponsiveRules;
  displayRules: DisplayRules;
  accessibility: AccessibilityConfig;
  seo: SeoConfig;
  performance: PerformanceConfig;
  customCss: string;
  customClasses: string;
  customAttributes: string;
  structurePreset: string;
  appearancePreset: string;
  curatedPreset?: string;
}

export interface GlobalFooterSettings {
  animation: 'none' | 'fade-in' | 'slide-up' | 'reveal';
  backToTop: boolean;
  backToTopStyle: 'circle' | 'square' | 'pill' | 'text' | 'icon';
  backToTopPosition: 'always' | 'after-scroll' | 'footer-only';
  tokens: DesignTokenOverrides;
  responsiveRules: FooterResponsiveRules;
  displayRules: DisplayRules;
  accessibility: AccessibilityConfig;
  seo: SeoConfig;
  performance: PerformanceConfig;
  customCss: string;
  customClasses: string;
  customAttributes: string;
  structurePreset: string;
  appearancePreset: string;
  curatedPreset?: string;
  density: DensityLevel;
  localization?: boolean;
}

// ─── Shared Config Types ──────────────────────────────────

export interface DesignTokenOverrides {
  bgType: 'theme' | 'custom';
  bgColor: string;
  textColorType: 'theme' | 'custom';
  textColor: string;
  accentColorType: 'theme' | 'custom';
  accentColor: string;
  borderColorType: 'theme' | 'custom';
  borderColor: string;
  fontFamilyType: 'theme' | 'custom';
  fontFamily: string;
  buttonRadiusType: 'theme' | 'custom';
  buttonRadius: number;
  shadowType: 'theme' | 'custom';
  shadow: 'none' | 'soft' | 'medium' | 'strong';
  bgGlass?: boolean;
}

export interface HeaderResponsiveRules {
  desktop: { visible: boolean; layout: 'horizontal' | 'vertical' | 'wrap'; logoWidth: number };
  tablet: { visible: boolean; layout: 'horizontal' | 'collapse'; logoWidth: number };
  mobile: {
    visible: boolean;
    layout: 'collapse';
    navMode: 'hamburger' | 'drawer' | 'bottom';
    logoWidth: number;
    showSearch: boolean;
    showCart: boolean;
    showAccount: boolean;
    showWishlist: boolean;
  };
}

export interface FooterResponsiveRules {
  desktop: { visible: boolean; columnCount: number };
  tablet: { visible: boolean; columnCount: number; layout: 'grid' | 'stack' };
  mobile: {
    visible: boolean;
    layout: 'stack' | 'accordion';
    columnCount: 1;
    showNewsletter: boolean;
    showPayment: boolean;
    showSocial: boolean;
  };
}

export interface ResponsiveRules {
  desktop?: Record<string, any>;
  tablet?: Record<string, any>;
  mobile?: Record<string, any>;
}

export interface DisplayRules {
  targetAudience: 'all' | 'logged-in' | 'guest';
  countries: string[];
  devices: ViewportDevice[];
  scheduleEnabled: boolean;
  scheduleStart?: string;
  scheduleEnd?: string;
  timezone: string;
  campaignName?: string;
}

export interface AccessibilityConfig {
  ariaLabels: boolean;
  landmarkRole: string;
  keyboardNavigation: boolean;
  focusOutline: boolean;
  skipToContent: boolean;
}

export interface SeoConfig {
  structuredLinks: boolean;
  logoH1OnHome: boolean;
  breadcrumbRelationship: boolean;
}

export interface PerformanceConfig {
  lazyLoadMegaMedia: boolean;
  optimizeImages: boolean;
  reduceMotion: boolean;
  disableExpensiveEffects: boolean;
}

// ─── Preset Types ─────────────────────────────────────────

export type PresetType = 'structure' | 'appearance' | 'curated';
export type PresetApplyMode = 'all' | 'keep-content' | 'keep-structure' | 'style-only';

export interface PresetConfig {
  id: string;
  name: string;
  type: PresetType;
  category: 'core' | 'advanced';
  description: string;
  diagram?: string;
  preview?: string;
  layout?: Record<string, any>;
  styling?: Record<string, any>;
}

export interface UserPreset {
  id: string;
  name: string;
  createdAt: number;
  editorType: EditorType;
  structure: boolean;
  style: boolean;
  content: boolean;
  behavior: boolean;
  data: {
    rows: HeaderRow[] | FooterRow[];
    globalSettings: GlobalHeaderSettings | GlobalFooterSettings;
  };
}

// ─── Variant / Arrangement / Template System ──────────────

export type PresetApplyOption = 'keep-content' | 'adapt-content' | 'replace-preset';

export type VariantCategory = 'commerce' | 'saas' | 'fashion' | 'editorial' | 'creative' | 'corporate';

/** Variant — defines overall concept, component composition, default style */
export interface HeaderVariant {
  id: string;
  name: string;
  description: string;
  category: VariantCategory;
  previewDiagram: string;
  rows: HeaderRow[];
  globalOverrides?: Partial<GlobalHeaderSettings>;
  compatibleArrangementIds?: string[];
  compatibleTemplateIds?: string[];
}

/** Arrangement — defines how items are positioned/grouped */
export interface HeaderArrangement {
  id: string;
  name: string;
  description: string;
  layout: Partial<HeaderRowLayout>;
}

/** Template — a curated Variant + Arrangement + Style + Behavior */
export interface HeaderTemplate {
  id: string;
  name: string;
  description: string;
  category: VariantCategory;
  variantId: string;
  arrangementId: string;
  rows: HeaderRow[];
  globalOverrides?: Partial<GlobalHeaderSettings>;
}

/** Footer Variant */
export interface FooterVariant {
  id: string;
  name: string;
  description: string;
  category: VariantCategory;
  previewDiagram: string;
  rows: FooterRow[];
  globalOverrides?: Partial<GlobalFooterSettings>;
  compatibleArrangementIds?: string[];
  compatibleTemplateIds?: string[];
}

/** Footer Arrangement */
export interface FooterArrangement {
  id: string;
  name: string;
  description: string;
  layout: Partial<FooterRowLayout>;
}

/** Footer Template */
export interface FooterTemplate {
  id: string;
  name: string;
  description: string;
  category: VariantCategory;
  variantId: string;
  arrangementId: string;
  rows: FooterRow[];
  globalOverrides?: Partial<GlobalFooterSettings>;
}

/** Preset preview state — temporary, non-destructive */
export interface PresetPreviewState {
  isActive: boolean;
  isHoverOnly?: boolean;
  editorType: 'header' | 'footer';
  presetType: 'variant' | 'arrangement' | 'template' | 'staged';
  presetId: string;
  presetName: string;
  previewRows: HeaderRow[] | FooterRow[];
  previewSettings: Partial<GlobalHeaderSettings> | Partial<GlobalFooterSettings>;
  originalRows: HeaderRow[] | FooterRow[];
  originalSettings: GlobalHeaderSettings | GlobalFooterSettings;
  stagedVariantId?: string;
  stagedArrangementId?: string;
  stagedTemplateId?: string;
  stagedThemePreset?: string;
}

// ─── History Types ────────────────────────────────────────

export interface HistoryEntry {
  id: string;
  timestamp: number;
  timeLabel: string;
  description: string;
  editorType: EditorType;
  snapshot: {
    headerRows?: HeaderRow[];
    headerSettings?: GlobalHeaderSettings;
    footerRows?: FooterRow[];
    footerSettings?: GlobalFooterSettings;
  };
}

// ─── Audit Types ──────────────────────────────────────────

export type AuditSeverity = 'error' | 'warning' | 'info' | 'success';

export type AuditCategory =
  | 'accessibility'
  | 'seo'
  | 'performance'
  | 'responsive'
  | 'broken-links'
  | 'missing-content'
  | 'missing-images'
  | 'image-optimization'
  | 'contrast'
  | 'navigation'
  | 'heading-hierarchy'
  | 'form-accessibility'
  | 'ux'
  | 'mobile'
  | 'layout-overflow'
  | 'invalid-config';

export interface AuditIssue {
  id: string;
  category: AuditCategory;
  severity: AuditSeverity;
  message: string;
  componentId?: string;
  componentName?: string;
  suggestion?: string;
}

export interface AuditResult {
  timestamp: number;
  issues: AuditIssue[];
  errorCount: number;
  warningCount: number;
  infoCount: number;
  passed: boolean;
}
