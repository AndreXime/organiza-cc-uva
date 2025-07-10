import { DisciplinasType } from '../lib/types';

const Disciplinas: DisciplinasType = {
    periodo1: [
        {
            id: 1,
            nome: 'Lógica de Programação',
            horarios: [
                { dia: 'Segunda', inicio: '14:00', fim: '17:30' },
                { dia: 'Terça', inicio: '14:00', fim: '17:30' },
            ],
        },
        {
            id: 2,
            nome: 'Cálculo I',
            horarios: [
                { dia: 'Segunda', inicio: '08:00', fim: '09:40' },
                { dia: 'Quarta', inicio: '08:00', fim: '11:30' },
            ],
        },
        {
            id: 3,
            nome: 'Lógica Matemática',
            horarios: [
                { dia: 'Terça', inicio: '08:00', fim: '11:30' },
                { dia: 'Quarta', inicio: '14:00', fim: '15:40' },
            ],
        },
        {
            id: 4,
            nome: 'Introdução à Ciência da Computação',
            horarios: [{ dia: 'Quinta', inicio: '08:00', fim: '11:30' }],
        },
        {
            id: 5,
            nome: 'Inglês',
            horarios: [{ dia: 'Sexta', inicio: '08:00', fim: '11:30' }],
        },
    ],

    periodo2: [
        {
            id: 6,
            nome: 'Matemática Discreta',
            horarios: [
                { dia: 'Segunda', inicio: '09:50', fim: '11:30' },
                { dia: 'Quinta', inicio: '08:00', fim: '11:30' },
            ],
            requisitos: [{ id: 3 }],
        },
        {
            id: 7,
            nome: 'Circuitos Digitais',
            horarios: [{ dia: 'Quarta', inicio: '08:00', fim: '11:30' }],
            requisitos: [{ id: 3 }],
        },
        {
            id: 8,
            nome: 'Linguagens de Programação 1',
            horarios: [{ dia: 'Terça', inicio: '08:00', fim: '11:30' }],
            requisitos: [{ id: 1 }],
        },
        {
            id: 9,
            nome: 'Laboratório de Programação',
            horarios: [{ dia: 'Quinta', inicio: '14:00', fim: '17:30' }],
            requisitos: [{ id: 1 }],
        },
        {
            id: 10,
            nome: 'Cálculo II',
            horarios: [
                { dia: 'Segunda', inicio: '14:00', fim: '17:30' },
                { dia: 'Segunda', inicio: '18:30', fim: '20:10' },
            ],
            requisitos: [{ id: 2 }],
        },
        {
            id: 11,
            nome: 'Álgebra Linear',
            horarios: [{ dia: 'Terça', inicio: '18:30', fim: '22:00' }],
        },
    ],

    periodo3: [
        {
            id: 12,
            nome: 'Introdução à Estatística',
            horarios: [{ dia: 'Quinta', inicio: '18:30', fim: '22:00' }],
        },
        {
            id: 13,
            nome: 'Arquitetura de Computadores',
            horarios: [{ dia: 'Segunda', inicio: '08:00', fim: '11:30' }],
            requisitos: [{ id: 7 }],
        },
        {
            id: 14,
            nome: 'Estrutura de Dados',
            horarios: [
                { dia: 'Terça', inicio: '14:00', fim: '17:30' },
                { dia: 'Sexta', inicio: '08:00', fim: '11:30' },
            ],
            requisitos: [{ id: 8 }, { id: 9 }],
        },
        {
            id: 15,
            nome: 'Cálculo Numérico',
            horarios: [{ dia: 'Quinta', inicio: '14:00', fim: '17:30' }],
            requisitos: [{ id: 11 }, { id: 10 }, { id: 9 }],
        },
        {
            id: 16,
            nome: 'Física',
            horarios: [
                { dia: 'Terça', inicio: '20:20', fim: '22:00' },
                { dia: 'Quarta', inicio: '18:30', fim: '22:00' },
            ],
        },
    ],

    periodo4: [
        {
            id: 17,
            nome: 'Estatística Computacional',
            horarios: [{ dia: 'Quarta', inicio: '08:00', fim: '11:30' }],
            requisitos: [{ id: 12 }],
        },
        {
            id: 18,
            nome: 'Banco de Dados I',
            horarios: [
                { dia: 'Terça', inicio: '18:30', fim: '20:10' },
                { dia: 'Quarta', inicio: '18:30', fim: '22:00' },
            ],
            requisitos: [{ id: 14 }],
        },
        {
            id: 19,
            nome: 'Algoritmos para Grafos',
            horarios: [{ dia: 'Segunda', inicio: '08:00', fim: '11:30' }],
            requisitos: [{ id: 6 }, { id: 14 }],
        },
        {
            id: 20,
            nome: 'Programação Orientada a Objetos',
            horarios: [
                { dia: 'Segunda', inicio: '18:30', fim: '22:00' },
                { dia: 'Quarta', inicio: '15:50', fim: '18:20' },
            ],
            requisitos: [{ id: 14 }],
        },
        {
            id: 21,
            nome: 'Tecnologias da Informação',
            horarios: [{ dia: 'Terça', inicio: '18:30', fim: '22:00' }],
            requisitos: [{ id: 4 }],
        },
        {
            id: 22,
            nome: 'Metodologia do Trabalho Científico',
            horarios: [{ dia: 'Segunda', inicio: '18:30', fim: '22:00' }],
        },
    ],

    periodo5: [
        {
            id: 23,
            nome: 'Construção e Análise de Algoritmos',
            horarios: [
                { dia: 'Terça', inicio: '08:00', fim: '11:30' },
                { dia: 'Quinta', inicio: '14:00', fim: '15:40' },
            ],
            requisitos: [{ id: 19 }],
        },
        {
            id: 24,
            nome: 'Engenharia de Software',
            horarios: [{ dia: 'Segunda', inicio: '14:00', fim: '17:30' }],
            requisitos: [{ id: 18 }],
        },
        {
            id: 25,
            nome: 'Banco de Dados II',
            horarios: [
                { dia: 'Terça', inicio: '14:50', fim: '16:40' },
                { dia: 'Quarta', inicio: '08:00', fim: '11:30' },
            ],
            requisitos: [{ id: 18 }, { id: 20 }],
        },
        {
            id: 26,
            nome: 'Computação Gráfica',
            horarios: [{ dia: 'Quinta', inicio: '08:00', fim: '11:30' }],
            requisitos: [{ id: 20 }, { id: 11 }],
        },
    ],

    periodo6: [
        {
            id: 27,
            nome: 'Autômatos',
            horarios: [
                { dia: 'Quarta', inicio: '14:00', fim: '17:30' },
                { dia: 'Quinta', inicio: '15:50', fim: '17:30' },
            ],
            requisitos: [{ id: 6 }],
        },
        {
            id: 28,
            nome: 'Sistemas Operacionais',
            horarios: [
                { dia: 'Segunda', inicio: '18:30', fim: '22:00' },
                { dia: 'Terça', inicio: '18:30', fim: '20:10' },
            ],
            requisitos: [{ id: 13 }],
        },
        {
            id: 29,
            nome: 'Análise e Projeto de Sistemas',
            horarios: [{ dia: 'Sexta', inicio: '14:00', fim: '17:30' }],
            requisitos: [{ id: 24 }],
        },
        {
            id: 30,
            nome: 'Redes de Computadores',
            horarios: [
                { dia: 'Terça', inicio: '20:20', fim: '22:00' },
                { dia: 'Quinta', inicio: '18:30', fim: '22:00' },
            ],
            requisitos: [{ id: 16 }, { id: 13 }],
        },
    ],

    periodo7: [
        {
            id: 31,
            nome: 'Inteligência Artificial',
            horarios: [
                { dia: 'Quarta', inicio: '14:00', fim: '16:40' },
                { dia: 'Quinta', inicio: '14:00', fim: '16:40' },
            ],
            requisitos: [{ id: 3 }, { id: 8 }],
        },
        {
            id: 32,
            nome: 'Compiladores',
            horarios: [
                { dia: 'Terça', inicio: '14:00', fim: '17:30' },
                { dia: 'Terça', inicio: '18:30', fim: '20:10' },
            ],
            requisitos: [{ id: 27 }, { id: 9 }],
        },
        {
            id: 33,
            nome: 'Sistemas Distribuídos',
            horarios: [{ dia: 'Quarta', inicio: '18:30', fim: '22:00' }],
            requisitos: [{ id: 28 }, { id: 30 }],
        },
        {
            id: 34,
            nome: 'Computação e Sociedade',
            horarios: [{ dia: 'Quarta', inicio: '08:00', fim: '11:30' }],
        },
    ],

    periodo8: [
        {
            id: 35,
            nome: 'Administração de Sistemas e Serviços',
            horarios: [{ dia: 'Terça', inicio: '08:00', fim: '11:30' }],
        },
        {
            id: 36,
            nome: 'Laboratório de Desenvolvimento de Software',
            horarios: [{ dia: 'Segunda', inicio: '18:30', fim: '22:00' }],
            requisitos: [{ id: 25 }, { id: 29 }],
        },
        {
            id: 37,
            nome: 'Projeto de Conclusão de Curso TCC',
            requisitos: [{ id: 15 }, { id: 25 }, { id: 23 }, { id: 31 }, { id: 33 }],
        },
    ],
};

export default Disciplinas;
