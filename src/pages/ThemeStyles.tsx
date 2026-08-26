import { 
  Rocket, 
  Edit2, 
  RotateCcw, 
  ChevronDown,
  CheckCircle2,
  Circle,
  Plus,
  Search,
  User,
  Menu,
  Type,
  Square,
  Layout,
  Palette
} from 'lucide-react';
import styles from './ThemeStyles.module.css';

const tabs = ['Theme', 'Colors', 'Typography', 'Spacing', 'Buttons', 'Forms', 'Shadows', 'Custom CSS'];

const presets = [
  { id: 'default', name: 'Default', desc: 'Clean & Professional', colors: ['#198754', '#0d6efd', '#6f42c1', '#fd7e14', '#20c997'], active: true },
  { id: 'minimal', name: 'Minimal', desc: 'Simple & Elegant', colors: ['#212529', '#495057', '#adb5bd', '#e9ecef', '#f8f9fa'], active: false },
  { id: 'modern', name: 'Modern', desc: 'Bold & Vibrant', colors: ['#198754', '#0d6efd', '#6610f2', '#ffc107', '#dc3545'], active: false },
  { id: 'dark', name: 'Dark', desc: 'Sleek & Dark Mode', colors: ['#198754', '#2b3035', '#343a40', '#495057', '#e9ecef'], active: false, isDark: true },
  { id: 'warm', name: 'Warm', desc: 'Soft & Friendly', colors: ['#9c6644', '#b08968', '#ddb892', '#e6ccb2', '#ede0d4'], active: false },
];

const summaryItems = [
  { label: 'Primary Color', value: '#198754', type: 'color', colorVal: '#198754' },
  { label: 'Secondary Color', value: '#0d6efd', type: 'color', colorVal: '#0d6efd' },
  { label: 'Font Family', value: 'Inter', type: 'text', icon: Type },
  { label: 'Border Radius', value: '8px', type: 'text', icon: Square },
  { label: 'Container Width', value: '1200px', type: 'text', icon: Layout },
  { label: 'Background', value: '#FFFFFF', type: 'text', icon: Palette },
];

const ThemeStyles = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Theme / Styles</h1>
          <p className={styles.subtitle}>Customize the look and feel of your website.</p>
        </div>
      </div>

      <div className={styles.heroCard}>
        <div className={styles.heroLeft}>
          <div className={styles.heroIconWrap}>
            <Rocket size={32} className={styles.heroIcon} />
          </div>
          <div className={styles.heroTextContent}>
            <h2 className={styles.heroTitle}>Design your website,<br/>your way</h2>
            <p className={styles.heroDesc}>
              Customize colors, fonts, spacing, and more.<br/>
              Create a unique look that matches your brand.
            </p>
            <div className={styles.heroActions}>
              <button className={styles.btnPrimary}>
                <Edit2 size={16} />
                <span>Customize Styles</span>
              </button>
              <button className={styles.btnOutline}>
                <RotateCcw size={16} />
                <span>Reset to Default</span>
              </button>
            </div>
          </div>
        </div>

        <div className={styles.heroCenter}>
          <div className={styles.fontSelectorCard}>
            <div className={styles.fontDropdown}>
              <span>Inter</span>
              <ChevronDown size={16} />
            </div>
            <div className={styles.fontSizes}>
              <span className={styles.fs1}>Aa</span>
              <span className={styles.fs2}>Aa</span>
              <span className={styles.fs3}>Aa</span>
              <span className={styles.fs4}>Aa</span>
            </div>
            <div className={styles.colorPalette}>
              {['#198754', '#0d6efd', '#6f42c1', '#fd7e14', '#20c997'].map((c, i) => (
                <div key={i} className={styles.colorDot} style={{backgroundColor: c}}></div>
              ))}
              <div className={styles.colorAdd}>+</div>
            </div>
          </div>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.miniBrowser}>
            <div className={styles.miniHeader}>
              <div className={styles.miniDots}>
                <i></i><i></i><i></i>
              </div>
            </div>
            <div className={styles.miniContent}>
              <div className={styles.miniNav}>
                <span className={styles.miniLogo}>BillionBiz</span>
                <div className={styles.miniLinks}><i></i><i></i><i></i><i></i></div>
                <div className={styles.miniSearch}></div>
              </div>
              <div className={styles.miniHero}>
                <div className={styles.miniHeroText}>
                  <h3>Elevate your<br/>business growth</h3>
                  <div className={styles.miniLines}><i></i><i style={{width:'70%'}}></i></div>
                  <div className={styles.miniBtn}>Get Started</div>
                </div>
                <div className={styles.miniHeroImg}>
                  <div className={styles.archShape}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mainLayout}>
        <div className={styles.contentArea}>
          <div className={styles.tabsWrapper}>
            <ul className={styles.tabs}>
              {tabs.map((tab, i) => (
                <li key={i} className={`${styles.tab} ${i === 0 ? styles.activeTab : ''}`}>
                  {tab}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <h3 className={styles.sectionTitle}>Theme Presets</h3>
                <p className={styles.sectionDesc}>Choose a pre-built theme or create your own.</p>
              </div>
              <button className={styles.viewAllBtn}>View All Themes</button>
            </div>
            
            <div className={styles.presetsGrid}>
              {presets.map(preset => (
                <div key={preset.id} className={`${styles.presetCard} ${preset.active ? styles.activePresetCard : ''} ${preset.isDark ? styles.darkPresetCard : ''}`}>
                  <div className={styles.presetHeader}>
                    <div>
                      <h4 className={styles.presetName}>{preset.name}</h4>
                      <p className={styles.presetDesc}>{preset.desc}</p>
                    </div>
                    {preset.active ? (
                      <CheckCircle2 size={20} className={styles.checkIcon} />
                    ) : (
                      <Circle size={20} className={styles.circleIcon} />
                    )}
                  </div>
                  <div className={styles.presetPreview}>
                    <span className={styles.presetFontSample} style={{color: preset.colors[0]}}>Aa</span>
                    <div className={styles.presetColors}>
                      {preset.colors.map((c, i) => (
                        <div key={i} className={styles.presetColorDot} style={{backgroundColor: c}}></div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <h3 className={styles.sectionTitle}>Custom Theme</h3>
                <p className={styles.sectionDesc}>Create and save your own custom theme.</p>
              </div>
            </div>
            <div className={styles.createThemeCard}>
              <div className={styles.createThemeIconWrap}>
                <Plus size={20} className={styles.createThemeIcon} />
              </div>
              <div>
                <h4 className={styles.createThemeTitle}>Create New Theme</h4>
                <p className={styles.createThemeDesc}>Start from scratch and design a theme that's uniquely yours.</p>
              </div>
            </div>
          </div>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <div className={styles.sidebarHeader}>
              <h3>Live Preview</h3>
              <p>See how your changes look in real-time.</p>
            </div>
            
            <div className={styles.livePreviewFrame}>
              {/* Similar to the mini browser but slightly more detailed */}
              <div className={styles.lpNav}>
                <span className={styles.lpLogo}>BillionBiz</span>
                <div className={styles.lpIcons}>
                  <Search size={12} />
                  <User size={12} />
                  <Menu size={12} />
                </div>
              </div>
              <div className={styles.lpHero}>
                <div className={styles.lpHeroText}>
                  <h3>Elevate your<br/>business growth</h3>
                  <p>Discover the tools that empower<br/>professionals to build stunning<br/>digital experiences.</p>
                  <button className={styles.lpBtn}>Get Started</button>
                </div>
                <div className={styles.lpHeroImg}>
                  <div className={styles.archShape}></div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.sidebarSection}>
            <div className={styles.sidebarHeader}>
              <h3>Theme Settings Summary</h3>
              <p>Review your current theme configuration.</p>
            </div>
            <div className={styles.summaryList}>
              {summaryItems.map((item, i) => (
                <div key={i} className={styles.summaryItem}>
                  <div className={styles.summaryLabel}>
                    {item.type === 'color' ? (
                      <div className={styles.summaryColorDot} style={{backgroundColor: item.colorVal}}></div>
                    ) : item.icon ? (
                      (() => {
                        const Icon = item.icon;
                        return <Icon size={14} className={styles.summaryIcon} />;
                      })()
                    ) : null}
                    <span>{item.label}</span>
                  </div>
                  <span className={styles.summaryValue}>{item.value}</span>
                </div>
              ))}
            </div>
            <button className={styles.btnPrimaryFull}>
              Save Changes
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ThemeStyles;
