import { AppRoutes } from "./routes/routes";
import { ErrorBoundary } from "react-error-boundary";

function App() {
  return (
    <>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <AppRoutes />
      </ErrorBoundary>
    </>
  );
}
export default App;
