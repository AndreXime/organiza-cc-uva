/// <reference types="jest" />

import { pruneDraftAgainstCommitted, waypointsEqual } from "./edgeRouteStore";

describe("edgeRouteStore", () => {
	it("compara waypoints por valor", () => {
		expect(waypointsEqual([{ x: 1, y: 2 }], [{ x: 1, y: 2 }])).toBe(true);
		expect(waypointsEqual([{ x: 1, y: 2 }], [{ x: 1, y: 3 }])).toBe(false);
	});

	it("remove do rascunho o que já está no manualEdgeRoutes", () => {
		const committed = {
			"e-1-2": [
				{ x: 10, y: 20 },
				{ x: 30, y: 20 },
			],
		};
		const draft = {
			"e-1-2": [
				{ x: 10, y: 20 },
				{ x: 30, y: 20 },
			],
			"e-3-4": [{ x: 1, y: 1 }],
		};
		expect(pruneDraftAgainstCommitted(draft, committed)).toEqual({
			"e-3-4": [{ x: 1, y: 1 }],
		});
	});
});
