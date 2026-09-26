export const getEditorPath = (pageId: string, sectionId?: string): string => {
  const pathId: Record<string, string> = {
    'header-global': 'header',
    'footer-global': 'footer',
    'cookie-consent-global': 'cookie-consent',
    'toaster-global': 'toaster',
    'landing-page': 'landing-page',
  };

  const base = `/editor/${pathId[pageId] || pageId}`;
  return sectionId ? `${base}?sectionId=${encodeURIComponent(sectionId)}` : base;
};

export const resolveHeaderRowId = (sectionId: string | null | undefined, headerRows?: any[]): string => {
  if (!sectionId) return 'row-primary-nav';
  const lower = sectionId.toLowerCase();
  if (lower.includes('announcement')) {
    const found = headerRows?.find(r => r.type === 'announcement' || r.id?.includes('announcement'));
    return found ? found.id : 'row-announcement';
  }
  if (lower.includes('utility')) {
    const found = headerRows?.find(r => r.type === 'utility' || r.id?.includes('utility'));
    return found ? found.id : 'row-utility';
  }
  if (lower.includes('secondary') || lower.includes('category')) {
    const found = headerRows?.find(r => r.type === 'secondary-nav' || r.id?.includes('secondary') || r.id?.includes('category'));
    return found ? found.id : 'row-secondary-nav';
  }
  if (lower.includes('primary') || lower.includes('header')) {
    const found = headerRows?.find(r => r.type === 'primary-nav' || r.id?.includes('primary'));
    return found ? found.id : 'row-primary-nav';
  }
  const directMatch = headerRows?.find(r => r.id === sectionId);
  if (directMatch) return directMatch.id;
  const primary = headerRows?.find(r => r.type === 'primary-nav');
  return primary ? primary.id : 'row-primary-nav';
};

export const resolveFooterRowId = (sectionId: string | null | undefined, footerRows?: any[]): string => {
  if (!sectionId) {
    const main = footerRows?.find(r => r.type === 'navigation' || r.id === 'row-main-nav');
    return main ? main.id : 'row-main-nav';
  }
  const lower = sectionId.toLowerCase();
  if (lower.includes('trust')) {
    const found = footerRows?.find(r => r.type === 'trust' || r.id?.includes('trust'));
    return found ? found.id : 'row-trust-1';
  }
  if (lower.includes('newsletter')) {
    const found = footerRows?.find(r => r.type === 'newsletter' || r.id?.includes('newsletter'));
    return found ? found.id : 'row-newsletter';
  }
  if (lower.includes('social')) {
    const found = footerRows?.find(r => r.type === 'social' || r.id?.includes('social'));
    return found ? found.id : 'row-social';
  }
  if (lower.includes('legal') || lower.includes('bottom') || lower.includes('payment')) {
    const found = footerRows?.find(r => r.type === 'legal' || r.type === 'payment' || r.id?.includes('bottom') || r.id?.includes('legal'));
    return found ? found.id : 'row-bottom-legal';
  }
  if (lower.includes('main') || lower.includes('navigation') || lower.includes('menu') || lower.includes('footer')) {
    const found = footerRows?.find(r => r.type === 'navigation' || r.id?.includes('main'));
    return found ? found.id : 'row-main-nav';
  }
  const directMatch = footerRows?.find(r => r.id === sectionId);
  if (directMatch) return directMatch.id;
  const main = footerRows?.find(r => r.type === 'navigation');
  return main ? main.id : 'row-main-nav';
};

