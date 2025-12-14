interface Horario {
	dia: "Segunda" | "Terça" | "Quarta" | "Quinta" | "Sexta";
	inicio: string; // Exemplo: "08:00"
	fim: string; // Exemplo: "10:00"
}

interface Requisito {
	id: number;
}

interface Disciplina {
	id: number;
	nome: string;
	periodo: string;
	requisitos?: Requisito[];
	horarios?: Horario[];
	carga_horaria: number;
	professor?: string;
	equivalentes?: Equivalente[];
}

interface Equivalente {
	nome: string;
	curso: string;
	horarios?: Horario[];
	equivaleId: number;
	equivaleNome: string;
	professor: string;
}

interface CalendarEvent {
	id: number;
	title: string;
	start: Date;
	end: Date;
	subtitle: string[];
}
