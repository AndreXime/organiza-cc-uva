import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import prerenderPlugin from "./vite/prerenderPlugin";
import processCsvDataPlugin from "./vite/processCsvDataPlugin";

export default defineConfig({
	plugins: [tailwindcss(), react(), processCsvDataPlugin(), ...prerenderPlugin],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
});
