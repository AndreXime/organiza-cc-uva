import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { processDisciplinas, processEquivalentes } from "@/lib/csvToObject";
import { StoreInitializer } from "./page";
import AcademicData from "@/data/Eventos";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Gerenciador de Progresso Acadêmico",
	description: "Para o curso de Ciência da Computação da Universidade Estadual do Vale do Acaraú",
};

const DisciplinasCurso = processDisciplinas("./data/Disciplinas.csv");
const DisciplinasEquivalentes = processEquivalentes("./data/Equivalentes.csv", DisciplinasCurso);

/**
 * Script inline bloqueante para trocar o tema antes de renderizar
 * Isso evita FOUC ao recuperar o tema escolhido assim que o usuario entra na pagina
 */
const themeCode = `
(function() {
	let theme = localStorage.getItem('theme');
	const supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
	if (!theme && supportDarkMode) theme = 'dark';
	if (!theme) theme = 'light';
	document.documentElement.classList.add(theme);
})();`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="pt-BR" suppressHydrationWarning>
			<head>
				{/** biome-ignore lint/security/noDangerouslySetInnerHtml: "" */}
				<script dangerouslySetInnerHTML={{ __html: themeCode }} />
			</head>
			<StoreInitializer
				disciplinaServer={{ DisciplinasCurso, DisciplinasEquivalentes }}
				academicDataServer={AcademicData}
			/>
			<body className={`${inter.variable} antialiased bg-background`}>{children}</body>
		</html>
	);
}
