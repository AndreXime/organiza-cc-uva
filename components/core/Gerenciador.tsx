"use client";

import { useMemo, useState } from "react";
import ProgressBar from "../ui/ProgressBar";
import { Eye, EyeOff } from "lucide-react";
import { useDisciplinaStore } from "@/store/disciplinas/disciplinaStore";
import { SkeletonSection } from "../ui/LoadingSkeleton";
import { useUIStore } from "@/store/ui/uiStore";
import { generateDisciplinaClasses } from "@/lib/utils";
import SectionHeader from "../ui/SectionHeader";

export default function GerenciadorInterativo() {
	const {
		DisciplinasTotais,
		DisciplinasDisponiveis,
		DisciplinasEquivalentes,
		DisciplinasPorPeriodo,
		DisciplinasFeitas,
		toggleDisciplina,
		getDisciplinasByIds,
	} = useDisciplinaStore();

	const loading = useDisciplinaStore((state) => state.loading);
	const mode = useUIStore((state) => state.mode);

	const mostrarFeitas = useUIStore((state) => state.mostrarFeitas);
	const setMostrarFeitas = useUIStore((state) => state.setMostrarFeitas);
	const setMessage = useUIStore((state) => state.setMessage);

	const [expandEquivalente, setExpandEquivalente] = useState<number>();

	// Função pra clicar e alternar se já fez ou não
	function toggleDisc(id: number) {
		const mensagemErro = toggleDisciplina(id);

		if (mensagemErro) {
			setMessage(mensagemErro);
		}
	}

	const disciplinasVisiveis: Record<string, Disciplina[]> = useMemo(() => {
		const gruposMap = new Map<
			string,
			(typeof DisciplinasEquivalentes)[number][]
		>();

		// Agrupa as disciplinas pelo equivaleNome
		DisciplinasEquivalentes.forEach((disciplina) => {
			const key = disciplina.equivaleNome;
			if (!gruposMap.has(key)) gruposMap.set(key, []);
			gruposMap.get(key)!.push(disciplina);
		});

		// Função para calcular o peso para ordenação
		const getSortWeight = (disciplina: Disciplina): number => {
			const foiFeita = DisciplinasFeitas.has(disciplina.id);
			const estaDisponivel = DisciplinasDisponiveis.has(disciplina.id);

			if (foiFeita) {
				return 1; // Feitas vão para o meio
			}
			if (estaDisponivel) {
				return 0; // Disponíveis vêm primeiro
			}
			return 2; // Bloqueadas ficam no final
		};

		if (mostrarFeitas) {
			// Mostra todas as disciplinas com a ordem: Disponíveis > Bloqueadas > Feitas
			return Object.fromEntries(
				Object.entries(DisciplinasPorPeriodo).map(([periodo, disciplinas]) => [
					periodo,
					getDisciplinasByIds(disciplinas)
						.map((disciplina) => {
							const equivalentes = gruposMap.get(disciplina.nome);
							if (!equivalentes) {
								return disciplina;
							}
							disciplina.equivalentes = equivalentes;
							return disciplina;
						})
						.slice()
						.sort((a, b) => getSortWeight(a) - getSortWeight(b)),
				]),
			);
		}

		// Mostra com a ordem: Disponíveis > Bloqueadas
		return Object.fromEntries(
			Object.entries(DisciplinasPorPeriodo).map(([periodo, disciplinas]) => [
				periodo,
				getDisciplinasByIds(disciplinas)
					.map((disciplina) => {
						const equivalentes = gruposMap.get(disciplina.nome);
						if (!equivalentes) {
							return disciplina;
						}
						disciplina.equivalentes = equivalentes;
						return disciplina;
					})
					.filter((disc) => !DisciplinasFeitas.has(disc.id))
					.sort((a, b) => getSortWeight(a) - getSortWeight(b)),
				undefined,
			]),
		);
	}, [
		mostrarFeitas,
		DisciplinasPorPeriodo,
		DisciplinasFeitas,
		DisciplinasDisponiveis,
		DisciplinasEquivalentes,
		getDisciplinasByIds,
	]);

	return (
		<>
			{mode !== "minimal" ? (
				<SectionHeader title="Gerenciador de Disciplinas">
					<p>
						As disciplinas em{" "}
						<span className="font-bold text-green-600">verde</span> estão
						marcadas como{" "}
						<span className="font-bold text-green-600">Concluídas</span>, e as
						em
						<span className="font-bold text-blue-600"> azul</span> estão
						<span className="font-bold text-blue-600"> Disponíveis</span>.{" "}
						<br />
						Clique em uma disciplina disponível para marcá-la como concluída.
						Clique em uma disciplina concluída para desmarcá-la. <br />
						As disciplinas só aparecem como disponíveis quando todos os seus
						<span className="font-semibold text-red-600"> pré-requisitos</span>{" "}
						estão cumpridos. <br />
						Suas alterações são salvas automaticamente!
					</p>
					<div className="flex flex-wrap gap-4 items-center justify-center mt-4">
						<p className="flex flex-wrap flex-row gap-4 items-center justify-center">
							<button
								type="button"
								disabled={DisciplinasFeitas.size === 0}
								onClick={() => setMostrarFeitas(!mostrarFeitas)}
								className="btn-primary"
							>
								{mostrarFeitas ? (
									<>
										<EyeOff size={20} /> Esconder disciplinas feitas
									</>
								) : (
									<>
										<Eye size={20} /> Mostrar todas disciplinas
									</>
								)}
							</button>
						</p>
					</div>
				</SectionHeader>
			) : (
				<div className="flex flex-wrap gap-4 items-center justify-center my-4">
					<p className="flex flex-wrap flex-row gap-4 items-center justify-center">
						<button
							type="button"
							disabled={DisciplinasFeitas.size === 0}
							onClick={() => setMostrarFeitas(!mostrarFeitas)}
							className="btn-primary"
						>
							{mostrarFeitas ? (
								<>
									<EyeOff size={20} /> Esconder disciplinas feitas
								</>
							) : (
								<>
									<Eye size={20} /> Mostrar todas disciplinas
								</>
							)}
						</button>
					</p>
				</div>
			)}

			<ProgressBar />

			{!loading
				? Object.entries(disciplinasVisiveis).map(([periodo, disciplinas]) => (
						<section key={periodo} className="mb-8">
							<h3 className="text-xl font-bold mb-4 text-gray-700 border-b-2 border-gray-200 pb-2">
								{periodo}
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
								{disciplinas.map((disciplina) => {
									const { cardClasses, titleClasses, estáBloqueada } =
										generateDisciplinaClasses(disciplina.id);

									return (
										<button
											type="button"
											onClick={() => {
												if (!estáBloqueada) {
													toggleDisc(disciplina.id);
												}
											}}
											key={disciplina.id}
											className={`${cardClasses}`}
										>
											<strong className={titleClasses}>
												{disciplina.nome}
											</strong>
											<span className="text-xs mt-2 font-semibold">
												{disciplina.professor
													? `${disciplina.professor} - `
													: ""}{" "}
												{disciplina.carga_horaria} horas
											</span>
											{disciplina.requisitos &&
											disciplina.requisitos.length > 0 ? (
												<ul className="list-disc list-inside mt-2 text-xs">
													{disciplina.requisitos.map((req) => (
														<li key={req.id}>
															{DisciplinasTotais.find((d) => d.id === req.id)
																?.nome || "Disciplina não encontrada"}
														</li>
													))}
												</ul>
											) : (
												<p className="text-xs italic mt-2">
													Sem pré-requisitos
												</p>
											)}
											<div className="flex justify-center flex-col mt-3">
												{disciplina.equivalentes &&
													disciplina.equivalentes.length > 0 && (
														<>
															<span
																className="cursor-pointer py-1 text-xs bg-blue-600 hover:bg-blue-500 rounded-full text-white w-1/2 text-center"
																onClick={(e) => {
																	e.stopPropagation();
																	setExpandEquivalente(
																		disciplina.id !== expandEquivalente
																			? disciplina.id
																			: undefined,
																	);
																}}
															>
																{expandEquivalente === disciplina.id
																	? "Esconder equivalentes"
																	: "Ver equivalentes"}
															</span>
															{expandEquivalente === disciplina.id && (
																<span className="text-xs mt-2 font-bold flex-col flex gap-1">
																	Equivalentes:
																	<div className="flex flex-col gap-2 font-normal">
																		{disciplina.equivalentes.map(
																			(equivalente, index) => (
																				<span key={index}>
																					<span className="font-semibold">
																						{equivalente.curso}
																					</span>
																					<div className="flex flex-col">
																						{disciplina.horarios?.map((h) => (
																							<span
																								key={`${h.dia} ${h.inicio} - ${h.fim}`}
																							>{`${h.dia} ${h.inicio} - ${h.fim}`}</span>
																						))}
																					</div>
																				</span>
																			),
																		)}
																	</div>
																</span>
															)}
														</>
													)}
											</div>
										</button>
									);
								})}
							</div>
						</section>
					))
				: Array.from({ length: 6 }).map((_, i) => <SkeletonSection key={i} />)}
		</>
	);
}
