import { AppType } from "@/lib/types";
import type { WindowState } from "@/stores/windowStore";
import { SquareTerminal, FilePenLine } from "lucide-react";

export const APP_CONFIG: Record<AppType, Omit<WindowState, "id" | "zIndex" | "isActive">> = {
  [AppType.Terminal]: {
    title: "Terminal",
    icon: SquareTerminal,
    width: 600,
    height: 400,
  },
  [AppType.TextEditor]: {
    title: "Text Editor",
    icon: FilePenLine,
    width: 800,
    height: 600,
  },
};
