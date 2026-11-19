import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
  Files, Store, Palette, Settings,
  Plus, Home, ShoppingBag, ShoppingCart,
  Search as SearchIcon, AlertTriangle, Cookie, Bell, FileText,
  Shield, Truck, RotateCcw, Phone, Heart,
  HelpCircle, Layout, PanelLeftClose, PanelLeftOpen,
  Building2, Lock, Layers,
  LayoutGrid, Tag, Gift, CheckCircle2, List, ChevronRight, ChevronDown, User,
  Mail, PlusCircle, Trash2, Copy, ArrowUp, ArrowDown, Eye, EyeOff, MoreVertical,
  GripVertical, Folder, FolderOpen, Image, Heading, AlignLeft, SquareCheck, Video,
  Star, Sparkles, MapPin, CreditCard, Link, PanelBottom, Headphones, PhoneCall, ListChecks,
  ShieldCheck, Share2, Smartphone, Globe, Package,
} from 'lucide-react';
import { BrandPanel } from './panels/BrandPanel';
import { DesignPanel } from './panels/DesignPanel';
import { SettingsPanel } from './panels/SettingsPanel';
import { ComponentTreePanel } from './engine/ComponentTreePanel';
import { FooterTreePanel } from './engine/FooterTreePanel';
import { PdpLeftRail } from './pdp/PdpLeftRail';
import { useEditorContextStore } from '../../store/editorContextStore';
import { scrollPreviewToHeaderSection } from './utils/previewScroll';

import { useLandingEditorStore } from '../../store/landingEditorStore';
import { useSiteStore, type SectionData } from '../../store/siteStore';
import { getPageConfig } from './pageConfigs';
import styles from '../../pages/editor/EditorLayout.module.css';
import type { EditorPanelType } from '../../store/landingEditorStore';
import { getEditorPath, resolveHeaderRowId } from './utils/editorNavigation';

// ─── Icon mapping for pages matching user specification ───
const pageIconMap: Record<string, React.FC<{ size?: number }>> = {
  'landing': Home,
  'landing-page': Home,
  'maintenance': AlertTriangle,
  'maintenance-page': AlertTriangle,
  'product-details': ShoppingBag,
  'product-details-page': ShoppingBag,
  'shop': LayoutGrid,
  'shop-page': LayoutGrid,
  'wishlist': Heart,
  'wishlist-page': Heart,
  'cart': ShoppingCart,
  'cart-page': ShoppingCart,
  'checkout': Tag,
  'checkout-page': Tag,
  'booking': FileText,
  'booking-page': FileText,
  'order-confirmation': CheckCircle2,
  'order-confirmation-page': CheckCircle2,
  'thank-you': Gift,
  'thank-you-page': Gift,
  'order-history': List,
  'order-history-page': List,
  'order-details': List,
  'order-details-page': List,
  'order-tracking': Truck,
  'order-tracking-page': Truck,
  'about': Building2,
  'about-page': Building2,
  'contact': Phone,
  'contact-page': Phone,
  'faq': HelpCircle,
  'faq-page': HelpCircle,
  'privacy': Shield,
  'privacy-page': Shield,
  'privacy-policy': Shield,
  'privacy-policy-page': Shield,
  'terms': Shield,
  'terms-page': Shield,
  'terms-conditions': FileText,
  'terms-conditions-page': FileText,
  'shipping-policy': Truck,
  'shipping-policy-page': Truck,
  'returns-refunds': RotateCcw,
  'returns-refunds-page': RotateCcw,
  'return-policy': RotateCcw,
  'return-policy-page': RotateCcw,
  'refund-policy': RotateCcw,
  'refund-policy-page': RotateCcw,
  'search': SearchIcon,
  'search-page': SearchIcon,
  'not-found': AlertTriangle,
  'not-found-page': AlertTriangle,
  'collections': Layout,
  'collections-page': Layout,
  'collection-details': Layout,
  'collection-details-page': Layout,
  'account': User,
  'account-page': User,
  'login': Lock,
  'login-page': Lock,
  'register': User,
  'register-page': User,
  'forgot-password': Lock,
  'forgot-password-page': Lock,
  'reset-password': Lock,
  'reset-password-page': Lock,
  'email-verification': Mail,
  'email-verification-page': Mail,
  'reviews': Heart,
  'reviews-page': Heart,
};

// ─── Top-Level Navigation Tabs (5-Tab Architecture) ───
interface TabDef {
  id: EditorPanelType;
  label: string;
  icon: React.FC<{ size?: number; className?: string }>;
}

const TABS: TabDef[] = [
  { id: 'pages', label: 'Pages', icon: Files },
  { id: 'brand', label: 'Brand', icon: Store },
  { id: 'design', label: 'Design', icon: Palette },
  { id: 'settings', label: 'Settings', icon: Settings },
];

// ─── Chrome component entries (Header, Footer, Toaster, Cookie / Consent) ───
interface ChromeComponentDef {
  id: string;
  label: string;
  icon: React.FC<{ size?: number }>;
  type: 'global';
  badge: string;
}

const CHROME_COMPONENTS: ChromeComponentDef[] = [
  { id: 'header-global', label: 'Header', icon: Layers, type: 'global', badge: 'All pages' },
  { id: 'footer-global', label: 'Footer', icon: Layers, type: 'global', badge: 'All pages' },
  { id: 'toaster-global', label: 'Toaster', icon: Bell, type: 'global', badge: 'All pages' },
  { id: 'cookie-consent-global', label: 'Cookie / Consent', icon: Cookie, type: 'global', badge: 'All pages' },
];

// ─── Section icon mapping for outer block rows ───
const SECTION_ICON_MAP: Record<string, React.FC<{ size?: number; className?: string; style?: React.CSSProperties }>> = {
  // Navigation / Header / Footer
  AnnouncementBar: Sparkles,
  UtilityBar: Headphones,
  Header: Layout,
  CategoryBar: Layers,
  FooterTrust: ShieldCheck,
  FooterNewsletter: Mail,
  FooterMain: Folder,
  FooterSocial: Share2,
  FooterBottom: PanelBottom,
  FooterApp: Smartphone,
  FooterContact: PhoneCall,
  FooterPayment: CreditCard,
  FooterSeo: Globe,
  FooterCategoryLinks: Link,
  FooterMenu: List,
  FooterText: AlignLeft,
  Footer: Folder,
  // Content Sections
  HeroBanner: Image,
  HeroCarousel: Layers,
  FeaturedCollection: ShoppingBag,
  CategoryList: LayoutGrid,
  ImageWithText: Image,
  RichText: AlignLeft,
  Newsletter: Mail,
  Testimonials: Star,
  LogoList: Sparkles,
  Video: Video,
  FAQ: HelpCircle,
  ContactForm: Mail,
  BlogPosts: FileText,
  Gallery: Image,
  Map: MapPin,
  PricingTable: CreditCard,
  PageHeader: Heading,
  ProductListing: ShoppingBag,
  ProductDetails: ShoppingBag,
  ProductRecommendations: Sparkles,
  CartItems: ShoppingCart,
  CartSummary: CreditCard,
  CheckoutContent: Tag,
  CollectionGrid: LayoutGrid,
  CollectionHero: Image,
  LoginForm: Lock,
  RegisterForm: User,
  OrderList: List,
  OrderInfo: FileText,
  OrderItems: Package,
};

export interface SectionInnerBlock {
  id: string;
  label: string;
  subLabel?: string;
  icon: React.FC<{ size?: number; className?: string; style?: React.CSSProperties }>;
  listKey?: string;
  itemIndex?: number;
  fieldKey?: string;
  canDelete?: boolean;
  canDuplicate?: boolean;
}

function getSectionInnerBlocks(section: SectionData): SectionInnerBlock[] {
  const blocks: SectionInnerBlock[] = [];
  const p = section.props || {};

  switch (section.type) {
    case 'FAQ': {
      const items = Array.isArray(p.items) ? p.items : [];
      items.forEach((item: any, idx: number) => {
        blocks.push({
          id: `${section.id}-faq-${idx}`,
          label: item.question ? (item.question.length > 32 ? `${item.question.slice(0, 32)}...` : item.question) : `Question ${idx + 1}`,
          icon: HelpCircle,
          listKey: 'items',
          itemIndex: idx,
          canDelete: true,
          canDuplicate: true,
        });
      });
      break;
    }
    case 'Testimonials': {
      const testimonials = Array.isArray(p.testimonials) ? p.testimonials : [];
      testimonials.forEach((item: any, idx: number) => {
        blocks.push({
          id: `${section.id}-testi-${idx}`,
          label: item.name || `Reviewer ${idx + 1}`,
          subLabel: item.role || (item.quote ? item.quote.slice(0, 24) : undefined),
          icon: Star,
          listKey: 'testimonials',
          itemIndex: idx,
          canDelete: true,
          canDuplicate: true,
        });
      });
      break;
    }
    case 'LogoList': {
      const logos = Array.isArray(p.logos) ? p.logos : [];
      logos.forEach((item: any, idx: number) => {
        blocks.push({
          id: `${section.id}-logo-${idx}`,
          label: item.name || `Brand ${idx + 1}`,
          icon: Sparkles,
          listKey: 'logos',
          itemIndex: idx,
          canDelete: true,
          canDuplicate: true,
        });
      });
      break;
    }
    case 'FeaturedCollection': {
      if (p.heading) {
        blocks.push({
          id: `${section.id}-heading`,
          label: `Heading: ${p.heading}`,
          icon: Heading,
          fieldKey: 'heading',
        });
      }
      const products = Array.isArray(p.products) ? p.products : [];
      products.forEach((prod: any, idx: number) => {
        blocks.push({
          id: `${section.id}-prod-${idx}`,
          label: prod.name || `Product ${idx + 1}`,
          subLabel: prod.price,
          icon: ShoppingBag,
          listKey: 'products',
          itemIndex: idx,
          canDelete: true,
          canDuplicate: true,
        });
      });
      if (p.linkText) {
        blocks.push({
          id: `${section.id}-link`,
          label: `Link: ${p.linkText}`,
          icon: Link,
          fieldKey: 'linkText',
        });
      }
      break;
    }
    case 'CategoryList': {
      const categories = Array.isArray(p.categories) ? p.categories : [];
      categories.forEach((cat: any, idx: number) => {
        blocks.push({
          id: `${section.id}-cat-${idx}`,
          label: cat.name || `Category ${idx + 1}`,
          icon: LayoutGrid,
          listKey: 'categories',
          itemIndex: idx,
          canDelete: true,
          canDuplicate: true,
        });
      });
      break;
    }
    case 'HeroCarousel': {
      const slides = Array.isArray(p.slides) ? p.slides : [];
      slides.forEach((slide: any, idx: number) => {
        blocks.push({
          id: `${section.id}-slide-${idx}`,
          label: slide.heading || `Slide ${idx + 1}`,
          subLabel: slide.buttonText,
          icon: Image,
          listKey: 'slides',
          itemIndex: idx,
          canDelete: true,
          canDuplicate: true,
        });
      });
      break;
    }
    case 'Gallery': {
      const images = Array.isArray(p.images) ? p.images : [];
      images.forEach((img: any, idx: number) => {
        blocks.push({
          id: `${section.id}-img-${idx}`,
          label: img.caption || `Image ${idx + 1}`,
          icon: Image,
          listKey: 'images',
          itemIndex: idx,
          canDelete: true,
          canDuplicate: true,
        });
      });
      break;
    }
    case 'BlogPosts': {
      const posts = Array.isArray(p.posts) ? p.posts : [];
      posts.forEach((post: any, idx: number) => {
        blocks.push({
          id: `${section.id}-post-${idx}`,
          label: post.title ? (post.title.length > 28 ? `${post.title.slice(0, 28)}...` : post.title) : `Post ${idx + 1}`,
          icon: FileText,
          listKey: 'posts',
          itemIndex: idx,
          canDelete: true,
          canDuplicate: true,
        });
      });
      break;
    }
    case 'PricingTable': {
      const plans = Array.isArray(p.plans) ? p.plans : [];
      plans.forEach((plan: any, idx: number) => {
        blocks.push({
          id: `${section.id}-plan-${idx}`,
          label: plan.name || `Tier ${idx + 1}`,
          subLabel: plan.price,
          icon: CreditCard,
          listKey: 'plans',
          itemIndex: idx,
          canDelete: true,
          canDuplicate: true,
        });
      });
      break;
    }
    case 'HeroBanner': {
      if (p.badge) {
        blocks.push({ id: `${section.id}-badge`, label: `Badge: ${p.badge}`, icon: Sparkles, fieldKey: 'badge' });
      }
      blocks.push({
        id: `${section.id}-heading`,
        label: p.heading ? (p.heading.length > 28 ? `Heading: ${p.heading.slice(0, 28)}...` : `Heading: ${p.heading}`) : 'Heading',
        icon: Heading,
        fieldKey: 'heading',
      });
      if (p.description) {
        blocks.push({
          id: `${section.id}-desc`,
          label: `Text: ${p.description.slice(0, 26)}...`,
          icon: AlignLeft,
          fieldKey: 'description',
        });
      }
      if (p.primaryBtn) {
        blocks.push({ id: `${section.id}-pbtn`, label: `Button: ${p.primaryBtn}`, icon: SquareCheck, fieldKey: 'primaryBtn' });
      }
      if (p.secondaryBtn) {
        blocks.push({ id: `${section.id}-sbtn`, label: `Button: ${p.secondaryBtn}`, icon: SquareCheck, fieldKey: 'secondaryBtn' });
      }
      if (p.image) {
        blocks.push({ id: `${section.id}-media`, label: 'Hero Image', icon: Image, fieldKey: 'image' });
      }
      break;
    }
    case 'ImageWithText': {
      if (p.image) {
        blocks.push({ id: `${section.id}-media`, label: 'Section Image', icon: Image, fieldKey: 'image' });
      }
      blocks.push({
        id: `${section.id}-heading`,
        label: p.heading ? (p.heading.length > 28 ? `Heading: ${p.heading.slice(0, 28)}...` : `Heading: ${p.heading}`) : 'Heading',
        icon: Heading,
        fieldKey: 'heading',
      });
      if (p.body) {
        blocks.push({ id: `${section.id}-body`, label: `Text: ${p.body.slice(0, 26)}...`, icon: AlignLeft, fieldKey: 'body' });
      }
      if (p.buttonText) {
        blocks.push({ id: `${section.id}-btn`, label: `Button: ${p.buttonText}`, icon: SquareCheck, fieldKey: 'buttonText' });
      }
      break;
    }
    case 'RichText': {
      if (p.heading) {
        blocks.push({ id: `${section.id}-heading`, label: `Heading: ${p.heading}`, icon: Heading, fieldKey: 'heading' });
      }
      if (p.body) {
        blocks.push({ id: `${section.id}-body`, label: `Body: ${p.body.slice(0, 28)}...`, icon: AlignLeft, fieldKey: 'body' });
      }
      break;
    }
    case 'Newsletter': {
      blocks.push({ id: `${section.id}-heading`, label: p.heading ? `Heading: ${p.heading}` : 'Heading', icon: Heading, fieldKey: 'heading' });
      if (p.description) {
        blocks.push({ id: `${section.id}-desc`, label: `Text: ${p.description.slice(0, 26)}...`, icon: AlignLeft, fieldKey: 'description' });
      }
      blocks.push({ id: `${section.id}-btn`, label: p.buttonText ? `Subscribe Button: ${p.buttonText}` : 'Subscribe Form', icon: Mail, fieldKey: 'buttonText' });
      break;
    }
    case 'ContactForm': {
      blocks.push({ id: `${section.id}-heading`, label: p.heading ? `Heading: ${p.heading}` : 'Contact Heading', icon: Heading, fieldKey: 'heading' });
      blocks.push({ id: `${section.id}-fields`, label: 'Form Input Fields', icon: ListChecks, fieldKey: 'fields' });
      blocks.push({ id: `${section.id}-btn`, label: p.buttonText ? `Submit: ${p.buttonText}` : 'Send Button', icon: SquareCheck, fieldKey: 'buttonText' });
      break;
    }
    case 'Video': {
      if (p.heading) {
        blocks.push({ id: `${section.id}-heading`, label: `Heading: ${p.heading}`, icon: Heading, fieldKey: 'heading' });
      }
      blocks.push({ id: `${section.id}-media`, label: 'Video Player', icon: Video, fieldKey: 'videoUrl' });
      break;
    }
    case 'Map': {
      blocks.push({ id: `${section.id}-map`, label: 'Map Location', icon: MapPin, fieldKey: 'map' });
      if (p.address) {
        blocks.push({ id: `${section.id}-addr`, label: `Address: ${p.address}`, icon: MapPin, fieldKey: 'address' });
      }
      break;
    }
    default: {
      if (p.heading || p.title) {
        blocks.push({ id: `${section.id}-heading`, label: `Heading: ${p.heading || p.title}`, icon: Heading, fieldKey: 'heading' });
      }
      if (p.description || p.body || p.subheading) {
        blocks.push({ id: `${section.id}-text`, label: `Text: ${(p.description || p.body || p.subheading).slice(0, 26)}...`, icon: AlignLeft, fieldKey: 'description' });
      }
      if (p.buttonText || p.ctaText) {
        blocks.push({ id: `${section.id}-btn`, label: `Button: ${p.buttonText || p.ctaText}`, icon: SquareCheck, fieldKey: 'buttonText' });
      }
      if (p.image || p.imageUrl) {
        blocks.push({ id: `${section.id}-img`, label: 'Image', icon: Image, fieldKey: 'image' });
      }
      break;
    }
  }

  return blocks;
}

// ─── INSERT DIVIDER BETWEEN PAGE SECTIONS ─────────────────────
interface PageInsertDividerProps {
  targetIndex: number;
  onDropSection: (draggedId: string, targetIndex: number) => void;
  onInsertClick: (targetIndex: number) => void;
}

const PageInsertDivider: React.FC<PageInsertDividerProps> = ({ targetIndex, onDropSection, onInsertClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const isActive = isHovered || isDragOver;

  useEffect(() => {
    const handleDragEnd = () => setIsDragOver(false);
    window.addEventListener('dragend', handleDragEnd);
    return () => window.removeEventListener('dragend', handleDragEnd);
  }, []);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'move';
        const draggedId = (window as any).__bb_dragged_page_section_id;
        if (draggedId) {
          setIsDragOver(true);
        }
      }}
      onDragLeave={(e) => {
        e.stopPropagation();
        setIsDragOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        const draggedId = (window as any).__bb_dragged_page_section_id;
        if (draggedId) {
          onDropSection(draggedId, targetIndex);
        }
      }}
      onClick={(e) => {
        e.stopPropagation();
        onInsertClick(targetIndex);
      }}
      style={{
        height: isActive ? '18px' : '8px',
        margin: isActive ? '-5px 0' : '-2px 0',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '8px',
        paddingRight: '8px',
        cursor: isDragOver ? 'copy' : 'pointer',
        zIndex: 25,
        transition: 'all 0.12s ease',
      }}
      title={isDragOver ? 'Drop to place here' : 'Insert section here'}
    >
      <div
        style={{
          width: '100%',
          height: isActive ? (isDragOver ? '3px' : '2px') : '0px',
          backgroundColor: isActive ? '#2563eb' : 'transparent',
          borderRadius: isDragOver ? '2px' : '0px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.12s ease',
        }}
      >
        {isDragOver ? (
          <div
            style={{
              position: 'absolute',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              borderRadius: '9999px',
              padding: '2px 8px',
              fontSize: '10px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 2px 6px rgba(37, 99, 235, 0.45)',
              transform: 'scale(0.95)',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            <Plus size={10} />
            <span>Drop here</span>
          </div>
        ) : isHovered ? (
          <div
            style={{
              position: 'absolute',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              borderRadius: '9999px',
              padding: '2px 8px',
              fontSize: '10px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 2px 4px rgba(37, 99, 235, 0.35)',
              transform: 'scale(0.95)',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            <Plus size={10} />
            <span>Insert</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

// ─── TREE NODE ROW FOR PAGE SECTIONS (MATCHES FOOTER & PDP ARCHITECTURE) ───
interface PageTreeNodeRowProps {
  section: SectionData;
  index: number;
  totalCount: number;
  isSelected: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onSelect: () => void;
  onToggleVisibility: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onAddBlock: () => void;
  onDropSection: (draggedId: string, targetIndex: number) => void;
  innerBlocks: SectionInnerBlock[];
  onDeleteInnerItem: (listKey: string, itemIndex: number) => void;
  onDuplicateInnerItem: (listKey: string, itemIndex: number) => void;
  onSelectInnerBlock: (block: SectionInnerBlock) => void;
}

const PageTreeNodeRow: React.FC<PageTreeNodeRowProps> = ({
  section,
  index,
  totalCount,
  isSelected,
  isExpanded,
  onToggleExpand,
  onSelect,
  onToggleVisibility,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onAddBlock,
  onDropSection,
  innerBlocks,
  onDeleteInnerItem,
  onDuplicateInnerItem,
  onSelectInnerBlock,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dropPosition, setDropPosition] = useState<'before' | 'after' | null>(null);
  const [hoveredInnerId, setHoveredInnerId] = useState<string | null>(null);

  const rowRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [menuOpen]);

  const isFolderType = section.type === 'Header' || section.type === 'Footer' || section.type === 'FooterMain';
  const IconComp = isFolderType ? (isExpanded ? FolderOpen : Folder) : (SECTION_ICON_MAP[section.type] || Layout);

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.setData('text/plain', section.id);
    (window as any).__bb_dragged_page_section_id = section.id;
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.stopPropagation();
    (window as any).__bb_dragged_page_section_id = null;
    setIsDragging(false);
    setDropPosition(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    const draggedId = (window as any).__bb_dragged_page_section_id;
    if (!draggedId || draggedId === section.id) return;

    if (rowRef.current) {
      const rect = rowRef.current.getBoundingClientRect();
      const offsetY = e.clientY - rect.top;
      if (offsetY < rect.height * 0.5) {
        setDropPosition('before');
      } else {
        setDropPosition('after');
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const draggedId = (window as any).__bb_dragged_page_section_id;
    const targetPos = dropPosition;
    setDropPosition(null);

    if (!draggedId || draggedId === section.id) return;
    const targetIdx = targetPos === 'after' ? index + 1 : index;
    onDropSection(draggedId, targetIdx);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', boxSizing: 'border-box' }}>
      <div
        ref={rowRef}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={() => setDropPosition(null)}
        onDrop={handleDrop}
        onClick={onSelect}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          backgroundColor: isSelected ? '#eff6ff' : isHovered ? '#f8fafc' : 'transparent',
          borderLeft: isSelected ? '3px solid #2563eb' : '3px solid transparent',
          borderTop: dropPosition === 'before' ? '2px solid #2563eb' : 'none',
          borderBottom: dropPosition === 'after' ? '2px solid #2563eb' : 'none',
          borderRadius: '6px',
          cursor: isDragging ? 'grabbing' : 'grab',
          opacity: isDragging ? 0.35 : (section.isHidden ? 0.55 : 1),
          position: 'relative',
          transition: 'all 0.12s ease',
          userSelect: 'none',
          minHeight: '40px',
        }}
      >
        {/* 1. Chevron for expanding inner blocks */}
        <button
          type="button"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand();
          }}
          style={{
            width: '18px',
            height: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            background: 'none',
            padding: 0,
            cursor: 'pointer',
            color: '#64748b',
            flexShrink: 0,
          }}
          title={isExpanded ? 'Collapse blocks' : 'Expand blocks'}
        >
          {isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
        </button>

        {/* 2. Section Icon / Drag grip on hover */}
        <div
          style={{
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isSelected ? '#2563eb' : isHovered ? '#2563eb' : '#64748b',
            flexShrink: 0,
            pointerEvents: 'none',
            transition: 'color 0.12s ease',
          }}
          title={isHovered ? 'Drag to reorder' : section.name}
        >
          {isHovered ? <GripVertical size={16} /> : <IconComp size={16} />}
        </div>

        {/* 3. Section Name */}
        <span
          style={{
            flex: 1,
            minWidth: 0,
            fontSize: '14px',
            fontWeight: isSelected ? 600 : 500,
            color: isSelected ? '#1d4ed8' : '#0f172a',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            pointerEvents: 'none',
          }}
          title={section.name}
        >
          {section.name}
        </span>

        {/* 4. Rightside actions on hover */}
        {(isHovered || menuOpen) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              flexShrink: 0,
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Quick Add block inside button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddBlock();
              }}
              title="Add block inside"
              style={{
                padding: '4px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: 'transparent',
                color: '#2563eb',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#eff6ff')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Plus size={14} />
            </button>

            {/* Visibility Toggle */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility();
              }}
              title={section.isHidden ? 'Show section' : 'Hide section'}
              style={{
                padding: '4px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: 'transparent',
                color: section.isHidden ? '#94a3b8' : '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {section.isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>

            {/* Delete button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              title="Delete section"
              style={{
                padding: '4px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: 'transparent',
                color: '#ef4444',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fee2e2')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Trash2 size={14} />
            </button>

            {/* 3-Dot More options */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
                title="More actions"
                style={{
                  padding: '4px',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: menuOpen ? '#e2e8f0' : 'transparent',
                  color: '#64748b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
                onMouseLeave={(e) => !menuOpen && (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <MoreVertical size={14} />
              </button>

              {menuOpen && (
                <div
                  ref={menuRef}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '4px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
                    zIndex: 50,
                    width: '160px',
                    padding: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onAddBlock();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 8px',
                      border: 'none',
                      borderRadius: '4px',
                      backgroundColor: 'transparent',
                      color: '#1e293b',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <Plus size={13} color="#2563eb" />
                    <span>Add Block Inside</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onDuplicate();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 8px',
                      border: 'none',
                      borderRadius: '4px',
                      backgroundColor: 'transparent',
                      color: '#1e293b',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <Copy size={13} color="#64748b" />
                    <span>Duplicate</span>
                  </button>

                  {index > 0 && onMoveUp && (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onMoveUp();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 8px',
                        border: 'none',
                        borderRadius: '4px',
                        backgroundColor: 'transparent',
                        color: '#1e293b',
                        fontSize: '12px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <ArrowUp size={13} color="#64748b" />
                      <span>Move Up</span>
                    </button>
                  )}

                  {index < totalCount - 1 && onMoveDown && (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onMoveDown();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 8px',
                        border: 'none',
                        borderRadius: '4px',
                        backgroundColor: 'transparent',
                        color: '#1e293b',
                        fontSize: '12px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <ArrowDown size={13} color="#64748b" />
                      <span>Move Down</span>
                    </button>
                  )}

                  <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '2px 0' }} />

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 8px',
                      border: 'none',
                      borderRadius: '4px',
                      backgroundColor: 'transparent',
                      color: '#ef4444',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fee2e2')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <Trash2 size={13} color="#ef4444" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Render Inner Blocks if Expanded */}
      {isExpanded && (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', boxSizing: 'border-box' }}>
          {innerBlocks.map((ib) => {
            const IbIcon = ib.icon;
            return (
              <div
                key={ib.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectInnerBlock(ib);
                }}
                onMouseEnter={() => setHoveredInnerId(ib.id)}
                onMouseLeave={() => setHoveredInnerId(null)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 12px',
                  paddingLeft: '28px',
                  backgroundColor: hoveredInnerId === ib.id ? '#f1f5f9' : 'transparent',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  minHeight: '36px',
                  transition: 'background-color 0.12s ease',
                }}
              >
                <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexShrink: 0 }}>
                  <IbIcon size={15} />
                </div>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: 500, color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={ib.label}>
                    {ib.label}
                  </span>
                  {ib.subLabel && (
                    <span style={{ fontSize: '12px', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ib.subLabel}
                    </span>
                  )}
                </div>

                {/* Quick actions for inner items (delete, duplicate) */}
                {ib.canDelete && hoveredInnerId === ib.id && ib.listKey && ib.itemIndex !== undefined && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }} onClick={(e) => e.stopPropagation()}>
                    {ib.canDuplicate && (
                      <button
                        type="button"
                        onClick={() => onDuplicateInnerItem(ib.listKey!, ib.itemIndex!)}
                        title="Duplicate item"
                        style={{
                          padding: '3px', border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', borderRadius: '3px', display: 'flex', alignItems: 'center',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#2563eb'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
                      >
                        <Copy size={13} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onDeleteInnerItem(ib.listKey!, ib.itemIndex!)}
                      title="Delete item"
                      style={{
                        padding: '3px', border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', borderRadius: '3px', display: 'flex', alignItems: 'center',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#dc2626'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#ef4444'}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* Indented (+) Add block button matching screenshot */}
          <div style={{ paddingLeft: '28px', paddingTop: '4px', paddingBottom: '4px', width: '100%', boxSizing: 'border-box' }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddBlock();
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 10px',
                minHeight: '34px',
                border: 'none',
                borderRadius: '6px',
                background: 'transparent',
                color: '#2563eb',
                fontSize: '13.5px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background-color 0.12s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#eff6ff')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <PlusCircle size={16} color="#2563eb" />
              <span>Add block</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const EditorLeftSidebar: React.FC = () => {
  const navigate = useNavigate();
  const {
    activePanel, setActivePanel,
    selectedSectionId, setSelectedSectionId,
    setAddSectionWidgetOpen, selectedPageId,
    isLeftSidebarCollapsed, setLeftSidebarCollapsed,
    pagesNavLevel, navigateToPage,
    isRightSidebarOpen, setRightSidebarOpen,
  } = useLandingEditorStore();
  const { pages, toggleSectionVisibility, removeSection, updatePageProps, updateSectionProps, duplicateSection } = useSiteStore();
  const activePage = pages.find(p => p.id === selectedPageId) || pages[0];

  const headerBarTypes = ['AnnouncementBar', 'UtilityBar'];
  const footerBarTypes = ['FooterTrust', 'FooterNewsletter', 'FooterSocial', 'FooterBottom', 'FooterMenu', 'FooterText'];
  const isFooterMain = (t?: string) => t === 'Footer' || t === 'FooterMain';

  // Scroll retention for pages list
  const pagesListScrollRef = useRef<HTMLDivElement>(null);
  const pagesListScrollTopRef = useRef<number>(0);

  useEffect(() => {
    if (pagesNavLevel === 'list' && pagesListScrollRef.current) {
      pagesListScrollRef.current.scrollTop = pagesListScrollTopRef.current;
    }
  }, [pagesNavLevel]);

  // Synchronize master context store editorType with active global view
  useEffect(() => {
    if (selectedPageId === 'header-global') {
      const context = useEditorContextStore.getState();
      context.setEditorType('header');
      const target = context.selectedTarget;
      const isHeaderTarget =
        (target.type === 'row' || target.type === 'element') &&
        target.editorType === 'header' &&
        Boolean(target.rowId);

      if (!isHeaderTarget) {
        const landingStore = useLandingEditorStore.getState();
        const currentSectionId = landingStore.selectedSectionId;
        const isKnownHeaderSection =
          Boolean(currentSectionId) &&
          (['header-main', 'announcement-bar', 'utility-bar', 'category-bar', 'secondary-nav'].includes(currentSectionId!) ||
           currentSectionId!.startsWith('row-') ||
           currentSectionId!.startsWith('header-'));

        const targetRowId = resolveHeaderRowId(isKnownHeaderSection ? currentSectionId : null, context.headerRows);
        context.selectTarget({ type: 'row', editorType: 'header', rowId: targetRowId });
        if (!isKnownHeaderSection) {
          setSelectedSectionId('header-main');
        }
      }
    } else if (selectedPageId === 'footer-global') {
      const context = useEditorContextStore.getState();
      context.setEditorType('footer');
      context.selectTarget({ type: 'none' });
    } else {
      const context = useEditorContextStore.getState();
      context.setEditorType('page');
      if (context.selectedTarget.type !== 'none') {
        context.selectTarget({ type: 'none' });
      }
    }
  }, [selectedPageId]);

  // Cleanup duplicate locked sections
  useEffect(() => {
    if (activePage && activePage.sections) {
      const seen = new Set<string>();
      const deduplicated = activePage.sections.filter(s => {
        if (s.type === 'Header' || s.type === 'Footer') {
          if (seen.has(s.type)) return false;
          seen.add(s.type);
        }
        return true;
      });

      const headerBars = deduplicated.filter(s => headerBarTypes.includes(s.type));
      const header = deduplicated.find(s => s.type === 'Header');
      const templateSections = deduplicated.filter(
        s => !headerBarTypes.includes(s.type) &&
          s.type !== 'Header' &&
          !footerBarTypes.includes(s.type) &&
          !isFooterMain(s.type)
      );
      const footerBars = deduplicated.filter(s => footerBarTypes.includes(s.type));
      const footer = deduplicated.find(s => isFooterMain(s.type));

      const canonical = [
        ...headerBars,
        ...(header ? [header] : []),
        ...templateSections,
        ...footerBars,
        ...(footer ? [footer] : []),
      ];

      const isChanged =
        canonical.length !== activePage.sections.length ||
        canonical.some((s, i) => s.id !== activePage.sections[i]?.id);

      if (isChanged) {
        updatePageProps(activePage.id, { sections: canonical });
      }
    }
  }, [activePage?.id, activePage?.sections, updatePageProps]);

  const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [expandedSectionIds, setExpandedSectionIds] = useState<string[]>([]);

  // Auto-expand template sections on page change so inner blocks are visible
  useEffect(() => {
    if (activePage && activePage.sections) {
      const templateSecIds = activePage.sections
        .filter(s => !headerBarTypes.includes(s.type) && s.type !== 'Header' && !footerBarTypes.includes(s.type) && !isFooterMain(s.type))
        .map(s => s.id);
      setExpandedSectionIds(prev => Array.from(new Set([...prev, ...templateSecIds])));
    }
  }, [activePage?.id]);

  // Search state in Pages tab
  const [pageSearch, setPageSearch] = useState('');

  const moveTemplateSection = (sectionId: string, direction: 'up' | 'down') => {
    if (!activePage) return;
    const currentTemplate = activePage.sections.filter(
      s => !headerBarTypes.includes(s.type) && s.type !== 'Header' && !footerBarTypes.includes(s.type) && !isFooterMain(s.type)
    );
    const idx = currentTemplate.findIndex(s => s.id === sectionId);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= currentTemplate.length) return;

    const reordered = [...currentTemplate];
    const [removed] = reordered.splice(idx, 1);
    reordered.splice(targetIdx, 0, removed);

    const headers = activePage.sections.filter(s => headerBarTypes.includes(s.type) || s.type === 'Header');
    const footers = activePage.sections.filter(s => footerBarTypes.includes(s.type) || isFooterMain(s.type));
    updatePageProps(activePage.id, { sections: [...headers, ...reordered, ...footers] });
  };

  // ─── TAB CLICK HANDLER ───
  const handleTabClick = (tabId: EditorPanelType) => {
    setActivePanel(tabId);
    const routeMap: Record<string, string> = {
      'pages': '/editor/pages',
      'brand': '/editor/brand',
      'design': '/editor/design',
      'settings': '/editor/settings',
      'store-brand': '/editor/brand',
      'design-experience': '/editor/design',
      'seo-growth': '/editor/brand',
    };
    navigate(routeMap[tabId] || '/editor/pages');
  };

  // ─────────────────────────────────────────────────────
  // RENDER: CONTEXTUAL CONTENT FOR EACH OF THE 4 TABS
  // ─────────────────────────────────────────────────────

  const renderContextualPanel = () => {
    switch (activePanel) {
      case 'pages':
        return renderPagesPanel();
      case 'design':
      case 'design-experience':
        return <DesignPanel />;
      case 'brand':
      case 'store-brand':
      case 'seo-growth':
        return <BrandPanel />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return renderPagesPanel();
    }
  };

  const renderEditorDetailHeader = (title: string, description?: string) => (
    <div
      className={styles.contextPanelHeader}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}
    >
      <div style={{ minWidth: 0, flex: 1 }}>
        <h3 className={styles.contextPanelTitle} style={{ fontSize: '14px', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {title}
        </h3>
        {description && <p className={styles.contextPanelDesc} style={{ margin: '2px 0 0' }}>{description}</p>}
      </div>
      <button
        onClick={() => setLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
        className={styles.collapseBtn}
        title={isLeftSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        type="button"
      >
        {isLeftSidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
      </button>
    </div>
  );

  // ─── TAB 1: PAGES PANEL ───
  const renderPagesPanel = () => {
    if (pagesNavLevel === 'page-detail') {
      if (selectedPageId === 'header-global') {
        return (
          <div className={styles.contextPanelInner} style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', width: '100%' }}>
            {renderEditorDetailHeader(
              'Header Editor',
              'Universal Storefront Header'
            )}
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', width: '100%', overflowX: 'hidden' }}>
              <ComponentTreePanel editorType="header" />
            </div>
          </div>
        );
      }
      if (selectedPageId === 'footer-global') {
        return (
          <div className={styles.contextPanelInner} style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', width: '100%' }}>
            {renderEditorDetailHeader(
              'Footer Editor',
              'Universal Storefront Footer'
            )}
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', width: '100%', overflowX: 'hidden' }}>
              <FooterTreePanel />
            </div>
          </div>
        );
      }
      if (selectedPageId === 'product-details-page') {
        return (
          <div className={styles.contextPanelInner} style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', width: '100%' }}>
            {renderEditorDetailHeader(
              'Product Detail Page Builder',
              'Universal PDP Template & Block Editor'
            )}
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', width: '100%', overflowX: 'hidden' }}>
              <PdpLeftRail />
            </div>
          </div>
        );
      }
      if (selectedPageId === 'cookie-consent-global') return renderCookieConsentDetailView();
      if (selectedPageId === 'toaster-global') return renderToasterDetailView();
      return renderPageDetailView();
    }
    return renderPageListView();
  };

  const renderPageListView = () => {
    const filterFn = (p: typeof pages[0]) => {
      if (!pageSearch.trim()) return true;
      const q = pageSearch.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.path.toLowerCase().includes(q);
    };

    const getOrderedPages = (pageIds: string[]) => {
      return pageIds
        .map(id => pages.find(p => p.id === id || p.type === id))
        .filter((p): p is typeof pages[0] => Boolean(p && filterFn(p)));
    };

    // 1. HOME 2 (Landing page, Maintenance)
    const homePages = getOrderedPages(['landing-page', 'maintenance-page']);

    // 2. BROWSE 3 (Product Detail, Product Listing, Wishlist)
    const browsePages = getOrderedPages(['product-details-page', 'shop-page', 'wishlist-page']);

    // 3. BUY 3 (Cart, Checkout, Booking)
    const buyPages = getOrderedPages(['cart-page', 'checkout-page', 'booking-page']);

    // 4. COMPLETE 5 (Order Confirmation, Thank You, Order Listing, Order Detail, Order Tracking)
    const completePages = getOrderedPages([
      'order-confirmation-page',
      'thank-you-page',
      'order-history-page',
      'order-details-page',
      'order-tracking-page'
    ]);

    // 5. ACCOUNT 5 (Login, Sign Up, Forgot Password, Email Verification, Profile)
    const accountPages = getOrderedPages([
      'login-page',
      'register-page',
      'forgot-password-page',
      'email-verification-page',
      'account-page'
    ]);

    // 6. CONTENT 3 (About Us, Contact Us, 404 / Not Found)
    const contentPages = getOrderedPages(['about-page', 'contact-page', 'not-found-page']);

    // 7. CHROME 4 (Header, Footer, Toaster, Cookie / Consent)
    const chromeComponentsFiltered = CHROME_COMPONENTS.filter(gc =>
      !pageSearch.trim() ||
      gc.label.toLowerCase().includes(pageSearch.toLowerCase()) ||
      gc.badge.toLowerCase().includes(pageSearch.toLowerCase())
    );

    // 8. LEGAL 4 (Privacy Policy, Terms & Conditions, Refund Policy, Shipping Policy)
    const legalPages = [
      pages.find(p => ['privacy-policy-page', 'privacy-page'].includes(p.id)),
      pages.find(p => ['terms-conditions-page', 'terms-page'].includes(p.id)),
      pages.find(p => ['return-policy-page', 'returns-refunds-page', 'refund-policy-page'].includes(p.id)),
      pages.find(p => ['shipping-policy-page', 'shipping-page'].includes(p.id)),
    ].filter((p): p is typeof pages[0] => Boolean(p && filterFn(p)));

    return (
      <div className={styles.contextPanelInner}>
        <div className={styles.contextPanelHeader}>
          <div>
            <h3 className={styles.contextPanelTitle}>Pages &amp; Layout</h3>
            <p className={styles.contextPanelDesc}>All editable storefront pages &amp; templates</p>
          </div>
          <button
            onClick={() => setLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
            className={styles.collapseBtn}
            title={isLeftSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isLeftSidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>

        {/* Quick Search */}
        <div className={styles.pageSearchContainer}>
          <div className={styles.pageSearchWrapper}>
            <SearchIcon size={14} className={styles.pageSearchIcon} />
            <input
              type="text"
              placeholder="Search pages..."
              value={pageSearch}
              onChange={(e) => setPageSearch(e.target.value)}
              className={styles.pageSearchInput}
            />
          </div>
        </div>

        <div
          ref={pagesListScrollRef}
          className={styles.contextPanelScroll}
          onScroll={(e) => {
            pagesListScrollTopRef.current = e.currentTarget.scrollTop;
          }}
        >
          {/* Group 1: HOME */}
          {homePages.length > 0 && (
            <div className={styles.navGroup} style={{ marginBottom: '14px' }}>
              <div className={styles.referenceGroupHeader}>
                <span>HOME</span>
                <span className={styles.referenceGroupCount}>{homePages.length}</span>
              </div>
              {homePages.map(page => renderPageListItem(page))}
            </div>
          )}

          {/* Group 2: BROWSE */}
          {browsePages.length > 0 && (
            <div className={styles.navGroup} style={{ marginBottom: '14px' }}>
              <div className={styles.referenceGroupHeader}>
                <span>BROWSE</span>
                <span className={styles.referenceGroupCount}>{browsePages.length}</span>
              </div>
              {browsePages.map(page => renderPageListItem(page))}
            </div>
          )}

          {/* Group 3: BUY */}
          {buyPages.length > 0 && (
            <div className={styles.navGroup} style={{ marginBottom: '14px' }}>
              <div className={styles.referenceGroupHeader}>
                <span>BUY</span>
                <span className={styles.referenceGroupCount}>{buyPages.length}</span>
              </div>
              {buyPages.map(page => renderPageListItem(page))}
            </div>
          )}

          {/* Group 4: COMPLETE */}
          {completePages.length > 0 && (
            <div className={styles.navGroup} style={{ marginBottom: '14px' }}>
              <div className={styles.referenceGroupHeader}>
                <span>COMPLETE</span>
                <span className={styles.referenceGroupCount}>{completePages.length}</span>
              </div>
              {completePages.map(page => renderPageListItem(page))}
            </div>
          )}

          {/* Group 5: ACCOUNT */}
          {accountPages.length > 0 && (
            <div className={styles.navGroup} style={{ marginBottom: '14px' }}>
              <div className={styles.referenceGroupHeader}>
                <span>ACCOUNT</span>
                <span className={styles.referenceGroupCount}>{accountPages.length}</span>
              </div>
              {accountPages.map(page => renderPageListItem(page))}
            </div>
          )}

          {/* Group 6: CONTENT */}
          {contentPages.length > 0 && (
            <div className={styles.navGroup} style={{ marginBottom: '14px' }}>
              <div className={styles.referenceGroupHeader}>
                <span>CONTENT</span>
                <span className={styles.referenceGroupCount}>{contentPages.length}</span>
              </div>
              {contentPages.map(page => renderPageListItem(page))}
            </div>
          )}

          {/* Group 7: CHROME */}
          {chromeComponentsFiltered.length > 0 && (
            <div className={styles.navGroup} style={{ marginBottom: '14px' }}>
              <div className={styles.referenceGroupHeader}>
                <span>CHROME</span>
                <span className={styles.referenceGroupCount}>{chromeComponentsFiltered.length}</span>
              </div>
              {chromeComponentsFiltered.map(gc => {
                const isSelected = selectedPageId === gc.id && pagesNavLevel === 'page-detail' && isRightSidebarOpen;
                return (
                  <div
                    key={gc.id}
                    className={`${styles.navItem} ${isSelected ? styles.navItemActive : ''}`}
                    onClick={() => {
                      if (pagesListScrollRef.current) {
                        pagesListScrollTopRef.current = pagesListScrollRef.current.scrollTop;
                      }

                      const isHeaderFamily = gc.id === 'header-global';
                      if (isHeaderFamily) {
                        let targetRowId = 'row-primary-nav';
                        let targetSectionId = 'header-main';

                        navigateToPage('header-global', targetSectionId);
                        navigate(getEditorPath('header-global', targetSectionId));
                        useEditorContextStore.getState().setEditorType('header');

                        setSelectedSectionId(targetSectionId);
                        useEditorContextStore.getState().selectTarget({
                          type: 'row',
                          editorType: 'header',
                          rowId: targetRowId,
                        });
                        setRightSidebarOpen(true);
                        scrollPreviewToHeaderSection(targetRowId);
                        return;
                      }

                      if (gc.id === 'footer-global') {
                        let targetSectionId = 'footer-main';

                        navigateToPage('footer-global', targetSectionId);
                        navigate(getEditorPath('footer-global', targetSectionId));
                        useEditorContextStore.getState().setEditorType('footer');

                        setSelectedSectionId(targetSectionId);
                        useEditorContextStore.getState().selectTarget({ type: 'none' });
                        setRightSidebarOpen(false);
                        return;
                      }
                    }}
                  >
                    <div className={`${styles.navItemIcon} ${isSelected ? styles.navItemIconActive : ''}`}>
                      <gc.icon size={16} />
                    </div>
                    <span className={`${styles.navItemLabel} ${isSelected ? styles.navItemLabelActive : ''}`}>{gc.label}</span>
                    <span className={styles.allPagesBadge}>{gc.badge}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Divider Line above Legal */}
          {legalPages.length > 0 && (
            <>
              <div style={{ height: '1px', backgroundColor: 'var(--border-color, #e2e8f0)', margin: '14px 4px 14px' }} />

              {/* Group 8: LEGAL */}
              <div className={styles.navGroup} style={{ marginBottom: '14px' }}>
                <div className={styles.referenceGroupHeader}>
                  <span>LEGAL</span>
                  <span className={styles.referenceGroupCount}>{legalPages.length}</span>
                </div>
                {legalPages.map(page => renderPageListItem(page))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderPageListItem = (page: typeof pages[0]) => {
    const isSelected = page.id === selectedPageId && pagesNavLevel === 'page-detail' && isRightSidebarOpen;
    const Icon = pageIconMap[page.type] || pageIconMap[page.id] || (getPageConfig(page.type)?.icon) || FileText;

    return (
      <div
        key={page.id}
        className={`${styles.navItem} ${isSelected ? styles.navItemActive : ''}`}
        onClick={() => {
          if (pagesListScrollRef.current) {
            pagesListScrollTopRef.current = pagesListScrollRef.current.scrollTop;
          }
          navigateToPage(page.id);
          navigate(getEditorPath(page.id));
          if (page.id !== 'landing-page') {
            setRightSidebarOpen(true);
          }
        }}
      >
        <div className={`${styles.navItemIcon} ${isSelected ? styles.navItemIconActive : ''}`}>
          <Icon size={16} />
        </div>
        <span className={`${styles.navItemLabel} ${isSelected ? styles.navItemLabelActive : ''}`}>
          {page.name}
        </span>
      </div>
    );
  };


  // ─── GLOBAL COOKIE CONSENT DETAIL VIEW ───
  const renderCookieConsentDetailView = () => {
    return (
      <div className={styles.contextPanelInner}>
        {renderEditorDetailHeader('Cookie Consent', 'GDPR & privacy consent banner')}

        <div className={styles.contextPanelScroll}>
          <div style={{ padding: '16px' }}>
            <div className={styles.navItem} onClick={() => setRightSidebarOpen(true)}>
              <div className={styles.navItemIcon}>
                <Cookie size={15} />
              </div>
              <div className={styles.navItemContent}>
                <span className={styles.navItemLabel}>Consent Banner Configuration</span>
                <span className={styles.navItemPath}>Notice text, policy URL & accept buttons</span>
              </div>
              <ChevronRight size={14} className={styles.navItemChevron} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─── GLOBAL TOASTER DETAIL VIEW ───
  const renderToasterDetailView = () => {
    return (
      <div className={styles.contextPanelInner}>
        {renderEditorDetailHeader('Notifications & Toasts', 'Cart updates, order alerts & toaster popups')}

        <div className={styles.contextPanelScroll}>
          <div style={{ padding: '16px' }}>
            <div className={styles.navItem} onClick={() => setRightSidebarOpen(true)}>
              <div className={styles.navItemIcon}>
                <Bell size={15} />
              </div>
              <div className={styles.navItemContent}>
                <span className={styles.navItemLabel}>Toast Notification Style</span>
                <span className={styles.navItemPath}>Position, animation & sound effects</span>
              </div>
              <ChevronRight size={14} className={styles.navItemChevron} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─── PAGE DETAIL VIEW (UNIVERSAL SECTION & INNERBLOCKS TREE ARCHITECTURE) ───
  const renderPageDetailView = () => {
    if (!activePage) return null;

    const templateSections = activePage.sections.filter(
      s => !headerBarTypes.includes(s.type) && s.type !== 'Header' && !footerBarTypes.includes(s.type) && !isFooterMain(s.type)
    );

    const handleToggleExpand = (sectionId: string) => {
      setExpandedSectionIds(prev =>
        prev.includes(sectionId) ? prev.filter(id => id !== sectionId) : [...prev, sectionId]
      );
    };

    const handleSelectSection = (sectionId: string) => {
      useEditorContextStore.getState().selectTarget({ type: 'none' });
      setSelectedSectionId(sectionId);
      setRightSidebarOpen(true);
      navigate(getEditorPath(activePage.id, sectionId), { replace: true });
      if (!expandedSectionIds.includes(sectionId)) {
        setExpandedSectionIds(prev => [...prev, sectionId]);
      }
    };

    const handleSelectInnerBlock = (section: SectionData, _block: SectionInnerBlock) => {
      useEditorContextStore.getState().selectTarget({ type: 'none' });
      setSelectedSectionId(section.id);
      setRightSidebarOpen(true);
      navigate(getEditorPath(activePage.id, section.id), { replace: true });
    };

    const handleDropSection = (draggedId: string, targetIndex: number) => {
      const oldIdx = templateSections.findIndex(s => s.id === draggedId);
      if (oldIdx === -1) return;
      let adjustedIndex = targetIndex;
      if (oldIdx < targetIndex) {
        adjustedIndex = targetIndex - 1;
      }
      if (adjustedIndex < 0) adjustedIndex = 0;
      if (adjustedIndex >= templateSections.length) adjustedIndex = templateSections.length - 1;
      if (oldIdx === adjustedIndex) return;

      const reordered = [...templateSections];
      const [removed] = reordered.splice(oldIdx, 1);
      reordered.splice(adjustedIndex, 0, removed);

      const headers = activePage.sections.filter(s => headerBarTypes.includes(s.type) || s.type === 'Header');
      const footers = activePage.sections.filter(s => footerBarTypes.includes(s.type) || isFooterMain(s.type));
      updatePageProps(activePage.id, { sections: [...headers, ...reordered, ...footers] });
    };

    const handleAddBlockToSection = (section: SectionData) => {
      const p = section.props || {};
      switch (section.type) {
        case 'FAQ': {
          const items = Array.isArray(p.items) ? [...p.items] : [];
          items.push({ question: 'New Question', answer: 'Write the answer to your new question here.' });
          updateSectionProps(activePage.id, section.id, { items });
          break;
        }
        case 'Testimonials': {
          const testimonials = Array.isArray(p.testimonials) ? [...p.testimonials] : [];
          testimonials.push({ name: 'Happy Customer', role: 'Verified Buyer', quote: 'Great quality and fast delivery!', rating: 5 });
          updateSectionProps(activePage.id, section.id, { testimonials });
          break;
        }
        case 'LogoList': {
          const logos = Array.isArray(p.logos) ? [...p.logos] : [];
          logos.push({ name: 'Partner Brand', image: '' });
          updateSectionProps(activePage.id, section.id, { logos });
          break;
        }
        case 'FeaturedCollection': {
          const products = Array.isArray(p.products) ? [...p.products] : [];
          products.push({ name: 'New Product', price: '$89.00', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop' });
          updateSectionProps(activePage.id, section.id, { products });
          break;
        }
        case 'CategoryList': {
          const categories = Array.isArray(p.categories) ? [...p.categories] : [];
          categories.push({ name: 'New Category', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop' });
          updateSectionProps(activePage.id, section.id, { categories });
          break;
        }
        case 'HeroCarousel': {
          const slides = Array.isArray(p.slides) ? [...p.slides] : [];
          slides.push({ heading: 'New Slide Title', description: 'Slide description text goes here.', buttonText: 'Shop Now', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&h=600&fit=crop' });
          updateSectionProps(activePage.id, section.id, { slides });
          break;
        }
        case 'PricingTable': {
          const plans = Array.isArray(p.plans) ? [...p.plans] : [];
          plans.push({ name: 'New Plan', price: '$49/mo', features: ['Feature 1', 'Feature 2', 'Feature 3'] });
          updateSectionProps(activePage.id, section.id, { plans });
          break;
        }
        case 'Gallery': {
          const images = Array.isArray(p.images) ? [...p.images] : [];
          images.push({ caption: 'New Gallery Image', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&h=600&fit=crop' });
          updateSectionProps(activePage.id, section.id, { images });
          break;
        }
        case 'BlogPosts': {
          const posts = Array.isArray(p.posts) ? [...p.posts] : [];
          posts.push({ title: 'New Article', excerpt: 'Brief introduction to the article.', date: 'Today' });
          updateSectionProps(activePage.id, section.id, { posts });
          break;
        }
        default: {
          setSelectedSectionId(section.id);
          setRightSidebarOpen(true);
          break;
        }
      }

      if (!expandedSectionIds.includes(section.id)) {
        setExpandedSectionIds(prev => [...prev, section.id]);
      }
      setSelectedSectionId(section.id);
      setRightSidebarOpen(true);
    };

    const handleDeleteInnerItem = (sectionId: string, listKey: string, itemIndex: number) => {
      const section = activePage.sections.find(s => s.id === sectionId);
      if (!section) return;
      const list = Array.isArray(section.props?.[listKey]) ? [...section.props[listKey]] : [];
      if (list.length <= 1) return;
      list.splice(itemIndex, 1);
      updateSectionProps(activePage.id, sectionId, { [listKey]: list });
    };

    const handleDuplicateInnerItem = (sectionId: string, listKey: string, itemIndex: number) => {
      const section = activePage.sections.find(s => s.id === sectionId);
      if (!section) return;
      const list = Array.isArray(section.props?.[listKey]) ? [...section.props[listKey]] : [];
      const item = list[itemIndex];
      if (!item) return;
      list.splice(itemIndex + 1, 0, { ...item });
      updateSectionProps(activePage.id, sectionId, { [listKey]: list });
    };

    const pageConfig = getPageConfig(activePage.type) || getPageConfig(activePage.id.replace('-page', ''));
    const layouts = pageConfig?.layouts || [];
    const currentLayoutId = activePage.pageProps?._selectedLayout || activePage.pageProps?.selectedLayout || activePage.pageProps?.layout;

    return (
      <div className={styles.contextPanelInner} style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {renderEditorDetailHeader(activePage.name, activePage.path)}

        <div className={styles.contextPanelScroll} style={{ flex: 1, overflowY: 'auto' }}>
          {/* 1. Global Header Bar Navigation */}
          <div
            onClick={() => navigateToPage('header-global')}
            style={{
              margin: '8px 12px 6px',
              padding: '9px 12px',
              minHeight: '38px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.12s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
            title="Open Universal Storefront Header"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <Folder size={16} color="#64748b" />
              <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#0f172a' }}>Header</span>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', background: '#e2e8f0', padding: '2px 7px', borderRadius: '4px' }}>
              Global
            </span>
          </div>

          {/* 2. Page Sections Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px 4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b' }}>
              Page Sections ({templateSections.length})
            </span>
          </div>

          {/* 3. Empty State or Template Sections Tree */}
          {templateSections.length === 0 ? (
            <div style={{ padding: '24px 16px', textAlign: 'center' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                color: '#64748b'
              }}>
                <Layout size={20} />
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                No sections on this page yet
              </div>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 16px', lineHeight: 1.4 }}>
                Add sections to build the layout and content of this page.
              </p>
              <button
                type="button"
                onClick={() => {
                  useLandingEditorStore.getState().setInsertIndex(0);
                  setAddSectionWidgetOpen(true);
                }}
                style={{
                  padding: '7px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#2563eb',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Plus size={14} />
                <span>Add First Section</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', boxSizing: 'border-box' }}>
              <PageInsertDivider
                targetIndex={0}
                onDropSection={handleDropSection}
                onInsertClick={(idx) => {
                  useLandingEditorStore.getState().setInsertIndex(idx);
                  setAddSectionWidgetOpen(true);
                }}
              />

              {templateSections.map((section, idx) => {
                const innerBlocks = getSectionInnerBlocks(section);
                const isSelected = selectedSectionId === section.id && isRightSidebarOpen;
                const isExpanded = expandedSectionIds.includes(section.id);

                return (
                  <React.Fragment key={section.id}>
                    <PageTreeNodeRow
                      section={section}
                      index={idx}
                      totalCount={templateSections.length}
                      isSelected={isSelected}
                      isExpanded={isExpanded}
                      onToggleExpand={() => handleToggleExpand(section.id)}
                      onSelect={() => handleSelectSection(section.id)}
                      onToggleVisibility={() => toggleSectionVisibility(activePage.id, section.id)}
                      onDelete={() => setSectionToDelete(section.id)}
                      onDuplicate={() => duplicateSection(activePage.id, section.id)}
                      onMoveUp={idx > 0 ? () => moveTemplateSection(section.id, 'up') : undefined}
                      onMoveDown={idx < templateSections.length - 1 ? () => moveTemplateSection(section.id, 'down') : undefined}
                      onAddBlock={() => handleAddBlockToSection(section)}
                      onDropSection={handleDropSection}
                      innerBlocks={innerBlocks}
                      onDeleteInnerItem={(listKey, itemIdx) => handleDeleteInnerItem(section.id, listKey, itemIdx)}
                      onDuplicateInnerItem={(listKey, itemIdx) => handleDuplicateInnerItem(section.id, listKey, itemIdx)}
                      onSelectInnerBlock={(block) => handleSelectInnerBlock(section, block)}
                    />

                    <PageInsertDivider
                      targetIndex={idx + 1}
                      onDropSection={handleDropSection}
                      onInsertClick={(targetIdx) => {
                        useLandingEditorStore.getState().setInsertIndex(targetIdx);
                        setAddSectionWidgetOpen(true);
                      }}
                    />
                  </React.Fragment>
                );
              })}
            </div>
          )}

          {/* 4. Global Footer Bar Navigation */}
          <div
            onClick={() => navigateToPage('footer-global')}
            style={{
              margin: '6px 12px 16px',
              padding: '9px 12px',
              minHeight: '38px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.12s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
            title="Open Universal Storefront Footer"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <Folder size={16} color="#64748b" />
              <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#0f172a' }}>Footer</span>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', background: '#e2e8f0', padding: '2px 7px', borderRadius: '4px' }}>
              Global
            </span>
          </div>

          {/* 5. Optional Layout Presets (Collapsible if present) */}
          {layouts.length > 0 && (
            <div style={{ margin: '0 12px 16px', padding: '10px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                Page Layout Presets
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {layouts.map(layout => {
                  const isSelected = currentLayoutId === layout.id;
                  return (
                    <button
                      key={layout.id}
                      type="button"
                      onClick={() => {
                        updatePageProps(activePage.id, {
                          pageProps: {
                            ...activePage.pageProps,
                            _selectedLayout: layout.id,
                            selectedLayout: layout.id,
                            layout: layout.id,
                          }
                        });
                      }}
                      style={{
                        padding: '6px 8px',
                        borderRadius: '5px',
                        border: isSelected ? '1px solid #2563eb' : '1px solid #cbd5e1',
                        background: isSelected ? '#eff6ff' : '#ffffff',
                        color: isSelected ? '#1d4ed8' : '#334155',
                        fontSize: '11px',
                        fontWeight: isSelected ? 600 : 500,
                        cursor: 'pointer',
                        textAlign: 'left',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {layout.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 6. Sticky Bottom Add Section Button */}
        <div className={styles.stickyAddSection}>
          <button
            className={`btn btn-primary ${styles.addSectionBtn}`}
            onClick={() => {
              useLandingEditorStore.getState().setInsertIndex(activePage.sections.length);
              setAddSectionWidgetOpen(true);
            }}
            type="button"
          >
            <Plus size={16} />
            <span>Add Section</span>
          </button>
        </div>
      </div>
    );
  };


  // ─── TAB 2, 3, 4: DESIGN, STORE & BRAND, SETTINGS PANELS ───
  // ─── Panels for Design, Store & Brand, and Settings tabs ───
  // Extracted to: panels/DesignPanel.tsx, panels/BrandPanel.tsx, panels/SettingsPanel.tsx
  // The renderContextualPanel() switch above renders them as imported components.





  // ─────────────────────────────────────────────────────
  // RENDER: MAIN SIDEBAR CONTENT (HORIZONTAL TABS ON TOP)
  // ─────────────────────────────────────────────────────

  const isPageDetail = activePanel === 'pages' && pagesNavLevel === 'page-detail';

  const sidebarContent = (
    <div className={styles.horizontalTabsSidebar}>
      {/* Level 1: Exactly 4 Horizontal Tabs on Top of the Vertical Sidebar */}
      {!isPageDetail && (
        <div className={styles.horizontalTabBar}>
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activePanel === tab.id || (tab.id === 'brand' && (activePanel === 'store-brand' || activePanel === 'seo-growth')) || (tab.id === 'design' && activePanel === 'design-experience');
            return (
              <button
                key={tab.id}
                className={`${styles.horizontalTabBtn} ${isActive ? styles.horizontalTabBtnActive : ''}`}
                onClick={() => handleTabClick(tab.id)}
                title={tab.label}
                type="button"
              >
                <Icon size={18} className={styles.horizontalTabIcon} />
                <span className={styles.horizontalTabLabel}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Level 2: Contextual Panel Content for Selected Tab */}
      <div className={styles.sidebarPanelBody}>
        {renderContextualPanel()}
      </div>

      {/* Delete section confirmation modal */}
      {sectionToDelete && createPortal(
        <div className={styles.fullscreenModalOverlay} style={{ zIndex: 99999 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', width: '320px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontFamily: '"Outfit", sans-serif' }}>Delete Section</h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: 'var(--text-muted)' }}>Are you sure you want to delete this section? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSectionToDelete(null)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  removeSection(activePage.id, sectionToDelete);
                  setSectionToDelete(null);
                }}
                style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#ef4444', color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '13px', boxShadow: '0 4px 10px rgba(239, 68, 68, 0.2)' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );

  const shouldCollapse = isLeftSidebarCollapsed;

  if (shouldCollapse) {
    return (
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: '48px',
          position: 'relative',
          flexShrink: 0,
          zIndex: 40
        }}
      >
        {/* Collapsed strip with quick expand button and icon toggles */}
        <div className={styles.horizontalCollapsedStrip}>
          <button
            className={styles.collapsedExpandBtn}
            onClick={() => setLeftSidebarCollapsed(false)}
            title="Expand sidebar"
          >
            <PanelLeftOpen size={16} />
          </button>
          <div className={styles.collapsedDivider} />
          {!isPageDetail && TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activePanel === tab.id || (tab.id === 'brand' && (activePanel === 'store-brand' || activePanel === 'seo-growth')) || (tab.id === 'design' && activePanel === 'design-experience');
            return (
              <button
                key={tab.id}
                className={`${styles.collapsedTabIconBtn} ${isActive ? styles.collapsedTabIconBtnActive : ''}`}
                onClick={() => {
                  handleTabClick(tab.id);
                  setLeftSidebarCollapsed(false);
                }}
                title={tab.label}
              >
                <Icon size={18} />
              </button>
            );
          })}
        </div>

        {/* Hover expansion */}
        <aside
          className={styles.leftPanel}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '310px',
            zIndex: 100,
            transform: isHovered ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: isHovered ? '0 10px 25px -5px rgba(0,0,0,0.15)' : 'none',
          }}
        >
          {sidebarContent}
        </aside>
      </div>
    );
  }

  return (
    <aside className={styles.leftPanel}>
      {sidebarContent}
    </aside>
  );
};
