import { ShipWheel } from "lucide-react";
import DateTime, { TimeFormat } from "./DateTime";
import { Button } from "@/components/ui/button";
import VolumeSlider from "./VolumeSlider";

export const taskbarButtonStyles = "w-7 h-7 hover:bg-gray-400/30 active:bg-black active:text-white";

export default function Taskbar() {
  return (
    <div className="bg-white/90 mt-2 h-10 w-fit flex items-center gap-3 px-2 rounded-sm">
      <Button size="icon" variant="ghost" className={taskbarButtonStyles}>
        <ShipWheel size={16} />
      </Button>
      <DateTime format={TimeFormat.H12} />
      <VolumeSlider />
    </div>
  );
}
