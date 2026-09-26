import fs from 'fs';
import path from 'path';

const designRightPanelsPath = path.resolve('src/components/editor/DesignRightPanels.tsx');
const themeEditorRightPanelPath = path.resolve('src/components/editor/right/ThemeEditorRightPanel.tsx');
const designPanelPath = path.resolve('src/components/editor/panels/DesignPanel.tsx');
const editorRightSidebarPath = path.resolve('src/components/editor/EditorRightSidebar.tsx');
const pageRendererPath = path.resolve('src/components/editor/PageRenderer.tsx');

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

console.log('--- Verifying Design Right Sidebar Implementation ---');

// 1. Check DesignRightPanels.tsx exports
const designRightContent = fs.readFileSync(designRightPanelsPath, 'utf-8');
assert(designRightContent.includes('export const LoaderSidebarPanel'), 'LoaderSidebarPanel is exported');
assert(designRightContent.includes('export const ScrollBehaviorSidebarPanel'), 'ScrollBehaviorSidebarPanel is exported');
assert(designRightContent.includes('export const MobileNavSidebarPanel'), 'MobileNavSidebarPanel is exported');
assert(designRightContent.includes('export const MobilePwaSidebarPanel'), 'MobilePwaSidebarPanel is exported');
assert(designRightContent.includes('export const MobileAppSidebarPanel'), 'MobileAppSidebarPanel is exported');

// 2. Check ThemeEditorRightPanel routes to each panel
const themeRightContent = fs.readFileSync(themeEditorRightPanelPath, 'utf-8');
assert(themeRightContent.includes("designSection === 'loader'"), 'Routes designSection === loader');
assert(themeRightContent.includes('<LoaderSidebarPanel'), 'Renders LoaderSidebarPanel');

assert(themeRightContent.includes("designSection === 'scroll-behavior'"), 'Routes designSection === scroll-behavior');
assert(themeRightContent.includes('<ScrollBehaviorSidebarPanel'), 'Renders ScrollBehaviorSidebarPanel');

assert(themeRightContent.includes("designSection === 'mobile-nav'"), 'Routes designSection === mobile-nav');
assert(themeRightContent.includes('<MobileNavSidebarPanel'), 'Renders MobileNavSidebarPanel');

assert(themeRightContent.includes("designSection === 'mobile-pwa'"), 'Routes designSection === mobile-pwa');
assert(themeRightContent.includes('<MobilePwaSidebarPanel'), 'Renders MobilePwaSidebarPanel');

assert(themeRightContent.includes("designSection === 'mobile-app'"), 'Routes designSection === mobile-app');
assert(themeRightContent.includes('<MobileAppSidebarPanel'), 'Renders MobileAppSidebarPanel');

// Check React Rules of Hooks compliance
assert(themeRightContent.includes('const ThemeCategoryRightPanel'), 'ThemeCategoryRightPanel is separated into its own component');
assert(!themeRightContent.slice(themeRightContent.indexOf('export const ThemeEditorRightPanel')).includes('useState'), 'ThemeEditorRightPanel router has no conditional useState hooks');

// 3. Check DesignPanel has click handlers for all items
const designPanelContent = fs.readFileSync(designPanelPath, 'utf-8');
assert(designPanelContent.includes("setDesignSection('loader')"), 'DesignPanel sets loader');
assert(designPanelContent.includes("setDesignSection('scroll-behavior')"), 'DesignPanel sets scroll-behavior');
assert(designPanelContent.includes("setDesignSection('mobile-nav')"), 'DesignPanel sets mobile-nav');
assert(designPanelContent.includes("setDesignSection('mobile-pwa')"), 'DesignPanel sets mobile-pwa');
assert(designPanelContent.includes("setDesignSection('mobile-app')"), 'DesignPanel sets mobile-app');
assert(designPanelContent.includes("setDesignSection('themes')"), 'DesignPanel sets themes');

// 4. Check EditorRightSidebar delegates activePanel === 'design' to ThemeEditorRightPanel
const editorRightSidebarContent = fs.readFileSync(editorRightSidebarPath, 'utf-8');
assert(editorRightSidebarContent.includes("activePanel === 'design'"), 'EditorRightSidebar checks activePanel === design');
assert(editorRightSidebarContent.includes('<ThemeEditorRightPanel'), 'EditorRightSidebar renders ThemeEditorRightPanel');

// 5. Check PageRenderer handles mobile bottom nav and back-to-top
const pageRendererContent = fs.readFileSync(pageRendererPath, 'utf-8');
assert(pageRendererContent.includes('bottomNavStyle'), 'PageRenderer extracts bottomNavStyle');
assert(pageRendererContent.includes('showBackToTop'), 'PageRenderer extracts showBackToTop');
assert(pageRendererContent.includes('ArrowUp'), 'PageRenderer renders ArrowUp back to top icon');

console.log('\n🎉 ALL CHECKS PASSED SUCCESSFULLY!');
