import { useUIStore } from "@/store/uiStore";
import SectionHeader from "@/components/ui/SectionHeader";
import { type TimeFilter, useAcademicCalendarStore } from "@/store/academicCalendarStore";

const RELEVANT_KEYWORDS = ["Atividades complementares", "Matrícula", "Feriado", "Reajuste", "Trancamento"];

const TIME_OPTIONS: { label: string; value: TimeFilter }[] = [
	{ label: "1 Semana", value: 7 },
	{ label: "1 Mês", value: 30 },
	{ label: "3 Meses", value: 90 },
];

export default function EventosAcademicos() {
	const mode = useUIStore((state) => state.mode);

	const {
		searchTerm,
		selectedFilters,
		timeFilter,
		metadata,
		setTimeFilter,
		setSearchTerm,
		toggleFilter,
		resetFilters,
		getFilteredEvents,
	} = useAcademicCalendarStore();

	const filteredEvents = getFilteredEvents();

	return (
		<>
			{mode !== "minimal" && (
				<SectionHeader title="Pesquisar Eventos">
					<div>
						<p>
							Pesquise e filtre os eventos do calendário acadêmico.
							<br />
							Datas extraidas do PDF oficial por IA
						</p>
						<div className="mt-2">
							{Object.entries(metadata).map(([key, value]) => {
								const diffInMs = value.end.getTime() - Date.now();
								const diffInDaysRaw = diffInMs / (1000 * 60 * 60 * 24);
								const diffInDaysRounded = Math.floor(Math.abs(diffInDaysRaw));

								return (
									<div key={key}>
										Periodo <strong>{key}</strong>{" "}
										{diffInMs > 0 ? `faltam ${diffInDaysRounded} dias` : `passou faz ${diffInDaysRounded} dias`}
									</div>
								);
							})}
						</div>
					</div>
				</SectionHeader>
			)}

			<div className="space-y-6">
				<div className="flex flex-col gap-4">
					<input
						type="text"
						className="border rounded-full w-full flex items-center px-4 py-2 min-h-[43px] focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
						placeholder="Pesquise pelo nome..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>

					<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
						<span className="text-sm font-semibold text-gray-700 whitespace-nowrap">Palavras relevantes:</span>

						<div className="flex flex-wrap gap-2">
							{RELEVANT_KEYWORDS.map((keyword) => {
								const isSelected = selectedFilters.includes(keyword);
								return (
									<button
										key={keyword}
										onClick={() => toggleFilter(keyword)}
										className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border
                                            ${isSelected ? "bg-blue-600 text-white border-blue-600 shadow-md" : "bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-500"}
                                        `}
									>
										{keyword}
									</button>
								);
							})}
						</div>
					</div>
					<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
						<span className="text-sm font-semibold text-gray-700">Período:</span>
						<div className="flex flex-wrap gap-2">
							{TIME_OPTIONS.map((option) => (
								<button
									key={option.label}
									onClick={() => setTimeFilter(option.value)}
									className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border
                                ${timeFilter === option.value ? "bg-green-600 text-white border-green-600 shadow-md" : "bg-white text-gray-600 border-gray-300 hover:border-green-400"}
                            `}
								>
									Próximo {option.label}
								</button>
							))}
						</div>
					</div>
				</div>

				<h2 className="text-lg font-semibold text-center text-gray-800">
					{filteredEvents.length} {filteredEvents.length === 1 ? "Evento encontrado" : "Eventos encontrados"}
				</h2>

				<ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{filteredEvents.map((data, index) => {
						const start = new Date(data.date);
						const end = data.untilDate ? new Date(data.untilDate) : null;

						// Função única para formatar, decidindo se mostra o ano ou não
						const formatDate = (date: Date, showYear: boolean = true) =>
							new Intl.DateTimeFormat("pt-BR", {
								day: "2-digit",
								month: "2-digit",
								year: showYear ? "numeric" : undefined,
							}).format(date);

						return (
							<li
								key={index}
								className="bg-blue-50 p-4 rounded-lg text-sm flex flex-col gap-2 justify-start items-center text-center hover:bg-blue-100 transition-colors border border-transparent hover:border-blue-200"
							>
								<span className="text-blue-800 font-bold text-base">
									{end ? `${formatDate(start, false)} até ${formatDate(end, true)}` : formatDate(start, true)}
								</span>
								<span className="text-gray-700 leading-snug">{data.event}</span>
							</li>
						);
					})}

					{filteredEvents.length === 0 && (
						<div className="col-span-full py-10 flex flex-col items-center justify-center text-gray-400">
							<p>Nenhum evento encontrado.</p>
							<button onClick={resetFilters} className="text-blue-500 text-sm mt-2 hover:underline">
								Limpar filtros
							</button>
						</div>
					)}
				</ul>
			</div>
		</>
	);
}
