import type { Node, NodeProps } from "@xyflow/react";
import type { FluxogramaNodeData } from "../lib/buildFluxogramaGraph";

type PeriodoHeaderFlowNode = Node<FluxogramaNodeData, "periodoHeader">;

export default function PeriodoHeaderNode({ data }: NodeProps<PeriodoHeaderFlowNode>) {
	const label = data.label ?? "";
	return (
		<div className="w-[180px] rounded-md bg-heading/90 text-primary-foreground text-center text-sm font-bold py-2 px-2">
			{label}
		</div>
	);
}
