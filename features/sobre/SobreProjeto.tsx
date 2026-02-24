import Link from "next/link";
import DisciplinaTable from "./DisciplinaTable";
import { Footprints, BadgeCheck, LibraryBig, Clock, Sun, Moon, File, FileText } from "lucide-react";
import { useDisciplinaStore } from "@/store/disciplinaStore";
import useCalculateProgress from "@/hooks/useCalculateProgress";
import { useUIStore } from "@/store/uiStore";
import { GitHub, Nextjs, TailwindCSS, TypeScript, Zustand } from "@/components/Icons";

export default function Sobre() {
	const DisciplinasDisponiveis = useDisciplinaStore((state) => state.DisciplinasDisponiveis);
	const getDisciplinasByIds = useDisciplinaStore((state) => state.getDisciplinasByIds);
	const setMode = useUIStore((state) => state.setMode);
	const mode = useUIStore((state) => state.mode);

	const { totalFeitas, faltantes } = useCalculateProgress();

	function toggleTheme(theme: "light" | "dark") {
		const html = document.documentElement;

		const themeToRemove = theme === "light" ? "dark" : "light";

		html.classList.remove(themeToRemove);
		html.classList.add(theme);

		localStorage.setItem("theme", theme);
	}

	const stats = [
		{
			title: "Disciplinas concluídas",
			value: totalFeitas,
			icon: BadgeCheck,
			color: "text-green-600",
		},
		{
			title: "Disciplinas disponíveis para cursar",
			value: DisciplinasDisponiveis.size,
			icon: LibraryBig,
			color: "text-blue-600",
		},
		{
			title: "Disciplinas para terminar o curso",
			value: faltantes,
			icon: Clock,
			color: "text-orange-600",
		},
		{
			title: "Próxima disciplina disponível",
			value: getDisciplinasByIds(DisciplinasDisponiveis)[0]?.nome || "Você concluiu todas as disciplinas!",
			icon: Footprints,
			color: "text-purple-600",
		},
	];

	return (
		<div className="max-w-7xl mx-auto space-y-12">
			<div className="grid gap-8 md:grid-cols-2">
				<div>
					<h3 className="text-xl font-bold mb-4 text-heading border-b-2 border-border pb-2 flex flex-row items-center">
						Temas de cores
					</h3>
					<div className="flex flex-wrap gap-3">
						<button
							type="button"
							className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-card hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
							onClick={() => toggleTheme("light")}
						>
							<Sun className="h-4 w-4 text-amber-500" />
							<span>Tema claro</span>
						</button>
						<button
							type="button"
							className="inline-flex items-center gap-2 rounded-full border border-border bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-900 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
							onClick={() => toggleTheme("dark")}
						>
							<Moon className="h-4 w-4 text-sky-300" />
							<span>Tema escuro</span>
						</button>
					</div>
				</div>
				<div>
					<h3 className="text-xl font-bold mb-4 text-heading border-b-2 border-border pb-2 flex flex-row items-center">
						Modo de exibição
					</h3>
					<div className="flex flex-wrap gap-3">
						<button
							type="button"
							aria-pressed={mode === "default"}
							className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
								mode === "default"
									? "bg-primary border-primary text-primary-foreground shadow-sm"
									: "bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
							}`}
							onClick={() => setMode("default")}
						>
							<FileText className="h-4 w-4" />
							<span>Modo padrão</span>
						</button>
						<button
							type="button"
							aria-pressed={mode === "minimal"}
							className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
								mode === "minimal"
									? "bg-purple-700 border-purple-700 text-white shadow-sm"
									: "bg-card border-border text-muted-foreground hover:border-purple-500/50 hover:text-foreground"
							}`}
							onClick={() => setMode("minimal")}
						>
							<File className="h-4 w-4" />
							<span>Modo minimalista</span>
						</button>
					</div>
				</div>
			</div>
			<div>
				<h3 className="text-xl font-bold mb-4 text-heading border-b-2 border-border pb-2">Estatísticas de progresso</h3>
				<div id="stats-container" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					{stats.map((stat) => (
						<div
							key={stat.title}
							className="stat-card bg-card p-4 rounded-lg shadow-sm border border-border flex items-center"
						>
							<div className="text-3xl mr-4">
								<stat.icon size={35} className={stat.color} />
							</div>
							<div>
								<h4 className="font-bold text-muted text-sm">{stat.title}</h4>
								<div className={`text-xl font-semibold ${stat.color}`}>{stat.value}</div>
							</div>
						</div>
					))}
				</div>
			</div>
			{mode !== "minimal" && (
				<>
					<div>
						<DisciplinaTable />
					</div>
					<div className="bg-card p-6 rounded-lg shadow-sm border border-border">
						<p className="text-muted leading-relaxed">
							A ideia surgiu da necessidade recorrente de montar uma tabela no Excel todo semestre para verificar os
							conflitos de horário e os pré-requisitos das disciplinas. Este projeto visa simplificar esse processo,
							oferecendo uma ferramenta interativa e visual para os estudantes de Ciências da Computação da Universidade
							Estadual do Vale do Acaraú.
						</p>
					</div>
					<div>
						<h3 className="text-xl font-bold mb-4 text-heading border-b-2 border-border pb-2">
							Tecnologias Utilizadas
						</h3>
						<div className="flex flex-wrap justify-center gap-6 text-center">
							<div className="text-muted flex flex-col justify-center items-center gap-2">
								<TypeScript size={50} />
								Typescript
							</div>
							<div className="text-muted flex flex-col justify-center  items-center gap-2">
								<Nextjs size={50} />
								Next.js
							</div>
							<div className="text-muted flex flex-col justify-center items-center gap-2">
								<TailwindCSS size={50} />
								TailwindCSS
							</div>
							<div className="text-muted flex flex-col justify-center items-center gap-2">
								<Zustand size={50} />
								Zustand
							</div>
						</div>
					</div>
					<div className="text-center">
						<h3 className="text-xl font-bold mb-4 text-heading">Gostou do Projeto?</h3>
						<p className="text-muted mb-4">
							Se quiser sugerir alguma melhoria, você pode abrir uma <strong className="font-semibold">issue</strong> ou
							um <strong className="font-semibold">pull request</strong>.
						</p>
						<Link
							href="https://github.com/AndreXime/organiza-cc-uva"
							className="inline-flex items-center gap-2 justify-center bg-gray-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-900 transition-colors"
						>
							<GitHub size={25} />
							Ver no GitHub
						</Link>
					</div>
				</>
			)}
		</div>
	);
}
