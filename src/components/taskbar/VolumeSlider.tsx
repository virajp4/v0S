import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Settings, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { taskbarButtonStyles } from "./Taskbar";

export default function VolumeSlider() {
  return (
    <Popover>
      <PopoverTrigger>
        <Button size="icon" variant="ghost" className={taskbarButtonStyles}>
          <Volume2 size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        sideOffset={8}
        className="w-10 bg-white/90 flex flex-col items-center gap-1 pb-1"
      >
        <Slider
          defaultValue={[50]}
          max={100}
          min={0}
          step={5}
          orientation="vertical"
          inverted={false}
        />
        <Button size="icon" variant="ghost" className={taskbarButtonStyles}>
          <Settings size={16} />
        </Button>
      </PopoverContent>
    </Popover>
  );
}
