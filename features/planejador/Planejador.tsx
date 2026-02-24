"use client";

import { useState } from "react";
import { useDisciplinaStore } from "@/store/disciplinaStore";
import { useUIStore } from "@/store/uiStore";
import { Plus, Sparkles } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { NovoSemestreModal } from "./NovoSemestreModal";
import { usePlanejadorStore } from "@/features/planejador/planejadorStore";

export default function Planejador() {
	const {
		planejamento,
		semestreEmEdicao,
		adicionarSemestre,
		iniciarEdicao,
		concluirEdicao,
		adicionarDisciplina,
		removerDisciplina,
		removerSemestre,
		getDisciplinasDisponiveisParaSelecao,
		getConflitos,
		preencherAutomaticamente,
	} = usePlanejadorStore();

	const DisciplinasTotais = useDisciplinaStore((state) => state.DisciplinasTotais);
	const mode = useUIStore((state) => state.mode);

	const [criandoNovoSemestre, setCriandoNovoSemestre] = useState(false);

	const handleRemoverSemestre = (ano: number, semestre: number) => {
		const { openModal } = useUIStore.getState();

		openModal(
			`Tem certeza que deseja remover o semestre ${ano}.${semestre}?\n Todas as disciplinas planejadas nele serão perdidas.`,
			() => {
				removerSemestre(ano, semestre);
			},
		);
	};

	const handlePreencherAuto = () => {
		const { openModal } = useUIStore.getState();

		openModal(
			`Isso apagará seu planejamento atual e criará um novo, otimizado para concluir o curso no menor tempo possível.\n
             O algoritmo pode sugerir uma carga irrealista, com várias disciplinas no mesmo semestre, mas nunca gera conflitos de horário.\n
             Deseja continuar?`,
			() => {
				preencherAutomaticamente();
			},
		);
	};

	const handleAdicionarSemestre = () => {
		adicionarSemestre();
		const { planejamento: planejamentoAtual } = usePlanejadorStore.getState();
		const novoSemestre = planejamentoAtual[planejamentoAtual.length - 1];

		if (novoSemestre) {
			iniciarEdicao(novoSemestre.ano, novoSemestre.semestre);
			setCriandoNovoSemestre(true);
		}
	};

	return (
		<div className="space-y-8">
			{mode !== "minimal" ? (
				<SectionHeader title="Planejador de Curso">
					<p>
						Adicione os próximos semestres e quais disciplinas fazer em cada um deles.
						<br />
						Clique em Adicionar semestre e aparecerão as disciplinas disponíveis no momento. Mais disciplinas ficarão
						disponíveis em outros semestres, pois o sistema leva em conta as que você planejou nos semestres anteriores.
						<br />
						As disciplinas em <span className="text-yellow-400 font-bold">amarelo</span> representa que há um conflito
						de horario com outra disciplina no mesmo semestre.
					</p>
					<div className="text-center mt-4 flex justify-center gap-4">
						<button type="button" onClick={handleAdicionarSemestre} className="btn-primary">
							<Plus size={22} />
							Adicionar Semestre
						</button>
						<button type="button" onClick={handlePreencherAuto} className="btn-primary">
							<Sparkles size={20} fill="yellow" />
							Preencher automaticamente
						</button>
					</div>
				</SectionHeader>
			) : (
				<div className="text-center mt-4 flex justify-center gap-4">
					<button type="button" onClick={handleAdicionarSemestre} className="btn-primary">
						<Plus size={22} />
						Adicionar Semestre
					</button>
					<button type="button" onClick={handlePreencherAuto} className="btn-primary">
						<Sparkles size={20} fill="yellow" />
						Preencher automaticamente
					</button>
				</div>
			)}

			<div className="grid grid-cols-1 gap-8">
				{planejamento.map((semestre, index) => {
					const disciplinasDisponiveis = getDisciplinasDisponiveisParaSelecao(semestre, index);
					const conflitos = getConflitos(semestre);

					const emEdicao = semestreEmEdicao?.ano === semestre.ano && semestreEmEdicao?.semestre === semestre.semestre;

					return (
						<div
							key={`${semestre.ano}-${semestre.semestre}`}
							className="bg-card p-6 rounded-lg shadow-sm border border-border"
						>
							<div className="flex justify-between items-center mb-6">
								<h3 className="text-lg font-bold text-heading flex flex-col md:flex-row md:items-center gap-3">
									{semestre.ano}.{semestre.semestre}{" "}
									{emEdicao && (
										<span className="font-normal text-sm text-muted">Clique na disciplina para remover</span>
									)}
								</h3>
								{emEdicao ? (
									<span className="flex flex-col md:flex-row gap-7 items-center">
										<button
											type="button"
											onClick={() => handleRemoverSemestre(semestre.ano, semestre.semestre)}
											className="text-sm font-semibold text-red-600 hover:text-red-800"
										>
											Remover Semestre
										</button>
										<button
											type="button"
											onClick={concluirEdicao}
											className="text-sm font-semibold text-green-600 hover:text-green-800"
										>
											Concluir Edição
										</button>
									</span>
								) : (
									<button
										type="button"
										onClick={() => iniciarEdicao(semestre.ano, semestre.semestre)}
										className="text-sm font-semibold text-blue-600 hover:text-blue-800"
									>
										Editar
									</button>
								)}
							</div>

							<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
								{semestre.disciplinas.map((disciplinaId) => {
									const disciplina = DisciplinasTotais.find((d) => d.id === disciplinaId);
									const temConflito = conflitos.has(disciplinaId);
									const textColor = temConflito ? "text-title-conflito" : "text-title-disponivel";

									return (
										<div
											key={disciplinaId}
											onClick={emEdicao ? () => removerDisciplina(disciplinaId) : undefined}
											className="course-item bg-card text-foreground gap-1 p-3 rounded select-none relative"
										>
											<span className={`font-bold ${textColor}`}>{disciplina?.nome}</span>{" "}
											<span>{disciplina?.professor}</span>
											<span>{disciplina?.horarios?.map((h) => `${h.dia}: ${h.inicio} - ${h.fim}`).join(" e ")}</span>
										</div>
									);
								})}
								{semestre.disciplinas.length === 0 && (
									<p className="text-muted text-sm italic">Nenhuma disciplina adicionada.</p>
								)}
							</div>

							{emEdicao && (
								<div className="mt-4">
									<select
										value=""
										onChange={(e) => adicionarDisciplina(Number(e.target.value))}
										className="w-full border border-border rounded p-2 bg-card text-foreground"
									>
										<option value="" disabled>
											Adicionar disciplina...
										</option>
										{disciplinasDisponiveis.map((d) => (
											<option key={d.id} value={d.id}>
												{d.nome}
											</option>
										))}
									</select>
								</div>
							)}
						</div>
					);
				})}
			</div>

			<NovoSemestreModal
				open={criandoNovoSemestre}
				onClose={() => {
					setCriandoNovoSemestre(false);
				}}
			/>
		</div>
	);
}
