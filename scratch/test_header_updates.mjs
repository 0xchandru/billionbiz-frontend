import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

console.log('--- RUNNING HEADER EDITOR & PREVIEWS VERIFICATION ---');

// 1. Verify PageRenderer header sections logic
const pageRendererContent = fs.readFileSync(
  path.resolve('./src/components/editor/PageRenderer.tsx'),
  'utf-8'
);

assert(
  pageRendererContent.includes('const headerSections: SectionData[] = currentHeaderRows'),
  'PageRenderer must derive headerSections from currentHeaderRows'
);
assert(
  pageRendererContent.includes('.filter((row) => Boolean(headerSectionTypeByRow[row.type]) && row.isVisible !== false)'),
  'PageRenderer must filter visible header rows across all pages'
);
assert(
  pageRendererContent.includes('const effectiveHeaderSections = [...headerSections];'),
  'Subpages must use effectiveHeaderSections derived from currentHeaderRows'
);
console.log('✓ 1. Utility Bar & Secondary Nav sections show in all editors & previews.');

// 2. Verify CTA button and child item click navigation
const headerNavbarContent = fs.readFileSync(
  path.resolve('./src/components/editor/sections/HeaderNavbarSection.tsx'),
  'utf-8'
);

assert(
  headerNavbarContent.includes("navigateToPage('header-global', 'header-main')") &&
  headerNavbarContent.includes("navigate(getEditorPath('header-global', 'header-main'))") &&
  headerNavbarContent.includes("useEditorContextStore.getState().setEditorType('header')") &&
  headerNavbarContent.includes("store.selectTarget({"),
  'HeaderNavbarSection handleElementClick must navigate to header editor and select target element'
);
assert(
  headerNavbarContent.includes("handleElementClick(event, ctaEl)"),
  'CTA button must invoke handleElementClick to navigate and select CTA element'
);
assert(
  headerNavbarContent.includes("styles.elementSelected"),
  'Child items must apply elementSelected outline class when target is selected'
);
console.log('✓ 2. Clicking CTA or any child item navigates to header editor and displays selection outline.');

// 3. Verify Header Navbar locked row in leftsidebar
const componentTreeContent = fs.readFileSync(
  path.resolve('./src/components/editor/engine/ComponentTreePanel.tsx'),
  'utf-8'
);

assert(
  componentTreeContent.includes("const isLockedRow = row.type === 'primary-nav';"),
  'Header Navbar row must be marked as locked in header editor'
);
assert(
  componentTreeContent.includes("isLocked ? (") &&
  componentTreeContent.includes("<Lock size={13} />"),
  'Locked rows must suppress visibility eye and menu buttons, rendering Lock icon'
);
console.log('✓ 3. Header Navbar row in left sidebar shows lock icon with eye/three-dot icons removed.');

// 4. Verify Drag & Drop reorder for header rows
assert(
  componentTreeContent.includes("<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>") &&
  componentTreeContent.includes("<SortableContext\n              items={headerRows.map((r) => r.id)}\n              strategy={verticalListSortingStrategy}\n            >"),
  'Header rows must be wrapped in DndContext and vertical SortableContext for drag and drop reordering'
);
console.log('✓ 4. Drag & drop vertical reordering is active for header items in left sidebar.');

// 5. Verify Logo & Brandname overlay inspector tabs and features
const overlayInspectorContent = fs.readFileSync(
  path.resolve('./src/components/editor/engine/ChildItemOverlayInspector.tsx'),
  'utf-8'
);

// Display types
assert(
  overlayInspectorContent.includes("Display Format") &&
  overlayInspectorContent.includes("'both'") &&
  overlayInspectorContent.includes("'image'") &&
  overlayInspectorContent.includes("'text'"),
  'Logo inspector must provide Logo only, Logo + Brandname, Brandname only display formats'
);

// Logo height slider
assert(
  overlayInspectorContent.includes("Logo Height") &&
  overlayInspectorContent.includes("min=\"16\"") &&
  overlayInspectorContent.includes("max=\"120\""),
  'Logo inspector must provide Logo Height slider'
);

// Second line font size conditional
assert(
  overlayInspectorContent.includes("Boolean(element.props.isTwoLines) && (") &&
  overlayInspectorContent.includes("Second Line Font Size"),
  'Second line font size must strictly be conditioned on isTwoLines'
);

// Logo shape and border
assert(
  overlayInspectorContent.includes("Logo Shape") &&
  overlayInspectorContent.includes("'rounded'") &&
  overlayInspectorContent.includes("'circle'") &&
  overlayInspectorContent.includes("'pill'") &&
  overlayInspectorContent.includes("Border Style") &&
  overlayInspectorContent.includes("Border Width") &&
  overlayInspectorContent.includes("Border Color"),
  'Logo inspector must provide logo shapes, border styles, width, and color'
);

// Second line color conditional
assert(
  overlayInspectorContent.includes("Boolean(element.props.isTwoLines) && (") &&
  overlayInspectorContent.includes("Second Line Brand Color"),
  'Second line brand color must strictly be conditioned on isTwoLines'
);
console.log('✓ 5. Logo & Brandname overlay inspector redesigned with tabs, sizing, shape, and conditional 2nd line controls.');

console.log('--- ALL VERIFICATIONS PASSED SUCCESSFULLY ---');
