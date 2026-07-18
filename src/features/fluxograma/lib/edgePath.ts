import type { EdgeWaypoint } from "@/features/fluxograma/data/manualEdgeRoutes";

export interface AutoRouteParams {
	mode: "local" | "channel";
	exitLane: number;
	entryLane: number;
	railY: number;
	laneSpacing: number;
	bendInset: number;
}

function resolveCorridorX(
	sourceX: number,
	targetX: number,
	exitLane: number,
	entryLane: number,
	bendInset: number,
	laneSpacing: number,
): { exitX: number; entryX: number } {
	let exitX = sourceX + bendInset + exitLane * laneSpacing;
	let entryX = targetX - bendInset - entryLane * laneSpacing;

	if (exitX >= entryX - laneSpacing) {
		const mid = (sourceX + targetX) / 2;
		exitX = mid - (exitLane + 1) * (laneSpacing / 2);
		entryX = mid + (entryLane + 1) * (laneSpacing / 2);
	}

	return { exitX, entryX };
}

/** Pontos intermediários do algoritmo (sem source/target). */
export function computeAutoBendPoints(
	sourceX: number,
	sourceY: number,
	targetX: number,
	targetY: number,
	params: AutoRouteParams,
): EdgeWaypoint[] {
	const { exitX, entryX } = resolveCorridorX(
		sourceX,
		targetX,
		params.exitLane,
		params.entryLane,
		params.bendInset,
		params.laneSpacing,
	);

	if (params.mode === "channel") {
		return [
			{ x: exitX, y: sourceY },
			{ x: exitX, y: params.railY },
			{ x: entryX, y: params.railY },
			{ x: entryX, y: targetY },
		];
	}

	return [
		{ x: exitX, y: sourceY },
		{ x: exitX, y: targetY },
		{ x: entryX, y: targetY },
	];
}

export function pathFromPoints(points: EdgeWaypoint[]): string {
	if (points.length === 0) {
		return "";
	}
	const [first, ...rest] = points;
	return [`M ${first.x} ${first.y}`, ...rest.map((p) => `L ${p.x} ${p.y}`)].join(" ");
}

export function buildEdgePath(
	sourceX: number,
	sourceY: number,
	targetX: number,
	targetY: number,
	waypoints: EdgeWaypoint[] | undefined,
	params: AutoRouteParams,
): string {
	if (waypoints && waypoints.length > 0) {
		return pathFromPoints([{ x: sourceX, y: sourceY }, ...waypoints, { x: targetX, y: targetY }]);
	}

	return pathFromPoints([
		{ x: sourceX, y: sourceY },
		...computeAutoBendPoints(sourceX, sourceY, targetX, targetY, params),
		{ x: targetX, y: targetY },
	]);
}

/** Insere waypoint no segmento mais próximo do clique. */
export function insertWaypointNear(
	sourceX: number,
	sourceY: number,
	targetX: number,
	targetY: number,
	waypoints: EdgeWaypoint[],
	click: EdgeWaypoint,
): EdgeWaypoint[] {
	const chain = [{ x: sourceX, y: sourceY }, ...waypoints, { x: targetX, y: targetY }];
	let bestSeg = 0;
	let bestDist = Number.POSITIVE_INFINITY;

	for (let i = 0; i < chain.length - 1; i++) {
		const a = chain[i];
		const b = chain[i + 1];
		const dist = pointToSegmentDistance(click, a, b);
		if (dist < bestDist) {
			bestDist = dist;
			bestSeg = i;
		}
	}

	const next = [...waypoints];
	next.splice(bestSeg, 0, { x: Math.round(click.x), y: Math.round(click.y) });
	return next;
}

function pointToSegmentDistance(p: EdgeWaypoint, a: EdgeWaypoint, b: EdgeWaypoint): number {
	const dx = b.x - a.x;
	const dy = b.y - a.y;
	const lenSq = dx * dx + dy * dy;
	if (lenSq === 0) {
		return Math.hypot(p.x - a.x, p.y - a.y);
	}
	let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq;
	t = Math.max(0, Math.min(1, t));
	return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}
