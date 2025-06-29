import { create } from "zustand";
import { AppType, SoundType } from "@/lib/types";
import { APP_CONFIG } from "@/lib/appConfig";
import { soundManager } from "@/lib/soundManager";
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

export const useWindowManager = create<WindowStore>((set, get) => ({
  windows: {},
  activeWindowId: null,
  topZIndex: 100,

  openWindow: (appType) => {
    const { windows, activeWindowId, setActiveWindow } = get();
    if (windows[appType]) {
      setActiveWindow(appType);
      return;
    }

    soundManager.play(SoundType.WindowOpen);

    set((state) => {
      const newTopZIndex = state.topZIndex + 1;
      const newWindows = { ...state.windows };

      if (activeWindowId && newWindows[activeWindowId]) {
        newWindows[activeWindowId].isActive = false;
      }

      newWindows[appType] = {
        id: appType,
        title: APP_CONFIG[appType].title,
        icon: APP_CONFIG[appType].icon,
        x: APP_CONFIG[appType].x ?? 25,
        y: APP_CONFIG[appType].y ?? 25,
        width: APP_CONFIG[appType].width,
        height: APP_CONFIG[appType].height,
        zIndex: newTopZIndex,
        isActive: true,
      };

      return {
        windows: newWindows,
        activeWindowId: appType,
        topZIndex: newTopZIndex,
      };
    });
  },

  closeWindow: (appType) => {
    soundManager.play(SoundType.WindowClose);
    set((state) => {
      const newWindows = { ...state.windows };
      delete newWindows[appType];
      let newActiveId = state.activeWindowId;
      if (state.activeWindowId === appType) {
        newActiveId = Object.keys(newWindows).sort(
          (a, b) => newWindows[b].zIndex - newWindows[a].zIndex
        )[0] as AppType | null;

        if (newActiveId && newWindows[newActiveId]) {
          newWindows[newActiveId].isActive = true;
        }
      }
      return {
        windows: newWindows,
        activeWindowId: newActiveId,
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
        newWindows[state.activeWindowId].isActive = false;
      }

      if (newWindows[appType]) {
        newWindows[appType].isActive = true;
        newWindows[appType].zIndex = newTopZIndex;
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
