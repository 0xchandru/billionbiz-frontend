// ============================================================
// THEME RESOLVER
// Resolves theme tokens and section-level local overrides
// ============================================================

export type ThemeOverrideMode = 'inherit' | 'color' | 'gradient' | 'image';

export interface GradientOverride {
  type: 'linear' | 'radial';
  color1: string;
  color2: string;
  angle: string;
}

export interface ImageOverride {
  url: string;
  position?: string;
  size?: string;
  overlayColor?: string;
  overlayOpacity?: number;
}

export interface ThemeOverrideValue {
  mode: ThemeOverrideMode;
  color?: string;
  gradient?: GradientOverride;
  image?: ImageOverride;
}

// Maps section property keys to their default global theme CSS variables
export const themeTokenMap: Record<string, { tokenVar: string; label: string; isBackground: boolean }> = {
  bgColor: { tokenVar: 'var(--theme-bg-section)', label: 'Section Background', isBackground: true },
  backgroundColor: { tokenVar: 'var(--theme-bg-section)', label: 'Background', isBackground: true },
  containerBg: { tokenVar: 'var(--theme-bg-container)', label: 'Container Background', isBackground: true },
  sectionBg: { tokenVar: 'var(--theme-bg-section)', label: 'Section Background', isBackground: true },
  
  textColor: { tokenVar: 'var(--theme-text-body)', label: 'Body Text Color', isBackground: false },
  bodyColor: { tokenVar: 'var(--theme-text-body)', label: 'Body Text Color', isBackground: false },
  headingColor: { tokenVar: 'var(--theme-text-heading)', label: 'Heading Color', isBackground: false },
  subheadingColor: { tokenVar: 'var(--theme-text-subheading)', label: 'Subheading Color', isBackground: false },
  mutedColor: { tokenVar: 'var(--theme-text-muted)', label: 'Muted Text Color', isBackground: false },
  linkColor: { tokenVar: 'var(--theme-brand-link)', label: 'Link Color', isBackground: false },
  accentColor: { tokenVar: 'var(--theme-brand-accent)', label: 'Accent Color', isBackground: false },
  
  borderColor: { tokenVar: 'var(--theme-border-border)', label: 'Border Color', isBackground: false },
  dividerColor: { tokenVar: 'var(--theme-border-divider)', label: 'Divider Color', isBackground: false },
  
  buttonBg: { tokenVar: 'var(--theme-btn-primary-bg)', label: 'Button Background', isBackground: false },
  buttonColor: { tokenVar: 'var(--theme-btn-primary-text)', label: 'Button Text Color', isBackground: false },
  primaryBtnBg: { tokenVar: 'var(--theme-btn-primary-bg)', label: 'Primary Button Bg', isBackground: false },
  secondaryBtnBg: { tokenVar: 'var(--theme-btn-secondary-bg)', label: 'Secondary Button Bg', isBackground: false },
};

/**
 * Resolves an individual property value (which may be a string, an override object, or undefined)
 * into a valid CSS value.
 */
export function resolveThemeProp(
  propValue: any,
  defaultCssVar: string,
  isBackground: boolean = false
): string {
  if (propValue === undefined || propValue === null || propValue === '') {
    return defaultCssVar;
  }

  // Already a raw string (e.g. hex, rgb, var(...))
  if (typeof propValue === 'string') {
    return propValue;
  }

  // Structured override object
  if (typeof propValue === 'object') {
    const mode: ThemeOverrideMode = propValue.mode || 'inherit';

    if (mode === 'inherit') {
      return defaultCssVar;
    }

    if (mode === 'color') {
      return propValue.color || defaultCssVar;
    }

    if (mode === 'gradient' && isBackground) {
      const g: GradientOverride = propValue.gradient || {
        type: 'linear',
        color1: '#2563eb',
        color2: '#4f46e5',
        angle: '135deg',
      };
      if (g.type === 'radial') {
        return `radial-gradient(circle, ${g.color1 || '#2563eb'}, ${g.color2 || '#4f46e5'})`;
      }
      return `linear-gradient(${g.angle || '135deg'}, ${g.color1 || '#2563eb'}, ${g.color2 || '#4f46e5'})`;
    }

    if (mode === 'image' && isBackground) {
      const img: ImageOverride = propValue.image || { url: '' };
      if (!img.url) return defaultCssVar;
      const overlay =
        img.overlayColor && (img.overlayOpacity ?? 0) > 0
          ? `linear-gradient(${img.overlayColor}, ${img.overlayColor}), `
          : '';
      return `${overlay}url('${img.url}') ${img.position || 'center'} / ${img.size || 'cover'} no-repeat`;
    }
  }

  return defaultCssVar;
}

/**
 * Resolves all theme-aware props in a section's prop dictionary,
 * converting override objects into rendered CSS strings before section rendering.
 */
export function resolveSectionProps(
  props: Record<string, any>,
  _sectionType?: string
): Record<string, any> {
  const resolved = { ...props };

  for (const [key, config] of Object.entries(themeTokenMap)) {
    if (key in resolved) {
      resolved[key] = resolveThemeProp(resolved[key], config.tokenVar, config.isBackground);
    }
  }

  // Ensure background property is consistently accessible for styling
  if (resolved.bgColor) {
    resolved._resolvedBackground = resolved.bgColor;
  }

  return resolved;
}
