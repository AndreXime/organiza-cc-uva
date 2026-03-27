function validNumber(v: unknown): boolean {
	return v != null && v !== "" && !Number.isNaN(Number(v));
}

function validString(v: unknown): v is string {
	return typeof v === "string";
}

/** String não vazia (trim não exigido — colunas CSV costumam vir preenchidas). */
function validStringRequired(v: unknown): v is string {
	return typeof v === "string" && v.length > 0;
}

/** Não-string → ok (campo opcional). String vazia → ok. Com tokens, cada um dia+blocos A–S. */
function validHorario(v: unknown): boolean {
	if (!validString(v)) return true;
	if (!v.trim()) return true;
	return v
		.split(/\s+/)
		.filter(Boolean)
		.every((t) => /^[2-7][A-S]+$/.test(t.trim()));
}

/** Não-string / vazio → ok (opcional). String com IDs → cada parte numérica. */
function validRequisitos(v: unknown): boolean {
	if (!validString(v)) return true;
	if (!v.length) return true;
	return v.split(",").every((id) => !Number.isNaN(Number(id.trim())));
}

export function validarDisciplina(row: Record<string, unknown>) {
	const erros: string[] = [];

	if (!validNumber(row.id)) erros.push("Campo id inválido");
	if (!validNumber(row.carga_horaria)) erros.push("Campo carga_horaria inválido");
	if (!validStringRequired(row.nome)) erros.push("Campo nome inválido");
	if (!validStringRequired(row.periodo)) erros.push("Campo periodo inválido");
	if (!validString(row.professor)) erros.push("Campo professor inválido");
	if (!validHorario(row.horarios)) erros.push("Campo horarios inválido");

	const req = row.requisitos;
	if (!validRequisitos(req)) {
		erros.push("Campo requisitos inválido");
	}

	if (erros.length > 0) {
		throw new Error(`${erros.join("\n")}\nEm: ${JSON.stringify(row)}`);
	}

	return {
		id: String(row.id),
		nome: row.nome as string,
		periodo: row.periodo as string,
		professor: row.professor as string,
		carga_horaria: String(row.carga_horaria),
		horarios: validString(row.horarios) ? row.horarios : "",
		...(validString(req) && req.length > 0 ? { requisitos: req } : {}),
	};
}

export function validarEquivalenteRow(row: Record<string, unknown>) {
	const erros: string[] = [];

	if (!validStringRequired(row.Nome)) erros.push("Campo Nome inválido");
	if (!validStringRequired(row.Curso)) erros.push("Campo Curso inválido");
	if (!validStringRequired(row.Equivale)) erros.push("Campo Equivale inválido");
	if (!validStringRequired(row.Professor)) erros.push("Campo Professor inválido");
	if (!validHorario(row.Horario)) erros.push("Campo Horario inválido");

	if (erros.length > 0) {
		throw new Error(`${erros.join("\n")}\nEm: ${JSON.stringify(row)}`);
	}

	return {
		Nome: row.Nome as string,
		Curso: row.Curso as string,
		Horario: validString(row.Horario) ? row.Horario : "",
		Equivale: row.Equivale as string,
		Professor: row.Professor as string,
	};
}
