/**
 * Recebe a key string do objeto da disciplina e devolve formartado
 * Exemplo: "periodo1" -> "1° Periodo"
 */
export function formatPeriodo(periodo: string) {
    const numero = periodo.replace(/\D/g, '');
    return `${numero}° Período`;
}
