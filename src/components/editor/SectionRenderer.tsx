import React from 'react';
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
  return (
    <div style={{
      backgroundColor: 'var(--theme-secondary)',
      color: 'white',
      textAlign: 'center',
      padding: isMobile ? '8px 16px' : '12px',
      fontSize: isMobile ? '12px' : '14px',
      fontWeight: 600,
      letterSpacing: '0.5px',
    }}>
      {props.text || 'Free shipping on all orders over $50!'}
    </div>
  );
};

const Header: React.FC<{ props: any }> = ({ props }) => {
  const logo = props.logo || 'BillionBiz';
  const links = props.links || ['Home', 'Shop', 'Collections', 'About', 'Contact'];
  const showSearch = props.showSearch !== false;
  const ctaText = props.ctaText || 'Sign Up';
  const isMobile = props.device === 'mobile';
  const isTablet = props.device === 'tablet';

  return (
    <header style={{
      padding: isMobile ? '16px 20px' : '20px 48px',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: isMobile ? '16px' : '0',
      backgroundColor: 'var(--theme-bg)',
      borderBottom: '1px solid #e2e8f0',
    }}>
      <div style={{
        fontSize: isMobile ? '20px' : '24px',
        fontWeight: 800,
        color: 'var(--theme-text)',
        letterSpacing: '-0.5px',
        fontFamily: 'var(--theme-font, "Outfit"), sans-serif',
      }}>
        {logo}
      </div>
      <nav style={{ 
        display: 'flex', 
        gap: isMobile ? '16px' : (isTablet ? '20px' : '32px'),
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {links.map((link: string, i: number) => (
          <a key={i} href="#" style={{
            color: 'var(--theme-text)',
            textDecoration: 'none',
            fontWeight: 500,
            fontSize: '15px',
            opacity: 0.8,
            transition: 'opacity 0.2s',
          }}>
            {link}
          </a>
        ))}
      </nav>
      {!isMobile && (
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {showSearch && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#f1f5f9',
              cursor: 'pointer',
              color: 'var(--theme-text)',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          )}
          <button style={{
            backgroundColor: 'var(--theme-primary)',
            color: 'white',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '999px',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
          }}>
            {ctaText}
          </button>
        </div>
      )}
    </header>
  );
};

const Footer: React.FC<{ props: any }> = ({ props }) => {
  const logo = props.logo || 'BillionBiz';
  const description = props.description || 'Empowering creators and builders to make the best digital experiences possible.';
  const copyright = props.copyright || '© 2026 BillionBiz. All rights reserved.';
  const columns = props.columns || [
    { title: 'Product', links: ['Features', 'Pricing', 'Templates', 'Integrations'] },
    { title: 'Company', links: ['About Us', 'Careers', 'Blog', 'Press'] },
    { title: 'Support', links: ['Help Center', 'Contact', 'Status', 'Privacy Policy'] },
  ];


  const isMobile = props.device === 'mobile';
  const isTablet = props.device === 'tablet';

  return (
    <footer style={{
      backgroundColor: '#0f172a',
      color: 'white',
      padding: isMobile ? '48px 24px 32px' : '80px 48px 32px',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: isMobile || isTablet ? 'column' : 'row',
        justifyContent: 'space-between',
        gap: isMobile ? '48px' : '64px',
        marginBottom: isMobile ? '48px' : '80px',
      }}>
        <div style={{ maxWidth: '300px' }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: 800,
            marginBottom: '16px',
            fontFamily: 'var(--theme-font, "Outfit"), sans-serif',
          }}>
            {logo}
          </h3>
          <p style={{ fontSize: '14px', lineHeight: 1.7, opacity: 0.6 }}>{description}</p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            {['Twitter', 'Instagram', 'Facebook'].map(social => (
              <a key={social} href="#" style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                textDecoration: 'none',
                fontSize: '12px',
                fontWeight: 600,
              }}>
                {social[0]}
              </a>
            ))}
          </div>
        </div>
        <div style={{ 
          display: 'flex', 
          gap: isMobile ? '40px' : '64px',
          flexWrap: 'wrap',
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          {columns.map((col: any, i: number) => (
            <div key={i}>
              <h4 style={{ fontWeight: 700, marginBottom: '20px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.5 }}>{col.title}</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {col.links.map((link: string, j: number) => (
                  <li key={j}>
                    <a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.6, fontSize: '14px', transition: 'opacity 0.2s' }}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div style={{
        textAlign: 'center',
        opacity: 0.4,
        fontSize: '13px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        paddingTop: '32px',
      }}>
        {copyright}
      </div>
    </footer>
  );
};

// --- Section Map ---
const sectionMap: Record<string, React.FC<{ props: any }>> = {
  AnnouncementBar,
  Header,
  HeroBanner: HeroBannerSection,
  FeaturedCollection: FeaturedCollectionSection,
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
  Footer,
};

// --- Default Props Map ---
// Used by addSection to provide rich defaults for every section type
export const defaultPropsMap: Record<string, Record<string, any>> = {
  AnnouncementBar: { text: 'Free shipping on all orders over $50!' },
  Header: { logo: 'BillionBiz', links: ['Home', 'Shop', 'Collections', 'About', 'Contact'], showSearch: true, ctaText: 'Sign Up' },
  HeroBanner: {
    badge: 'New Arrival',
    heading: 'Elevate Your Creative Workflow',
    description: 'Discover the tools that empower professionals to build stunning digital experiences with ease.',
    primaryBtn: 'Start Building Now',
    secondaryBtn: 'Explore Templates',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&h=1000&fit=crop',
    layout: 'left',
    bgColor: 'var(--theme-bg)',
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
  ImageWithText: {
    heading: 'Crafted with Purpose',
    body: 'Every piece in our collection is thoughtfully designed and ethically made. We work directly with artisans around the world to bring you unique, high-quality products that tell a story.',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=700&h=700&fit=crop',
    imagePosition: 'left',
    buttonText: 'Learn More',
    buttonLink: '#',
    bgColor: 'var(--theme-bg)',
  },
  RichText: {
    heading: 'Our Mission',
    body: 'We believe in creating products that are both beautiful and functional. Our team of designers and engineers work together to push the boundaries of what\'s possible.',
    alignment: 'center',
    bgColor: 'var(--theme-bg)',
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
    bgColor: 'var(--theme-bg)',
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
    bgColor: 'var(--theme-bg)',
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
    address: '123 Design Street, Creative District, San Francisco, CA 94102',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0977477265785!2d-122.41941528468156!3d37.77492977975903!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c6c8f4459%3A0xb10ed6d9b5050fa5!2sTwitter+HQ!5e0!3m2!1sen!2sus!4v1',
    phone: '+1 (555) 123-4567',
    email: 'hello@billionbiz.com',
    hours: 'Mon-Fri: 9am - 6pm | Sat: 10am - 4pm',
  },
  PricingTable: {
    heading: 'Simple, Transparent Pricing',
    plans: [
      { name: 'Starter', price: '$29', period: '/month', features: ['Up to 100 products', '2 staff accounts', 'Basic analytics', 'Email support', '2% transaction fee'], buttonText: 'Start Free Trial', highlighted: false },
      { name: 'Professional', price: '$79', period: '/month', features: ['Unlimited products', '5 staff accounts', 'Advanced analytics', 'Priority support', '1% transaction fee', 'Custom domain', 'Gift cards'], buttonText: 'Start Free Trial', highlighted: true },
      { name: 'Enterprise', price: '$299', period: '/month', features: ['Unlimited everything', '15 staff accounts', 'Custom reports', 'Dedicated manager', '0.5% transaction fee', 'Custom domain', 'Advanced API access'], buttonText: 'Contact Sales', highlighted: false },
    ],
  },
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
  Header: 'Header',
  HeroBanner: 'Hero Banner',
  FeaturedCollection: 'Featured Collection',
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
