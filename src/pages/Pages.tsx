import React, { useState } from 'react';
import { 
  Trash2, 
  Plus, 
  Edit2, 
  ExternalLink,
  Package,
  ShoppingCart,
  User,
  UserPlus,
  Mail,
  Shield,
  FileText,
  RotateCcw,
  ChevronRight,
  Rocket,
  Home,
  AlertTriangle,
  LayoutGrid,
  Heart,
  Tag,
  Calendar,
  CheckCircle2,
  Gift,
  List,
  Truck,
  Lock,
  Building2,
  Phone,
  Layers,
  Bell,
  Cookie,
  ArrowRight,
  Search,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './Pages.module.css';
import { getEditorPath } from '../components/editor/utils/editorNavigation';

interface PageCardDef {
  id: string;
  title: string;
  desc: string;
  icon: React.FC<{ size?: number }>;
  color: string;
  bgColor: string;
  badge?: string;
  path?: string;
}

interface PageGroupDef {
  id: string;
  title: string;
  count: number;
  pages: PageCardDef[];
  showDividerAbove?: boolean;
}

const PAGE_GROUPS: PageGroupDef[] = [
  {
    id: 'home',
    title: 'Home',
    count: 2,
    pages: [
      { id: 'landing-page', title: 'Landing page', desc: 'Main storefront homepage with hero banner and featured collections.', icon: Home, color: '#2563eb', bgColor: '#eff6ff', path: '/' },
      { id: 'maintenance-page', title: 'Maintenance', desc: 'Maintenance countdown notice and scheduled downtime announcements.', icon: AlertTriangle, color: '#d97706', bgColor: '#fef3c7', path: '/maintenance' },
    ],
  },
  {
    id: 'browse',
    title: 'Browse',
    count: 3,
    pages: [
      { id: 'product-details-page', title: 'Product Detail', desc: 'Showcase detailed product gallery, variants, and purchase actions.', icon: Package, color: '#16a34a', bgColor: '#f0fdf4', path: '/products/:slug' },
      { id: 'shop-page', title: 'Product Listing', desc: 'Browse full store collection with facet filters and price sorting.', icon: LayoutGrid, color: '#16a34a', bgColor: '#f0fdf4', path: '/collections/all' },
      { id: 'wishlist-page', title: 'Wishlist', desc: 'Customer saved favorite products with quick move-to-cart.', icon: Heart, color: '#ec4899', bgColor: '#fdf2f8', path: '/wishlist' },
    ],
  },
  {
    id: 'buy',
    title: 'Buy',
    count: 3,
    pages: [
      { id: 'cart-page', title: 'Cart', desc: 'Shopping cart item overview, quantity counters, and subtotal calculation.', icon: ShoppingCart, color: '#2563eb', bgColor: '#eff6ff', path: '/cart' },
      { id: 'checkout-page', title: 'Checkout', desc: 'Optimized checkout flow with delivery addresses and secure payments.', icon: Tag, color: '#16a34a', bgColor: '#f0fdf4', path: '/checkout' },
      { id: 'booking-page', title: 'Booking', desc: 'Appointment booking and service reservation calendar.', icon: Calendar, color: '#8b5cf6', bgColor: '#f5f3ff', path: '/booking' },
    ],
  },
  {
    id: 'complete',
    title: 'Complete',
    count: 5,
    pages: [
      { id: 'order-confirmation-page', title: 'Order Confirmation', desc: 'Instant order verification, payment summary, and printable receipt.', icon: CheckCircle2, color: '#16a34a', bgColor: '#f0fdf4', path: '/order-confirmation' },
      { id: 'thank-you-page', title: 'Thank You', desc: 'Post-purchase customer appreciation with social sharing and discount rewards.', icon: Gift, color: '#8b5cf6', bgColor: '#f5f3ff', path: '/thank-you' },
      { id: 'order-history-page', title: 'Order Listing', desc: 'Customer past order history with delivery milestones and repeat orders.', icon: List, color: '#0284c7', bgColor: '#f0f9ff', path: '/account/orders' },
      { id: 'order-details-page', title: 'Order Detail', desc: 'Itemized order invoice, payment records, and shipping method details.', icon: FileText, color: '#0284c7', bgColor: '#f0f9ff', path: '/account/orders/:id' },
      { id: 'order-tracking-page', title: 'Order Tracking', desc: 'Real-time carrier tracking timeline and delivery updates.', icon: Truck, color: '#0284c7', bgColor: '#f0f9ff', path: '/order-tracking' },
    ],
  },
  {
    id: 'account',
    title: 'Account',
    count: 5,
    pages: [
      { id: 'login-page', title: 'Login', desc: 'Customer account login with secure email and credential validation.', icon: Lock, color: '#475569', bgColor: '#f1f5f9', path: '/login' },
      { id: 'register-page', title: 'Sign Up', desc: 'New customer onboarding and profile registration.', icon: UserPlus, color: '#475569', bgColor: '#f1f5f9', path: '/register' },
      { id: 'forgot-password-page', title: 'Forgot Password', desc: 'Password reset request with secure email recovery link.', icon: Lock, color: '#475569', bgColor: '#f1f5f9', path: '/forgot-password' },
      { id: 'email-verification-page', title: 'Email Verification', desc: 'Verify customer account email address and identity.', icon: Mail, color: '#475569', bgColor: '#f1f5f9', path: '/account/verify-email' },
      { id: 'account-page', title: 'Profile', desc: 'Customer account dashboard, personal profile, and saved addresses.', icon: User, color: '#475569', bgColor: '#f1f5f9', path: '/account' },
    ],
  },
  {
    id: 'content',
    title: 'Content',
    count: 3,
    pages: [
      { id: 'about-page', title: 'About Us', desc: 'Share your company history, values, and brand story with customers.', icon: Building2, color: '#0284c7', bgColor: '#f0f9ff', path: '/about' },
      { id: 'contact-page', title: 'Contact Us', desc: 'Customer inquiry contact form, business address, and operational hours.', icon: Phone, color: '#0284c7', bgColor: '#f0f9ff', path: '/contact' },
      { id: 'not-found-page', title: '404 / Not Found', desc: 'Helpful 404 error page with intelligent store search and redirects.', icon: AlertTriangle, color: '#d97706', bgColor: '#fef3c7', path: '/404' },
    ],
  },
  {
    id: 'chrome',
    title: 'Chrome',
    count: 4,
    pages: [
      { id: 'header-global', title: 'Header', desc: 'Global storefront navigation bar, logo branding, and search trigger.', icon: Layers, color: '#2563eb', bgColor: '#eff6ff', badge: 'All pages' },
      { id: 'footer-global', title: 'Footer', desc: 'Global storefront footer with navigation columns, copyright, and socials.', icon: Layers, color: '#2563eb', bgColor: '#eff6ff', badge: 'All pages' },
      { id: 'toaster-global', title: 'Toaster', desc: 'Global popup notifications, cart alerts, and floating toast banners.', icon: Bell, color: '#0284c7', bgColor: '#f0f9ff', badge: 'All pages' },
      { id: 'cookie-consent-global', title: 'Cookie / Consent', desc: 'Privacy regulation cookie banner with consent acceptance triggers.', icon: Cookie, color: '#d97706', bgColor: '#fef3c7', badge: 'All pages' },
    ],
  },
  {
    id: 'legal',
    title: 'Legal',
    count: 4,
    showDividerAbove: true,
    pages: [
      { id: 'privacy-policy-page', title: 'Privacy Policy', desc: 'Customer privacy policy, data collection compliance, and cookie terms.', icon: Shield, color: '#dc2626', bgColor: '#fef2f2', path: '/policies/privacy' },
      { id: 'terms-conditions-page', title: 'Terms & Conditions', desc: 'Legal terms and conditions governing purchases and website usage.', icon: FileText, color: '#8b5cf6', bgColor: '#f5f3ff', path: '/policies/terms' },
      { id: 'return-policy-page', title: 'Refund Policy', desc: 'Store return and refund policy, eligibility criteria, and warranty terms.', icon: RotateCcw, color: '#8b5cf6', bgColor: '#f5f3ff', path: '/policies/returns' },
      { id: 'shipping-policy-page', title: 'Shipping Policy', desc: 'Shipping carriers, transit timeframes, costs, and international policies.', icon: Truck, color: '#0284c7', bgColor: '#f0f9ff', path: '/policies/shipping' },
    ],
  },
];

const PageCard = ({ page }: { page: PageCardDef }) => {
  const navigate = useNavigate();
  return (
    <div 
      className={styles.pageCard} 
      onClick={() => navigate(getEditorPath(page.id))}
      style={{ cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      title={`Open ${page.title} in editor`}
    >
      <div className={styles.pageCardHeader}>
        <div className={styles.pageTitleGroup}>
          <div className={styles.pageIcon} style={{ backgroundColor: page.bgColor, color: page.color }}>
            <page.icon size={18} />
          </div>
          <div>
            <h4 className={styles.pageTitle}>{page.title}</h4>
            {page.path && <span className={styles.pagePath}>{page.path}</span>}
          </div>
        </div>
        {page.badge && (
          <span className={styles.allPagesBadge}>{page.badge}</span>
        )}
      </div>
      <div className={styles.pageInfo}>
        <p className={styles.pageDesc}>{page.desc}</p>
      </div>
      <div className={styles.pageCardFooter}>
        <span className={styles.editActionLink}>
          <span>Edit in Editor</span>
          <ArrowRight size={13} />
        </span>
      </div>
    </div>
  );
};

const Pages = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGroups = PAGE_GROUPS.map(group => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return group;
    const filteredPages = group.pages.filter(p => 
      p.title.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      (p.path && p.path.toLowerCase().includes(q)) ||
      (p.badge && p.badge.toLowerCase().includes(q))
    );
    return {
      ...group,
      pages: filteredPages,
    };
  }).filter(group => group.pages.length > 0);

  return (
    <div className={styles.pagesContainer}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Pages &amp; Templates</h1>
          <p className={styles.subtitle}>Manage and customize all pages, templates, and chrome layouts of your store.</p>
        </div>
        <div className={styles.headerActions}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search all pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '8px 14px 8px 34px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg-card)',
                color: 'var(--color-text-main)',
                fontSize: '13px',
                outline: 'none',
                width: '200px',
              }}
            />
          </div>
          <button className={styles.btnOutline}>
            <Trash2 size={16} />
            <span>Trash</span>
          </button>
          <button className={styles.btnPrimary} onClick={() => navigate('/editor/pages')}>
            <Plus size={16} />
            <span>Open Editor</span>
          </button>
        </div>
      </div>

      {/* Hero Card for Landing Page */}
      {!searchQuery.trim() && (
        <div className={styles.heroCard}>
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>
              <Rocket size={14} className={styles.heroBadgeIcon} />
              Featured Storefront
            </span>
            <h2 className={styles.heroTitle}>Design, customize, and launch<br/>your storefront</h2>
            <p className={styles.heroDesc}>
              Craft high-converting landing pages, product listings, and custom store templates with real-time responsive preview.
            </p>
            <div className={styles.heroActions}>
              <button className={styles.btnPrimary} onClick={() => navigate(getEditorPath('landing-page'))}>
                <Edit2 size={16} />
                <span>Start Editing Landing Page</span>
              </button>
              <button className={styles.btnWhite} onClick={() => navigate('/editor/pages')}>
                <span>View All in Editor</span>
                <ExternalLink size={16} />
              </button>
            </div>
          </div>
          <div className={styles.heroGraphic}>
            <div className={styles.browserWindow}>
              <div className={styles.browserHeader}>
                <div className={styles.dots}>
                  <div className={styles.dot}></div>
                  <div className={styles.dot}></div>
                  <div className={styles.dot}></div>
                </div>
              </div>
              <div className={styles.browserContent}>
                <div className={styles.browserNav}>
                  <div className={styles.browserLogo}>BillionBiz</div>
                  <div className={styles.browserLinks}>
                    <div className={styles.browserLink}></div>
                    <div className={styles.browserLink}></div>
                    <div className={styles.browserLink}></div>
                    <div className={styles.browserLink}></div>
                  </div>
                  <div className={styles.browserSearch}></div>
                </div>
                <div className={styles.browserHero}>
                  <div className={styles.browserHeroText}>
                    <div className={styles.browserHeroTitle}>Elevate your<br/>business growth</div>
                    <div className={styles.browserHeroLines}>
                      <div className={styles.browserLine}></div>
                      <div className={styles.browserLine} style={{width: '70%'}}></div>
                    </div>
                    <div className={styles.browserHeroBtn}>Get Started</div>
                  </div>
                  <div className={styles.browserHeroImage}>
                    <div className={styles.archShape}></div>
                  </div>
                </div>
              </div>
              <div className={styles.floatingRocket}>
                <div className={styles.rocketIconContainer}>
                  <Rocket size={20} className={styles.rocketIcon} />
                </div>
                <span>Publish<br/>Your Page</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actual Page Groups matching /editor/pages */}
      {filteredGroups.map(group => (
        <React.Fragment key={group.id}>
          {group.showDividerAbove && <div className={styles.sectionDivider} />}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleGroup}>
                <h3 className={styles.sectionTitle}>{group.title}</h3>
                <span className={styles.countBadge}>{group.pages.length} Pages</span>
              </div>
              <button 
                className={styles.viewAllBtn} 
                onClick={() => navigate(getEditorPath(group.pages[0]?.id || 'landing-page'))}
              >
                <span>Edit in Editor</span>
                <ChevronRight size={16} />
              </button>
            </div>
            <div className={styles.pagesGrid}>
              {group.pages.map(page => (
                <PageCard key={page.id} page={page} />
              ))}
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Pages;
