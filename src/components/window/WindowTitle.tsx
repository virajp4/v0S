import { useWindowManager } from "@/stores/windowStore";
import { AppType } from "@/lib/types";

interface WindowTitleProps {
  appType: AppType;
  title: string;
}

export default function WindowTitle({ appType, title }: WindowTitleProps) {
  const { closeWindow } = useWindowManager();
  return (
    <div className="window-handle h-8 flex items-center justify-between px-2 cursor-move select-none">
      <span className="text-white text-xs font-medium">{title}</span>
      <button
        onClick={() => {
          closeWindow(appType);
        }}
        className="w-3 h-3 rounded-full bg-red-500 cursor-pointer"
      ></button>
    </div>
  );
}
