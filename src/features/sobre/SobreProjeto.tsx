import DisciplinaTable from "./DisciplinaTable";
import { Footprints, BadgeCheck, LibraryBig, Clock, Sun, Moon, File, FileText, ExternalLink } from "lucide-react";
import { useDisciplinaStore } from "@/store/disciplinaStore";
import useCalculateProgress from "@/hooks/useCalculateProgress";
import { useUIStore } from "@/store/uiStore";
import { GitHub, Nextjs, TailwindCSS, TypeScript, Zustand } from "@/components/Icons";

export default function Sobre() {
	const DisciplinasDisponiveis = useDisciplinaStore((state) => state.DisciplinasDisponiveis);
	const getDisciplinasByIds = useDisciplinaStore((state) => state.getDisciplinasByIds);
	const metadata = useDisciplinaStore((state) => state.metadata);
	const setMode = useUIStore((state) => state.setMode);
	const mode = useUIStore((state) => state.mode);

	const { totalFeitas, faltantes } = useCalculateProgress();

	const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
		dateStyle: "short",
	});

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

	const linksRapidos = [
		{ label: "Login", href: "https://aluno.uvanet.br" },
		{
			label: "Comunicados de calendário",
			href: "https://ww2.uva.ce.gov.br/apps/view/listagem_documentos.php?buscar=0105",
		},
		{ label: "Creditos do RU", href: "https://sru.uvanet.br/apps/consumidor/" },
		{ label: "Fluxograma das disciplinas", href: "/Fluxograma Ciências da computação.pdf" },
	];

	return (
		<div className="max-w-7xl mx-auto space-y-12">
			<div className="grid gap-8 lg:grid-cols-2">
				<section className="rounded-lg border border-border bg-card overflow-hidden p-4">
					<div className="mb-4">
						<h3 className="text-lg font-semibold text-heading">Temas de cores</h3>
						<p className="mt-0.5 text-sm text-muted-foreground">Escolha entre tema claro ou escuro para a interface.</p>
					</div>
					<div className="flex flex-wrap gap-3">
						<button
							type="button"
							className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-card hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
							onClick={() => toggleTheme("light")}
						>
							<Sun className="h-4 w-4 text-amber-500" />
							<span>Tema claro</span>
						</button>
						<button
							type="button"
							className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-border bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-900 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
							onClick={() => toggleTheme("dark")}
						>
							<Moon className="h-4 w-4 text-sky-300" />
							<span>Tema escuro</span>
						</button>
					</div>
				</section>
				<section className="rounded-lg border border-border bg-card overflow-hidden p-4">
					<div className="mb-4">
						<h3 className="text-lg font-semibold text-heading">Modo de exibição</h3>
						<p className="mt-0.5 text-sm text-muted-foreground">
							Padrão ou minimalista para a visualização das disciplinas.
						</p>
					</div>
					<div className="flex flex-wrap gap-3">
						<button
							type="button"
							aria-pressed={mode === "default"}
							className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background bg-primary/90 border-primary text-primary-foreground shadow-sm hover:bg-primary cursor-pointer`}
							onClick={() => setMode("default")}
						>
							<FileText className="h-4 w-4" />
							<span>Modo padrão</span>
						</button>
						<button
							type="button"
							aria-pressed={mode === "minimal"}
							className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background bg-purple-700 border-purple-700 text-white shadow-sm hover:bg-purple-800 cursor-pointer`}
							onClick={() => setMode("minimal")}
						>
							<File className="h-4 w-4" />
							<span>Modo minimalista</span>
						</button>
					</div>
				</section>
			</div>
			<section className="rounded-lg border border-border bg-card overflow-hidden p-4">
				<div className="mb-4">
					<h3 className="text-lg font-semibold text-heading">Links rápidos</h3>
				</div>
				<ul className="flex flex-wrap gap-2">
					{linksRapidos.map((item) => (
						<li key={item.href}>
							<a
								href={item.href}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/50 px-3 py-2 text-sm text-foreground hover:border-primary/40 hover:bg-card transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
							>
								<ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
								<span className="font-medium">{item.label}</span>
								<span className="text-muted-foreground truncate hidden sm:inline">
									{item.href.replace(/^https?:\/\//, "")}
								</span>
							</a>
						</li>
					))}
				</ul>
			</section>
			<section className="rounded-lg border border-border bg-card overflow-hidden p-4">
				<div className="mb-4">
					<h3 className="text-lg font-semibold text-heading">Estatísticas de progresso</h3>
					<p className="mt-0.5 text-sm text-muted-foreground">
						Visão geral rápida do seu andamento no curso com base nos dados atuais.
					</p>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					{stats.map((stat) => (
						<div
							key={stat.title}
							className="stat-card bg-background p-4 rounded-lg shadow-sm border border-border flex items-center"
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
			</section>
			<section className="rounded-lg border border-border bg-card overflow-hidden p-4">
				<div className="mb-4">
					<h3 className="text-lg font-semibold text-heading">Atualização dos dados</h3>
					<p className="mt-0.5 text-sm text-muted-foreground">
						Informações sobre a última atualização dos dados usados pelo projeto.
					</p>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
					<div className="rounded-lg border border-border bg-background/60 p-3 flex flex-col gap-1">
						<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Disciplinas</span>
						<span className="font-medium text-foreground">
							{dateFormatter.format(new Date(metadata.DisciplinaLastUpdated))}
						</span>
					</div>
					<div className="rounded-lg border border-border bg-background/60 p-3 flex flex-col gap-1">
						<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
							Equivalências de disciplinas
						</span>
						<span className="font-medium text-foreground">
							{dateFormatter.format(new Date(metadata.DisciplinaEquivalentesLastUpdated))}
						</span>
					</div>
				</div>
			</section>
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
						<a
							href="https://github.com/AndreXime/organiza-cc-uva"
							target="_blank"
							rel="noreferrer"
							className="inline-flex items-center gap-2 justify-center bg-gray-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-900 transition-colors"
						>
							<GitHub size={25} />
							Ver no GitHub
						</a>
					</div>
				</>
			)}
		</div>
	);
}
