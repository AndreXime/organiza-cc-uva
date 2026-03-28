import { renderToString } from "react-dom/server";
import App from "../src/App";

export function prerender() {
	return {
		html: renderToString(<App />),
	};
}
