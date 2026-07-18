/// <reference types="jest" />

import { buildFluxogramaGraph, edgeColorAt, LANE_SPACING } from "./buildFluxogramaGraph";
import { isPeriodoRegular } from "./isPeriodoRegular";

describe("isPeriodoRegular", () => {
	it("aceita períodos numerados", () => {
		expect(isPeriodoRegular("1° Período")).toBe(true);
		expect(isPeriodoRegular("9° Período")).toBe(true);
	});

	it("rejeita Optativa e Não ofertadas", () => {
		expect(isPeriodoRegular("Optativa")).toBe(false);
		expect(isPeriodoRegular("Não ofertadas")).toBe(false);
	});
});

describe("edgeColorAt", () => {
	it("gera cores HSL distintas para índices seguidos", () => {
		const a = edgeColorAt(0);
		const b = edgeColorAt(1);
		expect(a).toMatch(/^hsl\(/);
		expect(a).not.toBe(b);
	});
});

describe("buildFluxogramaGraph", () => {
	const sample: Disciplina[] = [
		{ id: 1, nome: "LP", periodo: "1° Período", carga_horaria: 60 },
		{ id: 2, nome: "Calc", periodo: "1° Período", carga_horaria: 80 },
		{ id: 3, nome: "MD", periodo: "2° Período", carga_horaria: 80, requisitos: [{ id: 1 }] },
		{ id: 4, nome: "Opt", periodo: "Optativa", carga_horaria: 60, requisitos: [{ id: 3 }] },
	];

	it("gera nodes só de períodos regulares + headers", () => {
		const { nodes } = buildFluxogramaGraph(sample);
		const disciplinaIds = nodes.filter((n) => n.type === "disciplina").map((n) => n.id);
		expect(disciplinaIds).toEqual(["1", "2", "3"]);
		expect(nodes.some((n) => n.type === "periodoHeader")).toBe(true);
		expect(nodes.every((n) => n.id !== "4")).toBe(true);
	});

	it("usa rota local entre períodos vizinhos", () => {
		const { edges } = buildFluxogramaGraph(sample);
		expect(edges).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					source: "1",
					target: "3",
					type: "prerequisite",
					data: expect.objectContaining({
						mode: "local",
						color: expect.stringMatching(/^hsl\(/),
						laneSpacing: LANE_SPACING,
					}),
				}),
			]),
		);
		expect(edges.every((e) => e.target !== "4" && e.source !== "4")).toBe(true);
	});

	it("usa canal entre linhas quando pula períodos", () => {
		const skipSample: Disciplina[] = [
			{ id: 1, nome: "A", periodo: "1° Período", carga_horaria: 60 },
			{ id: 2, nome: "B", periodo: "2° Período", carga_horaria: 60 },
			{ id: 3, nome: "C", periodo: "3° Período", carga_horaria: 60, requisitos: [{ id: 1 }] },
		];
		const { edges } = buildFluxogramaGraph(skipSample);
		const skip = edges.find((e) => e.source === "1" && e.target === "3");
		expect(skip?.data.mode).toBe("channel");
		expect(skip?.data.railY).toBeGreaterThan(0);
	});

	it("coloca períodos em colunas distintas (x crescente)", () => {
		const { nodes } = buildFluxogramaGraph(sample);
		const n1 = nodes.find((n) => n.id === "1");
		const n3 = nodes.find((n) => n.id === "3");
		expect(n1 && n3 && n3.position.x > n1.position.x).toBe(true);
	});

	it("atribui stroke diferente para cada edge", () => {
		const sampleComVariasSaidas: Disciplina[] = [
			{ id: 1, nome: "A", periodo: "1° Período", carga_horaria: 60 },
			{ id: 2, nome: "B", periodo: "1° Período", carga_horaria: 60 },
			{ id: 3, nome: "C", periodo: "2° Período", carga_horaria: 60, requisitos: [{ id: 1 }] },
			{ id: 4, nome: "D", periodo: "2° Período", carga_horaria: 60, requisitos: [{ id: 1 }] },
			{ id: 5, nome: "E", periodo: "3° Período", carga_horaria: 60, requisitos: [{ id: 2 }] },
		];
		const { edges } = buildFluxogramaGraph(sampleComVariasSaidas);
		const strokes = edges.map((e) => e.style?.stroke);
		expect(new Set(strokes).size).toBe(strokes.length);
	});
});
