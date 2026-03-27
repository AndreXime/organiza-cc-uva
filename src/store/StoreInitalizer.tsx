"use client";
import type { ServerData } from "@/data";
import { useAcademicCalendarStore } from "@/features/eventos-academicos/academicCalendarStore";
import { useDisciplinaStore } from "@/store/disciplinaStore";
import { useEffect } from "react";

export default function StoreInitializer({ data }: { data: ServerData }) {
	useEffect(() => {
		useDisciplinaStore
			.getState()
			.init({ Disciplinas: data.Disciplinas, DisciplinasEquivalentes: data.DisciplinasEquivalentes });
		useAcademicCalendarStore.getState().init(data.EventosAcademicos);
	}, [data]);

	return null;
}
