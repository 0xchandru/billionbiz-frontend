import { create } from 'zustand';

export type DeviceType = 'desktop' | 'tablet' | 'mobile' | 'all';

interface LandingEditorState {
  // Section selection
  selectedSectionId: string | null;
  activeSectionTab: string | null;

  // Device
  device: DeviceType;

  // Sidebar
  isRightSidebarOpen: boolean;

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

  // Tab Memory
  lastEditorMemory: {
    selectedSectionId: string | null;
    isRightSidebarOpen: boolean;
  };
  lastPagesMemory: {
    selectedPageId: string;
    isRightSidebarOpen: boolean;
  };

  // Actions
  setSelectedSectionId: (id: string | null) => void;
  setActiveSectionTab: (tab: string | null) => void;
  setDevice: (device: DeviceType) => void;
  setRightSidebarOpen: (open: boolean) => void;
  closeRightSidebar: () => void;
  setColorWidgetOpen: (isOpen: boolean) => void;
  setTypographyWidgetOpen: (isOpen: boolean) => void;
  setAddSectionWidgetOpen: (isOpen: boolean) => void;
  setInsertIndex: (index: number | null) => void;
  setSectionToDelete: (id: string | null) => void;
  setActiveSettingItem: (item: string | null) => void;
  setActivePanel: (panel: 'editor' | 'pages' | 'theme' | 'settings') => void;
  setSelectedPageId: (id: string) => void;
}

export const useLandingEditorStore = create<LandingEditorState>((set) => ({
  selectedSectionId: null,
  activeSectionTab: null,
  device: 'desktop',
  isRightSidebarOpen: false,
  isColorWidgetOpen: false,
  isTypographyWidgetOpen: false,
  isAddSectionWidgetOpen: false,
  insertIndex: null,
  sectionToDelete: null,
  activeSettingItem: 'General',
  activePanel: 'editor',
  selectedPageId: 'landing-page',
  lastEditorMemory: { selectedSectionId: null, isRightSidebarOpen: false },
  lastPagesMemory: { selectedPageId: 'storefront-page', isRightSidebarOpen: true },

  setSelectedSectionId: (id) => set({
    selectedSectionId: id,
    isRightSidebarOpen: id !== null,
  }),
  setActiveSectionTab: (tab) => set({ activeSectionTab: tab }),
  setDevice: (device) => set({ device }),
  setRightSidebarOpen: (open) => set({ isRightSidebarOpen: open }),
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
  setActivePanel: (panel) => set((state) => {
    const lastEditorMemory = state.activePanel === 'editor' ? {
      selectedSectionId: state.selectedSectionId,
      isRightSidebarOpen: state.isRightSidebarOpen,
    } : state.lastEditorMemory;
  
    const lastPagesMemory = state.activePanel === 'pages' ? {
      selectedPageId: state.selectedPageId,
      isRightSidebarOpen: state.isRightSidebarOpen,
    } : state.lastPagesMemory;
  
    if (panel === 'editor') {
      return {
        activePanel: panel,
        selectedPageId: 'landing-page',
        selectedSectionId: lastEditorMemory.selectedSectionId,
        isRightSidebarOpen: lastEditorMemory.isRightSidebarOpen,
        lastEditorMemory,
        lastPagesMemory,
        isColorWidgetOpen: false,
        isTypographyWidgetOpen: false,
      };
    } else if (panel === 'pages') {
      return {
        activePanel: panel,
        selectedPageId: lastPagesMemory.selectedPageId,
        selectedSectionId: null,
        isRightSidebarOpen: lastPagesMemory.isRightSidebarOpen,
        lastEditorMemory,
        lastPagesMemory,
        isColorWidgetOpen: false,
        isTypographyWidgetOpen: false,
      };
    } else {
      return {
        activePanel: panel,
        isRightSidebarOpen: false,
        lastEditorMemory,
        lastPagesMemory,
        isColorWidgetOpen: false,
        isTypographyWidgetOpen: false,
      };
    }
  }),
  setSelectedPageId: (id) => set((state) => {
    if (id === 'landing-page') {
      return {
        selectedPageId: id,
        activePanel: 'editor',
        selectedSectionId: state.lastEditorMemory.selectedSectionId,
        isRightSidebarOpen: state.lastEditorMemory.isRightSidebarOpen,
      };
    } else {
      return {
        selectedPageId: id,
        activePanel: state.activePanel === 'editor' ? 'pages' : state.activePanel,
        selectedSectionId: null,
        isRightSidebarOpen: true,
        lastPagesMemory: {
          selectedPageId: id,
          isRightSidebarOpen: true,
        }
      };
    }
  }),
}));
