"use client";
import { useEffect } from "react";
import type { ServerData } from "@/data";
import { useAcademicCalendarStore } from "@/features/eventos/eventosStore";
import { useDisciplinaStore } from "@/store/disciplinaStore";

export default function StoreInitializer({ data }: { data: ServerData }) {
	useEffect(() => {
		useDisciplinaStore
			.getState()
			.init({ Disciplinas: data.Disciplinas, DisciplinasEquivalentes: data.DisciplinasEquivalentes });
		useAcademicCalendarStore.getState().init(data.EventosAcademicos);
	}, [data]);

	return null;
}
