import { create } from "zustand";
import { AppType } from "@/lib/types";
import { APP_CONFIG } from "@/lib/appConfig";
import type { ComponentType } from "react";

export interface WindowState {
  id: AppType;
  title: string;
  icon?: ComponentType<{ size: number }>;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isActive: boolean;
}

interface WindowStore {
  windows: Record<string, WindowState>;
  activeWindowId: AppType | null;
  topZIndex: number;
  openWindow: (appType: AppType) => void;
  closeWindow: (appType: AppType) => void;
  setActiveWindow: (appType: AppType) => void;
  updateWindow: (
    appType: AppType,
    updates: Partial<Pick<WindowState, "x" | "y" | "width" | "height">>
  ) => void;
}

const initialWindows: Record<string, WindowState> = {
  [AppType.Terminal]: {
    id: AppType.Terminal,
    title: APP_CONFIG[AppType.Terminal].title,
    icon: APP_CONFIG[AppType.Terminal].icon,
    x: APP_CONFIG[AppType.Terminal].x,
    y: APP_CONFIG[AppType.Terminal].y,
    width: APP_CONFIG[AppType.Terminal].width,
    height: APP_CONFIG[AppType.Terminal].height,
    zIndex: 101,
    isActive: true,
  },
  [AppType.TextEditor]: {
    id: AppType.TextEditor,
    title: APP_CONFIG[AppType.TextEditor].title,
    icon: APP_CONFIG[AppType.TextEditor].icon,
    x: APP_CONFIG[AppType.TextEditor].x,
    y: APP_CONFIG[AppType.TextEditor].y,
    width: APP_CONFIG[AppType.TextEditor].width,
    height: APP_CONFIG[AppType.TextEditor].height,
    zIndex: 100,
    isActive: false,
  },
};

export const useWindowManager = create<WindowStore>((set, get) => ({
  windows: initialWindows,
  activeWindowId: AppType.Terminal,
  topZIndex: 101,
  openWindow: (appType) => {
    const { windows, setActiveWindow } = get();
    if (windows[appType]) {
      setActiveWindow(appType);
      return;
    }
    const newWindow: WindowState = {
      id: appType,
      title: APP_CONFIG[appType].title,
      icon: APP_CONFIG[appType].icon,
      x: APP_CONFIG[appType].x,
      y: APP_CONFIG[appType].y,
      width: APP_CONFIG[appType].width,
      height: APP_CONFIG[appType].height,
      zIndex: get().topZIndex + 1,
      isActive: true,
    };
    set((state) => ({
      windows: { ...state.windows, [appType]: newWindow },
      activeWindowId: appType,
      topZIndex: newWindow.zIndex,
    }));
    setActiveWindow(appType);
  },
  closeWindow: (appType) => {
    set((state) => {
      const newWindows = { ...state.windows };
      delete newWindows[appType];
      return {
        windows: newWindows,
        activeWindowId: state.activeWindowId === appType ? null : state.activeWindowId,
      };
    });
  },
  setActiveWindow: (appType) => {
    set((state) => {
      if (state.activeWindowId === appType) {
        return {};
      }
      const newTopZIndex = state.topZIndex + 1;
      const newWindows = { ...state.windows };
      if (state.activeWindowId && newWindows[state.activeWindowId]) {
        newWindows[state.activeWindowId] = {
          ...newWindows[state.activeWindowId],
          isActive: false,
        };
      }
      if (newWindows[appType]) {
        newWindows[appType] = {
          ...newWindows[appType],
          isActive: true,
          zIndex: newTopZIndex,
        };
      }
      return {
        windows: newWindows,
        activeWindowId: appType,
        topZIndex: newTopZIndex,
      };
    });
  },
  updateWindow: (appType, updates) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [appType]: { ...state.windows[appType], ...updates },
      },
    }));
  },
}));
