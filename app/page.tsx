"use client";

import { useData } from "@/context/DataContext";
import Gerenciador from "@/components/core/Gerenciador";
import HorarioManager from "@/components/core/HorarioManager";
import Sobre from "@/components/core/SobreProjeto";
import TabelaDisciplinas from "@/components/core/TabelaDisciplinas";
import Tabs from "@/components/ui/Tabs";

export default function Home() {
  const { Tab } = useData();

  const ActiveTab = () => {
    switch (Tab) {
      case "disciplinas":
        return <TabelaDisciplinas />;
      case "gerenciador":
        return <Gerenciador />;
      case "horario":
        return <HorarioManager />;
      case "sobre":
        return <Sobre />;
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <nav className="flex flex-col gap-6 justify-center items-center py-7 px-2 mb-6 bg-blue-500">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-white">
          Disciplinas de Ciencias da Computação UVA
        </h1>
        <Tabs />
      </nav>

      <section>
        <ActiveTab />
      </section>
    </main>
  );
}
