import { useUIStore } from "@/store/uiStore";

const navButtons = [
	{ label: "Gerenciador de Disciplinas", path: "gerenciador" },
	{ label: "Organizador de Horários", path: "horario" },
	{ label: "Pesquisar Disciplinas", path: "filtro" },
	{ label: "Calendario academico", path: "academic-events", isNew: true },
	{ label: "Planejador de Curso", path: "planejador" },
	{ label: "Sobre o projeto", path: "sobre" },
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

						{/* Badge posicionado no canto superior direito */}
						{tab.isNew && (
							<span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-tight shadow-sm leading-none">
								Atualizado
							</span>
						)}
					</button>
				))}
			</div>
		</nav>
	);
}
