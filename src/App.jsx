import { AppRoutes } from "./routes/AppRoutes";
import { AppProvider } from "./services/AppContext";

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export { App };
