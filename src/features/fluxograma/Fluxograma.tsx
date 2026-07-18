import { Background, Controls, type Edge, MarkerType, type Node, ReactFlow, ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ArrowLeft, Copy, Pencil, RotateCcw, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import SectionHeader from "@/components/SectionHeader";
import DisciplinaNode from "@/features/fluxograma/components/DisciplinaNode";
import PeriodoHeaderNode from "@/features/fluxograma/components/PeriodoHeaderNode";
import PrerequisiteEdge from "@/features/fluxograma/components/PrerequisiteEdge";
import { type EdgeWaypoint, manualEdgeRoutes } from "@/features/fluxograma/data/manualEdgeRoutes";
import {
	clearDraftEdgeRoutes,
	loadDraftEdgeRoutes,
	pruneDraftAgainstCommitted,
	routesToJson,
	saveDraftEdgeRoutes,
	waypointsEqual,
} from "@/features/fluxograma/edgeRouteStore";
import { buildFluxogramaGraph, type FluxogramaNodeData } from "@/features/fluxograma/lib/buildFluxogramaGraph";
import { useDisciplinaStore } from "@/store/disciplinaStore";
import { useUIStore } from "@/store/uiStore";

const nodeTypes = {
	disciplina: DisciplinaNode,
	periodoHeader: PeriodoHeaderNode,
};

const edgeTypes = {
	prerequisite: PrerequisiteEdge,
};

type FluxogramaFlowNode = Node<FluxogramaNodeData, "disciplina" | "periodoHeader">;

function mergeRouteMaps(
	committed: Record<string, EdgeWaypoint[]>,
	draft: Record<string, EdgeWaypoint[]>,
): Record<string, EdgeWaypoint[]> {
	return { ...committed, ...draft };
}

function FluxogramaCanvas() {
	const disciplinas = useDisciplinaStore((s) => s.DisciplinasTotais);
	const setTab = useUIStore((s) => s.setTab);
	const mode = useUIStore((s) => s.mode);

	const [editMode, setEditMode] = useState(false);
	const [draftRoutes, setDraftRoutes] = useState<Record<string, EdgeWaypoint[]>>(() =>
		pruneDraftAgainstCommitted(loadDraftEdgeRoutes(), manualEdgeRoutes),
	);
	const [exportText, setExportText] = useState<string | null>(null);
	const [copyStatus, setCopyStatus] = useState<string | null>(null);

	const graph = useMemo(() => buildFluxogramaGraph(disciplinas), [disciplinas]);
	const nodes = useMemo(() => graph.nodes as FluxogramaFlowNode[], [graph.nodes]);

	const activeRoutes = useMemo(() => mergeRouteMaps(manualEdgeRoutes, draftRoutes), [draftRoutes]);

	useEffect(() => {
		const timer = window.setTimeout(() => {
			saveDraftEdgeRoutes(draftRoutes);
		}, 300);
		return () => window.clearTimeout(timer);
	}, [draftRoutes]);

	const onWaypointsChange = useCallback((edgeId: string, waypoints: EdgeWaypoint[]) => {
		setDraftRoutes((prev) => {
			const next = { ...prev };
			const committed = manualEdgeRoutes[edgeId];
			if (waypoints.length === 0 || (committed && waypointsEqual(waypoints, committed))) {
				delete next[edgeId];
				return next;
			}
			next[edgeId] = waypoints;
			return next;
		});
	}, []);

	const edges = useMemo(
		() =>
			graph.edges.map((e): Edge => {
				const color = typeof e.style?.stroke === "string" ? e.style.stroke : "#64748b";
				return {
					id: e.id,
					source: e.source,
					target: e.target,
					sourceHandle: e.sourceHandle,
					targetHandle: e.targetHandle,
					type: "prerequisite",
					data: {
						...e.data,
						waypoints: activeRoutes[e.id],
						editMode,
						onWaypointsChange,
					},
					style: e.style,
					markerEnd: {
						type: MarkerType.ArrowClosed,
						width: 16,
						height: 16,
						color,
					},
				};
			}),
		[graph.edges, activeRoutes, editMode, onWaypointsChange],
	);

	const openExport = () => {
		setExportText(routesToJson(draftRoutes));
		setCopyStatus(null);
	};

	const copyExport = async () => {
		if (!exportText) {
			return;
		}
		try {
			await navigator.clipboard.writeText(exportText);
			setCopyStatus("Copiado");
		} catch {
			setCopyStatus("Selecione o texto e copie manualmente");
		}
	};

	const clearDrafts = () => {
		clearDraftEdgeRoutes();
		setDraftRoutes({});
		setExportText(null);
		setCopyStatus(null);
	};

	const draftCount = Object.keys(draftRoutes).length;

	const toggleEditMode = () => {
		if (editMode) {
			setExportText(null);
			setCopyStatus(null);
		}
		setEditMode((v) => !v);
	};

	const actionButtons = (
		<p className="flex flex-wrap flex-row gap-4 items-center justify-center">
			<button type="button" className="btn-primary" onClick={() => setTab("gerenciador")}>
				<ArrowLeft size={20} /> Voltar ao Gerenciador
			</button>
			<button type="button" className={editMode ? "btn-primary" : "btn-primary opacity-80"} onClick={toggleEditMode}>
				<Pencil size={18} /> {editMode ? "Sair do modo edição" : "Modo edição"}
			</button>
			{editMode && (
				<>
					<button type="button" className="btn-primary" onClick={openExport} disabled={draftCount === 0}>
						Exportar JSON
					</button>
					<button type="button" className="btn-primary opacity-80" onClick={clearDrafts} disabled={draftCount === 0}>
						<RotateCcw size={18} /> Limpar rascunho ({draftCount})
					</button>
				</>
			)}
		</p>
	);

	return (
		<div className="flex flex-col gap-4 mt-10">
			{mode !== "minimal" ? (
				<SectionHeader title="Fluxograma do curso">
					<p>
						Visualize os períodos regulares e as relações de pré-requisito.{" "}
						<span className="font-bold text-green-600">Verde</span> concluída,{" "}
						<span className="font-bold text-blue-600">azul</span> disponível e opaco bloqueada. Arraste o fundo para
						navegar. No celular use pinça com dois dedos para zoom, no computador use scroll ou os botões +/− no canto
						do quadro do fluxograma.
					</p>
					{editMode && (
						<p>
							Arraste os pontos coloridos. Duplo clique na linha para adicionar ponto. Clique direito no ponto para
							remover. O rascunho fica no localStorage até você exportar.
						</p>
					)}
					{actionButtons}
				</SectionHeader>
			) : (
				<div className="flex flex-wrap gap-4 items-center justify-center my-4">{actionButtons}</div>
			)}

			{editMode && exportText !== null && (
				<div className="rounded-xl border border-border bg-card p-3 flex flex-col gap-2">
					<div className="flex flex-wrap items-center gap-4">
						<span className="text-sm font-medium text-heading">JSON com coordenadas das arestas</span>
						<button type="button" className="btn-primary" onClick={() => void copyExport()}>
							<Copy size={16} /> Copiar
						</button>
						<button type="button" className="btn-primary opacity-80" onClick={() => setExportText(null)}>
							<X size={16} /> Fechar
						</button>
						{copyStatus && <span className="text-sm text-muted-foreground">{copyStatus}</span>}
					</div>
					<textarea
						className="w-full min-h-40 rounded-lg border border-border bg-background p-2 font-mono text-xs text-foreground"
						value={exportText}
						readOnly
						spellCheck={false}
					/>
				</div>
			)}

			<div className="h-[min(80vh,900px)] w-full rounded-xl border border-border overflow-hidden bg-background">
				<ReactFlow
					nodes={nodes}
					edges={edges}
					nodeTypes={nodeTypes}
					edgeTypes={edgeTypes}
					fitView
					fitViewOptions={{ padding: 0.2 }}
					nodesDraggable={false}
					nodesConnectable={false}
					elementsSelectable={editMode}
					edgesFocusable={editMode}
					panOnDrag
					zoomOnPinch
					zoomOnScroll
					panOnScroll={false}
					minZoom={0.05}
					maxZoom={1.5}
					proOptions={{ hideAttribution: true }}
				>
					<Background gap={20} size={1} />
					<Controls showInteractive={false} />
				</ReactFlow>
			</div>
		</div>
	);
}

export default function Fluxograma() {
	return (
		<ReactFlowProvider>
			<FluxogramaCanvas />
		</ReactFlowProvider>
	);
}
