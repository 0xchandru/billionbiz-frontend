import React, { useState, useEffect, useRef } from 'react';

import type { SectionData } from '../../store/siteStore';
import { useEditorStore } from '../../store/editorStore';

// Import all section components
import HeroBannerSection from './sections/HeroBannerSection';
import FeaturedCollectionSection from './sections/FeaturedCollectionSection';
import ImageWithTextSection from './sections/ImageWithTextSection';
import RichTextSection from './sections/RichTextSection';
import NewsletterSection from './sections/NewsletterSection';
import TestimonialsSection from './sections/TestimonialsSection';
import LogoListSection from './sections/LogoListSection';
import VideoSection from './sections/VideoSection';
import FAQSection from './sections/FAQSection';
import ContactFormSection from './sections/ContactFormSection';
import BlogPostsSection from './sections/BlogPostsSection';
import GallerySection from './sections/GallerySection';
import MapSection from './sections/MapSection';
import PricingTableSection from './sections/PricingTableSection';

// --- Built-in Announcement Bar, Header, Footer ---

const AnnouncementBar: React.FC<{ props: any }> = ({ props }) => {
  const isMobile = props.device === 'mobile';
  const layout = props.selectedLayout || 'single';
  
  const bgColor = props.bgColor || 'var(--theme-secondary)';
  const textColor = props.textColor || '#ffffff';
  const fontSize = props.fontSize || (isMobile ? '12px' : '14px');
  const textAlign = props.textAlign || 'center';
  
  const baseStyle: React.CSSProperties = {
    backgroundColor: bgColor,
    color: textColor,
    textAlign: textAlign as any,
    padding: isMobile ? '8px 16px' : '12px',
    fontSize,
    fontWeight: 600,
    letterSpacing: '0.5px',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start',
  };

  if (layout === 'marquee') {
    return (
      <div style={baseStyle}>
        <div style={{ whiteSpace: 'nowrap', animation: `marquee ${props.speed || 5}s linear infinite` }}>
          {props.text || 'Free shipping on all orders over $50!'}
        </div>
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}</style>
      </div>
    );
  }

  if (layout === 'carousel') {
    const messages = props.messages || ['Free shipping over $50', 'Save 20% with code WINTER20'];
    return (
      <div style={baseStyle}>
        <div style={{ width: '100%', textAlign: 'center' }}>
          {messages[0]} <span style={{ opacity: 0.5, fontSize: '10px' }}> (Carousel Preview)</span>
        </div>
      </div>
    );
  }

  if (layout === 'with-cta') {
    return (
      <div style={{ ...baseStyle, justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <span>{props.text || 'Free shipping on all orders over $50!'}</span>
        <button style={{
          backgroundColor: 'transparent',
          border: `1px solid ${textColor}`,
          color: textColor,
          padding: '4px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
        }}>
          {props.buttonText || 'Shop Now'}
        </button>
      </div>
    );
  }

  return (
    <div style={baseStyle}>
      {props.link ? (
        <a href={props.link} style={{ color: 'inherit', textDecoration: 'none' }}>
          {props.text || 'Free shipping on all orders over $50!'}
        </a>
      ) : (
        props.text || 'Free shipping on all orders over $50!'
      )}
    </div>
  );
};

const Header: React.FC<{ props: any }> = ({ props }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  const layout = props.selectedLayout || 'logo-left';
  const logoType = props.logoType || 'text';
  const logoText = props.logo || 'BillionBiz';
  const logoHeight = props.logoHeight || 60;
  const links = props.links || ['Home', 'Shop', 'Collections', 'About', 'Contact'];
  
  const showSearch = props.showSearch !== false;
  const showCart = props.showCart !== false;
  const showAccount = props.showAccount !== false;
  
  const ctaEnabled = props.ctaEnabled || false;
  const ctaText = props.ctaText || 'Sign Up';
  
  const isMobile = props.device === 'mobile';
  const isTablet = props.device === 'tablet';

  useEffect(() => {
    if (isMobile || layout === 'minimal') {
      setIsCollapsed(true);
      return;
    }

    const checkCollision = () => {
      if (!headerRef.current || !logoRef.current || !navRef.current || !actionsRef.current) return;
      
      const headerWidth = headerRef.current.clientWidth;
      const padding = 96; // 48px padding on both left and right for desktop
      const availableWidth = headerWidth - padding;
      
      const logoWidth = logoRef.current.scrollWidth;
      const navWidth = navRef.current.scrollWidth;
      
      // Calculate actionsWidth normally, but if we are not collapsed, the hamburger isn't rendered.
      // We should assume a rough width for the hamburger (24px + 16px gap = 40px) just in case, but let's use actual width.
      const actionsWidth = actionsRef.current.scrollWidth;

      let collision = false;
      
      if (layout === 'logo-left') {
        if (logoWidth + navWidth + actionsWidth + 30 > availableWidth) {
          collision = true;
        }
      } else if (layout === 'logo-center') {
        // Logo is in the center, so nav is on the left. The space available on one side is half the header minus half the logo.
        const maxSideWidth = (availableWidth - logoWidth) / 2 - 15;
        if (navWidth > maxSideWidth) {
          collision = true;
        }
      } else if (layout === 'nav-below') {
        if (navWidth > availableWidth) {
          collision = true;
        }
      }

      setIsCollapsed(collision);
    };

    const resizeObserver = new ResizeObserver(() => {
      checkCollision();
    });

    if (headerRef.current) {
      resizeObserver.observe(headerRef.current);
    }
    
    checkCollision();

    return () => resizeObserver.disconnect();
  }, [layout, isMobile, links.length]);

  const bgColor = props.transparent ? 'transparent' : (props.bgColor || 'var(--theme-background)');
  const textColor = props.textColor || 'var(--theme-text)';

  const headerStyle: React.CSSProperties = {
    padding: isMobile ? '0 20px' : '0 48px',
    backgroundColor: bgColor,
    borderBottom: props.transparent ? 'none' : '1px solid #e2e8f0',
    position: props.sticky ? 'sticky' : 'relative',
    top: 0,
    zIndex: 100,
    color: textColor,
    display: 'flex',
    flexDirection: (layout === 'nav-below' && !isMobile) ? 'column' : 'row',
    justifyContent: layout === 'logo-center' && !isMobile ? 'space-between' : 'space-between',
    alignItems: 'center',
    gap: isMobile ? '16px' : (layout === 'nav-below' ? '16px' : '0'),
    height: isMobile ? '70px' : '90px',
    boxSizing: 'border-box',
    overflow: 'visible', // allow dropdown to show
  };

  const logoContent = (
    <div ref={logoRef} style={{ display: 'flex', alignItems: 'center', gap: '12px', height: '100%' }}>
      {(logoType === 'image' || logoType === 'both') && (
        <div style={{ width: 'auto', height: '100%', backgroundColor: props.logoImage ? 'transparent' : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '12px' }}>
          {props.logoImage ? (
            <img src={props.logoImage} alt={logoText || 'Logo'} style={{ height: `${logoHeight}%`, width: 'auto', objectFit: 'contain' }} />
          ) : (
            'Logo Image'
          )}
        </div>
      )}
      {(logoType === 'text' || logoType === 'both') && (
        <div style={{
          fontSize: isMobile ? '20px' : '24px',
          fontWeight: 800,
          color: textColor,
          letterSpacing: '-0.5px',
          fontFamily: 'var(--theme-font-heading), sans-serif',
          whiteSpace: 'nowrap',
        }}>
          {logoText}
        </div>
      )}
    </div>
  );

  const navContent = layout !== 'minimal' && (
    <nav ref={navRef} style={{ 
      display: 'flex', 
      gap: isMobile ? '16px' : (isTablet ? '20px' : '32px'),
      justifyContent: 'center',
      alignItems: 'center',
      height: layout === 'nav-below' && !isMobile ? 'auto' : '100%',
      width: layout === 'nav-below' && !isMobile ? '100%' : 'auto',
      borderTop: layout === 'nav-below' && !isMobile ? '1px solid #e2e8f0' : 'none',
      paddingTop: layout === 'nav-below' && !isMobile ? '16px' : '0',
      
      ...(isCollapsed && !isMobile ? {
        position: 'absolute',
        visibility: 'hidden',
        pointerEvents: 'none',
        opacity: 0,
        whiteSpace: 'nowrap',
      } : isMobile ? {
        display: 'none', // Hidden on mobile, shown in menu
      } : {
        flexWrap: 'wrap',
      })
    }}>
      {links.map((link: string, i: number) => (
        <a key={i} href="#" style={{
          color: textColor,
          textDecoration: 'none',
          fontWeight: 500,
          fontSize: '15px',
          opacity: 0.8,
          transition: 'opacity 0.2s',
          whiteSpace: 'nowrap',
        }}>
          {link}
        </a>
      ))}
    </nav>
  );

  const hamburgerMenu = (isCollapsed || isMobile || layout === 'minimal') && (
    <div 
      onClick={() => setIsMenuOpen(!isMenuOpen)}
      style={{ cursor: 'pointer', color: textColor, display: 'flex', alignItems: 'center', zIndex: 110 }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {isMenuOpen ? (
          <>
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </>
        ) : (
          <>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </>
        )}
      </svg>
    </div>
  );

  const actionsContent = (
    <div ref={actionsRef} style={{ display: 'flex', gap: '16px', alignItems: 'center', height: '100%' }}>
      {!isMobile && showSearch && (
        <div style={{ cursor: 'pointer', color: textColor, opacity: 0.8 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      )}
      {!isMobile && showAccount && (
        <div style={{ cursor: 'pointer', color: textColor, opacity: 0.8 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
      )}
      {!isMobile && showCart && (
        <div style={{ cursor: 'pointer', color: textColor, opacity: 0.8 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </div>
      )}
      {!isMobile && ctaEnabled && (
        <button style={{
          backgroundColor: 'var(--theme-primary)',
          color: 'white',
          border: 'none',
          padding: '8px 20px',
          borderRadius: '999px',
          fontWeight: 600,
          fontSize: '14px',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}>
          {ctaText}
        </button>
      )}
      {hamburgerMenu}
    </div>
  );

  return (
    <header ref={headerRef} style={headerStyle}>
      {layout === 'logo-center' && !isMobile ? (
        <>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', height: '100%' }}>{navContent}</div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', height: '100%' }}>{logoContent}</div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', height: '100%' }}>{actionsContent}</div>
        </>
      ) : layout === 'nav-below' && !isMobile ? (
        <>
          <div style={{ width: '100%', flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {logoContent}
            {actionsContent}
          </div>
          {navContent}
        </>
      ) : (
        <>
          {logoContent}
          {!isMobile && navContent}
          {actionsContent}
        </>
      )}

      {/* Mobile/Collapsed Menu Dropdown */}
      {isMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: bgColor,
          borderBottom: '1px solid #e2e8f0',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          zIndex: 99,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {links.map((link: string, i: number) => (
              <a key={i} href="#" style={{
                color: textColor,
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: '16px',
              }}>
                {link}
              </a>
            ))}
          </nav>
          
          <div style={{ display: 'flex', gap: '24px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
            {showSearch && (
              <div style={{ cursor: 'pointer', color: textColor, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <span style={{ fontSize: '14px', fontWeight: 500 }}>Search</span>
              </div>
            )}
            {showAccount && (
              <div style={{ cursor: 'pointer', color: textColor, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span style={{ fontSize: '14px', fontWeight: 500 }}>Account</span>
              </div>
            )}
            {showCart && (
              <div style={{ cursor: 'pointer', color: textColor, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <span style={{ fontSize: '14px', fontWeight: 500 }}>Cart</span>
              </div>
            )}
          </div>

          {ctaEnabled && (
            <button style={{
              backgroundColor: 'var(--theme-primary)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '999px',
              fontWeight: 600,
              fontSize: '16px',
              cursor: 'pointer',
              width: '100%',
              marginTop: '8px',
            }}>
              {ctaText}
            </button>
          )}
        </div>
      )}
    </header>
  );
};

const UtilityBar: React.FC<{ props: any }> = ({ props }) => {
  const isMobile = props.device === 'mobile';
  const layout = props.selectedLayout || 'left-right';
  
  const bgColor = props.bgColor || '#f8fafc';
  const textColor = props.textColor || 'var(--text-muted)';
  
  const showLanguage = props.showLanguage !== false;
  const showCurrency = props.showCurrency !== false;

  const leftContent = (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: layout === 'centered' ? 'center' : 'flex-start' }}>
      <span>{props.supportEmail || 'support@billionbiz.in'}</span>
      {!isMobile && <span>{props.supportPhone || '+1 (555) 123-4567'}</span>}
    </div>
  );

  const rightContent = (showLanguage || showCurrency) && (
    <div style={{ display: 'flex', gap: '16px', justifyContent: layout === 'centered' ? 'center' : 'flex-end' }}>
      {showLanguage && <span>{props.language || 'English'}</span>}
      {showCurrency && <span>{props.currency || 'USD'}</span>}
    </div>
  );

  const containerStyle: React.CSSProperties = {
    backgroundColor: bgColor,
    borderBottom: '1px solid var(--border-color)',
    color: textColor,
    display: 'flex',
    flexDirection: (layout === 'centered' || isMobile) ? 'column' : 'row',
    justifyContent: layout === 'three-column' ? 'space-between' : (layout === 'centered' ? 'center' : 'space-between'),
    alignItems: 'center',
    gap: (layout === 'centered' || isMobile) ? '8px' : '0',
    padding: isMobile ? '6px 16px' : '6px 48px',
    fontSize: '12px',
    fontWeight: 500,
  };

  return (
    <div style={containerStyle}>
      {layout === 'three-column' && !isMobile ? (
        <>
          <div style={{ flex: 1 }}>{leftContent}</div>
          <div style={{ flex: 1, textAlign: 'center' }}>Welcome to BillionBiz</div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>{rightContent}</div>
        </>
      ) : (
        <>
          {leftContent}
          {rightContent}
        </>
      )}
    </div>
  );
};

const FooterMenu: React.FC<{ props: any }> = ({ props }) => {
  const layout = props.selectedLayout || 'vertical';
  const title = props.title || 'Quick Links';
  const links = props.links || ['Home', 'Shop', 'About Us', 'Contact'];
  const alignment = props.alignment || 'left';
  
  return (
    <div style={{ padding: '24px 48px', backgroundColor: '#0f172a', color: 'white', textAlign: alignment as any }}>
      <h4 style={{ fontWeight: 700, marginBottom: '20px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.5 }}>{title}</h4>
      <ul style={{ 
        listStyle: 'none', 
        padding: 0, 
        margin: 0, 
        display: 'flex', 
        flexDirection: layout === 'horizontal' ? 'row' : 'column', 
        gap: layout === 'horizontal' ? '24px' : '12px',
        justifyContent: alignment === 'center' ? 'center' : alignment === 'right' ? 'flex-end' : 'flex-start',
        flexWrap: 'wrap'
      }}>
        {links.map((link: string, j: number) => (
          <li key={j}>
            <a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.6, fontSize: '14px', transition: 'opacity 0.2s' }}>{link}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const FooterText: React.FC<{ props: any }> = ({ props }) => {
  const title = props.title || 'About Our Store';
  const text = props.text || 'We sell the best products in the world. Enjoy your shopping experience!';
  const alignment = props.alignment || 'left';
  
  return (
    <div style={{ padding: '24px 48px', backgroundColor: '#0f172a', color: 'white', textAlign: alignment as any }}>
      <h4 style={{ fontWeight: 700, marginBottom: '20px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.5 }}>{title}</h4>
      <p style={{ fontSize: '14px', lineHeight: 1.7, opacity: 0.6 }}>{text}</p>
    </div>
  );
};

const Footer: React.FC<{ props: any }> = ({ props }) => {
  const layout = props.selectedLayout || 'standard';
  const logoType = props.logoType || 'text';
  const logoText = props.logo || 'BillionBiz';
  const logoHeight = props.logoHeight || 60;
  const description = props.description || 'Empowering creators and builders to make the best digital experiences possible.';
  const copyright = props.copyright || '© 2026 BillionBiz. All rights reserved.';
  const columns = props.columns || [
    { title: 'Product', links: ['Features', 'Pricing', 'Templates', 'Integrations'] },
    { title: 'Company', links: ['About Us', 'Careers', 'Blog', 'Press'] },
    { title: 'Support', links: ['Help Center', 'Contact', 'Status', 'Privacy Policy'] },
  ];
  
  const showSocial = props.showSocial !== false;
  // const showPayment = props.showPayment !== false; // Not used in this basic layout
  const bgColor = props.bgColor || '#0f172a';
  const textColor = props.textColor || '#ffffff';

  const isMobile = props.device === 'mobile';
  const isTablet = props.device === 'tablet';

  return (
    <footer style={{
      backgroundColor: bgColor,
      color: textColor,
      padding: isMobile ? '48px 24px 32px' : '80px 48px 32px',
      textAlign: layout === 'centered' ? 'center' : 'left',
    }}>
      {layout !== 'minimal' && (
        <div style={{
          display: 'flex',
          flexDirection: isMobile || isTablet || layout === 'centered' ? 'column' : 'row',
          justifyContent: layout === 'centered' ? 'center' : 'space-between',
          alignItems: layout === 'centered' ? 'center' : 'flex-start',
          gap: isMobile ? '48px' : '64px',
          marginBottom: isMobile ? '48px' : '80px',
        }}>
          <div style={{ maxWidth: layout === 'centered' ? '600px' : '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: layout === 'centered' ? 'center' : 'flex-start', marginBottom: '16px' }}>
              {(logoType === 'image' || logoType === 'both') && (
                <div style={{ width: 'auto', height: isMobile ? '70px' : '90px', backgroundColor: props.logoImage ? 'transparent' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: textColor }}>
                  {props.logoImage ? (
                    <img src={props.logoImage} alt={logoText || 'Logo'} style={{ height: `${logoHeight}%`, width: 'auto', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ padding: '0 12px' }}>Logo Image</span>
                  )}
                </div>
              )}
              {(logoType === 'text' || logoType === 'both') && (
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: 800,
                  margin: 0,
                  fontFamily: 'var(--theme-font-heading), sans-serif',
                }}>
                  {logoText}
                </h3>
              )}
            </div>
            <p style={{ fontSize: '14px', lineHeight: 1.7, opacity: 0.6 }}>{description}</p>
            {showSocial && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: layout === 'centered' ? 'center' : 'flex-start' }}>
                {['Twitter', 'Instagram', 'Facebook'].map(social => (
                  <a key={social} href="#" style={{
                    width: '36px', height: '36px', borderRadius: '8px',
                    backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    color: textColor, textDecoration: 'none', fontSize: '12px', fontWeight: 600,
                  }}>
                    {social[0]}
                  </a>
                ))}
              </div>
            )}
          </div>
          <div style={{ 
            display: 'flex', 
            gap: isMobile ? '40px' : '64px',
            flexWrap: 'wrap',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: layout === 'centered' ? 'center' : 'flex-start',
            width: layout === 'centered' ? '100%' : 'auto',
          }}>
            {columns.map((col: any, i: number) => (
              <div key={i} style={{ minWidth: layout === 'centered' ? '150px' : 'auto' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '20px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.5 }}>{col.title}</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {col.links && col.links.map((link: string, j: number) => (
                    <li key={j}>
                      <a href="#" style={{ color: textColor, textDecoration: 'none', opacity: 0.6, fontSize: '14px', transition: 'opacity 0.2s' }}>{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        opacity: 0.6,
        fontSize: '13px',
        borderTop: layout === 'minimal' ? 'none' : '1px solid rgba(255,255,255,0.1)',
        paddingTop: layout === 'minimal' ? '0' : '32px',
      }}>
        <span>{copyright}</span>
        <a href="https://billionbiz.in" target="_blank" rel="noopener noreferrer" style={{ color: textColor, textDecoration: 'none', fontWeight: 600 }}>
          Powered by BillionBiz
        </a>
        {layout === 'minimal' && showSocial && (
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
             <span style={{ cursor: 'pointer' }}>Twitter</span>
             <span style={{ cursor: 'pointer' }}>Instagram</span>
             <span style={{ cursor: 'pointer' }}>Facebook</span>
          </div>
        )}
      </div>
    </footer>
  );
};

// --- Section Map ---
const sectionMap: Record<string, React.FC<{ props: any }>> = {
  AnnouncementBar,
  UtilityBar,
  Header,
  HeroBanner: HeroBannerSection,
  HeroCarousel: HeroBannerSection, // Fallback
  FeaturedCollection: FeaturedCollectionSection,
  CategoryList: FeaturedCollectionSection, // Fallback
  ImageWithText: ImageWithTextSection,
  RichText: RichTextSection,
  Newsletter: NewsletterSection,
  Testimonials: TestimonialsSection,
  LogoList: LogoListSection,
  Video: VideoSection,
  FAQ: FAQSection,
  ContactForm: ContactFormSection,
  BlogPosts: BlogPostsSection,
  Gallery: GallerySection,
  Map: MapSection,
  PricingTable: PricingTableSection,
  FooterMenu,
  FooterText,
  Footer,
};

// --- Default Props Map ---
// Used by addSection to provide rich defaults for every section type
export const defaultPropsMap: Record<string, Record<string, any>> = {
  AnnouncementBar: { text: 'Free shipping on all orders over $50!' },
  UtilityBar: { supportEmail: 'support@billionbiz.in', supportPhone: '+1 (555) 123-4567', language: 'English', currency: 'USD' },
  Header: { 
    logo: 'BillionBiz', 
    links: ['Home', 'Shop', 'Collections', 'About', 'Contact'], 
    showSearch: true, 
    ctaText: 'Sign Up',
    bottomNavLinks: [
      { id: 'home', icon: 'Home', text: 'Home', link: '/' },
      { id: 'shop', icon: 'Grid', text: 'Shop', link: '/collections/all' },
      { id: 'cart', icon: 'ShoppingCart', text: 'Cart', link: '/cart' },
      { id: 'profile', icon: 'User', text: 'Profile', link: '/profile' }
    ]
  },
  HeroBanner: {
    badge: 'New Arrival',
    heading: 'Elevate Your Creative Workflow',
    description: 'Discover the tools that empower professionals to build stunning digital experiences with ease.',
    primaryBtn: 'Start Building Now',
    secondaryBtn: 'Explore Templates',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&h=1000&fit=crop',
    layout: 'left',
    bgColor: 'var(--theme-background)',
  },
  HeroCarousel: {
    autoPlay: true,
    interval: 5,
    slides: [
      { heading: 'Summer Collection', description: 'Brighten up your space with our new summer arrivals.', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&h=600&fit=crop', buttonText: 'Shop Summer' }
    ]
  },
  FeaturedCollection: {
    heading: 'Featured Collection',
    linkText: 'View all',
    columns: 4,
    products: [
      { name: 'Artisan Ceramic Vase', price: '$89.00', image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&h=400&fit=crop' },
      { name: 'Handwoven Throw', price: '$129.00', image: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=400&h=400&fit=crop' },
      { name: 'Oak Side Table', price: '$249.00', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop' },
      { name: 'Linen Cushion Set', price: '$67.00', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop' },
    ],
  },
  CategoryList: {
    heading: 'Shop by Category',
    categories: [
      { name: 'Furniture', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop' },
      { name: 'Decor', image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&h=400&fit=crop' },
      { name: 'Lighting', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=400&fit=crop' },
    ]
  },
  ImageWithText: {
    heading: 'Crafted with Purpose',
    body: 'Every piece in our collection is thoughtfully designed and ethically made. We work directly with artisans around the world to bring you unique, high-quality products that tell a story.',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=700&h=700&fit=crop',
    imagePosition: 'left',
    buttonText: 'Learn More',
    buttonLink: '#',
    bgColor: 'var(--theme-background)',
  },
  RichText: {
    heading: 'Our Mission',
    body: 'We believe in creating products that are both beautiful and functional. Our team of designers and engineers work together to push the boundaries of what\'s possible.',
    alignment: 'center',
    bgColor: 'var(--theme-background)',
  },
  Newsletter: {
    heading: 'Stay in the Loop',
    description: 'Subscribe to our newsletter and get 10% off your first order, plus exclusive access to new arrivals.',
    buttonText: 'Subscribe',
    bgColor: '#0f172a',
    textColor: '#ffffff',
  },
  Testimonials: {
    heading: 'What Our Customers Say',
    testimonials: [
      { name: 'Sarah Johnson', role: 'Interior Designer', quote: 'The quality of these products is outstanding. Every piece feels like a work of art.', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face', rating: 5 },
      { name: 'Michael Chen', role: 'Architect', quote: 'I\'ve been a loyal customer for 3 years. The attention to detail is unmatched.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', rating: 5 },
      { name: 'Emily Parker', role: 'Home Stylist', quote: 'Fast shipping, beautiful packaging, and the products always exceed expectations.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', rating: 5 },
    ],
  },
  LogoList: {
    heading: 'Trusted by Leading Brands',
    logos: [
      { name: 'Airbnb' }, { name: 'Spotify' }, { name: 'Stripe' },
      { name: 'Notion' }, { name: 'Figma' }, { name: 'Slack' },
    ],
  },
  Video: {
    heading: 'See it in Action',
    description: 'Watch how our products transform everyday spaces into extraordinary experiences.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    bgColor: 'var(--theme-background)',
  },
  FAQ: {
    heading: 'Frequently Asked Questions',
    items: [
      { question: 'What is your return policy?', answer: 'We offer a 30-day hassle-free return policy. Simply reach out to our support team.' },
      { question: 'How long does shipping take?', answer: 'Standard shipping takes 5-7 business days. Express shipping is 2-3 business days.' },
      { question: 'Do you ship internationally?', answer: 'Yes! We ship to over 50 countries worldwide.' },
      { question: 'How do I track my order?', answer: 'Once your order ships, you\'ll receive an email with a tracking number.' },
      { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards, PayPal, Apple Pay, and Google Pay.' },
    ],
  },
  ContactForm: {
    heading: 'Get in Touch',
    description: 'Have a question? Fill out the form below and we\'ll get back to you within 24 hours.',
    buttonText: 'Send Message',
    bgColor: 'var(--theme-background)',
  },
  BlogPosts: {
    heading: 'Latest from Our Blog',
    posts: [
      { title: '10 Tips for Styling Your Living Room', excerpt: 'Discover expert interior design tips to transform your space.', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop', date: 'Dec 15, 2025' },
      { title: 'The Art of Sustainable Living', excerpt: 'Learn how to make eco-friendly choices without compromising on style.', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop', date: 'Dec 10, 2025' },
      { title: 'Color Trends for the New Year', excerpt: 'Explore the colors that will define home decor this year.', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop', date: 'Dec 5, 2025' },
    ],
  },
  Gallery: {
    heading: 'Gallery',
    columns: 3,
    images: [
      { src: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop', alt: 'Gallery 1' },
      { src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop', alt: 'Gallery 2' },
      { src: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=600&h=600&fit=crop', alt: 'Gallery 3' },
      { src: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop', alt: 'Gallery 4' },
      { src: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=600&h=600&fit=crop', alt: 'Gallery 5' },
      { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=600&fit=crop', alt: 'Gallery 6' },
    ],
  },
  Map: {
    heading: 'Visit Our Store',
    address: '123 Business Avenue, Tech District, San Francisco, CA 94107',
    zoom: 14,
    phone: '+1 (555) 123-4567',
    email: 'hello@billionbiz.com',
    hours: 'Mon-Fri: 9am - 6pm | Sat: 10am - 4pm',
  },
  PricingTable: {
    heading: 'Simple, transparent pricing',
    subheading: 'Choose the perfect plan for your business.',
    plans: [
      { name: 'Starter', price: '$29', period: '/month', features: ['Up to 100 products', '2 staff accounts', 'Basic analytics', 'Email support', '2% transaction fee'], buttonText: 'Start Free Trial', highlighted: false },
      { name: 'Professional', price: '$79', period: '/month', features: ['Unlimited products', '5 staff accounts', 'Advanced analytics', 'Priority support', '1% transaction fee', 'Custom domain', 'Gift cards'], buttonText: 'Start Free Trial', highlighted: true },
      { name: 'Enterprise', price: '$299', period: '/month', features: ['Unlimited everything', '15 staff accounts', 'Custom reports', 'Dedicated manager', '0.5% transaction fee', 'Custom domain', 'Advanced API access'], buttonText: 'Contact Sales', highlighted: false },
    ],
  },
  FooterMenu: { title: 'Quick Links', links: ['Home', 'Shop', 'About Us', 'Contact'] },
  FooterText: { title: 'About Our Store', text: 'We sell the best products in the world. Enjoy your shopping experience!' },
  Footer: {
    logo: 'BillionBiz',
    description: 'Empowering creators and builders to make the best digital experiences possible.',
    copyright: '© 2026 BillionBiz. All rights reserved.',
    columns: [
      { title: 'Product', links: ['Features', 'Pricing', 'Templates', 'Integrations'] },
      { title: 'Company', links: ['About Us', 'Careers', 'Blog', 'Press'] },
      { title: 'Support', links: ['Help Center', 'Contact', 'Status', 'Privacy Policy'] },
    ],
  },
};

// --- Section name map ---
export const sectionNameMap: Record<string, string> = {
  AnnouncementBar: 'Announcement Bar',
  UtilityBar: 'Utility Bar',
  Header: 'Header',
  HeroBanner: 'Hero Banner',
  HeroCarousel: 'Hero Carousel',
  FeaturedCollection: 'Featured Collection',
  CategoryList: 'Category List',
  ImageWithText: 'Image with Text',
  RichText: 'Rich Text',
  Newsletter: 'Newsletter',
  Testimonials: 'Testimonials',
  LogoList: 'Logo List',
  Video: 'Video',
  FAQ: 'FAQ',
  ContactForm: 'Contact Form',
  BlogPosts: 'Blog Posts',
  Gallery: 'Gallery',
  Map: 'Map',
  PricingTable: 'Pricing Table',
  FooterMenu: 'Footer Menu',
  FooterText: 'Footer Text',
  Footer: 'Footer',
};

// --- Renderer ---
export const SectionRenderer: React.FC<{ section: SectionData, overrideDevice?: string }> = ({ section, overrideDevice }) => {
  const storeDevice = useEditorStore(state => state.device);
  const device = overrideDevice || storeDevice;

  if (section.isHidden) return null;

  // Visibility Rules
  if (section.props.visibility) {
    if (device === 'desktop' && section.props.visibility.desktop === false) return null;
    if (device === 'tablet' && section.props.visibility.tablet === false) return null;
    if (device === 'mobile' && section.props.visibility.mobile === false) return null;
    
    // Note: Schedule and Audience visibility are not strictly enforced in the visual editor 
    // to allow the user to see the section they are working on, but they would be enforced on the live site.
  }

  const Component = sectionMap[section.type];
  if (!Component) {
    return (
      <div style={{
        padding: '40px',
        border: '2px dashed #e2e8f0',
        borderRadius: '12px',
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: '14px',
        margin: '8px',
      }}>
        Unknown section type: <strong>{section.type}</strong>
      </div>
    );
  }

  // Layout & Spacing
  const layoutMap = {
    narrow: '640px',
    standard: '1024px',
    wide: '1280px',
    full: '100%',
  };
  
  const layoutWidth = section.props.layout?.width ? layoutMap[section.props.layout.width as keyof typeof layoutMap] || '100%' : '100%';
  const paddingTop = section.props.spacing?.paddingTop ? `${section.props.spacing.paddingTop}px` : undefined;
  const paddingBottom = section.props.spacing?.paddingBottom ? `${section.props.spacing.paddingBottom}px` : undefined;

  return (
    <div style={{
      maxWidth: layoutWidth,
      margin: '0 auto',
      paddingTop,
      paddingBottom,
    }}>
      <Component props={{ ...section.props, device }} />
    </div>
  );
};
