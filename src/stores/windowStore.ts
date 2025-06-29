import { create } from "zustand";
import { AppType } from "@/lib/types";
import { APP_CONFIG } from "@/lib/appConfig";
import type { ElementType } from "react";

export interface WindowState {
  id: AppType;
  title: string;
  icon: ElementType;
  x?: number;
  y?: number;
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

const initialWindows: Record<string, WindowState> = {};

export const useWindowManager = create<WindowStore>((set, get) => ({
  windows: initialWindows,
  activeWindowId: null,
  topZIndex: 100,
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
      x: APP_CONFIG[appType].x ?? 25,
      y: APP_CONFIG[appType].y ?? 25,
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
