# Project Basics & Development Guidelines

## ✨ The Vibe

This project is built by thoughtful, senior-level developers who are experts in their craft. We value clear reasoning, careful implementation, and a collaborative spirit. Above all, we keep it chill.

- **Embrace the Vibe**: Be cool, lean, and avoid being overly formal or robotic. We're building something awesome, so let's have a good time doing it.
- **Follow requirements carefully & to the letter.**
- **Think step-by-step**: First, describe your plan for what to build in great detail.
- **Confirm, then write code**: Ensure the plan is approved before implementation.
- **Be concise**: Minimize prose and focus on clear, impactful communication.
- **Act like an expert**: Be confident in your skills, but don't guess. If you don't know the answer, say so.

## 🎯 Overview

This document outlines the fundamental conventions, coding styles, and architectural patterns for this project. Its purpose is to ensure that all contributors (including AI assistants) build in a consistent, readable, and maintainable way. Adhering to these guidelines is essential for a smooth development workflow.

## 💻 Coding Environment

Our development environment is focused on the following technologies:

- **ReactJS**
- **TypeScript**
- **TailwindCSS**
- **JavaScript**
- **HTML/CSS**

## ✍️ Coding Style & Conventions

- **Completeness**: Ensure code is complete and fully functional. Leave NO `TODOs`, placeholders, or missing pieces.
- **Correctness**: Always write correct, best-practice, and bug-free code that adheres to the DRY (Don't Repeat Yourself) principle.
- **Styling**: Always use TailwindCSS classes for styling. Avoid inline styles (`style={{...}}`) or external CSS files. Use "class:" directives instead of the ternary operator in class tags where possible.
- **Component Naming**: Use PascalCase for component file and function names (e.g., `MyComponent.tsx`).
- **Variable & Function Naming**: Use camelCase for variables and functions. Event handlers should be prefixed with `handle` (e.g., `handleClick`).
- **Component Definition**: Define React components as `const` arrow functions (e.g., `const MyComponent: React.FC<Props> = () => { ... }`).
- **Imports**: Organize imports with React imports first, followed by library imports, and finally local/absolute imports from the project (`@/`). Prefer absolute imports (`@/components/ui/button`) over relative imports (`../components/ui/button`).
- **Readability**: Prioritize clear, readable code over overly clever or condensed solutions. Use early returns to reduce nesting.
- **Accessibility**: Implement accessibility features where appropriate (e.g., `aria-label`, `tabIndex`, keyboard event handlers on interactive non-button elements).

---

## 🏗️ Typing Strategy

To ensure type safety and code clarity, we will follow a centralized typing strategy.

### Central Types File

All shared, project-wide types, interfaces, and enums should be located in:

`src/lib/types.ts`

This provides a single source of truth for our data models.

---

## 📚 Project Documentation Index

This section serves as an index for detailed design and implementation documents within the project. Refer to these documents for specific architectural patterns and decisions.

- **`docs/WINDOW_SYSTEM.md`**

  - **Purpose**: Outlines the complete architecture for our singleton-based floating window system.
  - **When to Refer**: Before making any changes to the windowing components (`Window.tsx`), the window manager store (`windowStore.ts`), or related configurations (`appConfig.ts`). This is the source of truth for all windowing logic.
