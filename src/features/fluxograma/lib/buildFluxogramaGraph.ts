import { isPeriodoRegular } from "./isPeriodoRegular";

/** Espaçamento entre lanes no corredor / slots no vão entre linhas */
export const LANE_SPACING = 14;
export const BEND_INSET = 32;
const COLUMN_WIDTH = 200;
const NODE_WIDTH = 180;
const NODE_HEIGHT = 72;
const HEADER_HEIGHT = 48;
const TOP_PADDING = 24;
const MIN_COLUMN_GAP = 180;
/** Vão entre linhas de cards: cabem trilhos horizontais sem atravessar nós */
const ROW_GAP = 56;

const GOLDEN_ANGLE = 137.508;

export interface FluxogramaNodeData extends Record<string, unknown> {
	label?: string;
	disciplinaId?: number;
	nome?: string;
	outDegree?: number;
	inDegree?: number;
	nodeHeight?: number;
}

export interface FluxogramaNode {
	id: string;
	type: "disciplina" | "periodoHeader";
	position: { x: number; y: number };
	data: FluxogramaNodeData;
	draggable: false;
	selectable?: boolean;
	zIndex?: number;
	style?: { width: number; height: number };
}

export type EdgeRouteMode = "local" | "channel";

export interface FluxogramaEdgeData extends Record<string, unknown> {
	mode: EdgeRouteMode;
	exitLane: number;
	entryLane: number;
	/** Só usado em mode=channel: Y no vão entre linhas de cards */
	railY: number;
	laneSpacing: number;
	bendInset: number;
	color: string;
}

export interface FluxogramaEdge {
	id: string;
	source: string;
	target: string;
	type: "prerequisite";
	sourceHandle?: string;
	targetHandle?: string;
	data: FluxogramaEdgeData;
	style?: { stroke: string; strokeWidth: number; opacity: number };
}

function periodoSortKey(periodo: string): number {
	const match = periodo.trim().match(/^(\d+)/);
	return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
}

export function edgeColorAt(index: number): string {
	const hue = (index * GOLDEN_ANGLE) % 360;
	return `hsl(${hue.toFixed(1)} 72% 42%)`;
}

function columnGapForLaneCount(laneCount: number): number {
	if (laneCount <= 0) {
		return MIN_COLUMN_GAP;
	}
	return Math.max(MIN_COLUMN_GAP, BEND_INSET * 2 + (laneCount - 1) * LANE_SPACING + 64);
}

/** Ys seguros entre cards (e uma faixa curta acima/abaixo do bloco) */
function buildRowChannels(maxRows: number, rowStride: number): number[] {
	const firstTop = TOP_PADDING + HEADER_HEIGHT;
	const channels: number[] = [];
	const slotsPerGap = Math.max(1, Math.floor(ROW_GAP / LANE_SPACING) - 1);

	channels.push(firstTop - LANE_SPACING);

	for (let row = 0; row < maxRows - 1; row++) {
		const gapTop = firstTop + row * rowStride + NODE_HEIGHT;
		for (let slot = 0; slot < slotsPerGap; slot++) {
			channels.push(gapTop + LANE_SPACING * (slot + 1));
		}
	}

	const lastBottom = firstTop + (maxRows - 1) * rowStride + NODE_HEIGHT;
	for (let slot = 0; slot < slotsPerGap; slot++) {
		channels.push(lastBottom + LANE_SPACING * (slot + 1));
	}

	return channels;
}

interface PendingEdge {
	id: string;
	source: string;
	target: string;
	sourceCol: number;
	targetCol: number;
	sourceRow: number;
	targetRow: number;
	sortY: number;
	sourceHandle: string;
	targetHandle: string;
}

export function buildFluxogramaGraph(disciplinas: Disciplina[]): {
	nodes: FluxogramaNode[];
	edges: FluxogramaEdge[];
} {
	const regulares = disciplinas.filter((d) => isPeriodoRegular(d.periodo));
	const idSet = new Set(regulares.map((d) => d.id));

	const porPeriodo = new Map<string, Disciplina[]>();
	for (const disciplina of regulares) {
		const lista = porPeriodo.get(disciplina.periodo);
		if (lista) {
			lista.push(disciplina);
		} else {
			porPeriodo.set(disciplina.periodo, [disciplina]);
		}
	}

	const periodosOrdenados = [...porPeriodo.keys()].sort((a, b) => periodoSortKey(a) - periodoSortKey(b));
	const periodoCol = new Map(periodosOrdenados.map((periodo, index) => [periodo, index]));
	const disciplinaById = new Map(regulares.map((d) => [d.id, d]));
	const rowIndexById = new Map<number, number>();

	let maxRows = 0;
	periodosOrdenados.forEach((periodo) => {
		const lista = porPeriodo.get(periodo) ?? [];
		maxRows = Math.max(maxRows, lista.length);
		lista.forEach((disciplina, rowIndex) => {
			rowIndexById.set(disciplina.id, rowIndex);
		});
	});

	const outDegree = new Map<number, number>();
	const inDegree = new Map<number, number>();

	for (const disciplina of regulares) {
		for (const req of disciplina.requisitos ?? []) {
			if (!idSet.has(req.id) || !idSet.has(disciplina.id)) {
				continue;
			}
			outDegree.set(req.id, (outDegree.get(req.id) ?? 0) + 1);
			inDegree.set(disciplina.id, (inDegree.get(disciplina.id) ?? 0) + 1);
		}
	}

	const rowStride = NODE_HEIGHT + ROW_GAP;
	const outCount = new Map<number, number>();
	const inCount = new Map<number, number>();
	const pending: PendingEdge[] = [];

	for (const disciplina of regulares) {
		for (const req of disciplina.requisitos ?? []) {
			if (!idSet.has(req.id) || !idSet.has(disciplina.id)) {
				continue;
			}

			const sourceDisc = disciplinaById.get(req.id);
			if (!sourceDisc) {
				continue;
			}

			const sourceCol = periodoCol.get(sourceDisc.periodo);
			const targetCol = periodoCol.get(disciplina.periodo);
			if (sourceCol === undefined || targetCol === undefined) {
				continue;
			}

			const outIndex = outCount.get(req.id) ?? 0;
			outCount.set(req.id, outIndex + 1);
			const inIndex = inCount.get(disciplina.id) ?? 0;
			inCount.set(disciplina.id, inIndex + 1);

			const sourceRow = rowIndexById.get(req.id) ?? 0;
			const targetRow = rowIndexById.get(disciplina.id) ?? 0;

			pending.push({
				id: `e-${req.id}-${disciplina.id}`,
				source: String(req.id),
				target: String(disciplina.id),
				sourceCol,
				targetCol,
				sourceRow,
				targetRow,
				sortY: (sourceRow + targetRow) / 2,
				sourceHandle: `out-${outIndex}`,
				targetHandle: `in-${inIndex}`,
			});
		}
	}

	const exitLaneById = new Map<string, number>();
	const entryLaneById = new Map<string, number>();
	const bySourceCol = new Map<number, PendingEdge[]>();
	const byTargetCol = new Map<number, PendingEdge[]>();

	for (const edge of pending) {
		const outGroup = bySourceCol.get(edge.sourceCol);
		if (outGroup) {
			outGroup.push(edge);
		} else {
			bySourceCol.set(edge.sourceCol, [edge]);
		}
		const inGroup = byTargetCol.get(edge.targetCol);
		if (inGroup) {
			inGroup.push(edge);
		} else {
			byTargetCol.set(edge.targetCol, [edge]);
		}
	}

	let maxLanes = 0;
	for (const group of bySourceCol.values()) {
		group.sort((a, b) => a.sortY - b.sortY || a.id.localeCompare(b.id));
		maxLanes = Math.max(maxLanes, group.length);
		group.forEach((edge, lane) => {
			exitLaneById.set(edge.id, lane);
		});
	}
	for (const group of byTargetCol.values()) {
		group.sort((a, b) => a.sortY - b.sortY || a.id.localeCompare(b.id));
		maxLanes = Math.max(maxLanes, group.length);
		group.forEach((edge, lane) => {
			entryLaneById.set(edge.id, lane);
		});
	}

	const columnGap = columnGapForLaneCount(maxLanes);
	const nodes: FluxogramaNode[] = [];

	periodosOrdenados.forEach((periodo, colIndex) => {
		const x = colIndex * (COLUMN_WIDTH + columnGap);
		nodes.push({
			id: `header-${periodo}`,
			type: "periodoHeader",
			position: { x, y: 0 },
			data: { label: periodo },
			draggable: false,
			selectable: false,
			zIndex: 2,
		});

		const lista = porPeriodo.get(periodo) ?? [];
		lista.forEach((disciplina, rowIndex) => {
			const outs = outDegree.get(disciplina.id) ?? 0;
			const ins = inDegree.get(disciplina.id) ?? 0;
			const y = TOP_PADDING + HEADER_HEIGHT + rowIndex * rowStride;
			nodes.push({
				id: String(disciplina.id),
				type: "disciplina",
				position: { x, y },
				data: {
					disciplinaId: disciplina.id,
					nome: disciplina.nome,
					outDegree: outs,
					inDegree: ins,
					nodeHeight: NODE_HEIGHT,
				},
				draggable: false,
				zIndex: 2,
				style: { width: NODE_WIDTH, height: NODE_HEIGHT },
			});
		});
	});

	const channels = buildRowChannels(Math.max(maxRows, 1), rowStride);
	const channelUsage = new Map<number, number>();
	const railYById = new Map<string, number>();

	const skipEdges = pending
		.filter((e) => e.targetCol - e.sourceCol > 1)
		.sort((a, b) => a.sortY - b.sortY || a.id.localeCompare(b.id));

	for (const edge of skipEdges) {
		const preferY = TOP_PADDING + HEADER_HEIGHT + ((edge.sourceRow + edge.targetRow) / 2) * rowStride + NODE_HEIGHT / 2;

		let bestIdx = 0;
		let bestScore = Number.POSITIVE_INFINITY;
		for (let i = 0; i < channels.length; i++) {
			const usage = channelUsage.get(i) ?? 0;
			const dist = Math.abs(channels[i] - preferY);
			const score = dist + usage * 40;
			if (score < bestScore) {
				bestScore = score;
				bestIdx = i;
			}
		}

		channelUsage.set(bestIdx, (channelUsage.get(bestIdx) ?? 0) + 1);
		railYById.set(edge.id, channels[bestIdx]);
	}

	const edges: FluxogramaEdge[] = pending.map((edge, index) => {
		const color = edgeColorAt(index);
		const isSkip = edge.targetCol - edge.sourceCol > 1;
		return {
			id: edge.id,
			source: edge.source,
			target: edge.target,
			sourceHandle: edge.sourceHandle,
			targetHandle: edge.targetHandle,
			type: "prerequisite" as const,
			data: {
				mode: isSkip ? "channel" : "local",
				exitLane: exitLaneById.get(edge.id) ?? 0,
				entryLane: entryLaneById.get(edge.id) ?? 0,
				railY: railYById.get(edge.id) ?? 0,
				laneSpacing: LANE_SPACING,
				bendInset: BEND_INSET,
				color,
			},
			style: {
				stroke: color,
				strokeWidth: 2,
				opacity: 0.92,
			},
		};
	});

	return { nodes, edges };
}
