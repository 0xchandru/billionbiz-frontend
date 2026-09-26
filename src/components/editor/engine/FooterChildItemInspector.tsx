import React, { useState } from 'react';
import {
  ChevronLeft,
  X,
  Plus,
  Trash2,
} from 'lucide-react';
import styles from '../../../pages/editor/EditorLayout.module.css';
import { useEditorContextStore } from '../../../store/editorContextStore';
import type { FooterRow, FooterElement } from './types';

interface FooterChildItemInspectorProps {
  element: FooterElement;
  row: FooterRow;
  onClose: () => void;
}

const INTERNAL_ROUTES = [
  { label: 'Home', path: '/' },
  { label: 'All Products', path: '/products' },
  { label: 'Featured Collections', path: '/collections' },
  { label: 'New Arrivals', path: '/new' },
  { label: 'Discount Sale', path: '/sale' },
  { label: 'About Us', path: '/about' },
  { label: 'Contact Us', path: '/contact' },
  { label: 'Help Center & FAQ', path: '/help' },
  { label: 'Order Tracking', path: '/track' },
  { label: 'Shopping Cart', path: '/cart' },
  { label: 'User Account', path: '/account' },
  { label: 'Privacy Policy', path: '/privacy' },
  { label: 'Terms of Service', path: '/terms' },
];

export const FooterChildItemInspector: React.FC<FooterChildItemInspectorProps> = ({
  element,
  row,
  onClose,
}) => {
  const { updateFooterElement } = useEditorContextStore();
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'behavior'>('content');

  // Route picker modal state
  const [showRoutePicker, setShowRoutePicker] = useState(false);
  const [targetLinkIndex, setTargetLinkIndex] = useState<number | null>(null);

  // New Link modal state
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkHref, setNewLinkHref] = useState('');
  const [newLinkBadge, setNewLinkBadge] = useState('');
  const [showAddLinkModal, setShowAddLinkModal] = useState(false);

  const elProps = element.props || {};

  const handleUpdateProps = (updates: Record<string, any>) => {
    updateFooterElement(row.id, element.id, {
      props: {
        ...element.props,
        ...updates,
      },
    });
  };

  const isLinkGroup =
    element.type === 'link-group' ||
    element.type === 'navigation-menu' ||
    element.type === 'category-menu' ||
    element.type === 'policy-links';
  const isBrand =
    element.type === 'brand-description' ||
    element.type === 'brand-mission' ||
    element.type === 'logo';
  const isContact =
    element.type === 'contact' ||
    element.type === 'address' ||
    element.type === 'business-hours';
  const isSocial =
    element.type === 'social-links' ||
    element.type === 'social-icons' ||
    element.type === 'social-follow';
  const isNewsletter = element.type === 'newsletter-form';
  const isTrust = element.type === 'trust-badges' || element.type === 'shipping-benefits';
  const isPayment = element.type === 'payment-methods';
  const isCopyright = element.type === 'copyright';
  const isApp = element.type === 'app-download' || element.type === 'qr-code';

  const links: any[] = elProps.links || [
    { label: 'All Products', href: '/products' },
    { label: 'Collections', href: '/collections' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const handleAddLink = () => {
    if (!newLinkLabel.trim()) return;
    const updated = [
      ...links,
      {
        label: newLinkLabel.trim(),
        href: newLinkHref.trim() || '#',
        badge: newLinkBadge.trim() || undefined,
      },
    ];
    handleUpdateProps({ links: updated });
    setNewLinkLabel('');
    setNewLinkHref('');
    setNewLinkBadge('');
    setShowAddLinkModal(false);
  };

  const handleDeleteLink = (index: number) => {
    const updated = links.filter((_, idx) => idx !== index);
    handleUpdateProps({ links: updated });
  };

  const handleUpdateLink = (index: number, updates: Partial<any>) => {
    const updated = links.map((l, idx) => (idx === index ? { ...l, ...updates } : l));
    handleUpdateProps({ links: updated });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#ffffff',
        overflow: 'hidden',
      }}
    >
      {/* ─── Inspector Header: matching EditorRightSidebar ─── */}
      <div className={styles.panelHeader}>
        <div className={styles.phLeft}>
          <button className={styles.iconBtn} onClick={onClose} title="Back to Footer">
            <ChevronLeft size={20} className={styles.backIcon} />
          </button>
          <h3 className={styles.fw600}>{element.name}</h3>
        </div>
      </div>

      {/* ─── Exact EditorRightSidebar Tabs Header ─── */}
      <div className={styles.propTabs} style={{ overflowX: 'auto', flexWrap: 'nowrap' }}>
        {[
          { id: 'content', label: 'Content' },
          { id: 'design', label: 'Design' },
          { id: 'behavior', label: 'Behavior' },
        ].map((tab) => (
          <div
            key={tab.id}
            className={`${styles.propTab} ${activeTab === tab.id ? styles.activePropTab : ''}`}
            onClick={() => setActiveTab(tab.id as any)}
            style={{ flex: 1, padding: '12px 14px', whiteSpace: 'nowrap', cursor: 'pointer', textAlign: 'center' }}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* Main Tab Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {/* ========================================================
            TAB 1: CONTENT
            ======================================================== */}
        {activeTab === 'content' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* ─── 1. LINK GROUP EDITOR ─── */}
            {isLinkGroup && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Column Heading
                  </label>
                  <input
                    type="text"
                    value={elProps.heading || ''}
                    onChange={(e) => handleUpdateProps({ heading: e.target.value })}
                    placeholder="e.g. Products, Support, Company"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                      Links in Column ({links.length})
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowAddLinkModal(true)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: '#eff6ff',
                        color: '#2563eb',
                        border: '1px solid #bfdbfe',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <Plus size={12} /> Add Link
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {links.map((link, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          backgroundColor: '#f8fafc',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <input
                            type="text"
                            value={link.label || ''}
                            onChange={(e) => handleUpdateLink(idx, { label: e.target.value })}
                            placeholder="Link Title"
                            style={{
                              flex: 1,
                              padding: '5px 8px',
                              borderRadius: '4px',
                              border: '1px solid #cbd5e1',
                              fontSize: '12.5px',
                              fontWeight: 600,
                              outline: 'none',
                              marginRight: '8px',
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteLink(idx)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                              padding: '4px',
                            }}
                            title="Delete link"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input
                            type="text"
                            value={link.href || ''}
                            onChange={(e) => handleUpdateLink(idx, { href: e.target.value })}
                            placeholder="/path or https://"
                            style={{
                              flex: 1,
                              padding: '5px 8px',
                              borderRadius: '4px',
                              border: '1px solid #cbd5e1',
                              fontSize: '11.5px',
                              color: '#64748b',
                              outline: 'none',
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setTargetLinkIndex(idx);
                              setShowRoutePicker(true);
                            }}
                            style={{
                              padding: '5px 8px',
                              borderRadius: '4px',
                              backgroundColor: '#ffffff',
                              border: '1px solid #cbd5e1',
                              fontSize: '11px',
                              cursor: 'pointer',
                              color: '#334155',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Pick Page
                          </button>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <input
                            type="text"
                            value={link.badge || ''}
                            onChange={(e) => handleUpdateLink(idx, { badge: e.target.value })}
                            placeholder="Badge (e.g. HOT, NEW)"
                            style={{
                              width: '120px',
                              padding: '4px 6px',
                              borderRadius: '4px',
                              border: '1px solid #cbd5e1',
                              fontSize: '11px',
                              outline: 'none',
                            }}
                          />
                          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#64748b', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={Boolean(link.openInNewTab)}
                              onChange={(e) => handleUpdateLink(idx, { openInNewTab: e.target.checked })}
                            />
                            <span>New tab</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ─── 2. BRAND & BIO EDITOR ─── */}
            {isBrand && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Brand Name / Logo Text
                  </label>
                  <input
                    type="text"
                    value={elProps.text || ''}
                    onChange={(e) => handleUpdateProps({ text: e.target.value })}
                    placeholder="BillionBiz"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Logo Image URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={elProps.imageUrl || ''}
                    onChange={(e) => handleUpdateProps({ imageUrl: e.target.value, sourceType: e.target.value ? 'image' : 'theme' })}
                    placeholder="https://..."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Company Bio / Tagline Description
                  </label>
                  <textarea
                    rows={4}
                    value={elProps.text || ''}
                    onChange={(e) => handleUpdateProps({ text: e.target.value })}
                    placeholder="Short company mission, founder message, or bio..."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                    }}
                  />
                </div>
              </>
            )}

            {/* ─── 3. CONTACT DETAILS EDITOR ─── */}
            {isContact && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Customer Hotline Phone
                  </label>
                  <input
                    type="text"
                    value={elProps.phone || ''}
                    onChange={(e) => handleUpdateProps({ phone: e.target.value })}
                    placeholder="+1 (800) 555-0199"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={elProps.email || ''}
                    onChange={(e) => handleUpdateProps({ email: e.target.value })}
                    placeholder="care@billionbiz.in"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Store Address / Location
                  </label>
                  <input
                    type="text"
                    value={elProps.address || ''}
                    onChange={(e) => handleUpdateProps({ address: e.target.value })}
                    placeholder="100 Silicon Way, Tech District"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Operating Hours
                  </label>
                  <input
                    type="text"
                    value={elProps.hours || ''}
                    onChange={(e) => handleUpdateProps({ hours: e.target.value })}
                    placeholder="Mon - Sat: 9:00 AM - 8:00 PM EST"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </>
            )}

            {/* ─── 4. SOCIAL PROFILES EDITOR ─── */}
            {isSocial && (
              <>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Social Platforms & Handles
                </div>
                {(elProps.platforms || [
                  { platform: 'twitter', url: 'https://twitter.com', enabled: true },
                  { platform: 'instagram', url: 'https://instagram.com', enabled: true },
                  { platform: 'facebook', url: 'https://facebook.com', enabled: true },
                  { platform: 'youtube', url: 'https://youtube.com', enabled: true },
                  { platform: 'linkedin', url: 'https://linkedin.com', enabled: true },
                ]).map((p: any, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#f8fafc',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12.5px', fontWeight: 700, textTransform: 'capitalize', color: '#0f172a' }}>
                        {p.platform}
                      </span>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: '#64748b', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={p.enabled !== false}
                          onChange={(e) => {
                            const updated = [...(elProps.platforms || [])];
                            updated[idx] = { ...p, enabled: e.target.checked };
                            handleUpdateProps({ platforms: updated });
                          }}
                        />
                        <span>Enabled</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      value={p.url || ''}
                      onChange={(e) => {
                        const updated = [...(elProps.platforms || [])];
                        updated[idx] = { ...p, url: e.target.value };
                        handleUpdateProps({ platforms: updated });
                      }}
                      placeholder={`https://${p.platform}.com/...`}
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        borderRadius: '4px',
                        border: '1px solid #cbd5e1',
                        fontSize: '12px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                ))}
              </>
            )}

            {/* ─── 5. NEWSLETTER FORM EDITOR ─── */}
            {isNewsletter && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Headline
                  </label>
                  <input
                    type="text"
                    value={elProps.title || elProps.headline || ''}
                    onChange={(e) => handleUpdateProps({ title: e.target.value, headline: e.target.value })}
                    placeholder="Join Our VIP Insider List"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Subtitle / Incentive Copy
                  </label>
                  <input
                    type="text"
                    value={elProps.subtitle || elProps.description || ''}
                    onChange={(e) => handleUpdateProps({ subtitle: e.target.value, description: e.target.value })}
                    placeholder="Get 15% off your first order plus early access."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Discount Coupon Code
                  </label>
                  <input
                    type="text"
                    value={elProps.discountCode || 'WELCOME15'}
                    onChange={(e) => handleUpdateProps({ discountCode: e.target.value })}
                    placeholder="WELCOME15"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={elProps.buttonText || 'Subscribe'}
                    onChange={(e) => handleUpdateProps({ buttonText: e.target.value })}
                    placeholder="Subscribe"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </>
            )}

            {/* ─── 6. TRUST BADGES EDITOR ─── */}
            {isTrust && (
              <>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Trust Badges & Guarantees
                </div>
                {(elProps.items || [
                  { icon: 'shield-check', title: 'Bank-Grade Security', description: '256-bit SSL encrypted payments' },
                  { icon: 'truck', title: 'Fast Free Delivery', description: 'Orders shipped within 24 hours' },
                  { icon: 'refresh-cw', title: '30-Day Guarantees', description: 'Zero question return policy' },
                  { icon: 'headphones', title: '24/7 Priority Support', description: 'Direct access to support specialists' },
                ]).map((item: any, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#f8fafc',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <select
                        value={item.icon || 'shield-check'}
                        onChange={(e) => {
                          const updated = [...(elProps.items || [])];
                          updated[idx] = { ...item, icon: e.target.value };
                          handleUpdateProps({ items: updated });
                        }}
                        style={{
                          padding: '5px 8px',
                          borderRadius: '4px',
                          border: '1px solid #cbd5e1',
                          fontSize: '11px',
                          backgroundColor: '#ffffff',
                        }}
                      >
                        <option value="shield-check">Shield (Security)</option>
                        <option value="truck">Truck (Shipping)</option>
                        <option value="refresh-cw">Refresh (Returns)</option>
                        <option value="headphones">Headphones (Support)</option>
                        <option value="lock">Lock (Privacy)</option>
                        <option value="award">Award (Quality)</option>
                        <option value="star">Star (Top Rated)</option>
                      </select>
                      <input
                        type="text"
                        value={item.title || ''}
                        onChange={(e) => {
                          const updated = [...(elProps.items || [])];
                          updated[idx] = { ...item, title: e.target.value };
                          handleUpdateProps({ items: updated });
                        }}
                        placeholder="Title"
                        style={{
                          flex: 1,
                          padding: '5px 8px',
                          borderRadius: '4px',
                          border: '1px solid #cbd5e1',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      />
                    </div>
                    <input
                      type="text"
                      value={item.description || ''}
                      onChange={(e) => {
                        const updated = [...(elProps.items || [])];
                        updated[idx] = { ...item, description: e.target.value };
                        handleUpdateProps({ items: updated });
                      }}
                      placeholder="Short description"
                      style={{
                        width: '100%',
                        padding: '5px 8px',
                        borderRadius: '4px',
                        border: '1px solid #cbd5e1',
                        fontSize: '11.5px',
                        color: '#64748b',
                      }}
                    />
                  </div>
                ))}
              </>
            )}

            {/* ─── 7. PAYMENT METHODS CHECKLIST ─── */}
            {isPayment && (
              <>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Accepted Payment Providers
                </div>
                {[
                  { id: 'visa', label: 'Visa' },
                  { id: 'mastercard', label: 'Mastercard' },
                  { id: 'amex', label: 'American Express' },
                  { id: 'paypal', label: 'PayPal' },
                  { id: 'apple-pay', label: 'Apple Pay' },
                  { id: 'google-pay', label: 'Google Pay' },
                  { id: 'klarna', label: 'Klarna Pay Later' },
                  { id: 'shop-pay', label: 'Shop Pay' },
                ].map((provider) => {
                  const currentMethods: any[] = elProps.methods || [
                    { id: 'visa', enabled: true },
                    { id: 'mastercard', enabled: true },
                    { id: 'apple-pay', enabled: true },
                    { id: 'google-pay', enabled: true },
                    { id: 'paypal', enabled: true },
                    { id: 'klarna', enabled: true },
                  ];

                  const isEnabled = currentMethods.some((m) => (m.id === provider.id || m === provider.id) && m.enabled !== false);

                  return (
                    <label
                      key={provider.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        cursor: 'pointer',
                        fontSize: '13px',
                      }}
                    >
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>{provider.label}</span>
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={(e) => {
                          const exists = currentMethods.find((m) => m.id === provider.id || m === provider.id);
                          let updated: any[];
                          if (exists) {
                            updated = currentMethods.map((m) =>
                              (m.id === provider.id || m === provider.id) ? { id: provider.id, enabled: e.target.checked } : m
                            );
                          } else {
                            updated = [...currentMethods, { id: provider.id, enabled: e.target.checked }];
                          }
                          handleUpdateProps({ methods: updated });
                        }}
                      />
                    </label>
                  );
                })}
              </>
            )}

            {/* ─── 8. COPYRIGHT LINE ─── */}
            {isCopyright && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Copyright Notice
                  </label>
                  <input
                    type="text"
                    value={elProps.text || ''}
                    onChange={(e) => handleUpdateProps({ text: e.target.value })}
                    placeholder="© {year} Store Name. All rights reserved."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                    Tip: Use <code>{'{year}'}</code> to automatically insert the current year.
                  </div>
                </div>
              </>
            )}

            {isApp && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={elProps.title || 'Get our Mobile App'}
                    onChange={(e) => handleUpdateProps({ title: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Apple App Store Link
                  </label>
                  <input
                    type="text"
                    value={elProps.appStoreUrl || ''}
                    placeholder="https://apps.apple.com/app/..."
                    onChange={(e) => handleUpdateProps({ appStoreUrl: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Google Play Store Link
                  </label>
                  <input
                    type="text"
                    value={elProps.playStoreUrl || ''}
                    placeholder="https://play.google.com/store/apps/..."
                    onChange={(e) => handleUpdateProps({ playStoreUrl: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 2: DESIGN
            ======================================================== */}
        {activeTab === 'design' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Text / Heading Font Size
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="range"
                  min="11"
                  max="28"
                  value={elProps.fontSize || 14}
                  onChange={(e) => handleUpdateProps({ fontSize: Number(e.target.value) })}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: '12px', fontWeight: 600, width: '40px' }}>
                  {elProps.fontSize || 14}px
                </span>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Item Spacing & Gap
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="range"
                  min="4"
                  max="32"
                  value={elProps.gap || 12}
                  onChange={(e) => handleUpdateProps({ gap: Number(e.target.value) })}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: '12px', fontWeight: 600, width: '40px' }}>
                  {elProps.gap || 12}px
                </span>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Custom Color Override (Optional)
              </label>
              <input
                type="text"
                value={elProps.textColor || ''}
                onChange={(e) => handleUpdateProps({ textColor: e.target.value })}
                placeholder="e.g. #ffffff or rgba(255,255,255,0.8)"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: BEHAVIOR
            ======================================================== */}
        {activeTab === 'behavior' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: '#0f172a' }}>Visible on Desktop</div>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>Show this component on large screens</div>
              </div>
              <input
                type="checkbox"
                checked={elProps.showOnDesktop !== false}
                onChange={(e) => handleUpdateProps({ showOnDesktop: e.target.checked })}
              />
            </label>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: '#0f172a' }}>Visible on Mobile</div>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>Show this component on mobile devices</div>
              </div>
              <input
                type="checkbox"
                checked={elProps.showOnMobile !== false}
                onChange={(e) => handleUpdateProps({ showOnMobile: e.target.checked })}
              />
            </label>
          </div>
        )}
      </div>

      {/* Internal Route Picker Modal */}
      {showRoutePicker && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={() => setShowRoutePicker(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '360px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '480px',
            }}
          >
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Choose Store Destination</span>
              <button type="button" onClick={() => setShowRoutePicker(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>
            <div style={{ overflowY: 'auto', padding: '8px' }}>
              {INTERNAL_ROUTES.map((route, rIdx) => (
                <button
                  key={rIdx}
                  type="button"
                  onClick={() => {
                    if (targetLinkIndex !== null) {
                      handleUpdateLink(targetLinkIndex, { href: route.path, label: links[targetLinkIndex]?.label || route.label });
                    }
                    setShowRoutePicker(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{route.label}</span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{route.path}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Link Modal */}
      {showAddLinkModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={() => setShowAddLinkModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '360px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Add Navigation Link</span>
              <button type="button" onClick={() => setShowAddLinkModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                Link Title
              </label>
              <input
                type="text"
                value={newLinkLabel}
                onChange={(e) => setNewLinkLabel(e.target.value)}
                placeholder="e.g. Careers"
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                Destination URL / Path
              </label>
              <input
                type="text"
                value={newLinkHref}
                onChange={(e) => setNewLinkHref(e.target.value)}
                placeholder="/careers or https://..."
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                Badge Highlight (Optional)
              </label>
              <input
                type="text"
                value={newLinkBadge}
                onChange={(e) => setNewLinkBadge(e.target.value)}
                placeholder="e.g. NEW, HOT, HIRING"
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setShowAddLinkModal(false)}
                style={{ flex: 1, padding: '9px 0', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#475569', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddLink}
                style={{ flex: 1, padding: '9px 0', borderRadius: '6px', border: 'none', backgroundColor: '#2563eb', color: '#ffffff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                Add to Column
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FooterChildItemInspector;
