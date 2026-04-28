import { useUIStore } from "@/store/uiStore";

interface navButtonsType {
	label: string;
	path: string;
	badge?: string;
}

const navButtons: navButtonsType[] = [
	{ label: "Gerenciador de Disciplinas", path: "gerenciador" },
	{ label: "Organizador de Horários", path: "horario" },
	{ label: "Pesquisar Disciplinas", path: "filtro" },
	{ label: "Calendario Acadêmico", path: "academic-events" },
	{ label: "Planejador de Curso", path: "planejador" },
	{ label: "Configurações", path: "sobre" },
];

export default function Tabs() {
	const Tab = useUIStore((state) => state.Tab);
	const setTab = useUIStore((state) => state.setTab);

	return (
		<nav className="flex justify-center my-8 bg-card p-3 rounded-lg md:rounded-full shadow-sm">
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
				{navButtons.map((tab) => (
					<button
						type="button"
						key={tab.path}
						onClick={() => setTab(tab.path)}
						className={`relative px-4 py-2 text-sm font-semibold rounded-full flex items-center justify-center
                        ${
													Tab === tab.path
														? "text-primary-foreground bg-primary shadow-md"
														: "text-foreground hover:bg-accent"
												}
                        ${tab.path === "sobre" ? "md:col-span-1" : ""}
                        `}
					>
						{tab.label}

						{tab.badge && (
							<span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-tight shadow-sm leading-none">
								{tab.badge}
							</span>
						)}
					</button>
				))}
			</div>
		</nav>
	);
}
