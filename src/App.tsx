import Taskbar from "@/components/taskbar/Taskbar";
import { useWindowManager } from "@/stores/windowStore";
import Window from "@/components/window/Window";
import AppRouter from "@/components/apps/AppRouter";
import AppBar from "@/components/taskbar/AppBar";
import starryHill from "/wallpapers/starry_hill.jpg";

function App() {
  const backgroundStyles = {
    backgroundImage: `url(${starryHill})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
  const { windows } = useWindowManager();
  return (
    <main className="h-screen w-screen overflow-hidden" style={backgroundStyles}>
      <div className="w-full absolute top-2 flex justify-center">
        <Taskbar />
      </div>
      {Object.values(windows).map((window) => (
        <Window key={window.id} appType={window.id}>
          <AppRouter window={window} />
        </Window>
      ))}
      <div className="w-full absolute bottom-2 flex justify-center">
        <AppBar />
      </div>
    </main>
  );
}

export default App;
