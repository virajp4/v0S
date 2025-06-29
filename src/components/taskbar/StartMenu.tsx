import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ShipWheel, Info, Settings } from "lucide-react";
import { TaskbarButton } from "./TaskbarButton";

export default function StartMenu() {
  return (
    <Popover>
      <PopoverTrigger>
        <TaskbarButton>
          <ShipWheel size={16} />
        </TaskbarButton>
      </PopoverTrigger>
      <PopoverContent
        sideOffset={8}
        className="w-fit bg-white/85 p-1 z-[1001] flex flex-col rounded-sm"
        align="start"
      >
        <TaskbarButton>
          <Info size={16} />
        </TaskbarButton>
        <TaskbarButton>
          <Settings size={16} />
        </TaskbarButton>
      </PopoverContent>
    </Popover>
  );
}
