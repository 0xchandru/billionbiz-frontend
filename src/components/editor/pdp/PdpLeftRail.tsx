// ============================================================
// PDP BUILDER — LEFT RAIL (SHOPIFY & FOOTER TREE ARCHITECTURE)
// Clean hierarchical component tree identical to FooterTreePanel:
// - Outer Container: "Product information" with Chevron & ⊕ Add block
// - Inner blocks & nested Groups with indented ⊕ Add block
// - Outer blocks: Template sections (Policy links, Description, etc.)
// - Interactive InsertDivider (+ Insert / + Drop here)
// - Drag & drop reordering across groups & root levels
// ============================================================

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronRight,
  ChevronDown,
  Plus,
  PlusCircle,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  MoreVertical,
  GripVertical,
  Folder,
  FolderOpen,
  Heading,
  AlignLeft,
  Image,
  Video,
  Sparkles,
  Tag,
  CreditCard,
  ShoppingBag,
  Zap,
  Heart,
  Share2,
  Sliders,
  Scale,
  Calculator,
  Percent,
  Coins,
  ShieldCheck,
  Truck,
  RotateCcw,
  Clock,
  HelpCircle,
  FileText,
  ListChecks,
  Table,
  Layers,
  LayoutGrid,
  Code,
  Minus,
  MoveVertical,
  Package,
  Star,
  CheckCircle2,
  Info,
  Search,
  ArrowLeft,
  Check,
  AlertCircle,
  X,
  Layout,
} from 'lucide-react';
import { usePdpStore } from './pdpStore';
import { useLandingEditorStore } from '../../../store/landingEditorStore';
import type { PdpBlock } from './types/pdpBlockTypes';
import type { PdpProduct } from './types/pdpProductTypes';
import { isProductInfoBlock, isTemplateSection } from './pdpBlockRegistry';
import { PdpComponentLibraryModal } from './PdpComponentLibraryModal';
import { PdpTemplateManagerModal } from './PdpTemplateManagerModal';

// ─── ICON MAP ────────────────────────────────────────────────
const PDP_NODE_ICON_MAP: Record<string, React.FC<{ size?: number; className?: string; style?: React.CSSProperties; color?: string }>> = {
  group: Folder,
  // 1. Product Media
  media_gallery: Image,
  media_video: Video,
  media_zoom: Sparkles,
  media_badges: Star,
  media_carousel: Layers,
  // 2. Product Information
  info_title: Heading,
  info_subtitle: AlignLeft,
  info_vendor: Package,
  info_category: Layers,
  info_sku: Tag,
  info_rating: Star,
  info_review_count: CheckCircle2,
  info_badges: Sparkles,
  info_stock_status: CheckCircle2,
  // 3. Pricing & Offers
  price_display: Tag,
  price_compare: Tag,
  price_discount: Percent,
  price_variant_selector: Sliders,
  price_measurement_qty: Scale,
  price_total_calculator: Calculator,
  price_bulk_discounts: Coins,
  price_savings_info: Percent,
  price_unit_price: Tag,
  // 4. Purchase Actions
  action_quantity: Sliders,
  action_add_to_cart: ShoppingBag,
  action_buy_now: Zap,
  action_wishlist: Heart,
  action_share: Share2,
  action_compare: Scale,
  // 5. Product Details
  detail_short_description: AlignLeft,
  detail_full_description: FileText,
  detail_key_features: ListChecks,
  detail_specifications: Table,
  detail_info_table: Table,
  detail_ingredients: ListChecks,
  detail_benefits: Sparkles,
  detail_how_to_use: ListChecks,
  detail_size_chart: Table,
  detail_care_instructions: Info,
  detail_tabs: Layers,
  detail_accordion: Layers,
  detail_faq: HelpCircle,
  // 6. Shipping & Trust
  trust_delivery_checker: Truck,
  trust_shipping_info: Truck,
  trust_return_policy: RotateCcw,
  trust_badges: ShieldCheck,
  trust_payment_icons: CreditCard,
  trust_shipping_benefits: Sparkles,
  trust_estimated_delivery: Clock,
  // 7. Recommendations
  rec_related: Sparkles,
  rec_frequently_bought: ShoppingBag,
  rec_recently_viewed: Clock,
  rec_recommended: Sparkles,
  // 8. Custom Content
  custom_text: AlignLeft,
  custom_heading: Heading,
  custom_image: Image,
  custom_video: Video,
  custom_html: Code,
  custom_banner: Sparkles,
  custom_divider: Minus,
  custom_spacer: MoveVertical,
  custom_icon_text: Info,
  custom_info_section: LayoutGrid,
};

function getPdpBlockDisplayName(block: PdpBlock): string {
  if (block.type === 'group') {
    return block.name || 'Group';
  }
  const cleanNames: Record<string, string> = {
    info_title: 'Title',
    info_subtitle: 'Subtitle',
    info_vendor: 'Vendor',
    info_category: 'Category',
    info_sku: 'SKU',
    info_rating: 'Rating & reviews',
    info_review_count: 'Review count',
    info_badges: 'Product badges',
    info_stock_status: 'Stock status',
    price_display: 'Price',
    price_compare: 'Compare price',
    price_discount: 'Discount badge',
    price_variant_selector: 'Variant picker',
    price_measurement_qty: 'Measurement qty',
    price_total_calculator: 'Price calculator',
    price_bulk_discounts: 'Volume pricing',
    price_savings_info: 'Savings info',
    price_unit_price: 'Unit price',
    action_quantity: 'Quantity selector',
    action_add_to_cart: 'Add to cart',
    action_buy_now: 'Buy now',
    action_wishlist: 'Wishlist button',
    action_share: 'Share button',
    action_compare: 'Compare button',
    media_gallery: 'Product media gallery',
    media_video: 'Product video',
    media_zoom: 'Image zoom',
    media_badges: 'Image badges',
    media_carousel: 'Media carousel',
    detail_short_description: 'Short description',
    detail_full_description: 'Description',
    detail_key_features: 'Key features',
    detail_specifications: 'Specifications',
    detail_info_table: 'Information table',
    detail_ingredients: 'Ingredients',
    detail_benefits: 'Benefits',
    detail_how_to_use: 'How to use',
    detail_size_chart: 'Size chart',
    detail_care_instructions: 'Care instructions',
    detail_tabs: 'Product tabs',
    detail_accordion: 'Collapsible rows',
    detail_faq: 'FAQ',
    trust_delivery_checker: 'Delivery checker',
    trust_shipping_info: 'Shipping information',
    trust_return_policy: 'Return policy',
    trust_badges: 'Trust badges',
    trust_payment_icons: 'Payment icons',
    trust_shipping_benefits: 'Shipping benefits',
    trust_estimated_delivery: 'Estimated delivery',
    rec_related: 'Related products',
    rec_frequently_bought: 'Frequently bought together',
    rec_recently_viewed: 'Recently viewed',
    rec_recommended: 'Recommended products',
    custom_text: 'Custom text',
    custom_heading: 'Custom heading',
    custom_image: 'Custom image',
    custom_video: 'Custom video',
    custom_html: 'Custom HTML',
    custom_banner: 'Announcement banner',
    custom_divider: 'Divider',
    custom_spacer: 'Spacer',
    custom_icon_text: 'Icon with text',
    custom_info_section: 'Custom section',
  };

  return cleanNames[block.type] || block.name;
}

// ─── INSERT DIVIDER BETWEEN ITEMS ────────────────────────────
interface InsertDividerProps {
  parentId: string | null;
  targetIndex: number;
  depth: number;
  targetBlockId?: string;
  insertPosition?: 'above' | 'below' | 'inside' | 'bottom';
  insertMode?: 'block' | 'section' | 'all';
}

const InsertDivider: React.FC<InsertDividerProps> = ({
  parentId,
  targetIndex,
  depth,
  targetBlockId,
  insertPosition,
  insertMode,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const openComponentLibrary = usePdpStore((s) => s.openComponentLibrary);
  const moveBlockNode = usePdpStore((s) => s.moveBlockNode);
  const paddingLeft = 8 + depth * 14;

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
        // Prevent moving product media outside Product information (depth 0 template sections)
        if ((window as any).__bb_dragged_pdp_node_is_media && depth === 0) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'move';
        const draggedId = (window as any).__bb_dragged_pdp_node_id;
        if (draggedId) {
          setIsDragOver(true);
        }
      }}
      onDragLeave={(e) => {
        e.stopPropagation();
        setIsDragOver(false);
      }}
      onDrop={(e) => {
        if ((window as any).__bb_dragged_pdp_node_is_media && depth === 0) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        const draggedId = (window as any).__bb_dragged_pdp_node_id;
        if (draggedId) {
          moveBlockNode(draggedId, parentId, targetIndex);
        }
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (targetBlockId) {
          openComponentLibrary(insertPosition || 'above', targetBlockId, insertMode || 'block');
        } else {
          openComponentLibrary(parentId ? 'inside' : 'bottom', parentId || undefined, parentId ? 'block' : 'all');
        }
      }}
      style={{
        height: isActive ? '18px' : '10px',
        margin: isActive ? '-5px 0' : '-3px 0',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: `${paddingLeft}px`,
        paddingRight: '8px',
        cursor: isDragOver ? 'copy' : 'pointer',
        zIndex: 25,
        transition: 'all 0.12s ease',
      }}
      title={isDragOver ? 'Drop to place here' : 'Insert block here'}
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

// ─── ICON COLOR CATEGORY MAPPING ─────────────────────────────
const getCategoryIconColor = (type: string, isSelected: boolean, isHovered: boolean) => {
  if (isSelected || isHovered) return '#2563eb';
  if (type.startsWith('media_')) return '#2563eb';
  if (type.startsWith('info_')) return '#0284c7';
  if (type.startsWith('price_')) return '#059669';
  if (type.startsWith('action_')) return '#7c3aed';
  if (type.startsWith('detail_')) return '#d97706';
  if (type.startsWith('trust_')) return '#0d9488';
  if (type.startsWith('rec_')) return '#e11d48';
  return '#475569';
};

// ─── TREE NODE ROW (IDENTICAL TO FOOTER TREE PANEL) ──────────
interface TreeNodeRowProps {
  node: PdpBlock;
  depth: number;
  parentId: string | null;
  siblings: PdpBlock[];
}

const TreeNodeRow: React.FC<TreeNodeRowProps> = ({ node, depth, parentId, siblings }) => {
  const {
    selectedBlockId,
    selectBlock,
    expandedBlockIds,
    toggleBlockExpanded,
    openComponentLibrary,
    removeBlock,
    duplicateBlock,
    toggleBlockVisibility,
    moveBlockNode,
  } = usePdpStore();

  const setRightSidebarOpen = useLandingEditorStore((s) => s.setRightSidebarOpen);

  const [isHovered, setIsHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dropPosition, setDropPosition] = useState<'before' | 'after' | 'inside' | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const hoverTimerRef = useRef<number | null>(null);
  const autoExpandedRef = useRef<boolean>(false);

  const isSelected = selectedBlockId === node.id;
  const isGroup = node.type === 'group';
  const isExpanded = expandedBlockIds.includes(node.id);
  const children = node.children || [];
  const IconComp = isGroup
    ? (isExpanded ? FolderOpen : Folder)
    : (PDP_NODE_ICON_MAP[node.type] || LayoutGrid);

  const displayName = getPdpBlockDisplayName(node);

  // Auto-scroll into view when selected
  useEffect(() => {
    if (isSelected && rowRef.current) {
      rowRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [isSelected]);

  // Close context menu on click outside
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

  // Global dragend listener: cancel hover timers
  useEffect(() => {
    const handleGlobalDragEnd = () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }
      if (isGroup && autoExpandedRef.current) {
        autoExpandedRef.current = false;
        const currentlyExpanded = usePdpStore.getState().expandedBlockIds.includes(node.id);
        if (currentlyExpanded) {
          toggleBlockExpanded(node.id);
        }
      }
      setDropPosition(null);
    };

    window.addEventListener('dragend', handleGlobalDragEnd);
    return () => {
      window.removeEventListener('dragend', handleGlobalDragEnd);
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, [isGroup, node.id, toggleBlockExpanded]);

  const nodeIndex = useMemo(() => {
    return siblings.findIndex((s) => s.id === node.id);
  }, [siblings, node.id]);

  const siblingsCount = siblings.length;

  const handleMoveUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (nodeIndex > 0) {
      moveBlockNode(node.id, parentId, nodeIndex - 1);
    }
    setMenuOpen(false);
  };

  const handleMoveDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (nodeIndex < siblingsCount - 1) {
      moveBlockNode(node.id, parentId, nodeIndex + 1);
    }
    setMenuOpen(false);
  };

  const isMediaBlock = node.type === 'media_gallery' || node.category === 'Product Media' || node.type.startsWith('media_');

  // ── Drag & Drop Event Handlers ──
  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.setData('text/plain', node.id);
    (window as any).__bb_dragged_pdp_node_id = node.id;
    (window as any).__bb_dragged_pdp_node_is_media = isMediaBlock;
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);

    if (isGroup && isExpanded) {
      toggleBlockExpanded(node.id);
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.stopPropagation();
    (window as any).__bb_dragged_pdp_node_id = null;
    (window as any).__bb_dragged_pdp_node_is_media = false;
    setIsDragging(false);
    setDropPosition(null);
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    // Media blocks cannot be dropped into template sections (depth 0)
    if ((window as any).__bb_dragged_pdp_node_is_media && depth === 0) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    const draggedId = (window as any).__bb_dragged_pdp_node_id;
    if (!draggedId || draggedId === node.id) return;

    if (rowRef.current) {
      const rect = rowRef.current.getBoundingClientRect();
      const offsetY = e.clientY - rect.top;

      if (isGroup) {
        if (offsetY < rect.height * 0.35) {
          setDropPosition('before');
          if (hoverTimerRef.current) {
            clearTimeout(hoverTimerRef.current);
            hoverTimerRef.current = null;
          }
        } else if (offsetY > rect.height * 0.65) {
          setDropPosition('after');
          if (hoverTimerRef.current) {
            clearTimeout(hoverTimerRef.current);
            hoverTimerRef.current = null;
          }
        } else {
          setDropPosition('inside');
          if (!isExpanded && !hoverTimerRef.current) {
            hoverTimerRef.current = window.setTimeout(() => {
              const currentlyExpanded = usePdpStore.getState().expandedBlockIds.includes(node.id);
              if (!currentlyExpanded) {
                autoExpandedRef.current = true;
                toggleBlockExpanded(node.id);
              }
              hoverTimerRef.current = null;
            }, 600);
          }
        }
      } else {
        if (offsetY < rect.height * 0.5) {
          setDropPosition('before');
        } else {
          setDropPosition('after');
        }
      }
    }
  };

  const handleRowDragLeave = (e: React.DragEvent) => {
    e.stopPropagation();
    setDropPosition(null);
  };

  const handleContainerDragLeave = (e: React.DragEvent) => {
    if (e.relatedTarget && containerRef.current?.contains(e.relatedTarget as Node)) {
      return;
    }
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return;
      }
    }

    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }

    if (isGroup && autoExpandedRef.current) {
      autoExpandedRef.current = false;
      const currentlyExpanded = usePdpStore.getState().expandedBlockIds.includes(node.id);
      if (currentlyExpanded) {
        toggleBlockExpanded(node.id);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    // Media blocks cannot be dropped into template sections (depth 0)
    if ((window as any).__bb_dragged_pdp_node_is_media && depth === 0) {
      setDropPosition(null);
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    const draggedId = (window as any).__bb_dragged_pdp_node_id;
    const targetPos = dropPosition;
    setDropPosition(null);

    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    autoExpandedRef.current = false;

    if (!draggedId || draggedId === node.id) return;

    const safeIndex = nodeIndex >= 0 ? nodeIndex : 0;

    if (targetPos === 'inside' && isGroup) {
      moveBlockNode(draggedId, node.id, children.length);
      if (!isExpanded) toggleBlockExpanded(node.id);
    } else if (targetPos === 'before') {
      moveBlockNode(draggedId, parentId, safeIndex);
    } else if (targetPos === 'after') {
      moveBlockNode(draggedId, parentId, safeIndex + 1);
    }
  };

  const paddingLeft = 8 + depth * 14;

  return (
    <div
      ref={containerRef}
      onDragLeave={handleContainerDragLeave}
      style={{ display: 'flex', flexDirection: 'column', width: '100%', boxSizing: 'border-box' }}
    >
      <div
        ref={rowRef}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleRowDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (isSelected) {
            selectBlock(null);
            setRightSidebarOpen(false);
          } else {
            selectBlock(node.id);
            if (isGroup && !isExpanded) {
              toggleBlockExpanded(node.id);
            }
            setRightSidebarOpen(true);
          }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          paddingLeft: `${paddingLeft}px`,
          backgroundColor:
            dropPosition === 'inside'
              ? '#eff6ff'
              : isSelected
              ? '#eff6ff'
              : isHovered
              ? '#f8fafc'
              : 'transparent',
          borderLeft: isSelected ? '3px solid #2563eb' : '3px solid transparent',
          borderTop: dropPosition === 'before' ? '2px solid #2563eb' : 'none',
          borderBottom: dropPosition === 'after' ? '2px solid #2563eb' : 'none',
          outline: dropPosition === 'inside' ? '2px dashed #2563eb' : 'none',
          outlineOffset: '-2px',
          borderRadius: '6px',
          cursor: isDragging ? 'grabbing' : 'grab',
          opacity: isDragging ? 0.35 : 1,
          position: 'relative',
          transition: 'all 0.12s ease',
          userSelect: 'none',
          minHeight: '40px',
        }}
      >
        {/* 1. Chevron Icon for Group */}
        {isGroup && (
          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              toggleBlockExpanded(node.id);
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
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          </button>
        )}

        {/* 2. Item Icon / Drag & Drop Grip Icon on hover */}
        <div
          style={{
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: getCategoryIconColor(node.type, isSelected, isHovered),
            flexShrink: 0,
            pointerEvents: 'none',
            transition: 'color 0.12s ease',
          }}
          title={isHovered ? 'Drag to reorder' : displayName}
        >
          {isHovered ? <GripVertical size={16} color="#2563eb" /> : <IconComp size={16} />}
        </div>

        {/* 3. Item Name with high visibility & Hidden tag */}
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
            opacity: node.isHidden ? 0.55 : 1,
            pointerEvents: 'none',
          }}
          title={displayName}
        >
          {displayName}
          {node.isHidden && (
            <span style={{ marginLeft: '6px', fontSize: '11px', color: '#94a3b8', fontWeight: 400 }}>
              (Hidden)
            </span>
          )}
        </span>

        {/* 4. Rightside Actions: Eye, Delete, Three-Dot */}
        {(isHovered || menuOpen) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              flexShrink: 0,
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Quick Add block inside group */}
            {isGroup && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openComponentLibrary('inside', node.id, 'block');
                  if (!isExpanded) toggleBlockExpanded(node.id);
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
            )}

            {/* Eye Visibility Toggle */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleBlockVisibility(node.id);
              }}
              title={node.isHidden ? 'Show component' : 'Hide component'}
              style={{
                padding: '4px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: 'transparent',
                color: node.isHidden ? '#94a3b8' : '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {node.isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>

            {/* Delete Icon */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeBlock(node.id);
              }}
              title="Delete block"
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

            {/* 3-Dot Overflow Menu */}
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
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    zIndex: 50,
                    width: '160px',
                    padding: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {isGroup && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(false);
                        openComponentLibrary('inside', node.id, 'block');
                        if (!isExpanded) toggleBlockExpanded(node.id);
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
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      duplicateBlock(node.id);
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

                  {nodeIndex > 0 && (
                    <button
                      type="button"
                      onClick={handleMoveUp}
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

                  {nodeIndex < siblingsCount - 1 && (
                    <button
                      type="button"
                      onClick={handleMoveDown}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      removeBlock(node.id);
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

      {/* Render Children Recursively if Expanded */}
      {isGroup && isExpanded && (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', boxSizing: 'border-box' }}>
          {children.map((child, cIdx) => (
            <React.Fragment key={child.id}>
              <InsertDivider
                parentId={node.id}
                targetIndex={cIdx}
                depth={depth + 1}
                targetBlockId={child.id}
                insertPosition="above"
                insertMode="block"
              />
              <TreeNodeRow node={child} depth={depth + 1} parentId={node.id} siblings={children} />
            </React.Fragment>
          ))}

          {/* Trailing InsertDivider at bottom of children inside group */}
          <InsertDivider
            parentId={node.id}
            targetIndex={children.length}
            depth={depth + 1}
            targetBlockId={children[children.length - 1]?.id}
            insertPosition="below"
            insertMode="block"
          />

          {/* Under every opened group: "Add block" button at bottom of children */}
          <div
            onDragOver={(e) => e.stopPropagation()}
            style={{
              paddingLeft: `${paddingLeft + 14}px`,
              paddingTop: '3px',
              paddingBottom: '3px',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openComponentLibrary('inside', node.id, 'block');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '3px 4px',
                border: 'none',
                borderRadius: '4px',
                background: 'transparent',
                color: '#2563eb',
                fontSize: '12.5px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background-color 0.12s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#eff6ff')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <div style={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <PlusCircle size={15} color="#2563eb" />
              </div>
              <span>Add block</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── MAIN PDP LEFT RAIL ──────────────────────────────────────
export const PdpLeftRail: React.FC = () => {
  const {
    templates,
    activeTemplateId,
    selectTemplate,
    createTemplate,
    getActiveTemplate,
    products,
    selectedProductId,
    selectProduct,
    assignProductTemplate,
    resolveTemplateForProduct,
    getAssignedProductsForTemplate,
    selectedBlockId,
    selectBlock,
    openComponentLibrary,
    expandedBlockIds,
    toggleBlockExpanded,
  } = usePdpStore();

  const setRightSidebarOpen = useLandingEditorStore((state) => state.setRightSidebarOpen);
  const navigateToPage = useLandingEditorStore((state) => state.navigateToPage);
  const requestEditorSwitch = useLandingEditorStore((state) => state.requestEditorSwitch);
  const pagesNavLevel = useLandingEditorStore((state) => state.pagesNavLevel);
  const selectedPageId = useLandingEditorStore((state) => state.selectedPageId);

  const activeTemplate = getActiveTemplate();

  // ── Template & Product Selector Widget State ──
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [widgetView, setWidgetView] = useState<'templates' | 'products' | 'assign-products'>('templates');
  const [viewingTemplateId, setViewingTemplateId] = useState<string>(activeTemplateId);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');

  // Confirmation dialog for reassigning a product to a custom template
  const [reassignModal, setReassignModal] = useState<{
    isOpen: boolean;
    product: PdpProduct | null;
    targetTemplateId: string;
    targetTemplateName: string;
    sourceTemplateName: string;
  }>({
    isOpen: false,
    product: null,
    targetTemplateId: '',
    targetTemplateName: '',
    sourceTemplateName: '',
  });

  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const [widgetCoords, setWidgetCoords] = useState<{
    top: number;
    left: number;
    width: number;
    maxHeight: number;
  }>({
    top: 90,
    left: 60,
    width: 320,
    maxHeight: 460,
  });

  const updateWidgetPosition = () => {
    if (!triggerButtonRef.current) return;
    const rect = triggerButtonRef.current.getBoundingClientRect();
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const targetWidth = Math.min(320, screenW - 24);

    let left = rect.left;
    if (left + targetWidth > screenW - 16) {
      left = Math.max(12, screenW - targetWidth - 16);
    }

    let top = rect.bottom + 4;
    let spaceBelow = screenH - top - 16;
    if (spaceBelow < 240 && rect.top > 300) {
      top = Math.max(12, rect.top - 440);
      spaceBelow = rect.top - 20;
    }

    const maxHeight = Math.max(280, Math.min(480, spaceBelow));

    setWidgetCoords({
      top,
      left,
      width: targetWidth,
      maxHeight,
    });
  };

  useEffect(() => {
    if (isWidgetOpen) {
      updateWidgetPosition();
      const handleReposition = () => updateWidgetPosition();
      window.addEventListener('resize', handleReposition);
      window.addEventListener('scroll', handleReposition, true);
      return () => {
        window.removeEventListener('resize', handleReposition);
        window.removeEventListener('scroll', handleReposition, true);
      };
    }
  }, [isWidgetOpen]);

  useEffect(() => {
    if (!isWidgetOpen && !reassignModal.isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (reassignModal.isOpen) {
          setReassignModal({
            isOpen: false,
            product: null,
            targetTemplateId: '',
            targetTemplateName: '',
            sourceTemplateName: '',
          });
        } else {
          setIsWidgetOpen(false);
          setIsCreatingTemplate(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isWidgetOpen, reassignModal.isOpen]);

  const viewingTemplate = templates.find((t) => t.id === viewingTemplateId) || activeTemplate;
  const viewingAssignedProducts = getAssignedProductsForTemplate(viewingTemplate.id);

  const filteredAssignedProducts = useMemo(() => {
    if (!searchQuery.trim()) return viewingAssignedProducts;
    const q = searchQuery.toLowerCase().trim();
    return viewingAssignedProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
    );
  }, [viewingAssignedProducts, searchQuery]);

  const filteredAllProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase().trim();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
    );
  }, [products, searchQuery]);

  const handleInitiateAssign = (product: PdpProduct) => {
    const currentTmpl = resolveTemplateForProduct(product);
    const targetTmpl = viewingTemplate;

    // If target is already this template, no-op
    if (currentTmpl.id === targetTmpl.id) return;

    // If target is custom, show confirmation dialog
    if (!targetTmpl.isDefault) {
      setReassignModal({
        isOpen: true,
        product,
        targetTemplateId: targetTmpl.id,
        targetTemplateName: targetTmpl.name,
        sourceTemplateName: currentTmpl.name,
      });
    } else {
      assignProductTemplate(product.id, null);
      selectTemplate(targetTmpl.id);
      selectProduct(product.id);
      setIsWidgetOpen(false);
    }
  };

  const handleConfirmReassign = () => {
    if (!reassignModal.product) return;
    assignProductTemplate(reassignModal.product.id, reassignModal.targetTemplateId);
    selectTemplate(reassignModal.targetTemplateId);
    selectProduct(reassignModal.product.id);
    setReassignModal({
      isOpen: false,
      product: null,
      targetTemplateId: '',
      targetTemplateName: '',
      sourceTemplateName: '',
    });
    setIsWidgetOpen(false);
  };

  const handleHeaderClick = () => {
    if (pagesNavLevel === 'page-detail' && selectedPageId !== 'header-global') {
      requestEditorSwitch({
        targetPageId: 'header-global',
        targetName: 'Header Editor',
        onConfirm: () => navigateToPage('header-global'),
      });
    } else {
      navigateToPage('header-global');
    }
  };

  const handleFooterClick = () => {
    if (pagesNavLevel === 'page-detail' && selectedPageId !== 'footer-global') {
      requestEditorSwitch({
        targetPageId: 'footer-global',
        targetName: 'Footer Editor',
        onConfirm: () => navigateToPage('footer-global'),
      });
    } else {
      navigateToPage('footer-global');
    }
  };

  // Split root-level blocks into:
  // 1. Inner blocks for "Product information" (Media & Buy Box blocks, or groups inside product info)
  // 2. Outer blocks / Template sections (Description, Specs, Features, FAQ, etc. below Product information)
  const rootBlocks = activeTemplate.blocks.filter((b) => !b.parentId);
  const productInfoBlocks = rootBlocks.filter((b) => isProductInfoBlock(b));
  const templateSections = rootBlocks.filter((b) => isTemplateSection(b));

  const isProductInfoExpanded = expandedBlockIds.includes('section-product-info');
  const isProductInfoSelected = selectedBlockId === 'section-product-info';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        userSelect: 'none',
        boxSizing: 'border-box',
      }}
    >
      {/* ── Top Single Template Dropdown Bar (Minimal & Professional) ── */}
      <div
        style={{
          position: 'relative',
          padding: '8px 10px',
          borderBottom: '1px solid #e2e8f0',
          background: '#ffffff',
          boxSizing: 'border-box',
          flexShrink: 0,
        }}
      >
        <button
          ref={triggerButtonRef}
          type="button"
          onClick={() => {
            setIsWidgetOpen((prev) => !prev);
            setWidgetView('templates');
            setViewingTemplateId(activeTemplateId);
            setSearchQuery('');
            setIsCreatingTemplate(false);
          }}
          style={{
            width: '100%',
            height: '32px',
            padding: '0 8px',
            borderRadius: '6px',
            border: isWidgetOpen ? '1px solid #2563eb' : '1px solid #e2e8f0',
            background: isWidgetOpen ? '#eff6ff' : '#ffffff',
            color: '#0f172a',
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: isWidgetOpen ? '0 0 0 2px rgba(37,99,235,0.1)' : 'none',
            transition: 'all 0.12s ease',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, overflow: 'hidden' }}>
            <Layout size={13} color="#2563eb" style={{ flexShrink: 0 }} />
            <span
              style={{
                fontWeight: 600,
                color: '#0f172a',
                fontSize: '12px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={activeTemplate.name}
            >
              {activeTemplate.name}
            </span>
            {!activeTemplate.isDefault && (
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 600,
                  color: '#047857',
                  background: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  padding: '1px 4px',
                  borderRadius: '3px',
                  flexShrink: 0,
                }}
              >
                Custom
              </span>
            )}
          </div>
          <ChevronDown
            size={13}
            color="#64748b"
            style={{
              flexShrink: 0,
              transform: isWidgetOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.15s ease',
              marginLeft: '4px',
            }}
          />
        </button>
      </div>

      {/* ── Minimal & Professional Floating Template Widget (Portal) ── */}
      {isWidgetOpen &&
        createPortal(
          <>
            {/* Backdrop overlay for outside clicks */}
            <div
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 99998,
                backgroundColor: 'rgba(15, 23, 42, 0.12)',
              }}
              onClick={() => {
                setIsWidgetOpen(false);
                setIsCreatingTemplate(false);
              }}
            />

            {/* Floating Widget Container — compact and aligned */}
            <div
              style={{
                position: 'fixed',
                top: `${widgetCoords.top}px`,
                left: `${widgetCoords.left}px`,
                width: `${widgetCoords.width}px`,
                maxHeight: `${widgetCoords.maxHeight}px`,
                zIndex: 99999,
                backgroundColor: '#ffffff',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                boxShadow: '0 12px 30px -5px rgba(15, 23, 42, 0.20), 0 4px 10px -2px rgba(15, 23, 42, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxSizing: 'border-box',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 1. AVAILABLE TEMPLATES VIEW */}
              {widgetView === 'templates' && (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: `${widgetCoords.maxHeight}px` }}>
                  {/* Header */}
                  <div
                    style={{
                      padding: '10px 12px',
                      borderBottom: '1px solid #f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#f8fafc',
                      flexShrink: 0,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Layout size={15} color="#2563eb" />
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                        PDP Templates
                      </span>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          color: '#64748b',
                          backgroundColor: '#e2e8f0',
                          padding: '1px 6px',
                          borderRadius: '9999px',
                        }}
                      >
                        {templates.length}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsWidgetOpen(false)}
                      style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        color: '#64748b',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>

                  {/* Templates List */}
                  <div
                    style={{
                      flex: 1,
                      overflowY: 'auto',
                      padding: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '5px',
                    }}
                  >
                    {templates.map((t) => {
                      const assigned = getAssignedProductsForTemplate(t.id);
                      const isCurrentActive = t.id === activeTemplateId;
                      return (
                        <div
                          key={t.id}
                          onClick={() => {
                            setViewingTemplateId(t.id);
                            setWidgetView('products');
                            setSearchQuery('');
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 10px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            backgroundColor: isCurrentActive ? '#eff6ff' : '#ffffff',
                            border: isCurrentActive ? '1px solid #bfdbfe' : '1px solid #f1f5f9',
                            transition: 'all 0.12s ease',
                          }}
                          onMouseEnter={(e) => {
                            if (!isCurrentActive) {
                              e.currentTarget.style.backgroundColor = '#f8fafc';
                              e.currentTarget.style.borderColor = '#e2e8f0';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isCurrentActive) {
                              e.currentTarget.style.backgroundColor = '#ffffff';
                              e.currentTarget.style.borderColor = '#f1f5f9';
                            }
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                            <div
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '5px',
                                backgroundColor: isCurrentActive ? '#dbeafe' : '#f1f5f9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              <Layout size={14} color={isCurrentActive ? '#2563eb' : '#64748b'} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <span
                                  style={{
                                    fontSize: '12.5px',
                                    fontWeight: 600,
                                    color: isCurrentActive ? '#1e40af' : '#0f172a',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                  }}
                                >
                                  {t.name}
                                </span>
                                {t.isDefault && (
                                  <span
                                    style={{
                                      fontSize: '9.5px',
                                      fontWeight: 600,
                                      backgroundColor: '#dbeafe',
                                      color: '#1d4ed8',
                                      padding: '1px 4px',
                                      borderRadius: '3px',
                                    }}
                                  >
                                    Default
                                  </span>
                                )}
                              </div>
                              <span style={{ fontSize: '10.5px', color: '#64748b' }}>
                                {t.isDefault ? `${assigned.length} products (all)` : `${assigned.length} product${assigned.length === 1 ? '' : 's'}`}
                              </span>
                            </div>
                          </div>

                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              color: isCurrentActive ? '#2563eb' : '#94a3b8',
                              fontSize: '11px',
                              fontWeight: 500,
                              flexShrink: 0,
                            }}
                          >
                            <span>Products</span>
                            <ChevronRight size={13} />
                          </div>
                        </div>
                      );
                    })}

                    {/* Add Template Section */}
                    {isCreatingTemplate ? (
                      <div
                        style={{
                          padding: '10px',
                          backgroundColor: '#f8fafc',
                          borderRadius: '6px',
                          border: '1px solid #bfdbfe',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          marginTop: '2px',
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Template name..."
                          value={newTemplateName}
                          autoFocus
                          onChange={(e) => setNewTemplateName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newTemplateName.trim()) {
                              const newId = createTemplate(newTemplateName.trim());
                              setViewingTemplateId(newId);
                              setWidgetView('products');
                              setIsCreatingTemplate(false);
                              setNewTemplateName('');
                            } else if (e.key === 'Escape') {
                              setIsCreatingTemplate(false);
                              setNewTemplateName('');
                            }
                          }}
                          style={{
                            width: '100%',
                            padding: '6px 8px',
                            fontSize: '12px',
                            borderRadius: '4px',
                            border: '1px solid #cbd5e1',
                            outline: 'none',
                            boxSizing: 'border-box',
                          }}
                        />
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setIsCreatingTemplate(false);
                              setNewTemplateName('');
                            }}
                            style={{
                              padding: '4px 10px',
                              fontSize: '11px',
                              borderRadius: '4px',
                              border: '1px solid #cbd5e1',
                              backgroundColor: '#ffffff',
                              color: '#475569',
                              cursor: 'pointer',
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (!newTemplateName.trim()) return;
                              const newId = createTemplate(newTemplateName.trim());
                              setViewingTemplateId(newId);
                              setWidgetView('products');
                              setIsCreatingTemplate(false);
                              setNewTemplateName('');
                            }}
                            style={{
                              padding: '4px 12px',
                              fontSize: '11px',
                              fontWeight: 600,
                              borderRadius: '4px',
                              border: 'none',
                              backgroundColor: '#2563eb',
                              color: '#ffffff',
                              cursor: 'pointer',
                            }}
                          >
                            Create
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreatingTemplate(true);
                          setNewTemplateName('');
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '8px',
                          borderRadius: '6px',
                          border: '1px dashed #cbd5e1',
                          backgroundColor: '#f8fafc',
                          color: '#2563eb',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.12s ease',
                          marginTop: '2px',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#eff6ff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8fafc';
                        }}
                      >
                        <Plus size={14} />
                        <span>Add template</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* 2. ASSIGNED PRODUCTS VIEW */}
              {widgetView === 'products' && (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: `${widgetCoords.maxHeight}px` }}>
                  {/* Header */}
                  <div
                    style={{
                      padding: '8px 10px',
                      borderBottom: '1px solid #f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#f8fafc',
                      flexShrink: 0,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                      <button
                        type="button"
                        onClick={() => setWidgetView('templates')}
                        style={{
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          color: '#475569',
                          display: 'flex',
                          alignItems: 'center',
                          borderRadius: '4px',
                        }}
                        title="Back to templates"
                      >
                        <ArrowLeft size={14} />
                      </button>
                      <div style={{ minWidth: 0 }}>
                        <span
                          style={{
                            fontSize: '12.5px',
                            fontWeight: 700,
                            color: '#0f172a',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {viewingTemplate.name}
                        </span>
                        <span style={{ fontSize: '10px', color: '#64748b', marginLeft: '6px' }}>
                          ({viewingAssignedProducts.length})
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setWidgetView('assign-products');
                          setSearchQuery('');
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 8px',
                          fontSize: '11px',
                          fontWeight: 600,
                          borderRadius: '4px',
                          border: '1px solid #bfdbfe',
                          backgroundColor: '#eff6ff',
                          color: '#2563eb',
                          cursor: 'pointer',
                        }}
                      >
                        <Plus size={11} />
                        <span>Assign</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsWidgetOpen(false)}
                        style={{
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          color: '#64748b',
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div style={{ padding: '6px 8px', borderBottom: '1px solid #f1f5f9', backgroundColor: '#ffffff', flexShrink: 0 }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <Search size={13} style={{ position: 'absolute', left: '8px', color: '#94a3b8' }} />
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '5px 24px 5px 26px',
                          fontSize: '11.5px',
                          borderRadius: '5px',
                          border: '1px solid #cbd5e1',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          style={{
                            position: 'absolute',
                            right: '6px',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            padding: '2px',
                            color: '#94a3b8',
                          }}
                        >
                          <X size={11} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Assigned Products List */}
                  <div
                    style={{
                      flex: 1,
                      overflowY: 'auto',
                      padding: '6px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    {filteredAssignedProducts.length === 0 ? (
                      <div style={{ padding: '24px 10px', textAlign: 'center', color: '#64748b', fontSize: '11.5px' }}>
                        {searchQuery ? 'No matching products.' : 'No products assigned yet.'}
                      </div>
                    ) : (
                      filteredAssignedProducts.map((p) => {
                        const isCurrentPreview =
                          selectedProductId === p.id && activeTemplateId === viewingTemplate.id;
                        return (
                          <div
                            key={p.id}
                            onClick={() => {
                              selectTemplate(viewingTemplate.id);
                              selectProduct(p.id);
                              setIsWidgetOpen(false);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '6px 8px',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              backgroundColor: isCurrentPreview ? '#eff6ff' : '#ffffff',
                              border: isCurrentPreview ? '1px solid #bfdbfe' : '1px solid #f1f5f9',
                              transition: 'all 0.1s ease',
                            }}
                            onMouseEnter={(e) => {
                              if (!isCurrentPreview) e.currentTarget.style.backgroundColor = '#f8fafc';
                            }}
                            onMouseLeave={(e) => {
                              if (!isCurrentPreview) e.currentTarget.style.backgroundColor = '#ffffff';
                            }}
                          >
                            <img
                              src={p.images[0] || 'https://via.placeholder.com/32'}
                              alt={p.name}
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '4px',
                                objectFit: 'cover',
                                border: '1px solid #e2e8f0',
                                flexShrink: 0,
                              }}
                            />
                            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                              <span
                                style={{
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  color: isCurrentPreview ? '#1d4ed8' : '#0f172a',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                                title={p.name}
                              >
                                {p.name}
                              </span>
                              <span style={{ fontSize: '10.5px', color: '#64748b' }}>
                                ${p.price.toFixed(2)} • {p.category || 'General'}
                              </span>
                            </div>
                            {isCurrentPreview && (
                              <span
                                style={{
                                  fontSize: '9.5px',
                                  color: '#16a34a',
                                  backgroundColor: '#dcfce7',
                                  padding: '1px 5px',
                                  borderRadius: '3px',
                                  fontWeight: 600,
                                  flexShrink: 0,
                                }}
                              >
                                Active
                              </span>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* 3. ASSIGN PRODUCTS VIEW */}
              {widgetView === 'assign-products' && (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: `${widgetCoords.maxHeight}px` }}>
                  {/* Header */}
                  <div
                    style={{
                      padding: '8px 10px',
                      borderBottom: '1px solid #f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#f8fafc',
                      flexShrink: 0,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                      <button
                        type="button"
                        onClick={() => {
                          setWidgetView('products');
                          setSearchQuery('');
                        }}
                        style={{
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          color: '#475569',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        title="Back to assigned products"
                      >
                        <ArrowLeft size={14} />
                      </button>
                      <div style={{ minWidth: 0 }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                          Assign to {viewingTemplate.name}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsWidgetOpen(false)}
                      style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        color: '#64748b',
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div style={{ padding: '6px 8px', borderBottom: '1px solid #f1f5f9', backgroundColor: '#ffffff', flexShrink: 0 }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <Search size={13} style={{ position: 'absolute', left: '8px', color: '#94a3b8' }} />
                      <input
                        type="text"
                        placeholder="Search all products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '5px 24px 5px 26px',
                          fontSize: '11.5px',
                          borderRadius: '5px',
                          border: '1px solid #cbd5e1',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>

                  {/* All Products List with Assignment */}
                  <div
                    style={{
                      flex: 1,
                      overflowY: 'auto',
                      padding: '6px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    {filteredAllProducts.map((p) => {
                      const currentTmpl = resolveTemplateForProduct(p);
                      const isAlreadyAssigned = currentTmpl.id === viewingTemplate.id;

                      return (
                        <div
                          key={p.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 8px',
                            borderRadius: '5px',
                            backgroundColor: isAlreadyAssigned ? '#f8fafc' : '#ffffff',
                            border: '1px solid #f1f5f9',
                          }}
                        >
                          <img
                            src={p.images[0] || 'https://via.placeholder.com/32'}
                            alt={p.name}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '4px',
                              objectFit: 'cover',
                              border: '1px solid #e2e8f0',
                              flexShrink: 0,
                            }}
                          />
                          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                            <span
                              style={{
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#0f172a',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                              title={p.name}
                            >
                              {p.name}
                            </span>
                            <span style={{ fontSize: '10.5px', color: '#64748b' }}>
                              In: {currentTmpl.name}
                            </span>
                          </div>
                          {isAlreadyAssigned ? (
                            <span
                              style={{
                                fontSize: '10.5px',
                                color: '#16a34a',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '3px',
                                fontWeight: 600,
                                flexShrink: 0,
                              }}
                            >
                              <Check size={12} />
                              <span>Assigned</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleInitiateAssign(p)}
                              style={{
                                padding: '3px 9px',
                                fontSize: '11px',
                                fontWeight: 600,
                                borderRadius: '4px',
                                border: '1px solid #2563eb',
                                backgroundColor: '#eff6ff',
                                color: '#2563eb',
                                cursor: 'pointer',
                                flexShrink: 0,
                              }}
                            >
                              Assign
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </>,
          document.body
        )}

      {/* Confirmation Dialog for Product Assignment (Portal) */}
      {reassignModal.isOpen &&
        reassignModal.product &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100000,
              backgroundColor: 'rgba(15, 23, 42, 0.45)',
              backdropFilter: 'blur(1px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              boxSizing: 'border-box',
            }}
            onClick={() =>
              setReassignModal({
                isOpen: false,
                product: null,
                targetTemplateId: '',
                targetTemplateName: '',
                sourceTemplateName: '',
              })
            }
          >
            <div
              style={{
                width: '100%',
                maxWidth: '360px',
                backgroundColor: '#ffffff',
                borderRadius: '10px',
                padding: '18px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
                border: '1px solid #e2e8f0',
                boxSizing: 'border-box',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#fef3c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#d97706',
                    flexShrink: 0,
                  }}
                >
                  <AlertCircle size={18} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                    Reassign Product?
                  </h4>
                </div>
              </div>

              <p style={{ margin: '0 0 14px 0', fontSize: '12.5px', color: '#475569', lineHeight: 1.5 }}>
                Assign <strong style={{ color: '#0f172a' }}>"{reassignModal.product.name}"</strong> to{' '}
                <strong style={{ color: '#2563eb' }}>"{reassignModal.targetTemplateName}"</strong>? It will use this custom layout in the store.
              </p>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() =>
                    setReassignModal({
                      isOpen: false,
                      product: null,
                      targetTemplateId: '',
                      targetTemplateName: '',
                      sourceTemplateName: '',
                    })
                  }
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 500,
                    borderRadius: '5px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#475569',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReassign}
                  style={{
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: 600,
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ── Scrollable Component Tree Area (Matches Footer Tree Exactly) ── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px 6px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* ── Global Header Row ── */}
        <div
          onClick={handleHeaderClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            minHeight: '38px',
            marginBottom: '6px',
            borderRadius: '6px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            cursor: 'pointer',
            transition: 'all 0.12s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#2563eb';
            e.currentTarget.style.background = '#f8fafc';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.background = '#ffffff';
          }}
          title="Switch to Header Editor"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <Folder size={16} color="#475467" />
            <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#334155' }}>Header</span>
            <span style={{ fontSize: '11px', color: '#64748b', background: '#f1f5f9', padding: '2px 7px', borderRadius: '4px' }}>Global</span>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            OUTER CONTAINER 1: PRODUCT INFORMATION
            ══════════════════════════════════════════════════════════ */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            minHeight: 40,
            padding: '0 12px',
            borderRadius: 6,
            background: isProductInfoSelected ? '#eff6ff' : 'transparent',
            borderLeft: isProductInfoSelected ? '3px solid #2563eb' : '3px solid transparent',
            transition: 'all 0.12s ease',
          }}
        >
          <button
            type="button"
            aria-expanded={isProductInfoExpanded}
            aria-label={isProductInfoExpanded ? 'Collapse Product Section' : 'Expand Product Section'}
            onClick={() => toggleBlockExpanded('section-product-info')}
            style={{
              width: 20,
              height: 22,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 0,
              background: 'transparent',
              color: '#667085',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            {isProductInfoExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          </button>
          <button
            type="button"
            onClick={() => {
              if (isProductInfoSelected) {
                selectBlock(null);
                setRightSidebarOpen(false);
              } else {
                selectBlock('section-product-info');
                setRightSidebarOpen(true);
                if (!isProductInfoExpanded) {
                  toggleBlockExpanded('section-product-info');
                }
              }
            }}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              minWidth: 0,
              border: 0,
              background: 'transparent',
              padding: '6px 0',
              color: isProductInfoSelected ? '#1d4ed8' : '#202223',
              textAlign: 'left',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {isProductInfoExpanded ? (
              <FolderOpen size={18} color={isProductInfoSelected ? '#2563eb' : '#475467'} />
            ) : (
              <Folder size={18} color={isProductInfoSelected ? '#2563eb' : '#475467'} />
            )}
            <span>Product Section</span>
            <span
              style={{
                fontSize: '11px',
                padding: '1px 6px',
                borderRadius: '4px',
                background: isProductInfoSelected ? '#dbeafe' : '#f1f5f9',
                color: isProductInfoSelected ? '#1d4ed8' : '#475569',
                fontWeight: 600,
                marginLeft: 'auto',
              }}
            >
              Section
            </span>
          </button>
        </div>

        {/* Indented ⊕ Add block directly below Product information */}
        {isProductInfoExpanded && (
          <>
            <button
              type="button"
              onClick={() => openComponentLibrary('inside', 'section-product-info', 'block')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                alignSelf: 'flex-start',
                margin: '2px 0 6px 34px',
                padding: '6px 10px',
                border: 0,
                borderRadius: 5,
                background: 'transparent',
                color: '#2563eb',
                fontSize: 13,
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

            {/* Inner blocks inside Product information */}
            {productInfoBlocks.map((node, rIdx) => (
              <React.Fragment key={node.id}>
                <InsertDivider
                  parentId={null}
                  targetIndex={rIdx}
                  depth={1}
                  targetBlockId={node.id}
                  insertPosition="above"
                  insertMode="block"
                />
                <TreeNodeRow node={node} depth={1} parentId={null} siblings={productInfoBlocks} />
              </React.Fragment>
            ))}
            <InsertDivider
              parentId={null}
              targetIndex={productInfoBlocks.length}
              depth={1}
              targetBlockId={productInfoBlocks[productInfoBlocks.length - 1]?.id}
              insertPosition="below"
              insertMode="block"
            />
          </>
        )}

        {/* ══════════════════════════════════════════════════════════
            OUTER BLOCKS: TEMPLATE SECTIONS (PAGE SECTIONS BELOW)
            ══════════════════════════════════════════════════════════ */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '14px 12px 6px',
            marginTop: '10px',
            borderTop: '1px solid #e2e8f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>
              Template Sections
            </span>
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>
              ({templateSections.length})
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {templateSections.map((section, sIdx) => (
            <React.Fragment key={section.id}>
              <InsertDivider
                parentId={null}
                targetIndex={productInfoBlocks.length + sIdx}
                depth={0}
                targetBlockId={section.id}
                insertPosition="above"
                insertMode="section"
              />
              <TreeNodeRow node={section} depth={0} parentId={null} siblings={templateSections} />
            </React.Fragment>
          ))}
          <InsertDivider
            parentId={null}
            targetIndex={productInfoBlocks.length + templateSections.length}
            depth={0}
            targetBlockId={templateSections[templateSections.length - 1]?.id}
            insertPosition="below"
            insertMode="section"
          />
        </div>

        {/* ── Bottom ⊕ Add Section Button ── */}
        <div style={{ padding: '8px 4px 6px', marginTop: '6px' }}>
          <button
            type="button"
            onClick={() => openComponentLibrary('bottom', undefined, 'section')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '9px 14px',
              borderRadius: '6px',
              border: '1px dashed #cbd5e1',
              background: '#f8fafc',
              color: '#2563eb',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#2563eb';
              e.currentTarget.style.background = '#eff6ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.background = '#f8fafc';
            }}
          >
            <PlusCircle size={16} color="#2563eb" />
            <span>Add Section</span>
          </button>
        </div>

        {/* ── Global Footer Row ── */}
        <div
          onClick={handleFooterClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            minHeight: '38px',
            marginTop: '6px',
            marginBottom: '14px',
            borderRadius: '6px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            cursor: 'pointer',
            transition: 'all 0.12s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#2563eb';
            e.currentTarget.style.background = '#f8fafc';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.background = '#ffffff';
          }}
          title="Switch to Footer Editor"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <Folder size={16} color="#475467" />
            <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#334155' }}>Footer</span>
            <span style={{ fontSize: '11px', color: '#64748b', background: '#f1f5f9', padding: '2px 7px', borderRadius: '4px' }}>Global</span>
          </div>
        </div>
      </div>

      {/* Component Library Overlay Modal */}
      <PdpComponentLibraryModal />

      {/* Template Manager Modal */}
      <PdpTemplateManagerModal />
    </div>
  );
};
