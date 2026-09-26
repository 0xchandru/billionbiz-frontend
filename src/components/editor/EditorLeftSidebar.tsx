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
  LayoutGrid, Tag, Gift, CheckCircle2, List, ChevronRight, User,
  Mail,
} from 'lucide-react';
import { BrandPanel } from './panels/BrandPanel';
import { DesignPanel } from './panels/DesignPanel';
import { SettingsPanel } from './panels/SettingsPanel';
import { ComponentTreePanel } from './engine/ComponentTreePanel';
import { useEditorContextStore } from '../../store/editorContextStore';
import { scrollPreviewToHeaderSection, scrollPreviewToFooterSection } from './utils/previewScroll';

import { useLandingEditorStore } from '../../store/landingEditorStore';
import { useSiteStore } from '../../store/siteStore';
import { getPageConfig } from './pageConfigs';
import { SortableItem } from './SortableItem';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import styles from '../../pages/editor/EditorLayout.module.css';
import type { EditorPanelType } from '../../store/landingEditorStore';
import { getEditorPath, resolveHeaderRowId, resolveFooterRowId } from './utils/editorNavigation';

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
  const { pages, toggleSectionVisibility, removeSection, updatePageProps } = useSiteStore();
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
      if (context.selectedTarget.type !== 'element') {
        const currentSectionId = useLandingEditorStore.getState().selectedSectionId;
        const targetRowId = resolveFooterRowId(currentSectionId, context.footerRows);
        context.selectTarget({ type: 'row', editorType: 'footer', rowId: targetRowId });
      }
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

  // Search state in Pages tab
  const [pageSearch, setPageSearch] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !activePage) return;

    const sections = [...activePage.sections];
    const activeSection = sections.find(s => s.id === active.id);
    const overSection = sections.find(s => s.id === over.id);
    if (!activeSection || !overSection) return;

    if (activeSection.type === 'Header' || isFooterMain(activeSection.type)) return;

    const isHeaderBar = headerBarTypes.includes(activeSection.type);
    const isFooterBar = footerBarTypes.includes(activeSection.type);
    const isTemplate = !isHeaderBar && !isFooterBar;

    if (isHeaderBar) {
      const currentBars = sections.filter(s => headerBarTypes.includes(s.type));
      const oldBarIndex = currentBars.findIndex(s => s.id === active.id);
      let newBarIndex = currentBars.findIndex(s => s.id === over.id);
      if (overSection.type === 'Header' || newBarIndex === -1) newBarIndex = currentBars.length - 1;
      if (oldBarIndex !== -1 && newBarIndex !== -1 && oldBarIndex !== newBarIndex) {
        const reordered = Array.from(currentBars);
        const [removed] = reordered.splice(oldBarIndex, 1);
        reordered.splice(newBarIndex, 0, removed);
        const header = sections.find(s => s.type === 'Header');
        const otherSections = sections.filter(s => !headerBarTypes.includes(s.type) && s.type !== 'Header');
        updatePageProps(activePage.id, { sections: [...reordered, ...(header ? [header] : []), ...otherSections] });
      }
      return;
    }

    if (isFooterBar) {
      const currentBars = sections.filter(s => footerBarTypes.includes(s.type));
      const oldBarIndex = currentBars.findIndex(s => s.id === active.id);
      let newBarIndex = currentBars.findIndex(s => s.id === over.id);
      if (isFooterMain(overSection.type) || newBarIndex === -1) newBarIndex = currentBars.length - 1;
      if (oldBarIndex !== -1 && newBarIndex !== -1 && oldBarIndex !== newBarIndex) {
        const reordered = Array.from(currentBars);
        const [removed] = reordered.splice(oldBarIndex, 1);
        reordered.splice(newBarIndex, 0, removed);
        const nonFooterSections = sections.filter(s => !footerBarTypes.includes(s.type) && !isFooterMain(s.type));
        const footer = sections.find(s => isFooterMain(s.type));
        updatePageProps(activePage.id, { sections: [...nonFooterSections, ...reordered, ...(footer ? [footer] : [])] });
      }
      return;
    }

    if (isTemplate) {
      const currentTemplate = sections.filter(
        s => !headerBarTypes.includes(s.type) && s.type !== 'Header' && !footerBarTypes.includes(s.type) && !isFooterMain(s.type)
      );
      const oldTemplateIndex = currentTemplate.findIndex(s => s.id === active.id);
      let newTemplateIndex = currentTemplate.findIndex(s => s.id === over.id);
      if (headerBarTypes.includes(overSection.type) || overSection.type === 'Header') newTemplateIndex = 0;
      else if (footerBarTypes.includes(overSection.type) || isFooterMain(overSection.type)) newTemplateIndex = currentTemplate.length - 1;
      if (oldTemplateIndex !== -1 && newTemplateIndex !== -1 && oldTemplateIndex !== newTemplateIndex) {
        const reordered = Array.from(currentTemplate);
        const [removed] = reordered.splice(oldTemplateIndex, 1);
        reordered.splice(newTemplateIndex, 0, removed);
        const headerSections = sections.filter(s => headerBarTypes.includes(s.type) || s.type === 'Header');
        const footerSections = sections.filter(s => footerBarTypes.includes(s.type) || isFooterMain(s.type));
        updatePageProps(activePage.id, { sections: [...headerSections, ...reordered, ...footerSections] });
      }
    }
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
      if (selectedPageId === 'header-global' || selectedPageId === 'footer-global') {
        const isHeaderEditor = selectedPageId === 'header-global';
        return (
          <div className={styles.contextPanelInner} style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            {renderEditorDetailHeader(
              isHeaderEditor ? 'Header Editor' : 'Footer Editor',
              isHeaderEditor ? 'Universal Storefront Header' : 'Universal Storefront Footer'
            )}
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              <ComponentTreePanel editorType={isHeaderEditor ? 'header' : 'footer'} />
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
                        let targetRowId = 'row-main-nav';
                        let targetSectionId = 'footer-main';

                        navigateToPage('footer-global', targetSectionId);
                        navigate(getEditorPath('footer-global', targetSectionId));
                        useEditorContextStore.getState().setEditorType('footer');

                        setSelectedSectionId(targetSectionId);
                        useEditorContextStore.getState().selectTarget({
                          type: 'row',
                          editorType: 'footer',
                          rowId: targetRowId,
                        });
                        setRightSidebarOpen(true);
                        scrollPreviewToFooterSection(targetRowId);
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

  // ─── PAGE DETAIL VIEW ───
  const renderPageDetailView = () => {
    if (!activePage) return null;

    const isHomepage = activePage.id === 'landing-page';

    // ─── HOMEPAGE ONLY: Render template sections list with DnD and gap ───
    if (isHomepage) {
      const templateSections = activePage.sections.filter(
        s => !headerBarTypes.includes(s.type) && s.type !== 'Header' && !footerBarTypes.includes(s.type) && !isFooterMain(s.type)
      );

      return (
        <div className={styles.contextPanelInner}>
          {renderEditorDetailHeader(activePage.name, activePage.path)}

          {/* Section List (Template sections only) */}
          <div className={styles.contextPanelScroll}>
            <div className={styles.sectionGroupWrapper}>
              <div className={styles.sectionGroupTitle}>
                <span>Homepage Sections ({templateSections.length})</span>
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                modifiers={[restrictToVerticalAxis]}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={templateSections.map(s => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {templateSections.map((section, idx) => {
                    const storeIndex = activePage.sections.findIndex(s => s.id === section.id);
                    return (
                      <SortableItem
                        key={section.id}
                        id={section.id}
                        section={section}
                        isSelected={selectedSectionId === section.id && isRightSidebarOpen}
                        onSelect={() => {
                          setSelectedSectionId(section.id);
                          setRightSidebarOpen(true);
                          navigate(getEditorPath(activePage.id, section.id), { replace: true });
                        }}
                        onToggleVisibility={(e) => {
                          e.stopPropagation();
                          toggleSectionVisibility(activePage.id, section.id);
                        }}
                        onRemove={(e) => {
                          e.stopPropagation();
                          setSectionToDelete(section.id);
                        }}
                        onInsertClick={() => {
                          useLandingEditorStore.getState().setInsertIndex(storeIndex + 1);
                          setAddSectionWidgetOpen(true);
                        }}
                        onMoveUp={idx > 0 ? () => moveTemplateSection(section.id, 'up') : undefined}
                        onMoveDown={idx < templateSections.length - 1 ? () => moveTemplateSection(section.id, 'down') : undefined}
                      />
                    );
                  })}
                </SortableContext>
              </DndContext>
            </div>
          </div>

          <div className={styles.stickyAddSection}>
            <button
              className={`btn btn-primary ${styles.addSectionBtn}`}
              onClick={() => {
                useLandingEditorStore.getState().setInsertIndex(activePage.sections.length);
                setAddSectionWidgetOpen(true);
              }}
            >
              <Plus size={16} />
              Add Section
            </button>
          </div>
        </div>
      );
    }

    const pageConfig = getPageConfig(activePage.type) || getPageConfig(activePage.id.replace('-page', ''));
    const defaultFallbackLayouts = [
      { id: 'standard', label: 'Standard Template', description: 'Clean balanced layout with core page components' },
      { id: 'full-width', label: 'Full Width Template', description: 'Expansive edge-to-edge layout design' },
      { id: 'minimal', label: 'Minimalist Template', description: 'Focused, distraction-free streamlined layout' },
      { id: 'split', label: 'Modern Split Template', description: 'Dynamic asymmetrical visual layout' },
    ];
    const layouts = (pageConfig?.layouts && pageConfig.layouts.length > 0) ? pageConfig.layouts : defaultFallbackLayouts;
    const currentLayoutId = activePage.pageProps?._selectedLayout || activePage.pageProps?.selectedLayout || activePage.pageProps?.layout || layouts[0]?.id;

    return (
      <div className={styles.contextPanelInner}>
        {renderEditorDetailHeader(activePage.name, activePage.path)}

        <div className={styles.contextPanelScroll}>
          {/* Templates Section Header */}
          <div style={{ padding: '12px 16px 6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', display: 'block' }}>
              Layout Templates ({layouts.length})
            </span>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>Click to apply layout</span>
          </div>

          {/* Templates Grid / Cards */}
          <div style={{ padding: '0 16px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {layouts.map((layout) => {
              const isSelected = currentLayoutId === layout.id;
              return (
                <div
                  key={layout.id}
                  onClick={() => {
                    updatePageProps(activePage.id, {
                      pageProps: {
                        ...(activePage.pageProps || {}),
                        _selectedLayout: layout.id,
                        selectedLayout: layout.id,
                        layout: layout.id,
                      }
                    });
                  }}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: isSelected ? '2px solid #0f172a' : '1px solid #e2e8f0',
                    backgroundColor: isSelected ? '#f8fafc' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: layout.description ? '4px' : '0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        backgroundColor: isSelected ? '#0f172a' : '#f1f5f9',
                        color: isSelected ? '#ffffff' : '#475569',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Layout size={13} />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: isSelected ? '#0f172a' : '#334155' }}>
                        {layout.label}
                      </span>
                    </div>
                    {isSelected && (
                      <span style={{
                        fontSize: '9px',
                        fontWeight: 700,
                        color: '#0f172a',
                        backgroundColor: '#e2e8f0',
                        padding: '1px 5px',
                        borderRadius: '4px',
                      }}>
                        Active
                      </span>
                    )}
                  </div>
                  {layout.description && (
                    <p style={{ margin: 0, fontSize: '11px', color: '#64748b', lineHeight: 1.35, paddingLeft: '32px' }}>
                      {layout.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sticky Fixed Bottom Customizer Button */}
        <div className={styles.stickyPageCustomizeFooter}>
          <button
            onClick={() => setRightSidebarOpen(!isRightSidebarOpen)}
            className={`${styles.customizePageBtn} ${isRightSidebarOpen ? styles.customizePageBtnActive : ''}`}
            title={isRightSidebarOpen ? "Right Panel Editor is open" : "Open Right Panel Editor"}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              <span className={styles.customizePageTitle}>
                {isRightSidebarOpen ? 'Right Panel Editor Active' : 'Open Right Panel Editor'}
              </span>
              <span className={styles.customizePageSubtitle}>
                {isRightSidebarOpen ? 'Click to toggle right panel' : 'Customize typography, fields & styling'}
              </span>
            </div>
            <ChevronRight
              size={15}
              color="#64748b"
              style={{
                flexShrink: 0,
                marginLeft: '6px',
                transform: isRightSidebarOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease'
              }}
            />
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
