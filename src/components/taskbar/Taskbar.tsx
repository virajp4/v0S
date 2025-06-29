import DateTime, { TimeFormat } from "./DateTime";
import VolumeSlider from "./VolumeSlider";
import StartMenu from "./StartMenu";

export const taskbarStyles =
  "bg-white/85 h-10 w-fit flex items-center justify-center gap-3 px-1 rounded-md border-2 border-black z-[1000]";

export default function Taskbar() {
  return (
    <div className={taskbarStyles}>
      <StartMenu />
      <DateTime format={TimeFormat.H12} />
      <VolumeSlider />
    </div>
  );
}
