import React, { useRef, useState, useEffect } from 'react';
import { useLandingEditorStore } from '../../store/landingEditorStore';
import { useSiteStore } from '../../store/siteStore';
import { PageRenderer } from './PageRenderer';
import { SettingsRenderer } from './SettingsRenderer';
import { AddSectionWidget } from './AddSectionWidget';
import styles from '../../pages/editor/EditorLayout.module.css';

export const EditorCanvas: React.FC = () => {
   const { isRightSidebarOpen, activePanel: activeTab, device, selectedPageId } = useLandingEditorStore();
   const { pages, theme } = useSiteStore();
   const containerRef = useRef<HTMLDivElement>(null);
   const [containerSize, setContainerSize] = useState({ width: 1280, height: 800 });
   const [isScrolled, setIsScrolled] = useState(false);

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
      const targetWidth = deviceType === 'mobile' ? 375 : deviceType === 'tablet' ? 768 : Math.max(1280, availableWidth);
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
            <div style={{ 
               width: `${targetWidth * scale}px`, 
               height: `${domHeight * scale}px` 
            }}>
               <div style={{
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                  width: `${targetWidth}px`,
                  height: `${domHeight}px`,
               }}>
                  <div 
                     className={`${styles.canvasWrapper} ${isScrolled ? 'isScrolled' : ''}`}
                     onScroll={(e) => {
                        const target = e.target as HTMLDivElement;
                        setIsScrolled(target.scrollTop > 10);
                     }}
                     style={{ 
                        width: '100%',
                        height: '100%',
                        margin: '0',
                     }}
                  >
               <PageRenderer page={pages.find(p => p.id === selectedPageId) || pages[0]} overrideDevice={deviceType} />
            </div>
         </div>
      </div>
      </div>
   );
   };

   return (
      <div
         ref={containerRef}
         className={`${styles.canvasArea} ${isRightSidebarOpen && activeTab === 'editor' ? styles.canvasShrink : ''}`}
         style={{
            '--theme-primary': theme?.colors?.primary || '#198754',
            '--theme-secondary': theme?.colors?.secondary || '#ff6b00',
            '--theme-bg': theme?.colors?.background || '#ffffff',
            '--theme-text': theme?.colors?.text || '#0f172a'
         } as React.CSSProperties}
      >
         {activeTab === 'settings' ? (
            <SettingsRenderer />
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
