import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ModeToggle } from "./components/ui/mode-toggle";
import AppRoutes from "./routes";
import AppHeader from "./components/layouts/AppHeader";
import AppFooter from "./components/layouts/AppFooter";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen flex flex-col w-full">
        <AppHeader />
        <div>
          <AppRoutes />
        </div>
        <div>
          <AppFooter />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
