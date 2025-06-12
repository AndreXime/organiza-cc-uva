import Image from "next/image";
import Header from "../ui/header";
import Link from "next/link";

export default function Sobre() {
  return (
    <div className="px-6 flex flex-col justify-center items-center">
      <Header title="Sobre esse projeto" subtitles={[""]} />
      <div className="text-lg text-gray-800 max-w-[700px] flex gap-4 flex-col">
        <p>
          Este projeto foi desenvolvido por um estudante do próprio curso, utilizando <strong>Next.js</strong>,{" "}
          <strong>React</strong> e <strong>Tailwind CSS</strong>.
        </p>
        <p>
          A ideia surgiu da necessidade recorrente de montar uma tabela no Excel, todo semestre, para verificar se as
          disciplinas tinham conflitos de horário.
        </p>
        <p>
          Os horários e requisitos das disciplinas foram retirados desses dois PDFs:{" "}
          <Link
            href="/assets/Fluxograma Disciplinas(Ciências da computação).pdf"
            className="text-blue-700 underline font-semibold hover:text-blue-900"
          >
            Horarios
          </Link>{" "}
          e{" "}
          <Link
            href="/assets/Lotação das disciplinas por sala 2025.1.pdf"
            className="text-blue-700 underline font-semibold hover:text-blue-900"
          >
            Requisitos
          </Link>
          .
        </p>
        <p>
          Se quiser sugerir alguma melhoria, você pode abrir uma <strong>issue</strong> ou um{" "}
          <strong>pull request</strong> no repositorio do GitHub abaixo.
        </p>
        <Link href={"https://github.com/AndreXime/organiza-cc-uva"} className="flex justify-center">
          <Image src={"/assets/github.svg"} alt="Github logo" height={70} width={70} />
        </Link>
      </div>
    </div>
  );
}
