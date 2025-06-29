import { Button } from "@/components/ui/button";
import { soundManager } from "@/lib/soundManager";
import { SoundType } from "@/lib/types";

interface TaskbarButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode;
  onMouseDownSound?: SoundType;
  onMouseUpSound?: SoundType;
  onClickSound?: SoundType;
  onHoverSound?: SoundType;
}

export function TaskbarButton({
  children,
  onMouseDownSound,
  onMouseUpSound,
  onClickSound,
  onHoverSound,
  ...props
}: TaskbarButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="w-7 h-7 hover:bg-gray-400/70 active:bg-gray-400/85 rounded-sm transition-all duration-250"
      onMouseEnter={(e) => {
        if (onHoverSound) {
          soundManager.play(onHoverSound);
        }
        props.onMouseEnter?.(e);
      }}
      onMouseDown={(e) => {
        if (onMouseDownSound) {
          soundManager.play(onMouseDownSound);
        }
        props.onMouseDown?.(e);
      }}
      onMouseUp={(e) => {
        if (onMouseUpSound) {
          soundManager.play(onMouseUpSound);
        }
        props.onMouseUp?.(e);
      }}
      onClick={(e) => {
        if (onClickSound) {
          soundManager.play(onClickSound);
        }
        props.onClick?.(e);
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
