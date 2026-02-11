/**
 * Como o pdf da coordernação é quase ilegivel por codigo,
 * o melhor jeito de extrair as eventos do calendario academico é usando IA para extrair o texto.
 */
interface rawEvent {
	date: string;
	untilDate?: string; // Para eventos que duram mais de um dia
	event: string;
}

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

const rawEvents: rawEvent[] = [
	// --- ABRIL 2025 ---
	{ date: "2025-04-22", event: "Início do período letivo 2025.1" },
	{
		date: "2025-04-22",
		untilDate: "2025-08-19",
		event:
			"Início do cadastramento on-line das comprovações das ATIVIDADES COMPLEMENTARES pelos alunos (Final: 19/08/2025)",
	},
	{
		date: "2025-04-22",
		untilDate: "2025-05-16",
		event:
			"Início do cadastramento on-line dos GRUPOS DE ESTUDOS referentes ao Período Letivo 2025.1 pelos professores (Final: 16/05/2025)",
	},
	{
		date: "2025-04-22",
		untilDate: "2025-05-10",
		event:
			"Início do cadastramento on-line dos MONITORES referentes ao Período Letivo 2025.1 pelos professores (Final: 10/05/2025)",
	},
	{ date: "2025-04-23", untilDate: "2025-04-26", event: "II Semana de Integração do Curso de Pedagogia Campus Acaraú" },
	{
		date: "2025-04-28",
		untilDate: "2025-05-02",
		event:
			"Solicitação de APROVEITAMENTO DE ESTUDOS para o Período Letivo 2025.1, pelos alunos às Coordenadorias de Cursos",
	},
	{ date: "2025-04-28", untilDate: "2025-05-02", event: "REAJUSTE DE MATRÍCULA on-line para o Período Letivo 2025.1" },
	{ date: "2025-04-30", event: "MATRÍCULA DE RETARDATÁRIOS on-line para o Período Letivo 2025.1" },

	// --- MAIO 2025 ---
	{ date: "2025-05-01", event: "FERIADO NACIONAL - Dia do Trabalhador" },
	{ date: "2025-05-01", event: "I Corrida da Associação Atlética da UVA" },
	{ date: "2025-05-03", event: "Dia do Cientista Político" },
	{ date: "2025-05-06", event: "Dia Nacional da Matemática" },
	{
		date: "2025-05-06",
		untilDate: "2025-05-08",
		event: "SOLENIDADE DE OUTORGA DE GRAU referente ao Período Letivo 2024.2",
	},
	{ date: "2025-05-07", untilDate: "2025-05-09", event: "XIX Semana de Filosofia" },
	{ date: "2025-05-12", event: "Dia do Enfermeiro" },
	{ date: "2025-05-13", event: "Dia do Zootecnista" },
	{ date: "2025-05-16", event: "RESULTADO das solicitações de OUTORGA DE GRAU referente ao Período Letivo 2024.2" },
	{
		date: "2025-05-16",
		event:
			"Término do período de cadastramento on-line dos GRUPOS DE ESTUDOS referentes ao Período Letivo 2024.2 pelos professores",
	},
	{ date: "2025-05-19", event: "Dia do Físico" },
	{ date: "2025-05-19", untilDate: "2025-05-23", event: "Semana de Letras" },
	{ date: "2025-05-20", event: "Dia do Pedagogo" },
	{ date: "2025-05-21", event: "Dia do Profissional de Letras" },
	{ date: "2025-05-21", untilDate: "2025-05-23", event: "Semana de Enfermagem" },
	{
		date: "2025-05-26",
		untilDate: "2025-05-30",
		event:
			"Período de divulgação do RESULTADO das solicitações de APROVEITAMENTO DE ESTUDOS para o Período Letivo 2025.1 pelas Coordenações de Cursos à PROGRAD",
	},
	{
		date: "2025-05-26",
		untilDate: "2025-05-31",
		event: "Solicitação de OUTORGA DE GRAU em período especial referente ao Período Letivo 2024.2",
	},
	{ date: "2025-05-29", event: "Dia do Geógrafo" },

	// --- JUNHO 2025 ---
	{
		date: "2025-06-02",
		untilDate: "2025-06-06",
		event:
			"Solicitação de análise das ATIVIDADES COMPLEMENTARES referente ao Período Letivo 2025.1 pelos alunos às Coordenações de Cursos",
	},
	{
		date: "2025-06-02",
		untilDate: "2025-06-06",
		event: "Solicitação de ABREVIAÇÃO DE DURAÇÃO DE CURSO referente ao Período Letivo 2025.1 pelos alunos à PROGRAD",
	},
	{
		date: "2025-06-09",
		untilDate: "2025-06-13",
		event: "Análise das solicitações de ABREVIAÇÃO DE DURAÇÃO DE CURSO referente ao Período Letivo 2025.1 pela PROGRAD",
	},
	{
		date: "2025-06-16",
		untilDate: "2025-06-20",
		event: "Período de TRANCAMENTO DE DISCIPLINAS do Período Letivo 2025.1",
	},
	{ date: "2025-06-16", untilDate: "2025-06-18", event: "Semana da Química" },
	{ date: "2025-06-18", event: "Dia do Químico" },
	{ date: "2025-06-19", event: "FERIADO NACIONAL - Corpus Christi" },
	{
		date: "2025-06-25",
		event:
			"Último dia para cadastramento no PLANO DE TRABALHO DOCENTE (PTD) das atividades que têm impacto sobre a carga horária do docente no Período Letivo 2025.2",
	},
	{
		date: "2025-06-27",
		event: "RESULTADO das solicitações de OUTORGA DE GRAU em período especial referente ao Período Letivo 2024.2",
	},
	{
		date: "2025-06-30",
		untilDate: "2025-07-25",
		event:
			"Início do cadastramento da OFERTA do Período Letivo 2025.2 pelas Coordenações dos Cursos (Final: 25/07/2025)",
	},

	// --- JULHO 2025 ---
	{
		date: "2025-07-01",
		untilDate: "2025-07-04",
		event:
			"Divulgação do RESULTADO das solicitações de ABREVIAÇÃO DE DURAÇÃO DE CURSO referente ao Período Letivo 2025.1 pelas Coordenações dos Cursos à PROGRAD",
	},
	{ date: "2025-07-03", event: "SOLENIDADE DE OUTORGA DE GRAU em período especial referente ao Período Letivo 2024.2" },
	{ date: "2025-07-05", event: "FERIADO MUNICIPAL EM SOBRAL - Aniversário da cidade" },
	{
		date: "2025-07-07",
		untilDate: "2025-07-11",
		event:
			"Entrega dos resultados das validações das ATIVIDADES COMPLEMENTARES pelas Coordenações dos Cursos à PROGRAD referente ao Período Letivo 2025.1",
	},
	{ date: "2025-07-07", untilDate: "2025-07-11", event: "Congresso Estatuinte" },
	{
		date: "2025-07-14",
		untilDate: "2025-08-23",
		event: "Início do cadastramento on-line, pelos professores, das NOTAS do Período Letivo 2025.1 (Final: 23/08/2025)",
	},
	{ date: "2025-07-18", event: "Divulgação do Edital do PROGRAMA DE MONITORIA para o Período Letivo 2025.2" },
	{
		date: "2025-07-18",
		event: "Divulgação do Edital do PROCESSO SELETIVO ESPECIAL interno para o Período Letivo 2025.2",
	},
	{
		date: "2025-07-25",
		event: "Término do cadastramento da OFERTA para o Período Letivo 2025.2 pelas Coordenações dos Cursos",
	},
	{
		date: "2025-07-28",
		untilDate: "2025-08-15",
		event: "Início da Validação da OFERTA 2025.2 pela PROGRAD (Final: 15/08/2025)",
	},
	{ date: "2025-07-31", event: "FERIADO MUNICIPAL EM ACARAÚ - Aniversário da cidade" },

	// --- AGOSTO 2025 ---
	{
		date: "2025-08-04",
		untilDate: "2025-08-23",
		event: "Solicitação de OUTORGA DE GRAU referente ao Período Letivo 2025.1",
	},
	{ date: "2025-08-11", event: "Dia do Estudante" },
	{ date: "2025-08-11", event: "Dia do Advogado" },
	{ date: "2025-08-11", untilDate: "2025-08-12", event: "I Feira de Profissões do Campus da Ibiapaba" },
	{ date: "2025-08-15", event: "Término da validação da OFERTA do Período Letivo 2025.2 pela PROGRAD" },
	{
		date: "2025-08-19",
		event: "Fim do cadastramento on-line das comprovações das ATIVIDADES COMPLEMENTARES pelos alunos",
	},
	{ date: "2025-08-19", event: "TÉRMINO DO PERÍODO LETIVO 2025.1 (100 dias letivos)" },
	{
		date: "2025-08-20",
		untilDate: "2025-08-30",
		event:
			"Período de cadastro dos Relatórios Finais, referente ao Período Letivo 2025.1 no PLANO DE TRABALHO DOCENTE (PTD)",
	},
	{ date: "2025-08-23", event: "Término do cadastramento on-line das NOTAS do Período Letivo 2025.1" },
	{
		date: "2025-08-30",
		event:
			"Término do período de cadastro on-line das atividades no PLANO DE TRABALHO DOCENTE (PTD) referentes ao Período Letivo 2025.1",
	},

	// --- SETEMBRO 2025 ---
	{
		date: "2025-09-01",
		event:
			"Início do cadastramento on-line das atividades no PLANO DE TRABALHO DOCENTE (PTD) referentes ao Período Letivo 2025.2",
	},
	{
		date: "2025-09-01",
		event: "MATRÍCULA on-line de ALUNOS VETERANOS dos cursos do CCAB e CCET para o Período Letivo 2025.2",
	},
	{
		date: "2025-09-02",
		event: "MATRÍCULA on-line de ALUNOS VETERANOS dos cursos do CCH e CCSA para o Período Letivo 2025.2",
	},
	{
		date: "2025-09-03",
		event: "MATRÍCULA on-line de ALUNOS VETERANOS dos cursos do CENFLE e CCS para o Período Letivo 2025.2",
	},
	{
		date: "2025-09-04",
		untilDate: "2025-09-05",
		event:
			"MATRÍCULA on-line de ALUNOS VETERANOS de TODOS os Centros de Ensino (CCAB, CCET, CCH, CCSA, CENFLE e CCS) para o Período Letivo 2025.2",
	},
	{ date: "2025-09-01", event: "Dia do Profissional de Educação Física" },
	{ date: "2025-09-01", untilDate: "2025-09-04", event: "Semana da Educação Fisica" },
	{ date: "2025-09-03", event: "Dia do Biólogo" },
	{
		date: "2025-09-05",
		event:
			"Término do prazo de entrega dos MAPAS DE NOTAS do Período Letivo 2025.1 pelas Coordenações. Envio via e-mail para o DEG",
	},
	{ date: "2025-09-08", event: "INÍCIO DO SEMESTRE 2025.2" },
	{
		date: "2025-09-08",
		untilDate: "2026-02-24",
		event:
			"Início do cadastramento on-line das comprovações das ATIVIDADES COMPLEMENTARES pelos alunos. (Final: 24/02/2026)",
	},
	{
		date: "2025-09-08",
		untilDate: "2025-10-03",
		event:
			"Início do cadastramento on-line dos GRUPOS DE ESTUDOS referentes ao Período Letivo 2025.2 pelos professores. (Final: 03/10/2025)",
	},
	{
		date: "2025-09-08",
		untilDate: "2025-10-10",
		event:
			"Início do cadastramento on-line dos MONITORES referentes ao Período Letivo 2025.2 pelos professores (Final: 10/10/2025)",
	},
	{ date: "2025-09-09", event: "Dia do Administrador" },
	{ date: "2025-09-15", untilDate: "2025-09-19", event: "REAJUSTE DE MATRÍCULA on-line para o Período Letivo 2025.2" },
	{ date: "2025-09-17", event: "MATRÍCULA DE RETARDATÁRIOS on-line para o Período Letivo 2025.2" },
	{
		date: "2025-09-15",
		untilDate: "2025-09-19",
		event:
			"Solicitação de APROVEITAMENTO DE ESTUDOS para o Período Letivo 2025.2, pelos alunos às Coordenações de Cursos",
	},
	{ date: "2025-09-22", event: "Dia do Contador" },
	{ date: "2025-09-22", untilDate: "2025-09-26", event: "I Semana de Educação do Curso de Pedagogia" },
	{ date: "2025-09-29", event: "FERIADO MUNICIPAL (CAMOCIM) - Aniversário da cidade" },

	// --- OUTUBRO 2025 ---
	{ date: "2025-10-03", event: "RESULTADO das solicitações de OUTORGA DE GRAU referente ao Período Letivo 2025.1" },
	{
		date: "2025-10-03",
		event:
			"Término do período de cadastramento on-line dos GRUPOS DE ESTUDOS referentes ao Período Letivo 2025.2 pelos professores",
	},
	{ date: "2025-10-04", event: "FERIADO MUNICIPAL (CAMOCIM, SÃO BENEDITO) - Dia de São Francisco" },
	{
		date: "2025-10-08",
		untilDate: "2025-10-10",
		event: "II Semana de Agronomia da Universidade Estadual Vale do Acaraú (Semagruva) - Campus Ibiapaba",
	},
	{ date: "2025-10-09", event: "SOLENIDADE DE OUTORGA DE GRAU referente ao Período Letivo 2025.1" },
	{ date: "2025-10-12", event: "FERIADO NACIONAL - Nossa Senhora Aparecida" },
	{
		date: "2025-10-13",
		untilDate: "2025-10-17",
		event:
			"Período de divulgação do RESULTADO das solicitações de APROVEITAMENTO DE ESTUDOS para o Período Letivo 2025.2 pelas Coordenações de Cursos à PROGRAD",
	},
	{
		date: "2025-10-13",
		untilDate: "2025-10-17",
		event: "Solicitação de OUTORGA DE GRAU em período especial referente ao Período Letivo 2025.1",
	},
	{ date: "2025-10-13", untilDate: "2025-10-17", event: "3º Campeonato entre Centros" },
	{ date: "2025-10-14", event: "Evento do Dia do professor Campus Acaraú" },
	{ date: "2025-10-15", event: "Dia do Professor" },
	{ date: "2025-10-19", event: "Dia do Profissional de Informática e de Tecnologia da Informação" },
	{ date: "2025-10-20", untilDate: "2025-10-24", event: "Semana Acadêmica - 57 anos da UVA" },
	{
		date: "2025-10-20",
		untilDate: "2025-10-24",
		event:
			"Período de solicitação de análise das ATIVIDADES COMPLEMENTARES referente ao Período Letivo 2025.2 pelos alunos às Coordenações de Cursos",
	},
	{
		date: "2025-10-20",
		untilDate: "2025-10-24",
		event:
			"Período de solicitação de AFERIÇÃO EXTRAORDINÁRIA DE ESTUDOS referente ao Período Letivo 2025.2 pelos alunos à PROGRAD",
	},
	{ date: "2025-10-23", event: "Aniversário de 57 anos da UVA" },
	{ date: "2025-10-25", event: "Dia do Engenheiro Civil" },
	{
		date: "2025-10-27",
		untilDate: "2025-10-31",
		event:
			"Período de análise das solicitações de AFERIÇÃO EXTRAORDINÁRIA DE ESTUDOS referente ao Período Letivo 2025.2 pela PROGRAD",
	},
	{ date: "2025-10-28", event: "FERIADO NACIONAL - Dia do Servidor Público" },
	{ date: "2025-10-30", untilDate: "2025-10-31", event: "Jornada Gótica" },

	// --- NOVEMBRO 2025 ---
	{ date: "2025-11-02", event: "FERIADO NACIONAL - Dia de Finados" },
	{
		date: "2025-11-03",
		untilDate: "2025-11-07",
		event: "Período de TRANCAMENTO DE DISCIPLINAS do Período Letivo 2025.2",
	},
	{
		date: "2025-11-12",
		event:
			"Último dia para cadastramento no PTD das atividades que têm impacto sobre a carga horária do docente no Período Letivo 2026.1",
	},
	{
		date: "2025-11-14",
		event: "RESULTADO das solicitações de OUTORGA DE GRAU em período especial referente ao Período Letivo 2025.1",
	},
	{ date: "2025-11-15", event: "FERIADO NACIONAL - Proclamação da República" },
	{
		date: "2025-11-17",
		untilDate: "2025-12-12",
		event:
			"Início do período de cadastro da OFERTA do Período Letivo 2026.1 pelas Coordenações dos Cursos. (Até 12/12/2025)",
	},
	{
		date: "2025-11-17",
		untilDate: "2025-11-21",
		event:
			"Período de divulgação do RESULTADO das solicitações de AFERIÇÃO EXTRAORDINÁRIA DE ESTUDOS referente ao Período Letivo 2025.2 pelas Coordenações dos Cursos à PROGRAD",
	},
	{ date: "2025-11-17", untilDate: "2025-11-18", event: "Seminário de Literatura Cearense" },
	{ date: "2025-11-18", untilDate: "2025-11-19", event: "II Workshop da Associação Atlética da UVA" },
	{ date: "2025-11-19", event: "SOLENIDADE DE OUTORGA DE GRAU em período especial referente ao Período Letivo 2025.1" },
	{ date: "2025-11-20", event: "FERIADO NACIONAL - Dia Nacional de Zumbi e da Consciência Negra" },
	{
		date: "2025-11-24",
		untilDate: "2025-11-28",
		event:
			"Entrega dos resultados das validações das ATIVIDADES COMPLEMENTARES pelas Coordenações dos Cursos à PROGRAD referente ao Período Letivo 2025.2",
	},
	{ date: "2025-11-25", event: "FERIADO MUNICIPAL (SÃO BENEDITO) - Emancipação política" },

	// --- DEZEMBRO 2025 ---
	{
		date: "2025-12-01",
		event: "Início do cadastramento on-line, pelos professores, das notas do Período Letivo 2025.2",
	},
	{ date: "2025-12-05", event: "Divulgação do Edital do PROGRAMA DE MONITORIA para o Período Letivo 2026.1" },
	{
		date: "2025-12-05",
		event: "Divulgação do Edital do PROCESSO SELETIVO ESPECIAL interno para o Período Letivo 2026.2",
	},
	{ date: "2025-12-08", event: "FERIADO MUNICIPAL (Sobral, Acaraú, São Benedito) - Imaculada Conceição" },
	{
		date: "2025-12-12",
		event: "Término do cadastramento da OFERTA para o Período Letivo 2025.2 pelas Coordenações dos Cursos",
	},
	{ date: "2025-12-15", event: "Início da Validação da OFERTA 2026.1 pela PROGRAD" },
	{ date: "2025-12-22", untilDate: "2025-12-31", event: "RECESSO NATALINO" },

	// --- JANEIRO 2026 ---
	{ date: "2026-01-02", untilDate: "2026-01-31", event: "FÉRIAS COLETIVAS DOS DOCENTES" },
	{
		date: "2026-01-02",
		untilDate: "2026-01-28",
		event: "Período de solicitação de OUTORGA DE GRAU referente ao Período Letivo 2025.2",
	},

	// --- FEVEREIRO 2026 ---
	{ date: "2026-02-13", event: "Término da validação da OFERTA do Período Letivo 2026.1 pela PROGRAD" },
	{ date: "2026-02-14", untilDate: "2026-02-18", event: "RECESSO DE CARNAVAL" },
	{
		date: "2026-02-24",
		event: "Fim do cadastramento on-line das comprovações das ATIVIDADES COMPLEMENTARES pelos alunos",
	},
	{ date: "2026-02-24", event: "TÉRMINO DO PERÍODO LETIVO 2025.2 (103 dias letivos)" },
	{ date: "2026-02-28", event: "Término do cadastramento on-line das NOTAS do Período Letivo 2025.2" },

	// --- MARÇO 2026 ---
	{
		date: "2026-03-07",
		event:
			"Término do prazo de entrega dos MAPAS DE NOTAS do Período Letivo 2025.2, pelas Coordenações. Envio via e-mail para o DEG",
	},
	{
		date: "2026-03-07",
		event:
			"Período de entrega dos Relatórios Finais, referente ao Período Letivo 2025.2 no PLANO DE TRABALHO DOCENTE (PTD)",
	},
	{
		date: "2026-03-07",
		event:
			"Fim do lançamento on-line das atividades no PLANO DE TRABALHO DOCENTE (PTD) referentes ao Período Letivo 2025.2",
	},
	{
		date: "2026-03-08",
		event:
			"Início do cadastramento on-line das atividades no PLANO DE TRABALHO DOCENTE (PTD) referentes ao Período Letivo 2026.1",
	},
	{
		date: "2026-03-09",
		event: "MATRÍCULA on-line de ALUNOS VETERANOS dos cursos do CCAB e CCET para o Período Letivo 2026.1",
	},
	{
		date: "2026-03-10",
		event: "MATRÍCULA on-line de ALUNOS VETERANOS dos cursos do CCH e CCSA para o Período Letivo 2026.1",
	},
	{
		date: "2026-03-11",
		event: "MATRÍCULA on-line de ALUNOS VETERANOS dos cursos do CENFLE e CCS para o Período Letivo 2026.1",
	},
	{
		date: "2026-03-12",
		untilDate: "2026-03-13",
		event:
			"MATRÍCULA on-line de ALUNOS VETERANOS de TODOS os Centros de Ensino (CCAB, CCET, CCH, CCSA, CENFLE e CCS) para o Período Letivo 2026.1",
	},
	{ date: "2026-03-16", event: "INÍCIO DO SEMESTRE LETIVO 2026.1" },
	{ date: "2026-03-19", event: "FERIADO ESTADUAL - São José" },
	{ date: "2026-03-25", event: "FERIADO ESTADUAL - Data Magna" },
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

export default { metadata, AcademicEvents } as AcademicData;
