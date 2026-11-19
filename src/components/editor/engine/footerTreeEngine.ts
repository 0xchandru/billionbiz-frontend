// ============================================================
// FOOTER TREE ENGINE — Manipulation Utilities
// Pure functions for traversing, mutating, and validating the
// recursive footer tree. All operations produce immutable copies.
// ============================================================

import type {
  FooterTreeNode,
  FooterNodeType,
  FooterComponentDefinition,
  FooterNodeCategory,
} from './footerTreeTypes';
import {
  generateNodeId,
  createDefaultGroupLayout,
  createDefaultStyling,
  MAX_NESTING_DEPTH,
} from './footerTreeTypes';

// ─── Component Definitions Registry ──────────────────────────

export const FOOTER_COMPONENT_DEFS: FooterComponentDefinition[] = [
  // 1. Group (Layout & Structural Container)
  {
    nodeType: 'group',
    name: 'Group',
    category: 'layout',
    icon: 'LayoutGrid',
    description: 'Flexible layout container for organizing blocks horizontally or vertically',
    isContainer: true,
    allowedParents: ['root', 'group'],
    defaultProps: {},
    defaultLayout: createDefaultGroupLayout('horizontal'),
    defaultStyling: createDefaultStyling(),
  },

  // 2. Logo (Brand mark & Identity)
  {
    nodeType: 'logo',
    name: 'Logo',
    category: 'content',
    icon: 'Gem',
    description: 'Store logo & brand mark with complete image, text, and layout controls',
    isContainer: false,
    allowedParents: ['root', 'group'],
    defaultProps: {
      sourceType: 'theme',
      logoType: 'both',
      text: 'BillionBiz',
      brandName: 'BillionBiz',
      upperText: 'BILLION',
      lowerText: 'BIZ COUTURE',
      isTwoLines: false,
      fontFamily: 'Inter',
      fontSize: 20,
      firstLineSize: 20,
      secondLineSize: 12,
      fontWeight: 800,
      firstLineWeight: 800,
      secondLineWeight: 600,
      color: '',
      firstLineColor: '#0f172a',
      secondLineColor: '#64748b',
      imageUrl: '',
      image: '',
      src: '',
      width: 140,
      logoWidth: 140,
      desktopWidth: 140,
      height: 40,
      logoHeight: 40,
      shape: 'none',
      borderRadius: 8,
      borderStyle: 'none',
      borderWidth: 1,
      borderColor: '#cbd5e1',
      shadow: 'none',
      imagePadding: 0,
      imageBg: 'transparent',
      logoGap: 8,
      link: '/',
      url: '/',
      openInNewTab: false,
      alt: 'Store Logo',
      fontPreset: 'heading',
      sizeUnit: 'px',
      customMobileSize: false,
    },
  },

  // 3. Icon (Badges & Visual Accents)
  {
    nodeType: 'icon',
    name: 'Icon',
    category: 'content',
    icon: 'Smile',
    description: 'Customizable icon with optional link, color, and size controls',
    isContainer: false,
    allowedParents: ['root', 'group'],
    defaultProps: {
      iconType: 'lucide',
      iconName: 'Sparkles',
      imageUrl: '',
      size: 24,
      color: '',
      link: '',
      openInNewTab: false,
      alt: '',
      alignment: 'left',
    },
  },

  // 4. Button (Call to Action)
  {
    nodeType: 'button',
    name: 'Button',
    category: 'actions',
    icon: 'MousePointerClick',
    description: 'Interactive call-to-action button with custom link and variants',
    isContainer: false,
    allowedParents: ['root', 'group'],
    defaultProps: {
      label: 'Explore Store',
      link: '/collections/all',
      variant: 'primary',
      size: 'md',
      alignment: 'left',
      widthMode: 'fit',
      iconName: '',
      openInNewTab: false,
      mobileWidthMode: 'fit',
      customWidth: 180,
      mobileCustomWidth: 180,
    },
  },

  // 5. Custom Column Links (Balanced, Individual Link Columns)
  {
    nodeType: 'column-links',
    name: 'Custom Column Links',
    category: 'navigation',
    icon: 'List',
    description: 'Custom link column with editable heading, individual link labels, paths, badges, and targets',
    isContainer: false,
    allowedParents: ['root', 'group'],
    defaultProps: {
      heading: 'Quick Links',
      headingLevel: 'h3',
      headingSize: 14,
      headingWeight: 700,
      headingColor: '',
      links: [
        { label: 'About Us', href: '/about', openInNewTab: false, badge: '' },
        { label: 'Shop All', href: '/collections/all', openInNewTab: false, badge: '' },
        { label: 'Contact Us', href: '/contact', openInNewTab: false, badge: '' },
        { label: 'FAQs', href: '/faq', openInNewTab: false, badge: '' },
      ],
      fontSize: 14,
      gap: 10,
      color: '',
      hoverColor: '#2563eb',
      alignment: 'left',
      verticalGap: 12,
      widthMode: 'fill',
    },
  },

  // 6. Map Preview (Interactive Real-Time Location Map)
  {
    nodeType: 'map-preview',
    name: 'Map Preview',
    category: 'store-info',
    icon: 'MapPin',
    description: 'Interactive real-time map preview for store location with resizable height and zoom',
    isContainer: false,
    allowedParents: ['root', 'group'],
    defaultProps: {
      title: 'Store Location',
      location: '123 Commerce Way, New York, NY 10001',
      zoom: 14,
      mapType: 'roadmap',
      height: 160,
      widthMode: 'fill',
      customWidth: 320,
      borderRadius: 8,
      showPin: true,
    },
  },

  // 7. Heading (Typography)
  {
    nodeType: 'heading',
    name: 'Heading',
    category: 'content',
    icon: 'Heading',
    description: 'Section heading with typography controls',
    isContainer: false,
    allowedParents: ['root', 'group'],
    defaultProps: {
      text: 'Heading',
      level: 'h3',
      fontSize: 16,
      fontWeight: 700,
      color: '',
      alignment: 'left',
      widthMode: 'fit',
      maxWidth: 'normal',
      typographyPreset: 'default',
      hasBackground: false,
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
    },
  },

  // 8. Text (Paragraph & Body)
  {
    nodeType: 'text',
    name: 'Text',
    category: 'content',
    icon: 'Type',
    description: 'Rich text paragraph or store description',
    isContainer: false,
    allowedParents: ['root', 'group'],
    defaultProps: {
      text: 'Add your text here.',
      fontSize: 14,
      lineHeight: 1.6,
      color: '',
      alignment: 'left',
      widthMode: 'fit',
      maxWidth: 'normal',
      typographyPreset: 'default',
      hasBackground: false,
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
    },
  },

  // 9. Image (Media)
  {
    nodeType: 'image',
    name: 'Image',
    category: 'content',
    icon: 'Image',
    description: 'Image with alt text and optional link',
    isContainer: false,
    allowedParents: ['root', 'group'],
    defaultProps: {
      src: '',
      alt: '',
      width: 200,
      height: 'auto',
      objectFit: 'contain',
      alignment: 'left',
      link: '',
      openInNewTab: false,
    },
  },

  // 10. Newsletter (Email Signup)
  {
    nodeType: 'newsletter',
    name: 'Email signup',
    category: 'forms',
    icon: 'Mail',
    description: 'Email newsletter subscription form with real submit feedback',
    isContainer: false,
    allowedParents: ['root', 'group'],
    defaultProps: {
      heading: 'Stay in the loop',
      description: 'Subscribe for exclusive deals and updates.',
      placeholder: 'Enter your email...',
      buttonText: 'Subscribe',
      layout: 'vertical',
      alignment: 'left',
      consentText: 'By subscribing you agree to our Privacy Policy.',
      showConsent: true,
      successMessage: '🎉 Thank you for subscribing!',
      errorMessage: 'Something went wrong. Please try again.',
      widthMode: 'fill',
      headingColor: '',
      headingPreset: 'h3',
      inputBorder: 'all',
      inputStyle: 'default',
      inputBorderThickness: 1,
      inputRadius: 8,
      inputBackground: '#ffffff',
      inputColor: '#0f172a',
      inputBorderColor: '#cbd5e1',
      inputTextPreset: 'paragraph',
      buttonStyle: 'link',
      buttonDisplay: 'arrow',
      integratedButton: true,
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
    },
  },

  // 11. Social Media Links
  {
    nodeType: 'social-links',
    name: 'Social media links',
    category: 'navigation',
    icon: 'Share2',
    description: 'Social media icons with real profile links',
    isContainer: false,
    allowedParents: ['root', 'group'],
    defaultProps: {
      platforms: [
        { platform: 'twitter', url: 'https://twitter.com', enabled: true },
        { platform: 'instagram', url: 'https://instagram.com', enabled: true },
        { platform: 'facebook', url: 'https://facebook.com', enabled: true },
        { platform: 'linkedin', url: 'https://linkedin.com', enabled: true },
        { platform: 'youtube', url: 'https://youtube.com', enabled: true },
      ],
      iconSize: 20,
      gap: 12,
      color: '',
      hoverColor: '',
      variant: 'minimal',
      alignment: 'left',
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
    },
  },

  // 12. Contact Info
  {
    nodeType: 'contact-info',
    name: 'Contact Info',
    category: 'store-info',
    icon: 'PhoneCall',
    description: 'Store phone, email, address, and business hours with real icons',
    isContainer: false,
    allowedParents: ['root', 'group'],
    defaultProps: {
      heading: 'Contact Us',
      phone: '+1 (800) 123-4567',
      email: 'support@billionbiz.com',
      address: '123 Commerce Way, New York, NY 10001',
      hours: 'Mon - Fri: 9:00 AM - 6:00 PM EST',
      showIcons: true,
      fontSize: 13,
      gap: 10,
      widthMode: 'fill',
    },
  },

  // 13. Policy Links
  {
    nodeType: 'policy-links',
    name: 'Policy links',
    category: 'store-info',
    icon: 'ShieldCheck',
    description: 'Privacy, terms, refund, and shipping policy links with custom separator',
    isContainer: false,
    allowedParents: ['root', 'group'],
    defaultProps: {
      links: [
        { label: 'Privacy Policy', href: '/policies/privacy-policy' },
        { label: 'Terms of Service', href: '/policies/terms-of-service' },
        { label: 'Refund Policy', href: '/policies/refund-policy' },
        { label: 'Shipping Policy', href: '/policies/shipping-policy' },
      ],
      fontSize: 12,
      gap: 16,
      separator: '·',
      color: '',
      alignment: 'left',
      case: 'default',
    },
  },

  // 14. Payment Icons
  {
    nodeType: 'payment-icons',
    name: 'Payment icons',
    category: 'store-info',
    icon: 'CreditCard',
    description: 'Accepted payment method logos (Visa, Mastercard, PayPal, Apple Pay, etc.)',
    isContainer: false,
    allowedParents: ['root', 'group'],
    defaultProps: {
      methods: [
        { id: 'visa', name: 'Visa', enabled: true },
        { id: 'mastercard', name: 'Mastercard', enabled: true },
        { id: 'amex', name: 'American Express', enabled: true },
        { id: 'paypal', name: 'PayPal', enabled: true },
        { id: 'apple-pay', name: 'Apple Pay', enabled: true },
        { id: 'google-pay', name: 'Google Pay', enabled: true },
      ],
      size: 'medium',
      gap: 8,
      grayscale: false,
      alignment: 'right',
      widthMode: 'fit',
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
    },
  },

  // 15. Copyright
  {
    nodeType: 'copyright',
    name: 'Copyright',
    category: 'store-info',
    icon: 'Copyright',
    description: 'Copyright notice with dynamic auto-updating year',
    isContainer: false,
    allowedParents: ['root', 'group'],
    defaultProps: {
      text: '© {year} BillionBiz. All rights reserved.',
      fontSize: 12,
      color: '',
      alignment: 'left',
      widthMode: 'fit',
      showPlatformCredit: false,
    },
  },

  // 16. Trust Badges
  {
    nodeType: 'trust-badge',
    name: 'Trust Badges',
    category: 'store-info',
    icon: 'ShieldCheck',
    description: 'Security seals, guarantees, and service trust highlights',
    isContainer: false,
    allowedParents: ['root', 'group'],
    defaultProps: {
      badges: [
        { id: 'secure', icon: 'shield', title: 'Secure Checkout', subtitle: '256-bit SSL encryption', enabled: true },
        { id: 'guarantee', icon: 'check', title: 'Money-Back Guarantee', subtitle: '30-day return policy', enabled: true },
        { id: 'shipping', icon: 'truck', title: 'Free Express Shipping', subtitle: 'On orders over $50', enabled: true },
        { id: 'support', icon: 'headphones', title: '24/7 Dedicated Support', subtitle: 'Expert assistance', enabled: true },
      ],
      layout: 'horizontal',
      alignment: 'center',
      gap: 16,
      widthMode: 'fit',
    },
  },

  // 17. App Download
  {
    nodeType: 'app-download',
    name: 'App Download',
    category: 'actions',
    icon: 'Smartphone',
    description: 'Apple App Store and Google Play mobile app badges',
    isContainer: false,
    allowedParents: ['root', 'group'],
    defaultProps: {
      heading: 'Get the App',
      subheading: 'Shop on mobile for exclusive app-only deals',
      appleUrl: 'https://apple.com',
      googleUrl: 'https://google.com',
      showApple: true,
      showGoogle: true,
      layout: 'row',
      alignment: 'left',
      gap: 10,
      widthMode: 'fit',
    },
  },

  // 18. Localization
  {
    nodeType: 'localization',
    name: 'Localization',
    category: 'navigation',
    icon: 'Globe',
    description: 'Country, currency, and language selectors',
    isContainer: false,
    allowedParents: ['root', 'group'],
    defaultProps: {
      showCountry: true,
      showLanguage: true,
      currentCountry: 'United States (USD $)',
      currentLanguage: 'English (US)',
      alignment: 'left',
      gap: 10,
      widthMode: 'fit',
    },
  },

  // 19. Custom HTML
  {
    nodeType: 'custom-html',
    name: 'Custom HTML',
    category: 'content',
    icon: 'Code',
    description: 'Custom embed codes, verification tags, or HTML badges',
    isContainer: false,
    allowedParents: ['root', 'group'],
    defaultProps: {
      html: '<div style="font-size: 12px; opacity: 0.7;">Verified Merchant &bull; Powered by BillionBiz</div>',
      widthMode: 'fit',
    },
  },

  // 20. Divider
  {
    nodeType: 'divider',
    name: 'Divider',
    category: 'structure',
    icon: 'Minus',
    description: 'Horizontal line separator',
    isContainer: false,
    allowedParents: ['root', 'group'],
    defaultProps: {
      color: '',
      thickness: 1,
      style: 'solid',
      width: '100%',
      spacing: 16,
    },
  },

  // 21. Spacer
  {
    nodeType: 'spacer',
    name: 'Spacer',
    category: 'structure',
    icon: 'Space',
    description: 'Empty space between elements with responsive heights',
    isContainer: false,
    allowedParents: ['root', 'group'],
    defaultProps: {
      size: 32,
      direction: 'vertical',
      responsiveSize: { tablet: 24, mobile: 16 },
    },
  },

  // Backward Compatibility Alias: Link List
  {
    nodeType: 'link-list',
    name: 'Menu (Legacy)',
    category: 'navigation',
    icon: 'List',
    description: 'Legacy menu block — use Custom Column Links for modern editing',
    isContainer: false,
    allowedParents: ['root', 'group'],
    defaultProps: {
      heading: 'Menu',
      menuName: 'main',
      headingSize: 14,
      headingWeight: 700,
      headingColor: '',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'Careers', href: '/careers' },
        { label: 'Blog', href: '/blog' },
      ],
      fontSize: 14,
      gap: 10,
      color: '',
      hoverColor: '',
      alignment: 'left',
      verticalGap: 12,
    },
  },
];

// ─── Helpers ─────────────────────────────────────────────────

/** Get component definition by nodeType */
export function getComponentDef(nodeType: FooterNodeType): FooterComponentDefinition | undefined {
  return FOOTER_COMPONENT_DEFS.find((d) => d.nodeType === nodeType);
}

/** Get all components for a category */
export function getComponentsByCategory(category: FooterNodeCategory): FooterComponentDefinition[] {
  return FOOTER_COMPONENT_DEFS.filter((d) => d.category === category);
}

/** Get categories with their components */
export function getCategorizedComponents(): { category: FooterNodeCategory; label: string; components: FooterComponentDefinition[] }[] {
  const categoryLabels: Record<FooterNodeCategory, string> = {
    layout: 'Layout',
    content: 'Content',
    navigation: 'Navigation',
    actions: 'Actions',
    forms: 'Forms',
    structure: 'Structure',
    'store-info': 'Store Information',
  };
  const order: FooterNodeCategory[] = ['layout', 'content', 'navigation', 'actions', 'forms', 'structure', 'store-info'];
  return order.map((cat) => ({
    category: cat,
    label: categoryLabels[cat],
    components: getComponentsByCategory(cat),
  })).filter((g) => g.components.length > 0);
}

// ─── Tree Traversal ──────────────────────────────────────────

/** Find a node by ID in the tree */
export function findNodeById(nodes: FooterTreeNode[], id: string): FooterTreeNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

/** Find the parent of a node */
export function findParentNode(nodes: FooterTreeNode[], targetId: string): { parent: FooterTreeNode | null; index: number } {
  const rootIdx = nodes.findIndex((n) => n.id === targetId);
  if (rootIdx !== -1) {
    return { parent: null, index: rootIdx };
  }
  for (const node of nodes) {
    if (node.children) {
      const idx = node.children.findIndex((c) => c.id === targetId);
      if (idx !== -1) return { parent: node, index: idx };
      const found = findParentNode(node.children, targetId);
      if (found.parent || found.index !== -1) return found;
    }
  }
  return { parent: null, index: -1 };
}

/** Get the depth of a node in the tree */
export function getNodeDepth(nodes: FooterTreeNode[], targetId: string, depth: number = 0): number {
  for (const node of nodes) {
    if (node.id === targetId) return depth;
    if (node.children) {
      const found = getNodeDepth(node.children, targetId, depth + 1);
      if (found >= 0) return found;
    }
  }
  return -1;
}

/** Get the path of ancestor IDs from root to the target node */
export function getAncestorPath(nodes: FooterTreeNode[], targetId: string, path: string[] = []): string[] | null {
  for (const node of nodes) {
    if (node.id === targetId) return path;
    if (node.children) {
      const found = getAncestorPath(node.children, targetId, [...path, node.id]);
      if (found) return found;
    }
  }
  return null;
}

/** Check if a node is an ancestor of another */
export function isAncestorOf(nodes: FooterTreeNode[], ancestorId: string, descendantId: string): boolean {
  const path = getAncestorPath(nodes, descendantId);
  return path ? path.includes(ancestorId) : false;
}

/** Get all descendant IDs of a node */
export function getDescendantIds(node: FooterTreeNode): string[] {
  const ids: string[] = [];
  if (node.children) {
    for (const child of node.children) {
      ids.push(child.id);
      ids.push(...getDescendantIds(child));
    }
  }
  return ids;
}

/** Flatten the tree to an array of nodes */
export function flattenTree(nodes: FooterTreeNode[]): FooterTreeNode[] {
  const result: FooterTreeNode[] = [];
  for (const node of nodes) {
    result.push(node);
    if (node.children) {
      result.push(...flattenTree(node.children));
    }
  }
  return result;
}

// ─── Tree Mutations (Immutable) ──────────────────────────────

/** Deep clone a node with new IDs */
export function cloneNodeWithNewIds(node: FooterTreeNode): FooterTreeNode {
  const cloned: FooterTreeNode = {
    ...JSON.parse(JSON.stringify(node)),
    id: generateNodeId(node.nodeType === 'group' ? 'fg' : 'fc'),
    name: `${node.name} (Copy)`,
  };
  if (cloned.children) {
    cloned.children = cloned.children.map(cloneNodeWithNewIds);
  }
  return cloned;
}

/** Create a new node from a component definition */
export function createNodeFromDef(
  def: FooterComponentDefinition,
  overrides?: Partial<FooterTreeNode>
): FooterTreeNode {
  const node: FooterTreeNode = {
    id: generateNodeId(def.nodeType === 'group' ? 'fg' : 'fc'),
    nodeType: def.nodeType,
    name: overrides?.name || def.name,
    visible: true,
    props: { ...def.defaultProps, ...overrides?.props },
    styling: { ...(def.defaultStyling || createDefaultStyling()), ...overrides?.styling },
  };
  if (def.isContainer) {
    node.children = overrides?.children || [];
    node.layout = { ...(def.defaultLayout || createDefaultGroupLayout()), ...overrides?.layout };
    node.responsive = overrides?.responsive || {};
  }
  return node;
}

/** Insert a node at a specific position in the tree */
export function insertNode(
  tree: FooterTreeNode[],
  parentId: string | null,
  node: FooterTreeNode,
  index?: number
): FooterTreeNode[] {
  // Insert at root level
  if (!parentId) {
    const newTree = [...tree];
    if (index !== undefined && index >= 0 && index <= newTree.length) {
      newTree.splice(index, 0, node);
    } else {
      newTree.push(node);
    }
    return newTree;
  }

  return tree.map((n) => {
    if (n.id === parentId && n.children !== undefined) {
      const newChildren = [...n.children];
      if (index !== undefined && index >= 0 && index <= newChildren.length) {
        newChildren.splice(index, 0, node);
      } else {
        newChildren.push(node);
      }
      return { ...n, children: newChildren };
    }
    if (n.children) {
      return { ...n, children: insertNode(n.children, parentId, node, index) };
    }
    return n;
  });
}

/** Remove a node from the tree */
export function removeNode(tree: FooterTreeNode[], targetId: string): FooterTreeNode[] {
  return tree
    .filter((n) => n.id !== targetId)
    .map((n) => {
      if (n.children) {
        return { ...n, children: removeNode(n.children, targetId) };
      }
      return n;
    });
}

/** Update a node's properties */
export function updateNode(
  tree: FooterTreeNode[],
  targetId: string,
  updates: Partial<FooterTreeNode>
): FooterTreeNode[] {
  return tree.map((n) => {
    if (n.id === targetId) {
      return {
        ...n,
        ...updates,
        // Deep-merge nested objects
        props: updates.props ? { ...n.props, ...updates.props } : n.props,
        layout: updates.layout ? { ...n.layout, ...updates.layout } : n.layout,
        styling: updates.styling ? { ...n.styling, ...updates.styling } : n.styling,
        responsive: updates.responsive ? { ...n.responsive, ...updates.responsive } : n.responsive,
        // Don't override children unless explicitly provided
        children: updates.children !== undefined ? updates.children : n.children,
      };
    }
    if (n.children) {
      return { ...n, children: updateNode(n.children, targetId, updates) };
    }
    return n;
  });
}

/** Move a node to a new parent and position */
export function moveNode(
  tree: FooterTreeNode[],
  nodeId: string,
  newParentId: string | null,
  newIndex: number
): FooterTreeNode[] {
  // Find the node first
  const node = findNodeById(tree, nodeId);
  if (!node) return tree;

  // Prevent circular reference: cannot move a group inside its own descendant
  if (newParentId && isAncestorOf(tree, nodeId, newParentId)) {
    return tree;
  }

  // Check depth limit for groups
  if (node.nodeType === 'group' && newParentId) {
    const parentDepth = getNodeDepth(tree, newParentId);
    const subtreeDepth = getMaxDepth(node);
    if (parentDepth + subtreeDepth + 1 > MAX_NESTING_DEPTH) {
      return tree;
    }
  }

  // Determine original parent and index
  const { parent: oldParent, index: oldIndex } = findParentNode(tree, nodeId);
  const oldParentId = oldParent ? oldParent.id : null;

  let adjustedIndex = newIndex;
  // If moving within the same parent and moving forward, adjust for the removal shift
  if (oldParentId === newParentId && oldIndex !== -1 && oldIndex < newIndex) {
    adjustedIndex = newIndex - 1;
  }

  // Remove from old position
  let newTree = removeNode(tree, nodeId);
  // Insert at new position
  newTree = insertNode(newTree, newParentId, node, adjustedIndex);
  return newTree;
}

/** Reorder children within the same parent */
export function reorderChildren(
  tree: FooterTreeNode[],
  parentId: string | null,
  fromIndex: number,
  toIndex: number
): FooterTreeNode[] {
  if (!parentId) {
    const newTree = [...tree];
    const [moved] = newTree.splice(fromIndex, 1);
    newTree.splice(toIndex, 0, moved);
    return newTree;
  }

  return tree.map((n) => {
    if (n.id === parentId && n.children) {
      const newChildren = [...n.children];
      const [moved] = newChildren.splice(fromIndex, 1);
      newChildren.splice(toIndex, 0, moved);
      return { ...n, children: newChildren };
    }
    if (n.children) {
      return { ...n, children: reorderChildren(n.children, parentId, fromIndex, toIndex) };
    }
    return n;
  });
}

// ─── Validation ──────────────────────────────────────────────

/** Get maximum depth of a subtree */
export function getMaxDepth(node: FooterTreeNode): number {
  if (!node.children || node.children.length === 0) return 0;
  return 1 + Math.max(...node.children.map(getMaxDepth));
}

/** Validate that a node can be placed under a given parent */
export function canInsertUnder(
  tree: FooterTreeNode[],
  parentId: string | null,
  nodeType: FooterNodeType
): boolean {
  const def = getComponentDef(nodeType);
  if (!def) return false;

  if (!parentId) {
    return def.allowedParents.includes('root');
  }

  const parent = findNodeById(tree, parentId);
  if (!parent) return false;
  if (parent.nodeType !== 'group') return false;
  if (!def.allowedParents.includes('group')) return false;

  // Check depth limit for groups
  if (nodeType === 'group') {
    const parentDepth = getNodeDepth(tree, parentId);
    if (parentDepth >= MAX_NESTING_DEPTH - 1) return false;
  }

  return true;
}

/** Validate the entire tree structure */
export function validateTree(tree: FooterTreeNode[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const ids = new Set<string>();

  function validate(nodes: FooterTreeNode[], depth: number) {
    for (const node of nodes) {
      // Check duplicate IDs
      if (ids.has(node.id)) {
        errors.push(`Duplicate node ID: ${node.id}`);
      }
      ids.add(node.id);

      // Check depth
      if (depth > MAX_NESTING_DEPTH) {
        errors.push(`Node ${node.id} exceeds max nesting depth of ${MAX_NESTING_DEPTH}`);
      }

      // Check that only groups have children
      if (node.nodeType !== 'group' && node.children && node.children.length > 0) {
        errors.push(`Non-group node ${node.id} (${node.nodeType}) has children`);
      }

      // Recurse
      if (node.children) {
        validate(node.children, depth + 1);
      }
    }
  }

  validate(tree, 0);
  return { valid: errors.length === 0, errors };
}

// ─── Default Footer Tree ─────────────────────────────────────

/** Create a default footer tree (Classic Multi-Column layout with custom column links and map preview) */
export function createDefaultFooterTree(): FooterTreeNode[] {
  return [
    {
      id: 'fg-global-wrapper',
      nodeType: 'group',
      name: 'Group',
      visible: true,
      children: [
        {
          id: 'fg-root-main',
          nodeType: 'group',
          name: 'Group',
          visible: true,
          children: [
            {
              id: 'fg-brand-col',
              nodeType: 'group',
              name: 'Group',
              visible: true,
              children: [
                {
                  id: 'fc-logo-1',
                  nodeType: 'logo',
                  name: 'Logo',
                  visible: true,
                  props: {
                    sourceType: 'theme',
                    text: 'BillionBiz',
                    fontFamily: 'Inter',
                    fontSize: 24,
                    fontWeight: 800,
                    color: '',
                    width: 140,
                    link: '/',
                    alt: 'BillionBiz',
                  },
                },
                {
                  id: 'fc-desc-1',
                  nodeType: 'text',
                  name: 'Brand Description',
                  visible: true,
                  props: {
                    text: 'The all-in-one commerce engine empowering fast-growing digital merchants worldwide.',
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: '',
                    alignment: 'left',
                  },
                },
                {
                  id: 'fc-social-1',
                  nodeType: 'social-links',
                  name: 'Social Links',
                  visible: true,
                  props: {
                    platforms: [
                      { platform: 'twitter', url: 'https://twitter.com', enabled: true },
                      { platform: 'instagram', url: 'https://instagram.com', enabled: true },
                      { platform: 'facebook', url: 'https://facebook.com', enabled: true },
                      { platform: 'linkedin', url: 'https://linkedin.com', enabled: true },
                    ],
                    iconSize: 20,
                    gap: 12,
                    variant: 'minimal',
                    alignment: 'left',
                  },
                },
              ],
              layout: {
                direction: 'vertical',
                width: { mode: 'fill' },
                height: { mode: 'fit' },
                mainAxisDistribution: 'start',
                crossAxisAlignment: 'start',
                gap: 18,
                padding: { top: 0, right: 0, bottom: 0, left: 0 },
              },
            },
            // Custom Column Links 1: Shop
            {
              id: 'fc-links-shop',
              nodeType: 'column-links',
              name: 'Shop',
              visible: true,
              props: {
                heading: 'Shop',
                headingLevel: 'h3',
                headingSize: 14,
                headingWeight: 700,
                headingColor: '',
                links: [
                  { label: 'All Products', href: '/collections/all', openInNewTab: false, badge: '' },
                  { label: 'New Arrivals', href: '/collections/new', openInNewTab: false, badge: 'New' },
                  { label: 'Best Sellers', href: '/collections/best-sellers', openInNewTab: false, badge: 'Hot' },
                  { label: 'Discount Deals', href: '/collections/sale', openInNewTab: false, badge: 'Sale' },
                ],
                fontSize: 14,
                gap: 10,
                color: '',
                hoverColor: '#2563eb',
                alignment: 'left',
                widthMode: 'fill',
              },
            },
            // Custom Column Links 2: Company
            {
              id: 'fc-links-company',
              nodeType: 'column-links',
              name: 'Company',
              visible: true,
              props: {
                heading: 'Company',
                headingLevel: 'h3',
                headingSize: 14,
                headingWeight: 700,
                headingColor: '',
                links: [
                  { label: 'About Us', href: '/about', openInNewTab: false, badge: '' },
                  { label: 'Our Story', href: '/story', openInNewTab: false, badge: '' },
                  { label: 'Careers', href: '/careers', openInNewTab: false, badge: 'Hiring' },
                  { label: 'Press & Media', href: '/press', openInNewTab: false, badge: '' },
                ],
                fontSize: 14,
                gap: 10,
                color: '',
                hoverColor: '#2563eb',
                alignment: 'left',
                widthMode: 'fill',
              },
            },
            // Custom Column Links 3: Customer Care
            {
              id: 'fc-links-support',
              nodeType: 'column-links',
              name: 'Customer Care',
              visible: true,
              props: {
                heading: 'Customer Care',
                headingLevel: 'h3',
                headingSize: 14,
                headingWeight: 700,
                headingColor: '',
                links: [
                  { label: 'Help Center', href: '/help', openInNewTab: false, badge: '' },
                  { label: 'Track Order', href: '/track-order', openInNewTab: false, badge: '' },
                  { label: 'Shipping Policy', href: '/policies/shipping', openInNewTab: false, badge: '' },
                  { label: 'Returns & Refunds', href: '/policies/refund', openInNewTab: false, badge: '' },
                ],
                fontSize: 14,
                gap: 10,
                color: '',
                hoverColor: '#2563eb',
                alignment: 'left',
                widthMode: 'fill',
              },
            },
            // Location Map & Newsletter column
            {
              id: 'fg-info-col',
              nodeType: 'group',
              name: 'Group',
              visible: true,
              children: [
                {
                  id: 'fc-map-location',
                  nodeType: 'map-preview',
                  name: 'Store Map',
                  visible: true,
                  props: {
                    title: 'Flagship Store',
                    location: '123 Commerce Way, New York, NY 10001',
                    zoom: 14,
                    mapType: 'roadmap',
                    height: 120,
                    widthMode: 'fill',
                    borderRadius: 8,
                    showPin: true,
                  },
                },
                {
                  id: 'fc-newsletter-1',
                  nodeType: 'newsletter',
                  name: 'Newsletter Signup',
                  visible: true,
                  props: {
                    heading: 'Stay in the loop',
                    description: 'Subscribe for exclusive deals and updates.',
                    placeholder: 'Enter your email...',
                    buttonText: 'Subscribe',
                    layout: 'vertical',
                    showConsent: true,
                    consentText: 'By subscribing you agree to our Privacy Policy.',
                    successMessage: '🎉 Thank you for subscribing!',
                  },
                },
              ],
              layout: {
                direction: 'vertical',
                width: { mode: 'fill' },
                height: { mode: 'fit' },
                mainAxisDistribution: 'start',
                crossAxisAlignment: 'start',
                gap: 16,
                padding: { top: 0, right: 0, bottom: 0, left: 0 },
              },
            },
          ],
          layout: {
            direction: 'horizontal',
            width: { mode: 'fill' },
            height: { mode: 'fit' },
            mainAxisDistribution: 'space-between',
            crossAxisAlignment: 'start',
            gap: 36,
            padding: { top: 0, right: 0, bottom: 0, left: 0 },
            wrap: true,
          },
          responsive: {
            mobile: {
              direction: 'vertical',
              gap: 32,
            },
          },
        },
        {
          id: 'fg-root-bottom',
          nodeType: 'group',
          name: 'Group',
          visible: true,
          children: [
            {
              id: 'fc-copyright-1',
              nodeType: 'copyright',
              name: 'Copyright',
              visible: true,
              props: {
                text: '© {year} BillionBiz. All rights reserved.',
                fontSize: 12,
                alignment: 'left',
                widthMode: 'fit',
              },
            },
            {
              id: 'fc-policy-links-1',
              nodeType: 'policy-links',
              name: 'Policy links',
              visible: true,
              props: {
                links: [
                  { label: 'Privacy Policy', href: '/policies/privacy-policy' },
                  { label: 'Terms of Service', href: '/policies/terms-of-service' },
                  { label: 'Refund Policy', href: '/policies/refund-policy' },
                  { label: 'Shipping Policy', href: '/policies/shipping-policy' },
                ],
                fontSize: 12,
                gap: 16,
                separator: '·',
                alignment: 'center',
                widthMode: 'fit',
              },
            },
            {
              id: 'fc-payment-1',
              nodeType: 'payment-icons',
              name: 'Payment Methods',
              visible: true,
              props: {
                methods: [
                  { id: 'visa', name: 'Visa', enabled: true },
                  { id: 'mastercard', name: 'Mastercard', enabled: true },
                  { id: 'amex', name: 'American Express', enabled: true },
                  { id: 'paypal', name: 'PayPal', enabled: true },
                  { id: 'apple-pay', name: 'Apple Pay', enabled: true },
                  { id: 'google-pay', name: 'Google Pay', enabled: true },
                ],
                size: 'small',
                gap: 8,
                alignment: 'right',
                widthMode: 'fit',
              },
            },
          ],
          layout: {
            direction: 'horizontal',
            width: { mode: 'fill' },
            height: { mode: 'fit' },
            mainAxisDistribution: 'space-between',
            crossAxisAlignment: 'center',
            gap: 16,
            padding: { top: 24, right: 0, bottom: 0, left: 0 },
          },
          styling: {
            bgType: 'inherit',
          },
          responsive: {
            mobile: {
              direction: 'vertical',
              gap: 16,
              mainAxisDistribution: 'center',
              crossAxisAlignment: 'center',
            },
          },
        },
      ],
      layout: {
        direction: 'vertical',
        width: { mode: 'fill' },
        height: { mode: 'fit' },
        mainAxisDistribution: 'start',
        crossAxisAlignment: 'stretch',
        gap: 36,
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
      },
    },
  ];
}
