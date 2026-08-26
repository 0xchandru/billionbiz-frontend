import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { useSiteStore } from '../../store/siteStore';
import styles from '../../pages/editor/EditorLayout.module.css';

export const SettingsRenderer: React.FC = () => {
  const { activeSettingItem } = useEditorStore();
  const { settings, updateSettings } = useSiteStore();

  return (
    <div className={styles.settingsContentArea}>
       <div className={styles.scHeader}>
          <h2>{activeSettingItem || 'General Settings'}</h2>
          <p>
             {activeSettingItem === 'SEO basic' && 'Manage your site title, meta description and indexing.'}
             {activeSettingItem === 'JSON-LD' && 'Configure structured data for search engines.'}
             {activeSettingItem === 'Sitemap' && 'Manage and update your automatically generated sitemap.'}
             {activeSettingItem === 'Social media' && 'Social links and share settings.'}
             {activeSettingItem === 'Header & Footer' && 'Manage global header and footer content.'}
             {activeSettingItem === 'OG Image' && 'Set the default image when sharing your site.'}
             {activeSettingItem === 'Language' && 'Choose your default language and region settings.'}
             {(!activeSettingItem || activeSettingItem === 'General') && 'Manage your website basic information and global content.'}
          </p>
       </div>

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

       {activeSettingItem === 'SEO basic' && (
          <div className={styles.scGrid}>
             <div className={styles.scCol}>
                <div className={styles.scCard}>
                   <h3>Global SEO</h3>
                   <p>These settings apply to all pages unless overridden.</p>

                   <div className={styles.scFormGroup}>
                      <label>Global SEO Title</label>
                      <input
                         type="text"
                         value={settings.siteTitle || ''}
                         onChange={(e) => updateSettings({ siteTitle: e.target.value })}
                      />
                   </div>
                   <div className={styles.scFormGroup}>
                      <label>Global Meta Description</label>
                      <textarea
                         rows={4}
                         value={settings.siteDescription || ''}
                         onChange={(e) => updateSettings({ siteDescription: e.target.value })}
                      />
                   </div>
                </div>
             </div>
          </div>
       )}

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
                </div>
             </div>
          </div>
       )}

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
                      </select>
                      <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '12px', pointerEvents: 'none' }} />
                   </div>
                </div>
             </div>
          </div>
       )}

       {activeSettingItem === 'OG Image' && (
          <div className={styles.scGrid}>
             <div className={styles.scCol}>
                <div className={styles.scCard}>
                   <h3>Default OG Image</h3>
                   <p>This image will be used when your site is shared on social platforms</p>
                   <div className={styles.scFormGroup}>
                      <label>Image URL</label>
                      <input
                         type="url"
                         value={settings.ogImageUrl || ''}
                         onChange={(e) => updateSettings({ ogImageUrl: e.target.value })}
                         placeholder="https://..."
                      />
                   </div>
                   {settings.ogImageUrl && (
                      <div className={styles.ogImageRow} style={{ marginTop: '16px' }}>
                         <div className={styles.ogImgWrapper}>
                            <img src={settings.ogImageUrl} alt="OG Preview" />
                         </div>
                      </div>
                   )}
                </div>
             </div>
          </div>
       )}

       {activeSettingItem === 'JSON-LD' && (
          <div className={styles.scGrid}>
             <div className={styles.scCol}>
                <div className={styles.scCard}>
                   <h3>Structured Data</h3>
                   <p>Configure JSON-LD properties</p>
                   <div className={styles.scFormGroup}>
                      <label>Organization Name</label>
                      <input
                         type="text"
                         value={settings.orgName || ''}
                         onChange={(e) => updateSettings({ orgName: e.target.value })}
                      />
                   </div>
                </div>
             </div>
          </div>
       )}
       
       {activeSettingItem === 'Sitemap' && (
          <div className={styles.scGrid}>
             <div className={styles.scCol}>
                <div className={styles.scCard}>
                   <h3>Sitemap Settings</h3>
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
                </div>
             </div>
          </div>
       )}
    </div>
  );
};
