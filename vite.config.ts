import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import processCsvDataPlugin from "./vite/processCsvDataPlugin";

export default defineConfig({
	plugins: [tailwindcss(), react(), processCsvDataPlugin()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
});
