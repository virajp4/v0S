# Window System Documentation

## Overview

A minimalistic floating window system for React built with Zustand and react-rnd. Features singleton windows, focus management, sound effects, and responsive positioning.

**Core Features:**
- Singleton windows per app type (opening existing window focuses it)
- Drag and resize with `react-rnd`
- Automatic z-index and focus management
- Sound feedback for window actions
- Responsive positioning for screen size and taskbars

## Architecture

**Stack:** React + TypeScript + Zustand + react-rnd

**Components:**
1. **Window Manager** (`src/stores/windowStore.ts`) - Zustand store managing all window state
2. **Window Component** (`src/components/window/Window.tsx`) - Individual window with drag/resize
3. **App Config** (`src/lib/appConfig.ts`) - Default properties per app type
4. **Sound Manager** (`src/lib/soundManager.ts`) - Audio feedback system

## API

### Window Manager Hook

```typescript
const { windows, openWindow, closeWindow, setActiveWindow, updateWindow } = useWindowManager();
```

**State:**
- `windows: Record<string, WindowState>` - All open windows
- `activeWindowId: AppType | null` - Currently focused window

**Actions:**
- `openWindow(appType)` - Opens or focuses window, plays sound, handles responsive positioning
- `closeWindow(appType)` - Closes window, plays sound, focuses next window
- `setActiveWindow(appType)` - Brings window to front, updates z-index
- `updateWindow(appType, { x, y, width, height })` - Updates window dimensions

### Window Component

```typescript
<Window appType={AppType.Terminal}>
  <YourAppContent />
</Window>
```

**Props:**
- `appType: AppType` - Window identifier
- `children: React.ReactNode` - App content

**Features:** Glass-morphism styling, bounded viewport, drag handle on title bar, auto-focuses on interaction

### Sound Manager

```typescript
import { soundManager, SoundType } from '@/lib/soundManager';

soundManager.play(SoundType.WindowOpen);
soundManager.setVolume(0.5); // 0-1 range
```

**Sounds:** `WindowOpen`, `WindowClose`, `MenuOpen`, `Volume`

## Adding New Apps

**1. Define AppType** (`src/lib/types.ts`)
```typescript
export enum AppType {
  Terminal = "TERMINAL",
  TextEditor = "TEXTEDITOR",
  NewApp = "NEWAPP",
}
```

**2. Configure App** (`src/lib/appConfig.ts`)
```typescript
[AppType.NewApp]: {
  title: "New App",
  icon: NewAppIcon,
  x: 25, y: 25,
  width: 500, height: 400,
}
```

**3. Add Route** (`src/components/apps/AppRouter.tsx`)
```typescript
case AppType.NewApp:
  return <NewApp />;
```
