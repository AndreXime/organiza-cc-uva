/**
 * Pós-build: injeta HTML estático em dist/index.html.
 * Corre fora do `vite build` de propósito — um plugin que adiciona segundo entry ao Rollup
 * misturava o bundle de prerender com o do cliente (~200kB+ a mais no browser).
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToString } from "react-dom/server";
import { createServer, loadConfigFromFile, mergeConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// Mesmos plugins/alias que o build.
const loaded = await loadConfigFromFile({ command: "build", mode: "production" }, path.join(root, "vite.config.ts"));
if (!loaded) {
	throw new Error("Não foi possível carregar vite.config.ts");
}

const vite = await createServer(
	mergeConfig(loaded.config, {
		root,
		// Sem servidor HTTP: só transforma módulos para o Node.
		server: { middlewareMode: true },
		appType: "custom",
		logLevel: "error",
	}),
);

try {
	const { default: App } = await vite.ssrLoadModule("/src/App.tsx");
	const markup = renderToString(React.createElement(App));
	const distIndex = path.join(root, "dist/index.html");
	const html = readFileSync(distIndex, "utf-8");
	// Só o #root vazio do index já emitido pelo Vite; atributos extra (class, etc.) mantêm-se.
	const next = html.replace(
		/(<div(?=[^>]*\sid\s*=\s*["']root["'])[^>]*>)\s*(<\/div>)/i,
		(_full, open: string, close: string) => `${open}${markup}${close}`,
	);
	if (next === html) {
		throw new Error('Não encontrou <div id="root"></div> em dist/index.html');
	}
	writeFileSync(distIndex, next);
} finally {
	await vite.close();
}
