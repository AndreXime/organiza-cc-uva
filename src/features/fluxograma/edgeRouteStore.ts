import type { EdgeWaypoint } from "@/features/fluxograma/data/manualEdgeRoutes";

const STORAGE_KEY = "fluxograma-edge-routes-draft-v1";

export function waypointsEqual(a: EdgeWaypoint[], b: EdgeWaypoint[]): boolean {
	if (a.length !== b.length) {
		return false;
	}
	return a.every((point, index) => point.x === b[index].x && point.y === b[index].y);
}

/** Remove do rascunho o que já está igual ao manualEdgeRoutes commitado. */
export function pruneDraftAgainstCommitted(
	draft: Record<string, EdgeWaypoint[]>,
	committed: Record<string, EdgeWaypoint[]>,
): Record<string, EdgeWaypoint[]> {
	const next: Record<string, EdgeWaypoint[]> = {};
	for (const [id, points] of Object.entries(draft)) {
		const base = committed[id];
		if (base && waypointsEqual(points, base)) {
			continue;
		}
		next[id] = points;
	}
	return next;
}

export function loadDraftEdgeRoutes(): Record<string, EdgeWaypoint[]> {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) {
			return {};
		}
		const parsed: unknown = JSON.parse(raw);
		if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
			return {};
		}
		const result: Record<string, EdgeWaypoint[]> = {};
		for (const [id, value] of Object.entries(parsed)) {
			if (!Array.isArray(value)) {
				continue;
			}
			const points = value.filter(
				(p): p is EdgeWaypoint =>
					typeof p === "object" &&
					p !== null &&
					typeof (p as EdgeWaypoint).x === "number" &&
					typeof (p as EdgeWaypoint).y === "number",
			);
			if (points.length > 0) {
				result[id] = points;
			}
		}
		return result;
	} catch {
		return {};
	}
}

export function saveDraftEdgeRoutes(routes: Record<string, EdgeWaypoint[]>): void {
	if (Object.keys(routes).length === 0) {
		localStorage.removeItem(STORAGE_KEY);
		return;
	}
	localStorage.setItem(STORAGE_KEY, JSON.stringify(routes));
}

export function clearDraftEdgeRoutes(): void {
	localStorage.removeItem(STORAGE_KEY);
}

export function routesToJson(routes: Record<string, EdgeWaypoint[]>): string {
	const rounded: Record<string, EdgeWaypoint[]> = {};
	for (const [id, points] of Object.entries(routes)) {
		rounded[id] = points.map((point) => ({
			x: Math.round(point.x),
			y: Math.round(point.y),
		}));
	}
	return `${JSON.stringify(rounded, null, 2)}\n`;
}
