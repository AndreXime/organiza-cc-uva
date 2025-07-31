interface Horario {
    dia: 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta';
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
}

interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    subtitle: string;
}
