import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useLandingEditorStore } from '../../store/landingEditorStore';
import { useSiteStore } from '../../store/siteStore';
import { ListEditor } from './EditorRightSidebar';
import styles from '../../pages/editor/EditorLayout.module.css';

export const SettingsRenderer: React.FC = () => {
  const { activeSettingItem } = useLandingEditorStore();
  const { settings, updateSettings } = useSiteStore();

  return (
    <div className={styles.settingsContentArea}>
       <div className={styles.settingsInner}>
          <div className={styles.scHeader}>
             <h2>{activeSettingItem || 'General Settings'}</h2>
             <p>
                {activeSettingItem === 'SEO & Geo' && 'Manage SEO titles, meta descriptions, structured data, sitemap, and social sharing images.'}
                {activeSettingItem === 'Social media' && 'Social links and share settings.'}
                {activeSettingItem === 'Header & Footer' && 'Manage global header and footer content.'}
                {activeSettingItem === 'Language' && 'Choose your default language and region settings.'}
                {(!activeSettingItem || activeSettingItem === 'General') && 'Manage your website basic information and global content.'}
             </p>
          </div>

          {/* ── General ── */}
          {(!activeSettingItem || activeSettingItem === 'General') && (
             <div className={styles.scGrid}>
                <div className={styles.scCol}>
                   <div className={styles.scCard}>
                      <h3>Site information</h3>
                      <p>Basic details about your website</p>

                      <div className={styles.scFormGroup}>
                         <label>Site name</label>
                         <input
                            type="text"
                            value={settings.siteTitle || ''}
                            onChange={(e) => updateSettings({ siteTitle: e.target.value })}
                            placeholder="BillionBiz"
                         />
                      </div>
                      <div className={styles.scFormGroup}>
                         <label>Site description</label>
                         <textarea
                            rows={4}
                            value={settings.siteDescription || ''}
                            onChange={(e) => updateSettings({ siteDescription: e.target.value })}
                            placeholder="A short description of your site"
                         />
                         <span className={styles.scCharCount}>{(settings.siteDescription || '').length} characters used</span>
                      </div>
                   </div>
                </div>

                <div className={styles.scCol}>
                   <div className={styles.scCard}>
                      <h3>Contact</h3>
                      <p>Your primary contact details</p>
                      <div className={styles.scFormGroup}>
                         <label>Email Address</label>
                         <input
                            type="email"
                            value={settings.contactEmail || ''}
                            onChange={(e) => updateSettings({ contactEmail: e.target.value })}
                            placeholder="hello@billionbiz.com"
                         />
                      </div>
                   </div>
                </div>
             </div>
          )}

          {/* ── SEO & Geo (all SEO‑related settings in one page) ── */}
          {activeSettingItem === 'SEO & Geo' && (
             <div className={styles.scGrid}>
                {/* Col 1 — Global SEO */}
                <div className={styles.scCol}>
                   <div className={styles.scCard}>
                      <h3>Global SEO</h3>
                      <p>These settings apply to all pages unless overridden.</p>

                      <div className={styles.scFormGroup}>
                         <label>SEO Title</label>
                         <input
                            type="text"
                            value={settings.siteTitle || ''}
                            onChange={(e) => updateSettings({ siteTitle: e.target.value })}
                         />
                         <span className={styles.scHint}>Appears in search‑engine results and browser tabs</span>
                      </div>
                      <div className={styles.scFormGroup}>
                         <label>Meta Description</label>
                         <textarea
                            rows={4}
                            value={settings.siteDescription || ''}
                            onChange={(e) => updateSettings({ siteDescription: e.target.value })}
                         />
                         <span className={styles.scCharCount}>{(settings.siteDescription || '').length} of 160 characters used</span>
                      </div>
                      <div className={styles.scFormGroup}>
                         <label>Meta Keywords</label>
                         <input
                            type="text"
                            value={settings.metaKeywords || ''}
                            onChange={(e) => updateSettings({ metaKeywords: e.target.value })}
                            placeholder="keyword1, keyword2, keyword3"
                         />
                         <span className={styles.scHint}>Comma‑separated keywords for search engines</span>
                      </div>
                      <div className={styles.scFormGroup}>
                         <label>Canonical URL</label>
                         <input
                            type="url"
                            value={settings.canonicalUrl || ''}
                            onChange={(e) => updateSettings({ canonicalUrl: e.target.value })}
                            placeholder="https://www.yoursite.com"
                         />
                         <span className={styles.scHint}>The preferred URL for this site</span>
                      </div>
                   </div>

                   {/* Structured Data / JSON‑LD */}
                   <div className={styles.scCard}>
                      <h3>Structured Data (JSON‑LD)</h3>
                      <p>Configure properties used for rich search results</p>
                      <div className={styles.scFormGroup}>
                         <label>Organization Name</label>
                         <input
                            type="text"
                            value={settings.orgName || ''}
                            onChange={(e) => updateSettings({ orgName: e.target.value })}
                            placeholder="BillionBiz Inc."
                         />
                      </div>
                      <div className={styles.scFormGroup}>
                         <label>Organization Logo URL</label>
                         <input
                            type="url"
                            value={settings.orgLogoUrl || ''}
                            onChange={(e) => updateSettings({ orgLogoUrl: e.target.value })}
                            placeholder="https://..."
                         />
                         <span className={styles.scHint}>Logo shown in Google knowledge panels</span>
                      </div>
                   </div>
                </div>

                {/* Col 2 — Sitemap, OG Image, Indexing */}
                <div className={styles.scCol}>
                   {/* Sitemap */}
                   <div className={styles.scCard}>
                      <h3>Sitemap</h3>
                      <p>Manage automatic sitemap generation</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                         <span style={{ fontSize: '14px', fontWeight: 500 }}>Enable Sitemap</span>
                         <input
                            type="checkbox"
                            style={{ width: '18px', height: '18px' }}
                            checked={settings.enableSitemap !== false}
                            onChange={(e) => updateSettings({ enableSitemap: e.target.checked })}
                         />
                      </div>
                      <div className={styles.scFormGroup} style={{ marginTop: '12px' }}>
                         <label>Sitemap URL</label>
                         <input
                            type="url"
                            value={settings.sitemapUrl || '/sitemap.xml'}
                            onChange={(e) => updateSettings({ sitemapUrl: e.target.value })}
                            disabled
                         />
                         <span className={styles.scHint}>Auto‑generated from your pages</span>
                      </div>
                   </div>

                   {/* OG Image */}
                   <div className={styles.scCard}>
                      <h3>Default OG Image</h3>
                      <p>This image is used when your site is shared on social platforms</p>
                      <div className={styles.scFormGroup}>
                         <label>Image URL</label>
                         <input
                            type="url"
                            value={settings.ogImageUrl || ''}
                            onChange={(e) => updateSettings({ ogImageUrl: e.target.value })}
                            placeholder="https://..."
                         />
                         <span className={styles.scHint}>Recommended size: 1200 × 630 px</span>
                      </div>
                      {settings.ogImageUrl && (
                         <div style={{ marginTop: '12px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                            <img src={settings.ogImageUrl} alt="OG Preview" style={{ width: '100%', height: 'auto', display: 'block' }} />
                         </div>
                      )}
                   </div>

                   {/* Indexing */}
                   <div className={styles.scCard}>
                      <h3>Search Engine Indexing</h3>
                      <p>Control how search engines crawl your site</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                         <div>
                            <span style={{ fontSize: '14px', fontWeight: 500, display: 'block' }}>Allow Indexing</span>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>If disabled, adds noindex/nofollow meta tags</span>
                         </div>
                         <input
                            type="checkbox"
                            style={{ width: '18px', height: '18px' }}
                            checked={settings.allowIndexing !== false}
                            onChange={(e) => updateSettings({ allowIndexing: e.target.checked })}
                         />
                      </div>
                   </div>
                </div>

                {/* Full‑width — Google Analytics / Search Console */}
                <div className={styles.scCardFull}>
                   <h3>Google Analytics / Search Console</h3>
                   <p>Add your tracking and verification codes</p>

                   <div className={styles.formRowHalf}>
                      <div className={styles.scFormGroup}>
                         <label>Google Analytics ID</label>
                         <input
                            type="text"
                            value={settings.gaId || ''}
                            onChange={(e) => updateSettings({ gaId: e.target.value })}
                            placeholder="G-XXXXXXXXXX"
                         />
                         <span className={styles.scHint}>Example: G-XXXXXXXXXX</span>
                      </div>
                      <div className={styles.scFormGroup}>
                         <label>Search Console Verification</label>
                         <input
                            type="text"
                            value={settings.gscVerification || ''}
                            onChange={(e) => updateSettings({ gscVerification: e.target.value })}
                            placeholder="Enter verification code"
                         />
                         <span className={styles.scHint}>HTML meta tag content value</span>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {/* ── Social media ── */}
          {activeSettingItem === 'Social media' && (
             <div className={styles.scGrid}>
                <div className={styles.scCol}>
                   <div className={styles.scCard}>
                      <h3>Social Links</h3>
                      <p>Connect your social media accounts</p>

                      <div className={styles.scFormGroup}>
                         <label>Twitter URL</label>
                         <input
                            type="url"
                            value={settings.twitterUrl || ''}
                            onChange={(e) => updateSettings({ twitterUrl: e.target.value })}
                            placeholder="https://twitter.com/..."
                         />
                      </div>
                      <div className={styles.scFormGroup}>
                         <label>Instagram URL</label>
                         <input
                            type="url"
                            value={settings.instagramUrl || ''}
                            onChange={(e) => updateSettings({ instagramUrl: e.target.value })}
                            placeholder="https://instagram.com/..."
                         />
                      </div>
                      <div className={styles.scFormGroup}>
                         <label>Facebook URL</label>
                         <input
                            type="url"
                            value={settings.facebookUrl || ''}
                            onChange={(e) => updateSettings({ facebookUrl: e.target.value })}
                            placeholder="https://facebook.com/..."
                         />
                      </div>
                      <div className={styles.scFormGroup}>
                         <label>LinkedIn URL</label>
                         <input
                            type="url"
                            value={settings.linkedinUrl || ''}
                            onChange={(e) => updateSettings({ linkedinUrl: e.target.value })}
                            placeholder="https://linkedin.com/..."
                         />
                      </div>
                      <div className={styles.scFormGroup}>
                         <label>YouTube URL</label>
                         <input
                            type="url"
                            value={settings.youtubeUrl || ''}
                            onChange={(e) => updateSettings({ youtubeUrl: e.target.value })}
                            placeholder="https://youtube.com/..."
                         />
                      </div>
                   </div>
                </div>
             </div>
          )}

          {/* ── Header & Footer ── */}
          {activeSettingItem === 'Header & Footer' && (
             <div className={styles.scCardFull}>
                <h3>Header & Footer Content</h3>
                <p>Set default text for header and footer sections</p>

                <div className={styles.formRowHalf}>
                   <div className={styles.scFormGroup}>
                      <label>Global Logo Text</label>
                      <input
                         type="text"
                         value={settings.logoText || ''}
                         onChange={(e) => updateSettings({ logoText: e.target.value })}
                      />
                      <span className={styles.scHint}>Text used for the logo in the header and footer</span>
                   </div>
                   <div className={styles.scFormGroup}>
                      <label>Footer copyright text</label>
                      <input
                         type="text"
                         value={settings.copyrightText || ''}
                         onChange={(e) => updateSettings({ copyrightText: e.target.value })}
                      />
                      <span className={styles.scHint}>This appears in the footer bottom</span>
                   </div>
                </div>
             </div>
          )}

          {/* ── Mobile Apps ── */}
          {activeSettingItem === 'Mobile Apps' && (
             <div className={styles.scCardFull}>
                <h3>Mobile Navigation</h3>
                <p>Configure the mobile app-like bottom navigation bar</p>

                <div className={styles.scFormGroup} style={{ marginTop: '16px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '6px', marginBottom: '20px' }}>
                      <div>
                         <span style={{ fontSize: '14px', fontWeight: 500, display: 'block' }}>Show Bottom Navigation</span>
                         <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Enable sticky bottom nav on mobile devices</span>
                      </div>
                      <input
                         type="checkbox"
                         style={{ width: '18px', height: '18px' }}
                         checked={settings.showBottomNav !== false}
                         onChange={(e) => updateSettings({ showBottomNav: e.target.checked })}
                      />
                   </div>

                   {settings.showBottomNav !== false && (
                      <div className={styles.scFormGroup}>
                         <label>Navigation Items (Max 5)</label>
                         <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', background: '#f8fafc' }}>
                            <ListEditor
                               items={settings.bottomNavLinks || []}
                               onChange={(items) => updateSettings({ bottomNavLinks: items })}
                               maxItems={5}
                               listFields={[
                                  { key: 'icon', label: 'Icon', type: 'icon' },
                                  { key: 'text', label: 'Text', type: 'text' },
                                  { key: 'link', label: 'Link', type: 'url' },
                               ]}
                            />
                         </div>
                      </div>
                   )}
                </div>
             </div>
          )}

          {/* ── Language ── */}
          {activeSettingItem === 'Language' && (
             <div className={styles.scGrid}>
                <div className={styles.scCol}>
                   <div className={styles.scCard}>
                      <h3>Default language</h3>
                      <p>Choose your default language</p>
                      <div className={styles.selectBoxFull} style={{ position: 'relative' }}>
                         <select
                           value={settings.language || 'en'}
                           onChange={(e) => updateSettings({ language: e.target.value })}
                           style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', appearance: 'none', paddingRight: '20px' }}
                         >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="hi">Hindi</option>
                            <option value="ta">Tamil</option>
                         </select>
                         <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '12px', pointerEvents: 'none' }} />
                      </div>
                   </div>
                </div>
             </div>
          )}
       </div>
    </div>
  );
};
