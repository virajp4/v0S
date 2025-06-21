import wallpaper from "@/assets/wallpaper.jpg";
import Taskbar from "@/components/taskbar/Taskbar";

function App() {
  const backgroundStyles = {
    backgroundImage: `url(${wallpaper})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div className="h-screen w-screen" style={backgroundStyles}>
      <Taskbar />
    </div>
  );
}

export default App;
