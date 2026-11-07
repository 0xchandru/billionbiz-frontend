const ALLOWED_TAGS = new Set(['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'STRONG', 'B', 'EM', 'I', 'U', 'S', 'UL', 'OL', 'LI', 'BR', 'A']);

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

/** Convert plain or rich text into the small safe HTML subset used by the footer editor. */
export const sanitizeFooterRichText = (value: string): string => {
  if (typeof document === 'undefined') return escapeHtml(value || '');
  const parsed = new DOMParser().parseFromString(`<body>${value || ''}</body>`, 'text/html');

  const renderNode = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) return escapeHtml(node.textContent || '');
    if (node.nodeType !== Node.ELEMENT_NODE) return '';
    const element = node as HTMLElement;
    const children = Array.from(element.childNodes).map(renderNode).join('');
    if (!ALLOWED_TAGS.has(element.tagName)) return children;
    if (element.tagName === 'BR') return '<br>';
    if (element.tagName === 'A') {
      const href = element.getAttribute('href') || '';
      const safeHref = /^(https?:|mailto:|tel:|\/|#)/i.test(href) ? href : '';
      return safeHref ? `<a href="${escapeHtml(safeHref)}">${children}</a>` : children;
    }
    return `<${element.tagName.toLowerCase()}>${children}</${element.tagName.toLowerCase()}>`;
  };

  return Array.from(parsed.body.childNodes).map(renderNode).join('');
};

export const footerTextForEditor = (value: string): string => {
  if (/<[a-z][\s\S]*>/i.test(value || '')) return sanitizeFooterRichText(value);
  return escapeHtml(value || '').replace(/\r?\n/g, '<br>');
};
