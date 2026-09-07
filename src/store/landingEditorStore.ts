import { create } from 'zustand';

export type DeviceType = 'desktop' | 'tablet' | 'mobile' | 'all';
export type ThemeCategoryType = 'themes' | 'colors' | 'typography' | 'buttons' | 'effects';

interface LandingEditorState {
  // Section selection
  selectedSectionId: string | null;
  activeSectionTab: string | null;

  // Device
  device: DeviceType;

  // Sidebar
  isRightSidebarOpen: boolean;
  isLeftSidebarCollapsed: boolean;

  // Widgets
  isColorWidgetOpen: boolean;
  isTypographyWidgetOpen: boolean;
  isAddSectionWidgetOpen: boolean;
  insertIndex: number | null;
  sectionToDelete: string | null;

  // Settings
  activeSettingItem: string | null;

  // Left sidebar active panel
  activePanel: 'editor' | 'pages' | 'theme' | 'settings';

  // Selected page
  selectedPageId: string;

  // Selected theme category
  selectedThemeCategory: ThemeCategoryType | null;

  // Tab Memory
  lastEditorMemory: {
    selectedSectionId: string | null;
    isRightSidebarOpen: boolean;
  };
  lastPagesMemory: {
    selectedPageId: string;
    isRightSidebarOpen: boolean;
  };
  lastThemeMemory: {
    selectedThemeCategory: ThemeCategoryType | null;
    isRightSidebarOpen: boolean;
  };

  // Actions
  setSelectedSectionId: (id: string | null) => void;
  setActiveSectionTab: (tab: string | null) => void;
  setDevice: (device: DeviceType) => void;
  setRightSidebarOpen: (open: boolean) => void;
  setLeftSidebarCollapsed: (collapsed: boolean) => void;
  closeRightSidebar: () => void;
  setColorWidgetOpen: (isOpen: boolean) => void;
  setTypographyWidgetOpen: (isOpen: boolean) => void;
  setAddSectionWidgetOpen: (isOpen: boolean) => void;
  setInsertIndex: (index: number | null) => void;
  setSectionToDelete: (id: string | null) => void;
  setActiveSettingItem: (item: string | null) => void;
  setActivePanel: (panel: 'editor' | 'pages' | 'theme' | 'settings') => void;
  setSelectedPageId: (id: string) => void;
  setSelectedThemeCategory: (category: ThemeCategoryType | null) => void;
}

export const useLandingEditorStore = create<LandingEditorState>((set) => ({
  selectedSectionId: null,
  activeSectionTab: null,
  device: 'desktop',
  isRightSidebarOpen: false,
  isLeftSidebarCollapsed: false,
  isColorWidgetOpen: false,
  isTypographyWidgetOpen: false,
  isAddSectionWidgetOpen: false,
  insertIndex: null,
  sectionToDelete: null,
  activeSettingItem: 'General',
  activePanel: 'editor',
  selectedPageId: 'landing-page',
  selectedThemeCategory: 'themes',
  lastEditorMemory: { selectedSectionId: null, isRightSidebarOpen: false },
  lastPagesMemory: { selectedPageId: '', isRightSidebarOpen: false },
  lastThemeMemory: { selectedThemeCategory: 'themes', isRightSidebarOpen: true },

  setSelectedSectionId: (id) => set({
    selectedSectionId: id,
    isRightSidebarOpen: id !== null,
  }),
  setActiveSectionTab: (tab) => set({ activeSectionTab: tab }),
  setDevice: (device) => set({ device }),
  setRightSidebarOpen: (open) => set({ isRightSidebarOpen: open }),
  setLeftSidebarCollapsed: (collapsed) => set({ isLeftSidebarCollapsed: collapsed }),
  closeRightSidebar: () => set({
    isRightSidebarOpen: false,
    selectedSectionId: null,
  }),
  setColorWidgetOpen: (isOpen) => set({
    isColorWidgetOpen: isOpen,
    isTypographyWidgetOpen: false,
    isAddSectionWidgetOpen: false,
  }),
  setTypographyWidgetOpen: (isOpen) => set({
    isTypographyWidgetOpen: isOpen,
    isColorWidgetOpen: false,
    isAddSectionWidgetOpen: false,
  }),
  setAddSectionWidgetOpen: (isOpen) => set({
    isAddSectionWidgetOpen: isOpen,
    isColorWidgetOpen: false,
    isTypographyWidgetOpen: false,
  }),
  setInsertIndex: (index) => set({ insertIndex: index }),
  setSectionToDelete: (id) => set({ sectionToDelete: id }),
  setActiveSettingItem: (item) => set({ activeSettingItem: item }),
  setSelectedThemeCategory: (category) => set({
    selectedThemeCategory: category,
    isRightSidebarOpen: category !== null,
    lastThemeMemory: {
      selectedThemeCategory: category,
      isRightSidebarOpen: category !== null,
    },
  }),
  setActivePanel: (panel) => set((state) => {
    const lastEditorMemory = state.activePanel === 'editor' ? {
      selectedSectionId: state.selectedSectionId,
      isRightSidebarOpen: state.isRightSidebarOpen,
    } : state.lastEditorMemory;

    const lastPagesMemory = state.activePanel === 'pages' ? {
      selectedPageId: state.selectedPageId,
      isRightSidebarOpen: state.isRightSidebarOpen,
    } : state.lastPagesMemory;

    const lastThemeMemory = state.activePanel === 'theme' ? {
      selectedThemeCategory: state.selectedThemeCategory,
      isRightSidebarOpen: state.isRightSidebarOpen,
    } : state.lastThemeMemory;

    if (panel === 'editor') {
      return {
        activePanel: panel,
        selectedPageId: state.selectedPageId || 'landing-page',
        selectedSectionId: lastEditorMemory.selectedSectionId,
        isRightSidebarOpen: lastEditorMemory.isRightSidebarOpen,
        lastEditorMemory,
        lastPagesMemory,
        lastThemeMemory,
        isColorWidgetOpen: false,
        isTypographyWidgetOpen: false,
      };
    } else if (panel === 'pages') {
      const pageToSelect = state.selectedPageId || lastPagesMemory.selectedPageId || 'shop-page';
      return {
        activePanel: panel,
        selectedPageId: pageToSelect,
        selectedSectionId: null,
        isRightSidebarOpen: true,
        lastEditorMemory,
        lastPagesMemory: {
          selectedPageId: pageToSelect,
          isRightSidebarOpen: true,
        },
        lastThemeMemory,
        isColorWidgetOpen: false,
        isTypographyWidgetOpen: false,
      };
    } else if (panel === 'theme') {
      const categoryToSelect = lastThemeMemory.selectedThemeCategory || 'themes';
      return {
        activePanel: panel,
        selectedPageId: state.selectedPageId || 'landing-page',
        selectedThemeCategory: categoryToSelect,
        isRightSidebarOpen: true,
        lastEditorMemory,
        lastPagesMemory,
        lastThemeMemory: {
          selectedThemeCategory: categoryToSelect,
          isRightSidebarOpen: true,
        },
        isColorWidgetOpen: false,
        isTypographyWidgetOpen: false,
      };
    } else if (panel === 'settings') {
      return {
        activePanel: panel,
        selectedPageId: state.selectedPageId || 'landing-page',
        selectedSectionId: null,
        isRightSidebarOpen: false,
        lastEditorMemory,
        lastPagesMemory,
        lastThemeMemory,
        isColorWidgetOpen: false,
        isTypographyWidgetOpen: false,
      };
    }
    return {};
  }),
  setSelectedPageId: (id) => set((state) => ({
    selectedPageId: id,
    selectedSectionId: null,
    lastPagesMemory: {
      selectedPageId: id,
      isRightSidebarOpen: state.isRightSidebarOpen,
    }
  })),
}));
