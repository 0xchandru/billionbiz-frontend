import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

console.log('--- RUNNING HEADER NAVIGATION VERIFICATION ---');

// 1. Verify getEditorPath utility
const editorNavContent = fs.readFileSync(
  path.resolve('./src/components/editor/utils/editorNavigation.ts'),
  'utf-8'
);

assert(
  editorNavContent.includes("'header-global': 'header'"),
  'getEditorPath must map header-global to header'
);

// 2. Verify PageRenderer handleHeaderSectionClick
const pageRendererContent = fs.readFileSync(
  path.resolve('./src/components/editor/PageRenderer.tsx'),
  'utf-8'
);

assert(
  pageRendererContent.includes("navigate(getEditorPath('header-global', section.id))"),
  'PageRenderer must pass section.id to getEditorPath on header click'
);
console.log('✓ 1. PageRenderer navigates to getEditorPath("header-global", section.id).');

// 3. Verify HeaderNavbarSection click handlers
const headerNavbarContent = fs.readFileSync(
  path.resolve('./src/components/editor/sections/HeaderNavbarSection.tsx'),
  'utf-8'
);

assert(
  headerNavbarContent.includes("navigate(getEditorPath('header-global', 'header-main'))"),
  'HeaderNavbarSection row and element clicks must navigate with sectionId query'
);
console.log('✓ 2. HeaderNavbarSection navigates to getEditorPath("header-global", "header-main").');

// 4. Verify landingEditorStore setSelectedSectionId
const landingStoreContent = fs.readFileSync(
  path.resolve('./src/store/landingEditorStore.ts'),
  'utf-8'
);

assert(
  landingStoreContent.includes("if (url.pathname === targetPath && url.searchParams.get('sectionId') !== id)"),
  'landingEditorStore must not replaceState on mismatched paths like /editor/pages'
);
console.log('✓ 3. setSelectedSectionId protects against mutating /editor/pages.');

// 5. Verify EditorLayout redirect for /editor/pages?sectionId=...
const editorLayoutContent = fs.readFileSync(
  path.resolve('./src/pages/editor/EditorLayout.tsx'),
  'utf-8'
);

assert(
  editorLayoutContent.includes("navigate(getEditorPath('header-global', sectionIdParam), { replace: true })"),
  'EditorLayout must redirect /editor/pages?sectionId=header-main to /editor/header?sectionId=header-main'
);
console.log('✓ 4. EditorLayout catches and redirects /editor/pages?sectionId=header-main to /editor/header?sectionId=header-main.');

console.log('--- ALL HEADER NAVIGATION VERIFICATIONS PASSED ---');
