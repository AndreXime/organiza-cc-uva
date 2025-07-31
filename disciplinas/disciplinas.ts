import fs from 'fs';
import { parse } from 'csv-parse/sync';

function processCSV(): Disciplina[] {
    const conteudo = fs.readFileSync('./disciplinas/disciplinas.csv', 'utf-8');
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
        };
    });
}

function validarDisciplina(row: any) {
    if (!row.id || isNaN(Number(row.id))) {
        throw new Error(`Campo "id" inválido: ${row.id}`);
    }
    if (!row.nome || typeof row.nome !== 'string') {
        throw new Error(`Campo "nome" inválido: ${row.nome}`);
    }
    if (!row.periodo || typeof row.periodo !== 'string') {
        throw new Error(`Campo "periodo" inválido: ${row.periodo}`);
    }

    if (row.horarios) {
        const horarios = row.horarios.split(';');
        for (const h of horarios) {
            const partes = h.trim().split(' ');
            if (partes.length !== 2) {
                throw new Error(`Formato de horário inválido: ${h}`);
            }
            const [dia, intervalo] = partes;
            if (!dia.match(/^(Segunda|Terça|Quarta|Quinta|Sexta|Sábado|Domingo)$/)) {
                throw new Error(`Dia da semana inválido: ${dia}`);
            }
            if (!intervalo.match(/^\d{2}:\d{2}-\d{2}:\d{2}$/)) {
                throw new Error(`Intervalo de horário inválido: ${intervalo}`);
            }
        }
    }

    if (row.requisitos) {
        const reqs = row.requisitos.split(',');
        for (const r of reqs) {
            if (isNaN(Number(r))) {
                throw new Error(`Requisito inválido: ${r}`);
            }
        }
    }
}

export default processCSV();
