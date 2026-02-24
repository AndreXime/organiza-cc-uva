import { useDisciplinaStore } from "@/store/disciplinaStore";
import { useState } from "react";

export default function DisciplinaTable() {
	const DisciplinasTotais = useDisciplinaStore((state) => state.DisciplinasTotais);

	const [mostrarTudo, setMostrarTudo] = useState(false);

	const disciplinasVisiveis = mostrarTudo ? DisciplinasTotais : DisciplinasTotais.slice(0, 3);

	return (
		<>
			<h3 className="text-xl font-bold mb-4 text-heading border-b-2 border-border pb-2 flex flex-row items-center gap-3">
				Dados utilizados
				<button type="button" className="btn-primary" onClick={() => setMostrarTudo(!mostrarTudo)}>
					{mostrarTudo ? "Mostrar menos" : "Mostrar tudo"}
				</button>
			</h3>
			<div className="overflow-x-auto">
				<table className="min-w-full table-auto border-collapse border border-border text-foreground">
					<thead>
						<tr className="bg-accent">
							<th className="border border-border px-2 py-1 text-left text-sm font-semibold text-heading">ID</th>
							<th className="border border-border px-2 py-1 text-left text-sm font-semibold text-heading">Nome</th>
							<th className="border border-border px-2 py-1 text-left text-sm font-semibold text-heading">Período</th>
							<th className="border border-border px-2 py-1 text-left text-sm font-semibold text-heading">Horários</th>
							<th className="border border-border px-2 py-1 text-left text-sm font-semibold text-heading">Professor</th>
							<th className="border border-border px-2 py-1 text-left text-sm font-semibold text-heading">
								Carga Horaria
							</th>
							<th className="border border-border px-2 py-1 max-w-xs truncate text-left text-sm font-semibold text-heading">
								Requisitos
							</th>
						</tr>
					</thead>
					<tbody>
						{disciplinasVisiveis.map((d) => (
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
		</>
	);
}
