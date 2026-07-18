import { Handle, type Node, type NodeProps, Position } from "@xyflow/react";
import { useDisciplinaStore } from "@/store/disciplinaStore";
import type { FluxogramaNodeData } from "../lib/buildFluxogramaGraph";

const HANDLE_BASE = { width: 6, height: 6, opacity: 0 };

type DisciplinaFlowNode = Node<FluxogramaNodeData, "disciplina">;

function handleTops(count: number): number[] {
	if (count <= 1) {
		return [50];
	}
	const start = 18;
	const end = 82;
	return Array.from({ length: count }, (_, index) => start + ((end - start) * index) / (count - 1));
}

export default function DisciplinaNode({ data }: NodeProps<DisciplinaFlowNode>) {
	const disciplinaId = data.disciplinaId;
	const nome = data.nome ?? "";
	const outDegree = Math.max(data.outDegree ?? 1, 1);
	const inDegree = Math.max(data.inDegree ?? 1, 1);

	const feitas = useDisciplinaStore((s) => s.DisciplinasFeitas);
	const disponiveis = useDisciplinaStore((s) => s.DisciplinasDisponiveis);

	if (disciplinaId === undefined) {
		return null;
	}

	const feita = feitas.has(disciplinaId);
	const disponivel = disponiveis.has(disciplinaId);

	let box =
		"w-full h-full rounded-lg border border-border px-2 py-1.5 text-center text-xs font-semibold flex items-center justify-center leading-tight ";
	if (feita) {
		box += "bg-done text-done-foreground";
	} else if (disponivel) {
		box += "bg-available text-available-foreground";
	} else {
		box += "bg-blocked text-blocked-foreground opacity-60";
	}

	const outTops = handleTops(outDegree);
	const inTops = handleTops(inDegree);

	return (
		<div className={box}>
			{inTops.map((top, index) => (
				<Handle
					key={`in-${index}`}
					id={`in-${index}`}
					type="target"
					position={Position.Left}
					style={{ ...HANDLE_BASE, top: `${top}%` }}
				/>
			))}
			<span>{nome}</span>
			{outTops.map((top, index) => (
				<Handle
					key={`out-${index}`}
					id={`out-${index}`}
					type="source"
					position={Position.Right}
					style={{ ...HANDLE_BASE, top: `${top}%` }}
				/>
			))}
		</div>
	);
}
