import React, { useRef, useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronRight, User, ShoppingBag } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { useSiteStore } from '../../store/siteStore';
import { PageRenderer } from './PageRenderer';
import { AddSectionWidget } from './AddSectionWidget';
import styles from '../../pages/editor/EditorLayout.module.css';

export const EditorCanvas: React.FC = () => {
   const { isRightSidebarOpen, activeTab, device, selectedPageId } = useEditorStore();
   const { pages, theme, settings, updateSettings } = useSiteStore();
   const containerRef = useRef<HTMLDivElement>(null);
   const [containerSize, setContainerSize] = useState({ width: 1280, height: 800 });

   useEffect(() => {
      const resizeObserver = new ResizeObserver((entries) => {
         for (const entry of entries) {
            setContainerSize({
               width: entry.contentRect.width,
               height: entry.contentRect.height
            });
         }
      });

      if (containerRef.current) {
         resizeObserver.observe(containerRef.current);
      }

      return () => resizeObserver.disconnect();
   }, []);

   const renderPreviewContent = (deviceType: 'desktop' | 'tablet' | 'mobile', availableWidth: number, availableHeight: number) => {
      const targetWidth = deviceType === 'mobile' ? 375 : deviceType === 'tablet' ? 768 : 1280;
      // Allow it to be smaller, but never zoom in (scale > 1)
      const scale = Math.min(1, availableWidth / targetWidth);
      
      const paddingY = 32; // 16px top + 16px bottom
      const visualHeight = Math.max(availableHeight - paddingY, 400); // Minimum 400px height visually
      const domHeight = visualHeight / scale;
      
      return (
         <div style={{
            width: `${availableWidth}px`,
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'center',
            padding: `${paddingY / 2}px 0`,
         }}>
            <div 
               className={styles.canvasWrapper} 
               style={{ 
                  width: `${targetWidth}px`,
                  minWidth: `${targetWidth}px`,
                  maxWidth: `${targetWidth}px`,
                  height: `${domHeight}px`,
                  zoom: scale,
                  margin: '0 auto',
                  overflowY: 'auto',
                  overflowX: 'hidden',
               }}
            >
               {activeTab === 'pages' || activeTab === 'theme' ? (
                  <div className={styles.previewPage}>
                     <div className={styles.announcementBar}>{settings.announcement}</div>
                     <div className={styles.previewHeader}>
                        <div className={styles.phLogo}>{settings.siteName}</div>
                        <div className={styles.phNav}>
                           <span>Home</span>
                           <span>Shop <ChevronDown size={12} /></span>
                           <span>Collections</span>
                           <span>About</span>
                           <span>Contact</span>
                        </div>
                        <div className={styles.phIcons}>
                           <Search size={18} />
                           <User size={18} />
                           <div className={styles.cartIconWrapper}>
                              <ShoppingBag size={18} />
                              <span className={styles.cartBadge}>2</span>
                           </div>
                        </div>
                     </div>

                     <div className={styles.collectionsPreview}>
                        <div className={styles.breadcrumb}>
                           <span>Home</span> <ChevronRight size={10} className={styles.bcIcon} /> <span>Collections</span>
                        </div>

                        <div className={styles.collectionsHeader}>
                           <h2>Shop Our Collections</h2>
                           <p>Explore our most popular collections handpicked for you</p>
                        </div>
                        <div className={styles.filterRow}>
                           <button className={styles.filterBtnOutline}>Filter</button>
                           <div className={styles.filterPills}>
                              <span className={styles.pillActive}>All</span>
                              <span className={styles.pill}>Furniture</span>
                              <span className={styles.pill}>Decor</span>
                              <span className={styles.pill}>Lighting</span>
                              <span className={styles.pill}>Accessories</span>
                           </div>
                           <div className={styles.sortDropdown}>
                              <span>Sort by</span>
                              <div className={styles.sortSelect}>Featured <ChevronDown size={14} /></div>
                           </div>
                        </div>
                        <div className={styles.collectionsGrid}>
                           {[
                              { name: 'Living Room', count: '32 items' },
                              { name: 'Bedroom', count: '28 items' },
                              { name: 'Dining Room', count: '24 items' },
                              { name: 'Home Office', count: '18 items' },
                              { name: 'Lighting', count: '26 items' },
                              { name: 'Decor', count: '42 items' },
                              { name: 'Outdoor', count: '20 items' },
                              { name: 'Accessories', count: '30 items' }
                           ].map((c, i) => (
                              <div key={i} className={styles.colCard}>
                                 <div className={styles.colImgWrapper}></div>
                                 <h4>{c.name}</h4>
                                 <p>{c.count}</p>
                              </div>
                           ))}
                        </div>

                        <div className={styles.featuresRow}>
                           <div className={styles.featureItem}>
                              <h4>Free shipping</h4><p>On orders over $99</p>
                           </div>
                           <div className={styles.featureItem}>
                              <h4>Easy returns</h4><p>30-day returns</p>
                           </div>
                           <div className={styles.featureItem}>
                              <h4>Secure payment</h4><p>100% secure checkout</p>
                           </div>
                           <div className={styles.featureItem}>
                              <h4>24/7 support</h4><p>Dedicated support</p>
                           </div>
                        </div>

                        <div className={styles.newsletterRow}>
                           <div>
                              <h4>Stay in the loop</h4>
                              <p>Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
                           </div>
                           <div className={styles.newsletterInput}>
                              <input type="text" placeholder="Enter your email" />
                              <button>Subscribe</button>
                           </div>
                        </div>
                     </div>
                  </div>
               ) : (
                  <PageRenderer page={pages.find(p => p.id === selectedPageId) || pages[0]} overrideDevice={deviceType} />
               )}
            </div>
         </div>
      );
   };

   return (
      <div
         ref={containerRef}
         className={`${styles.canvasArea} ${isRightSidebarOpen && activeTab === 'landing' ? styles.canvasShrink : ''}`}
         style={{
            '--theme-primary': theme?.colors?.primary || '#198754',
            '--theme-secondary': theme?.colors?.secondary || '#ff6b00',
            '--theme-bg': theme?.colors?.background || '#ffffff',
            '--theme-text': theme?.colors?.text || '#0f172a'
         } as React.CSSProperties}
      >
         {activeTab === 'settings' ? (
            <div className={styles.settingsContentArea}>
               <div className={styles.scHeader}>
                  <h2>General</h2>
                  <p>Manage your website basic information and global content.</p>
               </div>

               <div className={styles.scGrid}>
                  {/* Column 1 */}
                  <div className={styles.scCol}>
                     <div className={styles.scCard}>
                        <h3>Site information</h3>
                        <p>Basic details about your website</p>

                        <div className={styles.scFormGroup}>
                           <label>Site name</label>
                           <input
                              type="text"
                              value={settings.siteName || ''}
                              onChange={(e) => updateSettings({ siteName: e.target.value })}
                           />
                        </div>
                        <div className={styles.scFormGroup}>
                           <label>Tagline (Optional)</label>
                           <input
                              type="text"
                              value={settings.tagline || ''}
                              onChange={(e) => updateSettings({ tagline: e.target.value })}
                           />
                        </div>
                        <div className={styles.scFormGroup}>
                           <label>Site description</label>
                           <textarea
                              rows={4}
                              value={settings.description || ''}
                              onChange={(e) => updateSettings({ description: e.target.value })}
                           />
                           <span className={styles.scCharCount}>{(settings.description || '').length} of 160 characters used</span>
                        </div>
                     </div>

                     <div className={styles.scCard}>
                        <h3>Default OG Image</h3>
                        <p>This image will be used when your site is shared on social platforms</p>
                        <div className={styles.ogImageRow}>
                           <div className={styles.ogImgWrapper}>
                              <img src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=120&h=63&fit=crop" alt="OG" />
                           </div>
                           <div className={styles.ogImgInfo}>
                              <p className={styles.ogName}>og-image.jpg</p>
                              <p className={styles.ogSize}>1200 x 630px</p>
                           </div>
                           <div className={styles.scBtns}>
                              <button className={styles.btnOutline}>Change</button>
                              <button className={styles.btnOutline}>Remove</button>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Column 2 */}
                  <div className={styles.scCol}>
                     <div className={styles.scCard}>
                        <h3>Logo</h3>
                        <p>Your site logo</p>
                        <div className={styles.logoRow}>
                           <div className={styles.logoPreview}>BillionBiz</div>
                           <div className={styles.scBtns}>
                              <button className={styles.btnOutline}>Change</button>
                              <button className={styles.btnOutline}>Remove</button>
                           </div>
                        </div>
                        <p className={styles.recSize}>Recommended size: 200 x 60px</p>

                        <h3 className={styles.mt24}>Favicon</h3>
                        <p>Site icon shown in browser tabs</p>
                        <div className={styles.favRow}>
                           <div className={styles.favPreview}>B</div>
                           <div className={styles.favInfo}>
                              <p className={styles.favName}>favicon.ico</p>
                              <p className={styles.favSize}>32 x 32px</p>
                           </div>
                           <div className={styles.scBtns}>
                              <button className={styles.btnOutline}>Change</button>
                              <button className={styles.btnOutline}>Remove</button>
                           </div>
                        </div>
                     </div>

                     <div className={styles.scCard}>
                        <h3>Default language</h3>
                        <p>Choose your default language</p>
                        <div className={styles.selectBoxFull}>
                           <span>{settings.language || 'English'}</span><ChevronDown size={14} />
                        </div>
                     </div>
                  </div>

                  {/* Full width rows below */}
                  <div className={styles.scCardFull}>
                     <h3>Header & Footer Content</h3>
                     <p>Set default text for header and footer sections</p>

                     <div className={styles.formRowHalf}>
                        <div className={styles.scFormGroup}>
                           <label>Header announcement bar</label>
                           <input
                              type="text"
                              value={settings.announcement || ''}
                              onChange={(e) => updateSettings({ announcement: e.target.value })}
                           />
                           <span className={styles.scHint}>This appears on the top announcement bar</span>
                        </div>
                        <div className={styles.scFormGroup}>
                           <label>Footer copyright text</label>
                           <input
                              type="text"
                              value={settings.copyright || ''}
                              onChange={(e) => updateSettings({ copyright: e.target.value })}
                           />
                           <span className={styles.scHint}>This appears in the footer bottom</span>
                        </div>
                     </div>
                  </div>

                  <div className={styles.scCardFull}>
                     <h3>Google Analytics / Search Console</h3>
                     <p>Add your tracking and verification codes</p>

                     <div className={styles.formRowHalf}>
                        <div className={styles.scFormGroup}>
                           <label>Google Analytics ID</label>
                           <input type="text" placeholder="G-XXXXXXXXXX" />
                           <span className={styles.scHint}>Example: G-XXXXXXXXXX</span>
                        </div>
                        <div className={styles.scFormGroup}>
                           <label>Google Search Console Verification</label>
                           <input type="text" placeholder="Enter verification code" />
                           <span className={styles.scHint}>HTML meta tag content</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         ) : (
            <>
               <div style={{ width: '100%', height: '100%', overflowY: 'hidden' }}>
                  {device === 'all' ? (
                     <div style={{ display: 'flex', gap: '24px', width: '100%', justifyContent: 'center', padding: '0 16px' }}>
                        {(() => {
                           const netAvailableWidth = containerSize.width - 80; // 32px padding + 48px gaps
                           const totalTargetWidth = 1280 + 768 + 375;
                           const scale = Math.min(1, netAvailableWidth / totalTargetWidth);
                           
                           return (
                              <>
                                 {renderPreviewContent('desktop', 1280 * scale, containerSize.height)}
                                 {renderPreviewContent('tablet', 768 * scale, containerSize.height)}
                                 {renderPreviewContent('mobile', 375 * scale, containerSize.height)}
                              </>
                           );
                        })()}
                     </div>
                  ) : (
                     renderPreviewContent(device as any, containerSize.width - 32, containerSize.height)
                  )}
               </div>
            </>
         )}

         <AddSectionWidget />
      </div>
   );
};
