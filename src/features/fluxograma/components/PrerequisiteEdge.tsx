import { BaseEdge, type Edge, EdgeLabelRenderer, type EdgeProps, useReactFlow } from "@xyflow/react";
import type { MouseEvent, PointerEvent as ReactPointerEvent } from "react";
import type { EdgeWaypoint } from "@/features/fluxograma/data/manualEdgeRoutes";
import { BEND_INSET, LANE_SPACING } from "@/features/fluxograma/lib/buildFluxogramaGraph";
import { buildEdgePath, computeAutoBendPoints, insertWaypointNear } from "@/features/fluxograma/lib/edgePath";

export interface PrerequisiteEdgeData extends Record<string, unknown> {
	mode: "local" | "channel";
	exitLane: number;
	entryLane: number;
	railY: number;
	laneSpacing: number;
	bendInset: number;
	color: string;
	waypoints?: EdgeWaypoint[];
	editMode?: boolean;
	onWaypointsChange?: (edgeId: string, waypoints: EdgeWaypoint[]) => void;
}

type PrerequisiteFlowEdge = Edge<PrerequisiteEdgeData, "prerequisite">;

export default function PrerequisiteEdge({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
	style,
	markerEnd,
	data,
}: EdgeProps<PrerequisiteFlowEdge>) {
	const { screenToFlowPosition } = useReactFlow();
	const mode = data?.mode ?? "local";
	const exitLane = data?.exitLane ?? 0;
	const entryLane = data?.entryLane ?? 0;
	const railY = data?.railY ?? 0;
	const laneSpacing = data?.laneSpacing ?? LANE_SPACING;
	const bendInset = data?.bendInset ?? BEND_INSET;
	const color = data?.color ?? (typeof style?.stroke === "string" ? style.stroke : "#64748b");
	const editMode = data?.editMode === true;
	const onWaypointsChange = data?.onWaypointsChange;

	const params = { mode, exitLane, entryLane, railY, laneSpacing, bendInset };
	const waypoints =
		data?.waypoints && data.waypoints.length > 0
			? data.waypoints
			: editMode
				? computeAutoBendPoints(sourceX, sourceY, targetX, targetY, params)
				: undefined;

	const path = buildEdgePath(sourceX, sourceY, targetX, targetY, waypoints, params);

	const ensureWaypoints = (): EdgeWaypoint[] => {
		if (data?.waypoints && data.waypoints.length > 0) {
			return data.waypoints.map((p) => ({ ...p }));
		}
		return computeAutoBendPoints(sourceX, sourceY, targetX, targetY, params);
	};

	const handleDoubleClick = (event: MouseEvent<SVGPathElement>) => {
		if (!editMode || !onWaypointsChange) {
			return;
		}
		event.stopPropagation();
		const flow = screenToFlowPosition({ x: event.clientX, y: event.clientY });
		const current = ensureWaypoints();
		onWaypointsChange(id, insertWaypointNear(sourceX, sourceY, targetX, targetY, current, flow));
	};

	const startDrag = (index: number, event: ReactPointerEvent<HTMLButtonElement>) => {
		if (!editMode || !onWaypointsChange) {
			return;
		}
		event.preventDefault();
		event.stopPropagation();
		const target = event.currentTarget;
		target.setPointerCapture(event.pointerId);
		const working = ensureWaypoints();

		const onMove = (moveEvent: PointerEvent) => {
			const flow = screenToFlowPosition({ x: moveEvent.clientX, y: moveEvent.clientY });
			working[index] = { x: Math.round(flow.x), y: Math.round(flow.y) };
			onWaypointsChange(
				id,
				working.map((point) => ({ ...point })),
			);
		};

		const onUp = (upEvent: PointerEvent) => {
			target.releasePointerCapture(upEvent.pointerId);
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("pointerup", onUp);
		};

		window.addEventListener("pointermove", onMove);
		window.addEventListener("pointerup", onUp);
	};

	const removeWaypoint = (index: number, event: MouseEvent) => {
		if (!editMode || !onWaypointsChange) {
			return;
		}
		event.preventDefault();
		event.stopPropagation();
		const next = ensureWaypoints().filter((_, i) => i !== index);
		onWaypointsChange(id, next);
	};

	return (
		<>
			<BaseEdge id={id} path={path} style={{ ...style, stroke: color }} markerEnd={markerEnd} />
			{editMode && (
				<path
					d={path}
					fill="none"
					stroke="transparent"
					strokeWidth={24}
					className="react-flow__edge-interaction"
					onDoubleClick={handleDoubleClick}
				/>
			)}
			{editMode && waypoints && waypoints.length > 0 && (
				<EdgeLabelRenderer>
					{waypoints.map((point, index) => (
						<button
							key={`${id}-wp-${index}`}
							type="button"
							className="nodrag nopan absolute h-3.5 w-3.5 rounded-full border-2 border-white shadow cursor-grab active:cursor-grabbing"
							style={{
								transform: `translate(-50%, -50%) translate(${point.x}px, ${point.y}px)`,
								background: color,
								pointerEvents: "all",
								zIndex: 10,
							}}
							title="Arraste para mover. Clique direito para remover."
							aria-label={`Ponto de dobra ${index + 1}`}
							onPointerDown={(event) => startDrag(index, event)}
							onContextMenu={(event) => removeWaypoint(index, event)}
						/>
					))}
				</EdgeLabelRenderer>
			)}
		</>
	);
}
