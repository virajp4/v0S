import { APP_CONFIG } from "@/lib/appConfig";
import { AppType } from "@/lib/types";
import { useWindowManager } from "@/stores/windowStore";
import { taskbarStyles } from "./Taskbar";
import { cn } from "@/lib/utils";
import { TaskbarButton } from "./TaskbarButton";

export default function AppBar() {
  const { openWindow } = useWindowManager();

  return (
    <div className={cn(taskbarStyles, "gap-1")}>
      {Object.entries(APP_CONFIG).map(([appId, appConfig]) => {
        const AppIcon = appConfig.icon;
        return (
          <TaskbarButton key={appId} onClick={() => openWindow(appId as AppType)}>
            <AppIcon />
          </TaskbarButton>
        );
      })}
    </div>
  );
}
