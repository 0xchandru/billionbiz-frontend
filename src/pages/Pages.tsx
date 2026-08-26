import { 
  Trash2, 
  Plus, 
  Edit2, 
  ExternalLink,
  ShoppingBag,
  Package,
  ShoppingCart,
  CreditCard,
  User,
  Mail,
  HelpCircle,
  Shield,
  FileText,
  RefreshCw,
  MoreHorizontal,
  ChevronRight,
  Rocket
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './Pages.module.css';

const shopPages = [
  { id: 1, title: 'Products List', desc: 'Display all products in a collection.', icon: ShoppingBag, color: '#198754', bgColor: '#e8f5e9' },
  { id: 2, title: 'Product Details', desc: 'Show detailed information about a product.', icon: Package, color: '#198754', bgColor: '#e8f5e9' },
  { id: 3, title: 'Cart', desc: 'View and manage items in the cart.', icon: ShoppingCart, color: '#0d6efd', bgColor: '#cfe2ff' },
  { id: 4, title: 'Checkout', desc: 'Secure checkout process.', icon: CreditCard, color: '#198754', bgColor: '#e8f5e9' },
];

const infoPages = [
  { id: 5, title: 'About Us', desc: 'Tell your story and build trust with customers.', icon: User, color: '#0d6efd', bgColor: '#cfe2ff' },
  { id: 6, title: 'Contact Us', desc: 'Help customers get in touch with you.', icon: Mail, color: '#0d6efd', bgColor: '#cfe2ff' },
  { id: 7, title: 'FAQ', desc: 'Answer common questions.', icon: HelpCircle, color: '#fd7e14', bgColor: '#ffe5d0' },
  { id: 8, title: 'Privacy Policy', desc: 'Your privacy policy information.', icon: Shield, color: '#fa5252', bgColor: '#ffe3e3' },
  { id: 9, title: 'Terms & Conditions', desc: 'Terms and conditions of your site.', icon: FileText, color: '#6f42c1', bgColor: '#e0cffc' },
  { id: 10, title: 'Refund Policy', desc: 'Your return and refund policy.', icon: RefreshCw, color: '#6f42c1', bgColor: '#e0cffc' },
];

const PageCard = ({ page }: { page: any }) => (
  <div className={styles.pageCard}>
    <div className={styles.pageCardHeader}>
      <div className={styles.pageTitleGroup}>
        <div className={styles.pageIcon} style={{ backgroundColor: page.bgColor, color: page.color }}>
          <page.icon size={20} />
        </div>
        <h4 className={styles.pageTitle}>{page.title}</h4>
      </div>
      <button className={styles.moreBtn}>
        <MoreHorizontal size={16} />
      </button>
    </div>
    <div className={styles.pageInfo}>
      <p className={styles.pageDesc}>{page.desc}</p>
    </div>
  </div>
);

const Pages = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.pagesContainer}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Pages</h1>
          <p className={styles.subtitle}>Manage and customize all pages of your website.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnOutline}>
            <Trash2 size={16} />
            <span>View Trash</span>
          </button>
          <button className={styles.btnPrimary}>
            <Plus size={16} />
            <span>Add New Page</span>
          </button>
        </div>
      </div>

      <div className={styles.heroCard}>
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>
            <Rocket size={14} className={styles.heroBadgeIcon} />
            Landing Page
          </span>
          <h2 className={styles.heroTitle}>Design, customize, and launch<br/>your landing page</h2>
          <p className={styles.heroDesc}>
            Create a stunning landing page that represents your brand<br/>
            and converts visitors into customers.
          </p>
          <div className={styles.heroActions}>
            <button className={styles.btnPrimary} onClick={() => navigate('/editor')}>
              <Edit2 size={16} />
              <span>Start Editing Landing Page</span>
            </button>
            <button className={styles.btnWhite}>
              <span>Preview Landing Page</span>
              <ExternalLink size={16} />
            </button>
          </div>
        </div>
        <div className={styles.heroGraphic}>
          {/* This is a simple CSS recreation of the browser window graphic */}
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
                  {/* Decorative shape */}
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

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleGroup}>
            <h3 className={styles.sectionTitle}>Shop Pages</h3>
            <span className={styles.countBadge}>{shopPages.length} Pages</span>
          </div>
          <button className={styles.viewAllBtn}>
            <span>View all</span>
            <ChevronRight size={16} />
          </button>
        </div>
        <div className={styles.pagesGrid}>
          {shopPages.map(page => (
            <PageCard key={page.id} page={page} />
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleGroup}>
            <h3 className={styles.sectionTitle}>Informational Pages</h3>
            <span className={styles.countBadge}>{infoPages.length} Pages</span>
          </div>
          <button className={styles.viewAllBtn}>
            <span>View all</span>
            <ChevronRight size={16} />
          </button>
        </div>
        <div className={styles.pagesGrid}>
          {infoPages.map(page => (
            <PageCard key={page.id} page={page} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pages;
