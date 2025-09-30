# v0S - Desktop Environment

A minimalistic desktop environment built with React, TypeScript, and Vite featuring a floating window system with sound effects and a sleek UI.

## Features

- **Floating Window System**: Draggable and resizable windows with focus management
- **Singleton Windows**: Each app type can only have one instance open
- **Sound Effects**: Custom sound feedback for window interactions
- **Responsive Design**: Auto-adjusts window size and position based on screen dimensions
- **Custom Taskbars**: Top taskbar with system controls and bottom app launcher

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Zustand** - State management
- **react-rnd** - Drag and resize functionality
- **TailwindCSS 4** - Styling
- **Framer Motion** - Animations
- **Radix UI** - UI components

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── apps/          # Application components
│   ├── taskbar/       # Taskbar components
│   ├── ui/            # Reusable UI components
│   └── window/        # Window system components
├── lib/
│   ├── appConfig.ts   # App configurations
│   ├── types.ts       # TypeScript types
│   ├── soundManager.ts # Sound system
│   └── utils.ts       # Utility functions
└── stores/
    └── windowStore.ts # Window state management
```

## Documentation

- [**BASICS.md**](docs/BASICS.md) - Development guidelines and coding conventions
- [**WINDOW_SYSTEM.md**](docs/WINDOW_SYSTEM.md) - Window system architecture and API

## Current Apps

- **Terminal** - Terminal emulator interface
- **Text Editor** - Basic text editing application
