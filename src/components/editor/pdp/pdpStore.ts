// ============================================================
// PDP BUILDER — ZUSTAND STORE
// State management for templates, blocks, products, and inspector
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PdpBlock, PdpBlockType, PdpTemplate, PdpBlockZone } from './types/pdpBlockTypes';
import type { PdpProduct } from './types/pdpProductTypes';
import { SAMPLE_PRODUCTS } from './types/pdpProductTypes';
import { getInitialPdpTemplates, createDefaultPdpTemplate } from './pdpDefaultTemplates';
import { createPdpBlock, PDP_BLOCK_DEFINITIONS, isProductInfoBlock } from './pdpBlockRegistry';
import { useLandingEditorStore } from '../../../store/landingEditorStore';

export type InspectorTab = 'content' | 'design' | 'visibility' | 'advanced';
export type PreviewDevice = 'desktop' | 'tablet' | 'mobile';

interface PdpHistoryState {
  past: PdpTemplate[][];
  future: PdpTemplate[][];
}

interface PdpStoreState {
  // ── Core Data ──
  templates: PdpTemplate[];
  activeTemplateId: string;
  selectedProductId: string;
  selectedBlockId: string | null;
  expandedBlockIds: string[];
  activeInspectorTab: InspectorTab;
  previewDevice: PreviewDevice;
  products: PdpProduct[];

  // ── Modals & Drawers ──
  isComponentLibraryOpen: boolean;
  libraryMode: 'block' | 'section' | 'all';
  insertPosition: 'bottom' | 'above' | 'below' | 'inside';
  insertTargetBlockId: string | null;
  isTemplateManagerOpen: boolean;

  // ── History ──
  history: PdpHistoryState;
  hasUnsavedChanges: boolean;

  // ── Selectors / Helpers ──
  getActiveTemplate: () => PdpTemplate;
  getSelectedProduct: () => PdpProduct;
  getSelectedBlock: () => PdpBlock | null;
  resolveTemplateForProduct: (product: PdpProduct) => PdpTemplate;
  getAssignedProductsForTemplate: (templateId: string) => PdpProduct[];

  // ── Template Actions ──
  selectTemplate: (templateId: string) => void;
  createTemplate: (name: string, description?: string, cloneFromId?: string) => string;
  duplicateTemplate: (templateId: string) => string;
  renameTemplate: (templateId: string, name: string, description?: string) => void;
  deleteTemplate: (templateId: string) => boolean;
  setDefaultTemplate: (templateId: string) => void;
  updateTemplateLayout: (templateId: string, layout: 'gallery-left' | 'gallery-right' | 'split' | 'stacked') => void;
  updateTemplateSettings: (templateId: string, settings: Partial<Pick<PdpTemplate, 'layout' | 'columnRatio' | 'stickyBuyBox' | 'pageWidth' | 'desktopMediaLayout' | 'mobileMediaLayout' | 'imageZoom' | 'columnGap' | 'detailsCardStyle'>>) => void;

  // ── Product Actions ──
  selectProduct: (productId: string) => void;
  assignProductTemplate: (productId: string, templateId: string | null) => void;
  bulkAssignTemplate: (productIds: string[], templateId: string | null) => void;
  updateProductData: (productId: string, updates: Partial<PdpProduct>) => void;

  // ── Block Selection & Inspector ──
  selectBlock: (blockId: string | null) => void;
  toggleBlockExpanded: (blockId: string) => void;
  expandBlock: (blockId: string) => void;
  collapseBlock: (blockId: string) => void;
  setActiveInspectorTab: (tab: InspectorTab) => void;
  setPreviewDevice: (device: PreviewDevice) => void;

  // ── Block Mutations ──
  addBlock: (type: PdpBlockType, position?: 'bottom' | 'above' | 'below' | 'inside', targetBlockId?: string) => string;
  removeBlock: (blockId: string) => void;
  duplicateBlock: (blockId: string) => string;
  reorderBlocks: (startIndex: number, endIndex: number) => void;
  moveBlock: (blockId: string, direction: 'up' | 'down') => void;
  moveBlockNode: (blockId: string, newParentId: string | null, targetIndex: number) => void;
  toggleBlockVisibility: (blockId: string) => void;
  toggleBlockLock: (blockId: string) => void;
  updateBlockName: (blockId: string, name: string) => void;
  updateBlockZone: (blockId: string, zone: PdpBlockZone) => void;
  updateBlockContent: (blockId: string, updates: Record<string, any>) => void;
  updateBlockDesign: (blockId: string, updates: Record<string, any>) => void;
  updateBlockVisibility: (blockId: string, updates: Record<string, any>) => void;
  updateBlockAdvanced: (blockId: string, updates: Record<string, any>) => void;
  resetBlockStyles: (blockId: string) => void;
  resetBlockConfig: (blockId: string) => void;

  // ── Modal Actions ──
  openComponentLibrary: (position?: 'bottom' | 'above' | 'below' | 'inside', targetBlockId?: string, libraryMode?: 'block' | 'section' | 'all') => void;
  closeComponentLibrary: () => void;
  setTemplateManagerOpen: (open: boolean) => void;

  // ── History & Persistence ──
  undo: () => void;
  redo: () => void;
  exportTemplateJson: (templateId?: string) => string;
  importTemplateJson: (jsonString: string) => boolean;
  resetToDefaults: () => void;
}

const MAX_HISTORY = 30;

function pushSnapshot(state: PdpStoreState): PdpHistoryState {
  const past = [...state.history.past, JSON.parse(JSON.stringify(state.templates))];
  if (past.length > MAX_HISTORY) past.shift();
  return {
    past,
    future: [],
  };
}

export function findBlockRecursively(blocks: PdpBlock[], id: string): PdpBlock | null {
  for (const b of blocks) {
    if (b.id === id) return b;
    if (b.children && b.children.length > 0) {
      const found = findBlockRecursively(b.children, id);
      if (found) return found;
    }
  }
  return null;
}

export function updateBlockRecursively(
  blocks: PdpBlock[],
  id: string,
  updater: (block: PdpBlock) => PdpBlock
): PdpBlock[] {
  return blocks.map(b => {
    if (b.id === id) {
      return updater(b);
    }
    if (b.children && b.children.length > 0) {
      return {
        ...b,
        children: updateBlockRecursively(b.children, id, updater),
      };
    }
    return b;
  });
}

export function removeBlockRecursively(blocks: PdpBlock[], id: string): PdpBlock[] {
  return blocks
    .filter(b => b.id !== id)
    .map(b => {
      if (b.children && b.children.length > 0) {
        return {
          ...b,
          children: removeBlockRecursively(b.children, id),
        };
      }
      return b;
    });
}

export function findBlockParent(blocks: PdpBlock[], targetId: string): { parent: PdpBlock | null; index: number } {
  const rootIndex = blocks.findIndex(b => b.id === targetId);
  if (rootIndex !== -1) {
    return { parent: null, index: rootIndex };
  }
  for (const b of blocks) {
    if (b.children && b.children.length > 0) {
      const childIndex = b.children.findIndex(c => c.id === targetId);
      if (childIndex !== -1) {
        return { parent: b, index: childIndex };
      }
      const nested = findBlockParent(b.children, targetId);
      if (nested.index !== -1) {
        return nested;
      }
    }
  }
  return { parent: null, index: -1 };
}

export function insertBlockAt(blocks: PdpBlock[], targetParentId: string | null, block: PdpBlock, index: number): PdpBlock[] {
  if (!targetParentId) {
    const next = [...blocks];
    const safeIdx = Math.max(0, Math.min(index, next.length));
    next.splice(safeIdx, 0, { ...block, parentId: null });
    return next;
  }
  return blocks.map(b => {
    if (b.id === targetParentId) {
      const children = [...(b.children || [])];
      const safeIdx = Math.max(0, Math.min(index, children.length));
      children.splice(safeIdx, 0, { ...block, parentId: targetParentId });
      return { ...b, children };
    }
    if (b.children && b.children.length > 0) {
      return { ...b, children: insertBlockAt(b.children, targetParentId, block, index) };
    }
    return b;
  });
}

export function isAncestorOf(blocks: PdpBlock[], ancestorId: string, potentialChildId: string): boolean {
  const ancestor = findBlockRecursively(blocks, ancestorId);
  if (!ancestor || !ancestor.children) return false;
  return Boolean(findBlockRecursively(ancestor.children, potentialChildId));
}

export const usePdpStore = create<PdpStoreState>()(
  persist(
    (set, get) => ({
      templates: getInitialPdpTemplates(),
      activeTemplateId: 'template-default',
      selectedProductId: 'prod-a',
      selectedBlockId: null,
      expandedBlockIds: ['section-product-info'],
      activeInspectorTab: 'content',
      previewDevice: 'desktop',
      products: SAMPLE_PRODUCTS,

      isComponentLibraryOpen: false,
      libraryMode: 'all',
      insertPosition: 'bottom',
      insertTargetBlockId: null,
      isTemplateManagerOpen: false,

      history: { past: [], future: [] },
      hasUnsavedChanges: false,

      // ── Selectors ──
      getActiveTemplate: () => {
        const state = get();
        return (
          state.templates.find(t => t.id === state.activeTemplateId) ||
          state.templates.find(t => t.isDefault) ||
          state.templates[0]
        );
      },

      getSelectedProduct: () => {
        const state = get();
        return (
          state.products.find(p => p.id === state.selectedProductId) ||
          state.products[0]
        );
      },

      getSelectedBlock: () => {
        const state = get();
        if (!state.selectedBlockId) return null;
        const activeTmpl = state.getActiveTemplate();
        return findBlockRecursively(activeTmpl.blocks, state.selectedBlockId);
      },

      resolveTemplateForProduct: (product: PdpProduct) => {
        const state = get();
        if (product.assignedTemplateId) {
          const assigned = state.templates.find(t => t.id === product.assignedTemplateId);
          if (assigned) return assigned;
        }
        // Fallback: Default PDP
        const def = state.templates.find(t => t.isDefault) || state.templates[0];
        return def;
      },

      getAssignedProductsForTemplate: (templateId: string) => {
        const state = get();
        const target = state.templates.find(t => t.id === templateId);
        if (!target) return [];
        if (target.isDefault) {
          // All products not assigned to another active custom template belong to the Default template
          const otherCustomTemplateIds = new Set(
            state.templates.filter(t => !t.isDefault).map(t => t.id)
          );
          return state.products.filter(
            p => !p.assignedTemplateId || !otherCustomTemplateIds.has(p.assignedTemplateId)
          );
        }
        return state.products.filter(p => p.assignedTemplateId === templateId);
      },

      // ── Template Actions ──
      selectTemplate: (templateId: string) => {
        const tmpl = get().templates.find(t => t.id === templateId);
        if (!tmpl) return;
        set({
          activeTemplateId: templateId,
          selectedBlockId: null,
        });
        useLandingEditorStore.getState().setRightSidebarOpen(false);
      },

      createTemplate: (name: string, description?: string, cloneFromId?: string) => {
        const state = get();
        const base = cloneFromId
          ? state.templates.find(t => t.id === cloneFromId)
          : state.getActiveTemplate();

        const id = `template-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
        const newBlocks: PdpBlock[] = base
          ? JSON.parse(JSON.stringify(base.blocks)).map((b: PdpBlock) => ({
              ...b,
              id: `block-${b.type}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
            }))
          : createDefaultPdpTemplate().blocks;

        const newTemplate: PdpTemplate = {
          id,
          name: name.trim() || 'Untitled PDP Template',
          description: description || 'Custom product detail page template',
          isDefault: false,
          layout: base?.layout || 'gallery-left',
          pageWidth: base?.pageWidth || 'standard',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          blocks: newBlocks,
        };

        set({
          history: pushSnapshot(state),
          templates: [...state.templates, newTemplate],
          activeTemplateId: id,
          selectedBlockId: newBlocks[0]?.id || null,
          hasUnsavedChanges: true,
        });

        return id;
      },

      duplicateTemplate: (templateId: string) => {
        const state = get();
        const src = state.templates.find(t => t.id === templateId) || state.getActiveTemplate();
        const newName = `${src.name} (Copy)`;
        return state.createTemplate(newName, src.description, src.id);
      },

      renameTemplate: (templateId: string, name: string, description?: string) => {
        const state = get();
        set({
          history: pushSnapshot(state),
          templates: state.templates.map(t => {
            if (t.id !== templateId) return t;
            return {
              ...t,
              name: name.trim() || t.name,
              description: description !== undefined ? description : t.description,
              updatedAt: new Date().toISOString(),
            };
          }),
          hasUnsavedChanges: true,
        });
      },

      deleteTemplate: (templateId: string) => {
        const state = get();
        const target = state.templates.find(t => t.id === templateId);
        // Do not allow deleting the default template or the last remaining template
        if (!target || target.isDefault || state.templates.length <= 1) {
          return false;
        }

        const defaultTemplate = state.templates.find(t => t.isDefault) || state.templates[0];

        // Safe Reassignment (Spec §9, §6): Reassign all products currently using this template to Default PDP
        const updatedProducts = state.products.map(p => {
          if (p.assignedTemplateId === templateId) {
            return { ...p, assignedTemplateId: defaultTemplate.id };
          }
          return p;
        });

        const newTemplates = state.templates.filter(t => t.id !== templateId);
        const newActiveId = state.activeTemplateId === templateId ? defaultTemplate.id : state.activeTemplateId;

        set({
          history: pushSnapshot(state),
          templates: newTemplates,
          products: updatedProducts,
          activeTemplateId: newActiveId,
          selectedBlockId: null,
          hasUnsavedChanges: true,
        });

        return true;
      },

      setDefaultTemplate: (templateId: string) => {
        const state = get();
        set({
          history: pushSnapshot(state),
          templates: state.templates.map(t => ({
            ...t,
            isDefault: t.id === templateId,
          })),
          hasUnsavedChanges: true,
        });
      },

      updateTemplateLayout: (templateId, layout) => {
        const state = get();
        set({
          history: pushSnapshot(state),
          templates: state.templates.map(t => {
            if (t.id !== templateId) return t;
            return { ...t, layout, updatedAt: new Date().toISOString() };
          }),
          hasUnsavedChanges: true,
        });
      },

      updateTemplateSettings: (templateId, settings) => {
        const state = get();
        set({
          history: pushSnapshot(state),
          templates: state.templates.map(t => {
            if (t.id !== templateId) return t;
            return {
              ...t,
              ...settings,
              updatedAt: new Date().toISOString(),
            };
          }),
          hasUnsavedChanges: true,
        });
      },

      // ── Product Actions ──
      selectProduct: (productId: string) => {
        const state = get();
        const prod = state.products.find(p => p.id === productId);
        if (!prod) return;

        // When switching preview product, automatically sync to the template assigned to this product
        const assignedTemplate = state.resolveTemplateForProduct(prod);

        set({
          selectedProductId: productId,
          activeTemplateId: assignedTemplate.id,
        });
      },

      assignProductTemplate: (productId: string, templateId: string | null) => {
        const state = get();
        set({
          products: state.products.map(p => {
            if (p.id !== productId) return p;
            return { ...p, assignedTemplateId: templateId };
          }),
          hasUnsavedChanges: true,
        });
      },

      bulkAssignTemplate: (productIds: string[], templateId: string | null) => {
        const state = get();
        set({
          products: state.products.map(p => {
            if (!productIds.includes(p.id)) return p;
            return { ...p, assignedTemplateId: templateId };
          }),
          hasUnsavedChanges: true,
        });
      },

      updateProductData: (productId: string, updates: Partial<PdpProduct>) => {
        const state = get();
        set({
          products: state.products.map(p => {
            if (p.id !== productId) return p;
            return { ...p, ...updates };
          }),
          hasUnsavedChanges: true,
        });
      },

      // ── Block Selection & Inspector ──
      selectBlock: (blockId: string | null) => {
        set({ selectedBlockId: blockId });
        useLandingEditorStore.getState().setRightSidebarOpen(Boolean(blockId));
      },

      toggleBlockExpanded: (blockId: string) => {
        set(state => ({
          expandedBlockIds: state.expandedBlockIds.includes(blockId)
            ? state.expandedBlockIds.filter(id => id !== blockId)
            : [...state.expandedBlockIds, blockId],
        }));
      },

      expandBlock: (blockId: string) => {
        set(state => ({
          expandedBlockIds: state.expandedBlockIds.includes(blockId)
            ? state.expandedBlockIds
            : [...state.expandedBlockIds, blockId],
        }));
      },

      collapseBlock: (blockId: string) => {
        set(state => ({
          expandedBlockIds: state.expandedBlockIds.filter(id => id !== blockId),
        }));
      },

      setActiveInspectorTab: (tab: InspectorTab) => {
        set({ activeInspectorTab: tab });
      },

      setPreviewDevice: (device: PreviewDevice) => {
        set({ previewDevice: device });
      },

      // ── Block Mutations ──
      addBlock: (type: PdpBlockType, position = 'bottom', targetBlockId) => {
        const state = get();
        const activeTmpl = state.getActiveTemplate();
        const newBlock = createPdpBlock(type);

        // Zone assignment based on context
        if (state.libraryMode === 'block' && newBlock.zone !== 'media') {
          newBlock.zone = 'buy_box';
        } else if (state.libraryMode === 'section') {
          newBlock.zone = 'full_width';
        }

        let currentBlocks = [...activeTmpl.blocks];

        if (position === 'inside') {
          if (targetBlockId === 'section-product-info' || !targetBlockId) {
            let lastInfoIdx = -1;
            for (let i = currentBlocks.length - 1; i >= 0; i--) {
              if (isProductInfoBlock(currentBlocks[i])) {
                lastInfoIdx = i;
                break;
              }
            }
            const insertIdx = lastInfoIdx !== -1 ? lastInfoIdx + 1 : currentBlocks.length;
            newBlock.parentId = null;
            newBlock.zone = 'buy_box';
            currentBlocks.splice(insertIdx, 0, newBlock);
          } else {
            const targetNode = findBlockRecursively(currentBlocks, targetBlockId);
            if (targetNode) {
              newBlock.parentId = targetNode.id;
              newBlock.zone = targetNode.zone || 'buy_box';
              const targetLen = targetNode.children ? targetNode.children.length : 0;
              currentBlocks = insertBlockAt(currentBlocks, targetNode.id, newBlock, targetLen);
            } else {
              currentBlocks.push(newBlock);
            }
          }
        } else if (targetBlockId) {
          const { parent, index } = findBlockParent(currentBlocks, targetBlockId);
          const insertIdx = position === 'above' ? index : index + 1;
          newBlock.parentId = parent ? parent.id : null;
          if (parent) {
            newBlock.zone = parent.zone || 'buy_box';
          }
          currentBlocks = insertBlockAt(currentBlocks, parent ? parent.id : null, newBlock, insertIdx);
        } else {
          // Default: bottom
          if (state.libraryMode === 'block') {
            let lastInfoIdx = -1;
            for (let i = currentBlocks.length - 1; i >= 0; i--) {
              if (isProductInfoBlock(currentBlocks[i])) {
                lastInfoIdx = i;
                break;
              }
            }
            const insertIdx = lastInfoIdx !== -1 ? lastInfoIdx + 1 : currentBlocks.length;
            currentBlocks.splice(insertIdx, 0, newBlock);
          } else {
            currentBlocks.push(newBlock);
          }
        }

        set({
          history: pushSnapshot(state),
          templates: state.templates.map(t => {
            if (t.id !== activeTmpl.id) return t;
            return { ...t, blocks: currentBlocks, updatedAt: new Date().toISOString() };
          }),
          selectedBlockId: newBlock.id,
          activeInspectorTab: 'content',
          isComponentLibraryOpen: false,
          hasUnsavedChanges: true,
        });
        useLandingEditorStore.getState().setRightSidebarOpen(true);

        return newBlock.id;
      },

      removeBlock: (blockId: string) => {
        const state = get();
        const activeTmpl = state.getActiveTemplate();
        const newBlocks = removeBlockRecursively(activeTmpl.blocks, blockId);

        let nextSelectedId: string | null = null;
        if (state.selectedBlockId === blockId) {
          nextSelectedId = null;
          useLandingEditorStore.getState().setRightSidebarOpen(false);
        } else {
          nextSelectedId = state.selectedBlockId;
        }

        set({
          history: pushSnapshot(state),
          templates: state.templates.map(t => {
            if (t.id !== activeTmpl.id) return t;
            return { ...t, blocks: newBlocks, updatedAt: new Date().toISOString() };
          }),
          selectedBlockId: nextSelectedId,
          hasUnsavedChanges: true,
        });
      },

      duplicateBlock: (blockId: string) => {
        const state = get();
        const activeTmpl = state.getActiveTemplate();
        const src = findBlockRecursively(activeTmpl.blocks, blockId);
        if (!src) return '';

        const { parent, index } = findBlockParent(activeTmpl.blocks, blockId);

        const cloneWithNewIds = (b: PdpBlock, newParentId: string | null): PdpBlock => {
          const freshId = `block-${b.type}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
          return {
            ...JSON.parse(JSON.stringify(b)),
            id: freshId,
            parentId: newParentId,
            name: `${b.name} (Copy)`,
            children: b.children ? b.children.map(c => cloneWithNewIds(c, freshId)) : [],
          };
        };

        const duplicated = cloneWithNewIds(src, parent ? parent.id : null);
        const newBlocks = insertBlockAt(activeTmpl.blocks, parent ? parent.id : null, duplicated, index + 1);

        set({
          history: pushSnapshot(state),
          templates: state.templates.map(t => {
            if (t.id !== activeTmpl.id) return t;
            return { ...t, blocks: newBlocks, updatedAt: new Date().toISOString() };
          }),
          selectedBlockId: duplicated.id,
          hasUnsavedChanges: true,
        });
        useLandingEditorStore.getState().setRightSidebarOpen(true);

        return duplicated.id;
      },

      reorderBlocks: (startIndex: number, endIndex: number) => {
        const state = get();
        const activeTmpl = state.getActiveTemplate();
        if (
          startIndex < 0 ||
          startIndex >= activeTmpl.blocks.length ||
          endIndex < 0 ||
          endIndex >= activeTmpl.blocks.length ||
          startIndex === endIndex
        ) {
          return;
        }

        const newBlocks = [...activeTmpl.blocks];
        const [moved] = newBlocks.splice(startIndex, 1);
        newBlocks.splice(endIndex, 0, moved);

        set({
          history: pushSnapshot(state),
          templates: state.templates.map(t => {
            if (t.id !== activeTmpl.id) return t;
            return { ...t, blocks: newBlocks, updatedAt: new Date().toISOString() };
          }),
          hasUnsavedChanges: true,
        });
      },

      moveBlock: (blockId: string, direction: 'up' | 'down') => {
        const state = get();
        const activeTmpl = state.getActiveTemplate();
        const { parent, index } = findBlockParent(activeTmpl.blocks, blockId);
        if (index === -1) return;

        const siblings = parent ? (parent.children || []) : activeTmpl.blocks;
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= siblings.length) return;

        state.moveBlockNode(blockId, parent ? parent.id : null, targetIndex);
      },

      moveBlockNode: (blockId: string, newParentId: string | null, targetIndex: number) => {
        const state = get();
        const activeTmpl = state.getActiveTemplate();

        const node = findBlockRecursively(activeTmpl.blocks, blockId);
        if (!node) return;

        // Prevent moving into self or descendant
        if (newParentId === blockId) return;
        if (newParentId && isAncestorOf(activeTmpl.blocks, blockId, newParentId)) return;

        const isMedia = node.type.startsWith('media_') || node.category === 'Product Media';

        // Product media cannot be moved outside Product information (into nested groups or outer page sections)
        if (isMedia && newParentId !== null && newParentId !== 'section-product-info') {
          return;
        }

        // Determine original parent and index
        const { parent: oldParent, index: oldIndex } = findBlockParent(activeTmpl.blocks, blockId);
        const oldParentId = oldParent ? oldParent.id : null;

        let adjustedIndex = targetIndex;
        if (oldParentId === newParentId && oldIndex !== -1 && oldIndex < targetIndex) {
          adjustedIndex = targetIndex - 1;
        }

        // If moving into 'section-product-info', its parentId should be null
        const resolvedParentId = newParentId === 'section-product-info' ? null : newParentId;

        // Remove from old position
        let newBlocks = removeBlockRecursively(activeTmpl.blocks, blockId);

        // Product media ALWAYS preserves its 'media' zone, never accidentally becoming 'buy_box'
        const updatedNode: PdpBlock = {
          ...node,
          parentId: isMedia ? null : resolvedParentId,
          zone: isMedia
            ? 'media'
            : resolvedParentId
            ? (findBlockRecursively(activeTmpl.blocks, resolvedParentId)?.zone || 'buy_box')
            : (newParentId === 'section-product-info' ? 'buy_box' : node.zone),
        };

        newBlocks = insertBlockAt(newBlocks, resolvedParentId, updatedNode, adjustedIndex);

        set({
          history: pushSnapshot(state),
          templates: state.templates.map(t => {
            if (t.id !== activeTmpl.id) return t;
            return { ...t, blocks: newBlocks, updatedAt: new Date().toISOString() };
          }),
          hasUnsavedChanges: true,
        });
      },

      toggleBlockVisibility: (blockId: string) => {
        const state = get();
        const activeTmpl = state.getActiveTemplate();
        const newBlocks = updateBlockRecursively(activeTmpl.blocks, blockId, b => ({
          ...b,
          isHidden: !b.isHidden,
        }));
        set({
          history: pushSnapshot(state),
          templates: state.templates.map(t => (t.id === activeTmpl.id ? { ...t, blocks: newBlocks, updatedAt: new Date().toISOString() } : t)),
          hasUnsavedChanges: true,
        });
      },

      toggleBlockLock: (blockId: string) => {
        const state = get();
        const activeTmpl = state.getActiveTemplate();
        const newBlocks = updateBlockRecursively(activeTmpl.blocks, blockId, b => ({
          ...b,
          isLocked: !b.isLocked,
        }));
        set({
          templates: state.templates.map(t => (t.id === activeTmpl.id ? { ...t, blocks: newBlocks } : t)),
        });
      },

      updateBlockName: (blockId: string, name: string) => {
        const state = get();
        const activeTmpl = state.getActiveTemplate();
        const newBlocks = updateBlockRecursively(activeTmpl.blocks, blockId, b => ({
          ...b,
          name,
        }));
        set({
          templates: state.templates.map(t => (t.id === activeTmpl.id ? { ...t, blocks: newBlocks, updatedAt: new Date().toISOString() } : t)),
          hasUnsavedChanges: true,
        });
      },

      updateBlockZone: (blockId: string, zone: PdpBlockZone) => {
        const state = get();
        const activeTmpl = state.getActiveTemplate();
        const targetBlock = findBlockRecursively(activeTmpl.blocks, blockId);
        // Product Media cannot have its zone changed out of media
        if (targetBlock && (targetBlock.category === 'Product Media' || targetBlock.type.startsWith('media_'))) {
          return;
        }
        const newBlocks = updateBlockRecursively(activeTmpl.blocks, blockId, b => ({
          ...b,
          zone,
        }));
        set({
          history: pushSnapshot(state),
          templates: state.templates.map(t => (t.id === activeTmpl.id ? { ...t, blocks: newBlocks, updatedAt: new Date().toISOString() } : t)),
          hasUnsavedChanges: true,
        });
      },

      updateBlockContent: (blockId: string, updates: Record<string, any>) => {
        const state = get();
        const activeTmpl = state.getActiveTemplate();
        const newBlocks = updateBlockRecursively(activeTmpl.blocks, blockId, b => ({
          ...b,
          content: { ...b.content, ...updates },
        }));
        set({
          templates: state.templates.map(t => (t.id === activeTmpl.id ? { ...t, blocks: newBlocks, updatedAt: new Date().toISOString() } : t)),
          hasUnsavedChanges: true,
        });
      },

      updateBlockDesign: (blockId: string, updates: Record<string, any>) => {
        const state = get();
        const activeTmpl = state.getActiveTemplate();
        const newBlocks = updateBlockRecursively(activeTmpl.blocks, blockId, b => ({
          ...b,
          design: { ...b.design, ...updates },
        }));
        set({
          templates: state.templates.map(t => (t.id === activeTmpl.id ? { ...t, blocks: newBlocks, updatedAt: new Date().toISOString() } : t)),
          hasUnsavedChanges: true,
        });
      },

      updateBlockVisibility: (blockId: string, updates: Record<string, any>) => {
        const state = get();
        const activeTmpl = state.getActiveTemplate();
        const newBlocks = updateBlockRecursively(activeTmpl.blocks, blockId, b => ({
          ...b,
          visibility: { ...b.visibility, ...updates },
        }));
        set({
          templates: state.templates.map(t => (t.id === activeTmpl.id ? { ...t, blocks: newBlocks, updatedAt: new Date().toISOString() } : t)),
          hasUnsavedChanges: true,
        });
      },

      updateBlockAdvanced: (blockId: string, updates: Record<string, any>) => {
        const state = get();
        const activeTmpl = state.getActiveTemplate();
        const newBlocks = updateBlockRecursively(activeTmpl.blocks, blockId, b => ({
          ...b,
          advanced: { ...b.advanced, ...updates },
        }));
        set({
          templates: state.templates.map(t => (t.id === activeTmpl.id ? { ...t, blocks: newBlocks, updatedAt: new Date().toISOString() } : t)),
          hasUnsavedChanges: true,
        });
      },

      resetBlockStyles: (blockId: string) => {
        const state = get();
        const activeTmpl = state.getActiveTemplate();
        const block = findBlockRecursively(activeTmpl.blocks, blockId);
        if (!block) return;
        const def = PDP_BLOCK_DEFINITIONS[block.type];

        const newBlocks = updateBlockRecursively(activeTmpl.blocks, blockId, b => ({
          ...b,
          design: {
            padding: { top: 8, right: 0, bottom: 8, left: 0 },
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
            ...def?.defaultDesign,
          },
        }));

        set({
          history: pushSnapshot(state),
          templates: state.templates.map(t => (t.id === activeTmpl.id ? { ...t, blocks: newBlocks, updatedAt: new Date().toISOString() } : t)),
          hasUnsavedChanges: true,
        });
      },

      resetBlockConfig: (blockId: string) => {
        const state = get();
        const activeTmpl = state.getActiveTemplate();
        const block = findBlockRecursively(activeTmpl.blocks, blockId);
        if (!block) return;
        const fresh = createPdpBlock(block.type, block.name);

        const newBlocks = updateBlockRecursively(activeTmpl.blocks, blockId, b => ({
          ...fresh,
          id: b.id,
          parentId: b.parentId,
          children: b.children,
        }));

        set({
          history: pushSnapshot(state),
          templates: state.templates.map(t => (t.id === activeTmpl.id ? { ...t, blocks: newBlocks, updatedAt: new Date().toISOString() } : t)),
          hasUnsavedChanges: true,
        });
      },

      // ── Modal Actions ──
      openComponentLibrary: (position = 'bottom', targetBlockId, libraryMode = 'all') => {
        set({
          isComponentLibraryOpen: true,
          libraryMode,
          insertPosition: position,
          insertTargetBlockId: targetBlockId || null,
        });
      },

      closeComponentLibrary: () => {
        set({ isComponentLibraryOpen: false });
      },

      setTemplateManagerOpen: (open: boolean) => {
        set({ isTemplateManagerOpen: open });
      },

      // ── History & Persistence ──
      undo: () => {
        const { history, templates } = get();
        if (history.past.length === 0) return;

        const previous = history.past[history.past.length - 1];
        const newPast = history.past.slice(0, -1);

        set({
          templates: previous,
          history: {
            past: newPast,
            future: [templates, ...history.future],
          },
          hasUnsavedChanges: true,
        });
      },

      redo: () => {
        const { history, templates } = get();
        if (history.future.length === 0) return;

        const next = history.future[0];
        const newFuture = history.future.slice(1);

        set({
          templates: next,
          history: {
            past: [...history.past, templates],
            future: newFuture,
          },
          hasUnsavedChanges: true,
        });
      },

      exportTemplateJson: (templateId?: string) => {
        const state = get();
        const tmpl = templateId
          ? state.templates.find(t => t.id === templateId) || state.getActiveTemplate()
          : state.getActiveTemplate();

        const exportPayload = {
          version: '1.0.0',
          exportedAt: new Date().toISOString(),
          template: tmpl,
        };

        return JSON.stringify(exportPayload, null, 2);
      },

      importTemplateJson: (jsonString: string) => {
        try {
          const parsed = JSON.parse(jsonString);
          const tmplData = parsed.template || parsed;
          if (!tmplData.name || !Array.isArray(tmplData.blocks)) {
            return false;
          }

          const state = get();
          const importedId = `template-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
          const importedTemplate: PdpTemplate = {
            ...tmplData,
            id: importedId,
            name: `${tmplData.name} (Imported)`,
            isDefault: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set({
            history: pushSnapshot(state),
            templates: [...state.templates, importedTemplate],
            activeTemplateId: importedId,
            selectedBlockId: importedTemplate.blocks[0]?.id || null,
            hasUnsavedChanges: true,
          });

          return true;
        } catch (e) {
          console.error('Failed to import PDP template JSON:', e);
          return false;
        }
      },

      resetToDefaults: () => {
        set({
          templates: getInitialPdpTemplates(),
          activeTemplateId: 'template-default',
          selectedProductId: 'prod-a',
          selectedBlockId: null,
          products: SAMPLE_PRODUCTS,
          history: { past: [], future: [] },
          hasUnsavedChanges: false,
        });
      },
    }),
    {
      name: 'billionbiz-pdp-builder-v2',
      partialize: state => ({
        templates: state.templates,
        activeTemplateId: state.activeTemplateId,
        selectedProductId: state.selectedProductId,
        products: state.products,
      }),
    }
  )
);
