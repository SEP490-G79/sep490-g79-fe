import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ModeToggle } from "./components/ui/mode-toggle";
import AppRoutes from "./routes";
import AppHeader from "./components/layouts/AppHeader";
import AppFooter from "./components/layouts/AppFooter";
import { Toaster } from "sonner";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen flex flex-col w-full">
        <AppHeader />

        <div className="min-h-[calc(100vh-50px)] w-full">
          <AppRoutes />
        </div>
        <AppFooter />
      </div>

      <Toaster richColors position="top-center" />
    </ThemeProvider>
  );
}

export default App;
