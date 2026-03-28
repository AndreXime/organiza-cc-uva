import path from "node:path";
import { vitePrerenderPlugin } from "vite-prerender-plugin";

export default [
	vitePrerenderPlugin({
		renderTarget: "#root",
		prerenderScript: path.resolve(__dirname, "renderServer.tsx"),
	}),
	{
		// O vitePrerenderPlugin tem um bug que nao termina o processo depois de terminar
		// Mas ele sinalize pro vite que terminou, esse plugin termina o processo
		name: "close-ssg-process",
		closeBundle() {
			setTimeout(() => process.exit(0), 200);
		},
	},
];
