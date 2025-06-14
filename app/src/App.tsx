import { Button } from "@/components/ui/button"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { ModeToggle } from "./components/ui/mode-toggle"
import AppRoutes from "./routes"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AppRoutes/>
    </ThemeProvider>
  )
}

export default App