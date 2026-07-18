/// <reference types="jest" />

import { computeAutoBendPoints, insertWaypointNear, pathFromPoints } from "./edgePath";

describe("edgePath", () => {
	it("monta path SVG a partir dos pontos", () => {
		expect(
			pathFromPoints([
				{ x: 0, y: 0 },
				{ x: 10, y: 0 },
				{ x: 10, y: 5 },
			]),
		).toBe("M 0 0 L 10 0 L 10 5");
	});

	it("gera dobras locais sem rail", () => {
		const bends = computeAutoBendPoints(0, 10, 100, 50, {
			mode: "local",
			exitLane: 0,
			entryLane: 0,
			railY: 0,
			laneSpacing: 14,
			bendInset: 32,
		});
		expect(bends.length).toBe(3);
		expect(bends[0].y).toBe(10);
		expect(bends[2].y).toBe(50);
	});

	it("insere waypoint no segmento mais próximo", () => {
		const next = insertWaypointNear(0, 0, 100, 0, [{ x: 50, y: 0 }], { x: 25, y: 2 });
		expect(next).toHaveLength(2);
		expect(next[0]).toEqual({ x: 25, y: 2 });
	});
});
