import { useEffect } from "react";
import { useAcademicCalendarStore } from "@/features/eventos/eventosStore";
import { useCalendarStore } from "@/features/horario/horarioStore";
import { usePlanejadorStore } from "@/features/planejador/planejadorStore";
import { useDisciplinaStore } from "@/store/disciplinaStore";
import { useProfileStore } from "@/store/profileStore";
import { useUIStore } from "@/store/uiStore";

export default function useProfileCatalogSync() {
	useEffect(() => {
		let timer: ReturnType<typeof setTimeout> | undefined;
		const schedule = () => {
			clearTimeout(timer);
			timer = setTimeout(() => useProfileStore.getState().saveActiveSnapshot(), 400);
		};

		const unsubs = [
			useDisciplinaStore.subscribe(schedule),
			usePlanejadorStore.subscribe(schedule),
			useCalendarStore.subscribe(schedule),
			useAcademicCalendarStore.subscribe(schedule),
			useUIStore.subscribe(schedule),
		];

		const onVisibility = () => {
			if (document.visibilityState === "hidden") {
				useProfileStore.getState().saveActiveSnapshot();
			}
		};
		document.addEventListener("visibilitychange", onVisibility);

		return () => {
			clearTimeout(timer);
			for (const u of unsubs) u();
			document.removeEventListener("visibilitychange", onVisibility);
		};
	}, []);
}
