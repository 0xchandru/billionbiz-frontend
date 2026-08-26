import { NavLink } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Inbox, 
  ShoppingBag, 
  Users, 
  BarChart2, 
  Megaphone, 
  Palette, 
  Settings,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import styles from './Sidebar.module.css';

const navItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: FileText, label: 'Pages', path: '/pages' },
  { icon: Palette, label: 'Theme / Styles', path: '/theme' },
  { icon: Inbox, label: 'Orders', path: '/orders' },
  { icon: ShoppingBag, label: 'Products', path: '/products' },
  { icon: Users, label: 'Customers', path: '/customers' },
  { icon: BarChart2, label: 'Analytics', path: '/analytics' },
  { icon: Megaphone, label: 'Marketing', path: '/marketing' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {navItems.map((item) => (
            <li key={item.label}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => 
                  isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
                }
              >
                <item.icon size={20} className={styles.icon} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className={styles.footer}>
        <a href="#" className={styles.helpLink}>
          <div className={styles.helpLeft}>
            <HelpCircle size={20} />
            <span>Help & Support</span>
          </div>
          <ExternalLink size={16} className={styles.externalIcon} />
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
