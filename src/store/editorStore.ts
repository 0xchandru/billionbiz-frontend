import { create } from 'zustand';

export type EditorTab = 'landing' | 'pages' | 'theme' | 'settings';
export type DeviceType = 'desktop' | 'tablet' | 'mobile' | 'all';

interface EditorState {
  activeTab: EditorTab;
  device: DeviceType;
  selectedSectionId: string | null;
  selectedPageId: string;
  isRightSidebarOpen: boolean;
  isColorWidgetOpen: boolean;
  isTypographyWidgetOpen: boolean;
  isAddSectionWidgetOpen: boolean;
  insertIndex: number | null;
  activeSettingItem: string | null;
  
  setActiveTab: (tab: EditorTab) => void;
  setDevice: (device: DeviceType) => void;
  setSelectedSectionId: (id: string | null) => void;
  setSelectedPageId: (id: string) => void;
  closeRightSidebar: () => void;
  setColorWidgetOpen: (isOpen: boolean) => void;
  setTypographyWidgetOpen: (isOpen: boolean) => void;
  setAddSectionWidgetOpen: (isOpen: boolean) => void;
  setInsertIndex: (index: number | null) => void;
  setActiveSettingItem: (item: string | null) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  activeTab: 'landing',
  device: 'desktop',
  selectedSectionId: null,
  selectedPageId: 'landing-page',
  isRightSidebarOpen: false,
  isColorWidgetOpen: false,
  isTypographyWidgetOpen: false,
  isAddSectionWidgetOpen: false,
  insertIndex: null,
  activeSettingItem: 'SEO basic',

  setActiveTab: (tab) => set((state) => ({ 
    activeTab: tab,
    isRightSidebarOpen: tab === 'pages' ? true : (state.selectedSectionId !== null)
  })),
  setDevice: (device) => set({ device }),
  setSelectedSectionId: (id) => set({ 
    selectedSectionId: id,
    isRightSidebarOpen: id !== null
  }),
  setSelectedPageId: (id) => set({ 
    selectedPageId: id, 
    isRightSidebarOpen: true,
    selectedSectionId: null
  }),
  closeRightSidebar: () => set({ 
    isRightSidebarOpen: false,
    selectedSectionId: null
  }),
  setColorWidgetOpen: (isOpen) => set({ isColorWidgetOpen: isOpen, isTypographyWidgetOpen: false, isAddSectionWidgetOpen: false }),
  setTypographyWidgetOpen: (isOpen) => set({ isTypographyWidgetOpen: isOpen, isColorWidgetOpen: false, isAddSectionWidgetOpen: false }),
  setAddSectionWidgetOpen: (isOpen) => set({ isAddSectionWidgetOpen: isOpen, isColorWidgetOpen: false, isTypographyWidgetOpen: false }),
  setInsertIndex: (index) => set({ insertIndex: index }),
  setActiveSettingItem: (item) => set({ activeSettingItem: item }),
}));
