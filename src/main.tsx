import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Missing #root element");

const isSSG = rootEl.hasChildNodes();

if (isSSG) {
	hydrateRoot(rootEl, <App />);
} else {
	createRoot(rootEl).render(<App />);
}
