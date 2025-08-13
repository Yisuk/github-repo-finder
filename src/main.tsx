import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { RelayEnvironmentProvider } from "react-relay";
import RelayEnvironment from "./relay/RelayEnvironment";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <Suspense fallback="Loading...">
        <App />
      </Suspense>
    </RelayEnvironmentProvider>
  </StrictMode>
);