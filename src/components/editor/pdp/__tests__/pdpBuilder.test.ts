// ============================================================
// PDP BUILDER — AUTOMATED SPECIFICATION TEST SUITE
// Verifies all critical rules from Specification §1 - §12
// ============================================================

import { describe, it, expect, beforeEach } from 'vitest';
import { usePdpStore } from '../pdpStore';
import { evaluateBlockVisibility, isContentEmpty } from '../pdpVisibilityEngine';
import { SAMPLE_PRODUCTS } from '../types/pdpProductTypes';
import { createPdpBlock, isProductInfoBlock, isTemplateSection } from '../pdpBlockRegistry';

describe('Universal PDP Builder — Automated Verification', () => {
  beforeEach(() => {
    usePdpStore.getState().resetToDefaults();
  });

  // ── TEST 1: EMPTY CONTENT DETECTION RULES ──
  describe('Rule: Empty Content Detection & Zero Handling (Spec §3)', () => {
    it('correctly identifies null and undefined as empty', () => {
      expect(isContentEmpty(null)).toBe(true);
      expect(isContentEmpty(undefined)).toBe(true);
    });

    it('correctly identifies empty strings and whitespace-only as empty', () => {
      expect(isContentEmpty('')).toBe(true);
      expect(isContentEmpty('   ')).toBe(true);
      expect(isContentEmpty('\t\n  ')).toBe(true);
      expect(isContentEmpty('Valid Text')).toBe(false);
    });

    it('correctly identifies empty arrays and arrays of empty items as empty', () => {
      expect(isContentEmpty([])).toBe(true);
      expect(isContentEmpty(['', '   ', null])).toBe(true);
      expect(isContentEmpty(['Valid Item'])).toBe(false);
    });

    it('CRITICAL: numeric zero (0) is VALID DATA and must NOT be treated as empty', () => {
      expect(isContentEmpty(0)).toBe(false);
      expect(isContentEmpty(0.0)).toBe(false);
      expect(isContentEmpty(100)).toBe(false);
    });

    it('boolean false is valid data and not treated as empty', () => {
      expect(isContentEmpty(false)).toBe(false);
    });
  });

  // ── TEST 2: CONTENT-BASED VISIBILITY ON SAMPLE PRODUCTS ──
  describe('Rule: Dynamic Content-Based Component Visibility (Spec §3 Table)', () => {
    const prodA = SAMPLE_PRODUCTS.find(p => p.id === 'prod-a')!; // Complete
    const prodB = SAMPLE_PRODUCTS.find(p => p.id === 'prod-b')!; // No Description, No Size Chart, No FAQ
    const prodC = SAMPLE_PRODUCTS.find(p => p.id === 'prod-c')!; // Has Description & Size Chart, No Specs, No Features
    const prodD = SAMPLE_PRODUCTS.find(p => p.id === 'prod-d')!; // Specs & FAQ only, No Description
    const prodE = SAMPLE_PRODUCTS.find(p => p.id === 'prod-e')!; // Zero Stock, Has Description & Features

    const descBlock = createPdpBlock('detail_full_description');
    const featuresBlock = createPdpBlock('detail_key_features');
    const specsBlock = createPdpBlock('detail_specifications');
    const sizeChartBlock = createPdpBlock('detail_size_chart');
    const faqBlock = createPdpBlock('detail_faq');
    const stockBlock = createPdpBlock('info_stock_status');

    it('Product A: Shows Description, Features, Specs, FAQ and hides Size Chart', () => {
      expect(evaluateBlockVisibility(descBlock, prodA).isVisible).toBe(true);
      expect(evaluateBlockVisibility(featuresBlock, prodA).isVisible).toBe(true);
      expect(evaluateBlockVisibility(specsBlock, prodA).isVisible).toBe(true);
      expect(evaluateBlockVisibility(faqBlock, prodA).isVisible).toBe(true);
      // Product A has no size chart
      const sizeRes = evaluateBlockVisibility(sizeChartBlock, prodA);
      expect(sizeRes.isVisible).toBe(false);
      expect(sizeRes.reason).toContain('No size chart available');
    });

    it('Product B: Hides Description, Shows Features, Shows Specs, Hides Size Chart & FAQ', () => {
      const descRes = evaluateBlockVisibility(descBlock, prodB);
      expect(descRes.isVisible).toBe(false);
      expect(descRes.reason).toContain('No product description');

      expect(evaluateBlockVisibility(featuresBlock, prodB).isVisible).toBe(true);
      expect(evaluateBlockVisibility(specsBlock, prodB).isVisible).toBe(true);

      const sizeRes = evaluateBlockVisibility(sizeChartBlock, prodB);
      expect(sizeRes.isVisible).toBe(false);

      const faqRes = evaluateBlockVisibility(faqBlock, prodB);
      expect(faqRes.isVisible).toBe(false);
      expect(faqRes.reason).toContain('No FAQ content');
    });

    it('Product C: Shows Description, Hides Features & Specs, Shows Size Chart, Hides FAQ', () => {
      expect(evaluateBlockVisibility(descBlock, prodC).isVisible).toBe(true);

      const featRes = evaluateBlockVisibility(featuresBlock, prodC);
      expect(featRes.isVisible).toBe(false);
      expect(featRes.reason).toContain('No feature content');

      const specRes = evaluateBlockVisibility(specsBlock, prodC);
      expect(specRes.isVisible).toBe(false);
      expect(specRes.reason).toContain('No specifications');

      expect(evaluateBlockVisibility(sizeChartBlock, prodC).isVisible).toBe(true);
      expect(evaluateBlockVisibility(faqBlock, prodC).isVisible).toBe(false);
    });

    it('Product D: Hides Description, Hides Features, Shows Specs & FAQ', () => {
      expect(evaluateBlockVisibility(descBlock, prodD).isVisible).toBe(false);
      expect(evaluateBlockVisibility(featuresBlock, prodD).isVisible).toBe(false);
      expect(evaluateBlockVisibility(specsBlock, prodD).isVisible).toBe(true);
      expect(evaluateBlockVisibility(faqBlock, prodD).isVisible).toBe(true);
    });

    it('Product E: Stock = 0 is rendered as valid data (Out of Stock), NOT hidden', () => {
      const stockRes = evaluateBlockVisibility(stockBlock, prodE);
      expect(stockRes.isVisible).toBe(true);
      expect(stockRes.reason).toBe('Visible for this product');
    });

    it('Manually disabling a component overrides data availability', () => {
      const disabledDesc = { ...descBlock, isHidden: true };
      const res = evaluateBlockVisibility(disabledDesc, prodA);
      expect(res.isVisible).toBe(false);
      expect(res.reason).toBe('Manually hidden by merchant');
    });

    it('Device-specific visibility hides component on specified viewport', () => {
      const mobileHiddenDesc = {
        ...descBlock,
        visibility: { ...descBlock.visibility, mobile: false },
      };
      expect(evaluateBlockVisibility(mobileHiddenDesc, prodA, 'desktop').isVisible).toBe(true);
      expect(evaluateBlockVisibility(mobileHiddenDesc, prodA, 'mobile').isVisible).toBe(false);
    });
  });

  // ── TEST 3: TEMPLATE CRUD & SAFE REASSIGNMENT ──
  describe('Rule: Multi-Template CRUD & Safe Reassignment (Spec §6, §9)', () => {
    it('creates a new template with isolated block IDs', () => {
      const store = usePdpStore.getState();
      const initialCount = store.templates.length;
      const newId = store.createTemplate('Test Template', 'For testing');

      const updated = usePdpStore.getState();
      expect(updated.templates.length).toBe(initialCount + 1);
      const created = updated.templates.find(t => t.id === newId);
      expect(created).toBeDefined();
      expect(created?.name).toBe('Test Template');
      expect(created?.blocks.length).toBeGreaterThan(0);
    });

    it('safely reassigns products to Default PDP when an assigned template is deleted', () => {
      const store = usePdpStore.getState();
      // Assign Product A to 'template-electronics'
      store.assignProductTemplate('prod-a', 'template-electronics');
      expect(usePdpStore.getState().products.find(p => p.id === 'prod-a')?.assignedTemplateId).toBe('template-electronics');

      // Delete 'template-electronics'
      const deleted = store.deleteTemplate('template-electronics');
      expect(deleted).toBe(true);

      // Verify Product A was safely reassigned to 'template-default'
      const defaultTmpl = usePdpStore.getState().templates.find(t => t.isDefault)!;
      const productA = usePdpStore.getState().products.find(p => p.id === 'prod-a')!;
      expect(productA.assignedTemplateId).toBe(defaultTmpl.id);
    });

    it('prevents deletion of the Default PDP', () => {
      const store = usePdpStore.getState();
      const deleted = store.deleteTemplate('template-default');
      expect(deleted).toBe(false);
      expect(usePdpStore.getState().templates.find(t => t.id === 'template-default')).toBeDefined();
    });
  });

  // ── TEST 4: BLOCK MANIPULATION & ORDERING ──
  describe('Rule: Block Manipulation, Reordering & Duplication (Spec §4)', () => {
    it('adds a block above or below a target component', () => {
      const store = usePdpStore.getState();
      const activeTmpl = store.getActiveTemplate();
      const firstBlockId = activeTmpl.blocks[0].id;

      const addedId = store.addBlock('custom_banner', 'above', firstBlockId);
      const updatedTmpl = usePdpStore.getState().getActiveTemplate();
      expect(updatedTmpl.blocks[0].id).toBe(addedId);
      expect(updatedTmpl.blocks[0].type).toBe('custom_banner');
    });

    it('duplicates a block preserving properties with a unique ID', () => {
      const store = usePdpStore.getState();
      const activeTmpl = store.getActiveTemplate();
      const targetBlock = activeTmpl.blocks[1];

      const dupId = store.duplicateBlock(targetBlock.id);
      const updatedTmpl = usePdpStore.getState().getActiveTemplate();
      const dupBlock = updatedTmpl.blocks.find(b => b.id === dupId);

      expect(dupBlock).toBeDefined();
      expect(dupBlock?.id).not.toBe(targetBlock.id);
      expect(dupBlock?.type).toBe(targetBlock.type);
      expect(dupBlock?.name).toBe(`${targetBlock.name} (Copy)`);
    });

    it('reorders blocks properly', () => {
      const store = usePdpStore.getState();
      const activeTmpl = store.getActiveTemplate();
      const block0 = activeTmpl.blocks[0].id;
      const block1 = activeTmpl.blocks[1].id;

      store.reorderBlocks(0, 1);
      const updatedTmpl = usePdpStore.getState().getActiveTemplate();
      expect(updatedTmpl.blocks[0].id).toBe(block1);
      expect(updatedTmpl.blocks[1].id).toBe(block0);
    });

    it('modifies one block design without altering other blocks', () => {
      const store = usePdpStore.getState();
      const activeTmpl = store.getActiveTemplate();
      const block0 = activeTmpl.blocks[0];
      const block1 = activeTmpl.blocks[1];

      store.updateBlockDesign(block0.id, { bgColor: '#ff0000', fontSize: 32 });

      const updatedTmpl = usePdpStore.getState().getActiveTemplate();
      const updated0 = updatedTmpl.blocks.find(b => b.id === block0.id)!;
      const updated1 = updatedTmpl.blocks.find(b => b.id === block1.id)!;

      expect(updated0.design.bgColor).toBe('#ff0000');
      expect(updated0.design.fontSize).toBe(32);
      expect(updated1.design.bgColor).not.toBe('#ff0000');
    });
  });

  // ── TEST 5: SHOPIFY ONLINE STORE 2.0 ARCHITECTURE ──
  describe('Rule: Shopify Online Store 2.0 Theme Editor Architecture', () => {
    it('accurately identifies Product information blocks vs Template sections', () => {
      const titleBlock = createPdpBlock('info_title');
      const priceBlock = createPdpBlock('price_display');
      const buyBlock = createPdpBlock('action_add_to_cart');
      const galleryBlock = createPdpBlock('media_gallery');
      const shortDesc = createPdpBlock('detail_short_description');
      const trustBlock = createPdpBlock('trust_badges');

      expect(isProductInfoBlock(titleBlock)).toBe(true);
      expect(isProductInfoBlock(priceBlock)).toBe(true);
      expect(isProductInfoBlock(buyBlock)).toBe(true);
      expect(isProductInfoBlock(galleryBlock)).toBe(true);
      expect(isProductInfoBlock(shortDesc)).toBe(true);
      expect(isProductInfoBlock(trustBlock)).toBe(true);

      const fullDesc = createPdpBlock('detail_full_description');
      const specs = createPdpBlock('detail_specifications');
      const faq = createPdpBlock('detail_faq');
      const recs = createPdpBlock('rec_related');

      expect(isTemplateSection(fullDesc)).toBe(true);
      expect(isTemplateSection(specs)).toBe(true);
      expect(isTemplateSection(faq)).toBe(true);
      expect(isTemplateSection(recs)).toBe(true);
    });

    it('moves a block between Product information and Page Sections smoothly', () => {
      const store = usePdpStore.getState();
      const activeTmpl = store.getActiveTemplate();
      const nonMediaBlock = activeTmpl.blocks.find(b => isProductInfoBlock(b) && !b.type.startsWith('media_'))!;

      expect(isProductInfoBlock(nonMediaBlock)).toBe(true);

      // Move into Page Sections
      store.updateBlockZone(nonMediaBlock.id, 'full_width');
      const updatedTmpl = usePdpStore.getState().getActiveTemplate();
      const movedBlock = updatedTmpl.blocks.find(b => b.id === nonMediaBlock.id)!;
      expect(isTemplateSection(movedBlock)).toBe(true);

      // Move back into Product information
      store.updateBlockZone(nonMediaBlock.id, 'buy_box');
      const revertedTmpl = usePdpStore.getState().getActiveTemplate();
      const revertedBlock = revertedTmpl.blocks.find(b => b.id === nonMediaBlock.id)!;
      expect(isProductInfoBlock(revertedBlock)).toBe(true);

      // Verify media blocks are locked inside Product information
      const mediaBlock = activeTmpl.blocks.find(b => b.type.startsWith('media_'))!;
      store.updateBlockZone(mediaBlock.id, 'full_width');
      const postMediaTmpl = usePdpStore.getState().getActiveTemplate();
      const postMediaBlock = postMediaTmpl.blocks.find(b => b.id === mediaBlock.id)!;
      expect(postMediaBlock.zone).toBe('media');
    });

    it('configures section-level settings for Product information (desktopMediaLayout, zoom, etc.)', () => {
      const store = usePdpStore.getState();
      const activeTmpl = store.getActiveTemplate();

      store.updateTemplateSettings(activeTmpl.id, {
        desktopMediaLayout: 'grid-2',
        mobileMediaLayout: 'stacked',
        imageZoom: 'lightbox',
        columnRatio: '60-40',
        stickyBuyBox: true,
      });

      const updatedTmpl = usePdpStore.getState().getActiveTemplate();
      expect(updatedTmpl.desktopMediaLayout).toBe('grid-2');
      expect(updatedTmpl.mobileMediaLayout).toBe('stacked');
      expect(updatedTmpl.imageZoom).toBe('lightbox');
      expect(updatedTmpl.columnRatio).toBe('60-40');
      expect(updatedTmpl.stickyBuyBox).toBe(true);
    });

    it('adds blocks in block mode inside Product information', () => {
      const store = usePdpStore.getState();
      store.openComponentLibrary('bottom', undefined, 'block');

      const addedId = store.addBlock('price_discount');
      const updatedTmpl = usePdpStore.getState().getActiveTemplate();
      const addedBlock = updatedTmpl.blocks.find(b => b.id === addedId)!;

      expect(isProductInfoBlock(addedBlock)).toBe(true);
    });

    it('adds sections in section mode as full width template sections', () => {
      const store = usePdpStore.getState();
      store.openComponentLibrary('bottom', undefined, 'section');

      const addedId = store.addBlock('detail_faq');
      const updatedTmpl = usePdpStore.getState().getActiveTemplate();
      const addedBlock = updatedTmpl.blocks.find(b => b.id === addedId)!;

      expect(isTemplateSection(addedBlock)).toBe(true);
    });
  });

  describe('Rule: Inner Blocks, Outer Blocks & Tree Hierarchy (Footer Style)', () => {
    it('creates a group block and adds inner child blocks inside it', () => {
      const store = usePdpStore.getState();
      const groupId = store.addBlock('group', 'inside', 'section-product-info');

      expect(groupId).toBeDefined();
      const tmpl1 = usePdpStore.getState().getActiveTemplate();
      const groupBlock = tmpl1.blocks.find(b => b.id === groupId)!;
      expect(groupBlock.type).toBe('group');

      // Add child block inside group
      const childId = store.addBlock('info_title', 'inside', groupId);
      const tmpl2 = usePdpStore.getState().getActiveTemplate();
      const updatedGroup = tmpl2.blocks.find(b => b.id === groupId)!;

      expect(updatedGroup.children).toBeDefined();
      expect(updatedGroup.children!.some(c => c.id === childId)).toBe(true);
    });

    it('moves a block into a group via moveBlockNode', () => {
      const store = usePdpStore.getState();
      const groupId = store.addBlock('group', 'bottom');
      const blockId = store.addBlock('price_display', 'bottom');

      store.moveBlockNode(blockId, groupId, 0);

      const tmpl = usePdpStore.getState().getActiveTemplate();
      const groupBlock = tmpl.blocks.find(b => b.id === groupId)!;
      expect(groupBlock.children?.some(c => c.id === blockId)).toBe(true);
      // Ensure block is no longer at root
      expect(tmpl.blocks.some(b => b.id === blockId)).toBe(false);
    });

    it('prevents circular references when moving a group inside its own child', () => {
      const store = usePdpStore.getState();
      const parentGroupId = store.addBlock('group', 'bottom');
      const childGroupId = store.addBlock('group', 'inside', parentGroupId);

      // Attempt illegal circular move: moving parent into its own child
      store.moveBlockNode(parentGroupId, childGroupId, 0);

      const tmpl = usePdpStore.getState().getActiveTemplate();
      // Parent should still remain at root, not inside child
      expect(tmpl.blocks.some(b => b.id === parentGroupId)).toBe(true);
    });

    it('recursively duplicates a group block along with its nested inner blocks', () => {
      const store = usePdpStore.getState();
      const groupId = store.addBlock('group', 'bottom');
      store.addBlock('info_title', 'inside', groupId);

      const duplicatedGroupId = store.duplicateBlock(groupId);
      expect(duplicatedGroupId).toBeDefined();

      const tmpl = usePdpStore.getState().getActiveTemplate();
      const duplicatedGroup = tmpl.blocks.find(b => b.id === duplicatedGroupId)!;
      expect(duplicatedGroup.id).not.toBe(groupId);
      expect(duplicatedGroup.children?.length).toBe(1);
      expect(duplicatedGroup.children![0].id).not.toBe(
        tmpl.blocks.find(b => b.id === groupId)!.children![0].id
      );
    });
  });
});
