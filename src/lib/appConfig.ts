import { AppType } from "@/lib/types";
import type { WindowState } from "@/stores/windowStore";
import { SquareTerminal, FilePenLine } from "lucide-react";

export const APP_CONFIG: Record<AppType, Omit<WindowState, "id" | "zIndex" | "isActive">> = {
  [AppType.Terminal]: {
    title: "Terminal",
    icon: SquareTerminal,
    x: 25,
    y: 25,
    width: 600,
    height: 400,
  },
  [AppType.TextEditor]: {
    title: "Text Editor",
    icon: FilePenLine,
    x: 25,
    y: 25,
    width: 400,
    height: 500,
  },
};
