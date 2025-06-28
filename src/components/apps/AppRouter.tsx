import { AppType } from "@/lib/types";
import TerminalApp from "./TerminalApp";
import TextEditorApp from "./TextEditorApp";

interface AppRouterProps {
  appType: AppType;
}

export default function AppRouter({ appType }: AppRouterProps) {
  switch (appType) {
    case AppType.Terminal:
      return <TerminalApp />;
    case AppType.TextEditor:
      return <TextEditorApp />;
    default:
      throw new Error(`Unknown app type: ${appType}`);
  }
}
