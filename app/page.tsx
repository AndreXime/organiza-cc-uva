"use client";

import EventosAcademicos from "@/features/eventos-academicos/EventosAcademicos";
import FiltroDisciplinas from "@/features/filtro/Filtrar";
import Gerenciador from "@/features/gerenciador/Gerenciador";
import HorarioManager from "@/features/horario/HorarioManager";
import Planejador from "@/features/planejador/Planejador";
import Sobre from "@/features/sobre/SobreProjeto";
import Modal from "@/components/Modal";
import Popup from "@/components/Popup";
import Tabs from "@/components/Tabs";
import { useUIStore } from "@/store/uiStore";

export default function Home() {
	const Tab = useUIStore((state) => state.Tab);
	const mode = useUIStore((state) => state.mode);

	const ActiveTab = () => {
		switch (Tab) {
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
		}
	};

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
				<ActiveTab />
			</main>

			<Popup />
			<Modal />
		</main>
	);
}
