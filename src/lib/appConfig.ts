import { AppType } from "@/lib/types";
import type { WindowState } from "@/stores/windowStore";
import { Terminal, FileText } from "lucide-react";

export const APP_CONFIG: Record<AppType, Omit<WindowState, "id" | "zIndex" | "isActive">> = {
  [AppType.Terminal]: {
    title: "Terminal",
    icon: Terminal,
    x: 100,
    y: 150,
    width: 600,
    height: 400,
  },
  [AppType.TextEditor]: {
    title: "Text Editor",
    icon: FileText,
    x: 120,
    y: 170,
    width: 800,
    height: 600,
  },
};
