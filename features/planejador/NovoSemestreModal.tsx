"use client";

import { useDisciplinaStore } from "@/store/disciplinaStore";
import { usePlanejadorStore } from "@/features/planejador/planejadorStore";

type NovoSemestreModalProps = {
	open: boolean;
	onClose: () => void;
};

export function NovoSemestreModal({ open, onClose }: NovoSemestreModalProps) {
	const { DisciplinasTotais } = useDisciplinaStore();
	const {
		planejamento,
		semestreEmEdicao,
		getDisciplinasDisponiveisParaSelecao,
		adicionarDisciplina,
		removerSemestre,
		concluirEdicao,
	} = usePlanejadorStore();

	if (!open || !semestreEmEdicao) return null;

	const semestreCriacao =
		planejamento.find(
			(p) => p.ano === semestreEmEdicao.ano && p.semestre === semestreEmEdicao.semestre,
		) ?? null;

	if (!semestreCriacao) return null;

	const indexSemestreCriacao = planejamento.findIndex(
		(p) => p.ano === semestreCriacao.ano && p.semestre === semestreCriacao.semestre,
	);

	const disciplinasSelecionadas = semestreCriacao.disciplinas
		.map((id) => DisciplinasTotais.find((d) => d.id === id))
		.filter((d): d is Disciplina => Boolean(d));

	const disciplinasDisponiveis =
		indexSemestreCriacao >= 0
			? getDisciplinasDisponiveisParaSelecao(semestreCriacao, indexSemestreCriacao)
			: [];

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div className="bg-card border border-border rounded-lg p-6 max-w-lg w-full mx-4">
				<h2 className="text-lg font-bold text-heading mb-2">
					Você está criando o período {semestreCriacao.ano}.{semestreCriacao.semestre}
				</h2>
				<p className="text-sm text-foreground mb-4">
					Selecione as disciplinas disponíveis para este semestre. Você poderá editar depois se precisar.
				</p>

				<div className="space-y-3 mb-4">
					{disciplinasSelecionadas.length > 0 ? (
						<ul className="space-y-1 text-sm">
							{disciplinasSelecionadas.map((disciplina) => (
								<li key={disciplina.id} className="flex items-center justify-between gap-2">
									<span>{disciplina.nome}</span>
								</li>
							))}
						</ul>
					) : (
						<p className="text-sm text-foreground">Nenhuma disciplina selecionada ainda.</p>
					)}
				</div>

				<div className="mt-2">
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

				<div className="mt-6 flex justify-end gap-4">
					<button
						type="button"
						onClick={() => {
							removerSemestre(semestreCriacao.ano, semestreCriacao.semestre);
							concluirEdicao();
							onClose();
						}}
						className="rounded-md bg-accent px-4 py-2 text-foreground transition hover:opacity-80"
					>
						Cancelar
					</button>

					<button
						type="button"
						onClick={() => {
							concluirEdicao();
							onClose();
						}}
						className="btn-primary"
					>
						Salvar semestre
					</button>
				</div>
			</div>
		</div>
	);
}

