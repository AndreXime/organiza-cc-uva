/** Períodos regulares: "1° Período", "9° Período", etc. */
export function isPeriodoRegular(periodo: string): boolean {
	return /^\d+[°º]\s*Per[ií]odo$/i.test(periodo.trim());
}
