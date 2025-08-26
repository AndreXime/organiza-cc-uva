import fs from 'fs';
import { parse } from 'csv-parse/sync';

function processCSV(): Disciplina[] {
    const conteudo = fs.readFileSync('./lib/disciplinas.csv', 'utf-8');
    const registros = parse(conteudo, {
        columns: true,
        skip_empty_lines: true,
    });

    return registros.map((row: any) => {
        validarDisciplina(row);
        const horarios = row.horarios
            ? row.horarios.split(';').map((h: string) => {
                  const [dia, intervalo] = h.trim().split(' ');
                  const [inicio, fim] = intervalo.split('-');
                  return { dia, inicio, fim };
              })
            : [];

        const requisitos = row.requisitos ? row.requisitos.split(',').map((id: string) => ({ id: Number(id) })) : [];

        return {
            id: Number(row.id),
            nome: row.nome,
            periodo: row.periodo,
            horarios: horarios.length ? horarios : undefined,
            requisitos: requisitos.length ? requisitos : undefined,
            carga_horaria: Number(row.carga_horaria),
            professor: row.professor,
        };
    });
}

function validarDisciplina(row: any) {
    if (!row.id || isNaN(Number(row.id))) {
        throw new Error(`Campo id inválido em:\n ${row}`);
    }
    if (!row.carga_horaria || isNaN(Number(row.carga_horaria))) {
        throw new Error(`Campo carga_horaria inválido em:\n ${row}`);
    }
    if (typeof row.nome !== 'string') {
        throw new Error(`Campo nome inválido em:\n ${row}`);
    }
    if (typeof row.periodo !== 'string') {
        throw new Error(`Campo periodo inválido em:\n ${row}`);
    }
    if (typeof row.professor !== 'string') {
        throw new Error(`Campo professor inválido em:\n ${row}`);
    }

    if (
        row.horarios &&
        !row.horarios
            .split(';')
            .every((h: string) =>
                /^(Segunda|Terça|Quarta|Quinta|Sexta|Sábado|Domingo) \d{2}:\d{2}-\d{2}:\d{2}$/.test(h.trim())
            )
    )
        throw new Error(`Campo horario inválido em:\n ${row}`);

    if (row.requisitos && !row.requisitos.split(',').every((r: string) => !isNaN(Number(r))))
        throw new Error(`Campo requisitos inválido em:\n ${row}`);
}

export default processCSV();
