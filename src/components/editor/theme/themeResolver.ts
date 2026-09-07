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

export interface ThemeTokenInfo {
  tokenVar: string;
  label: string;
  palettePath: string;
  isBackground: boolean;
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
 * Intelligent section-specific token mapper.
 * Returns the exact global theme token, display label, and palette key that a property inherits from.
 */
export function getSectionDefaultToken(
  sectionType?: string,
  fieldKey: string = ''
): ThemeTokenInfo {
  const key = fieldKey.toLowerCase();
  const type = sectionType || '';

  // 1. ANNOUNCEMENT BAR SPECIALIZATION (Accent Background + Inverse Text)
  if (type === 'AnnouncementBar') {
    if (key.includes('bg') || key.includes('background')) {
      return {
        tokenVar: 'var(--theme-brand-accent)',
        label: 'Accent Background',
        palettePath: 'brand.accent',
        isBackground: true,
      };
    }
    if (key.includes('text') || key.includes('color')) {
      return {
        tokenVar: 'var(--theme-text-inverse)',
        label: 'Inverse Text',
        palettePath: 'text.inverse',
        isBackground: false,
      };
    }
  }

  // 2. UTILITY BAR SPECIALIZATION (Surface Background + Muted Text)
  if (type === 'UtilityBar') {
    if (key.includes('bg') || key.includes('background')) {
      return {
        tokenVar: 'var(--theme-bg-surface)',
        label: 'Surface Background',
        palettePath: 'background.surface',
        isBackground: true,
      };
    }
    if (key.includes('text') || key.includes('color')) {
      return {
        tokenVar: 'var(--theme-text-muted)',
        label: 'Muted Text',
        palettePath: 'text.muted',
        isBackground: false,
      };
    }
  }

  // 3. HEADER SPECIALIZATION (Page Background + Heading Text)
  if (type === 'Header') {
    if (key.includes('bg') || key.includes('background')) {
      return {
        tokenVar: 'var(--theme-bg-background)',
        label: 'Page Background',
        palettePath: 'background.background',
        isBackground: true,
      };
    }
    if (key.includes('heading') || key.includes('logo') || key.includes('text')) {
      return {
        tokenVar: 'var(--theme-text-heading)',
        label: 'Heading Text',
        palettePath: 'text.heading',
        isBackground: false,
      };
    }
  }

  // 4. FOOTER & FOOTER BLOCKS (Section Background + Inverse Text)
  if (['Footer', 'FooterMenu', 'FooterText'].includes(type)) {
    if (key.includes('bg') || key.includes('background')) {
      return {
        tokenVar: 'var(--theme-bg-section)',
        label: 'Footer Background',
        palettePath: 'background.sectionBg',
        isBackground: true,
      };
    }
    if (key.includes('text') || key.includes('color') || key.includes('link')) {
      return {
        tokenVar: 'var(--theme-text-inverse)',
        label: 'Inverse Text',
        palettePath: 'text.inverse',
        isBackground: false,
      };
    }
  }

  // 5. NEWSLETTER SPECIALIZATION (Surface Background)
  if (type === 'Newsletter') {
    if (key.includes('bg') || key.includes('background')) {
      return {
        tokenVar: 'var(--theme-bg-surface)',
        label: 'Surface Background',
        palettePath: 'background.surface',
        isBackground: true,
      };
    }
  }

  // 6. GENERAL FIELD KEY MAPPINGS ACROSS ALL SECTIONS
  if (key.includes('containerbg') || key.includes('container')) {
    return {
      tokenVar: 'var(--theme-bg-container)',
      label: 'Container Background',
      palettePath: 'background.containerBg',
      isBackground: true,
    };
  }
  if (key.includes('surface') || key.includes('cardbg')) {
    return {
      tokenVar: 'var(--theme-bg-surface)',
      label: 'Surface Background',
      palettePath: 'background.surface',
      isBackground: true,
    };
  }
  if (key.includes('bg') || key.includes('background')) {
    return {
      tokenVar: 'var(--theme-bg-section)',
      label: 'Section Background',
      palettePath: 'background.sectionBg',
      isBackground: true,
    };
  }
  if (key.includes('heading') || key.includes('title')) {
    return {
      tokenVar: 'var(--theme-text-heading)',
      label: 'Heading Text',
      palettePath: 'text.heading',
      isBackground: false,
    };
  }
  if (key.includes('subheading') || key.includes('subtitle')) {
    return {
      tokenVar: 'var(--theme-text-subheading)',
      label: 'Subheading Text',
      palettePath: 'text.subheading',
      isBackground: false,
    };
  }
  if (key.includes('muted') || key.includes('caption')) {
    return {
      tokenVar: 'var(--theme-text-muted)',
      label: 'Muted Text',
      palettePath: 'text.muted',
      isBackground: false,
    };
  }
  if (key.includes('accent')) {
    return {
      tokenVar: 'var(--theme-brand-accent)',
      label: 'Accent Color',
      palettePath: 'brand.accent',
      isBackground: false,
    };
  }
  if (key.includes('link')) {
    return {
      tokenVar: 'var(--theme-brand-link)',
      label: 'Link Color',
      palettePath: 'brand.link',
      isBackground: false,
    };
  }
  if (key.includes('border') || key.includes('divider')) {
    return {
      tokenVar: 'var(--theme-border-border)',
      label: 'Border Color',
      palettePath: 'border.border',
      isBackground: false,
    };
  }
  if (key.includes('primarybtn') || key.includes('btnbg') || key.includes('buttonbg')) {
    return {
      tokenVar: 'var(--theme-btn-primary-bg)',
      label: 'Primary Button',
      palettePath: 'brand.primary',
      isBackground: false,
    };
  }
  if (key.includes('secondarybtn')) {
    return {
      tokenVar: 'var(--theme-btn-secondary-bg)',
      label: 'Secondary Button',
      palettePath: 'brand.secondary',
      isBackground: false,
    };
  }
  if (key.includes('buttontext') || key.includes('btntext')) {
    return {
      tokenVar: 'var(--theme-btn-primary-text)',
      label: 'Button Text',
      palettePath: 'text.inverse',
      isBackground: false,
    };
  }

  // Default fallback to body text
  return {
    tokenVar: 'var(--theme-text-body)',
    label: 'Body Text',
    palettePath: 'text.body',
    isBackground: false,
  };
}

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

  // Already a raw string (e.g. hex, rgb, var(...), linear-gradient(...))
  if (typeof propValue === 'string') {
    if (propValue === 'inherit') {
      return defaultCssVar;
    }
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
      if (propValue.gradientCss) {
        return propValue.gradientCss;
      }
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
  sectionType?: string
): Record<string, any> {
  const resolved = { ...props };

  for (const key of Object.keys(resolved)) {
    const val = resolved[key];
    const isColorProp = 
      key.toLowerCase().includes('color') || 
      key.toLowerCase().includes('bg') || 
      key.toLowerCase().includes('background');

    if (isColorProp || key in themeTokenMap) {
      const tokenInfo = getSectionDefaultToken(sectionType, key);
      resolved[key] = resolveThemeProp(val, tokenInfo.tokenVar, tokenInfo.isBackground);
    }
  }

  // Ensure background property is consistently accessible for styling
  if (resolved.bgColor) {
    resolved._resolvedBackground = resolved.bgColor;
  }

  return resolved;
}
