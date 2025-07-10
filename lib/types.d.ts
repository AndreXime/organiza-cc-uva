export interface Horario {
    dia: 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta';
    inicio: string; // Exemplo: "08:00"
    fim: string; // Exemplo: "10:00"
}

export interface Requisito {
    id: number;
}

export interface DisciplinaSingle {
    id: number;
    nome: string;
    requisitos?: Requisito[];
    horarios?: Horario[];
}

export interface DisciplinasType {
    [key: string]: DisciplinaSingle[];
}

export type DisciplinaComPeriodo = DisciplinaSingle & { periodo: string };

export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    subtitle: string;
}
