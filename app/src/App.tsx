import { Button } from "@/components/ui/button"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { ModeToggle } from "./components/ui/mode-toggle"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex min-h-svh flex-col items-center justify-center">
        <ModeToggle/>
      </div>
    </ThemeProvider>
  )
}

export default App