import { useCallback } from "react";
import { applySnapshot, captureSnapshot, isValidSnapshot } from "@/lib/profileSnapshot";
import { useUIStore } from "@/store/uiStore";

function downloadJson(filename: string, data: unknown) {
	const json = JSON.stringify(data, null, 2);
	const blob = new Blob([json], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	try {
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	} finally {
		URL.revokeObjectURL(url);
	}
}

export default function useProfileSync() {
	const exportProfile = useCallback(() => {
		const { setMessage } = useUIStore.getState();
		const snapshot = captureSnapshot();
		downloadJson("organiza-cc-uva.perfil.json", snapshot);
		setMessage("Perfil exportado com sucesso.");
	}, []);

	const importProfile = useCallback((data: string) => {
		const { setMessage } = useUIStore.getState();

		let parsed: unknown;
		try {
			parsed = JSON.parse(data) as unknown;
		} catch {
			setMessage("Arquivo inválido: não foi possível ler o JSON.");
			return;
		}

		if (!isValidSnapshot(parsed)) {
			setMessage("Arquivo inválido: formato inesperado.");
			return;
		}

		applySnapshot(parsed);
		setMessage("Perfil importado com sucesso.");
	}, []);

	return { exportProfile, importProfile };
}
