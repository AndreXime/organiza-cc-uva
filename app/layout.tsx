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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="pt-BR">
			<StoreInitializer
				disciplinaServer={{ DisciplinasCurso, DisciplinasEquivalentes }}
				academicDataServer={AcademicData}
			/>
			<body className={`${inter.variable} antialiased bg-background`}>{children}</body>
		</html>
	);
}
