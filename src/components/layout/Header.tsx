import { Menu, Globe, Moon, Sun, Bell, ChevronDown } from 'lucide-react';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button className={styles.iconBtn}>
          <Menu size={20} />
        </button>
        <div className={styles.logo}>
          <div className={styles.logoMark}>B</div>
          <span className={styles.logoText}>BillionBiz</span>
        </div>
      </div>
      
      <div className={styles.right}>
        <button className={styles.langSelector}>
          <Globe size={16} />
          <span>English</span>
          <ChevronDown size={14} />
        </button>
        
        <div className={styles.themeToggle}>
          <button className={styles.iconBtnSmall}>
            <Moon size={16} />
          </button>
          <button className={styles.iconBtnSmall}>
            <Sun size={16} />
          </button>
        </div>
        
        <div className={styles.proPlanBadge}>
          Pro Plan
        </div>
        
        <button className={styles.notificationBtn}>
          <Bell size={20} />
          <span className={styles.badge}>3</span>
        </button>
        
        <div className={styles.profile}>
          <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="John D." className={styles.avatar} />
          <span className={styles.profileName}>John D.</span>
          <ChevronDown size={14} />
        </div>
      </div>
    </header>
  );
};

export default Header;
