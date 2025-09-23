import fs from 'fs';
import { parse } from 'csv-parse/sync';

export function processDisciplinas(csvPath: string): Disciplina[] {
    const conteudo = fs.readFileSync(csvPath, 'utf-8');
    const registros = parse(conteudo, {
        columns: true,
        skip_empty_lines: true,
    });

    return registros
        .map((row: any) => {
            validarDisciplina(row); // Throw error se invalido
            const horarios = parseHorarios(row.horarios);

            const requisitos = row.requisitos
                ? row.requisitos.split(',').map((id: string) => ({ id: Number(id) }))
                : [];

            return {
                id: Number(row.id),
                nome: row.nome,
                periodo: row.periodo,
                horarios: horarios.length ? horarios : undefined,
                requisitos: requisitos.length ? requisitos : undefined,
                carga_horaria: Number(row.carga_horaria),
                professor: row.professor,
            };
        })
        .toSorted((a, b) => a.id - b.id);
}

export function processEquivalentes(csvPath: string, Disciplinas: Disciplina[]): Equivalente[] {
    const conteudo = fs.readFileSync(csvPath, 'utf-8');
    const registros = parse(conteudo, {
        columns: true,
        skip_empty_lines: true,
    });

    return registros.map((row: any) => {
        const horarios = parseHorarios(row.Horario);
        const originalId = searchDisciplinaId(row.Equivale, Disciplinas);

        return {
            nome: row.Nome,
            curso: row.Curso,
            horarios: horarios.length ? horarios : undefined,
            equivaleId: originalId,
            equivaleNome: row.Equivale,
            professor: row.Professor,
        };
    });
}

// Formato de horarios da faculdade
const horarios: Record<string, { inicio: string; fim: string }> = {
    A: { inicio: '07:10', fim: '08:00' },
    B: { inicio: '08:00', fim: '08:50' },
    C: { inicio: '08:50', fim: '09:40' },
    D: { inicio: '09:50', fim: '10:40' },
    E: { inicio: '10:40', fim: '11:30' },
    F: { inicio: '11:30', fim: '12:10' },
    G: { inicio: '12:20', fim: '13:10' },
    H: { inicio: '13:10', fim: '14:00' },
    I: { inicio: '14:00', fim: '14:50' },
    J: { inicio: '14:50', fim: '15:40' },
    K: { inicio: '15:50', fim: '16:40' },
    L: { inicio: '16:40', fim: '17:30' },
    M: { inicio: '17:30', fim: '18:20' },
    N: { inicio: '18:30', fim: '19:20' },
    O: { inicio: '19:20', fim: '20:10' },
    P: { inicio: '20:20', fim: '21:10' },
    Q: { inicio: '21:10', fim: '22:00' },
    R: { inicio: '22:00', fim: '22:50' },
    S: { inicio: '22:50', fim: '23:40' },
};

const dias: Record<string, string> = {
    '2': 'Segunda',
    '3': 'Terça',
    '4': 'Quarta',
    '5': 'Quinta',
    '6': 'Sexta',
    '7': 'Sábado',
};

function parseHorarios(codigos: string) {
    if (!codigos.trim()) return [];

    return codigos
        .split(/\s+/) // quebra por um ou mais espaços
        .filter(Boolean)
        .map((codigo) => {
            const dia = dias[codigo[0]];
            const blocos = codigo.slice(1).split('');
            const primeiro = horarios[blocos[0]];
            const ultimo = horarios[blocos[blocos.length - 1]];

            return { dia, inicio: primeiro.inicio, fim: ultimo.fim } as Horario;
        });
}

function validarDisciplina(row: any) {
    const erros: string[] = [];

    if (!row.id || isNaN(Number(row.id))) {
        erros.push('Campo id inválido');
    }
    if (!row.carga_horaria || isNaN(Number(row.carga_horaria))) {
        erros.push('Campo carga_horaria inválido');
    }
    if (typeof row.nome !== 'string') {
        erros.push('Campo nome inválido');
    }
    if (typeof row.periodo !== 'string') {
        erros.push('Campo periodo inválido');
    }
    if (typeof row.professor !== 'string') {
        erros.push('Campo professor inválido');
    }
    if (row.requisitos && !row.requisitos.split(',').every((r: string) => !isNaN(Number(r)))) {
        erros.push('Campo requisitos inválido');
    }
    if (
        row.horarios &&
        !row.horarios
            .split(/\s+/) // quebra por um ou mais espaços
            .filter(Boolean)
            .every((h: string) => /^[2-7][A-S]+$/.test(h.trim()))
    ) {
        erros.push('Campo horarios inválido');
    }

    if (erros.length > 0) {
        throw new Error(erros.join('\n') + `\nEm: ${JSON.stringify(row)}`);
    }
}

function searchDisciplinaId(name: string, Disciplina: Disciplina[]): number {
    const DisciplinaEncontrada = Disciplina.find((disc) => disc.nome == name);
    if (!DisciplinaEncontrada) {
        throw new Error('Nenhuma disciplina com o nome: ' + name);
    }
    return DisciplinaEncontrada.id;
}
