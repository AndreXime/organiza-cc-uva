/**
 * Como o pdf da coordernação é quase ilegivel por codigo,
 * o melhor jeito de extrair as eventos do calendario academico é usando IA para extrair o texto.
 */
interface rawEvent {
	date: string;
	untilDate?: string; // Para eventos que duram mais de um dia
	event: string;
}

const semesterDates: Record<string, { start: Date; end: Date }> = {
	"2026.1": {
		start: new Date("2026-03-30"),
		end: new Date("2026-07-31"),
	},
};

/**
Prompt para extrair os dados do pdf

Eu preciso que você extraia as datas do calendário acadêmico nesse PDF, comece na data do começo do semestre, deixe a string event igual do pdf sem [cite 97] ou algo assim, você deve organizar igual o exemplo abaixo para um array typescript
interface rawEvent {
	date: string;
	untilDate?: string; // Para eventos que duram mais de um dia
	event: string;
}

const rawEvents: rawEvent[] = [
    // --- ABRIL 2025 ---
    { date: "2025-04-22", event: "Início do período letivo 2025.1" },
    {
        date: "2025-04-22",
        untilDate: "2025-08-19",
        event: "Início do cadastramento on-line das comprovações das ATIVIDADES COMPLEMENTARES pelos alunos (Final: 19/08/2025)",
    },
]

E escreva esse pequeno metadata contendo o começo e final dos 2 semestres do pdf
// Começo e final do 2 semestres
const metadata: { [key: string]: { start: Date; end: Date } } = {
	"2025.1": {
		start: new Date("2025-04-22"),
		end: new Date("2025-08-19"),
	},
	"2025.2": {
		start: new Date("2025-09-08"),
		end: new Date("2026-02-24"),
	},
};
*/

const rawEvents: rawEvent[] = [
	// --- MARÇO 2026 ---
	{ date: "2026-03-30", event: "INÍCIO DO SEMESTRE LETIVO 2026.1" }, // [cite: 52]
	{
		date: "2026-03-30",
		untilDate: "2026-07-31",
		event:
			"Início do cadastramento on-line das comprovações das ATIVIDADES COMPLEMENTARES pelos alunos. (Término: 31/07/2026)",
	}, // [cite: 52]
	{
		date: "2026-03-30",
		untilDate: "2026-04-24",
		event:
			"Início do periodo de cadastramento on-line dos GRUPOS DE ESTUDOS referentes ao Semestre Letivo 2026.1 pelos docentes. (Término: 24/04/2026)",
	}, // [cite: 52]
	{
		date: "2026-03-30",
		untilDate: "2026-04-07",
		event:
			"Início do cadastramento on-line dos MONITORES referentes ao Semestre Letivo 2026.1 pelos docentes. (Término: 07/04/2026)",
	}, // [cite: 52]
	{
		date: "2026-03-30",
		untilDate: "2026-04-10",
		event:
			"Início da solicitação de APROVEITAMENTO DE ESTUDOS para o Semestre Letivo 2026.1, pelos alunos às Coordenações de Cursos. (Término: 10/04/2026)",
	}, // [cite: 52]

	// --- ABRIL 2026 ---
	{ date: "2026-04-03", event: "FERIADO NACIONAL - Sexta-feira Santa" }, // [cite: 52]
	{ date: "2026-04-04", event: "RECESSO ACADÊMICO – Sábado Santo" }, // [cite: 52]
	{ date: "2026-04-06", untilDate: "2026-04-10", event: "REAJUSTE DE MATRÍCULA on-line para o Semestre Letivo 2026.1" }, // [cite: 52, 56]
	{
		date: "2026-04-07",
		event:
			"Término do período de cadastramento on-line de MONITORES VOLUNTÁRIOS referentes ao Semestre Letivo 2026.1 pelos docentes.",
	}, // [cite: 56]
	{ date: "2026-04-08", event: "MATRÍCULA DE RETARDATÁRIOS on-line para o Semestre Letivo 2026.1 (único dia)." }, // [cite: 56]
	{
		date: "2026-04-10",
		event: "Prazo final para o RESULTADO das solicitações de OUTORGA DE GRAU referente ao Semestre Letivo 2025.2.",
	}, // [cite: 56]
	{ date: "2026-04-16", event: "SOLENIDADE DE OUTORGA DE GRAU referente ao Semestre Letivo 2025.2." }, // [cite: 56]
	{ date: "2026-04-16", untilDate: "2026-04-17", event: "I Feira Literária Infantil - Campus Ibiapaba" }, // [cite: 56]
	{
		date: "2026-04-17",
		untilDate: "2026-04-24",
		event:
			"Período de solicitação de DIPLOMA (via Sistema de Requerimento Online) pelos estudantes concluintes do Semestre Letivo 2025.2, na outorga regular.",
	}, // [cite: 56]
	{
		date: "2026-04-20",
		untilDate: "2026-04-24",
		event: "Período de solicitação de OUTORGA DE GRAU em período especial referente ao Semestre Letivo 2025.2.",
	}, // [cite: 56]
	{ date: "2026-04-21", event: "FERIADO NACIONAL - Tiradentes" }, // [cite: 56]
	{
		date: "2026-04-24",
		event:
			"Término do período de cadastramento on-line dos GRUPOS DE ESTUDOS referentes ao Semestre Letivo 2026.1 pelos docentes.",
	}, // [cite: 56]
	{
		date: "2026-04-28",
		untilDate: "2026-04-29",
		event: "I Seminário do Grupo de Pesquisa EDUCAS/UVA- Campus Ibiapaba",
	}, // [cite: 56]

	// --- MAIO 2026 ---
	{ date: "2026-05-01", event: "FERIADO NACIONAL - Dia do Trabalhador" }, // [cite: 56]
	{
		date: "2026-05-04",
		untilDate: "2026-05-08",
		event:
			"Período de tramitação via Sistema de Requerimento Online (SRO) das solicitações de APROVEITAMENTO DE ESTUDOS para o semestre 2026.1 pelas coordenações de Cursos à PROGRAD",
	}, // [cite: 56]
	{
		date: "2026-05-04",
		untilDate: "2026-05-08",
		event:
			"Período de solicitação de remanejamento temporário para o Semestre Letivo 2026.2 no Sistema de Protocolo da UVA, por meio de abertura de processo no Sistema Único de Tramitação Eletrônica (SUITE) pelo docente. Referência: Resolução 10/2024 (CONSUNI)",
	}, // [cite: 56]
	{ date: "2026-05-06", event: "Dia Nacional da Matemática" }, // [cite: 56]
	{
		date: "2026-05-11",
		untilDate: "2026-05-15",
		event:
			"Período de solicitação de ABREVIAÇÃO DE DURAÇÃO DE CURSO referente ao Semestre Letivo 2026.1, pelos alunos, à PROGRAD.",
	}, // [cite: 56]
	{ date: "2026-05-12", untilDate: "2026-05-13", event: "Simpósio de Aquicultura Sustentável - Campus Camocim" }, // [cite: 68]
	{ date: "2026-05-13", event: "FERIADO MUNICIPAL - São Benedito - Nossa Senhora de Fátima" }, // [cite: 68]
	{
		date: "2026-05-18",
		untilDate: "2026-05-22",
		event:
			"Período de análise das solicitações de ABREVIAÇÃO DE DURAÇÃO DE CURSO referente ao Semestre Letivo 2026.1 pela PROGRAD.",
	}, // [cite: 68]
	{ date: "2026-05-19", event: "Dia do Físico" }, // [cite: 68]
	{ date: "2026-05-19", untilDate: "2026-05-22", event: "XIV Semana da Enfermagem" }, // [cite: 68]
	{ date: "2026-05-21", event: "Dia da planta medicinal" }, // [cite: 68]
	{
		date: "2026-05-22",
		event:
			"Prazo final para o RESULTADO das solicitações de OUTORGA DE GRAU em período especial referente ao Semestre Letivo 2025.2.",
	}, // [cite: 68]
	{
		date: "2026-05-25",
		untilDate: "2026-05-29",
		event: "Período de TRANCAMENTO ON-LINE DE DISCIPLINAS do Semestre Letivo 2026.1 pelos alunos.",
	}, // [cite: 68]
	{ date: "2026-05-25", untilDate: "2026-05-29", event: "XXII Semana do Curso de Letras" }, // [cite: 68]
	{
		date: "2026-05-28",
		event: "SOLENIDADE DE OUTORGA DE GRAU em período especial referente ao Semestre Letivo 2025.2.",
	}, // [cite: 68]

	// --- JUNHO 2026 ---
	{
		date: "2026-06-03",
		event:
			"[PTD] Último dia para cadastro de atividades através do sistema acadêmico, pelo docente, que importem em diminuição de carga horária de ensino no Semestre Letivo 2026.2.",
	}, // [cite: 68]
	{
		date: "2026-06-03",
		event:
			"Último dia para envio de Portarias de remanejamento de docentes intercampi pela PROGEP à PROGRAD. Referência: Resolução 10/2024 - CONSUNI.",
	}, // [cite: 68]
	{ date: "2026-06-04", event: "FERIADO NACIONAL - Corpus Christi" }, // [cite: 68]
	{
		date: "2026-06-08",
		untilDate: "2026-07-03",
		event:
			"Início do período de cadastro da OFERTA do Semestre Letivo 2026.2 pelas Coordenações dos Cursos. (Término: 03/07/2026)",
	}, // [cite: 79]
	{
		date: "2026-06-08",
		untilDate: "2026-06-12",
		event:
			"Período de divulgação do RESULTADO das solicitações de ABREVIAÇÃO DE DURAÇÃO DE CURSO referente ao Semestre Letivo 2026.1 pelas Coordenações dos Cursos à PROGRAD.",
	}, // [cite: 79]
	{
		date: "2026-06-13",
		untilDate: "2026-06-15",
		event: "Jornada de Pesquisa e Iniciação Científica em Recursos Pesqueiros - Campus Camocim",
	}, // [cite: 79]
	{ date: "2026-06-16", untilDate: "2026-06-19", event: "XII Semana de Química" }, // [cite: 79]
	{
		date: "2026-06-22",
		untilDate: "2026-08-06",
		event:
			"Início do período de cadastramento on-line, pelos docentes, das NOTAS do Semestre Letivo 2026.1. (Término: 06/08/2026)",
	}, // [cite: 79]
	{ date: "2026-06-26", event: "Divulgação do Edital do PROGRAMA DE MONITORIA para o Semestre Letivo 2026.2." }, // [cite: 79]
	{
		date: "2026-06-26",
		event: "Divulgação do Edital do PROCESSO SELETIVO ESPECIAL interno para o Semestre Letivo 2026.2.",
	}, // [cite: 79]
	{
		date: "2026-06-29",
		untilDate: "2026-07-03",
		event:
			"Início do período de solicitação de análise das ATIVIDADES COMPLEMENTARES referente ao Semestre Letivo 2026.1 pelos alunos às Coordenações de seus respectivos Cursos. (Término: 03/07/2026)",
	}, // [cite: 79]

	// --- JULHO 2026 ---
	{
		date: "2026-07-03",
		event: "Término do cadastramento da OFERTA para o Semestre Letivo 2026.2 pelas Coordenações dos Cursos.",
	}, // [cite: 79]
	{ date: "2026-07-05", event: "FERIADO MUNICIPAL - Aniversário de Sobral" }, // [cite: 79]
	{
		date: "2026-07-06",
		untilDate: "2026-07-24",
		event: "Início da validação da OFERTA 2026.2 pela PROGRAD (Término: 24/07/2026).",
	}, // [cite: 79]
	{
		date: "2026-07-13",
		untilDate: "2026-08-07",
		event:
			"Início do período de solicitação de OUTORGA DE GRAU pelos estudantes referente ao Semestre Letivo 2026.1. (Término: 07/08/2026)",
	}, // [cite: 79]
	{
		date: "2026-07-13",
		untilDate: "2026-07-17",
		event:
			"Período de envio pelas Coordenações dos Cursos à PROGRAD da listagem de alunos com as ATIVIDADES COMPLEMENTARES concluídas, referentes ao Semestre Letivo 2026.1.",
	}, // [cite: 79]
	{ date: "2026-07-25", event: "Término da validação da OFERTA do Semestre Letivo 2026.2 pela PROGRAD." }, // [cite: 79]
	{
		date: "2026-07-27",
		untilDate: "2026-08-06",
		event:
			"[PTD] Início do período de cadastro dos Relatórios Finais, referente ao Semestre Letivo 2026.1 no PLANO DE TRABALHO DOCENTE (PTD), pelos docentes. (Término: 06/08/2026)",
	}, // [cite: 79]
	{
		date: "2026-07-31",
		event: "Término do período de cadastramento on-line das comprovações das ATIVIDADES COMPLEMENTARES, pelos alunos.",
	}, // [cite: 89]
	{
		date: "2026-07-31",
		event:
			"[PTD] Término do período de cadastro on-line das atividades no PLANO DE TRABALHO DOCENTE (PTD) referentes ao Semestre Letivo 2026.1, pelos docentes.",
	}, // [cite: 89]
	{ date: "2026-07-31", event: "TÉRMINO DO SEMESTRE LETIVO 2026.1" }, // [cite: 89]

	// --- AGOSTO 2026 ---
	{
		date: "2026-08-03",
		event:
			"[PTD] Início do cadastramento on-line das atividades no PLANO DE TRABALHO DOCENTE (PTD) referentes ao Semestre Letivo 2026.2, pelos docentes.",
	}, // [cite: 89]
	{
		date: "2026-08-06",
		event: "Término do cadastramento on-line das NOTAS do Semestre Letivo 2026.1, pelos docentes.",
	}, // [cite: 89]
	{
		date: "2026-08-07",
		event:
			"Fim do período de solicitação on-line de OUTORGA DE GRAU referente ao Semestre Letivo 2026.1, pelos estudantes.",
	}, // [cite: 89]
	{ date: "2026-08-11", event: "Dia do Estudante" }, // [cite: 89]
	{
		date: "2026-08-15",
		event:
			"Término do prazo de entrega dos MAPAS DE NOTAS do Período Letivo 2026.1, pelas Coordenações. Envio via e-mail para o DEG (deg@uvanet.br)",
	}, // [cite: 89]
];

const AcademicEvents: AcademicEvent[] = rawEvents.map((item) => {
	const [y, m, d] = item.date.split("-").map(Number);
	const startDate = new Date(y, m - 1, d);

	let endDate: Date | undefined;
	if (item.untilDate) {
		const [uy, um, ud] = item.untilDate.split("-").map(Number);
		endDate = new Date(uy, um - 1, ud);
	}

	return {
		date: startDate,
		event: item.event,
		...(endDate && { untilDate: endDate }),
	};
});

export { AcademicEvents, semesterDates };
