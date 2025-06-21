import { ShipWheel } from "lucide-react";
import DateTime, { TimeFormat } from "./DateTime";
import { Button } from "@/components/ui/button";
import VolumeSlider from "./VolumeSlider";

export const taskbarButtonStyles = "w-7 h-7 hover:bg-gray-400/60";

export default function Taskbar() {
  return (
    <div className="bg-white h-8 w-full flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <Button size="icon" className="bg-transparent hover:bg-transparent border-none">
          <ShipWheel color="black" />
        </Button>
      </div>
      <div className="flex items-center gap-5">
        <VolumeSlider />
        <DateTime format={TimeFormat.H12} />
      </div>
    </div>
  );
}
