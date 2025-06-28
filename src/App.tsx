import wallpaper from "@/assets/wallpaper.jpg";
import Taskbar from "@/components/taskbar/Taskbar";
import { useWindowManager } from "@/stores/windowStore";
import Window from "@/components/window/Window";
import AppRouter from "@/components/apps/AppRouter";

function App() {
  const backgroundStyles = {
    backgroundImage: `url(${wallpaper})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
  const { windows } = useWindowManager();
  return (
    <main className="h-screen w-screen overflow-hidden" style={backgroundStyles}>
      {Object.values(windows).map((window) => (
        <Window key={window.id} appType={window.id}>
          <AppRouter appType={window.id} />
        </Window>
      ))}
      <div className="w-full absolute top-0 z-[1000] flex flex-col items-center justify-center">
        <Taskbar />
      </div>
    </main>
  );
}

export default App;
