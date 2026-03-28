"use client";

import serverData from "virtual:server-data";
import { lazy, Suspense } from "react";
import Modal from "@/components/Modal";
import Popup from "@/components/Popup";
import Tabs from "@/components/Tabs";
import StoreInitializer from "@/store/StoreInitalizer";
import { useUIStore } from "@/store/uiStore";
import LoadingSpinner from "./components/LoadingSpinner";

const Gerenciador = lazy(() => import("@/features/gerenciador/Gerenciador"));
const HorarioManager = lazy(() => import("@/features/horario/Horario"));
const Sobre = lazy(() => import("@/features/sobre/Sobre"));
const FiltroDisciplinas = lazy(() => import("@/features/filtro/Filtrar"));
const Planejador = lazy(() => import("@/features/planejador/Planejador"));
const EventosAcademicos = lazy(() => import("@/features/eventos/Eventos"));

function ActiveTab({ tab }: { tab: string }) {
	switch (tab) {
		case "gerenciador":
			return <Gerenciador />;
		case "horario":
			return <HorarioManager />;
		case "sobre":
			return <Sobre />;
		case "filtro":
			return <FiltroDisciplinas />;
		case "planejador":
			return <Planejador />;
		case "academic-events":
			return <EventosAcademicos />;
		default:
			return null;
	}
}

export default function App() {
	const Tab = useUIStore((state) => state.Tab);
	const mode = useUIStore((state) => state.mode);

	return (
		<main className={`container mx-auto p-4 ${mode !== "minimal" ? "py-8" : "pb-8 pt-0"}`}>
			{mode !== "minimal" && (
				<header className="text-center">
					<h1 className="text-3xl md:text-4xl font-bold text-primary">Gerenciador de Progresso Acadêmico</h1>
					<p className="text-foreground mt-2">
						Para o curso de Ciência da Computação da Universidade Estadual do Vale do Acaraú
					</p>
				</header>
			)}
			<Tabs />

			<main>
				<Suspense
					fallback={
						<div className="w-full flex justify-center items-center pt-20">
							<LoadingSpinner />
						</div>
					}
				>
					<ActiveTab tab={Tab} />
				</Suspense>
			</main>

			<StoreInitializer data={serverData} />
			<Popup />
			<Modal />
		</main>
	);
}
