"use client";
import { useMemo, useRef, useState } from "react";
import { Calendar } from "react-big-calendar";
import { format, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { localizer } from "@/lib/CalendarHelper";
import html2canvas from "html2canvas-pro";
import { Download, Eye, EyeOff } from "lucide-react";
import { useDisciplinaStore } from "@/store/disciplinas/disciplinaStore";
import SectionHeader from "../ui/SectionHeader";
import { useCalendarStore } from "@/store/ui/calendarStore";
import { useUIStore } from "@/store/ui/uiStore";

export default function HorarioManager() {
	const DisciplinasDisponiveis = useDisciplinaStore(
		(state) => state.DisciplinasDisponiveis,
	);
	const mode = useUIStore((state) => state.mode);

	const {
		visibleEvents,
		totalCargaHoraria,
		toggleSelectedDisc,
		selectedDiscs,
		hideNonSelected,
		setHideNonSelected,
	} = useCalendarStore();
	const [loading, setLoading] = useState(false);

	useMemo(() => {
		useCalendarStore.getState().buildEvents(DisciplinasDisponiveis);
	}, [DisciplinasDisponiveis]);

	const calendarRef = useRef<HTMLDivElement>(null);

	const salvarImagem = async () => {
		setLoading(true);
		const calendarRefcurrent = calendarRef.current;
		if (!calendarRefcurrent) return;

		const canvas = await html2canvas(calendarRefcurrent, {
			allowTaint: true,
			useCORS: true,
			scale: 2,
		});

		const link = document.createElement("a");
		link.href = canvas.toDataURL("image/png");
		link.download = "horarios.png";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		setLoading(false);
	};

	return (
		<>
			{mode !== "minimal" && (
				<SectionHeader title="Organizador de horarios">
					<p>
						A grade abaixo mostra os horários das disciplinas que estão
						disponíveis na aba{" "}
						<span className="font-semibold text-blue-600">
							Gerenciador de Disciplinas
						</span>
						. Você pode clicar nos cards para{" "}
						<span className="font-semibold text-[#7608c4]">
							marcar como selecionada
						</span>{" "}
						, isso fará ocultar disciplina que tenham conflito com ela, você
						pode usar isso para planejar as disciplinas com base nos horarios.
					</p>
					<p className="font-semibold">
						Total de horas das disciplinas selecionadas: {totalCargaHoraria}{" "}
						horas
					</p>
					<p className="flex flex-wrap flex-row gap-4 items-center justify-center">
						<button
							type="button"
							onClick={() => setHideNonSelected(!hideNonSelected)}
							disabled={selectedDiscs.length === 0}
							className="btn-primary"
						>
							{hideNonSelected ? (
								<>
									<Eye size={20} /> Mostrar disciplinas não selecionadas
								</>
							) : (
								<>
									<EyeOff size={20} />
									Esconder disciplinas não selecionadas
								</>
							)}
						</button>
						<button
							type="button"
							disabled={loading}
							className="btn-primary"
							onClick={salvarImagem}
						>
							<Download size={20} /> Salvar horarios como imagem
						</button>
					</p>
				</SectionHeader>
			)}

			<div className="relative overflow-x-auto lg:overflow-visible">
				<div
					ref={calendarRef}
					className="relative w-[1400px] lg:w-[95vw] pb-6 lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:max-w-[1800px]"
				>
					<Calendar
						className="text-black capitalize w-full"
						defaultDate={startOfWeek(new Date(), { weekStartsOn: 1 })}
						localizer={localizer}
						defaultView="work_week"
						views={["work_week"]}
						events={visibleEvents}
						onSelectEvent={(event) => toggleSelectedDisc(event.id)}
						eventPropGetter={(event) => {
							const isSelected = selectedDiscs.includes(event.id);
							return {
								style: {
									backgroundColor: isSelected ? "#6A0DAD" : undefined,
									color: isSelected ? "#FFFFFF" : undefined,
								},
							};
						}}
						step={30}
						timeslots={1}
						scrollToTime={new Date(1970, 1, 1, 8, 0)}
						min={new Date(0, 0, 0, 8, 0)}
						max={new Date(0, 0, 0, 22, 0)}
						startAccessor="start"
						endAccessor="end"
						titleAccessor="title"
						dayPropGetter={() => ({ style: { backgroundColor: "#f9f9f9" } })}
						formats={{
							dayFormat: (date) => {
								const dayName = format(date, "EEEE", { locale: ptBR });
								// Tira o feira dos dias das semanas
								return (
									dayName.charAt(0).toUpperCase() + dayName.slice(1)
								).split("-")[0];
							},
							timeGutterFormat: "HH:mm",
							eventTimeRangeFormat: ({ start, end }) =>
								`${format(start, "HH:mm", { locale: ptBR })} - ${format(
									end,
									"HH:mm",
									{
										locale: ptBR,
									},
								)}`,
						}}
						toolbar={false}
						components={{
							event: ({ event }: { event: CalendarEvent }) => {
								return (
									<div>
										<div className="font-semibold text-sm">{event.title}</div>
										<div className="text-sm">
											{event.subtitle.map((sub, index) => (
												<p key={index}>{sub}</p>
											))}
										</div>
									</div>
								);
							},
							timeGutterHeader: () => (
								<div className="py-1 text-xs font-semibold">Horário</div>
							),
						}}
						dayLayoutAlgorithm="no-overlap"
						allDayAccessor={() => false}
					/>
				</div>
			</div>
		</>
	);
}
