import { AppType } from "@/lib/types";
import type { WindowState } from "@/stores/windowStore";
import TerminalApp from "./TerminalApp";
import TextEditorApp from "./TextEditorApp";

interface AppRouterProps {
  window: WindowState;
}

export default function AppRouter({ window }: AppRouterProps) {
  switch (window.id) {
    case AppType.Terminal:
      return <TerminalApp />;
    case AppType.TextEditor:
      return <TextEditorApp />;
    default:
      throw new Error(`Unknown app type: ${window.id}`);
  }
}
