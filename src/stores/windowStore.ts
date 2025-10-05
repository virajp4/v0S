import { create } from "zustand";
import { AppType, SoundType } from "@/lib/types";
import { APP_CONFIG } from "@/lib/appConfig";
import { soundManager } from "@/lib/soundManager";
import type { ElementType } from "react";

export interface WindowState {
  id: AppType;
  title: string;
  icon: ElementType;
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
  positionOffset: number;
  openWindow: (appType: AppType) => void;
  closeWindow: (appType: AppType) => void;
  setActiveWindow: (appType: AppType) => void;
  updateWindow: (
    appType: AppType,
    updates: Partial<Pick<WindowState, "x" | "y" | "width" | "height">>
  ) => void;
}

const POSITION_OFFSET_INCREMENT = 30;

export const useWindowManager = create<WindowStore>((set, get) => ({
  windows: {},
  activeWindowId: null,
  topZIndex: 100,
  positionOffset: 0,

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
      const appConfig = APP_CONFIG[appType];
      let { x, y, width, height } = appConfig;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      const PADDING = 25;
      const TASKBAR_WIDTH = 220;
      const TASKBAR_HEIGHT = 50;

      // Apply cascading offset
      x += state.positionOffset;
      y += state.positionOffset;

      if (width > screenWidth) {
        width = screenWidth - PADDING * 2;
        x = PADDING + state.positionOffset;
      }
      const totalWidthAfterPadding = width + PADDING * 2;
      const distanceBetweenEdgeAndTaskbar = (screenWidth - TASKBAR_WIDTH) / 2;
      const canWindowFitInEmptySpace = totalWidthAfterPadding < distanceBetweenEdgeAndTaskbar;
      if (!canWindowFitInEmptySpace) {
        const heightWithTaskbarAndPadding = TASKBAR_HEIGHT + PADDING;
        y = heightWithTaskbarAndPadding + state.positionOffset;
        // Since there is a taskbar at the bottom as well (AppBar),
        // we need to subtract twice the heightWithTaskbarAndPadding.
        if (height > screenHeight - heightWithTaskbarAndPadding * 2) {
          height = screenHeight - heightWithTaskbarAndPadding * 2;
        }
      }

      newWindows[appType] = {
        id: appType,
        title: appConfig.title,
        icon: appConfig.icon,
        x,
        y,
        width,
        height,
        zIndex: newTopZIndex,
        isActive: true,
      };

      return {
        windows: newWindows,
        activeWindowId: appType,
        topZIndex: newTopZIndex,
        positionOffset: state.positionOffset + POSITION_OFFSET_INCREMENT,
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
        positionOffset: Math.max(0, state.positionOffset - POSITION_OFFSET_INCREMENT),
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
