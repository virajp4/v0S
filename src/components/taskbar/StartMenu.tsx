import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Info, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { TaskbarButton } from "./TaskbarButton";
import { soundManager } from "@/lib/soundManager";
import { SoundType } from "@/lib/types";
import { getAllIcons } from "@/lib/icons";
import { motion, AnimatePresence } from "framer-motion";

const getRandomIcon = () => {
  const icons = getAllIcons();
  return icons[Math.floor(Math.random() * icons.length)];
};

export default function StartMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [Icon, setIcon] = useState(() => getRandomIcon());

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      soundManager.play(SoundType.MenuOpen);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger>
        <TaskbarButton onClick={() => setIcon(getRandomIcon)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={(Icon as LucideIcon).displayName}
              initial={{ scale: 0, opacity: 0, rotate: -90 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0, rotate: 90 }}
              transition={{ duration: 0.1 }}
            >
              <Icon size={16} />
            </motion.div>
          </AnimatePresence>
        </TaskbarButton>
      </PopoverTrigger>
      <PopoverContent
        sideOffset={8}
        className="w-fit bg-white/85 p-1 z-[1001] flex flex-col rounded-sm"
        align="start"
      >
        <TaskbarButton>
          <Settings size={16} />
        </TaskbarButton>
        <TaskbarButton>
          <Info size={16} />
        </TaskbarButton>
      </PopoverContent>
    </Popover>
  );
}
