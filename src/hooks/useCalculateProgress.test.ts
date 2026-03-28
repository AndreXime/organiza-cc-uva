/// <reference types="jest" />

import { act, renderHook } from "@testing-library/react";
import { useDisciplinaStore } from "@/store/disciplinaStore";
import { resetDisciplinaStoreForTests } from "@/test/resetDisciplinaStoreForTests";
import useCalculateProgress from "./useCalculateProgress";

const NUM_MAX_OPTATIVAS = 7;

function obr(id: number, periodo = "1° período"): Disciplina {
	return { id, nome: `Obr-${id}`, periodo, carga_horaria: 60 };
}

function opt(id: number): Disciplina {
	return { id, nome: `Opt-${id}`, periodo: "Optativa", carga_horaria: 30 };
}

function naoOfertada(id: number): Disciplina {
	return { id, nome: `NO-${id}`, periodo: "Não ofertadas", carga_horaria: 30 };
}

function setProgressState(totais: Disciplina[], feitas: ReadonlySet<number>): void {
	useDisciplinaStore.setState({
		DisciplinasTotais: totais,
		DisciplinasFeitas: new Set(feitas),
	});
}

describe("useCalculateProgress", () => {
	beforeEach(() => {
		resetDisciplinaStoreForTests();
	});

	it("com lista vazia: totalNecessario = só teto de optativas; nada feito => 0%", () => {
		act(() => setProgressState([], new Set()));

		const { result } = renderHook(() => useCalculateProgress());

		expect(result.current.totalNecessario).toBe(NUM_MAX_OPTATIVAS);
		expect(result.current.totalFeitas).toBe(0);
		expect(result.current.faltantes).toBe(NUM_MAX_OPTATIVAS);
		expect(result.current.percentage).toBe(0);
	});

	it("com lista vazia: ids feitos (órfãos) contam só no teto de optativas", () => {
		act(() => setProgressState([], new Set([1, 2, 3])));

		const { result } = renderHook(() => useCalculateProgress());

		expect(result.current.totalFeitas).toBe(3);
		expect(result.current.faltantes).toBe(NUM_MAX_OPTATIVAS - 3);
		expect(result.current.percentage).toBeCloseTo((3 / NUM_MAX_OPTATIVAS) * 100, 5);
	});

	it("com lista vazia: mais de 7 feitas órfãs => cap em 7 optativas e 100%", () => {
		act(() => setProgressState([], new Set([1, 2, 3, 4, 5, 6, 7, 8, 9])));

		const { result } = renderHook(() => useCalculateProgress());

		expect(result.current.totalFeitas).toBe(NUM_MAX_OPTATIVAS);
		expect(result.current.faltantes).toBe(0);
		expect(result.current.percentage).toBe(100);
	});

	it("exclui Optativa e Não ofertadas do conjunto obrigatório", () => {
		const totais = [obr(1), opt(2), naoOfertada(3), obr(4)];
		act(() => setProgressState(totais, new Set()));

		const { result } = renderHook(() => useCalculateProgress());

		expect(result.current.totalNecessario).toBe(2 + NUM_MAX_OPTATIVAS);
	});

	it("período arbitrário (ex.: estágio) conta como obrigatório", () => {
		const totais = [obr(1, "Estágio supervisionado")];
		act(() => setProgressState(totais, new Set()));

		const { result } = renderHook(() => useCalculateProgress());

		expect(result.current.totalNecessario).toBe(1 + NUM_MAX_OPTATIVAS);
	});

	it("só exclui período exatamente 'Optativa' (case-sensitive): 'optativa' conta como obrigatória", () => {
		const totais = [obr(1, "optativa")];
		act(() => setProgressState(totais, new Set()));

		const { result } = renderHook(() => useCalculateProgress());

		expect(result.current.totalNecessario).toBe(1 + NUM_MAX_OPTATIVAS);
	});

	it("só exclui 'Não ofertadas' exato: variação de caixa conta como obrigatória", () => {
		const totais = [obr(1, "não ofertadas")];
		act(() => setProgressState(totais, new Set()));

		const { result } = renderHook(() => useCalculateProgress());

		expect(result.current.totalNecessario).toBe(1 + NUM_MAX_OPTATIVAS);
	});

	it("100% com zero obrigatórias na lista e 7 feitas órfãs", () => {
		act(() => setProgressState([], new Set([1, 2, 3, 4, 5, 6, 7])));

		const { result } = renderHook(() => useCalculateProgress());

		expect(result.current.totalNecessario).toBe(NUM_MAX_OPTATIVAS);
		expect(result.current.totalFeitas).toBe(NUM_MAX_OPTATIVAS);
		expect(result.current.faltantes).toBe(0);
		expect(result.current.percentage).toBe(100);
	});

	it("só cursos optativos/não ofertados na lista => 0 obrigatórias, teto 7", () => {
		const totais = [opt(1), opt(2), naoOfertada(3)];
		act(() => setProgressState(totais, new Set([1, 2])));

		const { result } = renderHook(() => useCalculateProgress());

		expect(result.current.totalNecessario).toBe(NUM_MAX_OPTATIVAS);
		expect(result.current.totalFeitas).toBe(2);
		expect(result.current.faltantes).toBe(NUM_MAX_OPTATIVAS - 2);
	});

	it("nenhuma feita: faltantes = totalNecessario e porcentagem 0", () => {
		const totais = [obr(1), obr(2), obr(3)];
		act(() => setProgressState(totais, new Set()));

		const { result } = renderHook(() => useCalculateProgress());

		const need = 3 + NUM_MAX_OPTATIVAS;
		expect(result.current.totalNecessario).toBe(need);
		expect(result.current.totalFeitas).toBe(0);
		expect(result.current.faltantes).toBe(need);
		expect(result.current.percentage).toBe(0);
	});

	it("todas obrigatórias feitas, sem optativas contabilizadas", () => {
		const totais = [obr(1), obr(2), obr(3)];
		act(() => setProgressState(totais, new Set([1, 2, 3])));

		const { result } = renderHook(() => useCalculateProgress());

		const need = 3 + NUM_MAX_OPTATIVAS;
		expect(result.current.totalFeitas).toBe(3);
		expect(result.current.faltantes).toBe(NUM_MAX_OPTATIVAS);
		expect(result.current.percentage).toBeCloseTo((3 / need) * 100, 5);
	});

	it("obrigatórias feitas + optativas no limite: 100%", () => {
		const totais = [obr(1), obr(2), opt(10), opt(11), opt(12), opt(13), opt(14), opt(15), opt(16)];
		const feitas = new Set([1, 2, 10, 11, 12, 13, 14, 15, 16]);
		act(() => setProgressState(totais, feitas));

		const { result } = renderHook(() => useCalculateProgress());

		expect(result.current.totalNecessario).toBe(2 + NUM_MAX_OPTATIVAS);
		expect(result.current.totalFeitas).toBe(2 + NUM_MAX_OPTATIVAS);
		expect(result.current.faltantes).toBe(0);
		expect(result.current.percentage).toBe(100);
	});

	it("obrigatórias feitas + mais de 7 optativas feitas => só 7 entram no total", () => {
		const totais = [obr(1), opt(10), opt(11), opt(12), opt(13), opt(14), opt(15), opt(16), opt(17)];
		act(() => setProgressState(totais, new Set([1, 10, 11, 12, 13, 14, 15, 16, 17])));

		const { result } = renderHook(() => useCalculateProgress());

		expect(result.current.totalNecessario).toBe(1 + NUM_MAX_OPTATIVAS);
		expect(result.current.totalFeitas).toBe(1 + NUM_MAX_OPTATIVAS);
		expect(result.current.faltantes).toBe(0);
		expect(result.current.percentage).toBe(100);
	});

	it("mistura: parte das obrigatórias e parte das optativas", () => {
		const totais = [obr(1), obr(2), obr(3), opt(10), opt(11)];
		act(() => setProgressState(totais, new Set([1, 2, 10, 11])));

		const { result } = renderHook(() => useCalculateProgress());

		const need = 3 + NUM_MAX_OPTATIVAS;
		expect(result.current.totalFeitas).toBe(4);
		expect(result.current.faltantes).toBe(need - 4);
		expect(result.current.percentage).toBeCloseTo((4 / need) * 100, 5);
	});

	it("id feito que não existe em DisciplinasTotais conta como lado optativa (órfão)", () => {
		const totais = [obr(1)];
		act(() => setProgressState(totais, new Set([1, 999])));

		const { result } = renderHook(() => useCalculateProgress());

		const need = 1 + NUM_MAX_OPTATIVAS;
		expect(result.current.totalFeitas).toBe(2);
		expect(result.current.faltantes).toBe(need - 2);
	});

	it("marcar só optativa da lista não conta como obrigatória feita", () => {
		const totais = [obr(1), opt(2)];
		act(() => setProgressState(totais, new Set([2])));

		const { result } = renderHook(() => useCalculateProgress());

		const need = 1 + NUM_MAX_OPTATIVAS;
		expect(result.current.totalFeitas).toBe(1);
		expect(result.current.faltantes).toBe(need - 1);
	});

	it("atualiza quando DisciplinasTotais e DisciplinasFeitas mudam", () => {
		const { result } = renderHook(() => useCalculateProgress());

		expect(result.current.totalNecessario).toBe(NUM_MAX_OPTATIVAS);

		act(() => setProgressState([obr(1)], new Set([1])));

		expect(result.current.totalNecessario).toBe(1 + NUM_MAX_OPTATIVAS);
		expect(result.current.totalFeitas).toBe(1);
		expect(result.current.faltantes).toBe(NUM_MAX_OPTATIVAS);
		expect(result.current.faltantes).toBeGreaterThanOrEqual(0);
	});

	it("porcentagem limitada a 100 e faltantes não negativos no limite de optativas", () => {
		const totais = [obr(1)];
		act(() => setProgressState(totais, new Set([1, 10, 11, 12, 13, 14, 15, 16])));

		const { result } = renderHook(() => useCalculateProgress());

		expect(result.current.totalFeitas).toBe(1 + NUM_MAX_OPTATIVAS);
		expect(result.current.faltantes).toBe(0);
		expect(result.current.percentage).toBe(100);
	});
});
