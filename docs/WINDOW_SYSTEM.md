# Window System - Implementation Plan

## 🎯 Project Overview

This document outlines a lean and minimalistic implementation plan for a floating window system in React. The goal is to provide a core windowing library that is unopinionated and easy to integrate. Our motto is to keep it simple and avoid over-engineering.

## ✨ Core Features

- **Singleton Windows**: Each application type (e.g., Terminal, Settings) can only have one window instance open at a time. Calling to open an existing window will focus it instead.
- **Floating Windows**: Windows can be freely moved and resized.
- **Dragging & Resizing**: Smooth window movement and resizing, powered by `react-rnd`.
- **Focus Management**: Automatically handles `z-index` and the active state of windows. Clicking a window brings it to the front.
- **Close Control**: A simple close button on each window.
- **Core Library**: The system is delivered as a `Window` component and a `useWindowManager` hook, allowing developers to build any UI on top of it.

## 🏗️ Architecture

### Technology Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Zustand** - Lightweight state management for windows
- **react-rnd** - Handles dragging and resizing interactions

### Core Components

1.  **Window Manager (`useWindowManager`)**: A Zustand-based hook that acts as the single source of truth for all window states.
2.  **Window Component (`<Window />`)**: A React component that renders an individual window and interacts with the window manager.
3.  **App Configuration (`appConfig.ts`)**: A centralized configuration file that defines the default properties (title, size, etc.) for each `AppType`.

---

## 📋 Implementation Plan

### 1. App Configuration

This file will define the default state for each application window.

**Location**: `src/lib/appConfig.ts`

```typescript
import { AppType } from '@/lib/types';
import type { WindowState } from '@/stores/windowStore';

export const APP_CONFIG: Record<AppType, Omit<WindowState, 'id' | 'appType' | 'zIndex' | 'isActive'>> = {
  [AppType.Terminal]: {
    title: 'Terminal',
    icon: /* Your Terminal Icon Component */,
    x: 100,
    y: 150,
    width: 600,
    height: 400,
  },
  [AppType.TextEditor]: {
    title: 'Text Editor',
    icon: /* Your Text Editor Icon Component */,
    x: 120,
    y: 170,
    width: 800,
    height: 600,
  },
};
```

### 2. Window Manager Store (Zustand)

This store will manage the state of all open windows. The `id` of each window is its `AppType`.

**Location**: `src/stores/windowStore.ts`

```typescript
import type { AppType } from "@/lib/types";

// The state for a single window
interface WindowState {
  id: AppType; // The ID is the AppType itself
  appType: AppType;
  title: string;
  icon?: React.ReactNode;

  // Position and size, managed by react-rnd
  x: number;
  y: number;
  width: number;
  height: number;

  // State
  zIndex: number;
  isActive: boolean;
}

// The Zustand store interface
interface WindowStore {
  windows: Record<AppType, WindowState>;
  activeWindowId: AppType | null;
  topZIndex: number;

  // Actions
  openWindow: (appType: AppType) => void;
  closeWindow: (appType: AppType) => void;
  setActiveWindow: (appType: AppType) => void;
  updateWindow: (
    appType: AppType,
    updates: Partial<Pick<WindowState, "x" | "y" | "width" | "height">>
  ) => void;
}
```

### 3. Window Component

This component will use `react-rnd` for its core drag and resize functionality.

**Location**: `src/components/window/Window.tsx`

**Key Responsibilities**:

- Render the window frame, title bar, and close button based on props read from the store.
- Wrap its content in `react-rnd` to enable user interactions.
- Call the `useWindowManager` hook's actions on user input:
  - `onDragStart`: Calls `setActiveWindow(appType)`.
  - `onDragStop`: Calls `updateWindow(appType, { x, y })`.
  - `onResizeStop`: Calls `updateWindow(appType, { width, height })`.
  - `onClick` on the close button: Calls `closeWindow(appType)`.
- Dynamically set its `z-index` and active visual state based on the store.
- Manage its own hover state locally (e.g., using `useState` with `onMouseEnter`/`onMouseLeave`) for visual feedback without affecting global state.

---

## API Reference

### `Window` Component Props

```tsx
import type { AppType } from "@/lib/types";

interface WindowProps {
  appType: AppType; // The AppType, which is also the unique ID
  children: React.ReactNode;
}
```

_Note: All other properties like `title`, `position`, and `size` will be read directly from the `useWindowManager` store inside the component, referenced by its `appType`._

### `useWindowManager` Hook

This hook is the primary interface for interacting with the window system.

```tsx
const {
  windows, // An object containing all window states, keyed by AppType.
  activeWindowId, // The AppType of the currently active window.
  openWindow, // Function to open a new window or focus an existing one.
  closeWindow, // Function to close a window by its AppType.
  setActiveWindow, // Function to bring a window to the front and set it as active.
  updateWindow, // Function to update a window's properties (like position or size).
} = useWindowManager();
```

## 🚀 Example Usage

This example shows how to build a simple desktop where clicking a button opens the Terminal window. If it's already open, it will be focused instead.

```tsx
import { useWindowManager } from "@/stores/windowStore";
import Window from "@/components/window/Window";
import { AppType } from "@/lib/types";

// A simple component to render inside the window based on appType
const AppContent: React.FC<{ appType: AppType }> = ({ appType }) => {
  switch (appType) {
    case AppType.Terminal:
      return (
        <div className="h-full w-full bg-black p-2 text-white">
          <p>This is the Terminal App</p>
        </div>
      );
    // Add other app types here
    default:
      return <div className="p-2">Unknown App Type</div>;
  }
};

// App.tsx
function Desktop() {
  const { windows, openWindow } = useWindowManager();

  const handleOpenTerminal = () => {
    // Simply call openWindow with the desired AppType
    openWindow(AppType.Terminal);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gray-800">
      {/* Button to open the terminal window */}
      <button
        onClick={handleOpenTerminal}
        className="absolute top-4 left-4 rounded bg-blue-500 p-2 text-white"
      >
        Open Terminal
      </button>

      {/* Render all open windows */}
      {Object.values(windows).map((window) => (
        <Window key={window.id} appType={window.appType}>
          <AppContent appType={window.appType} />
        </Window>
      ))}
    </div>
  );
}
```
