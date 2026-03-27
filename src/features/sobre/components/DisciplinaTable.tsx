import { useDisciplinaStore } from "@/store/disciplinaStore";
import { useState } from "react";

export default function DisciplinaTable() {
	const DisciplinasTotais = useDisciplinaStore((state) => state.DisciplinasTotais);

	const [exibirTabela, setExibirTabela] = useState(false);

	return (
		<section className="rounded-lg border border-border bg-card overflow-hidden">
			<div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
				<div>
					<h3 className="text-lg font-semibold text-heading">Dados utilizados</h3>
					<p className="mt-0.5 text-sm text-muted-foreground">
						Tabela com disciplinas, períodos, horários e requisitos do curso.
					</p>
				</div>
				<button
					type="button"
					className="btn-primary w-full shrink-0 lg:w-auto"
					onClick={() => setExibirTabela(!exibirTabela)}
				>
					{exibirTabela ? "Ocultar dados" : "Mostrar dados"}
				</button>
			</div>
			{exibirTabela && (
				<div className="border-t border-border overflow-x-auto">
					<table className="min-w-full table-auto border-collapse text-foreground">
						<thead>
							<tr className="bg-accent">
								<th className="border border-border px-2 py-1 text-left text-sm font-semibold text-heading">ID</th>
								<th className="border border-border px-2 py-1 text-left text-sm font-semibold text-heading">Nome</th>
								<th className="border border-border px-2 py-1 text-left text-sm font-semibold text-heading">Período</th>
								<th className="border border-border px-2 py-1 text-left text-sm font-semibold text-heading">
									Horários
								</th>
								<th className="border border-border px-2 py-1 text-left text-sm font-semibold text-heading">
									Professor
								</th>
								<th className="border border-border px-2 py-1 text-left text-sm font-semibold text-heading">
									Carga Horaria
								</th>
								<th className="border border-border px-2 py-1 max-w-xs truncate text-left text-sm font-semibold text-heading">
									Requisitos
								</th>
							</tr>
						</thead>
						<tbody>
							{DisciplinasTotais.map((d) => (
								<tr key={d.id} className="even:bg-card odd:bg-background">
									<td className="border border-border px-2 py-1 text-sm">{d.id}</td>
									<td className="border border-border px-2 py-1 text-sm">{d.nome}</td>
									<td className="border border-border px-2 py-1 text-sm">{d.periodo}</td>
									<td className="border border-border px-2 py-1 text-sm">
										{d.horarios ? d.horarios.map((h) => `${h.dia} ${h.inicio}-${h.fim}`).join("; ") : "–"}
									</td>
									<td className="border border-border px-2 py-1 text-sm">{d.professor}</td>
									<td className="border border-border px-2 py-1 text-sm">{d.carga_horaria}</td>
									<td className="border border-border px-2 py-1 max-w-xs break-words text-sm">
										{d.requisitos
											? d.requisitos.map((r) => DisciplinasTotais.find((disc) => disc.id === r.id)?.nome).join(", ")
											: "–"}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</section>
	);
}
