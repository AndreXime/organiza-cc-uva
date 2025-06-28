import { Horario, Requisito } from './types';

export function formatPeriodo(periodo: string) {
    // extrai o número da string, ex: "periodo1" -> "1"
    const numero = periodo.replace(/\D/g, '');
    return `${numero}° Período`;
}

/* Representa horario da disciplina */
export const h = (...args: [Horario['dia'], string, string][]): Horario[] =>
    args.map(([dia, inicio, fim]) => ({ dia, inicio, fim }));

/* Representa o requisito da disciplina */
export const req = (...ids: number[]): Requisito[] => ids.map((id) => ({ id }));

/* Representa o objeto inteiro da disciplina */
export const disc = (id: number, nome: string, horarios?: Horario[], requisitos?: Requisito[]) => ({
    id,
    nome,
    ...(horarios && { horarios }),
    ...(requisitos && { requisitos }),
});
