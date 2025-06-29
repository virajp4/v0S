import { useWindowManager } from "@/stores/windowStore";
import { AppType } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface WindowTitleProps {
  appType: AppType;
  title: string;
}

export default function WindowTitle({ appType, title }: WindowTitleProps) {
  const { closeWindow } = useWindowManager();
  return (
    <div className="h-8 flex items-center justify-between gap-2 px-2 select-none">
      <span className="text-white text-xs font-medium window-handle cursor-move w-full">
        {title}
      </span>
      <Button
        onClick={() => {
          closeWindow(appType);
        }}
        size="icon"
        className="size-3 px-2.5 bg-red-400 hover:bg-red-500 cursor-pointer transition-colors duration-200"
      ></Button>
    </div>
  );
}
