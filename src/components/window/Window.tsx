import { useCallback } from "react";
import { Rnd } from "react-rnd";
import type { DraggableData, ResizableDelta, Position } from "react-rnd";
import { useWindowManager } from "@/stores/windowStore";
import type { AppType } from "@/lib/types";
import WindowTitle from "./WindowTitle";

interface WindowProps {
  appType: AppType;
  children: React.ReactNode;
}

export default function Window({ appType, children }: WindowProps) {
  const windowState = useWindowManager((state) => state.windows[appType]);
  const updateWindow = useWindowManager((state) => state.updateWindow);
  const setActiveWindow = useWindowManager((state) => state.setActiveWindow);

  const onDragStart = useCallback(() => {
    setActiveWindow(appType);
  }, [appType, setActiveWindow]);

  const onDragStop = useCallback(
    (_e: any, d: DraggableData) => {
      updateWindow(appType, { x: d.x, y: d.y });
    },
    [appType, updateWindow]
  );

  const onResizeStop = useCallback(
    (
      _e: MouseEvent | TouchEvent,
      _dir: any,
      ref: HTMLElement,
      _delta: ResizableDelta,
      pos: Position
    ) => {
      updateWindow(appType, {
        width: parseInt(ref.style.width),
        height: parseInt(ref.style.height),
        ...pos,
      });
    },
    [appType, updateWindow]
  );

  if (!windowState) {
    return null;
  }
  const { x, y, width, height, title, zIndex } = windowState;
  return (
    <Rnd
      size={{ width, height }}
      position={{ x, y }}
      onDragStart={onDragStart}
      onDragStop={onDragStop}
      onResizeStop={onResizeStop}
      onMouseDown={() => setActiveWindow(appType)}
      bounds="window"
      dragHandleClassName="window-handle"
      style={{ zIndex }}
      className={
        "border border-neutral-800/80 rounded-lg shadow-2xl overflow-hidden bg-neutral-900/80 backdrop-blur-lg flex flex-col"
      }
    >
      <WindowTitle appType={appType} title={title} />
      <div className="flex-grow p-1">{children}</div>
    </Rnd>
  );
}
