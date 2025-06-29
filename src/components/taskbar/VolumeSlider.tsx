import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Settings, Volume, Volume1, Volume2, VolumeX } from "lucide-react";
import { TaskbarButton } from "./TaskbarButton";
import { soundManager } from "@/lib/soundManager";
import { SoundType } from "@/lib/types";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

export default function VolumeSlider() {
  const [isOpen, setIsOpen] = useState(false);
  const [volume, setVolume] = useState(soundManager.getVolume() * 100);
  const debounceTimeout = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setVolume(soundManager.getVolume() * 100);
    }
  }, [isOpen]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      soundManager.play(SoundType.MenuOpen);
    }
  };

  const handleVolumeChange = useCallback((newVolume: number[]) => {
    const volumeValue = newVolume[0];
    setVolume(volumeValue);
    soundManager.setVolume(volumeValue / 100);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = window.setTimeout(() => {
      soundManager.play(SoundType.Volume);
    }, 150);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  const VolumeIcon = useMemo(() => {
    if (volume === 0) return <VolumeX size={16} />;
    if (volume > 0 && volume <= 33) return <Volume size={16} />;
    if (volume > 33 && volume <= 66) return <Volume1 size={16} />;
    return <Volume2 size={16} />;
  }, [volume]);

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <TaskbarButton>{VolumeIcon}</TaskbarButton>
      </PopoverTrigger>
      <PopoverContent
        sideOffset={8}
        className="w-10 bg-white/85 flex flex-col items-center gap-1 pb-1 z-[1001]"
      >
        <Slider
          value={[volume]}
          onValueChange={handleVolumeChange}
          max={100}
          min={0}
          step={5}
          orientation="vertical"
          inverted={false}
        />
        <TaskbarButton>
          <Settings size={16} />
        </TaskbarButton>
      </PopoverContent>
    </Popover>
  );
}
