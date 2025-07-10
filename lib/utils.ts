import { Horario, Requisito } from './types';
/**
 * Recebe a key string do objeto da disciplina e devolve formartado
 * Exemplo: "periodo1" -> "1° Periodo"
 */
export function formatPeriodo(periodo: string) {
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
